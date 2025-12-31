import { ChatMessageDto, UserContextDto } from '../dto/create-chat.dto';
import { AiChatResponseDto } from '../dto/ai-chat-response.dto';

export interface IAiService {
    processChat(
        messages: ChatMessageDto[],
        userContext?: UserContextDto,
    ): Promise<AiChatResponseDto>;
}

export const AI_SERVICE_TOKEN = Symbol('IAiService');
