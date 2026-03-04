// Mock data and calculation engine for FarmWise AI

export const CROPS = [
  'Maize', 'Beans', 'Wheat', 'Rice', 'Sorghum', 'Tea', 'Coffee', 'Potatoes', 'Tomatoes', 'Onions'
] as const;

export type CropType = typeof CROPS[number];

export const COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet',
  'Embu', 'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado',
  'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga',
  'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia',
  'Lamu', 'Machakos', 'Makueni', 'Mandera', 'Marsabit',
  'Meru', 'Migori', 'Mombasa', 'Muranga', 'Nairobi',
  'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua',
  'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River',
  'Tharaka-Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu',
  'Vihiga', 'Wajir', 'West Pokot',
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

const BASE_YIELDS: Record<CropType, number> = {
  Maize: 1.8, Beans: 0.6, Wheat: 1.2, Rice: 2.5, Sorghum: 1.0,
  Tea: 2.2, Coffee: 0.8, Potatoes: 8.0, Tomatoes: 12.0, Onions: 10.0,
};

// Farmgate prices in KES per tonne (raw produce, farm-to-factory/market)
// Tea = green leaf ~25 KES/kg; Coffee = cherry ~60 KES/kg
const MARKET_PRICES: Record<CropType, number> = {
  Maize: 50000, Beans: 100000, Wheat: 55000, Rice: 90000, Sorghum: 40000,
  Tea: 25000, Coffee: 60000, Potatoes: 35000, Tomatoes: 60000, Onions: 50000,
};

const SOIL_MULTIPLIERS: Record<SoilType, number> = {
  Loam: 1.15, Clay: 0.85, Sandy: 0.75, Silt: 1.0, 'Clay Loam': 1.05, 'Sandy Loam': 0.95,
};

