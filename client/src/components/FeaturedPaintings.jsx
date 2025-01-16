import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import painting1 from '../assets/images/painting1.jpg'; 
import painting2 from '../assets/images/painting2.jpg';
import painting3 from '../assets/images/painting3.jpg';

const paintings = [
  { title: "Innocence", artist: "Ria Arante", image: painting1 },
  { title: "Wallowing Breeze", artist: "Hettie Richards", image: painting2 },
  { title: "J Resistance", artist: "Ria Arante", image: painting3 },
];

const FeaturedPaintings = () => {
  const navigate = useNavigate(); 

  return (
    <section className="featured-paintings">
      <h2>Featured Paintings</h2>
      <div className="paintings-grid">
        {paintings.map((painting, index) => (
          <div key={index} className="painting-card">
            <img src={painting.image} alt={painting.title} />
            <h3>{painting.title}</h3>
            <p>by {painting.artist}</p>
          </div>
        ))}
      </div>
      <button className="view-more-btn" onClick={() => navigate('/paintings')}>
        View More Paintings
      </button>
    </section>
  );
};

export default FeaturedPaintings;
