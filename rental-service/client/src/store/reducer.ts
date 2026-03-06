import { createReducer } from "@reduxjs/toolkit";
import { CityOffer, OfferList } from '../types/offer';
import { getCity } from '../utils';
import { changeCity, offersCityList, requireAuthorization, setError,setOffersDataLoadingStatus  } from "./action";
import { AuthorizationStatus, CITIES_LOCATION } from '../const';
import { AuthorizationStatusType } from '../types/authorization-status';

const defaultCity = getCity('Paris', CITIES_LOCATION);

export type InitialState = {
    city: CityOffer | undefined;
    offers: OfferList[];
    authorizationStatus: AuthorizationStatusType;
    error: string | null;
    isOffersDataLoading: boolean;
   }

const initialState : InitialState = {
    city: defaultCity,
    offers: [],
    authorizationStatus: AuthorizationStatus.Unknown,
    error: null,
    isOffersDataLoading: false,
};

const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(changeCity, (state, action) => {
            state.city = action.payload;
        })
        .addCase(offersCityList, (state, action) => {
            state.offers = action.payload;
        })
        .addCase(requireAuthorization, (state, action) => {
            state.authorizationStatus = action.payload;
        })
        .addCase(setError, (state, action) => {
                state.error = action.payload;
        })
        .addCase(setOffersDataLoadingStatus, (state, action) => {
           state.isOffersDataLoading = action.payload;
         });

});

export {reducer}