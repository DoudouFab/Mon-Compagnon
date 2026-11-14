import { CaracName, Character, Combatant, InventoryItem, WeaponItem } from '../types/chroniques';
import { RACES } from './coDatabase';
import { buildCharacterPortraitDataUrl } from '../utils/fantasyPortraitGenerator';

export type PnjPresetCategorie =
  | 'Alliés & Recrues'
  | 'Mercenaires & Gardes'
  | 'Guides & Éclaireurs'
  | 'Érudits & Soigneurs'
  | 'Antagonistes & Rencontres';

export type PnjPresetRole =
  | 'Allié du groupe'
  | 'Mercenaire'
  | 'Guide'
  | "Garde d'Élite"
  | 'PNJ Notif'
  | 'Ennemi';

export interface PnjPreset {
  id: string;
  name: string;
  titre: string;
  categorie: PnjPresetCategorie;
  role: PnjPresetRole;
  race: string;
  profil: string;
  level: number;
  base: Record<CaracName, number>;
  hp: number;
  def: number;
  pmMax: number;
  arm: string;
  bou: string;
  armes: WeaponItem[];
  inventaire: InventoryItem[];
  caps: { wayKey: string; rank: number }[];
  bourse: { po: number; pa: number; pc: number };
  notes: string;
  age?: string;
  taille?: string;
  poids?: string;
}

export const PNJ_PRESET_CATEGORIES: PnjPresetCategorie[] = [
  'Alliés & Recrues',
  'Mercenaires & Gardes',
  'Guides & Éclaireurs',
  'Érudits & Soigneurs',
  'Antagonistes & Rencontres',
];

