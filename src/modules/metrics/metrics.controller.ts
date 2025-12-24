
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { CreateMetricDto } from './dto/create-metric.dto';

@Controller('metrics')
export class MetricsController {
    constructor(private readonly metricsService: MetricsService) { }

    @Post()
    create(@Body() createMetricDto: CreateMetricDto) {
        return this.metricsService.create(createMetricDto);
    }


}
