
import { IsNumber, IsPositive, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMetricDto {
    @ApiProperty({ example: 'uuid-string' })
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ example: 75.5 })
    @IsNumber()
    @IsPositive()
    weight: number;

    @ApiProperty({ example: 180 })
    @IsNumber()
    @IsPositive()
    height: number;
}
