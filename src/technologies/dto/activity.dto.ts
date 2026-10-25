import { ApiProperty } from '@nestjs/swagger';

export class ActivityDto {
    @ApiProperty({
        example: 'React',
        description: 'Nome da tecnologia (igual ao de /technologies)',
    })
    name: string;

    @ApiProperty({
        example: 'https://github.com/luisitcho/curso-react-battisti-2026',
        description: 'Repositório do curso em andamento',
    })
    repository: string;

    @ApiProperty({
        example: '2026-01-12T21:04:33Z',
        description: 'Data do primeiro commit (início do curso)',
        nullable: true,
    })
    firstCommit: string | null;

    @ApiProperty({
        example: '2026-10-20T18:30:00Z',
        description: 'Data do último commit',
        nullable: true,
    })
    lastCommit: string | null;

    @ApiProperty({
        example: 84,
        description: 'Quantidade total de commits',
        nullable: true,
    })
    commits: number | null;
}
