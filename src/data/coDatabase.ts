import pjCatalog from './pj_catalog.json';
import bestiaireRaw from './bestiaire.json';
import equipementsRaw from './equipements.json';
import reglesEtatsRaw from './regles_etats.json';
import {
  CaracName,
  Character,
  ClassWay,
  Equipment,
  Monster,
  PrejudicialState,
  ProfilData,
  RaceData,
  RuleChapter,
  SpellItem,
} from '../types/chroniques';

import { OFFICIAL_DRS_PROFILS, OFFICIAL_DRS_RACES } from './drsRacesAndProfils';

export const CARAC_LIST: CaracName[] = ['FOR', 'DEX', 'CON', 'INT', 'SAG', 'CHA'];

export const PROFILS: ProfilData[] = OFFICIAL_DRS_PROFILS;
export const RACES: RaceData[] = OFFICIAL_DRS_RACES;
const rawEquipments = equipementsRaw as Equipment[];
const baseArmes = pjCatalog.armes as Equipment[];
const baseArmures = pjCatalog.armures as Equipment[];
const baseBiens = pjCatalog.biens as Equipment[];

export const ARMES_CATALOG: Equipment[] = [
  ...baseArmes,
  ...rawEquipments.filter(
    (e) =>
      (e.cat === 'Armes Contact' || e.cat === 'Armes Distance' || e.cat === 'Armes Poudre') &&
      !baseArmes.some((a) => a.n.toLowerCase() === e.n.toLowerCase())
  ),
];

export const ARMURES_CATALOG: Equipment[] = [
  ...baseArmures,
  ...rawEquipments.filter(
    (e) =>
      (e.cat === 'Armures' || e.cat === 'Boucliers') &&
      !baseArmures.some((a) => a.n.toLowerCase() === e.n.toLowerCase())
  ),
];

export const BIENS_CATALOG: Equipment[] = [
  ...baseBiens,
  ...rawEquipments.filter(
    (e) =>
      e.cat !== 'Armes Contact' &&
      e.cat !== 'Armes Distance' &&
      e.cat !== 'Armes Poudre' &&
      e.cat !== 'Armures' &&
      e.cat !== 'Boucliers' &&
      !baseBiens.some((b) => b.n.toLowerCase() === e.n.toLowerCase())
  ),
];
import allVoiesDRS from './allVoiesDRS.json';
import {
  THARNEA_MONSTERS,
  THARNEA_ARTIFACTS,
  THARNEA_LORE_RULES,
} from './tharneaSupplement';

export { THARNEA_MONSTERS, THARNEA_ARTIFACTS, THARNEA_LORE_RULES };

export const VOIES_CATALOG: Record<string, ClassWay> = allVoiesDRS as Record<string, ClassWay>;

