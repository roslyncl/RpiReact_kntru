import { OfferList } from '../../types/offer';
import { FavoriteCard } from '../favorite-card/favorite-card';

type FavoriteCardListProps = {
  offers: OfferList[];
  city: string;
}

function FavoriteCardList({ offers, city }: FavoriteCardListProps): JSX.Element {
  return (
    <li className="favorites__locations-items">
      <div className="favorites__locations locations locations--current">
        <div className="locations__item">
          <a className="locations__item-link" href="#">
            <span>{city}</span>
          </a>
        </div>
      </div>
      <div className="favorites__places">
        {offers.map((offer) => (
          <FavoriteCard
            key={offer.id}
            id={offer.id}
            title={offer.title}
            type={offer.type}
            price={offer.price}
            previewImage={offer.previewImage}
            isPremium={offer.isPremium}
            rating={offer.rating}
            city={city}
          />
        ))}
      </div>
    </li>
  );
}

export { FavoriteCardList };