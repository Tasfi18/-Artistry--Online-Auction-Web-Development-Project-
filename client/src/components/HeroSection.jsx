import React from 'react';
import './HeroSection.css';
import gifImage from '../assets/gifs/giphy.gif'; 

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Where Art Meets Passion</h1>
          <p>Bid, Curate, and Inspire Aesthetic Excellence.</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
