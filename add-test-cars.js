// Node.js script to add test cars to Firestore
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Firebase config from your firebase.ts
const firebaseConfig = {
  apiKey: "AIzaSyAlOAu3LtKMKrqHp6H6OwIhzjI9MZVqCbE",
  authDomain: "car-dealership-44123.firebaseapp.com",
  projectId: "car-dealership-44123",
  storageBucket: "car-dealership-44123.firebasestorage.app",
  messagingSenderId: "1080847418158",
  appId: "1:1080847418158:web:d5e5d5c7aced30a8ecec73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const testCars = [
  {
    brand: "Ferrari",
    model: "488 GTB",
    year: 2023,
    price: 285000,
    mileage: "2500",
    fuelType: "Gasoline",
    condition: "New",
    transmission: "Automatic",
    description: "Stunning Ferrari 488 GTB in pristine condition with carbon fiber details",
    features: ["Carbon Fiber Interior", "Sport Package", "Navigation", "Premium Sound"],
    imageUrls: [
      "https://images.unsplash.com/photo-1653047256226-5abbfa82f1d7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1614013719401-6b8e63f5e64d?w=800&h=600&fit=crop"
    ],
    status: "published",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    brand: "Tesla",
    model: "Model S",
    year: 2024,
    price: 89000,
    mileage: "1200",
    fuelType: "Electric",
    condition: "New",
    transmission: "Automatic",
    description: "Latest Tesla Model S with full self-driving capability",
    features: ["Autopilot", "Premium Sound", "Extended Range", "Heated Seats"],
    imageUrls: [
      "https://images.unsplash.com/photo-1610470850940-27b52ca7c0fe?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=800&h=600&fit=crop"
    ],
    status: "published",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    brand: "BMW",
    model: "M3 Competition",
    year: 2023,
    price: 75000,
    mileage: "5000",
    fuelType: "Gasoline",
    condition: "Used",
    transmission: "Automatic",
    description: "High-performance BMW M3 with sport package",
    features: ["M Performance Package", "Carbon Fiber Trim", "Adaptive Suspension", "Harman Kardon"],
    imageUrls: [
      "https://images.unsplash.com/photo-1553416204-ba45ce9a8aad?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1595431200000-4b2e8b48b56e?w=800&h=600&fit=crop"
    ],
    status: "published",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    brand: "Mercedes-Benz",
    model: "AMG GT",
    year: 2023,
    price: 135000,
    mileage: "3000",
    fuelType: "Gasoline",
    condition: "Used",
    transmission: "Automatic",
    description: "Elegant Mercedes-AMG GT with premium interior",
    features: ["AMG Performance Package", "Premium Interior", "Adaptive Cruise", "Burmester Sound"],
    imageUrls: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&h=600&fit=crop"
    ],
    status: "published",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    brand: "Audi",
    model: "RS6 Avant",
    year: 2023,
    price: 125000,
    mileage: "4500",
    fuelType: "Gasoline",
    condition: "Used",
    transmission: "Automatic",
    description: "Sporty Audi RS6 Avant wagon with quattro all-wheel drive",
    features: ["Quattro AWD", "Virtual Cockpit", "Bang & Olufsen", "Adaptive Air Suspension"],
    imageUrls: [
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=800&h=600&fit=crop"
    ],
    status: "published",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    brand: "Porsche",
    model: "911 Turbo S",
    year: 2024,
    price: 230000,
    mileage: "1000",
    fuelType: "Gasoline",
    condition: "New",
    transmission: "Automatic",
    description: "Brand new Porsche 911 Turbo S with sports chrono package",
    features: ["Sports Chrono Package", "PASM", "Sport Exhaust", "Premium Leather"],
    imageUrls: [
      "https://images.unsplash.com/photo-1586878030478-e6e7ff11e3ce?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=800&h=600&fit=crop"
    ],
    status: "published",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }
];

async function addTestCars() {
  console.log('Adding test cars to Firestore...');
  
  try {
    for (const car of testCars) {
      const docRef = await addDoc(collection(db, 'cars'), car);
      console.log(`Added ${car.brand} ${car.model} with ID: ${docRef.id}`);
    }
    console.log('✅ All test cars added successfully!');
    console.log('🚗 Your featured cars section should now show content');
  } catch (error) {
    console.error('❌ Error adding test cars:', error);
  }
}

addTestCars();