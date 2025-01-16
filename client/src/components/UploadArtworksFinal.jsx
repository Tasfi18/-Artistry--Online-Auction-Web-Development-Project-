import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UploadArtworksFinal.css'; 

const UploadArtworkFinal = () => {
  const { artistID, artworkID } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [artworkDetails, setArtworkDetails] = useState(null);

  useEffect(() => {
    const fetchArtworkDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/artworks/${artworkID}`);
        setArtworkDetails(response.data);
      } catch (error) {
        console.error('Error fetching artwork details:', error);
      }
    };

    fetchArtworkDetails();
  }, [artworkID]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('artworkID', artworkID);

    try {
      await axios.post('http://localhost:8000/api/artworks/upload-image', formData);
      alert('Image uploaded successfully!');
      navigate(`/user/artists/${artistID}/artworks`);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image.');
    }
  };

  const handleCancel = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/artworks/${artworkID}`);
      alert('Artwork deleted successfully!');
      navigate('/user/artists/${artistID}/artworks');
    } catch (error) {
      console.error('Error deleting artwork:', error);
      alert('Failed to delete artwork.');
    }
  };

  return (
    <div className="upload-artwork-final"> 
      <h2>Upload Artwork Image</h2>

      {artworkDetails ? (
        <div className="artwork-info">
          <p><strong>Title:</strong> {artworkDetails.Title}</p>
          <p><strong>Description:</strong> {artworkDetails.Description}</p>
          <p><strong>Base Price:</strong> {artworkDetails.BasePrice}</p>
          <p><strong>Category:</strong> {artworkDetails.Category}</p>
        </div>
      ) : (
        <p>Loading artwork details...</p>
      )}

      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Ask for Auction</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
};

export default UploadArtworkFinal;
