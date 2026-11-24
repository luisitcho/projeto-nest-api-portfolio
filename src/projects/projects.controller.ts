import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { ProjectDto } from './dto/project.dto';
import { getAllProjects } from './projects.data';
import { baseUrlFrom } from './base-url';

/**
 * Controller responsável por expor as rotas relacionadas aos projetos.
 * Fornece a listagem completa de projetos que abastece os sites `portfolio` e `ozyris`.
 */
@ApiTags('Projetos')
@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    /**
     * Retorna a lista completa de projetos desenvolvidos.
     * Cada objeto de projeto contém:
     * - name: Nome do cliente ou projeto
     * - title: Descrição/papel no desenvolvimento do site
     * - image: Caminho relativo do preview da imagem do projeto
     * - category: Categoria/Origem do projeto (ex: 'Ozyris', 'MZ Group', 'HTML Brasil')
     * - date: Data de entrega (MM/AAAA)
     * - href: Link de acesso externo
     * - kind (opcional): Tipo do trabalho ('RI', 'Institucional', 'ESG', 'E-commerce' ou 'Produto').
     *   Sem ele, o site deduz o tipo pelo título; 'Produto' (produtos próprios da Ozyris) precisa ser explícito.
     */
    @Get()
    @ApiOperation({ summary: 'Listar todos os projetos' })
    @ApiResponse({
        status: 200,
        description: 'Lista de projetos retornada com sucesso.',
        type: ProjectDto,
        isArray: true,
    })
    getProjects(@Req() req: Request): ProjectDto[] {
        return getAllProjects(baseUrlFrom(req));
    }
}
