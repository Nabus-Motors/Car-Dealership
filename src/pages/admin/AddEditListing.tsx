import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AddEditListingSkeleton } from '../../components/ui/skeleton';
import { Upload, X, Save, ArrowLeft } from 'lucide-react';
import { StorageImage } from '@/components/figma/StorageImage';
import { Car } from '../../types/car';
import { getCarById, createCar, updateCar } from '../../services/firestoreService';
import { uploadImages } from '../../services/storageService';
import toast from 'react-hot-toast';
import { serverTimestamp } from 'firebase/firestore';
import { normalizeImageUrls } from '@/utils/images';

interface FormData {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  condition: string;
  description: string;
  features: string[];
  images: File[];
  existingImages: string[];
  status: 'draft' | 'published' | 'sold' | 'new';
  category?: 'Registered' | 'Unregistered';
}

interface ValidationErrors {
  [key: string]: string;
}

export const AddEditListing: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<FormData>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    transmission: '',
    fuelType: '',
    condition: '',
    description: '',
    features: [],
    images: [],
    existingImages: [],
    status: 'draft',
    category: undefined
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    if (isEditing && id) {
      loadCarData(id);
    }
  }, [id, isEditing]);

  const loadCarData = async (carId: string) => {
    try {
      setIsLoading(true);
      const car = await getCarById(carId);
      if (car) {
        const existing = normalizeImageUrls(car);
        setFormData({
          make: car.brand,
          model: car.model,
          year: car.year,
          price: car.price,
          mileage: parseInt(car.mileage) || 0,
          transmission: car.transmission || '',
          fuelType: car.fuelType,
          condition: car.condition,
          description: car.description || '',
          features: car.features || [],
          images: [],
          existingImages: existing,
          status: car.status || 'draft',
          category: (car as any).category
        });
      }
    } catch (error) {
      console.error('Error loading car data:', error);
      toast.error('Failed to load car data');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.make.trim()) newErrors.make = 'Make is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Please enter a valid year';
    }
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.mileage < 0) newErrors.mileage = 'Mileage cannot be negative';
    if (!formData.transmission) newErrors.transmission = 'Transmission is required';
    if (!formData.fuelType) newErrors.fuelType = 'Fuel type is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    if (!isEditing && formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
      if (errors.images) {
        setErrors(prev => ({ ...prev, images: '' }));
      }
    }
  };

  const removeImage = (index: number, isExisting = false) => {
    if (isExisting) {
      setFormData(prev => ({
        ...prev,
        existingImages: prev.existingImages.filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const addFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    console.log('Starting save process with form data:', {
      images: formData.images.length,
      existingImages: formData.existingImages.length,
      status: formData.status
    });

    setIsSaving(true);
    const status = formData.status;
    const toastId = toast.loading(
      status === 'published' ? 'Publishing listing...' : 
      status === 'sold' ? 'Marking as sold...' :
      status === 'new' ? 'Marking as new...' : 'Saving draft...'
    );

    try {
      let imageUrls = [...formData.existingImages];
      console.log('Initial imageUrls:', imageUrls);

      // For new cars, we need to create the document first to get an ID for image upload
      let carId = id;
      if (!isEditing) {
        console.log('Creating new car document...');
        // Create car without images first
        const tempCarData: Omit<Car, 'id'> = {
          brand: formData.make,
          model: formData.model,
          year: formData.year,
          price: formData.price,
          mileage: formData.mileage.toString(),
          transmission: formData.transmission,
          fuelType: formData.fuelType,
          condition: formData.condition as 'New' | 'Used',
          description: formData.description,
          features: formData.features,
          imageUrls: [],
          status: formData.status,
          category: formData.category,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        carId = await createCar(tempCarData);
        console.log('Created car with ID:', carId);
      }

      // Now upload images with the carId
      if (formData.images.length > 0 && carId) {
        console.log(`Uploading ${formData.images.length} new images...`);
        const uploadedUrls = await uploadImages(formData.images, carId);
        console.log('Upload completed, URLs received:', uploadedUrls);
        imageUrls = [...imageUrls, ...uploadedUrls];
      } else {
        console.log('No new images to upload');
      }

      console.log('Final imageUrls for database:', imageUrls);

      // Update the car with the final image URLs (do NOT include createdAt on update)
      const finalCarData: Partial<Car> = {
        brand: formData.make,
        model: formData.model,
        year: formData.year,
        price: formData.price,
        mileage: formData.mileage.toString(),
        transmission: formData.transmission,
        fuelType: formData.fuelType,
        condition: formData.condition as 'New' | 'Used',
        description: formData.description,
        features: formData.features,
        imageUrls: imageUrls,
        status: formData.status,
        category: formData.category,
        updatedAt: serverTimestamp()
      };

      if (carId) {
        console.log('Updating car document with final data:', finalCarData);
        await updateCar(carId, finalCarData);
        console.log('Car updated successfully');
      }

      toast.success(
        formData.status === 'published' ? 'Listing published successfully!' :
        formData.status === 'sold' ? 'Listing marked as sold successfully!' :
        formData.status === 'new' ? 'Listing marked as new successfully!' :
        'Draft saved successfully!',
        { id: toastId }
      );

      navigate('/admin/listings');
    } catch (error) {
      console.error('Error saving car:', error);
      toast.error('Failed to save listing. Please try again.', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <AddEditListingSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin/listings')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Listings
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Edit Listing' : 'Add New Car'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Car Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="make">Make *</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => handleInputChange('make', e.target.value)}
                placeholder="e.g., Toyota"
                className={errors.make ? 'border-red-500' : ''}
              />
              {errors.make && <p className="text-sm text-red-500 mt-1">{errors.make}</p>}
            </div>

            <div>
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="e.g., Camry"
                className={errors.model ? 'border-red-500' : ''}
              />
              {errors.model && <p className="text-sm text-red-500 mt-1">{errors.model}</p>}
            </div>

            <div>
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                min="1900"
                max={new Date().getFullYear() + 1}
                className={errors.year ? 'border-red-500' : ''}
              />
              {errors.year && <p className="text-sm text-red-500 mt-1">{errors.year}</p>}
            </div>

            <div>
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                min="0"
                step="0.01"
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
            </div>

            <div>
              <Label htmlFor="mileage">Mileage *</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => handleInputChange('mileage', parseInt(e.target.value))}
                min="0"
                className={errors.mileage ? 'border-red-500' : ''}
              />
              {errors.mileage && <p className="text-sm text-red-500 mt-1">{errors.mileage}</p>}
            </div>

            <div>
              <Label htmlFor="transmission">Transmission *</Label>
              <Select
                value={formData.transmission}
                onValueChange={(value) => handleInputChange('transmission', value)}
              >
                <SelectTrigger className={errors.transmission ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Automatic">Automatic</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="CVT">CVT</SelectItem>
                </SelectContent>
              </Select>
              {errors.transmission && <p className="text-sm text-red-500 mt-1">{errors.transmission}</p>}
            </div>

            <div>
              <Label htmlFor="fuelType">Fuel Type *</Label>
              <Select
                value={formData.fuelType}
                onValueChange={(value) => handleInputChange('fuelType', value)}
              >
                <SelectTrigger className={errors.fuelType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gasoline">Gasoline</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Electric">Electric</SelectItem>
                </SelectContent>
              </Select>
              {errors.fuelType && <p className="text-sm text-red-500 mt-1">{errors.fuelType}</p>}
            </div>

            <div>
              <Label htmlFor="condition">Condition *</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) => handleInputChange('condition', value)}
              >
                <SelectTrigger className={errors.condition ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Used">Used</SelectItem>
                  <SelectItem value="Certified Pre-Owned">Certified Pre-Owned</SelectItem>
                </SelectContent>
              </Select>
              {errors.condition && <p className="text-sm text-red-500 mt-1">{errors.condition}</p>}
            </div>

            <div>
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status}</p>}
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Registered">Registered</SelectItem>
                  <SelectItem value="Unregistered">Unregistered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the car's features, history, and condition..."
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
          </div>

          <div>
            <Label>Features</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="Add a feature..."
                onKeyPress={(e) => e.key === 'Enter' && addFeature()}
              />
              <Button type="button" onClick={addFeature} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {feature}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeFeature(feature)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold">Images</Label>
            <div className="space-y-4">
              {/* Upload Area */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-red-400 hover:bg-red-50 transition-all duration-200 bg-gray-50"
                >
                  <div className="text-center space-y-2">
                    <Upload className="h-10 w-10 mx-auto text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Click to upload images</p>
                      <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB each</p>
                    </div>
                  </div>
                </label>
                {errors.images && <p className="text-sm text-red-500 mt-2">{errors.images}</p>}
              </div>

              {/* Image Previews */}
              {(formData.existingImages.length > 0 || formData.images.length > 0) && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Image Preview</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* Existing Images */}
                    {formData.existingImages.map((url, index) => (
                      <div key={`existing-${index}`} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100">
                          <StorageImage
                            src={url}
                            alt={`Car image ${index + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index, true)}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                          Saved
                        </div>
                      </div>
                    ))}
                    
                    {/* New Images */}
                    {formData.images.map((file, index) => {
                      const url = URL.createObjectURL(file);
                      return (
                        <div key={`new-${index}`} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border-2 border-green-200 bg-gray-100">
                            <img
                              src={url}
                              alt={`New car image ${index + 1}`}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              removeImage(index, false);
                              URL.revokeObjectURL(url);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <div className="absolute bottom-2 left-2 bg-green-600/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                            New
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                Please fix the errors above before saving.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/listings')}
              disabled={isSaving}
              className="sm:flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => { 
                setFormData(prev => ({ ...prev, status: 'draft' })); 
                await handleSave(); 
              }}
              disabled={isSaving}
              className="sm:flex-1 bg-gray-900 hover:bg-gray-800"
            >
              {isSaving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                <div className="flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </div>
              )}
            </Button>
            <Button
              type="button"
              onClick={async () => { 
                setFormData(prev => ({ ...prev, status: 'published' })); 
                await handleSave(); 
              }}
              disabled={isSaving}
              className="sm:flex-1 bg-red-600 hover:bg-red-700"
            >
              Publish
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEditListing;
