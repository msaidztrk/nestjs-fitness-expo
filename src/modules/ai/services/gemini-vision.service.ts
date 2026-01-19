import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import sharp from 'sharp';

import { CreateVisionChatDto } from '../dto/create-vision-chat.dto';
import { AiChatResponseDto } from '../dto/ai-chat-response.dto';
import { GEMINI_CONFIG, GEMINI_API_KEYS } from '../constants/gemini.constants';
import { AI_ERROR_MESSAGES } from '../constants/ai.constants';

interface GoogleGeminiResponse {
    candidates?: Array<{
        content?: {
            parts?: Array<{
                text?: string;
            }>;
        };
        finishReason?: string;
    }>;
    error?: {
        code: number;
        message: string;
        status: string;
    };
}

@Injectable()
export class GeminiVisionService {
    private readonly logger = new Logger(GeminiVisionService.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) { }

    async analyzeImage(visionChatDto: CreateVisionChatDto): Promise<AiChatResponseDto> {
        this.logger.log('analyzeImage called', { prompt: visionChatDto.prompt?.substring(0, 30) });

        // Debug: Write received DTO to file
        try {
            const fs = require('fs');
            fs.writeFileSync('last_request_body.json', JSON.stringify({
                timestamp: new Date().toISOString(),
                image: {
                    base64_start: visionChatDto.image?.base64?.substring(0, 50),
                    base64_length: visionChatDto.image?.base64?.length,
                    is_placeholder: visionChatDto.image?.base64?.includes('[BASE64_DATA')
                }
            }, null, 2));
        } catch (e) { console.error('Failed to log request', e); }

        const availableKeys = this.getAvailableApiKeys();

        if (availableKeys.length === 0) {
            this.logger.error('No Google API keys configured');
            return AiChatResponseDto.createError(AI_ERROR_MESSAGES.GEMINI_API_KEY_MISSING);
        }

        let lastError = '';

        for (let i = 0; i < availableKeys.length; i++) {
            const keyName = GEMINI_API_KEYS[availableKeys[i].index];
            this.logger.debug(`Trying API key ${i + 1}/${availableKeys.length}: ${keyName}`);

            const result = await this.tryRequest(visionChatDto, availableKeys[i].key);

            if (result.success && result.message) {
                this.logger.log(`Success with key ${keyName}`);
                return AiChatResponseDto.createSuccess(result.message);
            }

            lastError = result.error || 'Unknown error';

            if (result.isRateLimit) {
                this.logger.warn(`Rate limit hit on ${keyName}, trying next key...`);
                continue;
            }

            this.logger.error(`Error with ${keyName}: ${result.error}`);
            return AiChatResponseDto.createError(result.error || 'Unknown error');
        }

        return AiChatResponseDto.createError(lastError || AI_ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
    }

    private getAvailableApiKeys(): Array<{ key: string; index: number }> {
        const keys: Array<{ key: string; index: number }> = [];

        for (let i = 0; i < GEMINI_API_KEYS.length; i++) {
            const key = this.configService.get<string>(GEMINI_API_KEYS[i]);
            if (key) {
                keys.push({ key, index: i });
            }
        }

        return keys;
    }

    private async tryRequest(visionChatDto: CreateVisionChatDto, apiKey: string): Promise<{
        success: boolean;
        message?: string;
        error?: string;
        isRateLimit: boolean;
    }> {
        try {
            const { base64, mimeType } = await this.resolveImageUrl(visionChatDto);

            // Google API uses a specific format for content generation
            // https://ai.google.dev/tutorials/rest_quickstart#text-and-image_input
            const url = `${GEMINI_CONFIG.API_URL}/${GEMINI_CONFIG.MODEL}:generateContent?key=${apiKey}`;

            const payload = {
                contents: [
                    {
                        parts: [
                            { text: visionChatDto.prompt },
                            {
                                inline_data: {
                                    mime_type: mimeType,
                                    data: base64
                                }
                            }
                        ]
                    }
                ],
                generationConfig: {
                    // temperature: 0.4,
                    // topK: 32,
                    // topP: 1,
                    // maxOutputTokens: 4096,
                }
            };

            const response = await firstValueFrom(
                this.httpService.post<GoogleGeminiResponse>(
                    url,
                    payload,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        timeout: GEMINI_CONFIG.REQUEST_TIMEOUT,
                    },
                ),
            );

            this.logger.debug('Google Gemini response received', {
                status: response.status,
                hasCandidates: !!response.data.candidates?.length
            });

            // Extract text from Google API response
            const parts = response.data.candidates?.[0]?.content?.parts;
            const messageContent = parts?.map(part => part.text).join('') || '';

            if (!messageContent) {
                this.logger.error('Empty response from Google API', { data: JSON.stringify(response.data) });
                return { success: false, error: AI_ERROR_MESSAGES.INVALID_RESPONSE, isRateLimit: false };
            }

            return { success: true, message: messageContent, isRateLimit: false };
        } catch (error) {
            if (error instanceof AxiosError) {
                const status = error.response?.status;
                const fullErrorData = error.response?.data;

                console.log('========== GOOGLE GEMINI ERROR ==========');
                console.log('Status:', status);
                console.log('Data:', JSON.stringify(fullErrorData, null, 2));
                console.log('=======================================');

                // Write to file for debugging
                try {
                    const fs = require('fs');
                    fs.writeFileSync('google_api_error.json', JSON.stringify({ // Different file for Google
                        timestamp: new Date().toISOString(),
                        status,
                        data: fullErrorData
                    }, null, 2));
                } catch (fsError) {
                    console.error('Failed to write error log file', fsError);
                }

                this.logger.error('Google Gemini API Error:', {
                    status,
                    data: JSON.stringify(fullErrorData, null, 2),
                });

                const errorMessage = fullErrorData?.error?.message || error.message;

                if (status === 429) {
                    return { success: false, error: errorMessage, isRateLimit: true };
                }

                return { success: false, error: `${AI_ERROR_MESSAGES.API_REQUEST_FAILED}: ${errorMessage}`, isRateLimit: false };
            }

            console.log('========== UNKNOWN ERROR ==========');
            console.log('Error:', error);
            console.log('====================================');

            const errMsg = error instanceof Error ? error.message : String(error);
            this.logger.error('Unknown error:', { error: errMsg });
            return { success: false, error: errMsg, isRateLimit: false };
        }
    }

