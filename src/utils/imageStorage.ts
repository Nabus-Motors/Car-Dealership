// Utility functions for handling images without Firebase Storage

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

export const convertFilesToBase64 = async (files: File[]): Promise<string[]> => {
  try {
    const base64Promises = files.map(file => convertFileToBase64(file));
    const base64Strings = await Promise.all(base64Promises);
    return base64Strings;
  } catch (error) {
    console.error('Error converting files to base64:', error);
    throw error;
  }
};

export const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      const width = img.width * ratio;
      const height = img.height * ratio;

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      ctx?.drawImage(img, 0, 0, width, height);
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const compressImages = async (files: File[], maxWidth: number = 800, quality: number = 0.8): Promise<string[]> => {
  try {
    const compressPromises = files.map(file => compressImage(file, maxWidth, quality));
    const compressedImages = await Promise.all(compressPromises);
    return compressedImages;
  } catch (error) {
    console.error('Error compressing images:', error);
    throw error;
  }
};