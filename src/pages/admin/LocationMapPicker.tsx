import React from 'react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Info } from 'lucide-react';

interface LocationData {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

interface LocationMapPickerProps {
  location: LocationData;
  onLocationChange: (location: LocationData) => void;
}

export const LocationMapPicker: React.FC<LocationMapPickerProps> = ({
  location,
  onLocationChange
}) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onLocationChange({
      ...location,
      name: e.target.value
    });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onLocationChange({
      ...location,
      address: e.target.value
    });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onLocationChange({
      ...location,
      city: e.target.value
    });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onLocationChange({
      ...location,
      country: e.target.value
    });
  };

  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      onLocationChange({
        ...location,
        latitude: val
      });
    }
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      onLocationChange({
        ...location,
        longitude: val
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Container - Using Google Maps Embed */}
      <div className="rounded-lg overflow-hidden border-2 border-slate-200 bg-slate-100">
        <div className="h-96 relative">
          <iframe
            src={`https://www.google.com/maps?q=${encodeURIComponent(location.name || 'Nabus Motors, Accra, Ghana')}&z=16&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Car Location Map"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Error Message */}
      {/* {mapError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{mapError}</AlertDescription>
        </Alert>
      )} */}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          <strong>Instructions:</strong> Edit the location name below to update the map. The street address can be auto-populated from the map or edited manually.
        </p>
      </div>

      {/* Address Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Location Name *</Label>
          <Input
            id="name"
            value={location.name}
            onChange={handleNameChange}
            placeholder="e.g., Nabus Motors, Main Showroom"
            className="border-2 rounded-lg border-slate-200"
          />
        </div>

        <div>
          <Label htmlFor="address">Street Address</Label>
          <Input
            id="address"
            value={location.address}
            onChange={handleAddressChange}
            placeholder="e.g., Olusegun Obasanjo Wy, Accra"
            className="border-2 rounded-lg border-slate-200"
          />
        </div>

        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={location.city}
            onChange={handleCityChange}
            placeholder="City"
            className="border-2 rounded-lg border-slate-200"
          />
        </div>

        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={location.country}
            onChange={handleCountryChange}
            placeholder="Country"
            className="border-2 rounded-lg border-slate-200"
          />
        </div>

        <div>
          <Label>Coordinates (Latitude, Longitude)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={location.latitude}
              onChange={handleLatitudeChange}
              placeholder="Latitude"
              step="0.000001"
              className="border-2 rounded-lg border-slate-200 flex-1"
            />
            <Input
              type="number"
              value={location.longitude}
              onChange={handleLongitudeChange}
              placeholder="Longitude"
              step="0.000001"
              className="border-2 rounded-lg border-slate-200 flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
