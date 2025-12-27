import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { ChatMessageDto } from './dto/create-chat.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);
    private readonly openRouterUrl = 'https://openrouter.ai/api/v1/chat/completions';

    constructor(
        private configService: ConfigService,
        private httpService: HttpService,
    ) { }

    async chat(messages: ChatMessageDto[]) {
        const apiKey = this.configService.get<string>('OPEN_ROUTER_API_KEY');

        if (!apiKey) {
            this.logger.warn('OPEN_ROUTER_API_KEY is not defined');
            throw new Error('API Key is missing');
        }

        try {
            const payload = {
                model: 'deepseek/deepseek-r1:free',
                messages: messages,
            };

            const headers = {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            };

            const response = await firstValueFrom(
                this.httpService.post(this.openRouterUrl, payload, { headers })
            );

            return response.data.choices[0]?.message;
        } catch (error) {
            this.logger.error('Error communicating with OpenRouter', (error as any)?.response?.data || (error as any).message);
            throw error;
        }
    }
}
