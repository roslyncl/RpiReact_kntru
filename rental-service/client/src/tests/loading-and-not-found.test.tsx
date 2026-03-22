import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { LoadingPage } from '../components/loading-page/loading-page';
import { NotFoundPage } from '../pages/not-found-page/not-found-page';
import { AppRoute, AuthorizationStatus } from '../const';

const mockStore = configureStore({
  reducer: {
    authorizationStatus: (state = AuthorizationStatus.NoAuth) => state,
    user: (state = null) => state,
    favoriteOffers: (state = []) => state,
    offers: (state = []) => state,
    city: (state = null) => state,
    currentOffer: (state = null) => state,
    isCurrentOfferLoading: (state = false) => state,
    reviews: (state = []) => state,
  },
});

describe('LoadingPage', () => {
  it('отображает текст загрузки', () => {
    render(<LoadingPage />);
    
    expect(screen.getByText(/загрузка предложений\.\.\./i)).toBeInTheDocument();
  });

  it('компонент рендерится без ошибок', () => {
    expect(() => render(<LoadingPage />)).not.toThrow();
  });
});

describe('NotFoundPage', () => {
  const renderPage = () => render(
    <Provider store={mockStore}>
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    </Provider>
  );

  it('отображает заголовок 404', () => {
    renderPage();
    
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('отображает текст Page not found', () => {
    renderPage();
    
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });

  it('ссылка на главную страницу присутствует', () => {
    renderPage();
    
    expect(screen.getByText(/go to main page/i)).toBeInTheDocument();
  });

  it('ссылка ведет на "/"', () => {
    renderPage();
    
    const link = screen.getByRole('link', { name: /go to main page/i });
    expect(link).toHaveAttribute('href', AppRoute.Main);
  });
});