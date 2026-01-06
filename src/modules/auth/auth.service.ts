import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import {
    UserWithoutPassword,
    IJwtPayload,
    IAuthTokenResponse
} from '../users/interfaces/user.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<UserWithoutPassword | null> {
        const user = await this.usersService.findOneByEmail(email);

        if (!user?.passwordHash) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            return null;
        }

        const { passwordHash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async login(loginDto: LoginDto): Promise<IAuthTokenResponse> {
        const user = await this.validateUser(loginDto.email, loginDto.password);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: IJwtPayload = {
            sub: user.id,
            email: user.email
        };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
