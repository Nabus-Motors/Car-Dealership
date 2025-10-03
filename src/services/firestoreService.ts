import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  updateDoc,
  serverTimestamp,
  // Remove unused DocumentReference import 
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Car } from "../types/car";
import { logActivity } from "./activityService";

type CarInput = Omit<Car, 'id' | 'createdAt' | 'updatedAt'>;

// Function to add a car listing to Firestore
export const addCarListing = async (
  carData: CarInput, 
  userId?: string, 
  userName?: string
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "cars"), {
      ...carData,
      createdAt: serverTimestamp(),
    });
    
    // Log activity
    if (userId && userName) {
      await logActivity(
        'car_added',
        `Added new ${carData.year} ${carData.brand} ${carData.model} to inventory`,
        userId,
        userName,
        {
          entityId: docRef.id,
          status: 'success',
          details: {
            brand: carData.brand,
            model: carData.model,
            year: carData.year,
            price: carData.price
          }
        }
      );
    }
    
    console.log("Car listing added with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding car listing: ", error);
    throw error;
  }
};

// Function to delete a car listing and its images
export const deleteCar = async (
  carId: string, 
  userId?: string, 
  userName?: string,
  carDetails?: { brand?: string; model?: string; year?: number }
): Promise<void> => {
  try {
    // Since we're using base64 images stored in Firestore,
    // we only need to delete the Firestore document
    // The images are part of the document and will be deleted automatically
    await deleteDoc(doc(db, "cars", carId));
    
    // Log activity
    if (userId && userName) {
      await logActivity(
        'car_deleted',
        `Deleted ${carDetails?.year || ''} ${carDetails?.brand || ''} ${carDetails?.model || 'car'} from inventory`,
        userId,
        userName,
        {
          entityId: carId,
          status: 'success',
          details: carDetails || {}
        }
      );
    }
    
    console.log("Car deleted successfully");
  } catch (error) {
    console.error("Error deleting car: ", error);
    throw error;
  }
};

// New: Create a car (explicit create)
export const createCar = async (carData: Omit<Car, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "cars"), {
      ...carData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating car:", error);
    throw error;
  }
};

// New: Update a car (partial update)
export const updateCar = async (carId: string, data: Partial<Car>): Promise<void> => {
  try {
    await updateDoc(doc(db, "cars", carId), {
      ...data,
      updatedAt: serverTimestamp(),
    } as any);
  } catch (error) {
    console.error("Error updating car:", error);
    throw error;
  }
};

// Function to save a car (create new or update existing)
export const saveCarToFirestore = async (carData: Omit<Car, 'id'>, carId?: string): Promise<string> => {
  try {
    if (carId) {
      // Update existing car
      await updateDoc(doc(db, "cars", carId), {
        ...carData,
        updatedAt: serverTimestamp(),
      });
      console.log("Car listing updated with ID: ", carId);
      return carId;
    } else {
      // Create new car
      const docRef = await addDoc(collection(db, "cars"), {
        ...carData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log("Car listing created with ID: ", docRef.id);
      return docRef.id;
    }
  } catch (error) {
    console.error("Error saving car listing: ", error);
    throw error;
  }
};

// Function to get a car by ID
export const getCarById = async (carId: string): Promise<Car | null> => {
  try {
    const docRef = doc(db, "cars", carId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Car;
    } else {
      console.log("No car found with ID: ", carId);
      return null;
    }
  } catch (error) {
    console.error("Error getting car: ", error);
    throw error;
  }
};