import { Logger } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { rename, stat } from 'fs/promises';
import { tmpdir } from 'os';
import { join, normalize, sep } from 'path';
import * as sharp from 'sharp';

const PUBLIC_DIR = join(__dirname, '..', '..', 'public');
const CACHE_DIR = join(tmpdir(), 'api-portfolio-webp');
const WIDTHS = [320, 640, 960, 1280, 1600, 1920];
const DEFAULT_WIDTH = 1920; // sem ?w=, mantém a largura original (os prints têm até 1920px)
const CONVERTIBLE = /\.(png|jpe?g)$/i;

const logger = new Logger('WebP');
const pending = new Map<string, Promise<string>>();

mkdirSync(CACHE_DIR, { recursive: true });

/** Largura pedida em ?w=, arredondada para a próxima largura permitida. */
const widthFrom = (query: unknown): number => {
    const asked = Number(query);
    if (!Number.isFinite(asked) || asked <= 0) return DEFAULT_WIDTH;
    return WIDTHS.find((w) => w >= asked) ?? WIDTHS[WIDTHS.length - 1];
};

/** Gera (uma vez) a versão WebP da imagem e devolve o caminho do arquivo em cache. */
const convert = async (source: string, width: number): Promise<string> => {
    const { mtimeMs } = await stat(source);
    const name = source
        .slice(PUBLIC_DIR.length + 1)
        .replace(/[\\/]/g, '__')
        .replace(CONVERTIBLE, '');
    const target = join(
        CACHE_DIR,
        `${name}-${width}-${Math.floor(mtimeMs)}.webp`,
    );
    if (existsSync(target)) return target;

    const running = pending.get(target);
    if (running) return running;

    const job = (async () => {
        const temporary = `${target}.${process.pid}.tmp`;
        await sharp(source)
            .resize({ width, withoutEnlargement: true })
            .webp({ quality: 82 })
            .toFile(temporary);
        await rename(temporary, target);
        return target;
    })().finally(() => pending.delete(target));

    pending.set(target, job);
    return job;
};

/**
 * Entrega as imagens de /img em WebP leve para quem aceita WebP.
 * O arquivo original continua no repositório; quem não aceita WebP recebe o original.
 * Aceita ?w= (320 a 1920) para miniaturas. A conversão é feita uma vez e fica em cache;
 * se o arquivo original mudar, uma versão nova é gerada.
 */
export const webpMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    if (!CONVERTIBLE.test(req.path)) return next();
    if (!req.headers.accept?.includes('image/webp')) return next();

    const source = normalize(
        join(PUBLIC_DIR, 'img', decodeURIComponent(req.path)),
    );
    if (!source.startsWith(PUBLIC_DIR + sep) || !existsSync(source)) {
        return next();
    }

    try {
        const file = await convert(source, widthFrom(req.query.w));
        res.setHeader('Content-Type', 'image/webp');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.setHeader('Vary', 'Accept');
        res.sendFile(file);
    } catch (error) {
        logger.warn(
            `Falha ao converter ${req.path}: ${(error as Error).message}`,
        );
        next();
    }
};
