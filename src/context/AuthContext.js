import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../apis/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = AuthService.getToken();
        if (token) {
          // Verify token validity with backend
          const response = await AuthService.checkToken();
          if (response.data.user) {
            setUser(response.data.user);
          } else {
            // Clear invalid token
            AuthService.logout();
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        AuthService.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await AuthService.login(credentials);
      setUser(response.data.user);
      
      // Clear any stored reset emails after successful login
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('userEmail');
      
      return response;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await AuthService.register(userData);
      setUser(response.data.user);
      return response;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      setError(err.message || 'Logout failed');
      throw err;
    }
  };

  const updateUser = async (profileData) => {
    try {
      setError(null);
      const response = await AuthService.updateProfile(profileData);
      setUser(response.data.user);
      return response;
    } catch (err) {
      setError(err.message || 'Profile update failed');
      throw err;
    }
  };

  const refreshUser = () => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      setError(null);
      return await AuthService.getResetCode(email);
    } catch (err) {
      setError(err.message || 'Reset code request failed');
      throw err;
    }
  };

  const resetPassword = async (resetData) => {
    try {
      setError(null);
      return await AuthService.resetPassword(resetData);
    } catch (err) {
      setError(err.message || 'Password reset failed');
      throw err;
    }
  };

  const checkAuthStatus = async () => {
    try {
      setError(null);
      const response = await AuthService.checkToken();
      setUser(response.data.user);
      return response;
    } catch (err) {
      setError(err.message || 'Token verification failed');
      setUser(null);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
        requestPasswordReset,
        resetPassword,
        checkAuthStatus,
        isAuthenticated: !!user
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 