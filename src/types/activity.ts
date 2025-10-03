export interface Activity {
  id: string;
  type: 'car_added' | 'car_updated' | 'car_deleted' | 'car_sold' | 'user_login' | 'user_logout' | 'settings_updated';
  entityId?: string; // ID of the car or other entity involved
  userId: string;
  userName: string;
  message: string;
  details?: Record<string, any>; // Additional context data
  timestamp: any; // Firebase Timestamp
  status: 'success' | 'warning' | 'error' | 'info';
}

export interface ActivityFilters {
  type?: string[];
  status?: string[];
  startDate?: Date;
  endDate?: Date;
  userId?: string;
}