import { Character, CurrencyBourse, TableFeedEntry } from '../types/chroniques';

const makeEntryId = (suffix: string) =>
  `ev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}_${suffix}`;

const formatBourse = (b?: CurrencyBourse) => {
  const po = b?.po || 0;
  const pa = b?.pa || 0;
  const pc = b?.pc || 0;
  const parts: string[] = [];
  if (po) parts.push(`${po} PO`);
  if (pa) parts.push(`${pa} PA`);
  if (pc) parts.push(`${pc} PC`);
  return parts.length > 0 ? parts.join(', ') : '0 PO';
};

const bourseToCopper = (b?: CurrencyBourse) =>
  (b?.po || 0) * 100 + (b?.pa || 0) * 10 + (b?.pc || 0);

const formatSignedDelta = (delta: number, unit: string) =>
  delta > 0 ? `+${delta} ${unit}` : `${delta} ${unit}`;

/**
 * Construit les notifications détaillées pour chaque changement significatif entre
 * deux versions d'une fiche de personnage (côté PJ ou côté MJ).
 */
export function buildHeroDiffEvents(
  prev: Character,
  next: Character,
  actorRole: 'mj' | 'pj'
): TableFeedEntry[] {
  const entries: TableFeedEntry[] = [];
  const now = Date.now();
  const actorLabel = actorRole === 'mj' ? 'Meneur de Jeu' : next.name || 'Joueur';
  const targetHeroId = next.id || prev.id;
  const targetHeroName = next.name || prev.name || 'Aventurier';

  const pushEvent = (
    suffix: string,
    category: TableFeedEntry['category'],
    summary: string,
    detail?: string
  ) => {
    entries.push({
      id: makeEntryId(suffix),
      timestamp: now,
      kind: 'event',
      scope: 'secret', // Strictement privé : uniquement ce PJ et le MJ
      senderRole: actorRole,
      senderName: actorLabel,
      senderHeroId: actorRole === 'pj' ? targetHeroId : undefined,
      targetHeroId,
      targetHeroName,
      category,
      summary,
      detail,
    });
  };

  // 1. Points de Vie (PV)
  if ((prev.hp ?? 0) !== (next.hp ?? 0)) {
    const diff = (next.hp ?? 0) - (prev.hp ?? 0);
    pushEvent(
      'hp',
      'hp',
      `PV : ${prev.hp ?? 0} → ${next.hp ?? 0} (${formatSignedDelta(diff, 'PV')})`,
      actorRole === 'mj' ? 'Modifié par le MJ' : 'Modifié sur la fiche PJ'
    );
  }

  // 2. Points de Mana (PM)
  if ((prev.pm ?? 0) !== (next.pm ?? 0)) {
    const diff = (next.pm ?? 0) - (prev.pm ?? 0);
    pushEvent(
      'pm',
      'pm',
      `PM : ${prev.pm ?? 0} → ${next.pm ?? 0} (${formatSignedDelta(diff, 'PM')})`,
      actorRole === 'mj' ? 'Modifié par le MJ' : 'Modifié sur la fiche PJ'
    );
  }

  // 3. Bourse (PO / PA / PC)
  const prevB: CurrencyBourse = prev.bourse || { po: 0, pa: 0, pc: 0 };
  const nextB: CurrencyBourse = next.bourse || { po: 0, pa: 0, pc: 0 };
  if (
    prevB.po !== nextB.po ||
    prevB.pa !== nextB.pa ||
    prevB.pc !== nextB.pc
  ) {
    const dPo = (nextB.po || 0) - (prevB.po || 0);
    const dPa = (nextB.pa || 0) - (prevB.pa || 0);
    const dPc = (nextB.pc || 0) - (prevB.pc || 0);
    const diffs: string[] = [];
    if (dPo !== 0) diffs.push(formatSignedDelta(dPo, 'PO'));
    if (dPa !== 0) diffs.push(formatSignedDelta(dPa, 'PA'));
    if (dPc !== 0) diffs.push(formatSignedDelta(dPc, 'PC'));

    const copperDiff = bourseToCopper(nextB) - bourseToCopper(prevB);
    const signHint = copperDiff === 0 ? 'Conversion de monnaie' : diffs.join(', ');
    pushEvent(
      'bourse',
      'bourse',
      `Bourse : ${signHint} (Solde : ${formatBourse(nextB)})`,
      actorRole === 'mj' ? 'Bourse mise à jour par le MJ' : 'Bourse mise à jour par le PJ'
    );
  }

  // 4. États préjudiciables
  const prevEtats = prev.etats || [];
  const nextEtats = next.etats || [];
  const addedEtats = nextEtats.filter((e) => !prevEtats.includes(e));
  const removedEtats = prevEtats.filter((e) => !nextEtats.includes(e));
  if (addedEtats.length > 0 || removedEtats.length > 0) {
    const parts: string[] = [];
    if (addedEtats.length > 0) parts.push(`+ ${addedEtats.join(', ')}`);
    if (removedEtats.length > 0) parts.push(`- ${removedEtats.join(', ')}`);
    pushEvent(
      'etats',
      'etats',
      `États : ${parts.join(' · ')}`,
      actorRole === 'mj' ? 'Appliqué par le MJ' : 'Mis à jour par le PJ'
    );
  }

  // 5. Inventaire (ajouts / retraits / quantités)
  const prevInv = prev.inventaire || [];
  const nextInv = next.inventaire || [];
  const prevMap = new Map<string, number>();
  prevInv.forEach((it) => prevMap.set(it.n, (prevMap.get(it.n) || 0) + (it.q ?? 1)));
  const nextMap = new Map<string, number>();
  nextInv.forEach((it) => nextMap.set(it.n, (nextMap.get(it.n) || 0) + (it.q ?? 1)));

  const invDiffs: string[] = [];
  nextMap.forEach((qty, name) => {
    const oldQty = prevMap.get(name) || 0;
    if (qty > oldQty) invDiffs.push(`+${qty - oldQty} ${name}`);
  });
  prevMap.forEach((oldQty, name) => {
    const qty = nextMap.get(name) || 0;
    if (qty < oldQty) invDiffs.push(`-${oldQty - qty} ${name}`);
  });
  if (invDiffs.length > 0) {
    const shown = invDiffs.slice(0, 3).join(', ');
    const extra = invDiffs.length > 3 ? ` (+${invDiffs.length - 3} autres)` : '';
    pushEvent(
      'inv',
      'inventaire',
      `Équipement : ${shown}${extra}`,
      actorRole === 'mj' ? 'Attribué / modifié par le MJ' : 'Modifié par le PJ'
    );
  }

  // 6. Armes
  const prevArmes = (prev.armes || []).map((a) => a.n);
  const nextArmes = (next.armes || []).map((a) => a.n);
  const addedArmes = nextArmes.filter((n) => !prevArmes.includes(n));
  const removedArmes = prevArmes.filter((n) => !nextArmes.includes(n));
  if (addedArmes.length > 0 || removedArmes.length > 0) {
    const parts: string[] = [];
    if (addedArmes.length > 0) parts.push(`+ ${addedArmes.join(', ')}`);
    if (removedArmes.length > 0) parts.push(`- ${removedArmes.join(', ')}`);
    pushEvent(
      'armes',
      'inventaire',
      `Armes : ${parts.join(' · ')}`,
      actorRole === 'mj' ? 'Modifié par le MJ' : 'Modifié par le PJ'
    );
  }

  // 7. Points de capacité & capacités apprises
  if ((prev.ptsCapCadeaux || 0) !== (next.ptsCapCadeaux || 0)) {
    const diff = (next.ptsCapCadeaux || 0) - (prev.ptsCapCadeaux || 0);
    pushEvent(
      'capgift',
      'capacite',
      `Points de capacité bonus : ${formatSignedDelta(diff, 'pt')}`,
      actorRole === 'mj' ? 'Offert / ajusté par le MJ' : undefined
    );
  }
  if ((prev.caps?.length || 0) !== (next.caps?.length || 0)) {
    const diff = (next.caps?.length || 0) - (prev.caps?.length || 0);
    pushEvent(
      'caps',
      'capacite',
      diff > 0
        ? `${diff} nouvelle(s) capacité(s) apprise(s)`
        : `${Math.abs(diff)} capacité(s) retirée(s)`,
      actorRole === 'mj' ? 'Modifié par le MJ' : 'Choisi par le PJ'
    );
  }

  // 8. Niveau
  if ((prev.level || 1) !== (next.level || 1)) {
    pushEvent(
      'level',
      'fiche',
      `Niveau : ${prev.level || 1} → ${next.level || 1}`,
      actorRole === 'mj' ? 'Modifié par le MJ' : 'Progression du personnage'
    );
  }

  return entries;
}

/**
 * Filtre strict côté Joueur :
 * - Les messages publics ('all') sont visibles par tous.
 * - Tout le reste (notifications d'événements ou messages secrets) n'est visible
 *   QUE si l'entrée concerne directement le PJ actif (jamais les autres PJ !).
 */
export function isFeedEntryVisibleToPj(
  entry: TableFeedEntry,
  pj: Character | null
): boolean {
  if (entry.scope === 'all') return true;
  if (!pj) return false;

  const pjId = pj.id;
  const pjName = (pj.name || '').trim().toLowerCase();

  if (pjId && (entry.targetHeroId === pjId || entry.senderHeroId === pjId)) {
    return true;
  }

  if (pjName) {
    const targetName = (entry.targetHeroName || '').trim().toLowerCase();
    if (targetName && targetName === pjName) return true;

    if (entry.senderRole === 'pj') {
      const senderName = (entry.senderName || '').trim().toLowerCase();
      if (senderName && senderName === pjName) return true;
    }
  }

  return false;
}
