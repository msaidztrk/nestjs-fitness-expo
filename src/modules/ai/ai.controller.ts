import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { DeepSeekChatService, GeminiVisionService } from './services';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateVisionChatDto } from './dto/create-vision-chat.dto';
import { AiChatResponseDto } from './dto/ai-chat-response.dto';

@ApiTags('AI')
@Controller('ai')
export class AiController {
    constructor(
        private readonly deepSeekChatService: DeepSeekChatService,
        private readonly geminiVisionService: GeminiVisionService,
    ) { }

    @Post('chat')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'AI Chat - Fitness Asistanı (DeepSeek R1)',
        description: 'Text-based chat. DeepSeek R1 reasoning modeli kullanır.',
    })
    @ApiResponse({ status: HttpStatus.OK, type: AiChatResponseDto })
    async chat(@Body() createChatDto: CreateChatDto): Promise<AiChatResponseDto> {
        return this.deepSeekChatService.processChat(
            createChatDto.messages,
            createChatDto.userContext,
        );
    }

    @Post('vision/analyze')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Vision AI - Resim Analizi (Gemini 2.0 Flash)',
        description: 'Mobil uygulamadan gelen resim ve soruyu Gemini Vision ile analiz eder.',
    })
    @ApiResponse({ status: HttpStatus.OK, type: AiChatResponseDto })
    async analyzeImage(@Body() createVisionChatDto: CreateVisionChatDto): Promise<AiChatResponseDto> {
        return this.geminiVisionService.analyzeImage(createVisionChatDto);
    }
}
