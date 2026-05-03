import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axiosConfig';

const TOKEN_KEY = 'qams_token';
const USER_KEY  = 'qams_user';

const AuthContext = createContext(null);

function readStoredUser() {
  const storedUser = localStorage.getItem(USER_KEY);
  if (!storedUser) return null;
  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser]   = useState(readStoredUser);

  useEffect(() => {
    function handleForcedLogout() {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
    }
    window.addEventListener('auth:logout', handleForcedLogout);
    return () => window.removeEventListener('auth:logout', handleForcedLogout);
  }, []);

  function saveSession(authResponse) {
    const nextUser = {
      userId: authResponse.userId,
      name:   authResponse.name,
      email:  authResponse.email,
      role:   authResponse.role
    };
    localStorage.setItem(TOKEN_KEY, authResponse.token);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(authResponse.token);
    setUser(nextUser);
  }

  async function login(credentials) {
    const response = await api.post('/auth/login', credentials);
    saveSession(response.data);
    return response.data;
  }

  async function register(payload) {
    const response = await api.post('/auth/register', payload);
    saveSession(response.data);
    return response.data;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({ token, user, isAuthenticated: Boolean(token), login, register, logout }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
