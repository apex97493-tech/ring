export type ProductVariant = {
  metal: string;
  colorCode: string;
  image: string;
  priceModifier?: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  shape: 'Round' | 'Oval' | 'Emerald' | 'Radiant' | 'Cushion' | 'Pear' | 'Princess' | 'Marquise' | 'Heart';
  price: number; // Discounted Selling Price
  originalPrice: number; // MRP
  carat: string;
  clarity: string;
  colorGrade: string;
  cut: string;
  certification: string;
  badge?: 'BESTSELLER' | 'VVS1 D-COLOR' | 'LIMITED EDITION' | '50% OFF' | 'NEW ARRIVAL';
  rating: number;
  reviewsCount: number;
  metal: string;
  variants: ProductVariant[];
  images: string[];
  description: string;
  features: string[];
  readyToShip: boolean;
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
] as const;

export const METALS = [
  { name: '925 Sterling Silver', color: '#E2E8F0', hex: '#E2E8F0' },
  { name: '18K Yellow Gold Plated', color: '#EAB308', hex: '#EAB308' },
  { name: '18K Rose Gold Plated', color: '#FB7185', hex: '#FB7185' },
  { name: '18K Solid White Gold', color: '#F1F5F9', hex: '#F1F5F9' },
  { name: '18K Solid Yellow Gold', color: '#CA8A04', hex: '#CA8A04' },
];

