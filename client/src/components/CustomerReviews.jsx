import React from 'react';
import { useNavigate } from 'react-router-dom';

const reviews = [
  { name: "John Doe", comment: "Amazing collection!", rating: 5 },
  { name: "Anna Smith", comment: "Loved the auction experience.", rating: 4 },
];

const CustomerReviews = () => {
  const navigate = useNavigate();

  return (
    <section className="customer-reviews">
      <h2>Customer Reviews</h2>
      <div className="reviews">
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <p><strong>{review.name}</strong></p>
            <p>{`"${review.comment}"`}</p>
            <p>Rating: {`${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}`}</p>
          </div>
        ))}
      </div>
      <button className="view-more-btn" onClick={() => navigate('/reviews')}>
        Read More Reviews
      </button>
    </section>
  );
};

export default CustomerReviews;
