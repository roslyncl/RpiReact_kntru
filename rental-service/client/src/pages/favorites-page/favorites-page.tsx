import { JSX, useEffect } from 'react';
import { Logo } from "../../components/logo/logo";
import { FavoriteCardList } from "../../components/favorite-card-list/favorite-card-list";
import { OfferList } from "../../types/offer";
import { Link } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../const';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { fetchFavoriteOffersAction } from '../../store/api-action';
import { LoadingPage } from '../../components/loading-page/loading-page';

const getAvatarUrl = (avatarPath: string | null | undefined): string => {
  if (!avatarPath) return '/img/avatar.svg';
  if (avatarPath.startsWith('http')) return avatarPath;
  return `http://localhost:5000${avatarPath}`;
};

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
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Logo />
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                <li className="header__nav-item user">
                  <Link className="header__nav-link header__nav-link--profile" to={AppRoute.Favorites}>
                    <div className="header__avatar-wrapper user__avatar-wrapper">
                      {user?.avatar ? (
                        <img 
                          src={getAvatarUrl(user.avatar)} 
                          alt="User avatar"
                          style={{ borderRadius: '50%', width: '20px', height: '20px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                      )}
                    </div>
                    <span className="header__user-name user__name">{user?.email || 'User'}</span>
                    <span className="header__favorite-count">{favoriteOffers.length}</span>
                  </Link>
                </li>
                <li className="header__nav-item">
                  <Link className="header__nav-link" to={AppRoute.Main}>
                    <span className="header__signout">Sign out</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

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