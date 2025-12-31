import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError, AxiosRequestConfig } from 'axios';

import { AiChatResponseDto } from '../dto/ai-chat-response.dto';
import { AiApiException, AiConfigurationException, AiRateLimitException } from '../exceptions/ai.exceptions';
import { AI_ERROR_MESSAGES } from '../constants/ai.constants';

export interface OpenRouterResponse {
    readonly choices: ReadonlyArray<{
        readonly message: {
            readonly role: string;
            readonly content: string;
        };
    }>;
}

export interface OpenRouterProviderConfig {
    readonly apiUrl: string;
    readonly model: string;
    readonly timeout: number;
    readonly httpReferer: string;
    readonly siteTitle: string;
}

export abstract class BaseOpenRouterService {
    protected abstract readonly logger: Logger;
    protected abstract readonly providerName: string;

    constructor(
        protected readonly configService: ConfigService,
        protected readonly httpService: HttpService,
    ) { }

    protected abstract getApiKeyEnvName(): string;
    protected abstract getProviderConfig(): OpenRouterProviderConfig;

    protected getApiKey(): string {
        const envKeyName = this.getApiKeyEnvName();
        const apiKey = this.configService.get<string>(envKeyName);

        if (!apiKey) {
            this.logger.error(`${this.providerName} API key is not configured`, { envKey: envKeyName });
            throw new AiConfigurationException(`${this.providerName} API anahtarı tanımlı değil`);
        }

        return apiKey;
    }

    protected async sendRequest<TPayload>(
        payload: TPayload,
        apiKey: string,
    ): Promise<string> {
        const config = this.getProviderConfig();

        const headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': config.httpReferer,
            'X-Title': config.siteTitle,
        };

        const axiosConfig: AxiosRequestConfig = {
            headers,
            timeout: config.timeout,
        };

        this.logger.debug(`Sending request to ${this.providerName}`, {
            model: config.model,
            url: config.apiUrl,
        });

        const response = await firstValueFrom(
            this.httpService.post<OpenRouterResponse>(
                config.apiUrl,
                payload,
                axiosConfig,
            ),
        );

        const content = response.data.choices[0]?.message?.content;

        if (!content) {
            throw new AiApiException(AI_ERROR_MESSAGES.INVALID_RESPONSE);
        }

        return content;
    }

    protected handleError(error: unknown): AiChatResponseDto {
        if (error instanceof AiConfigurationException) {
            this.logger.error(`${this.providerName} Configuration Error`, { message: error.message });
            return AiChatResponseDto.createError(error.message);
        }

        if (error instanceof AiApiException) {
            this.logger.error(`${this.providerName} API Error`, { message: error.message });
            return AiChatResponseDto.createError(error.message);
        }

        if (this.isRateLimitError(error)) {
            this.logger.warn(`${this.providerName} rate limit exceeded`);
            return AiChatResponseDto.createError(AI_ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
        }

        if (error instanceof AxiosError) {
            const errorMessage = error.response?.data?.error?.message || error.message;
            this.logger.error(`${this.providerName} API Error`, {
                status: error.response?.status,
                message: errorMessage,
            });
            return AiChatResponseDto.createError(`${AI_ERROR_MESSAGES.API_REQUEST_FAILED}: ${errorMessage}`);
        }

        const unknownError = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Unexpected error in ${this.providerName}`, { error: unknownError });
        return AiChatResponseDto.createError(AI_ERROR_MESSAGES.API_REQUEST_FAILED);
    }

    protected isRateLimitError(error: unknown): boolean {
        if (error instanceof AxiosError) {
            return error.response?.status === 429;
        }
        return error instanceof AiRateLimitException;
    }

    protected logSuccess(context: Record<string, unknown>): void {
        this.logger.log(`${this.providerName} request completed successfully`, context);
    }
}