export const products: Product[] = [
  {
    id: 'moi-01',
    name: 'The Celeste Oval Solitaire Moissanite Ring',
    slug: 'celeste-oval-solitaire-moissanite-ring',
    category: 'rings',
    shape: 'Oval',
    price: 3499,
    originalPrice: 6999,
    carat: '2.00 CT',
    clarity: 'VVS1',
    colorGrade: 'D Color (Colorless)',
    cut: 'Excellent Oval Brilliant',
    certification: 'GRA Certified with Authenticity Card',
    badge: 'BESTSELLER',
    rating: 4.9,
    reviewsCount: 184,
    metal: '925 Sterling Silver',
    readyToShip: true,
    variants: [
      { metal: '925 Sterling Silver', colorCode: '#E2E8F0', image: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=800&auto=format&fit=crop' },
      { metal: '18K Yellow Gold Plated', colorCode: '#EAB308', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop' },
      { metal: '18K Rose Gold Plated', colorCode: '#FB7185', image: 'https://images.unsplash.com/photo-1599643478524-fb505410a40f?q=80&w=800&auto=format&fit=crop' },
    ],
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643478524-fb505410a40f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'The Celeste Oval Solitaire is the crown jewel of our Woke Luxury collection. Featuring a breathtaking 2.00 CT Oval Cut D-Color Moissanite center stone held in a refined 4-prong claw setting. Delivers 2.4x the fire and brilliance of a natural mined diamond at a fraction of the investment.',
    features: [
      'Passes Standard Diamond Thermal Testers',
      'GRA Certificate & Warranty Card Included',
      'Hypoallergenic & Anti-Tarnish Rhodium Polish',
      '100% Lifetime Buyback & Exchange Guarantee',
      'Complimentary Velvet Ring Box & Certificate Holder'
    ]
  },
  {
    id: 'moi-02',
    name: 'The Crown Round Brilliant Solitaire Ring',
    slug: 'crown-round-brilliant-solitaire-ring',
    category: 'rings',
    shape: 'Round',
    price: 2999,
    originalPrice: 5999,
    carat: '1.50 CT',
    clarity: 'VVS1',
    colorGrade: 'D Color (Colorless)',
    cut: 'Hearts & Arrows Ideal Cut',
    certification: 'GRA Certified with Authenticity Card',
    badge: 'VVS1 D-COLOR',
    rating: 5.0,
    reviewsCount: 230,
    metal: '925 Sterling Silver',
    readyToShip: true,
    variants: [
      { metal: '925 Sterling Silver', colorCode: '#E2E8F0', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop' },
      { metal: '18K Yellow Gold Plated', colorCode: '#EAB308', image: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=800&auto=format&fit=crop' },
      { metal: '18K Rose Gold Plated', colorCode: '#FB7185', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop' },
    ],
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'An enduring classic. The Crown Solitaire features an iconic 6-prong cathedral setting that elevates the 1.50 Carat Round Brilliant Moissanite to capture maximum ambient light for unmatched rainbow scintillation.',
    features: [
      'Hearts and Arrows Optical Symmetry',
      'Laser-Inscribed Unique GRA Serial Number',
      'Solid 925 Silver Base with 3-Micron Gold/Platinum Dip',
      'Free 15-Day Hassle-Free Returns & Resizing'
    ]
  },
  {
    id: 'moi-03',
    name: 'The Royal Emerald-Cut Solitaire with Hidden Halo',
    slug: 'royal-emerald-cut-solitaire-hidden-halo',
    category: 'rings',
    shape: 'Emerald',
    price: 3999,
    originalPrice: 7999,
    carat: '2.50 CT',
    clarity: 'VVS1 (Eye Clean Step Cut)',
    colorGrade: 'D Color (Colorless)',
    cut: 'Step Cut Rectangular Emerald',
    certification: 'GRA Certified with Authenticity Card',
    badge: 'BESTSELLER',
    rating: 4.85,
    reviewsCount: 97,
    metal: '18K Yellow Gold Plated',
    readyToShip: true,
    variants: [
      { metal: '18K Yellow Gold Plated', colorCode: '#EAB308', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop' },
      { metal: '925 Sterling Silver', colorCode: '#E2E8F0', image: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=800&auto=format&fit=crop' },
      { metal: '18K Rose Gold Plated', colorCode: '#FB7185', image: 'https://images.unsplash.com/photo-1599643478524-fb505410a40f?q=80&w=800&auto=format&fit=crop' },
    ],
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643478524-fb505410a40f?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Understated vintage opulence. The Hall-of-Mirrors reflection of this 2.50 CT Emerald Cut Moissanite is complemented by a delicate hidden pavé halo underneath the basket that catches the eye from side profile angles.',
    features: [
      'Hidden Pavé Micro-Moissanite Halo',
      'Slender 1.8mm Comfort Fit Band',
      'High-Grade Corrosion Resistant Finish',
      'Complimentary Custom Laser Engraving'
    ]
  },
  {
    id: 'moi-04',
    name: 'The Lumina Radiant Cut Pavé Band Ring',
    slug: 'lumina-radiant-cut-pave-band-ring',
    category: 'rings',
    shape: 'Radiant',
    price: 4299,
    originalPrice: 8499,
    carat: '3.00 CT',
    clarity: 'VVS1',
    colorGrade: 'D Color (Colorless)',
    cut: 'Crushed Ice Radiant Cut',
    certification: 'GRA Certified with Authenticity Card',
    badge: 'LIMITED EDITION',
    rating: 4.95,
    reviewsCount: 142,
    metal: '925 Sterling Silver',
    readyToShip: true,
    variants: [
      { metal: '925 Sterling Silver', colorCode: '#E2E8F0', image: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=800&auto=format&fit=crop' },
      { metal: '18K Yellow Gold Plated', colorCode: '#EAB308', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop' },
    ],
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'A showstopping statement ring. The 3.00 CT Radiant Cut combines the elegant silhouette of an emerald cut with the intense sparkle of a round brilliant, perched on a French-pavé encrusted band.',
    features: [
      'Crushed Ice Faceting for Maximum Fire',
      'French-Pavé Half Eternity Band',
      'Reinforced Platinum-Prong Setting',
      '100% Conflict-Free Lab Grown'
    ]
  },
  {
    id: 'moi-05',
    name: 'The Elara Pear Drop Moissanite Solitaire',
    slug: 'elara-pear-drop-moissanite-solitaire',
    category: 'rings',
    shape: 'Pear',
    price: 3199,
    originalPrice: 6399,
    carat: '1.80 CT',
    clarity: 'VVS1',
    colorGrade: 'D Color (Colorless)',
    cut: 'Modified Pear Brilliant',
    certification: 'GRA Certified with Authenticity Card',
    badge: '50% OFF',
    rating: 4.88,
    reviewsCount: 76,
    metal: '18K Rose Gold Plated',
    readyToShip: true,
    variants: [
      { metal: '18K Rose Gold Plated', colorCode: '#FB7185', image: 'https://images.unsplash.com/photo-1599643478524-fb505410a40f?q=80&w=800&auto=format&fit=crop' },
      { metal: '925 Sterling Silver', colorCode: '#E2E8F0', image: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=800&auto=format&fit=crop' },
      { metal: '18K Yellow Gold Plated', colorCode: '#EAB308', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop' },
    ],
    images: [
      'https://images.unsplash.com/photo-1599643478524-fb505410a40f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Flattering, elongating, and dramatically feminine. The Elara Pear Drop features a protective V-tip chevron prong that shields the delicate tip of the pear while maximizing stone visibility.',
    features: [
      'Finger-Elongating Teardrop Proportion',
      'V-Prong Reinforced Tip Protection',
      'Ultra-Smooth Comfort Shank',
      'Certificate of Authenticity with QR Verification'
    ]
  },
  {
    id: 'moi-06',
    name: 'The Aurelia Cushion Cut Vintage Solitaire',
    slug: 'aurelia-cushion-cut-vintage-solitaire',
    category: 'rings',
    shape: 'Cushion',
    price: 3699,
    originalPrice: 7299,
    carat: '2.00 CT',
    clarity: 'VVS1',
    colorGrade: 'D Color (Colorless)',
    cut: 'Elongated Cushion Brilliant',
    certification: 'GRA Certified with Authenticity Card',
    badge: 'NEW ARRIVAL',
    rating: 4.92,
    reviewsCount: 64,
    metal: '925 Sterling Silver',
    readyToShip: true,
    variants: [
      { metal: '925 Sterling Silver', colorCode: '#E2E8F0', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop' },
      { metal: '18K Yellow Gold Plated', colorCode: '#EAB308', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop' },
    ],
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'A harmonious blend of old-world charm and modern brilliance. Pillow-soft rounded corners with an elongated ratio that looks exceptionally flattering on any hand.',
    features: [
      '1.15 Elongated Cushion Ratio',
      'Vintage Milgrain Gallery Work',
      'Certified D-Color VVS1 Moissanite',
      'Lifetime Polish & Prong Inspection Free'
    ]
  },
  {
    id: 'moi-07',
    name: 'The Victoria Princess Cut Solitaire Ring',
    slug: 'victoria-princess-cut-solitaire-ring',
    category: 'rings',
    shape: 'Princess',
    price: 3399,
    originalPrice: 6799,
    carat: '2.00 CT',
    clarity: 'VVS1',
    colorGrade: 'D Color (Colorless)',
    cut: 'Square Modified Brilliant',
    certification: 'GRA Certified with Authenticity Card',
    badge: 'BESTSELLER',
    rating: 4.89,
    reviewsCount: 112,
    metal: '925 Sterling Silver',
    readyToShip: true,
    variants: [
      { metal: '925 Sterling Silver', colorCode: '#E2E8F0', image: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=800&auto=format&fit=crop' },
      { metal: '18K Yellow Gold Plated', colorCode: '#EAB308', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop' },
    ],
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Crisp geometric lines meeting explosive sparkle. The 4 corner chevron prongs shield the edges of this 2.00 CT Princess Cut while letting pure light pass through.',
    features: [
      'Sharp 90-Degree Geometric Angles',
      'Reinforced V-Corner Prongs',
      'High-Polish Mirror Finish Band',
      'Full GRA Lab Report Included'
    ]
  },
  {
    id: 'moi-08',
    name: 'The Siren Marquise Vintage Solitaire',
    slug: 'siren-marquise-vintage-solitaire',
    category: 'rings',
    shape: 'Marquise',
    price: 3799,
    originalPrice: 7599,
    carat: '2.20 CT',
    clarity: 'VVS1',
    colorGrade: 'D Color (Colorless)',
    cut: 'Marquise Brilliant',
    certification: 'GRA Certified with Authenticity Card',
    badge: 'LIMITED EDITION',
    rating: 4.96,
    reviewsCount: 88,
    metal: '18K Yellow Gold Plated',
    readyToShip: true,
    variants: [
      { metal: '18K Yellow Gold Plated', colorCode: '#EAB308', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop' },
      { metal: '925 Sterling Silver', colorCode: '#E2E8F0', image: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=800&auto=format&fit=crop' },
    ],
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643478524-fb505410a40f?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'A silhouette favored by royal dynasties. The Marquise cut boasts the largest surface area per carat of any diamond cut, giving the illusion of a monumental center stone.',
    features: [
      'Maximum Carat Surface Spread',
      'Twin Protective End Caps',
      'Ultra-Comfort Tapered Band',
      '100% Lifetime Buyback Policy'
    ]
  },
  {
    id: 'moi-09',
    name: 'The Eternity Moissanite Tennis Band',
    slug: 'eternity-moissanite-tennis-band',
    category: 'band',
    shape: 'Round',
    price: 2499,
    originalPrice: 4999,
    carat: '3.50 CT Total',
    clarity: 'VVS1',
    colorGrade: 'D Color (Colorless)',
    cut: 'Full Eternity Round Brilliant',
    certification: 'GRA Certified with Authenticity Card',
    badge: 'BESTSELLER',
    rating: 4.97,
    reviewsCount: 310,
    metal: '925 Sterling Silver',
    readyToShip: true,
    variants: [
      { metal: '925 Sterling Silver', colorCode: '#E2E8F0', image: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=800&auto=format&fit=crop' },
      { metal: '18K Yellow Gold Plated', colorCode: '#EAB308', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop' },
      { metal: '18K Rose Gold Plated', colorCode: '#FB7185', image: 'https://images.unsplash.com/photo-1599643478524-fb505410a40f?q=80&w=800&auto=format&fit=crop' },
    ],
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'An unbroken circle of pure light. Features 22 hand-set 3.0mm D-Color VVS1 Moissanite stones in a seamless 4-prong low profile setting. Perfect for stacking with your solitaire.',
    features: [
      'Full 360-Degree Continuous Sparkle',
      'Individually Checked & Graded Stones',
      'Comfort-Fit Beveled Inner Edge',
      'Stackable with all Solitaire Rings'
    ]
  },
  {
    id: 'moi-10',
    name: 'The Stacking Curved Chevron Tiara Band',
    slug: 'stacking-curved-chevron-tiara-band',
    category: 'ring-set',
    shape: 'Round',
    price: 1899,
    originalPrice: 3799,
    carat: '0.80 CT Total',
    clarity: 'VVS1',
    colorGrade: 'D Color (Colorless)',
    cut: 'Round & Marquise Accent Cluster',
    certification: 'GRA Certified with Authenticity Card',
    badge: 'HOT' as any,
    rating: 4.91,
    reviewsCount: 155,
    metal: '18K Yellow Gold Plated',
    readyToShip: true,
    variants: [
      { metal: '18K Yellow Gold Plated', colorCode: '#EAB308', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop' },
      { metal: '925 Sterling Silver', colorCode: '#E2E8F0', image: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=800&auto=format&fit=crop' },
    ],
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643478524-fb505410a40f?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Designed specifically to nest seamlessly around oval, pear, and round solitaires like a royal crown tiara.',
    features: [
      'Contoured Deep Dip for Solitaire Stones',
      'Marquise & Round Cluster Arrangement',
      'Stands Stunning on Its Own or in a Stack',
      'Anti-Scratch Protective Barrier'
    ]
  },
  {
    id: 'moi-11',
    name: 'The Solitaire Moissanite Pendant Necklace',
    slug: 'solitaire-moissanite-pendant-necklace',
    category: 'pendant',
    shape: 'Round',
    price: 2799,
    originalPrice: 5599,
    carat: '2.00 CT',
    clarity: 'VVS1',
    colorGrade: 'D Color',
    cut: 'Round Brilliant',
    certification: 'GRA Certified with Authenticity Card',
    badge: 'BESTSELLER',
    rating: 4.94,
    reviewsCount: 168,
    metal: '925 Sterling Silver',
    readyToShip: true,
    variants: [
      { metal: '925 Sterling Silver', colorCode: '#E2E8F0', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop' },
      { metal: '18K Yellow Gold Plated', colorCode: '#EAB308', image: 'https://images.unsplash.com/photo-1599643478524-fb505410a40f?q=80&w=800&auto=format&fit=crop' },
    ],
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599643478524-fb505410a40f?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Effortless luxury for your neckline. An authentic 2.00 CT D-Color Moissanite suspended on an adjustable Italian box chain that catches light with every breath.',
    features: [
      'Includes 16-18 Inch Adjustable Italian Chain',
      '4-Prong Basket for Maximum Luminescence',
      'Spring Ring Lock with Stamp Certificate',
      '100% Sweat & Waterproof Rhodium Plating'
    ]
  },
  {
    id: 'moi-12',
    name: 'The Classic Moissanite Stud Earrings (Pair)',
    slug: 'classic-moissanite-stud-earrings-pair',
    category: 'earrings',
    shape: 'Round',
    price: 2999,
    originalPrice: 5999,
    carat: '2.00 CTW (1.0ct each)',
    clarity: 'VVS1',
    colorGrade: 'D Color',
    cut: 'Ideal Cut Round Brilliant',
    certification: 'GRA Certified with Authenticity Card',
    badge: 'BESTSELLER',
    rating: 4.98,
    reviewsCount: 420,
    metal: '925 Sterling Silver',
    readyToShip: true,
    variants: [
      { metal: '925 Sterling Silver', colorCode: '#E2E8F0', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop' },
      { metal: '18K Yellow Gold Plated', colorCode: '#EAB308', image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop' },
    ],
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'The definitive daily luxury earring pair. 1 Carat D-Color VVS1 Moissanite per ear, fitted with secure screw-backs so you never worry about losing them.',
    features: [
      'Comfort-Fit Secure Screw Backs',
      'Certified Dual GRA Certificates (One Per Earring)',
      '100% Skin Safe & Nickel-Free',
      'Daily Wear & Shower Safe'
    ]
  }
];

export function getProductsByCategory(category: string): Product[] {
  if (category === 'all' || category === 'shop') return products;
  return products.filter(p => p.category === category.toLowerCase());
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}
