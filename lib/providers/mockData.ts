import type { Platform, RawPlatformProduct } from "@/lib/types";

/**
 * Realistic-looking mock catalog. Names are deliberately inconsistent across
 * platforms (different word order, abbreviations, spacing) so the
 * normalization/matching layer (lib/product/*) has something real to prove
 * itself against. Distinct sizes/variants of the same product are included
 * on purpose and must NOT be merged together.
 */
interface MockEntry {
  keywords: string[];
  platform: Platform;
  platformProductId: string;
  rawName: string;
  brand: string;
  quantityText: string;
  price: number;
  mrp?: number;
  imageUrl: string;
  availability: boolean;
  deliveryEtaMinutes: number;
}

const IMG = (seed: string) =>
  `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(seed)}&backgroundType=gradientLinear`;

export const MOCK_CATALOG: MockEntry[] = [
  // --- Milk (Amul Taaza 1L) ---
  { keywords: ["milk", "amul", "taaza"], platform: "blinkit", platformProductId: "bk-milk-1", rawName: "Amul Taaza Toned Milk 1 L", brand: "Amul", quantityText: "1 L", price: 68, mrp: 70, imageUrl: IMG("amul-milk"), availability: true, deliveryEtaMinutes: 10 },
  { keywords: ["milk", "amul", "taaza"], platform: "zepto", platformProductId: "zp-milk-1", rawName: "Amul Taaza Milk 1L", brand: "Amul", quantityText: "1L", price: 67, mrp: 70, imageUrl: IMG("amul-milk"), availability: true, deliveryEtaMinutes: 9 },
  { keywords: ["milk", "amul", "taaza"], platform: "instamart", platformProductId: "im-milk-1", rawName: "Amul Taaza Toned Fresh Milk 1000 ml", brand: "Amul", quantityText: "1000 ml", price: 70, mrp: 70, imageUrl: IMG("amul-milk"), availability: true, deliveryEtaMinutes: 12 },
  { keywords: ["milk", "amul", "taaza"], platform: "bigbasket", platformProductId: "bb-milk-1", rawName: "Amul Taaza Milk, 1 L Pouch", brand: "Amul", quantityText: "1 L", price: 69, mrp: 70, imageUrl: IMG("amul-milk"), availability: true, deliveryEtaMinutes: 25 },
  // Amul Taaza 500ml — a DIFFERENT size, must not merge with the 1L above
  { keywords: ["milk", "amul", "taaza"], platform: "blinkit", platformProductId: "bk-milk-2", rawName: "Amul Taaza Toned Milk 500 ml", brand: "Amul", quantityText: "500 ml", price: 36, mrp: 37, imageUrl: IMG("amul-milk-500"), availability: true, deliveryEtaMinutes: 10 },
  { keywords: ["milk", "amul", "taaza"], platform: "zepto", platformProductId: "zp-milk-2", rawName: "Amul Taaza Milk 500ml", brand: "Amul", quantityText: "500ml", price: 35, mrp: 37, imageUrl: IMG("amul-milk-500"), availability: false, deliveryEtaMinutes: 9 },

  // --- Maggi 70g ---
  { keywords: ["maggi", "noodles"], platform: "blinkit", platformProductId: "bk-maggi-1", rawName: "Maggi 2-Minute Masala Noodles 70g", brand: "Maggi", quantityText: "70g", price: 14, mrp: 14, imageUrl: IMG("maggi"), availability: true, deliveryEtaMinutes: 11 },
  { keywords: ["maggi", "noodles"], platform: "zepto", platformProductId: "zp-maggi-1", rawName: "Maggi Masala Noodles 70 g", brand: "Maggi", quantityText: "70 g", price: 14, mrp: 14, imageUrl: IMG("maggi"), availability: true, deliveryEtaMinutes: 8 },
  { keywords: ["maggi", "noodles"], platform: "instamart", platformProductId: "im-maggi-1", rawName: "Nestle Maggi 2 Min Noodles Masala 70 gm", brand: "Nestle Maggi", quantityText: "70gm", price: 13, mrp: 14, imageUrl: IMG("maggi"), availability: true, deliveryEtaMinutes: 13 },
  { keywords: ["maggi", "noodles"], platform: "bigbasket", platformProductId: "bb-maggi-1", rawName: "Maggi 2 Minute Noodles - Masala, 70 g Pouch", brand: "Maggi", quantityText: "70 g", price: 14, mrp: 14, imageUrl: IMG("maggi"), availability: true, deliveryEtaMinutes: 30 },
  // Maggi 4-pack (280g) — different pack size, must stay separate
  { keywords: ["maggi", "noodles"], platform: "zepto", platformProductId: "zp-maggi-4pack", rawName: "Maggi Masala Noodles 4 x 70 g (280 g)", brand: "Maggi", quantityText: "280 g", price: 56, mrp: 60, imageUrl: IMG("maggi-4pack"), availability: true, deliveryEtaMinutes: 8 },

  // --- Coca-Cola 750ml ---
  { keywords: ["coke", "coca-cola", "cola"], platform: "blinkit", platformProductId: "bk-coke-750", rawName: "Coca-Cola Soft Drink 750 ml", brand: "Coca-Cola", quantityText: "750 ml", price: 40, mrp: 45, imageUrl: IMG("coke"), availability: true, deliveryEtaMinutes: 10 },
  { keywords: ["coke", "coca-cola", "cola"], platform: "zepto", platformProductId: "zp-coke-750", rawName: "Coca Cola 750ml", brand: "Coca-Cola", quantityText: "750ml", price: 39, mrp: 45, imageUrl: IMG("coke"), availability: true, deliveryEtaMinutes: 9 },
  { keywords: ["coke", "coca-cola", "cola"], platform: "instamart", platformProductId: "im-coke-750", rawName: "Coca-Cola Soft Drink Bottle 750 ml", brand: "Coca-Cola", quantityText: "750ml", price: 42, mrp: 45, imageUrl: IMG("coke"), availability: true, deliveryEtaMinutes: 14 },
  // Coke 1.25L — different size, must stay separate
  { keywords: ["coke", "coca-cola", "cola"], platform: "blinkit", platformProductId: "bk-coke-125", rawName: "Coca-Cola Soft Drink 1.25 L", brand: "Coca-Cola", quantityText: "1.25 L", price: 65, mrp: 70, imageUrl: IMG("coke-125"), availability: true, deliveryEtaMinutes: 10 },
  { keywords: ["coke", "coca-cola", "cola"], platform: "bigbasket", platformProductId: "bb-coke-125", rawName: "Coca-Cola Soft Drink, 1.25 L Bottle", brand: "Coca-Cola", quantityText: "1.25 L", price: 66, mrp: 70, imageUrl: IMG("coke-125"), availability: true, deliveryEtaMinutes: 28 },

  // --- Bread 400g ---
  { keywords: ["bread"], platform: "blinkit", platformProductId: "bk-bread-1", rawName: "Britannia Bread White 400g", brand: "Britannia", quantityText: "400g", price: 45, mrp: 50, imageUrl: IMG("bread"), availability: true, deliveryEtaMinutes: 10 },
  { keywords: ["bread"], platform: "zepto", platformProductId: "zp-bread-1", rawName: "Britannia White Bread 400 g", brand: "Britannia", quantityText: "400 g", price: 44, mrp: 50, imageUrl: IMG("bread"), availability: true, deliveryEtaMinutes: 9 },
  { keywords: ["bread"], platform: "instamart", platformProductId: "im-bread-1", rawName: "Britannia White Sandwich Bread 400 gm", brand: "Britannia", quantityText: "400gm", price: 46, mrp: 50, imageUrl: IMG("bread"), availability: false, deliveryEtaMinutes: 12 },
  { keywords: ["bread"], platform: "bigbasket", platformProductId: "bb-bread-1", rawName: "Britannia Bread - White, 400 g", brand: "Britannia", quantityText: "400 g", price: 45, mrp: 50, imageUrl: IMG("bread"), availability: true, deliveryEtaMinutes: 26 },

  // --- Eggs (6 pcs) ---
  { keywords: ["eggs", "egg"], platform: "blinkit", platformProductId: "bk-eggs-1", rawName: "Fresho White Eggs, 6 pcs", brand: "Fresho", quantityText: "6 pcs", price: 42, mrp: 45, imageUrl: IMG("eggs"), availability: true, deliveryEtaMinutes: 11 },
  { keywords: ["eggs", "egg"], platform: "zepto", platformProductId: "zp-eggs-1", rawName: "White Eggs 6 Pieces", brand: "Farm Fresh", quantityText: "6 pcs", price: 40, mrp: 45, imageUrl: IMG("eggs"), availability: true, deliveryEtaMinutes: 8 },
  { keywords: ["eggs", "egg"], platform: "instamart", platformProductId: "im-eggs-1", rawName: "Nutrivalue White Eggs Pack of 6", brand: "Nutrivalue", quantityText: "6 pcs", price: 41, mrp: 44, imageUrl: IMG("eggs"), availability: true, deliveryEtaMinutes: 13 },

  // --- Biscuits (Parle-G 200g) ---
  { keywords: ["biscuit", "parle", "parle-g"], platform: "blinkit", platformProductId: "bk-biscuit-1", rawName: "Parle-G Original Glucose Biscuits 200g", brand: "Parle", quantityText: "200g", price: 25, mrp: 25, imageUrl: IMG("biscuit"), availability: true, deliveryEtaMinutes: 10 },
  { keywords: ["biscuit", "parle", "parle-g"], platform: "zepto", platformProductId: "zp-biscuit-1", rawName: "Parle G Glucose Biscuits 200 g", brand: "Parle", quantityText: "200 g", price: 24, mrp: 25, imageUrl: IMG("biscuit"), availability: true, deliveryEtaMinutes: 9 },
  { keywords: ["biscuit", "parle", "parle-g"], platform: "bigbasket", platformProductId: "bb-biscuit-1", rawName: "Parle-G Biscuits - Original, 200 g Pack", brand: "Parle", quantityText: "200 g", price: 25, mrp: 25, imageUrl: IMG("biscuit"), availability: true, deliveryEtaMinutes: 24 },

  // --- Shampoo (Head & Shoulders 180ml) ---
  { keywords: ["shampoo", "head & shoulders", "head and shoulders"], platform: "blinkit", platformProductId: "bk-shampoo-1", rawName: "Head & Shoulders Anti-Dandruff Shampoo 180ml", brand: "Head & Shoulders", quantityText: "180ml", price: 175, mrp: 199, imageUrl: IMG("shampoo"), availability: true, deliveryEtaMinutes: 11 },
  { keywords: ["shampoo", "head & shoulders", "head and shoulders"], platform: "instamart", platformProductId: "im-shampoo-1", rawName: "Head and Shoulders Anti Dandruff Shampoo 180 ml", brand: "Head & Shoulders", quantityText: "180 ml", price: 180, mrp: 199, imageUrl: IMG("shampoo"), availability: true, deliveryEtaMinutes: 15 },
  { keywords: ["shampoo", "head & shoulders", "head and shoulders"], platform: "bigbasket", platformProductId: "bb-shampoo-1", rawName: "Head & Shoulders Shampoo - Anti Dandruff, 180 ml Bottle", brand: "Head & Shoulders", quantityText: "180 ml", price: 179, mrp: 199, imageUrl: IMG("shampoo"), availability: true, deliveryEtaMinutes: 27 },

  // --- Toothpaste (Colgate 150g) ---
  { keywords: ["toothpaste", "colgate"], platform: "blinkit", platformProductId: "bk-tooth-1", rawName: "Colgate Strong Teeth Toothpaste 150g", brand: "Colgate", quantityText: "150g", price: 89, mrp: 99, imageUrl: IMG("toothpaste"), availability: true, deliveryEtaMinutes: 10 },
  { keywords: ["toothpaste", "colgate"], platform: "zepto", platformProductId: "zp-tooth-1", rawName: "Colgate Strong Teeth Toothpaste 150 g", brand: "Colgate", quantityText: "150 g", price: 88, mrp: 99, imageUrl: IMG("toothpaste"), availability: true, deliveryEtaMinutes: 9 },
  { keywords: ["toothpaste", "colgate"], platform: "instamart", platformProductId: "im-tooth-1", rawName: "Colgate Strong Teeth Anticavity Toothpaste 150 gm", brand: "Colgate", quantityText: "150gm", price: 90, mrp: 99, imageUrl: IMG("toothpaste"), availability: true, deliveryEtaMinutes: 12 },
  { keywords: ["toothpaste", "colgate"], platform: "bigbasket", platformProductId: "bb-tooth-1", rawName: "Colgate Strong Teeth Toothpaste, 150 g", brand: "Colgate", quantityText: "150 g", price: 89, mrp: 99, imageUrl: IMG("toothpaste"), availability: false, deliveryEtaMinutes: 25 },
];

