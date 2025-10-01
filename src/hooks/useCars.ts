import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { db, storage } from '../firebase/firebase';
import type { Car } from '@/types/car';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export function useCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'cars'));
    const unsubscribe = onSnapshot(q, 
      (snapshot: QuerySnapshot<DocumentData>) => {
        const carList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Car[];
        setCars(carList);
        setLoading(false);
      },
      (err: Error) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addCar = async (car: Omit<Car, 'id'>, imageFiles: File[]) => {
    try {
      // Upload images first
      const imageUrls: string[] = [];
      for (const imageFile of imageFiles) {
        const storageRef = ref(storage, `cars/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);
        imageUrls.push(imageUrl);
      }

      // Add car with image URLs to Firestore
      const docRef = await addDoc(collection(db, 'cars'), {
        ...car,
        imageUrls,
        createdAt: new Date().toISOString()
      });

      return docRef.id;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  const updateCar = async (id: string, updates: Partial<Car>, newImageFiles?: File[]) => {
    try {
      if (newImageFiles?.length) {
        // Delete old images if they exist
        const oldCar = cars.find(c => c.id === id);
        if (oldCar?.imageUrls?.length) {
          for (const imageUrl of oldCar.imageUrls) {
            const oldImageRef = ref(storage, imageUrl);
            try {
              await deleteObject(oldImageRef);
            } catch (error) {
              console.error('Error deleting old image:', error);
            }
          }
        }

        // Upload new images
        const imageUrls: string[] = [];
        for (const imageFile of newImageFiles) {
          const storageRef = ref(storage, `cars/${Date.now()}_${imageFile.name}`);
          await uploadBytes(storageRef, imageFile);
          const imageUrl = await getDownloadURL(storageRef);
          imageUrls.push(imageUrl);
        }
        updates.imageUrls = imageUrls;
      }

      const carRef = doc(db, 'cars', id);
      await updateDoc(carRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  const deleteCar = async (id: string) => {
    try {
      // Delete images first
      const car = cars.find(c => c.id === id);
      if (car?.imageUrls?.length) {
        for (const imageUrl of car.imageUrls) {
          try {
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
          } catch (error) {
            console.error('Error deleting image:', error);
          }
        }
      }

      // Then delete the car document
      await deleteDoc(doc(db, 'cars', id));
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  return {
    cars,
    loading,
    error,
    addCar,
    updateCar,
    deleteCar
  };
}