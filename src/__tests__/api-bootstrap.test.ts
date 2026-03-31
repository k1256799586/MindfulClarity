import bootstrapHandler from '../../api/bootstrap';

describe('api/bootstrap', () => {
  it('returns dashboard bootstrap data', async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = { json, status } as any;

    await bootstrapHandler({ method: 'GET' } as any, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalled();
  });
});
