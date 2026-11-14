export type CaracName = 'FOR' | 'DEX' | 'CON' | 'INT' | 'SAG' | 'CHA';

export interface WeaponItem {
  n: string;
  t: string;
  dm: string;
  crit: string;
  por: string;
  props?: string;
  note?: string;
}

export interface InventoryItem {
  n: string;
  desc?: string;
  q: number;
  isConsumable?: boolean;
  isPack?: boolean;
  note?: string;
}

export interface SpellItem {
  id?: string;
  n: string;
  voie?: string;
  rang: number;
  portee?: string;
  duree?: string;
  cibles?: string;
  test?: string;
  degats?: string;
  limites?: string;
  actionCost?: string;
  nature?: string;
  composantes?: string;
  natureDegats?: string;
  L?: number;
  S?: number;
  t: string;
}

export interface WayRank {
  n: string;
  t: string;
  L: number;
  S: number;
  portee?: string;
  duree?: string;
  cibles?: string;
  test?: string;
  degats?: string;
  limites?: string;
  actionCost?: string;
  nature?: string;
  composantes?: string;
  natureDegats?: string;
}

export interface ClassWay {
  nom: string;
  profil: string;
  r: WayRank[];
}

export interface RaceData {
  id: string;
  n: string;
  d: string;
  b: Partial<Record<CaracName, number>>;
  t: string;
  traits: string;
  cap: { n: string; t: string }[];
  opts?: { n: string; t: string }[];
  defb?: number;
  ageDepart?: string;
  esperanceVie?: string;
  taille?: string;
  poids?: string;
  descriptionComplete?: string;
  relations?: string;
  nomsExemples?: string;
}

export interface ProfilData {
  id: string;
  n: string;
  dv: number;
  mag?: CaracName;
  traits: string;
  eq: string;
  ar: string;
  descriptionComplete?: string;
  voiesNoms?: string[];
  roleTactique?: string;
}

export interface Character {
  version?: string;
  id?: string;
  name: string;
  player?: string;
  race: string;
  rcOption?: number;
  profil: string;
  level: number;
  base: Record<CaracName, number>;
  rb: Partial<Record<CaracName, number>>;
  hpBase?: number;
  hpMaxAuto?: number;
  hpMaxManual?: number | null;
  hp: number;
  pmMaxManual?: number | null;
  pm?: number | null;
  ptsCap: number;
  caps: { wayKey: string; rank: number }[];
  armes: WeaponItem[];
  inventaire: InventoryItem[];
  customSorts: SpellItem[];
  arm: string;
  bou: string;
  bonus: { pv: number; def: number; init: number };
  persoTraits?: string;
  age?: string;
  taille?: string;
  poids?: string;
  ptsCapCadeaux?: number;
  moveBonus?: number;
  etats?: string[];
  isPnj?: boolean;
  rolePnj?: string;
  dmPatchAt?: number;
  bourse?: { po: number; pa: number; pc: number };
  portrait?: string;
  candyBox?: {
    unlocked: boolean;
    counts: Record<string, number>;
    tasted: string[];
    pendingTaste?: { candyName: string; requestedAt: number } | null;
    rejectedTaste?: { candyName: string; rejectedAt: number } | null;
  };
}

export interface CurrencyBourse {
  po: number;
  pa: number;
  pc: number;
}

export interface Monster {
  n: string;
  nc: string;
  pv: number;
  def: number;
  init: number;
  fam?: string;
  att: string;
  traits: string;
  source?: 'core' | 'tharnea';
  num?: number;
  milieu?: string;
  taille?: string;
  poids?: string;
  descPhysique?: string;
  caracs?: Partial<Record<CaracName, number>>;
  pouvoirs?: { n: string; t: string }[];
  tactique?: string;
  butin?: string;
  vitesse?: string;
  sauvegardes?: string;
  resistances?: string;
  origineNarratif?: string;
  liensPj?: string;
  secret?: string;
  imageUrl?: string;
}

export interface Equipment {
  n: string;
  nom?: string;
  cat?: string;
  type?: string;
  t?: string;
  prix?: string;
  dm?: string;
  degats?: string;
  def?: number;
  defense?: number;
  crit?: string;
  critique?: string;
  por?: string;
  portee?: string;
  desc?: string;
  description?: string;
  props?: string;
  proprietes?: string;
  isPack?: boolean;
  isConsumable?: boolean;
  q?: number;
  source?: 'core' | 'tharnea';
  activation?: string;
  duree?: string;
  effetSecondaire?: string;
  limite?: string;
  couleur?: string;
}

export interface PrejudicialState {
  id?: string;
  n?: string;
  name?: string;
  t?: string;
  desc?: string;
  icon?: string;
  impactCourt?: string;
  impactShort?: string;
  badgeColor?: string;
  color?: string;
  borderColor?: string;
  textColor?: string;
  quand?: string;
  comment?: string;
  pourquoi?: string;
  guerison?: string;
}

export interface RuleChapter {
  t: string;
  cat: string;
  c: string;
}

export interface Combatant {
  id: string;
  n: string;
  isPj: boolean;
  isPnj?: boolean;
  hp: number;
  hpMax: number;
  def: number;
  baseInit: number;
  init: number | null;
  lastRoll?: number;
  notes: string;
  pjRefId?: string;
  etats?: string[];
  actedInRound?: boolean;
  monsterRefName?: string;
}

export interface TableFeedEntry {
  id: string;
  timestamp: number;
  kind: 'event' | 'message';
  scope: 'all' | 'secret';
  senderRole: 'mj' | 'pj';
  senderName: string;
  senderHeroId?: string;
  targetHeroId?: string;
  targetHeroName?: string;
  category?: 'hp' | 'pm' | 'bourse' | 'inventaire' | 'etats' | 'capacite' | 'fiche' | 'chat';
  summary: string;
  detail?: string;
}
