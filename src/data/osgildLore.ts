// Lore officiel complet des Terres d'Osgild (Chroniques Oubliées Fantasy)

export interface LoreRegion {
  name: string;
  subtitle: string;
  description: string;
  pointsClefs?: string[];
}

export interface LoreFactionCategory {
  title: string;
  color: string;
  borderColor: string;
  bgColor: string;
  factions: {
    name: string;
    type: string;
    structure: string;
    details: string;
    pointsFriction?: string;
  }[];
}

export interface LoreAcademy {
  name: string;
  nature: string;
  role: string;
}

export interface Deity {
  name: string;
  title: string;
  domains: string;
  alignment: string;
  symbol: string;
  description: string;
}

export const OSGILD_GEOGRAPHY_ASCII = `                           [ LE HAUT-NORD ]
               (Toundra, Monts du Givre, Dragons d'Argent)
                                  │
    [ LA FORÊT DES OMBRES ] ──────┼────── [ LES MONTS DU FER ]
   (Enclave elfique / Faerie)     │       (Forteresses Naines)
                                  │
                       [ LE CŒUR D'OSGILD ]
                    (Baronnies, Comtés, Fleuves)
                                  │
                   [ LA MER DU SUD & LA CÔTE ]
               (Port-Libre, cités-états, commerce)`;

export const OSGILD_REGIONS: LoreRegion[] = [
  {
    name: "Le Cœur d'Osgild (Les Baronnies de l'Ouest)",
    subtitle: "Plaines céréalières, vallées fluviales et cités fortifiées",
    description:
      "Région centrale tempérée, véritable berceau de l'humanité civilisée. Elle est couverte de plaines céréalières, de vallées fluviales navigables (comme la vallée de la Veyle) et de denses collines. C'est la zone la plus urbanisée, jalonnée de bourgs fortifiés, de châteaux baronniaux et de routes commerciales pavées.",
    pointsClefs: [
      "Vallée de la Veyle et réseaux fluviaux marchands",
      "Bourgs fortifiés et châteaux seigneuriaux indépendants",
      "Routes pavées patrouillées par les gardes baronniaux et chevaliers",
    ],
  },
  {
    name: "Les Monts du Fer & Pics Noirs",
    subtitle: "Forteresses souterraines naines (Karak) et cols stratégiques",
    description:
      "Chaîne de montagnes escarpées et enneigées bordant l'est du continent. Elle abrite les plus anciennes cités souterraines naines (Karak). Les cols sont stratégiques et constamment contestés par des tribus de géants, de trolls et de orcs des montagnes.",
    pointsClefs: [
      "Cités souterraines ancestrales (Karak) sous le Haut-Roi",
      "Mines d'acier, de mithril et de gemmes rares",
      "Cols contestés par géants, trolls et pillards orcs",
    ],
  },
  {
    name: "La Forêt des Ombres (Sylve d'Émeraude)",
    subtitle: "Enclave elfique millénaire et frontière avec la Faerie",
    description:
      "Une forêt millénaire immense située au nord-ouest, si dense que la lumière du soleil ne touche presque pas le sol par endroits. C'est le domaine réservé des Elfes. Les frontières y sont magiquement délimitées, et la limite entre le monde matériel et le Plan Féerique y est extrêmement fine.",
    pointsClefs: [
      "Sanctuaires sylvestres protégés par des barrières magiques",
      "Frontière poreuse avec le Plan Féerique",
      "Intrus et bûcherons exécutés ou égarés à jamais",
    ],
  },
  {
    name: "Le Haut-Nord et la Toundra des Glaces",
    subtitle: "Ruines d'anciens empires magiques, barbares nomades et dragons",
    description:
      "Terres froides et hostiles au-delà des montagnes du Nord. Zone de ruines oubliées d'anciens empires magiques enfouis sous la glace, peuplée de tribus nomades humaines barbares, de dragons et d'aberrations cryogéniques.",
    pointsClefs: [
      "Ruines cryogéniques et artefacts pré-cataclysmiques",
      "Clans nomades rudes et chamans du froid",
      "Territoires de chasse des dragons d'argent et bêtes boréales",
    ],
  },
  {
    name: "La Côte des Merveilles et les Cités Maritimes",
    subtitle: "Port-Libre, commerce transcontinental et puissantes oligarchies",
    description:
      "Au sud, un réseau de cités-états maritimes indépendantes fonctionnant grâce au commerce d'épices, d'esclaves (dans certaines cités franches), de minerais et d'artefacts. Dirigées par des conseils de marchands, des oligarchies financières et des guildes criminelles très structurées.",
    pointsClefs: [
      "Cité franche de Port-Libre et ses comptoirs d'épices",
      "Armées de mercenaires privées payées à prix d'or",
      "Bas-fonds criminels et guildes de voleurs influentes",
    ],
  },
];

