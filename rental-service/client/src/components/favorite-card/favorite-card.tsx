import { JSX } from 'react';
import { Link } from 'react-router-dom';
import { AppRoute } from '../../const';
import { useAppDispatch } from '../../hooks';
import { toggleFavoriteAction } from '../../store/api-action';

type FavoriteCardProps = {
  id: string;
  title: string;
  type: string;
  price: number;
  previewImage: string;
  isPremium: boolean;
  rating: number;
  city: string;
}

function FavoriteCard({ id, title, type, price, previewImage, isPremium, rating, city }: FavoriteCardProps): JSX.Element {
  const dispatch = useAppDispatch();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavoriteAction({ offerId: id, status: 0 })); // 0 = удалить из избранного
  };

  return (
    <article className="favorites__card place-card">
      {isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}
      <div className="favorites__image-wrapper place-card__image-wrapper">
        <Link to={`${AppRoute.Offer}/${id}`}>
          <img 
            className="place-card__image" 
            src={previewImage} 
            width="150" 
            height="110" 
            alt={title} 
          />
        </Link>
      </div>
      <div className="favorites__card-info place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button 
            className="place-card__bookmark-button place-card__bookmark-button--active button" 
            type="button"
            onClick={handleFavoriteClick}
          >
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">In bookmarks</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{width: `${(rating / 5) * 100}%`}}></span>
            <span className="visually-hidden">Rating</span>
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

export { FavoriteCard };