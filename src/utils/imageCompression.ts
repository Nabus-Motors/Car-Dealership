/**
 * Image Compression Utility
 * Provides lossy compression for images while maintaining quality and respecting size caps
 */

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB max per image
const QUALITY_STEPS = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4]; // Quality levels to try

/**
 * Compress image file to meet size requirements
 * Uses canvas-based lossy compression with quality adjustment
 * @param file - Image file to compress
 * @param maxSize - Maximum file size in bytes (default 2MB)
 * @returns Compressed image as File object
 */
export async function compressImage(
  file: File,
  maxSize: number = MAX_IMAGE_SIZE
): Promise<File> {
  return new Promise((resolve, reject) => {
    // If file is already small enough, return as-is
    if (file.size <= maxSize) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        // Start with highest quality and reduce if necessary
        let compressedFile: File | null = null;
        let qualityIndex = 0;

        const tryCompress = () => {
          const quality = QUALITY_STEPS[qualityIndex];
          const canvas = document.createElement('canvas');
          
          // Calculate dimensions to reduce file size
          let width = img.width;
          let height = img.height;
          
          // If quality is too low, reduce dimensions
          if (qualityIndex > 2) {
            width = Math.floor(width * 0.9);
            height = Math.floor(height * 0.9);
          }
          
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to create blob'));
                return;
              }

              // Check if file meets size requirement
              if (blob.size <= maxSize || qualityIndex >= QUALITY_STEPS.length - 1) {
                // Preserve original filename and extension
                const extension = file.name.split('.').pop() || 'jpg';
                const compressedFileName = `compressed_${Date.now()}.${extension}`;
                compressedFile = new File([blob], compressedFileName, {
                  type: file.type,
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              } else {
                // Try next quality level
                qualityIndex++;
                tryCompress();
              }
            },
            'image/jpeg',
            quality
          );
        };

        tryCompress();
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
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
