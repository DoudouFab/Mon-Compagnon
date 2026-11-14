import { CaracName, Character, Combatant } from '../types/chroniques';

const CARAC_KEYS: CaracName[] = ['FOR', 'DEX', 'CON', 'INT', 'SAG', 'CHA'];

const toNum = (val: any, fallback: number): number => {
  const n = typeof val === 'number' ? val : Number(val);
  return Number.isFinite(n) ? n : fallback;
};

const toArray = <T = any>(val: any): T[] => {
  if (Array.isArray(val)) return val;
  if (val && typeof val === 'object') return Object.values(val) as T[];
  return [];
};

const normalizeEtatsList = (etats: any): string[] => {
  if (!etats) return [];
  const raw = Array.isArray(etats)
    ? etats
    : typeof etats === 'object'
    ? Object.values(etats)
    : [];
  return raw.filter((x): x is string => typeof x === 'string' && x.trim().length > 0);
};

export function sanitizeCharacter(raw: any, fallbackIdx: number = 0): Character {
  const src = raw && typeof raw === 'object' ? raw : {};

  const safeBase: Record<CaracName, number> = {
    FOR: 10,
    DEX: 10,
    CON: 10,
    INT: 10,
    SAG: 10,
    CHA: 10,
  };
  const srcBase = src.base && typeof src.base === 'object' ? src.base : {};
  CARAC_KEYS.forEach((k) => {
    safeBase[k] = toNum(srcBase[k], 10);
  });

  const safeRb: Record<CaracName, number> = {
    FOR: 0,
    DEX: 0,
    CON: 0,
    INT: 0,
    SAG: 0,
    CHA: 0,
  };
  const srcRb = src.rb && typeof src.rb === 'object' ? src.rb : {};
  CARAC_KEYS.forEach((k) => {
    safeRb[k] = toNum(srcRb[k], 0);
  });

  const safeBonus = {
    pv: toNum(src.bonus?.pv, 0),
    def: toNum(src.bonus?.def, 0),
    init: toNum(src.bonus?.init, 0),
  };

  const safeBourse = {
    po: Math.max(0, toNum(src.bourse?.po ?? src.po, 0)),
    pa: Math.max(0, toNum(src.bourse?.pa ?? src.pa, 0)),
    pc: Math.max(0, toNum(src.bourse?.pc ?? src.pc, 0)),
  };

  const level = Math.max(1, toNum(src.level, 1));
  const hpFallback = toNum(src.hpMaxManual ?? src.hpMaxAuto ?? src.hpBase, 10);
  const hp = toNum(src.hp, hpFallback);

  const safeName =
    typeof src.name === 'string' && src.name.trim()
      ? src.name
      : src.isFamilier
      ? `Compagnon ${fallbackIdx + 1}`
      : src.isPnj
      ? `PNJ ${fallbackIdx + 1}`
      : `Aventurier ${fallbackIdx + 1}`;

  const safeArmes = toArray(src.armes)
    .filter((w) => w && typeof w === 'object' && typeof w.n === 'string')
    .map((w) => ({
      ...w,
      n: String(w.n || 'Arme'),
      t: String(w.t || 'Contact'),
      dm: String(w.dm || '1d6'),
      crit: String(w.crit || '20'),
      por: String(w.por || 'Contact'),
    }));

  const safeInventaire = toArray(src.inventaire)
    .filter((it) => it && typeof it === 'object' && typeof it.n === 'string')
    .map((it) => ({
      ...it,
      n: String(it.n || 'Objet'),
      q: Math.max(0, toNum(it.q, 1)),
    }));

  const safeCustomSorts = toArray(src.customSorts).filter(
    (s) => s && typeof s === 'object' && typeof s.n === 'string'
  );

  const safeCaps = toArray(src.caps).filter(
    (c) => c && typeof c === 'object' && typeof c.wayKey === 'string'
  );

  const safeFamiliers =
    src.familiers !== undefined
      ? toArray(src.familiers)
          .filter((f) => f && typeof f === 'object')
          .map((f, idx) => sanitizeCharacter({ ...f, isFamilier: true }, idx))
      : undefined;

  const safeFamilierAccess =
    src.familierAccess && typeof src.familierAccess === 'object'
      ? {
          unlocked: Boolean(src.familierAccess.unlocked),
          pendingRequest:
            src.familierAccess.pendingRequest &&
            typeof src.familierAccess.pendingRequest === 'object' &&
            src.familierAccess.pendingRequest.requestedAt
              ? {
                  requestedAt: toNum(src.familierAccess.pendingRequest.requestedAt, Date.now()),
                  ...(src.familierAccess.pendingRequest.presetId
                    ? { presetId: String(src.familierAccess.pendingRequest.presetId) }
                    : {}),
                  ...(src.familierAccess.pendingRequest.presetName
                    ? { presetName: String(src.familierAccess.pendingRequest.presetName) }
                    : {}),
                  ...(src.familierAccess.pendingRequest.note
                    ? { note: String(src.familierAccess.pendingRequest.note) }
                    : {}),
                }
              : null,
          rejectedAt: src.familierAccess.rejectedAt ? toNum(src.familierAccess.rejectedAt, 0) : null,
        }
      : undefined;

  const safeCandyBox =
    src.candyBox && typeof src.candyBox === 'object'
      ? {
          unlocked: Boolean(src.candyBox.unlocked),
          counts:
            src.candyBox.counts && typeof src.candyBox.counts === 'object'
              ? src.candyBox.counts
              : {},
          tasted: normalizeEtatsList(src.candyBox.tasted),
          pendingTaste:
            src.candyBox.pendingTaste &&
            typeof src.candyBox.pendingTaste === 'object' &&
            src.candyBox.pendingTaste.candyName
              ? {
                  candyName: String(src.candyBox.pendingTaste.candyName),
                  requestedAt: toNum(src.candyBox.pendingTaste.requestedAt, Date.now()),
                }
              : null,
          rejectedTaste:
            src.candyBox.rejectedTaste &&
            typeof src.candyBox.rejectedTaste === 'object' &&
            src.candyBox.rejectedTaste.candyName
              ? {
                  candyName: String(src.candyBox.rejectedTaste.candyName),
                  rejectedAt: toNum(src.candyBox.rejectedTaste.rejectedAt, Date.now()),
                }
              : null,
        }
      : undefined;

  return {
    ...src,
    id:
      typeof src.id === 'string' && src.id.trim()
        ? src.id
        : `${src.isFamilier ? 'fam' : 'pj'}_safe_${fallbackIdx}_${safeName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .slice(0, 24)}`,
    name: safeName,
    race: typeof src.race === 'string' && src.race.trim() ? src.race : 'humain',
    profil: typeof src.profil === 'string' && src.profil.trim() ? src.profil : 'guerrier',
    level,
    base: safeBase,
    rb: safeRb,
    hp,
    hpBase: toNum(src.hpBase, hpFallback),
    hpMaxAuto: toNum(src.hpMaxAuto, hpFallback),
    ptsCap: toNum(src.ptsCap, 0),
    caps: safeCaps,
    armes: safeArmes,
    inventaire: safeInventaire,
    customSorts: safeCustomSorts,
    arm: typeof src.arm === 'string' ? src.arm : '',
    bou: typeof src.bou === 'string' ? src.bou : '',
    bonus: safeBonus,
    bourse: safeBourse,
    etats: normalizeEtatsList(src.etats),
    ...(safeFamiliers !== undefined ? { familiers: safeFamiliers } : {}),
    ...(safeFamilierAccess !== undefined ? { familierAccess: safeFamilierAccess } : {}),
    ...(safeCandyBox !== undefined ? { candyBox: safeCandyBox } : {}),
  };
}

