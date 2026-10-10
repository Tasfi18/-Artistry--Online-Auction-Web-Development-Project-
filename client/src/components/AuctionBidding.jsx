import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './AuctionBidding.css';
import { API_URL } from '../api';

const AuctionBidding = () => {
  const { loggedinfo} = useAuth();
  const { id } = useParams();
  const [auctionData, setAuction] = useState(null);
  const [highestBid, setHighestBid] = useState(0); 
  const [newBid, setNewBid] = useState(); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auctions/${id}`);
        const auctionData = response.data[0]; 
        setAuction(auctionData); 
        setHighestBid(auctionData.HighestBid || 0); 
        setNewBid(auctionData.HighestBid ? auctionData.HighestBid + 1 : 1); 
        setLoading(false); 
      } catch (err) {
        setError('Error fetching auction details'); 
        setLoading(false);
      }
    };

    fetchAuctionDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (Number(newBid) > Number(highestBid)) {
      //location.reload()
      const BuyerID = loggedinfo.ID
      const BidAmount = newBid
      const data = {BuyerID,BidAmount}
      try{
      const currentTime = new Date();
      if (new Date(auctionData.StartTime) > currentTime) {
        alert("Auction is not online!!")
        navigate('/auctions')
      } else if (new Date(auctionData.EndTime) < currentTime) {
        alert("Auction is Closed!!")
        navigate('/auctions')
      } else {
        // Wait for the server to accept the bid before reloading the page.
        await axios.post(`${API_URL}/api/auctions/${id}/bid`, data)
        setHighestBid(newBid);
        alert(`Your bid of $${newBid} was successfully submitted!`);
        location.reload()
      }
    
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting bid');
    }
    } else {
      alert('Your bid must be higher than the current highest bid.');
    }
  };

  if (loading) return <div>Loading...</div>; 
  if (error) return <div>{error}</div>; 

  return (
    <div className="auction-container">
      <h2>Auction Bidding</h2>
      <form onSubmit={handleSubmit}>
        <div className="bid-section">
          <label>Current Highest Bid: </label>
          <input type="number" value={highestBid} disabled className="bid-input" /> 
        </div>
        <div className="bid-section">
          <label>Place Your Bid: </label>
          <input
            type="number"
            min={highestBid + 1} 
            value={newBid}
            onChange={(e) => setNewBid(Number(e.target.value))} 
            className="bid-input"
          />
        </div>
        <button type="submit" className="submit-button">
          Submit Bid
        </button>
      </form>
    </div>
  );
};

export default AuctionBidding;