// Construction du Grimoire exhaustif complet (176+ sorts issus de toutes les voies magiques)
function buildFullSpellsCatalog(): SpellItem[] {
  const map = new Map<string, SpellItem>();

  // 1. Sorts initiaux du catalogue
  ((pjCatalog.sortsCatalogue as SpellItem[]) || []).forEach((s) => {
    map.set(s.n.toLowerCase().trim(), s);
  });

  // 2. Extraire et fusionner toutes les capacités de rangs magiques ou profils magiques (priorité aux données enrichies de VOIES_CATALOG)
  const magicProfiles = [
    'magicien',
    'ensorceleur',
    'necromancien',
    'pretre',
    'druide',
    'barde',
    'forgesort',
  ];

  for (const [, voie] of Object.entries(VOIES_CATALOG)) {
    const isMagicProf = magicProfiles.includes(voie.profil);
    voie.r.forEach((rank, idx) => {
      const isSpell = rank.S === 1 || isMagicProf;
      if (isSpell) {
        const key = rank.n.toLowerCase().trim();
        const existing = map.get(key);
        const merged: SpellItem = {
          ...(existing || {}),
          n: rank.n,
          voie: existing?.voie || voie.nom,
          rang: existing?.rang || idx + 1,
          portee: rank.portee || existing?.portee || (rank.t.includes('mètre') || rank.t.includes(' m ') || rank.t.includes(' m.') ? 'À distance' : 'Vue / Contact'),
          duree: rank.duree || existing?.duree || (rank.t.includes('tour') ? '1d4 à 1d6 tours' : rank.t.includes('combat') ? '1 combat' : 'Instantané'),
          ...(rank.cibles ? { cibles: rank.cibles } : {}),
          ...(rank.test ? { test: rank.test } : {}),
          ...(rank.degats ? { degats: rank.degats } : {}),
          ...(rank.limites ? { limites: rank.limites } : {}),
          ...(rank.actionCost ? { actionCost: rank.actionCost } : {}),
          ...(rank.nature ? { nature: rank.nature } : {}),
          ...(rank.composantes ? { composantes: rank.composantes } : {}),
          ...(rank.natureDegats ? { natureDegats: rank.natureDegats } : {}),
          L: rank.L ?? existing?.L ?? 0,
          S: 1,
          t: rank.t && rank.t.length >= (existing?.t || '').length ? rank.t : existing?.t || rank.t,
        };
        map.set(key, merged);
      }
    });
  }

  // 3. Sorts emblématiques supplémentaires (si absents)
  const extras: SpellItem[] = [
    {
      n: 'Hâte',
      voie: 'Magie des arcanes',
      rang: 3,
      portee: 'Contact ou 10 m',
      duree: '1d6 tours',
      actionCost: 'Action Limitée (L)',
      nature: 'Magie profane — Transmutation temporelle (INT)',
      composantes: 'Verbale (V) + Somatique (S)',
      natureDegats: 'Aucun dégât direct (Buff de vitesse et d’actions)',
      cibles: '1 créature volontaire',
      test: 'Réussite automatique sur soi ou allié consentant.',
      degats: '+1 action supplémentaire par tour (Attaque ou Mouvement)',
      limites: 'Coûte 3 PM ; ne confère pas de 2e Action Limitée.',
      L: 1,
      S: 1,
      t: 'Accélère le métabolisme : octroie une action supplémentaire par tour (attaque ou mouvement) pendant 1d6 tours.',
    },
    {
      n: 'Désintégration',
      voie: 'Magie destructrice',
      rang: 5,
      portee: '20 m',
      duree: 'Instantané',
      actionCost: 'Action Limitée (L)',
      nature: 'Magie profane — Évocation destructrice (INT)',
      composantes: 'Verbale (V) + Somatique (S) + Focalisateur arcanique',
      natureDegats: 'Magique — Désintégration / Force pure (ignore armure non-magique)',
      cibles: '1 créature ou objet (jusqu’à 3 m³)',
      test: 'Jet d’Attaque magique [d20 + Niveau + Mod. INT] vs DEF.',
      degats: '[5d6 + Mod. INT] DM bruts',
      limites: 'Coûte 5 PM ; réduit la cible en cendres si ses PV tombent à 0.',
      L: 1,
      S: 1,
      t: 'Rayon mortel infligeant [5d6 + Mod. INT] DM bruts. Réduit en poussière si la cible tombe à 0 PV.',
    },
  ];

  extras.forEach((s) => {
    const key = s.n.toLowerCase().trim();
    if (!map.has(key)) map.set(key, s);
  });

  return Array.from(map.values()).sort((a, b) => a.rang - b.rang || a.n.localeCompare(b.n));
}

export const SORTS_CATALOG: SpellItem[] = buildFullSpellsCatalog();

export const BESTIAIRE: Monster[] = bestiaireRaw as Monster[];

