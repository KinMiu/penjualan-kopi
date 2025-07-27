/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';
import { Rating } from '@mui/material';
import './Review.css';

const Review = ({ product, submitReviewToggle }) => {
  const { user } = useSelector(state => state.user);
  const rate = product.ratings?.toFixed(1);

  const options = {
    value: parseFloat(rate),
    size: 'large',
    readOnly: true,
    precision: 0.5,
  };

  return (
    <section className='review-section container'>
      <div className='review-header'>
        <h2>Apa kata mereka?</h2>
        <input type='text' placeholder='Cari ulasan...' className='review-search' />
      </div>

      <div className='review-body'>
        <div className='review-summary-box'>
          <h3>Ulasan Konsumen</h3>
          <div className='review-score'>
            <Rating {...options} />
            <span>({rate} dari 5)</span>
          </div>
          <p>Bagikan pengalamanmu tentang kopi ini.</p>
          <button onClick={submitReviewToggle} className='review-button'>Tulis Ulasan</button>
        </div>

        <div className='review-details'>
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review) => (
              <div key={review._id} className='single-review'>
                <div className='review-user'>
                  <img
                    src='https://www.pngall.com/wp-content/uploads/5/Profile.png'
                    alt='user avatar'
                    className='review-avatar'
                  />
                  <div>
                    <p className='review-user-name'>{review.name}</p>
                    <Rating value={review.rating} readOnly precision={0.5} size='small' />
                  </div>
                </div>
                <p className='review-comment'>{review.comment}</p>
              </div>
            ))
          ) : (
            <p className='no-review'>Belum ada ulasan. Jadilah yang pertama!</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Review;
