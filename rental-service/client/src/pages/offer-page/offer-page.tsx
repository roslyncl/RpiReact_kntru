import { Logo } from "../../components/logo/logo";
import { FullOffer, OfferList } from "../../types/offer";
import { NotFoundPage } from "../not-found-page/not-found-page";
import { useParams } from "react-router-dom";
import { ReviewsForm } from "../../components/reviews-form/reviews-form";
import { ReviewsList } from "../../components/review-list/review-list";
import { reviews } from "../../mocks/reviews";
import { Map } from "../../components/map/map"; 
import { useState } from "react"; 
import { offers as mockOffers } from "../../mocks/offers";
import { NearbyOffers } from "../../components/nearby-offers/nearby-offers"; 

type OfferProps = {
  offers: FullOffer[];
}

function OfferPage({ offers }: OfferProps){
  const params = useParams();
  const offer = offers.find((item) => item.id === params.id);
  const [selectedPoint, setSelectedPoint] = useState<OfferList | null>(null);
  
  if (!offer){
    return <NotFoundPage/>;
  }

  const mockNearbyOffers: OfferList[] = mockOffers
    .filter(item => item.id !== offer.id)
    .slice(0, 3)
    .map(fullOffer => ({
      id: fullOffer.id,
      title: fullOffer.title,
      type: fullOffer.type,
      price: fullOffer.price,
      city: fullOffer.city,
      location: fullOffer.location,
      isFavorite: fullOffer.isFavorite,
      isPremium: fullOffer.isPremium,
      rating: fullOffer.rating,
      previewImage: fullOffer.images[0] || 'img/apartment-01.jpg'
    }));

  const currentOfferForMap: OfferList = {
    id: offer.id,
    title: offer.title,
    type: offer.type,
    price: offer.price,
    city: offer.city,
    location: offer.location,
    isFavorite: offer.isFavorite,
    isPremium: offer.isPremium,
    rating: offer.rating,
    previewImage: offer.images[0] || 'img/apartment-01.jpg'
  };

  const allMapPoints = [currentOfferForMap, ...mockNearbyOffers];

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
                  <a className="header__nav-link header__nav-link--profile" href="#">
                    <div className="header__avatar-wrapper user__avatar-wrapper">
                    </div>
                    <span className="header__user-name user__name">Myemail@gmail.com</span>
                    <span className="header__favorite-count">3</span>
                  </a>
                </li>
                <li className="header__nav-item">
                  <a className="header__nav-link" href="#">
                    <span className="header__signout">Sign out</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {offer.images.map((image) => (
                <div key={image} className="offer__image-wrapper">
                  <img className="offer__image" src={image} alt="Photo studio" />
                </div>
              ))}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              {offer.isPremium ? (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              ) : null}
              
              <div className="offer__name-wrapper">
                <h1 className="offer__name">
                  {offer.title}
                </h1>
                <button className="offer__bookmark-button button" type="button">
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use href="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button>
              </div>
              
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{width: `${(offer.rating / 5) * 100}%`}}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{offer.rating}</span>
              </div>
              
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {offer.type}
                </li>
                <li className="offer__feature offer__feature--bedrooms">
                  {offer.bedrooms} Bedrooms
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max {offer.maxAdults} adults
                </li>
              </ul>
              
              <div className="offer__price">
                <b className="offer__price-value">&euro;{offer.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {offer.goods.map((good) => (
                    <li key={good} className="offer__inside-item">
                      {good}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                <div className="offer__host-user user">
                  <div className={`offer__avatar-wrapper ${offer.host.isPro ? 'offer__avatar-wrapper--pro' : ''} user__avatar-wrapper`}>
                    <img className="offer__avatar user__avatar" src={offer.host.avatarUrl} width="74" height="74" alt="Host avatar" />
                  </div>
                  <span className="offer__user-name">
                    {offer.host.name}
                  </span>
                  {offer.host.isPro ? (
                    <span className="offer__user-status">Pro</span>
                  ) : null}
                </div>
                <div className="offer__description">
                  <p className="offer__text">
                    {offer.description}
                  </p>
                </div>
              </div>
              
              <ReviewsList reviews={reviews} />
              
              <ReviewsForm />
            </div>
          </div>
          
          <section className="offer__map map">
            <Map 
              city={offer.city}
              points={allMapPoints}
              selectedPoint={selectedPoint}
            />
          </section>
        </section>
        
        <div className="container">
          <NearbyOffers 
            nearbyOffers={mockNearbyOffers}
            onCardHover={setSelectedPoint}
          />
        </div>
      </main>
    </div>
  );
}

export { OfferPage };