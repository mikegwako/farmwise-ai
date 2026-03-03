// Comprehensive Kenyan agricultural data
// Crop-county mapping, agronomic advisory, and county markets

import type { CropType, County } from './farmData';

// Which counties grow which crops (realistic Kenyan agriculture)
export const CROP_COUNTIES: Record<CropType, County[]> = {
  Maize: [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu',
    'Homa Bay', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kirinyaga',
    'Kisii', 'Kisumu', 'Kitui', 'Laikipia', 'Machakos', 'Makueni', 'Meru',
    'Migori', 'Muranga', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua',
    'Nyeri', 'Siaya', 'Tharaka-Nithi', 'Trans Nzoia', 'Uasin Gishu',
    'Vihiga', 'West Pokot',
  ],
  Beans: [
    'Bomet', 'Bungoma', 'Busia', 'Embu', 'Homa Bay', 'Kakamega', 'Kiambu',
    'Kirinyaga', 'Kisii', 'Kitui', 'Machakos', 'Makueni', 'Meru', 'Migori',
    'Muranga', 'Nakuru', 'Narok', 'Nyandarua', 'Nyeri', 'Siaya',
    'Tharaka-Nithi', 'Trans Nzoia', 'Vihiga',
  ],
  Wheat: [
    'Elgeyo-Marakwet', 'Laikipia', 'Nakuru', 'Narok', 'Nyandarua',
    'Trans Nzoia', 'Uasin Gishu',
  ],
  Rice: [
    'Busia', 'Homa Bay', 'Kilifi', 'Kirinyaga', 'Kisumu', 'Kwale',
    'Migori', 'Siaya', 'Tana River',
  ],
  Sorghum: [
    'Baringo', 'Busia', 'Homa Bay', 'Kitui', 'Machakos', 'Makueni',
    'Meru', 'Migori', 'Siaya', 'Tharaka-Nithi', 'Turkana', 'West Pokot',
  ],
  Tea: [
    'Bomet', 'Embu', 'Kakamega', 'Kericho', 'Kiambu', 'Kirinyaga',
    'Kisii', 'Meru', 'Muranga', 'Nandi', 'Nyamira', 'Nyeri', 'Vihiga',
  ],
  Coffee: [
    'Bungoma', 'Embu', 'Kiambu', 'Kirinyaga', 'Kisii', 'Machakos',
    'Meru', 'Muranga', 'Nakuru', 'Nyeri', 'Tharaka-Nithi',
  ],
  Potatoes: [
    'Bomet', 'Elgeyo-Marakwet', 'Kiambu', 'Meru', 'Nakuru', 'Narok',
    'Nyandarua', 'Nyeri', 'Taita-Taveta', 'West Pokot',
  ],
  Tomatoes: [
    'Embu', 'Kajiado', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Laikipia',
    'Machakos', 'Makueni', 'Meru', 'Nakuru', 'Narok', 'Taita-Taveta',
  ],
  Onions: [
    'Embu', 'Kajiado', 'Kericho', 'Kitui', 'Machakos', 'Makueni',
    'Meru', 'Nakuru', 'Narok',
  ],
};

// Planting advisory data — real Kenyan agricultural recommendations
export interface CropAdvisory {
  plantingSeason: string;
  daysToMaturity: [number, number];
  fertilizers: { name: string; rate: string; timing: string }[];
  seedVarieties: string[];
  spacing: string;
  tips: string[];
}

