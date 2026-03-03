// localStorage-backed farm analysis history
import type { FarmInput, FarmAnalysis, CropType, County, SoilType } from './farmData';

export interface SavedFarmAnalysis {
  id: string;
  farmName: string;
  input: FarmInput;
  result: FarmAnalysis;
  savedAt: string;
}

const STORAGE_KEY = 'farmwise_farm_history';

function getStored(): SavedFarmAnalysis[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(items: SavedFarmAnalysis[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function saveFarmAnalysis(farmName: string, input: FarmInput, result: FarmAnalysis): SavedFarmAnalysis {
  const all = getStored();
  const entry: SavedFarmAnalysis = {
    id: `farm-${Date.now()}`,
    farmName,
    input,
    result,
    savedAt: new Date().toISOString(),
  };
  all.unshift(entry);
  // Keep max 50 entries
  if (all.length > 50) all.length = 50;
  save(all);
  return entry;
}

export function getFarmHistory(): SavedFarmAnalysis[] {
  return getStored();
}

export function deleteFarmEntry(id: string) {
  save(getStored().filter(e => e.id !== id));
}
