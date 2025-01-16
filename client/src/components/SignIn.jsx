import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './SignIn.css';

const SignIn = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState('artist');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { email, password };
      let response;

      if (userType === 'artist') {
        response = await axios.post(`http://localhost:8000/api/artists/signin`, data);
        const userData = { ID: response.data.artistID, Status: 1, UserType: 'artist' };
        await login(userData);
        navigate(`/user/artist/${userData.ID}`);
      } else {
        response = await axios.post(`http://localhost:8000/api/buyers/signin`, data);
        const userData = { ID: response.data.buyerID, Status: 1, UserType: 'buyer' };
        await login(userData);
        navigate(`/auctions`);
      }
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Invalid Email or Password!');
    }
  };

  return (
    <div className="signin-container">
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          User Type:
          <select value={userType} onChange={(e) => setUserType(e.target.value)}>
            <option value="artist">Artist</option>
            <option value="buyer">Buyer</option>
          </select>
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
