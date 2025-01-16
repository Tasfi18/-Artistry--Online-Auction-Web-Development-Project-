import './ViewAuctionDetails.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

const ViewAuctionDetails = () => {
  const { loggedinfo} = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [auction, setAuction] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/auctions/${id}`);
        setAuction(response.data[0]); 
        setLoading(false);
      } catch (err) {
        setError('Error fetching auction details');
        setLoading(false);
      }
    };

    fetchAuctionDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleArtistClick = (artistId) => {
    navigate(`/public/artist/${artistId}`);
  };

  const handleBid = () => {
    if (loggedinfo.Status == 1 && loggedinfo.UserType == "buyer"){
      navigate(`/auction-bidding/${auction.AuctionID}`);
      
    }
    else{
      alert("LOGIN OR SIGNUP AS A BUYER!!!")
      navigate(`/signup`);
    }
    
  };

  return (
    <div className="auction-details">
      <h1>Auction Details</h1>
      {auction && (
        <>
          <img src={auction.ImageURL} alt={auction.Title} width="300" />
          <h2>{auction.Title}</h2>
          <h3 onClick={() => handleArtistClick(auction.ArtistID)}>Artist: {auction.ArtistName}</h3>
          <p><strong>Description:</strong> {auction.Description}</p>
          <p><strong>Start Time:</strong> {new Date(auction.StartTime).toLocaleString()}</p>
          <p><strong>End Time:</strong> {new Date(auction.EndTime).toLocaleString()}</p>
          <p><strong>Starting Bid:</strong> ${auction.StartingBid}</p>
          <p><strong>Highest Bid:</strong> ${auction.HighestBid}</p>
          <p><strong>Status:</strong> {auction.AuctionStatus}</p>

          <button className="bid-button" onClick={handleBid}>BID</button>
        </>
      )}
    </div>
  );
};

export default ViewAuctionDetails;