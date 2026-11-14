import { Character } from '../types/chroniques';

/**
 * Retourne la liste des familiers liés à un maître (PJ ou PNJ) dans tableData.pjs.
 */
export function getLinkedFamiliersForMaster(
  master: Partial<Character> | null | undefined,
  allCharacters: Character[]
): Character[] {
  if (!master) return [];
  const masterId = master.id;
  const masterName = (master.name || '').trim().toLowerCase();

  return allCharacters.filter((c) => {
    if (!c.isFamilier) return false;
    if (masterId && c.masterId) {
      return c.masterId === masterId;
    }
    if (masterName && c.masterName) {
      return c.masterName.trim().toLowerCase() === masterName;
    }
    return false;
  });
}

/**
 * Normalise un familier avant stockage sur `master.familiers` ou dans `tableData.pjs`
 * (garantit l'absence de récursion `familiers` imbriquée).
 */
export function normalizeFamilierForMaster(
  fam: Character,
  master: { id?: string; name: string }
): Character {
  const { familiers: _ignore, ...clean } = fam;
  return {
    ...clean,
    isPnj: true,
    isFamilier: true,
    rolePnj: fam.rolePnj || 'Familier',
    masterId: master.id || fam.masterId,
    masterName: master.name,
    player: `Familier de ${master.name}`,
  };
}

/**
 * Synchronise les familiers portés par un PJ (`pj.familiers`) vers la liste MJ (`tablePjs`).
 * - Met à jour ou ajoute les familiers du PJ dans `tablePjs`.
 * - Retire de `tablePjs` les familiers qui étaient liés à ce PJ mais qui ont été supprimés/déliés par le joueur.
 */
export function mergeMasterFamiliersIntoTablePjs(
  master: Character,
  tablePjs: Character[]
): Character[] {
  if (master.isFamilier) return tablePjs;

  const masterId = master.id;
  const masterNameLower = (master.name || '').trim().toLowerCase();
  const masterFamiliers = (master.familiers || []).map((f) =>
    normalizeFamilierForMaster(f, { id: master.id, name: master.name })
  );
  const masterFamIds = new Set(masterFamiliers.map((f) => f.id).filter(Boolean));

  // Conserver les non-familiers et les familiers appartenant à d'autres maîtres ou sans maître
  const nextList: Character[] = tablePjs.filter((c) => {
    if (!c.isFamilier) return true;
    const belongsToThisMaster =
      (masterId && c.masterId === masterId) ||
      (!c.masterId && masterNameLower && (c.masterName || '').trim().toLowerCase() === masterNameLower);
    if (!belongsToThisMaster) return true;
    return !!c.id && masterFamIds.has(c.id);
  });

  // Upsert chaque familier du PJ dans la liste MJ
  masterFamiliers.forEach((fam) => {
    const idx = nextList.findIndex(
      (c) => c.isFamilier && ((fam.id && c.id === fam.id) || (c.name === fam.name && c.masterId === fam.masterId))
    );
    if (idx >= 0) {
      nextList[idx] = fam;
    } else {
      nextList.push(fam);
    }
  });

  return nextList;
}

/**
 * Met à jour la propriété `familiers` de chaque maître (PJ/PNJ) dans une liste `pjs`
 * en fonction des fiches `isFamilier` présentes dans cette même liste.
 */
export function syncMasterArraysFromTablePjs(pjs: Character[]): Character[] {
  const familiars = pjs.filter((p) => p.isFamilier);
  return pjs.map((p) => {
    if (p.isFamilier) return p;
    const owned = familiars
      .filter((f) => {
        if (p.id && f.masterId) return f.masterId === p.id;
        return (
          !f.masterId &&
          p.name &&
          f.masterName &&
          f.masterName.trim().toLowerCase() === p.name.trim().toLowerCase()
        );
      })
      .map((f) => normalizeFamilierForMaster(f, { id: p.id, name: p.name }));

    const prevOwned = p.familiers || [];
    if (JSON.stringify(prevOwned) === JSON.stringify(owned)) {
      return p;
    }
    return {
      ...p,
      familiers: owned,
    };
  });
}
