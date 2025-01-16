import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import CategoryDropdown from './CategoryDropdown';
import './UploadArtwork.css';

const UploadArtwork = () => {
  const { artistID } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [category, setCategory] = useState('');
  const [status] = useState('Pending');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const artworkData = {
      artistID,
      title,
      description,
      basePrice,
      category,
      status,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/artworks/upload', artworkData);
      const { artworkID } = response.data; 
      alert('Artwork uploaded successfully!');
      navigate(`/artists/${artistID}/upload-artwork/${artworkID}`);
    } catch (error) {
      console.error('Error uploading artwork:', error);
    }
  };

  return (
    <div className="upload-artwork">
      <h2>Upload Your Artwork</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter artwork title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter artwork description"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="basePrice">Base Price</label>
          <input
            type="number"
            id="basePrice"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            placeholder="Enter base price"
            required
          />
        </div>

        <div className="form-group">
          <CategoryDropdown
            onChange={(selectedCategory) => setCategory(selectedCategory)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Approval Status</label>
          <input type="text" id="status" value={status} readOnly />
        </div>

        <button type="submit" className="submit-btn">
          Submit Artwork
        </button>
      </form>
    </div>
  );
};

export default UploadArtwork;
