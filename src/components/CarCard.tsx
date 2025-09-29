import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatMileage, formatPrice } from '@/utils/format';

import type { Car } from '@/types/car';

export function CarCard(props: Car) {
  const {
    brand,
    model,
    year,
    price,
    mileage,
    condition,
    fuelType,
    transmission,
    description,
    features,
    imageUrls = [],
  } = props;

  const images = imageUrls ?? [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [modalImageLoaded, setModalImageLoaded] = useState(false);
  const navigate = useNavigate();

  const next = () => setIndex((i) => (i + 1) % Math.max(images.length || 1, 1));
  const prev = () => setIndex((i) => (i - 1 + Math.max(images.length || 1, 1)) % Math.max(images.length || 1, 1));

  return (
    <Card className="overflow-hidden">
      {/* Card media */}
      <div className="w-full h-48 bg-gray-100">
        <ImageWithFallback
          src={images[0]}
          alt={`${year} ${brand} ${model}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Card body */}
      <CardContent className="py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-base font-semibold text-gray-900 truncate">{year} {brand} {model}</div>
            <div className="text-sm text-gray-500 truncate">{condition} • {fuelType}{transmission ? ` • ${transmission}` : ''}</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">{formatPrice(price)}</div>
            <div className="text-xs text-gray-500">{formatMileage(mileage)}</div>
          </div>
        </div>

        <div className="mt-4">
          <Button className="w-full bg-slate-900 hover:bg-slate-800" onClick={() => setIsModalOpen(true)}>
            Show Details
          </Button>
        </div>
      </CardContent>

      {/* Dialog modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl rounded-2xl p-0 overflow-hidden">
          <DialogHeader className="border-b border-gray-200 px-4 sm:px-6 py-4 sm:py-5">
            <DialogTitle>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 pr-12">{year} {brand} {model}</h2>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">{formatPrice(price)}</span>
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[70vh] px-4 sm:px-6 py-4 sm:py-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left: Gallery */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-900">Gallery</h3>
                <div className="relative w-full h-48 sm:h-64 lg:h-72 rounded-xl overflow-hidden bg-gray-100">
                  {!modalImageLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
                  <ImageWithFallback
                    src={images[index]}
                    alt={`${year} ${brand} ${model} - Main view`}
                    className="w-full h-full object-cover"
                    onLoad={() => setModalImageLoaded(true)}
                  />
                  {images.length > 1 && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-all">
                        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-all">
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/70 text-white px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm">
                        {index + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.slice(0, 6).map((image, i) => (
                      <button key={i} onClick={(e) => { e.stopPropagation(); setIndex(i); }} className={`flex-shrink-0 w-16 sm:w-20 h-12 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${i === index ? 'border-slate-900' : 'border-gray-300 hover:border-gray-400'}`}>
                        <ImageWithFallback src={image} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                    {images.length > 6 && (
                      <div className="flex-shrink-0 w-16 sm:w-20 h-12 sm:h-16 rounded-lg bg-gray-200 border-2 border-gray-300 flex items-center justify-center">
                        <span className="text-xs text-gray-600 font-medium">+{images.length - 6}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right: Details */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-gray-900">Vehicle Details</h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-sm text-gray-500 mb-2">Brand</div>
                    <div className="font-semibold text-gray-900">{brand}</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-sm text-gray-500 mb-2">Model</div>
                    <div className="font-semibold text-gray-900">{model}</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-sm text-gray-500 mb-2">Year</div>
                    <div className="font-semibold text-gray-900">{year}</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-sm text-gray-500 mb-2">Mileage</div>
                    <div className="font-semibold text-gray-900">{formatMileage(mileage)}</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-sm text-gray-500 mb-2">Fuel Type</div>
                    <div className="font-semibold text-gray-900">{fuelType || 'N/A'}</div>
                  </div>
                  {transmission && (
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="text-sm text-gray-500 mb-2">Transmission</div>
                      <div className="font-semibold text-gray-900">{transmission}</div>
                    </div>
                  )}
                </div>

                {description && (
                  <div className="space-y-3">
                    <h3 className="text-base font-semibold text-gray-900">Description</h3>
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{description}</p>
                    </div>
                  </div>
                )}

                {features && features.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-base font-semibold text-gray-900">Features</h3>
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-slate-900 rounded-full flex-shrink-0"></div>
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-white">
            <Button
              size="lg"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium"
              onClick={() => { setIsModalOpen(false); navigate('/contact'); }}
            >
              Contact Seller
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}