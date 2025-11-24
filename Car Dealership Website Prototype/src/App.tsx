import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FilterSidebar } from './components/FilterSidebar';
import { CarGrid } from './components/CarGrid';
import { Footer } from './components/Footer';

export interface Car {
  id: number;
  title: string;
  price: number;
  image: string;
  mileage: string;
  transmission: string;
  bodyType: string;
  seats: number;
  fuelType: string;
  date: string;
  make: string;
  model: string;
  year: number;
  condition: string;
  exteriorColor: string;
  engine: string;
}

export interface Filters {
  make: string;
  model: string;
  yearMin: string;
  yearMax: string;
  bodyStyle: string;
  condition: string;
  mileageMin: string;
  mileageMax: string;
  transmission: string;
  engine: string;
  exteriorColor: string;
  priceMin: number;
  priceMax: number;
}

const mockCars: Car[] = [
  {
    id: 1,
    title: '2016 Porsche Boxster Spyder',
    price: 85000,
    image: '',
    mileage: '25,000 km',
    transmission: 'Manual',
    bodyType: 'Convertible',
    seats: 2,
    fuelType: 'Petrol',
    date: 'March 25, 2023',
    make: 'Porsche',
    model: 'Boxster',
    year: 2016,
    condition: 'Used',
    exteriorColor: 'Red',
    engine: '3.4L'
  },
  {
    id: 2,
    title: '2019 Porsche Cayenne',
    price: 75000,
    image: '',
    mileage: '18,500 km',
    transmission: 'Automatic',
    bodyType: 'SUV',
    seats: 5,
    fuelType: 'Petrol',
    date: 'March 24, 2023',
    make: 'Porsche',
    model: 'Cayenne',
    year: 2019,
    condition: 'Used',
    exteriorColor: 'White',
    engine: '3.0L'
  },
  {
    id: 3,
    title: '2017 Porsche 718 Cayman',
    price: 68000,
    image: '',
    mileage: '32,000 km',
    transmission: 'Manual',
    bodyType: 'Coupe',
    seats: 2,
    fuelType: 'Petrol',
    date: 'March 23, 2023',
    make: 'Porsche',
    model: '718',
    year: 2017,
    condition: 'Used',
    exteriorColor: 'Silver',
    engine: '2.0L'
  },
  {
    id: 4,
    title: '2018 BMW X Series Convertible',
    price: 72000,
    image: '',
    mileage: '28,000 km',
    transmission: 'Automatic',
    bodyType: 'Convertible',
    seats: 4,
    fuelType: 'Diesel',
    date: 'March 22, 2023',
    make: 'BMW',
    model: 'X Series',
    year: 2018,
    condition: 'Used',
    exteriorColor: 'Blue',
    engine: '3.0L'
  },
  {
    id: 5,
    title: '2017 T-roc Coupe SE',
    price: 35000,
    image: '',
    mileage: '45,000 km',
    transmission: 'Automatic',
    bodyType: 'Coupe',
    seats: 5,
    fuelType: 'Petrol',
    date: 'March 21, 2023',
    make: 'Volkswagen',
    model: 'T-Roc',
    year: 2017,
    condition: 'Used',
    exteriorColor: 'Gray',
    engine: '1.5L'
  },
  {
    id: 6,
    title: '2019 Mercedes-Benz E Class 2 door',
    price: 65000,
    image: '',
    mileage: '22,000 km',
    transmission: 'Automatic',
    bodyType: 'Coupe',
    seats: 4,
    fuelType: 'Petrol',
    date: 'March 20, 2023',
    make: 'Mercedes-Benz',
    model: 'E-Class',
    year: 2019,
    condition: 'Certified',
    exteriorColor: 'Black',
    engine: '2.0L'
  },
  {
    id: 7,
    title: '2020 BMW 4 series 6 door',
    price: 58000,
    image: '',
    mileage: '15,000 km',
    transmission: 'Automatic',
    bodyType: 'Sedan',
    seats: 5,
    fuelType: 'Diesel',
    date: 'March 19, 2023',
    make: 'BMW',
    model: '4 Series',
    year: 2020,
    condition: 'Certified',
    exteriorColor: 'White',
    engine: '2.0L'
  },
  {
    id: 8,
    title: '2018 Audi Q7 3.0 TDI',
    price: 62000,
    image: '',
    mileage: '38,000 km',
    transmission: 'Automatic',
    bodyType: 'SUV',
    seats: 7,
    fuelType: 'Diesel',
    date: 'March 18, 2023',
    make: 'Audi',
    model: 'Q7',
    year: 2018,
    condition: 'Used',
    exteriorColor: 'Black',
    engine: '3.0L'
  },
  {
    id: 9,
    title: '2019 Mercedes-Benz AMG GT S 2 door',
    price: 125000,
    image: '',
    mileage: '12,000 km',
    transmission: 'Automatic',
    bodyType: 'Coupe',
    seats: 2,
    fuelType: 'Petrol',
    date: 'March 17, 2023',
    make: 'Mercedes-Benz',
    model: 'AMG GT',
    year: 2019,
    condition: 'Certified',
    exteriorColor: 'Yellow',
    engine: '4.0L'
  },
  {
    id: 10,
    title: '2021 Ferrari 488 Spider',
    price: 285000,
    image: '',
    mileage: '5,000 km',
    transmission: 'Automatic',
    bodyType: 'Convertible',
    seats: 2,
    fuelType: 'Petrol',
    date: 'March 16, 2023',
    make: 'Ferrari',
    model: '488',
    year: 2021,
    condition: 'Certified',
    exteriorColor: 'Red',
    engine: '3.9L'
  },
  {
    id: 11,
    title: '2020 Audi R8 V10',
    price: 165000,
    image: '',
    mileage: '8,000 km',
    transmission: 'Automatic',
    bodyType: 'Coupe',
    seats: 2,
    fuelType: 'Petrol',
    date: 'March 15, 2023',
    make: 'Audi',
    model: 'R8',
    year: 2020,
    condition: 'Certified',
    exteriorColor: 'Gray',
    engine: '5.2L'
  },
  {
    id: 12,
    title: '2019 BMW X5 M Sport',
    price: 68000,
    image: '',
    mileage: '28,000 km',
    transmission: 'Automatic',
    bodyType: 'SUV',
    seats: 5,
    fuelType: 'Diesel',
    date: 'March 14, 2023',
    make: 'BMW',
    model: 'X5',
    year: 2019,
    condition: 'Used',
    exteriorColor: 'Blue',
    engine: '3.0L'
  }
];

