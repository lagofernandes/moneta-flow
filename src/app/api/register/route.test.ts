import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { db } from '@/db';

// Mock do banco de dados Drizzle
vi.mock('@/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
  },
}));

describe('POST /api/register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar erro 400 se os dados de entrada forem inválidos (espaços em branco)', async () => {
    // Simulando uma requisição com nome cheio de espaços em branco (falha no trim/min)
    const req = new Request('http://localhost:3000/api/register', {
      method: 'POST',
      body: JSON.stringify({
        name: '    ', 
        email: '  email@invalido.com  ', 
        password: '123'
      })
    });

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ error: 'Dados inválidos.' });
    // Garante que não tentou ir pro banco de dados
    expect(db.select).not.toHaveBeenCalled();
  });

  it('deve retornar erro 400 se o e-mail já estiver em uso', async () => {
    // Simulando que o banco de dados encontrou um usuário com esse e-mail
    const mockSelectFromWhereLimit = vi.fn().mockResolvedValue([{ id: 1, email: 'joao@teste.com' }]);
    
    // Fazendo a corrente de funções do drizzle funcionar no mock (select().from().where().limit())
    (db.select as any).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: mockSelectFromWhereLimit
        })
      })
    });

    const req = new Request('http://localhost:3000/api/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'João Silva', 
        email: 'joao@teste.com', 
        password: 'senhaForte123'
      })
    });

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({ error: 'Este e-mail já está em uso.' });
    expect(db.insert).not.toHaveBeenCalled();
  });

  it('deve retornar sucesso (201) e salvar o usuário se os dados forem válidos', async () => {
    // Simulando que o e-mail NÃO existe (array vazio retornado)
    const mockSelectFromWhereLimit = vi.fn().mockResolvedValue([]);
    
    (db.select as any).mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: mockSelectFromWhereLimit
        })
      })
    });

    // Simulando a inserção com sucesso
    const mockValues = vi.fn().mockResolvedValue(true);
    (db.insert as any).mockReturnValue({
      values: mockValues
    });

    const req = new Request('http://localhost:3000/api/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'João Silva', 
        email: 'joao@teste.com', 
        password: 'senhaForte123'
      })
    });

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json).toEqual({ success: true });
    
    // Garantindo que a inserção foi chamada com o password em Hash (criptografado) e nunca em texto limpo
    const insertedValues = mockValues.mock.calls[0][0];
    expect(insertedValues.email).toBe('joao@teste.com');
    expect(insertedValues.name).toBe('João Silva');
    expect(insertedValues.passwordHash).not.toBe('senhaForte123'); // Foi criptografado
    expect(insertedValues.passwordHash).toHaveLength(64); // Tamanho comum do Hash SHA-256
  });
});
