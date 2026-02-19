// Mock data and calculation engine for FarmWise AI
// Structured for future API integration

export const CROPS = [
  'Maize', 'Beans', 'Wheat', 'Rice', 'Sorghum', 'Tea', 'Coffee', 'Potatoes', 'Tomatoes', 'Onions'
] as const;

export type CropType = typeof CROPS[number];

export const COUNTIES = [
  'Nakuru', 'Uasin Gishu', 'Trans Nzoia', 'Nyandarua', 'Kiambu',
  'Meru', 'Nyeri', 'Kirinyaga', 'Machakos', 'Bungoma',
  'Kakamega', 'Kisii', 'Narok', 'Laikipia', 'Embu'
] as const;

export type County = typeof COUNTIES[number];

export const SOIL_TYPES = ['Loam', 'Clay', 'Sandy', 'Silt', 'Clay Loam', 'Sandy Loam'] as const;
export type SoilType = typeof SOIL_TYPES[number];

export interface FarmInput {
  crop: CropType;
  county: County;
  farmSize: number;
  soilType: SoilType;
  fertilizerBudget: number;
  expectedRainfall?: number;
}

export interface FarmAnalysis {
  estimatedYield: number;
  estimatedRevenue: number;
  estimatedCost: number;
  projectedProfit: number;
  breakEvenAcres: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  recommendations: string[];
  profitMargin: number;
}

// Average yield per acre in tons (mock data)
const BASE_YIELDS: Record<CropType, number> = {
  Maize: 1.8, Beans: 0.6, Wheat: 1.2, Rice: 2.5, Sorghum: 1.0,
  Tea: 2.2, Coffee: 0.8, Potatoes: 8.0, Tomatoes: 12.0, Onions: 10.0,
};

// Market prices per ton in KES
const MARKET_PRICES: Record<CropType, number> = {
  Maize: 35000, Beans: 80000, Wheat: 45000, Rice: 90000, Sorghum: 30000,
  Tea: 250000, Coffee: 400000, Potatoes: 25000, Tomatoes: 40000, Onions: 35000,
};

// Soil multipliers
const SOIL_MULTIPLIERS: Record<SoilType, number> = {
  Loam: 1.15, Clay: 0.85, Sandy: 0.75, Silt: 1.0, 'Clay Loam': 1.05, 'Sandy Loam': 0.95,
};

// Cost per acre in KES
const BASE_COSTS: Record<CropType, number> = {
  Maize: 25000, Beans: 18000, Wheat: 30000, Rice: 45000, Sorghum: 15000,
  Tea: 60000, Coffee: 55000, Potatoes: 40000, Tomatoes: 50000, Onions: 35000,
};

export function calculateFarmAnalysis(input: FarmInput): FarmAnalysis {
  const soilMultiplier = SOIL_MULTIPLIERS[input.soilType];
  const fertilizerBonus = Math.min(input.fertilizerBudget / (input.farmSize * 5000), 0.3);
  const rainfallFactor = input.expectedRainfall
    ? Math.min(input.expectedRainfall / 800, 1.2)
    : 0.9;

  const yieldPerAcre = BASE_YIELDS[input.crop] * soilMultiplier * (1 + fertilizerBonus) * rainfallFactor;
  const estimatedYield = parseFloat((yieldPerAcre * input.farmSize).toFixed(2));
  const pricePerTon = MARKET_PRICES[input.crop];
  const estimatedRevenue = Math.round(estimatedYield * pricePerTon);
  const estimatedCost = Math.round(BASE_COSTS[input.crop] * input.farmSize + input.fertilizerBudget);
  const projectedProfit = estimatedRevenue - estimatedCost;
  const profitMargin = estimatedRevenue > 0 ? parseFloat(((projectedProfit / estimatedRevenue) * 100).toFixed(1)) : 0;

  const costPerAcre = estimatedCost / input.farmSize;
  const revenuePerAcre = estimatedRevenue / input.farmSize;
  const breakEvenAcres = revenuePerAcre > 0 ? parseFloat((costPerAcre / (revenuePerAcre / input.farmSize)).toFixed(2)) : 0;

  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  if (profitMargin < 15) riskLevel = 'High';
  else if (profitMargin < 30) riskLevel = 'Medium';

  const recommendations: string[] = [];
  if (soilMultiplier < 0.9) recommendations.push(`Consider soil amendment — ${input.soilType} soil reduces yield. Add organic matter.`);
  if (fertilizerBonus < 0.1) recommendations.push('Increase fertilizer budget to boost yield by up to 30%.');
  if (riskLevel === 'High') recommendations.push('High risk detected. Consider diversifying crops or reducing farm size.');
  if (profitMargin > 40) recommendations.push('Strong margins! Consider expanding acreage next season.');
  recommendations.push(`${input.crop} performs well in ${input.county}. Monitor market prices weekly.`);

  return {
    estimatedYield, estimatedRevenue, estimatedCost, projectedProfit,
    breakEvenAcres, riskLevel, recommendations, profitMargin,
  };
}

