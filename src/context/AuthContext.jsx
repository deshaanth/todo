import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => storageService.getCurrentUser());
  const [pendingVerification, setPendingVerification] = useState(null); // { email, code, name, password, type: 'register' | 'reset' }

  const sendOTP = (email, extraData = {}) => {
    // Generate a 6-digit verification code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationObj = {
      email,
      code: generatedCode,
      timestamp: Date.now(),
      ...extraData
    };
    setPendingVerification(verificationObj);
    return generatedCode;
  };

  const verifyOTP = (inputCode) => {
    if (!pendingVerification) return { success: false, message: 'No verification code requested.' };
    
    // 10 minute expiration check
    if (Date.now() - pendingVerification.timestamp > 10 * 60 * 1000) {
      return { success: false, message: 'Verification code expired. Please request a new one.' };
    }

    if (pendingVerification.code === inputCode.trim()) {
      if (pendingVerification.type === 'register') {
        const user = {
          id: `user_${pendingVerification.email.replace(/[^a-zA-Z0-9]/g, '_')}`,
          name: pendingVerification.name,
          email: pendingVerification.email
        };
        setCurrentUser(user);
        storageService.saveCurrentUser(user);
      }
      return { success: true, pendingData: pendingVerification };
    } else {
      return { success: false, message: 'Incorrect verification code. Please try again.' };
    }
  };

  const login = (email, password) => {
    const namePart = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ');
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const user = {
      id: `user_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
      name: formattedName || 'User',
      email: email
    };
    setCurrentUser(user);
    storageService.saveCurrentUser(user);
    return true;
  };

  const registerWithVerification = (name, email, password) => {
    const code = sendOTP(email, { name, password, type: 'register' });
    return code;
  };

  const requestPasswordReset = (email) => {
    const code = sendOTP(email, { type: 'reset' });
    return code;
  };

  const completePasswordReset = (newPassword) => {
    if (pendingVerification && pendingVerification.email) {
      const email = pendingVerification.email;
      const user = {
        id: `user_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
        name: email.split('@')[0],
        email: email
      };
      setCurrentUser(user);
      storageService.saveCurrentUser(user);
      setPendingVerification(null);
      return true;
    }
    return false;
  };

  const logout = () => {
    const guestUser = { id: 'default_user', name: 'Guest User', email: 'guest@smarttask.app' };
    setCurrentUser(guestUser);
    storageService.saveCurrentUser(guestUser);
    setPendingVerification(null);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      registerWithVerification,
      sendOTP,
      verifyOTP,
      pendingVerification,
      requestPasswordReset,
      completePasswordReset,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
