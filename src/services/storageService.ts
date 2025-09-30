import { compressImages } from '../utils/imageStorage';

// Mock function to replace Firebase Storage upload with base64 encoding
export const uploadImages = async (files: File[], carId: string): Promise<string[]> => {
  try {
    console.log(`Starting base64 conversion of ${files.length} images for car ${carId}`);
    
    // Compress images to base64 with reasonable quality
    const base64Images = await compressImages(files, 800, 0.7);
    
    console.log(`Successfully converted ${base64Images.length} images to base64`);
    console.log('Base64 images ready for storage in Firestore');
    
    return base64Images;
  } catch (error) {
    console.error("Error converting images to base64:", error);
    throw error;
  }
};

// Keep the original Firebase Storage functions for future use
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";
import { storage } from "../firebase/firebase";

// Utility function to generate a unique filename
const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split(".").pop();
  return `${timestamp}-${randomString}.${extension}`;
};

// Original Firebase Storage upload function (disabled for now)
export const uploadImageToFirebase = async (file: File, carId: string): Promise<string> => {
  try {
    const uniqueFileName = generateUniqueFileName(file.name);
    const storageRef = ref(storage, `cars/${carId}/${uniqueFileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image to Firebase:", error);
    throw error;
  }
};

// Original Firebase Storage upload function (backup)
export const uploadImagesToFirebase = async (files: File[], carId: string): Promise<string[]> => {
  try {
    console.log(`Starting upload of ${files.length} images for car ${carId}`);
    const uploadPromises = files.map((file: File, index: number) => {
      console.log(`Uploading file ${index + 1}: ${file.name} (${file.size} bytes)`);
      return uploadImageToFirebase(file, carId);
    });
    const urls = await Promise.all(uploadPromises);
    console.log(`Successfully uploaded ${urls.length} images:`, urls);
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