import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedinfo, setLoggedInfo] = useState(null);

  const fetchLoggedInfo = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/loggedin');
      if (res.data && res.data.length > 0) {
        setLoggedInfo(res.data[0]);
      } else {
        setLoggedInfo(null);
      }
    } catch (err) {
      console.error('Failed to fetch login info:', err);
      setLoggedInfo(null);
    }
  };

  useEffect(() => {
    fetchLoggedInfo();
  }, []);

  const login = async (data) => {
    setLoggedInfo(data);
    try{
     await axios.post('http://localhost:8000/api/loggedin',data);
     
    } catch (err) {
      console.error('Failed to fetch login info:', err);
      setLoggedInfo(null);
    }
    

  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:8000/api/loggedin/signout');
      setLoggedInfo(null);
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ loggedinfo, login, logout, fetchLoggedInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
