import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { formatPrice } from '@utils/format';
import { StorageImage } from '@components/figma/StorageImage';
import { Button } from '@components/ui/button';
import { ContactFormDialog } from '@components/ContactFormDialog';
import { db, COLLECTIONS } from '@/firebase/firebase';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { ChevronLeft, ChevronRight, Gauge, MapPin } from 'lucide-react';
import { CarCard } from '@components/CarCard';
import type { Car } from '@/types/car';

export default function CarDetailsPage() {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [similarCars, setSimilarCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'location'>('overview');

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        if (!carId) {
          setLoading(false);
          return;
        }
        
        const carRef = doc(db, COLLECTIONS.CARS, carId);
        const carSnap = await getDoc(carRef);
        
        if (carSnap.exists()) {
          const carData = { id: carSnap.id, ...carSnap.data() } as Car;
          setCar(carData);
          
          // Fetch similar cars by brand
          try {
            const similarSnap = await getDocs(
              query(collection(db, COLLECTIONS.CARS), where('brand', '==', carData.brand), limit(6))
            );
            const similar = similarSnap.docs
              .filter(d => d.id !== carId)
              .slice(0, 4)
              .map(d => ({ id: d.id, ...d.data() } as Car));
            setSimilarCars(similar);
          } catch (err) {
            console.warn('Failed to fetch similar cars:', err);
          }
        } else {
          console.error('Car not found');
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [carId]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent animate-spin mx-auto"></div>
          <p className="text-slate-600 mt-4 font-bold">Loading car details...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="pt-20 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 font-bold">Car not found</p>
          <Button onClick={() => navigate('/explore')} className="mt-4 bg-slate-900 text-white hover:bg-slate-800 font-semibold">
            Back to Inventory
          </Button>
        </div>
      </div>
    );
  }

  const images = car.imageUrls ?? [];
  const nextImage = () => setImageIndex((i) => (i + 1) % Math.max(images.length, 1));
  const prevImage = () => setImageIndex((i) => (i - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1));

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background Image - REDUCED HEIGHT */}
      <section className="relative h-64 md:h-80 lg:h-96 bg-[#050F1F] text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          {images.length > 0 ? (
            <StorageImage
              src={images[imageIndex]}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#001F3F] to-[#002855]" />
          )}
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm"></div>
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center pt-16 md:pt-0">
          <div className="container mx-auto px-4 max-w-7xl w-full">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-[#FFD700] hover:text-white transition-colors mb-4 font-semibold text-sm sm:text-base"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2">
              {car.year} {car.brand} {car.model}
            </h1>
            <p className="text-[#FFD700] text-xl font-semibold">{formatPrice(car.price)}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery - Left/Top */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Image */}
            <div className="relative overflow-hidden bg-slate-100 group shadow-lg">
              <div className="aspect-video">
                {images.length > 0 ? (
                  <StorageImage
                    src={images[imageIndex]}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
                    <div className="text-center">
                      <Gauge className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-600">No images available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#001F3F]/70 hover:bg-[#001F3F] text-white p-3 transition-all z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#001F3F]/70 hover:bg-[#001F3F] text-white p-3 transition-all z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 right-4 bg-[#001F3F]/90 text-[#FFD700] px-3 py-1 text-sm font-bold">
                    {imageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, i) => (
                  <button
                    key={i}
                    onClick={() => setImageIndex(i)}
                    className={`flex-shrink-0 w-20 h-20 overflow-hidden border transition-all ${
                      i === imageIndex ? 'border-2 border-slate-900 shadow-md' : 'border border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <StorageImage src={image} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 bg-white p-8 rounded-lg border border-slate-200">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Transmission</p>
                <p className="text-lg font-bold text-slate-900">{car.transmission || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Fuel Type</p>
                <p className="text-lg font-bold text-slate-900">{car.fuelType || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Mileage</p>
                <p className="text-lg font-bold text-slate-900">{car.mileage}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Year</p>
                <p className="text-lg font-bold text-slate-900">{car.year}</p>
              </div>
              {car.category && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Category</p>
                  <p className="text-lg font-bold text-slate-900">{car.category}</p>
                </div>
              )}
              {car.condition && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Condition</p>
                  <p className="text-lg font-bold text-slate-900">{car.condition}</p>
                </div>
              )}
            </div>

            {/* Details Tabs */}
            <div className="border-b border-slate-200 overflow-hidden rounded-lg bg-white">
              <div className="flex gap-0 border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-4 px-6 text-center font-semibold transition-all border-b-2 ${
                    activeTab === 'overview'
                      ? 'text-[#001F3F] border-[#001F3F]'
                      : 'text-slate-600 border-transparent hover:text-slate-900'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('technical')}
                  className={`flex-1 py-4 px-6 text-center font-semibold transition-all border-b-2 ${
                    activeTab === 'technical'
                      ? 'text-[#001F3F] border-[#001F3F]'
                      : 'text-slate-600 border-transparent hover:text-slate-900'
                  }`}
                >
                  Technical
                </button>
                <button
                  onClick={() => setActiveTab('location')}
                  className={`flex-1 py-4 px-6 text-center font-semibold transition-all border-b-2 ${
                    activeTab === 'location'
                      ? 'text-[#001F3F] border-[#001F3F]'
                      : 'text-slate-600 border-transparent hover:text-slate-900'
                  }`}
                >
                  Location
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-8 bg-white">
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <p className="text-slate-700 leading-relaxed text-lg">
                      {car.description || 'No description available for this vehicle.'}
                    </p>
                  </div>
                )}
                {activeTab === 'technical' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold text-[#001F3F] uppercase tracking-wider mb-2">Drivetrain</h3>
                      <p className="text-lg text-slate-900">{car.transmission || 'N/A'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#001F3F] uppercase tracking-wider mb-2">Fuel Type</h3>
                      <p className="text-lg text-slate-900">{car.fuelType || 'N/A'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#001F3F] uppercase tracking-wider mb-2">Mileage</h3>
                      <p className="text-lg text-slate-900">{car.mileage}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#001F3F] uppercase tracking-wider mb-2">Category</h3>
                      <p className="text-lg text-slate-900">{car.category || 'N/A'}</p>
                    </div>
                  </div>
                )}
                {activeTab === 'location' && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <MapPin className="w-6 h-6 text-[#FFD700] flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-sm font-semibold text-[#001F3F] uppercase tracking-wider mb-2">Location</h3>
                        <p className="text-lg text-slate-900">Contact dealer for location details</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Price & Actions */}
          <div className="space-y-6 h-fit lg:sticky lg:top-20">
            {/* Price Card */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Asking Price</p>
              <h2 className="text-4xl font-bold mb-3 text-slate-900">{formatPrice(car.price)}</h2>
              <p className="text-sm text-slate-600">Premium Quality Vehicle</p>
            </div>

            {/* Info Cards */}
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Vehicle Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Brand</p>
                  <p className="font-semibold text-slate-900">{car.brand}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Model</p>
                  <p className="font-semibold text-slate-900">{car.model}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Year</p>
                  <p className="font-semibold text-slate-900">{car.year}</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Button onClick={() => setContactFormOpen(true)} className="w-full bg-[#001F3F] hover:bg-[#002855] text-white font-semibold py-3 text-base border-0 rounded-lg">
                Contact Dealer
              </Button>
              <Button variant="outline" className="w-full py-3 text-base border border-slate-300 text-slate-900 hover:bg-slate-50 font-semibold rounded-lg">
                Test Drive
              </Button>
              <Button variant="outline" className="w-full py-3 text-base border border-slate-300 text-slate-900 hover:bg-slate-50 font-semibold rounded-lg" onClick={() => navigate('/explore')}>
                Back to Inventory
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Vehicles Section */}
      {similarCars.length > 0 && (
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Similar Vehicles</h2>
              <p className="text-slate-600">Other {car.brand} vehicles in our inventory</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {similarCars.map((similarCar) => (
                <CarCard key={similarCar.id} {...similarCar} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Form Dialog */}
      <ContactFormDialog 
        open={contactFormOpen} 
        onOpenChange={setContactFormOpen}
        carTitle={car ? `${car.year} ${car.brand} ${car.model}` : undefined}
      />
    </div>
  );
}
