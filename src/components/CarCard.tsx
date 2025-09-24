import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CarCardProps {
  image: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage?: string;
  fuelType?: string;
}

export function CarCard({ image, brand, model, year, price, mileage, fuelType }: CarCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={`${year} ${brand} ${model}`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded-md">
          {year}
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg">{brand} {model}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {mileage && (
                <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {mileage}
                </span>
              )}
              {fuelType && (
                <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {fuelType}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-red-600">
              {formatPrice(price)}
            </span>
            <Button size="sm" className="bg-slate-900 hover:bg-red-600 transition-colors">
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}