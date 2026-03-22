// main-page.tsx
import { CitiesCardList } from "../../components/cities-card-list/cities-card-list";
import { Map } from "../../components/map/map";
import { CitiesList } from "../../components/cities-list/cities-list"; 
import { SortOptions } from "../../components/sort-options/sort-options"; 
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { getOffersByCity} from "../../utils"; 
import { OfferList } from "../../types/offer";
import { SortOffer } from "../../types/sort"; 
import { sortOffersByType } from "../../utils";
import { Header } from "../../components/header/header";
import { Link, useNavigate } from 'react-router-dom';

function MainPage() {
    const dispatch = useAppDispatch(); 
    const navigate = useNavigate(); 

    const selectedCity = useAppSelector((state) => state.city);
    const offersList = useAppSelector((state) => state.offers);
    const authorizationStatus = useAppSelector((state) => state.authorizationStatus);
    const user = useAppSelector((state) => state.user);

    const selectedCityOffers = getOffersByCity(selectedCity?.name || '', offersList);
    const rentalOffersCount = selectedCityOffers.length;
    
    const favoriteCount = useAppSelector((state) => state.favoriteOffers.length);
    
    const [selectedOffer, setSelectedOffer] = useState<OfferList | null>(null);
    const [activeSort, setActiveSort] = useState<SortOffer>('Popular');
    
    const handleCardHover = (offer: OfferList | null) => {
        setSelectedOffer(offer);
    };

    const sortedOffers = sortOffersByType([...selectedCityOffers], activeSort);

    return (
        <div className="page page--gray page--main">
            <Header /> 

            <main className="page__main page__main--index">
                <h1 className="visually-hidden">Cities</h1>
                <div className="tabs">
                    <section className="locations container">
                        <CitiesList selectedCity={selectedCity} />
                    </section>
                </div>
                <div className="cities">
                    <div className="cities__places-container container">
                        <section className="cities__places places">
                            <h2 className="visually-hidden">Places</h2>
            
                            <b className="places__found">
                                {rentalOffersCount} places to stay in {selectedCity?.name || 'Amsterdam'}
                            </b>
                            
                            <SortOptions 
                                activeSorting={activeSort} 
                                onChange={(newSorting) => setActiveSort(newSorting)}
                            />
                            
                            <CitiesCardList 
                                offersList={sortedOffers} 
                                onCardHover={handleCardHover}
                            />
                        </section>
                        <div className="cities__right-section">
                            <Map 
                                city={selectedCity}
                                points={sortedOffers} 
                                selectedPoint={selectedOffer}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export { MainPage };