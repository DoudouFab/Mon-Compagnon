import { Equipment, Monster, RuleChapter } from '../types/chroniques';

export const THARNEA_MONSTERS: Monster[] = [
  {
    num: 1,
    n: 'Rat de Cathédrale',
    source: 'tharnea',
    nc: '1/2',
    pv: 4,
    def: 11,
    init: 13,
    milieu: 'Urbain & Ruines',
    taille: 'Petite (60 cm sans la queue)',
    poids: '8 à 12 kg',
    caracs: { FOR: 0, DEX: 3, CON: 1, INT: 0, SAG: 1, CHA: -2 },
    att: 'Morsure sacrilège 1d4',
    fam: "Abomination de l'Ombre",
    descPhysique:
      'Un rongeur colossal dont la peau pelée et parcheminée laisse entrevoir des muscles striés de noirceur. Ses yeux laiteux, dépourvus de pupilles, semblent fixer une réalité invisible. Des murmures sacrilèges s’échappent de sa gueule, imitant des litanies religieuses déformées par la corruption.',
    traits:
      '« Il prie avant de mordre... quel respect. » Rongeur corrompu imitant des litanies religieuses déformées avant de bondir.',
    pouvoirs: [
      {
        n: 'Essaim',
        t: 'Si trois rats ou plus ciblent la même proie, ils infligent +1 dégât supplémentaire par morsure.',
      },
      {
        n: 'Murmure impie',
        t: "Une fois par scène, ses litanies imposent un malus au prochain jet d'un intrus.",
      },
    ],
    tactique:
      "Utilisez ces créatures en meutes pour submerger les explorateurs. Malgré leur faible danger individuel, leur haute discrétion leur permet de s'approcher sans bruit avant de frapper les chevilles.",
    butin: "Queue veinée d'ombre (composant de rituel mineur).",
  },
  {
    num: 2,
    n: 'Gobelin des Fosses',
    source: 'tharnea',
    nc: '1',
    pv: 6,
    def: 12,
    init: 13,
    milieu: 'Profondeurs & Cryptes',
    taille: 'Petite / Moyenne (1,10 m)',
    poids: '25 à 35 kg',
    caracs: { FOR: 1, DEX: 3, CON: 1, INT: 0, SAG: 1, CHA: -1 },
    att: 'Dague en os ou griffes 1d6',
    fam: 'Humanoïde corrompu',
    descPhysique:
      "Petit humanoïde osseux à la peau grisâtre si tendue qu'elle semble collée directement à ses côtes saillantes. Il hante les cryptes, ses yeux brillant d’une lueur malsaine dans l'obscurité. Il se nourrit des restes de sépultures, dégageant une odeur de terre humide et de putréfaction.",
    traits:
      '« Ça pue... mais c’est chez moi ! » Charognard des cryptes à l’odeur de terre humide et de putréfaction.',
    pouvoirs: [
      {
        n: 'Attaque aux chevilles',
        t: 'Une cible de taille humaine ou supérieure doit réussir un jet de DEX sous peine de chuter lourdement.',
      },
    ],
    tactique:
      "Le Gobelin des fosses est un charognard opportuniste. Il préfère gratter les cercueils ou voler des bottes. En combat, il utilise son gabarit pour se faufiler et faire tomber ses adversaires avant de s'enfuir dans les recoins étroits.",
    butin: "Restes d'os de Gobelin ou babioles volées.",
  },
  {
    num: 3,
    n: 'Champimoche',
    source: 'tharnea',
    nc: '1',
    pv: 8,
    def: 11,
    init: 11,
    milieu: 'Nature, Forêts & Marais',
    taille: 'Petite (80 cm)',
    poids: '15 à 20 kg',
    caracs: { FOR: 1, DEX: 1, CON: 2, INT: 0, SAG: 1, CHA: 3 },
    att: 'Pustule écrasée 1d6',
    fam: 'Plante monstrueuse',
    descPhysique:
      "Un champignon humanoïde dont le corps est constellé de pustules colorées et suintantes. Il tremble de sanglots convulsifs, habité par une mélancolie profonde qui semble infecter l'air autour de lui. Il se nourrit de la tristesse des voyageurs égarés.",
    traits:
      '« J’existe... je crois. » Créature fongique mélancolique qui infecte l’air de sa tristesse et de ses sanglots.',
    pouvoirs: [
      {
        n: 'Spores hallucinogènes',
        t: 'Libère un nuage forçant les créatures proches à réussir un jet de SAG ou à subir des visions délirantes pendant 1d3 tours.',
      },
    ],
    tactique:
      "Il ne cherche pas activement le combat mais entrave la progression. Placez-le dans des zones humides et confinées pour maximiser l'effet de ses spores et briser le moral du groupe.",
    butin: 'Herbes rares ou spores de mélancolie.',
  },
  {
    num: 4,
    n: 'Ancien Villageois',
    source: 'tharnea',
    nc: '1',
    pv: 10,
    def: 10,
    init: 10,
    milieu: 'Urbain & Ruines',
    taille: 'Moyenne (1,70 m)',
    poids: '55 à 70 kg',
    caracs: { FOR: 2, DEX: 0, CON: 2, INT: 0, SAG: 1, CHA: 1 },
    att: 'Étreinte cadavérique 1d6',
    fam: 'Mort-vivant de l’Obscure',
    descPhysique:
      "Un cadavre conservé avec un soin macabre, vêtu d'habits d'époque. Malgré ses yeux dénués de vie, il conserve des manières polies et une voix calme, presque apaisante. Il offre du thé imaginaire aux imprudents, dissimulant sa faim sous une courtoisie glaciale.",
    traits:
      '« Reste dîner... pour toujours. » Hôte morbide d’une courtoisie glaciale dans les villages en ruines.',
    pouvoirs: [
      {
        n: 'Recrutement funèbre',
        t: 'Sa voix hypnotique peut paralyser de peur un PJ (échec de jet de SAG), lui faisant perdre son action.',
      },
    ],
    tactique:
      "Utilisez-le pour créer un malaise social avant l'attaque. Il est lent mais persistant, idéal pour des embuscades narratives dans des villages en ruines où il agit comme un hôte morbide.",
    butin: "Vêtements d'époque intacts ou babioles d'Ancien.",
  },
  {
    num: 5,
    n: 'Boggart des Champs',
    source: 'tharnea',
    nc: '1',
    pv: 7,
    def: 12,
    init: 13,
    milieu: 'Nature, Forêts & Marais',
    taille: 'Petite (50 cm)',
    poids: '5 à 10 kg',
    caracs: { FOR: 0, DEX: 3, CON: 1, INT: 1, SAG: 2, CHA: 2 },
    att: 'Griffes terreuses 1d4',
    fam: 'Fée sombre',
    descPhysique:
      'Une petite créature noueuse dissimulée sous un amoncellement de paille et de boue. Ses longs doigts agiles sont faits pour la manipulation et la farce malveillante. Il se délecte de la frayeur des bêtes et des enfants dans les fermes isolées.',
    traits:
      '« Bouh. » Esprit farceur des granges et des fermes isolées, maître de la malice et du harcèlement.',
    pouvoirs: [
      {
        n: 'Farces rurales',
        t: 'Ses pitreries magiques imposent un malus au prochain jet de la cible.',
      },
    ],
    tactique:
      "Esprit farceur des granges, il harcèle sans relâche. Jouez-le de manière fuyante, utilisant l'environnement (étables, greniers) pour se cacher après chaque tour pendable.",
    butin: 'Poignée de paille enchantée ou fétiche rural.',
  },
  {
    num: 6,
    n: 'Spectre Bureaucrate',
    source: 'tharnea',
    nc: '2',
    pv: 10,
    def: 12,
    init: 12,
    milieu: 'Urbain & Ruines',
    taille: 'Moyenne éthérée (1,80 m flottant)',
    poids: '0 kg (Immatériel)',
    caracs: { FOR: -5, DEX: 2, CON: 0, INT: 3, SAG: 3, CHA: 4 },
    att: 'Plume d’encre spectrale 1d8',
    fam: 'Esprit de l’Obscure',
    descPhysique:
      "Une entité translucide portant les haillons d'un archiviste, flottant au-dessus de registres dont les pages tournent sans vent. Il exige des comptes pour chaque respiration prise dans son domaine.",
    traits:
      '« Signez ici... avec votre sang. » Archiviste spectral intangible exigeant des comptes pour chaque pas.',
    pouvoirs: [
      {
        n: 'Contrat spectral',
        t: 'Lie un PJ par une malédiction imposant un malus à tous ses jets jusqu’à ce qu’un exorcisme soit pratiqué.',
      },
      {
        n: 'Intangible',
        t: 'Son essence ignore les assauts purement physiques non magiques.',
      },
    ],
    tactique:
      'Hante les lieux de pouvoir ou les bibliothèques. Il ne combat pas frontalement mais utilise sa ruse. Il redoute par-dessus tout le sel, qui peut briser ses cercles de pouvoir.',
    butin: 'Encre spectrale ou parchemin de contrat.',
  },
  {
    num: 7,
    n: 'Nuée de Mouches Rieuses',
    source: 'tharnea',
    nc: '2',
    pv: 12,
    def: 12,
    init: 13,
    milieu: "L'Obscure",
    taille: 'Nuée (Zone de 2 m)',
    poids: '2 à 4 kg (total)',
    caracs: { FOR: 0, DEX: 3, CON: 2, INT: 1, SAG: 2, CHA: 0 },
    att: 'Bourdonnement rongeur 1d6',
    fam: 'Nuée démoniaque',
    descPhysique:
      'Un essaim tourbillonnant de mouches aux facettes écarlates, dont le bourdonnement collectif imite un rire moqueur et dément. Elles semblent attirées par les secrets inavoués et la trahison.',
    traits:
      '« Ha ha ha... menteur. » Essaim démoniaque attiré par les secrets inavoués et les mensonges.',
    pouvoirs: [
      {
        n: 'Détecteur de mensonges',
        t: "La nuée s'excite et attaque avec frénésie toute créature proférant un mensonge en sa présence.",
      },
    ],
    tactique:
      'Se nourrit de la honte. Utilisez cette nuée comme un mécanisme de vérité lors des interrogatoires. Elle est vulnérable aux attaques de zone et aux flammes vives.',
    butin: 'Ailes de mouche écarlates.',
  },
  {
    num: 8,
    n: 'Spectre Grégaire',
    source: 'tharnea',
    nc: '2',
    pv: 14,
    def: 12,
    init: 12,
    milieu: 'Profondeurs & Cryptes',
    taille: 'Moyenne (2,00 m)',
    poids: '0 kg (Immatériel)',
    caracs: { FOR: 0, DEX: 2, CON: 0, INT: 1, SAG: 3, CHA: 3 },
    att: 'Chaîne d’âmes 1d8',
    fam: 'Esprit enchaîné',
    descPhysique:
      "Une forme brumeuse et mouvante où s'entremêlent plusieurs visages et silhouettes enchaînées les unes aux autres. Ils cherchent à intégrer chaque vivant à leur masse hurlante.",
    traits:
      '« Ils ne supportent pas la solitude... ni ta respiration. » Masse spectrale enchaînée chassant toujours en groupe.',
    pouvoirs: [
      {
        n: 'Lien spectral',
        t: "Ces spectres gagnent en puissance et en bonus d'attaque (+1 ATT par spectre allié proche) lorsqu'ils combattent à plusieurs.",
      },
    ],
    tactique:
      'Ils attaquent toujours en meute pour souligner leur nature grégaire. Ils hantent les cryptes et sont sensibles aux rituels de purification ou au sel.',
    butin: 'Fragment de chaîne spectrale.',
  },
  {
    num: 9,
    n: 'Poule Démoniaque',
    source: 'tharnea',
    nc: '1',
    pv: 9,
    def: 12,
    init: 13,
    milieu: 'Nature, Forêts & Marais',
    taille: 'Moyenne (1,10 m)',
    poids: '30 à 45 kg',
    caracs: { FOR: 1, DEX: 3, CON: 2, INT: 0, SAG: 1, CHA: 2 },
    att: 'Bec incandescent 1d8',
    fam: 'Créature infernale',
    descPhysique:
      "Un gallinacé massif au plumage roussi par les feux infernaux, dont les yeux rougeoyants trahissent une haine viscérale. Elle gratte le sol de ses griffes d'obsidienne.",
    traits:
      '« Cluck... BOUM. » Volaille infernale haineuse pondeuse de projectiles explosifs.',
    pouvoirs: [
      {
        n: 'Œufs instables',
        t: 'À chaque tour, elle peut pondre un projectile explosif dont l’effet est imprévisible.',
      },
    ],
    tactique:
      'Menace imprévisible. Elle doit être éliminée rapidement avant que ses œufs ne dévastent le groupe. Elle devient plus agressive si elle se sent observée.',
    butin: 'Plume brûlée ou résidu explosif.',
  },
  {
    num: 10,
    n: 'Bûcheron Sans Tête',
    source: 'tharnea',
    nc: '3',
    pv: 18,
    def: 13,
    init: 10,
    milieu: 'Nature, Forêts & Marais',
    taille: 'Grande / Massive (2,20 m)',
    poids: '140 à 180 kg',
    caracs: { FOR: 4, DEX: 0, CON: 3, INT: -1, SAG: 2, CHA: -3 },
    att: 'Grande Hache de forestier 1d12',
    fam: 'Monstre maudit',
    descPhysique:
      'Un colosse décapité dont le cou laisse échapper un sang noirci et séché qui ne finit jamais de couler. Il brandit une hache de forestier massive, capable de fendre le chêne comme les os.',
    traits:
      '« Il ne perd pas la tête... il l’a déjà perdue. » Colosse aveugle guidé uniquement par le bruit.',
    pouvoirs: [
      {
        n: 'Chasseur de sons',
        t: 'Dénué de vue, il oriente ses attaques dévastatrices vers la dernière source de bruit perçue.',
      },
    ],
    tactique:
      'Puissant mais prévisible. Les joueurs peuvent le manipuler par des diversions sonores. Il est vulnérable au fer froid, ralentissant sa régénération impie.',
    butin: 'Hache de bûcheron robuste ou essence de violence.',
  },
  {
    num: 11,
    n: 'Ronceur',
    source: 'tharnea',
    nc: '3',
    pv: 20,
    def: 13,
    init: 11,
    milieu: 'Nature, Forêts & Marais',
    taille: 'Moyenne / Grande (2,10 m)',
    poids: '110 à 150 kg',
    caracs: { FOR: 3, DEX: 1, CON: 3, INT: 0, SAG: 2, CHA: 0 },
    att: 'Lianes épineuses 1d10',
    fam: 'Végétal corrompu',
    descPhysique:
      "Humanoïde végétal né d'un rite occulte raté, entièrement composé de lierre épineux et de racines suintant une sève toxique. Ses membres se tordent comme des serpents ligneux.",
    traits:
      '« Laisse les plantes tranquilles. » Entraveur végétal né d’un rite occulte raté.',
    pouvoirs: [
      {
        n: 'Racines fouets',
        t: 'Ses membres extensibles peuvent attaquer et entraver jusqu’à trois cibles simultanément.',
      },
    ],
    tactique:
      'Utilisez-le dans les forêts denses. Il immobilise ses proies avant de les étrangler. Il possède une faiblesse majeure au feu, mais sa robustesse au corps à corps est redoutable.',
    butin: 'Sève de Ronceur (poison mineur) ou bois de sorbier corrompu.',
  },
  {
    num: 12,
    n: 'Kobal',
    source: 'tharnea',
    nc: '2',
    pv: 16,
    def: 13,
    init: 13,
    milieu: 'Le Gouffre & La Faille',
    taille: 'Moyenne (1,50 m de long)',
    poids: '60 à 80 kg',
    caracs: { FOR: 3, DEX: 3, CON: 2, INT: 1, SAG: 2, CHA: 1 },
    att: 'Mâchoires du néant 1d10',
    fam: 'Loup spectral',
    descPhysique:
      "Un esprit-loup à la fourrure sombre comme le néant et aux yeux brillant d'une intelligence prédatrice effrayante. Il semble chevaucher les vents qui précèdent les tempêtes de la Faille.",
    traits:
      '« Il hurle ton nom, et tu cours trop tard. » Esprit-loup annonciateur des tempêtes de la Faille.',
    pouvoirs: [
      {
        n: 'Hurlement de présage',
        t: 'Son cri force les mortels à tester leur peur sous peine de fuir.',
      },
    ],
    tactique:
      'Traqueur infatigable. Il utilise son hurlement pour disperser les groupes. Utilisez sa haute perception pour traquer les blessés. Sensible à la lumière vive.',
    butin: 'Croc de loup spectral.',
  },
  {
    num: 13,
    n: 'Doppel Miroir',
    source: 'tharnea',
    nc: '3',
    pv: 22,
    def: 14,
    init: 13,
    milieu: 'Urbain & Ruines',
    taille: 'Moyenne variable (1,75 m)',
    poids: 'Variable (~70 kg)',
    caracs: { FOR: 2, DEX: 3, CON: 2, INT: 3, SAG: 3, CHA: 4 },
    att: 'Frappe miroitante 1d10',
    fam: 'Métamorphe de verre',
    descPhysique:
      "Une entité au corps lisse et réfléchissant comme du mercure liquide, capable de copier instantanément les traits de ses victimes. Sa véritable forme n'est qu'une silhouette vide.",
    traits:
      '« Tu es moi... en moins bien. » Usurpateur d’identité au corps de mercure liquide.',
    pouvoirs: [
      {
        n: 'Vol d’identité',
        t: "Peut prendre la place d'un PJ pendant 1d3 tours, semant la confusion.",
      },
    ],
    tactique:
      "Utilisez-le pour briser la cohésion du groupe. Il frappe là où la confiance est fragile. Il est vulnérable si son miroir d'origine est brisé ou exposé à une lumière pure.",
    butin: 'Éclat de miroir magique.',
  },
  {
    num: 14,
    n: 'Vampire des Marais',
    source: 'tharnea',
    nc: '4',
    pv: 24,
    def: 14,
    init: 13,
    milieu: 'Nature, Forêts & Marais',
    taille: 'Moyenne élancée (1,90 m)',
    poids: '75 à 90 kg',
    caracs: { FOR: 4, DEX: 3, CON: 3, INT: 2, SAG: 2, CHA: 4 },
    att: 'Griffes bourbeuses 1d10',
    fam: 'Mort-vivant amphibie',
    descPhysique:
      "Une silhouette élancée et humide, maculée de boue noire et de sang coagulé. Il dégage une odeur insoutenable de vase et de charogne. Il hante les eaux croupies, attendant qu'une main s'enfonce dans la boue.",
    traits:
      '« Il sent la vase... et la mort. » Prédateur amphibie des eaux croupies et des brumes marécageuses.',
    pouvoirs: [
      {
        n: 'Charme',
        t: "Un regard hypnotique forçant l'obéissance.",
      },
      {
        n: 'Drain vital',
        t: 'Chaque blessure infligée soigne le vampire de la moitié des dégâts produits.',
      },
    ],
    tactique:
      "Il attaque depuis la brume ou l'eau. Il est extrêmement sensible au sel et au fer froid, qui brûlent sa chair humide.",
    butin: 'Sang de vampire purifié.',
  },
  {
    num: 15,
    n: 'Banshee des Falaises',
    source: 'tharnea',
    nc: '3',
    pv: 20,
    def: 14,
    init: 13,
    milieu: "L'Obscure",
    taille: 'Moyenne éthérée (1,75 m)',
    poids: '0 kg (Immatériel)',
    caracs: { FOR: 0, DEX: 3, CON: 0, INT: 2, SAG: 4, CHA: 5 },
    att: 'Griffe fantomatique 1d12',
    fam: 'Esprit vengeur',
    descPhysique:
      "Un esprit féminin dont la chevelure flotte comme des algues mortes dans un courant invisible. Son visage est figé dans un hurlement capable de fendre le roc. Elle n'apparaît que pour annoncer la fin.",
    traits:
      '« Quand elle chante, c’est trop tard. » Esprit annonciateur de mort dont le cri fend la pierre.',
    pouvoirs: [
      {
        n: 'Hurlement funeste',
        t: 'Déclenche une onde de choc forçant toutes les créatures proches à affronter leur propre fin (test de peur).',
      },
    ],
    tactique:
      "Utilisez son cri pour interrompre les rituels ou disperser les PJ. Sa nature éthérée la rend difficile à blesser physiquement. Elle craint les symboles de l'Ordre bénis.",
    butin: 'Larme cristallisée de Banshee.',
  },
  {
    num: 16,
    n: 'Grimalkin',
    source: 'tharnea',
    nc: '3',
    pv: 22,
    def: 15,
    init: 14,
    milieu: "L'Obscure",
    taille: 'Moyenne féline (1,70 m)',
    poids: '60 à 75 kg',
    caracs: { FOR: 2, DEX: 4, CON: 2, INT: 2, SAG: 2, CHA: 3 },
    att: 'Dagues jumelles 1d10',
    fam: 'Assassin de l’Ombre',
    descPhysique:
      "Une assassine redoutable, silhouette féminine drapée de voiles noirs qui semblent absorber la lumière ambiante. Elle se déplace avec la grâce d'une prédatrice féline.",
    traits:
      '« Elle t’épargne... quand elle s’ennuie. » Prédatrice féline de l’ombre frappant en embuscade.',
    pouvoirs: [
      {
        n: 'Assassin des ombres',
        t: "Ses dégâts sont doublés lorsqu'elle frappe depuis une position dissimulée.",
      },
    ],
    tactique:
      "Prédatrice de l'ombre. Elle n'attaque que par embuscade. Utilisez sa DEX élevée pour des manœuvres de flanc. Vulnérable à la détection magique et à la lumière.",
    butin: 'Dague de noir-acier.',
  },
  {
    num: 17,
    n: 'Cerveau de la Faille',
    source: 'tharnea',
    nc: '5',
    pv: 30,
    def: 14,
    init: 11,
    milieu: 'Le Gouffre & La Faille',
    taille: 'Grande (2,50 m de diamètre)',
    poids: '300 à 450 kg',
    caracs: { FOR: -5, DEX: 1, CON: 4, INT: 6, SAG: 5, CHA: 4 },
    att: 'Décharge psychique 1d12',
    fam: 'Aberration psychique',
    descPhysique:
      "Une masse de chair pulsante et tentaculaire, d'où émergent les visages hurlants de ses victimes passées, fondus dans sa substance. Il vibre d'une énergie psychique qui tord le réel.",
    traits:
      '« Je pense, donc tu pleures. » Entité télépathique tordant la réalité et l’esprit des intrus.',
    pouvoirs: [
      {
        n: 'Absorption mentale',
        t: "Peut prendre le contrôle d'un PJ sur un échec critique.",
      },
      {
        n: 'Télépathie',
        t: "Murmure des vérités insensées directement dans l'esprit des cibles.",
      },
    ],
    tactique:
      'Boss psychique. Il doit rester à distance, protégé par des serviteurs (comme des spectres), utilisant son INT pour manipuler les PJ.',
    butin: 'Essence de pensée pure.',
  },
  {
    num: 18,
    n: 'Mère Malkin',
    source: 'tharnea',
    nc: '5',
    pv: 34,
    def: 15,
    init: 12,
    milieu: 'Profondeurs & Cryptes',
    taille: 'Moyenne (1,60 m)',
    poids: '40 à 55 kg',
    caracs: { FOR: 3, DEX: 2, CON: 4, INT: 5, SAG: 4, CHA: 5 },
    att: 'Toucher corrompu 1d12',
    fam: 'Sorcière antique',
    descPhysique:
      'Sorcière antique dont la peau craquelée ressemble à du parchemin brûlé. Elle est un tas de haine ambulante, immortelle et putride. Elle dégage une aura de mort ancienne.',
    traits:
      '« Tu croyais m’avoir enterrée ? » Nécromancienne immortelle saturant le terrain de serviteurs relevés.',
    pouvoirs: [
      {
        n: 'Nécromancie majeure',
        t: 'Capable de relever un serviteur tombé à chaque tour de combat.',
      },
    ],
    tactique:
      'Elle ne combat jamais seule. Elle utilise ses serviteurs pour saturer le terrain. Elle est vulnérable au sel sanctifié et aux rituels de lumière majeure.',
    butin: 'Grimoire de rituels interdits.',
  },
  {
    num: 19,
    n: 'Morwèn la Démone des Ombres',
    source: 'tharnea',
    nc: '6',
    pv: 38,
    def: 16,
    init: 14,
    milieu: "L'Obscure",
    taille: 'Grande ailée (2,40 m)',
    poids: '120 à 160 kg',
    caracs: { FOR: 4, DEX: 4, CON: 4, INT: 4, SAG: 4, CHA: 6 },
    att: 'Faux du Néant 1d20',
    fam: 'Démone supérieure',
    descPhysique:
      "Ancienne prêtresse dont le corps a été dévoré par la Faille. Elle apparaît comme une silhouette ailée faite d'ombre solide et de chair sanglante. Elle est l'incarnation du néant qui cherche à dévorer la lumière.",
    traits:
      '« Sa voix est un écho du vide. » Avatar ailé du néant absorbant la vitalité de chaque vaincu.',
    pouvoirs: [
      {
        n: 'Dévoreuse d’âmes',
        t: 'Sa puissance augmente à chaque ennemi vaincu.',
      },
      {
        n: 'Rituel de la Faille',
        t: 'Si on lui laisse le temps, elle invoque une horreur majeure.',
      },
    ],
    tactique:
      "C'est un avatar du néant. Elle doit être le point culminant d'une confrontation. Sa voix sape la volonté. Elle est vulnérable aux reliques de l'Ordre de la Lumière.",
    butin: 'Cœur de Faille (Relique majeure).',
  },
  {
    num: 20,
    n: 'Rat des Cendres',
    source: 'tharnea',
    nc: '1/2',
    pv: 4,
    def: 11,
    init: 13,
    milieu: 'Champs de Bataille & Routes',
    taille: 'Petite (40 cm)',
    poids: '2 à 4 kg',
    caracs: { FOR: 1, DEX: 3, CON: 1, INT: 0, SAG: 1, CHA: -2 },
    att: 'Morsure incandescente 1d4',
    fam: 'Vermine ignée',
    descPhysique:
      "Un rat noir dont le pelage semble perpétuellement couvert de cendres chaudes et de suie. Ses moustaches fument légèrement, dégageant une odeur de soufre et de brûlé. Ses petits yeux rouges brillent comme des braises dans l'obscurité des forges.",
    traits:
      'Vermine des zones volcaniques et ruines incendiées acharnée contre les cibles déjà blessées.',
    pouvoirs: [
      {
        n: 'Morsure ardente',
        t: 'Avantage aux attaques si la cible est déjà blessée.',
      },
    ],
    tactique:
      'Hante les zones volcaniques ou les ruines incendiées. Il possède une faiblesse marquée à la lumière vive et aux armes de métal pur, qui dissipent sa chaleur surnaturelle.',
    butin: 'Cendres éternelles (composant alchimique).',
  },
  {
    num: 21,
    n: 'Champignon Sifflant',
    source: 'tharnea',
    nc: '1/2',
    pv: 3,
    def: 10,
    init: 11,
    milieu: 'Nature, Forêts & Marais',
    taille: 'Petite (50 cm)',
    poids: '3 à 6 kg',
    caracs: { FOR: 0, DEX: 1, CON: 1, INT: 0, SAG: 2, CHA: 1 },
    att: 'Projection visqueuse 1d3',
    fam: 'Végétal alarme',
    descPhysique:
      "Un spécimen violet et boursouflé, gonflé de pores d'où s'échappe un sifflement strident et constant, semblable à un cri étouffé. Sa surface est visqueuse, réagissant violemment au moindre mouvement d'air.",
    traits:
      'Alarme fongique naturelle réagissant au moindre courant d’air par un sifflement strident.',
    pouvoirs: [
      {
        n: 'Spores irritantes',
        t: 'Provoque des quintes de toux et des malus aux attaques dans une zone de 3m.',
      },
    ],
    tactique:
      'Agit comme une alarme naturelle. Il est extrêmement vulnérable au sel et au feu, qui le font se flétrir instantanément.',
    butin: 'Poudre sifflante.',
  },
  {
    num: 22,
    n: 'Corbeau Vigie',
    source: 'tharnea',
    nc: '1/2',
    pv: 5,
    def: 12,
    init: 14,
    milieu: "L'Obscure",
    taille: 'Moyenne (1,20 m d’envergure)',
    poids: '8 à 12 kg',
    caracs: { FOR: 0, DEX: 4, CON: 1, INT: 1, SAG: 3, CHA: 1 },
    att: 'Coup de bec 1d4',
    fam: 'Oiseau sentinelle',
    descPhysique:
      "Un corbeau massif dont les plumes noires semblent absorber la lumière. Ses yeux sont d'un blanc pur et laiteux, indiquant qu'il voit au-delà du spectre mortel, percevant les flux de la Faille.",
    traits:
      'Sentinelle du vide percevant les flux de la Faille au-delà du spectre mortel.',
    pouvoirs: [
      {
        n: 'Alerte',
        t: 'Son croassement prévient tous les alliés dans un rayon de 50 mètres.',
      },
    ],
    tactique:
      "Sentinelle du vide. Éliminez-le en premier par des attaques à distance pour garder l'effet de surprise. Il craint les éclats de lumière soudaine.",
    butin: 'Œil de voyance (fétiche).',
  },
  {
    num: 23,
    n: 'Ombre Mineure',
    source: 'tharnea',
    nc: '1',
    pv: 6,
    def: 12,
    init: 13,
    milieu: "L'Obscure",
    taille: 'Petite 2D',
    poids: '0 kg',
    caracs: { FOR: 0, DEX: 3, CON: 0, INT: 1, SAG: 2, CHA: 2 },
    att: 'Griffe d’ombre 1d4',
    fam: 'Ombre planaire',
    descPhysique:
      "Une silhouette bidimensionnelle, noire comme l'encre la plus profonde, qui reste collée aux parois et aux sols. Elle se déforme de manière grotesque pour suivre ses proies sans jamais se détacher des surfaces.",
    traits:
      'Silhouette d’encre bidimensionnelle glissant sur les murs et ignorant les protections magiques ordinaires.',
    pouvoirs: [
      {
        n: 'Griffe d’ombre',
        t: 'Ses attaques ignorent les protections magiques conventionnelles.',
      },
    ],
    tactique:
      'Utilisez sa discrétion élevée pour attaquer depuis les angles morts. Elle est instantanément dissipée ou affaiblie par toute source de lumière vive ou par le sel.',
    butin: 'Essence spectrale mineure.',
  },
  {
    num: 24,
    n: 'Ver des Racines',
    source: 'tharnea',
    nc: '1',
    pv: 5,
    def: 11,
    init: 11,
    milieu: 'Nature, Forêts & Marais',
    taille: 'Moyenne (1,80 m de long)',
    poids: '40 à 60 kg',
    caracs: { FOR: 2, DEX: 1, CON: 2, INT: -1, SAG: 1, CHA: -2 },
    att: 'Morsure corrosive 1d6',
    fam: 'Parasite souterrain',
    descPhysique:
      'Un ver pâle et visqueux, dont le corps est entremêlé de racines sombres qui semblent pulser comme des veines. Il rampe dans la terre corrompue, laissant un sillage de bile corrosive.',
    traits:
      'Embusqué souterrain surgissant du sol corrompu en laissant un sillage d’acide.',
    pouvoirs: [
      {
        n: 'Bile corrosive',
        t: 'Sa morsure ronge l’armure, réduisant la CA de la cible de 1 point pour le combat.',
      },
    ],
    tactique:
      'Il surgit du sol pour surprendre les voyageurs. Idéal pour punir les PJ lents. Il redoute les armes de fer froid et les flammes.',
    butin: 'Glande acide.',
  },
  {
    num: 25,
    n: 'Piqueneige ❄️',
    source: 'tharnea',
    nc: '1',
    pv: 4,
    def: 12,
    init: 13,
    milieu: 'Champs de Bataille & Routes',
    taille: 'Petite (60 cm d’envergure)',
    poids: '3 à 5 kg',
    caracs: { FOR: 0, DEX: 3, CON: 1, INT: 0, SAG: 2, CHA: 1 },
    att: 'Fléchette glacée 1d4+1',
    fam: 'Oiseau de givre',
    descPhysique:
      "Un oiseau dont les plumes blanches sont aussi rigides et tranchantes que des aiguilles de glace. Son cri est un sifflement glacial qui semble geler l'air ambiant.",
    traits:
      'Chasseur aérien des étendues enneigées projetant ses plumes comme des fléchettes.',
    pouvoirs: [
      {
        n: 'Pluie d’épines',
        t: 'Projette ses plumes comme des fléchettes sur plusieurs cibles.',
      },
    ],
    tactique:
      'Attaque à distance depuis les hauteurs. Sa discrétion le rend presque invisible dans la neige. Il possède une vulnérabilité critique au feu.',
    butin: 'Plumes-aiguilles (projectiles).',
  },
  {
    num: 26,
    n: 'Petit Fantasque ✨',
    source: 'tharnea',
    nc: '1',
    pv: 5,
    def: 12,
    init: 14,
    milieu: 'Urbain & Ruines',
    taille: 'Petite (40 cm)',
    poids: '2 à 4 kg',
    caracs: { FOR: 0, DEX: 4, CON: 1, INT: 1, SAG: 2, CHA: 3 },
    att: 'Jet de caillou précis 1d4+1',
    fam: 'Esprit facétieux',
    descPhysique:
      "Un petit esprit malicieux et instable dont les yeux brillent d'une lueur changeante. Il rit d'un son cristallin et moqueur, apparaissant et disparaissant dans des éclats de lumière.",
    traits:
      'Esprit joueur et trompeur cherchant à attirer les imprudents dans des pièges.',
    pouvoirs: [
      {
        n: 'Jet de caillou',
        t: 'Une attaque précise visant les points sensibles (yeux, articulations).',
      },
    ],
    tactique:
      'Il cherche à distraire. Utilisez sa tromperie pour attirer les PJ dans des pièges. Il peut être banni par des objets en fer pur ou des prières.',
    butin: 'Caillou de chance.',
  },
  {
    num: 27,
    n: 'Chiot Noir Errant 🐕',
    source: 'tharnea',
    nc: '1',
    pv: 7,
    def: 12,
    init: 13,
    milieu: 'Champs de Bataille & Routes',
    taille: 'Petite / Moyenne (70 cm)',
    poids: '15 à 22 kg',
    caracs: { FOR: 2, DEX: 3, CON: 2, INT: 0, SAG: 2, CHA: 1 },
    att: 'Croc mélancolique 1d6',
    fam: 'Canidé spectral',
    descPhysique:
      "Un jeune canidé à la fourrure d'ébène et aux yeux pâles, dégageant une aura de mélancolie insondable. Son ombre semble trop longue et se détache parfois de ses mouvements.",
    traits:
      'Traqueur des blessés dont l’ombre s’allonge et se détache parfois de son corps.',
    pouvoirs: [
      {
        n: 'Pisteur de sang',
        t: 'Suit infailliblement l’odeur du sang des blessés.',
      },
    ],
    tactique:
      "Harcèle les traînards. Sa perception l'empêche de perdre sa proie. Il craint les torches et les bruits soudains.",
    butin: 'Collier usé.',
  },
  {
    num: 28,
    n: 'Lame-Branchue',
    source: 'tharnea',
    nc: '2',
    pv: 8,
    def: 12,
    init: 12,
    milieu: 'Nature, Forêts & Marais',
    taille: 'Petite / Moyenne (1,20 m)',
    poids: '30 à 45 kg',
    caracs: { FOR: 2, DEX: 2, CON: 2, INT: 0, SAG: 2, CHA: 0 },
    att: 'Rameaux tranchants 1d4+1',
    fam: 'Végétal d’assaut',
    descPhysique:
      'Un petit arbre humanoïde aux mouvements saccadés, dont les branches se terminent par des bords tranchants comme des rasoirs. Son écorce est striée de sève noire et empoisonnée.',
    traits:
      'Embusqué forestier camouflé dans la végétation et armé de branches tranchantes.',
    pouvoirs: [
      {
        n: 'Entaille végétale',
        t: 'Ses attaques provoquent des lacérations difficiles à cicatriser.',
      },
    ],
    tactique:
      'Se camoufle parfaitement dans la végétation. Frappe les imprudents en embuscade. Faiblesse majeure au feu et aux haches de fer froid.',
    butin: 'Bois de sorbier.',
  },
  {
    num: 29,
    n: 'Rat-Faille',
    source: 'tharnea',
    nc: '1',
    pv: 6,
    def: 12,
    init: 13,
    milieu: 'Le Gouffre & La Faille',
    taille: 'Petite / Moyenne (90 cm)',
    poids: '15 à 20 kg',
    caracs: { FOR: 2, DEX: 3, CON: 2, INT: 1, SAG: 1, CHA: -2 },
    att: 'Morsure corrompue 1d3+1',
    fam: 'Vermine de la Faille',
    descPhysique:
      "Un rat d'une taille anormale, dont le corps est parcouru de veines rouges pulsatiles d'une énergie noire instable. Il dégage une odeur de métal brûlé et de corruption pure.",
    traits:
      'Vermine instable gorgée d’énergie noire pouvant imploser sous la lumière sanctifiée.',
    pouvoirs: [
      {
        n: 'Bile de Faille',
        t: 'Sa morsure injecte un poison corrosif qui brûle les tissus.',
      },
    ],
    tactique:
      "Plus résistant que les rats ordinaires. Il est vulnérable au sel et à la lumière sanctifiée, qui stabilisent l'énergie de la faille en lui jusqu'à l'explosion.",
    butin: 'Organe corrompu (instable).',
  },
  {
    num: 30,
    n: 'Gobelin à Longs-Bras',
    source: 'tharnea',
    nc: '2',
    pv: 10,
    def: 12,
    init: 13,
    milieu: 'Profondeurs & Cryptes',
    taille: 'Petite / Moyenne (1,30 m)',
    poids: '35 à 45 kg',
    caracs: { FOR: 2, DEX: 3, CON: 2, INT: 0, SAG: 1, CHA: 0 },
    att: 'Griffes allongées 1d8',
    fam: 'Gobelinoïde muté',
    descPhysique:
      'Un gobelin squelettique dont les bras démesurément longs permettent à ses doigts griffus de racler le sol. Sa peau grise est couverte de cicatrices rituelles.',
    traits:
      'Combattant à allonge frappant ses ennemis à couvert derrière des obstacles.',
    pouvoirs: [
      {
        n: 'Griffes à longue portée',
        t: "Peut frapper ses ennemis à 2 mètres de distance sans s'exposer.",
      },
    ],
    tactique:
      'Utilisez sa portée pour attaquer depuis derrière des obstacles. Sa faiblesse majeure réside dans le fer froid, qui tranche sa chair avec une efficacité accrue.',
    butin: 'Griffes de Gobelin.',
  },
  {
    num: 31,
    n: 'Gobelin Rouge-Capuchon',
    source: 'tharnea',
    nc: '2',
    pv: 9,
    def: 12,
    init: 13,
    milieu: 'Champs de Bataille & Routes',
    taille: 'Petite (1,00 m)',
    poids: '25 à 35 kg',
    caracs: { FOR: 2, DEX: 3, CON: 2, INT: 0, SAG: 1, CHA: 1 },
    att: 'Faucille ensanglantée 1d8',
    fam: 'Gobelin sanguinaire',
    descPhysique:
      'Reconnaissable à son couvre-chef rugueux, perpétuellement imbibé de sang frais qui goutte sur ses épaules. Ses dents sont pointues et toujours visibles dans un rictus sauvage.',
    traits:
      'Gobelin sanguinaire terrorisé par les torches et les flammes vives.',
    pouvoirs: [
      {
        n: 'Morsure sanglante',
        t: 'Cause un saignement persistant (1 PV/tour) jusqu’à ce que la cible soit soignée.',
      },
    ],
    tactique:
      'Il est terrifié par les torches et le feu vif. Maintenez-le à distance avec des sources lumineuses pour annuler son agressivité.',
    butin: 'Tissu imprégné de sang.',
  },
  {
    num: 32,
    n: 'Gobelin des Cavernes',
    source: 'tharnea',
    nc: '2',
    pv: 14,
    def: 13,
    init: 11,
    milieu: 'Profondeurs & Cryptes',
    taille: 'Moyenne (Brute 1,50 m)',
    poids: '70 à 90 kg',
    caracs: { FOR: 4, DEX: 1, CON: 3, INT: 0, SAG: 1, CHA: -1 },
    att: 'Masse en fémur 1d8',
    fam: 'Gobelin d’assaut',
    descPhysique:
      "Une brute massive couverte de boue séchée et de dépôts calcaires, maniant une lourde masse faite d'os de fémur humain. Ses yeux sont habitués à l'obscurité totale.",
    traits:
      'Colosse gobelinoïde blindé de croûtes calcaires servant de tank à sa meute.',
    pouvoirs: [
      {
        n: 'Masse d’os',
        t: "Ses coups peuvent repousser les adversaires (3m) ou briser l'équipement.",
      },
    ],
    tactique:
      'C’est le "tank" de sa meute. Il possède une faiblesse naturelle à l’eau courante, qui dissout ses croûtes protectrices et l’affaiblit.',
    butin: 'Os de Gobelin géant.',
  },
  {
    num: 33,
    n: 'Gobelin Chasseur d’Os',
    source: 'tharnea',
    nc: '2',
    pv: 12,
    def: 13,
    init: 13,
    milieu: 'Profondeurs & Cryptes',
    taille: 'Moyenne (1,40 m)',
    poids: '45 à 55 kg',
    caracs: { FOR: 2, DEX: 3, CON: 2, INT: 1, SAG: 2, CHA: 0 },
    att: 'Dague d’os envenimée 1d8',
    fam: 'Rôdeur gobelin',
    descPhysique:
      "Orné de multiples talismans d'os cliquetants, ce gobelin possède un regard d'une précision effrayante. Il se déplace sans un bruit, son corps peint de cendres funéraires.",
    traits:
      'Traqueur tactique silencieux utilisant talismans funéraires et lames empoisonnées.',
    pouvoirs: [
      {
        n: 'Dague empoisonnée',
        t: 'Ses attaques obligent à un test de Constitution pour éviter un malus de faiblesse.',
      },
    ],
    tactique:
      'Combattant tactique. Utilisez le sel ou le bois de sorbier pour annuler ses avantages magiques et le rendre vulnérable.',
    butin: 'Dague d’os (envenimée).',
  },
  {
    num: 34,
    n: 'Skelt Herse-Échine ⚔️',
    source: 'tharnea',
    nc: '3',
    pv: 16,
    def: 13,
    init: 11,
    milieu: "L'Obscure",
    taille: 'Grande (2,50 m de long)',
    poids: '120 à 160 kg',
    caracs: { FOR: 4, DEX: 1, CON: 4, INT: -1, SAG: 2, CHA: -2 },
    att: 'Rostre & aiguillons 1d8',
    fam: 'Insecto-reptile osseux',
    descPhysique:
      "Le Skelt possède un corps squelettique et sinueux, à mi-chemin entre le reptile décharné et l'insecte. Sa tête blindée de plaques osseuses arbore un long rostre effilé comme une aiguille, tandis que son tronc segmenté se prolonge par une longue queue épineuse. Elle se déplace sur d'immenses pattes grêles et articulées, évoquant une faucheuse cauchemardesque prête à fondre sur sa proie.",
    traits:
      'Faucheuse squelettique hérissée de pointes dorsales blessant quiconque l’attaque au contact.',
    pouvoirs: [
      {
        n: 'Pointes dorsales',
        t: 'Toute attaque de corps à corps contre lui inflige des dégâts de retour (1d4).',
      },
    ],
    tactique:
      "Force les PJ à privilégier les attaques à distance. Sa faiblesse réside dans l'exposition à une lumière vive ou au feu, qui rend ses épines cassantes.",
    butin: 'Épine de Skelt.',
  },
  {
    num: 35,
    n: 'Revenant Lié à la Terre',
    source: 'tharnea',
    nc: '2',
    pv: 13,
    def: 12,
    init: 11,
    milieu: 'Profondeurs & Cryptes',
    taille: 'Moyenne (1,70 m)',
    poids: '65 à 80 kg',
    caracs: { FOR: 3, DEX: 1, CON: 3, INT: 1, SAG: 2, CHA: 1 },
    att: 'Poings terreux 1d8',
    fam: 'Mort-vivant racinaire',
    descPhysique:
      "Un cadavre animé, recouvert de terre humide et de racines entrelacées, dont les yeux conservent une étincelle de conscience tourmentée. Il rampe plus qu'il ne marche, s'extirpant du sol.",
    traits:
      'Mort-vivant tellurique drainant la force vitale à travers l’armure physique.',
    pouvoirs: [
      {
        n: 'Drain racinaire',
        t: "Absorbe l'énergie vitale pour se soigner, ignorant l'armure physique.",
      },
    ],
    tactique:
      'Le sel tracé au sol peut bloquer ses mouvements. Connaître son nom véritable permet d’annuler sa résistance aux dégâts.',
    butin: 'Terre tombale bénie.',
  },
  {
    num: 36,
    n: 'Sorcière d’Eau 🌊',
    source: 'tharnea',
    nc: '3',
    pv: 18,
    def: 14,
    init: 12,
    milieu: 'Nature, Forêts & Marais',
    taille: 'Moyenne (1,65 m)',
    poids: '50 à 65 kg',
    caracs: { FOR: 1, DEX: 2, CON: 2, INT: 4, SAG: 4, CHA: 3 },
    att: 'Lames d’eau pressurisées 2d6',
    fam: 'Sorcière élémentaire',
    descPhysique:
      "Une femme à la peau translucide dont les cheveux longs ruissellent constamment d'une eau saumâtre et fétide. Son regard est noyé, et ses doigts sont palmés.",
    traits:
      'Incantatrice aquatique tranchant le métal par jets d’eau pressurisés.',
    pouvoirs: [
      {
        n: 'Lames d’eau',
        t: 'Projette des jets pressurisés capables de trancher le métal.',
      },
    ],
    tactique:
      'Utilise sa magie à distance. Elle redoute le sel, qui déshydrate violemment son essence magique.',
    butin: 'Essence aqueuse.',
  },
  {
    num: 37,
    n: 'Sorcière de Sang 🩸',
    source: 'tharnea',
    nc: '3',
    pv: 20,
    def: 14,
    init: 13,
    milieu: 'Profondeurs & Cryptes',
    taille: 'Moyenne (1,70 m)',
    poids: '60 à 75 kg',
    caracs: { FOR: 2, DEX: 3, CON: 3, INT: 4, SAG: 3, CHA: 4 },
    att: 'Griffes écarlates 2d6',
    fam: 'Hémomancienne',
    descPhysique:
      "Sorcière maculée d'un sang qui ne sèche jamais, ses yeux rouges brûlent d'une soif insatiable. Elle porte des bijoux faits de caillots cristallisés.",
    traits:
      'Duelliste sanguinaire provoquant des hémorragies incessantes au corps à corps.',
    pouvoirs: [
      {
        n: 'Griffes de sang',
        t: 'Ses attaques provoquent des saignements permanents.',
      },
    ],
    tactique:
      "Agressive, elle cherche le contact. Le fer froid perturbe sa maîtrise du sang, augmentant les dégâts qu'elle subit.",
    butin: 'Fiole de sang pur.',
  },
  {
    num: 38,
    n: 'Sorcière d’Os 🦴',
    source: 'tharnea',
    nc: '3',
    pv: 22,
    def: 15,
    init: 12,
    milieu: 'Profondeurs & Cryptes',
    taille: 'Moyenne (1,60 m)',
    poids: '55 à 70 kg',
    caracs: { FOR: 2, DEX: 2, CON: 4, INT: 4, SAG: 4, CHA: 2 },
    att: 'Fouet d’ossements 2d6',
    fam: 'Ostéomancienne',
    descPhysique:
      "Son corps est entouré d'une ceinture d'ossements humains qui flottent et s'assemblent en boucliers ou en armes selon ses désirs.",
    traits:
      'Pivot défensif entouré d’une nuée d’ossements animés.',
    pouvoirs: [
      {
        n: 'Fouet d’os',
        t: 'Une arme animée capable de frapper avec une force cinétique surnaturelle.',
      },
    ],
    tactique:
      'Pivot défensif. Elle est sensible aux armes contondantes et au sel, qui fragilise ses os animés.',
    butin: 'Ossements rituels.',
  },
  {
    num: 39,
    n: 'Barghest du Carrefour 🐺',
    source: 'tharnea',
    nc: '4',
    pv: 24,
    def: 12,
    init: 13,
    milieu: 'Champs de Bataille & Routes',
    taille: 'Grande canidée (2,50 m de long)',
    poids: '180 à 250 kg',
    caracs: { FOR: 5, DEX: 3, CON: 4, INT: 2, SAG: 3, CHA: 3 },
    att: 'Gueule d’ombre 2d6',
    fam: 'Molosse infernal',
    descPhysique:
      "Un chien démoniaque colossal dont l'ombre est absente. Sa fourrure est faite de ténèbres palpables, et ses crocs sont d'ivoire jauni par la corruption.",
    traits:
      'Maître des embuscades routières dépourvu d’ombre propre.',
    pouvoirs: [
      {
        n: 'Morsure de terreur',
        t: 'Chaque morsure réussie inflige une peur paralysante (test de SAG).',
      },
    ],
    tactique:
      "Maître des embuscades routières. Il possède une vulnérabilité au fer froid et à la lumière vive, qui force son ombre à réapparaître, l'affaiblissant.",
    butin: 'Griffe de Barghest.',
  },
  {
    num: 40,
    n: 'Chien Noir des Pendus 🐕',
    source: 'tharnea',
    nc: '3',
    pv: 20,
    def: 14,
    init: 14,
    milieu: 'Champs de Bataille & Routes',
    taille: 'Moyenne spectrale (1,40 m)',
    poids: '0 kg (Immatériel)',
    caracs: { FOR: 4, DEX: 4, CON: 3, INT: 1, SAG: 3, CHA: 2 },
    att: 'Morsure spectrale 2d6',
    fam: 'Spectre canin',
    descPhysique:
      'Un canidé spectral aux yeux globuleux et injectés de sang. Une corde de chanvre usée pend autour de son cou éthéré.',
    traits:
      'Molosse fantôme traversant les murs et obstacles en pleine charge.',
    pouvoirs: [
      {
        n: 'Charge spectrale',
        t: 'Peut traverser les murs et les obstacles solides lors de sa course.',
      },
    ],
    tactique:
      "Inarrêtable en terrain complexe. Il redoute le sel et les symboles de l'Ordre, qui le forcent à rester tangible.",
    butin: 'Corde de pendu (maudite).',
  },
  {
    num: 41,
    n: 'Bogart de Pierre 🗿',
    source: 'tharnea',
    nc: '4',
    pv: 26,
    def: 16,
    init: 11,
    milieu: 'Profondeurs & Cryptes',
    taille: 'Massive / Grande (2,30 m)',
    poids: '800 à 1200 kg',
    caracs: { FOR: 6, DEX: 1, CON: 6, INT: 1, SAG: 2, CHA: -1 },
    att: 'Poing de granit & blocs 2d6',
    fam: 'Golem / Élémentaire de pierre',
    descPhysique:
      'Une statue vivante dont la pierre est parcourue de fissures lumineuses instables. Elle se déplace avec un fracas de séisme.',
    traits:
      'Colosse minéral lent mais dévastateur projetant des éclats de son propre corps.',
    pouvoirs: [
      {
        n: 'Jet de blocs',
        t: 'Projette des fragments de son corps avec une force dévastatrice.',
      },
    ],
    tactique:
      'Adversaire robuste. Utilisez des outils de mineur en fer froid pour pénétrer sa défense rocheuse. Il est lent mais dévastateur.',
    butin: 'Fragment de pierre runique.',
  },
  {
    num: 42,
    n: 'Lamia Forme Femme 🐍',
    source: 'tharnea',
    nc: '3',
    pv: 18,
    def: 14,
    init: 14,
    milieu: "L'Obscure",
    taille: 'Moyenne (1,75 m)',
    poids: '65 à 75 kg',
    caracs: { FOR: 2, DEX: 4, CON: 2, INT: 3, SAG: 3, CHA: 5 },
    att: 'Baiser empoisonné 1d12',
    fam: 'Monstre serpentine',
    descPhysique:
      "Une femme d'une beauté surnaturelle, dont les pupilles verticales de reptile et la langue fourchue trahissent la nature monstrueuse.",
    traits:
      'Séductrice ophidienne dissimulant sa forme véritable derrière un masque de grâce.',
    pouvoirs: [
      {
        n: 'Étreinte empoisonnée',
        t: 'Immobilise sa victime tout en injectant un venin affaiblissant.',
      },
    ],
    tactique:
      'Utilise sa séduction pour approcher. Elle craint les miroirs de sel et la lumière pure, qui révèlent son apparence reptilienne.',
    butin: 'Écaille de Lamia.',
  },
  {
    num: 43,
    n: 'Strigoï 🧛',
    source: 'tharnea',
    nc: '5',
    pv: 32,
    def: 16,
    init: 14,
    milieu: 'Profondeurs & Cryptes',
    taille: 'Grande musclée (2,10 m)',
    poids: '130 à 170 kg',
    caracs: { FOR: 5, DEX: 4, CON: 5, INT: 3, SAG: 4, CHA: 5 },
    att: 'Griffes d’obsidienne 2d8',
    fam: 'Vampire bestial',
    descPhysique:
      "Un vampire revenu à l'état bestial, doté d'ongles noirs comme l'obsidienne et d'une musculature hypertrophiée. Il grogne plus qu'il ne parle.",
    traits:
      'Prédateur vampirique bestial drainant durablement la force physique de ses proies.',
    pouvoirs: [
      {
        n: 'Griffes drainantes',
        t: 'Ses attaques réduisent de manière permanente la FOR de la cible.',
      },
    ],
    tactique:
      'Prédateur agressif. Le fer froid et le sel sont indispensables pour contrer sa régénération et sa force brute.',
    butin: 'Croc de Strigoï.',
  },
  {
    num: 44,
    n: 'Lamia Forme Serpent 🐍',
    source: 'tharnea',
    nc: '5',
    pv: 30,
    def: 16,
    init: 13,
    milieu: "L'Obscure",
    taille: 'Grande / Massive (4,00 m de long)',
    poids: '250 à 350 kg',
    caracs: { FOR: 6, DEX: 3, CON: 5, INT: 3, SAG: 4, CHA: 4 },
    att: 'Constriction & crocs 2d10',
    fam: 'Serpent colossal',
    descPhysique:
      "Un corps de serpent géant de quatre mètres, surmonté d'un torse féminin puissant couvert d'écailles sombres et d'ambre.",
    traits:
      'Véritable forme de la Lamia écrasant et empoisonnant ses victimes par constriction.',
    pouvoirs: [
      {
        n: 'Étreinte venimeuse',
        t: 'Écrase ses proies tout en les empoisonnant par contact cutané.',
      },
    ],
    tactique:
      'Isolez les cibles avec sa lutte. Elle est vulnérable au froid intense et aux lames de fer froid.',
    butin: 'Venin de Lamia supérieur.',
  },
  {
    num: 45,
    n: 'Fée Noire 🧚',
    source: 'tharnea',
    nc: '5',
    pv: 32,
    def: 17,
    init: 15,
    milieu: 'Nature, Forêts & Marais',
    taille: 'Petite / Moyenne ailée (1,50 m)',
    poids: '35 à 45 kg',
    caracs: { FOR: 1, DEX: 5, CON: 3, INT: 5, SAG: 4, CHA: 6 },
    att: 'Rayon de décrépitude 2d8',
    fam: 'Fée de corruption',
    descPhysique:
      'Créature ailée aux membres trop longs et aux ailes déchirées, dégageant une aura de charme mortel et de décrépitude.',
    traits:
      'Manipulatrice mentale retournant ses victimes contre elles-mêmes.',
    pouvoirs: [
      {
        n: 'Charme mortel',
        t: "Oblige une cible à la protéger ou à s'infliger des blessures.",
      },
    ],
    tactique:
      'Manipulateur mental. Le fer froid annule ses charmes au contact. Ciblez-la rapidement avec des archers.',
    butin: 'Poussière de fée noire.',
  },
  {
    num: 46,
    n: 'Pendle Glissant',
    source: 'tharnea',
    nc: '5',
    pv: 35,
    def: 15,
    init: 12,
    milieu: "L'Obscure",
    taille: 'Massive informe (Variable)',
    poids: '400 à 600 kg',
    caracs: { FOR: 6, DEX: 2, CON: 6, INT: 1, SAG: 3, CHA: -2 },
    att: 'Engloutissement noir 1d20',
    fam: 'Ooze / Masse de goudron',
    descPhysique:
      "Masse mouvante de boue noire et de goudron occulte, où l'on distingue les silhouettes de ceux qu'elle a déjà absorbés. Elle ne possède pas de forme fixe.",
    traits:
      'Obstacle visqueux informe engloutissant et asphyxiant quiconque s’en approche.',
    pouvoirs: [
      {
        n: 'Asphyxie par boue',
        t: 'Engloutit une cible, lui infligeant des dégâts de suffocation constants.',
      },
    ],
    tactique:
      'Obstacle infranchissable. Elle redoute le feu (qui la durcit) et le sel (qui la dissipe).',
    butin: 'Noyau de goudron occulte.',
  },
  {
    num: 47,
    n: 'Araignée Tisseuse d’Ombre',
    source: 'tharnea',
    nc: '6',
    pv: 38,
    def: 16,
    init: 15,
    milieu: 'Profondeurs & Cryptes',
    taille: 'Grande (3,00 m d’envergure)',
    poids: '200 à 300 kg',
    caracs: { FOR: 4, DEX: 5, CON: 4, INT: 2, SAG: 3, CHA: 1 },
    att: 'Mandibules d’ombre 2d10',
    fam: 'Arachnide de l’Ombre',
    descPhysique:
      "Une araignée de la taille d'un cheval de guerre, dont les pattes semblent faites de fumée solidifiée. Elle tisse des toiles qui capturent les ombres des voyageurs, les laissant physiquement affaiblis.",
    traits:
      'Arachnide des hauteurs capturant les ombres et drainant la magie dans ses toiles.',
    pouvoirs: [
      {
        n: 'Toile de Néant',
        t: 'Immobilise la cible et draine ses points de compétence magique (1d4 par tour).',
      },
      {
        n: 'Pattes d’araignée',
        t: "Capacité innée de se déplacer sur n'importe quelle surface, y compris les plafonds.",
      },
    ],
    tactique:
      'Elle attaque depuis les hauteurs. Sa faiblesse réside dans la lumière pure et les torches, qui brûlent ses toiles immatérielles instantanément.',
    butin: 'Soie d’ombre (rare).',
  },
  {
    num: 48,
    n: 'Araignée Venimeuse du Vide 🕷️',
    source: 'tharnea',
    nc: '6',
    pv: 42,
    def: 17,
    init: 14,
    milieu: 'Le Gouffre & La Faille',
    taille: 'Grande (2,80 m d’envergure)',
    poids: '220 à 320 kg',
    caracs: { FOR: 5, DEX: 4, CON: 5, INT: 2, SAG: 3, CHA: 1 },
    att: 'Venin d’âme 2d10',
    fam: 'Arachnide planaire',
    descPhysique:
      "Son abdomen pulse d'une lueur violette malsaine, révélant les énergies de la Faille qu'elle a ingérées. Ses mandibules dégoulinent d'un venin qui brûle non pas la chair, mais l'âme.",
    traits:
      'Tueuse de héros dont le venin inflige directement des dégâts de corruption à l’âme.',
    pouvoirs: [
      {
        n: 'Venin de Faille',
        t: 'Inflige des dégâts de corruption directs à chaque morsure réussie (test de CO).',
      },
    ],
    tactique:
      "Tueuse de héros. Ciblez les PJ les plus corrompus. Elle possède une vulnérabilité critique au sel et aux armes bénies par l'Ordre.",
    butin: 'Glande de venin du vide.',
  },
  {
    num: 49,
    n: 'Reine des Araignées du Gouffre 👑',
    source: 'tharnea',
    nc: '7',
    pv: 45,
    def: 18,
    init: 14,
    milieu: 'Le Gouffre & La Faille',
    taille: 'Titanesque / Massive (6,00 m d’envergure)',
    poids: '1500 à 2500 kg',
    caracs: { FOR: 6, DEX: 4, CON: 6, INT: 3, SAG: 4, CHA: 3 },
    att: 'Broyeur abyssal 1d20',
    fam: 'Seigneur Arachnide',
    descPhysique:
      "Une monstruosité titanesque, souveraine absolue des profondeurs de la Faille. Son dos porte des milliers d'yeux rouges qui observent simultanément toutes les réalités. Elle dégage une aura de terreur ancestrale.",
    traits:
      'Souveraine titanesque des abysses se téléportant à travers ses toiles dimensionnelles.',
    pouvoirs: [
      {
        n: 'Marche Dimensionnelle',
        t: 'Peut se téléporter instantanément vers toute surface couverte de ses toiles dans la zone.',
      },
      {
        n: 'Domination du Gouffre',
        t: 'Sa présence impose un malus de -2 à tous les jets de moralité des PJ.',
      },
    ],
    tactique:
      "Boss final. Utilisez sa masse pour écraser et ses pouvoirs pour isoler les attaquants. Elle ne peut être vaincue que par l'usage combiné de la Lumière pure et de reliques majeures.",
    butin: 'Œil de la Reine (Artéfact légendaire).',
  },
  {
    num: 50,
    n: 'TOM VADOR OMBRAGE',
    source: 'tharnea',
    nc: '8',
    pv: 65,
    def: 17,
    init: 12,
    milieu: 'Figures Majeures / Manoir Blakthorn',
    taille: 'Moyenne (1,85 m)',
    poids: '80 à 95 kg',
    caracs: { FOR: 1, DEX: 2, CON: 2, INT: 3, SAG: 2, CHA: 4 },
    att: 'Lame d’Effroi en Fer Froid +5 (1d12+2 tranchant + 1d6 nécrotique)',
    fam: 'Antagoniste Majeur / Cercle Voilé',
    vitesse: '9 m',
    sauvegardes: 'SAG +5, CHA +7',
    resistances: 'Dégâts nécrotiques, Dégâts psychiques',
    descPhysique:
      "Silhouette longiligne, drapée dans une aube cléricale blanche immaculée sur le haut, mais dont le bas est calciné, se désintégrant constamment en volutes de cendres flottantes et d'encre noire. • Le Masque-Miroir : plaque d'acier poli à la surface mouvante qui projette les visages blêmes des enfants sacrifiés du manoir ou les pires remords de ceux qui le regardent. • Le Pas du Miroir : apparaît soudainement dans n'importe quelle surface réfléchissante — un miroir cassé du manoir, la flasque d'alcool de Hugolin ou la lame d'une épée.",
    traits:
      'L’Inquisiteur-Miroir, Grand Conservateur de la Faille. Haut dignitaire du Cercle Voilé qui pactisa avec son double de l’Obscure. « Votre douleur n’est qu’une donnée statistique dans l’équilibre du monde. »',
    pouvoirs: [
      {
        n: 'Bouclier de Chair',
        t: 'Transfère les dégâts reçus à un garde ou une invocation d’ombre à proximité.',
      },
      {
        n: 'Aura de Cendres & Décrets',
        t: 'Désavantage aux PJ au corps à corps (cendres suffocantes). Peut citer un article de loi : test de Sagesse DD 13 ou malus -2 pour "non-respect des procédures".',
      },
      {
        n: 'Lame d’Effroi en Fer Froid',
        t: 'Attaque au corps à corps (+5 toucher, 1d12+2 + 1d6 nécrotique). Test de Charisme DD 14 ou paralysie par l’horreur des souvenirs.',
      },
      {
        n: 'Écho du Manoir (Recharge 5-6)',
        t: 'Impulsion psychique à travers son masque : test de Sagesse DD 15 ou 3d6 dégâts psychiques + Effrayé et immobilisé 1 tour.',
      },
      {
        n: 'Pas du Miroir',
        t: 'Se téléporte d’une surface réfléchissante à une autre (miroir brisé, lame polie, flasque métallique) dans la zone.',
      },
    ],
    tactique:
      'Domine le terrain en dictant les règles et en invoquant les traumatismes des PJ. Utilise sa connaissance de leurs dossiers personnels pour briser leur volonté avant même le premier assaut.',
    origineNarratif:
      'Ancien haut dignitaire du Cercle Voilé (Haut Conseil Luminal) supervisant les expériences du Manoir Blakthorn. A conclu un pacte avec son double de l’Obscure. Considère les PJ comme des « variables imprévues » ou des « rebuts de laboratoire ».',
    liensPj:
      '• Elyndra : l’appelle « Petite Infirmière », son masque projette le visage des enfants qu’elle soignait.\n• Merline : signataire de l’édit de « Récupération de l’Enfant », la qualifie de « ressource magique gaspillée ».\n• Hachlys : rival politique au sein de l’Ordre ; lui propose une place de Haute Matriarche si elle trahit.\n• Sashou : insinue avoir orchestré l’explosion de l’atelier de son maître (« gamin explosif »).\n• Hugolin : a ordonné le « nettoyage » où Brigitte a péri, le qualifiant de « perte collatérale mineure ».',
    secret:
      'La Logistique du Néant : il n’y a aucun visage sous le masque, juste un vide noirci. Le véritable Tom Vador est mort depuis des années ; cette entité est un égrégore né de la culpabilité de l’Ordre. Il convoite le titre de Grand Conservateur de l’Arbre-Cœur et veut fusionner Tharnéa et l’Obscure.',
    butin: 'Masque-Miroir brisé, Décrets du Cercle Voilé, Lame d’Effroi en Fer Froid.',
  },
  {
    num: 51,
    n: 'TÉO, LE VEILLEUR DES LÉGENDES',
    source: 'tharnea',
    nc: '1',
    pv: 5,
    def: 13,
    init: 13,
    milieu: 'Figures Majeures / Allié Mascotte',
    taille: 'Petite enfant (1,35 m - 10 ans)',
    poids: '35 kg',
    caracs: { FOR: 0, DEX: 3, CON: 0, INT: 1, SAG: 1, CHA: 2 },
    att: 'Fronde de fortune & caillou pointu +4 (1d3)',
    fam: 'Allié du Groupe / Apprenti Aventurier',
    vitesse: '7 m',
    sauvegardes: 'SAG +5, CHA +7',
    descPhysique:
      "L'Enfant de la Fange (10 ans), petite taille, tignasse brune ébouriffée, peau hâlée et taches de rousseur couvertes de cendre. • Armure de Fortune : vieux tablier de cuir trop grand volé à l'arrière-boutique de l'auberge, rembourré de ficelles, de billes et de morceaux de craie. • Regard Clair : yeux noisette brillants d'une détermination sans faille. • Le Barda : vieille sacoche en toile usée (« son antre aux trésors »).",
    traits:
      'Gamin d’Elden, mascotte, assistant logistique et boussole morale de l’escouade face à la Faille. « Regardez-moi ! Je n’ai pas de pouvoirs, je n’ai que 10 ans... mais je n’ai pas peur de leur Faille ! »',
    pouvoirs: [
      {
        n: 'Jet de Caillou (Action)',
        t: 'Attaque +4 à 5/15 m (1d3 contondant). Vise les yeux pour créer une distraction (octroie avantage au prochain allié).',
      },
      {
        n: 'Raccourcis de l’Aubergiste (Passif)',
        t: 'Bonus +2 en Discrétion pour le groupe à Elden, temps de trajet urbain divisé par deux.',
      },
      {
        n: 'Sac de Munitions (1 / Session)',
        t: 'Lance un objet crucial à 6 m : fiole d’huile, kit de soins d’urgence, billes pour trébucher, ou torche prête.',
      },
      {
        n: 'Décret d’Amitié (Bonus)',
        t: 'Harangue ses compagnons avec les Légendes de la Rue : bonus +2 Volonté et supprime l’état Effrayé d’un allié.',
      },
    ],
    tactique:
      'Soutien logistique et moral. Ne doit jamais combattre au contact direct. Reste à couvert pour ravitailler les héros et leur redonner espoir quand le groupe sombre.',
    origineNarratif:
      'Fils de Garom, tavernier du « Sanglier Assoupi » à Elden. A survécu seul face à une Ombre-Fendue et suit désormais l’escouade comme mascotte et assistant logistique.',
    liensPj:
      '• Hugolin : son idole absolue, son « chevalier blanc ».\n• Sashou : son « Maître Alchimiste » admiré.\n• Elyndra : la « Sainte des Ruines » en qui il place une confiance aveugle.\n• Hachlys : la « Voix de la Lumière ».\n• Merline : la « Protectrice de l’Arbre-Cœur ».',
    secret:
      'Cache sous sa paillasse une Pierre de Chance bleutée ramassée après l’attaque de l’Ombre-Fendue, ainsi qu’une Épée de bois des Promesses sur laquelle il a gravé au couteau les cinq noms : Hugolin, Sashou, Elyndra, Hachlys, Merline.',
    butin: 'Pierre de Chance bleutée, Épée de bois des Promesses (objet affectif sacré).',
  },
  {
    num: 52,
    n: 'VARN le Protecteur',
    source: 'tharnea',
    nc: '5',
    pv: 55,
    def: 18,
    init: 10,
    milieu: 'Figures Majeures / Allié Souverain',
    taille: 'Massive / Grande (2,20 m)',
    poids: '200 à 250 kg (avec armure)',
    caracs: { FOR: 4, DEX: 0, CON: 3, INT: 1, SAG: 2, CHA: 1 },
    att: 'Masse runique de magma +6 (1d10+4)',
    fam: 'Allié Légendaire / Souverain de Kalgard',
    vitesse: '6 m (Lourd mais stable)',
    sauvegardes: 'SAG +5, CHA +7',
    descPhysique:
      "Colosse de 2,20 m sculpté dans la roche volcanique, vêtu de plaques noires et rouges gravées de runes de stabilisation incandescente. Coiffé d'un Heaume d'Ours aux yeux luisants d'orange braise, il porte un monumental bouclier runique capable de couvrir deux alliés à la fois.",
    traits:
      'Souverain de Kalgard dans l’Obscure, Maître des Fortifications et de la Forge de Magma. « Tenez bon derrière mon bouclier, je serai votre muraille jusqu’à ce que la forge s’éteigne. »',
    pouvoirs: [
      {
        n: 'Interception Runique (Réaction)',
        t: 'Lorsqu’un allié à 2 m est attaqué, Varn s’interpose et subit l’attaque à sa place avec réduction de 1d6 des dégâts.',
      },
      {
        n: 'Muraille Vivante (Passif)',
        t: 'Tant que Varn est adjacent à un PJ, ce PJ gagne un bonus de +2 à sa Classe d’Armure (CA/DEF).',
      },
      {
        n: 'Cri de Ralliement (Action, 1/combat)',
        t: 'Tous les alliés qui l’entendent regagnent 1d8 PV temporaires et sont immunisés à la Peur pendant 2 tours.',
      },
    ],
    tactique:
      'Pilier défensif absolu — l’Ancre qui tient le front. Protège prioritairement les blessés et lanceurs de sorts.',
    origineNarratif:
      'Souverain de Kalgard dans l’Obscure, Maître des Fortifications et de la Forge de Magma. Dans Tharnéa, la cité de Varnheim fut édifiée et nommée en sa mémoire.',
    liensPj:
      '• Hugolin : respecte profondément sa résilience ; considère la gourde de Brigitte comme un véritable « Ancrage de l’Âme ».\n• Sashou : le surnomme « Apprenti du Feu » et s’intéresse aux minerais de Kalgard.\n• Elyndra : l’appelle « La Suture du Monde ».\n• Hachlys : lui rappelle que « la vraie lumière ne brûle pas, elle réchauffe ceux qui ont froid ».\n• Merline : voit son lien à l’Arbre-Cœur comme une défense vitale pour les deux mondes.',
    secret:
      'Varn est physiquement lié à la muraille de Bastion-Souffle : s’il s’éloigne trop longtemps des terres du Sud, son corps se pétrifie lentement. Il accepte sereinement de devenir un jour la statue-frontière éternelle.',
    butin: 'Armure de plaques runique, Bouclier de Kalgard, Masse runique de magma.',
  },
  {
    num: 53,
    n: 'Le Malin',
    source: 'tharnea',
    nc: '9',
    pv: 100,
    def: 19,
    init: 12,
    milieu: "Figures Majeures / Boss Suprême de l'Obscure",
    taille: 'Colossale (3,00 m)',
    poids: '450 à 600 kg',
    caracs: { FOR: 6, DEX: 2, CON: 5, INT: 5, SAG: 4, CHA: 6 },
    att: 'Griffes du Néant Pur +8 (2d10 + 1 pt de Corruption direct)',
    fam: 'Entité Métaphysique / Boss Divin (Danger 6+)',
    vitesse: '10 m',
    sauvegardes: 'SAG +5, CHA +7',
    descPhysique:
      "Silhouette colossale et changeante haute de 3 mètres, drapée dans une peau d'obsidienne noire et de cendre mate parcourue de veines de magma écarlate. Son dos déploie un Manteau d'Écailles fait d'ailes vivantes de dragon ancien. • Regard du Vide : deux pupilles verticales jaunes scrutant simultanément Tharnéa et l'Obscure. • Aura Primordiale : odeur écrasante de soufre, de sang pur et d'ozone.",
    traits:
      'Souverain de la Nuit Éternelle, Père des Dragons & Racine de l’Arbre-Cœur. « Sans moi, votre lumière ne serait qu’un aveuglement. Je suis le repos que vous craignez mais dont vous avez besoin. »',
    pouvoirs: [
      {
        n: 'L’Appel du Miroir / Reflet du Paradoxe',
        t: 'Force un PJ à affronter son propre double issu de l’Obscure pendant 2 tours complets avec statistiques inversées.',
      },
      {
        n: 'Domination Draconique',
        t: 'Souffle d’ombre dévastateur dans un cône de 10 m : 4d6 dégâts de froid nécrotique (Jet de SAG DD 16 pour demi-dégâts).',
      },
      {
        n: 'Griffes du Néant Pur',
        t: 'Frappe dévastatrice (+8 toucher, 2d10 dégâts + 1 point de Corruption direct sur la victime).',
      },
    ],
    tactique:
      'Boss cosmique. Frappe avec un détachement métaphysique glaçant. Utilise les miroirs, les doubles d’ombre et les révélations personnelles pour ébranler les convictions des héros.',
    origineNarratif:
      'Écho primordial du monde miroir régnant sur Orynthal, Morthalia et Kalgard. Architecte secret du Pacte des Sorcières ayant donné naissance à Amon. Voit Tharnéa comme une « ébauche ratée » et une « brûlure de lumière » et nourrit délibérément la Faille.',
    liensPj:
      '• Amon : le « Père » dont la voix résonne jusque dans ses cauchemars.\n• Merline : la surnomme « La Petite Voleuse de Cendres ».\n• Hachlys : seul être capable de la réduire au silence ; qualifie sa Lumière de « parasite ».\n• Sashou : prétend que son maître le sert volontairement au Palais des Glaces.\n• Hugolin : l’entité qui murmure au fond de sa gourde que Brigitte a été « sacrifiée par la Lumière ».',
    secret:
      'L’Ancre de l’Existence : Le Malin empêche l’Arbre-Cœur de se consumer. Si la Lumière l’emporte totalement, le monde explose par rupture d’équilibre ; si l’Obscure triomphe seule, tout sombre dans le silence éternel. Il maintient la Faille ouverte pour empêcher leur annihilation mutuelle.',
    butin: 'Écailles de Dragon Primordial, Fragment de l’Arbre-Cœur Noir.',
  },
  {
    num: 54,
    n: 'Soldat du Royaume',
    source: 'tharnea',
    nc: '2',
    pv: 22,
    def: 15,
    init: 12,
    milieu: 'Factions Humaines & Gardes',
    taille: 'Moyenne (1,75 m)',
    poids: '75 à 90 kg',
    caracs: { FOR: 3, DEX: 2, CON: 3, INT: 1, SAG: 2, CHA: 2 },
    att: 'Épée longue 1d8+2 ou Lance 1d10',
    fam: 'Humain / Armée du Roi',
    descPhysique:
      "Un combattant professionnel discipliné, sanglé dans une armure de cuir renforcé ou une cotte de mailles bien entretenue. Il porte l'emblème royal (lion, tour ou épée). Son regard balaye constamment les ombres pour parer aux incursions de la Faille.",
    traits:
      'Troupe régulière disciplinée de l’Armée du Roi, entraînée au combat en formation serrée.',
    pouvoirs: [
      {
        n: 'Mur de Boucliers (Passif)',
        t: 'Adjacent à un autre soldat (#54/#55) ou un PJ, il gagne +2 à sa DEF contre les attaques au corps à corps.',
      },
      {
        n: 'Discipline de Fer',
        t: 'Avantage sur ses jets de sauvegarde contre la Peur tant qu’un officier ou sergent se trouve à moins de 18 m.',
      },
      {
        n: 'Frappe Coordonnée',
        t: 'Si sa cible est déjà engagée au corps à corps par un allié, ajoute +2 aux dégâts.',
      },
    ],
    tactique:
      'Ne combat jamais seul. Garde la ligne de front, sécurise les accès sensibles (Manoir Blakthorn, portes urbaines) et obéit strictement aux ordres reçus.',
    butin: '1 Argent et 5 Airain (solde militaire), Épée longue, Insigne de régiment.',
  },
  {
    num: 55,
    n: 'Soldat d’Élite',
    source: 'tharnea',
    nc: '4',
    pv: 35,
    def: 17,
    init: 12,
    milieu: 'Factions Humaines & Gardes d’Élite',
    taille: 'Grande imposante (1,90 m)',
    poids: '100 à 120 kg',
    caracs: { FOR: 4, DEX: 2, CON: 4, INT: 2, SAG: 2, CHA: 3 },
    att: 'Épée Longue de Maître 1d10+3',
    fam: 'Humain / Vétéran d’Élite',
    descPhysique:
      "Un guerrier aguerri portant une armure de plaques complète ornée du blason doré de l'Ours ou du soleil de l'Ordre de la Lumière. Sa cape sombre est marquée par les campagnes contre la Faille.",
    traits:
      'Vétéran aguerri encadrant la troupe ou assurant la garde rapprochée des commandants.',
    pouvoirs: [
      {
        n: 'Discipline d’Acier (Passif)',
        t: 'Immunisé à la Peur mineure et bénéficie de l’Avantage contre les illusions.',
      },
      {
        n: 'Coup de Bouclier (Réaction)',
        t: 'Tente de renverser l’assaillant au corps à corps (Test de Force SR 14).',
      },
      {
        n: 'Cri de Commandement',
        t: 'Tous les alliés Soldats (#54) à moins de 9 m gagnent +5 PV temporaires et +1 aux jets d’attaque.',
      },
    ],
    tactique:
      'Chef de terrain. Isole les cibles prioritaires (comme Merline ou Amon) et forme des murs de fer pour briser les charges ennemies.',
    butin: '2 Argent et 10 Airain, Épée Longue de Maître, Insigne de commandement (+2 Persuasion militaire).',
  },
  {
    num: 56,
    n: 'Chef d’armée / Général',
    source: 'tharnea',
    nc: '6',
    pv: 60,
    def: 18,
    init: 12,
    milieu: 'Commandement Suprême de Terrain',
    taille: 'Grande (1,95 m)',
    poids: '110 à 130 kg',
    caracs: { FOR: 5, DEX: 2, CON: 5, INT: 3, SAG: 4, CHA: 5 },
    att: 'Épée de Commandement 1d12+4',
    fam: 'Humain / Officier Général',
    descPhysique:
      "Un officier rayonnant d'une autorité naturelle, drapé dans une cape épaisse aux couleurs d'Eldenar ou d'Aldrion, portant une armure d'apparat finement gravée de scènes de victoires anciennes.",
    traits:
      'Officier supérieur stratège commandant des armées entières sur le front.',
    pouvoirs: [
      {
        n: 'Aura de Discipline (Passif)',
        t: 'Tous ses alliés dans un rayon de 15 m sont immunisés à la Peur et gagnent +2 en attaque.',
      },
      {
        n: 'Appel de la Bannière (1/combat)',
        t: 'Invoque une escouade de renforts (2 Soldats #54 ou 1 Soldat d’Élite #55) qui arrive en 1 tour.',
      },
      {
        n: 'Tactique de Tenaille',
        t: 'Désigne une cible prioritaire : tous ses subordonnés bénéficient de l’Avantage pour la toucher.',
      },
    ],
    tactique:
      'Boss de terrain / Rencontre majeure. Reste au cœur de ses troupes protégé par ses gardes d’élite. Peut être retourné par la diplomatie ou la révélation des secrets de l’Ordre (Hachlys).',
    butin: '5 Argent et 20 Airain, Épée de Commandement (+2 Intimidation), Sceau du Connétable.',
  },
  {
    num: 57,
    n: 'Villageois de Tharnéa',
    source: 'tharnea',
    nc: '1/2',
    pv: 8,
    def: 10,
    init: 12,
    milieu: 'Urbain & Ruines',
    taille: 'Moyenne (1,70 m)',
    poids: '65 à 80 kg',
    caracs: { FOR: 2, DEX: 2, CON: 2, INT: 1, SAG: 1, CHA: 1 },
    att: 'Outil agricole ou couteau 1d4',
    fam: 'Civil de Tharnéa',
    descPhysique:
      "Un habitant ordinaire en tenue modeste de laine épaisse ou de cuir usé. Son visage est marqué par le labeur et une inquiétude sourde liée au crépuscule éternel qui envahit l'horizon.",
    traits:
      'Incarne la résilience simple de Tharnéa face à l’effacement du monde et aux ravages de la Faille.',
    pouvoirs: [
      {
        n: 'Solidarité du Labeur (Passif)',
        t: 'Gagne l’Avantage contre la Peur lorsqu’il est entouré d’au moins deux autres villageois.',
      },
      {
        n: 'Cri d’Alerte',
        t: 'Pousse un cri strident qui alerte la Milice ou les PJ dans un rayon de 100 m.',
      },
      {
        n: 'Appel de la Terre',
        t: 'Inflige +1 dégât supplémentaire s’il défend son propre village ou sa famille.',
      },
    ],
    tactique:
      'Enjeu narratif. Cherche avant tout à fuir ou se cacher. Sert au MJ pour tester la moralité des PJ ou récompenser un secours sincère par des rumeurs précieuses sur Elden ou Nareth.',
    butin: '2 à 8 Airain, objet du quotidien, porte-bonheur ou information locale précieuse.',
  },
  {
    num: 58,
    n: 'Bandit des Terres Dévastées',
    source: 'tharnea',
    nc: '2',
    pv: 18,
    def: 13,
    init: 13,
    milieu: 'Factions Humaines & Hors-la-loi',
    taille: 'Moyenne (1,75 m)',
    poids: '70 à 85 kg',
    caracs: { FOR: 3, DEX: 3, CON: 2, INT: 1, SAG: 1, CHA: 1 },
    att: 'Épée courte 1d6 ou Arbalète 1d8',
    fam: 'Humain / Brigand',
    descPhysique:
      "Un survivant endurci portant des cuirs rapiécés et des morceaux d'armures volés sur les décombres des batailles passées. Un foulard sombre cache le bas de son visage.",
    traits:
      'Pillard pragmatique profitant du chaos laissé par la Faille le long des routes marchandes.',
    pouvoirs: [
      {
        n: 'Coup Bas (Passif)',
        t: 'Avantage sur ses jets d’attaque si la cible est déjà engagée au corps à corps par un allié.',
      },
      {
        n: 'Loyauté Variable',
        t: 'Si ses PV tombent sous la moitié ou si son chef (#59) est abattu, test de SAG pour ne pas fuir immédiatement.',
      },
      {
        n: 'Instinct de Survie',
        t: 'Ignore les malus de déplacement liés au terrain difficile dans les ruines et sous-bois denses.',
      },
    ],
    tactique:
      'Harcèle à distance à l’arbalète avant de charger les héros blessés. Cible en priorité les porteurs de sacs visibles ou les alchimistes comme Sashou.',
    butin: '10 à 20 Airain, outil de crochetage ou babiole volée à des voyageurs.',
  },
  {
    num: 59,
    n: 'Chef Bandit (Maître des Pillards)',
    source: 'tharnea',
    nc: '4',
    pv: 30,
    def: 15,
    init: 13,
    milieu: 'Factions Humaines & Hors-la-loi',
    taille: 'Grande (1,85 m)',
    poids: '90 à 110 kg',
    caracs: { FOR: 4, DEX: 3, CON: 3, INT: 2, SAG: 2, CHA: 3 },
    att: 'Épée longue 1d10+2 ou Arbalète lourde 2d6',
    fam: 'Humain / Vétéran déserteur',
    descPhysique:
      "Un vétéran balafré d'une ancienne guerre de faction, portant un cuir clouté renforcé d'épaulières en acier dépareillées. Il ne parle que pour donner des ordres brefs et brutaux.",
    traits:
      'Ancien officier déserteur tenant sa bande de pillards par la peur et le butin.',
    pouvoirs: [
      {
        n: 'Commandement Brutal (Aura)',
        t: 'Les alliés bandits (#58) dans un rayon de 10 m gagnent +1 à leurs jets d’attaque.',
      },
      {
        n: 'Parade de Vétéran (Réaction)',
        t: 'Une fois par tour, ajoute +2 à sa DEF contre une attaque au corps à corps.',
      },
      {
        n: 'Coup Bas Amélioré',
        t: 'Inflige +1d6 dégâts supplémentaires sur une cible déjà engagée par un autre brigand.',
      },
    ],
    tactique:
      'Tacticien opportuniste. Sacrifie ses hommes sans hésiter si le combat tourne mal pour négocier sa fuite avec le trésor (ou des renseignements sur Vharok / Tirwald).',
    butin: '3 Argent et 15 Airain, Clé des Terres Dévastées (ouvre un coffre caché), Épée militaire.',
  },
  {
    num: 60,
    n: 'OURS Vert (Garde d’Élite de Norvhal)',
    source: 'tharnea',
    nc: '5',
    pv: 45,
    def: 18,
    init: 11,
    milieu: 'Factions Humaines & Gardes d’Élite',
    taille: 'Massive / Grande (2,30 m)',
    poids: '180 à 220 kg',
    caracs: { FOR: 5, DEX: 1, CON: 5, INT: 1, SAG: 3, CHA: 1 },
    att: 'Hache de Fer Froid 1d12+3',
    fam: 'Colosse d’Élite de Norvhal',
    descPhysique:
      "Un colosse engoncé dans une armure de plaques complète d'un vert profond et d'argent poli. Son heaume est sculpté en forme de tête d'ours rugissant, et son bouclier colossal porte l'emblème de l'ours blanc de Norvhal. Il a prêté serment de ne jamais montrer son visage.",
    traits:
      'Garde d’élite assermenté de Norvhal armé pour traquer toute trace de l’Obscure.',
    pouvoirs: [
      {
        n: 'Discipline de Fer (Passif)',
        t: 'Totalement immunisé à la Peur et au Charme.',
      },
      {
        n: 'Mur de Fer',
        t: 'Avec son bouclier colossal, peut annuler totalement les dégâts d’une attaque de PJ sur un test de FOR réussi (SR 14).',
      },
      {
        n: 'Frappe de Fer Froid',
        t: 'Sa hache inflige +1d6 dégâts supplémentaires contre toute créature ou adepte de l’Obscure ou de la Faille.',
      },
    ],
    tactique:
      'Forteresse ambulante. Cible en priorité les PJ qui manipulent la magie de l’ombre (Amon) ou l’alchimie étrange (Sashou). Sensible aux attaques d’acide ou d’alchimie corrosive.',
    butin: 'Languette de Fer Froid, Insigne de l’Unité de l’Ours (+2 relations avec la cité de Norvhal).',
  },
  {
    num: 61,
    n: 'Ours Sanglant',
    source: 'tharnea',
    nc: '6',
    pv: 50,
    def: 17,
    init: 11,
    milieu: 'Factions Humaines & Gardes d’Élite',
    taille: 'Massive / Grande (2,30 m)',
    poids: '200 à 240 kg',
    caracs: { FOR: 5, DEX: 1, CON: 5, INT: 1, SAG: 2, CHA: 2 },
    att: 'Hache de Fer Noir 2d6',
    fam: 'Guerrier déchu corrompu',
    descPhysique:
      "Un ancien garde d'élite de Norvhal déchu. Son armure, autrefois vert éclatant, est désormais maculée de sang séché et gravée de runes de trahison. Son heaume d'ours semble hurler en permanence, figé par le souffle corrompu de la Faille.",
    traits:
      'Colosse corrompu par la Faille, rongé par une rage inextinguible et une force chaotique.',
    pouvoirs: [
      {
        n: 'Cri de Chute (1/combat)',
        t: 'Pousse un rugissement de désespoir : les PJ à moins de 6 m doivent réussir un test de SAG (SR 13) ou subir -2 DEF pour tout le combat.',
      },
      {
        n: 'Force du Chaos',
        t: 'Si ses PV tombent sous 20, gagne l’Avantage sur toutes ses attaques mais perd 2 points de DEF.',
      },
      {
        n: 'Armure du Néant',
        t: 'Réduit de 3 tous les dégâts physiques subis (sauf Fer Froid ou Argent pur).',
      },
    ],
    tactique:
      'Guerrier brutal attaquant de front sans repli. Cherche systématiquement le combattant le plus fort physiquement. Vulnérable aux sorts de Lumière pure (Hachlys).',
    butin: 'Heaume de l’Ours Sanglant (Artéfact rare : confère immunité à la Peur mais impose +1 Corruption permanente tant qu’il est porté).',
  },
];

