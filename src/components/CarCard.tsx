import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { StorageImage } from '@/components/figma/StorageImage';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
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
    imageUrls = [],
    status = 'published',
    category,
  } = props;

  const images = imageUrls ?? [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [modalIndex, setModalIndex] = useState(0);
  const [modalImageLoaded, setModalImageLoaded] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const navigate = useNavigate();

  const nextCard = () => setCardIndex((i) => (i + 1) % Math.max(images.length || 1, 1));
  const prevCard = () => setCardIndex((i) => (i - 1 + Math.max(images.length || 1, 1)) % Math.max(images.length || 1, 1));
  
  const nextModal = () => setModalIndex((i) => (i + 1) % Math.max(images.length || 1, 1));
  const prevModal = () => setModalIndex((i) => (i - 1 + Math.max(images.length || 1, 1)) % Math.max(images.length || 1, 1));

  const onTouchStartCard = (e: React.TouchEvent) => {
    setTouchStartX(e.changedTouches[0].clientX);
  };

  const onTouchEndCard = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      dx < 0 ? nextCard() : prevCard();
    }
    setTouchStartX(null);
  };

  const onTouchStartModal = (e: React.TouchEvent) => {
    setTouchStartX(e.changedTouches[0].clientX);
  };

  const onTouchEndModal = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      dx < 0 ? nextModal() : prevModal();
    }
    setTouchStartX(null);
  };

  const isSold = status?.toLowerCase() === 'sold';

  return (
    <Card className={`group overflow-hidden flex flex-col rounded-xl border shadow-sm transition-all h-full ${
      isSold 
        ? 'opacity-70 grayscale cursor-not-allowed bg-gray-50 border-gray-300' 
        : 'hover:shadow-md cursor-pointer'
    }`}
          onClick={isSold ? undefined : () => { setModalIndex(cardIndex); setIsModalOpen(true); }}
          onTouchStart={isSold ? undefined : onTouchStartCard}
          onTouchEnd={isSold ? undefined : onTouchEndCard}>
      {/* Card media */}
      <div className="w-full bg-gray-100 relative flex-shrink-0 overflow-hidden">
        <AspectRatio ratio={16 / 9} className="overflow-hidden">
          {images.length > 0 ? (
            <>
              <StorageImage
                src={images[cardIndex]}
                alt={`${year} ${brand} ${model}`}
                className={`w-full h-full object-center car-image-mobile ${isSold ? 'brightness-75' : ''}`}
              />
              {images.length > 1 && !isSold && (
                <>
                  <button
                    aria-label="Previous image"
                    onClick={(e) => { e.stopPropagation(); prevCard(); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/55 hover:bg-black/70 text-white p-2 sm:p-2 rounded-full shadow-lg backdrop-blur-sm transition-opacity opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-5 w-5 sm:h-5 sm:w-5" />
                  </button>
                  <button
                    aria-label="Next image"
                    onClick={(e) => { e.stopPropagation(); nextCard(); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/55 hover:bg-black/70 text-white p-2 sm:p-2 rounded-full shadow-lg backdrop-blur-sm transition-opacity opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <ChevronRight className="h-5 w-5 sm:h-5 sm:w-5" />
                  </button>
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-0.5 rounded text-[10px] sm:text-xs shadow-md">
                    {cardIndex + 1} / {images.length}
                  </div>
                </>
              )}
              {/* Big SOLD stamp overlay for sold cars */}
              {isSold && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                  <div className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-xl transform rotate-12 border-2 border-red-700">
                    <span className="text-xl font-bold tracking-wider">SOLD</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-gray-500 ${isSold ? 'bg-gray-300' : 'bg-gray-200'}`}>
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mx-auto mb-2">
                  <path fillRule="evenodd" d="M1.5 6A2.25 2.25 0 013.75 3.75h16.5A2.25 2.25 0 0122.5 6v12a.75.75 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zm3 .75a.75.75 0 000 1.5h14.25a.75.75 0 000-1.5H4.5zm4.28 5.47a.75.75 0 011.06 0l2.22 2.22 1.22-1.22a.75.75 0 011.06 0l2.72 2.72a.75.75 0 01-1.06 1.06l-2.19-2.19-1.25 1.25a.75.75 0 01-1.06 0l-2.75-2.75a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
                <p className="text-sm">No Image</p>
              </div>
            </div>
          )}
        </AspectRatio>
        {/* Overlays: condition, category, and sold status */}
        <div className="absolute top-2 left-2 flex gap-1">
          {condition && (
            <span className={`px-2 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-800 ${isSold ? 'opacity-60' : ''}`}>
              {condition}
            </span>
          )}
          {category && (
            <span className={`px-2 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-800 ${isSold ? 'opacity-60' : ''}`}>
              {category}
            </span>
          )}
        </div>
      </div>

      {/* Card body - flex-grow to fill remaining space */}
      <CardContent className="py-4 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0 flex-1">
            <div className={`text-base font-semibold truncate ${isSold ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
              {year} {brand} {model}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs sm:text-sm text-gray-500 overflow-hidden whitespace-nowrap">
              {fuelType && (
                <Badge variant="secondary" className={`px-2 py-0.5 max-w-[7rem] truncate ${isSold ? 'opacity-60' : ''}`}>
                  {fuelType}
                </Badge>
              )}
              {transmission && (
                <Badge variant="secondary" className={`px-2 py-0.5 max-w-[7rem] truncate ${isSold ? 'opacity-60' : ''}`}>
                  {transmission}
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className={`text-lg font-bold ${isSold ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
              {isSold ? 'SOLD' : formatPrice(price)}
            </div>
            <div className={`text-xs ${isSold ? 'text-gray-400' : 'text-gray-500'}`}>
              {formatMileage(mileage)}
            </div>
          </div>
        </div>

        {/* No description or features in the compact card */}

        {/* Button fixed at bottom */}
        <div className="mt-auto">
          <Button 
            className={`w-full ${isSold 
              ? 'bg-gray-400 cursor-not-allowed opacity-60' 
              : 'bg-slate-900 hover:bg-slate-800'}`}
            onClick={isSold ? undefined : (e) => { e.stopPropagation(); setModalIndex(cardIndex); setIsModalOpen(true); }}
            disabled={isSold}
          >
            <span className="mr-1.5">{isSold ? 'Vehicle Sold' : 'Show Details'}</span>
            {!isSold && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>

      {/* Dialog modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-4xl xl:max-w-5xl max-h-[90vh] p-0 overflow-hidden" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          {/* Close button - positioned relative to DialogContent */}
          <button
            aria-label="Close modal"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Close button clicked');
              setIsModalOpen(false);
            }}
            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-lg hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 z-[100] cursor-pointer"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex flex-col h-full max-h-[90vh]">
            <DialogHeader className="border-b border-gray-200 px-4 sm:px-6 py-4 sm:py-5 flex-shrink-0">
              <DialogTitle>
                <div className="flex items-start justify-between gap-4 pr-12 sm:pr-16">
                  <div className="flex-1">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{year} {brand} {model}</h2>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">{formatPrice(price)}</span>
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-4 sm:py-6">
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              {/* Left: Gallery */}
              <div className="space-y-3 order-1 lg:order-1">
                <h3 className="text-base font-semibold text-gray-900">Gallery</h3>
                <div className="relative w-full rounded-xl overflow-hidden bg-gray-100" onTouchStart={onTouchStartModal} onTouchEnd={onTouchEndModal}>
                  <AspectRatio ratio={16 / 9}>
                    {images.length > 0 ? (
                      <>
                        {!modalImageLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
                        <ImageWithFallback
                          src={images[modalIndex]}
                          alt={`${year} ${brand} ${model} - Main view`}
                          className="w-full h-full object-cover"
                          onLoad={() => setModalImageLoaded(true)}
                        />
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mx-auto mb-2">
                            <path fillRule="evenodd" d="M1.5 6A2.25 2.25 0 013.75 3.75h16.5A2.25 2.25 0 0122.5 6v12a.75.75 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zm3 .75a.75.75 0 000 1.5h14.25a.75.75 0 000-1.5H4.5zm4.28 5.47a.75.75 0 011.06 0l2.22 2.22 1.22-1.22a.75.75 0 011.06 0l2.72 2.72a.75.75 0 01-1.06 1.06l-2.19-2.19-1.25 1.25a.75.75 0 01-1.06 0l-2.75-2.75a.75.75 0 010-1.06z" clipRule="evenodd" />
                          </svg>
                          <p className="text-sm">No Image</p>
                        </div>
                      </div>
                    )}
                  </AspectRatio>

                  {/* Overlays: condition, category badge and SOLD status */}
                  {images.length > 0 && (
                    <div className="absolute top-2 left-2 flex gap-1">
                      {condition && (
                        <span className="px-2 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-800">
                          {condition}
                        </span>
                      )}
                      {category && (
                        <span className="px-2 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-800">
                          {category}
                        </span>
                      )}
                    </div>
                  )}
                  {status && status.toLowerCase() === 'sold' && (
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 rounded-md text-xs font-semibold bg-red-600 text-white">SOLD</span>
                    </div>
                  )}

                  {/* Arrows and index */}
                  {images.length > 1 && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); prevModal(); }} className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 bg-black/55 hover:bg-black/70 text-white p-2 sm:p-2 rounded-full shadow-lg backdrop-blur-sm transition-all">
                        <ChevronLeft className="h-5 w-5 sm:h-5 sm:w-5" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); nextModal(); }} className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-black/55 hover:bg-black/70 text-white p-2 sm:p-2 rounded-full shadow-lg backdrop-blur-sm transition-all">
                        <ChevronRight className="h-5 w-5 sm:h-5 sm:w-5" />
                      </button>
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-0.5 rounded text-[10px] sm:text-xs shadow-md">
                        {modalIndex + 1} / {images.length}
                      </div>
                      <div className="absolute bottom-2 left-2 text-[10px] sm:text-xs text-white bg-black/40 px-2 py-0.5 rounded md:hidden">Swipe</div>
                    </>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.slice(0, 6).map((image, i) => (
                      <button key={i} onClick={(e) => { e.stopPropagation(); setModalIndex(i); }} className={`flex-shrink-0 w-16 sm:w-20 h-12 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${i === modalIndex ? 'border-slate-900' : 'border-gray-300 hover:border-gray-400'}`}>
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
              <div className="space-y-4 order-2 lg:order-2">
                <h3 className="text-base font-semibold text-gray-900">Vehicle Details</h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
                    <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Brand</div>
                    <div className="text-sm sm:text-base font-semibold text-gray-900">{brand}</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
                    <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Model</div>
                    <div className="text-sm sm:text-base font-semibold text-gray-900">{model}</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
                    <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Year</div>
                    <div className="text-sm sm:text-base font-semibold text-gray-900">{year}</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
                    <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Mileage</div>
                    <div className="text-sm sm:text-base font-semibold text-gray-900">{formatMileage(mileage)}</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
                    <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Fuel Type</div>
                    <div className="text-sm sm:text-base font-semibold text-gray-900">{fuelType || 'N/A'}</div>
                  </div>
                  {transmission && (
                    <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
                      <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Transmission</div>
                      <div className="text-sm sm:text-base font-semibold text-gray-900">{transmission}</div>
                    </div>
                  )}
                  {category && (
                    <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
                      <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Category</div>
                      <div className="text-sm sm:text-base font-semibold text-gray-900">{category}</div>
                    </div>
                  )}
                </div>

                {description && (
                  <div className="space-y-3">
                    <h3 className="text-base font-semibold text-gray-900">Description</h3>
                    <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200">
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-white flex-shrink-0">
              <div className="flex gap-2">
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    console.log('Close button in footer clicked');
                    setIsModalOpen(false);
                  }}
                >
                  Close
                </Button>
                <Button
                  size="lg"
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-medium"
                  onClick={() => { setIsModalOpen(false); navigate('/contact'); }}
                >
                  Contact Seller
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </Card>
  );
}