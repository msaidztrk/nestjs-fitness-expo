import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { AiController } from './ai.controller';
import { DeepSeekChatService, GeminiVisionService } from './services';

@Module({
    imports: [
        ConfigModule,
        HttpModule.register({
            timeout: 60000,
        }),
    ],
    controllers: [AiController],
    providers: [
        DeepSeekChatService,
        GeminiVisionService,
    ],
    exports: [
        DeepSeekChatService,
        GeminiVisionService,
    ],
})
export class AiModule { }
