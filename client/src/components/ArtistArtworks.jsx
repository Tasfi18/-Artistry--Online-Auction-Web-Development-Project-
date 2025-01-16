
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ArtistArtworks.css';

const ArtistArtworks = () => {
  const { artistID } = useParams();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/artists/user/${artistID}/artwork`);
        setArtworks(response.data);
      } catch (err) {
        console.error("Error fetching artworks:", err);
        setError("Failed to load artworks.");
      } finally {
        setLoading(false);
      }
    };
    fetchArtworks();
  }, [artistID]);

  if (loading) return <p>Loading artworks...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="artist-artworks">
      <h1>Artworks by Me</h1>
      {artworks.length > 0 ? (
        <div className="artworks-grid">
          {artworks.map((artwork) => (
            <div key={artwork.ArtworkID} className="artwork-card">
              <img 
               src={artwork.ImageURL}
               alt={artwork.Title} 
               className="artwork-image" 
              />
              <h2>{artwork.Title}</h2>
              <p>{artwork.Description}</p>
              <p>Base Price: ${artwork.BasePrice}</p>
              <p>Status: {artwork.ApprovalStatus}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No artworks found for this artist.</p>
      )}
    </div>
  );
};

export default ArtistArtworks;
