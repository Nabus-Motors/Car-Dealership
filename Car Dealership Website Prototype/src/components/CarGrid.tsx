import { Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { Car } from '../App';
import { CarCard } from './CarCard';

interface CarGridProps {
  cars: Car[];
  totalCars: number;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function CarGrid({ 
  cars, 
  totalCars, 
  viewMode, 
  setViewMode, 
  sortBy, 
  setSortBy,
  currentPage,
  totalPages,
  onPageChange 
}: CarGridProps) {
  return (
    <div>
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-6">
          <span className="text-gray-600">
            <span className="text-[#001F3F]">{totalCars}</span> cars
          </span>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid' 
                  ? 'bg-[#001F3F] text-white' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              } transition-colors`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list' 
                  ? 'bg-[#001F3F] text-white' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              } transition-colors`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-gray-600">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 bg-white text-gray-700"
          >
            <option value="date">Sort by Date</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="year">Year: Newest First</option>
          </select>
        </div>
      </div>

      {/* Car Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8' 
          : 'flex flex-col gap-6 mb-8'
      }>
        {cars.map(car => (
          <CarCard key={car.id} car={car} viewMode={viewMode} />
        ))}
      </div>

      {/* No Results */}
      {cars.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">No cars found matching your filters.</p>
          <p className="text-gray-400 mt-2">Try adjusting your search criteria.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded transition-colors ${
                currentPage === page
                  ? 'bg-[#001F3F] text-white'
                  : 'border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
