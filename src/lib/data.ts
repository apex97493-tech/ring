import storedProductsStore from './products-store.json';

export type ProductVariant = {
  metal: string;
  colorCode: string;
  image: string;
  priceModifier?: number;
  price?: number;
  originalPrice?: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  shape: 'Round' | 'Oval' | 'Emerald' | 'Radiant' | 'Cushion' | 'Pear' | 'Princess' | 'Marquise' | 'Heart' | 'Hexagon';
  price: number; // Discounted Selling Price
  originalPrice: number; // MRP
  carat: string;
  clarity: string;
  colorGrade: string;
  cut: string;
  certification: string;
  badge?: 'BESTSELLER' | 'VVS1 D-COLOR' | 'LIMITED EDITION' | '50% OFF' | 'NEW ARRIVAL' | 'STACKING BAND' | string;
  rating: number;
  reviewsCount: number;
  metal: string;
  variants: ProductVariant[];
  images: string[];
  description: string;
  features: string[];
  readyToShip: boolean;
  primaryGemstone?: string;
  secondaryGemstone?: string;
  ringStyle?: string;
  occasion?: string;
  deliveryTime?: string;
  sku?: string;
  stockStatus?: 'in_stock' | 'made_to_order' | 'low_stock' | 'out_of_stock' | string;
  stockQuantity?: number;
  metaTitle?: string;
  metaDescription?: string;
  isFeatured?: boolean;
  grossWeight?: string;
  karatage?: string;
  materialColor?: string;
  diamondType?: string;
  diamondColor?: string;
  diamondClarity?: string;
  settingStyle?: string;
  prepaidDiscountNote?: string;
  bespokeNotice?: string;
  itemDetails?: Record<string, string>;
  tags?: string[];
};

export const SHAPES = [
  { name: 'All Shapes', value: 'all', shapeType: 'all' },
  { name: 'Round', value: 'Round', shapeType: 'round' },
  { name: 'Oval', value: 'Oval', shapeType: 'oval' },
  { name: 'Emerald', value: 'Emerald', shapeType: 'emerald' },
  { name: 'Radiant', value: 'Radiant', shapeType: 'radiant' },
  { name: 'Cushion', value: 'Cushion', shapeType: 'cushion' },
  { name: 'Pear', value: 'Pear', shapeType: 'pear' },
  { name: 'Princess', value: 'Princess', shapeType: 'princess' },
  { name: 'Marquise', value: 'Marquise', shapeType: 'marquise' },
  { name: 'Hexagon', value: 'Hexagon', shapeType: 'hexagon' },
] as const;

export const METALS = [
  { name: '925 Sterling Silver', color: '#E2E8F0', hex: '#E2E8F0' },
  { name: '18K Yellow Gold Plated', color: '#EAB308', hex: '#EAB308' },
  { name: '18K Rose Gold Plated', color: '#FB7185', hex: '#FB7185' },
  { name: '18K Solid White Gold', color: '#F1F5F9', hex: '#F1F5F9' },
  { name: '18K Solid Yellow Gold', color: '#CA8A04', hex: '#CA8A04' },
];

const baseCatalogProducts: Product[] = (storedProductsStore as unknown as Product[]) || [];

// Helper to deduplicate and merge stored products (from admin edits) with base catalog
function mergeCatalogWithStore(baseList: Product[], storedList: Product[]): Product[] {
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const merged: Product[] = [];

  // Prioritize stored products (admin created/modified)
  for (const item of (storedList || [])) {
    if (!item || !item.id) continue;
    if (seenIds.has(item.id) || (item.slug && seenSlugs.has(item.slug))) continue;
    seenIds.add(item.id);
    if (item.slug) seenSlugs.add(item.slug);
    merged.push(item);
  }

  // Fallback to base products
  for (const item of (baseList || [])) {
    if (!item || !item.id) continue;
    if (seenIds.has(item.id) || (item.slug && seenSlugs.has(item.slug))) continue;
    seenIds.add(item.id);
    if (item.slug) seenSlugs.add(item.slug);
    merged.push(item);
  }

  return merged;
}

export const products: Product[] = mergeCatalogWithStore(
  baseCatalogProducts,
  storedProductsStore as Product[]
);

