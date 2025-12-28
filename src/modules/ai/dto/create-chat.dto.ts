import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export enum ChatMessageRoleEnum {
    SYSTEM = 'system',
    USER = 'user',
    ASSISTANT = 'assistant',
}

export class ChatMessageDto {
    @ApiProperty({
        enum: ChatMessageRoleEnum,
        example: 'user',
        description: 'Mesaj gönderenin rolü (system, user, assistant)',
    })
    @IsEnum(ChatMessageRoleEnum)
    @IsNotEmpty()
    readonly role: ChatMessageRoleEnum;

    @ApiProperty({
        example: 'Merhaba, sağlıklı beslenme hakkında bilgi verir misin?',
        description: 'Mesaj içeriği',
    })
    @IsString()
    @IsNotEmpty()
    readonly content: string;
}

export class UserContextDto {
    @ApiProperty({ example: 'Ahmet', description: 'Kullanıcının adı' })
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({ example: '85', description: 'Mevcut kilo (kg)' })
    @IsString()
    @IsNotEmpty()
    readonly weight: string;

    @ApiProperty({ example: '175', description: 'Boy (cm)' })
    @IsString()
    @IsNotEmpty()
    readonly height: string;

    @ApiProperty({ example: '27.8', description: 'Vücut Kitle İndeksi' })
    @IsString()
    @IsNotEmpty()
    readonly bmi: string;

    @ApiProperty({ example: '75', description: 'Hedef kilo (kg)' })
    @IsString()
    @IsNotEmpty()
    readonly goalWeight: string;

    @ApiProperty({ example: '3 gün', description: 'Haftalık egzersiz sıklığı' })
    @IsString()
    @IsNotEmpty()
    readonly weeklyExercise: string;
}


export class CreateChatDto {
    @ApiProperty({
        type: [ChatMessageDto],
        description: 'Tüm chat geçmişi (system prompt dahil)',
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ChatMessageDto)
    readonly messages: ChatMessageDto[];

    @ApiPropertyOptional({
        type: UserContextDto,
        description: 'Kullanıcı profil bilgileri (isteğe bağlı)',
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => UserContextDto)
    readonly userContext?: UserContextDto;
}
