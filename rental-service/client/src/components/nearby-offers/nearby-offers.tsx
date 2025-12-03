import {JSX} from 'react';
import { OfferList } from "../../types/offer";
import { CitiesCardList } from "../cities-card-list/cities-card-list";

type NearbyOffersProps = {
  nearbyOffers: OfferList[];
  onCardHover?: (offer: OfferList | null) => void;
};

function NearbyOffers({ nearbyOffers, onCardHover }: NearbyOffersProps): JSX.Element {
  return (
    <section className="near-places places">
      <h2 className="near-places__title">Other places in the neighbourhood</h2>
      <CitiesCardList 
        offersList={nearbyOffers} 
        cardType="near-places"
        onCardHover={onCardHover}
      />
    </section>
  );
}

export { NearbyOffers };