export const THARNEA_ARTIFACTS: Equipment[] = [
  // --- Reliques & Objets Magiques ---
  {
    n: 'Amulette contre le Froid',
    source: 'tharnea',
    cat: 'Talisman',
    type: 'Talisman',
    activation: 'Contact avec la peau',
    duree: 'Indéterminée',
    prix: '350 pa',
    desc: 'Immunité totale aux rigueurs et intempéries glaciales naturelles. Réduit de moitié tous les dégâts de froid magique.',
    limite: 'Inefficace contre le froid d’origine divine primordiale ou artefact ancien.',
  },
  {
    n: 'Plume d’Écriture Inusable',
    source: 'tharnea',
    cat: 'Outil magique',
    type: 'Outils',
    activation: 'Écriture',
    duree: 'Indéterminée',
    prix: '80 pa',
    desc: 'Écrit sans jamais manquer d’encre et ne s’émousse jamais. Peut tracer sur presque toute surface non-magique. Effaçable uniquement par celui qui l’a utilisée.',
  },
  {
    n: 'Miroir de Poche des Faux-Visages',
    source: 'tharnea',
    cat: 'Artéfact de Révélation',
    type: 'Révélation',
    activation: '1 fois entre 2 Repos Longs',
    duree: '1 tour',
    prix: '250 pa',
    desc: 'Révèle instantanément les illusions, métamorphoses et créatures invisibles dans un cône de 3 mètres.',
  },
  {
    n: 'Sac sans Fond de Tharnéa',
    source: 'tharnea',
    cat: 'Contenant magique',
    type: 'Contenant',
    activation: 'Permanent',
    prix: '500 pa',
    desc: 'Peut contenir jusqu’à 200 kg d’objets non vivants. Le poids porté reste constant à 5 kg.',
    limite: 'Risque : Si surchargé au-delà de sa limite, il recrache son contenu de façon explosive et aléatoire.',
  },
  {
    n: 'Clochette des Frémissements',
    source: 'tharnea',
    cat: 'Objet de Détection',
    type: 'Détection',
    activation: 'Automatique si libre de mouvement',
    duree: 'Indéterminée',
    prix: '150 pa',
    desc: 'Tinte faiblement et de manière argentée en présence de magie mineure (objets enchantés, glyphes ou illusions actives) dans un rayon de 5 m.',
    limite: 'Ne détecte pas les magies majeures volontairement dissimulées.',
  },
  {
    n: 'Talisman de Chance',
    source: 'tharnea',
    cat: 'Talisman',
    type: 'Talisman',
    activation: 'Frottement et concentration (1x entre 2 Repos Longs)',
    duree: 'Instantané',
    prix: '200 pa',
    desc: 'Permet d’ajouter +1 à un jet de dé après avoir vu le résultat, mais avant la résolution narrative du MJ.',
  },
  {
    n: 'Lame Noire Fragile',
    source: 'tharnea',
    cat: 'Arme',
    type: 'Arme instable',
    dm: '1d6 + 1d4 (Bonus)',
    crit: '19-20',
    prix: '120 pa',
    activation: 'Action bonus',
    desc: 'Pendant 1 combat : peut infliger +1d4 dégâts supplémentaires par coup en action bonus.',
    limite: 'À la fin du combat : lancer 1d6. Sur un résultat de 1 ou 2, la lame se fissure et tombe en poussière noire inutilisable.',
  },
  {
    n: 'Pierres de Rappel Jumelles',
    source: 'tharnea',
    cat: 'Artéfact',
    type: 'Téléportation',
    activation: 'Briser l’une des pierres',
    duree: 'Instantané (Usage unique)',
    prix: '400 pa',
    desc: 'Briser l’une des pierres téléporte instantanément le porteur et tout ce qu’il touche à l’endroit exact où repose la seconde pierre.',
    limite: 'Après usage : les 2 pierres tombent en poussière.',
  },
  {
    n: 'Anneau du Silence Creux',
    source: 'tharnea',
    cat: 'Artéfact précieux',
    type: 'Artéfact à usage unique',
    activation: 'Caresse du pouce et concentration',
    duree: 'Scène de combat / 5 minutes',
    prix: '250 pa',
    desc: 'Crée une sphère translucide de 10 m de diamètre. Aucun son ne peut en sortir ni y pénétrer. Toutes les incantations verbales échouent automatiquement sauf réussite d’un jet de Volonté.',
  },
  {
    n: 'Flacon de Brume Égarée',
    source: 'tharnea',
    cat: 'Consommable',
    type: 'Consommable',
    isConsumable: true,
    activation: 'Briser le flacon scellé',
    prix: '90 pa',
    desc: 'Libère un nuage vaporeux qui matérialise et retrace lumineusement les derniers pas d’une cible passée par là.',
  },
  {
    n: 'Pendentif d’Ombre',
    source: 'tharnea',
    cat: 'Talisman',
    type: 'Talisman',
    activation: 'Frottement (1x entre 2 Repos Longs)',
    prix: '180 pa',
    desc: 'Accorde +1 passif aux tests de Discrétion. Une fois entre deux Repos Longs, permet de devenir quasi-indiscernable dans la pénombre pendant 1 tour.',
  },
  {
    n: 'Dague de Tribut Sombre',
    source: 'tharnea',
    cat: 'Arme',
    type: 'Arme sacrificielle',
    dm: '1d4 + 1d8 (Bonus vital)',
    crit: '20',
    prix: '300 pa',
    activation: 'En action bonus',
    desc: 'En action bonus, le porteur peut ajouter +1d8 dégâts nécrotiques à ses frappes.',
    limite: 'Chaque attaque absorbe 1 PV du porteur. Si le porteur tombe à 0 PV à cause de l’arme, celle-ci s’éteint définitivement.',
  },
  {
    n: 'Orbe du Serment Nu',
    source: 'tharnea',
    cat: 'Artéfact légendaire',
    type: 'Artéfact de vérité',
    activation: 'Incantation : « Vitra orbo, veron montru; mensoge mallumiĝu » (« Orbe de verre, montre la vérité ; au mensonge, obscurcis-toi. »)',
    prix: '650 pa',
    desc: 'Révèle le mensonge d’une cible située à 3 mètres ou moins. Si la cible ment sciemment, l’orbe noircit et émet une sourde vibration (sans la forcer à parler).',
  },
  {
    n: 'Sablier du Ralentissement',
    source: 'tharnea',
    cat: 'Artéfact temporel',
    type: 'Artéfact',
    activation: 'Retourner volontairement le sablier',
    duree: '1 fois (Usage unique)',
    prix: '300 pa',
    desc: 'Une cible désignée à 6 m max voit son mouvement réduit à 0 et subit un Désavantage à toutes ses actions pendant 1 tour complet. Après usage, le sablier s’effondre en un tas de sable inerte.',
  },
  {
    n: 'Cape Absorbante',
    source: 'tharnea',
    cat: 'Vêtement magique',
    type: 'Vêtement de protection',
    def: 1,
    activation: 'Automatique à la première attaque magique ciblée',
    prix: '450 pa',
    desc: 'Absorbe entièrement 1 attaque offensive magique ciblée dirigée contre le porteur. Après usage, le tissu se consume partiellement et perd sa magie.',
  },
  {
    n: 'Potion de Guérison Majeure',
    source: 'tharnea',
    cat: 'Consommable',
    type: 'Gélule / Potion',
    isConsumable: true,
    prix: '150 pa',
    desc: 'Restaure immédiatement 1d8 PV Maximum au buveur sans temps d’attente.',
  },
  {
    n: 'Anneau d’Invisibilité (« Mon Précieux »)',
    source: 'tharnea',
    cat: 'Bijou maudit',
    type: 'Bijou',
    activation: 'Porter au majeur gauche et le brandir en évidence',
    prix: '600 pa',
    desc: 'Rend invisible pour 1 tour minimum. Se dissipe si le doigt est baissé, si une attaque ou une action agressive est portée.',
    limite: 'Risque occulte : L’anneau peut chercher à fusionner avec la chair de son hôte.',
  },
  {
    n: 'Pierre de Résurrection Partielle',
    source: 'tharnea',
    cat: 'Minéral de survie',
    type: 'Minéral',
    activation: 'Placer sur la poitrine de la cible',
    prix: '500 pa',
    desc: 'Utilisable uniquement sur une cible mourante (avant l’échec des 3 dés de vie). Stabilise immédiatement la victime et lui rend 1 PV. Après usage, la pierre se fissure et devient inerte.',
  },
  {
    n: 'Cape de Vent',
    source: 'tharnea',
    cat: 'Vêtement',
    type: 'Vêtement d’agilité',
    activation: 'Une fois la capuche rabattue',
    prix: '280 pa',
    desc: 'Allège le porteur : sauts doublés en distance et hauteur, dégâts de chute divisés par deux.',
  },
  {
    n: 'Lame d’Effroi Visuel (Lame infligeant peur à sa vision)',
    source: 'tharnea',
    cat: 'Arme',
    type: 'Arme runique',
    dm: '1d8',
    crit: '19-20',
    prix: '320 pa',
    activation: 'Porter la lame nue en évidence (1x entre 2 Repos Longs)',
    desc: 'Toute créature apercevant la lame nue doit réussir un test de sauvegarde de Charisme ou subir l’état Effrayé pendant 1 tour.',
  },
  {
    n: 'Potion d’Éveil',
    source: 'tharnea',
    cat: 'Consommable',
    type: 'Gélule / Potion',
    isConsumable: true,
    prix: '75 pa',
    desc: 'Permet d’ignorer totalement la fatigue et l’épuisement pendant 2 heures.',
    limite: 'Après usage : la fatigue est doublée jusqu’au prochain Repos Long.',
  },
  {
    n: 'Flacon de Nuit Artificielle',
    source: 'tharnea',
    cat: 'Consommable',
    type: 'Flacon d’ombre',
    isConsumable: true,
    activation: 'Briser au sol',
    duree: '3 tours',
    prix: '110 pa',
    desc: 'Crée une zone d’obscurité totale de 5 m pendant 3 tours. La vision nocturne ordinaire n’y fonctionne qu’à moitié, tandis que les créatures de l’Ombre y voient parfaitement.',
  },
  {
    n: 'Bâton de Sorbier Polyvalent',
    source: 'tharnea',
    cat: 'Arme',
    type: 'Arme de druide & chasseur',
    dm: '1d6 contondant / 1d10 tranchant / 1d6+1 jeté (6m)',
    crit: '20',
    prix: '220 pa',
    desc: 'Bâton de bois sacré surmonté d’une lame d’argent rétractable. Contact de la lame d’argent sur créature obscure de chair : inflige +1d4 dégâts de brûlure sacrée.',
  },
  {
    n: 'Chaîne en Argent d’Entrave',
    source: 'tharnea',
    cat: 'Arme / Équipement',
    type: 'Arme de contrôle',
    dm: '1d6 (Fouet à 2m)',
    prix: '260 pa',
    desc: 'Peut être utilisée comme fouet ou pour entraver une cible (Seuil d’échappatoire : test FOR ou DEX opposé à 1d20+3, durée 2 tours). Contact sur créature obscure : 1d4 brûlure/tour.',
  },
  {
    n: 'Cape aux Mille Reflets',
    source: 'tharnea',
    cat: 'Vêtement',
    type: 'Vêtement d’illusion',
    activation: 'Revêtir la cape en pensant à une personne humaine observée au moins 1 min',
    duree: '3 tours / Aléatoire',
    prix: '380 pa',
    desc: 'Donne l’apparence, la voix et la posture exacte de la personne ciblée. Test opposé (Perception) pour déceler le subterfuge. Les miroirs reflètent brièvement la vraie forme.',
  },
  {
    n: 'Poudre d’Arbre-Cœur',
    source: 'tharnea',
    cat: 'Consommable',
    type: 'Poudre sacrée',
    isConsumable: true,
    activation: 'Souffler la poudre sur une zone',
    duree: '2 tours',
    prix: '140 pa',
    desc: 'Fige des particules de lumière d’ambre dans l’air. Les projectiles traversant la zone subissent un désavantage (-2). Les créatures rapides doivent réussir un test sous peine de voir leur vitesse divisée par deux.',
  },
  {
    n: 'Sablier des Rois',
    source: 'tharnea',
    cat: 'Artéfact temporel',
    type: 'Artéfact royal',
    activation: 'Retourner le sablier',
    duree: '1 tour',
    prix: '450 pa',
    desc: 'Au choix : Rejouer immédiatement sa dernière action manquée, gagner une action mineure supplémentaire, ou annuler un déplacement du tour précédent. Impose une fatigue légère ensuite.',
  },
  {
    n: 'Piège de l’Ombre Cousue',
    source: 'tharnea',
    cat: 'Consommable',
    type: 'Piège magique',
    isConsumable: true,
    activation: 'Lancer 6 osselets au sol (Zone 2x2m)',
    prix: '130 pa',
    desc: 'La première créature qui traverse voit son ombre clouée au sol (mouvement réduit à 0 pendant 1 tour, test de Force pour s’arracher). Les osselets partent en fumée après 1 tour.',
  },
  {
    n: 'Clef des Portes Qui N’Existent Pas',
    source: 'tharnea',
    cat: 'Consommable',
    type: 'Révélation / Passage',
    isConsumable: true,
    activation: 'Insérée dans une surface solide non-magique',
    prix: '350 pa',
    desc: 'Ouvre une porte temporaire dans un mur plein pendant 1 tour permettant de traverser vers la pièce adjacente. Risque (1 sur 1d6) : ouverture vers un espace liminal instable !',
  },
  {
    n: 'Heaume de l’Ours Sanglant',
    source: 'tharnea',
    cat: 'Armure / Artéfact',
    type: 'Casque lourd',
    def: 2,
    prix: 'Inestimable (Relique)',
    desc: 'Accorde une immunité totale à la Peur au porteur.',
    limite: 'Maudit par la Faille : impose 1 point de Corruption permanent tant qu’il est porté.',
  },
  {
    n: 'Épée de Commandement des Armées',
    source: 'tharnea',
    cat: 'Arme',
    type: 'Épée longue de maréchal',
    dm: '1d8+2',
    crit: '19-20',
    prix: '600 pa',
    desc: 'Arme parfaitement équilibrée accordant un bonus de +2 à tous les tests d’Intimidation et de Commandement martiaux.',
  },

  // --- Collection des Bonbons Alchimiques Spéciaux de Tharnéa ---
  {
    n: "Boîte à Bonbons de l'Obscure",
    source: 'tharnea',
    cat: 'Bonbon Alchimique & Artéfact Majeur',
    type: 'Coffret Alchimique Magique (36 bonbons)',
    couleur: '#9333ea',
    prix: '500 pa',
    isConsumable: false,
    desc: "Un somptueux coffret d'ébène orné de velours violet contenant l'intégralité des 12 Bonbons Alchimiques du Codex de l'Obscure en 3 exemplaires chacun (soit 36 bonbons au total : 3x Bleu, 3x Orange, 3x Vert, 3x Rouge, 3x Violet, 3x Jaune, 3x Noir, 3x Rose, 3x Marron, 3x Doré, 3x Argent, 3x Arc-en-ciel). Chaque bonbon confère un effet unique !",
    effetSecondaire:
      'Chaque bonbon peut être tiré ou consommé individuellement. Ne s\'épuise que lorsque les 36 bonbons ont été avalés.',
  },
  {
    n: 'Bonbon Bleu des Profondeurs',
    source: 'tharnea',
    cat: 'Bonbon Alchimique',
    type: 'Consommable loufoque',
    couleur: '#1e6091',
    isConsumable: true,
    prix: '25 pa',
    desc: 'Effet principal : Permet de respirer sous l’eau pendant 1h00 (prend fin à la sortie).',
    effetSecondaire:
      'Effet secondaire possible : Peut remplacer vos mains par de véritables nageoires jusqu’au prochain Repos Long !',
  },
  {
    n: 'Bonbon Orange Ampoule',
    source: 'tharnea',
    cat: 'Bonbon Alchimique',
    type: 'Consommable loufoque',
    couleur: '#ea580c',
    isConsumable: true,
    prix: '20 pa',
    desc: 'Effet principal : Transforme votre tête en ampoule géante luminescente éclairant à 15 m pendant 2 scènes.',
    effetSecondaire:
      'Effet secondaire possible : Fait gonfler la tête jusqu’à la forme et taille d’un ballon de 40 cm jusqu’au prochain Repos Long !',
  },
  {
    n: 'Bonbon Vert Caméléon',
    source: 'tharnea',
    cat: 'Bonbon Alchimique',
    type: 'Consommable loufoque',
    couleur: '#166534',
    isConsumable: true,
    prix: '35 pa',
    desc: 'Effet principal : Rend totalement imperceptible aux yeux des ennemis pendant 1 tour.',
    effetSecondaire:
      'Effet secondaire possible : Vos amis et alliés vous ignorent et ne vous voient plus non plus !',
  },
  {
    n: 'Bonbon Blanc Souffle-Tempête',
    source: 'tharnea',
    cat: 'Bonbon Alchimique',
    type: 'Consommable loufoque',
    couleur: '#e2e8f0',
    isConsumable: true,
    prix: '30 pa',
    desc: 'Effet principal : Confère un souffle surpuissant capable de repousser des cibles de 5 mètres ou d’éteindre un incendie.',
    effetSecondaire:
      'Effet secondaire possible : Peut bloquer votre bouche en mode soufflet continu pendant 4 heures.',
  },
  {
    n: 'Bonbon Pourpre des Bêtes',
    source: 'tharnea',
    cat: 'Bonbon Alchimique',
    type: 'Consommable loufoque',
    couleur: '#7e22ce',
    isConsumable: true,
    prix: '30 pa',
    desc: 'Effet principal : Permet de dialoguer et de comprendre le langage de n’importe quel animal pendant 1h.',
    effetSecondaire:
      'Effet secondaire possible : Le PJ reste bloqué à ne s’exprimer que dans la langue de l’animal pendant 4 heures !',
  },
  {
    n: 'Bonbon Noir de l’Abysse',
    source: 'tharnea',
    cat: 'Bonbon Alchimique',
    type: 'Consommable loufoque',
    couleur: '#18181b',
    isConsumable: true,
    prix: '40 pa',
    desc: 'Effet principal : Permet de converser télépathiquement avec les créatures de l’Obscure et de la Faille.',
    effetSecondaire:
      'Effet secondaire possible : Fait pousser de petits tentacules noirs gigotants sous vos aisselles pendant 6 heures !',
  },
  {
    n: 'Bonbon Vert-Pomme Fringant',
    source: 'tharnea',
    cat: 'Bonbon Alchimique',
    type: 'Consommable loufoque',
    couleur: '#65a30d',
    isConsumable: true,
    prix: '35 pa',
    desc: 'Effet principal : Double la vitesse de déplacement du personnage pendant 2 scènes complètes.',
    effetSecondaire:
      'Effet secondaire possible : Génère d’incontrôlables flatulences sonores à répétition pendant 3 heures (Discrétion impossible !).',
  },
  {
    n: 'Bonbon Turquoise Centaure',
    source: 'tharnea',
    cat: 'Bonbon Alchimique',
    type: 'Consommable loufoque',
    couleur: '#0d9488',
    isConsumable: true,
    prix: '45 pa',
    desc: 'Effet principal : Vous transforme temporairement en monture quadrupède rapide pendant 3 heures.',
    effetSecondaire:
      'Effet secondaire possible : Tendance facétieuse à devenir indérigeable sur sa trajectoire (dérapages assurés).',
  },
  {
    n: 'Bonbon Jaune Métamorphe-Garde-Robe',
    source: 'tharnea',
    cat: 'Bonbon Alchimique',
    type: 'Consommable loufoque',
    couleur: '#ca8a04',
    isConsumable: true,
    prix: '25 pa',
    desc: 'Effet principal : Remplace instantanément vos vêtements par une tenue d’apparat propre en renvoyant l’ancienne tenue au lieu du dernier Repos Long.',
    effetSecondaire:
      'Effet secondaire possible : Possibilité que la nouvelle tenue tirée au sort soit totalement saugrenue ou non désirée.',
  },
  {
    n: 'Bonbon Rouge Piment-Glaire',
    source: 'tharnea',
    cat: 'Bonbon Alchimique',
    type: 'Consommable loufoque',
    couleur: '#dc2626',
    isConsumable: true,
    prix: '20 pa',
    desc: 'Effet principal : Permet d’expulser par le nez une boule incandescente infligeant 1d8 dégâts de feu à 4 m.',
    effetSecondaire:
      'Effet secondaire possible : Nez extrêmement irrité, rouge et gonflé pendant 4 heures.',
  },
  {
    n: 'Bonbon Marron Coupe-Faim de Fer',
    source: 'tharnea',
    cat: 'Bonbon Alchimique',
    type: 'Consommable loufoque',
    couleur: '#78350f',
    isConsumable: true,
    prix: '30 pa',
    desc: 'Effet principal : Coupe totalement la faim, la soif et la fatigue pendant 24 heures sans malus.',
    effetSecondaire:
      'Effet secondaire possible : Après 24h, les malus de famine sont doublés et tout repas normal paraît infect pendant une journée.',
  },
  {
    n: 'Bonbon Rose Crépusculaire',
    source: 'tharnea',
    cat: 'Bonbon Alchimique',
    type: 'Consommable loufoque',
    couleur: '#db2777',
    isConsumable: true,
    prix: '40 pa',
    desc: 'Effet principal : Fait tomber instantanément la nuit sur une zone de 100 m de rayon pendant 1 heure.',
    effetSecondaire:
      'Effet secondaire possible : Engendre un sentiment d’amour fou et incontrôlable envers le premier être vivant croisé pendant 1 jour et 1 nuit !',
  },
];

