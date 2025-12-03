import {JSX} from 'react';
import { ReviewItem } from '../review-item/review-item';

type Review = {
  id: string;
  date: string;
  user: {
    name: string;
    avatarUrl: string;
  };
  comment: string;
  rating: number;
};

type ReviewsListProps = {
  reviews: Review[];
};

function ReviewsList({ reviews }: ReviewsListProps): JSX.Element {
  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <section className="offer__reviews reviews">
      <h2 className="reviews__title">
        Reviews · <span className="reviews__amount">{reviews.length}</span>
      </h2>
      <ul className="reviews__list">
        {sortedReviews.map((review) => (
          <ReviewItem 
            key={review.id} 
            review={review} 
          />
        ))}
      </ul>
    </section>
  );
}

export { ReviewsList };