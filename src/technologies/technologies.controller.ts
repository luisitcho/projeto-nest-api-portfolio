import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TechnologiesService } from './technologies.service';
import { TechnologyDto } from './dto/technology.dto';

/**
 * Controller responsável por gerenciar a rota de tecnologias/cursos.
 * Serve a listagem de competências, certificados e repositórios vinculados a cada tecnologia.
 */
@ApiTags('Tecnologias')
@Controller('technologies')
export class TechnologiesController {
    constructor(private readonly technologiesService: TechnologiesService) {}

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
}
