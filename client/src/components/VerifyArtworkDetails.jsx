import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './VerifyArtworkDetails.css';

const VerifyArtworkDetails = () => {
  const navigate = useNavigate();
  const { artworkID } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [startingBid, setStartingBid] = useState('');

  useEffect(() => {
    const fetchArtworkDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/artworks/${artworkID}`);
        setArtwork(response.data);
        setStartingBid(response.data.BasePrice); 
      } catch (error) {
        console.error('Error fetching artwork details:', error);
      }
    };

    fetchArtworkDetails();
  }, [artworkID]);

  const handleAuctionCreate = async () => {
    const currentTime = new Date();

    let auctionStatus;
    if (new Date(startTime) > currentTime) {
      auctionStatus = 'pending';
    } else if (new Date(endTime) < currentTime) {
      auctionStatus = 'closed';
    } else {
      auctionStatus = 'active';
    }

    const auctionData = {
      artworkID,
      startTime,
      endTime,
      startingBid, 
      auctionStatus
    };
    console.log(auctionData)
    try {
      await axios.post('http://localhost:8000/api/auctions/create', auctionData);
      alert('Auction created successfully!');
      navigate('/admin/controlpanel');
    } catch (error) {
      console.error('Error creating auction:', error);
      alert('Failed to create auction.');
    }
    
  };

  return (
    <div className="verify-artwork-details">
      <h2>Artwork Details</h2>
      {artwork ? (
        <div className="artwork-card">
          <img 
            src={artwork.ImageURL || 'default-image.jpg'} 
            alt={artwork.Title} 
            className="artwork-image" 
          />
          <p><strong>Title:</strong> {artwork.Title}</p>
          <p><strong>Description:</strong> {artwork.Description}</p>
          <p><strong>Base Price:</strong> {artwork.BasePrice}</p>
          <p><strong>Category:</strong> {artwork.Category}</p>
          <p><strong>Artist Name:</strong> {artwork.ArtistName}</p>
          <p><strong>Status:</strong> {artwork.ApprovalStatus}</p>

          <div className="auction-form">
            <h3>Create Auction</h3>
            <div>
              <label>Start Time</label>
              <input 
                type="datetime-local" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)} 
              />
            </div>
            <div>
              <label>End Time</label>
              <input 
                type="datetime-local" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)} 
              />
            </div>
            <div>
              <label>Starting Bid</label>
              <input 
                type="number" 
                value={startingBid} 
                onChange={(e) => setStartingBid(e.target.value)} 
                disabled 
              />
            </div>
            <button onClick={handleAuctionCreate}>Create Auction</button>
          </div>
        </div>
      ) : (
        <p>Loading artwork details...</p>
      )}
    </div>
  );
};

export default VerifyArtworkDetails;