// Market data
export interface MarketPrice {
  crop: CropType;
  county: County;
  price: number;
  change7d: number;
  change30d: number;
  volatility: 'Low' | 'Medium' | 'High';
  highestBuyingCounty: County;
}

export function getMarketData(): MarketPrice[] {
  return CROPS.slice(0, 6).flatMap(crop =>
    COUNTIES.slice(0, 5).map(county => ({
      crop,
      county,
      price: MARKET_PRICES[crop] + Math.round((Math.random() - 0.5) * MARKET_PRICES[crop] * 0.15),
      change7d: parseFloat(((Math.random() - 0.4) * 8).toFixed(1)),
      change30d: parseFloat(((Math.random() - 0.3) * 15).toFixed(1)),
      volatility: (['Low', 'Medium', 'High'] as const)[Math.floor(Math.random() * 3)],
      highestBuyingCounty: COUNTIES[Math.floor(Math.random() * 5)],
    }))
  );
}

export function getPriceTrend(crop: CropType): { day: string; price: number }[] {
  const base = MARKET_PRICES[crop];
  const now = new Date();
  // Generate ~365 daily data points going back 12 months
  return Array.from({ length: 365 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (364 - i));
    const month = date.getMonth();
    // Seasonal variation: prices tend to be higher around Feb-Apr (post-harvest scarcity)
    const seasonal = Math.sin((month - 1) * Math.PI / 6) * 0.08;
    // Random walk with slight uptrend
    const noise = (Math.random() - 0.48) * base * 0.03;
    const trend = i * (base * 0.0001);
    return {
      day: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      price: Math.round(base * (1 + seasonal) + noise + trend),
    };
  });
}

// Marketplace
export interface Listing {
  id: string;
  type: 'farmer' | 'buyer';
  name: string;
  crop: CropType;
  county: County;
  quantity: number;
  price: number;
  date: string;
  description: string;
  matchScore?: number;
}

export function getMarketplaceListings(): Listing[] {
  const farmerNames = ['John Kamau', 'Mary Wanjiku', 'Peter Ochieng', 'Grace Muthoni', 'James Kiprop'];
  const buyerNames = ['KenGrain Ltd', 'FreshMart Kenya', 'Nairobi Foods Co', 'AgriTrade East', 'Harvest Direct'];

  const listings: Listing[] = [];
  farmerNames.forEach((name, i) => {
    const crop = CROPS[i % CROPS.length];
    listings.push({
      id: `f-${i}`,
      type: 'farmer',
      name,
      crop,
      county: COUNTIES[i % COUNTIES.length],
      quantity: Math.round(2 + Math.random() * 18),
      price: MARKET_PRICES[crop] - Math.round(Math.random() * 5000),
      date: `2026-0${3 + (i % 3)}-${10 + i}`,
      description: `Fresh ${crop.toLowerCase()} from ${COUNTIES[i % COUNTIES.length]} county. Quality certified.`,
    });
  });
  buyerNames.forEach((name, i) => {
    const crop = CROPS[(i + 2) % CROPS.length];
    listings.push({
      id: `b-${i}`,
      type: 'buyer',
      name,
      crop,
      county: COUNTIES[(i + 1) % COUNTIES.length],
      quantity: Math.round(5 + Math.random() * 45),
      price: MARKET_PRICES[crop] + Math.round(Math.random() * 8000),
      date: `2026-0${3 + (i % 2)}-${5 + i}`,
      description: `Looking for quality ${crop.toLowerCase()}. Bulk purchase, prompt payment.`,
      matchScore: Math.round(60 + Math.random() * 35),
    });
  });
  return listings;
}
