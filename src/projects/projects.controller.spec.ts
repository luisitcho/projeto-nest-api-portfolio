import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { Request } from 'express';
import { ProjectsService } from './projects.service';
import { PROJECT_KINDS } from './dto/project.dto';

describe('ProjectsController', () => {
    let controller: ProjectsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProjectsController],
            providers: [ProjectsService],
        }).compile();

        controller = module.get<ProjectsController>(ProjectsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('only uses known values in the optional kind field', () => {
        const req = {
            headers: {},
            protocol: 'https',
            get: () => 'api.example.com',
        } as unknown as Request;
        const projects = controller.getProjects(req);

        expect(projects.length).toBeGreaterThan(0);
        for (const project of projects) {
            if (project.kind !== undefined) {
                expect(PROJECT_KINDS).toContain(project.kind);
            }
        }
    });
});