/**
 * Broader coverage catalog, generated from compact seeds rather than
 * hand-written per platform — this is what makes searches like "rice",
 * "atta", "chips" or "onion" return something. Each seed still gets
 * platform-specific quantity formatting ("500g" vs "500 g" vs "500 gm") so
 * it keeps exercising the same normalization the hand-curated list above
 * does, just without hand-writing every line.
 */
type QuantityUnit = "g" | "kg" | "ml" | "l" | "pcs";

interface Seed {
  id: string;
  keywords: string[];
  brand: string; // "" for unbranded produce
  name: string;
  quantity: { value: number; unit: QuantityUnit };
  basePrice: number;
  mrpMarkup?: number; // fraction above basePrice; default 0.1, 0 for no discount
  platforms?: Platform[]; // default: all 4
}

const ALL_PLATFORMS: Platform[] = ["blinkit", "zepto", "instamart", "bigbasket"];

const PLATFORM_ETA: Record<Platform, number> = { blinkit: 10, zepto: 8, instamart: 13, bigbasket: 27 };
const PLATFORM_PRICE_FACTOR: Record<Platform, number> = {
  blinkit: 1.02,
  zepto: 0.98,
  instamart: 1.05,
  bigbasket: 1.0,
};
const PLATFORM_NAME_SUFFIX: Record<Platform, string> = {
  blinkit: "",
  zepto: "",
  instamart: "",
  bigbasket: " Pack",
};

