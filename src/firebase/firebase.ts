import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export interface Car extends Record<string, any> {
  id: string;
  imageUrls: string[];
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: string;
  fuelType: string;
  condition: 'New' | 'Used';
  description?: string;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:demo'
};

// Debug logging to see what config is loaded
console.log('Firebase Config Debug:', {
  apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'MISSING',
  authDomain: firebaseConfig.authDomain || 'MISSING',
  projectId: firebaseConfig.projectId || 'MISSING',
  storageBucket: firebaseConfig.storageBucket || 'MISSING',
  messagingSenderId: firebaseConfig.messagingSenderId || 'MISSING',
  appId: firebaseConfig.appId ? `${firebaseConfig.appId.substring(0, 15)}...` : 'MISSING'
});

// Check if we're using demo configuration
const isDemoMode = firebaseConfig.apiKey === 'demo-api-key';
if (isDemoMode) {
  console.warn('🔥 Firebase is running in DEMO mode. Please configure your environment variables in .env file for full functionality.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage = getStorage(app);

// Car listing type definitions
export interface CarListing {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: string;
  fuelType: string;
  condition: 'New' | 'Used';
  imageUrls: string[];
  description: string;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Collection names as constants to avoid typos
export const COLLECTIONS = {
  CARS: 'cars',
  USERS: 'users',
  FEATURED: 'featured'
} as const;

export default app;