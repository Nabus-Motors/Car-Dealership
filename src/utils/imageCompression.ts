/* Image compression configuration and utilities */

export const MAX_CARD_WIDTH = 600;
export const MAX_HERO_WIDTH = 1920;
export const MAX_THUMB_WIDTH = 200;
export const JPEG_QUALITY = 0.82;

/**
 * Compress an image file to a smaller size while maintaining quality
 * @param file - The image file to compress
 * @param maxWidth - Maximum width of the output image (default: 600px)
 * @param quality - JPEG compression quality 0-1 (default: 0.82)
 * @returns Promise resolving to the compressed File
 */
export async function compressImage(
  file: File,
  maxWidth: number = MAX_CARD_WIDTH,
  quality: number = JPEG_QUALITY
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        // Create canvas and draw image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob with compression
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }

            // Create new File from blob
            const compressedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, '.jpg'),
              { type: 'image/jpeg', lastModified: Date.now() }
            );

            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Compress multiple images in parallel
 * @param files - Array of image files to compress
 * @param maxWidth - Maximum width for all images
 * @param quality - Compression quality for all images
 * @returns Promise resolving to array of compressed Files
 */
export async function compressImages(
  files: File[],
  maxWidth: number = MAX_CARD_WIDTH,
  quality: number = JPEG_QUALITY
): Promise<File[]> {
  return Promise.all(
    files.map((file) => compressImage(file, maxWidth, quality))
  );
}

/**
 * Validate image file before upload
 * Checks file type and initial size
 * @param file - Image file to validate
 * @param maxSize - Maximum file size in bytes
 * @returns Validation result with status and message
 */
export function validateImageFile(
  file: File,
  maxSize: number = 30 * 1024 * 1024 // 30MB initial max (before compression)
): { valid: boolean; message?: string } {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      message: 'Invalid file type. Please upload JPG, PNG, or WebP images.'
    };
  }

  // Check file size (initial check before compression)
  if (file.size > maxSize) {
    return {
      valid: false,
      message: `File size exceeds ${maxSize / (1024 * 1024)}MB limit.`
    };
  }

  return { valid: true };
}

/**
 * Format file size for display
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
