import { Module } from '@nestjs/common';
import { TechnologiesController } from './technologies.controller';
import { TechnologiesService } from './technologies.service';
import { ActivityService } from './activity.service';

@Module({
    controllers: [TechnologiesController],
    providers: [TechnologiesService, ActivityService],
    exports: [TechnologiesService],
})
export class TechnologiesModule {}
