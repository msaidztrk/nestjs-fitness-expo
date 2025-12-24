
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { Metric } from './entities/metric.entity';
import { MetricsRepository } from './metrics.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Metric])],
    controllers: [MetricsController],
    providers: [MetricsService, MetricsRepository],
})
export class MetricsModule { }