const BASE_COSTS: Record<CropType, number> = {
  Maize: 25000, Beans: 18000, Wheat: 30000, Rice: 45000, Sorghum: 15000,
  Tea: 35000, Coffee: 40000, Potatoes: 40000, Tomatoes: 50000, Onions: 35000,
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

// County markets for all 47 counties
export const COUNTY_MARKETS: Record<County, string[]> = {
  'Baringo': ['Kabarnet Market', 'Marigat Market'],
  'Bomet': ['Bomet Town Market', 'Sotik Market'],
  'Bungoma': ['Bungoma Municipal Market', 'Webuye Market'],
  'Busia': ['Busia Town Market', 'Malaba Border Market'],
  'Elgeyo-Marakwet': ['Iten Market', 'Kapsowar Market'],
  'Embu': ['Embu Town Market', 'Runyenjes Market'],
  'Garissa': ['Garissa Town Market'],
  'Homa Bay': ['Homa Bay Town Market', 'Oyugis Market'],
  'Isiolo': ['Isiolo Town Market'],
  'Kajiado': ['Kajiado Town Market', 'Ngong Market', 'Kitengela Market'],
  'Kakamega': ['Kakamega Municipal Market', 'Mumias Market'],
  'Kericho': ['Kericho Town Market', 'Litein Market'],
  'Kiambu': ['Githunguri Market', 'Thika Market', 'Limuru Market'],
  'Kilifi': ['Kilifi Town Market', 'Malindi Market'],
  'Kirinyaga': ['Kerugoya Market', 'Wanguru Market', 'Kagio Market'],
  'Kisii': ['Kisii Town Market', 'Daraja Mbili Market'],
  'Kisumu': ['Kisumu Municipal Market', 'Ahero Market'],
  'Kitui': ['Kitui Town Market', 'Mwingi Market'],
  'Kwale': ['Kwale Town Market', 'Ukunda Market'],
  'Laikipia': ['Nanyuki Market', 'Rumuruti Market'],
  'Lamu': ['Lamu Town Market'],
  'Machakos': ['Machakos Town Market', 'Tala Market'],
  'Makueni': ['Wote Market', 'Emali Market'],
  'Mandera': ['Mandera Town Market'],
  'Marsabit': ['Marsabit Town Market'],
  'Meru': ['Meru Town Market', 'Nkubu Market', 'Maua Market'],
  'Migori': ['Migori Town Market', 'Rongo Market'],
  'Mombasa': ['Kongowea Market', 'Marikiti Market'],
  'Muranga': ['Muranga Town Market', 'Kenol Market'],
  'Nairobi': ['Wakulima Market', 'Gikomba Market', 'City Park Market'],
  'Nakuru': ['Nakuru Town Market', 'Naivasha Market', 'NCPB Nakuru'],
  'Nandi': ['Kapsabet Market', 'Nandi Hills Market'],
  'Narok': ['Narok Town Market', 'Kilgoris Market'],
  'Nyamira': ['Nyamira Town Market', 'Keroka Market'],
  'Nyandarua': ['Ol Kalou Market', 'Engineer Market'],
  'Nyeri': ['Nyeri Town Market', 'Karatina Market'],
  'Samburu': ['Maralal Market'],
  'Siaya': ['Siaya Town Market', 'Bondo Market'],
  'Taita-Taveta': ['Voi Market', 'Wundanyi Market'],
  'Tana River': ['Hola Market', 'Garsen Market'],
  'Tharaka-Nithi': ['Chuka Market', 'Marimanti Market'],
  'Trans Nzoia': ['Kitale Municipal Market', 'NCPB Kitale'],
  'Turkana': ['Lodwar Market'],
  'Uasin Gishu': ['Eldoret Main Market', 'NCPB Eldoret'],
  'Vihiga': ['Mbale Market', 'Luanda Market'],
  'Wajir': ['Wajir Town Market'],
  'West Pokot': ['Kapenguria Market', 'Makutano Market'],
};

export interface MarketPrice {
  crop: CropType;
  county: County;
  price: number;
  change7d: number;
  change30d: number;
  volatility: 'Low' | 'Medium' | 'High';
  highestBuyingCounty: County;
  market: string;
}

export function getMarketData(cropCounties?: Record<CropType, County[]>): MarketPrice[] {
  return CROPS.flatMap(crop => {
    const counties: County[] = cropCounties?.[crop] || COUNTIES.slice(0, 10);
    return counties.map(county => {
      const markets = COUNTY_MARKETS[county];
      return {
        crop,
        county,
        price: MARKET_PRICES[crop] + Math.round((Math.random() - 0.5) * MARKET_PRICES[crop] * 0.12),
        change7d: parseFloat(((Math.random() - 0.4) * 8).toFixed(1)),
        change30d: parseFloat(((Math.random() - 0.3) * 15).toFixed(1)),
        volatility: (['Low', 'Medium', 'High'] as const)[Math.floor(Math.random() * 3)],
        highestBuyingCounty: COUNTIES[Math.floor(Math.random() * COUNTIES.length)],
        market: markets[Math.floor(Math.random() * markets.length)],
      };
    });
  });
}

export function getPriceTrend(crop: CropType): { day: string; price: number }[] {
  const base = MARKET_PRICES[crop];
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const startDate = new Date(now);
  startDate.setFullYear(startDate.getFullYear() - 1);
  const totalDays = Math.ceil((tomorrow.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return Array.from({ length: totalDays }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const month = date.getMonth();
    const seasonal = Math.sin((month - 1) * Math.PI / 6) * 0.08;
    const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    const pseudoRandom = ((Math.sin(seed * 9301 + 49297) % 233280) / 233280 + 1) % 1;
    const noise = (pseudoRandom - 0.48) * base * 0.025;
    const trend = i * (base * 0.00008);
    return {
      day: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      price: Math.round(base * (1 + seasonal) + noise + trend),
    };
  });
}

// Marketplace types (kept here for backward compat)
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
      id: `f-${i}`, type: 'farmer', name, crop,
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
      id: `b-${i}`, type: 'buyer', name, crop,
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
