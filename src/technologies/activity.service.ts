import { Injectable, Logger } from '@nestjs/common';
import { TechnologiesService } from './technologies.service';
import { ActivityDto } from './dto/activity.dto';

const CACHE_MS = 60 * 60 * 1000;

type Commit = {
    commit: { author?: { date?: string }; committer?: { date?: string } };
};

/**
 * Busca no GitHub o primeiro commit, o último e o total de commits de cada curso em andamento.
 * São no máximo duas chamadas por repositório: a primeira página (último commit + total pelo
 * cabeçalho Link) e a última página (primeiro commit). O resultado fica em memória por 1 hora.
 */
@Injectable()
export class ActivityService {
    private readonly logger = new Logger(ActivityService.name);
    private cache: { at: number; data: ActivityDto[] } | null = null;

    constructor(private readonly technologiesService: TechnologiesService) {}

    async getActivity(): Promise<ActivityDto[]> {
        if (this.cache && Date.now() - this.cache.at < CACHE_MS) {
            return this.cache.data;
        }

        const current = this.technologiesService
            .getTechnologies()
            .filter((tech) => !tech.hide)
            .map((tech) => ({
                name: tech.name,
                repository: tech.repositories?.find((r) => r.current && !r.past)
                    ?.link,
            }))
            .filter(
                (item): item is { name: string; repository: string } =>
                    !!item.repository,
            );

        const data = await Promise.all(
            current.map(async ({ name, repository }) => {
                try {
                    return {
                        name,
                        repository,
                        ...(await this.commitsOf(repository)),
                    };
                } catch (error) {
                    this.logger.warn(
                        `GitHub indisponível para ${repository}: ${(error as Error).message}`,
                    );
                    return {
                        name,
                        repository,
                        firstCommit: null,
                        lastCommit: null,
                        commits: null,
                    };
                }
            }),
        );

        // Só guarda quando o GitHub respondeu tudo; uma falha não fica presa por uma hora
        if (data.every((item) => item.lastCommit !== null)) {
            this.cache = { at: Date.now(), data };
        }
        return data;
    }

    private async commitsOf(link: string) {
        // github.com/{owner}/{repo} ou github.com/{owner}/{repo}/tree/{branch}/{pasta}
        const parts = link.replace(/\/$/, '').split('/');
        const [owner, repo] = [parts[3], parts[4]];
        const tree = parts.indexOf('tree');
        const path = tree > -1 ? parts.slice(tree + 2).join('/') : '';
        const base = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1${path ? `&path=${encodeURIComponent(path)}` : ''}`;

        const first = await this.github(base);
        const latest = ((await first.json()) as Commit[])[0];
        if (!latest) return { firstCommit: null, lastCommit: null, commits: 0 };

        // Com per_page=1, o número da última página é o total de commits
        const lastPage = Number(
            first.headers
                .get('link')
                ?.match(/[?&]page=(\d+)>; rel="last"/)?.[1] ?? 1,
        );
        const oldest =
            lastPage > 1
                ? (
                      (await (
                          await this.github(`${base}&page=${lastPage}`)
                      ).json()) as Commit[]
                  )[0]
                : latest;

        return {
            firstCommit: dateOf(oldest),
            lastCommit: dateOf(latest),
            commits: lastPage,
        };
    }

    private async github(url: string) {
        const token = process.env.GITHUB_TOKEN;
        const res = await fetch(url, {
            headers: {
                Accept: 'application/vnd.github+json',
                'User-Agent': 'api-portfolio',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res;
    }
}

const dateOf = (item?: Commit) =>
    item?.commit.committer?.date ?? item?.commit.author?.date ?? null;
