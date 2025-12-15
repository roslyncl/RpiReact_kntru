import React, { JSX, useState, ChangeEvent, FormEvent } from "react";

type ReviewUser = {
  name: string;
  avatarUrl: string;
  isPro: boolean;
};

type ReviewsFormProps = {
  onReviewSubmit: (reviewData: { comment: string; rating: number; user: ReviewUser }) => void;
};

function ReviewsForm({ onReviewSubmit }: ReviewsFormProps): JSX.Element {
  const [formData, setFormData] = useState({
    rating: '',
    review: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      rating: event.target.value
    });
  };

  const handleReviewChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      review: event.target.value
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!isFormValid) return;
    
    setIsSubmitting(true);
    
    try {
      const newReview = {
        user: {
          name: "Myemail@gmail.com",
          avatarUrl: "/img/avatar.jpg",
          isPro: false
        },
        comment: formData.review,
        rating: parseInt(formData.rating, 10)
      };
      
      onReviewSubmit(newReview);
      
      setFormData({
        rating: '',
        review: ''
      });
      
      console.log('Отзыв успешно отправлен:', newReview);
    } catch (error) {
      console.error('Ошибка при отправке отзыва:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentRating = formData.rating ? parseInt(formData.rating, 10) : 0;
  const isFormValid = formData.rating !== '' && formData.review.length >= 50 && formData.review.length <= 300;

  return (
    <form className="reviews__form form" action="#" method="post" onSubmit={handleSubmit}>
      <label className="reviews__label form__label" htmlFor="review">Your review</label>
      
      <div className="reviews__rating-form form__rating">
        {[5, 4, 3, 2, 1].map((star) => {
          const isSelected = formData.rating === star.toString();
          const shouldBeFilled = currentRating >= star;
          
          return (
            <React.Fragment key={star}>
              <input
                className="form__rating-input visually-hidden"
                name="rating"
                value={star.toString()}
                id={`${star}-stars`}
                type="radio"
                checked={isSelected}
                onChange={handleRatingChange}
                disabled={isSubmitting}
              />
              <label
                htmlFor={`${star}-stars`}
                className="reviews__rating-label form__rating-label"
                title={['terribly', 'badly', 'not bad', 'good', 'perfect'][5 - star]}
              >
                <img 
                  src={shouldBeFilled ? "/img/star-active.svg" : "/img/star.svg"} 
                  className="form__star-image" 
                  width="37" 
                  height="33" 
                  alt={`${star} stars`}
                  style={{
                    display: 'block',
                    transition: 'opacity 0.2s',
                    opacity: isSubmitting ? 0.5 : 1
                  }}
                />
              </label>
            </React.Fragment>
          );
        })}
      </div>
      
      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        value={formData.review}
        onChange={handleReviewChange}
        minLength={50}
        maxLength={300}
        disabled={isSubmitting}
        style={{
          opacity: isSubmitting ? 0.7 : 1,
          cursor: isSubmitting ? 'not-allowed' : 'text'
        }}
      />
      
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set <span className="reviews__star">rating</span> and describe your stay with at least <b className="reviews__text-amount">50 characters</b> and no more than <b className="reviews__text-amount">300 characters</b>.
          <br />
          <span 
            className="reviews__char-count"
            style={{
              color: formData.review.length > 300 ? 'red' : 
                     formData.review.length >= 50 ? 'green' : 'gray',
              fontSize: '14px',
              display: 'block',
              marginTop: '5px'
            }}
          >
            {formData.review.length}/300 characters
            {formData.review.length < 50 && ` (need ${50 - formData.review.length} more)`}
          </span>
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={!isFormValid || isSubmitting}
          style={{
            opacity: (!isFormValid || isSubmitting) ? 0.5 : 1,
            cursor: (!isFormValid || isSubmitting) ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}

export { ReviewsForm };