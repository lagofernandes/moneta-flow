import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PATCH } from './route';
import * as authModule from '@/auth';
import * as dbModule from '@/db';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/db', () => ({
  db: {
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue([]),
  },
}));

describe('PATCH /api/users/me', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar 401 se nao estiver autenticado', async () => {
    (authModule.auth as any).mockResolvedValue(null);
    const req = new Request('http://localhost/api/users/me', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'Teste' }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(401);
  });

  it('deve retornar 400 se dados invalidos (ex: moeda com mais de 3 chars)', async () => {
    (authModule.auth as any).mockResolvedValue({ user: { id: 'user-1' } });
    const req = new Request('http://localhost/api/users/me', {
      method: 'PATCH',
      body: JSON.stringify({ currency: 'REAL' }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(400);
  });

  it('deve retornar 200 e atualizar o banco com dados validos', async () => {
    (authModule.auth as any).mockResolvedValue({ user: { id: 'user-1' } });
    const req = new Request('http://localhost/api/users/me', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'Novo Nome', currency: 'USD' }),
    });
    const res = await PATCH(req);
    expect(res.status).toBe(200);
    expect(dbModule.db.update).toHaveBeenCalled();
  });
});
