import { createReducer } from "@reduxjs/toolkit";
import { CityOffer, OfferList, FullOffer } from '../types/offer';
import { Review } from '../types/review';
import { User } from '../types/state';
import { getCity } from '../utils';
import { 
  changeCity, 
  offersCityList, 
  requireAuthorization, 
  setError, 
  setOffersDataLoadingStatus, 
  setUser,
  setCurrentOffer,
  setCurrentOfferLoadingStatus,
  setReviews,
  setNearbyOffers,
  setFavoriteOffers,
  updateOfferFavoriteStatus
} from "./action";
import { AuthorizationStatus, CITIES_LOCATION } from '../const';
import { AuthorizationStatusType } from '../types/authorization-status';

const defaultCity = getCity('Paris', CITIES_LOCATION);

export type InitialState = {
    city: CityOffer | undefined;
    offers: OfferList[];
    authorizationStatus: AuthorizationStatusType;
    user: User | null;
    error: string | null;
    isOffersDataLoading: boolean;
    currentOffer: FullOffer | null;
    isCurrentOfferLoading: boolean;
    reviews: Review[];
    nearbyOffers: OfferList[];
    favoriteOffers: OfferList[];  
}

const initialState : InitialState = {
    city: defaultCity,
    offers: [],
    authorizationStatus: AuthorizationStatus.Unknown,
    user: null,
    error: null,
    isOffersDataLoading: false,
    currentOffer: null,
    isCurrentOfferLoading: false,
    reviews: [],
    nearbyOffers: [],
    favoriteOffers: [],  
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
        .addCase(setUser, (state, action) => {
            state.user = action.payload;
        })
        .addCase(setError, (state, action) => {
            state.error = action.payload;
        })
        .addCase(setOffersDataLoadingStatus, (state, action) => {
           state.isOffersDataLoading = action.payload;
        })
        .addCase(setCurrentOffer, (state, action) => {
            state.currentOffer = action.payload;
        })
        .addCase(setCurrentOfferLoadingStatus, (state, action) => {
            state.isCurrentOfferLoading = action.payload;
        })
        .addCase(setReviews, (state, action) => {
            state.reviews = action.payload;
        })
        .addCase(setNearbyOffers, (state, action) => {
            state.nearbyOffers = action.payload;
        })
        .addCase(setFavoriteOffers, (state, action) => {
            state.favoriteOffers = action.payload;
        })
        .addCase(updateOfferFavoriteStatus, (state, action) => {
            const { offerId, isFavorite } = action.payload;
            
            const offerIndex = state.offers.findIndex(o => o.id === offerId);
            if (offerIndex !== -1) {
                state.offers[offerIndex].isFavorite = isFavorite;
            }
            
            if (state.currentOffer && state.currentOffer.id === offerId) {
                state.currentOffer.isFavorite = isFavorite;
            }
            
            const nearbyIndex = state.nearbyOffers.findIndex(o => o.id === offerId);
            if (nearbyIndex !== -1) {
                state.nearbyOffers[nearbyIndex].isFavorite = isFavorite;
            }
        });
});

export { reducer }