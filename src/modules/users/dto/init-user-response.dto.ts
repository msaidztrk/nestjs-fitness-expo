import { ApiProperty } from '@nestjs/swagger';

export class InitUserResponseDto {
    @ApiProperty({ example: 'a1b2c3d4-uuid' })
    readonly userId: string;

    @ApiProperty({ example: 'abc123-device-unique-id' })
    readonly deviceId: string;

    @ApiProperty({ example: false })
    readonly isNewUser: boolean;

    @ApiProperty({ example: '2026-01-02T10:00:00.000Z' })
    readonly createdAt: Date;

    constructor(user: { id: string; deviceId: string; createdAt: Date }, isNewUser: boolean) {
        this.userId = user.id;
        this.deviceId = user.deviceId;
        this.isNewUser = isNewUser;
        this.createdAt = user.createdAt;
    }
}
