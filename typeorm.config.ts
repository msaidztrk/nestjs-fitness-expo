
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from './src/common/database/snake-naming.strategy';
import { config } from 'dotenv';

config();

export default new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['src/**/*.entity{.ts,.js}'],
    migrations: ['src/migrations/*{.ts,.js}'],
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: false,
});
