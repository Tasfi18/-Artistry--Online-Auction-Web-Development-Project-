import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';


import SignIn from "./SignIn";

const SignUp = () => {
  const { login } = useAuth();
  const [userType, setUserType] = useState('artist');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [portfolioURL, setPortfolioURL] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [businessDetails, setBusinessDetails] = useState('');
  const [yearlyWage, setYearlyWage] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataArtist = {
      name,
      email,
      password,
      bio,
      portfolioURL,
    };

    const dataBuyer = {
      name,
      email,
      password,
      shippingAddress,
      businessDetails,
      yearlyWage,
    };

    const data = { email, password };

    try {
      const emailCheckResponse = await axios.post(`http://localhost:8000/api/emails/check-email`, { email });
      if (emailCheckResponse.data.message !== 'Email is available.') {
        setEmailError(emailCheckResponse.data.message);
        return;
      }
    } catch (error) {
      if (error.response) {
        setEmailError(error.response.data.message);
      } else {
        console.error('Error checking email:', error);
      }
      return;
    }

    try {
      if (userType === 'artist') {
        await axios.post(`http://localhost:8000/api/artists/signup`, dataArtist);
      } else if (userType === 'buyer') {
        await axios.post(`http://localhost:8000/api/buyers/signup`, dataBuyer);
      }
      alert('Sign-up successful!');
      let response;
      if (userType === 'artist') {
        response = await axios.post(`http://localhost:8000/api/artists/signin`, data);
        const userData = { ID: response.data.artistID, Status: 1, UserType: 'artist' };
        await login(userData);
        navigate(`/user/artist/${userData.ID}`);


      } else if (userType === 'buyer') {
        response = await axios.post(`http://localhost:8000/api/buyers/signin`, data);
        const userData = { ID: response.data.buyerID, Status: 1, UserType: 'buyer' };
        await login(userData);
        navigate(`/user/buyer/${userData.ID}`);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Error signing up.');
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          User Type:
          <select value={userType} onChange={(e) => setUserType(e.target.value)}>
            <option value="artist">Artist</option>
            <option value="buyer">Buyer</option>
          </select>
        </label>

        <label>
          Name:
          <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        {emailError && <p className="error">{emailError}</p>}

        <label>
          Password:
          <input type="password" placeholder="Give a strong password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>

        {userType === 'artist' && (
          <>
            <label>
              Bio:
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
            </label>

            <label>
              Portfolio URL:
              <input
                type="url"
                value={portfolioURL}
                onChange={(e) => {
                  let url = e.target.value;
                  if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
                    url = "http://" + url;
                  }
                  setPortfolioURL(url);
                }}
              />
            </label>
          </>
        )}

        {userType === 'buyer' && (
          <>
            <label>
              Shipping Address:
              <input type="text" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} />
            </label>

            <label>
              Business Details:
              <input type="text" value={businessDetails} onChange={(e) => setBusinessDetails(e.target.value)} />
            </label>

            <label>
              Yearly Wage:
              <input type="number" value={yearlyWage} onChange={(e) => setYearlyWage(e.target.value)} />
            </label>
          </>
        )}

        <button type="submit">Sign Up</button>
      </form>
      <p>&nbsp;&nbsp;</p>
      <h1 className="or">Or</h1>
      <label>
      <SignIn/>
      </label>
      
      
    </div>
    
    
  );
};

export default SignUp;