export const CROP_ADVISORIES: Record<CropType, CropAdvisory> = {
  Maize: {
    plantingSeason: 'Long rains: March–May | Short rains: October–December',
    daysToMaturity: [90, 150],
    fertilizers: [
      { name: 'DAP (18:46:0)', rate: '50 kg/acre', timing: 'At planting — mix in furrow' },
      { name: 'CAN (26:0:0)', rate: '50 kg/acre', timing: 'Top dress at knee height (4–6 weeks)' },
    ],
    seedVarieties: ['H614D (highland)', 'H6213 (mid-altitude)', 'DK8031 (lowland)', 'WH507 (early maturing)', 'KH600-23A (drought tolerant)'],
    spacing: '75 cm between rows × 30 cm between plants (2 seeds per hole)',
    tips: [
      'Plant at the onset of rains — soil should be moist but not waterlogged',
      'Apply manure (1 ton/acre) 2 weeks before planting for best results',
      'Scout for Fall Armyworm weekly — use Emamectin benzoate if spotted early',
      'Harvest when husks are dry and kernels are hard (below 13% moisture)',
    ],
  },
  Beans: {
    plantingSeason: 'Long rains: March–May | Short rains: October–December',
    daysToMaturity: [60, 90],
    fertilizers: [
      { name: 'DAP (18:46:0)', rate: '25 kg/acre', timing: 'At planting — band beside seed' },
      { name: 'Foliar feed (e.g. Boost)', rate: 'As directed', timing: 'At flowering stage' },
    ],
    seedVarieties: ['KAT B1 (drought tolerant)', 'Rose Coco (GLP2)', 'Mwitemania (KAT B9)', 'Chelalang (high altitude)', 'KATX69 (disease resistant)'],
    spacing: '50 cm between rows × 15 cm between plants',
    tips: [
      'Inoculate seeds with Rhizobium before planting to boost nitrogen fixation',
      'Avoid waterlogged soils — beans are sensitive to root rot',
      'Rotate with cereals (maize, sorghum) to break disease cycles',
      'Harvest when 90% of pods have turned yellow-brown, dry to 12% moisture',
    ],
  },
  Wheat: {
    plantingSeason: 'Long rains: March–June (main season in highlands)',
    daysToMaturity: [100, 130],
    fertilizers: [
      { name: 'DAP (18:46:0)', rate: '50 kg/acre', timing: 'At planting — drill with seed' },
      { name: 'CAN (26:0:0)', rate: '50 kg/acre', timing: 'Top dress at tillering (3–4 weeks)' },
    ],
    seedVarieties: ['Kenya Fahari', 'Eagle 10', 'Robin', 'Njoro BW2', 'Kenya Korongo'],
    spacing: 'Drill in rows 20 cm apart, seed rate 40–50 kg/acre',
    tips: [
      'Best above 1,800m altitude with cool temperatures',
      'Apply herbicide (Puma Super) at 3-leaf stage for weed control',
      'Watch for rust diseases — use fungicide at flag leaf stage',
      'Harvest when grain moisture is below 13% — combine or hand-cut',
    ],
  },
  Rice: {
    plantingSeason: 'Irrigated: April–August | Rain-fed: October–February',
    daysToMaturity: [120, 150],
    fertilizers: [
      { name: 'DAP (18:46:0)', rate: '50 kg/acre', timing: 'At transplanting (basal)' },
      { name: 'SA (21:0:0)', rate: '50 kg/acre', timing: 'Top dress at tillering and panicle initiation' },
    ],
    seedVarieties: ['Basmati 370 (aromatic, premium price)', 'BW 196 (high yield)', 'IR 2793 (irrigated)', 'NERICA 1 (upland)', 'Komboka (lowland)'],
    spacing: '20 cm × 20 cm (transplanted) | Broadcast at 30 kg/acre',
    tips: [
      'Nursery: sow in raised beds, transplant at 21 days (3-leaf stage)',
      'Maintain 5–10 cm water depth during growing; drain before harvest',
      'Major pests: stalk borer, rice blast — scout regularly',
      'Harvest when 80% of grains are golden; dry on clean surface to 14% moisture',
    ],
  },
  Sorghum: {
    plantingSeason: 'Long rains: March–May | Short rains: October–December',
    daysToMaturity: [90, 120],
    fertilizers: [
      { name: 'DAP (18:46:0)', rate: '25 kg/acre', timing: 'At planting' },
      { name: 'CAN (26:0:0)', rate: '25 kg/acre', timing: 'Top dress at 4–6 weeks' },
    ],
    seedVarieties: ['Gadam (early, brewing)', 'Serena (dual purpose)', 'Seredo (grain)', 'KARI Mtama 1 (drought tolerant)'],
    spacing: '75 cm between rows × 20 cm between plants',
    tips: [
      'Excellent drought-tolerant crop — ideal for semi-arid areas',
      'Control Striga weed by using resistant varieties and crop rotation',
      'Birds can be a major pest at grain filling — consider netting or guarding',
      'Harvest when grain is hard; thresh and dry to 12% moisture',
    ],
  },
  Tea: {
    plantingSeason: 'Perennial — plant during heavy rains (April–May or October–November)',
    daysToMaturity: [1095, 1460],
    fertilizers: [
      { name: 'NPK 25:5:5', rate: '150 kg/acre/year', timing: 'Split: April, August, November' },
      { name: 'Sulphate of Ammonia', rate: '100 kg/acre/year', timing: 'Between NPK applications' },
    ],
    seedVarieties: ['TRFK 6/8 (high yield)', 'TRFK 31/8 (quality)', 'TRFK 306 (Purple tea, premium)', 'TRFK 303/577 (clonal)'],
    spacing: '1.2 m between rows × 0.6 m between plants (5,500 plants/acre)',
    tips: [
      'First commercial harvest 3–4 years after planting',
      'Maintain flat plucking table — pick 2 leaves and a bud',
      'Prune every 3–5 years to maintain bush health',
      'Mulch heavily with cut grass to retain moisture and suppress weeds',
    ],
  },
  Coffee: {
    plantingSeason: 'Perennial — plant at onset of long rains (March–April)',
    daysToMaturity: [730, 1095],
    fertilizers: [
      { name: 'NPK 17:17:17', rate: '50 kg/acre', timing: 'Split: March and September' },
      { name: 'CAN (26:0:0)', rate: '50 kg/acre', timing: 'Top dress at flowering' },
      { name: 'Foliar (Zinc, Boron)', rate: 'As directed', timing: 'At flowering for fruit set' },
    ],
    seedVarieties: ['Ruiru 11 (disease resistant, compact)', 'Batian (high yield, resistant)', 'SL28 (quality, traditional)', 'SL34 (quality)', 'K7 (lowland)'],
    spacing: '2.7 m × 2.7 m (for Arabica) | 3 m × 3 m (for traditional)',
    tips: [
      'First meaningful harvest 2–3 years after field planting',
      'Shade with trees like Grevillea for better bean quality',
      'Major diseases: Coffee Berry Disease (CBD), Leaf Rust — spray copper fungicides',
      'Pick only ripe red cherries for best quality and premium prices',
    ],
  },
  Potatoes: {
    plantingSeason: 'Season 1: February–April | Season 2: August–October',
    daysToMaturity: [90, 120],
    fertilizers: [
      { name: 'DAP (18:46:0)', rate: '100 kg/acre', timing: 'At planting — in furrow' },
      { name: 'CAN (26:0:0)', rate: '50 kg/acre', timing: 'Top dress at earthing up (4 weeks)' },
    ],
    seedVarieties: ['Shangi (popular, fast maturing)', 'Dutch Robyjn (red skin)', 'Kenya Mpya (high yield)', 'Unica (late blight tolerant)', 'Asante (processing)'],
    spacing: '75 cm between rows × 30 cm between plants',
    tips: [
      'Use certified seed potatoes from KALRO or registered seed merchants',
      'Earth up (mound soil around stems) twice to prevent greening',
      'Late blight is the #1 enemy — spray Ridomil Gold at first signs',
      'Harvest when leaves turn yellow; cure tubers in shade for 2 weeks before sale',
    ],
  },
  Tomatoes: {
    plantingSeason: 'Year-round (irrigated) | Rain-fed: March–May, October–December',
    daysToMaturity: [60, 90],
    fertilizers: [
      { name: 'DAP (18:46:0)', rate: '50 kg/acre', timing: 'At transplanting' },
      { name: 'CAN (26:0:0)', rate: '50 kg/acre', timing: 'Top dress at 3 weeks and at flowering' },
      { name: 'Foliar feed (Calcium)', rate: 'As directed', timing: 'At fruit setting to prevent blossom end rot' },
    ],
    seedVarieties: ['Anna F1 (determinate, popular)', 'Rio Grande (open pollinated)', 'Cal J (processing)', 'Kilele F1 (high yield)', 'Tylka F1 (disease resistant)'],
    spacing: '60 cm between rows × 45 cm between plants',
    tips: [
      'Raise seedlings in nursery for 4 weeks before transplanting',
      'Stake or cage plants for better air circulation and fruit quality',
      'Drip irrigation is ideal — avoid wetting leaves to prevent blight',
      'Harvest when fruits turn pink-red; handle gently to avoid bruising',
    ],
  },
  Onions: {
    plantingSeason: 'Transplant: March–May (6-week nursery first) | Irrigated: year-round',
    daysToMaturity: [90, 150],
    fertilizers: [
      { name: 'DAP (18:46:0)', rate: '50 kg/acre', timing: 'At transplanting' },
      { name: 'CAN (26:0:0)', rate: '50 kg/acre', timing: 'Top dress at 4 and 8 weeks' },
    ],
    seedVarieties: ['Red Creole (popular, storage)', 'Red Pinoy (large bulbs)', 'Neptune F1 (high yield)', 'Jambar F1 (hybrid, quality)'],
    spacing: '30 cm between rows × 10 cm between plants',
    tips: [
      'Nursery stage: 6–8 weeks, transplant when pencil-thick',
      'Weed carefully — onions compete poorly with weeds',
      'Stop watering 2 weeks before harvest to help bulbs cure',
      'Harvest when 50% of tops fall over; dry under shade for 2 weeks',
    ],
  },
};

// Get counties for a specific crop
export function getCountiesForCrop(crop: CropType): County[] {
  return CROP_COUNTIES[crop] || [];
}

// Calculate estimated harvest date
export function getEstimatedHarvestDate(crop: CropType, plantingDate: Date = new Date()): { earliest: Date; latest: Date } {
  const [minDays, maxDays] = CROP_ADVISORIES[crop].daysToMaturity;
  const earliest = new Date(plantingDate);
  earliest.setDate(earliest.getDate() + minDays);
  const latest = new Date(plantingDate);
  latest.setDate(latest.getDate() + maxDays);
  return { earliest, latest };
}
