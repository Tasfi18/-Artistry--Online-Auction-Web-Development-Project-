import React from 'react';
import { useNavigate } from 'react-router-dom';

const artists = [
  { name: "Mike Lambert", location: "Texas", image: "/images/artist1.webp" },
  { name: "Eugenia Cohen", location: "Amsterdam", image: "/images/artist2.jpg" },
];

const FeaturedArtists = () => {
  const navigate = useNavigate();

  return (
    <section className="featured-artists">
      <h2>Featured Artists</h2>
      <div className="artist-grid">
        {artists.map((artist, index) => (
          <div key={index} className="artist-card">
            <img src={artist.image} alt={artist.name} />
            <h3>{artist.name}</h3>
            <p>{artist.location}</p>
          </div>
        ))}
      </div>
      <button className="view-more-btn" onClick={() => navigate('/artists')}>
        Explore Artists
      </button>
    </section>
  );
};

export default FeaturedArtists;
