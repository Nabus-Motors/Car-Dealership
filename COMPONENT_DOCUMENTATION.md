# Automotive Design System Components

This document outlines the new reusable component library built with the automotive design aesthetic: sharp edges, navy/white/yellow color scheme, and smooth transitions.

## Overview

All components follow the design tokens defined in `src/styles/designTokens.ts` and global styles in `src/styles/globalStyles.css`.

### Color Palette
- **Primary Navy**: `#001F3F` (darkest) → `#0A1D47` (dark) → `#1A3A52` (light)
- **Accents**: `#FFD700` (gold), `#FFC700` (yellow)
- **Text**: `#FFFFFF` (white), `#9CA3AF` (muted)
- **Backgrounds**: `#050F1F` (darkest), `#0A1D47` (dark)

### Key Features
- **Sharp Edges**: 0px border-radius throughout
- **Smooth Transitions**: 300ms ease-in-out for all interactive states
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Accessibility**: Proper ARIA labels, keyboard navigation, contrast ratios

---

## Components

### 1. CarCard

High-performance automotive product card component with integrated image gallery and specifications display.

#### Location
```
src/components/CarCard/
  ├── CarCard.tsx (main component)
  ├── PriceBadge.tsx (price display subcomponent)
  ├── SpecsGrid.tsx (specifications grid subcomponent)
  └── index.ts (exports)
```

#### Props
```typescript
interface CarCardProps {
  id: string;
  title: string;
  price: number;
  salePrice?: number;
  image: string;
  thumbnails?: string[];
  specs: Spec[];
  badge?: {
    text: string;
    color?: "gold" | "blue" | "green";
  };
  onShare?: () => void;
  onWishlist?: (id: string, liked: boolean) => void;
  onPrint?: () => void;
  onClick?: () => void;
  variant?: "compact" | "full";
  featured?: boolean;
}

interface Spec {
  label: string;
  value: string | number;
}
```

#### Features
- **Full Variant**: Large product layout with image gallery (main + 4 thumbnails), price badge, specs grid, action buttons (print/share/wishlist)
- **Compact Variant**: Smaller layout for grid displays with image, title, price
- **Image Gallery**: Click thumbnails to change main image, arrow navigation
- **Price Badge**: Formatted with currency, sale price support, featured state with yellow accent
- **Specs Grid**: 2-4 column layout with hover effects
- **Interactive Actions**: Share, Print, Wishlist buttons with smooth transitions

#### Usage Example
```tsx
import { CarCard, type CarCardProps } from "@/components/CarCard";

const car: CarCardProps = {
  id: "car-001",
  title: "2024 Tesla Model S Plaid",
  price: 89990,
  salePrice: 99990,
  image: "https://example.com/main.jpg",
  thumbnails: [
    "https://example.com/thumb1.jpg",
    "https://example.com/thumb2.jpg",
  ],
  specs: [
    { label: "Mileage", value: "12,500 mi" },
    { label: "Transmission", value: "Automatic" },
    { label: "Body Type", value: "Sedan" },
    { label: "Seats", value: "5" },
  ],
  badge: { text: "Featured", color: "gold" },
  featured: true,
  onShare: () => console.log("Shared"),
  onWishlist: (id, liked) => console.log(`Wishlist: ${id}, ${liked}`),
};

export function ProductPage() {
  return (
    <CarCard {...car} variant="full" />
  );
}
```

#### Styling
- Smooth hover effects with 300ms transitions
- Border highlight on hover: `border-[#FFD700]`
- Image scale zoom on hover
- Yellow accent buttons with dark text on hover
- Responsive grid for specs (2 cols mobile, more on larger screens)

---

### 2. CTAButton

Primary call-to-action button component with multiple variants and sizes.

#### Location
```
src/components/Button/
  ├── CTAButton.tsx (main component)
  └── index.ts (exports)
```

#### Props
```typescript
interface CTAButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}
```

