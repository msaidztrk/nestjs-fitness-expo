import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserDataDto {
    @ApiProperty({ example: 'a1b2c3d4-uuid' })
    readonly id: string;

    @ApiProperty({ example: 'abc123-device-unique-id' })
    readonly deviceId: string;

    @ApiPropertyOptional({ example: 'user@example.com' })
    readonly email: string | null;

    @ApiPropertyOptional({ example: 'John' })
    readonly firstName: string | null;

    @ApiPropertyOptional({ example: 'Doe' })
    readonly lastName: string | null;

    @ApiPropertyOptional({ example: '1990-01-01' })
    readonly dateOfBirth: Date | null;

    @ApiPropertyOptional({ example: 'male' })
    readonly gender: string | null;

    @ApiProperty({ example: '2026-01-02T10:00:00.000Z' })
    readonly createdAt: Date;

    @ApiProperty({ example: '2026-01-02T10:00:00.000Z' })
    readonly updatedAt: Date;
}

export class InitUserResponseDto {
    @ApiProperty({ example: true })
    readonly success: boolean;

    @ApiProperty({ example: 'User initialized successfully' })
    readonly message: string;

    @ApiProperty({ example: false })
    readonly isNewUser: boolean;

    @ApiProperty({ type: UserDataDto })
    readonly user: UserDataDto;

    constructor(user: User, isNewUser: boolean) {
        this.success = true;
        this.message = isNewUser ? 'User registered successfully' : 'User retrieved successfully';
        this.isNewUser = isNewUser;
        this.user = {
            id: user.id,
            deviceId: user.deviceId,
            email: user.email || null,
            firstName: user.firstName || null,
            lastName: user.lastName || null,
            dateOfBirth: user.dateOfBirth || null,
            gender: user.gender || null,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
