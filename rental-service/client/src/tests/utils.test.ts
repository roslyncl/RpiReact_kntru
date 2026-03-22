import { describe, it, expect } from 'vitest';
import { getCity, getOffersByCity, sortOffersByType, getImageUrl } from '../utils';
import { makeFakeOffer } from './mocks';
import { SortOffersType, CITIES_LOCATION } from '../const';
import type { SortOffer } from '../types/sort';

describe('getCity', () => {
  it('возвращает город по его имени', () => {
    const result = getCity('Paris', CITIES_LOCATION);
    
    expect(result).toBeDefined();
    expect(result?.name).toBe('Paris');
    expect(result?.location).toBeDefined();
  });

  it('возвращает undefined, если город не найден', () => {
    const result = getCity('NonExistentCity', CITIES_LOCATION);
    expect(result).toBeUndefined();
  });

  it('возвращает undefined при пустом списке городов', () => {
    const result = getCity('Paris', []);
    expect(result).toBeUndefined();
  });
});

describe('getOffersByCity', () => {
  it('возвращает только объявления указанного города', () => {
    const paris = CITIES_LOCATION[0];
    const cologne = CITIES_LOCATION[1];
    const parisOffer = { ...makeFakeOffer(), city: paris };
    const cologneOffer = { ...makeFakeOffer(), city: cologne };

    const result = getOffersByCity('Paris', [parisOffer, cologneOffer]);

    expect(result).toHaveLength(1);
    expect(result[0].city.name).toBe('Paris');
  });

  it('возвращает пустой массив, если город не найден', () => {
    const offers = [makeFakeOffer(), makeFakeOffer()];
    expect(getOffersByCity('Tokyo', offers)).toHaveLength(0);
  });

  it('возвращает пустой массив при пустом списке предложений', () => {
    expect(getOffersByCity('Paris', [])).toEqual([]);
  });

  it('возвращает несколько предложений для одного города', () => {
    const paris = CITIES_LOCATION[0];
    const parisOffer1 = { ...makeFakeOffer(), city: paris };
    const parisOffer2 = { ...makeFakeOffer(), city: paris };
    const cologneOffer = { ...makeFakeOffer(), city: CITIES_LOCATION[1] };

    const result = getOffersByCity('Paris', [parisOffer1, cologneOffer, parisOffer2]);

    expect(result).toHaveLength(2);
    expect(result.every(offer => offer.city.name === 'Paris')).toBe(true);
  });
});

describe('sortOffersByType', () => {
  it('сортирует от дешёвых к дорогим (PriceToHigh)', () => {
    const offers = [
      { ...makeFakeOffer(), price: 300 },
      { ...makeFakeOffer(), price: 100 },
      { ...makeFakeOffer(), price: 200 },
    ];

    const result = sortOffersByType([...offers], SortOffersType.PriceToHigh as SortOffer);

    expect(result[0].price).toBe(100);
    expect(result[1].price).toBe(200);
    expect(result[2].price).toBe(300);
  });

  it('сортирует от дорогих к дешёвым (PriceToLow)', () => {
    const offers = [
      { ...makeFakeOffer(), price: 100 },
      { ...makeFakeOffer(), price: 300 },
      { ...makeFakeOffer(), price: 200 },
    ];

    const result = sortOffersByType([...offers], SortOffersType.PriceToLow as SortOffer);

    expect(result[0].price).toBe(300);
    expect(result[1].price).toBe(200);
    expect(result[2].price).toBe(100);
  });

  it('сортирует по рейтингу (TopRated)', () => {
    const offers = [
      { ...makeFakeOffer(), rating: 3 },
      { ...makeFakeOffer(), rating: 5 },
      { ...makeFakeOffer(), rating: 4 },
    ];

    const result = sortOffersByType([...offers], SortOffersType.TopRated as SortOffer);

    expect(result[0].rating).toBe(5);
    expect(result[1].rating).toBe(4);
    expect(result[2].rating).toBe(3);
  });

  it('сохраняет исходный порядок для Popular', () => {
    const offers = [
      { ...makeFakeOffer(), id: '1' },
      { ...makeFakeOffer(), id: '2' },
      { ...makeFakeOffer(), id: '3' },
    ];

    const originalIds = offers.map(offer => offer.id);
    const result = sortOffersByType([...offers], SortOffersType.Popular as SortOffer);

    expect(result.map(offer => offer.id)).toEqual(originalIds);
  });

  it('корректно работает с пустым массивом', () => {
    const emptyOffers: any[] = [];
    
    const resultPriceToHigh = sortOffersByType(emptyOffers, SortOffersType.PriceToHigh as SortOffer);
    const resultPriceToLow = sortOffersByType(emptyOffers, SortOffersType.PriceToLow as SortOffer);
    const resultTopRated = sortOffersByType(emptyOffers, SortOffersType.TopRated as SortOffer);
    const resultPopular = sortOffersByType(emptyOffers, SortOffersType.Popular as SortOffer);
    
    expect(resultPriceToHigh).toEqual([]);
    expect(resultPriceToLow).toEqual([]);
    expect(resultTopRated).toEqual([]);
    expect(resultPopular).toEqual([]);
    expect(resultPriceToHigh).toHaveLength(0);
  });

  it('не изменяет исходный массив', () => {
    const offers = [
      { ...makeFakeOffer(), price: 100 },
      { ...makeFakeOffer(), price: 200 },
    ];

    const copy = [...offers];
    sortOffersByType(offers, SortOffersType.PriceToHigh as SortOffer);

    expect(offers).toEqual(copy);
  });
});

describe('getImageUrl', () => {
  it('возвращает дефолтное изображение при пустой строке', () => {
    const result = getImageUrl('');
    expect(result).toBe('/img/apartment-01.jpg');
  });

  it('возвращает оригинальный URL, если он начинается с http', () => {
    const httpUrl = 'http://example.com/image.jpg';
    const httpsUrl = 'https://example.com/image.jpg';
    
    expect(getImageUrl(httpUrl)).toBe(httpUrl);
    expect(getImageUrl(httpsUrl)).toBe(httpsUrl);
  });

  it('добавляет базовый URL и слеш к относительному пути без начального слеша', () => {
    const relativePath = 'uploads/image.jpg';
    const result = getImageUrl(relativePath);
    
    expect(result).toBe(`http://localhost:5000/${relativePath}`);
  });

  it('добавляет базовый URL к относительному пути с начальным слешем', () => {
    const relativePath = '/uploads/image.jpg';
    const result = getImageUrl(relativePath);
    
    expect(result).toBe(`http://localhost:5000${relativePath}`);
  });

  it('корректно обрабатывает путь с query параметрами', () => {
    const pathWithParams = '/image.jpg?width=100&height=100';
    const result = getImageUrl(pathWithParams);
    
    expect(result).toBe(`http://localhost:5000${pathWithParams}`);
  });
});