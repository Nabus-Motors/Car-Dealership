import { db, COLLECTIONS } from './firebase-node';
import { collection, getDocs } from 'firebase/firestore';

async function inspectImageUrls() {
  try {
    const snapshot = await getDocs(collection(db, COLLECTIONS.CARS));
    
    console.log(`Found ${snapshot.docs.length} cars in database`);
    
    snapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`\n--- Car ${index + 1} (${doc.id}) ---`);
      console.log(`Brand: ${data.brand} ${data.model}`);
      console.log(`ImageUrls:`, data.imageUrls);
      console.log(`Type:`, typeof data.imageUrls);
      console.log(`Array?:`, Array.isArray(data.imageUrls));
      if (data.imageUrls && Array.isArray(data.imageUrls)) {
        console.log(`Count:`, data.imageUrls.length);
        data.imageUrls.forEach((url: string, i: number) => {
          console.log(`  [${i}]:`, url);
        });
      }
    });
  } catch (error) {
    console.error('Error inspecting data:', error);
  }
}

inspectImageUrls();