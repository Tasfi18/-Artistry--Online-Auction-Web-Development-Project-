import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auctions.css'; 
import axios from 'axios';

import wallowingBreeze from '../assets/images/wallowing-breeze.png';
const Auctions = () => {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 


/*
import wallowingBreeze from '../assets/images/wallowing-breeze.png'; // Adjust the path based on your folder structure
import jResistance from '../assets/images/j-resistance.png';
import warmBasket from '../assets/images/warm-basket.png';
import theVonnegut from '../assets/images/the-vonnegut.png';

const auctionItems = [
  { id: 1, image: wallowingBreeze, title: 'Wallowing Breeze', artist: 'Hettie Richards', year: '2008', medium: 'Oil on canvas', size: '26 in x 23 in', price: '$620' },
  { id: 2, image: jResistance, title: 'J Resistance', artist: 'Ria Arante', year: '2018', medium: 'Gouache on paper', price: '$620' },
  { id: 3, image: warmBasket, title: 'Warm Basket', artist: 'Flora Powers', year: '2014', medium: 'Acrylic on wood', price: '$620' },
  { id: 4, image: theVonnegut, title: 'The Vonnegut', artist: 'Ria Arante', year: '2017', medium: 'Oil on canvas', price: '$620' },
];

*/

  useEffect(() => {
    const fetchAllAuctions = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/auctions/active");
        setAuctions(res.data); 
        console.log(res.data); 
        setLoading(false); 
      } catch (err) {
        console.log(err); 
        setLoading(false);
      }
    };
    fetchAllAuctions();
  }, []);
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }

  const handleAuctionClick = (id,Status) => {

      if(Status == 'active') {
        navigate(`/auction/${id}`); 
      }
        
      else{
        //alert("This Auction is still pending!!")
        alert("Auction is not online yet.")
      }
        

  };
  
  const handleArtistClick = (id) => {
    navigate(`/public/artist/${id}`); 
  };

  return (
    <div className="auctions-container">
      <h2>Current Auctions</h2>
      <div className="auctions-grid">
        {auctions.length > 0 ? (
          auctions.map(item => (
            <div key={item.AuctionID} className="auction-item">
              <div onClick={() => handleAuctionClick(item.AuctionID,item.AuctionStatus)} className="auction-image-container">
                <img 
                
                  src={item.ImageURL}  
                  //src="../images/wallowing-breeze.png"
                  //src = {wallowingBreeze}
                  alt={item.Title} 
                  className="auction-image" 
                />
              </div>
              <div className="auction-details">
                <h3 onClick={() => handleAuctionClick(item.AuctionID)}>{item.Title}</h3>
                <h3 onClick={() => handleArtistClick(item.ArtistID)}>Artist: {item.ArtistName}</h3>
                <p>Status: {item.AuctionStatus}</p>
                <p>Starting Bid: ${item.StartingBid}</p>
                <p>Highest Bid: ${item.HighestBid ? item.HighestBid : 'No bids yet'}</p>
              
              <button className="bid-button" onClick={() => handleAuctionClick(item.AuctionID,item.AuctionStatus)}>
                BID
              </button>
              </div>
            </div>
          ))
        ) : (
          <p>No active auctions available.</p>
        )}
      </div>
    </div>
  );
};

export default Auctions;
