import React, { useEffect, useState } from 'react';
import { AdminHeader } from './AdminHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { addCarListing } from '@/services/firestoreService';
import { uploadImages, deleteImageByUrl } from '@/services/storageService';
import { updateDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import type { Car } from '@/types/car';

interface AddEditListingProps {
  onNavigate: (page: string) => void;
  carId?: string;
}

interface CarFormData {
  brand: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  condition: 'New' | 'Used' | '';
  fuelType: string;
  transmission: string;
  description: string;
  isActive: boolean;
}

export function AddEditListing({ onNavigate, carId }: AddEditListingProps) {
  // Support both prop and route param
  const params = useParams();
  const routeId = params.id;
  const effectiveCarId = carId || routeId;
  const isEditing = Boolean(effectiveCarId);
  
  const [formData, setFormData] = useState<CarFormData>({
    brand: isEditing ? 'BMW' : '',
    model: isEditing ? 'M5 Sedan' : '',
    year: isEditing ? '2024' : '',
    price: isEditing ? '105000' : '',
    mileage: isEditing ? '500' : '',
    condition: isEditing ? 'New' : '',
    fuelType: isEditing ? 'gasoline' : '',
    transmission: isEditing ? 'automatic' : '',
    description: isEditing ? 'Luxury sports sedan with exceptional performance and comfort features.' : '',
    isActive: isEditing ? true : true
  });

  // Keep previews and the actual files separately
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Load existing car if editing
  useEffect(() => {
    const loadCar = async () => {
      if (!isEditing || !effectiveCarId) return;
      try {
        const snap = await getDoc(doc(db, 'cars', effectiveCarId));
        if (snap.exists()) {
          const data = snap.data() as Car;
          setFormData({
            brand: data.brand || '',
            model: data.model || '',
            year: String(data.year ?? ''),
            price: String(data.price ?? ''),
            mileage: String(data.mileage ?? ''),
            condition: (data.condition as 'New' | 'Used') ?? '',
            fuelType: data.fuelType || '',
            transmission: data.transmission || '',
            description: data.description || '',
            isActive: (data as any).status ? (data as any).status === 'active' : true,
          });
          const imgs = Array.isArray(data.imageUrls) ? data.imageUrls : [];
          setExistingImageUrls(imgs);
          setUploadedImages(imgs); // show existing as previews
        }
      } catch (e) {
        console.error('Error loading car', e);
      }
    };
    loadCar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveCarId, isEditing]);

  const handleInputChange = (field: keyof CarFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.year.trim()) newErrors.year = 'Year is required';
    if (!formData.price.trim()) newErrors.price = 'Price is required';
    if (!formData.mileage.trim()) newErrors.mileage = 'Mileage is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (!formData.fuelType) newErrors.fuelType = 'Fuel type is required';
    if (!formData.transmission) newErrors.transmission = 'Transmission is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    if (uploadedImages.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      if (isEditing && effectiveCarId) {
        // If editing, optionally delete removed images
        if (removedImageUrls.length > 0) {
          await Promise.all(removedImageUrls.map((url) => deleteImageByUrl(url)));
        }

        // Upload any new images and merge with existing (minus removed)
        const uploadedUrls = imageFiles.length > 0
          ? await uploadImages(imageFiles, effectiveCarId)
          : [];
        const remainingExisting = existingImageUrls.filter((url) => !removedImageUrls.includes(url));
        const finalImageUrls = [...remainingExisting, ...uploadedUrls];

        await updateDoc(doc(db, 'cars', effectiveCarId), {
          brand: formData.brand,
          model: formData.model,
          year: Number(formData.year),
          price: Number(formData.price),
          mileage: formData.mileage,
          fuelType: formData.fuelType,
          transmission: formData.transmission,
          description: formData.description,
          condition: formData.condition || 'Used',
          imageUrls: finalImageUrls,
          updatedAt: serverTimestamp(),
          status: formData.isActive ? 'active' : 'inactive',
        });

        onNavigate('listings');
      } else {
        // Create initial Firestore document to obtain the carId
        const newCarId = await addCarListing({
          brand: formData.brand,
          model: formData.model,
          year: Number(formData.year),
          price: Number(formData.price),
          mileage: formData.mileage,
          fuelType: formData.fuelType,
          description: formData.description,
          condition: formData.condition || 'Used',
          imageUrls: [],
        });

        // Upload images to Storage under this carId
        const urls = await uploadImages(imageFiles, newCarId);

        // Update the Firestore document with the image URLs and updatedAt
        await updateDoc(doc(db, 'cars', newCarId), {
          imageUrls: urls,
          updatedAt: serverTimestamp(),
          // Optional: maintain a status field based on isActive
          status: formData.isActive ? 'active' : 'inactive',
        });
        onNavigate('listings');
      }
    } catch (err) {
      console.error('Error saving listing:', err);
      alert('Failed to save the listing. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setImageFiles(prev => [...prev, ...fileArray]);
      // Generate local previews
      const newPreviews = fileArray.map(file => URL.createObjectURL(file));
      setUploadedImages(prev => [...prev, ...newPreviews]);
      
      // Clear image error
      if (errors.images) {
        setErrors(prev => ({
          ...prev,
          images: ''
        }));
      }
    }
  };

  const removeImage = (index: number) => {
    const url = uploadedImages[index];
    // If the removed url is one of the existing images, mark it for deletion
    if (existingImageUrls.includes(url)) {
      setRemovedImageUrls((prev) => [...prev, url]);
      setExistingImageUrls((prev) => prev.filter((u) => u !== url));
    } else {
      // Otherwise it belongs to newly added files; remove the corresponding file
      setImageFiles(prev => prev.filter((_, i) => i !== index - existingImageUrls.length));
    }
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Clean up blob URLs on unmount
  useEffect(() => {
    return () => {
      uploadedImages.forEach(url => {
        if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
    // We only want this to run on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex-1 bg-gray-50">
      <AdminHeader title={isEditing ? 'Edit Listing' : 'Add New Listing'} />
      
      <div className="p-6 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Select value={formData.brand} onValueChange={(value: string) => handleInputChange('brand', value)}>
                    <SelectTrigger className={errors.brand ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BMW">BMW</SelectItem>
                      <SelectItem value="Mercedes">Mercedes</SelectItem>
                      <SelectItem value="Audi">Audi</SelectItem>
                      <SelectItem value="Ferrari">Ferrari</SelectItem>
                      <SelectItem value="Tesla">Tesla</SelectItem>
                      <SelectItem value="Porsche">Porsche</SelectItem>
                      <SelectItem value="Lamborghini">Lamborghini</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.brand && <p className="text-sm text-red-600">{errors.brand}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="e.g., M5 Sedan"
                    className={errors.model ? 'border-red-500' : ''}
                  />
                  {errors.model && <p className="text-sm text-red-600">{errors.model}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    placeholder="2024"
                    min="1990"
                    max="2025"
                    className={errors.year ? 'border-red-500' : ''}
                  />
                  {errors.year && <p className="text-sm text-red-600">{errors.year}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="105000"
                    min="0"
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mileage">Mileage *</Label>
                  <Input
                    id="mileage"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange('mileage', e.target.value)}
                    placeholder="500"
                    className={errors.mileage ? 'border-red-500' : ''}
                  />
                  {errors.mileage && <p className="text-sm text-red-600">{errors.mileage}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition *</Label>
                  <Select value={formData.condition} onValueChange={(value: 'New' | 'Used') => handleInputChange('condition', value)}>
                    <SelectTrigger className={errors.condition ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Used">Used</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.condition && <p className="text-sm text-red-600">{errors.condition}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fuelType">Fuel Type *</Label>
                  <Select value={formData.fuelType} onValueChange={(value: string) => handleInputChange('fuelType', value)}>
                    <SelectTrigger className={errors.fuelType ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gasoline">Gasoline</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="plug-in-hybrid">Plug-in Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.fuelType && <p className="text-sm text-red-600">{errors.fuelType}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transmission">Transmission *</Label>
                  <Select value={formData.transmission} onValueChange={(value: string) => handleInputChange('transmission', value)}>
                    <SelectTrigger className={errors.transmission ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="cvt">CVT</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.transmission && <p className="text-sm text-red-600">{errors.transmission}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="description">Car Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the car's features, condition, and any special details..."
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload Area */}
              <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                errors.images ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="text-4xl mb-4">�</div>
                  <p className="text-lg font-medium mb-2">Upload Car Images</p>
                  <p className="text-gray-600 mb-4">Drag and drop images here, or click to select files</p>
                  <Button type="button" variant="outline">
                    Choose Files
                  </Button>
                </label>
              </div>
              {errors.images && <p className="text-sm text-red-600">{errors.images}</p>}

              {/* Uploaded Images */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <ImageWithFallback
                        src={image}
                        alt={`Car image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 p-0"
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </Button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <Switch
                  id="active"
                  checked={formData.isActive}
                  onCheckedChange={(checked: boolean) => handleInputChange('isActive', checked)}
                />
                <Label htmlFor="active" className="cursor-pointer">
                  Make this listing active and visible to customers
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onNavigate('listings')}
            >
              Cancel
            </Button>
            
            <div className="space-x-4">
              <Button
                type="submit"
                variant="outline"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  handleInputChange('isActive', false);
                  setTimeout(() => handleSubmit(e), 0);
                }}
              >
                Save as Draft
              </Button>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="inline-flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  isEditing ? 'Update Listing' : 'Publish Listing'
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}