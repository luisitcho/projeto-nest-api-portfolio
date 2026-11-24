import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectDto } from './dto/project.dto';
import { getAllProjects, onlyProducts } from './projects.data';
import { baseUrlFrom } from './base-url';

/**
 * Produtos próprios da Ozyris (ex.: Heru), usados na aba "Produtos" do site da Ozyris.
 * Lê o mesmo cadastro de `GET /projects` e devolve só os itens com `kind: 'Produto'`,
 * então um produto aparece nas duas rotas sem ser cadastrado duas vezes.
 */
@ApiTags('Produtos')
@Controller('products')
export class ProductsController {
    @Get()
    @ApiOperation({ summary: 'Listar os produtos da Ozyris' })
    @ApiResponse({
        status: 200,
        description:
            'Produtos próprios da Ozyris (itens de /projects com kind "Produto"). Lista vazia quando não houver nenhum.',
        type: ProjectDto,
        isArray: true,
    })
    getProducts(@Req() req: Request): ProjectDto[] {
        return onlyProducts(getAllProjects(baseUrlFrom(req)));
    }
}
