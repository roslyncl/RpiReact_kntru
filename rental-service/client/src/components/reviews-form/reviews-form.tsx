import React, { JSX, useState, ChangeEvent, FormEvent } from "react";
import { ReviewSettings } from '../../const';

type ReviewsFormProps = {
  onReviewSubmit: (reviewData: { comment: string; rating: number }) => void;
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
      await onReviewSubmit({
        comment: formData.review,
        rating: parseInt(formData.rating, 10)
      });
      
      setFormData({
        rating: '',
        review: ''
      });
      
      console.log('Отзыв успешно отправлен');
    } catch (error) {
      console.error('Ошибка при отправке отзыва:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentRating = formData.rating ? parseInt(formData.rating, 10) : 0;
  const reviewLength = formData.review.length;
  const isRatingSelected = formData.rating !== '';
  const isReviewLongEnough = reviewLength >= ReviewSettings.MIN_LENGTH;
  const isReviewNotTooLong = reviewLength <= ReviewSettings.MAX_LENGTH;
  const isFormValid = isRatingSelected && isReviewLongEnough && isReviewNotTooLong;

  const getReviewLengthMessage = () => {
    if (reviewLength === 0) return `Enter at least ${ReviewSettings.MIN_LENGTH} characters`;
    if (reviewLength < ReviewSettings.MIN_LENGTH) return `Need ${ReviewSettings.MIN_LENGTH - reviewLength} more characters`;
    if (reviewLength > ReviewSettings.MAX_LENGTH) return `Exceeded by ${reviewLength - ReviewSettings.MAX_LENGTH} characters`;
    return '✓ Good length';
  };

  const getReviewLengthColor = () => {
    if (reviewLength === 0) return '#999';
    if (reviewLength < ReviewSettings.MIN_LENGTH) return '#ff6b6b';
    if (reviewLength > ReviewSettings.MAX_LENGTH) return '#ff6b6b';
    return '#4caf50';
  };

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
      
      <div style={{ position: 'relative', marginBottom: '10px' }}>
        <textarea
          className="reviews__textarea form__textarea"
          id="review"
          name="review"
          placeholder="Tell how was your stay, what you like and what can be improved"
          value={formData.review}
          onChange={handleReviewChange}
          minLength={ReviewSettings.MIN_LENGTH}
          maxLength={ReviewSettings.MAX_LENGTH}
          disabled={isSubmitting}
          style={{
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'text',
            borderColor: reviewLength > 0 && reviewLength < ReviewSettings.MIN_LENGTH ? '#ff6b6b' : 
                        reviewLength > ReviewSettings.MAX_LENGTH ? '#ff6b6b' : 
                        reviewLength >= ReviewSettings.MIN_LENGTH ? '#4caf50' : '#e6e6e6',
            borderWidth: '2px',
            transition: 'border-color 0.3s'
          }}
        />
        
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          backgroundColor: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 'bold',
          color: getReviewLengthColor(),
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {reviewLength}/{ReviewSettings.MAX_LENGTH}
        </div>
      </div>
      
      <div style={{
        marginBottom: '15px',
        fontSize: '13px',
        color: getReviewLengthColor(),
        fontWeight: reviewLength > 0 && reviewLength < ReviewSettings.MIN_LENGTH ? 'bold' : 'normal'
      }}>
        {getReviewLengthMessage()}
      </div>
      
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set <span className="reviews__star">rating</span> and describe your stay with at least <b className="reviews__text-amount">{ReviewSettings.MIN_LENGTH} characters</b> and no more than <b className="reviews__text-amount">{ReviewSettings.MAX_LENGTH} characters</b>.
        </p>
        
        <div style={{ marginBottom: '10px', fontSize: '13px' }}>
          {!isRatingSelected && <div style={{ color: '#ff6b6b' }}>✓ Please select a rating</div>}
          {!isReviewLongEnough && reviewLength > 0 && 
            <div style={{ color: '#ff6b6b' }}>✓ Need {ReviewSettings.MIN_LENGTH - reviewLength} more characters</div>}
          {reviewLength === 0 && <div style={{ color: '#999' }}>✓ Enter your review</div>}
        </div>
        
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={!isFormValid || isSubmitting}
          style={{
            opacity: (!isFormValid || isSubmitting) ? 0.5 : 1,
            cursor: (!isFormValid || isSubmitting) ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}

export { ReviewsForm };