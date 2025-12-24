
import { Injectable } from '@nestjs/common';
import { MetricsRepository } from './metrics.repository';
import { CreateMetricDto } from './dto/create-metric.dto';
import { Metric } from './entities/metric.entity';

@Injectable()
export class MetricsService {
    constructor(private readonly metricsRepository: MetricsRepository) { }

    async create(createMetricDto: CreateMetricDto): Promise<Metric> {
        return this.metricsRepository.createMetric(createMetricDto);
    }


}
