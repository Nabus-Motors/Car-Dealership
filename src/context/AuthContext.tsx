import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    console.log('Setting up Firebase auth listener');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: any) => {
      console.log('Auth state changed:', firebaseUser ? 'logged in' : 'logged out');
      if (firebaseUser) {
        // Check if this is an admin email (you can customize this logic)
        const isAdminEmail = firebaseUser.email === 'admin@nabusmotors.com' || 
                            firebaseUser.email?.endsWith('@nabusmotors.com');
        
        // Convert Firebase user to our User type
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          role: isAdminEmail ? 'admin' : 'user',
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
        };
        console.log('Setting auth state with user:', user);
        setAuthState({ user, loading: false, error: null });
      } else {
        console.log('Setting auth state to null');
        setAuthState({ user: null, loading: false, error: null });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', result.user.email);
      // The onAuthStateChanged listener will handle updating the state
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({ ...prev, error: (error as Error).message }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: (error as Error).message }));
      throw error;
    }
  };

  // Any authenticated user is considered an admin for now
  const isAdmin = Boolean(authState.user);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}