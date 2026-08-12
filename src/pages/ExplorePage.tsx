import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Badge } from '@components/ui/badge';
import { Icons } from '@components/ui/icons';
import { useIsMobile } from '@components/ui/use-mobile';
import { Slider } from '@components/ui/slider';
import { collection, query, orderBy, getDocs, DocumentSnapshot } from 'firebase/firestore';
import { db, COLLECTIONS } from '@/firebase/firebase';
import { Grid3x3 } from 'lucide-react';
import type { Car } from '@/types/car';
import { normalizeImageUrls } from '@utils/images';
import { inferBodyStyle } from '@utils/inventory';
import { CarCard } from '@components/CarCard';
import { CarCardHorizontal } from '@components/CarCardHorizontal';
import HeroShowcase from '@components/home/HeroShowcase';

// Filter types
interface Filters {
  search: string;
  brands: string[];
  priceRange: [number, number];
  condition: ('New' | 'Used')[];
  yearRange: [number, number];
  transmission: string[];
  fuelType: string[];
  model: string;
  bodyStyle: string;
}

function filtersFromParams(search: string, base: Filters): Filters {
  const params = new URLSearchParams(search);
  const brand = params.get('brand') || params.get('make');
  const model = params.get('model');
  const bodyStyle = params.get('body_style') || params.get('bodyStyle');
  const condition = params.get('condition');
  const transmission = params.get('transmission');
  const minPrice = Number(params.get('min_price'));
  const maxPrice = Number(params.get('max_price'));

  return {
    ...base,
    brands: brand ? [brand] : base.brands,
    model: model ?? '',
    bodyStyle: bodyStyle ?? '',
    condition: condition === 'New' || condition === 'Used' ? [condition] : base.condition,
    transmission: transmission ? [transmission] : base.transmission,
    priceRange: [
      Number.isFinite(minPrice) && minPrice > 0 ? minPrice : base.priceRange[0],
      Number.isFinite(maxPrice) && maxPrice > 0 ? maxPrice : base.priceRange[1],
    ],
  };
}

const MIN_YEAR = 2005;
const MAX_PRICE = 2000000;

const transmissionOptions = ['Automatic', 'Manual'];
const fuelTypeOptions = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];
const conditionOptions = ['New', 'Used'];

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const EXPLORE_HERO_SLIDES = [
  {
    id: 'explore-inventory',
    eyebrow: 'Nabus Motors',
    title: 'Our Inventory',
    description: 'Find your perfect vehicle from our extensive collection of premium and affordable options.',
    image: '/our-inventory.jpg',
  },
];

