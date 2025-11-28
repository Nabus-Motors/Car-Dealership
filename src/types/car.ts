export interface EngineDetails {
  cylinders?: string;
  displacement?: string;
  driveLayout?: string;
  horsepower?: string;
  rpm?: string;
  torque?: string;
  compressionRatio?: string;
  fuelType?: string;
}

export interface PerformanceDetails {
  topTrackSpeed?: string;
  acceleration060?: string;
}

export interface TransmissionDetails {
  type?: string;
  displacement?: string;
}

export interface LocationDetails {
  address?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
}

export interface TechnicalDetails {
  engine: EngineDetails;
  performance: PerformanceDetails;
  transmission: TransmissionDetails;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: string;
  condition: 'New' | 'Used';
  fuelType: string;
  transmission?: string; // Optional since it's not in the test data
  description: string;
  imageUrls: string[];
  features: string[];
  status: 'draft' | 'published' | 'sold' | 'new'; // Add all status options
  category?: 'Registered' | 'Unregistered';
  technical?: TechnicalDetails;
  location?: LocationDetails;
  createdAt: any; // Firestore Timestamp or Date
  updatedAt: any; // Firestore Timestamp or Date
}