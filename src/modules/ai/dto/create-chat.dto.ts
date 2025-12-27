import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ChatMessageDto {
    @ApiProperty({ example: 'user', description: 'The role of the message sender' })
    @IsString()
    @IsNotEmpty()
    role: string;

    @ApiProperty({ example: 'Hello, world!', description: 'The content of the message' })
    @IsString()
    @IsNotEmpty()
    content: string;
}

export class CreateChatDto {
    @ApiProperty({ type: [ChatMessageDto], description: 'Array of chat messages' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ChatMessageDto)
    messages: ChatMessageDto[];
}
