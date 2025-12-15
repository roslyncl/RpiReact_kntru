import { AppRoute } from "../../const";
import { Link } from "react-router-dom";

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
  onFavoriteClick?: () => void;
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
  onFavoriteClick
}: CitiesCardProps) {
  
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
    onFavoriteClick?.();
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
        <Link to={ `${AppRoute.Offer}/${id}` }>
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
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use href="/img/sprite.svg#icon-bookmark"></use>
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
          <Link to={ `${AppRoute.Offer}/${id}` }>
            {title}
          </Link>
        </h2>
        <p className="place-card__type">{type}</p>
      </div>
    </article>
  );
}

export { CitiesCard };