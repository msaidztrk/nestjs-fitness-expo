import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { BaseOpenRouterService, OpenRouterProviderConfig } from './base-openrouter.service';
import { CreateVisionChatDto } from '../dto/create-vision-chat.dto';
import { AiChatResponseDto } from '../dto/ai-chat-response.dto';
import { GEMINI_CONFIG, GEMINI_ENV_KEY } from '../constants/gemini.constants';
import { AiApiException } from '../exceptions/ai.exceptions';
import { AI_ERROR_MESSAGES } from '../constants/ai.constants';

interface VisionContentPart {
    readonly type: 'text' | 'image_url';
    readonly text?: string;
    readonly image_url?: {
        readonly url: string;
    };
}

@Injectable()
export class GeminiVisionService extends BaseOpenRouterService {
    protected readonly logger = new Logger(GeminiVisionService.name);
    protected readonly providerName = 'Gemini Vision';

    constructor(
        configService: ConfigService,
        httpService: HttpService,
    ) {
        super(configService, httpService);
    }

    async analyzeImage(visionChatDto: CreateVisionChatDto): Promise<AiChatResponseDto> {
        try {
            const apiKey = this.getApiKey();
            const imageUrl = this.resolveImageUrl(visionChatDto);
            const aiResponse = await this.sendVisionRequest(visionChatDto.prompt, imageUrl, apiKey);

            this.logSuccess({
                userName: visionChatDto.userContext?.name || 'Anonymous',
                promptPreview: visionChatDto.prompt.substring(0, 50),
            });

            return AiChatResponseDto.createSuccess(aiResponse);
        } catch (error) {
            return this.handleError(error);
        }
    }

    protected getApiKeyEnvName(): string {
        return GEMINI_ENV_KEY;
    }

    protected getProviderConfig(): OpenRouterProviderConfig {
        return {
            apiUrl: GEMINI_CONFIG.API_URL,
            model: GEMINI_CONFIG.MODEL,
            timeout: GEMINI_CONFIG.REQUEST_TIMEOUT,
            httpReferer: GEMINI_CONFIG.HTTP_REFERER,
            siteTitle: GEMINI_CONFIG.SITE_TITLE,
        };
    }

    private resolveImageUrl(visionChatDto: CreateVisionChatDto): string {
        const { image } = visionChatDto;

        if (image.base64) {
            if (image.base64.startsWith('data:')) {
                return image.base64;
            }
            return `data:image/jpeg;base64,${image.base64}`;
        }

        if (image.url) {
            return image.url;
        }

        throw new AiApiException(AI_ERROR_MESSAGES.IMAGE_REQUIRED);
    }

    private async sendVisionRequest(
        prompt: string,
        imageUrl: string,
        apiKey: string,
    ): Promise<string> {
        const contentParts: VisionContentPart[] = [
            {
                type: 'text',
                text: prompt,
            },
            {
                type: 'image_url',
                image_url: {
                    url: imageUrl,
                },
            },
        ];

        const payload = {
            model: GEMINI_CONFIG.MODEL,
            messages: [
                {
                    role: 'user',
                    content: contentParts,
                },
            ],
        };

        this.logger.debug('Preparing Gemini Vision request', {
            promptLength: prompt.length,
            hasImage: true,
        });

        return this.sendRequest(payload, apiKey);
    }
}
