import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ListingsManagementSkeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db, COLLECTIONS } from '@/firebase/firebase';
import { RefreshCw, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { formatPrice, formatMileage, formatDate } from '@/utils/format';
import type { Car } from '@/types/car';
import { deleteCar } from '@/services/firestoreService';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface ListingsManagementProps {
  onNavigate: (page: string) => void;
}

export function ListingsManagement({ onNavigate }: ListingsManagementProps) {
  const { user } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [carToDelete, setCarToDelete] = useState<string | null>(null);
  
  // Selection state for bulk operations
  const [selectedCars, setSelectedCars] = useState<Set<string>>(new Set());
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  
  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [conditionFilter, setConditionFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priceRangeFilter, setPriceRangeFilter] = useState<string>('all');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Fetch cars from Firebase
  useEffect(() => {
    const carsQuery = query(
      collection(db, COLLECTIONS.CARS),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(carsQuery, (snapshot) => {
      const carsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Car[];
      
      setCars(carsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching cars:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter cars based on search term and filters
  const filteredCars = cars.filter(car => {
    // Search functionality
    const matchesSearch = searchTerm === '' || [
      car.brand,
      car.model,
      car.year?.toString(),
      car.condition,
      car.status,
      car.price?.toString(),
      car.mileage?.toString(),
      (car as any).category
    ].some(field => 
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || car.status === statusFilter;
    
    // Condition filter
    const matchesCondition = conditionFilter === 'all' || car.condition === conditionFilter;
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || (car as any).category === categoryFilter;
    
    // Price range filter
    const matchesPriceRange = (() => {
      if (priceRangeFilter === 'all') return true;
      const price = car.price || 0;
      switch (priceRangeFilter) {
        case 'under-20k': return price < 20000;
        case '20k-50k': return price >= 20000 && price < 50000;
        case '50k-100k': return price >= 50000 && price < 100000;
        case 'over-100k': return price >= 100000;
        default: return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesCondition && matchesCategory && matchesPriceRange;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCars = filteredCars.slice(startIndex, endIndex);

  // Reset to first page when search changes
  const prevSearchTerm = useRef(searchTerm);
  useEffect(() => {
    if (prevSearchTerm.current !== searchTerm) {
      setCurrentPage(1);
      prevSearchTerm.current = searchTerm;
    }
  }, [searchTerm]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setConditionFilter('all');
    setCategoryFilter('all');
    setPriceRangeFilter('all');
    setSearchTerm('');
  };

  const hasActiveFilters = () => {
    return statusFilter !== 'all' || 
           conditionFilter !== 'all' || 
           categoryFilter !== 'all' || 
           priceRangeFilter !== 'all' || 
           searchTerm !== '';
  };

  // Selection helpers
  const toggleCarSelection = (carId: string) => {
    const newSelected = new Set(selectedCars);
    if (newSelected.has(carId)) {
      newSelected.delete(carId);
    } else {
      newSelected.add(carId);
    }
    setSelectedCars(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedCars.size === paginatedCars.length) {
      setSelectedCars(new Set());
    } else {
      setSelectedCars(new Set(paginatedCars.map(car => car.id)));
    }
  };

  const isAllSelected = selectedCars.size === paginatedCars.length && paginatedCars.length > 0;
  const isIndeterminate = selectedCars.size > 0 && selectedCars.size < paginatedCars.length;

  const handleDeleteCar = async (carId: string) => {
    const car = cars.find(c => c.id === carId);
    const carDetails = car ? {
      brand: car.brand,
      model: car.model,
      year: car.year
    } : undefined;

    try {
      await deleteCar(
        carId, 
        user?.uid, 
        user?.displayName || user?.email || 'Admin',
        carDetails
      );
      toast.success('Car deleted successfully');
      setShowDeleteDialog(false);
      setCarToDelete(null);
    } catch (error) {
      console.error('Error deleting car:', error);
      toast.error('Failed to delete car');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCars.size === 0) return;

    try {
      const deletePromises = Array.from(selectedCars).map(carId => {
        const car = cars.find(c => c.id === carId);
        const carDetails = car ? {
          brand: car.brand,
          model: car.model,
          year: car.year
        } : undefined;

        return deleteCar(
          carId,
          user?.uid,
          user?.displayName || user?.email || 'Admin',
          carDetails
        );
      });

      await Promise.all(deletePromises);
      toast.success(`Successfully deleted ${selectedCars.size} car(s)`);
      setSelectedCars(new Set());
      setShowBulkDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting cars:', error);
      toast.error('Failed to delete some cars');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'new': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <ListingsManagementSkeleton />;
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Car Listings</h1>
          <p className="text-gray-600 mt-1">
            {filteredCars.length} cars found
            {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
            {selectedCars.size > 0 && ` • ${selectedCars.size} selected`}
          </p>
        </div>
        <div className="flex gap-2">
          {selectedCars.size > 0 && (
            <Button
              variant="destructive"
              onClick={() => setShowBulkDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedCars.size})
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => onNavigate('add-listing')}
            className="bg-red-600 hover:bg-red-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Car
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search cars..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-gray-100' : ''}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>

            {/* Clear Filters */}
            {hasActiveFilters() && (
              <Button variant="outline" onClick={clearFilters}>
                Clear All
              </Button>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Condition Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition
                  </label>
                  <Select value={conditionFilter} onValueChange={setConditionFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All conditions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All conditions</SelectItem>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Used">Used</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Sedan">Sedan</SelectItem>
                      <SelectItem value="Hatchback">Hatchback</SelectItem>
                      <SelectItem value="Coupe">Coupe</SelectItem>
                      <SelectItem value="Truck">Truck</SelectItem>
                      <SelectItem value="Convertible">Convertible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <Select value={priceRangeFilter} onValueChange={setPriceRangeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All prices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All prices</SelectItem>
                      <SelectItem value="under-20k">Under GHS 20,000</SelectItem>
                      <SelectItem value="20k-50k">GHS 20,000 - 50,000</SelectItem>
                      <SelectItem value="50k-100k">GHS 50,000 - 100,000</SelectItem>
                      <SelectItem value="over-100k">Over GHS 100,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cars List */}
      <Card>
        <CardContent className="p-6">
          {filteredCars.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🚗</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
              <p className="text-gray-600 mb-4">
                {cars.length === 0 
                  ? "You haven't added any cars yet." 
                  : "Try adjusting your search or filters."
                }
              </p>
              {cars.length === 0 && (
                <Button onClick={() => onNavigate('add-listing')} className="bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Car
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Bulk Selection Header */}
              {paginatedCars.length > 0 && (
                <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isIndeterminate}
                      onCheckedChange={toggleSelectAll}
                    />
                    <span className="text-sm text-gray-700">
                      {selectedCars.size === 0 
                        ? 'Select all cars on this page'
                        : `${selectedCars.size} car(s) selected`
                      }
                    </span>
                  </div>
                  {selectedCars.size > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCars(new Set())}
                    >
                      Clear Selection
                    </Button>
                  )}
                </div>
              )}
              
              <div className="space-y-4">
                {paginatedCars.map((car) => (
                  <div key={car.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    {/* Selection Checkbox */}
                    <div className="flex-shrink-0 pt-1">
                      <Checkbox
                        checked={selectedCars.has(car.id)}
                        onCheckedChange={() => toggleCarSelection(car.id)}
                      />
                    </div>
                    
                    {/* Car Image */}
                    <div className="flex-shrink-0">
                      {car.imageUrls && car.imageUrls.length > 0 ? (
                        <img
                          src={car.imageUrls[0]}
                          alt={`${car.brand} ${car.model}`}
                          className="w-20 h-16 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-20 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Car Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {car.year} {car.brand} {car.model}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {formatPrice(car.price)} • {formatMileage(car.mileage)} • {car.condition}
                            {(car as any).category && ` • ${(car as any).category}`}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Listed on {formatDate(car.createdAt)}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge className={getStatusColor(car.status || 'draft')}>
                              {(car.status || 'draft').charAt(0).toUpperCase() + (car.status || 'draft').slice(1)}
                            </Badge>
                            {(car as any).category && (
                              <Badge variant="outline" className="text-xs">
                                {(car as any).category}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onNavigate(`edit-listing/${car.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCarToDelete(car.id);
                              setShowDeleteDialog(true);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-8 pt-6 border-t border-gray-200">
                  <Button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>

                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>

                  <Button
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Car Listing</AlertDialogTitle>
            <AlertDialogDescription>
              {(() => {
                const car = cars.find(c => c.id === carToDelete);
                return car ? 
                  `Are you sure you want to delete the ${car.year} ${car.brand} ${car.model}? This action cannot be undone.` :
                  'Are you sure you want to delete this car listing? This action cannot be undone.';
              })()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDeleteDialog(false);
              setCarToDelete(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (carToDelete) {
                  handleDeleteCar(carToDelete);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Dialog */}
      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Cars</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCars.size} car listing(s)? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowBulkDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete {selectedCars.size} Car(s)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}