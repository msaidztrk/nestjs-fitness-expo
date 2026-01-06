import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import * as winston from 'winston';
import * as path from 'path';
import * as fs from 'fs';

const logsDir = path.join(process.cwd(), 'logs');

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const httpLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ message }) => message as string),
            ),
        }),
        new winston.transports.File({
            filename: path.join(logsDir, 'http.log'),
            format: winston.format.printf(({ message }) => message as string),
        }),
    ],
});

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();

        const { method, url, body } = request;
        const startTime = Date.now();
        const time = new Date().toLocaleTimeString('tr-TR');

        return next.handle().pipe(
            tap({
                next: (data) => {
                    const duration = Date.now() - startTime;
                    const status = response.statusCode;
                    const success = (data as { success?: boolean })?.success ?? true;
                    const icon = success ? '✅' : '❌';

                    httpLogger.info(`[${time}] ${icon} ${method} ${url} → ${status} (${duration}ms)`);

                    if (body?.messages?.length) {
                        const lastMsg = body.messages[body.messages.length - 1];
                        httpLogger.info(`   📥 User: "${lastMsg.content.substring(0, 50)}..."`);
                    }

                    if (body?.prompt) {
                        httpLogger.info(`   📥 Prompt: "${body.prompt.substring(0, 50)}..."`);
                        if (body?.image) {
                            const imageType = body.image.url ? 'URL' : 'Base64';
                            httpLogger.info(`   🖼️ Image: ${imageType}`);
                        }
                    }

                    if (data && typeof data === 'object' && 'message' in data) {
                        const msg = (data as { message: string }).message;
                        if (msg) {
                            httpLogger.info(`   📤 AI: "${msg.substring(0, 80)}..."`);
                        }
                    }

                    httpLogger.info('');
                },
                error: (error) => {
                    const duration = Date.now() - startTime;
                    httpLogger.error(`[${time}] ❌ ${method} ${url} → ERROR (${duration}ms): ${error.message}\n`);
                },
            }),
        );
    }
}
