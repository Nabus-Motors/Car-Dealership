import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StorageImage } from '@/components/figma/StorageImage';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db, COLLECTIONS } from '@/firebase/firebase';
import { Edit, Trash2, Plus, RefreshCw } from 'lucide-react';
import { formatPrice, formatMileage } from '@/utils/format';
import type { Car } from '@/types/car';
import { normalizeImageUrls } from '@/utils/images';
import { deleteCar } from '@/services/firestoreService';
import toast from 'react-hot-toast';

interface ListingsManagementProps {
  onNavigate: (page: string) => void;
}

export function ListingsManagement({ onNavigate }: ListingsManagementProps) {
  const [selectedCars, setSelectedCars] = useState<string[]>([]);
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteCarIds, setDeleteCarIds] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
      // normalize imageUrls
      carsData.forEach(c => { (c as any).imageUrls = normalizeImageUrls(c); });
      setCars(carsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching cars:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteCar = async (carIds: string[]) => {
    const toastId = toast.loading(`Deleting ${carIds.length} car listing(s)...`);
    
    try {
      // Delete all selected cars
      await Promise.all(carIds.map(carId => deleteCar(carId)));
      toast.success(`${carIds.length} car listing(s) deleted successfully`, { id: toastId });
      setShowDeleteDialog(false);
      setDeleteCarIds([]);
      setSelectedCars([]);
    } catch (error) {
      console.error('Error deleting cars:', error);
      toast.error('Failed to delete car(s). Please try again.', { id: toastId });
    }
  };

  const handleDeleteSelected = () => {
    setDeleteCarIds(selectedCars);
    setShowDeleteDialog(true);
  };

  const handleEditSelected = () => {
    if (selectedCars.length === 1) {
      onNavigate(`edit-listing/${selectedCars[0]}`);
    }
  };

  const handleRowClick = (carId: string, event: React.MouseEvent) => {
    // Don't trigger if clicking on checkbox
    if ((event.target as HTMLElement).closest('input[type="checkbox"]')) {
      return;
    }
    
    if (event.ctrlKey || event.metaKey) {
      // Multi-select with Ctrl/Cmd - toggle selection
      handleSelectCar(carId, !selectedCars.includes(carId));
    } else {
      // Single select - clear others and select this one, or deselect if already selected alone
      if (selectedCars.length === 1 && selectedCars.includes(carId)) {
        setSelectedCars([]); // Deselect if it's the only selected item
      } else {
        setSelectedCars([carId]); // Select only this item
      }
    }
  };

  const clearSelection = () => {
    setSelectedCars([]);
  };

  const handleRefresh = () => {
    setLoading(true);
    // The onSnapshot listener will automatically update when data changes
    // We just show a loading state briefly
    setTimeout(() => setLoading(false), 500);
    toast.success('Listings refreshed!');
  };


  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCars(filteredCars.map(car => car.id));
    } else {
      setSelectedCars([]);
    }
  };

  const handleSelectCar = (carId: string, checked: boolean) => {
    if (checked) {
      setSelectedCars(prev => [...prev, carId]);
    } else {
      setSelectedCars(prev => prev.filter(id => id !== carId));
    }
  };

  // Filter cars based on filters only
  const filteredCars = cars.filter(car => {
    const matchesBrand = filterBrand === 'all' || car.brand.toLowerCase() === filterBrand;
    const matchesStatus = filterStatus === 'all' || car.condition.toLowerCase() === filterStatus;
    
    return matchesBrand && matchesStatus;
  });

  const getStatusBadge = (condition: string) => {
    const badgeClass = condition === 'New' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-blue-100 text-blue-800';
    
    return <Badge className={`text-xs ${badgeClass}`}>{condition}</Badge>;
  };

  const getListingStatusBadge = (status: string) => {
    let badgeClass = '';
    switch (status) {
      case 'published':
        badgeClass = 'bg-green-100 text-green-800';
        break;
      case 'draft':
        badgeClass = 'bg-gray-100 text-gray-800';
        break;
      case 'sold':
        badgeClass = 'bg-red-100 text-red-800';
        break;
      case 'new':
        badgeClass = 'bg-blue-100 text-blue-800';
        break;
      default:
        badgeClass = 'bg-gray-100 text-gray-800';
    }
    
    return <Badge className={`text-xs ${badgeClass}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cars...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header and Actions */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Car Listings</h1>
          <p className="text-gray-600 mt-1">
            {selectedCars.length > 0 
              ? `${selectedCars.length} item(s) selected`
              : `${cars.length} total listings`
            }
          </p>
        </div>
        {/* Actions cluster: always visible, adapts by selection */}
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            className="text-gray-600 hover:text-gray-900"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {selectedCars.length === 1 && (
            <Button
              onClick={handleEditSelected}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          {selectedCars.length > 0 && (
            <>
              <Button
                variant="outline"
                onClick={clearSelection}
                className="text-gray-600"
              >
                Clear
              </Button>
              <Button
                onClick={handleDeleteSelected}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete {selectedCars.length > 1 ? `(${selectedCars.length})` : ''}
              </Button>
            </>
          )}
          <Button
            onClick={() => onNavigate('add-listing')}
            className="bg-red-600 hover:bg-red-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Car
          </Button>
        </div>
      </div>

      {/* Filters and Actions */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={filterBrand} onValueChange={setFilterBrand}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    <SelectItem value="bmw">BMW</SelectItem>
                    <SelectItem value="mercedes">Mercedes</SelectItem>
                    <SelectItem value="audi">Audi</SelectItem>
                    <SelectItem value="tesla">Tesla</SelectItem>
                    <SelectItem value="ferrari">Ferrari</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Conditions</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => onNavigate('add-listing')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Car
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cars Table */}
        <Card className="shadow-sm">
          <CardContent className="p-0">
            {filteredCars.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
                <p className="text-gray-600 mb-4">
                  {filterBrand !== 'all' || filterStatus !== 'all'
                    ? 'No cars match your current filters.'
                    : 'Get started by adding your first car listing.'}
                </p>
                <Button 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => onNavigate('add-listing')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Car
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedCars.length === filteredCars.length && filteredCars.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="min-w-[260px]">Car</TableHead>
                      <TableHead className="min-w-[160px]">Details</TableHead>
                      <TableHead className="min-w-[120px]">Price</TableHead>
                      <TableHead className="min-w-[130px]">Condition</TableHead>
                      <TableHead className="min-w-[130px]">Status</TableHead>
                      <TableHead className="min-w-[130px]">Date Added</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCars.map((car) => (
                      <TableRow 
                        key={car.id}
                        className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                          selectedCars.includes(car.id) ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                        onClick={(e) => handleRowClick(car.id, e)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedCars.includes(car.id)}
                            onCheckedChange={(checked) => handleSelectCar(car.id, !!checked)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              {car.imageUrls && car.imageUrls.length > 0 ? (
                                <StorageImage
                                  src={car.imageUrls[0]}
                                  alt={`${car.year} ${car.brand} ${car.model}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path fillRule="evenodd" d="M1.5 6A2.25 2.25 0 013.75 3.75h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zm3 .75a.75.75 0 000 1.5h14.25a.75.75 0 000-1.5H4.5zm4.28 5.47a.75.75 0 011.06 0l2.22 2.22 1.22-1.22a.75.75 0 011.06 0l2.72 2.72a.75.75 0 01-1.06 1.06l-2.19-2.19-1.25 1.25a.75.75 0 01-1.06 0l-2.75-2.75a.75.75 0 010-1.06z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {car.year} {car.brand} {car.model}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatMileage(car.mileage)} • {car.fuelType}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{car.transmission}</p>
                            <p className="text-gray-500">{car.features?.length || 0} features</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-gray-900">
                            {formatPrice(car.price)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(car.condition)}
                        </TableCell>
                        <TableCell>
                          {getListingStatusBadge(car.status || 'draft')}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {formatDate(car.createdAt)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {filteredCars.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredCars.length} of {cars.length} cars
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        )}

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 shadow-lg z-40"
        onClick={() => onNavigate('add-listing')}
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Car Listing{deleteCarIds.length > 1 ? 's' : ''}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteCarIds.length === 1 ? (
                (() => {
                  const car = cars.find(c => c.id === deleteCarIds[0]);
                  return car ? 
                    `Are you sure you want to delete the ${car.year} ${car.brand} ${car.model}? This action cannot be undone and will remove all associated images.` :
                    'Are you sure you want to delete this car listing? This action cannot be undone.';
                })()
              ) : (
                `Are you sure you want to delete ${deleteCarIds.length} car listings? This action cannot be undone and will remove all associated images.`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDeleteDialog(false);
              setDeleteCarIds([]);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => handleDeleteCar(deleteCarIds)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}