function formatQuantity(platform: Platform, value: number, unit: QuantityUnit): string {
  switch (unit) {
    case "g":
      return { blinkit: `${value}g`, zepto: `${value} g`, instamart: `${value} gm`, bigbasket: `${value} g` }[
        platform
      ];
    case "kg":
      return `${value} kg`;
    case "ml":
      return { blinkit: `${value}ml`, zepto: `${value}ml`, instamart: `${value} ml`, bigbasket: `${value} ml` }[
        platform
      ];
    case "l":
      return { blinkit: `${value}L`, zepto: `${value} L`, instamart: `${value} Litre`, bigbasket: `${value} L` }[
        platform
      ];
    case "pcs":
      return { blinkit: `${value} pcs`, zepto: `${value} Pieces`, instamart: `${value} pcs`, bigbasket: `${value} pcs` }[
        platform
      ];
  }
}

const SEEDS: Seed[] = [
  { id: "toor-dal", keywords: ["dal", "toor dal", "arhar dal"], brand: "Tata Sampann", name: "Unpolished Toor Dal", quantity: { value: 1, unit: "kg" }, basePrice: 165 },
  { id: "rice-1kg", keywords: ["rice", "basmati"], brand: "India Gate", name: "Basmati Rice", quantity: { value: 1, unit: "kg" }, basePrice: 95 },
  { id: "rice-5kg", keywords: ["rice", "basmati"], brand: "India Gate", name: "Basmati Rice", quantity: { value: 5, unit: "kg" }, basePrice: 450 },
  { id: "atta", keywords: ["atta", "flour", "wheat flour"], brand: "Aashirvaad", name: "Whole Wheat Atta", quantity: { value: 5, unit: "kg" }, basePrice: 245 },
  { id: "sugar", keywords: ["sugar"], brand: "Madhur", name: "Sugar", quantity: { value: 1, unit: "kg" }, basePrice: 48 },
  { id: "salt", keywords: ["salt"], brand: "Tata", name: "Iodized Salt", quantity: { value: 1, unit: "kg" }, basePrice: 25 },
  { id: "oil-1l", keywords: ["oil", "cooking oil", "sunflower oil"], brand: "Fortune", name: "Sunflower Oil", quantity: { value: 1, unit: "l" }, basePrice: 130 },
  { id: "oil-5l", keywords: ["oil", "cooking oil", "sunflower oil"], brand: "Fortune", name: "Sunflower Oil", quantity: { value: 5, unit: "l" }, basePrice: 620 },
  { id: "tea", keywords: ["tea"], brand: "Tata Tea", name: "Premium Tea", quantity: { value: 250, unit: "g" }, basePrice: 130 },
  { id: "coffee", keywords: ["coffee"], brand: "Nescafe", name: "Classic Coffee", quantity: { value: 200, unit: "g" }, basePrice: 280 },
  { id: "butter", keywords: ["butter"], brand: "Amul", name: "Butter", quantity: { value: 100, unit: "g" }, basePrice: 58 },
  { id: "cheese", keywords: ["cheese"], brand: "Amul", name: "Cheese Slices", quantity: { value: 200, unit: "g" }, basePrice: 125 },
  { id: "curd", keywords: ["curd", "yogurt", "dahi"], brand: "Amul", name: "Fresh Curd", quantity: { value: 400, unit: "g" }, basePrice: 45 },
  { id: "paneer", keywords: ["paneer"], brand: "Amul", name: "Fresh Paneer", quantity: { value: 200, unit: "g" }, basePrice: 90 },
  { id: "juice", keywords: ["juice", "fruit juice"], brand: "Real", name: "Mixed Fruit Juice", quantity: { value: 1, unit: "l" }, basePrice: 110 },
  { id: "chips", keywords: ["chips", "lays"], brand: "Lay's", name: "Potato Chips", quantity: { value: 52, unit: "g" }, basePrice: 20, mrpMarkup: 0 },
  { id: "namkeen", keywords: ["namkeen", "haldiram"], brand: "Haldiram's", name: "Aloo Bhujia", quantity: { value: 200, unit: "g" }, basePrice: 65 },
  { id: "chocolate", keywords: ["chocolate", "dairy milk"], brand: "Cadbury", name: "Dairy Milk Chocolate", quantity: { value: 40, unit: "g" }, basePrice: 45, mrpMarkup: 0 },
  { id: "icecream", keywords: ["ice cream", "icecream"], brand: "Amul", name: "Vanilla Ice Cream Tub", quantity: { value: 700, unit: "ml" }, basePrice: 150 },
  { id: "soap", keywords: ["soap", "bathing soap", "dove"], brand: "Dove", name: "Bathing Bar", quantity: { value: 100, unit: "g" }, basePrice: 55 },
  { id: "detergent", keywords: ["detergent", "surf excel"], brand: "Surf Excel", name: "Detergent Powder", quantity: { value: 1, unit: "kg" }, basePrice: 140 },
  { id: "dishwash", keywords: ["dishwash", "vim"], brand: "Vim", name: "Dishwash Liquid Gel", quantity: { value: 500, unit: "ml" }, basePrice: 95 },
  { id: "sanitary-pads", keywords: ["sanitary pads", "whisper"], brand: "Whisper", name: "Ultra Sanitary Pads", quantity: { value: 10, unit: "pcs" }, basePrice: 145 },
  { id: "diapers", keywords: ["diapers", "pampers"], brand: "Pampers", name: "Baby Diaper Pants", quantity: { value: 10, unit: "pcs" }, basePrice: 250 },
  { id: "tissue", keywords: ["tissue", "tissue paper"], brand: "Origami", name: "Tissue Paper Napkins", quantity: { value: 100, unit: "pcs" }, basePrice: 85 },
  { id: "water", keywords: ["water", "bottled water", "bisleri"], brand: "Bisleri", name: "Packaged Drinking Water", quantity: { value: 1, unit: "l" }, basePrice: 20, mrpMarkup: 0 },
  { id: "energy-drink", keywords: ["energy drink", "red bull"], brand: "Red Bull", name: "Energy Drink", quantity: { value: 250, unit: "ml" }, basePrice: 125, mrpMarkup: 0 },
  { id: "ketchup", keywords: ["ketchup", "kissan"], brand: "Kissan", name: "Tomato Ketchup", quantity: { value: 500, unit: "g" }, basePrice: 105 },
  { id: "jam", keywords: ["jam", "kissan jam"], brand: "Kissan", name: "Mixed Fruit Jam", quantity: { value: 500, unit: "g" }, basePrice: 145 },
  { id: "honey", keywords: ["honey", "dabur honey"], brand: "Dabur", name: "Pure Honey", quantity: { value: 250, unit: "g" }, basePrice: 165 },
  { id: "cornflakes", keywords: ["cornflakes", "kelloggs"], brand: "Kellogg's", name: "Corn Flakes", quantity: { value: 500, unit: "g" }, basePrice: 210 },
  { id: "oats", keywords: ["oats"], brand: "Saffola", name: "Oats", quantity: { value: 1, unit: "kg" }, basePrice: 175 },
  { id: "masala", keywords: ["masala", "garam masala", "mdh"], brand: "MDH", name: "Garam Masala", quantity: { value: 100, unit: "g" }, basePrice: 85 },
  { id: "mosquito", keywords: ["mosquito repellent", "all out"], brand: "All Out", name: "Mosquito Repellent Refill", quantity: { value: 45, unit: "ml" }, basePrice: 75 },
  { id: "handwash", keywords: ["hand wash", "handwash", "dettol"], brand: "Dettol", name: "Liquid Hand Wash", quantity: { value: 200, unit: "ml" }, basePrice: 89 },
  { id: "facewash", keywords: ["face wash", "himalaya"], brand: "Himalaya", name: "Neem Face Wash", quantity: { value: 100, unit: "g" }, basePrice: 115 },
  { id: "deodorant", keywords: ["deodorant", "deo", "axe"], brand: "Axe", name: "Deodorant Body Spray", quantity: { value: 150, unit: "ml" }, basePrice: 195 },
  { id: "sanitizer", keywords: ["sanitizer", "hand sanitizer"], brand: "Dettol", name: "Hand Sanitizer", quantity: { value: 200, unit: "ml" }, basePrice: 99 },
  { id: "onion", keywords: ["onion", "onions"], brand: "", name: "Fresh Onion", quantity: { value: 1, unit: "kg" }, basePrice: 32, mrpMarkup: 0 },
  { id: "potato", keywords: ["potato", "potatoes", "aloo"], brand: "", name: "Fresh Potato", quantity: { value: 1, unit: "kg" }, basePrice: 28, mrpMarkup: 0 },
  { id: "tomato", keywords: ["tomato", "tomatoes"], brand: "", name: "Fresh Tomato", quantity: { value: 1, unit: "kg" }, basePrice: 35, mrpMarkup: 0 },
  { id: "banana", keywords: ["banana", "bananas"], brand: "", name: "Fresh Banana", quantity: { value: 1, unit: "kg" }, basePrice: 45, mrpMarkup: 0 },
  { id: "apple", keywords: ["apple", "apples"], brand: "", name: "Fresh Apple", quantity: { value: 1, unit: "kg" }, basePrice: 180, mrpMarkup: 0 },
];

