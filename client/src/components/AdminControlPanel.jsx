import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminControlPanel.css';

const AdminControlPanel = () => {
  const navigate = useNavigate();

  const handleVerifyartist = () => navigate('/admin/verify/artist');
  const handleVerifyBuyer = () => navigate('/admin/verify/buyer');
  const handleVerifyArtwork = () => navigate('/admin/verify/artwork');

  return (
    <div className="admin-control-panel">
      <h2>Admin Control Panel</h2>
      <div className="button-container">
        <button onClick={handleVerifyartist}>Verify Artist</button>
        <button onClick={handleVerifyBuyer}>Verify Buyer</button>
        <button onClick={handleVerifyArtwork}>Verify Artwork</button>
      </div>
    </div>
  );
};

export default AdminControlPanel;