export const PNJ_PRESETS: PnjPreset[] = [
  {
    id: 'pnj_ecuyer_loyal',
    name: 'Aldric',
    titre: 'Écuyer Loyal',
    categorie: 'Alliés & Recrues',
    role: 'Allié du groupe',
    race: 'humain',
    profil: 'guerrier',
    level: 1,
    base: { FOR: 13, DEX: 12, CON: 13, INT: 10, SAG: 11, CHA: 12 },
    hp: 14,
    def: 15,
    pmMax: 0,
    arm: 'Chemise de mailles (+3 DEF)',
    bou: 'Petit bouclier (+1 DEF)',
    armes: [
      {
        n: 'Épée courte',
        t: 'Contact (1M)',
        dm: '1d6+1',
        crit: '20',
        por: 'Contact',
        props: 'Maniement sûr avec bouclier.',
      },
      {
        n: 'Dague de secours',
        t: 'Contact / Lancer',
        dm: '1d4+1',
        crit: '20',
        por: '5 m',
        props: 'Légère, arme d’appoint.',
      },
    ],
    inventaire: [
      { n: 'Chemise de mailles', q: 1, desc: '+3 DEF (Armure intermédiaire)' },
      { n: 'Petit bouclier en bois cerclé', q: 1, desc: '+1 DEF' },
      { n: 'Sacoche de pansements & pierre à aiguiser', q: 1, desc: 'Entretien & premiers soins' },
      { n: 'Rations de voyage (3 jours)', q: 3, isConsumable: true },
    ],
    caps: [{ wayKey: 'guerrier-bouclier', rank: 1 }],
    bourse: { po: 1, pa: 5, pc: 0 },
    notes:
      'Jeune aspirant chevalier discipliné et dévoué. Entretient les armures, porte le paquetage et protège le flanc de son commanditaire.',
    age: '18 ans',
    taille: '1,72 m',
    poids: '68 kg',
  },
  {
    id: 'pnj_garde_corps',
    name: 'Bran',
    titre: 'Mercenaire Garde du Corps',
    categorie: 'Mercenaires & Gardes',
    role: 'Mercenaire',
    race: 'humain',
    profil: 'guerrier',
    level: 2,
    base: { FOR: 16, DEX: 11, CON: 15, INT: 9, SAG: 12, CHA: 10 },
    hp: 24,
    def: 16,
    pmMax: 0,
    arm: 'Cotte de mailles (+4 DEF)',
    bou: 'Grand bouclier (+2 DEF)',
    armes: [
      {
        n: 'Épée longue',
        t: 'Contact (1M)',
        dm: '1d8+3',
        crit: '19-20',
        por: 'Contact',
        props: 'Frappe fiable au corps-à-corps.',
      },
      {
        n: 'Arbalète légère',
        t: 'Distance',
        dm: '1d8',
        crit: '20',
        por: '30 m',
        props: 'Rechargement 1 action de mouvement.',
      },
    ],
    inventaire: [
      { n: 'Cotte de mailles', q: 1, desc: '+4 DEF (Armure intermédiaire)' },
      { n: 'Grand bouclier en acier', q: 1, desc: '+2 DEF' },
      { n: 'Carquois de 10 carreaux', q: 1 },
      { n: 'Rations & gourde de campagne', q: 2, isConsumable: true },
    ],
    caps: [
      { wayKey: 'guerrier-bouclier', rank: 1 },
      { wayKey: 'guerrier-resistance', rank: 1 },
    ],
    bourse: { po: 4, pa: 12, pc: 0 },
    notes:
      'Vétéran taciturne et fiable tant que sa solde (2 PO/jour) est honorée. N’hésite pas à s’interposer devant un protégé.',
    age: '34 ans',
    taille: '1,84 m',
    poids: '88 kg',
  },
  {
    id: 'pnj_pisteur_sylvain',
    name: 'Sylva',
    titre: 'Pisteur des Terres Sauvages',
    categorie: 'Guides & Éclaireurs',
    role: 'Guide',
    race: 'elfe-sylvain',
    profil: 'rodeur',
    level: 2,
    base: { FOR: 11, DEX: 16, CON: 12, INT: 11, SAG: 15, CHA: 11 },
    hp: 16,
    def: 16,
    pmMax: 0,
    arm: 'Armure de cuir renforcé (+3 DEF)',
    bou: '',
    armes: [
      {
        n: 'Arc court de chasse',
        t: 'Distance (2M)',
        dm: '1d6+3',
        crit: '19-20',
        por: '30 m',
        props: 'Tir précis sans malus à couvert léger.',
      },
      {
        n: 'Épée courte',
        t: 'Contact (1M)',
        dm: '1d6+1',
        crit: '20',
        por: 'Contact',
        props: 'Maniement rapide.',
      },
    ],
    inventaire: [
      { n: 'Armure de cuir renforcé', q: 1, desc: '+3 DEF' },
      { n: 'Carquois de 20 flèches & Cape de camouflage', q: 1 },
      { n: 'Collets et nécessaire de bivouac', q: 1 },
    ],
    caps: [
      { wayKey: 'rodeur-survie', rank: 1 },
      { wayKey: 'rodeur-traqueur', rank: 1 },
    ],
    bourse: { po: 2, pa: 8, pc: 0 },
    notes:
      'Guide sylvestre silencieuse qui lit les pistes comme un livre ouvert. Ravitaille le groupe en forêt et prévient les embuscades.',
    age: '95 ans',
    taille: '1,74 m',
    poids: '60 kg',
  },
  {
    id: 'pnj_acolyte_soigneur',
    name: 'Frère Éloi',
    titre: 'Acolyte Guérisseur',
    categorie: 'Érudits & Soigneurs',
    role: 'Allié du groupe',
    race: 'humain',
    profil: 'pretre',
    level: 1,
    base: { FOR: 10, DEX: 10, CON: 12, INT: 12, SAG: 16, CHA: 14 },
    hp: 12,
    def: 12,
    pmMax: 4,
    arm: 'Armure de cuir (+2 DEF)',
    bou: '',
    armes: [
      {
        n: 'Bâton ferré de pèlerin',
        t: 'Contact (2M)',
        dm: '1d6',
        crit: '20',
        por: 'Contact',
        props: 'Arme défensive simple.',
      },
    ],
    inventaire: [
      { n: 'Armure de cuir', q: 1, desc: '+2 DEF' },
      { n: 'Trousse d’apothicaire & bandages sacrés', q: 1 },
      { n: 'Symbole béni en bois de chêne', q: 1 },
    ],
    caps: [{ wayKey: 'pretre-priere', rank: 1 }],
    bourse: { po: 1, pa: 10, pc: 0 },
    notes:
      'Bienveillant, érudit et pacifique ; soutient l’équipe par ses prières de soins et ses connaissances en herboristerie.',
    age: '26 ans',
    taille: '1,70 m',
    poids: '65 kg',
  },
  {
    id: 'pnj_porte_torches',
    name: 'Pip',
    titre: 'Porte-Torches & Auxiliaire',
    categorie: 'Alliés & Recrues',
    role: 'Allié du groupe',
    race: 'halfelin',
    profil: 'voleur',
    level: 1,
    base: { FOR: 9, DEX: 15, CON: 12, INT: 11, SAG: 13, CHA: 14 },
    hp: 10,
    def: 15,
    pmMax: 0,
    arm: 'Armure de cuir (+2 DEF)',
    bou: '',
    armes: [
      {
        n: 'Fronde',
        t: 'Distance',
        dm: '1d4+2',
        crit: '20',
        por: '20 m',
        props: 'Discrète et légère.',
      },
      {
        n: 'Dague',
        t: 'Contact',
        dm: '1d4',
        crit: '20',
        por: '5 m',
        props: 'Lame utilitaire.',
      },
    ],
    inventaire: [
      { n: 'Armure de cuir', q: 1, desc: '+2 DEF' },
      { n: 'Fagot de 6 torches, silex & corde (15 m)', q: 1 },
      { n: 'Grand sac à dos d’expédition', q: 1 },
      { n: 'Rations & biscuits fourrés', q: 4, isConsumable: true },
    ],
    caps: [{ wayKey: 'voleur-aventurier', rank: 1 }],
    bourse: { po: 0, pa: 15, pc: 20 },
    notes:
      'Optimiste, débrouillard et gourmand ; tient les torches, monte le camp, garde les montures et se met à l’abri quand le combat s’envenime.',
    age: '22 ans',
    taille: '1,02 m',
    poids: '32 kg',
  },
  {
    id: 'pnj_capitaine_garde',
    name: 'Dame Isolde',
    titre: 'Capitaine de la Garde',
    categorie: 'Mercenaires & Gardes',
    role: "Garde d'Élite",
    race: 'humain',
    profil: 'chevalier',
    level: 3,
    base: { FOR: 16, DEX: 12, CON: 15, INT: 12, SAG: 13, CHA: 15 },
    hp: 34,
    def: 18,
    pmMax: 0,
    arm: 'Demi-plaque (+5 DEF)',
    bou: 'Grand bouclier (+2 DEF)',
    armes: [
      {
        n: 'Épée bâtarde',
        t: 'Contact (1M)',
        dm: '1d10+3',
        crit: '19-20',
        por: 'Contact',
        props: 'Acier de maître.',
      },
      {
        n: 'Dague noble',
        t: 'Contact',
        dm: '1d4+3',
        crit: '20',
        por: '5 m',
      },
    ],
    inventaire: [
      { n: 'Demi-plaque armoriée', q: 1, desc: '+5 DEF' },
      { n: 'Grand bouclier de la cité', q: 1, desc: '+2 DEF' },
      { n: 'Sauf-conduit & cor de ralliement', q: 1 },
    ],
    caps: [
      { wayKey: 'chevalier-meneur', rank: 1 },
      { wayKey: 'chevalier-meneur', rank: 2 },
      { wayKey: 'chevalier-guerre', rank: 1 },
    ],
    bourse: { po: 18, pa: 5, pc: 0 },
    notes:
      'Officier incorruptible commandant la garnison locale. Peut fournir escorte, mandat d’arrêt ou appui tactique lors d’un siège.',
    age: '31 ans',
    taille: '1,76 m',
    poids: '70 kg',
  },
  {
    id: 'pnj_arbaletrier_nain',
    name: 'Thrain Barbe-d’Acier',
    titre: 'Arbalétrier Vétéran',
    categorie: 'Mercenaires & Gardes',
    role: 'Mercenaire',
    race: 'nain',
    profil: 'arquebusier',
    level: 2,
    base: { FOR: 13, DEX: 15, CON: 15, INT: 11, SAG: 12, CHA: 9 },
    hp: 22,
    def: 16,
    pmMax: 0,
    arm: 'Chemise de mailles (+3 DEF)',
    bou: '',
    armes: [
      {
        n: 'Arbalète lourde',
        t: 'Distance (2M)',
        dm: '2d6',
        crit: '19-20',
        por: '40 m',
        props: 'Perce-armure, rechargement 1 action.',
      },
      {
        n: 'Hachette naine',
        t: 'Contact (1M)',
        dm: '1d6+1',
        crit: '20',
        por: 'Contact',
      },
    ],
    inventaire: [
      { n: 'Chemise de mailles', q: 1, desc: '+3 DEF' },
      { n: 'Carquois de 15 carreaux d’acier', q: 1 },
      { n: 'Flasque de bière brune des montagnes', q: 1, isConsumable: true },
    ],
    caps: [
      { wayKey: 'arquebusier-precision', rank: 1 },
      { wayKey: 'arquebusier-bataille', rank: 1 },
    ],
    bourse: { po: 6, pa: 4, pc: 0 },
    notes:
      'Tireur d’élite bourru mais d’une loyauté sans faille une fois le contrat scellé devant témoins.',
    age: '78 ans',
    taille: '1,35 m',
    poids: '74 kg',
  },
  {
    id: 'pnj_barde_colporteuse',
    name: 'Lyraëlle Chantelune',
    titre: 'Barde Colporteuse & Informateur',
    categorie: 'Alliés & Recrues',
    role: 'Allié du groupe',
    race: 'demi-elfe',
    profil: 'barde',
    level: 2,
    base: { FOR: 9, DEX: 14, CON: 11, INT: 13, SAG: 11, CHA: 16 },
    hp: 15,
    def: 14,
    pmMax: 5,
    arm: 'Armure de cuir (+2 DEF)',
    bou: '',
    armes: [
      {
        n: 'Rapière',
        t: 'Contact (1M)',
        dm: '1d6+2',
        crit: '19-20',
        por: 'Contact',
        props: 'Finesse (DEX).',
      },
    ],
    inventaire: [
      { n: 'Armure de cuir souple', q: 1, desc: '+2 DEF' },
      { n: 'Luth d’érable sculpté', q: 1 },
      { n: 'Carnet de rumeurs & lettres de recommandation', q: 1 },
    ],
    caps: [
      { wayKey: 'barde-musique', rank: 1 },
      { wayKey: 'barde-saltimbanque', rank: 1 },
    ],
    bourse: { po: 8, pa: 15, pc: 0 },
    notes:
      'Connaît les auberges, les nobles désargentés et les rumeurs des quatre royaumes. Soutient le moral du groupe par ses chants.',
    age: '27 ans',
    taille: '1,68 m',
    poids: '56 kg',
  },
  {
    id: 'pnj_erudit_mage',
    name: 'Maître Vaelen',
    titre: 'Érudit du Cercle Arcanique',
    categorie: 'Érudits & Soigneurs',
    role: 'PNJ Notif',
    race: 'elfe-haut',
    profil: 'magicien',
    level: 2,
    base: { FOR: 8, DEX: 12, CON: 10, INT: 17, SAG: 13, CHA: 12 },
    hp: 10,
    def: 13,
    pmMax: 7,
    arm: '',
    bou: '',
    armes: [
      {
        n: 'Bâton de mage gravé',
        t: 'Contact / Arcanique',
        dm: '1d6',
        crit: '20',
        por: 'Contact',
        props: 'Focaliseur de runes.',
      },
      {
        n: 'Trait magique',
        t: 'Distance (Sort)',
        dm: '1d6+3',
        crit: '20',
        por: '30 m',
        props: 'Touche automatiquement à portée moyenne (selon règle).',
      },
    ],
    inventaire: [
      { n: 'Grimoire de traduction & parchemins vierges', q: 1 },
      { n: 'Loupe d’identification d’artefacts', q: 1 },
    ],
    caps: [
      { wayKey: 'magicien-arcanes', rank: 1 },
      { wayKey: 'magicien-protectrice', rank: 1 },
    ],
    bourse: { po: 12, pa: 0, pc: 0 },
    notes:
      'Archiviste et traducteur d’inscriptions anciennes. Commandite souvent des expéditions vers des ruines et doit être escorté.',
    age: '142 ans',
    taille: '1,78 m',
    poids: '62 kg',
  },
  {
    id: 'pnj_intendant_gnome',
    name: 'Bramwell Rouage-d’Or',
    titre: 'Marchand & Intendant de Caravane',
    categorie: 'Érudits & Soigneurs',
    role: 'PNJ Notif',
    race: 'gnome',
    profil: 'forgesort',
    level: 1,
    base: { FOR: 9, DEX: 13, CON: 12, INT: 16, SAG: 12, CHA: 13 },
    hp: 12,
    def: 13,
    pmMax: 4,
    arm: 'Armure de cuir (+2 DEF)',
    bou: '',
    armes: [
      {
        n: 'Arbalète légère',
        t: 'Distance',
        dm: '1d8',
        crit: '20',
        por: '30 m',
      },
      {
        n: 'Marteau d’artisan',
        t: 'Contact',
        dm: '1d4',
        crit: '20',
        por: 'Contact',
      },
    ],
    inventaire: [
      { n: 'Armure de cuir à poches multiples', q: 1, desc: '+2 DEF' },
      { n: 'Balance de changeur & boîte à outils', q: 1 },
      { n: 'Fiole d’huile grégeois (x1)', q: 1, isConsumable: true },
    ],
    caps: [{ wayKey: 'forgesort-artefacts', rank: 1 }],
    bourse: { po: 35, pa: 20, pc: 0 },
    notes:
      'Négociant avisé qui rachète le butin, répare les mécanismes et engage les aventuriers pour protéger ses convois.',
    age: '54 ans',
    taille: '1,05 m',
    poids: '36 kg',
  },
  {
    id: 'pnj_coupe_jarret',
    name: 'Garrick le Récidiviste',
    titre: 'Coupe-Jarret de Grand Chemin',
    categorie: 'Antagonistes & Rencontres',
    role: 'Ennemi',
    race: 'humain',
    profil: 'voleur',
    level: 2,
    base: { FOR: 11, DEX: 16, CON: 12, INT: 10, SAG: 10, CHA: 11 },
    hp: 16,
    def: 15,
    pmMax: 0,
    arm: 'Armure de cuir (+2 DEF)',
    bou: '',
    armes: [
      {
        n: 'Rapière rouillée',
        t: 'Contact (1M)',
        dm: '1d6+2',
        crit: '19-20',
        por: 'Contact',
        props: '+1d6 sournois si embuscade ou cible prise en tenaille.',
      },
      {
        n: 'Dagues de jet (x3)',
        t: 'Lancer',
        dm: '1d4+2',
        crit: '20',
        por: '10 m',
      },
    ],
    inventaire: [
      { n: 'Armure de cuir noirci', q: 1, desc: '+2 DEF' },
      { n: 'Foulard & crochets de serrurier', q: 1 },
    ],
    caps: [
      { wayKey: 'voleur-assassin', rank: 1 },
      { wayKey: 'voleur-spadassin', rank: 1 },
    ],
    bourse: { po: 3, pa: 14, pc: 15 },
    notes:
      'Brigand opportuniste. Frappe depuis les taillis, exige la bourse et tente de fuir dès qu’il tombe sous la moitié de ses PV.',
    age: '29 ans',
    taille: '1,73 m',
    poids: '69 kg',
  },
  {
    id: 'pnj_chef_bande_orque',
    name: 'Krag Dent-de-Fer',
    titre: 'Chef de Bande Pillard',
    categorie: 'Antagonistes & Rencontres',
    role: 'Ennemi',
    race: 'demi-orque',
    profil: 'barbare',
    level: 3,
    base: { FOR: 17, DEX: 12, CON: 16, INT: 8, SAG: 10, CHA: 11 },
    hp: 36,
    def: 14,
    pmMax: 0,
    arm: 'Armure de cuir renforcé (+3 DEF)',
    bou: '',
    armes: [
      {
        n: 'Hache à 2 mains',
        t: 'Contact (2M)',
        dm: '2d6+4',
        crit: '19-20',
        por: 'Contact',
        props: 'Frappe brutale.',
      },
      {
        n: 'Javelot lourd',
        t: 'Lancer',
        dm: '1d6+3',
        crit: '20',
        por: '20 m',
      },
    ],
    inventaire: [
      { n: 'Armure de cuir clouté & trophées', q: 1, desc: '+3 DEF' },
      { n: 'Clé du coffre du repaire', q: 1 },
    ],
    caps: [
      { wayKey: 'barbare-rage', rank: 1 },
      { wayKey: 'barbare-brute', rank: 1 },
      { wayKey: 'barbare-brute', rank: 2 },
    ],
    bourse: { po: 14, pa: 25, pc: 0 },
    notes:
      'Meneur brutal d’une troupe de brigands. Entre en rage au premier coup reçu et cible l’adversaire le plus imposant.',
    age: '30 ans',
    taille: '1,96 m',
    poids: '112 kg',
  },
];