export const ALL_PJ_EQUIPMENT: Equipment[] = [
  ...ARMES_CATALOG.map((w) => ({
    ...w,
    cat: (w as any).cat || (w.t?.includes('Distance') ? 'Armes Distance' : w.t?.includes('Poudre') ? 'Armes Poudre' : 'Armes Contact'),
    prix: (w as any).prix || (w.t?.includes('Poudre') ? '15 pa' : '5 pa'),
    desc: (w as any).props || (w as any).desc || '',
  })),
  ...ARMURES_CATALOG.map((a) => ({
    ...a,
    cat: (a as any).cat || (a.t?.includes('Bouclier') ? 'Boucliers' : 'Armures'),
    prix: (a as any).prix || '8 pa',
    desc: (a as any).props || (a as any).desc || '',
  })),
  ...BIENS_CATALOG.map((b) => ({
    ...b,
    cat:
      (b as any).cat ||
      (b.n.toLowerCase().includes('tente') || b.n.toLowerCase().includes('paillasse') || b.n.toLowerCase().includes('camp')
        ? 'Campement'
        : 'Aventure'),
    prix: (b as any).prix || '2 pa',
  })),
] as Equipment[];

export const EQUIPEMENTS: Equipment[] = ALL_PJ_EQUIPMENT;
const ETATS_METADATA: Record<string, Partial<PrejudicialState>> = {
  Affaibli: {
    icon: '🥀',
    badgeColor: '#c2782b',
    impactCourt: 'Lance 1d12 au lieu du d20 sur tous les tests et attaques',
    quand: "Conséquence d'un poison débilitant, d'une maladie pernicieuse, d'un drain nécrotique, d'un sortilège d'affaiblissement ou du réveil difficile après avoir frôlé la mort à 0 PV.",
    comment: "Le joueur remplace temporairement son d20 par un dé à 12 faces (d12) pour l'intégralité de ses tests de caractéristique et jets d'attaque au contact ou à distance.",
    pourquoi: "Épuisement musculaire extrême, fièvre délirante, atrophie temporaire des fibres ou choc spirituel privant le corps de sa puissance motrice.",
    guerison: "Repos complet de 24h dans un abri confortable, sort de Soins majeurs / Délivrance divine (Prêtre), ou ingestion d'un puissant fortifiant alchimique.",
  },
  Aveuglé: {
    icon: '👁️‍🗨️',
    badgeColor: '#5c544d',
    impactCourt: 'Init -5, Attaque contact -5, Attaque distance -10, DEF -5, Vitesse ÷2',
    quand: "Éblouissement par un flash divin ou une grenade aveuglante, jet de sable ou d'acide au visage, plongée soudaine dans des ténèbres totales sans vision dans le noir, traumatisme oculaire.",
    comment: "Malus immédiats : Initiative -5, Attaque au contact -5, Attaque à distance -10, Défense -5. Tous les déplacements sont réduits de moitié (marche précautionneuse à l'aveugle).",
    pourquoi: "Perte totale du sens de la vue empêchant d'anticiper les coups adverses, d'évaluer les distances et d'ajuster une trajectoire de tir.",
    guerison: "Se rincer les yeux à grande eau (1 action complète si poussière/sable), fin du sort d'aveuglement (test de CON diff 12 ou 1d4 tours), ou sort de guérison de niveau 2+.",
  },
  Étourdi: {
    icon: '💫',
    badgeColor: '#e0a030',
    impactCourt: "Incapable d'agir (perd son tour), Défense réduite de -5",
    quand: "Coup violent et assommant sur le crâne (matraque, masse lourde, bouclier), explosion acoustique, onde de choc arcanique, sortilège d'étourdissement.",
    comment: "Le personnage ne peut effectuer aucune action pendant son tour (ni mouvement, ni attaque). Sa Défense est amputée de -5 points et il ne peut esquiver.",
    pourquoi: "Commotion cérébrale passagère, sifflement strident dans les oreilles et désorientation sensorielle totale provoquant un black-out momentané.",
    guerison: "L'état dure généralement 1 round de combat ; le combattant secoue la tête et reprend ses esprits à la fin de son tour ou réussit un test de CON diff 10.",
  },
  Immobilisé: {
    icon: '🕸️',
    badgeColor: '#7a5a3a',
    impactCourt: 'Déplacement 0 m, d12 au lieu du d20 aux tests et attaques',
    quand: "Pris dans un filet de capture, toile d'araignée géante, racine ensorcelée, boue magique séchée, ou maintenu au sol par une étreinte de lutte musclée.",
    comment: "Vitesse de déplacement réduite à zéro (0 m). Obligation d'utiliser un d12 au lieu du d20 pour tous ses tests d'attaque et de caractéristique physique.",
    pourquoi: "Ses jambes et bras sont entravés mécaniquement ou englués, l'empêchant de prendre appui ou de manoeuvrer librement sur le terrain.",
    guerison: "Réussir un test de Force (FOR) ou de Dextérité (DEX) difficulté 15 pour trancher ou déchirer les liens (1 action). Un allié libre peut trancher l'entrave (1 action).",
  },
  Paralysé: {
    icon: '⚡',
    badgeColor: '#a13333',
    impactCourt: 'Incapable de bouger, touché auto au contact + Critique garanti',
    quand: "Venin nécrotique de goule, piqûre de charognard rampant, toxine de méduse, sort d'Immobilisation des personnes (Magie profane rang 3).",
    comment: "Incapable d'effectuer le moindre mouvement physique ni d'articuler un mot. Toute attaque au contact contre lui touche automatiquement et inflige des dégâts critiques maximaux !",
    pourquoi: "Blocage total des impulsions neuromusculaires par une neurotoxine foudroyante ou un sceau magique verrouillant les muscles dans l'inertie.",
    guerison: "Test de Constitution (CON) ou de Sagesse (SAG) difficulté 12 à 15 à la fin de chaque tour pour briser l'emprise, ou sort de Neutre-poison / Dissipation de la magie.",
  },
  Ralenti: {
    icon: '🐌',
    badgeColor: '#3d5c7a',
    impactCourt: 'Une seule action par tour au lieu de deux (mouvement OU attaque)',
    quand: "Sort de Lenteur, froid surnaturel, marais gluant, poison réfrigérant, hypothermie sévère ou blessure profonde aux tendons.",
    comment: "Le personnage ne peut effectuer qu'une seule action par tour (soit une action de mouvement, soit une action d'attaque/sort, mais jamais les deux au cours du même tour).",
    pourquoi: "Ralentissement drastique des influx nerveux et de l'énergie cinétique corporelle, transformant chaque geste en un effort lourd et laborieux.",
    guerison: "Fin de la durée du sort (généralement 1d6 rounds), réchauffement actif auprès d'une source de chaleur, ou test de CON diff 12.",
  },
  Renversé: {
    icon: '🤼',
    badgeColor: '#8a4e30',
    impactCourt: 'Attaque -5, DEF -5, se relever coûte 1 action de mouvement',
    quand: "Balayette ou crochetage d'arme d'hast, charge féroce de loup ou de sanglier, bousculade victorieuse en combat (test de FOR opposé), dérapage sur plaque de verglas.",
    comment: "Applique un malus de -5 à ses jets d'Attaque et de -5 à sa Défense tant qu'il reste au sol. Se relever consomme l'intégralité d'une action de mouvement.",
    pourquoi: "Allongé sur le dos ou le ventre dans la boue, le personnage ne peut profiter de son allonge et devient une cible vulnérable aux frappes plongeantes.",
    guerison: "Dépenser son action de mouvement lors de son tour de jeu pour se remettre debout (ou aptitude spéciale d'Acrobatie permettant de sauter sur ses pieds gratuitement).",
  },
  Surpris: {
    icon: '❗',
    badgeColor: '#962b2b',
    impactCourt: '1er tour : aucune action possible, Défense amputée de -5',
    quand: "Embuscade tendue avec succès par des ennemis tapis dans l'ombre (jet de Discrétion supérieur à la Perception du groupe), déclenchement inattendu d'un piège dissimulé.",
    comment: "Pendant le 1er round d'affrontement uniquement : le personnage ne peut rien faire (ni mouvement ni attaque) et sa Défense est diminuée de -5 points.",
    pourquoi: "Temps de sidération cognitive : l'esprit a besoin de quelques secondes pour comprendre la menace et libérer l'adrénaline de combat.",
    guerison: "Prend fin automatiquement dès que le 1er tour de combat s'achève. Dès le tour 2, le personnage retrouve sa pleine Défense et peut agir normalement.",
  },
  Asphyxié: {
    icon: '🫧',
    badgeColor: '#2d6d87',
    impactCourt: '1d6 DM direct chaque tour ignorant armure, sorts verbaux impossibles',
    quand: "Noyade sous l'eau après épuisement de sa réserve d'air (CON tours), étranglement par une chaîne ou des tentacules, inhalation d'un gaz toxique lourd ou de fumée d'incendie.",
    comment: "Subit 1d6 DM directs au début de chaque tour, ignorant totalement l'armure et le bouclier. Incapable d'incanter des sortilèges exigeant une composante verbale.",
    pourquoi: "Privation critique d'oxygène dans les poumons et anoxie des tissus cérébraux, menant rapidement à l'évanouissement et à la mort.",
    guerison: "Reprendre contact avec de l'air respirable, briser la prise d'étranglement (test de FOR opposé ou éliminer l'étrangleur), ou sortilège de Respiration aquatique.",
  },
  Empoisonné: {
    icon: '🧪',
    badgeColor: '#4f7d29',
    impactCourt: 'Dégâts périodiques continus au début du tour, -2 à tous les tests',
    quand: "Morsure ou piqûre de créature venimeuse (serpent, araignée, scorpène), flèche enduite de curare par un rôdeur d'ombre, ingestion d'un poison insidieux dans un banquet.",
    comment: "Subit des blessures automatiques au début de chaque round (souvent 1d4 ou 1d6 DM direct) et subit un malus permanent de -2 à l'ensemble de ses tests de caractéristique.",
    pourquoi: "Circulation d'une toxine biologique corrosive dans le réseau sanguin provoquant crampes, spasmes, nausées et nécrose progressive des tissus internes.",
    guerison: "Réussir un test de Constitution (CON) contre la difficulté du poison (souvent diff 12 à 15), boire une fiole d'antitoxique alchimique, ou sort divin de Neutre-poison.",
  },
  Terrorisé: {
    icon: '😱',
    badgeColor: '#5e2363',
    impactCourt: 'Obligation de fuir la source de terreur, -2 à toutes les actions',
    quand: "Face au rugissement d'un grand dragon (Présence terrifiante), hurlement d'une banshee, sortilège de Peur ou vision d'une monstruosité cosmique de l'Obscure.",
    comment: "Le personnage doit obligatoirement fuir la source de son effroi en empruntant l'issue la plus rapide. S'il ne peut fuir, il subit -2 à toutes ses actions tant que la créature est visible.",
    pourquoi: "Surcharge de panique de l'instinct de survie annihilant la volonté et la discipline militaire face à une abomination surdimensionnée.",
    guerison: "Réussir un test de Sagesse (SAG) ou de Charisme (CHA) difficulté 15 à la fin de son tour pour reprendre son calme, s'éloigner hors de vue, ou harangue de ralliement d'un Barde.",
  },
  Endormi: {
    icon: '💤',
    badgeColor: '#3b3b6e',
    impactCourt: 'Sans défense : coup critique automatique au contact, réveil si blessé',
    quand: "Sort de Sommeil arcanique (Magie profane rang 1), poudre de lotus noir soufflée au visage, poison soporifique ingurgité dans une boisson, souffle d'un dragon féerique.",
    comment: "Le personnage s'écroule et s'endort. Il est considéré comme sans défense : toute attaque au contact le touche automatiquement et inflige un coup critique maximal !",
    pourquoi: "Effondrement brutal de l'état de veille et narcose profonde des fonctions conscientes sous l'action d'un agent magique ou biochimique.",
    guerison: "Le personnage se réveille instantanément dès qu'il subit le moindre point de dégât de blessure, ou si un compagnon adjacent le secoue vigoureusement (1 action de mouvement).",
  },
  Invisible: {
    icon: '✨',
    badgeColor: '#8a5cba',
    impactCourt: '+5 aux jets d’Attaque, +5 en Défense contre cibles sans vision lucide',
    quand: "Incantation du sort d'Invisibilité (Voie de la magie illusoire ou arcane), cape d'ombre elfique tissée d'illusions, bonbon alchimique d'effacement optique.",
    comment: "Indétectable à la vue : bénéficie d'un bonus massif de +5 à ses jets d'Attaque et sa Défense est accrue de +5 contre toute créature incapable de percer l'invisibilité.",
    pourquoi: "Les rayons lumineux contournent le corps du personnage sans projeter d'ombre ni de reflet, le rendant parfaitement transparent pour les yeux ordinaires.",
    guerison: "L'invisibilité se dissipe immédiatement dès que le personnage porte une attaque physique ou lance un sort agressif, ou si l'adversaire utilise un sort de Vision véritable / poussière révélatrice.",
  },
};

