import {AxiosInstance} from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {AppDispatch, State} from '../types/state.js';
import { OfferList } from '../types/offer.js';
import { offersCityList, requireAuthorization, setError, setOffersDataLoadingStatus} from './action';
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
      dispatch(offersCityList(data)); // Сначала обновляем данные
    } catch (error) {
      dispatch(setError('Не удалось загрузить предложения'));
      console.error('Ошибка загрузки:', error);
    } finally {
      dispatch(setOffersDataLoadingStatus(false)); // Потом выключаем загрузку
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
       await api.get(APIRoute.Login);
       dispatch(requireAuthorization(AuthorizationStatus.Auth));
     } catch {
       dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
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
     dispatch(requireAuthorization(AuthorizationStatus.Auth));
     return data;
   } catch (err) {
     dropToken();
     dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
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


export {fetchOffersAction, checkAuthAction, loginAction, logoutAction, clearErrorAction }
