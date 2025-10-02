import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { CarCard } from '@/components/CarCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { useIsMobile } from '@/components/ui/use-mobile';
import { collection, query, orderBy, limit, startAfter, getDocs, DocumentSnapshot } from 'firebase/firestore';
import { db, COLLECTIONS } from '@/firebase/firebase';
import type { Car } from '@/types/car';
import { normalizeImageUrls } from '@/utils/images';
// import { useNavigate } from 'react-router-dom';

// Filter types
interface Filters {
  search: string;
  brands: string[];
  priceRange: [number, number];
  condition: ('New' | 'Used')[];
  yearRange: [number, number];
  transmission: string[];
  fuelType: string[];
}

// Page size will be dynamic (12 on mobile, 16 on larger screens)

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

export function ExplorePage() {
  // const navigate = useNavigate();
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
  // Store a cursor per page (last document of that page) for startAfter
  const [pageCursors, setPageCursors] = useState<Array<DocumentSnapshot | null>>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState<Filters>(() => {
    const params = new URLSearchParams(location.search);
    const brandParam = params.get('brand');
    return {
      search: '',
      brands: brandParam ? [brandParam] : [],
      priceRange: [0, 500000],
      condition: [],
      yearRange: [2015, new Date().getFullYear()],
      transmission: [],
      fuelType: []
    };
  });

  // Update when URL changes (e.g., navigating from Home brand chips)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const brandParam = params.get('brand');
    if (brandParam) {
      setFilters(prev => ({ ...prev, brands: [brandParam] }));
    }
  }, [location.search]);

  // Temporary filter state for modal (only applied when "Apply" is clicked)
  const [tempFilters, setTempFilters] = useState<Filters>({
    search: '',
    brands: [],
    priceRange: [0, 500000],
    condition: [],
    yearRange: [2015, new Date().getFullYear()],
    transmission: [],
    fuelType: []
  });

  // Price input state
  const [minPriceInput, setMinPriceInput] = useState('0');
  const [maxPriceInput, setMaxPriceInput] = useState('500000');

  // Year search state
  const [yearSearch, setYearSearch] = useState('');

  // Debounced search
  const debouncedSearch = useDebounce(filters.search, 300);

  // Fetch available brands from database
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

  // Fetch brands on component mount
  useEffect(() => {
    fetchAvailableBrands();
  }, [fetchAvailableBrands]);

  // Fetch cars with filters and pagination
  const fetchCars = useCallback(async (page: number = 1, resetPagination: boolean = true) => {
    try {
      setLoading(true);
      setError(null);

      // Start with basic query - order by creation date; use database pagination
  let q = query(collection(db, COLLECTIONS.CARS), orderBy('createdAt', 'desc'));

      // Determine cursor to start after for the requested page
      if (!resetPagination && page > 1) {
        const cursor = pageCursors[page - 2]; // cursor for previous page
        if (cursor) {
          q = query(q, startAfter(cursor));
        }
      }

      // Apply page size limit
      q = query(q, limit(pageSize));

      const querySnapshot = await getDocs(q);
      let carList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Car[];
      // ensure imageUrls is present
      carList = carList.map(c => ({ ...c, imageUrls: normalizeImageUrls(c) }));

      // Only expose published/new/sold to users
      carList = carList.filter(c => ['published','new','sold'].includes((c.status || 'draft') as string));

  // Apply all filters client-side to avoid composite index requirements
      
      // Filter by brands
      if (filters.brands.length > 0) {
        carList = carList.filter(car => filters.brands.includes(car.brand));
      }

      // Filter by condition
      if (filters.condition.length > 0) {
        carList = carList.filter(car => filters.condition.includes(car.condition));
      }

      // Filter by fuel type
      if (filters.fuelType.length > 0) {
        carList = carList.filter(car => 
          car.fuelType && filters.fuelType.includes(car.fuelType)
        );
      }

      // Filter by transmission
      if (filters.transmission.length > 0) {
        carList = carList.filter(car => 
          car.transmission && filters.transmission.includes(car.transmission)
        );
      }

      // Filter by search term
      if (debouncedSearch.trim()) {
        const searchLower = debouncedSearch.toLowerCase();
        carList = carList.filter(car =>
          car.brand.toLowerCase().includes(searchLower) ||
          car.model.toLowerCase().includes(searchLower)
        );
      }

      // Filter by price range
      carList = carList.filter(car => 
        car.price >= filters.priceRange[0] && car.price <= filters.priceRange[1]
      );

      // Filter by year range
      carList = carList.filter(car => 
        car.year >= filters.yearRange[0] && car.year <= filters.yearRange[1]
      );

      // Update pagination cursors and flags
      const docs = querySnapshot.docs;
      setHasMore(docs.length === pageSize);
      if (docs.length > 0) {
        setPageCursors(prev => {
          const next = [...prev];
          next[page - 1] = docs[docs.length - 1];
          return next;
        });
      } else {
        // No docs returned for this page
        setPageCursors(prev => {
          const next = [...prev];
          next[page - 1] = null;
          return next;
        });
      }

      // Replace current page results
      setCars(carList);
      if (resetPagination) {
        setCurrentPage(1);
      }

    } catch (err) {
      console.error('Error fetching cars:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearch, pageCursors, pageSize]);

  // Fetch cars when filters change (not temp filters)
  useEffect(() => {
    // On filter changes, reset to first page
    setPageCursors([]);
    fetchCars(1, true);
    // Intentionally omit fetchCars from deps to avoid loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, debouncedSearch]);

  // Reset pagination when viewport breakpoint changes (page size changes)
  useEffect(() => {
    setPageCursors([]);
    fetchCars(1, true);
    // Intentionally omit fetchCars from deps to avoid loops
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

  // Helpers for defaults/clearing filters
  const getDefaultFilters = (): Filters => ({
    search: '',
    brands: [],
    priceRange: [0, 500000],
    condition: [],
    yearRange: [2015, new Date().getFullYear()],
    transmission: [],
    fuelType: []
  });

  // Reset temp filters (used inside modal UI)
  const resetFilters = () => {
    const defaults = getDefaultFilters();
    setTempFilters(defaults);
    setMinPriceInput('0');
    setMaxPriceInput('500000');
    setYearSearch('');
  };

  // Clear applied filters (used from page actions like Active Filters / No Results)
  const clearAllFilters = () => {
    const defaults = getDefaultFilters();
    setFilters(defaults);
  };

  // Apply filters and close modal
  const applyFilters = () => {
    setFilters({ ...tempFilters });
    setIsFilterModalOpen(false);
  };

  // Open modal and sync temp filters with current filters
  const openFilterModal = () => {
    setTempFilters({ ...filters });
    setMinPriceInput(filters.priceRange[0].toString());
    setMaxPriceInput(filters.priceRange[1].toString());
    setIsFilterModalOpen(true);
  };

  const activeFilterCount = filters.brands.length + filters.condition.length + filters.transmission.length + filters.fuelType.length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Search and Filter */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Explore Cars</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by brand or model..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10 w-full"
            />
          </div>

          {/* Filter Button */}
          <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="whitespace-nowrap" onClick={openFilterModal}>
                <Icons.filter className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-slate-900 text-white">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="max-w-4xl max-h-[85vh] overflow-y-auto">
              {/* Close button - positioned relative to DialogContent */}
              <button
                aria-label="Close modal"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsFilterModalOpen(false);
                }}
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-lg hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 z-[100] cursor-pointer"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <DialogHeader className="relative pr-10">
                <DialogTitle className="text-xl font-semibold">
                  Filter Cars
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeFilterCount} active
                    </Badge>
                  )}
                </DialogTitle>
              </DialogHeader>
              
              <div className="filter-popup space-y-10 py-6">
                {/* Brand Filter */}
                <div className="filter-group space-y-2">
                  <h3 className="text-base font-semibold text-gray-900">Brand</h3>
                  {brandsLoading ? (
                    <div className="flex flex-wrap gap-2">
                      {Array(6).fill(null).map((_, index) => (
                        <div key={index} className="h-9 w-16 bg-gray-200 rounded-md animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {availableBrands.map((brand) => {
                        const isSelected = tempFilters.brands.includes(brand);
                        return (
                          <Badge
                            key={brand}
                            variant={isSelected ? "default" : "outline"}
                            className={`cursor-pointer transition-all hover:scale-105 text-sm h-9 px-4 items-center inline-flex rounded-md ${
                              isSelected 
                                ? 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900' 
                                : 'hover:bg-gray-100 border-gray-300 text-gray-700'
                            }`}
                            onClick={() => {
                              if (isSelected) {
                                setTempFilters(prev => ({ ...prev, brands: prev.brands.filter(b => b !== brand) }));
                              } else {
                                setTempFilters(prev => ({ ...prev, brands: [...prev.brands, brand] }));
                              }
                            }}
                          >
                            {brand}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Price Range */}
                <div className="filter-group space-y-2">
                  <h3 className="text-base font-semibold text-gray-900">Price Range</h3>
                  <div className="space-y-1">
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Min Price</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={minPriceInput}
                        onChange={(e) => {
                          setMinPriceInput(e.target.value);
                          const minPrice = parseInt(e.target.value) || 0;
                          const maxPrice = parseInt(maxPriceInput) || 500000;
                          setTempFilters(prev => ({ ...prev, priceRange: [minPrice, maxPrice] }));
                        }}
                        className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Max Price</label>
                      <Input
                        type="number"
                        placeholder="500000"
                        value={maxPriceInput}
                        onChange={(e) => {
                          setMaxPriceInput(e.target.value);
                          const minPrice = parseInt(minPriceInput) || 0;
                          const maxPrice = parseInt(e.target.value) || 500000;
                          setTempFilters(prev => ({ ...prev, priceRange: [minPrice, maxPrice] }));
                        }}
                        className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Min: ${tempFilters.priceRange[0].toLocaleString()}</span>
                      <span>Max: ${tempFilters.priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Condition */}
                <div className="filter-group space-y-2">
                  <h3 className="text-base font-semibold text-gray-900">Condition</h3>
                  <div className="flex flex-wrap gap-2">
                    {conditionOptions.map((condition) => {
                      const isSelected = tempFilters.condition.includes(condition as 'New' | 'Used');
                      return (
                        <Badge
                          key={condition}
                          variant={isSelected ? "default" : "outline"}
                          className={`cursor-pointer transition-all hover:scale-105 text-sm h-9 px-4 items-center inline-flex rounded-md ${
                            isSelected 
                              ? 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900' 
                              : 'hover:bg-gray-100 border-gray-300 text-gray-700'
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              setTempFilters(prev => ({ ...prev, condition: prev.condition.filter(c => c !== condition) }));
                            } else {
                              setTempFilters(prev => ({ ...prev, condition: [...prev.condition, condition as 'New' | 'Used'] }));
                            }
                          }}
                        >
                          {condition}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                {/* Model Year */}
                <div className="filter-group space-y-2">
                  <h3 className="text-base font-semibold text-gray-900">Model Year</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">From Year</label>
                      <Select
                        value={tempFilters.yearRange[0].toString()}
                        onValueChange={(value) => {
                          const fromYear = parseInt(value);
                          setTempFilters(prev => ({ ...prev, yearRange: [fromYear, prev.yearRange[1]] }));
                        }}
                      >
                        <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="p-2">
                            <Input
                              placeholder="Search year..."
                              value={yearSearch}
                              onChange={(e) => setYearSearch(e.target.value)}
                              className="mb-2"
                            />
                          </div>
                          {Array.from({ length: new Date().getFullYear() - 2015 + 1 }, (_, i) => {
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
                      <label className="text-sm font-medium text-gray-700 mb-2 block">To Year</label>
                      <Select
                        value={tempFilters.yearRange[1].toString()}
                        onValueChange={(value) => {
                          const toYear = parseInt(value);
                          setTempFilters(prev => ({ ...prev, yearRange: [prev.yearRange[0], toYear] }));
                        }}
                      >
                        <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="p-2">
                            <Input
                              placeholder="Search year..."
                              value={yearSearch}
                              onChange={(e) => setYearSearch(e.target.value)}
                              className="mb-2"
                            />
                          </div>
                          {Array.from({ length: new Date().getFullYear() - 2015 + 1 }, (_, i) => {
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
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>From: {tempFilters.yearRange[0]}</span>
                    <span>To: {tempFilters.yearRange[1]}</span>
                  </div>
                </div>

                {/* Transmission */}
                <div className="filter-group space-y-2">
                  <h3 className="text-base font-semibold text-gray-900">Transmission</h3>
                  <div className="flex flex-wrap gap-2">
                    {transmissionOptions.map((transmission) => {
                      const isSelected = tempFilters.transmission.includes(transmission);
                      return (
                        <Badge
                          key={transmission}
                          variant={isSelected ? "default" : "outline"}
                          className={`cursor-pointer transition-all hover:scale-105 text-sm h-9 px-4 items-center inline-flex rounded-md ${
                            isSelected 
                              ? 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900' 
                              : 'hover:bg-gray-100 border-gray-300 text-gray-700'
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              setTempFilters(prev => ({ ...prev, transmission: prev.transmission.filter(t => t !== transmission) }));
                            } else {
                              setTempFilters(prev => ({ ...prev, transmission: [...prev.transmission, transmission] }));
                            }
                          }}
                        >
                          {transmission}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                {/* Fuel Type */}
                <div className="filter-group space-y-2">
                  <h3 className="text-base font-semibold text-gray-900">Fuel Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {fuelTypeOptions.map((fuelType) => {
                      const isSelected = tempFilters.fuelType.includes(fuelType);
                      
                      return (
                        <Badge
                          key={fuelType}
                          variant={isSelected ? "default" : "outline"}
                          className={`cursor-pointer transition-all hover:scale-105 text-sm h-9 px-4 items-center inline-flex rounded-md ${
                            isSelected 
                              ? 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900' 
                              : 'hover:bg-gray-100 border-gray-300 text-gray-700'
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              setTempFilters(prev => ({ ...prev, fuelType: prev.fuelType.filter(f => f !== fuelType) }));
                            } else {
                              setTempFilters(prev => ({ ...prev, fuelType: [...prev.fuelType, fuelType] }));
                            }
                          }}
                        >
                          {fuelType}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex gap-4 pt-6 border-t border-gray-100">
                <Button onClick={resetFilters} variant="outline" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">
                  Reset Filters
                </Button>
                <Button onClick={applyFilters} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-medium">
                  Apply Filters
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600">Active filters:</span>
          {filters.brands.map(brand => (
            <Badge key={`brand-${brand}`} variant="outline" className="border-gray-300 bg-white text-gray-800">
              {brand}
              <button
                type="button"
                aria-label={`Remove ${brand}`}
                title={`Remove ${brand}`}
                className="ml-1 -mr-1 inline-flex items-center justify-center rounded p-0 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-ring pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  setFilters(prev => ({ ...prev, brands: prev.brands.filter(b => b !== brand) }));
                }}
              >
                <Icons.x size={10} className="h-2.5 w-2.5 shrink-0" />
              </button>
            </Badge>
          ))}
          {filters.condition.map(condition => (
            <Badge key={`condition-${condition}`} variant="outline" className="border-gray-300 bg-white text-gray-800">
              {condition}
              <button
                type="button"
                aria-label={`Remove ${condition}`}
                title={`Remove ${condition}`}
                className="ml-1 -mr-1 inline-flex items-center justify-center rounded p-0 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-ring pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  setFilters(prev => ({ ...prev, condition: prev.condition.filter(c => c !== condition) }));
                }}
              >
                <Icons.x size={10} className="h-2.5 w-2.5 shrink-0" />
              </button>
            </Badge>
          ))}
          {filters.transmission.map(transmission => (
            <Badge key={`transmission-${transmission}`} variant="outline" className="border-gray-300 bg-white text-gray-800">
              {transmission}
              <button
                type="button"
                aria-label={`Remove ${transmission}`}
                title={`Remove ${transmission}`}
                className="ml-1 -mr-1 inline-flex items-center justify-center rounded p-0 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-ring pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  setFilters(prev => ({ ...prev, transmission: prev.transmission.filter(t => t !== transmission) }));
                }}
              >
                <Icons.x size={10} className="h-2.5 w-2.5 shrink-0" />
              </button>
            </Badge>
          ))}
          {filters.fuelType.map(fuelType => (
            <Badge key={`fuel-${fuelType}`} variant="outline" className="border-gray-300 bg-white text-gray-800">
              {fuelType}
              <button
                type="button"
                aria-label={`Remove ${fuelType}`}
                title={`Remove ${fuelType}`}
                className="ml-1 -mr-1 inline-flex items-center justify-center rounded p-0 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-ring pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  setFilters(prev => ({ ...prev, fuelType: prev.fuelType.filter(f => f !== fuelType) }));
                }}
              >
                <Icons.x size={10} className="h-2.5 w-2.5 shrink-0" />
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-gray-500">
            Clear all
          </Button>
        </div>
      )}

      {/* Results Count (only when there are results) */}
      {!loading && cars.length > 0 && (
        <div className="mb-6 text-sm text-gray-600">
          {`Showing ${cars.length} car${cars.length !== 1 ? 's' : ''}`}
        </div>
      )}

      {/* Loading State */}
      {loading && (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {Array(8).fill(null).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <Icons.warning className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Cars</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      )}

      {/* No Results */}
      {!loading && !error && cars.length === 0 && (
        <div className="text-center py-12">
          <Icons.search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Cars Found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
          <Button onClick={clearAllFilters} variant="outline" className="mt-4">
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Cars Grid */}
      {!loading && !error && cars.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {cars.map((car) => (
              <div key={car.id} className="cursor-default">
                <CarCard {...car} />
              </div>
            ))}
          </div>

          {/* Pagination (database-backed, prev/next) */}
          <div className="flex justify-center items-center gap-3">
            <Button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              <Icons.chevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <span className="text-sm text-gray-600">Page {currentPage}</span>

            <Button
              onClick={handleNextPage}
              disabled={!hasMore}
              variant="outline"
              size="sm"
            >
              Next
              <Icons.chevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}