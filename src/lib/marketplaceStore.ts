// localStorage-backed marketplace CRUD
import { type CropType, type County } from './farmData';

export interface MarketListing {
  id: string;
  type: 'farmer' | 'buyer';
  name: string;
  phone: string;
  crop: CropType;
  county: County;
  quantity: number;
  price: number;
  date: string;
  description: string;
  createdAt: string;
}

const STORAGE_KEY = 'farmwise_marketplace';

function getStored(): MarketListing[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(listings: MarketListing[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
}

// Seed default data once
export function ensureSeeded() {
  if (localStorage.getItem(STORAGE_KEY)) return;
  const seed: MarketListing[] = [
    { id: 'f-1', type: 'farmer', name: 'John Kamau', phone: '0712345678', crop: 'Maize', county: 'Nakuru', quantity: 12, price: 33000, date: '2026-03-15', description: 'Fresh maize from Nakuru county. Quality certified.', createdAt: '2026-02-10T08:00:00Z' },
    { id: 'f-2', type: 'farmer', name: 'Mary Wanjiku', phone: '0723456789', crop: 'Beans', county: 'Uasin Gishu', quantity: 5, price: 78000, date: '2026-04-01', description: 'Premium beans, organic farming methods.', createdAt: '2026-02-11T10:00:00Z' },
    { id: 'f-3', type: 'farmer', name: 'Peter Ochieng', phone: '0734567890', crop: 'Wheat', county: 'Trans Nzoia', quantity: 20, price: 43000, date: '2026-03-20', description: 'High-quality wheat ready for harvest.', createdAt: '2026-02-12T09:00:00Z' },
    { id: 'b-1', type: 'buyer', name: 'KenGrain Ltd', phone: '0700111222', crop: 'Wheat', county: 'Kiambu', quantity: 50, price: 48000, date: '2026-03-10', description: 'Looking for quality wheat. Bulk purchase, prompt payment.', createdAt: '2026-02-09T14:00:00Z' },
    { id: 'b-2', type: 'buyer', name: 'FreshMart Kenya', phone: '0700333444', crop: 'Potatoes', county: 'Nyandarua', quantity: 30, price: 28000, date: '2026-03-25', description: 'Buying potatoes for retail chain. Regular orders available.', createdAt: '2026-02-10T11:00:00Z' },
    { id: 'b-3', type: 'buyer', name: 'Nairobi Foods Co', phone: '0700555666', crop: 'Rice', county: 'Meru', quantity: 25, price: 95000, date: '2026-04-05', description: 'Premium rice needed for restaurant supply chain.', createdAt: '2026-02-13T07:00:00Z' },
  ];
  save(seed);
}

export function getAllListings(): MarketListing[] {
  ensureSeeded();
  return getStored().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addListing(listing: Omit<MarketListing, 'id' | 'createdAt'>): MarketListing {
  const all = getStored();
  const newListing: MarketListing = {
    ...listing,
    id: `${listing.type[0]}-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  all.push(newListing);
  save(all);
  return newListing;
}

export function deleteListing(id: string) {
  const all = getStored().filter((l) => l.id !== id);
  save(all);
}

export function computeMatchScore(listing: MarketListing, allListings: MarketListing[]): number {
  const opposites = allListings.filter(
    (l) => l.type !== listing.type && l.crop === listing.crop
  );
  if (opposites.length === 0) return 0;

  let bestScore = 0;
  for (const opp of opposites) {
    let score = 50; // base for same crop
    if (opp.county === listing.county) score += 30;
    const priceDiff = Math.abs(opp.price - listing.price) / Math.max(opp.price, listing.price);
    score += Math.round((1 - priceDiff) * 20);
    bestScore = Math.max(bestScore, Math.min(score, 100));
  }
  return bestScore;
}
