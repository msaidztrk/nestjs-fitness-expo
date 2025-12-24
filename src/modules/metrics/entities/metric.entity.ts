
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('metrics')
export class Metric {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'decimal', precision: 5, scale: 2, comment: 'Weight in kg' })
    weight: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, comment: 'Height in cm' })
    height: number;

    @Column({ name: 'bmi', type: 'decimal', precision: 4, scale: 2, nullable: true })
    bmi: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
