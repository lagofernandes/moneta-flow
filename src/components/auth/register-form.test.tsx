import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterForm } from './register-form';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

global.fetch = vi.fn();

describe('RegisterForm UI & Zod Validations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve exibir erros de validação ao tentar enviar formulário vazio', async () => {
    render(<RegisterForm />);
    
    const submitButton = screen.getByRole('button', { name: /Criar Conta/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Nome deve ter pelo menos 2 caracteres.')).toBeInTheDocument();
      expect(screen.getByText('Digite um e-mail válido.')).toBeInTheDocument();
      expect(screen.getByText('A senha deve ter pelo menos 6 caracteres.')).toBeInTheDocument();
    });
  });

  it('deve exibir erros quando os campos são preenchidos com espaços em branco (trim)', async () => {
    render(<RegisterForm />);
    
    fireEvent.change(screen.getByPlaceholderText('Seu nome'), { target: { value: '     ' } });
    fireEvent.change(screen.getByPlaceholderText('seu@email.com'), { target: { value: '   ' } });
    
    // As the form now has multiple password fields, we must find them by their specific labels or IDs.
    // However, they share the same placeholder, so we can use label text or getAllByPlaceholderText.
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(passwordInputs[0], { target: { value: '123' } }); // Senha
    fireEvent.change(passwordInputs[1], { target: { value: '123' } }); // Confirmar Senha

    const submitButton = screen.getByRole('button', { name: /Criar Conta/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Nome deve ter pelo menos 2 caracteres.')).toBeInTheDocument();
      expect(screen.getByText('Digite um e-mail válido.')).toBeInTheDocument();
      expect(screen.getByText('A senha deve ter pelo menos 6 caracteres.')).toBeInTheDocument();
    });
  });

  it('deve exibir erro genérico quando o fetch (backend) retorna erro', async () => {
    // Simulando que o backend (API) recusou o cadastro (ex: E-mail em uso)
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Este e-mail já está em uso.' })
    });

    render(<RegisterForm />);
    
    fireEvent.change(screen.getByPlaceholderText('Seu nome'), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByPlaceholderText('seu@email.com'), { target: { value: 'joao@teste.com' } });
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(passwordInputs[0], { target: { value: 'senhaForte123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'senhaForte123' } });

    const submitButton = screen.getByRole('button', { name: /Criar Conta/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Este e-mail já está em uso.')).toBeInTheDocument();
    });
  });
});
