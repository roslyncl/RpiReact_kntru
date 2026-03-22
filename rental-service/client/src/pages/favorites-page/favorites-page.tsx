import { JSX, useEffect } from 'react';
import { FavoriteCardList } from "../../components/favorite-card-list/favorite-card-list";
import { OfferList } from "../../types/offer";
import { Link } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../const';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchFavoriteOffersAction } from '../../store/api-action';
import { LoadingPage } from '../../components/loading-page/loading-page';
import { Header } from '../../components/header/header';

function FavoritesPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const favoriteOffers = useAppSelector((state) => state.favoriteOffers);
  const authorizationStatus = useAppSelector((state) => state.authorizationStatus);
  const user = useAppSelector((state) => state.user);
  
  useEffect(() => {
    if (authorizationStatus === AuthorizationStatus.Auth) {
      dispatch(fetchFavoriteOffersAction());
    }
  }, [dispatch, authorizationStatus]);

  if (authorizationStatus !== AuthorizationStatus.Auth) {
    return <LoadingPage />;
  }

  const offersByCity = favoriteOffers.reduce((acc: Record<string, OfferList[]>, offer: OfferList) => {
    const city = offer.city.name;
    if (!acc[city]) {
      acc[city] = [];
    }
    acc[city].push(offer);
    return acc;
  }, {});

  const hasFavorites = favoriteOffers.length > 0;

  return (
    <div className="page">
      <Header /> 

      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>
            {hasFavorites ? (
              <ul className="favorites__list">
                {Object.entries(offersByCity).map(([city, cityOffers]) => (
                  <FavoriteCardList
                    key={city}
                    offers={cityOffers as OfferList[]}
                    city={city}
                  />
                ))}
              </ul>
            ) : (
              <div className="favorites__status-wrapper">
                <b className="favorites__status">Nothing yet saved.</b>
                <p className="favorites__status-description">
                  Save properties to narrow down search or plan your future trips.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
      
      <footer className="footer container">
        <Link className="footer__logo-link" to={AppRoute.Main}>
          <img className="footer__logo" src="/img/logo.svg" alt="Rent service logo" width="64" height="33" />
        </Link>
      </footer>
    </div>
  );
}

export { FavoritesPage };