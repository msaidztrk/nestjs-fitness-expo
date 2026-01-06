import { User } from '../entities/user.entity';

export type UserWithoutPassword = Omit<User, 'passwordHash'>;

export interface IJwtPayload {
    readonly sub: string;
    readonly email: string;
}

export interface IAuthTokenResponse {
    readonly access_token: string;
}