#### Variants
- **Primary** (default): Yellow background (`#FFD700`), dark text, sharp edges
- **Secondary**: Dark navy background, yellow border, white text
- **Outline**: Transparent background, yellow border, yellow text

#### Sizes
- **sm**: `px-4 py-2 text-sm` (compact buttons)
- **md**: `px-6 py-3 text-base` (standard buttons)
- **lg**: `px-8 py-4 text-lg` (prominent buttons)

#### Features
- Loading state with spinner
- Icon support (left/right positioning)
- Active state with scale effect
- Disabled state styling
- Smooth transitions and hover effects

#### Usage Example
```tsx
import { CTAButton } from "@/components/Button";
import { Heart, ChevronRight } from "lucide-react";

export function CallToAction() {
  return (
    <>
      {/* Primary Button */}
      <CTAButton onClick={() => navigate("/explore")}>
        Explore Vehicles
      </CTAButton>

      {/* With Icon */}
      <CTAButton
        variant="secondary"
        icon={<Heart size={20} />}
        iconPosition="right"
      >
        Save to Wishlist
      </CTAButton>

      {/* Large Size */}
      <CTAButton size="lg" icon={<ChevronRight size={24} />}>
        Get Pre-Approved
      </CTAButton>

      {/* Loading State */}
      <CTAButton isLoading>Processing...</CTAButton>
    </>
  );
}
```

---

### 3. FilterSidebar

Responsive filter panel with organized categories and multiple filter types.

#### Location
```
src/components/FilterSidebar/
  ├── FilterSidebar.tsx (main component)
  └── index.ts (exports)
```

#### Props
```typescript
interface FilterSidebarProps {
  categories: FilterCategory[];
  onFilterChange?: (filters: Record<string, string[]>) => void;
  onReset?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

interface FilterCategory {
  id: string;
  title: string;
  type: "checkbox" | "select" | "range";
  options?: FilterOption[];
  min?: number;
  max?: number;
}

interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;
}
```

#### Features
- **Dark Navy Theme**: Navy background with organized sections
- **Collapsible Categories**: Click to expand/collapse each section
- **Multiple Filter Types**: Checkboxes (multi-select), dropdowns (select), range inputs
- **Mobile Responsive**: Full-screen modal on mobile, sidebar on desktop
- **Reset Functionality**: Clear all filters button (shown only when filters active)
- **Item Counts**: Optional count display for each filter option

#### Usage Example
```tsx
import { FilterSidebar, type FilterCategory } from "@/components/FilterSidebar";
import { useState } from "react";

export function ExplorePage() {
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const filterCategories: FilterCategory[] = [
    {
      id: "make",
      title: "Make",
      type: "checkbox",
      options: [
        { id: "tesla", label: "Tesla", value: "tesla", count: 45 },
        { id: "ford", label: "Ford", value: "ford", count: 32 },
        { id: "bmw", label: "BMW", value: "bmw", count: 28 },
      ],
    },
    {
      id: "year",
      title: "Year",
      type: "range",
      min: 2015,
      max: 2024,
    },
    {
      id: "bodyType",
      title: "Body Type",
      type: "checkbox",
      options: [
        { id: "sedan", label: "Sedan", value: "sedan", count: 60 },
        { id: "suv", label: "SUV", value: "suv", count: 55 },
        { id: "truck", label: "Truck", value: "truck", count: 35 },
      ],
    },
  ];

  const handleFilterChange = (filters: Record<string, string[]>) => {
    console.log("Filters updated:", filters);
    // Apply filters to vehicle list
  };

  return (
    <div className="flex gap-6">
      <FilterSidebar
        categories={filterCategories}
        onFilterChange={handleFilterChange}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
      {/* Vehicle Grid */}
    </div>
  );
}
```

---

### 4. SpecsGrid (Sub-component)

Reusable component for displaying car specifications in grid format.

