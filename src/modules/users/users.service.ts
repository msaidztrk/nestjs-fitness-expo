import { Injectable, ConflictException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { InitUserDto } from './dto/init-user.dto';
import { InitUserResponseDto } from './dto/init-user-response.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) { }

    async initByDeviceId(initUserDto: InitUserDto): Promise<InitUserResponseDto> {
        const existingUser = await this.usersRepository.findByDeviceId(initUserDto.deviceId);

        if (existingUser) {
            return new InitUserResponseDto(existingUser, false);
        }

        const newUser = await this.usersRepository.createByDeviceId(initUserDto.deviceId);
        return new InitUserResponseDto(newUser, true);
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const { password, ...userData } = createUserDto;
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        const userToCreate = this.usersRepository.create({
            ...userData,
            passwordHash: hashedPassword,
        });

        return this.usersRepository.save(userToCreate);
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findByEmail(email);
    }

    async findOneByDeviceId(deviceId: string): Promise<User | null> {
        return this.usersRepository.findByDeviceId(deviceId);
    }
}
