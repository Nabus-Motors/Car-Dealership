import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { AddEditListingSkeleton } from '../../components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { Car } from '../../types/car';
import { getCarById, createCar, updateCar } from '../../services/firestoreService';
import { uploadImages } from '../../services/storageService';
import { compressImage, validateImageFile, formatFileSize } from '../../utils/imageCompression';
import toast from 'react-hot-toast';
import { serverTimestamp } from 'firebase/firestore';
import { normalizeImageUrls } from '@/utils/images';
import { AddEditListingForm } from './AddEditListingForm';

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
    category: undefined,
    technical: {
      engine: {
        cylinders: '',
        displacement: '',
        driveLayout: '',
        horsepower: '',
        rpm: '',
        torque: '',
        compressionRatio: '',
        fuelType: ''
      },
      performance: {
        topTrackSpeed: '',
        acceleration060: ''
      },
      transmission: {
        type: '',
        displacement: ''
      }
    },
    location: {
      address: '',
      latitude: 0,
      longitude: 0,
      city: '',
      country: ''
    }
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
          category: (car as any).category,
          technical: car.technical ? {
            engine: { ...(car.technical.engine || {}), cylinders: car.technical.engine?.cylinders || '', displacement: car.technical.engine?.displacement || '', driveLayout: car.technical.engine?.driveLayout || '', horsepower: car.technical.engine?.horsepower || '', rpm: car.technical.engine?.rpm || '', torque: car.technical.engine?.torque || '', compressionRatio: car.technical.engine?.compressionRatio || '', fuelType: car.technical.engine?.fuelType || '' },
            performance: { topTrackSpeed: car.technical.performance?.topTrackSpeed || '', acceleration060: car.technical.performance?.acceleration060 || '' },
            transmission: { type: car.technical.transmission?.type || '', displacement: car.technical.transmission?.displacement || '' }
          } : {
            engine: { cylinders: '', displacement: '', driveLayout: '', horsepower: '', rpm: '', torque: '', compressionRatio: '', fuelType: '' },
            performance: { topTrackSpeed: '', acceleration060: '' },
            transmission: { type: '', displacement: '' }
          },
          location: car.location ? {
            address: car.location.address || '',
            latitude: car.location.latitude || 0,
            longitude: car.location.longitude || 0,
            city: car.location.city || '',
            country: car.location.country || ''
          } : {
            address: '',
            latitude: 0,
            longitude: 0,
            city: '',
            country: ''
          }
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
    if (formData.description.trim().split('\n').length < 3) {
      newErrors.description = 'Description must be at least 3 lines';
    }

    // Image validation - minimum 10 images
    const totalImages = formData.existingImages.length + formData.images.length;
    if (totalImages < 10) {
      newErrors.images = `Minimum 10 images required (${totalImages}/10)`;
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Check if adding these files would exceed 10 total
    const totalAfterUpload = formData.existingImages.length + formData.images.length + files.length;
    if (totalAfterUpload > 10) {
      toast.error(`Maximum 10 images allowed. You would have ${totalAfterUpload} images.`);
      return;
    }

    if (files.length > 0) {
      // Validate and compress images
      const compressedFiles: File[] = [];
      let hasErrors = false;

      for (const file of files) {
        // Validate file
        const validation = validateImageFile(file);
        if (!validation.valid) {
          toast.error(`${file.name}: ${validation.message}`);
          hasErrors = true;
          continue;
        }

        try {
          // Compress image
          const compressed = await compressImage(file);
          compressedFiles.push(compressed);
          toast.success(`${file.name} (${formatFileSize(compressed.size)}) added`, { duration: 2 });
        } catch (error) {
          toast.error(`Failed to process ${file.name}`);
          hasErrors = true;
        }
      }

      if (compressedFiles.length > 0) {
        setFormData(prev => ({ ...prev, images: [...prev.images, ...compressedFiles] }));
        if (errors.images) {
          setErrors(prev => ({ ...prev, images: '' }));
        }
      }

      if (hasErrors) {
        toast.error('Some files could not be processed. Please try again.');
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
          technical: formData.technical,
          location: formData.location,
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

      // Update the car with the final image URLs
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
        technical: formData.technical,
        location: formData.location,
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
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
        <h1 className="text-3xl font-bold text-[#001F3F]">
          {isEditing ? 'Edit Listing' : 'Add New Car'}
        </h1>
      </div>

      <AddEditListingForm
        formData={formData}
        errors={errors}
        isSaving={isSaving}
        featureInput={featureInput}
        onInputChange={handleInputChange}
        onFeatureInputChange={setFeatureInput}
        onAddFeature={addFeature}
        onRemoveFeature={removeFeature}
        onImageUpload={handleImageUpload}
        onRemoveImage={removeImage}
        onSaveDraft={async () => { 
          setFormData(prev => ({ ...prev, status: 'draft' })); 
          await handleSave(); 
        }}
        onPublish={async () => { 
          setFormData(prev => ({ ...prev, status: 'published' })); 
          await handleSave(); 
        }}
        onNavigateBack={() => navigate('/admin/listings')}
      />
    </div>
  );
};

export default AddEditListing;
