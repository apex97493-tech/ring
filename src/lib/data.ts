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
  { name: 'Pear', value: 'Pear', shapeType: 'pear' },
  { name: 'Emerald', value: 'Emerald', shapeType: 'emerald' },
  { name: 'Round', value: 'Round', shapeType: 'round' },
  { name: 'Oval', value: 'Oval', shapeType: 'oval' },
  { name: 'Marquise', value: 'Marquise', shapeType: 'marquise' },
  { name: 'Cushion', value: 'Cushion', shapeType: 'cushion' },
  { name: 'Princess', value: 'Princess', shapeType: 'princess' },
  { name: 'Heart', value: 'Heart', shapeType: 'heart' },
  { name: 'Radiant', value: 'Radiant', shapeType: 'radiant' },
  { name: 'Asscher', value: 'Asscher', shapeType: 'asscher' },
  { name: 'Trillion', value: 'Trillion', shapeType: 'trillion' },
  { name: 'Baguette', value: 'Baguette', shapeType: 'baguette' },
] as const;

export const METALS = [
  { name: '925 Sterling Silver', color: '#E2E8F0', hex: '#E2E8F0' },
  { name: '18K Yellow Gold Plated', color: '#EAB308', hex: '#EAB308' },
  { name: '18K Rose Gold Plated', color: '#FB7185', hex: '#FB7185' },
  { name: '18K Solid White Gold', color: '#F1F5F9', hex: '#F1F5F9' },
  { name: '18K Solid Yellow Gold', color: '#CA8A04', hex: '#CA8A04' },
];

/**
 * Standard metal pricing tiers — additive premium over the 925 Sterling Silver base price.
 *
 * PREMIUM MODEL (verified from 4 real Etsy listings):
 *   Gold Overlay = base price (same as silver — it's just plating)
 *   10k solid gold = base + ₹35,000  (avg of real data: ₹33,561–₹35,816)
 *   14k solid gold = base + ₹52,000  (avg of real data: ₹48,589–₹55,852)
 *   18k solid gold = base + ₹68,000  (avg of real data: ₹66,071–₹71,380)
 *
 * For products with KNOWN exact Etsy prices, see PRODUCT_METAL_PRICES below.
 */
export const STANDARD_METAL_TIERS: {
  metal: string;
  colorCode: string;
  priceAddon: number; // ₹ added to the product's 925 Silver base price
  group: string;
}[] = [
  // ── 925 Sterling Silver ────────────────────────────────────────────────────
  { metal: '925 Sterling Silver',  colorCode: '#C0C5CE', priceAddon: 0,      group: 'Silver'       },
  // ── Gold Overlay — same price as silver (gold-plated, not solid) ──────────
  { metal: 'Yellow Gold Overlay',  colorCode: '#D4AF37', priceAddon: 0,      group: 'Gold Overlay' },
  { metal: 'Rose Gold Overlay',    colorCode: '#E8927C', priceAddon: 0,      group: 'Gold Overlay' },
  { metal: 'White Gold Overlay',   colorCode: '#E5E7EB', priceAddon: 0,      group: 'Gold Overlay' },
  // ── 9k Solid Gold (Verified directly from live Etsy shop) ───────────────────
  { metal: '9k Yellow Gold',       colorCode: '#C8A951', priceAddon: 33461,  group: '9k Gold'      },
  { metal: '9k Rose Gold',         colorCode: '#D4826A', priceAddon: 33461,  group: '9k Gold'      },
  { metal: '9k White Gold',        colorCode: '#B8BEC7', priceAddon: 33461,  group: '9k Gold'      },
  // ── 10k Solid Gold (Verified directly from live Etsy shop) ──────────────────
  { metal: '10k Yellow Gold',      colorCode: '#C8A951', priceAddon: 35000,  group: '10k Gold'     },
  { metal: '10k Rose Gold',        colorCode: '#D4826A', priceAddon: 35000,  group: '10k Gold'     },
  { metal: '10k White Gold',       colorCode: '#B8BEC7', priceAddon: 35000,  group: '10k Gold'     },
  // ── 14k Solid Gold (Verified directly from live Etsy shop) ──────────────────
  { metal: '14k Yellow Gold',      colorCode: '#CA8A04', priceAddon: 48489,  group: '14k Gold'     },
  { metal: '14k Rose Gold',        colorCode: '#E0796A', priceAddon: 48489,  group: '14k Gold'     },
  { metal: '14k White Gold',       colorCode: '#CBD5E1', priceAddon: 48489,  group: '14k Gold'     },
  // ── 18k Solid Gold (Verified directly from live Etsy shop) ──────────────────
  { metal: '18k Yellow Gold',      colorCode: '#B8860B', priceAddon: 66021,  group: '18k Gold'     },
  { metal: '18k Rose Gold',        colorCode: '#C97B6E', priceAddon: 66021,  group: '18k Gold'     },
  { metal: '18k White Gold',       colorCode: '#94A3B8', priceAddon: 66021,  group: '18k Gold'     },
];

/**
 * EXACT per-product metal prices — sourced directly from Etsy listings.
 * These override STANDARD_METAL_TIERS for the listed product IDs.
 *
 * How to add more: visit the Etsy listing, open the Band colour dropdown,
 * note each option's price, and add an entry here keyed by Etsy product ID.
 */
