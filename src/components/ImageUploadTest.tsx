import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { uploadImages } from '@/services/storageService';
import { Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export function ImageUploadTest() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    console.log('Selected files:', files);
  };

  const testUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select files first');
      return;
    }

    setUploading(true);
    console.log('Starting test upload...');

    try {
      const testCarId = 'test-' + Date.now();
      console.log('Using test car ID:', testCarId);
      
      const urls = await uploadImages(selectedFiles, testCarId);
      console.log('Upload successful! URLs:', urls);
      
      setUploadedUrls(urls);
      toast.success(`Successfully uploaded ${urls.length} images!`);
      
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>🧪 Image Upload Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
          />
          {selectedFiles.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {selectedFiles.length} file(s)
            </p>
          )}
        </div>

        <Button 
          onClick={testUpload} 
          disabled={uploading || selectedFiles.length === 0}
          className="w-full"
        >
          {uploading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Uploading...
            </div>
          ) : (
            <div className="flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Test Upload
            </div>
          )}
        </Button>

        {uploadedUrls.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Uploaded Images:</h4>
            <div className="grid grid-cols-2 gap-2">
              {uploadedUrls.map((url, index) => (
                <div key={index} className="aspect-square rounded overflow-hidden bg-gray-100">
                  <img 
                    src={url} 
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image load error:', e);
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}