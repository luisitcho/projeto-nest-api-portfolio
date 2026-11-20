import { revalidateSites, scheduleSitesRevalidation } from './revalidate-sites';

describe('revalidateSites', () => {
    it('chama cada rota com o segredo no header Authorization', async () => {
        const fetchFn = jest.fn().mockResolvedValue({
            status: 200,
            text: () => Promise.resolve('{"revalidated":true}'),
        });

        const results = await revalidateSites(
            'segredo',
            ['https://a.test/api/revalidate', 'https://b.test/api/revalidate'],
            fetchFn,
        );

        expect(fetchFn).toHaveBeenCalledTimes(2);
        expect(fetchFn).toHaveBeenCalledWith(
            'https://a.test/api/revalidate',
            expect.objectContaining({
                method: 'POST',
                headers: { Authorization: 'Bearer segredo' },
            }),
        );
        expect(results['https://b.test/api/revalidate']).toBe(
            '200 {"revalidated":true}',
        );
    });

    it('registra o erro de um site sem impedir o outro', async () => {
        const fetchFn = jest
            .fn()
            .mockRejectedValueOnce(new Error('timeout'))
            .mockResolvedValueOnce({
                status: 200,
                text: () => Promise.resolve('ok'),
            });

        const results = await revalidateSites(
            's',
            ['https://a.test', 'https://b.test'],
            fetchFn,
        );

        expect(results['https://a.test']).toBe('erro: timeout');
        expect(results['https://b.test']).toBe('200 ok');
    });
});

describe('scheduleSitesRevalidation', () => {
    it('não agenda nada sem REVALIDATE_SECRET', () => {
        const spy = jest.spyOn(global, 'setTimeout');
        scheduleSitesRevalidation({});
        expect(spy).not.toHaveBeenCalled();
        spy.mockRestore();
    });
});
