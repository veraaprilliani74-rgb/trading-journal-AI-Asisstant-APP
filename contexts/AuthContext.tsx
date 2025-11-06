import React, { createContext, useState, useContext, ReactNode } from 'react';
import { mockCredentials } from '../data/auth';

// In-memory "database" for user credentials
export interface UserCredentials {
  name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: UserCredentials | null;
  login: (identifier: string, password: string) => boolean;
  logout: () => void;
  register: (details: UserCredentials) => { success: boolean, message: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserCredentials | null>(null);
  
  // Initialize user list with the demo user
  const [users, setUsers] = useState<UserCredentials[]>([
    { name: 'Demo Trader', ...mockCredentials }
  ]);

  const login = (identifier: string, password: string): boolean => {
    const identifierLower = identifier.toLowerCase();
    const foundUser = users.find(u => 
        (u.email.toLowerCase() === identifierLower || u.name.toLowerCase() === identifierLower) && 
        u.password === password
    );
    if (foundUser) {
        setIsAuthenticated(true);
        setCurrentUser(foundUser);
        return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const register = (details: UserCredentials): { success: boolean, message: string } => {
    if (users.some(u => u.email.toLowerCase() === details.email.toLowerCase())) {
        return { success: false, message: 'Akun dengan email ini sudah ada.' };
    }
    // Also check for duplicate names, as it's now a login identifier
    if (users.some(u => u.name.toLowerCase() === details.name.toLowerCase())) {
        return { success: false, message: 'Akun dengan nama ini sudah ada. Silakan pilih nama lain.' };
    }
    setUsers(prev => [...prev, details]);
    setIsAuthenticated(true);
    setCurrentUser(details);
    return { success: true, message: 'Registrasi berhasil!' };
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};