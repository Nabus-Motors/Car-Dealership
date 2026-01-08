import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/ui/collapsible';
import { Upload, X, Save, ChevronDown, MapPin, Star, Image as ImageIcon } from 'lucide-react';
import { StorageImage } from '@components/figma/StorageImage';
import { formatFileSize } from '../../utils/imageCompression';
import { LocationMapPicker } from './LocationMapPicker';

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
  technical: {
    engine: {
      cylinders: string;
      displacement: string;
      driveLayout: string;
      horsepower: string;
      rpm: string;
      torque: string;
      compressionRatio: string;
      fuelType: string;
    };
    performance: {
      topTrackSpeed: string;
      acceleration060: string;
    };
    transmission: {
      type: string;
      displacement: string;
    };
  };
  location: {
    address: string;
    latitude: number;
    longitude: number;
    city: string;
    country: string;
  };
}

interface ValidationErrors {
  [key: string]: string;
}

interface AddEditListingFormProps {
  formData: FormData;
  errors: ValidationErrors;
  isSaving: boolean;
  featureInput: string;
  onInputChange: (field: keyof FormData, value: any) => void;
  onFeatureInputChange: (value: string) => void;
  onAddFeature: () => void;
  onRemoveFeature: (feature: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number, isExisting: boolean) => void;
  onSaveDraft: () => Promise<void>;
  onPublish: () => Promise<void>;
  onNavigateBack: () => void;
}

