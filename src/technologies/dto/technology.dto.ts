import { ApiProperty } from '@nestjs/swagger';

export class CertificateDto {
    @ApiProperty({
        example: 'Certificado de Conclusão',
        description: 'Título do certificado do curso',
    })
    name: string;

    @ApiProperty({
        example:
            'https://www.udemy.com/certificate/UC-d479fda3-61af-43f4-96b4-ba3de4357647/',
        description: 'Link direto para validação do certificado',
    })
    link: string;
}

export class RepositoryDto {
    @ApiProperty({
        example: 'Curso 2023',
        description: 'Título descritivo do repositório',
    })
    name: string;

    @ApiProperty({
        example: 'https://github.com/luisitcho/curso-javascript-otavio-2023',
        description: 'Link direto do repositório no GitHub',
    })
    link: string;

    @ApiProperty({
        example: true,
        description: 'Indica se é um curso em andamento atualmente',
    })
    current: boolean;

    @ApiProperty({
        example: true,
        description: 'Indica se é um curso do passado',
    })
    past: boolean;
}

export class TechnologyDto {
    @ApiProperty({
        example: 'JavaScript',
        description: 'Nome da linguagem, framework ou ferramenta',
    })
    name: string;

    @ApiProperty({
        example: 'Front-end',
        description:
            'Categoria da tecnologia (ex: Front-end, Back-end, DevOps, Ferramentas)',
    })
    category: string;

    @ApiProperty({
        example: 'FaJsSquare',
        description: 'Nome do ícone correspondente no pacote react-icons',
    })
    icon: string;

    @ApiProperty({
        example: true,
        description: 'Informa se o estudo principal foi concluído',
    })
    completed: boolean;

    @ApiProperty({
        example: false,
        description: 'Informa se a tecnologia deve ser oculta no frontend',
    })
    hide: boolean;

    @ApiProperty({
        example: '2023-06-18',
        description: 'Data de conclusão do curso principal (AAAA-MM-DD)',
        required: false,
    })
    completion_date?: string;

    @ApiProperty({
        type: [CertificateDto],
        description: 'Lista de certificados relacionados',
        required: false,
    })
    certificates?: CertificateDto[];

    @ApiProperty({
        type: [RepositoryDto],
        description: 'Lista de repositórios de estudo associados',
        required: false,
    })
    repositories?: RepositoryDto[];
}
