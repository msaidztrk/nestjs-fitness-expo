
import { IsEmail, IsString, IsNotEmpty, IsOptional, MinLength, IsEnum, IsDateString } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    @MinLength(6)
    password?: string;

    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsDateString()
    @IsOptional()
    dateOfBirth?: string;

    @IsEnum(['male', 'female', 'other'])
    @IsOptional()
    gender?: string;
}
