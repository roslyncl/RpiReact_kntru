import { createAction } from '@reduxjs/toolkit';
import { CityOffer, OfferList, FullOffer } from '../types/offer';
import { Review } from '../types/review';
import { AuthorizationStatusType } from '../const';
import { User } from '../types/state';

export const changeCity = createAction('offers/changeCity', (city: CityOffer) => ({
  payload: city
}));

export const offersCityList = createAction('offers/offersCityList', (offers: OfferList[]) => ({
  payload: offers
}));

export const requireAuthorization = createAction<AuthorizationStatusType>('user/requireAuthorization');

export const setUser = createAction<User | null>('user/setUser');

export const setError = createAction('setError', (error: string | null) => ({
    payload: error
}));

export const setOffersDataLoadingStatus = createAction<boolean>('data/setOffersDataLoadingStatus');

export const setCurrentOffer = createAction<FullOffer | null>('offer/setCurrentOffer');

export const setCurrentOfferLoadingStatus = createAction<boolean>('offer/setCurrentOfferLoadingStatus');

export const setReviews = createAction<Review[]>('offer/setReviews');

export const setNearbyOffers = createAction<OfferList[]>('offer/setNearbyOffers');

export const setFavoriteOffers = createAction<OfferList[]>('user/setFavoriteOffers');

export const updateOfferFavoriteStatus = createAction<{ offerId: string; isFavorite: boolean }>('offers/updateFavoriteStatus');