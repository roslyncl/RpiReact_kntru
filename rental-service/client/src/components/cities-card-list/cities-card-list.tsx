import { OfferList } from "../../types/offer";
import { CitiesCard } from "../cities-card/cities-card";

type CitiesCardListProps = {
    offersList: OfferList[];
    cardType?: 'cities' | 'near-places' | 'favorites';
    onCardHover?: (offer: OfferList | null) => void;
};

function CitiesCardList({ offersList, cardType = 'cities', onCardHover }: CitiesCardListProps) {
    const listClass = cardType === 'near-places'
        ? 'near-places__list places__list'
        : cardType === 'favorites'
            ? 'favorites__places'
            : 'cities__places-list places__list tabs__content';

    return (
        <div className={listClass}>
            {offersList.map((offer) => (
                <CitiesCard 
                    key={offer.id} 
                    id={offer.id} 
                    title={offer.title} 
                    type={offer.type} 
                    price={offer.price}
                    previewImage={offer.previewImage} 
                    isPremium={offer.isPremium} 
                    rating={offer.rating}
                    cardType={cardType}
                    onMouseEnter={() => onCardHover && onCardHover(offer)}
                    onMouseLeave={() => onCardHover && onCardHover(null)}
                />
            ))}
        </div>
    );
}

export { CitiesCardList };