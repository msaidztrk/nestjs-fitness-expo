import { IsNotEmpty, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserContextDto } from './create-chat.dto';

export class ImageSourceDto {
    @ApiPropertyOptional({
        example: 'https://example.com/food.jpg',
        description: 'Resim URL adresi (URL veya base64 kullanılmalı)',
    })
    @IsOptional()
    @IsUrl()
    readonly url?: string;

    @ApiPropertyOptional({
        example: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
        description: 'Base64 encoded resim (URL veya base64 kullanılmalı)',
    })
    @IsOptional()
    @IsString()
    readonly base64?: string;
}

export class CreateVisionChatDto {
    @ApiProperty({
        example: 'Bu yiyeceğin kalori değeri nedir?',
        description: 'Kullanıcının resim hakkındaki sorusu',
    })
    @IsString()
    @IsNotEmpty()
    readonly prompt: string;

    @ApiProperty({
        type: ImageSourceDto,
        description: 'Analiz edilecek resim (URL veya base64)',
    })
    @ValidateNested()
    @Type(() => ImageSourceDto)
    readonly image: ImageSourceDto;

    @ApiPropertyOptional({
        type: UserContextDto,
        description: 'Kullanıcı profil bilgileri (isteğe bağlı)',
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => UserContextDto)
    readonly userContext?: UserContextDto;
}