function buildSeedEntries(seed: Seed, seedIndex: number): MockEntry[] {
  const platforms = seed.platforms ?? ALL_PLATFORMS;
  const mrpMarkup = seed.mrpMarkup ?? 0.1;

  return platforms.map((platform, platformIndex) => {
    const qtyText = formatQuantity(platform, seed.quantity.value, seed.quantity.unit);
    const namePart = seed.brand ? `${seed.brand} ${seed.name}` : seed.name;
    const rawName = `${namePart} ${qtyText}${PLATFORM_NAME_SUFFIX[platform]}`;
    const price = Math.round(seed.basePrice * PLATFORM_PRICE_FACTOR[platform]);
    const mrp = mrpMarkup > 0 ? Math.round(price * (1 + mrpMarkup)) : undefined;
    // Deterministic, occasional out-of-stock so filters/empty-platform states
    // have real cases to exercise without every product being "in stock".
    const availability = (seedIndex * 3 + platformIndex) % 11 !== 0;

    return {
      keywords: seed.keywords,
      platform,
      platformProductId: `${platform.slice(0, 2)}-${seed.id}`,
      rawName,
      brand: seed.brand,
      quantityText: qtyText,
      price,
      mrp,
      imageUrl: IMG(seed.id),
      availability,
      deliveryEtaMinutes: PLATFORM_ETA[platform] + (seedIndex % 3),
    };
  });
}

export const GENERATED_CATALOG: MockEntry[] = SEEDS.flatMap((seed, i) => buildSeedEntries(seed, i));

export const FULL_CATALOG: MockEntry[] = [...MOCK_CATALOG, ...GENERATED_CATALOG];

function matchesQuery(entry: MockEntry, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  return (
    entry.keywords.some((k) => k.includes(q) || q.includes(k)) ||
    entry.rawName.toLowerCase().includes(q)
  );
}

/** Simulated network latency + a tiny bit of jitter, so the loading state is real. */
export function simulateLatency(min = 250, max = 900): Promise<void> {
  const ms = min + Math.random() * (max - min);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function queryMockCatalog(platform: Platform, query: string): RawPlatformProduct[] {
  return FULL_CATALOG.filter((e) => e.platform === platform && matchesQuery(e, query)).map((e) => ({
    platform: e.platform,
    platformProductId: e.platformProductId,
    rawName: e.rawName,
    brand: e.brand,
    quantityText: e.quantityText,
    price: e.price,
    mrp: e.mrp,
    imageUrl: e.imageUrl,
    availability: e.availability,
    deliveryEtaMinutes: e.deliveryEtaMinutes,
    productUrl: "#",
  }));
}