export const THARNEA_LORE_RULES: RuleChapter[] = [
  {
    t: "L'Armée du Roi — Hiérarchie Militaire Complète",
    cat: "Factions & Armée (Tharnéa)",
    c: `STRUCTURE ET CHAINES DE COMMANDEMENT OFFICIELLES :

I. COMMANDEMENT SUPRÊME
• Le Roi : Chef absolu des armées. Décide des guerres, alliances et mobilisations royales.
• Connétable du Royaume : Commandant militaire suprême. Dirige toutes les forces armées terrestres au nom de la couronne.
• Maréchaux Royaux : Stratèges de haut rang supervisant les grandes campagnes et régions militaires.

II. COMMANDEMENT DE TERRAIN
• Généraux : Dirigent des armées entières et coordonnent l'effort de guerre.
• Seigneurs de Guerre / Bannerets : Nobles menant leurs propres contingents vassaux (loyauté parfois fragile).
• Capitaines : Commandent des compagnies complètes sur le front.
• Lieutenants : Seconds des capitaines et officiers exécutifs.

III. OFFICIERS SUBALTERNES
• Sergents : Encadrent directement la troupe (discipline, cohésion, formation).
• Caporaux : Chefs de petites escouades tactiques.

IV. TROUPES RÉGULIÈRES
• Chevaliers : Nobles combattants montés en armure de plaques (élite martiale).
• Hommes d’armes : Soldats professionnels lourdement équipés.
• Fantassins : Infanterie de ligne classique.
• Archers / Arbalétriers : Soutien de tir à distance.
• Éclaireurs : Reconnaissance, cartographie et infiltration.

V. CORPS DE SPÉCIALISTES
• Ingénieurs de siège : Servants de catapultes, balistes et machines de sape.
• Médecins de campagne : Soins d'urgence et gestion des épidémies.
• Messagers / Hérauts : Transmission codée des ordres sur le champ de bataille.
• Chasseurs de l’Ombre (Spécial Tharnéa) : Unité secrète d'élite spécialement formée et équipée de fer froid et d'argent pour traquer les anomalies de la Faille.

VI. SOUTIEN ET LEVÉES
• Milices locales : Défenseurs des bourgs et remparts citoyens.
• Conscrits : Paysans et artisans mobilisés d'urgence.
• Mercenaires : Soldats de fortune à contrat (loyauté variable).`,
  },
  {
    t: "L'Obscure et la Faille de Tharnéa : Principes & Vulnérabilités",
    cat: "Cosmologie & Règles Spéciales",
    c: `RÈGLES ET VULNÉRABILITÉS DE L'OBSCURE :

1. NATURE DE LA FAILLE
La Faille n'est pas une simple déchirure physique : c'est l'intrusion du monde miroir (l'Obscure) dans Tharnéa. Elle corrompt la chair, la roche et les âmes, créant des anomalies biologiques et des aberrations dimensionnelles.

2. LE FER FROID & L'ARGENT PUR
Toutes les créatures nées de la Faille ou asservies par elle possèdent une sensibilité au Fer Froid et à l'Argent pur :
• Fer Froid : Tranche la chair spectrale, annule les réductions de dégâts et empêche la régénération impie pendant 1 tour.
• Argent Pur : Brûle au simple contact physique la chair des créatures obscures (inflige généralement 1d4 dégâts continus).

3. LE SEL DU SOUVENIR
Le sel brut agit comme une barrière stabilisatrice : tracé en ligne au sol, il bloque le passage des entités immatérielles et brise les cercles d'invocation des sorcières.

4. LA CORRUPTION PAR LA FAILLE
Certaines attaques (comme celles du Malin ou de l'Araignée Venimeuse) infligent des points de Corruption. À 5 points de corruption, le PJ subit des visions hallucinatoires ; à 10 points, il risque de se transformer en Revenant s'il ne reçoit pas un rituel de Lumière sacrée.`,
  },
];
