import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { 
  fetchOfferAction, 
  fetchReviewsAction, 
  postReviewAction,
  toggleFavoriteAction
} from '../../store/api-action';
import { setCurrentOffer, setReviews } from '../../store/action';
import { Logo } from "../../components/logo/logo";
import { Map } from "../../components/map/map";
import { ReviewsList } from "../../components/review-list/review-list";
import { ReviewsForm } from "../../components/reviews-form/reviews-form";
import { NearbyOffers } from "../../components/nearby-offers/nearby-offers";
import { NotFoundPage } from "../not-found-page/not-found-page";
import { LoadingPage } from "../../components/loading-page/loading-page";
import { Link } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../const';
import { OfferList } from '../../types/offer';

const BASE_URL = 'http://localhost:5000';

// Только проверенные рабочие фото
const workingPhotos = [
  'apartment-01.jpg',
  'apartment-02.jpg',
  'apartment-03.jpg',
  'apartment-01.jpg', // дублируем первые, если остальные не работают
  'apartment-02.jpg',
  'apartment-03.jpg'
];

function OfferPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  
  const currentOffer = useAppSelector((state) => state.currentOffer);
  const isCurrentOfferLoading = useAppSelector((state) => state.isCurrentOfferLoading);
  const reviews = useAppSelector((state) => state.reviews);
  const allOffers = useAppSelector((state) => state.offers);
  const authorizationStatus = useAppSelector((state) => state.authorizationStatus);
  const user = useAppSelector((state) => state.user);
  const favoriteCount = useAppSelector((state) => state.favoriteOffers?.length || 0);
  
  const [selectedPoint, setSelectedPoint] = useState<OfferList | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchOfferAction(id));
      dispatch(fetchReviewsAction(id));
    }

    return () => {
      dispatch(setCurrentOffer(null));
      dispatch(setReviews([]));
    };
  }, [id, dispatch]);

  const handleReviewSubmit = (reviewData: { comment: string; rating: number }) => {
    if (id) {
      dispatch(postReviewAction({ offerId: id, ...reviewData }));
    }
  };

  const handleFavoriteClick = () => {
    if (currentOffer) {
      const newStatus = currentOffer.isFavorite ? 0 : 1;
      dispatch(toggleFavoriteAction({ offerId: currentOffer.id, status: newStatus }));
    }
  };

  if (isCurrentOfferLoading) {
    return <LoadingPage />;
  }

  if (!currentOffer) {
    return <NotFoundPage />;
  }

  const nearbyOffers = allOffers
    .filter(offer => offer.id !== id && offer.city.name === currentOffer.city.name)
    .slice(0, 3);

  // Используем только рабочие фото
  const offerImages = workingPhotos.map(photo => `${BASE_URL}/uploads/offers/${photo}`);

  const currentOfferForMap: OfferList = {
    id: currentOffer.id,
    title: currentOffer.title,
    type: currentOffer.type,
    price: currentOffer.price,
    city: currentOffer.city,
    location: currentOffer.location,
    isFavorite: currentOffer.isFavorite,
    isPremium: currentOffer.isPremium,
    rating: currentOffer.rating,
    previewImage: offerImages[0]
  };

  const allMapPoints = [currentOfferForMap, ...nearbyOffers];
  const isAuthorized = authorizationStatus === AuthorizationStatus.Auth;

  const getAvatarUrl = (avatarPath: string | null | undefined) => {
    if (!avatarPath) return '/img/avatar.svg';
    if (avatarPath.startsWith('http')) return avatarPath;
    const fileName = avatarPath.split('/').pop() || 'avatar.svg';
    return `${BASE_URL}/uploads/avatars/${fileName}`;
  };

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
                {isAuthorized ? (
                  <>
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
                        <span className="header__favorite-count">{favoriteCount}</span>
                      </Link>
                    </li>
                    <li className="header__nav-item">
                      <Link className="header__nav-link" to={AppRoute.Main}>
                        <span className="header__signout">Sign out</span>
                      </Link>
                    </li>
                  </>
                ) : (
                  <li className="header__nav-item user">
                    <Link className="header__nav-link header__nav-link--profile" to={AppRoute.Login}>
                      <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                      <span className="header__login">Sign in</span>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {offerImages.map((image, index) => (
                <div key={index} className="offer__image-wrapper">
                  <img 
                    className="offer__image" 
                    src={image} 
                    alt={`Photo ${index + 1}`}
                    onError={(e) => {
                      e.currentTarget.src = offerImages[0];
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              {currentOffer.isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}
              
              <div className="offer__name-wrapper">
                <h1 className="offer__name">{currentOffer.title}</h1>
                <button 
                  className={`offer__bookmark-button button ${currentOffer.isFavorite ? 'offer__bookmark-button--active' : ''}`} 
                  type="button"
                  onClick={handleFavoriteClick}
                >
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">
                    {currentOffer.isFavorite ? 'In bookmarks' : 'To bookmarks'}
                  </span>
                </button>
              </div>
              
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{width: `${(currentOffer.rating / 5) * 100}%`}}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{currentOffer.rating}</span>
              </div>
              
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">{currentOffer.type}</li>
                <li className="offer__feature offer__feature--bedrooms">{currentOffer.bedrooms} Bedrooms</li>
                <li className="offer__feature offer__feature--adults">Max {currentOffer.maxAdults} adults</li>
              </ul>
              
              <div className="offer__price">
                <b className="offer__price-value">€{currentOffer.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {currentOffer.goods?.map((good) => (
                    <li key={good} className="offer__inside-item">{good}</li>
                  ))}
                </ul>
              </div>
              
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className={`offer__avatar-wrapper ${currentOffer.host?.isPro ? 'offer__avatar-wrapper--pro' : ''} user__avatar-wrapper`}>
                    <img className="offer__avatar user__avatar" src={currentOffer.host?.avatarUrl} width="74" height="74" alt="Host" />
                  </div>
                  <span className="offer__user-name">{currentOffer.host?.name}</span>
                  {currentOffer.host?.isPro && <span className="offer__user-status">Pro</span>}
                </div>
                <div className="offer__description">
                  <p className="offer__text">{currentOffer.description}</p>
                </div>
              </div>
              
              <ReviewsList reviews={reviews} />
              {isAuthorized && <ReviewsForm onReviewSubmit={handleReviewSubmit} />}
            </div>
          </div>
          
          <section className="offer__map map">
            <Map city={currentOffer.city} points={allMapPoints} selectedPoint={selectedPoint} />
          </section>
        </section>
        
        {nearbyOffers.length > 0 && (
          <div className="container">
            <NearbyOffers nearbyOffers={nearbyOffers} onCardHover={setSelectedPoint} />
          </div>
        )}
      </main>
    </div>
  );
}

export { OfferPage };