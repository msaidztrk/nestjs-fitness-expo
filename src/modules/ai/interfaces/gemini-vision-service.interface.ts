import { CreateVisionChatDto } from '../dto/create-vision-chat.dto';
import { AiChatResponseDto } from '../dto/ai-chat-response.dto';

export interface IGeminiVisionService {
    analyzeImage(visionChatDto: CreateVisionChatDto): Promise<AiChatResponseDto>;
}

export const GEMINI_VISION_SERVICE_TOKEN = Symbol('IGeminiVisionService');
