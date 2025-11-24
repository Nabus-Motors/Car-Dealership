import React from "react";

export interface Spec {
  label: string;
  value: string | number;
}

interface SpecsGridProps {
  specs: Spec[];
  columns?: 2 | 3 | 4;
}

export const SpecsGrid: React.FC<SpecsGridProps> = ({ specs, columns = 2 }) => {
  const colClasses = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <div className={`grid ${colClasses[columns]} gap-3 md:gap-4`}>
      {specs.map((spec, index) => (
        <div
          key={index}
          className="bg-[#0A1D47] p-3 md:p-4 border border-[#1A3A52] hover:border-[#FFD700] transition-colors duration-300"
        >
          <div className="text-xs md:text-sm text-[#9CA3AF] font-medium uppercase tracking-wide">
            {spec.label}
          </div>
          <div className="text-sm md:text-base text-[#FFFFFF] font-semibold mt-1">
            {spec.value}
          </div>
        </div>
      ))}
    </div>
  );
};
