import { CaracName, Character, InventoryItem, WeaponItem } from '../types/chroniques';
import { buildFamilierPortraitDataUrl } from '../utils/fantasyPortraitGenerator';

export type FamilierCategorie = 'Arcanique' | 'Compagnon Animal' | 'Éclaireur' | 'Exotique';

export interface FamilierPreset {
  id: string;
  name: string;
  espece: string;
  categorie: FamilierCategorie;
  profilSuggested: string;
  level: number;
  base: Record<CaracName, number>;
  hp: number;
  def: number;
  pmMax: number;
  vitesse: string;
  taille: string;
  poids: string;
  age: string;
  armes: WeaponItem[];
  capacitesSpeciales: { n: string; t: string }[];
  inventaire?: InventoryItem[];
  persoTraits: string;
}

export const FAMILIERS_PRESETS: FamilierPreset[] = [
  {
    id: 'fam_corbeau_messager',
    name: 'Huginn, Corbeau Messager',
    espece: 'Corbeau',
    categorie: 'Éclaireur',
    profilSuggested: 'magicien',
    level: 1,
    base: { FOR: 5, DEX: 16, CON: 10, INT: 12, SAG: 14, CHA: 11 },
    hp: 8,
    def: 15,
    pmMax: 2,
    vitesse: 'Vol 18 m · Sol 4 m',
    taille: '40 cm',
    poids: '1,2 kg',
    age: '3 ans',
    armes: [
      {
        n: 'Bec acéré & Serres',
        t: 'Contact',
        dm: '1d4',
        crit: '20',
        por: 'Contact',
        props: 'Attaque avec DEX. Cible les yeux sur critique (aveuglé 1 tour).',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Partage sensoriel (Lien)',
        t: "Tant qu'il reste à moins de 500 m, son maître peut voir et entendre par les sens du corbeau (action de mouvement par tour).",
      },
      {
        n: 'Imitation vocale & Messager',
        t: 'Peut retenir et répéter un message de 25 mots maximum avec la voix exacte de son maître ou imiter des bruits de forêt.',
      },
      {
        n: 'Petite taille aérienne',
        t: '+3 en Discrétion et esquive en plein vol ; difficile à toucher au corps-à-corps.',
      },
    ],
    inventaire: [{ n: 'Anneau de patte porte-parchemin', q: 1, desc: 'Tube en laiton léger pour missives scellées' }],
    persoTraits:
      'Vif, observateur et sarcastique dans son langage corporel. Collectionne tout ce qui brille.',
  },
  {
    id: 'fam_chouette_spectrale',
    name: 'Sélène, Chouette Effraie',
    espece: 'Chouette',
    categorie: 'Arcanique',
    profilSuggested: 'magicien',
    level: 2,
    base: { FOR: 5, DEX: 17, CON: 10, INT: 13, SAG: 16, CHA: 12 },
    hp: 10,
    def: 16,
    pmMax: 4,
    vitesse: 'Vol 18 m (silencieux)',
    taille: '45 cm',
    poids: '0,9 kg',
    age: '5 ans',
    armes: [
      {
        n: 'Serres silencieuses',
        t: 'Contact',
        dm: '1d4+1',
        crit: '19-20',
        por: 'Contact',
        props: 'Attaque avec DEX. Ne provoque pas d’attaque d’opportunité après une attaque en vol.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Vol silencieux',
        t: 'Aucun bruit en vol : bonus de +5 aux tests de Discrétion la nuit ou dans les sous-bois.',
      },
      {
        n: 'Vision nocturne absolue',
        t: 'Voit parfaitement dans le noir total jusqu’à 30 m (même dans les ténèbres ordinaires).',
      },
      {
        n: 'Canalisation arcanique',
        t: 'Le maître peut lancer un sort de Contact à travers sa chouette si elle se trouve à moins de 20 m.',
      },
    ],
    inventaire: [{ n: 'Médaillon runique d’argent', q: 1, desc: 'Relais de mana gravé au nom de son maître' }],
    persoTraits:
      'Calme, presque spectrale, pivote la tête à 270° pour scruter les mensonges et les embuscades.',
  },
  {
    id: 'fam_chat_arcanique',
    name: 'Onyx, Chat Noir Arcanique',
    espece: 'Chat Noir',
    categorie: 'Arcanique',
    profilSuggested: 'ensorceleur',
    level: 1,
    base: { FOR: 6, DEX: 18, CON: 11, INT: 12, SAG: 14, CHA: 15 },
    hp: 9,
    def: 16,
    pmMax: 3,
    vitesse: '15 m (Escalade 10 m)',
    taille: '35 cm au garrot',
    poids: '4,5 kg',
    age: '4 ans',
    armes: [
      {
        n: 'Griffes & Morsure vive',
        t: 'Contact',
        dm: '1d4+1',
        crit: '19-20',
        por: 'Contact',
        props: 'Attaque avec DEX. Deux coups rapides si la cible est surprise.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Sixième sens occulte',
        t: 'Détecte instinctivement la magie, les pièges magiques et les créatures invisibles dans un rayon de 10 m (poils hérissés).',
      },
      {
        n: 'Pas de velours & Équilibre',
        t: '+5 en Discrétion et Escalade ; ne subit aucun dégât de chute jusqu’à 12 m.',
      },
      {
        n: 'Porte-bonheur du maître',
        t: '1 fois par session, tant que le chat est à son contact, le maître peut relancer un dé 20 raté sur un test de SAG ou CHA.',
      },
    ],
    inventaire: [{ n: 'Collier de velours serti d’une améthyste', q: 1, desc: 'Réagit à la proximité des portails' }],
    persoTraits:
      'Daignera obéir avec élégance et mépris souverain envers les étrangers.',
  },
  {
    id: 'fam_loup_fidele',
    name: 'Fauve, Loup Fidèle',
    espece: 'Loup',
    categorie: 'Compagnon Animal',
    profilSuggested: 'rodeur',
    level: 2,
    base: { FOR: 15, DEX: 15, CON: 14, INT: 8, SAG: 14, CHA: 10 },
    hp: 18,
    def: 14,
    pmMax: 0,
    vitesse: '20 m',
    taille: '85 cm au garrot',
    poids: '38 kg',
    age: '4 ans',
    armes: [
      {
        n: 'Morsure de chasse',
        t: 'Contact',
        dm: '1d6+2',
        crit: '20',
        por: 'Contact',
        props: 'Renversement : sur 15+ naturel ou si l’allié est au contact, la cible fait un test de FOR/DEX (Diff 12) ou tombe À terre.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Tactique de meute',
        t: '+2 en attaque et +1d4 DM lorsque son maître (ou un autre allié) engage la même cible au corps-à-corps.',
      },
      {
        n: 'Odorat & Ouïe aiguisés',
        t: '+5 aux tests de Perception / Pistage ; détecte les créatures cachées à 20 m sous le vent.',
      },
      {
        n: 'Gardien loyal',
        t: 'En veille nocturne, ne dort jamais profondément et réveille immédiatement son maître au moindre danger.',
      },
    ],
    inventaire: [{ n: 'Harnais de cuir clouté', q: 1, desc: 'Équipé de deux petites sacoches de selle (4 kg)' }],
    persoTraits:
      'Silencieux, protecteur et farouchement dévoué à son maître ; grogne sourdement face aux créatures de l’Obscure.',
  },
  {
    id: 'fam_furet_chapardeur',
    name: 'Filou, Furet Chapardeur',
    espece: 'Furet',
    categorie: 'Éclaireur',
    profilSuggested: 'voleur',
    level: 1,
    base: { FOR: 5, DEX: 19, CON: 11, INT: 11, SAG: 13, CHA: 14 },
    hp: 8,
    def: 17,
    pmMax: 0,
    vitesse: '12 m (Faufilement)',
    taille: '45 cm (queue incluse)',
    poids: '1,1 kg',
    age: '2 ans',
    armes: [
      {
        n: 'Morsure éclair',
        t: 'Contact',
        dm: '1d3',
        crit: '19-20',
        por: 'Contact',
        props: 'Attaque avec DEX. Peut distraire un adversaire (bonus +2 à la prochaine attaque du maître).',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Infiltration minuscule',
        t: 'Passe dans tout interstice de 5 cm (barreaux, soupiraux, serrures larges) ; +6 en Discrétion.',
      },
      {
        n: 'Pattes agiles',
        t: 'Peut dérober une clé, une bourse ou un objet léger (< 500 g) avec un test de DEX +4 et le rapporter à son maître.',
      },
      {
        n: 'Sens des pièges',
        t: 'Repère les mécanismes et fils déclencheurs au sol avec un bonus de +3 en Perception.',
      },
    ],
    inventaire: [{ n: 'Mini-besace en cuir souple', q: 1, desc: 'Dissimule jusqu’à 3 petits objets (clés, gemmes, fioles)' }],
    persoTraits:
      'Espiègle, hyperactif et chapardeur. Adore se glisser dans la capuche de son maître entre deux missions.',
  },
  {
    id: 'fam_faucon_chasseur',
    name: 'Aile-Vive, Faucon Pèlerin',
    espece: 'Faucon',
    categorie: 'Compagnon Animal',
    profilSuggested: 'rodeur',
    level: 2,
    base: { FOR: 7, DEX: 18, CON: 11, INT: 9, SAG: 16, CHA: 11 },
    hp: 11,
    def: 16,
    pmMax: 0,
    vitesse: 'Vol 25 m',
    taille: '48 cm (envergure 1,10 m)',
    poids: '1,3 kg',
    age: '4 ans',
    armes: [
      {
        n: 'Attaque en piqué (Serres)',
        t: 'Contact',
        dm: '1d6+1',
        crit: '19-20',
        por: 'Contact',
        props: 'Attaque avec DEX. +1d4 DM si le faucon a plongé de plus de 10 m d’altitude.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Œil de faucon',
        t: 'Repère un détail ou une silhouette à plus de 1 km à découvert ; +5 aux tests de Perception visuelle.',
      },
      {
        n: 'Harassement aérien',
        t: 'En combat, peut harceler un ennemi à portée (Action d’attaque) : l’ennemi subit -2 à sa prochaine attaque ou perte d’action limitée de visée.',
      },
    ],
    inventaire: [{ n: 'Chaperon de cuir & Gant de fauconnier', q: 1, desc: 'Assorti aux couleurs du maître' }],
    persoTraits:
      'Fier, rapide comme l’éclair et discipliné ; répond au moindre sifflement codé.',
  },
  {
    id: 'fam_crapaud_alchimique',
    name: 'Baveux, Crapaud Alchimique',
    espece: 'Crapaud',
    categorie: 'Arcanique',
    profilSuggested: 'forgesort',
    level: 1,
    base: { FOR: 6, DEX: 12, CON: 16, INT: 11, SAG: 13, CHA: 8 },
    hp: 14,
    def: 13,
    pmMax: 4,
    vitesse: '6 m · Nage 12 m · Bond 6 m',
    taille: '25 cm',
    poids: '1,8 kg',
    age: '9 ans',
    armes: [
      {
        n: 'Langue gluante & Crachat acide',
        t: 'Distance',
        dm: '1d4 acide',
        crit: '20',
        por: '5 m',
        props: 'Dégâts d’acide. Peut attraper un petit objet à distance avec sa langue.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Sécrétion de potion (1/jour)',
        t: 'Produit 1 dose d’antidote mineur (+3 contre poison) ou d’onguent régénérant (1d4 PV) dans un flacon préparé par son maître.',
      },
      {
        n: 'Peau toxique & Amphibie',
        t: 'Respire sous l’eau. Tout attaquant qui le mord ou le saisit à mains nues subit 1d3 DM de poison.',
      },
      {
        n: 'Estomac alchimique',
        t: 'Peut avaler et conserver intacts jusqu’à 2 petits objets (anneau, clé, fiole) et les régurgiter sur commande.',
      },
    ],
    inventaire: [{ n: 'Fiole de récolte alchimique', q: 2, desc: 'Destinée à ses sécrétions' }],
    persoTraits:
      'Impassible, globuleux et étonnamment sage. Coasse dès qu’un breuvage est empoisonné.',
  },
  {
    id: 'fam_pseudodragon',
    name: 'Pyros, Pseudodragon',
    espece: 'Pseudodragon',
    categorie: 'Exotique',
    profilSuggested: 'ensorceleur',
    level: 3,
    base: { FOR: 9, DEX: 17, CON: 14, INT: 14, SAG: 14, CHA: 15 },
    hp: 20,
    def: 17,
    pmMax: 5,
    vitesse: 'Vol 16 m · Sol 6 m',
    taille: '75 cm (avec queue)',
    poids: '4 kg',
    age: '18 ans',
    armes: [
      {
        n: 'Dard caudal venimeux',
        t: 'Contact',
        dm: '1d4+1',
        crit: '19-20',
        por: 'Contact',
        props: 'Venin soporifique : la cible réussit un test de CON (Diff 13) ou est Affaiblie (-2) pendant 2 tours.',
      },
      {
        n: 'Mini-souffle de braises',
        t: 'Distance',
        dm: '2d4 feu',
        crit: '20',
        por: '6 m',
        props: 'Cône étroit (coûte 2 PM ou Limité 1/combat). Enflamme les matériaux secs.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Télépathie empathique',
        t: 'Communique par images, émotions et pensées simples avec son maître jusqu’à 100 m.',
      },
      {
        n: 'Écailles résistantes',
        t: 'Résistance à la magie (+2 aux tests de sauvegarde contre les sorts) et réduit les dégâts de feu de 3.',
      },
    ],
    inventaire: [{ n: 'Pièce d’or fétiche', q: 1, desc: 'Ne s’en sépare jamais pour dormir' }],
    persoTraits:
      'Orgueilleux comme un grand dragon miniature. Adore les compliments, les épices et les pierres chaudes.',
  },
  {
    id: 'fam_molosse_garde',
    name: 'Cerbérin, Molosse de Garde',
    espece: 'Molosse',
    categorie: 'Compagnon Animal',
    profilSuggested: 'chevalier',
    level: 2,
    base: { FOR: 16, DEX: 12, CON: 16, INT: 7, SAG: 13, CHA: 10 },
    hp: 24,
    def: 15,
    pmMax: 0,
    vitesse: '16 m',
    taille: '90 cm au garrot',
    poids: '52 kg',
    age: '5 ans',
    armes: [
      {
        n: 'Mâchoires broyeuses',
        t: 'Contact',
        dm: '1d8+3',
        crit: '20',
        por: 'Contact',
        props: 'Prise ferme : sur 16+, immobilise un adversaire de taille Moyenne ou inférieure (test FOR Diff 13 pour se libérer).',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Garde du corps',
        t: 'S’il est au contact de son maître, il peut intercepter une attaque dirigée contre lui (1/round, subit les dégâts à sa place avec RD 2).',
      },
      {
        n: 'Collier de guerre',
        t: 'Son barding léger en cuir bouilli et pointes lui confère DEF 15.',
      },
    ],
    inventaire: [{ n: 'Barde légère en cuir clouté', q: 1, desc: 'Protège le poitrail et le cou' }],
    persoTraits:
      'Massif, placide avec les alliés et les enfants, mais implacable dès que quelqu’un menace son maître.',
  },
  {
    id: 'fam_esprit_follet',
    name: 'Lumina, Esprit Follet',
    espece: 'Esprit Follet',
    categorie: 'Exotique',
    profilSuggested: 'druide',
    level: 2,
    base: { FOR: 4, DEX: 19, CON: 10, INT: 15, SAG: 15, CHA: 18 },
    hp: 10,
    def: 17,
    pmMax: 6,
    vitesse: 'Vol 14 m (lévitation)',
    taille: '25 cm',
    poids: '0,2 kg',
    age: 'Immortel (Féerie)',
    armes: [
      {
        n: 'Étincelle féerique',
        t: 'Magie',
        dm: '1d4+1 magie',
        crit: '20',
        por: '15 m',
        props: 'Dégâts magiques purs. La cible brille d’une lueur pâle pendant 1 tour (+2 pour la toucher dans le noir).',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Lanterne vivante',
        t: 'Éclaire à volonté comme une torche (10 m) ou réduit sa lueur à une luciole discrète.',
      },
      {
        n: 'Poussière d’étoiles (2 PM)',
        t: 'Soigne 1d6 PV à un allié au contact ou accorde +3 au prochain test de Discrétion/Charme.',
      },
      {
        n: 'Invisibilité brève (2 PM)',
        t: 'Devient invisible pendant 3 rounds tant qu’elle n’attaque pas.',
      },
    ],
    inventaire: [],
    persoTraits:
      'Rieuse, lumineuse et curieuse. Laisse un léger sillage de poussière dorée quand elle s’enthousiasme.',
  },
];

