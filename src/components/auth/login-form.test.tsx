import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from './login-form';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import * as nextAuthReact from 'next-auth/react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

describe('LoginForm UI & Validations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve exibir erros de validação ao enviar formulário vazio', async () => {
    render(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /Entrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Digite um e-mail válido.')).toBeInTheDocument();
      expect(screen.getByText('A senha deve ter pelo menos 6 caracteres.')).toBeInTheDocument();
    });
  });

  it('deve chamar o signIn com as credenciais corretas', async () => {
    (nextAuthReact.signIn as any).mockResolvedValue({ error: null });

    render(<LoginForm />);
    
    fireEvent.change(screen.getByPlaceholderText('seu@email.com'), { target: { value: 'teste@email.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'senha123' } });

    const submitButton = screen.getByRole('button', { name: /Entrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(nextAuthReact.signIn).toHaveBeenCalledWith('credentials', {
        email: 'teste@email.com',
        password: 'senha123',
        redirect: false,
      });
    });
  });

  it('deve exibir erro quando a senha/email estiverem incorretos (retorno do signIn com erro)', async () => {
    (nextAuthReact.signIn as any).mockResolvedValue({ error: 'CredentialsSignin' });

    render(<LoginForm />);
    
    fireEvent.change(screen.getByPlaceholderText('seu@email.com'), { target: { value: 'errado@email.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: '123456' } });

    const submitButton = screen.getByRole('button', { name: /Entrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('E-mail ou senha incorretos. Tente novamente.')).toBeInTheDocument();
    });
  });
});
