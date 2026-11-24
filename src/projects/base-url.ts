import { Request } from 'express';

/** URL pública da API (respeitando o proxy), usada para montar o caminho absoluto das imagens. */
export const baseUrlFrom = (req: Request): string => {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.get('Host');
    return `${protocol}://${host}`;
};
