import { CitiesCardList } from "../../components/cities-card-list/cities-card-list";
import { Logo } from "../../components/logo/logo";
import { Map } from "../../components/map/map";
import { CitiesList } from "../../components/cities-list/cities-list"; 
import { SortOptions } from "../../components/sort-options/sort-options"; 
import { useState } from "react";
import { useAppSelector } from "../../hooks"; 
import { getOffersByCity} from "../../utils"; 
import { OfferList } from "../../types/offer";
import { SortOffer } from "../../types/sort"; 
import { sortOffersByType } from "../../utils";
import { Link } from 'react-router-dom';
import { AppRoute } from '../../const';

function MainPage() {
    const selectedCity = useAppSelector((state) => state.city);
    const offersList = useAppSelector((state) => state.offers);
    
    const selectedCityOffers = getOffersByCity(selectedCity?.name || '', offersList);
    const rentalOffersCount = selectedCityOffers.length;
    
    const favoriteCount = offersList.filter(offer => offer.isFavorite).length;
    
    const [selectedOffer, setSelectedOffer] = useState<OfferList | null>(null);
    const [activeSort, setActiveSort] = useState<SortOffer>('Popular');
    
    const handleCardHover = (offer: OfferList | null) => {
        setSelectedOffer(offer);
    };

    const sortedOffers = sortOffersByType(selectedCityOffers, activeSort);

    return (
        <div className="page page--gray page--main">
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
                                            <img src="/img/avatar.jpg" alt="User avatar" />
                                        </div>
                                        <span className="header__user-name user__name">Myemail@gmail.com</span>
                                        <span className="header__favorite-count">{favoriteCount}</span>
                                    </Link>
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