export const OSGILD_FACTIONS_ASCII = `       ┌────────────────────────────────────────────────────────────┐
       │                   L'ÉCHIQUIER D'OSGILD                     │
       └─────────────────────────────┬──────────────────────────────┘
                                     │
      ┌──────────────────────────────┼──────────────────────────────┐
      ▼                              ▼                              ▼
[ NATIONS HUMAINES ]       [ PEUPLES ANCESTRAUX ]       [ L'OMBRE & LE CHAOS ]
• Baronnies rivales        • Enclaves Elfiques          • Cultes du Dragon
• Cités-États marchandes   • Clans Nains unifiés        • Hordes Orcs & Gobelines
• Ordres de Chevalerie     • Cercles Druidiques         • Cabales Nécromantiques`;

export const OSGILD_FACTION_GROUPS: LoreFactionCategory[] = [
  {
    title: "A. Les Puissances Humaines",
    color: "#f3d48d",
    borderColor: "#523d29",
    bgColor: "#1e1712",
    factions: [
      {
        name: "La Mosaïque Féodale (Les Baronnies)",
        type: "Féodalité morcelée",
        structure:
          "Il n'y a pas d'empereur absolu régnant sur tout Osgild. Le territoire est divisé en comtés, duchés et baronnies.",
        details:
          "Les ducs et barons se disputent les droits de péage, l'accès aux mines et la souveraineté sur les terres frontalières. Les alliances se font et se défont par mariages politiques ou escarmouches militaires.",
        pointsFriction:
          "Péages de ponts contestés, prétentions dynastiques, rivalités de suzeraineté.",
      },
      {
        name: "Les Cités-États Indépendantes (ex: Port-Libre)",
        type: "Oligarchies marchandes & Guildes",
        structure:
          "Dirigées par des conseils de marchands, des oligarchies financières ou des conseils de guildes.",
        details:
          "Elles entretiennent des armées de mercenaires et restent neutres dans les conflits nobles pour privilégier le commerce transcontinental. Elles abritent d'immenses bas-fonds criminels très structurés (Guildes de Voleurs).",
        pointsFriction:
          "Corruption portuaire, contrebande d'artefacts, embargos commerciaux.",
      },
    ],
  },
  {
    title: "B. Les Peuples Ancestraux",
    color: "#8ee0aa",
    borderColor: "#2b593f",
    bgColor: "#16201b",
    factions: [
      {
        name: "Les Royaumes Elfiques (Isolationnisme & Déclin)",
        type: "Conseil des Aînés & Gardiens Féeriques",
        structure:
          "Les Elfes pratiquent une neutralité stricte. Leurs conseils d'Aînés considèrent les guerres humaines comme des querelles éphémères.",
        details:
          "Ils n'hésitent pas à exécuter quiconque pénètre sans autorisation dans la Forêt des Ombres ou tente de défricher leurs bois sacrés.",
        pointsFriction:
          "Déforestation par les colons humains, pillage de sanctuaires féeriques ancestraux.",
      },
      {
        name: "Les Bastions Nains (Tradition & Économie)",
        type: "Conseil des Grands Clans sous le Haut-Roi",
        structure:
          "Gouvernés par le Conseil des Grands Clans sous l'égide du Haut-Roi des Monts du Fer.",
        details:
          "Très proches des Baronnies humaines sur le plan commercial (exportation d'armes, de métaux rares, de joyaux), mais intransigeants sur la protection de leurs frontières souterraines.",
        pointsFriction:
          "Incursions d'orcs dans les galeries inférieures, querelles ancestrales non soldées (Livre des Rancunes).",
      },
    ],
  },
  {
    title: "C. Les Forces Obscures & Menaces Géopolitiques",
    color: "#ff9d9d",
    borderColor: "#6b262a",
    bgColor: "#251214",
    factions: [
      {
        name: "Les Hordes Orcs et Gobelinoïdes",
        type: "Tribus nomades et armées de pillage",
        structure:
          "Poussées par des chefs de guerre ou des shamans charismatiques.",
        details:
          "Ces hordes déferlent régulièrement depuis les cols montagneux ou les terres arides du Nord, ravageant hameaux et caravanes marchandes.",
        pointsFriction:
          "Raids frontaliers, assauts de forteresses de montagne, haine viscérale des nains et des colons.",
      },
      {
        name: "Les Cabales Clandestines",
        type: "Sociétés secrètes et cercles interdits",
        structure:
          "Groupes sécessionnistes de sorciers, de nécromanciens ou d'adorateurs de démons et du Culte du Dragon.",
        details:
          "Cherchent à infiltrer la haute noblesse pour provoquer la chute des royaumes humains de l'intérieur.",
        pointsFriction:
          "Pactes démoniaques, assassinats de seigneurs justes, rituels d'animation de morts-vivants.",
      },
    ],
  },
];

