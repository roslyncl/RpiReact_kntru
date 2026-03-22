import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { CitiesCard } from '../components/cities-card/cities-card';
import { AppRoute, AuthorizationStatus } from '../const';

vi.mock('../store/api-action', () => ({
  toggleFavoriteAction: vi.fn(() => ({ type: 'toggleFavoriteAction' })),
}));

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

const mockOfferProps = {
  id: 'offer-1',
  title: 'Beautiful apartment in Paris',
  type: 'apartment',
  price: 120,
  isPremium: true,
  previewImage: 'https://example.com/image.jpg',
  rating: 4.5,
  onMouseEnter: vi.fn(),
  onMouseLeave: vi.fn(),
  isFavorite: false,
};

const renderCard = (props = mockOfferProps) => {
  return render(
    <Provider store={mockStore}>
      <MemoryRouter>
        <CitiesCard {...props} />
      </MemoryRouter>
    </Provider>
  );
};

describe('CitiesCard', () => {
  it('заголовок объявления отображается на карточке', () => {
    renderCard();
    
    expect(screen.getByText(mockOfferProps.title)).toBeInTheDocument();
  });

  it('цена объявления присутствует в разметке', () => {
    renderCard();
    
    expect(screen.getByText(`€${mockOfferProps.price}`)).toBeInTheDocument();
  });

  it('метка "Premium" отображается когда isPremium = true', () => {
    renderCard();
    
    expect(screen.getByText(/premium/i)).toBeInTheDocument();
  });

  it('метка "Premium" отсутствует когда isPremium = false', () => {
    const nonPremiumProps = {
      ...mockOfferProps,
      isPremium: false,
    };
    
    renderCard(nonPremiumProps);
    
    expect(screen.queryByText(/premium/i)).not.toBeInTheDocument();
  });

  it('ссылка на страницу объявления содержит id в href (/offer/id)', () => {
    renderCard();
    
    const links = screen.getAllByRole('link');
    const offerLink = links.find(link => 
      link.getAttribute('href') === `${AppRoute.Offer}/${mockOfferProps.id}`
    );
    
    expect(offerLink).toBeDefined();
    expect(offerLink).toHaveAttribute('href', `${AppRoute.Offer}/${mockOfferProps.id}`);
  });

  it('отображает тип жилья', () => {
    renderCard();
    
    expect(screen.getByText(mockOfferProps.type)).toBeInTheDocument();
  });

  it('отображает рейтинг в виде звезд', () => {
    renderCard();
    
    const ratingStars = document.querySelector('.place-card__stars');
    expect(ratingStars).toBeInTheDocument();
    
    const ratingWidth = (mockOfferProps.rating / 5) * 100;
    const starSpan = ratingStars?.querySelector('span');
    expect(starSpan).toHaveStyle({ width: `${ratingWidth}%` });
  });

  it('отображает изображение объявления', () => {
    renderCard();
    
    const image = screen.getByAltText('Place image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockOfferProps.previewImage);
  });

  it('вызывает onMouseEnter при наведении мыши', () => {
    const onMouseEnter = vi.fn();
    renderCard({ ...mockOfferProps, onMouseEnter });
    
    const article = screen.getByRole('article');
    fireEvent.mouseEnter(article);
    
    expect(onMouseEnter).toHaveBeenCalledTimes(1);
  });

  it('вызывает onMouseLeave при уходе мыши', () => {
    const onMouseLeave = vi.fn();
    renderCard({ ...mockOfferProps, onMouseLeave });
    
    const article = screen.getByRole('article');
    fireEvent.mouseLeave(article);
    
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });

  it('кнопка избранного отображается с правильным классом', () => {
    renderCard();
    
    const bookmarkButton = screen.getByRole('button');
    expect(bookmarkButton).toBeInTheDocument();
    expect(bookmarkButton).toHaveClass('place-card__bookmark-button');
  });

  it('кнопка избранного имеет активный класс когда isFavorite = true', () => {
    renderCard({ ...mockOfferProps, isFavorite: true });
    
    const bookmarkButton = screen.getByRole('button');
    expect(bookmarkButton).toHaveClass('place-card__bookmark-button--active');
  });

  it('кнопка избранного не имеет активный класс когда isFavorite = false', () => {
    renderCard({ ...mockOfferProps, isFavorite: false });
    
    const bookmarkButton = screen.getByRole('button');
    expect(bookmarkButton).not.toHaveClass('place-card__bookmark-button--active');
  });
});