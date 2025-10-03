import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  onSnapshot, 
  updateDoc,
  addDoc,
  deleteDoc,
  orderBy
} from 'firebase/firestore';
import { db, COLLECTIONS } from '../firebase/firebase';

export interface SystemSettings {
  siteName: string;
  siteDescription: string;
  adminEmail: string;
  supportEmail: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  maxFileSize: number;
  emailNotifications: boolean;
  backupEnabled: boolean;
  backupFrequency: string;
  timezone: string;
  currency: string;
  language: string;
  updatedAt: Date;
  updatedBy: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: string;
  department: string;
  phoneNumber: string;
  bio: string;
  notifications: {
    email: boolean;
    push: boolean;
    carUpdates: boolean;
    systemAlerts: boolean;
  };
  updatedAt: Date;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: Date;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

// System Settings
export const getSystemSettings = async (): Promise<SystemSettings | null> => {
  try {
    const settingsDoc = await getDoc(doc(db, COLLECTIONS.SETTINGS, 'system'));
    if (settingsDoc.exists()) {
      const data = settingsDoc.data();
      return {
        ...data,
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as SystemSettings;
    }
    return null;
  } catch (error) {
    console.error('Error fetching system settings:', error);
    throw error;
  }
};

export const saveSystemSettings = async (settings: Omit<SystemSettings, 'updatedAt' | 'updatedBy'>, userId: string): Promise<void> => {
  try {
    const settingsData = {
      ...settings,
      updatedAt: new Date(),
      updatedBy: userId,
    };
    
    await setDoc(doc(db, COLLECTIONS.SETTINGS, 'system'), settingsData);
  } catch (error) {
    console.error('Error saving system settings:', error);
    throw error;
  }
};

// User Profile
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const profileDoc = await getDoc(doc(db, COLLECTIONS.USER_PROFILES, userId));
    if (profileDoc.exists()) {
      const data = profileDoc.data();
      return {
        ...data,
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const saveUserProfile = async (profile: Omit<UserProfile, 'updatedAt'>): Promise<void> => {
  try {
    const profileData = {
      ...profile,
      updatedAt: new Date(),
    };
    
    await setDoc(doc(db, COLLECTIONS.USER_PROFILES, profile.uid), profileData);
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

// Admin Users Management
export const subscribeToAdminUsers = (callback: (users: AdminUser[]) => void) => {
  const q = query(
    collection(db, COLLECTIONS.ADMIN_USERS),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const users: AdminUser[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        id: doc.id,
        ...data,
        lastLogin: data.lastLogin?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as AdminUser);
    });
    callback(users);
  });
};

export const addAdminUser = async (user: Omit<AdminUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const userData = {
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.ADMIN_USERS), userData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding admin user:', error);
    throw error;
  }
};

export const updateAdminUser = async (userId: string, updates: Partial<AdminUser>): Promise<void> => {
  try {
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };
    
    await updateDoc(doc(db, COLLECTIONS.ADMIN_USERS, userId), updateData);
  } catch (error) {
    console.error('Error updating admin user:', error);
    throw error;
  }
};

export const deleteAdminUser = async (userId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.ADMIN_USERS, userId));
  } catch (error) {
    console.error('Error deleting admin user:', error);
    throw error;
  }
};

// Initialize default settings if they don't exist
export const initializeDefaultSettings = async (userId: string): Promise<void> => {
  try {
    const existingSettings = await getSystemSettings();
    
    if (!existingSettings) {
      const defaultSettings: Omit<SystemSettings, 'updatedAt' | 'updatedBy'> = {
        siteName: 'Nabus Motors',
        siteDescription: 'Premium car dealership with the best vehicles',
        adminEmail: 'admin@nabusmotors.com',
        supportEmail: 'support@nabusmotors.com',
        maintenanceMode: false,
        allowRegistration: false,
        maxFileSize: 10,
        emailNotifications: true,
        backupEnabled: true,
        backupFrequency: 'daily',
        timezone: 'UTC',
        currency: 'GHS',
        language: 'en'
      };
      
      await saveSystemSettings(defaultSettings, userId);
    }
  } catch (error) {
    console.error('Error initializing default settings:', error);
    throw error;
  }
};