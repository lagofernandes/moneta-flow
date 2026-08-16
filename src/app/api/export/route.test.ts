import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import * as authModule from '@/auth';
import * as dbModule from '@/db';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/db', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    leftJoin: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    // @ts-ignore
    orderBy: vi.fn().mockResolvedValue([]),
    // @ts-ignore
    limit: vi.fn().mockResolvedValue([]),
  },
}));

describe('GET /api/export', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar 401 se nao estiver autenticado', async () => {
    (authModule.auth as any).mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('deve retornar 404 se o usuario nao tem transacoes', async () => {
    (authModule.auth as any).mockResolvedValue({ user: { id: 'user-1' } });
    const res = await GET();
    expect(res.status).toBe(404);
  });

  it('deve retornar CSV se existirem transacoes', async () => {
    (authModule.auth as any).mockResolvedValue({ user: { id: 'user-1' } });
    ((dbModule.db as any).orderBy).mockResolvedValue([
      { date: new Date('2026-08-10'), description: 'Compra', amount: '10.50', type: 'EXPENSE', status: 'PAID', bank: 'Nubank', category: 'Alimentacao' }
    ]);
    
    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('text/csv');
    
    const text = await res.text();
    expect(text).toContain('Compra');
    expect(text).toContain('10.50');
  });
});
