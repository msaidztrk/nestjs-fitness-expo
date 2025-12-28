import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AiService } from './ai.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { AiChatResponseDto } from './dto/ai-chat-response.dto';

@ApiTags('AI')
@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Post('chat')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'AI Chat - Fitness Asistanı' })
    @ApiResponse({ status: HttpStatus.OK, type: AiChatResponseDto })
    async chat(@Body() createChatDto: CreateChatDto): Promise<AiChatResponseDto> {
        return this.aiService.processChat(
            createChatDto.messages,
            createChatDto.userContext,
        );
    }
}
