import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Filters } from '../App';

interface FilterSidebarProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  onReset: () => void;
}

export function FilterSidebar({ filters, setFilters, onReset }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    make: true,
    model: true,
    year: true,
    bodyStyle: true,
    condition: true,
    mileage: true,
    transmission: true,
    engine: true,
    exteriorColor: true,
    priceRange: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilter = (key: keyof Filters, value: string | number) => {
    setFilters({ ...filters, [key]: value });
  };

  const makes = ['Porsche', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Ferrari'];
  const models = ['Boxster', 'Cayenne', '718', 'X Series', 'E-Class', 'AMG GT', 'Q7', 'R8', '4 Series', 'X5', 'T-Roc', '488'];
  const bodyStyles = ['Convertible', 'SUV', 'Coupe', 'Sedan'];
  const conditions = ['New', 'Used', 'Certified'];
  const transmissions = ['Automatic', 'Manual'];
  const engines = ['1.5L', '2.0L', '3.0L', '3.4L', '3.9L', '4.0L', '5.2L'];
  const colors = ['Black', 'White', 'Red', 'Blue', 'Silver', 'Gray', 'Yellow'];

  const FilterSection = ({ 
    title, 
    sectionKey, 
    children 
  }: { 
    title: string; 
    sectionKey: keyof typeof expandedSections; 
    children: React.ReactNode;
  }) => (
    <div className="border-b border-gray-700 py-4">
      <button
        className="w-full flex justify-between items-center mb-3"
        onClick={() => toggleSection(sectionKey)}
      >
        <span>{title}</span>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {expandedSections[sectionKey] && <div>{children}</div>}
    </div>
  );

  return (
    <aside className="w-80 bg-[#001F3F] text-white p-6 min-h-screen sticky top-[72px] self-start overflow-y-auto max-h-[calc(100vh-72px)]">
      <h2 className="text-xl mb-6">VEHICLE FILTERS</h2>

      <FilterSection title="Make" sectionKey="make">
        <select
          value={filters.make}
          onChange={(e) => updateFilter('make', e.target.value)}
          className="w-full bg-[#0A1929] border border-gray-700 p-2 text-white"
        >
          <option value="">All Makes</option>
          {makes.map(make => (
            <option key={make} value={make}>{make}</option>
          ))}
        </select>
      </FilterSection>

      <FilterSection title="Model" sectionKey="model">
        <select
          value={filters.model}
          onChange={(e) => updateFilter('model', e.target.value)}
          className="w-full bg-[#0A1929] border border-gray-700 p-2 text-white"
        >
          <option value="">All Models</option>
          {models.map(model => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
      </FilterSection>

      <FilterSection title="Year" sectionKey="year">
        <div className="space-y-2">
          <select
            value={filters.yearMin}
            onChange={(e) => updateFilter('yearMin', e.target.value)}
            className="w-full bg-[#0A1929] border border-gray-700 p-2 text-white"
          >
            <option value="">Min Year</option>
            {Array.from({ length: 10 }, (_, i) => 2015 + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select
            value={filters.yearMax}
            onChange={(e) => updateFilter('yearMax', e.target.value)}
            className="w-full bg-[#0A1929] border border-gray-700 p-2 text-white"
          >
            <option value="">Max Year</option>
            {Array.from({ length: 10 }, (_, i) => 2015 + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </FilterSection>

      <FilterSection title="Body Style" sectionKey="bodyStyle">
        <select
          value={filters.bodyStyle}
          onChange={(e) => updateFilter('bodyStyle', e.target.value)}
          className="w-full bg-[#0A1929] border border-gray-700 p-2 text-white"
        >
          <option value="">All Body Styles</option>
          {bodyStyles.map(style => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>
      </FilterSection>

      <FilterSection title="Condition" sectionKey="condition">
        <select
          value={filters.condition}
          onChange={(e) => updateFilter('condition', e.target.value)}
          className="w-full bg-[#0A1929] border border-gray-700 p-2 text-white"
        >
          <option value="">All Conditions</option>
          {conditions.map(condition => (
            <option key={condition} value={condition}>{condition}</option>
          ))}
        </select>
      </FilterSection>

      <FilterSection title="Mileage" sectionKey="mileage">
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Min Mileage"
            value={filters.mileageMin}
            onChange={(e) => updateFilter('mileageMin', e.target.value)}
            className="w-full bg-[#0A1929] border border-gray-700 p-2 text-white placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="Max Mileage"
            value={filters.mileageMax}
            onChange={(e) => updateFilter('mileageMax', e.target.value)}
            className="w-full bg-[#0A1929] border border-gray-700 p-2 text-white placeholder-gray-400"
          />
        </div>
      </FilterSection>

      <FilterSection title="Transmission" sectionKey="transmission">
        <select
          value={filters.transmission}
          onChange={(e) => updateFilter('transmission', e.target.value)}
          className="w-full bg-[#0A1929] border border-gray-700 p-2 text-white"
        >
          <option value="">All Transmissions</option>
          {transmissions.map(trans => (
            <option key={trans} value={trans}>{trans}</option>
          ))}
        </select>
      </FilterSection>

      <FilterSection title="Engine" sectionKey="engine">
        <select
          value={filters.engine}
          onChange={(e) => updateFilter('engine', e.target.value)}
          className="w-full bg-[#0A1929] border border-gray-700 p-2 text-white"
        >
          <option value="">All Engines</option>
          {engines.map(engine => (
            <option key={engine} value={engine}>{engine}</option>
          ))}
        </select>
      </FilterSection>

      <FilterSection title="Exterior Color" sectionKey="exteriorColor">
        <select
          value={filters.exteriorColor}
          onChange={(e) => updateFilter('exteriorColor', e.target.value)}
          className="w-full bg-[#0A1929] border border-gray-700 p-2 text-white"
        >
          <option value="">All Colors</option>
          {colors.map(color => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>
      </FilterSection>

      <FilterSection title="Price Range" sectionKey="priceRange">
        <div className="space-y-3">
          <div>
            <input
              type="range"
              min="5000"
              max="885100"
              step="5000"
              value={filters.priceMin}
              onChange={(e) => updateFilter('priceMin', parseInt(e.target.value))}
              className="w-full accent-[#FFC700]"
            />
            <div className="flex justify-between text-sm mt-1">
              <span>${filters.priceMin.toLocaleString()}</span>
              <span>Min</span>
            </div>
          </div>
          <div>
            <input
              type="range"
              min="5000"
              max="885100"
              step="5000"
              value={filters.priceMax}
              onChange={(e) => updateFilter('priceMax', parseInt(e.target.value))}
              className="w-full accent-[#FFC700]"
            />
            <div className="flex justify-between text-sm mt-1">
              <span>${filters.priceMax.toLocaleString()}</span>
              <span>Max</span>
            </div>
          </div>
        </div>
      </FilterSection>

      <button
        onClick={onReset}
        className="w-full bg-[#FFC700] text-[#001F3F] py-3 mt-6 hover:bg-[#FFD700] transition-colors"
      >
        Reset Filter
      </button>
    </aside>
  );
}
