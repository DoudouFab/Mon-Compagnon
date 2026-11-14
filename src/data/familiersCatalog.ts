import { CaracName, Character, InventoryItem, WeaponItem } from '../types/chroniques';
import { buildFamilierPortraitDataUrl } from '../utils/fantasyPortraitGenerator';

export type FamilierCategorie =
  | 'Arcanique'
  | 'Compagnon Animal'
  | 'Compagnon Rôdeur'
  | 'Éclaireur'
  | 'Exotique'
  | 'Monture';

export type FamilierSousFamille =
  | 'Félin'
  | 'Canidé'
  | 'Rapace'
  | 'Oiseau'
  | 'Automate'
  | 'Reptile'
  | 'Féerique'
  | 'Monture'
  | 'Autre';

export interface FamilierPreset {
  id: string;
  name: string;
  espece: string;
  categorie: FamilierCategorie;
  sousFamille?: FamilierSousFamille;
  typeCompagnon?: 'Familier' | 'Compagnon';
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
  // ==================== MONTURES & COMPAGNONS NON-HUMANOÏDES ====================
  {
    id: 'comp_destrier_guerre',
    name: 'Foudre, Destrier de Guerre',
    espece: 'Cheval de Guerre Caparaçonné',
    categorie: 'Monture',
    typeCompagnon: 'Compagnon',
    profilSuggested: 'chevalier',
    level: 2,
    base: { FOR: 18, DEX: 13, CON: 16, INT: 4, SAG: 12, CHA: 11 },
    hp: 26,
    def: 15,
    pmMax: 0,
    vitesse: '28 m (Galop)',
    taille: '1,65 m au garrot',
    poids: '540 kg',
    age: '6 ans',
    armes: [
      {
        n: 'Ruade & Sabots ferrés',
        t: 'Contact',
        dm: '1d8+4',
        crit: '20',
        por: 'Contact',
        props: 'En charge montée, +1d6 DM et la cible risque d’être Renversée (test FOR Diff 13).',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Monture dressée au combat',
        t: 'Ne panique pas face aux cris, au feu ou au cliquetis d’acier ; permet au cavalier d’attaquer depuis sa selle sans malus.',
      },
      {
        n: 'Barde de cuir & Charge impétueuse',
        t: 'Capable de porter un cavalier en armure complète + 60 kg de sacoches ; +10 m de vitesse en sprint.',
      },
    ],
    inventaire: [
      { n: 'Selle de guerre, bride & sacoches doubles', q: 1, desc: 'Capacité 60 kg de paquetage' },
    ],
    persoTraits:
      'Massif, nerveux face aux inconnus mais d’une loyauté sans faille envers son cavalier.',
  },
  {
    id: 'comp_mule_bat',
    name: 'Barnabé, Mule de Bât Robuste',
    espece: 'Mule de Somme',
    categorie: 'Monture',
    typeCompagnon: 'Compagnon',
    profilSuggested: 'guerrier',
    level: 1,
    base: { FOR: 16, DEX: 10, CON: 17, INT: 4, SAG: 13, CHA: 9 },
    hp: 20,
    def: 12,
    pmMax: 0,
    vitesse: '14 m',
    taille: '1,35 m au garrot',
    poids: '360 kg',
    age: '8 ans',
    armes: [
      {
        n: 'Ruade sèche',
        t: 'Contact',
        dm: '1d6+3',
        crit: '20',
        por: 'Contact',
        props: 'Repousse l’agresseur de 2 m s’il vient par derrière.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Pied sûr en montagne',
        t: 'Ne glisse pas sur les sentiers rocailleux, les éboulis ou les pentes enneigées.',
      },
      {
        n: 'Convoi de charge (120 kg)',
        t: 'Transporte tentes, coffres, rations et butins encombrants sans ralentir le rythme de marche.',
      },
    ],
    inventaire: [
      { n: 'Bât renforcé & double panier d’osier', q: 1, desc: 'Supporte jusqu’à 120 kg de matériel' },
    ],
    persoTraits:
      'Têtue quand on la bouscule, mais infatigable et adorable pour une simple carotte.',
  },
  // ==================== COMPAGNONS RÔDEUR — VOIE DU COMPAGNON ANIMAL (FÉLINS, CANIDÉS, RAPACES) ====================
  // --- FÉLINS (RÔDEUR) ---
  {
    id: 'rod_felin_panthere',
    name: 'Ombre-Griffe, Panthère Noire',
    espece: 'Panthère (Félin)',
    categorie: 'Compagnon Rôdeur',
    sousFamille: 'Félin',
    typeCompagnon: 'Compagnon',
    profilSuggested: 'rodeur',
    level: 2,
    base: { FOR: 15, DEX: 18, CON: 13, INT: 7, SAG: 14, CHA: 11 },
    hp: 18,
    def: 16,
    pmMax: 0,
    vitesse: '22 m · Escalade 14 m',
    taille: '80 cm au garrot',
    poids: '48 kg',
    age: '4 ans',
    armes: [
      {
        n: 'Griffes & Morsure furtive',
        t: 'Contact',
        dm: '1d8+2',
        crit: '19-20',
        por: 'Contact',
        props: 'Attaque avec DEX ou FOR. +1d6 DM si la cible est Surprise ou engagée par le rôdeur (Ordres d’attaque).',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Voie du Compagnon Animal — Félin d’embuscade',
        t: 'Bonus de +5 en Discrétion dans la pénombre ou les feuillages ; coordonne ses attaques pour donner l’avantage au rôdeur.',
      },
      {
        n: 'Bond félin',
        t: 'Peut charger et frapper sans pénalité sur terrain accidenté ou depuis une branche jusqu’à 6 m.',
      },
      {
        n: 'Défense mutuelle',
        t: 'Aux côtés du rôdeur (Rang 4 Voie du compagnon), tous deux bénéficient de +2 en DEF.',
      },
    ],
    inventaire: [{ n: 'Collier de cuir tressé sylvestre', q: 1, desc: 'Marque du lien avec le rôdeur' }],
    persoTraits:
      'Silencieuse comme la nuit, souple et patiente ; traque les proies blessées sans jamais faire craquer une brindille.',
  },
  {
    id: 'rod_felin_lynx',
    name: 'Kael, Lynx Boréal',
    espece: 'Lynx (Félin)',
    categorie: 'Compagnon Rôdeur',
    sousFamille: 'Félin',
    typeCompagnon: 'Compagnon',
    profilSuggested: 'rodeur',
    level: 1,
    base: { FOR: 13, DEX: 18, CON: 12, INT: 8, SAG: 16, CHA: 11 },
    hp: 15,
    def: 16,
    pmMax: 0,
    vitesse: '20 m · Escalade 12 m',
    taille: '65 cm au garrot',
    poids: '24 kg',
    age: '3 ans',
    armes: [
      {
        n: 'Coup de pattes lacérant',
        t: 'Contact',
        dm: '1d6+2',
        crit: '19-20',
        por: 'Contact',
        props: 'Finesse (DEX). Double griffure : sur 17+, inflige Saignement (1d4 DM au tour suivant).',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Voie du Compagnon Animal — Guetteur des bois',
        t: 'Vue et ouïe perçantes (+5 Perception) ; repère les embuscades et pièges naturels à 30 m.',
      },
      {
        n: 'Pas sur la neige',
        t: 'Ignore les malus de déplacement sur neige profonde, boue ou sous-bois épais.',
      },
    ],
    inventaire: [],
    persoTraits:
      'Pinceaux de poils noirs aux oreilles, regard doré perçant ; avertit son rôdeur par un feulement sourd.',
  },
  {
    id: 'rod_felin_couguar',
    name: 'Fauve-Roux, Couguar des Cimes',
    espece: 'Couguar (Félin)',
    categorie: 'Compagnon Rôdeur',
    sousFamille: 'Félin',
    typeCompagnon: 'Compagnon',
    profilSuggested: 'rodeur',
    level: 2,
    base: { FOR: 16, DEX: 16, CON: 14, INT: 7, SAG: 14, CHA: 10 },
    hp: 20,
    def: 15,
    pmMax: 0,
    vitesse: '22 m · Saut 8 m',
    taille: '78 cm au garrot',
    poids: '58 kg',
    age: '5 ans',
    armes: [
      {
        n: 'Morsure à la nuque',
        t: 'Contact',
        dm: '1d8+3',
        crit: '20',
        por: 'Contact',
        props: 'Sur charge bondissante, la cible doit réussir un test de FOR (Diff 13) ou être Renversée.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Voie du Compagnon Animal — Prédateur alpin',
        t: 'Grimpe les parois rocheuses sans test (+6 en Athlétisme / Escalade) et encaisse sans dégâts les sauts de 8 m.',
      },
      {
        n: 'Bête féroce',
        t: 'Compatible Rang 3 : morsure puissante et ténacité face aux créatures plus grandes.',
      },
    ],
    inventaire: [],
    persoTraits:
      'Musculeux, fier et infatigable sur les crêtes rocheuses ; se couche toujours en hauteur pour surveiller le camp.',
  },
  {
    id: 'rod_felin_tigre',
    name: 'Rajah, Tigre des Confins',
    espece: 'Tigre (Félin)',
    categorie: 'Compagnon Rôdeur',
    sousFamille: 'Félin',
    typeCompagnon: 'Compagnon',
    profilSuggested: 'rodeur',
    level: 3,
    base: { FOR: 18, DEX: 15, CON: 16, INT: 7, SAG: 14, CHA: 12 },
    hp: 28,
    def: 15,
    pmMax: 0,
    vitesse: '20 m',
    taille: '1,05 m au garrot',
    poids: '165 kg',
    age: '6 ans',
    armes: [
      {
        n: 'Griffes & Gueule de tigre',
        t: 'Contact',
        dm: '1d8+4',
        crit: '19-20',
        por: 'Contact',
        props: 'Bête féroce : peut attaquer deux cibles adjacentes ou renverser sur 16+.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Voie du Compagnon Animal — Bête féroce',
        t: 'Compagnon aguerri (+10 PV inclus, attaques 1d8 + FOR). Protège farouchement le flanc du rôdeur.',
      },
      {
        n: 'Rugissement intimidant (1/combat)',
        t: 'Les ennemis à moins de 10 m réussissent un test de SAG (Diff 13) ou sont Secoués (-2 attaque) pendant 1 tour.',
      },
    ],
    inventaire: [{ n: 'Bandeau de cuir gravé', q: 1, desc: 'Trophée de meute' }],
    persoTraits:
      'Majestueux et redoutable ; d’une douceur surprenante avec son maître rôdeur, impitoyable face aux prédateurs.',
  },
  // --- CANIDÉS (RÔDEUR) ---
  {
    id: 'rod_canide_loup_steppes',
    name: 'Croc-Gris, Loup des Steppes',
    espece: 'Loup des Steppes (Canidé)',
    categorie: 'Compagnon Rôdeur',
    sousFamille: 'Canidé',
    typeCompagnon: 'Compagnon',
    profilSuggested: 'rodeur',
    level: 1,
    base: { FOR: 15, DEX: 15, CON: 14, INT: 8, SAG: 15, CHA: 10 },
    hp: 17,
    def: 14,
    pmMax: 0,
    vitesse: '22 m',
    taille: '85 cm au garrot',
    poids: '42 kg',
    age: '4 ans',
    armes: [
      {
        n: 'Morsure de meute',
        t: 'Contact',
        dm: '1d6+2',
        crit: '20',
        por: 'Contact',
        props: 'Renversement (test FOR/DEX Diff 12) si l’ennemi est déjà engagé par le rôdeur.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Voie du Compagnon Animal — Ordres d’attaque',
        t: 'Lorsque le loup attaque au contact d’un ennemi, il harcèle ses appuis et confère l’avantage à la prochaine attaque du rôdeur.',
      },
      {
        n: 'Endurance de steppe',
        t: 'Peut courir à vive allure toute une journée sans fatigue ; +5 en Pistage olfactif.',
      },
    ],
    inventaire: [{ n: 'Harnais de pisteur léger', q: 1, desc: 'Avec deux petites poches latérales' }],
    persoTraits:
      'Sûr, endurant et complice ; comprend d’un simple geste de la main quand encercler une cible.',
  },
  {
    id: 'rod_canide_loup_blanc',
    name: 'Givre, Loup Blanc Boréal',
    espece: 'Loup Blanc (Canidé)',
    categorie: 'Compagnon Rôdeur',
    sousFamille: 'Canidé',
    typeCompagnon: 'Compagnon',
    profilSuggested: 'rodeur',
    level: 2,
    base: { FOR: 16, DEX: 15, CON: 16, INT: 8, SAG: 15, CHA: 11 },
    hp: 22,
    def: 15,
    pmMax: 0,
    vitesse: '20 m',
    taille: '95 cm au garrot',
    poids: '54 kg',
    age: '5 ans',
    armes: [
      {
        n: 'Morsure glaciale',
        t: 'Contact',
        dm: '1d8+3',
        crit: '20',
        por: 'Contact',
        props: 'Puissante morsure ; immobilise la proie sur critique (test FOR Diff 13).',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Voie du Compagnon Animal — Pelage boréal',
        t: 'Résistance au froid (réduit les dégâts de froid de 5) et +4 en Discrétion en terrain enneigé.',
      },
      {
        n: 'Hurlement de ralliement (1/combat)',
        t: 'Redonne courage aux alliés à 15 m (+1 attaque pendant 2 tours) et révèle sa position au rôdeur à 2 km.',
      },
    ],
    inventaire: [],
    persoTraits:
      'Fourrure immaculée et yeux bleu glacier ; reste imperturbable dans les pires tempêtes de neige.',
  },
  {
    id: 'rod_canide_renard',
    name: 'Flèche-Rousse, Renard des Bois',
    espece: 'Renard Sauvage (Canidé)',
    categorie: 'Compagnon Rôdeur',
    sousFamille: 'Canidé',
    typeCompagnon: 'Compagnon',
    profilSuggested: 'rodeur',
    level: 1,
    base: { FOR: 9, DEX: 18, CON: 12, INT: 11, SAG: 15, CHA: 14 },
    hp: 12,
    def: 16,
    pmMax: 0,
    vitesse: '20 m',
    taille: '42 cm au garrot',
    poids: '8 kg',
    age: '3 ans',
    armes: [
      {
        n: 'Morsure vive & Feinte',
        t: 'Contact',
        dm: '1d4+2',
        crit: '19-20',
        por: 'Contact',
        props: 'Attaque avec DEX. Après l’attaque, se désengage sans provoquer d’attaque d’opportunité.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Voie du Compagnon Animal — Éclaireur rusé',
        t: '+5 en Discrétion et Perception ; détecte les pièges de chasse et filets avant le groupe.',
      },
      {
        n: 'Diversion agile',
        t: 'Peut attirer l’attention d’un garde ou détourner une cible (+2 à l’attaque à distance du rôdeur).',
      },
    ],
    inventaire: [],
    persoTraits:
      'Malicieux, rapide et curieux ; déniche toujours les passages cachés et les terriers.',
  },
  {
    id: 'rod_canide_chien_loup',
    name: 'Limier, Chien-Loup Traqueur',
    espece: 'Chien-Loup (Canidé)',
    categorie: 'Compagnon Rôdeur',
    sousFamille: 'Canidé',
    typeCompagnon: 'Compagnon',
    profilSuggested: 'rodeur',
    level: 2,
    base: { FOR: 16, DEX: 14, CON: 15, INT: 8, SAG: 16, CHA: 10 },
    hp: 21,
    def: 15,
    pmMax: 0,
    vitesse: '18 m',
    taille: '82 cm au garrot',
    poids: '44 kg',
    age: '5 ans',
    armes: [
      {
        n: 'Mâchoire tenace',
        t: 'Contact',
        dm: '1d8+3',
        crit: '20',
        por: 'Contact',
        props: 'Ne lâche pas sa prise : +2 pour maintenir ou faire chuter une proie en fuite.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Voie du Compagnon Animal — Pisteur infaillible',
        t: 'Suit une piste vieille de 48h même sous la pluie (+6 en Pistage / Perception).',
      },
      {
        n: 'Âme animale partagée (Garde)',
        t: 'S’interpose devant le rôdeur en mêlée (+2 DEF mutuelle quand côte à côte).',
      },
    ],
    inventaire: [{ n: 'Collier de cuir renforcé', q: 1 }],
    persoTraits:
      'Tenace, discipliné et d’une fidélité absolue ; ne recule jamais quand son maître est blessé.',
  },
  // --- RAPACES (RÔDEUR) ---
  {
    id: 'rod_rapace_aigle',
    name: 'Foudre-du-Ciel, Aigle Royal',
    espece: 'Aigle Royal (Rapace)',
    categorie: 'Compagnon Rôdeur',
    sousFamille: 'Rapace',
    typeCompagnon: 'Compagnon',
    profilSuggested: 'rodeur',
    level: 2,
    base: { FOR: 12, DEX: 18, CON: 13, INT: 9, SAG: 17, CHA: 12 },
    hp: 16,
    def: 16,
    pmMax: 0,
    vitesse: 'Vol 28 m',
    taille: '90 cm (envergure 2,20 m)',
    poids: '6,5 kg',
    age: '6 ans',
    armes: [
      {
        n: 'Serres d’aigle en piqué',
        t: 'Contact',
        dm: '1d8+2',
        crit: '19-20',
        por: 'Contact',
        props: 'Attaque avec DEX. +1d4 DM sur plongeon de 10 m+ ; peut lacérer le visage (aveuglé 1 tour sur critique).',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Voie du Compagnon Animal — Maître des cieux',
        t: 'Voit nettement jusqu’à 3 km par temps clair (+6 Perception). Guide le rôdeur depuis les airs et partage ses sens au Rang 5.',
      },
      {
        n: 'Frappe & Remontée',
        t: 'Ne subit pas d’attaque d’opportunité lorsqu’il fond sur une cible puis reprend de l’altitude.',
      },
    ],
    inventaire: [{ n: 'Gant de fauconnerie renforcé & grelot d’argent', q: 1 }],
    persoTraits:
      'Souverain des cimes, cri strident qui glace les éclaireurs ennemis ; obéit au moindre sifflement.',
  },
  {
    id: 'rod_rapace_autour',
    name: "Plume-d'Acier, Autour des Palombes",
    espece: 'Autour des Palombes (Rapace)',
    categorie: 'Compagnon Rôdeur',
    sousFamille: 'Rapace',
    typeCompagnon: 'Compagnon',
    profilSuggested: 'rodeur',
    level: 1,
    base: { FOR: 9, DEX: 19, CON: 11, INT: 9, SAG: 16, CHA: 11 },
    hp: 12,
    def: 17,
    pmMax: 0,
    vitesse: 'Vol 24 m (Agilité forestière)',
    taille: '58 cm (envergure 1,20 m)',
    poids: '1,5 kg',
    age: '4 ans',
    armes: [
      {
        n: 'Serres rasantes',
        t: 'Contact',
        dm: '1d6+2',
        crit: '19-20',
        por: 'Contact',
        props: 'Attaque avec DEX. Idéal pour harceler les archers ou lanceurs de sorts adverses.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Voie du Compagnon Animal — Chasseur de sous-bois',
        t: 'Vole à pleine vitesse entre les troncs d’arbres serrés sans pénalité ; +4 en Esquive contre les projectiles.',
      },
      {
        n: 'Marquage de proie (Ordres d’attaque)',
        t: 'Désigne une cible cachée ou à couvert : les tirs du rôdeur ignorent le couvert partiel ce tour-ci.',
      },
    ],
    inventaire: [{ n: 'Chaperon de cuir brun', q: 1 }],
    persoTraits:
      'Nerveux, précis et redoutablement efficace en forêt dense là où les grands aigles peinent à manœuvrer.',
  },
  {
    id: 'rod_rapace_gerfaut',
    name: 'Serre-Noire, Gerfaut des Falaises',
    espece: 'Gerfaut (Rapace)',
    categorie: 'Compagnon Rôdeur',
    sousFamille: 'Rapace',
    typeCompagnon: 'Compagnon',
    profilSuggested: 'rodeur',
    level: 2,
    base: { FOR: 10, DEX: 19, CON: 12, INT: 9, SAG: 16, CHA: 12 },
    hp: 14,
    def: 17,
    pmMax: 0,
    vitesse: 'Vol 30 m (Piqué foudroyant)',
    taille: '62 cm (envergure 1,35 m)',
    poids: '1,9 kg',
    age: '4 ans',
    armes: [
      {
        n: 'Coup de bec & Serres fulgurantes',
        t: 'Contact',
        dm: '1d6+3',
        crit: '18-20',
        por: 'Contact',
        props: 'Attaque avec DEX. Critique amélioré sur attaque en piqué.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Voie du Compagnon Animal — Éclair du ciel',
        t: 'Initiative +4 ; fond sur un ennemi isolé dès le 1er tour pour le déstabiliser (-2 DEF contre le prochain tir du rôdeur).',
      },
      {
        n: 'Messager longue distance',
        t: 'Capable de couvrir 80 km en une journée entre deux points connus.',
      },
    ],
    inventaire: [{ n: 'Anneau de messagerie en cuir', q: 1 }],
    persoTraits:
      'Plumage ardoise moucheté, regard glacial ; ne manque jamais une cible à découvert.',
  },
  {
    id: 'rod_rapace_grand_duc',
    name: 'Nuit-Blanche, Grand-Duc Chasseur',
    espece: 'Hibou Grand-Duc (Rapace)',
    categorie: 'Compagnon Rôdeur',
    sousFamille: 'Rapace',
    typeCompagnon: 'Compagnon',
    profilSuggested: 'rodeur',
    level: 2,
    base: { FOR: 11, DEX: 17, CON: 13, INT: 10, SAG: 17, CHA: 11 },
    hp: 15,
    def: 16,
    pmMax: 0,
    vitesse: 'Vol 22 m (Silencieux)',
    taille: '70 cm (envergure 1,75 m)',
    poids: '3,2 kg',
    age: '7 ans',
    armes: [
      {
        n: 'Serres nocturnes silencieuses',
        t: 'Contact',
        dm: '1d6+2',
        crit: '19-20',
        por: 'Contact',
        props: 'Attaque avec DEX. Sur cible Surprise, ajoute +1d6 DM.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Voie du Compagnon Animal — Prédateur nocturne',
        t: 'Vol 100% silencieux (+6 Discrétion nocturne) et vision dans le noir à 40 m.',
      },
      {
        n: 'Sentinelle de bivouac',
        t: 'Empêche toute embuscade nocturne dans un rayon de 50 m autour du campement.',
      },
    ],
    inventaire: [],
    persoTraits:
      'Grandes aigrettes dressées et yeux orange perçants ; chasse la nuit pendant que la troupe récupère.',
  },
  // ==================== FAMILIERS & COMPAGNONS SUPPLÉMENTAIRES ====================
  {
    id: 'fam_chouette_mecanique',
    name: 'Tic-Tac, Chouette Mécanique',
    espece: 'Chouette Mécanique (Automate)',
    categorie: 'Arcanique',
    sousFamille: 'Automate',
    typeCompagnon: 'Familier',
    profilSuggested: 'forgesort',
    level: 1,
    base: { FOR: 6, DEX: 16, CON: 14, INT: 12, SAG: 14, CHA: 8 },
    hp: 12,
    def: 16,
    pmMax: 2,
    vitesse: 'Vol 16 m',
    taille: '38 cm',
    poids: '2,8 kg',
    age: 'Assemblé (Automate)',
    armes: [
      {
        n: 'Serres de laiton & Bec d’acier',
        t: 'Contact',
        dm: '1d4+1',
        crit: '20',
        por: 'Contact',
        props: 'Attaque avec DEX.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Voie des Automates — Familier mécanique',
        t: 'Immunisé au poison, à la maladie, au sommeil et aux illusions mentales. Réparable avec des outils de mécanicien.',
      },
      {
        n: 'Lentille optique & Enregistreur',
        t: 'Mémorise et rejoue fidèlement 1 minute de conversation entendue ; vision nocturne 20 m.',
      },
    ],
    inventaire: [{ n: 'Fiole d’huile fine & clé de remontage', q: 1 }],
    persoTraits:
      'Ses yeux de rubis cliquettent doucement lorsqu’elle pivote la tête ; adore se percher sur l’établi du forgesort.',
  },
  {
    id: 'fam_scarabee_airain',
    name: 'Airain, Scarabée Runique',
    espece: 'Scarabée Mécanique (Automate)',
    categorie: 'Éclaireur',
    sousFamille: 'Automate',
    typeCompagnon: 'Familier',
    profilSuggested: 'forgesort',
    level: 1,
    base: { FOR: 4, DEX: 17, CON: 15, INT: 11, SAG: 13, CHA: 6 },
    hp: 10,
    def: 17,
    pmMax: 0,
    vitesse: '10 m · Escalade 10 m · Vol court 6 m',
    taille: '14 cm',
    poids: '0,6 kg',
    age: 'Assemblé (Automate)',
    armes: [
      {
        n: 'Mandibules coupantes',
        t: 'Contact',
        dm: '1d3',
        crit: '20',
        por: 'Contact',
        props: 'Peut sectionner une cordelette ou un fil de piège.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Espion minuscule & Crochetage',
        t: 'Se faufile sous les portes (+7 Discrétion) et offre +2 aux tests de crochetage/mécanismes à distance.',
      },
      {
        n: 'Carapace d’airain',
        t: 'Immunisé aux poisons, gaz et saignements ; RD 2 contre les dégâts non magiques.',
      },
    ],
    inventaire: [],
    persoTraits:
      'Silencieux malgré ses minuscules engrenages ; se replie en sphère dorée dans la paume de son créateur.',
  },
  {
    id: 'fam_salamandre_foyer',
    name: 'Braises, Salamandre de Foyer',
    espece: 'Salamandre Élémentaire',
    categorie: 'Arcanique',
    sousFamille: 'Reptile',
    typeCompagnon: 'Familier',
    profilSuggested: 'magicien',
    level: 1,
    base: { FOR: 6, DEX: 15, CON: 13, INT: 10, SAG: 12, CHA: 13 },
    hp: 11,
    def: 14,
    pmMax: 4,
    vitesse: '12 m · Escalade 8 m',
    taille: '45 cm (queue comprise)',
    poids: '1,4 kg',
    age: '12 ans',
    armes: [
      {
        n: 'Crachat d’étincelle',
        t: 'Distance',
        dm: '1d4+1 feu',
        crit: '20',
        por: '8 m',
        props: 'Dégâts de feu. Allume instantanément torches, mèches ou feux de camp.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Corps incandescent',
        t: 'Immunisée au feu ordinaire ; éclaire comme une bougie (3 m) ou une torche (10 m) sur commande.',
      },
      {
        n: 'Affinité pyromantique (2 PM)',
        t: 'Ajoute +2 aux dégâts d’un sort de feu lancé par son maître à moins de 10 m (1/combat).',
      },
    ],
    inventaire: [],
    persoTraits:
      'Frétillante et chaleureuse ; adore dormir roulée en boule dans les cendres tièdes ou sur l’épaule.',
  },
  {
    id: 'fam_cameleon_sylvestre',
    name: 'Mousse-Œil, Caméléon Sylvestre',
    espece: 'Caméléon Géant (Reptile)',
    categorie: 'Éclaireur',
    sousFamille: 'Reptile',
    typeCompagnon: 'Familier',
    profilSuggested: 'druide',
    level: 1,
    base: { FOR: 6, DEX: 17, CON: 12, INT: 9, SAG: 15, CHA: 10 },
    hp: 9,
    def: 16,
    pmMax: 2,
    vitesse: '10 m · Escalade 12 m',
    taille: '40 cm',
    poids: '1,1 kg',
    age: '4 ans',
    armes: [
      {
        n: 'Langue fouettante',
        t: 'Distance',
        dm: '1d3',
        crit: '20',
        por: '4 m',
        props: 'Peut attraper un petit objet (clé, dague, parchemin) à 4 m.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Camouflage mimétique parfait',
        t: 'Immobile, devient presque invisible (+8 en Discrétion) et change de couleur en 1 action.',
      },
      {
        n: 'Vision panoramique à 360°',
        t: 'Impossible à prendre par surprise ; avertit son maître de tout mouvement derrière lui.',
      },
    ],
    inventaire: [],
    persoTraits:
      'Bouge au ralenti avec une patience infinie ; ses deux yeux tournent indépendamment pour guetter le danger.',
  },
  {
    id: 'fam_noctule_chauve_souris',
    name: 'Noctule, Chauve-Souris des Cryptes',
    espece: 'Chauve-Souris Géante',
    categorie: 'Exotique',
    sousFamille: 'Oiseau',
    typeCompagnon: 'Familier',
    profilSuggested: 'necromancien',
    level: 1,
    base: { FOR: 6, DEX: 18, CON: 11, INT: 10, SAG: 14, CHA: 9 },
    hp: 10,
    def: 16,
    pmMax: 2,
    vitesse: 'Vol 18 m',
    taille: '55 cm d’envergure',
    poids: '0,9 kg',
    age: '5 ans',
    armes: [
      {
        n: 'Morsure drainante',
        t: 'Contact',
        dm: '1d4',
        crit: '19-20',
        por: 'Contact',
        props: 'Attaque avec DEX. Rend 1 PV à la chauve-souris si la cible est vivante.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Écholocalisation souterraine (Sonar 25 m)',
        t: 'Perçoit parfaitement les silhouettes, créatures invisibles et sorties cachées dans le noir absolu.',
      },
      {
        n: 'Vol muet de caverne',
        t: '+5 en Discrétion dans les souterrains et ruines nocturnes.',
      },
    ],
    inventaire: [],
    persoTraits:
      'S’accroche la tête en bas sous la cape de son maître pendant la journée ; pousse de légers clics aigus dans les tunnels.',
  },
  {
    id: 'fam_diablotin_encre',
    name: 'Cendre-Plume, Diablotin d’Encre',
    espece: 'Diablotin Érudit',
    categorie: 'Exotique',
    sousFamille: 'Féerique',
    typeCompagnon: 'Familier',
    profilSuggested: 'ensorceleur',
    level: 2,
    base: { FOR: 7, DEX: 17, CON: 12, INT: 15, SAG: 12, CHA: 15 },
    hp: 14,
    def: 16,
    pmMax: 5,
    vitesse: 'Vol 14 m · Sol 8 m',
    taille: '45 cm',
    poids: '3,2 kg',
    age: 'Inconnu',
    armes: [
      {
        n: 'Dard d’encre venimeux',
        t: 'Contact',
        dm: '1d4+1',
        crit: '20',
        por: 'Contact',
        props: 'Ajoute 1d4 DM de poison (test CON Diff 12 pour annuler).',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Scribe & Lecteur de langues',
        t: 'Sait lire le commun et déchiffrer les glyphes mineurs ; peut copier un parchemin sous la dictée.',
      },
      {
        n: 'Invisibilité mineure (2 PM)',
        t: 'Devient invisible pendant 3 tours ou jusqu’à sa prochaine attaque.',
      },
    ],
    inventaire: [{ n: 'Plume en os & encrier miniature', q: 1 }],
    persoTraits:
      'Sarcastique, tatillon sur les contrats et fasciné par les bibliothèques interdites ; a les doigts perpétuellement tachés d’encre.',
  },
  {
    id: 'fam_hermine_neiges',
    name: 'Neige, Hermine des Cimes',
    espece: 'Hermine',
    categorie: 'Éclaireur',
    sousFamille: 'Autre',
    typeCompagnon: 'Familier',
    profilSuggested: 'voleur',
    level: 1,
    base: { FOR: 5, DEX: 19, CON: 11, INT: 10, SAG: 14, CHA: 14 },
    hp: 8,
    def: 17,
    pmMax: 0,
    vitesse: '15 m',
    taille: '32 cm',
    poids: '0,4 kg',
    age: '2 ans',
    armes: [
      {
        n: 'Morsure vive',
        t: 'Contact',
        dm: '1d3+1',
        crit: '19-20',
        por: 'Contact',
        props: 'Attaque avec DEX. Peut distraire un garde.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Faufilement silencieux',
        t: '+6 en Discrétion ; ne laisse aucune trace perceptible sur la neige ou la boue.',
      },
      {
        n: 'Vigilance glacée',
        t: 'Alerte le maître dès qu’un être vivant approche à moins de 15 m.',
      },
    ],
    inventaire: [],
    persoTraits:
      'D’un blanc immaculé avec le bout de la queue noir ; vif-argent impossible à attraper.',
  },
  {
    id: 'fam_rat_bibliothecaire',
    name: 'Grimoire, Rat Albinos Éveillé',
    espece: 'Rat Éveillé',
    categorie: 'Arcanique',
    sousFamille: 'Autre',
    typeCompagnon: 'Familier',
    profilSuggested: 'magicien',
    level: 1,
    base: { FOR: 4, DEX: 16, CON: 11, INT: 14, SAG: 14, CHA: 10 },
    hp: 7,
    def: 15,
    pmMax: 2,
    vitesse: '12 m · Escalade 10 m · Nage 8 m',
    taille: '28 cm',
    poids: '0,5 kg',
    age: '3 ans',
    armes: [
      {
        n: 'Incisives acérées',
        t: 'Contact',
        dm: '1d3',
        crit: '20',
        por: 'Contact',
        props: 'Peut ronger rapidement cuir fin, corde ou cire de sceau.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Flair des encres & poisons',
        t: 'Repère les parchemins cachés, doubles-fonds de coffres et poisons dans la nourriture (+5 Perception).',
      },
      {
        n: 'Messager des égouts',
        t: 'Retrouve toujours son chemin en milieu urbain ou souterrain.',
      },
    ],
    inventaire: [{ n: 'Micro-lunettes en fil de laiton (décoratives)', q: 1 }],
    persoTraits:
      'Curieux, méthodique et friand de vieux parchemins moisis autant que de fromage affiné.',
  },
  {
    id: 'comp_sanglier_combat',
    name: 'Sanglier-Roc, Sanglier de Combat',
    espece: 'Sanglier Sauvage',
    categorie: 'Compagnon Animal',
    sousFamille: 'Autre',
    typeCompagnon: 'Compagnon',
    profilSuggested: 'druide',
    level: 2,
    base: { FOR: 17, DEX: 10, CON: 17, INT: 5, SAG: 12, CHA: 7 },
    hp: 24,
    def: 14,
    pmMax: 0,
    vitesse: '16 m',
    taille: '90 cm au garrot',
    poids: '140 kg',
    age: '5 ans',
    armes: [
      {
        n: 'Défenses tranchantes',
        t: 'Contact',
        dm: '1d8+3',
        crit: '20',
        por: 'Contact',
        props: 'En charge (5 m+), ajoute +1d6 DM et tente de Renverser (test FOR Diff 13).',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Ténacité implacable (1/combat)',
        t: 'Si une attaque devait le réduire à 0 PV, il tombe à 1 PV à la place et continue de charger.',
      },
      {
        n: 'Cuir épais',
        t: 'Peau dure et soies raides lui conférant DEF 14 naturelle.',
      },
    ],
    inventaire: [],
    persoTraits:
      'Bourru, obstiné et brave devant les pires monstres ; déterre volontiers truffes et racines pour son maître.',
  },
  {
    id: 'comp_poney_nain',
    name: 'Bourrasque, Poney de Guerre Nain',
    espece: 'Poney Robuste des Montagnes',
    categorie: 'Monture',
    sousFamille: 'Monture',
    typeCompagnon: 'Compagnon',
    profilSuggested: 'guerrier',
    level: 1,
    base: { FOR: 16, DEX: 12, CON: 17, INT: 5, SAG: 13, CHA: 10 },
    hp: 22,
    def: 14,
    pmMax: 0,
    vitesse: '20 m',
    taille: '1,25 m au garrot',
    poids: '320 kg',
    age: '7 ans',
    armes: [
      {
        n: 'Coup de sabot ferré',
        t: 'Contact',
        dm: '1d6+3',
        crit: '20',
        por: 'Contact',
        props: 'Repousse ou sonne un adversaire au contact.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Habitué aux galeries & cols',
        t: 'Ne craint ni les tunnels étroits ni les torches ; circule sans malus sur pentes rocheuses.',
      },
      {
        n: 'Endurance de fer',
        t: 'Peut porter un Nain ou Halfelin en armure lourde plus 50 kg d’équipement sans ralentir.',
      },
    ],
    inventaire: [{ n: 'Selle de montagne naine & sacoches', q: 1 }],
    persoTraits:
      'Trapu, poil épais et caractère bien trempé ; n’obéit qu’à son cavalier et aux poignées d’avoine.',
  },
  // ==================== MONTURES CLASSIQUES, D'ATTELAGE & EXOTIQUES DE COMBAT ====================
  {
    id: 'mont_cheval_selle',
    name: 'Éclair, Cheval de Selle Classique',
    espece: 'Cheval de Selle',
    categorie: 'Monture',
    sousFamille: 'Monture',
    typeCompagnon: 'Compagnon',
    profilSuggested: 'rodeur',
    level: 1,
    base: { FOR: 16, DEX: 13, CON: 15, INT: 4, SAG: 12, CHA: 11 },
    hp: 20,
    def: 13,
    pmMax: 0,
    vitesse: '30 m (Galop rapide)',
    taille: '1,58 m au garrot',
    poids: '460 kg',
    age: '5 ans',
    armes: [
      {
        n: 'Ruade / Sabots',
        t: 'Contact',
        dm: '1d6+3',
        crit: '20',
        por: 'Contact',
        props: 'Frappe défensive si encerclé ou attaqué par derrière.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Monture de voyage endurante',
        t: 'Couvre 60 km par jour au trot sans fatigue ; porte un cavalier et 40 kg de fontes sans malus.',
      },
      {
        n: 'Docile & Sûr',
        t: 'Saute haies et fossés (3 m) sur un simple coup de talon ; +2 aux tests d’équitation.',
      },
    ],
    inventaire: [
      { n: 'Selle de voyage en cuir, mors & fontes', q: 1, desc: 'Capacité 40 kg de bagages' },
    ],
    persoTraits:
      'Robe alezane lustrée, vif mais docile ; fiable sur les longues routes comme pour fuir une embuscade.',
  },
  {
    id: 'mont_cheval_attelage',
    name: 'Goliath, Cheval d’Attelage & de Trait',
    espece: 'Cheval de Trait Lourd',
    categorie: 'Monture',
    sousFamille: 'Monture',
    typeCompagnon: 'Compagnon',
    profilSuggested: 'guerrier',
    level: 1,
    base: { FOR: 20, DEX: 9, CON: 18, INT: 4, SAG: 12, CHA: 9 },
    hp: 26,
    def: 12,
    pmMax: 0,
    vitesse: '18 m (Traction lourde)',
    taille: '1,76 m au garrot',
    poids: '860 kg',
    age: '7 ans',
    armes: [
      {
        n: 'Coup de sabot massif',
        t: 'Contact',
        dm: '1d8+5',
        crit: '20',
        por: 'Contact',
        props: 'Repousse la cible de 2 m (test FOR Diff 14 pour résister).',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Force d’attelage (400 kg+)',
        t: 'Conçu pour tirer chariots, charrettes, pièces d’artillerie ou troncs abattus ; ne fatigue jamais à allure modérée.',
      },
      {
        n: 'Tempérament placide',
        t: 'Ne s’emballe pas facilement face aux bruits de forge, foules ou orages.',
      },
    ],
    inventaire: [
      { n: 'Collier d’attelage en cuir rembourré & traits de fer', q: 1, desc: 'Harnais complet de chariot' },
    ],
    persoTraits:
      'Colosse paisible aux sabots larges comme des assiettes ; adore qu’on lui brosse la crinière après l’étape.',
  },
  {
    id: 'mont_coursier_plaines',
    name: 'Zéphyr, Coursier des Plaines',
    espece: 'Coursier Léger Elfique',
    categorie: 'Monture',
    sousFamille: 'Monture',
    typeCompagnon: 'Compagnon',
    profilSuggested: 'rodeur',
    level: 2,
    base: { FOR: 15, DEX: 16, CON: 15, INT: 5, SAG: 14, CHA: 13 },
    hp: 22,
    def: 15,
    pmMax: 0,
    vitesse: '34 m (Sprint éclair)',
    taille: '1,60 m au garrot',
    poids: '420 kg',
    age: '6 ans',
    armes: [
      {
        n: 'Sabots vifs',
        t: 'Contact',
        dm: '1d6+2',
        crit: '20',
        por: 'Contact',
        props: 'Peut frapper puis s’éloigner sans perdre son élan.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Foulée silencieuse',
        t: '+4 en Discrétion sur herbe ou terre battue ; permet au cavalier de tirer à l’arc au galop sans malus.',
      },
      {
        n: 'Réflexes d’esquive',
        t: '+2 en DEF contre les projectiles en plein galop.',
      },
    ],
    inventaire: [{ n: 'Selle légère elfique & bride tressée', q: 1 }],
    persoTraits:
      'Fin, nerveux et incroyablement rapide ; répond à la pression des genoux sans même toucher les rênes.',
  },
  {
    id: 'mont_poney_voyage',
    name: 'Châtaigne, Poney de Selle Rustique',
    espece: 'Poney de Voyage',
    categorie: 'Monture',
    sousFamille: 'Monture',
    typeCompagnon: 'Compagnon',
    profilSuggested: 'voleur',
    level: 1,
    base: { FOR: 13, DEX: 12, CON: 15, INT: 5, SAG: 13, CHA: 12 },
    hp: 16,
    def: 13,
    pmMax: 0,
    vitesse: '18 m',
    taille: '1,18 m au garrot',
    poids: '240 kg',
    age: '5 ans',
    armes: [
      {
        n: 'Petite ruade',
        t: 'Contact',
        dm: '1d4+1',
        crit: '20',
        por: 'Contact',
        props: 'Gêne l’attaquant.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Monture pour Petite Taille & Sentiers',
        t: 'Idéal pour Halfelins, Gnomes ou éclaireurs légers ; passe aisément sous les branches basses et dans les ruelles.',
      },
      {
        n: 'Sobriété rustique',
        t: 'Se contente d’herbe sèche ou de broussailles ; porte jusqu’à 75 kg (cavalier + fontes).',
      },
    ],
    inventaire: [{ n: 'Petite selle confortable & double sacoche', q: 1 }],
    persoTraits:
      'Doux, curieux et glouton ; fouille systématiquement les poches de son maître pour trouver une pomme.',
  },
  {
    id: 'mont_sanglier_selle',
    name: 'Brise-Souche, Sanglier Monture',
    espece: 'Sanglier Géant de Selle',
    categorie: 'Monture',
    sousFamille: 'Monture',
    typeCompagnon: 'Compagnon',
    profilSuggested: 'rodeur',
    level: 2,
    base: { FOR: 18, DEX: 11, CON: 18, INT: 5, SAG: 12, CHA: 8 },
    hp: 28,
    def: 15,
    pmMax: 0,
    vitesse: '20 m (Charge forestière)',
    taille: '1,25 m au garrot',
    poids: '280 kg',
    age: '6 ans',
    armes: [
      {
        n: 'Boutoir & Défenses d’ivoire',
        t: 'Contact',
        dm: '1d8+4',
        crit: '19-20',
        por: 'Contact',
        props: 'Charge montée (6 m+) : +1d6 DM et la cible est Renversée (test FOR Diff 14).',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Monture tout-terrain des sous-bois',
        t: 'Fonce à travers ronces, taillis épais et pentes boueuses sans aucun ralentissement ; équipé d’une selle basse à arçon renforcé.',
      },
      {
        n: 'Ténacité de sanglier (1/combat)',
        t: 'S’il tombe à 0 PV sous le coup d’une attaque, reste debout à 1 PV pour protéger son cavalier.',
      },
    ],
    inventaire: [
      { n: 'Selle basse à sangles doubles & protège-flancs en cuir bouilli', q: 1 },
    ],
    persoTraits:
      'Hargneux envers les étrangers mais d’une loyauté féroce envers son cavalier ; broie les ronces et charge sans hésiter.',
  },
  {
    id: 'mont_loup_geant',
    name: 'Fenris, Loup Géant Monture',
    espece: 'Loup Géant (Worg / Monture)',
    categorie: 'Monture',
    sousFamille: 'Monture',
    typeCompagnon: 'Compagnon',
    profilSuggested: 'rodeur',
    level: 3,
    base: { FOR: 18, DEX: 16, CON: 16, INT: 8, SAG: 15, CHA: 11 },
    hp: 30,
    def: 15,
    pmMax: 0,
    vitesse: '26 m (Course sauvage)',
    taille: '1,35 m au garrot',
    poids: '190 kg',
    age: '5 ans',
    armes: [
      {
        n: 'Gueule broyeuse',
        t: 'Contact',
        dm: '1d10+4',
        crit: '19-20',
        por: 'Contact',
        props: 'Renversement automatique sur 15+ ou test FOR (Diff 14) ; peut attaquer en coordination avec son cavalier.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Monture prédatrice agile',
        t: 'Porte un cavalier (Nain, Elfe, Halfelin ou Humain léger) à vive allure en forêt ou montagne ; bondit jusqu’à 5 m par-dessus les obstacles.',
      },
      {
        n: 'Tactique de meute & Pistage',
        t: 'Confère +2 à l’attaque du cavalier contre une cible déjà mordue ; flair infaillible à 30 m.',
      },
    ],
    inventaire: [
      { n: 'Harnais-selle de loup en cuir sombre & sangles d’épaule', q: 1 },
    ],
    persoTraits:
      'Pelage gris-fer hérissé et regard d’ambre ; intimide les chevaux ordinaires et file comme une ombre entre les pins.',
  },
  {
    id: 'mont_rhinoceros_guerre',
    name: "Corne-d'Airain, Rhinocéros de Guerre",
    espece: 'Rhinocéros Blindé (Monture & Combat)',
    categorie: 'Monture',
    sousFamille: 'Monture',
    typeCompagnon: 'Compagnon',
    profilSuggested: 'guerrier',
    level: 4,
    base: { FOR: 22, DEX: 9, CON: 20, INT: 4, SAG: 12, CHA: 8 },
    hp: 45,
    def: 17,
    pmMax: 0,
    vitesse: '18 m (Charge dévastatrice)',
    taille: '1,95 m au garrot',
    poids: '1 800 kg',
    age: '11 ans',
    armes: [
      {
        n: 'Charge de corne blindée',
        t: 'Contact',
        dm: '2d8+6',
        crit: '19-20',
        por: 'Contact',
        props: 'En charge (8 m+), ajoute +2d6 DM, projette la cible à 4 m (À terre, FOR Diff 16) et brise palissades ou portes.',
      },
      {
        n: 'Piétinement écrasant',
        t: 'Contact',
        dm: '2d6+6',
        crit: '20',
        por: 'Contact',
        props: 'Sur une cible déjà À terre.',
      },
    ],
    capacitesSpeciales: [
      {
        n: 'Cuirasse naturelle & RD 3',
        t: 'Peau épaisse de 4 cm renforcée par un chanfrein d’acier : DEF 17 et réduit tous les dégâts physiques non magiques de 3.',
      },
      {
        n: 'Monture lourde & Bélier vivant',
        t: 'Peut porter un ou deux cavaliers en armure complète dans une nacelle/selle haute et enfoncer les formations ennemies.',
      },
      {
        n: 'Piétinement de masse',
        t: 'Ne peut pas être renversé ou repoussé par des créatures de taille Grande ou inférieure.',
      },
    ],
    inventaire: [
      { n: 'Selle-nacelle renforcée, chanfrein de fer & plaques de flanc', q: 1, desc: 'Harnais de guerre lourd' },
    ],
    persoTraits:
      'Colosse tellurique à la vue courte mais au flair redoutable ; calme au pas, cataclysmique dès qu’il baisse la tête pour charger.',
  },
];

export function createFamilierFromPreset(
  preset: FamilierPreset,
  master?: { id?: string; name?: string } | null
): Character {
  const uniqueId = `fam_${preset.id}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const portrait = buildFamilierPortraitDataUrl(preset.espece, preset.name, 0);
  const roleLabel: 'Compagnon' | 'Familier' =
    preset.typeCompagnon ||
    (preset.categorie === 'Monture' || preset.categorie === 'Compagnon Rôdeur'
      ? 'Compagnon'
      : 'Familier');

  return {
    id: uniqueId,
    name: preset.name,
    player: master?.name ? `${roleLabel} de ${master.name}` : `${roleLabel} (Disponible)`,
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
    rolePnj: roleLabel,
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
