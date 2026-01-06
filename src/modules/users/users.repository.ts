import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const user = this.create(createUserDto);
        return this.save(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.findOne({ where: { email } });
    }

    async findByDeviceId(deviceId: string): Promise<User | null> {
        return this.findOne({ where: { deviceId } });
    }

    async createByDeviceId(deviceId: string): Promise<User> {
        const user = this.create({ deviceId });
        return this.save(user);
    }
}
