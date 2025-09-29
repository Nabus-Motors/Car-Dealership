import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  // Remove unused DocumentReference import 
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { deleteCarFolder } from "./storageService";
import { Car } from "../types";

type CarInput = Omit<Car, 'id' | 'createdAt' | 'updatedAt'> & {
  features?: string[];
};

// Function to add a car listing to Firestore
export const addCarListing = async (carData: CarInput): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "cars"), {
      ...carData,
      features: carData.features || [],
      createdAt: serverTimestamp(),
    });
    console.log("Car listing added with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding car listing: ", error);
    throw error;
  }
};

// Function to delete a car listing and its images
export const deleteCar = async (carId: string): Promise<void> => {
  try {
    // Delete images first
    await deleteCarFolder(carId);
    
    // Then delete the Firestore document
    await deleteDoc(doc(db, "cars", carId));
    
    console.log("Car and associated images deleted successfully");
  } catch (error) {
    console.error("Error deleting car: ", error);
    throw error;
  }
};