export function createFamilierFromPreset(
  preset: FamilierPreset,
  master?: { id?: string; name?: string } | null
): Character {
  const uniqueId = `fam_${preset.id}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const portrait = buildFamilierPortraitDataUrl(preset.espece, preset.name, 0);

  return {
    id: uniqueId,
    name: preset.name,
    player: master?.name ? `Familier de ${master.name}` : 'Familier (Disponible)',
    race: 'humain',
    profil: preset.profilSuggested,
    level: preset.level,
    base: { ...preset.base },
    rb: {},
    hpBase: preset.hp,
    hpMaxAuto: preset.hp,
    hpMaxManual: preset.hp,
    hp: preset.hp,
    pmMaxManual: preset.pmMax,
    pm: preset.pmMax,
    ptsCap: 0,
    ptsCapCadeaux: 0,
    bourse: { po: 0, pa: 0, pc: 0 },
    caps: [],
    armes: preset.armes.map((w) => ({ ...w })),
    inventaire: (preset.inventaire || []).map((it) => ({ ...it })),
    customSorts: [],
    arm: '',
    bou: '',
    bonus: { pv: 0, def: 0, init: 0 },
    persoTraits: preset.persoTraits,
    age: preset.age,
    taille: preset.taille,
    poids: preset.poids,
    etats: [],
    isPnj: true,
    rolePnj: 'Familier',
    isFamilier: true,
    familierEspece: preset.espece,
    familierCategorie: preset.categorie,
    defManual: preset.def,
    vitesse: preset.vitesse,
    capacitesSpeciales: preset.capacitesSpeciales.map((c) => ({ ...c })),
    ...(master?.id ? { masterId: master.id } : {}),
    ...(master?.name ? { masterName: master.name } : {}),
    portrait,
  };
}

/**
 * Génère 3 familiers pré-remplis prêts à l'emploi lors de la première initialisation.
 */
export function buildInitialSeededFamiliers(defaultMaster?: { id?: string; name?: string } | null): Character[] {
  const corbeau = FAMILIERS_PRESETS[0]; // Huginn, Corbeau Messager
  const chat = FAMILIERS_PRESETS[2]; // Onyx, Chat Noir Arcanique
  const loup = FAMILIERS_PRESETS[3]; // Fauve, Loup Fidèle

  return [
    {
      ...createFamilierFromPreset(loup, defaultMaster || null),
      id: 'fam_seed_loup_fidele',
    },
    {
      ...createFamilierFromPreset(corbeau, null),
      id: 'fam_seed_corbeau_messager',
    },
    {
      ...createFamilierFromPreset(chat, null),
      id: 'fam_seed_chat_arcanique',
    },
  ];
}
