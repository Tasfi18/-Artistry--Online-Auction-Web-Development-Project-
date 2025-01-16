import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { loggedinfo, logout, fetchLoggedInfo } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogoutClick = async () => {
    await logout();
    fetchLoggedInfo(); 
    navigate('/');
  };

  const handleSignInClick = () => navigate('/signin');
  const handleSignUpClick = () => navigate('/signup');

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="dropdown-toggle" onClick={toggleDropdown}>
          ☰ Menu
        </button>
        {isDropdownOpen && (
          <ul className="dropdown-menu">
            <li className="menu-item">Rare Things</li>
            <li className="menu-item">Paintings</li>
            <li className="menu-item">Drawings</li>
            <li className="menu-item">Sculpture</li>
            <li className="menu-item">Artists</li>
          </ul>
        )}
      </div>

      <div className="navbar-logo">
        <h1 onClick={() => navigate(`/`)} className="artisify-btn" >A r t i s i f y</h1>
      </div>

      <div className="navbar-auth">
        {loggedinfo && loggedinfo.Status === 1 ? (
          <>
            {loggedinfo.UserType === 'artist' ? (
              <button onClick={() => navigate(`/user/artist/${loggedinfo.ID}`)} className="profile-btn">
                Profile
              </button>
            ) : (
              <button onClick={() => navigate(`/user/buyer/${loggedinfo.ID}`)} className="profile-btn">
                Profile
              </button>
            )}
            <button onClick={handleLogoutClick} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <button onClick={handleSignInClick} className="login-btn">Login</button>
            <button onClick={handleSignUpClick} className="signup-btn">Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
