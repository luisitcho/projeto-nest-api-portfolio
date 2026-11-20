import { Logger } from '@nestjs/common';

/**
 * Avisa os sites que consomem a API (portfolio e Ozyris) que os dados mudaram.
 *
 * Cada deploy no Coolify cria um container novo; quando ele sobe, esta função espera
 * o Coolify trocar o container antigo pelo novo e chama `POST /api/revalidate` de cada
 * site. A rota invalida o cache do Next (tag `api-portfolio`) e limpa no Cloudflare as
 * páginas que mostram os projetos, então o dado novo aparece sem esperar o cache de 1h.
 *
 * Variáveis de ambiente (no Coolify):
 * - REVALIDATE_SECRET: o mesmo segredo configurado nos dois sites. Sem ele, não faz nada.
 * - REVALIDATE_URLS: rotas a chamar, separadas por vírgula (padrão: as dos dois sites).
 * - REVALIDATE_DELAY_MS: espera antes de chamar (padrão: 45000).
 */
const DEFAULT_URLS = [
    'https://luisitcho.com.br/api/revalidate',
    'https://ozyris.com.br/api/revalidate',
];

const logger = new Logger('RevalidateSites');

export async function revalidateSites(
    secret: string,
    urls: string[],
    fetchFn: typeof fetch = fetch,
): Promise<Record<string, string>> {
    const results: Record<string, string> = {};

    await Promise.all(
        urls.map(async (url) => {
            try {
                const res = await fetchFn(url, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${secret}` },
                    signal: AbortSignal.timeout(30_000),
                });
                results[url] = `${res.status} ${await res.text()}`;
            } catch (err) {
                results[url] =
                    `erro: ${err instanceof Error ? err.message : String(err)}`;
            }
        }),
    );

    return results;
}

export function scheduleSitesRevalidation(
    env: NodeJS.ProcessEnv = process.env,
): void {
    const secret = env.REVALIDATE_SECRET;
    if (!secret) return;

    const urls = (env.REVALIDATE_URLS || DEFAULT_URLS.join(','))
        .split(',')
        .map((u) => u.trim())
        .filter(Boolean);
    const delayMs = Number(env.REVALIDATE_DELAY_MS || 45_000);

    setTimeout(() => {
        void revalidateSites(secret, urls).then((results) => {
            for (const [url, result] of Object.entries(results)) {
                logger.log(`${url} -> ${result}`);
            }
        });
    }, delayMs).unref();
}
