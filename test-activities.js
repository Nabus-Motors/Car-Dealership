// Test script to check if activities are being logged to Firebase
import { logActivity } from './src/services/activityService.js';

async function testActivityLogging() {
  try {
    console.log('Testing activity logging...');
    
    await logActivity(
      'car_added',
      'Test activity for debugging',
      'test-user-id',
      'Test User',
      {
        entityId: 'test-car-id',
        details: { test: true },
        status: 'success'
      }
    );
    
    console.log('Test activity logged successfully!');
  } catch (error) {
    console.error('Failed to log test activity:', error);
  }
}

testActivityLogging();