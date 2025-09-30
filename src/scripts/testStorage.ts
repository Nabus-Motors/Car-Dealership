import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getStorage } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
dotenv.config({ path: resolve(__dirname, '../../.env') });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

async function testStorageUpload() {
  try {
    console.log('Testing Firebase Storage upload...');
    
    // Create a simple test file
    const testData = new Blob(['Hello Firebase Storage!'], { type: 'text/plain' });
    const testFile = new File([testData], 'test.txt', { type: 'text/plain' });
    
    const storageRef = ref(storage, `test/${Date.now()}-test.txt`);
    
    console.log('Uploading test file...');
    const snapshot = await uploadBytes(storageRef, testFile);
    console.log('Upload successful:', snapshot);
    
    console.log('Getting download URL...');
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Download URL:', downloadURL);
    
    console.log('✅ Storage upload test successful!');
    
  } catch (error) {
    console.error('❌ Storage upload test failed:', error);
  }
}

testStorageUpload();