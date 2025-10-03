/**
 * Utility functions for formatting display values
 */

/**
 * Format price value to currency string
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format mileage value to readable string
 */
export function formatMileage(mileage: string | number): string {
  if (typeof mileage === 'string') {
    // If already formatted as string, return as is
    return mileage;
  }
  
  // If it's a number, format with commas and use kilometers
  return new Intl.NumberFormat('en-GH').format(mileage) + ' km';
}

/**
 * Format date to readable string
 */
export function formatDate(date: any): string {
  if (!date) return 'N/A';
  
  // Handle Firestore Timestamp
  if (date && typeof date.toDate === 'function') {
    return date.toDate().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  // Handle regular Date object
  if (date instanceof Date) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  // Handle date string
  if (typeof date === 'string') {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  return 'N/A';
}