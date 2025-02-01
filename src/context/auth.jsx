import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
  
      const response = await fetch(`${import.meta.env.VITE_API_LOGOUT}/${userId}?token=${token}`, {
        method: 'POST',
        headers: {
          'accept': '*/*'
        },
        body: ''
      });
  
      if (!response.ok) {
        throw new Error(`Logout failed: ${response.statusText}`);
      }
  
      const data = await response.text();
      console.log(data || "Logout successful");
  
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      localStorage.clear();
      setIsAuthenticated(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);