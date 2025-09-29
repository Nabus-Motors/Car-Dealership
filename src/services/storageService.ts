import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";
import { storage } from "../firebase/firebase";

// Utility function to generate a unique filename
const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split(".").pop();
  return `${timestamp}-${randomString}.${extension}`;
};

// Function to upload a single image
export const uploadImage = async (file: File, carId: string): Promise<string> => {
  try {
    const uniqueFileName = generateUniqueFileName(file.name);
    const storageRef = ref(storage, `cars/${carId}/${uniqueFileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

// Function to upload multiple images
export const uploadImages = async (files: File[], carId: string): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file: File) => uploadImage(file, carId));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};

// Function to delete a single image by URL
export const deleteImageByUrl = async (imageUrl: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    console.log("Image deleted successfully");
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

// Function to delete all images in a car's folder
export const deleteCarFolder = async (carId: string): Promise<void> => {
  try {
    const folderRef = ref(storage, `cars/${carId}`);
    const filesList = await listAll(folderRef);
    
    const deletePromises = filesList.items.map(item => deleteObject(item));
    await Promise.all(deletePromises);
    
    console.log("Car folder deleted successfully");
  } catch (error) {
    console.error("Error deleting car folder:", error);
    throw error;
  }
};

// Function to get secure URL for an image
export const getSecureImageUrl = async (imageRef: string): Promise<string> => {
  try {
    const url = await getDownloadURL(ref(storage, imageRef));
    return url;
  } catch (error) {
    console.error("Error getting secure URL:", error);
    throw error;
  }
};