export const PRODUCT_METAL_PRICES: Record<string, Record<string, number>> = {
  // ── Marquise Garnet Ring, Gold Solitaire Ring, January (base ₹5,873) ──
  'fjws-4543731568': {
    '925 Sterling Silver': 5873,  'Yellow Gold Overlay': 5873,  'Rose Gold Overlay': 5873,  'White Gold Overlay': 5873,
    '9k Yellow Gold': 40674, '9k Rose Gold': 40674, '9k White Gold': 40674,
    '14k Yellow Gold': 57555, '14k Rose Gold': 57555, '14k White Gold': 57555,
    '18k Yellow Gold': 76589, '18k Rose Gold': 76589, '18k White Gold': 76589,
  },

  // ── Vintage Oval Cut Green Moss Agate Engagement Ring, (base ₹4,007) ──
  'fjws-4540708656': {
    '925 Sterling Silver': 4007,  'Yellow Gold Overlay': 4007,  'Rose Gold Overlay': 4007,  'White Gold Overlay': 4007,
    '9k Yellow Gold': 39572, '9k Rose Gold': 39572, '9k White Gold': 39572,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 70078, '18k Rose Gold': 70078, '18k White Gold': 70078,
  },

  // ── Marquise Moissanite Wedding Band, Alternating Marq (base ₹6,512) ──
  'fjws-4541866227': {
    '925 Sterling Silver': 6512,  'Yellow Gold Overlay': 6512,  'Rose Gold Overlay': 6512,  'White Gold Overlay': 6512,
    '9k Yellow Gold': 42828, '9k Rose Gold': 42828, '9k White Gold': 42828,
    '14k Yellow Gold': 60109, '14k Rose Gold': 60109, '14k White Gold': 60109,
    '18k Yellow Gold': 80146, '18k Rose Gold': 80146, '18k White Gold': 80146,
  },

  // ── Oval Blue Sapphire Necklace, September Birthstone  (base ₹9,517) ──
  'fjws-4528357827': {
    '925 Sterling Silver': 9517,  'Yellow Gold Overlay': 9517,  'Rose Gold Overlay': 9517,  'White Gold Overlay': 9517,
  },

  // ── 3.00 CT Elongated Hexagon Cut Moissanite Engagemen (base ₹5,009) ──
  'fjws-4516201092': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '9k Yellow Gold': 41075, '9k Rose Gold': 41075, '9k White Gold': 41075,
    '14k Yellow Gold': 60109, '14k Rose Gold': 60109, '14k White Gold': 60109,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── 2.5ct Oval Cut Moissanite Ring, Petite Three Stone (base ₹4,759) ──
  'fjws-4511452038': {
    '925 Sterling Silver': 4759,  'Yellow Gold Overlay': 4759,  'Rose Gold Overlay': 4759,  'White Gold Overlay': 4759,
    '9k Yellow Gold': 40323, '9k Rose Gold': 40323, '9k White Gold': 40323,
    '14k Yellow Gold': 60109, '14k Rose Gold': 60109, '14k White Gold': 60109,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Oval Moissanite Engagement Ring: 14k Gold Solitair (base ₹4,258) ──
  'fjws-4512512598': {
    '925 Sterling Silver': 4258,  'Yellow Gold Overlay': 4258,  'Rose Gold Overlay': 4258,  'White Gold Overlay': 4258,
    '9k Yellow Gold': 39572, '9k Rose Gold': 39572, '9k White Gold': 39572,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 75137,
    '18k Yellow Gold': 70128, '18k Rose Gold': 70128, '18k White Gold': 70128,
  },

  // ── 2.5CT Emerald Cut Moissanite Engagement Ring 14K Y (base ₹4,508) ──
  'fjws-4512507960': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '9k Yellow Gold': 39322, '9k Rose Gold': 39322, '9k White Gold': 39322,
    '14k Yellow Gold': 57605, '14k Rose Gold': 57605, '14k White Gold': 57605,
    '18k Yellow Gold': 72632, '18k Rose Gold': 72632, '18k White Gold': 72632,
  },

  // ── 14K Solid Gold Moss Agate with Moissanite Ring, So (base ₹6,211) ──
  'fjws-4522682939': {
    '925 Sterling Silver': 6211,  'Yellow Gold Overlay': 6211,  'Rose Gold Overlay': 6211,  'White Gold Overlay': 6211,
  },

  // ── Green Onyx Engagement Ring, Oval Cut 3 Stone Ring, (base ₹4,508) ──
  'fjws-4527185846': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '9k Yellow Gold': 39071, '9k Rose Gold': 39071, '9k White Gold': 39071,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── 2CT Emerald Cut Moissanite Engagement Ring, Hidden (base ₹4,859) ──
  'fjws-4514456821': {
    '925 Sterling Silver': 4859,  'Yellow Gold Overlay': 4859,  'Rose Gold Overlay': 4859,  'White Gold Overlay': 4859,
    '9k Yellow Gold': 40123, '9k Rose Gold': 40123, '9k White Gold': 40123,
    '14k Yellow Gold': 59057, '14k Rose Gold': 59057, '14k White Gold': 59057,
    '18k Yellow Gold': 76589, '18k Rose Gold': 76589, '18k White Gold': 76589,
  },

  // ── 14k Gold Holding Lesbian Ring, Sculptural Couple K (base ₹5,510) ──
  'fjws-4522222080': {
    '925 Sterling Silver': 5510,  'Yellow Gold Overlay': 5510,  'Rose Gold Overlay': 5510,  'White Gold Overlay': 5510,
    '9k Yellow Gold': 41325, '9k Rose Gold': 41325, '9k White Gold': 41325,
    '14k Yellow Gold': 60109, '14k Rose Gold': 60109, '14k White Gold': 60109,
    '18k Yellow Gold': 77641, '18k Rose Gold': 77641, '18k White Gold': 75137,
  },

  // ── Natural Moonstone Ring, Emerald Cut Moonstone Ring (base ₹4,508) ──
  'fjws-4516208711': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '9k Yellow Gold': 35064, '9k Rose Gold': 35064, '9k White Gold': 35064,
    '14k Yellow Gold': 60159, '14k Rose Gold': 60159, '14k White Gold': 60159,
    '18k Yellow Gold': 75187, '18k Rose Gold': 75187, '18k White Gold': 75187,
  },

  // ── Pink Star Necklace, Rose Gold Star Pendant, Pink S (base ₹6,011) ──
  'fjws-4520648608': {
    '925 Sterling Silver': 6011,  'Yellow Gold Overlay': 6011,  'Rose Gold Overlay': 6011,  'White Gold Overlay': 6011,
  },

  // ── Custom listing For Scarlet (base ₹60,109) ──
  'fjws-1673179016': {
    '925 Sterling Silver': 60109,  'Yellow Gold Overlay': 60109,  'Rose Gold Overlay': 60109,  'White Gold Overlay': 60109,
  },

  // ── Product (base ₹106,013) ──
  'fjws-1648882902': {
    '925 Sterling Silver': 106013,  'Yellow Gold Overlay': 106013,  'Rose Gold Overlay': 106013,  'White Gold Overlay': 106013,
  },

  // ── Product (base ₹15,204) ──
  'fjws-1704809212': {
    '925 Sterling Silver': 15204,  'Yellow Gold Overlay': 15204,  'Rose Gold Overlay': 15204,  'White Gold Overlay': 15204,
  },

  // ── Product (base ₹16,430) ──
  'fjws-4305665956': {
    '925 Sterling Silver': 16430,  'Yellow Gold Overlay': 16430,  'Rose Gold Overlay': 16430,  'White Gold Overlay': 16430,
  },

  // ── 14k & 18k Solid Gold Engraved Signet Ring, Custom  (base ₹4,909) ──
  'fjws-4574629638': {
    '925 Sterling Silver': 4909,  'Yellow Gold Overlay': 4909,  'Rose Gold Overlay': 4909,  'White Gold Overlay': 4909,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Natural Opal 14k Gold Ring,Oval Engagement Ring,Di (base ₹4,508) ──
  'fjws-4574610777': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '9k Yellow Gold': 39021, '9k Rose Gold': 39021, '9k White Gold': 39021,
    '14k Yellow Gold': 54098, '14k Rose Gold': 54098, '14k White Gold': 54098,
    '18k Yellow Gold': 74135, '18k Rose Gold': 74135, '18k White Gold': 74135,
  },

  // ── Crescent Moon Larimar Ring Gold Celestial Ring Blu (base ₹4,508) ──
  'fjws-4518922734': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '9k Yellow Gold': 37067, '9k Rose Gold': 37067, '9k White Gold': 37067,
    '14k Yellow Gold': 60109, '14k Rose Gold': 60109, '14k White Gold': 60109,
    '18k Yellow Gold': 74135, '18k Rose Gold': 74135, '18k White Gold': 74135,
  },

  // ── Ruby Heart Necklace Gold, Red Gemstone Heart Penda (base ₹7,514) ──
  'fjws-4574074009': {
    '925 Sterling Silver': 7514,  'Yellow Gold Overlay': 7514,  'Rose Gold Overlay': 7514,  'White Gold Overlay': 7514,
  },

  // ── Pear Moissanite East West Pinky Ring, 14K Gold 1.2 (base ₹4,508) ──
  'fjws-4574067995': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '9k Yellow Gold': 39572, '9k Rose Gold': 39572, '9k White Gold': 39572,
    '14k Yellow Gold': 55050, '14k Rose Gold': 55050, '14k White Gold': 55050,
    '18k Yellow Gold': 74636, '18k Rose Gold': 74636, '18k White Gold': 74636,
  },

  // ── Elegant Oval Moissanite Bezel Set Engagement Ring  (base ₹4,107) ──
  'fjws-4574063413': {
    '925 Sterling Silver': 4107,  'Yellow Gold Overlay': 4107,  'Rose Gold Overlay': 4107,  'White Gold Overlay': 4107,
    '9k Yellow Gold': 39071, '9k Rose Gold': 39071, '9k White Gold': 39071,
    '14k Yellow Gold': 54599, '14k Rose Gold': 54599, '14k White Gold': 54599,
    '18k Yellow Gold': 74135, '18k Rose Gold': 74135, '18k White Gold': 74135,
  },

  // ── Natural Moonstone Rectangle Bar Ring, 18K Gold Fil (base ₹4,007) ──
  'fjws-4574074680': {
    '925 Sterling Silver': 4007,  'Yellow Gold Overlay': 4007,  'Rose Gold Overlay': 4007,  'White Gold Overlay': 4007,
    '9k Yellow Gold': 38069, '9k Rose Gold': 38069, '9k White Gold': 38069,
    '14k Yellow Gold': 54599, '14k Rose Gold': 54599, '14k White Gold': 54599,
    '18k Yellow Gold': 74135, '18k Rose Gold': 74135, '18k White Gold': 74135,
  },

  // ── Silver Marquise Moissanite Wedding Band, Leaf Desi (base ₹4,007) ──
  'fjws-4573888100': {
    '925 Sterling Silver': 4007,  'Yellow Gold Overlay': 4007,  'Rose Gold Overlay': 4007,  'White Gold Overlay': 4007,
    '9k Yellow Gold': 38069, '9k Rose Gold': 38069, '9k White Gold': 38069,
    '14k Yellow Gold': 54098, '14k Rose Gold': 54098, '14k White Gold': 54098,
    '18k Yellow Gold': 74135, '18k Rose Gold': 74135, '18k White Gold': 74135,
  },

  // ── Opal Pendant Necklace, White Opal Necklace, Octobe (base ₹9,517) ──
  'fjws-4528371848': {
    '925 Sterling Silver': 9517,  'Yellow Gold Overlay': 9517,  'Rose Gold Overlay': 9517,  'White Gold Overlay': 9517,
  },

  // ── Opal Ring, Vintage Opal Band, Opal Wedding Band, 1 (base ₹4,258) ──
  'fjws-4573123295': {
    '925 Sterling Silver': 4258,  'Yellow Gold Overlay': 4258,  'Rose Gold Overlay': 4258,  'White Gold Overlay': 4258,
    '9k Yellow Gold': 39071, '9k Rose Gold': 39071, '9k White Gold': 39071,
    '14k Yellow Gold': 55050, '14k Rose Gold': 55050, '14k White Gold': 55050,
    '18k Yellow Gold': 74135, '18k Rose Gold': 74135, '18k White Gold': 74135,
  },

  // ── Vintage Oval Moonstone Ring 14K Solid Gold Moonsto (base ₹5,410) ──
  'fjws-4573119347': {
    '925 Sterling Silver': 5410,  'Yellow Gold Overlay': 5410,  'Rose Gold Overlay': 5410,  'White Gold Overlay': 5410,
    '9k Yellow Gold': 39572, '9k Rose Gold': 39572, '9k White Gold': 39572,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── 3CT Moissanite Ring, Three Stone Emerald Cut Moiss (base ₹4,258) ──
  'fjws-4573131096': {
    '925 Sterling Silver': 4258,  'Yellow Gold Overlay': 4258,  'Rose Gold Overlay': 4258,  'White Gold Overlay': 4258,
    '9k Yellow Gold': 38069, '9k Rose Gold': 38069, '9k White Gold': 38069,
    '14k Yellow Gold': 54098, '14k Rose Gold': 54098, '14k White Gold': 54098,
    '18k Yellow Gold': 74135, '18k Rose Gold': 74135, '18k White Gold': 74135,
  },

  // ── Vintage Green Sapphire Engagement Ring Set 14k Sol (base ₹11,020) ──
  'fjws-4573108363': {
    '925 Sterling Silver': 11020,  'Yellow Gold Overlay': 11020,  'Rose Gold Overlay': 11020,  'White Gold Overlay': 11020,
    '9k Yellow Gold': 61111, '9k Rose Gold': 61111, '9k White Gold': 61111,
    '14k Yellow Gold': 90164, '14k Rose Gold': 90164, '14k White Gold': 90164,
    '18k Yellow Gold': 110201, '18k Rose Gold': 110201, '18k White Gold': 110201,
  },

  // ── Marquise Cut Moissanite Engagement Ring With Diamo (base ₹6,011) ──
  'fjws-4558527928': {
    '925 Sterling Silver': 6011,  'Yellow Gold Overlay': 6011,  'Rose Gold Overlay': 6011,  'White Gold Overlay': 6011,
    '9k Yellow Gold': 43329, '9k Rose Gold': 43329, '9k White Gold': 43329,
    '14k Yellow Gold': 59108, '14k Rose Gold': 59108, '14k White Gold': 59108,
    '18k Yellow Gold': 78643, '18k Rose Gold': 78643, '18k White Gold': 78643,
  },

  // ── Vintage Marquise Cut Moissanite Engagement Ring Wo (base ₹4,759) ──
  'fjws-4571805480': {
    '925 Sterling Silver': 4759,  'Yellow Gold Overlay': 4759,  'Rose Gold Overlay': 4759,  'White Gold Overlay': 4759,
    '9k Yellow Gold': 39322, '9k Rose Gold': 39322, '9k White Gold': 39322,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── 1.5 Ct Oval Cut Moissanite Wedding Ring Set, Moiss (base ₹10,519) ──
  'fjws-4571794956': {
    '925 Sterling Silver': 10519,  'Yellow Gold Overlay': 10519,  'Rose Gold Overlay': 10519,  'White Gold Overlay': 10519,
    '9k Yellow Gold': 60059, '9k Rose Gold': 60059, '9k White Gold': 60059,
    '14k Yellow Gold': 89663, '14k Rose Gold': 89663, '14k White Gold': 89663,
    '18k Yellow Gold': 110201, '18k Rose Gold': 110201, '18k White Gold': 110201,
  },

  // ── Marquise Cut Moissanite Engagement Ring Set Unique (base ₹12,773) ──
  'fjws-4571792180': {
    '925 Sterling Silver': 12773,  'Yellow Gold Overlay': 12773,  'Rose Gold Overlay': 12773,  'White Gold Overlay': 12773,
    '9k Yellow Gold': 62614, '9k Rose Gold': 62614, '9k White Gold': 62614,
    '14k Yellow Gold': 91166, '14k Rose Gold': 91166, '14k White Gold': 91166,
    '18k Yellow Gold': 115210, '18k Rose Gold': 115210, '18k White Gold': 115210,
  },

  // ── 3CT Oval Cut Moissanite Engagement Ring, 14K Gold  (base ₹4,258) ──
  'fjws-4571767155': {
    '925 Sterling Silver': 4258,  'Yellow Gold Overlay': 4258,  'Rose Gold Overlay': 4258,  'White Gold Overlay': 4258,
    '9k Yellow Gold': 38069, '9k Rose Gold': 38069, '9k White Gold': 38069,
    '14k Yellow Gold': 54599, '14k Rose Gold': 54599, '14k White Gold': 54599,
    '18k Yellow Gold': 74636, '18k Rose Gold': 74636, '18k White Gold': 74636,
  },

  // ── Vintage 2CT,3CT Emerald Cut Moissanite Engagement  (base ₹4,007) ──
  'fjws-4571780220': {
    '925 Sterling Silver': 4007,  'Yellow Gold Overlay': 4007,  'Rose Gold Overlay': 4007,  'White Gold Overlay': 4007,
    '9k Yellow Gold': 37568, '9k Rose Gold': 37568, '9k White Gold': 37568,
    '14k Yellow Gold': 52546, '14k Rose Gold': 52546, '14k White Gold': 52546,
    '18k Yellow Gold': 69627, '18k Rose Gold': 69627, '18k White Gold': 69627,
  },

  // ── Hexagon Moissanite Engagement Ring, Rose Gold Beze (base ₹4,508) ──
  'fjws-4524443739': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '9k Yellow Gold': 39071, '9k Rose Gold': 39071, '9k White Gold': 39071,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 74135, '18k Rose Gold': 74135, '18k White Gold': 74135,
  },

  // ── Gold Christmas Tree Ring, Christmas Tree Jewelry,  (base ₹4,508) ──
  'fjws-4570538493': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '9k Yellow Gold': 39822, '9k Rose Gold': 39822, '9k White Gold': 39822,
    '14k Yellow Gold': 55852, '14k Rose Gold': 55852, '14k White Gold': 55852,
    '18k Yellow Gold': 76139, '18k Rose Gold': 76139, '18k White Gold': 76139,
  },

  // ── Gold Snowman Ring, Christmas Ring, Winter Gold Jew (base ₹4,909) ──
  'fjws-4570551322': {
    '925 Sterling Silver': 4909,  'Yellow Gold Overlay': 4909,  'Rose Gold Overlay': 4909,  'White Gold Overlay': 4909,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 56353, '14k Rose Gold': 56353, '14k White Gold': 56353,
    '18k Yellow Gold': 76389, '18k Rose Gold': 76389, '18k White Gold': 76389,
  },

  // ── Gold Floral Garnet Ring, Blue Sapphire Adjustable  (base ₹5,009) ──
  'fjws-4570546920': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '9k Yellow Gold': 39572, '9k Rose Gold': 39572, '9k White Gold': 39572,
    '14k Yellow Gold': 56102, '14k Rose Gold': 56102, '14k White Gold': 56102,
    '18k Yellow Gold': 76139, '18k Rose Gold': 76139, '18k White Gold': 76139,
  },

  // ── Pink Sapphire Ring, 925 Sterling Silver Handmade R (base ₹4,759) ──
  'fjws-4515655981': {
    '925 Sterling Silver': 4759,  'Yellow Gold Overlay': 4759,  'Rose Gold Overlay': 4759,  'White Gold Overlay': 4759,
    '9k Yellow Gold': 41325, '9k Rose Gold': 41325, '9k White Gold': 41325,
    '14k Yellow Gold': 62564, '14k Rose Gold': 62564, '14k White Gold': 62564,
    '18k Yellow Gold': 79595, '18k Rose Gold': 79595, '18k White Gold': 79595,
  },

  // ── Rose Quartz Marquise Engagement Ring, Vintage Side (base ₹5,009) ──
  'fjws-4568774604': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '9k Yellow Gold': 42577, '9k Rose Gold': 42577, '9k White Gold': 42577,
    '14k Yellow Gold': 65119, '14k Rose Gold': 65119, '14k White Gold': 65119,
    '18k Yellow Gold': 80146, '18k Rose Gold': 80146, '18k White Gold': 80146,
  },

  // ── Oval Blue Sapphire Engagement Ring, Vintage Cluste (base ₹5,009) ──
  'fjws-4568759267': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Marquise Cut Labradorite Ring, 14K Rose Gold Natur (base ₹5,009) ──
  'fjws-4568753007': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── 14k Gold Curved Wedding Band, Engraved Double Band (base ₹4,408) ──
  'fjws-4568748915': {
    '925 Sterling Silver': 4408,  'Yellow Gold Overlay': 4408,  'Rose Gold Overlay': 4408,  'White Gold Overlay': 4408,
    '9k Yellow Gold': 38069, '9k Rose Gold': 38069, '9k White Gold': 38069,
    '14k Yellow Gold': 54599, '14k Rose Gold': 54599, '14k White Gold': 54599,
    '18k Yellow Gold': 74135, '18k Rose Gold': 74135, '18k White Gold': 74135,
  },

  // ── Delicate 1.05 TC Pear Cut Wedding Band Moissanite  (base ₹4,759) ──
  'fjws-4567935465': {
    '925 Sterling Silver': 4759,  'Yellow Gold Overlay': 4759,  'Rose Gold Overlay': 4759,  'White Gold Overlay': 4759,
    '9k Yellow Gold': 39071, '9k Rose Gold': 39071, '9k White Gold': 39071,
    '14k Yellow Gold': 55050, '14k Rose Gold': 55050, '14k White Gold': 55050,
    '18k Yellow Gold': 74135, '18k Rose Gold': 74135, '18k White Gold': 74135,
  },

  // ── London Blue Topaz Wedding Band, Engraved Gold Band (base ₹4,508) ──
  'fjws-4567932891': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '9k Yellow Gold': 39071, '9k Rose Gold': 39071, '9k White Gold': 39071,
    '14k Yellow Gold': 55050, '14k Rose Gold': 55050, '14k White Gold': 55050,
    '18k Yellow Gold': 74135, '18k Rose Gold': 74135, '18k White Gold': 74135,
  },

  // ── Marquise Alexandrite Engagement Ring, Leaf Side St (base ₹5,009) ──
  'fjws-4567928605': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 56102, '14k Rose Gold': 56102, '14k White Gold': 56102,
    '18k Yellow Gold': 76139, '18k Rose Gold': 76139, '18k White Gold': 76139,
  },

  // ── Moss Agate Heart Eternity Band, 14k Gold Bezel Set (base ₹5,009) ──
  'fjws-4567219938': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '9k Yellow Gold': 40323, '9k Rose Gold': 40323, '9k White Gold': 40323,
    '14k Yellow Gold': 55601, '14k Rose Gold': 55601, '14k White Gold': 55601,
    '18k Yellow Gold': 75638, '18k Rose Gold': 75638, '18k White Gold': 75638,
  },

  // ── Blue Sapphire Wedding Band, Engraved Gold Band, Na (base ₹5,009) ──
  'fjws-4567193403': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '9k Yellow Gold': 40323, '9k Rose Gold': 40323, '9k White Gold': 40323,
    '14k Yellow Gold': 55601, '14k Rose Gold': 55601, '14k White Gold': 55601,
    '18k Yellow Gold': 75638, '18k Rose Gold': 75638, '18k White Gold': 75638,
  },

  // ── Emerald Vine Ring, Nature Inspired Leaf Band, 18k  (base ₹4,408) ──
  'fjws-4567190847': {
    '925 Sterling Silver': 4408,  'Yellow Gold Overlay': 4408,  'Rose Gold Overlay': 4408,  'White Gold Overlay': 4408,
    '9k Yellow Gold': 39572, '9k Rose Gold': 39572, '9k White Gold': 39572,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── 2CT Radiant Cut Moissanite Engagement ring set Uni (base ₹10,419) ──
  'fjws-4566550105': {
    '925 Sterling Silver': 10419,  'Yellow Gold Overlay': 10419,  'Rose Gold Overlay': 10419,  'White Gold Overlay': 10419,
    '9k Yellow Gold': 60109, '9k Rose Gold': 60109, '9k White Gold': 60109,
    '14k Yellow Gold': 77641, '14k Rose Gold': 77641, '14k White Gold': 77641,
    '18k Yellow Gold': 87660, '18k Rose Gold': 87660, '18k White Gold': 87660,
  },

  // ── 14k Solid Gold Oval Moissanite Engagement Ring, Tw (base ₹4,909) ──
  'fjws-4566560868': {
    '925 Sterling Silver': 4909,  'Yellow Gold Overlay': 4909,  'Rose Gold Overlay': 4909,  'White Gold Overlay': 4909,
    '9k Yellow Gold': 40023, '9k Rose Gold': 40023, '9k White Gold': 40023,
    '14k Yellow Gold': 56102, '14k Rose Gold': 56102, '14k White Gold': 56102,
    '18k Yellow Gold': 76639, '18k Rose Gold': 76639, '18k White Gold': 76639,
  },

  // ── Unique Hexagon Cut Alexandrite Ring Rose Gold Enga (base ₹5,009) ──
  'fjws-4566536959': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '9k Yellow Gold': 40574, '9k Rose Gold': 40574, '9k White Gold': 40574,
    '14k Yellow Gold': 56102, '14k Rose Gold': 56102, '14k White Gold': 56102,
    '18k Yellow Gold': 76139, '18k Rose Gold': 76139, '18k White Gold': 76139,
  },

  // ── Ruby Engagement Ring, Rose Gold Cluster Ring, Red  (base ₹5,610) ──
  'fjws-4563438229': {
    '925 Sterling Silver': 5610,  'Yellow Gold Overlay': 5610,  'Rose Gold Overlay': 5610,  'White Gold Overlay': 5610,
    '9k Yellow Gold': 41075, '9k Rose Gold': 41075, '9k White Gold': 41075,
    '14k Yellow Gold': 57855, '14k Rose Gold': 57855, '14k White Gold': 57855,
    '18k Yellow Gold': 77391, '18k Rose Gold': 77391, '18k White Gold': 77391,
  },

  // ── 2.5ct Oval Cut Moissanite Ring, Petite Three Stone (base ₹4,971) ──
  'fjws-4563456486': {
    '925 Sterling Silver': 4971,  'Yellow Gold Overlay': 4971,  'Rose Gold Overlay': 4971,  'White Gold Overlay': 4971,
    '9k Yellow Gold': 40173, '9k Rose Gold': 40173, '9k White Gold': 40173,
    '14k Yellow Gold': 57354, '14k Rose Gold': 57354, '14k White Gold': 57354,
    '18k Yellow Gold': 77391, '18k Rose Gold': 77391, '18k White Gold': 77391,
  },

  // ── Curved Moissanite Wedding Band, V Shape Chevron Ri (base ₹4,759) ──
  'fjws-4563455008': {
    '925 Sterling Silver': 4759,  'Yellow Gold Overlay': 4759,  'Rose Gold Overlay': 4759,  'White Gold Overlay': 4759,
    '9k Yellow Gold': 39973, '9k Rose Gold': 39973, '9k White Gold': 39973,
    '14k Yellow Gold': 56102, '14k Rose Gold': 56102, '14k White Gold': 56102,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Gold Chevron Baguette Diamond Wedding Band, V Shap (base ₹4,508) ──
  'fjws-4514491163': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Emerald Cut Moissanite Five Stone Ring, Vintage Ba (base ₹5,109) ──
  'fjws-4562159309': {
    '925 Sterling Silver': 5109,  'Yellow Gold Overlay': 5109,  'Rose Gold Overlay': 5109,  'White Gold Overlay': 5109,
    '9k Yellow Gold': 40574, '9k Rose Gold': 40574, '9k White Gold': 40574,
    '14k Yellow Gold': 59057, '14k Rose Gold': 59057, '14k White Gold': 59057,
    '18k Yellow Gold': 76639, '18k Rose Gold': 76639, '18k White Gold': 76639,
  },

  // ── Gold Bow Ring, Pavé Moissanite Statement Ring, Uni (base ₹6,111) ──
  'fjws-4561664002': {
    '925 Sterling Silver': 6111,  'Yellow Gold Overlay': 6111,  'Rose Gold Overlay': 6111,  'White Gold Overlay': 6111,
    '9k Yellow Gold': 42077, '9k Rose Gold': 42077, '9k White Gold': 42077,
    '14k Yellow Gold': 57354, '14k Rose Gold': 57354, '14k White Gold': 57354,
    '18k Yellow Gold': 77892, '18k Rose Gold': 77892, '18k White Gold': 77892,
  },

  // ── Teal Sapphire Toi Et Moi Ring, Two Stone Sapphire  (base ₹5,911) ──
  'fjws-4561625517': {
    '925 Sterling Silver': 5911,  'Yellow Gold Overlay': 5911,  'Rose Gold Overlay': 5911,  'White Gold Overlay': 5911,
    '9k Yellow Gold': 41425, '9k Rose Gold': 41425, '9k White Gold': 41425,
    '14k Yellow Gold': 58056, '14k Rose Gold': 58056, '14k White Gold': 58056,
    '18k Yellow Gold': 77391, '18k Rose Gold': 77391, '18k White Gold': 77391,
  },

  // ── Curved Gold Wedding Band, V Shape Moissanite Stack (base ₹5,410) ──
  'fjws-4561628960': {
    '925 Sterling Silver': 5410,  'Yellow Gold Overlay': 5410,  'Rose Gold Overlay': 5410,  'White Gold Overlay': 5410,
    '9k Yellow Gold': 40674, '9k Rose Gold': 40674, '9k White Gold': 40674,
    '14k Yellow Gold': 55852, '14k Rose Gold': 55852, '14k White Gold': 55852,
    '18k Yellow Gold': 76139, '18k Rose Gold': 76139, '18k White Gold': 76139,
  },

  // ── Round Cut Moissanite Curved Wedding Band, Yellow G (base ₹5,009) ──
  'fjws-4561621670': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '9k Yellow Gold': 40524, '9k Rose Gold': 40524, '9k White Gold': 40524,
    '14k Yellow Gold': 55601, '14k Rose Gold': 55601, '14k White Gold': 55601,
    '18k Yellow Gold': 75638, '18k Rose Gold': 75638, '18k White Gold': 75638,
  },

  // ── Oval Cut Bridal Ring Set, Teal Sapphire Engagement (base ₹11,271) ──
  'fjws-4527192853': {
    '925 Sterling Silver': 11271,  'Yellow Gold Overlay': 11271,  'Rose Gold Overlay': 11271,  'White Gold Overlay': 11271,
    '9k Yellow Gold': 60109, '9k Rose Gold': 60109, '9k White Gold': 60109,
    '14k Yellow Gold': 85105, '14k Rose Gold': 85105, '14k White Gold': 85105,
    '18k Yellow Gold': 110150, '18k Rose Gold': 110150, '18k White Gold': 110150,
  },

  // ── Chevron Wedding Band, Moissanite V Shaped Wedding  (base ₹4,308) ──
  'fjws-4559933962': {
    '925 Sterling Silver': 4308,  'Yellow Gold Overlay': 4308,  'Rose Gold Overlay': 4308,  'White Gold Overlay': 4308,
    '9k Yellow Gold': 39322, '9k Rose Gold': 39322, '9k White Gold': 39322,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Oval Moissanite Engagement Ring, 14K Gold Promise  (base ₹4,007) ──
  'fjws-4559816493': {
    '925 Sterling Silver': 4007,  'Yellow Gold Overlay': 4007,  'Rose Gold Overlay': 4007,  'White Gold Overlay': 4007,
    '9k Yellow Gold': 39422, '9k Rose Gold': 39422, '9k White Gold': 39422,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75087, '18k Rose Gold': 75087, '18k White Gold': 75087,
  },

  // ── Emerald Cut Moissanite Engagement Ring, Diamond Cl (base ₹5,610) ──
  'fjws-4558523565': {
    '925 Sterling Silver': 5610,  'Yellow Gold Overlay': 5610,  'Rose Gold Overlay': 5610,  'White Gold Overlay': 5610,
    '9k Yellow Gold': 41025, '9k Rose Gold': 41025, '9k White Gold': 41025,
    '14k Yellow Gold': 56853, '14k Rose Gold': 56853, '14k White Gold': 56853,
    '18k Yellow Gold': 76589, '18k Rose Gold': 76589, '18k White Gold': 76589,
  },

  // ── Unique Marquise Natural White Fire Opal Wedding Ba (base ₹4,408) ──
  'fjws-4558535492': {
    '925 Sterling Silver': 4408,  'Yellow Gold Overlay': 4408,  'Rose Gold Overlay': 4408,  'White Gold Overlay': 4408,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 55551, '14k Rose Gold': 55551, '14k White Gold': 55551,
    '18k Yellow Gold': 76139, '18k Rose Gold': 76139, '18k White Gold': 76139,
  },

  // ── 14K Yellow Gold Ruby Ring, Ruby Wedding Band For W (base ₹4,909) ──
  'fjws-4558513125': {
    '925 Sterling Silver': 4909,  'Yellow Gold Overlay': 4909,  'Rose Gold Overlay': 4909,  'White Gold Overlay': 4909,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 56353, '14k Rose Gold': 56353, '14k White Gold': 56353,
    '18k Yellow Gold': 77391, '18k Rose Gold': 77391, '18k White Gold': 77391,
  },

  // ── Ruby Eternity Diamond Band, Gold Ruby Wedding Band (base ₹4,936) ──
  'fjws-4558004615': {
    '925 Sterling Silver': 4936,  'Yellow Gold Overlay': 4936,  'Rose Gold Overlay': 4936,  'White Gold Overlay': 4936,
    '9k Yellow Gold': 40223, '9k Rose Gold': 40223, '9k White Gold': 40223,
    '14k Yellow Gold': 55601, '14k Rose Gold': 55601, '14k White Gold': 55601,
    '18k Yellow Gold': 76139, '18k Rose Gold': 76139, '18k White Gold': 76139,
  },

  // ── Ruby Trillion Cut Ring, Gold Curved Band, Red Gems (base ₹6,111) ──
  'fjws-4558008410': {
    '925 Sterling Silver': 6111,  'Yellow Gold Overlay': 6111,  'Rose Gold Overlay': 6111,  'White Gold Overlay': 6111,
    '9k Yellow Gold': 41325, '9k Rose Gold': 41325, '9k White Gold': 41325,
    '14k Yellow Gold': 58356, '14k Rose Gold': 58356, '14k White Gold': 58356,
    '18k Yellow Gold': 78092, '18k Rose Gold': 78092, '18k White Gold': 78092,
  },

  // ── Lapis Lazuli Ring, Marquise Cut Lapis lazuli State (base ₹5,861) ──
  'fjws-4558006980': {
    '925 Sterling Silver': 5861,  'Yellow Gold Overlay': 5861,  'Rose Gold Overlay': 5861,  'White Gold Overlay': 5861,
    '9k Yellow Gold': 42077, '9k Rose Gold': 42077, '9k White Gold': 42077,
    '14k Yellow Gold': 57855, '14k Rose Gold': 57855, '14k White Gold': 57855,
    '18k Yellow Gold': 77641, '18k Rose Gold': 77641, '18k White Gold': 77641,
  },

  // ── 14K Gold Celestial Curved Wedding Band, Moissanite (base ₹4,430) ──
  'fjws-4540699457': {
    '925 Sterling Silver': 4430,  'Yellow Gold Overlay': 4430,  'Rose Gold Overlay': 4430,  'White Gold Overlay': 4430,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Cushion Cut Moissanite Engagement Ring, Elongated  (base ₹6,011) ──
  'fjws-4556248029': {
    '925 Sterling Silver': 6011,  'Yellow Gold Overlay': 6011,  'Rose Gold Overlay': 6011,  'White Gold Overlay': 6011,
    '9k Yellow Gold': 42577, '9k Rose Gold': 42577, '9k White Gold': 42577,
    '14k Yellow Gold': 58356, '14k Rose Gold': 58356, '14k White Gold': 58356,
    '18k Yellow Gold': 77641, '18k Rose Gold': 77641, '18k White Gold': 77641,
  },

  // ── Bezel Set Emerald Cut Moissanite Engagement Ring,  (base ₹5,109) ──
  'fjws-4556257762': {
    '925 Sterling Silver': 5109,  'Yellow Gold Overlay': 5109,  'Rose Gold Overlay': 5109,  'White Gold Overlay': 5109,
    '9k Yellow Gold': 40574, '9k Rose Gold': 40574, '9k White Gold': 40574,
    '14k Yellow Gold': 57354, '14k Rose Gold': 57354, '14k White Gold': 57354,
    '18k Yellow Gold': 76389, '18k Rose Gold': 76389, '18k White Gold': 76389,
  },

  // ── Marquise Cut Moissanite Engagement Ring Set, Gold  (base ₹11,922) ──
  'fjws-4556254852': {
    '925 Sterling Silver': 11922,  'Yellow Gold Overlay': 11922,  'Rose Gold Overlay': 11922,  'White Gold Overlay': 11922,
    '9k Yellow Gold': 62564, '9k Rose Gold': 62564, '9k White Gold': 62564,
    '14k Yellow Gold': 90164, '14k Rose Gold': 90164, '14k White Gold': 90164,
    '18k Yellow Gold': 112655, '18k Rose Gold': 112655, '18k White Gold': 112655,
  },

  // ── Pink Ruby Engagement Ring, Flower Diamond Cluster  (base ₹5,410) ──
  'fjws-4556238077': {
    '925 Sterling Silver': 5410,  'Yellow Gold Overlay': 5410,  'Rose Gold Overlay': 5410,  'White Gold Overlay': 5410,
    '9k Yellow Gold': 40824, '9k Rose Gold': 40824, '9k White Gold': 40824,
    '14k Yellow Gold': 56102, '14k Rose Gold': 56102, '14k White Gold': 56102,
    '18k Yellow Gold': 76389, '18k Rose Gold': 76389, '18k White Gold': 76389,
  },

  // ── Blue Sapphire Moissanite Wedding Band, White Gold  (base ₹4,508) ──
  'fjws-4555656875': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Larimar Ring with Aquamarine, Round Larimar Gemsto (base ₹6,612) ──
  'fjws-4555664458': {
    '925 Sterling Silver': 6612,  'Yellow Gold Overlay': 6612,  'Rose Gold Overlay': 6612,  'White Gold Overlay': 6612,
    '9k Yellow Gold': 43078, '9k Rose Gold': 43078, '9k White Gold': 43078,
    '14k Yellow Gold': 60109, '14k Rose Gold': 60109, '14k White Gold': 60109,
    '18k Yellow Gold': 80146, '18k Rose Gold': 80146, '18k White Gold': 80146,
  },

  // ── Oval Black Onyx 14k Gold Engagement Ring, Moissani (base ₹5,760) ──
  'fjws-4555658876': {
    '925 Sterling Silver': 5760,  'Yellow Gold Overlay': 5760,  'Rose Gold Overlay': 5760,  'White Gold Overlay': 5760,
    '9k Yellow Gold': 41325, '9k Rose Gold': 41325, '9k White Gold': 41325,
    '14k Yellow Gold': 56102, '14k Rose Gold': 56102, '14k White Gold': 56102,
    '18k Yellow Gold': 77391, '18k Rose Gold': 77391, '18k White Gold': 77391,
  },

  // ── Vintage Hexagon Amethyst Engagement Ring, Unique L (base ₹5,260) ──
  'fjws-4555064571': {
    '925 Sterling Silver': 5260,  'Yellow Gold Overlay': 5260,  'Rose Gold Overlay': 5260,  'White Gold Overlay': 5260,
    '9k Yellow Gold': 40574, '9k Rose Gold': 40574, '9k White Gold': 40574,
    '14k Yellow Gold': 57104, '14k Rose Gold': 57104, '14k White Gold': 57104,
    '18k Yellow Gold': 77090, '18k Rose Gold': 77090, '18k White Gold': 77090,
  },

  // ── Green Emerald Ring, Green Gemstone Ring, Emerald C (base ₹5,811) ──
  'fjws-4555059373': {
    '925 Sterling Silver': 5811,  'Yellow Gold Overlay': 5811,  'Rose Gold Overlay': 5811,  'White Gold Overlay': 5811,
    '9k Yellow Gold': 41375, '9k Rose Gold': 41375, '9k White Gold': 41375,
    '14k Yellow Gold': 56853, '14k Rose Gold': 56853, '14k White Gold': 56853,
    '18k Yellow Gold': 77391, '18k Rose Gold': 77391, '18k White Gold': 77391,
  },

  // ── Purple Amethyst Gold Ring, Floral Gemstone Gift Ri (base ₹6,762) ──
  'fjws-4555066552': {
    '925 Sterling Silver': 6762,  'Yellow Gold Overlay': 6762,  'Rose Gold Overlay': 6762,  'White Gold Overlay': 6762,
    '9k Yellow Gold': 43078, '9k Rose Gold': 43078, '9k White Gold': 43078,
    '14k Yellow Gold': 60109, '14k Rose Gold': 60109, '14k White Gold': 60109,
    '18k Yellow Gold': 80146, '18k Rose Gold': 80146, '18k White Gold': 80146,
  },

  // ── Sapphire Blue Gold Ring, Vintage Floral Ring, Roun (base ₹6,311) ──
  'fjws-4555060660': {
    '925 Sterling Silver': 6311,  'Yellow Gold Overlay': 6311,  'Rose Gold Overlay': 6311,  'White Gold Overlay': 6311,
    '9k Yellow Gold': 42577, '9k Rose Gold': 42577, '9k White Gold': 42577,
    '14k Yellow Gold': 56603, '14k Rose Gold': 56603, '14k White Gold': 56603,
    '18k Yellow Gold': 78142, '18k Rose Gold': 78142, '18k White Gold': 78142,
  },

  // ── Toi et Moi Moissanite And Sapphire Engagement Ring (base ₹5,760) ──
  'fjws-4554374033': {
    '925 Sterling Silver': 5760,  'Yellow Gold Overlay': 5760,  'Rose Gold Overlay': 5760,  'White Gold Overlay': 5760,
    '9k Yellow Gold': 41075, '9k Rose Gold': 41075, '9k White Gold': 41075,
    '14k Yellow Gold': 57555, '14k Rose Gold': 57555, '14k White Gold': 57555,
    '18k Yellow Gold': 76389, '18k Rose Gold': 76389, '18k White Gold': 76389,
  },

  // ── Toi et Moi Pearl And Sapphire Engagement Ring, Clu (base ₹5,510) ──
  'fjws-4554379690': {
    '925 Sterling Silver': 5510,  'Yellow Gold Overlay': 5510,  'Rose Gold Overlay': 5510,  'White Gold Overlay': 5510,
    '9k Yellow Gold': 40323, '9k Rose Gold': 40323, '9k White Gold': 40323,
    '14k Yellow Gold': 56353, '14k Rose Gold': 56353, '14k White Gold': 56353,
    '18k Yellow Gold': 75638, '18k Rose Gold': 75638, '18k White Gold': 75638,
  },

  // ── Pear Cut Blue Sapphire Ring, 14k Rose Gold Bypass  (base ₹6,011) ──
  'fjws-4554378184': {
    '925 Sterling Silver': 6011,  'Yellow Gold Overlay': 6011,  'Rose Gold Overlay': 6011,  'White Gold Overlay': 6011,
    '9k Yellow Gold': 42077, '9k Rose Gold': 42077, '9k White Gold': 42077,
    '14k Yellow Gold': 56102, '14k Rose Gold': 56102, '14k White Gold': 56102,
    '18k Yellow Gold': 77591, '18k Rose Gold': 77591, '18k White Gold': 77591,
  },

  // ── Curved Leaf Band Ring, Moissanite Vine Ring, Flora (base ₹4,909) ──
  'fjws-4553706036': {
    '925 Sterling Silver': 4909,  'Yellow Gold Overlay': 4909,  'Rose Gold Overlay': 4909,  'White Gold Overlay': 4909,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 56353, '14k Rose Gold': 56353, '14k White Gold': 56353,
    '18k Yellow Gold': 77391, '18k Rose Gold': 77391, '18k White Gold': 77391,
  },

  // ── Pear Cut Moissanite Wedding Band, Lab Grown Diamon (base ₹5,510) ──
  'fjws-4553700624': {
    '925 Sterling Silver': 5510,  'Yellow Gold Overlay': 5510,  'Rose Gold Overlay': 5510,  'White Gold Overlay': 5510,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 56353, '14k Rose Gold': 56353, '14k White Gold': 56353,
    '18k Yellow Gold': 76139, '18k Rose Gold': 76139, '18k White Gold': 76139,
  },

  // ── Pear Shaped Sapphire Engagement Ring, September Bi (base ₹4,759) ──
  'fjws-4553655331': {
    '925 Sterling Silver': 4759,  'Yellow Gold Overlay': 4759,  'Rose Gold Overlay': 4759,  'White Gold Overlay': 4759,
    '9k Yellow Gold': 39572, '9k Rose Gold': 39572, '9k White Gold': 39572,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Art Deco Emerald Cut Engagement Ring, Baguette Clu (base ₹4,859) ──
  'fjws-4553154350': {
    '925 Sterling Silver': 4859,  'Yellow Gold Overlay': 4859,  'Rose Gold Overlay': 4859,  'White Gold Overlay': 4859,
    '9k Yellow Gold': 40123, '9k Rose Gold': 40123, '9k White Gold': 40123,
    '14k Yellow Gold': 59057, '14k Rose Gold': 59057, '14k White Gold': 59057,
    '18k Yellow Gold': 76589, '18k Rose Gold': 76589, '18k White Gold': 76589,
  },

  // ── Larimar Ring, 925 Sterling Silver, Minimalist Ever (base ₹5,310) ──
  'fjws-4553146366': {
    '925 Sterling Silver': 5310,  'Yellow Gold Overlay': 5310,  'Rose Gold Overlay': 5310,  'White Gold Overlay': 5310,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 57354, '14k Rose Gold': 57354, '14k White Gold': 57354,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Baguette Emerald Half Eternity Wedding Band, Art D (base ₹4,759) ──
  'fjws-4553131581': {
    '925 Sterling Silver': 4759,  'Yellow Gold Overlay': 4759,  'Rose Gold Overlay': 4759,  'White Gold Overlay': 4759,
    '9k Yellow Gold': 39822, '9k Rose Gold': 39822, '9k White Gold': 39822,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── 9K Black Gold Natural Green Moss Agate Engagement  (base ₹9,968) ──
  'fjws-4553118549': {
    '925 Sterling Silver': 9968,  'Yellow Gold Overlay': 9968,  'Rose Gold Overlay': 9968,  'White Gold Overlay': 9968,
    '9k Yellow Gold': 56553, '9k Rose Gold': 56553, '9k White Gold': 56553,
    '14k Yellow Gold': 80146, '14k Rose Gold': 80146, '14k White Gold': 80146,
    '18k Yellow Gold': 105191, '18k Rose Gold': 105191, '18k White Gold': 105191,
  },

  // ── Natural Green Moss Agate Ring, Men&#39;s Ring, Men (base ₹4,909) ──
  'fjws-4552026189': {
    '925 Sterling Silver': 4909,  'Yellow Gold Overlay': 4909,  'Rose Gold Overlay': 4909,  'White Gold Overlay': 4909,
    '9k Yellow Gold': 40023, '9k Rose Gold': 40023, '9k White Gold': 40023,
    '14k Yellow Gold': 55601, '14k Rose Gold': 55601, '14k White Gold': 55601,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Vintage Moissanite Marquise Cut Wedding Band, 14k  (base ₹4,508) ──
  'fjws-4552034158': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '9k Yellow Gold': 39822, '9k Rose Gold': 39822, '9k White Gold': 39822,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Skye Kite Moonstone Ring Set, Moss Agate & Moonsto (base ₹10,269) ──
  'fjws-4552024664': {
    '925 Sterling Silver': 10269,  'Yellow Gold Overlay': 10269,  'Rose Gold Overlay': 10269,  'White Gold Overlay': 10269,
    '9k Yellow Gold': 56102, '9k Rose Gold': 56102, '9k White Gold': 56102,
    '14k Yellow Gold': 78393, '14k Rose Gold': 78393, '14k White Gold': 78393,
    '18k Yellow Gold': 100633, '18k Rose Gold': 100633, '18k White Gold': 100633,
  },

  // ── Pear Moss agate Engagement Ring, Leaf Ring, Nature (base ₹5,911) ──
  'fjws-4552011605': {
    '925 Sterling Silver': 5911,  'Yellow Gold Overlay': 5911,  'Rose Gold Overlay': 5911,  'White Gold Overlay': 5911,
    '9k Yellow Gold': 40824, '9k Rose Gold': 40824, '9k White Gold': 40824,
    '14k Yellow Gold': 58056, '14k Rose Gold': 58056, '14k White Gold': 58056,
    '18k Yellow Gold': 77892, '18k Rose Gold': 77892, '18k White Gold': 77892,
  },

  // ── Opal Baguette Ring: 925 Sterling Silver, Baguette  (base ₹4,508) ──
  'fjws-4540693164': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '9k Yellow Gold': 39878, '9k Rose Gold': 39878, '9k White Gold': 39878,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75187, '18k Rose Gold': 75187, '18k White Gold': 75187,
  },

  // ── Gold Opal Eternity Ring, Baguette Opal Band, Minim (base ₹4,959) ──
  'fjws-4550957858': {
    '925 Sterling Silver': 4959,  'Yellow Gold Overlay': 4959,  'Rose Gold Overlay': 4959,  'White Gold Overlay': 4959,
    '9k Yellow Gold': 39822, '9k Rose Gold': 39822, '9k White Gold': 39822,
    '14k Yellow Gold': 56102, '14k Rose Gold': 56102, '14k White Gold': 56102,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Layered Heart Necklace, Gold Heart Pendant Necklac (base ₹12,022) ──
  'fjws-4529689440': {
    '925 Sterling Silver': 12022,  'Yellow Gold Overlay': 12022,  'Rose Gold Overlay': 12022,  'White Gold Overlay': 12022,
  },

  // ── Gold Solitaire Ring, Princess Cut Moissanite Engag (base ₹6,011) ──
  'fjws-4550929073': {
    '925 Sterling Silver': 6011,  'Yellow Gold Overlay': 6011,  'Rose Gold Overlay': 6011,  'White Gold Overlay': 6011,
    '9k Yellow Gold': 40323, '9k Rose Gold': 40323, '9k White Gold': 40323,
    '14k Yellow Gold': 56102, '14k Rose Gold': 56102, '14k White Gold': 56102,
    '18k Yellow Gold': 78142, '18k Rose Gold': 78142, '18k White Gold': 78142,
  },

  // ── Oval Cut Moissanite Engagement Ring, 14K Yellow Go (base ₹5,760) ──
  'fjws-4550930842': {
    '925 Sterling Silver': 5760,  'Yellow Gold Overlay': 5760,  'Rose Gold Overlay': 5760,  'White Gold Overlay': 5760,
    '9k Yellow Gold': 40824, '9k Rose Gold': 40824, '9k White Gold': 40824,
    '14k Yellow Gold': 58056, '14k Rose Gold': 58056, '14k White Gold': 58056,
    '18k Yellow Gold': 77591, '18k Rose Gold': 77591, '18k White Gold': 77591,
  },

  // ── 2 CT Emerald Cut Moissanite Engagement Ring, Three (base ₹4,508) ──
  'fjws-4550918597': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '9k Yellow Gold': 39672, '9k Rose Gold': 39672, '9k White Gold': 39672,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Oval Cut Bezel Engagement Ring, Moissanite Wedding (base ₹5,610) ──
  'fjws-4550265463': {
    '925 Sterling Silver': 5610,  'Yellow Gold Overlay': 5610,  'Rose Gold Overlay': 5610,  'White Gold Overlay': 5610,
    '9k Yellow Gold': 40574, '9k Rose Gold': 40574, '9k White Gold': 40574,
    '14k Yellow Gold': 57555, '14k Rose Gold': 57555, '14k White Gold': 57555,
    '18k Yellow Gold': 77090, '18k Rose Gold': 77090, '18k White Gold': 77090,
  },

  // ── Pear Cut Moissanite Engagement Ring, Solitaire Moi (base ₹6,512) ──
  'fjws-4550202684': {
    '925 Sterling Silver': 6512,  'Yellow Gold Overlay': 6512,  'Rose Gold Overlay': 6512,  'White Gold Overlay': 6512,
    '9k Yellow Gold': 40824, '9k Rose Gold': 40824, '9k White Gold': 40824,
    '14k Yellow Gold': 60059, '14k Rose Gold': 60059, '14k White Gold': 60059,
    '18k Yellow Gold': 79395, '18k Rose Gold': 79395, '18k White Gold': 79395,
  },

  // ── 18K Black Gold Oval Cut Blue Sapphire Ring for Wif (base ₹5,760) ──
  'fjws-4550176799': {
    '925 Sterling Silver': 5760,  'Yellow Gold Overlay': 5760,  'Rose Gold Overlay': 5760,  'White Gold Overlay': 5760,
    '9k Yellow Gold': 41075, '9k Rose Gold': 41075, '9k White Gold': 41075,
    '14k Yellow Gold': 59569, '14k Rose Gold': 59569, '14k White Gold': 59569,
    '18k Yellow Gold': 78393, '18k Rose Gold': 78393, '18k White Gold': 78393,
  },

  // ── Emerald Cut Sapphire and Pear Moissanite Toi Et Mo (base ₹5,009) ──
  'fjws-4550179950': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '9k Yellow Gold': 40323, '9k Rose Gold': 40323, '9k White Gold': 40323,
    '14k Yellow Gold': 56353, '14k Rose Gold': 56353, '14k White Gold': 56353,
    '18k Yellow Gold': 75638, '18k Rose Gold': 75638, '18k White Gold': 75638,
  },

  // ── Galaxy Sandstone Ring, Round Engagement Ring, Twig (base ₹5,610) ──
  'fjws-4548966677': {
    '925 Sterling Silver': 5610,  'Yellow Gold Overlay': 5610,  'Rose Gold Overlay': 5610,  'White Gold Overlay': 5610,
    '9k Yellow Gold': 40824, '9k Rose Gold': 40824, '9k White Gold': 40824,
    '14k Yellow Gold': 59358, '14k Rose Gold': 59358, '14k White Gold': 59358,
    '18k Yellow Gold': 77591, '18k Rose Gold': 77591, '18k White Gold': 77591,
  },

  // ── 14K Solid Gold Diamond Starburst Wedding Band , Et (base ₹5,109) ──
  'fjws-4548956245': {
    '925 Sterling Silver': 5109,  'Yellow Gold Overlay': 5109,  'Rose Gold Overlay': 5109,  'White Gold Overlay': 5109,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 56202, '14k Rose Gold': 56202, '14k White Gold': 56202,
    '18k Yellow Gold': 76740, '18k Rose Gold': 76740, '18k White Gold': 76740,
  },

  // ── Oval Cut London Blue Topaz Solid Gold Wedding Ring (base ₹5,009) ──
  'fjws-4548963184': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 59358, '14k Rose Gold': 59358, '14k White Gold': 59358,
    '18k Yellow Gold': 77591, '18k Rose Gold': 77591, '18k White Gold': 77591,
  },

  // ── 14k Gold Tortoise Ring, Solid Gold Turtle Ring, Da (base ₹6,612) ──
  'fjws-4547874145': {
    '925 Sterling Silver': 6612,  'Yellow Gold Overlay': 6612,  'Rose Gold Overlay': 6612,  'White Gold Overlay': 6612,
    '9k Yellow Gold': 42477, '9k Rose Gold': 42477, '9k White Gold': 42477,
    '14k Yellow Gold': 58557, '14k Rose Gold': 58557, '14k White Gold': 58557,
    '18k Yellow Gold': 79044, '18k Rose Gold': 79044, '18k White Gold': 79044,
  },

  // ── Vintage Bezel Setting Moss Agate Ring, Emerald Cut (base ₹4,007) ──
  'fjws-4547883696': {
    '925 Sterling Silver': 4007,  'Yellow Gold Overlay': 4007,  'Rose Gold Overlay': 4007,  'White Gold Overlay': 4007,
    '9k Yellow Gold': 39071, '9k Rose Gold': 39071, '9k White Gold': 39071,
    '14k Yellow Gold': 55050, '14k Rose Gold': 55050, '14k White Gold': 55050,
    '18k Yellow Gold': 75087, '18k Rose Gold': 75087, '18k White Gold': 75087,
  },

  // ── Emerald Cut Blue Sapphire Engagement Ring, Bezel S (base ₹4,007) ──
  'fjws-4547879198': {
    '925 Sterling Silver': 4007,  'Yellow Gold Overlay': 4007,  'Rose Gold Overlay': 4007,  'White Gold Overlay': 4007,
    '9k Yellow Gold': 39071, '9k Rose Gold': 39071, '9k White Gold': 39071,
    '14k Yellow Gold': 55050, '14k Rose Gold': 55050, '14k White Gold': 55050,
    '18k Yellow Gold': 75087, '18k Rose Gold': 75087, '18k White Gold': 75087,
  },

  // ── Emerald Cut Ruby Engagement Ring, 14K Solid Yellow (base ₹4,107) ──
  'fjws-4547878618': {
    '925 Sterling Silver': 4107,  'Yellow Gold Overlay': 4107,  'Rose Gold Overlay': 4107,  'White Gold Overlay': 4107,
    '9k Yellow Gold': 39322, '9k Rose Gold': 39322, '9k White Gold': 39322,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75087, '18k Rose Gold': 75087, '18k White Gold': 75087,
  },

  // ── Cherry Blossom Rose Quartz Ring, Sakura Flower Eng (base ₹5,873) ──
  'fjws-4546805557': {
    '925 Sterling Silver': 5873,  'Yellow Gold Overlay': 5873,  'Rose Gold Overlay': 5873,  'White Gold Overlay': 5873,
    '9k Yellow Gold': 40936, '9k Rose Gold': 40936, '9k White Gold': 40936,
    '14k Yellow Gold': 59508, '14k Rose Gold': 59508, '14k White Gold': 59508,
    '18k Yellow Gold': 77591, '18k Rose Gold': 77591, '18k White Gold': 77591,
  },

  // ── Ocean Wave Sapphire Ring, Blue Sapphire Engagement (base ₹6,211) ──
  'fjws-4546790203': {
    '925 Sterling Silver': 6211,  'Yellow Gold Overlay': 6211,  'Rose Gold Overlay': 6211,  'White Gold Overlay': 6211,
    '9k Yellow Gold': 40835, '9k Rose Gold': 40835, '9k White Gold': 40835,
    '14k Yellow Gold': 57555, '14k Rose Gold': 57555, '14k White Gold': 57555,
    '18k Yellow Gold': 75888, '18k Rose Gold': 75888, '18k White Gold': 75888,
  },

  // ── Vintage kite cut green moss agate engagement ring  (base ₹9,768) ──
  'fjws-4546774340': {
    '925 Sterling Silver': 9768,  'Yellow Gold Overlay': 9768,  'Rose Gold Overlay': 9768,  'White Gold Overlay': 9768,
    '9k Yellow Gold': 55100, '9k Rose Gold': 55100, '9k White Gold': 55100,
    '14k Yellow Gold': 77591, '14k Rose Gold': 77591, '14k White Gold': 77591,
    '18k Yellow Gold': 100132, '18k Rose Gold': 100132, '18k White Gold': 100132,
  },

  // ── Vintage Pink Marquise Sapphire Bridal Ring Set / R (base ₹9,968) ──
  'fjws-4546769040': {
    '925 Sterling Silver': 9968,  'Yellow Gold Overlay': 9968,  'Rose Gold Overlay': 9968,  'White Gold Overlay': 9968,
    '9k Yellow Gold': 60059, '9k Rose Gold': 60059, '9k White Gold': 60059,
    '14k Yellow Gold': 82600, '14k Rose Gold': 82600, '14k White Gold': 82600,
    '18k Yellow Gold': 100633, '18k Rose Gold': 100633, '18k White Gold': 100633,
  },

  // ── Vintage Curved Opal Wedding Band, 9k Rose Gold Art (base ₹5,260) ──
  'fjws-4545473449': {
    '925 Sterling Silver': 5260,  'Yellow Gold Overlay': 5260,  'Rose Gold Overlay': 5260,  'White Gold Overlay': 5260,
    '9k Yellow Gold': 39672, '9k Rose Gold': 39672, '9k White Gold': 39672,
    '14k Yellow Gold': 57555, '14k Rose Gold': 57555, '14k White Gold': 57555,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Green Moss Agate Turtle Ring, Gold Sea Lover Turtl (base ₹6,061) ──
  'fjws-4545482966': {
    '925 Sterling Silver': 6061,  'Yellow Gold Overlay': 6061,  'Rose Gold Overlay': 6061,  'White Gold Overlay': 6061,
    '9k Yellow Gold': 40975, '9k Rose Gold': 40975, '9k White Gold': 40975,
    '14k Yellow Gold': 58356, '14k Rose Gold': 58356, '14k White Gold': 58356,
    '18k Yellow Gold': 78393, '18k Rose Gold': 78393, '18k White Gold': 78393,
  },

  // ── Lotus Flower Belly Button Ring with Blue Gemstone, (base ₹6,153) ──
  'fjws-4529755774': {
    '925 Sterling Silver': 6153,  'Yellow Gold Overlay': 6153,  'Rose Gold Overlay': 6153,  'White Gold Overlay': 6153,
    '9k Yellow Gold': 40023, '9k Rose Gold': 40023, '9k White Gold': 40023,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── 14k Gold Turtle Ring, Solid Gold Tortoise Ring, Da (base ₹6,311) ──
  'fjws-4545471202': {
    '925 Sterling Silver': 6311,  'Yellow Gold Overlay': 6311,  'Rose Gold Overlay': 6311,  'White Gold Overlay': 6311,
    '9k Yellow Gold': 42577, '9k Rose Gold': 42577, '9k White Gold': 42577,
    '14k Yellow Gold': 60610, '14k Rose Gold': 60610, '14k White Gold': 60610,
    '18k Yellow Gold': 80647, '18k Rose Gold': 80647, '18k White Gold': 80647,
  },

  // ── Unique Princess Cut Alexandrite Necklace Rose Gold (base ₹6,963) ──
  'fjws-4544758622': {
    '925 Sterling Silver': 6963,  'Yellow Gold Overlay': 6963,  'Rose Gold Overlay': 6963,  'White Gold Overlay': 6963,
  },

  // ── Vintage Lotus Flower Necklace, Solid Gold Marquise (base ₹7,113) ──
  'fjws-4544739715': {
    '925 Sterling Silver': 7113,  'Yellow Gold Overlay': 7113,  'Rose Gold Overlay': 7113,  'White Gold Overlay': 7113,
  },

  // ── Silver Flower Pendant Necklace, Blue Sapphire Styl (base ₹6,512) ──
  'fjws-4544726597': {
    '925 Sterling Silver': 6512,  'Yellow Gold Overlay': 6512,  'Rose Gold Overlay': 6512,  'White Gold Overlay': 6512,
  },

  // ── Sterling Silver Lily Flower Pendant Necklace, Lily (base ₹5,911) ──
  'fjws-4544739722': {
    '925 Sterling Silver': 5911,  'Yellow Gold Overlay': 5911,  'Rose Gold Overlay': 5911,  'White Gold Overlay': 5911,
  },

  // ── Minimalist Knot Ring, Gold Love Knot Ring, Dainty  (base ₹4,107) ──
  'fjws-4543716357': {
    '925 Sterling Silver': 4107,  'Yellow Gold Overlay': 4107,  'Rose Gold Overlay': 4107,  'White Gold Overlay': 4107,
    '9k Yellow Gold': 39071, '9k Rose Gold': 39071, '9k White Gold': 39071,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Opal Sunburst Ring, Gold Opal Ring, Celestial Enga (base ₹6,456) ──
  'fjws-4543728974': {
    '925 Sterling Silver': 6456,  'Yellow Gold Overlay': 6456,  'Rose Gold Overlay': 6456,  'White Gold Overlay': 6456,
    '9k Yellow Gold': 42577, '9k Rose Gold': 42577, '9k White Gold': 42577,
    '14k Yellow Gold': 60610, '14k Rose Gold': 60610, '14k White Gold': 60610,
    '18k Yellow Gold': 80647, '18k Rose Gold': 80647, '18k White Gold': 80647,
  },

  // ── Coffin Cut Black Onyx Engagement Ring, Black Gold  (base ₹6,011) ──
  'fjws-4536944536': {
    '925 Sterling Silver': 6011,  'Yellow Gold Overlay': 6011,  'Rose Gold Overlay': 5260,  'White Gold Overlay': 6011,
    '9k Yellow Gold': 42577, '9k Rose Gold': 42577, '9k White Gold': 42577,
    '14k Yellow Gold': 60109, '14k Rose Gold': 60109, '14k White Gold': 60109,
    '18k Yellow Gold': 77641, '18k Rose Gold': 77641, '18k White Gold': 77641,
  },

  // ── Minimalist Opal Ring Rose Gold Three Stone Baguett (base ₹5,660) ──
  'fjws-4543132830': {
    '925 Sterling Silver': 5660,  'Yellow Gold Overlay': 5660,  'Rose Gold Overlay': 5660,  'White Gold Overlay': 5660,
    '9k Yellow Gold': 40524, '9k Rose Gold': 40524, '9k White Gold': 40524,
    '14k Yellow Gold': 58406, '14k Rose Gold': 58406, '14k White Gold': 58406,
    '18k Yellow Gold': 76389, '18k Rose Gold': 76389, '18k White Gold': 76389,
  },

  // ── Marquise Opal Engagement Ring, 925 Sterling Silver (base ₹4,435) ──
  'fjws-4543128480': {
    '925 Sterling Silver': 4435,  'Yellow Gold Overlay': 4435,  'Rose Gold Overlay': 4435,  'White Gold Overlay': 4435,
    '9k Yellow Gold': 39679, '9k Rose Gold': 39679, '9k White Gold': 39679,
    '14k Yellow Gold': 56202, '14k Rose Gold': 56202, '14k White Gold': 56202,
    '18k Yellow Gold': 75187, '18k Rose Gold': 75187, '18k White Gold': 75187,
  },

  // ── Nature Inspired Leaf Engagement Ring, Marquise Moi (base ₹6,111) ──
  'fjws-4543120522': {
    '925 Sterling Silver': 6111,  'Yellow Gold Overlay': 6111,  'Rose Gold Overlay': 6111,  'White Gold Overlay': 6111,
    '9k Yellow Gold': 41576, '9k Rose Gold': 41576, '9k White Gold': 41576,
    '14k Yellow Gold': 59608, '14k Rose Gold': 59608, '14k White Gold': 59608,
    '18k Yellow Gold': 79595, '18k Rose Gold': 79595, '18k White Gold': 79595,
  },

  // ── Vintage Moss Agate Engagement Ring, Kite Cut Moss  (base ₹5,460) ──
  'fjws-4541272279': {
    '925 Sterling Silver': 5460,  'Yellow Gold Overlay': 5460,  'Rose Gold Overlay': 5460,  'White Gold Overlay': 5460,
    '9k Yellow Gold': 40323, '9k Rose Gold': 40323, '9k White Gold': 40323,
    '14k Yellow Gold': 57555, '14k Rose Gold': 57555, '14k White Gold': 57555,
    '18k Yellow Gold': 75387, '18k Rose Gold': 75387, '18k White Gold': 75387,
  },

  // ── Moonstone Star Necklace, Celestial Pendant Necklac (base ₹9,267) ──
  'fjws-4529643661': {
    '925 Sterling Silver': 9267,  'Yellow Gold Overlay': 9267,  'Rose Gold Overlay': 9267,  'White Gold Overlay': 9267,
  },

  // ── Oval Opal Dual Stone Ring, 925 Sterling Silver, Op (base ₹6,161) ──
  'fjws-4541861591': {
    '925 Sterling Silver': 6161,  'Yellow Gold Overlay': 6161,  'Rose Gold Overlay': 6161,  'White Gold Overlay': 6161,
    '9k Yellow Gold': 40924, '9k Rose Gold': 40924, '9k White Gold': 40924,
    '14k Yellow Gold': 57304, '14k Rose Gold': 57304, '14k White Gold': 57304,
    '18k Yellow Gold': 77892, '18k Rose Gold': 77892, '18k White Gold': 77892,
  },

  // ── 2ct Round Cut Moissanite Engagement Ring, 14k Soli (base ₹4,871) ──
  'fjws-4541870618': {
    '925 Sterling Silver': 4871,  'Yellow Gold Overlay': 4871,  'Rose Gold Overlay': 4871,  'White Gold Overlay': 4871,
    '9k Yellow Gold': 40774, '9k Rose Gold': 40774, '9k White Gold': 40774,
    '14k Yellow Gold': 57855, '14k Rose Gold': 57855, '14k White Gold': 57855,
    '18k Yellow Gold': 76589, '18k Rose Gold': 76589, '18k White Gold': 76589,
  },

  // ── Vintage Radiant Cut Moissanite Engagement Ring, Do (base ₹5,209) ──
  'fjws-4541257885': {
    '925 Sterling Silver': 5209,  'Yellow Gold Overlay': 5209,  'Rose Gold Overlay': 5209,  'White Gold Overlay': 5209,
    '9k Yellow Gold': 40323, '9k Rose Gold': 40323, '9k White Gold': 40323,
    '14k Yellow Gold': 59508, '14k Rose Gold': 59508, '14k White Gold': 59508,
    '18k Yellow Gold': 77341, '18k Rose Gold': 77341, '18k White Gold': 77341,
  },

  // ── Vintage Round Moissanite Engagement Ring, Unique P (base ₹4,358) ──
  'fjws-4541251463': {
    '925 Sterling Silver': 4358,  'Yellow Gold Overlay': 4358,  'Rose Gold Overlay': 4358,  'White Gold Overlay': 4358,
    '9k Yellow Gold': 40023, '9k Rose Gold': 40023, '9k White Gold': 40023,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75087, '18k Rose Gold': 75087, '18k White Gold': 75087,
  },

  // ── Gold Opal Ring, Pear Dainty Opal Engagement Ring,  (base ₹6,462) ──
  'fjws-4541246137': {
    '925 Sterling Silver': 6462,  'Yellow Gold Overlay': 6462,  'Rose Gold Overlay': 6462,  'White Gold Overlay': 6462,
    '9k Yellow Gold': 44030, '9k Rose Gold': 44030, '9k White Gold': 44030,
    '14k Yellow Gold': 62564, '14k Rose Gold': 62564, '14k White Gold': 62564,
    '18k Yellow Gold': 80096, '18k Rose Gold': 80096, '18k White Gold': 80096,
  },

  // ── Oval Moissanite Engagement Ring, Infinity Twist Ba (base ₹4,709) ──
  'fjws-4540706677': {
    '925 Sterling Silver': 4709,  'Yellow Gold Overlay': 4709,  'Rose Gold Overlay': 4709,  'White Gold Overlay': 4709,
    '9k Yellow Gold': 40023, '9k Rose Gold': 40023, '9k White Gold': 40023,
    '14k Yellow Gold': 55601, '14k Rose Gold': 55601, '14k White Gold': 55601,
    '18k Yellow Gold': 75638, '18k Rose Gold': 75638, '18k White Gold': 75638,
  },

  // ── Moss Agate Engagement Ring, Gold Garnet & Moissani (base ₹5,109) ──
  'fjws-4540703386': {
    '925 Sterling Silver': 5109,  'Yellow Gold Overlay': 5109,  'Rose Gold Overlay': 5109,  'White Gold Overlay': 5109,
    '9k Yellow Gold': 39772, '9k Rose Gold': 39772, '9k White Gold': 39772,
    '14k Yellow Gold': 56052, '14k Rose Gold': 56052, '14k White Gold': 56052,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Vintage Baguette Cut Moss Agate Ring, Natural Agat (base ₹5,109) ──
  'fjws-4540681655': {
    '925 Sterling Silver': 5109,  'Yellow Gold Overlay': 5109,  'Rose Gold Overlay': 5109,  'White Gold Overlay': 5109,
    '9k Yellow Gold': 39772, '9k Rose Gold': 39772, '9k White Gold': 39772,
    '14k Yellow Gold': 56052, '14k Rose Gold': 56052, '14k White Gold': 56052,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Flower Moissanite Engagement Ring, Unique Nature I (base ₹6,362) ──
  'fjws-4540678901': {
    '925 Sterling Silver': 6362,  'Yellow Gold Overlay': 6362,  'Rose Gold Overlay': 6362,  'White Gold Overlay': 6362,
    '9k Yellow Gold': 42828, '9k Rose Gold': 42828, '9k White Gold': 42828,
    '14k Yellow Gold': 61111, '14k Rose Gold': 61111, '14k White Gold': 61111,
    '18k Yellow Gold': 81148, '18k Rose Gold': 81148, '18k White Gold': 81148,
  },

  // ── Marquise Moissanite Moss Agate Engagement Ring, Vi (base ₹5,109) ──
  'fjws-4515005730': {
    '925 Sterling Silver': 5109,  'Yellow Gold Overlay': 5109,  'Rose Gold Overlay': 5109,  'White Gold Overlay': 5109,
    '9k Yellow Gold': 42577, '9k Rose Gold': 42577, '9k White Gold': 42577,
    '14k Yellow Gold': 65119, '14k Rose Gold': 65119, '14k White Gold': 65119,
    '18k Yellow Gold': 80146, '18k Rose Gold': 80146, '18k White Gold': 80146,
  },

  // ── Blue Sapphire Engagement Ring, 14k Gold Round Cut  (base ₹4,759) ──
  'fjws-4537514271': {
    '925 Sterling Silver': 4759,  'Yellow Gold Overlay': 4759,  'Rose Gold Overlay': 4759,  'White Gold Overlay': 4759,
    '9k Yellow Gold': 39522, '9k Rose Gold': 39522, '9k White Gold': 39522,
    '14k Yellow Gold': 57555, '14k Rose Gold': 57555, '14k White Gold': 57555,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Italian Horn Pendant Necklace for Unisex, Gold Pla (base ₹8,516) ──
  'fjws-4537504900': {
    '925 Sterling Silver': 8516,  'Yellow Gold Overlay': 8516,  'Rose Gold Overlay': 8516,  'White Gold Overlay': 8516,
  },

  // ── Nature Inspired Leaf Necklace, Round Moissanite Pe (base ₹9,117) ──
  'fjws-4536960480': {
    '925 Sterling Silver': 9117,  'Yellow Gold Overlay': 9117,  'Rose Gold Overlay': 9117,  'White Gold Overlay': 9117,
  },

  // ── Swan Moissanite Pendant Necklace, Gold Swan Bird N (base ₹9,918) ──
  'fjws-4536942361': {
    '925 Sterling Silver': 9918,  'Yellow Gold Overlay': 9918,  'Rose Gold Overlay': 9918,  'White Gold Overlay': 9918,
  },

  // ── Round Cut Natural Rose Quartz Ring, Rose Gold Leaf (base ₹5,632) ──
  'fjws-4536954468': {
    '925 Sterling Silver': 5632,  'Yellow Gold Overlay': 5632,  'Rose Gold Overlay': 5632,  'White Gold Overlay': 5632,
    '9k Yellow Gold': 40023, '9k Rose Gold': 40023, '9k White Gold': 40023,
    '14k Yellow Gold': 57354, '14k Rose Gold': 57354, '14k White Gold': 57354,
    '18k Yellow Gold': 77641, '18k Rose Gold': 77641, '18k White Gold': 77641,
  },

  // ── Coffin Cut Red Garnet Ring, Black Gold Art Deco Le (base ₹6,011) ──
  'fjws-4536946342': {
    '925 Sterling Silver': 6011,  'Yellow Gold Overlay': 6011,  'Rose Gold Overlay': 5260,  'White Gold Overlay': 6011,
    '9k Yellow Gold': 42577, '9k Rose Gold': 42577, '9k White Gold': 42577,
    '14k Yellow Gold': 60109, '14k Rose Gold': 60109, '14k White Gold': 60109,
    '18k Yellow Gold': 77641, '18k Rose Gold': 77641, '18k White Gold': 77641,
  },

  // ── Blue Sapphire Coffin Ring, Black Gold Engagement R (base ₹6,011) ──
  'fjws-4536927501': {
    '925 Sterling Silver': 6011,  'Yellow Gold Overlay': 6011,  'Rose Gold Overlay': 5260,  'White Gold Overlay': 6011,
    '9k Yellow Gold': 42577, '9k Rose Gold': 42577, '9k White Gold': 42577,
    '14k Yellow Gold': 60109, '14k Rose Gold': 60109, '14k White Gold': 60109,
    '18k Yellow Gold': 77641, '18k Rose Gold': 77641, '18k White Gold': 77641,
  },

  // ── Marquise Cut Sapphire Wedding Ring, East-West Bypa (base ₹4,208) ──
  'fjws-4514561680': {
    '925 Sterling Silver': 4208,  'Yellow Gold Overlay': 4208,  'Rose Gold Overlay': 4208,  'White Gold Overlay': 4208,
    '9k Yellow Gold': 39071, '9k Rose Gold': 39071, '9k White Gold': 39071,
    '14k Yellow Gold': 60059, '14k Rose Gold': 60059, '14k White Gold': 60059,
    '18k Yellow Gold': 74135, '18k Rose Gold': 74135, '18k White Gold': 74135,
  },

  // ── Emerald Cut Moonstone Engagement Ring, Rainbow Moo (base ₹5,260) ──
  'fjws-4536051700': {
    '925 Sterling Silver': 5260,  'Yellow Gold Overlay': 5260,  'Rose Gold Overlay': 5260,  'White Gold Overlay': 5260,
    '9k Yellow Gold': 40173, '9k Rose Gold': 40173, '9k White Gold': 40173,
    '14k Yellow Gold': 58106, '14k Rose Gold': 58106, '14k White Gold': 58106,
    '18k Yellow Gold': 75888, '18k Rose Gold': 75888, '18k White Gold': 75888,
  },

  // ── Unique Green Amethyst Ring 14k Yellow Gold Emerald (base ₹4,759) ──
  'fjws-4536045770': {
    '925 Sterling Silver': 4759,  'Yellow Gold Overlay': 4759,  'Rose Gold Overlay': 4759,  'White Gold Overlay': 4759,
    '9k Yellow Gold': 40023, '9k Rose Gold': 40023, '9k White Gold': 40023,
    '14k Yellow Gold': 56052, '14k Rose Gold': 56052, '14k White Gold': 56052,
    '18k Yellow Gold': 76589, '18k Rose Gold': 76589, '18k White Gold': 76589,
  },

  // ── Oval Moissanite Ring, East West Diamond Oval Cut R (base ₹5,009) ──
  'fjws-4536030631': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '9k Yellow Gold': 40574, '9k Rose Gold': 40574, '9k White Gold': 40574,
    '14k Yellow Gold': 57555, '14k Rose Gold': 57555, '14k White Gold': 57555,
    '18k Yellow Gold': 76139, '18k Rose Gold': 76139, '18k White Gold': 76139,
  },

  // ── Oval Opal Ring Set, 3pcs Oval Opal Engagement Ring (base ₹12,022) ──
  'fjws-4536032826': {
    '925 Sterling Silver': 12022,  'Yellow Gold Overlay': 12022,  'Rose Gold Overlay': 12022,  'White Gold Overlay': 12022,
    '9k Yellow Gold': 60109, '9k Rose Gold': 60109, '9k White Gold': 60109,
    '14k Yellow Gold': 87159, '14k Rose Gold': 87159, '14k White Gold': 87159,
    '18k Yellow Gold': 110201, '18k Rose Gold': 110201, '18k White Gold': 110201,
  },

  // ── Marquise Cut Garnet Ring, 14K Yellow Gold Split Sh (base ₹4,258) ──
  'fjws-4519409672': {
    '925 Sterling Silver': 4258,  'Yellow Gold Overlay': 4258,  'Rose Gold Overlay': 4258,  'White Gold Overlay': 4258,
    '9k Yellow Gold': 35565, '9k Rose Gold': 35565, '9k White Gold': 35565,
    '14k Yellow Gold': 52546, '14k Rose Gold': 52546, '14k White Gold': 52546,
    '18k Yellow Gold': 72582, '18k Rose Gold': 72582, '18k White Gold': 72582,
  },

  // ── Natural Labradorite Diamond Summer jewelry, Moon C (base ₹4,508) ──
  'fjws-4520626591': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '9k Yellow Gold': 37067, '9k Rose Gold': 37067, '9k White Gold': 37067,
    '14k Yellow Gold': 60109, '14k Rose Gold': 60109, '14k White Gold': 60109,
    '18k Yellow Gold': 74135, '18k Rose Gold': 74135, '18k White Gold': 74135,
  },

  // ── Smoky Quartz & Black Onyx Ring, Emerald Cut Smoky  (base ₹5,009) ──
  'fjws-4535623074': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '9k Yellow Gold': 40574, '9k Rose Gold': 40574, '9k White Gold': 40574,
    '14k Yellow Gold': 59558, '14k Rose Gold': 59558, '14k White Gold': 59558,
    '18k Yellow Gold': 76088, '18k Rose Gold': 76088, '18k White Gold': 76088,
  },

  // ── Emerald Cut Opal Engagement Ring, Natural Ethiopia (base ₹4,258) ──
  'fjws-4535611184': {
    '925 Sterling Silver': 4258,  'Yellow Gold Overlay': 4258,  'Rose Gold Overlay': 4258,  'White Gold Overlay': 4258,
    '9k Yellow Gold': 39472, '9k Rose Gold': 39472, '9k White Gold': 39472,
    '14k Yellow Gold': 57555, '14k Rose Gold': 57555, '14k White Gold': 57555,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Emerald Cut Moissanite Engagement Ring, Wide Band  (base ₹4,859) ──
  'fjws-4535592053': {
    '925 Sterling Silver': 4859,  'Yellow Gold Overlay': 4859,  'Rose Gold Overlay': 4859,  'White Gold Overlay': 4859,
    '9k Yellow Gold': 40123, '9k Rose Gold': 40123, '9k White Gold': 40123,
    '14k Yellow Gold': 59057, '14k Rose Gold': 59057, '14k White Gold': 59057,
    '18k Yellow Gold': 76589, '18k Rose Gold': 76589, '18k White Gold': 76589,
  },

  // ── Alternating Oval Moissanite Wedding Band, Solid Go (base ₹4,959) ──
  'fjws-4535598806': {
    '925 Sterling Silver': 4959,  'Yellow Gold Overlay': 4959,  'Rose Gold Overlay': 4959,  'White Gold Overlay': 4959,
    '9k Yellow Gold': 40023, '9k Rose Gold': 40023, '9k White Gold': 40023,
    '14k Yellow Gold': 57555, '14k Rose Gold': 57555, '14k White Gold': 57555,
    '18k Yellow Gold': 76139, '18k Rose Gold': 76139, '18k White Gold': 76139,
  },

  // ── Oval Moissanite Ring 14k Solid Gold Floating Gem R (base ₹4,007) ──
  'fjws-4535520924': {
    '925 Sterling Silver': 4007,  'Yellow Gold Overlay': 4007,  'Rose Gold Overlay': 4007,  'White Gold Overlay': 4007,
    '9k Yellow Gold': 40023, '9k Rose Gold': 40023, '9k White Gold': 40023,
    '14k Yellow Gold': 57555, '14k Rose Gold': 57555, '14k White Gold': 57555,
    '18k Yellow Gold': 75087, '18k Rose Gold': 75087, '18k White Gold': 75087,
  },

  // ── Gold Belly Button Ring with Pink Heart Sapphire &  (base ₹6,913) ──
  'fjws-4533236747': {
    '925 Sterling Silver': 6913,  'Yellow Gold Overlay': 6913,  'Rose Gold Overlay': 6913,  'White Gold Overlay': 6913,
    '9k Yellow Gold': 42527, '9k Rose Gold': 42527, '9k White Gold': 42527,
    '14k Yellow Gold': 58106, '14k Rose Gold': 58106, '14k White Gold': 58106,
    '18k Yellow Gold': 76139, '18k Rose Gold': 76139, '18k White Gold': 76139,
  },

  // ── Personalized Custom Name Ring, Dainty Believe Band (base ₹5,911) ──
  'fjws-4533243820': {
    '925 Sterling Silver': 5911,  'Yellow Gold Overlay': 5911,  'Rose Gold Overlay': 5911,  'White Gold Overlay': 5911,
    '9k Yellow Gold': 41025, '9k Rose Gold': 41025, '9k White Gold': 41025,
    '14k Yellow Gold': 60059, '14k Rose Gold': 60059, '14k White Gold': 60059,
    '18k Yellow Gold': 75588, '18k Rose Gold': 75588, '18k White Gold': 75588,
  },

  // ── Personalized Custom Name Ring, Dainty Moissanite B (base ₹5,911) ──
  'fjws-4533234750': {
    '925 Sterling Silver': 5911,  'Yellow Gold Overlay': 5911,  'Rose Gold Overlay': 5911,  'White Gold Overlay': 5911,
    '9k Yellow Gold': 41025, '9k Rose Gold': 41025, '9k White Gold': 41025,
    '14k Yellow Gold': 60059, '14k Rose Gold': 60059, '14k White Gold': 60059,
    '18k Yellow Gold': 75588, '18k Rose Gold': 75588, '18k White Gold': 75588,
  },

  // ── Personalized Custom Name Ring, Dainty Moissanite B (base ₹5,911) ──
  'fjws-4533233900': {
    '925 Sterling Silver': 5911,  'Yellow Gold Overlay': 5911,  'Rose Gold Overlay': 5911,  'White Gold Overlay': 5911,
    '9k Yellow Gold': 41025, '9k Rose Gold': 41025, '9k White Gold': 41025,
    '14k Yellow Gold': 60059, '14k Rose Gold': 60059, '14k White Gold': 60059,
    '18k Yellow Gold': 75588, '18k Rose Gold': 75588, '18k White Gold': 75588,
  },

  // ── Gold Sun Earrings, Citrine Sun Drop Earrings, Boho (base ₹14,476) ──
  'fjws-4533216209': {
    '925 Sterling Silver': 14476,  'Yellow Gold Overlay': 14476,  'Rose Gold Overlay': 14476,  'White Gold Overlay': 14476,
    '9k Yellow Gold': 62564, '9k Rose Gold': 62564, '9k White Gold': 62564,
    '14k Yellow Gold': 78142, '14k Rose Gold': 78142, '14k White Gold': 78142,
    '18k Yellow Gold': 100132, '18k Rose Gold': 100132, '18k White Gold': 100132,
  },

  // ── Red Garnet Engagement Ring Set, Yellow Gold Marqui (base ₹10,018) ──
  'fjws-4531360245': {
    '925 Sterling Silver': 10018,  'Yellow Gold Overlay': 10018,  'Rose Gold Overlay': 10018,  'White Gold Overlay': 10018,
    '9k Yellow Gold': 60109, '9k Rose Gold': 60109, '9k White Gold': 60109,
    '14k Yellow Gold': 85155, '14k Rose Gold': 85155, '14k White Gold': 85155,
    '18k Yellow Gold': 100182, '18k Rose Gold': 100182, '18k White Gold': 100182,
  },

  // ── Pear Cut Black Onyx Wedding Ring Set, Diamond Clus (base ₹10,519) ──
  'fjws-4531354621': {
    '925 Sterling Silver': 10519,  'Yellow Gold Overlay': 10519,  'Rose Gold Overlay': 10519,  'White Gold Overlay': 10519,
    '9k Yellow Gold': 60109, '9k Rose Gold': 60109, '9k White Gold': 60109,
    '14k Yellow Gold': 85105, '14k Rose Gold': 85105, '14k White Gold': 85105,
    '18k Yellow Gold': 102637, '18k Rose Gold': 102637, '18k White Gold': 102637,
  },

  // ── Vintage Oval Moss Agate Engagement Ring Set, Natur (base ₹9,968) ──
  'fjws-4531362236': {
    '925 Sterling Silver': 9968,  'Yellow Gold Overlay': 9968,  'Rose Gold Overlay': 9968,  'White Gold Overlay': 9968,
    '9k Yellow Gold': 60109, '9k Rose Gold': 60109, '9k White Gold': 60109,
    '14k Yellow Gold': 85105, '14k Rose Gold': 85105, '14k White Gold': 85105,
    '18k Yellow Gold': 100132, '18k Rose Gold': 100132, '18k White Gold': 100132,
  },

  // ── Princess Cut Alexandrite Engagement Ring Set, 3pcs (base ₹14,026) ──
  'fjws-4531354192': {
    '925 Sterling Silver': 14026,  'Yellow Gold Overlay': 14026,  'Rose Gold Overlay': 14026,  'White Gold Overlay': 14026,
    '9k Yellow Gold': 75137, '9k Rose Gold': 75137, '9k White Gold': 75137,
    '14k Yellow Gold': 90114, '14k Rose Gold': 90114, '14k White Gold': 90114,
    '18k Yellow Gold': 115160, '18k Rose Gold': 115160, '18k White Gold': 115160,
  },

  // ── Blue Sapphire Gold Hoop Earrings 14K Gold Vermeil, (base ₹14,276) ──
  'fjws-4529748804': {
    '925 Sterling Silver': 14276,  'Yellow Gold Overlay': 14276,  'Rose Gold Overlay': 14276,  'White Gold Overlay': 14276,
    '9k Yellow Gold': 65068, '9k Rose Gold': 65068, '9k White Gold': 65068,
    '14k Yellow Gold': 80096, '14k Rose Gold': 80096, '14k White Gold': 80096,
    '18k Yellow Gold': 90114, '18k Rose Gold': 90114, '18k White Gold': 90114,
  },

  // ── Oval Red Ruby Drop Earrings, Gold Hoop Earrings, E (base ₹14,276) ──
  'fjws-4529745096': {
    '925 Sterling Silver': 14276,  'Yellow Gold Overlay': 14276,  'Rose Gold Overlay': 14276,  'White Gold Overlay': 14276,
    '9k Yellow Gold': 65068, '9k Rose Gold': 65068, '9k White Gold': 65068,
    '14k Yellow Gold': 80096, '14k Rose Gold': 80096, '14k White Gold': 80096,
    '18k Yellow Gold': 90114, '18k Rose Gold': 90114, '18k White Gold': 90114,
  },

  // ── Oval Pearl Drop Earrings, Gold Huggie Hoop Earring (base ₹14,276) ──
  'fjws-4529742604': {
    '925 Sterling Silver': 14276,  'Yellow Gold Overlay': 14276,  'Rose Gold Overlay': 14276,  'White Gold Overlay': 14276,
    '9k Yellow Gold': 65068, '9k Rose Gold': 65068, '9k White Gold': 65068,
    '14k Yellow Gold': 80096, '14k Rose Gold': 80096, '14k White Gold': 80096,
    '18k Yellow Gold': 90114, '18k Rose Gold': 90114, '18k White Gold': 90114,
  },

  // ── Sapphire Bridal Earrings, Genuine Sapphire Vintage (base ₹14,526) ──
  'fjws-4529736118': {
    '925 Sterling Silver': 14526,  'Yellow Gold Overlay': 14526,  'Rose Gold Overlay': 14526,  'White Gold Overlay': 14526,
    '9k Yellow Gold': 65119, '9k Rose Gold': 65119, '9k White Gold': 65119,
    '14k Yellow Gold': 82600, '14k Rose Gold': 82600, '14k White Gold': 82600,
    '18k Yellow Gold': 100132, '18k Rose Gold': 100132, '18k White Gold': 100132,
  },

  // ── Blue Sapphire Teardrop Earrings, Gold Huggie Hoop  (base ₹14,026) ──
  'fjws-4529732706': {
    '925 Sterling Silver': 14026,  'Yellow Gold Overlay': 14026,  'Rose Gold Overlay': 14026,  'White Gold Overlay': 14026,
    '9k Yellow Gold': 65119, '9k Rose Gold': 65119, '9k White Gold': 65119,
    '14k Yellow Gold': 82600, '14k Rose Gold': 82600, '14k White Gold': 82600,
    '18k Yellow Gold': 100132, '18k Rose Gold': 100132, '18k White Gold': 100132,
  },

  // ── Butterfly Huggie Hoop Earrings, Gold CZ Butterfly  (base ₹15,528) ──
  'fjws-4529729156': {
    '925 Sterling Silver': 15528,  'Yellow Gold Overlay': 15528,  'Rose Gold Overlay': 15528,  'White Gold Overlay': 15528,
    '9k Yellow Gold': 65119, '9k Rose Gold': 65119, '9k White Gold': 65119,
    '14k Yellow Gold': 82600, '14k Rose Gold': 82600, '14k White Gold': 82600,
    '18k Yellow Gold': 100132, '18k Rose Gold': 100132, '18k White Gold': 100132,
  },

  // ── Pearl Drop Earrings, Red Blue Gem Earrings, Ruby & (base ₹16,029) ──
  'fjws-4529712379': {
    '925 Sterling Silver': 16029,  'Yellow Gold Overlay': 16029,  'Rose Gold Overlay': 16029,  'White Gold Overlay': 16029,
    '9k Yellow Gold': 67573, '9k Rose Gold': 67573, '9k White Gold': 67573,
    '14k Yellow Gold': 85155, '14k Rose Gold': 85155, '14k White Gold': 85155,
    '18k Yellow Gold': 100182, '18k Rose Gold': 100182, '18k White Gold': 100182,
  },

  // ── Emerald Green Leaf Earrings, Gold Leaf Dangle Earr (base ₹15,027) ──
  'fjws-4529708135': {
    '925 Sterling Silver': 15027,  'Yellow Gold Overlay': 15027,  'Rose Gold Overlay': 15027,  'White Gold Overlay': 15027,
    '9k Yellow Gold': 65119, '9k Rose Gold': 65119, '9k White Gold': 65119,
    '14k Yellow Gold': 82600, '14k Rose Gold': 82600, '14k White Gold': 82600,
    '18k Yellow Gold': 100132, '18k Rose Gold': 100132, '18k White Gold': 100132,
  },

  // ── Lesbian Scissors Necklace, Gold Hair Stylist Gift, (base ₹9,267) ──
  'fjws-4529704808': {
    '925 Sterling Silver': 9267,  'Yellow Gold Overlay': 9267,  'Rose Gold Overlay': 9267,  'White Gold Overlay': 9267,
  },

  // ── Hummingbird Necklace, Dainty Bird Pendant for Wome (base ₹8,516) ──
  'fjws-4529702558': {
    '925 Sterling Silver': 8516,  'Yellow Gold Overlay': 8516,  'Rose Gold Overlay': 8516,  'White Gold Overlay': 8516,
  },

  // ── Flower Diamond Necklace, Floral Pendant Necklace,  (base ₹8,916) ──
  'fjws-4529687601': {
    '925 Sterling Silver': 8916,  'Yellow Gold Overlay': 8916,  'Rose Gold Overlay': 8916,  'White Gold Overlay': 8916,
  },

  // ── Cushion Cut Diamond Necklace, Solitaire Pendant Ne (base ₹8,516) ──
  'fjws-4529686173': {
    '925 Sterling Silver': 8516,  'Yellow Gold Overlay': 8516,  'Rose Gold Overlay': 8516,  'White Gold Overlay': 8516,
  },

  // ── Elegant Pearl Drop Necklace, White Pearl Pendant,  (base ₹10,018) ──
  'fjws-4529698262': {
    '925 Sterling Silver': 10018,  'Yellow Gold Overlay': 10018,  'Rose Gold Overlay': 10018,  'White Gold Overlay': 10018,
  },

  // ── Gold Heart Solitaire Necklace, Heart Shaped Diamon (base ₹8,616) ──
  'fjws-4529677955': {
    '925 Sterling Silver': 8616,  'Yellow Gold Overlay': 8616,  'Rose Gold Overlay': 8616,  'White Gold Overlay': 8616,
  },

  // ── Luxury Aquamarine Gemstone Necklace, Unique 18k Go (base ₹8,966) ──
  'fjws-4529657901': {
    '925 Sterling Silver': 8966,  'Yellow Gold Overlay': 8966,  'Rose Gold Overlay': 8966,  'White Gold Overlay': 8966,
  },

  // ── Luxury Pineapple Pendant Necklace with Oval Yellow (base ₹10,018) ──
  'fjws-4529655297': {
    '925 Sterling Silver': 10018,  'Yellow Gold Overlay': 10018,  'Rose Gold Overlay': 10018,  'White Gold Overlay': 10018,
  },

  // ── Citrine Sun Pendant Necklace, Gold Celestial Jewel (base ₹9,517) ──
  'fjws-4526651578': {
    '925 Sterling Silver': 9517,  'Yellow Gold Overlay': 9517,  'Rose Gold Overlay': 9517,  'White Gold Overlay': 9517,
  },

  // ── Pearl Bridal Earrings, Teardrop Pearl Dangle Earri (base ₹12,773) ──
  'fjws-4528370328': {
    '925 Sterling Silver': 12773,  'Yellow Gold Overlay': 12773,  'Rose Gold Overlay': 12773,  'White Gold Overlay': 12773,
    '9k Yellow Gold': 60059, '9k Rose Gold': 60059, '9k White Gold': 60059,
    '14k Yellow Gold': 75087, '14k Rose Gold': 75087, '14k White Gold': 75087,
    '18k Yellow Gold': 90114, '18k Rose Gold': 90114, '18k White Gold': 90114,
  },

  // ── Solid 14k Gold Bird Pendant, Flying Bird Pendant,  (base ₹6,261) ──
  'fjws-4528362218': {
    '925 Sterling Silver': 6261,  'Yellow Gold Overlay': 6261,  'Rose Gold Overlay': 6261,  'White Gold Overlay': 6261,
  },

  // ── Blue Sapphire Sea Turtle Necklace, Gold Turtle Pen (base ₹7,514) ──
  'fjws-4524997806': {
    '925 Sterling Silver': 7514,  'Yellow Gold Overlay': 7514,  'Rose Gold Overlay': 7514,  'White Gold Overlay': 7514,
  },

  // ── Pear Ruby Engagement Ring, January Birthstone Ring (base ₹5,510) ──
  'fjws-4527197597': {
    '925 Sterling Silver': 5510,  'Yellow Gold Overlay': 5510,  'Rose Gold Overlay': 5510,  'White Gold Overlay': 5510,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Citrine Toi Et Moi Ring, Oval Yellow Gemstone Enga (base ₹4,959) ──
  'fjws-4527198224': {
    '925 Sterling Silver': 4959,  'Yellow Gold Overlay': 4959,  'Rose Gold Overlay': 4959,  'White Gold Overlay': 4959,
    '9k Yellow Gold': 40023, '9k Rose Gold': 40023, '9k White Gold': 40023,
    '14k Yellow Gold': 60059, '14k Rose Gold': 60059, '14k White Gold': 60059,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Dainty Baguette Cut Aquamarine Ring, Five Gemstone (base ₹6,011) ──
  'fjws-4527173921': {
    '925 Sterling Silver': 6011,  'Yellow Gold Overlay': 6011,  'Rose Gold Overlay': 6011,  'White Gold Overlay': 6011,
    '9k Yellow Gold': 40824, '9k Rose Gold': 40824, '9k White Gold': 40824,
    '14k Yellow Gold': 58056, '14k Rose Gold': 58056, '14k White Gold': 58056,
    '18k Yellow Gold': 75187, '18k Rose Gold': 75187, '18k White Gold': 75187,
  },

  // ── Marquise Cut Moissanite Engagement Ring, Vintage C (base ₹6,462) ──
  'fjws-4527169897': {
    '925 Sterling Silver': 6462,  'Yellow Gold Overlay': 6462,  'Rose Gold Overlay': 6462,  'White Gold Overlay': 6462,
    '9k Yellow Gold': 41075, '9k Rose Gold': 41075, '9k White Gold': 41075,
    '14k Yellow Gold': 60059, '14k Rose Gold': 60059, '14k White Gold': 60059,
    '18k Yellow Gold': 76088, '18k Rose Gold': 76088, '18k White Gold': 76088,
  },

  // ── Marquise Moss Agate Wedding Band, 14K Rose Gold Ba (base ₹4,007) ──
  'fjws-4527163359': {
    '925 Sterling Silver': 4007,  'Yellow Gold Overlay': 4007,  'Rose Gold Overlay': 4007,  'White Gold Overlay': 4007,
    '9k Yellow Gold': 38019, '9k Rose Gold': 38019, '9k White Gold': 38019,
    '14k Yellow Gold': 52546, '14k Rose Gold': 52546, '14k White Gold': 52546,
    '18k Yellow Gold': 70078, '18k Rose Gold': 70078, '18k White Gold': 70078,
  },

  // ── Oval Shaped Lapis Lazuli Ring, Vintage Unique Mois (base ₹5,460) ──
  'fjws-4527164194': {
    '925 Sterling Silver': 5460,  'Yellow Gold Overlay': 5460,  'Rose Gold Overlay': 5460,  'White Gold Overlay': 5460,
    '9k Yellow Gold': 40524, '9k Rose Gold': 40524, '9k White Gold': 40524,
    '14k Yellow Gold': 55050, '14k Rose Gold': 55050, '14k White Gold': 55050,
    '18k Yellow Gold': 75087, '18k Rose Gold': 75087, '18k White Gold': 75087,
  },

  // ── Green Emerald & Moissanite Ring, Art Deco Cluster  (base ₹5,009) ──
  'fjws-4526705729': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '9k Yellow Gold': 39572, '9k Rose Gold': 39572, '9k White Gold': 39572,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── 14K Gold Plated Marquise Cut Moissanite Ring, Dain (base ₹4,909) ──
  'fjws-4526699455': {
    '925 Sterling Silver': 4909,  'Yellow Gold Overlay': 4909,  'Rose Gold Overlay': 4909,  'White Gold Overlay': 4909,
    '9k Yellow Gold': 39572, '9k Rose Gold': 39572, '9k White Gold': 39572,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Open Diamond Ring In 14K Gold:- Marquise Cut Round (base ₹5,760) ──
  'fjws-4526687255': {
    '925 Sterling Silver': 5760,  'Yellow Gold Overlay': 5760,  'Rose Gold Overlay': 5760,  'White Gold Overlay': 5760,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Ruby Teardrop Dangle Earrings, July Birthstone Ear (base ₹13,525) ──
  'fjws-4526609517': {
    '925 Sterling Silver': 13525,  'Yellow Gold Overlay': 13525,  'Rose Gold Overlay': 13525,  'White Gold Overlay': 13525,
    '9k Yellow Gold': 60109, '9k Rose Gold': 60109, '9k White Gold': 60109,
    '14k Yellow Gold': 75137, '14k Rose Gold': 75137, '14k White Gold': 75137,
    '18k Yellow Gold': 90164, '18k Rose Gold': 90164, '18k White Gold': 90164,
  },

  // ── Mystic Alexandrite Earrings, Blue Teardrop Earring (base ₹14,026) ──
  'fjws-4526613802': {
    '925 Sterling Silver': 14026,  'Yellow Gold Overlay': 14026,  'Rose Gold Overlay': 14026,  'White Gold Overlay': 14026,
    '9k Yellow Gold': 60109, '9k Rose Gold': 60109, '9k White Gold': 60109,
    '14k Yellow Gold': 75137, '14k Rose Gold': 75137, '14k White Gold': 75137,
    '18k Yellow Gold': 90164, '18k Rose Gold': 90164, '18k White Gold': 90164,
  },

  // ── Moonstone Evil Eye Pendant Necklace, Gold Protecti (base ₹9,517) ──
  'fjws-4526608132': {
    '925 Sterling Silver': 9517,  'Yellow Gold Overlay': 9517,  'Rose Gold Overlay': 9517,  'White Gold Overlay': 9517,
  },

  // ── Moonstone Teddy Bear Necklace, Gold Bear Pendant,  (base ₹9,016) ──
  'fjws-4526604172': {
    '925 Sterling Silver': 9016,  'Yellow Gold Overlay': 9016,  'Rose Gold Overlay': 9016,  'White Gold Overlay': 9016,
  },

  // ── 2.5CT Oval Cut Moissanite Solitaire Engagement Rin (base ₹4,208) ──
  'fjws-4514460848': {
    '925 Sterling Silver': 4208,  'Yellow Gold Overlay': 4208,  'Rose Gold Overlay': 4208,  'White Gold Overlay': 4208,
    '9k Yellow Gold': 39071, '9k Rose Gold': 39071, '9k White Gold': 39071,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 74636, '18k Rose Gold': 74636, '18k White Gold': 74636,
  },

  // ── Snowflake Necklace, Sterling Silver Snowflake Pend (base ₹5,760) ──
  'fjws-4524986412': {
    '925 Sterling Silver': 5760,  'Yellow Gold Overlay': 5760,  'Rose Gold Overlay': 5760,  'White Gold Overlay': 6261,
  },

  // ── Purple Butterfly Necklace, Marquise Amethyst Butte (base ₹7,764) ──
  'fjws-4524981826': {
    '925 Sterling Silver': 7764,  'Yellow Gold Overlay': 7764,  'Rose Gold Overlay': 7764,  'White Gold Overlay': 7764,
  },

  // ── Minimalist Cat Necklace, 925 Sterling Silver Cat N (base ₹6,261) ──
  'fjws-4524963821': {
    '925 Sterling Silver': 6261,  'Yellow Gold Overlay': 6261,  'Rose Gold Overlay': 6261,  'White Gold Overlay': 6261,
  },

  // ── Gold Bow Nose Pin, Crystal Nose Ring, Dainty Nose  (base ₹5,009) ──
  'fjws-4524485399': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 70128, '18k Rose Gold': 70128, '18k White Gold': 70128,
  },

  // ── Gold Nose Pin for Women, Gold Floral Nose Stud, Sn (base ₹5,009) ──
  'fjws-4524489906': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 70128, '18k Rose Gold': 70128, '18k White Gold': 70128,
  },

  // ── Labradorite Stud Earrings, 925 Sterling Silver, Br (base ₹11,521) ──
  'fjws-4524459595': {
    '925 Sterling Silver': 11521,  'Yellow Gold Overlay': 11521,  'Rose Gold Overlay': 11521,  'White Gold Overlay': 11521,
    '9k Yellow Gold': 60059, '9k Rose Gold': 60059, '9k White Gold': 60059,
    '14k Yellow Gold': 75087, '14k Rose Gold': 75087, '14k White Gold': 75087,
    '18k Yellow Gold': 87660, '18k Rose Gold': 87660, '18k White Gold': 87660,
  },

  // ── Natural Moss Agate Round Shaped Earrings, 925 Ster (base ₹13,024) ──
  'fjws-4524463782': {
    '925 Sterling Silver': 13024,  'Yellow Gold Overlay': 13024,  'Rose Gold Overlay': 13024,  'White Gold Overlay': 13024,
    '9k Yellow Gold': 60059, '9k Rose Gold': 60059, '9k White Gold': 60059,
    '14k Yellow Gold': 75087, '14k Rose Gold': 75087, '14k White Gold': 75087,
    '18k Yellow Gold': 87660, '18k Rose Gold': 87660, '18k White Gold': 87660,
  },

  // ── Blue Star Sapphire Earrings, Gold Dangle Earrings, (base ₹14,526) ──
  'fjws-4524453797': {
    '925 Sterling Silver': 14526,  'Yellow Gold Overlay': 14526,  'Rose Gold Overlay': 14526,  'White Gold Overlay': 14526,
    '9k Yellow Gold': 60109, '9k Rose Gold': 60109, '9k White Gold': 60109,
    '14k Yellow Gold': 75137, '14k Rose Gold': 75137, '14k White Gold': 75137,
    '18k Yellow Gold': 90164, '18k Rose Gold': 90164, '18k White Gold': 90164,
  },

  // ── Ruby Red Teardrop Earrings, Emerald Green Leaf Ear (base ₹14,026) ──
  'fjws-4524450259': {
    '925 Sterling Silver': 14026,  'Yellow Gold Overlay': 14026,  'Rose Gold Overlay': 14026,  'White Gold Overlay': 14026,
    '9k Yellow Gold': 60109, '9k Rose Gold': 60109, '9k White Gold': 60109,
    '14k Yellow Gold': 75137, '14k Rose Gold': 75137, '14k White Gold': 75137,
    '18k Yellow Gold': 90164, '18k Rose Gold': 90164, '18k White Gold': 90164,
  },

  // ── Hexagon Larimar Ring, Dainty Blue Gemstone Engagem (base ₹4,759) ──
  'fjws-4524440199': {
    '925 Sterling Silver': 4759,  'Yellow Gold Overlay': 4759,  'Rose Gold Overlay': 4759,  'White Gold Overlay': 4759,
    '9k Yellow Gold': 39071, '9k Rose Gold': 39071, '9k White Gold': 39071,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 74135, '18k Rose Gold': 74135, '18k White Gold': 74135,
  },

  // ── Marquise Moissanite Ring, Minimalist Engagement Ri (base ₹4,759) ──
  'fjws-4524018582': {
    '925 Sterling Silver': 4759,  'Yellow Gold Overlay': 4759,  'Rose Gold Overlay': 4759,  'White Gold Overlay': 4759,
    '9k Yellow Gold': 39572, '9k Rose Gold': 39572, '9k White Gold': 39572,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Blue Sapphire Ring, Infinity Promise Ring, Dainty  (base ₹5,009) ──
  'fjws-4524009129': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 55050, '14k Rose Gold': 55050, '14k White Gold': 55050,
    '18k Yellow Gold': 75087, '18k Rose Gold': 75087, '18k White Gold': 75087,
  },

  // ── Diamond Snake Necklace, Serpent Pendant Necklace,  (base ₹10,018) ──
  'fjws-4524005419': {
    '925 Sterling Silver': 10018,  'Yellow Gold Overlay': 10018,  'Rose Gold Overlay': 10018,  'White Gold Overlay': 10018,
  },

  // ── Hummingbird Engagement Ring, Yellow Citrine Ring,  (base ₹11,020) ──
  'fjws-4523434752': {
    '925 Sterling Silver': 11020,  'Yellow Gold Overlay': 11020,  'Rose Gold Overlay': 11020,  'White Gold Overlay': 11020,
    '9k Yellow Gold': 66120, '9k Rose Gold': 66120, '9k White Gold': 66120,
    '14k Yellow Gold': 85205, '14k Rose Gold': 85205, '14k White Gold': 85205,
    '18k Yellow Gold': 105191, '18k Rose Gold': 105191, '18k White Gold': 105191,
  },

  // ── Minimalist Butterfly Open Ring, Nature Inspired Ad (base ₹4,909) ──
  'fjws-4523416977': {
    '925 Sterling Silver': 4909,  'Yellow Gold Overlay': 4909,  'Rose Gold Overlay': 4909,  'White Gold Overlay': 4909,
    '9k Yellow Gold': 39572, '9k Rose Gold': 39572, '9k White Gold': 39572,
    '14k Yellow Gold': 55050, '14k Rose Gold': 55050, '14k White Gold': 55050,
    '18k Yellow Gold': 75087, '18k Rose Gold': 75087, '18k White Gold': 75087,
  },

  // ── Emerald Green Pear Necklace, Teardrop Pendant Neck (base ₹7,514) ──
  'fjws-4523425242': {
    '925 Sterling Silver': 7514,  'Yellow Gold Overlay': 7514,  'Rose Gold Overlay': 7514,  'White Gold Overlay': 7514,
  },

  // ── Dainty Freshwater Pearl Necklace, Elegant Pearl Pe (base ₹6,011) ──
  'fjws-4523359805': {
    '925 Sterling Silver': 6011,  'Yellow Gold Overlay': 6011,  'Rose Gold Overlay': 6011,  'White Gold Overlay': 6011,
  },

  // ── Round Cut Moissanite Engagement Ring, Vintage Leaf (base ₹5,610) ──
  'fjws-4523361246': {
    '925 Sterling Silver': 5610,  'Yellow Gold Overlay': 5610,  'Rose Gold Overlay': 5610,  'White Gold Overlay': 5610,
    '9k Yellow Gold': 39572, '9k Rose Gold': 39572, '9k White Gold': 39572,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Elegant Silver Leaf Ring, Botanical Open Ring, Nat (base ₹5,009) ──
  'fjws-4523338284': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 55050, '14k Rose Gold': 55050, '14k White Gold': 55050,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Princess Cut Green Emerald Ring, Leaf Engagement R (base ₹6,011) ──
  'fjws-4523325175': {
    '925 Sterling Silver': 6011,  'Yellow Gold Overlay': 6011,  'Rose Gold Overlay': 6011,  'White Gold Overlay': 6011,
    '9k Yellow Gold': 41075, '9k Rose Gold': 41075, '9k White Gold': 41075,
    '14k Yellow Gold': 60109, '14k Rose Gold': 60109, '14k White Gold': 60109,
    '18k Yellow Gold': 77641, '18k Rose Gold': 77641, '18k White Gold': 77641,
  },

  // ── Personalized Initial Ring | Custom Letter Ring | N (base ₹4,508) ──
  'fjws-4522676637': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Oval Moissanite Engagement Ring Set, Twig Double C (base ₹12,523) ──
  'fjws-4522722815': {
    '925 Sterling Silver': 12523,  'Yellow Gold Overlay': 12523,  'Rose Gold Overlay': 12523,  'White Gold Overlay': 12523,
    '9k Yellow Gold': 60109, '9k Rose Gold': 60109, '9k White Gold': 60109,
    '14k Yellow Gold': 87159, '14k Rose Gold': 87159, '14k White Gold': 87159,
    '18k Yellow Gold': 110201, '18k Rose Gold': 110201, '18k White Gold': 110201,
  },

  // ── LGBT Couple Necklace | Lesbian Initial Necklace Go (base ₹5,510) ──
  'fjws-4522720342': {
    '925 Sterling Silver': 5510,  'Yellow Gold Overlay': 5510,  'Rose Gold Overlay': 5510,  'White Gold Overlay': 5510,
  },

  // ── Her and Her Couple Necklace: Lesbian Stainless Ste (base ₹6,261) ──
  'fjws-4522710627': {
    '925 Sterling Silver': 6261,  'Yellow Gold Overlay': 6261,  'Rose Gold Overlay': 6261,  'White Gold Overlay': 6261,
  },

  // ── Natural Garnet Ring: 18k Gold Plated Sterling Silv (base ₹4,258) ──
  'fjws-4522706038': {
    '925 Sterling Silver': 4258,  'Yellow Gold Overlay': 4258,  'Rose Gold Overlay': 4258,  'White Gold Overlay': 4258,
    '9k Yellow Gold': 39071, '9k Rose Gold': 39071, '9k White Gold': 39071,
    '14k Yellow Gold': 55050, '14k Rose Gold': 55050, '14k White Gold': 55050,
    '18k Yellow Gold': 70128, '18k Rose Gold': 70128, '18k White Gold': 70128,
  },

  // ── Vintage Garnet & Citrine Ring, 925 Sterling Silver (base ₹4,759) ──
  'fjws-4522694503': {
    '925 Sterling Silver': 4759,  'Yellow Gold Overlay': 4759,  'Rose Gold Overlay': 4759,  'White Gold Overlay': 4759,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 55050, '14k Rose Gold': 55050, '14k White Gold': 55050,
    '18k Yellow Gold': 75087, '18k Rose Gold': 75087, '18k White Gold': 75087,
  },

  // ── Pink Diamond Ring, Morganite Ring, Stacking Ring,  (base ₹4,909) ──
  'fjws-4522687995': {
    '925 Sterling Silver': 4909,  'Yellow Gold Overlay': 4909,  'Rose Gold Overlay': 4909,  'White Gold Overlay': 4909,
    '9k Yellow Gold': 39572, '9k Rose Gold': 39572, '9k White Gold': 39572,
    '14k Yellow Gold': 55050, '14k Rose Gold': 55050, '14k White Gold': 55050,
    '18k Yellow Gold': 75087, '18k Rose Gold': 75087, '18k White Gold': 75087,
  },

  // ── Lesbian Pride Signet Ring, Double Venus Symbol Rin (base ₹6,261) ──
  'fjws-4522231201': {
    '925 Sterling Silver': 6261,  'Yellow Gold Overlay': 6261,  'Rose Gold Overlay': 6261,  'White Gold Overlay': 6261,
    '9k Yellow Gold': 42577, '9k Rose Gold': 42577, '9k White Gold': 42577,
    '14k Yellow Gold': 61111, '14k Rose Gold': 61111, '14k White Gold': 61111,
    '18k Yellow Gold': 80146, '18k Rose Gold': 80146, '18k White Gold': 80146,
  },

  // ── Double Venus Necklace: Lesbian Pride Jewelry, Ster (base ₹5,510) ──
  'fjws-4522229985': {
    '925 Sterling Silver': 5510,  'Yellow Gold Overlay': 5510,  'Rose Gold Overlay': 5510,  'White Gold Overlay': 5510,
  },

  // ── Pear Cut Dainty Opal Ring: Toi Et Moi Engagement R (base ₹5,760) ──
  'fjws-4522212216': {
    '925 Sterling Silver': 5760,  'Yellow Gold Overlay': 5760,  'Rose Gold Overlay': 5760,  'White Gold Overlay': 5760,
    '9k Yellow Gold': 41075, '9k Rose Gold': 41075, '9k White Gold': 41075,
    '14k Yellow Gold': 60109, '14k Rose Gold': 60109, '14k White Gold': 60109,
    '18k Yellow Gold': 77641, '18k Rose Gold': 77641, '18k White Gold': 77641,
  },

  // ── 2CT Marquise Cut Moissanite Engagement Ring, 14k G (base ₹5,510) ──
  'fjws-4522203062': {
    '925 Sterling Silver': 5510,  'Yellow Gold Overlay': 5510,  'Rose Gold Overlay': 5510,  'White Gold Overlay': 5510,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 56102, '14k Rose Gold': 56102, '14k White Gold': 56102,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Dainty Diamond Open Band, Minimalist Moissanite Go (base ₹4,508) ──
  'fjws-4522182233': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '9k Yellow Gold': 35064, '9k Rose Gold': 35064, '9k White Gold': 35064,
    '14k Yellow Gold': 52546, '14k Rose Gold': 52546, '14k White Gold': 52546,
    '18k Yellow Gold': 69126, '18k Rose Gold': 69126, '18k White Gold': 69126,
  },

  // ── Oval Labradorite Engagement Ring, Gift Jewelry for (base ₹4,007) ──
  'fjws-4520620419': {
    '925 Sterling Silver': 4007,  'Yellow Gold Overlay': 4007,  'Rose Gold Overlay': 4007,  'White Gold Overlay': 4007,
    '9k Yellow Gold': 39071, '9k Rose Gold': 39071, '9k White Gold': 39071,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 70078, '18k Rose Gold': 70078, '18k White Gold': 70078,
  },

  // ── Vintage Moss Agate Teardrop Ring, Dainty Moss Agat (base ₹4,909) ──
  'fjws-4520604451': {
    '925 Sterling Silver': 4909,  'Yellow Gold Overlay': 4909,  'Rose Gold Overlay': 4909,  'White Gold Overlay': 4909,
    '9k Yellow Gold': 39572, '9k Rose Gold': 39572, '9k White Gold': 39572,
    '14k Yellow Gold': 55050, '14k Rose Gold': 55050, '14k White Gold': 55050,
    '18k Yellow Gold': 77591, '18k Rose Gold': 77591, '18k White Gold': 77591,
  },

  // ── Moss Agate Engagement Ring Oval Vintage Solid Gold (base ₹5,009) ──
  'fjws-4520601413': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '9k Yellow Gold': 40023, '9k Rose Gold': 40023, '9k White Gold': 40023,
    '14k Yellow Gold': 55050, '14k Rose Gold': 55050, '14k White Gold': 55050,
    '18k Yellow Gold': 77591, '18k Rose Gold': 77591, '18k White Gold': 77591,
  },

  // ── Butterfly Ring, Pave Gemstone Butterfly Ring, Exqu (base ₹4,508) ──
  'fjws-4520593404': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '9k Yellow Gold': 40023, '9k Rose Gold': 40023, '9k White Gold': 40023,
    '14k Yellow Gold': 57555, '14k Rose Gold': 57555, '14k White Gold': 57555,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Round Cut Moissanite Curved Wedding Band, Handmade (base ₹4,007) ──
  'fjws-4520587810': {
    '925 Sterling Silver': 4007,  'Yellow Gold Overlay': 4007,  'Rose Gold Overlay': 4007,  'White Gold Overlay': 4007,
    '9k Yellow Gold': 35064, '9k Rose Gold': 35064, '9k White Gold': 35064,
    '14k Yellow Gold': 52546, '14k Rose Gold': 52546, '14k White Gold': 52546,
    '18k Yellow Gold': 69126, '18k Rose Gold': 69126, '18k White Gold': 69126,
  },

  // ── Marquise Cut Diamond Ring, Minimalist Gold Ring, T (base ₹4,107) ──
  'fjws-4519457435': {
    '925 Sterling Silver': 4107,  'Yellow Gold Overlay': 4107,  'Rose Gold Overlay': 4107,  'White Gold Overlay': 4107,
    '9k Yellow Gold': 39071, '9k Rose Gold': 39071, '9k White Gold': 39071,
    '14k Yellow Gold': 55050, '14k Rose Gold': 55050, '14k White Gold': 55050,
    '18k Yellow Gold': 72582, '18k Rose Gold': 72582, '18k White Gold': 72582,
  },

  // ── Emerald Cut Larimar Engagement Ring, 14K Gold Soli (base ₹4,508) ──
  'fjws-4519413887': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '9k Yellow Gold': 37067, '9k Rose Gold': 37067, '9k White Gold': 37067,
    '14k Yellow Gold': 60109, '14k Rose Gold': 60109, '14k White Gold': 60109,
    '18k Yellow Gold': 74135, '18k Rose Gold': 74135, '18k White Gold': 74135,
  },

  // ── Oval Larimar Engagement Ring, 14K Gold Solitaire,  (base ₹5,009) ──
  'fjws-4518925350': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '9k Yellow Gold': 37067, '9k Rose Gold': 37067, '9k White Gold': 37067,
    '14k Yellow Gold': 60109, '14k Rose Gold': 60109, '14k White Gold': 60109,
    '18k Yellow Gold': 74135, '18k Rose Gold': 74135, '18k White Gold': 74135,
  },

  // ── 925 Sterling Silver Shaker Ring: Pave Diamond, Col (base ₹9,016) ──
  'fjws-4518918104': {
    '925 Sterling Silver': 9016,  'Yellow Gold Overlay': 9016,  'Rose Gold Overlay': 9016,  'White Gold Overlay': 9016,
    '9k Yellow Gold': 45082, '9k Rose Gold': 45082, '9k White Gold': 45082,
    '14k Yellow Gold': 65068, '14k Rose Gold': 65068, '14k White Gold': 65068,
    '18k Yellow Gold': 82600, '18k Rose Gold': 82600, '18k White Gold': 82600,
  },

  // ── Marquise Cut Larimar Engagement Ring, 14K Gold Sol (base ₹4,508) ──
  'fjws-4518914357': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '9k Yellow Gold': 37067, '9k Rose Gold': 37067, '9k White Gold': 37067,
    '14k Yellow Gold': 60109, '14k Rose Gold': 60109, '14k White Gold': 60109,
    '18k Yellow Gold': 74135, '18k Rose Gold': 74135, '18k White Gold': 74135,
  },

  // ── Sterling Silver Shaker Ring, Pave Gemstone Princes (base ₹7,514) ──
  'fjws-4517377320': {
    '925 Sterling Silver': 7514,  'Yellow Gold Overlay': 7514,  'Rose Gold Overlay': 7514,  'White Gold Overlay': 7514,
    '9k Yellow Gold': 45082, '9k Rose Gold': 45082, '9k White Gold': 45082,
    '14k Yellow Gold': 65068, '14k Rose Gold': 65068, '14k White Gold': 65068,
    '18k Yellow Gold': 82600, '18k Rose Gold': 82600, '18k White Gold': 82600,
  },

  // ── Pear Cut Moissanite Necklace, Teardrop Pendant Nec (base ₹5,510) ──
  'fjws-4517316231': {
    '925 Sterling Silver': 5510,  'Yellow Gold Overlay': 5510,  'Rose Gold Overlay': 5510,  'White Gold Overlay': 5510,
  },

  // ── Sterling Silver Shaker Ring, Pave Gemstone Princes (base ₹7,514) ──
  'fjws-4515014314': {
    '925 Sterling Silver': 7514,  'Yellow Gold Overlay': 7514,  'Rose Gold Overlay': 7514,  'White Gold Overlay': 7514,
    '9k Yellow Gold': 45082, '9k Rose Gold': 45082, '9k White Gold': 45082,
    '14k Yellow Gold': 65068, '14k Rose Gold': 65068, '14k White Gold': 65068,
    '18k Yellow Gold': 82600, '18k Rose Gold': 82600, '18k White Gold': 82600,
  },

  // ── 18k Lesbian ring for Pride Month, Lesbian Gift, Ga (base ₹4,258) ──
  'fjws-4516815588': {
    '925 Sterling Silver': 4258,  'Yellow Gold Overlay': 4258,  'Rose Gold Overlay': 4258,  'White Gold Overlay': 4258,
    '9k Yellow Gold': 39572, '9k Rose Gold': 39572, '9k White Gold': 39572,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 70078, '18k Rose Gold': 70078, '18k White Gold': 70078,
  },

  // ── Stunning Kammererite Necklace - Adjustable Boho Pr (base ₹7,514) ──
  'fjws-4516792652': {
    '925 Sterling Silver': 7514,  'Yellow Gold Overlay': 7514,  'Rose Gold Overlay': 7514,  'White Gold Overlay': 7514,
  },

  // ── 100% Natural Aqua Chalcedony Square Bracelet, Abso (base ₹4,007) ──
  'fjws-4516789064': {
    '925 Sterling Silver': 4007,  'Yellow Gold Overlay': 4007,  'Rose Gold Overlay': 4007,  'White Gold Overlay': 4007,
  },

  // ── Labradorite - Adjustable stretch Gemstone Bracelet (base ₹4,258) ──
  'fjws-4516774518': {
    '925 Sterling Silver': 4258,  'Yellow Gold Overlay': 4258,  'Rose Gold Overlay': 4258,  'White Gold Overlay': 4258,
  },

  // ── Lesbian Pride Rings - Interlocking Venus Symbols R (base ₹4,007) ──
  'fjws-4516293611': {
    '925 Sterling Silver': 4007,  'Yellow Gold Overlay': 4007,  'Rose Gold Overlay': 4007,  'White Gold Overlay': 4007,
    '9k Yellow Gold': 36316, '9k Rose Gold': 36316, '9k White Gold': 36316,
    '14k Yellow Gold': 52596, '14k Rose Gold': 52596, '14k White Gold': 52596,
    '18k Yellow Gold': 70078, '18k Rose Gold': 70078, '18k White Gold': 70078,
  },

  // ── Dainty Moonstone Pendant, Boho Celestial Jewelry,  (base ₹5,009) ──
  'fjws-4516233182': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
  },

  // ── Natural Blue Labradorite Necklace, Emerald Labrado (base ₹6,011) ──
  'fjws-4516232288': {
    '925 Sterling Silver': 6011,  'Yellow Gold Overlay': 6011,  'Rose Gold Overlay': 6011,  'White Gold Overlay': 6011,
  },

  // ── Natural Marquise Opal Pendant, Gold Opal-Vintage O (base ₹7,013) ──
  'fjws-4516234641': {
    '925 Sterling Silver': 7013,  'Yellow Gold Overlay': 7013,  'Rose Gold Overlay': 7013,  'White Gold Overlay': 7013,
  },

  // ── Natural Opal Ring In 14k Solid Gold, October Birth (base ₹4,508) ──
  'fjws-4516215223': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '9k Yellow Gold': 41075, '9k Rose Gold': 41075, '9k White Gold': 41075,
    '14k Yellow Gold': 55050, '14k Rose Gold': 55050, '14k White Gold': 55050,
    '18k Yellow Gold': 77591, '18k Rose Gold': 77591, '18k White Gold': 77591,
  },

  // ── 1.5CT Marquise Cut Moissanite Engagement Ring, 14K (base ₹4,408) ──
  'fjws-4516206539': {
    '925 Sterling Silver': 4408,  'Yellow Gold Overlay': 4408,  'Rose Gold Overlay': 4408,  'White Gold Overlay': 4408,
    '9k Yellow Gold': 37067, '9k Rose Gold': 37067, '9k White Gold': 37067,
    '14k Yellow Gold': 60109, '14k Rose Gold': 60109, '14k White Gold': 60109,
    '18k Yellow Gold': 74135, '18k Rose Gold': 74135, '18k White Gold': 74135,
  },

  // ── Rose Quartz-Baguette Amethyst Engagement Ring, Vin (base ₹5,260) ──
  'fjws-4515648864': {
    '925 Sterling Silver': 5260,  'Yellow Gold Overlay': 5260,  'Rose Gold Overlay': 5260,  'White Gold Overlay': 5260,
    '9k Yellow Gold': 42077, '9k Rose Gold': 42077, '9k White Gold': 42077,
    '14k Yellow Gold': 65068, '14k Rose Gold': 65068, '14k White Gold': 65068,
    '18k Yellow Gold': 82600, '18k Rose Gold': 82600, '18k White Gold': 82600,
  },

  // ── Rose Quartz Marquise Cut Wedding Ring, East-West B (base ₹4,208) ──
  'fjws-4515627625': {
    '925 Sterling Silver': 4208,  'Yellow Gold Overlay': 4208,  'Rose Gold Overlay': 4208,  'White Gold Overlay': 4208,
    '9k Yellow Gold': 39071, '9k Rose Gold': 39071, '9k White Gold': 39071,
    '14k Yellow Gold': 60059, '14k Rose Gold': 60059, '14k White Gold': 60059,
    '18k Yellow Gold': 74135, '18k Rose Gold': 74135, '18k White Gold': 74135,
  },

  // ── Rose Quartz Marquise Ring, Pink Quartz Statement R (base ₹4,258) ──
  'fjws-4515620248': {
    '925 Sterling Silver': 4258,  'Yellow Gold Overlay': 4258,  'Rose Gold Overlay': 4258,  'White Gold Overlay': 4258,
    '9k Yellow Gold': 39572, '9k Rose Gold': 39572, '9k White Gold': 39572,
    '14k Yellow Gold': 56102, '14k Rose Gold': 56102, '14k White Gold': 56102,
    '18k Yellow Gold': 76139, '18k Rose Gold': 76139, '18k White Gold': 76139,
  },

  // ── 1.5ct Marquise Bezel Blue Sapphire Ring, 14K Solid (base ₹4,258) ──
  'fjws-4515113846': {
    '925 Sterling Silver': 4258,  'Yellow Gold Overlay': 4258,  'Rose Gold Overlay': 4258,  'White Gold Overlay': 4258,
    '9k Yellow Gold': 39572, '9k Rose Gold': 39572, '9k White Gold': 39572,
    '14k Yellow Gold': 56102, '14k Rose Gold': 56102, '14k White Gold': 56102,
    '18k Yellow Gold': 76139, '18k Rose Gold': 76139, '18k White Gold': 76139,
  },

  // ── 1.5 CT Marquise-Cut Moissanite Engagement Ring, 14 (base ₹4,208) ──
  'fjws-4515108887': {
    '925 Sterling Silver': 4208,  'Yellow Gold Overlay': 4208,  'Rose Gold Overlay': 4208,  'White Gold Overlay': 4208,
    '9k Yellow Gold': 39572, '9k Rose Gold': 39572, '9k White Gold': 39572,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 76139, '18k Rose Gold': 76139, '18k White Gold': 76139,
  },

  // ── Marquise Cut Moissanite Wedding Ring, Solitaire Ea (base ₹4,308) ──
  'fjws-4515103975': {
    '925 Sterling Silver': 4308,  'Yellow Gold Overlay': 4308,  'Rose Gold Overlay': 4308,  'White Gold Overlay': 4308,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 60109, '14k Rose Gold': 60109, '14k White Gold': 60109,
    '18k Yellow Gold': 78643, '18k Rose Gold': 78643, '18k White Gold': 78643,
  },

  // ── Vintage Blue Lindy Star Ring, Blue Star Sapphire S (base ₹4,809) ──
  'fjws-4515019099': {
    '925 Sterling Silver': 4809,  'Yellow Gold Overlay': 4809,  'Rose Gold Overlay': 4809,  'White Gold Overlay': 4809,
    '9k Yellow Gold': 41075, '9k Rose Gold': 41075, '9k White Gold': 41075,
    '14k Yellow Gold': 60610, '14k Rose Gold': 60610, '14k White Gold': 60610,
    '18k Yellow Gold': 77641, '18k Rose Gold': 77641, '18k White Gold': 77641,
  },

  // ── Emerald Sapphire Yellow Gold Ring, Vintage Blue Ge (base ₹4,208) ──
  'fjws-4515011030': {
    '925 Sterling Silver': 4208,  'Yellow Gold Overlay': 4208,  'Rose Gold Overlay': 4208,  'White Gold Overlay': 4208,
    '9k Yellow Gold': 39071, '9k Rose Gold': 39071, '9k White Gold': 39071,
    '14k Yellow Gold': 56102, '14k Rose Gold': 56102, '14k White Gold': 56102,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Emerald Cut Aquamarine Ring, Vintage 14k Solid Gol (base ₹4,208) ──
  'fjws-4515009484': {
    '925 Sterling Silver': 4208,  'Yellow Gold Overlay': 4208,  'Rose Gold Overlay': 4208,  'White Gold Overlay': 4208,
    '9k Yellow Gold': 39071, '9k Rose Gold': 39071, '9k White Gold': 39071,
    '14k Yellow Gold': 56102, '14k Rose Gold': 56102, '14k White Gold': 56102,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Vintage Round Cut Black Onyx Engagement Ring, 14k  (base ₹4,258) ──
  'fjws-4515008104': {
    '925 Sterling Silver': 4258,  'Yellow Gold Overlay': 4258,  'Rose Gold Overlay': 4258,  'White Gold Overlay': 4258,
    '9k Yellow Gold': 39322, '9k Rose Gold': 39322, '9k White Gold': 39322,
    '14k Yellow Gold': 57555, '14k Rose Gold': 57555, '14k White Gold': 57555,
    '18k Yellow Gold': 74586, '18k Rose Gold': 74586, '18k White Gold': 74586,
  },

  // ── Emerald Cut Engagement Ring in 14k Solid Gold 1.50 (base ₹4,809) ──
  'fjws-4515008343': {
    '925 Sterling Silver': 4809,  'Yellow Gold Overlay': 4809,  'Rose Gold Overlay': 4809,  'White Gold Overlay': 4809,
    '9k Yellow Gold': 41576, '9k Rose Gold': 41576, '9k White Gold': 41576,
    '14k Yellow Gold': 61061, '14k Rose Gold': 61061, '14k White Gold': 61061,
    '18k Yellow Gold': 79094, '18k Rose Gold': 79094, '18k White Gold': 79094,
  },

  // ── Emerald Cut Blue Sapphire Ring 14K Yellow Gold, Ha (base ₹5,009) ──
  'fjws-4514566691': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '9k Yellow Gold': 40574, '9k Rose Gold': 40574, '9k White Gold': 40574,
    '14k Yellow Gold': 62564, '14k Rose Gold': 62564, '14k White Gold': 62564,
    '18k Yellow Gold': 77641, '18k Rose Gold': 77641, '18k White Gold': 77641,
  },

  // ── Hexagon Black Fire Opal Engagement Ring Bezel Sett (base ₹4,508) ──
  'fjws-4514554068': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 60109, '14k Rose Gold': 60109, '14k White Gold': 60109,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Unique Marquise White Opal Engagement Ring, 14k So (base ₹5,760) ──
  'fjws-4514552344': {
    '925 Sterling Silver': 5760,  'Yellow Gold Overlay': 5760,  'Rose Gold Overlay': 5760,  'White Gold Overlay': 5760,
    '9k Yellow Gold': 42577, '9k Rose Gold': 42577, '9k White Gold': 42577,
    '14k Yellow Gold': 62564, '14k Rose Gold': 62564, '14k White Gold': 62564,
    '18k Yellow Gold': 79595, '18k Rose Gold': 79595, '18k White Gold': 79595,
  },

  // ── Vintage Emerald Engagement Ring, Unique Baguette C (base ₹5,009) ──
  'fjws-4514550977': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '9k Yellow Gold': 42577, '9k Rose Gold': 42577, '9k White Gold': 42577,
    '14k Yellow Gold': 60610, '14k Rose Gold': 60610, '14k White Gold': 60610,
    '18k Yellow Gold': 79094, '18k Rose Gold': 79094, '18k White Gold': 79094,
  },

  // ── Natural Moss Agate Ring, Emerald Cut Moss Agate En (base ₹4,308) ──
  'fjws-4514487657': {
    '925 Sterling Silver': 4308,  'Yellow Gold Overlay': 4308,  'Rose Gold Overlay': 4308,  'White Gold Overlay': 4308,
    '9k Yellow Gold': 40574, '9k Rose Gold': 40574, '9k White Gold': 40574,
    '14k Yellow Gold': 57605, '14k Rose Gold': 57605, '14k White Gold': 57605,
    '18k Yellow Gold': 77591, '18k Rose Gold': 77591, '18k White Gold': 77591,
  },

  // ── Three Stone Emerald Cut Moissanite Engagement Ring (base ₹4,258) ──
  'fjws-4514485753': {
    '925 Sterling Silver': 4258,  'Yellow Gold Overlay': 4258,  'Rose Gold Overlay': 4258,  'White Gold Overlay': 4258,
    '9k Yellow Gold': 39071, '9k Rose Gold': 39071, '9k White Gold': 39071,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 74586, '18k Rose Gold': 74586, '18k White Gold': 74586,
  },

  // ── Emerald Cut Solitaire Bezel Ring, Moissanite Ring, (base ₹4,057) ──
  'fjws-4514482284': {
    '925 Sterling Silver': 4057,  'Yellow Gold Overlay': 4057,  'Rose Gold Overlay': 4057,  'White Gold Overlay': 4057,
    '9k Yellow Gold': 39572, '9k Rose Gold': 39572, '9k White Gold': 39572,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Emerald Cut Moissanite Engagement Ring, Side Stone (base ₹5,510) ──
  'fjws-4514479898': {
    '925 Sterling Silver': 5510,  'Yellow Gold Overlay': 5510,  'Rose Gold Overlay': 5510,  'White Gold Overlay': 5510,
    '9k Yellow Gold': 40574, '9k Rose Gold': 40574, '9k White Gold': 40574,
    '14k Yellow Gold': 60109, '14k Rose Gold': 60109, '14k White Gold': 60109,
    '18k Yellow Gold': 77641, '18k Rose Gold': 77641, '18k White Gold': 77641,
  },

  // ── 2CT Emerald Cut Moissanite Engagement Ring, 14K Wh (base ₹4,608) ──
  'fjws-4514463383': {
    '925 Sterling Silver': 4608,  'Yellow Gold Overlay': 4608,  'Rose Gold Overlay': 4608,  'White Gold Overlay': 4608,
    '9k Yellow Gold': 39572, '9k Rose Gold': 39572, '9k White Gold': 39572,
    '14k Yellow Gold': 59558, '14k Rose Gold': 59558, '14k White Gold': 59558,
    '18k Yellow Gold': 76139, '18k Rose Gold': 76139, '18k White Gold': 76139,
  },

  // ── Emerald Cut Moissanite Engagement Ring, 14k Gold S (base ₹4,265) ──
  'fjws-4514463070': {
    '925 Sterling Silver': 4265,  'Yellow Gold Overlay': 4265,  'Rose Gold Overlay': 4265,  'White Gold Overlay': 4265,
    '9k Yellow Gold': 39322, '9k Rose Gold': 39322, '9k White Gold': 39322,
    '14k Yellow Gold': 56102, '14k Rose Gold': 56102, '14k White Gold': 56102,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── 2.5CT Emerald Cut Moissanite Engagement Ring, 10K  (base ₹4,508) ──
  'fjws-4514462600': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 60109, '14k Rose Gold': 60109, '14k White Gold': 60109,
    '18k Yellow Gold': 77591, '18k Rose Gold': 77591, '18k White Gold': 77591,
  },

  // ── 2.5CT  Marquise Lab diamond engagement ring Yellow (base ₹6,011) ──
  'fjws-4513136321': {
    '925 Sterling Silver': 6011,  'Yellow Gold Overlay': 6011,  'Rose Gold Overlay': 6011,  'White Gold Overlay': 6011,
    '9k Yellow Gold': 42577, '9k Rose Gold': 42577, '9k White Gold': 42577,
    '14k Yellow Gold': 62564, '14k Rose Gold': 62564, '14k White Gold': 62564,
    '18k Yellow Gold': 80146, '18k Rose Gold': 80146, '18k White Gold': 80146,
  },

  // ── Oval Cut Five Stone Moissanite Band 10K Yellow Gol (base ₹5,760) ──
  'fjws-4513128497': {
    '925 Sterling Silver': 5760,  'Yellow Gold Overlay': 5760,  'Rose Gold Overlay': 5760,  'White Gold Overlay': 5760,
    '9k Yellow Gold': 41075, '9k Rose Gold': 41075, '9k White Gold': 41075,
    '14k Yellow Gold': 60610, '14k Rose Gold': 60610, '14k White Gold': 60610,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Cushion Cut Moissanite Split Shank Ring 10K Yellow (base ₹4,107) ──
  'fjws-4513124734': {
    '925 Sterling Silver': 4107,  'Yellow Gold Overlay': 4107,  'Rose Gold Overlay': 4107,  'White Gold Overlay': 4107,
    '9k Yellow Gold': 39572, '9k Rose Gold': 39572, '9k White Gold': 39572,
    '14k Yellow Gold': 60059, '14k Rose Gold': 60059, '14k White Gold': 60059,
    '18k Yellow Gold': 72632, '18k Rose Gold': 72632, '18k White Gold': 72632,
  },

  // ── 3CT Emerald Cut Moissanite Solitaire Ring 14K Soli (base ₹4,007) ──
  'fjws-4513120351': {
    '925 Sterling Silver': 4007,  'Yellow Gold Overlay': 4007,  'Rose Gold Overlay': 4007,  'White Gold Overlay': 4007,
    '9k Yellow Gold': 39071, '9k Rose Gold': 39071, '9k White Gold': 39071,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 69627, '18k Rose Gold': 69627, '18k White Gold': 69627,
  },

  // ── Marquise cut Moissanite Curved Wedding band Unique (base ₹5,260) ──
  'fjws-4513116226': {
    '925 Sterling Silver': 5260,  'Yellow Gold Overlay': 5260,  'Rose Gold Overlay': 5260,  'White Gold Overlay': 5260,
    '9k Yellow Gold': 41075, '9k Rose Gold': 41075, '9k White Gold': 41075,
    '14k Yellow Gold': 60109, '14k Rose Gold': 60109, '14k White Gold': 60109,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── 1 CT IGI Certified Lab grown diamond engagement ri (base ₹6,011) ──
  'fjws-4486399574': {
    '925 Sterling Silver': 6011,  'Yellow Gold Overlay': 6011,  'Rose Gold Overlay': 6011,  'White Gold Overlay': 6011,
    '9k Yellow Gold': 42327, '9k Rose Gold': 42327, '9k White Gold': 42327,
    '14k Yellow Gold': 61111, '14k Rose Gold': 61111, '14k White Gold': 61111,
    '18k Yellow Gold': 76139, '18k Rose Gold': 76139, '18k White Gold': 76139,
  },

  // ── Garnet Hexagon and Pink Sapphire Baguette Ring Sol (base ₹6,261) ──
  'fjws-4512524434': {
    '925 Sterling Silver': 6261,  'Yellow Gold Overlay': 6261,  'Rose Gold Overlay': 6261,  'White Gold Overlay': 6261,
    '9k Yellow Gold': 42077, '9k Rose Gold': 42077, '9k White Gold': 42077,
    '14k Yellow Gold': 62113, '14k Rose Gold': 62113, '14k White Gold': 62113,
    '18k Yellow Gold': 77641, '18k Rose Gold': 77641, '18k White Gold': 77641,
  },

  // ── 2.50CT Oval Cut Moissanite Engagement Ring, Round  (base ₹4,508) ──
  'fjws-4512519589': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 60109, '14k Rose Gold': 60109, '14k White Gold': 60109,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Elongated 3CT Cushion Cut Bezel Solitaire Moissani (base ₹4,107) ──
  'fjws-4512517619': {
    '925 Sterling Silver': 4107,  'Yellow Gold Overlay': 4107,  'Rose Gold Overlay': 4107,  'White Gold Overlay': 4107,
    '9k Yellow Gold': 39071, '9k Rose Gold': 39071, '9k White Gold': 39071,
    '14k Yellow Gold': 59108, '14k Rose Gold': 59108, '14k White Gold': 59108,
    '18k Yellow Gold': 70128, '18k Rose Gold': 70128, '18k White Gold': 70128,
  },

  // ── Radiant Cut Moissanite Engagement Ring | Bezel Set (base ₹4,057) ──
  'fjws-4512517618': {
    '925 Sterling Silver': 4057,  'Yellow Gold Overlay': 4057,  'Rose Gold Overlay': 4057,  'White Gold Overlay': 4057,
    '9k Yellow Gold': 39071, '9k Rose Gold': 39071, '9k White Gold': 39071,
    '14k Yellow Gold': 56102, '14k Rose Gold': 56102, '14k White Gold': 56102,
    '18k Yellow Gold': 70128, '18k Rose Gold': 70128, '18k White Gold': 70128,
  },

  // ── Solid Gold Split Shank Oval Cut Moissanite Engagem (base ₹4,408) ──
  'fjws-4512513833': {
    '925 Sterling Silver': 4408,  'Yellow Gold Overlay': 4408,  'Rose Gold Overlay': 4408,  'White Gold Overlay': 4408,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 60610, '14k Rose Gold': 60610, '14k White Gold': 60610,
    '18k Yellow Gold': 74135, '18k Rose Gold': 74135, '18k White Gold': 74135,
  },

  // ── Oval Lab Grown Diamond Ring, Solid Gold Pinky Ring (base ₹4,107) ──
  'fjws-4581012935': {
    '925 Sterling Silver': 4107,  'Yellow Gold Overlay': 4107,  'Rose Gold Overlay': 4107,  'White Gold Overlay': 4107,
    '9k Yellow Gold': 37568, '9k Rose Gold': 37568, '9k White Gold': 37568,
    '14k Yellow Gold': 52596, '14k Rose Gold': 52596, '14k White Gold': 52596,
    '18k Yellow Gold': 70128, '18k Rose Gold': 70128, '18k White Gold': 70128,
  },

  // ── Oval Cut Rose Quartz Engagement Ring, 14k Solid Go (base ₹4,007) ──
  'fjws-4582242777': {
    '925 Sterling Silver': 4007,  'Yellow Gold Overlay': 4007,  'Rose Gold Overlay': 4007,  'White Gold Overlay': 4007,
    '10k Yellow Gold': 37568, '10k Rose Gold': 37568, '10k White Gold': 37568,
    '14k Yellow Gold': 52596, '14k Rose Gold': 52596, '14k White Gold': 52596,
    '18k Yellow Gold': 70078, '18k Rose Gold': 70078, '18k White Gold': 70078,
  },

  // ── Oval Black Onyx Ring, Moissanite Accent Engagement (base ₹5,009) ──
  'fjws-4582254728': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '10k Yellow Gold': 39071, '10k Rose Gold': 39071, '10k White Gold': 39071,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Oval Labradorite Natural Bezel Pendant, 14k Gold F (base ₹6,512) ──
  'fjws-4582240751': {
    '925 Sterling Silver': 6512,  'Yellow Gold Overlay': 6512,  'Rose Gold Overlay': 6512,  'White Gold Overlay': 6512,
  },

  // ── Elegant Oval Malachite Bezel Set Engagement Ring,  (base ₹4,107) ──
  'fjws-4582231925': {
    '925 Sterling Silver': 4107,  'Yellow Gold Overlay': 4107,  'Rose Gold Overlay': 4107,  'White Gold Overlay': 4107,
    '9k Yellow Gold': 39071, '9k Rose Gold': 39071, '9k White Gold': 39071,
    '14k Yellow Gold': 54599, '14k Rose Gold': 54599, '14k White Gold': 54599,
    '18k Yellow Gold': 74135, '18k Rose Gold': 74135, '18k White Gold': 74135,
  },

  // ── 2.50ct Elongated Cushion Cut Moissanite Ring, 14K  (base ₹4,258) ──
  'fjws-4581018221': {
    '925 Sterling Silver': 4258,  'Yellow Gold Overlay': 4258,  'Rose Gold Overlay': 4258,  'White Gold Overlay': 4258,
    '9k Yellow Gold': 39071, '9k Rose Gold': 39071, '9k White Gold': 39071,
    '14k Yellow Gold': 54599, '14k Rose Gold': 54599, '14k White Gold': 54599,
    '18k Yellow Gold': 72632, '18k Rose Gold': 72632, '18k White Gold': 72632,
  },

  // ── Oval Moissanite Bezel Pendant, 14k Gold Filled Eas (base ₹6,512) ──
  'fjws-4575572990': {
    '925 Sterling Silver': 6512,  'Yellow Gold Overlay': 6512,  'Rose Gold Overlay': 6512,  'White Gold Overlay': 6512,
  },

  // ── Crescent Moon Malachite Ring, Gold Celestial Ring, (base ₹4,508) ──
  'fjws-4581569462': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '10k Yellow Gold': 37067, '10k Rose Gold': 37067, '10k White Gold': 37067,
    '14k Yellow Gold': 60109, '14k Rose Gold': 60109, '14k White Gold': 60109,
    '18k Yellow Gold': 74135, '18k Rose Gold': 74135, '18k White Gold': 74135,
  },

  // ── 14K Solid Gold Malachite with Moissanite Ring, Vin (base ₹5,510) ──
  'fjws-4581567484': {
    '925 Sterling Silver': 5510,  'Yellow Gold Overlay': 5510,  'Rose Gold Overlay': 5510,  'White Gold Overlay': 5510,
    '10k Yellow Gold': 39572, '10k Rose Gold': 39572, '10k White Gold': 39572,
    '14k Yellow Gold': 55050, '14k Rose Gold': 55050, '14k White Gold': 55050,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Natural Malachite Marquise Cut Ring, Half Bezel 14 (base ₹4,308) ──
  'fjws-4581565280': {
    '925 Sterling Silver': 4308,  'Yellow Gold Overlay': 4308,  'Rose Gold Overlay': 4308,  'White Gold Overlay': 4308,
    '10k Yellow Gold': 39822, '10k Rose Gold': 39822, '10k White Gold': 39822,
    '14k Yellow Gold': 59108, '14k Rose Gold': 59108, '14k White Gold': 59108,
    '18k Yellow Gold': 73634, '18k Rose Gold': 73634, '18k White Gold': 73634,
  },

  // ── Green Onyx Engagement Ring, Moissanite Halo Ring,  (base ₹5,009) ──
  'fjws-4581555690': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '10k Yellow Gold': 39071, '10k Rose Gold': 39071, '10k White Gold': 39071,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Personalized Birthstone Ring, 18K Gold Daily Ring, (base ₹4,508) ──
  'fjws-4581527793': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '9k Yellow Gold': 39071, '9k Rose Gold': 39071, '9k White Gold': 39071,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 70128, '18k Rose Gold': 70128, '18k White Gold': 70128,
  },

  // ── Venus De Milo Eyes Ring, Aphrodite Eyes Ring, Godd (base ₹4,759) ──
  'fjws-4516296623': {
    '925 Sterling Silver': 4759,  'Yellow Gold Overlay': 4759,  'Rose Gold Overlay': 4759,  'White Gold Overlay': 4759,
    '10k Yellow Gold': 40073, '10k Rose Gold': 40073, '10k White Gold': 40073,
    '14k Yellow Gold': 57555, '14k Rose Gold': 57555, '14k White Gold': 57555,
    '18k Yellow Gold': 75087, '18k Rose Gold': 75087, '18k White Gold': 75087,
  },

  // ── Round Moissanite Leaf Engagement Ring, Sterling Si (base ₹4,909) ──
  'fjws-4563453438': {
    '925 Sterling Silver': 4909,  'Yellow Gold Overlay': 4909,  'Rose Gold Overlay': 4909,  'White Gold Overlay': 4909,
    '10k Yellow Gold': 40023, '10k Rose Gold': 40023, '10k White Gold': 40023,
    '14k Yellow Gold': 56553, '14k Rose Gold': 56553, '14k White Gold': 56553,
    '18k Yellow Gold': 76088, '18k Rose Gold': 76088, '18k White Gold': 76088,
  },

  // ── Emerald Cut Green Teal Sapphire Ring, Engagement & (base ₹5,911) ──
  'fjws-4576624415': {
    '925 Sterling Silver': 5911,  'Yellow Gold Overlay': 5911,  'Rose Gold Overlay': 5911,  'White Gold Overlay': 5911,
    '10k Yellow Gold': 40023, '10k Rose Gold': 40023, '10k White Gold': 40023,
    '14k Yellow Gold': 55050, '14k Rose Gold': 55050, '14k White Gold': 55050,
    '18k Yellow Gold': 75087, '18k Rose Gold': 75087, '18k White Gold': 75087,
  },

  // ── Marquise Sapphire Yellow Gold Ring Vintage Blue Ge (base ₹4,608) ──
  'fjws-4580293133': {
    '925 Sterling Silver': 4608,  'Yellow Gold Overlay': 4608,  'Rose Gold Overlay': 4608,  'White Gold Overlay': 4608,
    '10k Yellow Gold': 38069, '10k Rose Gold': 38069, '10k White Gold': 38069,
    '14k Yellow Gold': 52596, '14k Rose Gold': 52596, '14k White Gold': 52596,
    '18k Yellow Gold': 60109, '18k Rose Gold': 60109, '18k White Gold': 60109,
  },

  // ── Rose Gold Open Wedding Band, Solid Gold Gap Engage (base ₹4,909) ──
  'fjws-4580277179': {
    '925 Sterling Silver': 4909,  'Yellow Gold Overlay': 4909,  'Rose Gold Overlay': 4909,  'White Gold Overlay': 4909,
    '10k Yellow Gold': 39973, '10k Rose Gold': 39973, '10k White Gold': 39973,
    '14k Yellow Gold': 56102, '14k Rose Gold': 56102, '14k White Gold': 56102,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Oval Moissanite Eternity Band Ring, Full Eternity  (base ₹5,009) ──
  'fjws-4580287314': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '10k Yellow Gold': 39071, '10k Rose Gold': 39071,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 74135, '18k Rose Gold': 74135, '18k White Gold': 74135,
  },

  // ── Dainty Marquise Cut Rose Quartz Ring, Minimalist R (base ₹4,308) ──
  'fjws-4515622892': {
    '925 Sterling Silver': 4308,  'Yellow Gold Overlay': 4308,  'Rose Gold Overlay': 4308,  'White Gold Overlay': 4308,
    '9k Yellow Gold': 37308, '9k Rose Gold': 37308, '9k White Gold': 37308,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 72582, '18k Rose Gold': 72582, '18k White Gold': 72582,
  },

  // ── Moissanite Signet Ring, Yellow Gold, Emerald Horiz (base ₹4,909) ──
  'fjws-4575555879': {
    '925 Sterling Silver': 4909,  'Yellow Gold Overlay': 4909,  'Rose Gold Overlay': 4909,  'White Gold Overlay': 4909,
    '9k Yellow Gold': 39722, '9k Rose Gold': 39722, '9k White Gold': 39722,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Oval Cut Moissanite Wide Band Solitaire Engagement (base ₹5,009) ──
  'fjws-4559851298': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '9k Yellow Gold': 40574, '9k Rose Gold': 40574, '9k White Gold': 40574,
    '14k Yellow Gold': 56353, '14k Rose Gold': 56353, '14k White Gold': 56353,
    '18k Yellow Gold': 76639, '18k Rose Gold': 76639, '18k White Gold': 76639,
  },

  // ── Toi Et Moi Ring, 14K Solid Gold, Oval Sapphire and (base ₹6,011) ──
  'fjws-4527196335': {
    '925 Sterling Silver': 6011,  'Yellow Gold Overlay': 6011,  'Rose Gold Overlay': 6011,  'White Gold Overlay': 6011,
    '9k Yellow Gold': 40073, '9k Rose Gold': 40073, '9k White Gold': 40073,
    '14k Yellow Gold': 57555, '14k Rose Gold': 57555, '14k White Gold': 57555,
    '18k Yellow Gold': 72582, '18k Rose Gold': 72582, '18k White Gold': 72582,
  },

  // ── Oval Cut Blue Sapphire Engagement Ring Women Silve (base ₹5,610) ──
  'fjws-4520614290': {
    '925 Sterling Silver': 5610,  'Yellow Gold Overlay': 5610,  'Rose Gold Overlay': 5610,  'White Gold Overlay': 5610,
    '10k Yellow Gold': 40073, '10k Rose Gold': 40073, '10k White Gold': 40073,
    '14k Yellow Gold': 60109, '14k Rose Gold': 60109, '14k White Gold': 60109,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── 14k Gold Marquise Engagement Ring, Simulated Diamo (base ₹5,009) ──
  'fjws-4574605185': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '10k Yellow Gold': 39572, '10k Rose Gold': 39572, '10k White Gold': 39572,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Champagne Moissanite Engagement Ring Cushion Cut S (base ₹4,408) ──
  'fjws-4576945739': {
    '925 Sterling Silver': 4408,  'Yellow Gold Overlay': 4408,  'Rose Gold Overlay': 4408,  'White Gold Overlay': 4408,
    '9k Yellow Gold': 38069, '9k Rose Gold': 38069, '9k White Gold': 38069,
    '14k Yellow Gold': 53598, '14k Rose Gold': 53598, '14k White Gold': 53598,
    '18k Yellow Gold': 73634, '18k Rose Gold': 73634, '18k White Gold': 73634,
  },

  // ── Unique Elongated Cushion Cut Moissanite Engagement (base ₹4,258) ──
  'fjws-4576948201': {
    '925 Sterling Silver': 4258,  'Yellow Gold Overlay': 4258,  'Rose Gold Overlay': 4258,  'White Gold Overlay': 4258,
    '9k Yellow Gold': 39071, '9k Rose Gold': 39071, '9k White Gold': 39071,
    '14k Yellow Gold': 54599, '14k Rose Gold': 54599, '14k White Gold': 54599,
    '18k Yellow Gold': 72632, '18k Rose Gold': 72632, '18k White Gold': 72632,
  },

  // ── Natural Inspired Ring, 6mm Round Cut Natural Londo (base ₹4,508) ──
  'fjws-4576646738': {
    '925 Sterling Silver': 4508,  'Yellow Gold Overlay': 4508,  'Rose Gold Overlay': 4508,  'White Gold Overlay': 4508,
    '9k Yellow Gold': 38069, '9k Rose Gold': 38069, '9k White Gold': 38069,
    '14k Yellow Gold': 54098, '14k Rose Gold': 54098, '14k White Gold': 54098,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Sterling Silver Vintage 18K Opal Ring Gold, Dainty (base ₹5,260) ──
  'fjws-4576618399': {
    '925 Sterling Silver': 5260,  'Yellow Gold Overlay': 5260,  'Rose Gold Overlay': 5260,  'White Gold Overlay': 5260,
    '10k Yellow Gold': 39572, '10k Rose Gold': 39572, '10k White Gold': 39572,
    '14k Yellow Gold': 54599, '14k Rose Gold': 54599, '14k White Gold': 52596,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Gold Opal Ring, October Birthstone, Adjustable Gol (base ₹4,608) ──
  'fjws-4576613509': {
    '925 Sterling Silver': 4608,  'Yellow Gold Overlay': 4608,  'Rose Gold Overlay': 4608,  'White Gold Overlay': 4608,
    '10k Yellow Gold': 37568, '10k Rose Gold': 37568, '10k White Gold': 37568,
    '14k Yellow Gold': 52596, '14k Rose Gold': 52596, '14k White Gold': 52596,
    '18k Yellow Gold': 60109, '18k Rose Gold': 60109, '18k White Gold': 60109,
  },

  // ── Emerald Cut Engagement Ring in 14k Solid Gold 1.50 (base ₹5,009) ──
  'fjws-4575565234': {
    '925 Sterling Silver': 5009,  'Yellow Gold Overlay': 5009,  'Rose Gold Overlay': 5009,  'White Gold Overlay': 5009,
    '10k Yellow Gold': 40073, '10k Rose Gold': 40073, '10k White Gold': 40073,
    '14k Yellow Gold': 55100, '14k Rose Gold': 55100, '14k White Gold': 55100,
    '18k Yellow Gold': 75137, '18k Rose Gold': 75137, '18k White Gold': 75137,
  },

  // ── Lapis Lazuli Ring, Blue Gemstone Band, Sterling Si (base ₹5,610) ──
  'fjws-4558001559': {
    '925 Sterling Silver': 5610,  'Yellow Gold Overlay': 5610,  'Rose Gold Overlay': 5610,  'White Gold Overlay': 5610,
    '10k Yellow Gold': 40824, '10k Rose Gold': 40824, '10k White Gold': 40824,
    '14k Yellow Gold': 56353, '14k Rose Gold': 56353, '14k White Gold': 56353,
    '18k Yellow Gold': 76890, '18k Rose Gold': 76890, '18k White Gold': 76890,
  },

  // ── Pear Cut Moissanite Solitaire Pendant Necklace, 14 (base ₹6,261) ──
  'fjws-4574617829': {
    '925 Sterling Silver': 6261,  'Yellow Gold Overlay': 6261,  'Rose Gold Overlay': 6261,  'White Gold Overlay': 7514,
  },

};

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
