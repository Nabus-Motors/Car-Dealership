// Add this to browser console when on your site to add test cars with images
// Go to http://localhost:3000 and open browser dev tools, then paste this

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, COLLECTIONS } from '/src/firebase/firebase.js';

async function addCarWithImage() {
  try {
    const testCar = {
      brand: "Ferrari",
      model: "488 GTB", 
      year: 2023,
      price: 285000,
      mileage: "2500",
      fuelType: "Gasoline",
      condition: "New",
      transmission: "Automatic",
      description: "Stunning Ferrari 488 GTB in pristine condition",
      features: ["Carbon Fiber Interior", "Sport Package", "Navigation", "Premium Sound"],
      imageUrls: [
        "https://images.unsplash.com/photo-1653047256226-5abbfa82f1d7?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1614013719401-6b8e63f5e64d?w=800&h=600&fit=crop"
      ],
      status: "published",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.CARS), testCar);
    console.log("Added Ferrari with ID:", docRef.id);
    
    // Add another car
    const testCar2 = {
      brand: "Tesla",
      model: "Model S",
      year: 2024, 
      price: 89000,
      mileage: "1200",
      fuelType: "Electric",
      condition: "New",
      transmission: "Automatic",
      description: "Latest Tesla Model S with Autopilot",
      features: ["Autopilot", "Premium Sound", "Extended Range", "Heated Seats"],
      imageUrls: [
        "https://images.unsplash.com/photo-1610470850940-27b52ca7c0fe?w=800&h=600&fit=crop"
      ],
      status: "published", 
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef2 = await addDoc(collection(db, COLLECTIONS.CARS), testCar2);
    console.log("Added Tesla with ID:", docRef2.id);
    
  } catch (error) {
    console.error("Error adding cars:", error);
  }
}

addCarWithImage();