export const AddEditListingForm: React.FC<AddEditListingFormProps> = ({
  formData,
  errors,
  isSaving,
  featureInput,
  onInputChange,
  onFeatureInputChange,
  onAddFeature,
  onRemoveFeature,
  onImageUpload,
  onRemoveImage,
  onSaveDraft,
  onPublish,
  onNavigateBack
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Car Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* ===== SECTION 1: OVERVIEW ===== */}
        <div className="border-2 border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-[#001F3F]">
            Car Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="make">Make *</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => onInputChange('make', e.target.value)}
                placeholder="e.g., Toyota"
                className={`border-2 rounded-lg ${errors.make ? 'border-red-500' : 'border-slate-200'}`}
              />
              {errors.make && <p className="text-sm text-red-500 mt-1">{errors.make}</p>}
            </div>

            <div>
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => onInputChange('model', e.target.value)}
                placeholder="e.g., Camry"
                className={`border-2 rounded-lg ${errors.model ? 'border-red-500' : 'border-slate-200'}`}
              />
              {errors.model && <p className="text-sm text-red-500 mt-1">{errors.model}</p>}
            </div>

            <div>
              <Label htmlFor="year">Year *</Label>
              <Select value={formData.year.toString()} onValueChange={(value) => onInputChange('year', parseInt(value))}>
                <SelectTrigger className={`border-2 rounded-lg ${errors.year ? 'border-red-500' : 'border-slate-200'}`}>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {(() => {
                    const years = [];
                    const currentYear = new Date().getFullYear();
                    for (let i = currentYear + 1; i >= 1900; i--) {
                      years.push(i);
                    }
                    return years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ));
                  })()}
                </SelectContent>
              </Select>
              {errors.year && <p className="text-sm text-red-500 mt-1">{errors.year}</p>}
            </div>

            <div>
              <Label htmlFor="price">Price (GHS) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-600 font-semibold">₵</span>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => onInputChange('price', parseInt(e.target.value) || 0)}
                  min="0"
                  className={`border-2 rounded-lg pl-8 ${errors.price ? 'border-red-500' : 'border-slate-200'}`}
                  placeholder="0.00"
                />
              </div>
              {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
            </div>

            <div>
              <Label htmlFor="mileage">Mileage (miles) *</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => onInputChange('mileage', parseInt(e.target.value))}
                min="0"
                className={`border-2 rounded-lg ${errors.mileage ? 'border-red-500' : 'border-slate-200'}`}
              />
              {errors.mileage && <p className="text-sm text-red-500 mt-1">{errors.mileage}</p>}
            </div>

            <div>
              <Label htmlFor="condition">Condition *</Label>
              <Select value={formData.condition} onValueChange={(value) => onInputChange('condition', value)}>
                <SelectTrigger className={`border-2 rounded-lg ${errors.condition ? 'border-red-500' : 'border-slate-200'}`}>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Used">Used</SelectItem>
                </SelectContent>
              </Select>
              {errors.condition && <p className="text-sm text-red-500 mt-1">{errors.condition}</p>}
            </div>

            <div>
              <Label htmlFor="transmission">Transmission Type *</Label>
              <Select value={formData.transmission} onValueChange={(value) => onInputChange('transmission', value)}>
                <SelectTrigger className={`border-2 rounded-lg ${errors.transmission ? 'border-red-500' : 'border-slate-200'}`}>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="Automatic">Automatic</SelectItem>
                  <SelectItem value="CVT">CVT</SelectItem>
                </SelectContent>
              </Select>
              {errors.transmission && <p className="text-sm text-red-500 mt-1">{errors.transmission}</p>}
            </div>

            <div>
              <Label htmlFor="fuelType">Fuel Type *</Label>
              <Select value={formData.fuelType} onValueChange={(value) => onInputChange('fuelType', value)}>
                <SelectTrigger className={`border-2 rounded-lg ${errors.fuelType ? 'border-red-500' : 'border-slate-200'}`}>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Petrol">Petrol</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Electric">Electric</SelectItem>
                </SelectContent>
              </Select>
              {errors.fuelType && <p className="text-sm text-red-500 mt-1">{errors.fuelType}</p>}
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category || ''}
                onValueChange={(value) => onInputChange('category', value)}
              >
                <SelectTrigger className="border-2 rounded-lg border-slate-200">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Registered">Registered</SelectItem>
                  <SelectItem value="Unregistered">Unregistered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => onInputChange('status', value)}>
                <SelectTrigger className={`border-2 rounded-lg ${errors.status ? 'border-red-500' : 'border-slate-200'}`}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description (minimum 3 lines) *</Label>
            <div className={`border-2 rounded-lg ${errors.description ? 'border-red-500' : 'border-slate-200'} h-32 overflow-y-auto`}>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => onInputChange('description', e.target.value)}
                placeholder="This is a beautiful [MAKE] [MODEL] in excellent condition. The vehicle has been well-maintained with service records available. Features include [LIST FEATURES], cruise control, and more. The interior is clean and the exterior shows minimal wear. Perfect for [TYPE OF BUYER]. Priced competitively at $[PRICE]. Contact us for test drive."
                rows={10}
                className={`border-0 rounded-none resize-none`}
              />
            </div>
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* ===== SECTION 2: TECHNICAL DETAILS (OPTIONAL) ===== */}
        <div className="border-2 border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-[#001F3F]">
            Technical Details (Optional)
          </h2>

          {/* Engine Collapsible */}
          <Collapsible className="border border-slate-200 rounded-lg">
            <CollapsibleTrigger className="w-full px-4 py-3 hover:bg-slate-50 font-semibold text-[#001F3F] flex items-center justify-between">
              <span>Engine Specifications</span>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 py-4 border-t border-slate-200 bg-slate-50">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cylinders">Cylinders</Label>
                    <Input
                      id="cylinders"
                      value={formData.technical.engine.cylinders}
                      onChange={(e) =>
                        onInputChange('technical', {
                          ...formData.technical,
                          engine: { ...formData.technical.engine, cylinders: e.target.value }
                        })
                      }
                      placeholder="e.g., 4, 6, 8"
                      className="border-2 rounded-lg border-slate-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="displacement">Displacement (cc/L)</Label>
                    <Input
                      id="displacement"
                      value={formData.technical.engine.displacement}
                      onChange={(e) =>
                        onInputChange('technical', {
                          ...formData.technical,
                          engine: { ...formData.technical.engine, displacement: e.target.value }
                        })
                      }
                      placeholder="e.g., 2.0L"
                      className="border-2 rounded-lg border-slate-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="driveLayout">Drive Layout</Label>
                    <Input
                      id="driveLayout"
                      value={formData.technical.engine.driveLayout}
                      onChange={(e) =>
                        onInputChange('technical', {
                          ...formData.technical,
                          engine: { ...formData.technical.engine, driveLayout: e.target.value }
                        })
                      }
                      placeholder="e.g., FWD, RWD, AWD"
                      className="border-2 rounded-lg border-slate-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="horsepower">Horsepower (hp)</Label>
                    <Input
                      id="horsepower"
                      value={formData.technical.engine.horsepower}
                      onChange={(e) =>
                        onInputChange('technical', {
                          ...formData.technical,
                          engine: { ...formData.technical.engine, horsepower: e.target.value }
                        })
                      }
                      placeholder="e.g., 200"
                      className="border-2 rounded-lg border-slate-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rpm">RPM @ Max Power</Label>
                    <Input
                      id="rpm"
                      value={formData.technical.engine.rpm}
                      onChange={(e) =>
                        onInputChange('technical', {
                          ...formData.technical,
                          engine: { ...formData.technical.engine, rpm: e.target.value }
                        })
                      }
                      placeholder="e.g., 5500"
                      className="border-2 rounded-lg border-slate-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="torque">Torque (lb-ft)</Label>
                    <Input
                      id="torque"
                      value={formData.technical.engine.torque}
                      onChange={(e) =>
                        onInputChange('technical', {
                          ...formData.technical,
                          engine: { ...formData.technical.engine, torque: e.target.value }
                        })
                      }
                      placeholder="e.g., 180"
                      className="border-2 rounded-lg border-slate-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="compressionRatio">Compression Ratio</Label>
                    <Input
                      id="compressionRatio"
                      value={formData.technical.engine.compressionRatio}
                      onChange={(e) =>
                        onInputChange('technical', {
                          ...formData.technical,
                          engine: { ...formData.technical.engine, compressionRatio: e.target.value }
                        })
                      }
                      placeholder="e.g., 10.5:1"
                      className="border-2 rounded-lg border-slate-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="engineFuelType">Engine Fuel Type</Label>
                    <Input
                      id="engineFuelType"
                      value={formData.technical.engine.fuelType}
                      onChange={(e) =>
                        onInputChange('technical', {
                          ...formData.technical,
                          engine: { ...formData.technical.engine, fuelType: e.target.value }
                        })
                      }
                      placeholder="e.g., Premium, Regular"
                      className="border-2 rounded-lg border-slate-200"
                    />
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Performance Collapsible */}
          <Collapsible className="border border-slate-200 rounded-lg">
            <CollapsibleTrigger className="w-full px-4 py-3 hover:bg-slate-50 font-semibold text-[#001F3F] flex items-center justify-between">
              <span>Performance</span>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 py-4 border-t border-slate-200 bg-slate-50">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="topTrackSpeed">Top Track Speed (mph)</Label>
                    <Input
                      id="topTrackSpeed"
                      value={formData.technical.performance.topTrackSpeed}
                      onChange={(e) =>
                        onInputChange('technical', {
                          ...formData.technical,
                          performance: { ...formData.technical.performance, topTrackSpeed: e.target.value }
                        })
                      }
                      placeholder="e.g., 130"
                      className="border-2 rounded-lg border-slate-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="acceleration060">0-60 Acceleration (sec)</Label>
                    <Input
                      id="acceleration060"
                      value={formData.technical.performance.acceleration060}
                      onChange={(e) =>
                        onInputChange('technical', {
                          ...formData.technical,
                          performance: { ...formData.technical.performance, acceleration060: e.target.value }
                        })
                      }
                      placeholder="e.g., 7.2"
                      className="border-2 rounded-lg border-slate-200"
                    />
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Transmission Collapsible */}
          <Collapsible className="border border-slate-200 rounded-lg">
            <CollapsibleTrigger className="w-full px-4 py-3 hover:bg-slate-50 font-semibold text-[#001F3F] flex items-center justify-between">
              <span>Transmission</span>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 py-4 border-t border-slate-200 bg-slate-50">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="transmissionType">Transmission Type</Label>
                    <Input
                      id="transmissionType"
                      value={formData.technical.transmission.type}
                      onChange={(e) =>
                        onInputChange('technical', {
                          ...formData.technical,
                          transmission: { ...formData.technical.transmission, type: e.target.value }
                        })
                      }
                      placeholder="e.g., 6-Speed Automatic"
                      className="border-2 rounded-lg border-slate-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="transmissionDisplacement">Transmission Characteristics</Label>
                    <Input
                      id="transmissionDisplacement"
                      value={formData.technical.transmission.displacement}
                      onChange={(e) =>
                        onInputChange('technical', {
                          ...formData.technical,
                          transmission: { ...formData.technical.transmission, displacement: e.target.value }
                        })
                      }
                      placeholder="e.g., Fluid Coupling"
                      className="border-2 rounded-lg border-slate-200"
                    />
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* ===== SECTION 3: LOCATION ===== */}
        <div className="border-2 border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-[#001F3F] flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location
          </h2>
          <LocationMapPicker
            location={formData.location}
            onLocationChange={(location) => onInputChange('location', location)}
          />
        </div>

        {/* ===== SECTION 4: FEATURES ===== */}
        <div className="border-2 border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-[#001F3F] flex items-center gap-2">
            <Star className="h-5 w-5" />
            Features
          </h2>

          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={featureInput}
                onChange={(e) => onFeatureInputChange(e.target.value)}
                placeholder="Add a feature..."
                onKeyPress={(e) => e.key === 'Enter' && onAddFeature()}
                className="border-2 rounded-lg border-slate-200"
              />
              <Button type="button" onClick={onAddFeature} variant="outline" className="border-2 border-slate-200">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <Badge key={index} className="bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]">
                  {feature}
                  <X
                    className="h-3 w-3 cursor-pointer ml-1"
                    onClick={() => onRemoveFeature(feature)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* ===== IMAGES SECTION ===== */}
        <div className="border-2 border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-[#001F3F] flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Images (Minimum 6 required) - {formData.existingImages.length + formData.images.length}/6
          </h2>

          <div className="space-y-4">
            {/* Upload Area */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#FFD700] rounded-xl cursor-pointer hover:border-[#FFC700] hover:bg-[#FFD700]/5 transition-all duration-200 bg-slate-50"
              >
                <div className="text-center space-y-2">
                  <Upload className="h-10 w-10 mx-auto text-[#FFD700]" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Click to upload images</p>
                    <p className="text-xs text-slate-500">PNG, JPG, JPEG (auto-compressed, max 30MB each)</p>
                  </div>
                </div>
              </label>
              {errors.images && <p className="text-sm text-red-500 mt-2">{errors.images}</p>}
            </div>

            {/* Image Previews */}
            {(formData.existingImages.length > 0 || formData.images.length > 0) && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-slate-700">Image Preview ({formData.existingImages.length + formData.images.length}/6)</h4>
                  <p className="text-xs text-slate-500">Click on an image to set as primary for hero section</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {/* Existing Images */}
                  {formData.existingImages.map((url, index) => {
                    const isPrimary = formData.primaryImageIndex === index;
                    return (
                      <div key={`existing-${index}`} className={`relative group cursor-pointer transition-all duration-200 ${isPrimary ? 'ring-4 ring-[#FFD700]' : ''}`}
                        onClick={() => onImageChange('primaryImageIndex', index)}>
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-slate-200 bg-slate-100 hover:border-[#FFD700] transition-colors duration-200">
                          <StorageImage
                            src={url}
                            alt={`Car image ${index + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveImage(index, true);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                          {isPrimary ? '★ Primary' : 'Saved'}
                        </div>
                      </div>
                    );
                  })}

                  {/* New Images */}
                  {formData.images.map((file, index) => {
                    const existingCount = formData.existingImages.length;
                    const isPrimary = formData.primaryImageIndex === existingCount + index;
                    const url = URL.createObjectURL(file);
                    return (
                      <div key={`new-${index}`} className={`relative group cursor-pointer transition-all duration-200 ${isPrimary ? 'ring-4 ring-[#FFD700]' : ''}`}
                        onClick={() => onImageChange('primaryImageIndex', existingCount + index)}>
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-[#FFD700] bg-slate-100 hover:border-[#FFC700] transition-colors duration-200">
                          <img
                            src={url}
                            alt={`New car image ${index + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveImage(index, false);
                            URL.revokeObjectURL(url);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-[#FFD700]/80 text-[#001F3F] text-xs px-2 py-1 rounded backdrop-blur-sm font-semibold">
                          {isPrimary ? '★ Primary' : `New (${formatFileSize(file.size)})`}
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
            <AlertDescription>Please fix the errors above before saving.</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6">
          <Button
            variant="outline"
            onClick={onNavigateBack}
            disabled={isSaving}
            className="sm:flex-1 border-2 border-slate-300"
          >
            Cancel
          </Button>
          <Button
            onClick={onSaveDraft}
            disabled={isSaving}
            className="sm:flex-1 bg-[#FFD700] hover:bg-[#FFC700] text-[#001F3F] font-bold"
          >
            {isSaving ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#001F3F] mr-2"></div>
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
            onClick={onPublish}
            disabled={isSaving}
            className="sm:flex-1 bg-[#001F3F] hover:bg-[#000d1f] text-white font-bold"
          >
            Publish
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
