import { Controller, Get, Header } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TechnologiesService } from './technologies.service';
import { TechnologyDto } from './dto/technology.dto';
import { ActivityService } from './activity.service';
import { ActivityDto } from './dto/activity.dto';

/**
 * Controller responsável por gerenciar a rota de tecnologias/cursos.
 * Serve a listagem de competências, certificados e repositórios vinculados a cada tecnologia.
 */
@ApiTags('Tecnologias')
@Controller('technologies')
export class TechnologiesController {
    constructor(
        private readonly technologiesService: TechnologiesService,
        private readonly activityService: ActivityService,
    ) {}

    /**
     * Retorna a lista de tecnologias cadastradas.
     * Cada tecnologia possui informações sobre categoria, status de conclusão, data de conclusão,
     * certificados e repositórios de cursos realizados.
     */
    @Get()
    @ApiOperation({ summary: 'Listar todas as tecnologias e cursos' })
    @ApiResponse({
        status: 200,
        description: 'Lista de tecnologias retornada com sucesso.',
        type: TechnologyDto,
        isArray: true,
    })
    getTechnologies(): TechnologyDto[] {
        return this.technologiesService.getTechnologies();
    }

    /**
     * Retorna a atividade real no GitHub de cada curso em andamento:
     * primeiro commit (início), último commit e total de commits.
     * A CDN guarda a resposta por 1 hora, então o GitHub quase não é consultado.
     */
    @Get('activity')
    @Header(
        'Cache-Control',
        'public, s-maxage=3600, stale-while-revalidate=86400',
    )
    @ApiOperation({ summary: 'Atividade no GitHub dos cursos em andamento' })
    @ApiResponse({
        status: 200,
        description:
            'Primeiro commit, último commit e total de commits de cada curso em andamento.',
        type: ActivityDto,
        isArray: true,
    })
    getActivity(): Promise<ActivityDto[]> {
        return this.activityService.getActivity();
    }
}
