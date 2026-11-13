import { Monster } from '../types/chroniques';

const STORAGE_KEY = 'co_creature_visuals_v1';

export interface CachedCreatureVisual {
  url: string;
  mode: 'generated' | 'uploaded' | 'url';
  variantSeed?: number;
  updatedAt: number;
}

const normalizeKey = (monster: Pick<Monster, 'n' | 'source' | 'num'>): string => {
  const name = (monster.n || 'creature').trim().toLowerCase();
  const src = monster.source || 'core';
  return `${src}::${name}`;
};

const readStore = (): Record<string, CachedCreatureVisual> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const writeStore = (store: Record<string, CachedCreatureVisual>): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    return true;
  } catch {
    // Si localStorage approche sa limite, purger les plus anciens visuels générés en cache
    try {
      const entries = Object.entries(store).sort((a, b) => a[1].updatedAt - b[1].updatedAt);
      while (entries.length > 10) {
        entries.shift();
        const reduced = Object.fromEntries(entries);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(reduced));
          return true;
        } catch {
          // continuer à alléger
        }
      }
      return false;
    } catch {
      return false;
    }
  }
};

export const getCreatureVisual = (monster: Monster): CachedCreatureVisual | null => {
  const store = readStore();
  const key = normalizeKey(monster);
  if (store[key]?.url) return store[key];
  if (monster.imageUrl) {
    return {
      url: monster.imageUrl,
      mode: 'url',
      updatedAt: 0,
    };
  }
  return null;
};

export const setCreatureVisual = (
  monster: Monster,
  visual: Omit<CachedCreatureVisual, 'updatedAt'>
): boolean => {
  const store = readStore();
  const key = normalizeKey(monster);
  store[key] = {
    ...visual,
    updatedAt: Date.now(),
  };
  return writeStore(store);
};

export const removeCreatureVisual = (monster: Monster): void => {
  const store = readStore();
  const key = normalizeKey(monster);
  delete store[key];
  writeStore(store);
};