    private async resolveImageUrl(visionChatDto: CreateVisionChatDto): Promise<{ base64: string, mimeType: string }> {
        const { image } = visionChatDto;

        if (!image) {
            throw new Error(AI_ERROR_MESSAGES.IMAGE_REQUIRED);
        }

        if (image.base64) {
            let base64Data = image.base64;
            let mimeType = 'image/jpeg';

            // Check for placeholder strings often found in logs
            if (base64Data.includes('[BASE64_DATA') || base64Data.length < 100) {
                this.logger.error('Received invalid base64 data (looks like a log placeholder)');
                throw new Error('Invalid image data: Received log placeholder instead of actual base64 data');
            }

            if (base64Data.startsWith('data:')) {
                const match = base64Data.match(/^data:([^;]+);base64,(.+)$/);
                if (match) {
                    mimeType = match[1];
                    base64Data = match[2];
                }
            }

            const sizeInBytes = (base64Data.length * 3) / 4;
            const sizeInKB = sizeInBytes / 1024;

            this.logger.debug(`Original image size: ${sizeInKB.toFixed(2)} KB`);

            if (sizeInKB > 300) {
                this.logger.log(`Compressing image from ${sizeInKB.toFixed(2)} KB...`);

                try {
                    const inputBuffer = Buffer.from(base64Data, 'base64');

                    const compressedBuffer = await sharp(inputBuffer)
                        .resize(800, 800, {
                            fit: 'inside',
                            withoutEnlargement: true
                        })
                        .jpeg({ quality: 70 })
                        .toBuffer();

                    base64Data = compressedBuffer.toString('base64');
                    mimeType = 'image/jpeg';

                    const newSizeKB = (compressedBuffer.length / 1024);
                    this.logger.log(`Compressed image to ${newSizeKB.toFixed(2)} KB`);
                } catch (err) {
                    this.logger.error('Image compression failed:', err);
                }
            }

            return { base64: base64Data, mimeType };
        }

        // URL support is tricky with Google API (requires uploading first or using file API), 
        // so for now we only support base64 primarily for this implementation or throw error if URL is passed
        // Or we could fetch the URL and convert to Base64 (not implemented here to keep it simple)
        if (image.url) {
            throw new Error("Direct URL specific support is not implemented for Google API direct mode. Please use base64.");
        }

        throw new Error(AI_ERROR_MESSAGES.IMAGE_REQUIRED);
    }
}
