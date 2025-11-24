import React, { useState } from "react";
import { ChevronDown, X } from "lucide-react";

export interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;
}

export interface FilterCategory {
  id: string;
  title: string;
  type: "checkbox" | "select" | "range";
  options?: FilterOption[];
  min?: number;
  max?: number;
}

interface FilterSidebarProps {
  categories: FilterCategory[];
  onFilterChange?: (filters: Record<string, string[]>) => void;
  onReset?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * FilterSidebar Component
 * Dark navy themed filter panel with organized categories
 * Features: Sharp edges, organized sections, smooth transitions, mobile responsive
 */
export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  onFilterChange,
  onReset,
  isOpen = true,
  onClose,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<
    Set<string>
  >(new Set(categories.map((c) => c.id)));
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleCheckboxChange = (categoryId: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[categoryId] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      const newFilters = {
        ...prev,
        [categoryId]: updated,
      };

      onFilterChange?.(newFilters);
      return newFilters;
    });
  };

  const handleReset = () => {
    setSelectedFilters({});
    onReset?.();
  };

  const hasActiveFilters = Object.values(selectedFilters).some(
    (v) => v.length > 0
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative md:translate-x-0 transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 h-screen md:h-auto md:w-64 bg-[#0A1D47] border-r border-[#1A3A52] overflow-y-auto`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#050F1F] border-b border-[#1A3A52] p-4 md:p-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Filters</h2>
          <button
            onClick={onClose}
            className="md:hidden p-1 hover:bg-[#1A3A52] transition-colors duration-200"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Filter Categories */}
        <div className="divide-y divide-[#1A3A52]">
          {categories.map((category) => (
            <div key={category.id} className="border-b border-[#1A3A52]">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full p-4 md:p-6 flex items-center justify-between hover:bg-[#1A3A52] transition-colors duration-200"
              >
                <h3 className="font-semibold text-white text-sm md:text-base uppercase tracking-wide">
                  {category.title}
                </h3>
                <ChevronDown
                  size={20}
                  className={`text-[#FFD700] transition-transform duration-300 ${
                    expandedCategories.has(category.id) ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Category Options */}
              {expandedCategories.has(category.id) && (
                <div className="px-4 md:px-6 pb-4 space-y-3">
                  {category.type === "checkbox" && category.options && (
                    <div className="space-y-3">
                      {category.options.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={
                              selectedFilters[category.id]?.includes(
                                option.value
                              ) || false
                            }
                            onChange={() =>
                              handleCheckboxChange(category.id, option.value)
                            }
                            className="w-5 h-5 accent-[#FFD700] bg-[#050F1F] border border-[#1A3A52] cursor-pointer"
                          />
                          <span className="text-sm text-[#D1D5DB] group-hover:text-white transition-colors duration-200">
                            {option.label}
                          </span>
                          {option.count !== undefined && (
                            <span className="ml-auto text-xs text-[#6B7280]">
                              ({option.count})
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  )}

                  {category.type === "select" && category.options && (
                    <select className="w-full px-3 py-2 bg-[#050F1F] border border-[#1A3A52] text-white text-sm hover:border-[#FFD700] focus:border-[#FFD700] focus:outline-none transition-colors duration-200">
                      <option value="">Select {category.title.toLowerCase()}</option>
                      {category.options.map((option) => (
                        <option key={option.id} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {category.type === "range" &&
                    category.min !== undefined &&
                    category.max !== undefined && (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="number"
                            min={category.min}
                            max={category.max}
                            placeholder="Min"
                            className="flex-1 px-2 py-2 bg-[#050F1F] border border-[#1A3A52] text-white text-sm hover:border-[#FFD700] focus:border-[#FFD700] focus:outline-none transition-colors duration-200"
                          />
                          <input
                            type="number"
                            min={category.min}
                            max={category.max}
                            placeholder="Max"
                            className="flex-1 px-2 py-2 bg-[#050F1F] border border-[#1A3A52] text-white text-sm hover:border-[#FFD700] focus:border-[#FFD700] focus:outline-none transition-colors duration-200"
                          />
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <div className="sticky bottom-0 bg-[#050F1F] border-t border-[#1A3A52] p-4 md:p-6">
            <button
              onClick={handleReset}
              className="w-full px-4 py-3 bg-[#FFD700] text-[#001F3F] font-bold uppercase tracking-wider hover:bg-[#FFC700] active:bg-[#E6B800] transition-all duration-300"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default FilterSidebar;
