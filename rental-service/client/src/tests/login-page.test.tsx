import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginPage } from '../pages/login-page/login-page';
import { renderWithProviders } from './render-with-providers';
import { AuthorizationStatus, AppRoute } from '../const';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../store/api-action', () => ({
  loginAction: vi.fn(() => ({
    type: 'loginAction',
    unwrap: () => Promise.resolve(),
  })),
}));

describe('LoginPage', () => {
  it('отображает заголовок Sign in', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
  });

  it('отображает поле email', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  });

  it('отображает поле password', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('кнопка Submit присутствует', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('пользователь может ввести email и пароль', () => {
    renderWithProviders(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(/password/i) as HTMLInputElement;
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('неавторизованный пользователь видит форму', () => {
    renderWithProviders(<LoginPage />, {
      storeOverrides: {
        authorizationStatus: AuthorizationStatus.NoAuth,
      },
    });
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  });
});