function isOneEditAway(s1: string, s2: string): boolean {
  if (Math.abs(s1.length - s2.length) > 1) return false;
  let edits = 0, i = 0, j = 0;
  while (i < s1.length && j < s2.length) {
    if (s1[i] !== s2[j]) {
      edits++;
      if (edits > 1) return false;
      if (s1.length > s2.length) i++;
      else if (s2.length > s1.length) j++;
      else { i++; j++; }
    } else {
      i++; j++;
    }
  }
  return true;
}

export function findMatchingProduct(productList: Product[], query: string): Product | undefined {
  if (!query || !productList || productList.length === 0) return undefined;
  const cleanQuery = decodeURIComponent(query).trim().toLowerCase();

  // 1. Direct slug match
  const exactSlug = productList.find((p) => p.slug?.toLowerCase() === cleanQuery);
  if (exactSlug) return exactSlug;

  // 2. Direct ID match
  const exactId = productList.find((p) => p.id?.toLowerCase() === cleanQuery);
  if (exactId) return exactId;

  // 3. Normalized slug (ignoring hyphens, underscores, spaces)
  const normQuery = cleanQuery.replace(/[^a-z0-9]/g, '');
  const normMatch = productList.find(
    (p) =>
      (p.slug && p.slug.toLowerCase().replace(/[^a-z0-9]/g, '') === normQuery) ||
      (p.id && p.id.toLowerCase().replace(/[^a-z0-9]/g, '') === normQuery)
  );
  if (normMatch) return normMatch;

  // 4. Token / Fuzzy match for slight typos (e.g., engagermnet vs engagemnet)
  const queryTokens = cleanQuery.split(/[^a-z0-9]+/).filter((t) => t.length > 2);
  if (queryTokens.length > 0) {
    let bestScore = 0;
    let bestMatch: Product | undefined = undefined;

    for (const p of productList) {
      const pSlugTokens = (p.slug || '').toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 2);
      const pNameTokens = (p.name || '').toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 2);
      const targetTokens = new Set([...pSlugTokens, ...pNameTokens]);

      let matchCount = 0;
      for (const qToken of queryTokens) {
        if (targetTokens.has(qToken)) {
          matchCount++;
        } else {
          for (const tToken of targetTokens) {
            if (
              Math.abs(tToken.length - qToken.length) <= 2 &&
              (tToken.includes(qToken) || qToken.includes(tToken) || isOneEditAway(tToken, qToken))
            ) {
              matchCount += 0.8;
              break;
            }
          }
        }
      }

      const score = matchCount / queryTokens.length;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = p;
      }
    }

    if (bestScore >= 0.6 && bestMatch) {
      return bestMatch;
    }
  }

  return undefined;
}

export function getProductsByCategory(category: string): Product[] {
  const cat = (category || '').toLowerCase().trim();
  if (!cat || cat === 'all' || cat === 'shop') return products;

  return products.filter((p) => {
    const pCat = (p.category || '').toLowerCase().trim();
    if (pCat === cat) return true;
    if (cat === 'rings' && (pCat === 'ring' || pCat === 'rings')) return true;
    if (cat === 'band' && (pCat === 'band' || pCat === 'bands')) return true;
    if (cat === 'earrings' && (pCat === 'earring' || pCat === 'earrings')) return true;
    if ((cat === 'necklace' || cat === 'pendant') && (pCat === 'necklace' || pCat === 'pendant')) return true;
    if (cat === 'ring-set' && (pCat === 'ring-set' || pCat === 'ring-sets' || pCat === 'bridal-set')) return true;
    if (cat === 'lesbian-ring' && (pCat === 'lesbian-ring' || pCat === 'lesbian-rings')) return true;
    if (cat === 'bracelet' && (pCat === 'bracelet' || pCat === 'bracelets')) return true;
    if (cat === 'nose-ring' && (pCat === 'nose-ring' || pCat === 'nose-rings')) return true;
    if (cat === 'belly-rings' && (pCat === 'belly-rings' || pCat === 'belly-ring')) return true;
    return false;
  });
}

export function getProductBySlug(slug: string): Product | undefined {
  return findMatchingProduct(products, slug);
}
