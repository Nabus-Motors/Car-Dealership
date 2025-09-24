import React, { useState } from 'react';
import { AdminHeader } from './AdminHeader';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

interface ListingsManagementProps {
  onNavigate: (page: string, carId?: string) => void;
}

interface Car {
  id: string;
  image: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  status: 'active' | 'inactive' | 'sold';
  dateAdded: string;
  mileage: string;
  condition: string;
}

export function ListingsManagement({ onNavigate }: ListingsManagementProps) {
  const [selectedCars, setSelectedCars] = useState<string[]>([]);
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const mockCars: Car[] = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1653047256226-5abbfa82f1d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjYXIlMjByZWR8ZW58MXx8fHwxNzU4NjEwNzA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      brand: 'Ferrari',
      model: '488 GTB',
      year: 2023,
      price: 285000,
      status: 'active',
      dateAdded: '2024-01-15',
      mileage: '2,500 miles',
      condition: 'Excellent'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1734299388217-2ebc605ef43f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibXclMjBzZWRhbiUyMGJsYWNrfGVufDF8fHx8MTc1ODYyNjczMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      brand: 'BMW',
      model: 'M5 Sedan',
      year: 2024,
      price: 105000,
      status: 'active',
      dateAdded: '2024-01-12',
      mileage: '500 miles',
      condition: 'New'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1654484521052-c6d2e96c120c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXJjZWRlcyUyMGx1eHVyeSUyMGNhcnxlbnwxfHx8fDE3NTg2MzAyOTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      brand: 'Mercedes',
      model: 'S-Class',
      year: 2024,
      price: 125000,
      status: 'sold',
      dateAdded: '2024-01-10',
      mileage: '800 miles',
      condition: 'Excellent'
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1610470850940-27b52ca7c0fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXNsYSUyMGVsZWN0cmljJTIwY2FyfGVufDF8fHx8MTc1ODcyMTcyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      brand: 'Tesla',
      model: 'Model S',
      year: 2024,
      price: 89000,
      status: 'inactive',
      dateAdded: '2024-01-08',
      mileage: '3,000 miles',
      condition: 'Good'
    },
    {
      id: '5',
      image: 'https://images.unsplash.com/photo-1728711283509-906e153833ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdWRpJTIwc3V2JTIwd2hpdGV8ZW58MXx8fHwxNzU4NzIxNzI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      brand: 'Audi',
      model: 'Q7 SUV',
      year: 2024,
      price: 68000,
      status: 'active',
      dateAdded: '2024-01-05',
      mileage: '1,200 miles',
      condition: 'Excellent'
    }
  ];

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleSelectCar = (carId: string, checked: boolean) => {
    if (checked) {
      setSelectedCars([...selectedCars, carId]);
    } else {
      setSelectedCars(selectedCars.filter(id => id !== carId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCars(filteredCars.map(car => car.id));
    } else {
      setSelectedCars([]);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-yellow-100 text-yellow-800">Inactive</Badge>;
      case 'sold':
        return <Badge className="bg-gray-100 text-gray-800">Sold</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredCars = mockCars.filter(car => {
    const matchesSearch = searchQuery === '' || 
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBrand = filterBrand === 'all' || car.brand.toLowerCase() === filterBrand;
    const matchesStatus = filterStatus === 'all' || car.status === filterStatus;
    
    return matchesSearch && matchesBrand && matchesStatus;
  });

  const brands = Array.from(new Set(mockCars.map(car => car.brand)));

  return (
    <div className="flex-1 bg-gray-50">
      <AdminHeader 
        title="Car Listings" 
        showSearch={true}
        searchPlaceholder="Search by brand or model..."
        onSearch={handleSearch}
      />
      
      <div className="p-6 space-y-6">
        {/* Filters and Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              {/* Filters */}
              <div className="flex items-center space-x-4">
                <Select value={filterBrand} onValueChange={setFilterBrand}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map(brand => (
                      <SelectItem key={brand} value={brand.toLowerCase()}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bulk Actions */}
              <div className="flex items-center space-x-2">
                {selectedCars.length > 0 && (
                  <>
                    <Button variant="outline" size="sm">
                      Archive ({selectedCars.length})
                    </Button>
                    <Button variant="outline" size="sm">
                      Publish ({selectedCars.length})
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Delete ({selectedCars.length})
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Selected Listings</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {selectedCars.length} listing(s)? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
                
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => onNavigate('add-listing')}
                >
                  + Add New Listing
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Listings Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedCars.length === filteredCars.length && filteredCars.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Car</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCars.map((car) => (
                  <TableRow key={car.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedCars.includes(car.id)}
                        onCheckedChange={(checked) => handleSelectCar(car.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <ImageWithFallback
                          src={car.image}
                          alt={`${car.brand} ${car.model}`}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium">{car.brand} {car.model}</p>
                          <p className="text-sm text-gray-500">{car.year}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{formatPrice(car.price)}</TableCell>
                    <TableCell>{getStatusBadge(car.status)}</TableCell>
                    <TableCell className="text-gray-600">{car.dateAdded}</TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        <p>{car.mileage}</p>
                        <p>{car.condition}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hover:bg-gray-100 transition-colors duration-150 rounded-md"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="end" 
                          className="w-48 shadow-lg border border-gray-200 bg-white rounded-lg p-1"
                          sideOffset={4}
                        >
                          <DropdownMenuItem 
                            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md cursor-pointer transition-colors duration-150 focus:bg-gray-50 focus:text-gray-900 focus:outline-none"
                          >
                            <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onNavigate('edit-listing', car.id)}
                            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md cursor-pointer transition-colors duration-150 focus:bg-gray-50 focus:text-gray-900 focus:outline-none"
                          >
                            <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Listing
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem 
                                onSelect={(e) => e.preventDefault()}
                                className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md cursor-pointer transition-colors duration-150 focus:bg-red-50 focus:text-red-700 focus:outline-none"
                              >
                                <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Listing
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="sm:max-w-md">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center">
                                  <svg className="w-6 h-6 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                  </svg>
                                  Delete Car Listing
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600">
                                  Are you sure you want to delete the <span className="font-medium">{car.brand} {car.model} ({car.year})</span> listing? This action cannot be undone and will permanently remove the car from your inventory.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                                <AlertDialogCancel className="mt-3 sm:mt-0 w-full sm:w-auto">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 focus:ring-red-500"
                                  onClick={() => {
                                    // In a real application, you would call an API to delete the car
                                    alert(`${car.brand} ${car.model} listing deleted successfully!`);
                                  }}
                                >
                                  Delete Listing
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredCars.length} of {mockCars.length} listings
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="bg-red-600 text-white">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 shadow-lg"
        onClick={() => onNavigate('add-listing')}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Button>
    </div>
  );
}