export function ExplorePage() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const pageSize = isMobile ? 12 : 16;
  
  // State management
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCursors, setPageCursors] = useState<Array<DocumentSnapshot | null>>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'popular'>('newest');
  const [totalResults, setTotalResults] = useState(0);
  const allCarsRef = useRef<Car[] | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState<Filters>(() =>
    filtersFromParams(location.search, {
      search: '',
      brands: [],
      priceRange: [0, MAX_PRICE],
      condition: [],
      yearRange: [MIN_YEAR, new Date().getFullYear() + 1],
      transmission: [],
      fuelType: [],
      model: '',
      bodyStyle: '',
    })
  );

  useEffect(() => {
    setFilters(prev => filtersFromParams(location.search, { ...prev, brands: [] }));
  }, [location.search]);

  // Temporary filter state for modal
  const [tempFilters, setTempFilters] = useState<Filters>({
    search: '',
    brands: [],
    priceRange: [0, MAX_PRICE],
    condition: [],
    yearRange: [MIN_YEAR, new Date().getFullYear() + 1],
    transmission: [],
    fuelType: [],
    model: '',
    bodyStyle: ''
  });

  // Price input state
  const [minPriceInput, setMinPriceInput] = useState('0');
  const [maxPriceInput, setMaxPriceInput] = useState(String(MAX_PRICE));
  const [yearSearch, setYearSearch] = useState('');

  // Debounced search
  const debouncedSearch = useDebounce(filters.search, 300);

  // Fetch available brands
  const fetchAvailableBrands = useCallback(async () => {
    try {
      setBrandsLoading(true);
      const q = query(collection(db, COLLECTIONS.CARS));
      const querySnapshot = await getDocs(q);
      
      const brands = new Set<string>();
      querySnapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.brand) {
          brands.add(data.brand);
        }
      });
      
      setAvailableBrands(Array.from(brands).sort());
    } catch (err) {
      console.error('Error fetching brands:', err);
    } finally {
      setBrandsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailableBrands();
  }, [fetchAvailableBrands]);

  // Fetch cars with filters and pagination
  const fetchCars = useCallback(async (page: number = 1, resetPagination: boolean = true) => {
    try {
      setLoading(true);
      setError(null);

      if (!allCarsRef.current) {
        let snapshot;
        try {
          snapshot = await getDocs(
            query(collection(db, COLLECTIONS.CARS), orderBy('createdAt', 'desc'))
          );
        } catch {
          snapshot = await getDocs(query(collection(db, COLLECTIONS.CARS)));
        }
        allCarsRef.current = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Car[];
      }

      let carList = allCarsRef.current;

      carList = carList.map(c => ({ ...c, imageUrls: normalizeImageUrls(c) }));
      carList = carList.filter(c => ['published','new','sold'].includes((c.status || 'draft') as string));

      // Apply all filters client-side
      if (filters.brands.length > 0) {
        const wanted = filters.brands.map(b => b.trim().toLowerCase());
        carList = carList.filter(car => wanted.includes((car.brand ?? '').trim().toLowerCase()));
      }

      if (filters.model.trim()) {
        const wanted = filters.model.trim().toLowerCase();
        carList = carList.filter(car => (car.model ?? '').trim().toLowerCase() === wanted);
      }

      if (filters.bodyStyle.trim()) {
        carList = carList.filter(car => inferBodyStyle(car) === filters.bodyStyle.trim());
      }

      if (filters.condition.length > 0) {
        carList = carList.filter(car => filters.condition.includes(car.condition));
      }

      if (filters.fuelType.length > 0) {
        carList = carList.filter(car => car.fuelType && filters.fuelType.includes(car.fuelType));
      }

      if (filters.transmission.length > 0) {
        carList = carList.filter(car => car.transmission && filters.transmission.includes(car.transmission));
      }

      if (debouncedSearch.trim()) {
        const searchLower = debouncedSearch.toLowerCase();
        carList = carList.filter(car =>
          car.brand.toLowerCase().includes(searchLower) ||
          car.model.toLowerCase().includes(searchLower)
        );
      }

      carList = carList.filter(car => 
        car.price >= filters.priceRange[0] && car.price <= filters.priceRange[1]
      );

      carList = carList.filter(car => 
        car.year >= filters.yearRange[0] && car.year <= filters.yearRange[1]
      );

      const sorted = [...carList];
      if (sortBy === 'price-low') {
        sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      } else if (sortBy === 'price-high') {
        sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      } else if (sortBy === 'newest') {
        sorted.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
      }

      const targetPage = resetPagination ? 1 : page;
      const start = (targetPage - 1) * pageSize;

      setTotalResults(sorted.length);
      setHasMore(sorted.length > start + pageSize);
      setCars(sorted.slice(start, start + pageSize));
      if (resetPagination) {
        setCurrentPage(1);
      }

    } catch (err) {
      console.error('Error fetching cars:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearch, pageSize, sortBy]);

  useEffect(() => {
    fetchCars(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, debouncedSearch, sortBy]);

  useEffect(() => {
    setPageCursors([]);
    fetchCars(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  // Handle pagination
  const handleNextPage = () => {
    if (hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchCars(nextPage, false);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchCars(prevPage, false);
    }
  };

  // Filter helpers
  const getDefaultFilters = (): Filters => ({
    search: '',
    brands: [],
    priceRange: [0, MAX_PRICE],
    condition: [],
    yearRange: [MIN_YEAR, new Date().getFullYear() + 1],
    transmission: [],
    fuelType: [],
    model: '',
    bodyStyle: ''
  });

  const resetFilters = () => {
    const defaults = getDefaultFilters();
    setTempFilters(defaults);
    setMinPriceInput('0');
    setMaxPriceInput(String(MAX_PRICE));
    setYearSearch('');
  };

  const clearAllFilters = () => {
    const defaults = getDefaultFilters();
    setFilters(defaults);
  };

  const applyFilters = () => {
    setFilters({ ...tempFilters });
    setIsFilterModalOpen(false);
  };

  const openFilterModal = () => {
    setTempFilters({ ...filters });
    setMinPriceInput(filters.priceRange[0].toString());
    setMaxPriceInput(filters.priceRange[1].toString());
    setIsFilterModalOpen(true);
  };

  const activeFilterCount = filters.brands.length + filters.condition.length + filters.transmission.length + filters.fuelType.length;

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center">
      {/* Hero Section */}
      <HeroShowcase slides={EXPLORE_HERO_SLIDES} height="clamp(420px, 55vh, 640px)" />

      <div className="container mx-auto px-4 max-w-7xl py-8">
        {/* Results Info and Sort Row */}
        <div className="my-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Results Count */}
          {!loading && cars.length > 0 && (
            <div className="text-sm text-slate-600 font-medium">
              {totalResults > cars.length
                ? `Showing ${cars.length} of ${totalResults} vehicles`
                : `Showing ${totalResults} vehicle${totalResults !== 1 ? 's' : ''}`}
            </div>
          )}
          
          {/* Sort By */}
          {!loading && cars.length > 0 && (
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="border-2 border-slate-300 text-slate-900 whitespace-nowrap h-10 font-semibold hover:border-[#FFD700] transition-colors w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Controls Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-3 items-center sm:items-center">
          {/* Search Bar - Flexible */}
          <div className="relative flex-1 min-w-0">
            <Input
              type="text"
              placeholder="Search by brand or model..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full border-2 border-slate-200 focus:border-[#FFD700] focus:ring-0 bg-white h-12 text-base transition-all shadow-sm hover:border-slate-300"
            />
          </div>

          {/* Filter and Sort Controls - Inline */}
          <div className="flex flex-wrap gap-3 items-center justify-end sm:flex-nowrap">
            {/* Filter Button */}
            <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-2 border-slate-300 text-slate-900 hover:bg-slate-50 hover:border-[#FFD700] font-semibold whitespace-nowrap transition-all h-12 px-3 sm:px-4"
                  onClick={openFilterModal}
                >
                  <Icons.filter className="h-5 w-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Filter</span>
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-1 sm:ml-2 bg-[#FFD700] text-[#001F3F] rounded font-bold text-xs">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>

              <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="max-w-2xl md:max-w-4xl max-h-[90vh] overflow-hidden bg-white flex flex-col p-0 gap-0">
                {/* 1. Sticky Header */}
                <div className="shrink-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">Filter Vehicles</h2>
                  <button
                      aria-label="Close modal"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsFilterModalOpen(false);
                      }}
                      className="inline-flex h-8 w-8 items-center justify-center bg-slate-100 border border-slate-200 text-slate-900 hover:bg-slate-200 hover:border-slate-300 focus:outline-none cursor-pointer transition-colors rounded"
                      type="button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* 2. Scrollable Middle Content */}
                <div className="overflow-y-auto flex-1 px-4 md:px-6 py-6 space-y-8">
                  <div className="space-y-8 max-w-4xl">

                    {/* Brand Filter (Shadcn Select) */}
                    <div className="space-y-4">
                      <h3 className="text-sm md:text-base font-semibold text-slate-900 border-b-2 border-slate-200 pb-2 md:pb-3 uppercase tracking-wide">Brand</h3>

                      {brandsLoading ? (
                          <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
                      ) : (
                          <div className="space-y-3">
                            <Select
                                onValueChange={(brand) => {
                                  if (!tempFilters.brands.includes(brand)) {
                                    setTempFilters(prev => ({ ...prev, brands: [...prev.brands, brand] }));
                                  }
                                }}
                            >
                              <SelectTrigger className="w-full border-2 border-slate-300 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 transition-colors h-11">
                                <SelectValue placeholder="Select a brand..." />
                              </SelectTrigger>
                              <SelectContent>
                                <div className="p-2">
                                  <Input
                                      placeholder="Search brands..."
                                      value={brandSearch}
                                      onChange={(e) => setBrandSearch(e.target.value)}
                                      className="mb-2 border border-slate-300 text-sm"
                                  />
                                </div>
                                {availableBrands
                                    .filter((brand) => brand.toLowerCase().includes((brandSearch || "").toLowerCase()))
                                    .map((brand) => (
                                        <SelectItem key={brand} value={brand}>
                                          {brand}
                                        </SelectItem>
                                    ))}
                              </SelectContent>
                            </Select>

                            {/* Selected Brand Badges */}
                            {tempFilters.brands.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1">
                                  {tempFilters.brands.map((brand) => (
                                      <span
                                          key={brand}
                                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFD700] text-[#001F3F] text-xs font-bold uppercase tracking-wide rounded"
                                      >
                    {brand}
                                        <button
                                            type="button"
                                            onClick={() => setTempFilters(prev => ({ ...prev, brands: prev.brands.filter(b => b !== brand) }))}
                                            className="hover:text-red-700 focus:outline-none"
                                        >
                      ×
                    </button>
                  </span>
                                  ))}
                                </div>
                            )}
                          </div>
                      )}
                    </div>

                    {/* Price Range */}
                    <div className="space-y-4">
                      <h3 className="text-sm md:text-base font-semibold text-slate-900 border-b-2 border-slate-200 pb-2 md:pb-3 uppercase tracking-wide">Price Range</h3>
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <label className="text-xs md:text-sm font-medium text-slate-700">Min: ₵{tempFilters.priceRange[0].toLocaleString()}</label>
                            <label className="text-xs md:text-sm font-medium text-slate-700">Max: ₵{tempFilters.priceRange[1].toLocaleString()}</label>
                          </div>
                          <Slider
                              value={tempFilters.priceRange}
                              onValueChange={(value) => {
                                setTempFilters(prev => ({ ...prev, priceRange: [value[0], value[1]] }));
                                setMinPriceInput(value[0].toString());
                                setMaxPriceInput(value[1].toString());
                              }}
                              min={0}
                              max={MAX_PRICE}
                              step={1000}
                              className="w-full"
                          />
                        </div>
                      </div>

                      {/* Price Input Fields */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs md:text-sm font-medium text-slate-700 mb-2 block">Min Price</label>
                          <Input
                              type="number"
                              placeholder="0"
                              value={minPriceInput}
                              onChange={(e) => {
                                setMinPriceInput(e.target.value);
                                const minPrice = parseInt(e.target.value) || 0;
                                const maxPrice = parseInt(maxPriceInput) || MAX_PRICE;
                                if (minPrice <= maxPrice) {
                                  setTempFilters(prev => ({ ...prev, priceRange: [minPrice, maxPrice] }));
                                }
                              }}
                              className="border border-slate-300 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 transition-colors text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs md:text-sm font-medium text-slate-700 mb-2 block">Max Price</label>
                          <Input
                              type="number"
                              placeholder={String(MAX_PRICE)}
                              value={maxPriceInput}
                              onChange={(e) => {
                                setMaxPriceInput(e.target.value);
                                const minPrice = parseInt(minPriceInput) || 0;
                                const maxPrice = parseInt(e.target.value) || MAX_PRICE;
                                if (maxPrice >= minPrice) {
                                  setTempFilters(prev => ({ ...prev, priceRange: [minPrice, maxPrice] }));
                                }
                              }}
                              className="border border-slate-300 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 transition-colors text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Condition */}
                    <div className="space-y-4">
                      <h3 className="text-sm md:text-base font-semibold text-slate-900 border-b-2 border-slate-200 pb-2 md:pb-3 uppercase tracking-wide">Condition</h3>
                      <div className="flex gap-3">
                        {conditionOptions.map((condition) => {
                          const isSelected = tempFilters.condition.includes(condition as 'New' | 'Used');
                          return (
                              <button
                                  key={condition}
                                  onClick={() => {
                                    if (isSelected) {
                                      setTempFilters(prev => ({ ...prev, condition: prev.condition.filter(c => c !== condition) }));
                                    } else {
                                      setTempFilters(prev => ({ ...prev, condition: [...prev.condition, condition as 'New' | 'Used'] }));
                                    }
                                  }}
                                  className={`px-4 py-2 border-2 font-medium transition-all uppercase tracking-wide text-sm ${
                                      isSelected
                                          ? 'bg-[#FFD700] text-[#001F3F] border-[#FFD700]'
                                          : 'bg-white text-slate-900 border-slate-300 hover:border-[#FFD700] hover:shadow-md'
                                  }`}
                              >
                                {condition}
                              </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Model Year */}
                    <div className="space-y-4">
                      <h3 className="text-sm md:text-base font-semibold text-slate-900 border-b-2 border-slate-200 pb-2 md:pb-3 uppercase tracking-wide">Model Year</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs md:text-sm font-medium text-slate-700 mb-2 block">From Year</label>
                          <Select
                              value={tempFilters.yearRange[0].toString()}
                              onValueChange={(value) => {
                                const fromYear = parseInt(value);
                                setTempFilters(prev => ({ ...prev, yearRange: [fromYear, prev.yearRange[1]] }));
                              }}
                          >
                            <SelectTrigger className="border-2 border-slate-300 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 transition-colors">
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              <div className="p-2">
                                <Input
                                    placeholder="Search year..."
                                    value={yearSearch}
                                    onChange={(e) => setYearSearch(e.target.value)}
                                    className="mb-2 border border-slate-300"
                                />
                              </div>
                              {Array.from({ length: new Date().getFullYear() - MIN_YEAR + 2 }, (_, i) => {
                                const year = (new Date().getFullYear() - i).toString();
                                if (yearSearch && !year.includes(yearSearch)) return null;
                                return (
                                    <SelectItem key={year} value={year}>
                                      {year}
                                    </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs md:text-sm font-medium text-slate-700 mb-2 block">To Year</label>
                          <Select
                              value={tempFilters.yearRange[1].toString()}
                              onValueChange={(value) => {
                                const toYear = parseInt(value);
                                setTempFilters(prev => ({ ...prev, yearRange: [prev.yearRange[0], toYear] }));
                              }}
                          >
                            <SelectTrigger className="border-2 border-slate-300 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 transition-colors">
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              <div className="p-2">
                                <Input
                                    placeholder="Search year..."
                                    value={yearSearch}
                                    onChange={(e) => setYearSearch(e.target.value)}
                                    className="mb-2 border border-slate-300"
                                />
                              </div>
                              {Array.from({ length: new Date().getFullYear() - MIN_YEAR + 2 }, (_, i) => {
                                const year = (new Date().getFullYear() - i).toString();
                                if (yearSearch && !year.includes(yearSearch)) return null;
                                return (
                                    <SelectItem key={year} value={year}>
                                      {year}
                                    </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Transmission */}
                    <div className="space-y-4">
                      <h3 className="text-sm md:text-base font-semibold text-slate-900 border-b-2 border-slate-200 pb-2 md:pb-3 uppercase tracking-wide">Transmission</h3>
                      <div className="flex gap-3">
                        {transmissionOptions.map((transmission) => {
                          const isSelected = tempFilters.transmission.includes(transmission);
                          return (
                              <button
                                  key={transmission}
                                  onClick={() => {
                                    if (isSelected) {
                                      setTempFilters(prev => ({ ...prev, transmission: prev.transmission.filter(t => t !== transmission) }));
                                    } else {
                                      setTempFilters(prev => ({ ...prev, transmission: [...prev.transmission, transmission] }));
                                    }
                                  }}
                                  className={`px-4 py-2 border-2 font-medium transition-all uppercase tracking-wide text-sm ${
                                      isSelected
                                          ? 'bg-[#FFD700] text-[#001F3F] border-[#FFD700]'
                                          : 'bg-white text-slate-900 border-slate-300 hover:border-[#FFD700] hover:shadow-md'
                                  }`}
                              >
                                {transmission}
                              </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Fuel Type */}
                    <div className="space-y-4">
                      <h3 className="text-sm md:text-base font-semibold text-slate-900 border-b-2 border-slate-200 pb-2 md:pb-3 uppercase tracking-wide">Fuel Type</h3>
                      <div className="flex flex-wrap gap-3">
                        {fuelTypeOptions.map((fuelType) => {
                          const isSelected = tempFilters.fuelType.includes(fuelType);
                          return (
                              <button
                                  key={fuelType}
                                  onClick={() => {
                                    if (isSelected) {
                                      setTempFilters(prev => ({ ...prev, fuelType: prev.fuelType.filter(f => f !== fuelType) }));
                                    } else {
                                      setTempFilters(prev => ({ ...prev, fuelType: [...prev.fuelType, fuelType] }));
                                    }
                                  }}
                                  className={`px-4 py-2 border-2 font-medium transition-all uppercase tracking-wide text-sm ${
                                      isSelected
                                          ? 'bg-[#FFD700] text-[#001F3F] border-[#FFD700]'
                                          : 'bg-white text-slate-900 border-slate-300 hover:border-[#FFD700] hover:shadow-md'
                                  }`}
                              >
                                {fuelType}
                              </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Sticky Action Footer */}
                <div className="shrink-0 bg-white border-t border-slate-200 p-4 md:px-6 flex gap-4">
                  <Button
                      onClick={resetFilters}
                      className="flex-1 border-2 bg-white border-slate-300 text-slate-900 hover:bg-slate-50 hover:border-[#FFD700] font-bold transition-all h-10"
                  >
                    Reset
                  </Button>
                  <Button
                      onClick={applyFilters}
                      className="flex-1 bg-[#FFD700] hover:bg-[#FFC700] text-[#001F3F] font-bold transition-all h-10 uppercase tracking-wide"
                  >
                    Apply Filters
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 border-2 transition-all h-12 w-12 flex items-center justify-center ${
                  viewMode === 'grid'
                    ? 'bg-[#FFD700] text-[#001F3F] border-[#FFD700]'
                    : 'bg-white text-slate-900 border-slate-300 hover:border-[#FFD700]'
                }`}
                title="Grid view"
                aria-label="Grid view"
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="mb-6 p-4 bg-slate-50 border-2 border-slate-200 rounded-lg">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Active filters:</span>
              {filters.brands.map(brand => (
                <Badge 
                  key={`brand-${brand}`} 
                  variant="outline" 
                  className="bg-[#FFD700] border-[#FFD700] text-[#001F3F] font-bold"
                >
                  {brand}
                  <button
                    type="button"
                    aria-label={`Remove ${brand}`}
                    className="ml-2 hover:opacity-60"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilters(prev => ({ ...prev, brands: prev.brands.filter(b => b !== brand) }));
                    }}
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {filters.condition.map(condition => (
                <Badge 
                  key={`condition-${condition}`} 
                  variant="outline" 
                  className="bg-[#FFD700] border-[#FFD700] text-[#001F3F] font-bold"
                >
                  {condition}
                  <button
                    type="button"
                    aria-label={`Remove ${condition}`}
                    className="ml-2 hover:opacity-60"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilters(prev => ({ ...prev, condition: prev.condition.filter(c => c !== condition) }));
                    }}
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {filters.transmission.map(transmission => (
                <Badge 
                  key={`transmission-${transmission}`} 
                  variant="outline" 
                  className="bg-[#FFD700] border-[#FFD700] text-[#001F3F] font-bold"
                >
                  {transmission}
                  <button
                    type="button"
                    aria-label={`Remove ${transmission}`}
                    className="ml-2 hover:opacity-60"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilters(prev => ({ ...prev, transmission: prev.transmission.filter(t => t !== transmission) }));
                    }}
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {filters.fuelType.map(fuelType => (
                <Badge 
                  key={`fuel-${fuelType}`} 
                  variant="outline" 
                  className="bg-[#FFD700] border-[#FFD700] text-[#001F3F] font-bold"
                >
                  {fuelType}
                  <button
                    type="button"
                    aria-label={`Remove ${fuelType}`}
                    className="ml-2 hover:opacity-60"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilters(prev => ({ ...prev, fuelType: prev.fuelType.filter(f => f !== fuelType) }));
                    }}
                  >
                    ×
                  </button>
                </Badge>
              ))}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters} 
                className="text-[#FFD700] hover:text-[#001F3F] hover:bg-[#FFD700] ml-2 font-bold"
              >
                Clear all
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {Array(6).fill(null).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-64 bg-gray-200 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16 bg-slate-50 border border-slate-200 mb-8">
            <Icons.warning className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Loading Vehicles</h3>
            <p className="text-slate-600">{error}</p>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && cars.length === 0 && (
          <div className="text-center py-16 bg-slate-50 mb-2 border border-slate-200">
            <Icons.search className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No Vehicles Found</h3>
            <p className="text-slate-600 mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button 
              onClick={clearAllFilters} 
              className="bg-[#FFD700] hover:bg-[#FFC700] text-[#001F3F] font-bold uppercase tracking-wide"
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Cars Grid/List */}
        {!loading && !error && cars.length > 0 && (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <div className="space-y-4 mb-12">
                {cars.map((car) => (
                  <CarCardHorizontal key={car.id} car={car} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex flex-col gap-4 pb-8">
              <div className="flex justify-center items-center gap-3">
                <Button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="border-2 border-slate-300 text-slate-900 hover:bg-slate-50 hover:border-[#FFD700] disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all"
                >
                  <Icons.chevronLeft className="h-5 w-5 mr-2" />
                  Previous
                </Button>

                <span className="text-sm font-bold text-slate-900 px-4 py-2 bg-slate-50 rounded border-2 border-slate-200">Page {currentPage}</span>

                <Button
                  onClick={handleNextPage}
                  disabled={!hasMore}
                  variant="outline"
                  className="border-2 border-slate-300 text-slate-900 hover:bg-slate-50 hover:border-[#FFD700] disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all"
                >
                  Next
                  <Icons.chevronRight className="h-5 w-5 ml-2" />
                </Button>
              </div>

              {/*/!* Results Per Page - Bottom Right *!/*/}
              {/*<div className="flex justify-end">*/}
              {/*  <div className="flex items-center gap-2">*/}
              {/*    <label className="text-sm font-medium text-slate-700">Show:</label>*/}
              {/*    <Select */}
              {/*      value={pageSize.toString()} */}
              {/*      onValueChange={() => {*/}
              {/*        setCurrentPage(1);*/}
              {/*        setPageCursors([]);*/}
              {/*      }}*/}
              {/*    >*/}
              {/*      <SelectTrigger className="border-2 border-slate-300 text-slate-900 whitespace-nowrap h-10 font-semibold hover:border-[#FFD700] transition-colors w-32">*/}
              {/*        <SelectValue placeholder="Show" />*/}
              {/*      </SelectTrigger>*/}
              {/*      <SelectContent>*/}
              {/*        <SelectItem value="9">9</SelectItem>*/}
              {/*        <SelectItem value="12">12</SelectItem>*/}
              {/*        <SelectItem value="16">16</SelectItem>*/}
              {/*      </SelectContent>*/}
              {/*    </Select>*/}
              {/*    <span className="text-sm text-slate-600 ml-2">per page</span>*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
