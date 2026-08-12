import React, { useEffect, useState } from 'react';
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
  const [isGeocoding, setIsGeocoding] = useState(false);

  const geocodeLocation = async (locationName: string) => {
    if (!locationName.trim()) return;

    setIsGeocoding(true);
    try {
      // Using Nominatim (OpenStreetMap) for geocoding - free and no API key required
      const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const { lat, lon, display_name } = result;

        onLocationChange({
          ...location,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          address: display_name || location.address,
          city: 'Accra',
          country: 'Ghana'
        });
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Debounce geocoding to avoid too many API calls
  useEffect(() => {
    if (!location.name.trim()) return;

    const timer = setTimeout(() => {
      geocodeLocation(location.name);
    }, 1000); // Wait 1 second after user stops typing

    return () => clearTimeout(timer);
  }, [location.name]);

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

        {/* Loading Indicator */}
        {isGeocoding && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
              Fetching location details...
            </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">
            <strong>Instructions:</strong> Edit the location name to update the map and coordinates automatically. The street address is editable, while city and country are fixed to Accra, Ghana.
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
                value={location.name === "Nabus Motors" ? "Olusegun Obasanjo Wy" : location.address}
                onChange={handleAddressChange}
                placeholder="e.g., Olusegun Obasanjo Wy, Accra"
                className="border-2 rounded-lg border-slate-200"
            />
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input
                id="city"
                value="Accra"
                readOnly
                className="border-2 rounded-lg border-slate-200 bg-slate-50 cursor-not-allowed"
            />
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Input
                id="country"
                value="Ghana"
                readOnly
                className="border-2 rounded-lg border-slate-200 bg-slate-50 cursor-not-allowed"
            />
          </div>

          <div>
            <Label>Coordinates (Latitude, Longitude)</Label>
            <div className="flex gap-2">
              <Input
                  type="number"
                  value={location.latitude}
                  readOnly
                  step="0.000001"
                  className="border-2 rounded-lg border-slate-200 bg-slate-50 cursor-not-allowed flex-1"
              />
              <Input
                  type="number"
                  value={location.longitude}
                  readOnly
                  step="0.000001"
                  className="border-2 rounded-lg border-slate-200 bg-slate-50 cursor-not-allowed flex-1"
              />
            </div>
          </div>
        </div>
      </div>
  );
};