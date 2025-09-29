import { db, COLLECTIONS } from './firebase-node';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const testCars = [
  {
    brand: "Ferrari",
    model: "488 GTB",
    year: 2023,
    price: 285000,
    mileage: "2,500",
    fuelType: "Gasoline",
    condition: "New",
    imageUrls: [
      "https://images.unsplash.com/photo-1653047256226-5abbfa82f1d7"
    ],
    features: ["Carbon Fiber Interior", "Sport Package", "Navigation"],
    description: "Brand new Ferrari 488 GTB with full dealer warranty.",
    createdAt: Timestamp.fromDate(new Date()), // Today
    updatedAt: Timestamp.fromDate(new Date())
  },
  {
    brand: "Tesla",
    model: "Model S",
    year: 2024,
    price: 89000,
    mileage: "1,200",
    fuelType: "Electric",
    condition: "New",
    imageUrls: [
      "https://images.unsplash.com/photo-1610470850940-27b52ca7c0fe"
    ],
    features: ["Autopilot", "Premium Sound", "Extended Range"],
    description: "Latest Tesla Model S with all available upgrades.",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)), // 30 days ago
    updatedAt: Timestamp.fromDate(new Date())
  },
  {
    brand: "BMW",
    model: "M5",
    year: 2023,
    price: 105000,
    mileage: "15,000",
    fuelType: "Gasoline",
    condition: "Used",
    imageUrls: [
      "https://images.unsplash.com/photo-1734299388217-2ebc605ef43f"
    ],
    features: ["M Sport Package", "Executive Package", "Driving Assistance"],
    description: "Well-maintained BMW M5 with full service history.",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)), // 60 days ago
    updatedAt: Timestamp.fromDate(new Date())
  },
  {
    brand: "Porsche",
    model: "911 Turbo S",
    year: 2024,
    price: 230000,
    mileage: "500",
    fuelType: "Gasoline",
    condition: "New",
    imageUrls: [
      "https://images.unsplash.com/photo-1614013719401-6b8e63f5e64d"
    ],
    features: ["Sport Chrono Package", "PASM", "Ceramic Brakes"],
    description: "Limited edition Porsche 911 Turbo S with full options.",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)), // 15 days ago
    updatedAt: Timestamp.fromDate(new Date())
  },
  {
    brand: "Lamborghini",
    model: "Huracán",
    year: 2023,
    price: 220000,
    mileage: "3,200",
    fuelType: "Gasoline",
    condition: "Used",
    imageUrls: [
      "https://images.unsplash.com/photo-1621135802920-133df287f89c"
    ],
    features: ["All-Wheel Drive", "Carbon Package", "Lifting System"],
    description: "Stunning Lamborghini Huracán in excellent condition.",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)), // 45 days ago
    updatedAt: Timestamp.fromDate(new Date())
  },
  {
    brand: "Audi",
    model: "RS6 Avant",
    year: 2024,
    price: 125000,
    mileage: "800",
    fuelType: "Gasoline",
    condition: "New",
    imageUrls: [
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1"
    ],
    features: ["Quattro AWD", "Dynamic Package", "Bang & Olufsen"],
    description: "Brand new Audi RS6 Avant with performance package.",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)), // 7 days ago
    updatedAt: Timestamp.fromDate(new Date())
  },
  {
    brand: "Mercedes-Benz",
    model: "AMG GT 63 S",
    year: 2023,
    price: 180000,
    mileage: "5,500",
    fuelType: "Gasoline",
    condition: "Used",
    imageUrls: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8"
    ],
    features: ["AMG Performance Package", "Night Package", "Premium Plus"],
    description: "High-performance Mercedes AMG GT with track package.",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 75 * 24 * 60 * 60 * 1000)), // 75 days ago
    updatedAt: Timestamp.fromDate(new Date())
  },
  {
    brand: "McLaren",
    model: "720S",
    year: 2024,
    price: 315000,
    mileage: "1,100",
    fuelType: "Gasoline",
    condition: "New",
    imageUrls: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64"
    ],
    features: ["Carbon Fiber Body", "Track Package", "Luxury Interior"],
    description: "Exotic McLaren 720S with full carbon fiber options.",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)), // 21 days ago
    updatedAt: Timestamp.fromDate(new Date())
  },
  {
    brand: "Bentley",
    model: "Continental GT",
    year: 2022,
    price: 195000,
    mileage: "12,000",
    fuelType: "Gasoline",
    condition: "Used",
    imageUrls: [
      "https://images.unsplash.com/photo-1612927601601-6638404737ce"
    ],
    features: ["Mulliner Package", "Diamond Quilted Leather", "Naim Audio"],
    description: "Luxury Bentley Continental GT with premium appointments.",
    createdAt: Timestamp.fromDate(new Date(Date.now() - 120 * 24 * 60 * 60 * 1000)), // 120 days ago (4 months - should NOT show)
    updatedAt: Timestamp.fromDate(new Date())
  }
];

async function addTestData() {
  try {
    for (const car of testCars) {
      await addDoc(collection(db, COLLECTIONS.CARS), car);
      console.log(`Added ${car.brand} ${car.model}`);
    }
    console.log('All test data added successfully');
  } catch (error) {
    console.error('Error adding test data:', error);
  }
}

// Run the function
addTestData();