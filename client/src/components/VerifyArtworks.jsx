import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VerifyArtworks.css';

const VerifyArtworks = () => {
  const [pendingArtworks, setPendingArtworks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingArtworks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/artworks/pending');
        setPendingArtworks(response.data);
      } catch (error) {
        console.error('Error fetching pending artworks:', error);
      }
    };

    fetchPendingArtworks();
  }, []);

  const handleAccept = (artworkID) => {
    navigate(`/admin/verify/artwork/${artworkID}`);
  };

  const handleDelete = async (artworkID) => {
    try {
      await axios.delete(`http://localhost:8000/api/artworks/${artworkID}`);
      alert('Artwork deleted successfully!');
      setPendingArtworks((prev) => prev.filter((artwork) => artwork.ArtworkID !== artworkID));
    } catch (error) {
      console.error('Error deleting artwork:', error);
      alert('Failed to delete artwork.');
    }
  };

  return (
    <div className="verify-artworks">
      <h2>Pending Artworks</h2>
      {pendingArtworks.length > 0 ? (
        pendingArtworks.map((artwork) => (
          <div key={artwork.ArtworkID} className="artwork-card">
            {artwork.ImageURL ? (
            <img
              src={artwork.ImageURL}
              alt={`Artwork titled ${artwork.Title}`}
              className="artwork-image"
            />
          ) : (
            <p>No image available for this artwork.</p>
          )}
            <p><strong>Title:</strong> {artwork.Title}</p>
            <p><strong>Artist Name:</strong> {artwork.ArtistName}</p>
            <p><strong>Description:</strong> {artwork.Description}</p>
            <p><strong>Base Price:</strong> {artwork.BasePrice}</p>
            <p><strong>Category:</strong> {artwork.CategoryName}</p>
            <p><strong>Status:</strong> {artwork.ApprovalStatus}</p>
            <div className="artwork-actions">
              <button onClick={() => handleAccept(artwork.ArtworkID)} className="accept-btn">Accept</button>
              <button onClick={() => handleDelete(artwork.ArtworkID)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))
      ) : (
        <p>No pending artworks available.</p>
      )}
    </div>
  );
};

export default VerifyArtworks;
