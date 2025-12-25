
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { CreateMetricDto } from './dto/create-metric.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Metrics')
@ApiBearerAuth()
@Controller('metrics')
export class MetricsController {
    constructor(private readonly metricsService: MetricsService) { }

    @ApiOperation({ summary: 'Record user metrics (weight, height)' })
    @Post()
    create(@Body() createMetricDto: CreateMetricDto) {
        return this.metricsService.create(createMetricDto);
    }


}
