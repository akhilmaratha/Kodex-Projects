'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('userInfo'));
  } catch (error) {
    localStorage.removeItem('userInfo');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userInfo = getStoredUser();
    setUser(userInfo);

    if (!userInfo) {
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        router.push('/login');
      }
    } else {
      if (window.location.pathname === '/login' || window.location.pathname === '/signup' || window.location.pathname === '/') {
        router.push('/chats');
      }
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
