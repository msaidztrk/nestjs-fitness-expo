import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class AiChatResponseDto {
    @ApiProperty({
        example: 'Merhaba! Sağlıklı beslenme için...',
        description: 'AI asistan yanıtı',
    })
    readonly message: string;

    @ApiProperty({
        example: true,
        description: 'İşlemin başarılı olup olmadığı',
    })
    readonly success: boolean;

    @ApiPropertyOptional({
        example: 'API Error: Rate limit exceeded',
        description: 'Hata durumunda hata mesajı',
    })
    readonly error?: string;

    constructor(partial: Partial<AiChatResponseDto>) {
        Object.assign(this, partial);
    }

    static createSuccess(message: string): AiChatResponseDto {
        return new AiChatResponseDto({
            message,
            success: true,
        });
    }

    static createError(error: string): AiChatResponseDto {
        return new AiChatResponseDto({
            message: '',
            success: false,
            error,
        });
    }
}
