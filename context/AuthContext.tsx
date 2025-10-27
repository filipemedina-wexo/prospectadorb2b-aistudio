import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Profile } from '../types';
import type { AuthError, Session, User } from '@supabase/supabase-js';
import useLocalStorage from '../hooks/useLocalStorage';

interface AuthContextType {
  currentUser: User | null;
  currentProfile: Profile | null;
  profiles: Profile[];
  setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, pass: string, role?: 'admin' | 'user') => Promise<void>;
  updateProfile: (updatedProfile: Profile) => void;
  updateUserPassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
  deleteUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
  const [currentProfile, setCurrentProfile] = useLocalStorage<Profile | null>('currentProfile', null);
  const [profiles, setProfiles] = useLocalStorage<Profile[]>('profiles', []);

  const login = async (email: string, pass: string) => {
    // Mock login for demo mode
    const mockUser = {
      id: 'mock-user-1',
      email: email,
      created_at: new Date().toISOString(),
    };
    const mockProfile = {
      id: 'mock-user-1',
      name: 'Usuário Demo',
      role: 'admin' as const,
    };
    setCurrentUser(mockUser as User);
    setCurrentProfile(mockProfile);
    setProfiles([mockProfile]);
  };

  const logout = async () => {
    setCurrentUser(null);
    setCurrentProfile(null);
    setProfiles([]);
    // Clear all local storage on logout for a clean demo slate
    window.localStorage.removeItem('currentUser');
    window.localStorage.removeItem('currentProfile');
    window.localStorage.removeItem('profiles');
    window.localStorage.removeItem('leads');
    window.localStorage.removeItem('tags');
    window.localStorage.removeItem('lists');
  };

  const signup = async (name: string, email: string, pass: string, role: 'admin' | 'user' = 'user') => {
     // Mock signup for demo mode
    const userId = `mock-user-${Date.now()}`;
    const mockUser = {
      id: userId,
      email: email,
      created_at: new Date().toISOString(),
    };
    const mockProfile = {
      id: userId,
      name: name,
      role: role,
    };
    setCurrentUser(mockUser as User);
    setCurrentProfile(mockProfile);
    setProfiles([mockProfile]);
  };

  const updateProfile = async (updatedProfile: Profile) => {
    setProfiles(prev => prev.map(p => p.id === updatedProfile.id ? updatedProfile : p));
    if (currentProfile?.id === updatedProfile.id) {
        setCurrentProfile(updatedProfile);
    }
  };

  const updateUserPassword = async (newPassword: string) => {
    // Mock password update
    console.log("Senha (simulada) atualizada com sucesso!");
    return { error: null };
  };

  const deleteUser = (userId: string) => {
    console.warn("User deletion from client-side is not secure and not implemented.");
  };
  
  const value = useMemo(() => ({
    currentUser,
    currentProfile,
    profiles,
    setProfiles,
    login,
    logout,
    signup,
    updateProfile,
    updateUserPassword,
    deleteUser
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [currentUser, currentProfile, profiles]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};