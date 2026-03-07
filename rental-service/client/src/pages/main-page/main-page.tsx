import { CitiesCardList } from "../../components/cities-card-list/cities-card-list";
import { Logo } from "../../components/logo/logo";
import { Map } from "../../components/map/map";
import { CitiesList } from "../../components/cities-list/cities-list"; 
import { SortOptions } from "../../components/sort-options/sort-options"; 
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { getOffersByCity} from "../../utils"; 
import { OfferList } from "../../types/offer";
import { SortOffer } from "../../types/sort"; 
import { sortOffersByType } from "../../utils";
import { Link, useNavigate } from 'react-router-dom'; 
import { AppRoute, AuthorizationStatus } from '../../const'; 
import { logoutAction } from '../../store/api-action'; 

const getAvatarUrl = (avatarPath: string | null | undefined): string => {
  if (!avatarPath) return '/img/avatar.svg';
  if (avatarPath.startsWith('http')) return avatarPath;
  return `http://localhost:5000${avatarPath}`;
};

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

    const handleLogout = () => {
        dispatch(logoutAction());
        navigate(AppRoute.Main);
    };

    const isAuthorized = authorizationStatus === AuthorizationStatus.Auth;

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
                                {isAuthorized ? ( 
                                    <>
                                        <li className="header__nav-item user">
                                            <Link 
                                                className="header__nav-link header__nav-link--profile" 
                                                to={AppRoute.Favorites}
                                            >
                                                <div className="header__avatar-wrapper user__avatar-wrapper">
                                                    <img 
                                                        src={getAvatarUrl(user?.avatar)} 
                                                        alt="User avatar"
                                                        style={{ borderRadius: '50%', width: '20px', height: '20px', objectFit: 'cover' }}
                                                    />
                                                </div>
                                                <span className="header__user-name user__name">
                                                    {user?.email || 'User'}
                                                </span>
                                                <span className="header__favorite-count">{favoriteCount}</span>
                                            </Link>
                                        </li>
                                        <li className="header__nav-item">
                                            <Link 
                                                className="header__nav-link" 
                                                to="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleLogout();
                                                }}
                                            >
                                                <span className="header__signout">Sign out</span>
                                            </Link>
                                        </li>
                                    </>
                                ) : ( 
                                    <li className="header__nav-item user">
                                        <Link 
                                            className="header__nav-link header__nav-link--profile" 
                                            to={AppRoute.Login}
                                        >
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