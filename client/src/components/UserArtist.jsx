import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserArtist.css';  
import Upload from './Upload';
const UserArtist = () => {
  const { artistID } = useParams();  
  const [artist, setArtist] = useState(null);  
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/artists/user/${artistID}`);
        setArtist(response.data[0]);  
      } catch (error) {
        console.error('Error fetching artist details:', error);
      }
    };
    
    fetchArtistDetails();
  }, [artistID]);

  const handleUploadArtworkClick = () => {
    navigate(`/artists/${artistID}/upload-artwork`);
  };

  const handleViewArtworksClick = () => {
    navigate(`/user/artists/${artistID}/artworks`);
  };

  if (!artist) return <p>Loading...</p>;

  return (
    <div className="artist-profile">
      <h1>{artist.Name}'s Profile</h1>
      <img src={artist.ProfilePicture || '/images/default-profile.jpg'} alt="Artist" className="profile-picture" />
      <Upload/>
      <p><strong>Email:</strong> {artist.Email}</p>
      <p><strong>Bio:</strong> {artist.Bio}</p>
      <p><strong>Portfolio:</strong> <a href={artist.PortfolioURL.startsWith('http') ? artist.PortfolioURL : `http://${artist.PortfolioURL}`} target="_blank" rel="noreferrer">{artist.PortfolioURL}</a></p>
      <p><strong>Approval Status:</strong> {artist.ApprovalStatus}</p>
      
      <button className="upload-artwork-btn" onClick={handleUploadArtworkClick}>
        Upload Artwork
      </button>

      <button className="my-artworks-btn" onClick={handleViewArtworksClick}>
        My Artworks
      </button>
    </div>
  );
};

export default UserArtist;