export default function App() {
  const [filters, setFilters] = useState<Filters>({
    make: '',
    model: '',
    yearMin: '',
    yearMax: '',
    bodyStyle: '',
    condition: '',
    mileageMin: '',
    mileageMax: '',
    transmission: '',
    engine: '',
    exteriorColor: '',
    priceMin: 5000,
    priceMax: 885100
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const resetFilters = () => {
    setFilters({
      make: '',
      model: '',
      yearMin: '',
      yearMax: '',
      bodyStyle: '',
      condition: '',
      mileageMin: '',
      mileageMax: '',
      transmission: '',
      engine: '',
      exteriorColor: '',
      priceMin: 5000,
      priceMax: 885100
    });
  };

  // Filter cars
  const filteredCars = mockCars.filter(car => {
    if (filters.make && car.make !== filters.make) return false;
    if (filters.model && car.model !== filters.model) return false;
    if (filters.yearMin && car.year < parseInt(filters.yearMin)) return false;
    if (filters.yearMax && car.year > parseInt(filters.yearMax)) return false;
    if (filters.bodyStyle && car.bodyType !== filters.bodyStyle) return false;
    if (filters.condition && car.condition !== filters.condition) return false;
    if (filters.transmission && car.transmission !== filters.transmission) return false;
    if (filters.exteriorColor && car.exteriorColor !== filters.exteriorColor) return false;
    if (car.price < filters.priceMin || car.price > filters.priceMax) return false;
    return true;
  });

  // Sort cars
  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'year') return b.year - a.year;
    return 0; // date
  });

  // Paginate
  const totalPages = Math.ceil(sortedCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCars = sortedCars.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      
      <div className="flex">
        <FilterSidebar 
          filters={filters} 
          setFilters={setFilters} 
          onReset={resetFilters}
        />
        
        <main className="flex-1 p-8">
          <CarGrid 
            cars={paginatedCars}
            totalCars={filteredCars.length}
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortBy={sortBy}
            setSortBy={setSortBy}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>

      <Footer />
    </div>
  );
}
