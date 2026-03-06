import { createAction } from '@reduxjs/toolkit';
import { CityOffer, OfferList } from '../types/offer';
import { AuthorizationStatusType } from '../const';

export const changeCity = createAction('offers/changeCity', (city: CityOffer) => ({
  payload: city
}));

export const offersCityList = createAction('offers/offersCityList', (offers: OfferList[]) => ({
  payload: offers
}));

export const requireAuthorization = createAction<AuthorizationStatusType>('user/requireAuthorization');

export const setError = createAction('setError', (error: string | null) =>({
    payload: error
    }));

export const setOffersDataLoadingStatus = createAction<boolean>('data/setOffersDataLoadingStatus');