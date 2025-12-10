import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../hooks';
import { changeCity } from '../../store/action';
import { AppRoute, CITIES_LOCATION } from '../../const';
import { CityOffer } from '../../types/offer';

type CitiesListProps = {
    selectedCity: CityOffer| undefined;
}

function CitiesList({ selectedCity}: CitiesListProps) {
    const dispatch = useAppDispatch();
    return (
        <ul className="locations__list tabs__list">
            { CITIES_LOCATION.map((city) => (
                <li key={ city.name } className="locations__item" onClick={ () => {
                    dispatch(changeCity(city));
                }}
                >
                    <Link className={`${city.name === selectedCity?.name ?
                        'tabs__item--active' : 'tabs_item--disable'} locations__item-link tabs_item` } to={AppRoute.Main}>
                            <span>{ city.name }</span>
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export { CitiesList };