export function sanitizeCharacterList(rawList: any): Character[] {
  return toArray(rawList)
    .filter((item) => item && typeof item === 'object')
    .map((item, idx) => sanitizeCharacter(item, idx));
}

export function sanitizeCombatant(raw: any, fallbackIdx: number = 0): Combatant {
  const src = raw && typeof raw === 'object' ? raw : {};
  const hpMax = Math.max(1, toNum(src.hpMax ?? src.hp, 10));
  const hp = toNum(src.hp, hpMax);
  return {
    ...src,
    id:
      typeof src.id === 'string' && src.id.trim()
        ? src.id
        : `cmb_safe_${fallbackIdx}_${Date.now()}`,
    n: typeof src.n === 'string' && src.n.trim() ? src.n : `Combattant ${fallbackIdx + 1}`,
    isPj: Boolean(src.isPj),
    isPnj: src.isPnj !== undefined ? Boolean(src.isPnj) : undefined,
    isFamilier: src.isFamilier !== undefined ? Boolean(src.isFamilier) : undefined,
    hp,
    hpMax,
    def: toNum(src.def, 10),
    baseInit: toNum(src.baseInit, 10),
    init: src.init === null || src.init === undefined ? null : toNum(src.init, 10),
    notes: typeof src.notes === 'string' ? src.notes : '',
    etats: normalizeEtatsList(src.etats),
  };
}

export function sanitizeCombatantList(rawList: any): Combatant[] {
  return toArray(rawList)
    .filter((item) => item && typeof item === 'object')
    .map((item, idx) => sanitizeCombatant(item, idx));
}
