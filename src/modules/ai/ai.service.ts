import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

import { IAiService } from './interfaces/ai-service.interface';
import { ChatMessageDto, UserContextDto } from './dto/create-chat.dto';
import { AiChatResponseDto } from './dto/ai-chat-response.dto';
import { OPEN_ROUTER_CONFIG, AI_ERROR_MESSAGES, AI_ENV_KEYS } from './constants/ai.constants';
import { AiApiException, AiConfigurationException, AiRateLimitException } from './exceptions/ai.exceptions';


interface OpenRouterResponse {
    readonly choices: ReadonlyArray<{
        readonly message: {
            readonly role: string;
            readonly content: string;
        };
    }>;
}


@Injectable()
export class AiService implements IAiService {
    private readonly logger = new Logger(AiService.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) { }

    async processChat(
        messages: ChatMessageDto[],
        userContext?: UserContextDto,
    ): Promise<AiChatResponseDto> {
        try {
            const apiKey = this.getApiKey();
            const aiResponse = await this.sendToOpenRouter(messages, apiKey);

            this.logSuccessfulRequest(userContext);

            return AiChatResponseDto.createSuccess(aiResponse);
        } catch (error) {
            return this.handleError(error);
        }
    }

    private getApiKey(): string {
        const apiKey = this.configService.get<string>(AI_ENV_KEYS.OPEN_ROUTER_API_KEY);

        if (!apiKey) {
            this.logger.error('OpenRouter API key is not configured');
            throw new AiConfigurationException(AI_ERROR_MESSAGES.API_KEY_MISSING);
        }

        return apiKey;
    }

    private async sendToOpenRouter(
        messages: ChatMessageDto[],
        apiKey: string,
    ): Promise<string> {
        const payload = {
            model: OPEN_ROUTER_CONFIG.DEFAULT_MODEL,
            messages: messages.map(msg => ({
                role: msg.role,
                content: msg.content,
            })),
        };

        const headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://fittrack-pro.app',
            'X-Title': 'FitTrack Pro',
        };

        this.logger.debug('Sending request to OpenRouter', {
            model: payload.model,
            messageCount: messages.length,
        });

        const response = await firstValueFrom(
            this.httpService.post<OpenRouterResponse>(
                OPEN_ROUTER_CONFIG.API_URL,
                payload,
                {
                    headers,
                    timeout: OPEN_ROUTER_CONFIG.REQUEST_TIMEOUT,
                },
            ),
        );

        const content = response.data.choices[0]?.message?.content;

        if (!content) {
            throw new AiApiException(AI_ERROR_MESSAGES.INVALID_RESPONSE);
        }

        return content;
    }

    private handleError(error: unknown): AiChatResponseDto {
        if (error instanceof AiConfigurationException) {
            this.logger.error('AI Configuration Error', error.message);
            return AiChatResponseDto.createError(AI_ERROR_MESSAGES.API_KEY_MISSING);
        }

        if (this.isRateLimitError(error)) {
            this.logger.warn('Rate limit exceeded');
            return AiChatResponseDto.createError(AI_ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
        }

        if (error instanceof AxiosError) {
            const errorMessage = error.response?.data?.error?.message || error.message;
            this.logger.error('OpenRouter API Error', {
                status: error.response?.status,
                message: errorMessage,
            });
            return AiChatResponseDto.createError(`${AI_ERROR_MESSAGES.API_REQUEST_FAILED}: ${errorMessage}`);
        }

        const unknownError = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error('Unexpected error in AI service', unknownError);
        return AiChatResponseDto.createError(AI_ERROR_MESSAGES.API_REQUEST_FAILED);
    }

    private isRateLimitError(error: unknown): boolean {
        if (error instanceof AxiosError) {
            return error.response?.status === 429;
        }
        return error instanceof AiRateLimitException;
    }

    private logSuccessfulRequest(userContext?: UserContextDto): void {
        this.logger.log('AI chat request completed successfully', {
            userName: userContext?.name || 'Anonymous',
        });
    }
}
