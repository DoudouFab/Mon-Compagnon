import { Character } from '../types/chroniques';

export interface PjColorTheme {
  id: string;
  label: string;
  /** Couleur principale haute lisibilité sur fond sombre (#14100c / #181410) */
  hex: string;
  /** Bordure discrète (alpha ~0.45) */
  borderHex: string;
  /** Léger voile de fond (alpha ~0.07) qui préserve le contraste du texte */
  softBg: string;
  /** Fond du petit badge PJ / étiquette */
  tagBg: string;
}

export const PJ_COLOR_PALETTE: PjColorTheme[] = [
  {
    id: 'gold',
    label: 'Or',
    hex: '#f3d48d',
    borderHex: 'rgba(212, 168, 74, 0.55)',
    softBg: 'rgba(212, 168, 74, 0.07)',
    tagBg: 'rgba(212, 168, 74, 0.16)',
  },
  {
    id: 'sky',
    label: 'Azur',
    hex: '#7dd3fc',
    borderHex: 'rgba(56, 189, 248, 0.50)',
    softBg: 'rgba(56, 189, 248, 0.07)',
    tagBg: 'rgba(56, 189, 248, 0.15)',
  },
  {
    id: 'emerald',
    label: 'Émeraude',
    hex: '#6ee7b7',
    borderHex: 'rgba(52, 211, 153, 0.50)',
    softBg: 'rgba(52, 211, 153, 0.07)',
    tagBg: 'rgba(52, 211, 153, 0.15)',
  },
  {
    id: 'amethyst',
    label: 'Améthyste',
    hex: '#d8b4fe',
    borderHex: 'rgba(192, 132, 252, 0.50)',
    softBg: 'rgba(192, 132, 252, 0.07)',
    tagBg: 'rgba(192, 132, 252, 0.15)',
  },
  {
    id: 'amber',
    label: 'Cuivre',
    hex: '#fdba74',
    borderHex: 'rgba(251, 146, 60, 0.50)',
    softBg: 'rgba(251, 146, 60, 0.07)',
    tagBg: 'rgba(251, 146, 60, 0.15)',
  },
  {
    id: 'teal',
    label: 'Turquoise',
    hex: '#5eead4',
    borderHex: 'rgba(45, 212, 191, 0.50)',
    softBg: 'rgba(45, 212, 191, 0.07)',
    tagBg: 'rgba(45, 212, 191, 0.15)',
  },
  {
    id: 'rose',
    label: 'Corail',
    hex: '#fda4af',
    borderHex: 'rgba(251, 113, 133, 0.50)',
    softBg: 'rgba(251, 113, 133, 0.07)',
    tagBg: 'rgba(251, 113, 133, 0.15)',
  },
  {
    id: 'lime',
    label: 'Sauge',
    hex: '#bef264',
    borderHex: 'rgba(163, 230, 53, 0.48)',
    softBg: 'rgba(163, 230, 53, 0.06)',
    tagBg: 'rgba(163, 230, 53, 0.14)',
  },
  {
    id: 'indigo',
    label: 'Indigo',
    hex: '#a5b4fc',
    borderHex: 'rgba(129, 140, 248, 0.50)',
    softBg: 'rgba(129, 140, 248, 0.07)',
    tagBg: 'rgba(129, 140, 248, 0.15)',
  },
  {
    id: 'magenta',
    label: 'Quartz',
    hex: '#f9a8d4',
    borderHex: 'rgba(244, 114, 182, 0.50)',
    softBg: 'rgba(244, 114, 182, 0.07)',
    tagBg: 'rgba(244, 114, 182, 0.15)',
  },
];

const hashString = (input: string): number => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
};

/**
 * Retourne une couleur stable et lisible pour un PJ donné.
 * Si `pjsList` est fourni, chaque PJ de la table reçoit un index unique sans collision
 * (identique dans Combat, Groupe et Messagerie).
 */
export function getPjColor(
  heroRef: { id?: string; name?: string } | null | undefined,
  pjsList?: Character[]
): PjColorTheme {
  if (!heroRef) return PJ_COLOR_PALETTE[0];

  const refId = heroRef.id;
  const refName = (heroRef.name || '').trim().toLowerCase();

  if (pjsList && pjsList.length > 0) {
    const exactIdx = pjsList.findIndex(
      (p) =>
        (refId && p.id && p.id === refId) ||
        (refName && (p.name || '').trim().toLowerCase() === refName)
    );
    if (exactIdx >= 0) {
      return PJ_COLOR_PALETTE[exactIdx % PJ_COLOR_PALETTE.length];
    }
    // Correspondance par préfixe (utile pour les combattants nommés "Nom (Niv. X)" ou similaire)
    if (refName) {
      const prefixIdx = pjsList.findIndex((p) => {
        const pName = (p.name || '').trim().toLowerCase();
        return pName && (refName.startsWith(pName) || pName.startsWith(refName));
      });
      if (prefixIdx >= 0) {
        return PJ_COLOR_PALETTE[prefixIdx % PJ_COLOR_PALETTE.length];
      }
    }
  }

  const key = refId || refName || 'hero';
  return PJ_COLOR_PALETTE[hashString(key) % PJ_COLOR_PALETTE.length];
}
