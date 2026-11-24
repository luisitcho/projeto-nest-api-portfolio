import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ProductsController } from './products.controller';

@Module({
    controllers: [ProjectsController, ProductsController],
    providers: [ProjectsService],
})
export class ProjectsModule {}
