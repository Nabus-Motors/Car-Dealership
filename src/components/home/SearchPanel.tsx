import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Search } from 'lucide-react';
import type { InventoryFacets } from '@utils/inventory';

const MIN_PRICE = 20_000;
const MAX_PRICE = 2_000_000;

const clampPrice = (value: number) => Math.min(Math.max(value, MIN_PRICE), MAX_PRICE);

interface SearchPanelProps {
  facets: InventoryFacets;
  loading?: boolean;
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
  disabled?: boolean;
}

function SelectField({ label, value, onChange, placeholder, options, disabled }: FieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="eyebrow text-white/60">{label}</span>
      <span className="relative block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          className="h-[46px] w-full appearance-none border border-white/15 bg-white/[0.04] px-4 pr-10 text-sm text-white outline-none transition-colors focus:border-[var(--accent-solid)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option} className="bg-[#1C2124] text-white">
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
      </span>
    </label>
  );
}

export default function SearchPanel({ facets, loading = false }: SearchPanelProps) {
  const navigate = useNavigate();
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [bodyStyle, setBodyStyle] = useState('');
  const [condition, setCondition] = useState('');
  const [transmission, setTransmission] = useState('');
  const [minPrice, setMinPrice] = useState(MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(() => clampPrice(facets.maxPrice));
  const priceTouched = useRef(false);

  useEffect(() => {
    if (!priceTouched.current) setMaxPrice(clampPrice(facets.maxPrice));
  }, [facets.maxPrice]);

  const models = useMemo(
    () => (make ? facets.modelsByBrand[make] ?? [] : []),
    [make, facets.modelsByBrand]
  );

  const handleMakeChange = (value: string) => {
    setMake(value);
    setModel('');
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (make) params.set('brand', make);
    if (model) params.set('model', model);
    if (bodyStyle) params.set('body_style', bodyStyle);
    if (condition) params.set('condition', condition);
    if (transmission) params.set('transmission', transmission);
    if (minPrice > MIN_PRICE) params.set('min_price', String(minPrice));
    if (maxPrice) params.set('max_price', String(maxPrice));
    navigate(`/explore?${params.toString()}`);
  };

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      maximumFractionDigits: 0,
    }).format(value);

  const rangeThumbClass =
    '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent-solid)] [&::-webkit-slider-thumb]:shadow-[0_0_0_3px_rgba(17,17,17,0.45)] [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[var(--accent-solid)] [&::-moz-range-thumb]:shadow-[0_0_0_3px_rgba(17,17,17,0.45)]';

  return (
    <section className="relative z-20 w-full ">
      <div className="shell -mt-16 md:-mt-20">
        <div className="chamfer-tl bg-[linear-gradient(105deg,#2E3438_0%,#22282B_55%,#191E21_100%)] p-6 shadow-[0_24px_60px_rgba(17,17,17,0.35)] md:p-10">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <SelectField
              label="Select Make"
              value={make}
              onChange={handleMakeChange}
              placeholder={loading ? 'Loading…' : 'Any Make'}
              options={facets.brands}
              disabled={loading}
            />
            <SelectField
              label="Select Model"
              value={model}
              onChange={setModel}
              placeholder={make ? 'Any Model' : 'Select a make first'}
              options={models}
              disabled={loading || !make}
            />
            <SelectField
              label="Select Body Style"
              value={bodyStyle}
              onChange={setBodyStyle}
              placeholder="Any Body Style"
              options={[...facets.bodyStyles]}
              disabled={loading}
            />
            <SelectField
              label="Select Condition"
              value={condition}
              onChange={setCondition}
              placeholder="Any Condition"
              options={facets.conditions}
              disabled={loading}
            />
            <SelectField
              label="Select Transmission"
              value={transmission}
              onChange={setTransmission}
              placeholder="Any Transmission"
              options={facets.transmissions}
              disabled={loading}
            />

            <label className="flex flex-col gap-2">
              <span className="eyebrow text-white/60">
                Price{' '}
                <span className="text-[var(--accent-light)]">
                  {formatPrice(minPrice)} – {formatPrice(maxPrice)}
                </span>
              </span>
              <span className="relative flex h-[46px] items-center">
                <span className="pointer-events-none absolute inset-x-0 h-[3px] w-full bg-white/20">
                  <span
                    className="absolute h-full bg-[var(--accent-solid)]"
                    style={{
                      left: `${((minPrice - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`,
                      right: `${100 - ((maxPrice - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`,
                    }}
                  />
                </span>
                <input
                  type="range"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  step={10000}
                  value={minPrice}
                  onChange={(event) => {
                    priceTouched.current = true;
                    setMinPrice(Math.min(Number(event.target.value), maxPrice - 10000));
                  }}
                  aria-label="Minimum price"
                  className={`pointer-events-none absolute inset-x-0 h-[3px] w-full cursor-pointer appearance-none bg-transparent ${rangeThumbClass}`}
                />
                <input
                  type="range"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  step={10000}
                  value={maxPrice}
                  onChange={(event) => {
                    priceTouched.current = true;
                    setMaxPrice(Math.max(Number(event.target.value), minPrice + 10000));
                  }}
                  aria-label="Maximum price"
                  className={`pointer-events-none absolute inset-x-0 z-10 h-[3px] w-full cursor-pointer appearance-none bg-transparent ${rangeThumbClass}`}
                />
              </span>
            </label>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-white/45">
              {make && models.length > 0
                ? `${models.length} model${models.length === 1 ? '' : 's'} available for ${make}`
                : 'Narrow by make to unlock models'}
            </p>
            <button onClick={handleSearch} className="btn-accent gap-2">
              <Search className="h-4 w-4" />
              Search Inventory
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
