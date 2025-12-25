
import { Injectable, ConflictException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const { password, ...userData } = createUserDto;
        const userToCreate = this.usersRepository.create({
            ...userData,
            passwordHash: password,
        });

        return this.usersRepository.save(userToCreate);
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findByEmail(email);
    }
}
