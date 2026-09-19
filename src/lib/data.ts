export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  stone: string;
  metal: string;
  images: string[];
  description: string;
};

const metals = ['Silver', 'Gold', 'Rose Gold', 'Platinum', 'White Gold'];
const stones = ['Diamond', 'Ruby', 'Emerald', 'Sapphire', 'Moissanite', 'Amethyst', 'Topaz', 'Opal', 'Pearl', 'Morganite'];

const categoryStyles: Record<string, string[]> = {
  rings: ['Halo', 'Solitaire', 'Three-Stone', 'Vintage', 'Pavé', 'Bezel', 'Tension', 'Channel', 'Twist', 'Infinity'],
  necklaces: ['Pendant', 'Tennis', 'Choker', 'Lariat', 'Station', 'Collar', 'Rivière', 'Y-Drop', 'Halo', 'Lock'],
  earrings: ['Studs', 'Drop', 'Hoop', 'Chandelier', 'Cluster', 'Huggie', 'Dangle', 'Teardrop', 'Halo', 'Threader'],
  bracelets: ['Tennis', 'Bangle', 'Cuff', 'Chain', 'Charm', 'Link', 'Slider', 'Bolo', 'Line', 'Wrap']
};

let globalImageCounter = 1;

function generateProducts(category: string, count: number): Product[] {
  const products: Product[] = [];
  const styles = categoryStyles[category];
  
  for (let i = 0; i < count; i++) {
    const stone = stones[i % stones.length];
    const style = styles[i % styles.length];
    const metal = metals[(i * 3) % metals.length]; // Mix up metals
    
    // Create unique names like "Silver Diamond Halo Ring"
    const name = `The Royal ${metal} ${stone} ${style} ${category.slice(0, -1)}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Generate 3 completely unique images per product using LoremFlickr with locks
    // This ensures no two products or angles have the same image
    const keyword = category.slice(0, -1); // 'ring', 'necklace', etc.
    
    let finalImages = [
      `https://loremflickr.com/800/800/jewelry,${keyword}?lock=${globalImageCounter++}`,
      `https://loremflickr.com/800/800/jewelry,${keyword}?lock=${globalImageCounter++}`,
      `https://loremflickr.com/800/800/jewelry,${keyword}?lock=${globalImageCounter++}`
    ];
    let finalName = name;
    let finalStone = stone;
    
    // Use the custom AI generated Signature rings for the top 3 spots
    if (category === 'rings') {
      if (i === 0) {
        finalName = `The Signature Rose Gold Diamond Solitaire`;
        finalStone = 'Diamond';
        finalImages = [
          '/images/ai_ring1_front.jpg',
          '/images/ai_ring1_hand.jpg',
          '/images/ai_ring1_side.jpg'
        ];
      } else if (i === 1) {
        finalName = `The Imperial Platinum Emerald Ring`;
        finalStone = 'Emerald';
        finalImages = [
          '/images/ai_ring2_front.jpg',
          '/images/ai_ring2_hand.jpg',
          '/images/ai_ring2_side.jpg'
        ];
      } else if (i === 2) {
        finalName = `The Vintage Gold Sapphire Halo Ring`;
        finalStone = 'Blue Sapphire';
        finalImages = [
          '/images/ai_ring3_front.jpg',
          '/images/ai_ring3_hand.jpg',
          '/images/ai_ring3_side.jpg'
        ];
      }
    }

    const finalSlug = finalName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    products.push({
      id: `${category}-${i}`,
      name: finalName,
      slug: finalSlug,
      category,
      price: Math.floor(Math.random() * 5000) + 1500, // Random price between 1500 and 6500
      stone: finalStone,
      metal,
      images: finalImages,
      description: `Experience the breathtaking beauty of the ${finalName}. Featuring a meticulously crafted ${style} design in pure ${metal}, showcasing a brilliant ${finalStone}. Designed for timeless elegance.`
    });
  }
  
  return products;
}

// Generate exactly 20 products for each of the 4 categories (80 total)
export const products: Product[] = [
  ...generateProducts('rings', 20),
  ...generateProducts('necklaces', 20),
  ...generateProducts('earrings', 20),
  ...generateProducts('bracelets', 20)
];

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category.toLowerCase());
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}
