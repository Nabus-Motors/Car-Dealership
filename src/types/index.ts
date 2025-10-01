export interface Car {
  id: string;
  imageUrls: string[];
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: string;
  fuelType: string;
  description?: string;
  condition: 'New' | 'Used';
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface CarCardProps {
  car: Car;
}

export interface HeroSectionProps {
  backgroundImage?: string;
  title: string;
  subtitle?: string;
  onClickCTA?: () => void;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}