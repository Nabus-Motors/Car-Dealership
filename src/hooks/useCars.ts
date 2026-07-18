import { useState, useEffect, useCallback } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, QuerySnapshot, DocumentData, orderBy, limit } from 'firebase/firestore';
import { db, storage } from '../firebase/firebase';
import type { Car } from '@/types/car';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Cache for cars data
const carsCache = new Map<string, { data: Car[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check cache first
    const cacheKey = 'all-cars';
    const cachedData = carsCache.get(cacheKey);
    
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      setCars(cachedData.data);
      setLoading(false);
      // Still subscribe for real-time updates in background
    }

    // Subscribe to real-time updates with optimization
    // Limit initial query to improve performance
    const q = query(
      collection(db, 'cars'),
      orderBy('createdAt', 'desc'),
      limit(100) // Limit to 100 cars initially
    );

    const unsubscribe = onSnapshot(
      q, 
      (snapshot: QuerySnapshot<DocumentData>) => {
        const carList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Car[];
        
        setCars(carList);
        setLoading(false);
        
        // Update cache
        carsCache.set(cacheKey, {
          data: carList,
          timestamp: Date.now(),
        });
      },
      (err: Error) => {
        console.error('Error fetching cars:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addCar = useCallback(async (car: Omit<Car, 'id'>, imageFiles: File[]) => {
    try {
      setError(null);
      
      // Upload images with better error handling and progress tracking
      const imageUrls: string[] = [];
      for (const imageFile of imageFiles) {
        try {
          const timestamp = Date.now();
          const randomStr = Math.random().toString(36).substring(2, 8);
          const storageRef = ref(storage, `cars/${timestamp}_${randomStr}_${imageFile.name}`);
          
          // Upload with metadata
          await uploadBytes(storageRef, imageFile, {
            contentType: imageFile.type || 'image/jpeg',
            cacheControl: 'public, max-age=31536000',
          });
          
          const imageUrl = await getDownloadURL(storageRef);
          imageUrls.push(imageUrl);
        } catch (err) {
          console.error(`Error uploading image ${imageFile.name}:`, err);
          throw new Error(`Failed to upload image: ${imageFile.name}`);
        }
      }

      // Add car with image URLs to Firestore
      const docRef = await addDoc(collection(db, 'cars'), {
        ...car,
        imageUrls,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Clear cache to force refresh
      carsCache.delete('all-cars');
      
      return docRef.id;
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateCar = useCallback(async (id: string, updates: Partial<Car>, newImageFiles?: File[]) => {
    try {
      setError(null);
      
      if (newImageFiles?.length) {
        // Delete old images if they exist
        const oldCar = cars.find(c => c.id === id);
        if (oldCar?.imageUrls?.length) {
          for (const imageUrl of oldCar.imageUrls) {
            try {
              const oldImageRef = ref(storage, imageUrl);
              await deleteObject(oldImageRef);
            } catch (error) {
              console.error('Error deleting old image:', error);
              // Continue anyway
            }
          }
        }

        // Upload new images
        const imageUrls: string[] = [];
        for (const imageFile of newImageFiles) {
          try {
            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substring(2, 8);
            const storageRef = ref(storage, `cars/${timestamp}_${randomStr}_${imageFile.name}`);
            
            await uploadBytes(storageRef, imageFile, {
              contentType: imageFile.type || 'image/jpeg',
              cacheControl: 'public, max-age=31536000',
            });
            
            const imageUrl = await getDownloadURL(storageRef);
            imageUrls.push(imageUrl);
          } catch (error) {
            console.error('Error uploading new image:', error);
            throw error;
          }
        }
        updates.imageUrls = imageUrls;
      }

      const carRef = doc(db, 'cars', id);
      await updateDoc(carRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      // Clear cache
      carsCache.delete('all-cars');
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      throw err;
    }
  }, [cars]);

  const deleteCar = useCallback(async (id: string) => {
    try {
      setError(null);
      
      // Delete images first
      const car = cars.find(c => c.id === id);
      if (car?.imageUrls?.length) {
        for (const imageUrl of car.imageUrls) {
          try {
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
          } catch (error) {
            console.error('Error deleting image:', error);
            // Continue anyway
          }
        }
      }

      // Then delete the car document
      await deleteDoc(doc(db, 'cars', id));

      // Clear cache
      carsCache.delete('all-cars');
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      throw err;
    }
  }, [cars]);

  return {
    cars,
    loading,
    error,
    addCar,
    updateCar,
    deleteCar
  };
}
