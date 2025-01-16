import React from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import  "../Index.css"; 


import auction1 from '../assets/images/auction1.png';
import auction2 from '../assets/images/auction2.png';

const auctionImages = [
  { image: auction1, title: "Bids rise, beauty unveiled" },
  { image: auction2, title: "Souls stirred, desires trailed" },
];

const OpenAuctions = () => {
  const navigate = useNavigate();

  const settings = {
    dots: false,
    infinite: true,
    speed: 10,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    fade: true,
  };

  return (
    <section className="open-auctions">
      <h2>Auctions</h2>
      <Slider {...settings}>
        {auctionImages.map((auction, index) => (
          <div key={index} className="auction-slide" onClick={() => navigate('/auctions')}>
            <div className="image-container">
            <img src={auction.image} alt={auction.title} className="auction-image" />
            <span className="overlay-text">click here to view auctions</span>
            </div>
            <h3>{auction.title}</h3>
          </div>
        ))}
      </Slider>
      
      <button className="view-more-btn" onClick={() => navigate('/auctions')}>
        View Auctions
      </button>
    </section>
  );
};

export default OpenAuctions;