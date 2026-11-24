import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { ProductsController } from './products.controller';
import { onlyProducts } from './projects.data';
import { ProjectDto } from './dto/project.dto';

const req = {
    headers: {},
    protocol: 'https',
    get: () => 'api.example.com',
} as unknown as Request;

const item = (name: string, kind?: ProjectDto['kind']): ProjectDto => ({
    name,
    title: 'Título',
    image: '/img/projects/x.png',
    category: 'Ozyris',
    date: '01/2026',
    href: 'https://example.com/',
    ...(kind ? { kind } : {}),
});

describe('ProductsController', () => {
    let controller: ProductsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductsController],
        }).compile();

        controller = module.get<ProductsController>(ProductsController);
    });

    it('returns only items whose kind is Produto', () => {
        for (const product of controller.getProducts(req)) {
            expect(product.kind).toBe('Produto');
        }
    });
});

describe('onlyProducts', () => {
    it('keeps products and drops client projects and items without kind', () => {
        const result = onlyProducts([
            item('Heru', 'Produto'),
            item('Cliente RI', 'RI'),
            item('Sem tipo'),
        ]);

        expect(result.map((p) => p.name)).toEqual(['Heru']);
    });
});
