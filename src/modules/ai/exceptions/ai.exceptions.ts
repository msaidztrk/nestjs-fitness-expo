import { HttpException, HttpStatus } from '@nestjs/common';

export class AiApiException extends HttpException {
    constructor(
        message: string,
        public readonly originalError?: Error,
    ) {
        super(
            {
                statusCode: HttpStatus.BAD_GATEWAY,
                message,
                error: 'AI API Error',
            },
            HttpStatus.BAD_GATEWAY,
        );
    }
}

export class AiConfigurationException extends HttpException {
    constructor(message: string) {
        super(
            {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message,
                error: 'AI Configuration Error',
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}

export class AiRateLimitException extends HttpException {
    constructor(message: string) {
        super(
            {
                statusCode: HttpStatus.TOO_MANY_REQUESTS,
                message,
                error: 'Rate Limit Exceeded',
            },
            HttpStatus.TOO_MANY_REQUESTS,
        );
    }
}