export const OSGILD_ACADEMIES: LoreAcademy[] = [
  {
    name: "Les Collèges d'Arcanie",
    nature: "Académies de Magiciens & Sorciers",
    role: "Écoles installées dans les capitales. Elles imposent une charte d'utilisation de la magie, contrôlent la vente des composants rares et traquent les « mages rouges » (praticiens sauvages ou interdits).",
  },
  {
    name: "L'Ordre des Chroniqueurs",
    nature: "Guilde de Savants, Bardes & Historiens",
    role: "Entité neutre cartographiant le monde, archivant les traités et les généalogies nobles. Leurs bibliothèques sont des sanctuaires inviolables.",
  },
  {
    name: "Les Cercles Druidiques",
    nature: "Réseaux secrets de Gardiens de la Nature",
    role: "Protecteurs des sites de pouvoir (menhirs, leylines). Ils luttent contre la corruption magique de la terre et la déforestation abusive.",
  },
  {
    name: "Les Guildes d'Alchimistes",
    nature: "Artisans, Apothicaires & Ingénieurs",
    role: "Monopolisent la fabrication des potions, huiles magiques et poudres d'ingénierie. Ils ont un poids financier colossal dans les cités marchandes.",
  },
  {
    name: "Les Ordres de Chevalerie",
    nature: "Ordres Militaires & Religieux",
    role: "Chevaliers du Soleil, de la Justice ou de la Rose. Ils servent de force de frappe d'élite et de garants de l'honneur féodal ou divin.",
  },
];

export const OSGILD_PANTHEON_ASCII = `                           [ LE PANTHEON D'OSGILD ]
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         ▼                            ▼                            ▼
 [ DIEUX DU BIEN & D'ORDRE ]   [ DIEUX NEUTRES & NATURE ]   [ DIEUX DU MAL & DU CHAOS ]
 • Justice & Protection       • Nature & Éléments          • Nécromancie & Tyrannie
 • Lumière & Vérité           • Connaissance & Magie       • Tromperie & Peste
 • Forge & Travail            • Chance & Voyage            • Destruction & Ombre`;

export const OSGILD_DEITIES: Deity[] = [
  {
    name: "Goran",
    title: "Le Père de la Terre & Forge des Âmes",
    domains: "Forge, Terre, Devoir, Courage martial, Travail & Montagnes",
    alignment: "Loyal Bon",
    symbol: "Un marteau d'enclume croisé sur une montagne d'or",
    description:
      "Vénéré par les nains, les forgerons, les bâtisseurs et les soldats de garnison. Il incarne la solidité, la loyauté au clan, le labeur acharné et le respect des serments d'acier.",
  },
  {
    name: "Solaris",
    title: "Le Justicier Radieux & Soleil Triomphant",
    domains: "Justice, Soleil, Vérité, Protection & Guerre sainte",
    alignment: "Loyal Neutre",
    symbol: "Un soleil ardent au centre d'un bouclier étincelant",
    description:
      "Le dieu de la lumière intransigeante, révéré par les paladins, la noblesse et les magistrats. Ses temples sont des tribunaux fortifiés au cœur des cités.",
  },
  {
    name: "Ellana",
    title: "La Dame des Étoiles & Souffle de Vie",
    domains: "Lumière, Soins, Compassion, Mystères astraux, Espérance",
    alignment: "Neutre Bon",
    symbol: "Une étoile d'argent à huit branches entourée d'un croissant d'or",
    description:
      "Divinité principale des guérisseurs, des prêtres hospitaliers et des pèlerins. Elle dissipe les ténèbres, soigne les plaies incurables et console les affligés.",
  },
  {
    name: "Silvanus / Kern",
    title: "Le Seigneur Sauvage & Père des Forêts",
    domains: "Nature brute, Prédateurs, Saisons, Chasse, Végétaux",
    alignment: "Neutre Strict",
    symbol: "Un bois de grand cerf couronné de feuilles de chêne",
    description:
      "Invoqué par les druides, les rôdeurs et les paysans. On lui rend un culte d'apaisement pour préserver l'équilibre des saisons et éviter les disettes.",
  },
  {
    name: "Fulgur / Ran",
    title: "Le Flamboyant & Maître des Tempêtes",
    domains: "Mers violentes, Vents, Éclairs, Destin tumultueux, Voyageurs",
    alignment: "Chaotique Neutre",
    symbol: "Un trident foudroyé plongeant dans des vagues tumultueuses",
    description:
      "Craint et honoré par les marins de Port-Libre et les marchands côtiers. On lui offre des sacrifices avant de prendre le large pour apaiser les houles meurtrières.",
  },
  {
    name: "Morn",
    title: "Le Voilé & Gardien du Trépas",
    domains: "Mort inéluctable, Destin, Repos des Défunts, Silence",
    alignment: "Neutre",
    symbol: "Un sablier d'ébène posé sur une porte fermée",
    description:
      "Garant impassible du repos des morts. Ses prêtres traquent sans merci les nécromanciens qui osent violer les sépultures.",
  },
];
