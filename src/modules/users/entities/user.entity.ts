import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('users')
@Index(['email'], { unique: true })
@Index(['deviceId'], { unique: true })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'device_id', length: 255, unique: true, nullable: true })
    deviceId: string;

    @Column({ name: 'email', length: 255, unique: true, nullable: true })
    email: string;

    @Column({ name: 'password_hash', length: 255, nullable: true })
    passwordHash: string;

    @Column({ name: 'first_name', length: 100, nullable: true })
    firstName: string;

    @Column({ name: 'last_name', length: 100, nullable: true })
    lastName: string;

    @Column({ name: 'date_of_birth', type: 'date', nullable: true })
    dateOfBirth: Date;

    @Column({ name: 'gender', type: 'enum', enum: ['male', 'female', 'other'], nullable: true })
    gender: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
