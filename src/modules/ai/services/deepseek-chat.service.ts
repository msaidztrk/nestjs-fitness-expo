import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { BaseOpenRouterService, OpenRouterProviderConfig } from './base-openrouter.service';
import { ChatMessageDto, UserContextDto } from '../dto/create-chat.dto';
import { AiChatResponseDto } from '../dto/ai-chat-response.dto';
import { DEEPSEEK_CONFIG, DEEPSEEK_ENV_KEY } from '../constants/deepseek.constants';

@Injectable()
export class DeepSeekChatService extends BaseOpenRouterService {
    protected readonly logger = new Logger(DeepSeekChatService.name);
    protected readonly providerName = 'DeepSeek';

    constructor(
        configService: ConfigService,
        httpService: HttpService,
    ) {
        super(configService, httpService);
    }

    async processChat(
        messages: ChatMessageDto[],
        userContext?: UserContextDto,
    ): Promise<AiChatResponseDto> {
        try {
            const apiKey = this.getApiKey();
            const aiResponse = await this.sendChatRequest(messages, apiKey);

            this.logSuccess({
                userName: userContext?.name || 'Anonymous',
                messageCount: messages.length,
            });

            return AiChatResponseDto.createSuccess(aiResponse);
        } catch (error) {
            return this.handleError(error);
        }
    }

    protected getApiKeyEnvName(): string {
        return DEEPSEEK_ENV_KEY;
    }

    protected getProviderConfig(): OpenRouterProviderConfig {
        return {
            apiUrl: DEEPSEEK_CONFIG.API_URL,
            model: DEEPSEEK_CONFIG.MODEL,
            timeout: DEEPSEEK_CONFIG.REQUEST_TIMEOUT,
            httpReferer: DEEPSEEK_CONFIG.HTTP_REFERER,
            siteTitle: DEEPSEEK_CONFIG.SITE_TITLE,
        };
    }

    private async sendChatRequest(
        messages: ChatMessageDto[],
        apiKey: string,
    ): Promise<string> {
        const payload = {
            model: DEEPSEEK_CONFIG.MODEL,
            messages: messages.map(msg => ({
                role: msg.role,
                content: msg.content,
            })),
        };

        this.logger.debug('Preparing DeepSeek chat request', {
            messageCount: messages.length,
        });

        return this.sendRequest(payload, apiKey);
    }
}
