import React, { useState } from 'react';
import { uploadImages } from '../services/storageService';
import { addCarListing } from '../services/firestoreService';
import { StorageImage } from './figma/StorageImage';
import { toast } from 'sonner';

const Base64ImageTest: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [testCarId, setTestCarId] = useState<string>('');
  const [base64Images, setBase64Images] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    setBase64Images([]);
    setTestCarId('');
  };

  const testBase64Upload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select some images first');
      return;
    }

    setIsUploading(true);
    try {
      console.log('Testing base64 image upload...');
      
      // Convert images to base64
      const base64Urls = await uploadImages(selectedFiles, 'test-car-id');
      setBase64Images(base64Urls);
      
      // Create a test car listing with base64 images
      const testCar = {
        brand: 'Test Brand',
        model: 'Base64 Test',
        year: 2024,
        price: 25000,
        mileage: '0',
        fuelType: 'petrol',
        transmission: 'manual',
        condition: 'New' as const,
        description: 'Test car for base64 image storage',
        imageUrls: base64Urls,
        features: ['Base64 Storage', 'Test Feature'],
        status: 'published' as const
      };

      const carId = await addCarListing(testCar);
      setTestCarId(carId);
      
      toast.success(`Test car created with ID: ${carId}`);
      console.log('Base64 test successful!', { carId, base64Count: base64Urls.length });
      
    } catch (error) {
      console.error('Base64 test failed:', error);
      toast.error('Base64 test failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-4">Base64 Image Storage Test</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Images to Test:
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {selectedFiles.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Selected: {selectedFiles.length} files
            </p>
            <button
              onClick={testBase64Upload}
              disabled={isUploading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isUploading ? 'Converting & Storing...' : 'Test Base64 Upload'}
            </button>
          </div>
        )}

        {base64Images.length > 0 && (
          <div>
            <h4 className="text-md font-medium mb-2">
              Base64 Images ({base64Images.length}):
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {base64Images.map((base64, index) => (
                <div key={index} className="border rounded p-2">
                  <StorageImage
                    src={base64}
                    alt={`Test image ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    Size: {Math.round(base64.length / 1024)}KB
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {testCarId && (
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-sm text-green-700">
              ✅ Test car created successfully with ID: <code>{testCarId}</code>
            </p>
            <p className="text-xs text-green-600 mt-1">
              Base64 images are now stored in Firestore!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Base64ImageTest;