export function createPnjFromPreset(
  preset: PnjPreset,
  opts?: { addToGroup?: boolean; addToCombat?: boolean }
): { pnjChar: Character | null; combatant: Combatant | null } {
  const addToGroup = opts?.addToGroup ?? true;
  const addToCombat = opts?.addToCombat ?? false;
  const id = `pnj_${preset.id}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const fullName = preset.titre ? `${preset.name}, ${preset.titre}` : preset.name;

  const raceData = RACES.find((r) => r.id === preset.race);
  const rb = { ...(raceData?.b || {}) };
  const portrait = buildCharacterPortraitDataUrl(
    {
      name: fullName,
      race: preset.race,
      profil: preset.profil,
      persoTraits: preset.notes,
    },
    0
  );

  let pnjChar: Character | null = null;
  let combatant: Combatant | null = null;

  if (addToGroup) {
    pnjChar = {
      id,
      name: fullName,
      player: `PNJ · ${preset.role}`,
      race: preset.race,
      profil: preset.profil,
      level: preset.level,
      base: { ...preset.base },
      rb,
      hpBase: preset.hp,
      hpMaxAuto: preset.hp,
      hpMaxManual: preset.hp,
      hp: preset.hp,
      pmMaxManual: preset.pmMax,
      pm: preset.pmMax,
      ptsCap: 0,
      ptsCapCadeaux: 0,
      bourse: { ...preset.bourse },
      caps: preset.caps.map((c) => ({ ...c })),
      armes: preset.armes.map((w) => ({ ...w })),
      inventaire: preset.inventaire.map((it) => ({ ...it })),
      customSorts: [],
      arm: preset.arm,
      bou: preset.bou,
      bonus: { pv: 0, def: 0, init: 0 },
      defManual: preset.def,
      persoTraits: `${preset.role} — ${preset.notes}`,
      ...(preset.age ? { age: preset.age } : {}),
      ...(preset.taille ? { taille: preset.taille } : {}),
      ...(preset.poids ? { poids: preset.poids } : {}),
      etats: [],
      isPnj: true,
      rolePnj: preset.role,
      portrait,
    };
  }

  if (addToCombat) {
    const totalDex = (preset.base.DEX || 10) + (rb.DEX || 0);
    const weaponSummary =
      preset.armes.length > 0
        ? preset.armes.map((w) => `${w.n} (${w.dm})`).join(', ')
        : 'Mains nues (1d4)';
    combatant = {
      id: `c_${id}`,
      n: `${fullName} (${preset.role})`,
      isPj: addToGroup,
      isPnj: true,
      hp: preset.hp,
      hpMax: preset.hp,
      def: preset.def,
      baseInit: totalDex,
      init: totalDex,
      notes: `${weaponSummary} • ${[preset.arm, preset.bou].filter(Boolean).join(' + ') || 'Sans armure'} (DEF ${preset.def}) • ${preset.notes}`,
      ...(addToGroup ? { pjRefId: id } : {}),
      etats: [],
    };
  }

  return { pnjChar, combatant };
}
