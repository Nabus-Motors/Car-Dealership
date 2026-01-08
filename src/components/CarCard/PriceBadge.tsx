import React from "react";

interface PriceBadgeProps {
  price: string | number;
  salePrice?: string | number;
  featured?: boolean;
}

export const PriceBadge: React.FC<PriceBadgeProps> = ({
  price,
  salePrice,
  featured = false,
}) => {
  const formatPrice = (value: string | number): string => {
    if (typeof value === "string") {
      const numValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
      return new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numValue);
    }
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value as number);
  };

  return (
    <div
      className={`relative p-6 md:p-8 ${
        featured ? "bg-[#FFD700] text-[#001F3F]" : "bg-[#0A1D47] text-white"
      }`}
    >
      {/* Sharp corner design via pseudo-element */}
      {featured && (
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-[#FFC700]"></div>
      )}

      <div className="space-y-2">
        <div className="text-xs md:text-sm font-semibold uppercase tracking-wider opacity-70">
          Price
        </div>
        <div className="text-2xl md:text-3xl font-extrabold">
          {formatPrice(price)}
        </div>
        {salePrice && (
          <div className="text-sm md:text-base opacity-70 line-through">
            {formatPrice(salePrice)}
          </div>
        )}
      </div>
    </div>
  );
};
