import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import {
  UserProfile,
  UserRole,
  LanguageCode,
  Gender
} from '../types';

import { db } from '../services/db';

const API_BASE = 'http://localhost:5000/api';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  signIn: (
    identifier: string,
    pass: string,
    _role?: UserRole
  ) => Promise<{
    success: boolean;
    error?: string;
    user?: UserProfile;
  }>;

  signUp: (data: {
  name: string;
  email?: string;
  phone: string;
  cnic?: string;
  pass: string;
  role: UserRole;
  language: LanguageCode;
  gender: Gender;
  avatar?: string;
}) => Promise<{
    success: boolean;
    error?: string;
    user?: UserProfile;
  }>;

  signOut: () => void;

  deleteAccount: (
    password: string
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;

  updateUserLanguage: (lang: LanguageCode) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /*
   * ---------------------------------------------------------
   * RESTORE EXISTING SESSION
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const restoreSession = async () => {
      const sessionUserId = localStorage.getItem('agralyticx_active_user_id');

      if (sessionUserId) {
        try {
          const profile = await db.getUserProfile(sessionUserId);
          if (profile) {
            setUser(profile);
          }
        } catch (err) {
          console.error('Session restore failed:', err);
        }
      }

      setIsLoading(false);
    };

    restoreSession();
  }, []);

  /*
   * ---------------------------------------------------------
   * SIGN IN
   * ---------------------------------------------------------
   */

  const signIn = async (
    identifier: string,
    pass: string,
    _role?: UserRole
  ): Promise<{
    success: boolean;
    error?: string;
    user?: UserProfile;
  }> => {
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, pass })
      });
      const result = await res.json();

      if (!result.success) {
        setIsLoading(false);
        return { success: false, error: result.error };
      }

      localStorage.setItem('agralyticx_active_user_id', result.user.userId);
      setUser(result.user);
      setIsLoading(false);

      return { success: true, user: result.user };
    } catch (err) {
      setIsLoading(false);
      return { success: false, error: 'Could not connect to server. Please try again.' };
    }
  };

  /*
   * ---------------------------------------------------------
   * SIGN UP
   * ---------------------------------------------------------
   */

  const signUp = async (data: {
  name: string;
  email?: string;
  phone: string;
  cnic?: string;
  pass: string;
  role: UserRole;
  language: LanguageCode;
  gender: Gender;
  avatar?: string;
}): Promise<{
    success: boolean;
    error?: string;
    user?: UserProfile;
  }> => {
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();

      if (!result.success) {
        setIsLoading(false);
        return { success: false, error: result.error };
      }

      localStorage.setItem('agralyticx_active_user_id', result.user.userId);
      setUser(result.user);
      setIsLoading(false);

      return { success: true, user: result.user };
    } catch (err) {
      setIsLoading(false);
      return { success: false, error: 'Could not connect to server. Please try again.' };
    }
  };

  /*
   * ---------------------------------------------------------
   * SIGN OUT
   * ---------------------------------------------------------
   */

  const signOut = () => {
    localStorage.removeItem('agralyticx_active_user_id');
    setUser(null);
  };

  /*
   * ---------------------------------------------------------
   * DELETE ACCOUNT
   * ---------------------------------------------------------
   */

  const deleteAccount = async (
    password: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> => {
    if (!user) {
      return { success: false, error: 'No account is currently signed in.' };
    }

    try {
      const res = await fetch(`${API_BASE}/auth/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.userId, password })
      });
      const result = await res.json();

      if (!result.success) {
        return { success: false, error: result.error };
      }

      localStorage.removeItem('agralyticx_active_user_id');
      setUser(null);

      return { success: true };
    } catch (err) {
      return { success: false, error: 'Could not connect to server. Please try again.' };
    }
  };

  /*
   * ---------------------------------------------------------
   * UPDATE LANGUAGE
   * ---------------------------------------------------------
   */

  const updateUserLanguage = (lang: LanguageCode) => {
    if (!user) {
      return;
    }

    const updatedUser = {
      ...user,
      language: lang
    };

    db.saveUserProfile(updatedUser);
    setUser(updatedUser);
  };

  /*
   * ---------------------------------------------------------
   * PROVIDER
   * ---------------------------------------------------------
   */

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
        deleteAccount,
        updateUserLanguage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/*
 * ---------------------------------------------------------
 * useAuth HOOK
 * ---------------------------------------------------------
 */

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return ctx;
};