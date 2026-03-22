import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { Header } from '../components/header/header';
import { renderWithProviders } from './render-with-providers';
import { AuthorizationStatus } from '../const';
import { makeFakeOffer } from './mocks';

const fakeUserInfo = {
  id: 1,
  email: 'test@example.com',
  username: 'Test User',
  avatar: 'https://example.com/avatar.jpg',
  isPro: false,
  token: 'fake-token',
};

describe('Header — неавторизованный пользователь', () => {
  it('отображает ссылку Sign in', () => {
    renderWithProviders(<Header />, {
      storeOverrides: {
        authorizationStatus: AuthorizationStatus.NoAuth,
        user: null,
        favoriteOffers: [],
      },
    });
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it('не отображает Sign out', () => {
    renderWithProviders(<Header />, {
      storeOverrides: {
        authorizationStatus: AuthorizationStatus.NoAuth,
        user: null,
        favoriteOffers: [],
      },
    });
    expect(screen.queryByText(/sign out/i)).not.toBeInTheDocument();
  });
});

describe('Header — авторизованный пользователь', () => {
  it('отображает username пользователя', () => {
    renderWithProviders(<Header />, {
      storeOverrides: {
        authorizationStatus: AuthorizationStatus.Auth,
        user: fakeUserInfo,
        favoriteOffers: [],
      },
    });
    expect(screen.getByText(fakeUserInfo.username)).toBeInTheDocument();
  });

  it('отображает количество избранных (0)', () => {
    renderWithProviders(<Header />, {
      storeOverrides: {
        authorizationStatus: AuthorizationStatus.Auth,
        user: fakeUserInfo,
        favoriteOffers: [],
      },
    });
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('отображает правильное количество избранных', () => {
    const favoriteOffers = [makeFakeOffer(), makeFakeOffer(), makeFakeOffer()];
    
    renderWithProviders(<Header />, {
      storeOverrides: {
        authorizationStatus: AuthorizationStatus.Auth,
        user: fakeUserInfo,
        favoriteOffers,
      },
    });
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('отображает кнопку Sign out', () => {
    renderWithProviders(<Header />, {
      storeOverrides: {
        authorizationStatus: AuthorizationStatus.Auth,
        user: fakeUserInfo,
        favoriteOffers: [],
      },
    });
    expect(screen.getByText(/sign out/i)).toBeInTheDocument();
  });

  it('не отображает ссылку Sign in', () => {
    renderWithProviders(<Header />, {
      storeOverrides: {
        authorizationStatus: AuthorizationStatus.Auth,
        user: fakeUserInfo,
        favoriteOffers: [],
      },
    });
    expect(screen.queryByText(/sign in/i)).not.toBeInTheDocument();
  });
});

describe('Header — статус Unknown', () => {
  it('отображает ссылку Sign in при статусе Unknown', () => {
    renderWithProviders(<Header />, {
      storeOverrides: {
        authorizationStatus: AuthorizationStatus.Unknown,
        user: null,
        favoriteOffers: [],
      },
    });
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it('не отображает Sign out при статусе Unknown', () => {
    renderWithProviders(<Header />, {
      storeOverrides: {
        authorizationStatus: AuthorizationStatus.Unknown,
        user: null,
        favoriteOffers: [],
      },
    });
    expect(screen.queryByText(/sign out/i)).not.toBeInTheDocument();
  });
});