export const ETATS: PrejudicialState[] = (reglesEtatsRaw.etats as PrejudicialState[]).map((e) => {
  const meta = (e.n && ETATS_METADATA[e.n]) || {};
  return {
    ...e,
    ...meta,
  };
});
export const REGLES: RuleChapter[] = reglesEtatsRaw.regles as RuleChapter[];

export function getMod(v: number): number {
  return Math.floor((v - 10) / 2);
}

export function calcStats(p: Character | null) {
  if (!p) return null;
  const safeBase = p.base && typeof p.base === 'object' ? p.base : ({} as Partial<Record<CaracName, number>>);
  const safeRb = p.rb && typeof p.rb === 'object' ? p.rb : ({} as Partial<Record<CaracName, number>>);
  const safeBonus = p.bonus && typeof p.bonus === 'object' ? p.bonus : { pv: 0, def: 0, init: 0 };
  const safeLevel = typeof p.level === 'number' && Number.isFinite(p.level) ? p.level : Number(p.level) || 1;
  const safeProfil = p.profil || 'guerrier';
  const safeRace = p.race || 'humain';

  const m: Record<CaracName, number> = {
    FOR: 0,
    DEX: 0,
    CON: 0,
    INT: 0,
    SAG: 0,
    CHA: 0,
  };

  CARAC_LIST.forEach((c) => {
    const total = (Number(safeBase[c]) || 10) + (Number(safeRb[c]) || 0);
    m[c] = getMod(total);
  });

  const pr: ProfilData = PROFILS.find((x) => x.id === safeProfil) || {
    id: safeProfil,
    n: safeProfil,
    dv: 8,
    traits: '',
    eq: '',
    ar: '',
  };
  const rc: RaceData = RACES.find((x) => x.id === safeRace) || {
    id: safeRace,
    n: safeRace,
    defb: 0,
    d: '',
    t: '',
    traits: '',
    cap: [],
    b: {},
  };
  const arm = EQUIPEMENTS.find((a) => a.n === p.arm && a.cat?.includes('Armure')) ||
              ARMURES_CATALOG.find((a) => a.n === p.arm);
  const bou = EQUIPEMENTS.find((a) => a.n === p.bou && a.cat?.includes('Bouclier')) ||
              ARMURES_CATALOG.find((a) => a.n === p.bou);

  const def =
    p.defManual !== null && p.defManual !== undefined
      ? p.defManual + (safeBonus.def || 0)
      : 10 +
        m.DEX +
        (arm?.def || 0) +
        (bou?.def || 0) +
        (rc.defb || 0) +
        (safeBonus.def || 0);

  const init = (Number(safeBase.DEX) || 10) + (Number(safeRb.DEX) || 0) + (safeBonus.init || 0);
  const ct = safeLevel + m.FOR;
  const di = safeLevel + m.DEX;
  const prMag = pr.mag as CaracName | undefined;
  const mg = prMag ? safeLevel + m[prMag] : null;

  // Calcul Points de Mana Max selon règles officielles Chroniques Oubliées :
  // - Lanceurs profanes majeurs (Magicien, Ensorceleur, Nécromancien) : (2 x Niveau) + Mod. Magie
  // - Lanceurs divins et hybrides (Prêtre, Druide, Barde, Forgesort) : (1 x Niveau) + Mod. Magie
  // - Profils sans magie : 0 PM (ou selon règle optionnelle de table)
  let pmCalculated = 0;
  if (['magicien', 'ensorceleur', 'necromancien'].includes(safeProfil)) {
    pmCalculated = Math.max(1, safeLevel * 2 + (prMag ? m[prMag] : 0));
  } else if (['pretre', 'druide', 'barde', 'forgesort'].includes(safeProfil)) {
    pmCalculated = Math.max(1, safeLevel * 1 + (prMag ? m[prMag] : 0));
  } else if (prMag) {
    pmCalculated = Math.max(0, safeLevel + (m[prMag] || 0));
  }

  const pmMax =
    p.pmMaxManual !== null && p.pmMaxManual !== undefined
      ? p.pmMaxManual
      : pmCalculated;

  // Déplacement officiel : 10 mètres par action de mouvement (20 m au pas de course)
  let moveBase = 10;
  if (safeProfil === 'moine') moveBase += 5; // Bonus voie du vent moine
  const deplacement = (p.moveBonus || 0) + moveBase;

  const hpMax =
    (p.hpMaxManual ?? p.hpMaxAuto ?? p.hpBase ?? 10) + (safeBonus.pv || 0);

  return {
    m,
    def,
    init,
    ct,
    di,
    mg,
    mag: prMag,
    hpMax,
    pmMax,
    deplacement,
  };
}

