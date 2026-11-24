import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Tipo do trabalho, usado nas abas da página de projetos do site da Ozyris.
 * Opcional: sem ele, o site deduz o tipo pelo `title` (RI, ESG, E-commerce ou Institucional).
 * `Produto` é para produtos próprios da Ozyris, que nunca são deduzidos pelo título.
 */
export const PROJECT_KINDS = [
    'RI',
    'Institucional',
    'ESG',
    'E-commerce',
    'Produto',
] as const;

export type ProjectKind = (typeof PROJECT_KINDS)[number];

export class ProjectDto {
    @ApiProperty({
        example: 'Imports Manos',
        description: 'Nome do cliente ou do projeto desenvolvido',
    })
    name: string;

    @ApiProperty({
        example: 'Criação do site para loja virtual',
        description: 'Breve escopo ou papel no desenvolvimento do projeto',
    })
    title: string;

    @ApiProperty({
        example: '/img/projects/imports-manos.png',
        description: 'Caminho relativo da imagem de preview servida pela API',
    })
    image: string;

    @ApiProperty({
        example: 'Ozyris',
        description:
            'Categoria do projeto para fins de filtragem (ex: Ozyris, MZ Group)',
    })
    category: string;

    @ApiProperty({
        example: '04/2026',
        description: 'Mês e ano de entrega do projeto (MM/AAAA)',
    })
    date: string;

    @ApiProperty({
        example: 'https://importsmanos.com.br/',
        description: 'Link direto para o projeto online',
    })
    href: string;

    @ApiPropertyOptional({
        enum: PROJECT_KINDS,
        example: 'Produto',
        description:
            'Tipo do trabalho. Opcional: quando ausente, o site deduz pelo título. Use "Produto" para produtos próprios da Ozyris.',
    })
    kind?: ProjectKind;
}
