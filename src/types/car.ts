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
  createdAt: any; // Firestore Timestamp or Date
  updatedAt: any; // Firestore Timestamp or Date
}