export const SAMPLE_HERO: Character = {
  version: '1.0',
  id: 'pj_sample_1',
  name: 'Sire Thomas de Montmirail',
  player: 'Fabien',
  race: 'humain',
  rcOption: 0,
  profil: 'chevalier',
  level: 1,
  base: { FOR: 14, DEX: 12, CON: 14, INT: 10, SAG: 10, CHA: 13 },
  rb: {},
  hpBase: 12,
  hpMaxAuto: 12,
  hpMaxManual: null,
  hp: 12,
  pmMaxManual: null,
  pm: 0,
  ptsCap: 0,
  caps: [
    { wayKey: 'chevalier-guerre', rank: 1 },
    { wayKey: 'chevalier-heros', rank: 1 },
  ],
  armes: [
    { n: 'Épée longue', t: 'Contact', dm: '1d8', crit: '20', por: '-', props: 'Polyvalente classique', note: 'Lame forgée au blason royal' },
    { n: 'Dague', t: 'Contact', dm: '1d4', crit: '20', por: '5 m', props: 'Légère, jet possible', note: 'À la botte droite' }
  ],
  inventaire: [
    { n: 'Demi-plaque', desc: "Plaques d'acier articulées", q: 1, isConsumable: false, note: 'Équipée' },
    { n: 'Grand bouclier', desc: "Grand écu métallique d'infanterie", q: 1, isConsumable: false, note: 'Équipé (+2 DEF)' },
    { n: 'Sac à dos renforcé', desc: 'Toile imperméabilisée', q: 1, isConsumable: false, note: 'Barda principal' },
    { n: 'Tente (2 couchages)', desc: 'Tente de bivouac standard pour 2 compagnons', q: 1, isConsumable: false, note: 'Roulée au dos' },
    { n: 'Potion de soins légers', desc: 'Restaure 1d8 PV immédiatement', q: 2, isConsumable: true, note: 'Ceinture' },
    { n: 'Rations de voyage (1 sem.)', desc: 'Vivres de longue conservation', q: 7, isConsumable: true, note: '1 portion/jour' },
    { n: 'Gourde de cuir (1L)', desc: "Pleine d'eau fraîche", q: 1, isConsumable: true, note: 'Pleine' },
    { n: 'Torches de résine', desc: '1h éclairage', q: 3, isConsumable: true, note: 'Amadou sec' },
    { n: 'Briquet à silex et amadou', desc: 'Allumage rapide', q: 1, isConsumable: false, note: 'Poche étanche' }
  ],
  customSorts: [],
  arm: 'Demi-plaque',
  bou: 'Grand bouclier',
  bonus: { pv: 0, def: 0, init: 0 },
  bourse: { po: 15, pa: 25, pc: 30 },
  persoTraits: 'Chevalier errant au code d honneur rigoureux. Protecteur des innocents et loyal envers ses compagnons.'
};
