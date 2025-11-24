import React, { useState } from "react";
import { Heart, Share2, Printer, ChevronLeft, ChevronRight } from "lucide-react";
import { PriceBadge } from "./PriceBadge";
import { SpecsGrid, type Spec } from "./SpecsGrid";

export interface CarCardProps {
  id: string;
  title: string;
  price: number;
  salePrice?: number;
  image: string;
  thumbnails?: string[];
  specs: Spec[];
  badge?: {
    text: string;
    color?: "gold" | "blue" | "green";
  };
  onShare?: () => void;
  onWishlist?: (id: string, liked: boolean) => void;
  onPrint?: () => void;
  onClick?: () => void;
  variant?: "compact" | "full";
  featured?: boolean;
}

/**
 * CarCard Component
 * High-performance automotive product card with image gallery, specs, and interactive features
 * Features: Yellow accent ribbons, sharp edges, smooth 300ms transitions, responsive layout
 */
export const CarCard: React.FC<CarCardProps> = ({
  id,
  title,
  price,
  salePrice,
  image,
  thumbnails = [],
  specs,
  badge,
  onShare,
  onWishlist,
  onPrint,
  onClick,
  variant = "full",
  featured = false,
}) => {
  const [mainImage, setMainImage] = useState(image);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    onWishlist?.(id, !isWishlisted);
  };

  const handleNextThumbnail = () => {
    if (thumbnails.length > 0) {
      const nextIndex = (selectedThumbnail + 1) % thumbnails.length;
      setSelectedThumbnail(nextIndex);
      setMainImage(thumbnails[nextIndex]);
    }
  };

  const handlePrevThumbnail = () => {
    if (thumbnails.length > 0) {
      const prevIndex =
        selectedThumbnail === 0 ? thumbnails.length - 1 : selectedThumbnail - 1;
      setSelectedThumbnail(prevIndex);
      setMainImage(thumbnails[prevIndex]);
    }
  };

  if (variant === "compact") {
    return (
      <div
        className="group cursor-pointer transition-all duration-300 hover:shadow-lg"
        onClick={onClick}
      >
        <div className="relative overflow-hidden bg-[#0A1D47] aspect-video">
          <img
            src={mainImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {badge && (
            <div
              className={`absolute top-4 left-4 px-3 py-1 text-sm font-bold text-black ${
                badge.color === "gold"
                  ? "bg-[#FFD700]"
                  : badge.color === "green"
                    ? "bg-[#10B981]"
                    : "bg-[#3B82F6]"
              }`}
            >
              {badge.text}
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWishlist();
            }}
            className="absolute top-4 right-4 p-2 bg-[#0A1D47]/80 hover:bg-[#FFD700] hover:text-[#001F3F] text-white transition-all duration-300"
          >
            <Heart
              size={20}
              fill={isWishlisted ? "currentColor" : "none"}
              strokeWidth={2}
            />
          </button>
        </div>
        <div className="p-4 bg-[#050F1F]">
          <h3 className="text-base font-bold text-white truncate">{title}</h3>
          <div className="mt-2 text-xl font-extrabold text-[#FFD700]">
            ${price.toLocaleString()}
          </div>
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div
      className="bg-[#050F1F] border border-[#1A3A52] hover:border-[#FFD700] transition-all duration-300"
      onClick={onClick}
    >
      {/* Main Image Gallery */}
      <div className="relative">
        <div className="aspect-video bg-[#0A1D47] overflow-hidden relative group">
          <img
            src={mainImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badge */}
          {badge && (
            <div
              className={`absolute top-4 left-4 px-4 py-2 text-sm font-bold text-black ${
                badge.color === "gold"
                  ? "bg-[#FFD700]"
                  : badge.color === "green"
                    ? "bg-[#10B981]"
                    : "bg-[#3B82F6]"
              }`}
            >
              {badge.text}
            </div>
          )}

          {/* Featured Badge */}
          {featured && (
            <div className="absolute top-4 right-4 px-4 py-2 bg-[#FFD700] text-[#001F3F] text-xs font-extrabold uppercase tracking-wider">
              Featured
            </div>
          )}

          {/* Image Navigation */}
          {thumbnails.length > 0 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevThumbnail();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-[#FFD700] text-white hover:text-[#001F3F] transition-all duration-300 opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextThumbnail();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-[#FFD700] text-white hover:text-[#001F3F] transition-all duration-300 opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          {onPrint && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrint();
              }}
              className="p-2 bg-[#0A1D47]/90 hover:bg-[#FFD700] text-white hover:text-[#001F3F] transition-all duration-300"
              title="Print"
            >
              <Printer size={18} />
            </button>
          )}
          {onShare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              className="p-2 bg-[#0A1D47]/90 hover:bg-[#FFD700] text-white hover:text-[#001F3F] transition-all duration-300"
              title="Share"
            >
              <Share2 size={18} />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWishlist();
            }}
            className="p-2 bg-[#0A1D47]/90 hover:bg-[#FFD700] text-white hover:text-[#001F3F] transition-all duration-300"
            title="Add to Wishlist"
          >
            <Heart
              size={18}
              fill={isWishlisted ? "currentColor" : "none"}
              strokeWidth={2}
            />
          </button>
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {thumbnails.length > 0 && (
        <div className="p-3 md:p-4 border-t border-[#1A3A52] bg-[#0A1D47]">
          <div className="grid grid-cols-4 gap-2">
            {[image, ...thumbnails].slice(0, 4).map((thumb, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setMainImage(thumb);
                  setSelectedThumbnail(idx - 1);
                }}
                className={`aspect-square overflow-hidden transition-all duration-300 ${
                  mainImage === thumb
                    ? "ring-2 ring-[#FFD700]"
                    : "hover:ring-2 hover:ring-[#FFD700]/50"
                }`}
              >
                <img
                  src={thumb}
                  alt={`Thumbnail ${idx}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-4 md:p-6 space-y-4">
        {/* Title */}
        <div>
          <h2 className="text-lg md:text-xl font-bold text-white line-clamp-2">
            {title}
          </h2>
        </div>

        {/* Price Badge */}
        <PriceBadge
          price={price}
          salePrice={salePrice}
          featured={featured}
        />

        {/* Specs Grid */}
        <div>
          <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-[#9CA3AF] mb-3">
            Key Specifications
          </h3>
          <SpecsGrid specs={specs} />
        </div>
      </div>
    </div>
  );
};

export default CarCard;