#### Props
```typescript
interface SpecsGridProps {
  specs: Spec[];
  columns?: 2 | 3 | 4;
}

interface Spec {
  label: string;
  value: string | number;
}
```

#### Features
- Responsive column layout
- Dark navy background with hover border effects
- Uppercase labels with gray text
- Bold values in white
- Transition on border color (300ms)

---

### 5. PriceBadge (Sub-component)

Displays car pricing with optional sale price and featured state.

#### Props
```typescript
interface PriceBadgeProps {
  price: string | number;
  salePrice?: string | number;
  featured?: boolean;
}
```

#### Features
- Automatic currency formatting
- Sale price comparison (with strikethrough)
- Featured state with yellow background
- Sharp corner design via CSS pseudo-element

---

## Global Styles & Animations

### CSS Variables
All design tokens are defined as CSS variables in `src/styles/globalStyles.css`:

```css
--color-primary-navy: #001F3F;
--color-accent-gold: #FFD700;
--transition-moderate: 300ms ease-in-out;
--shadow-gold-glow: 0 0 20px rgba(255, 215, 0, 0.4);
```

### Available Animations
- `fadeIn` / `fadeOut`: 200-300ms opacity transitions
- `slideInLeft` / `slideInRight` / `slideInUp` / `slideInDown`: 300ms position + fade
- `scaleIn`: 300ms scale from 0.95 to 1
- `hoverLift`: Vertical lift effect on hover
- `pulse`: Breathing opacity animation
- `shimmer`: Loading skeleton animation

### Utility Classes
```css
.animate-fade-in { animation: fadeIn var(--transition-moderate); }
.animate-slide-in-up { animation: slideInUp var(--transition-moderate); }
.transition-all { transition: all var(--transition-base); }
.hover-lift:hover { animation: hoverLift var(--transition-base); }
.border-left-accent { border-left: 3px solid var(--color-accent-gold); }
.accent-gold-glow { box-shadow: var(--shadow-gold-glow); }
```

---

## Implementation Guidelines

### 1. Component Composition
- Use `CarCard` for product displays (explore, search results, favorites)
- Use `CTAButton` for all interactive actions
- Use `FilterSidebar` for search/explore pages
- Use `SpecsGrid` within CarCard or detail pages

### 2. Styling Consistency
- Always use Tailwind classes with design token colors
- Never use hardcoded colors; reference CSS variables
- Maintain sharp edges (0px border-radius)
- Use 300ms transitions for state changes

### 3. Responsive Behavior
- Mobile-first approach with Tailwind breakpoints
- FilterSidebar becomes modal on mobile
- CarCard adapts grid layout for specs
- Images maintain aspect ratios with `aspect-video`

### 4. Accessibility
- Button elements have proper semantic HTML
- Icons paired with text labels
- Form inputs have proper labels
- Keyboard navigation supported

---

## Migration Guide

### From Old Components
1. Replace `<button>` with `<CTAButton>`
2. Replace product cards with `<CarCard>`
3. Replace filter panels with `<FilterSidebar>`
4. Replace spec grids with `<SpecsGrid>`

### Pages to Update
- [ ] ExplorePage: Use CarCard (compact) in grid, add FilterSidebar
- [ ] Car detail pages: Use CarCard (full) with SpecsGrid
- [ ] HomePage: Use CarCard (compact) in featured sections, CTAButton for CTAs
- [ ] Search results: Use CarCard (compact) with FilterSidebar
- [ ] Admin panel: Use CTAButton for actions

---

## Future Enhancements

- [ ] Add compare functionality to CarCard
- [ ] Implement image lazy loading for thumbnails
- [ ] Add advanced filtering with date ranges
- [ ] Create mobile-optimized view for FilterSidebar
- [ ] Add animation presets for section reveals
- [ ] Implement dark/light theme toggle (currently dark only)
- [ ] Create storybook documentation
