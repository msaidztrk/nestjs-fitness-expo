
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Metric } from './entities/metric.entity';
import { CreateMetricDto } from './dto/create-metric.dto';

@Injectable()
export class MetricsRepository extends Repository<Metric> {
    constructor(private dataSource: DataSource) {
        super(Metric, dataSource.createEntityManager());
    }

    async createMetric(createMetricDto: CreateMetricDto): Promise<Metric> {
        const metric = this.create({
            ...createMetricDto,
        });
        return this.save(metric);
    }
}
