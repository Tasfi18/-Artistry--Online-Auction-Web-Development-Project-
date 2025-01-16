import React from 'react';
import { useNavigate } from 'react-router-dom';

const ExploreOptions = () => {
  const navigate = useNavigate();

  return (
    <section className="explore-options">
      <h2>Explore Our Collections</h2>
      <div className="explore-buttons">
        <button className="explore-btn" onClick={() => navigate('/rare-things')}>
          Rare Things
        </button>
        <button className="explore-btn" onClick={() => navigate('/paintings')}>
          Paintings
        </button>
        <button className="explore-btn" onClick={() => navigate('/drawings')}>
          Drawings
        </button>
        <button className="explore-btn" onClick={() => navigate('/sculpture')}>
          Sculpture
        </button>
        <button className="explore-btn" onClick={() => navigate('/artists')}>
          Artists
        </button>
      </div>
    </section>
  );
};

export default ExploreOptions;
