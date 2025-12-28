import * as winston from 'winston';
import * as path from 'path';

const logsDir = path.join(process.cwd(), 'logs');

export const winstonConfig = {
    transports: [
        // Console'a yazdır
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message, context }) => {
                    return `${timestamp} [${context || 'App'}] ${level}: ${message}`;
                }),
            ),
        }),
        // Tüm logları dosyaya kaydet
        new winston.transports.File({
            filename: path.join(logsDir, 'app.log'),
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
        }),
        // Sadece hataları ayrı dosyaya kaydet
        new winston.transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
        }),
        // HTTP isteklerini ayrı dosyaya kaydet
        new winston.transports.File({
            filename: path.join(logsDir, 'http.log'),
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
        }),
    ],
};
