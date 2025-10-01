/**
 * Utility functions for formatting display values
 */

/**
 * Format price value to currency string
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
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
  
  // If it's a number, format with commas
  return new Intl.NumberFormat('en-US').format(mileage) + ' miles';
}