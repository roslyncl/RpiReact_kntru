import { OfferList } from "../../types/offer";
import { CitiesCard } from "../cities-card/cities-card";

type CitiesCardListProps = {
    offersList: OfferList[];
};

function CitiesCardList({ offersList }: CitiesCardListProps) {
    return (
        <div className="cities__places-list places__list tabs__content">
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
                />
            ))}
        </div>
    );
}

export { CitiesCardList };