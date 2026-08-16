import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import * as authModule from '@/auth';
import * as dbModule from '@/db';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/db', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    // @ts-ignore
    limit: vi.fn().mockResolvedValue([]),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
  },
}));

describe('POST /api/users/me/password', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar 401 se nao estiver autenticado', async () => {
    (authModule.auth as any).mockResolvedValue(null);
    const req = new Request('http://localhost/api/users/me/password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword: '123', newPassword: 'abc' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('deve retornar 400 para senhas muito curtas', async () => {
    (authModule.auth as any).mockResolvedValue({ user: { id: 'user-1' } });
    const req = new Request('http://localhost/api/users/me/password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword: '123', newPassword: 'abc' }), // < 6 chars
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('deve retornar 400 se a conta do google tentar colocar senha', async () => {
    (authModule.auth as any).mockResolvedValue({ user: { id: 'user-1' } });
    ((dbModule.db as any).limit).mockResolvedValue([{ passwordHash: null }]);
    
    const req = new Request('http://localhost/api/users/me/password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword: '123', newPassword: 'newpassword' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Google');
  });

  // Note: Hashing logic makes it a bit tricky to test valid passwords without extracting
  // hashPassword, but we test the structure.
});
