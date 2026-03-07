import {JSX, useEffect} from 'react';
import { MainPage } from "../../pages/main-page/main-page";
import { FavoritesPage } from "../../pages/favorites-page/favorites-page";
import { LoginPage } from "../../pages/login-page/login-page";
import { OfferPage } from "../../pages/offer-page/offer-page";
import { NotFoundPage } from "../../pages/not-found-page/not-found-page";

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AppRoute, AuthorizationStatus } from "../../const";
import { PrivateRoute } from "../private-route/private-route";
import { FullOffer, OfferList} from "../../types/offer";
import { Review } from '../../types/review';
import { useAppSelector, useAppDispatch  } from '../../hooks';
import { LoadingPage } from '../loading-page/loading-page';
import { fetchOffersAction, checkAuthAction } from '../../store/api-action';

type AppMainPageProps = {
    rentalOffersCount: number;
    offersList: OfferList[];
    offers: FullOffer[];
    reviews: Review[];
}

function App({rentalOffersCount, offersList, offers}: AppMainPageProps): JSX.Element {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector((state) => state.authorizationStatus);
  const isOffersDataLoading = useAppSelector((state) => state.isOffersDataLoading);

  useEffect(() => {
    dispatch(checkAuthAction());
    dispatch(fetchOffersAction());
  }, [dispatch]);

    if (authorizationStatus === AuthorizationStatus.Unknown || isOffersDataLoading) {
      return (
        <LoadingPage />
      );
    }
    
    return(
        <BrowserRouter>
        <Routes>
            <Route
            path = {AppRoute.Main}
            element = {<MainPage/>}/>
        
            <Route
            path = {AppRoute.Login}
            element = {<LoginPage />}/>
            
            <Route
              path={AppRoute.Favorites}
              element={
                <PrivateRoute authorizationStatus={authorizationStatus}>
                  <FavoritesPage />
                </PrivateRoute>
              }
            />

            <Route
            path = { `${AppRoute.Offer}/:id` } 
            element = {<OfferPage />}/>
            
            <Route
            path = "*"
            element = {<NotFoundPage />}/>
        </Routes>
        </BrowserRouter>
    )
}

export { App };