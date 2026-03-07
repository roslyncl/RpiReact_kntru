import {AxiosInstance} from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {AppDispatch, State} from '../types/state.js';
import { OfferList, FullOffer } from '../types/offer.js';
import { Review } from '../types/review.js';
import { 
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
} from './action';
import {saveToken, dropToken} from '../services/token';
import {APIRoute, AuthorizationStatus, TIMEOUT_SHOW_ERROR} from '../const';
import {AuthData, UserData} from '../types/user-data';
import { store } from './index';

const fetchOffersAction = createAsyncThunk<void, undefined, {
 dispatch: AppDispatch;
 state: State;
 extra: AxiosInstance;
}>(
 'data/fetchOffers',
 async (_arg, {dispatch, extra: api}) => {
    dispatch(setOffersDataLoadingStatus(true));
    try {
      const {data} = await api.get<OfferList[]>(APIRoute.Offers);
      dispatch(offersCityList(data));
    } catch (error) {
      dispatch(setError('Не удалось загрузить предложения'));
    } finally {
      dispatch(setOffersDataLoadingStatus(false));
    }
 },
);

const fetchFavoriteOffersAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchFavoriteOffers',
  async (_arg, {dispatch, extra: api}) => {
    try {
      const {data} = await api.get<OfferList[]>(APIRoute.Favorite);
      dispatch(setFavoriteOffers(data));
    } catch (error) {
      dispatch(setError('Не удалось загрузить избранное'));
    }
  },
);

const toggleFavoriteAction = createAsyncThunk<OfferList, { offerId: string; status: number }, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/toggleFavorite',
  async ({ offerId, status }, { dispatch, extra: api }) => {
    try {
      const { data } = await api.post<OfferList>(`${APIRoute.ToggleFavorite}/${offerId}/${status}`);
      dispatch(updateOfferFavoriteStatus({ offerId, isFavorite: status === 1 }));
      dispatch(fetchFavoriteOffersAction());
      return data;
    } catch (error) {
      dispatch(setError('Не удалось изменить статус избранного'));
      throw error;
    }
  },
);

const fetchOfferAction = createAsyncThunk<void, string, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchOffer',
  async (offerId, {dispatch, extra: api}) => {
    dispatch(setCurrentOfferLoadingStatus(true));
    try {
      const {data} = await api.get<FullOffer>(`${APIRoute.Offers}/${offerId}`);
      dispatch(setCurrentOffer(data));
    } catch (error) {
      dispatch(setError('Не удалось загрузить информацию о предложении'));
    } finally {
      dispatch(setCurrentOfferLoadingStatus(false));
    }
  },
);

const fetchReviewsAction = createAsyncThunk<void, string, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchReviews',
  async (offerId, {dispatch, extra: api}) => {
    try {
      const {data} = await api.get<Review[]>(`${APIRoute.Reviews}/${offerId}`);
      dispatch(setReviews(data));
    } catch (error) {
      dispatch(setError('Не удалось загрузить отзывы'));
    }
  },
);

const postReviewAction = createAsyncThunk<void, { offerId: string; comment: string; rating: number }, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/postReview',
  async ({ offerId, comment, rating }, { dispatch, extra: api }) => {
    try {
      await api.post(`${APIRoute.Reviews}/${offerId}`, { comment, rating });
      const { data } = await api.get<Review[]>(`${APIRoute.Reviews}/${offerId}`);
      dispatch(setReviews(data));
    } catch (error) {
      dispatch(setError('Не удалось отправить отзыв'));
      throw error;
    }
  },
);

const checkAuthAction = createAsyncThunk<void, undefined, {
   dispatch: AppDispatch;
   state: State;
   extra: AxiosInstance;
 }>(
   'user/checkAuth',
   async (_arg, {dispatch, extra: api}) => {
     try {
       const { data } = await api.get(APIRoute.Login);
       dispatch(requireAuthorization(AuthorizationStatus.Auth));
       dispatch(setUser({
         email: data.email,
         avatar: data.avatar,
         token: data.token,
         username: data.username
       }));
       dispatch(fetchFavoriteOffersAction());
     } catch {
       dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
       dispatch(setUser(null));
     }
   },
 );

const loginAction = createAsyncThunk<UserData, AuthData, { 
  dispatch: AppDispatch; 
  state: State; 
  extra: AxiosInstance 
}>(
 'user/login',
 async ({ email, password }, { dispatch, extra: api, rejectWithValue }) => {
   try {
     const { data } = await api.post<UserData>(APIRoute.Login, { email, password });
     saveToken(data.token);
     
     const userResponse = await api.get(APIRoute.CheckAuth);
     
     dispatch(requireAuthorization(AuthorizationStatus.Auth));
     dispatch(setUser({
       email: userResponse.data.email,
       avatar: userResponse.data.avatar,
       token: data.token,
       username: userResponse.data.username
     }));
     
     dispatch(fetchFavoriteOffersAction());
     
     return userResponse.data;
   } catch (err) {
     dropToken();
     dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
     dispatch(setUser(null));
     return rejectWithValue('Login failed');
   }
 }
);

const logoutAction = createAsyncThunk<void, undefined, {
 dispatch: AppDispatch;
 state: State;
 extra: AxiosInstance;
}>(
 'user/logout',
 async (_arg, {dispatch, extra: api}) => {
   await api.delete(APIRoute.Logout);
   dropToken();
   dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
   dispatch(setUser(null));
   dispatch(setFavoriteOffers([]));
 },
);

const clearErrorAction = createAsyncThunk(
   'clearError',
   () => {
     setTimeout(
       () => store.dispatch(setError(null)),
       TIMEOUT_SHOW_ERROR,
     );
   },
 );

export {
  fetchOffersAction, 
  fetchFavoriteOffersAction,
  toggleFavoriteAction,
  fetchOfferAction,
  fetchReviewsAction,
  postReviewAction,
  checkAuthAction, 
  loginAction, 
  logoutAction, 
  clearErrorAction 
}