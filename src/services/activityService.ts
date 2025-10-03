import { collection, addDoc, query, orderBy, limit, onSnapshot, where, Timestamp } from 'firebase/firestore';
import { db, COLLECTIONS } from '@/firebase/firebase';
import type { Activity, ActivityFilters } from '@/types/activity';

export const ACTIVITY_COLLECTION = COLLECTIONS.ACTIVITIES;

// Add a new activity log entry
export async function logActivity(
  type: Activity['type'],
  message: string,
  userId: string,
  userName: string,
  options: {
    entityId?: string;
    details?: Record<string, any>;
    status?: Activity['status'];
  } = {}
) {
  try {
    if (!userId) return;

    const activity: Omit<Activity, 'id'> = {
      type,
      entityId: options.entityId,
      userId,
      userName: userName || 'Admin',
      message,
      details: options.details,
      timestamp: Timestamp.now(),
      status: options.status || 'info'
    };

    await addDoc(collection(db, ACTIVITY_COLLECTION), activity);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

// Get activities with optional filters
export function subscribeToActivities(
  callback: (activities: Activity[]) => void,
  filters: ActivityFilters = {},
  limitCount: number = 50
) {
  try {
    console.log('ActivityService: Setting up subscription to activities collection with filters:', filters);
    
    let q = query(
      collection(db, ACTIVITY_COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    // Apply filters
    if (filters.type && filters.type.length > 0) {
      q = query(q, where('type', 'in', filters.type));
    }
    if (filters.status && filters.status.length > 0) {
      q = query(q, where('status', 'in', filters.status));
    }
    if (filters.userId) {
      q = query(q, where('userId', '==', filters.userId));
    }
    if (filters.startDate) {
      q = query(q, where('timestamp', '>=', Timestamp.fromDate(filters.startDate)));
    }
    if (filters.endDate) {
      q = query(q, where('timestamp', '<=', Timestamp.fromDate(filters.endDate)));
    }

    return onSnapshot(q, (snapshot) => {
      console.log('ActivityService: Firebase snapshot received, docs count:', snapshot.docs.length);
      const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Activity[];
      console.log('ActivityService: Parsed activities:', activities);
      callback(activities);
    }, (error) => {
      console.error('ActivityService: Firebase onSnapshot error:', error);
      callback([]);
    });
  } catch (error) {
    console.error('Error subscribing to activities:', error);
    callback([]);
    return () => {};
  }
}

// Activity type labels for UI
export const ACTIVITY_TYPE_LABELS: Record<Activity['type'], string> = {
  car_added: 'Car Added',
  car_updated: 'Car Updated',
  car_deleted: 'Car Deleted',
  car_sold: 'Car Sold',
  user_login: 'User Login',
  user_logout: 'User Logout',
  settings_updated: 'Settings Updated'
};

// Activity status colors
export const ACTIVITY_STATUS_COLORS: Record<Activity['status'], string> = {
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200'
};