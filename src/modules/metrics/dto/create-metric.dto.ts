
import { IsNumber, IsPositive, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateMetricDto {
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @IsNumber()
    @IsPositive()
    weight: number;

    @IsNumber()
    @IsPositive()
    height: number;
}
