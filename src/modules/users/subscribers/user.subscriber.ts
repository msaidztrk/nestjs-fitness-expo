
import {
    EventSubscriber,
    EntitySubscriberInterface,
    InsertEvent,
    UpdateEvent,
    DataSource,
} from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    constructor(@InjectDataSource() readonly dataSource: DataSource) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return User;
    }

    async beforeInsert(event: InsertEvent<User>) {
        console.log('[UserSubscriber] Before Insert: Hashing password...');
        if (event.entity.passwordHash) {
            const salt = await bcrypt.genSalt();
            event.entity.passwordHash = await bcrypt.hash(event.entity.passwordHash, salt);
        }
    }

    async beforeUpdate(event: UpdateEvent<User>) {
    }
}
