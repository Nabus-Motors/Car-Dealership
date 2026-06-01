import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice, formatMileage } from "@/utils/format";
import type { Car } from "@/types/car";

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = car.imageUrls ?? [];
  const hasMultipleImages = images.length > 1;

  const handleCardClick = () => {
    navigate(`/car/${car.id}`);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  // Determine ribbon type
  const getRibbonClass = () => {
    if (car.condition === "New") return "new";
    return "used";
  };

  // Format date listed
  const getDateListed = () => {
    if (car.createdAt) {
      try {
        const date = new Date(car.createdAt as any);
        return date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      } catch {
        return "Recently listed";
      }
    }
    return "Recently listed";
  };

  return (
    <div className="car-card" onClick={handleCardClick}>
      {/* Image with ribbon and carousel */}
      <div className="card-img-wrap relative group">
        <div className={`card-ribbon ${getRibbonClass()}`}>
          {car.condition === "New" ? "NEW" : "USED"}
        </div>

        {/* Image Counter Badge */}
        {hasMultipleImages && (
          <div className="absolute top-3 right-3 z-20 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-semibold">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}

        <img
          src={images[currentImageIndex] ?? "/placeholder-car.jpg"}
          alt={`${car.year} ${car.brand} ${car.model}`}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27250%27 viewBox=%270 0 400 250%27%3E%3Crect width=%27400%27 height=%27250%27 fill=%27%23F0EFE9%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 font-family=%27sans-serif%27 font-size=%2714%27 fill=%27%23888%27 text-anchor=%27middle%27 dy=%27.3em%27%3ENo Image%3C/text%3E%3C/svg%3E";
          }}
          className="transition-opacity duration-300"
        />

        {/* Chevron Navigation - Only show on hover or when multiple images */}
        {hasMultipleImages && (
          <>
            {/* Left Chevron */}
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 
                         bg-black/60 hover:bg-black/90 transition-all duration-200
                         p-2 rounded-full text-white opacity-0 group-hover:opacity-100
                         sm:opacity-70 sm:hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Chevron */}
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10
                         bg-black/60 hover:bg-black/90 transition-all duration-200
                         p-2 rounded-full text-white opacity-0 group-hover:opacity-100
                         sm:opacity-70 sm:hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image Dots Indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentImageIndex
                      ? "bg-white w-3"
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Card Body */}
      <div className="card-body">
        {/* Title Row */}
        <div className="card-title-row">
          <div className="card-title-left">
            <h3 className="card-name">
              {car.year} {car.brand} {car.model}
            </h3>
            <p className="card-location">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {typeof car.location === "string"
                ? car.location
                : car.location?.name ?? "Accra, Ghana"}
            </p>
          </div>
          <div className="card-price-box">
            <div className="card-price">{formatPrice(car.price ?? 0)}</div>
            {car.price && (
              <div className="card-msrp">List: {formatPrice(car.price)}</div>
            )}
          </div>
        </div>

        {/* Specs Row */}
        <div className="card-specs-row">
          <div className="spec-item">
            <svg
              className="spec-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              width="16"
              height="16"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
            <span>{formatMileage(car.mileage)}</span>
          </div>
          <div className="spec-item">
            <svg
              className="spec-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              width="16"
              height="16"
            >
              <path d="M3 13h2l2-8 4 16 3-10 2 2h5" />
            </svg>
            <span>{car.fuelType ?? "Petrol"}</span>
          </div>
          <div className="spec-item">
            <svg
              className="spec-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              width="16"
              height="16"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a2 2 0 00-4 0v2M8 7V5a2 2 0 014 0" />
            </svg>
            <span>{car.transmission ?? "Auto"}</span>
          </div>
          <div className="spec-item">
            <svg
              className="spec-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              width="16"
              height="16"
            >
              <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" />
              <rect x="9" y="11" width="14" height="10" rx="2" />
            </svg>
            <span>{car.condition}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="card-footer">
          <div className="card-date">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {getDateListed()}
          </div>
          <button
            className="card-share-btn"
            aria-label="Share"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
