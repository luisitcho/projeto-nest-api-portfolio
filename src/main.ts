import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Portfolio API')
        .setDescription(
            'Documentação interativa das rotas da API do Portfolio e Ozyris.',
        )
        .setVersion('1.0.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
        customCssUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
        customJs: [
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
        ],
        customCss: `
            .swagger-ui .topbar a img {
                content: url('/logo.svg') !important;
                max-height: 40px;
            }
            .opblock-section-header:has(+ .parameters-container),
            .parameters-container,
            .try-out {
                display: none !important;
            }
        `,
    });

    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
