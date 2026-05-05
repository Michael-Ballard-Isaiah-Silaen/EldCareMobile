import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      await SecureStore.deleteItemAsync('access_token');
      const token = await SecureStore.getItemAsync('access_token');
      if (token) setUserToken(token);
    };
    loadToken();
  }, []);

  const login = async (token: string) => {
    await SecureStore.setItemAsync('access_token', token);
    setUserToken(token);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('access_token');
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};