import React, { useState } from 'react';
import { AdminHeader } from './AdminHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { ImageWithFallback } from '../figma/ImageWithFallback';

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
  condition: string;
  fuelType: string;
  transmission: string;
  description: string;
  isActive: boolean;
}

export function AddEditListing({ onNavigate, carId }: AddEditListingProps) {
  const isEditing = Boolean(carId);
  
  const [formData, setFormData] = useState<CarFormData>({
    brand: isEditing ? 'BMW' : '',
    model: isEditing ? 'M5 Sedan' : '',
    year: isEditing ? '2024' : '',
    price: isEditing ? '105000' : '',
    mileage: isEditing ? '500' : '',
    condition: isEditing ? 'new' : '',
    fuelType: isEditing ? 'gasoline' : '',
    transmission: isEditing ? 'automatic' : '',
    description: isEditing ? 'Luxury sports sedan with exceptional performance and comfort features.' : '',
    isActive: isEditing ? true : true
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>(
    isEditing 
      ? ['https://images.unsplash.com/photo-1734299388217-2ebc605ef43f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibXclMjBzZWRhbiUyMGJsYWNrfGVufDF8fHx8MTc1ODYyNjczMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral']
      : []
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real application, you would send this data to a server
      alert(`Car listing ${isEditing ? 'updated' : 'created'} successfully!`);
      onNavigate('listings');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In a real application, you would upload these to a server
      // For demo purposes, we'll add placeholder images
      const newImages = Array.from(files).map((_, index) => 
        `https://images.unsplash.com/photo-1653047256226-5abbfa82f1d7?w=400&h=300&fit=crop&crop=center&auto=format&q=80&ixid=${index}`
      );
      setUploadedImages(prev => [...prev, ...newImages]);
      
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
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

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
                  <Select value={formData.brand} onValueChange={(value) => handleInputChange('brand', value)}>
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
                  <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                    <SelectTrigger className={errors.condition ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
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
                  <Select value={formData.fuelType} onValueChange={(value) => handleInputChange('fuelType', value)}>
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
                  <Select value={formData.transmission} onValueChange={(value) => handleInputChange('transmission', value)}>
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
                  <div className="text-4xl mb-4">📸</div>
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
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
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
                onClick={(e) => {
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
              >
                {isEditing ? 'Update Listing' : 'Publish Listing'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}