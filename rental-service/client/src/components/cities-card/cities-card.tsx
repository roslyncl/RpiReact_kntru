import { AppRoute } from "../../const";
import { Link } from "react-router-dom";
import { useAppDispatch } from '../../hooks';
import { toggleFavoriteAction } from '../../store/api-action';

type CitiesCardProps = {
  id: string;
  title: string;
  type: string;
  price: number;
  isPremium: boolean;
  previewImage: string;
  rating: number;
  cardType?: 'cities' | 'near-places' | 'favorites'; 
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isFavorite?: boolean;
}

function CitiesCard({ 
  id, 
  title, 
  type, 
  price, 
  previewImage, 
  isPremium, 
  rating,
  cardType = 'cities', 
  onMouseEnter,
  onMouseLeave,
  isFavorite = false,
}: CitiesCardProps) {
  const dispatch = useAppDispatch();
  
  const cardClass = cardType === 'near-places' 
    ? 'near-places__card place-card' 
    : cardType === 'favorites'
      ? 'favorites__card place-card'
      : 'cities__card place-card';
  
  const imageWrapperClass = cardType === 'near-places'
    ? 'near-places__image-wrapper place-card__image-wrapper'
    : cardType === 'favorites'
      ? 'favorites__image-wrapper place-card__image-wrapper'
      : 'cities__image-wrapper place-card__image-wrapper';

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newStatus = isFavorite ? 0 : 1;
    dispatch(toggleFavoriteAction({ offerId: id, status: newStatus }));
  };

  return(
    <article 
      className={cardClass} 
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}
      <div className={imageWrapperClass}>
        <Link to={`${AppRoute.Offer}/${id}`}>
          <img className="place-card__image" src={previewImage} width="260" height="200" alt="Place image"/>
        </Link>
      </div>
      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button 
            className={`place-card__bookmark-button button ${isFavorite ? 'place-card__bookmark-button--active' : ''}`} 
            type="button"
            onClick={handleFavoriteClick}
          >
            <svg 
              className="place-card__bookmark-icon" 
              width="18" 
              height="19" 
              viewBox="0 0 18 19" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M3.5 2C2.94772 2 2.5 2.44772 2.5 3V16.0528C2.5 16.4031 2.82027 16.6611 3.14645 16.5238L8.64645 14.135C8.8646 14.0436 9.1354 14.0436 9.35355 14.135L14.8536 16.5238C15.1797 16.6611 15.5 16.4031 15.5 16.0528V3C15.5 2.44772 15.0523 2 14.5 2H3.5Z" 
                fill={isFavorite ? "#4481C3" : "none"}
                stroke={isFavorite ? "#4481C3" : "#C4C4C4"}
                strokeWidth="1.5"
              />
            </svg>
            <span className="visually-hidden">
              {isFavorite ? 'In bookmarks' : 'To bookmarks'}
            </span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{width: `${(rating / 5) * 100}%`}}></span>
            <span className="visually-hidden">Rating: {rating}</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={`${AppRoute.Offer}/${id}`}>
            {title}
          </Link>
        </h2>
        <p className="place-card__type">{type}</p>
      </div>
    </article>
  );
}

export { CitiesCard };