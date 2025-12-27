import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { CreateChatDto } from './dto/create-chat.dto';

@ApiTags('AI')
@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Post('chat')
    @ApiOperation({ summary: 'Chat with AI' })
    @ApiResponse({ status: 200, description: 'Successful response from AI' })
    async chat(@Body() createChatDto: CreateChatDto) {
        return this.aiService.chat(createChatDto.messages);
    }
}
