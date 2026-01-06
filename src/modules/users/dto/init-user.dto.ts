import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitUserDto {
    @ApiProperty({
        example: 'abc123-device-unique-id',
        description: 'Cihaza özel benzersiz ID',
    })
    @IsString()
    @IsNotEmpty()
    readonly deviceId: string;
}
