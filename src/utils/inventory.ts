import type { Car } from '@/types/car';

export const BODY_STYLES = [
  'Coupe',
  'Convertible',
  'SUV',
  'Sedan',
  'Hatchback',
  'Pickup',
  'Van',
] as const;

export type BodyStyle = (typeof BODY_STYLES)[number];

const BODY_STYLE_RULES: Array<[BodyStyle, string[]]> = [
  ['Pickup', ['hardbody', 'np300', 'f-150', 'f150', 'ranger', 'hilux', 'navara', 'tacoma', 'silverado', 'frontier', 'ridgeline', 'pickup', 'truck']],
  ['Van', ['voxy', 'noah', 'hiace', 'sienna', 'alphard', 'caravan', 'transit', 'odyssey', 'van']],
  ['Convertible', ['convertible', 'cabrio', 'roadster', 'spider', 'spyder']],
  ['Coupe', ['coupe', 'mustang', 'camaro', 'challenger', 'gt86', 'brz', 'supra']],
  ['SUV', ['cr-v', 'crv', 'rav4', 'rdx', 'mdx', 'santa fe', 'outlander', 'pajero', 'xtrail', 'x-trail', 'hr-v', 'hrv', 's06', 's07', 'highlander', 'fortuner', 'prado', 'land cruiser', 'landcruiser', 'tucson', 'sportage', 'cx-5', 'cx5', 'rogue', 'escape', 'explorer', 'murano', 'edge', 'terrain', 'equinox', 'forester', 'cherokee', 'tiguan', 'sorento', 'pilot', 'passport', 'suv', '4runner', 'sequoia', 'tahoe']],
  ['Hatchback', ['hatchback', 'golf', 'yaris', 'fit', 'jazz', 'vitz', 'march', 'demio', 'note', 'polo', 'swift']],
  ['Sedan', ['civic', 'accord', 'camry', 'corolla', 'altima', 'sentra', 'elantra', 'sonata', 'jetta', 'passat', 'mazda3', 'optima', 'avalon', 'maxima', 'sedan', 'legend', 'tsx', 'tlx']],
];

export function inferBodyStyle(car: Pick<Car, 'model' | 'description'>): BodyStyle | null {
  const explicit = (car as Record<string, any>).bodyStyle ?? (car as Record<string, any>).body_style;
  if (typeof explicit === 'string' && explicit.trim()) {
    const match = BODY_STYLES.find((style) => style.toLowerCase() === explicit.trim().toLowerCase());
    if (match) return match;
  }

  const haystack = `${car.model ?? ''} ${car.description ?? ''}`.toLowerCase();
  for (const [style, keywords] of BODY_STYLE_RULES) {
    if (keywords.some((keyword) => haystack.includes(keyword))) return style;
  }
  return null;
}

const ACRONYMS = new Set(['bmw', 'mg', 'vw', 'gmc', 'ram', 'kia', 'byd', 'gac', 'faw']);

function titleCase(value: string): string {
  return value
    .toLowerCase()
    .split(/(\s|-)/)
    .map((part) => (/^[a-z]/.test(part) ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join('');
}

export function displayName(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  if (ACRONYMS.has(trimmed.toLowerCase())) return trimmed.toUpperCase();
  const isSingleCase = trimmed === trimmed.toUpperCase() || trimmed === trimmed.toLowerCase();
  return isSingleCase ? titleCase(trimmed) : trimmed;
}

function pickVariant(variants: string[]): string {
  const mixed = variants.find(
    (variant) => variant !== variant.toUpperCase() && variant !== variant.toLowerCase()
  );
  return displayName(mixed ?? variants[0]);
}

export interface InventoryFacets {
  brands: string[];
  modelsByBrand: Record<string, string[]>;
  bodyStyles: BodyStyle[];
  transmissions: string[];
  conditions: string[];
  maxPrice: number;
}

export function deriveFacets(cars: Car[]): InventoryFacets {
  const brandVariants = new Map<string, string[]>();
  const modelVariants = new Map<string, Map<string, string[]>>();
  const bodyStyles = new Set<BodyStyle>();
  const transmissions = new Set<string>();
  const conditions = new Set<string>();
  let maxPrice = 0;

  cars.forEach((car) => {
    const brand = (car.brand ?? '').trim();
    if (brand) {
      const key = brand.toLowerCase();
      if (!brandVariants.has(key)) brandVariants.set(key, []);
      brandVariants.get(key)!.push(brand);

      const model = (car.model ?? '').trim();
      if (model) {
        if (!modelVariants.has(key)) modelVariants.set(key, new Map());
        const models = modelVariants.get(key)!;
        const modelKey = model.toLowerCase();
        if (!models.has(modelKey)) models.set(modelKey, []);
        models.get(modelKey)!.push(model);
      }
    }

    const style = inferBodyStyle(car);
    if (style) bodyStyles.add(style);
    if (car.transmission) transmissions.add(displayName(car.transmission));
    if (car.condition) conditions.add(car.condition);
    if (typeof car.price === 'number' && car.price > maxPrice) maxPrice = car.price;
  });

  const brands = [...brandVariants.entries()]
    .map(([, variants]) => pickVariant(variants))
    .sort((a, b) => a.localeCompare(b));

  const modelsByBrand: Record<string, string[]> = {};
  modelVariants.forEach((models, brandKey) => {
    const brandLabel = pickVariant(brandVariants.get(brandKey) ?? [brandKey]);
    modelsByBrand[brandLabel] = [...models.entries()]
      .map(([, variants]) => pickVariant(variants))
      .sort((a, b) => a.localeCompare(b));
  });

  return {
    brands,
    modelsByBrand,
    bodyStyles: BODY_STYLES.filter((style) => bodyStyles.has(style)),
    transmissions: [...transmissions].sort(),
    conditions: [...conditions].sort(),
    maxPrice: maxPrice > 0 ? Math.ceil(maxPrice / 50000) * 50000 : 500000,
  };
}
