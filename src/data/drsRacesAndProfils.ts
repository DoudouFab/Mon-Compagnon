import { ProfilData, RaceData } from '../types/chroniques';

export const OFFICIAL_DRS_RACES: RaceData[] = [
  {
    id: 'demi-elfe',
    n: 'Demi-elfe',
    d: 'À la croisée de deux cultures, un artiste sensible doté d\'une grâce naturelle.',
    b: { CON: -2, SAG: 2 },
    t: '-2 CON, +2 SAG',
    traits: 'Diplomate, mélancolique, ouvert, sensible, charismatique et polyvalent.',
    ageDepart: '20 ans',
    esperanceVie: '150 ans',
    taille: '1,50 m à 1,90 m',
    poids: '40 kg à 80 kg',
    descriptionComplete:
      'Le demi-elfe combine les qualités de ses deux parents (humain et elfe). Souvent traité avec condescendance par les elfes — qui ne voient en lui qu’un être éphémère condamné à vieillir bien trop vite — et regardé avec fascination ou méfiance par les humains, le demi-elfe oscille constamment entre deux univers.\n\nDoté d’oreilles légèrement effilées, d’une silhouette fine et gracieuse et d’une faible pilosité, il possède l\'élégance et la finesse des elfes alliées à l’énergie vitale, à l\'adaptabilité et à l\'ambition des humains. Ne se sentant jamais pleinement chez lui dans aucune des deux sociétés, il choisit très souvent la route, devenant ambassadeur, ménestrel, érudit ou aventurier d\'élite.',
    relations:
      'Grâce à son empathie naturelle et à sa grande tolérance, le demi-elfe fait un diplomate hors pair. Il noue facilement des liens avec les humains, les gnomes et les halfelins. Il éprouve une sympathie sincère pour les demi-orques, partageant avec eux la condition délicate d’enfant entre deux mondes.',
    nomsExemples:
      'Prénoms généralement elfiques : Adran, Aramil, Enialis, Heian, Lucan, Peren, Shanairra, Valanthe, Caelynn, Leshanna.\nNoms de famille généralement humains : Duchêne, Castel, Rivière, Sombrefeuille, Beaulieu, Martel, Fleur-de-Vent.',
    cap: [
      {
        n: 'Sang mêlé',
        t: 'Le joueur choisit l\'une des deux capacités suivantes lors de la création de son personnage : Instinct de survie (héritage humain) OU Lumière des étoiles (héritage elfe).',
      },
    ],
    opts: [
      {
        n: 'Instinct de survie (héritage humain)',
        t: 'Lorsqu\'une attaque est censée amener le personnage à 0 PV, les dégâts (DM) qu\'elle inflige sont divisés par 2 (avec un minimum de 1).',
      },
      {
        n: 'Lumière des étoiles (héritage elfe)',
        t: 'Dans l\'obscurité de la nuit sous la lumière des étoiles, sa vision est assimilée à une simple pénombre : il perçoit les formes et les mouvements sans torche.',
      },
    ],
  },
  {
    id: 'humain',
    n: 'Humain',
    d: 'Pionnier infatigable, ambitieux, adaptable et résilient.',
    b: {},
    t: 'Aucun modificateur (Grande polyvalence)',
    traits: 'Ambitieux, courageux, pionnier, persévérant, sociable et adaptable.',
    ageDepart: '18 ans',
    esperanceVie: '100 ans',
    taille: '1,50 m à 2,00 m',
    poids: '40 kg à 120 kg',
    descriptionComplete:
      'Les humains sont souvent perçus par les races anciennes comme des « jeunes loups ignorants » qui croissent et se multiplient sans grand respect pour l\'équilibre millénaire du monde. Mus par une curiosité insatiable et une énergie fébrile, ils bâtissent des royaumes puissants, érigent des cathédrales et explorent les confins les plus sauvages.\n\nLeur incroyable capacité d\'adaptation compense leur longévité plus courte : ils excellent dans toutes les voies, qu\'elles soient martiales, arcaniques ou religieuses, et forment la race la plus répandue des cités civilisées.',
    relations:
      'Les humains se mêlent aisément à tous les peuples, bien qu’ils soient parfois considérés comme trop impatients par les elfes et trop bruyants par les nains. Ils s\'associent avec quiconque fait preuve de compétence et de loyauté.',
    nomsExemples:
      'Masculins : Adalrik, Arn, Bernulf, Brand, Edwald, Ketil, Gerulf, Godfred, Gunter, Halfdan, Ingvar, Lothar, Rurik, Sigmar, Thorsten.\nFéminins : Annia, Alaina, Berthille, Bérénia, Koralie, Floraline, Gadrielle, Kéline, Naelwen, Natasha, Prescille, Sorsha, Wendoline.',
    cap: [
      {
        n: 'Instinct de survie',
        t: 'Lorsqu\'une attaque devrait amener le personnage à 0 Point de Vie (PV), les dégâts (DM) qu\'elle inflige sont divisés par 2 (avec un minimum de 1).',
      },
    ],
  },
  {
    id: 'elfe-haut',
    n: 'Elfe (Haut-Elfe)',
    d: 'Être féerique millénaire, gracieux, esthète et maître des arcanes.',
    b: { FOR: -2, CHA: 2 },
    t: '-2 FOR, +2 CHA',
    traits: 'Esthète, fier, érudit, raffiné, respectueux des traditions sacrées.',
    ageDepart: '80 ans',
    esperanceVie: '450 ans',
    taille: '1,50 m à 1,80 m',
    poids: '45 kg à 70 kg',
    descriptionComplete:
      'Les Hauts-Elfes sont les héritiers d’empires anciens dont la splendeur a façonné l’histoire du monde. Dotés d’une longévité exceptionnelle, ils consacrent des décennies à perfectionner un art, une discipline de combat ou les subtilités de la magie arcanique.\n\nLeur beauté est légendaire, avec des traits purs, des cheveux dorés ou argentés et une démarche aérienne. Souvent perçus comme hautains ou distants par les mortels à courte espérance de vie, ils ont une mémoire vivace des pactes d\'honneur et des alliances ancestrales.',
    relations:
      'Leurs relations avec les nains sont teintées d’une méfiance historique réciproque, bien qu’ils respectent leur bravoure. Ils entretiennent des rapports courtois mais condescendants avec les humains, et considèrent les demi-elfes avec une tendre mélancolie.',
    nomsExemples:
      'Masculins : Aramil, Arannis, Berrian, Erevan, Galaeron, Hadarai, Immeral, Paelias, Quarion, Soveliss, Tharivol.\nFéminins : Anastrianna, Caelynn, Enna, Jelenneth, Leshanna, Meriele, Naivara, Quillathe, Sariel, Shanairra, Vadania.',
    cap: [
      {
        n: 'Lumière des étoiles',
        t: 'L\'obscurité nocturne sous la lumière des étoiles ou de la lune n\'est pour lui qu\'une simple pénombre. Il perçoit son environnement sans avoir besoin de torche.',
      },
    ],
  },
  {
    id: 'elfe-sylvain',
    n: 'Elfe sylvain',
    d: 'Chasseur et protecteur farouche des forêts primordiales.',
    b: { FOR: -2, DEX: 2 },
    t: '-2 FOR, +2 DEX',
    traits: 'Farouche, vif, instinctif, silencieux, profondément connecté à la nature.',
    ageDepart: '50 ans',
    esperanceVie: '350 ans',
    taille: '1,40 m à 1,70 m',
    poids: '40 kg à 65 kg',
    descriptionComplete:
      'Contrairement à leurs cousins citadins, les Elfes sylvains ont choisi la vie sauvage au cœur des forêts profondes et des canopées millénaires. Leurs sens sont constamment aux aguets et leur foulée ne laisse aucune trace sur les tapis de feuilles mortes.\n\nExcellents archers et pisteurs nés, ils protègent leurs sanctuaires naturels contre les bûcherons imprudents, les monstres et les pillards. Ils vêtent des étoffes de cuir et de feuillage teintées aux couleurs des sous-bois.',
    relations:
      'Ils se méfient des citadins et des exploitations minières. Ils s\'entendent très bien avec les rôdeurs, les druides, les gnomes des bois et les créatures féeriques de la forêt.',
    nomsExemples:
      'Masculins : Faelar, Kaelen, Loriel, Silvan, Teryn, Zephyr, Branwen, Caelum, Elidor, Tanis.\nFéminins : Aerin, Dania, Lyra, Nyssa, Talia, Vanya, Althaea, Brena, Fawn, Sylvanis.',
    cap: [
      {
        n: 'Sens forestiers & Lumière des étoiles',
        t: 'Bénéficie de la Lumière des étoiles (vision étoilée) ainsi que d\'un bonus de +2 à tous les tests de discrétion en milieu naturel extérieur.',
      },
    ],
  },
  {
    id: 'nain',
    n: 'Nain',
    d: 'Solide comme la roche, travailleur infatigable et loyal jusqu\'au trépas.',
    b: { DEX: -2, CON: 2 },
    t: '-2 DEX, +2 CON',
    traits: 'Tenace, courageux, travailleur infatigable, rancunier mais fidèle au clan.',
    ageDepart: '40 ans',
    esperanceVie: '250 ans',
    taille: '1,20 m à 1,40 m',
    poids: '60 kg à 90 kg',
    descriptionComplete:
      'Les Nains sont de fiers montagnards bâtisseurs de forteresses taillées à même la roche et de royaumes sous-terrains colossaux. Petits mais d’une carrure herculéenne, ils portent de longues barbes tressées dont ils tirent une fierté immense.\n\nForgerons inégalés et guerriers disciplinés, ils manient haches et marteaux de guerre avec une férocité légendaire. Un nain ne revient jamais sur une promesse jurée et n\'oublie jamais une insulte faite à son clan.',
    relations:
      'Ils ont un profond respect pour le travail bien fait, le métal noble et la bonne bière. Leurs rancunes envers les elfes sont proverbiales, mais un nain combattra dos à dos jusqu\'à la mort avec quiconque a gagné son estime.',
    nomsExemples:
      'Masculins : Barendd, Brottor, Eberk, Einkil, Fargrim, Harbek, Kildrak, Morgran, Orsik, Rurik, Taklinn, Thorin, Torgga.\nFéminins : Artin, Bardryn, Diesa, Eldeth, Falkrunn, Gurdis, Helja, Kathra, Kristryd, Mardred, Riswynn, Vistra.\nClans : Balderk, Dankil, Gorunn, Holderhek, Loderr, Lutgehr, Torunn, Ungart, Forge-d\'Acier.',
    cap: [
      {
        n: 'Vision dans le noir & Résistance physique',
        t: 'Vision dans le noir complet jusqu\'à 30 mètres et bonus de +2 à tous les tests pour résister aux poisons, toxines et maladies.',
      },
    ],
  },
  {
    id: 'demi-orque',
    n: 'Demi-orque',
    d: 'Force brute herculéenne, tempérament ardent et loyauté sans faille.',
    b: { FOR: 2, INT: -2, CHA: -2 },
    t: '+2 FOR, -2 INT, -2 CHA',
    traits: 'Direct, robuste, impétueux, loyal envers ses alliés, prompt aux réactions vives.',
    ageDepart: '14 ans',
    esperanceVie: '60 ans',
    taille: '1,70 m à 2,10 m',
    poids: '80 kg à 140 kg',
    descriptionComplete:
      'Issu de l’union entre un parent humain et un parent orque, le demi-orque hérite d\'une musculature imposante, d’une mâchoire puissante aux canines inférieures proéminentes et d’un teint tirant sur le gris ou l’olivâtre.\n\nSouvent confronté aux préjugés et au rejet des deux sociétés, il apprend dès l\'enfance à compter sur sa seule force et sur son instinct de survie. Ceux qui parviennent à gagner sa confiance découvrent un compagnon d\'une bravoure indomptable et d\'une fidélité à toute épreuve.',
    relations:
      'Se sentant mal à l\'aise dans les salons mondains, il préfère l\'action brute, les feux de camp et les aventuriers pragmatiques. Il partage une réelle complicité avec les barbares, les mercenaires et les demi-elfes.',
    nomsExemples:
      'Masculins : Dench, Feng, Gell, Henk, Holg, Imsh, Keth, Krusk, Mhurren, Ront, Shump, Thokk, Brakka, Gorath.\nFéminins : Baggi, Emen, Engong, Kansif, Myev, Neega, Ovak, Ownka, Shautha, Vola, Volen, Grima.',
    cap: [
      {
        n: 'Vision dans le noir',
        t: 'Vision dans le noir complet jusqu\'à une distance de 30 mètres (perçoit les formes en nuances de gris).',
      },
    ],
  },
  {
    id: 'halfelin',
    n: 'Halfelin',
    d: 'Petit peuple bon vivant, agile, insaisissable et plein de bravoure.',
    b: { FOR: -2, DEX: 2 },
    t: '-2 FOR, +2 DEX',
    defb: 1,
    traits: 'Épicurien, joyeux, discret, vif, farceur et doué d\'un courage surprenant.',
    ageDepart: '20 ans',
    esperanceVie: '100 ans',
    taille: '0,80 m à 1,10 m',
    poids: '25 kg à 35 kg',
    descriptionComplete:
      'Les halfelins sont de petits êtres au regard malicieux qui aiment avant tout le confort d\'un foyer chaleureux, la bonne cuisine, six repas par jour et des histoires amusantes au coin du feu.\n\nCependant, sous cette apparente bonhomie sommeille une dextérité prodigieuse, des réflexes fulgurants et un sang-froid capable de faire face aux plus grands dangers. Leur petite taille en fait des cibles insaisissables et des éclaireurs hors pair.',
    relations:
      'Ils s\'entendent avec tout le monde ! Leur humour désarme les nains bourrus, leur vivacité amuse les elfes et leur discrétion est appréciée de tous les groupes d\'aventuriers.',
    nomsExemples:
      'Masculins : Alton, Ander, Cade, Corrin, Eldon, Errich, Finnan, Garret, Lindal, Lyle, Merric, Milo, Osborn, Perrin, Reed, Roscoe, Wellby.\nFéminins : Andry, Bree, Callie, Cora, Euphemia, Jillian, Kithri, Lavinia, Lidda, Merla, Nedda, Paela, Portia, Seraphina, Shaena, Trym.\nFamilles : Boffin, Brandebouc, Chaumière, Grand-Pas, Touque, Sous-Colline, Ronceux, Pied-Agile.',
    cap: [
      {
        n: 'Petite taille & Dextérité',
        t: '+1 en Défense native (taille réduite), +2 à tous les tests de discrétion. Restriction : ne peut pas manier d\'armes à deux mains de taille moyenne ou grande (épée à 2M, hache à 2M).',
      },
    ],
  },
  {
    id: 'gnome',
    n: 'Gnome',
    d: 'Inventeur ingénieux, curieux de tout, pétillant d\'esprit et de magie.',
    b: { FOR: -2, INT: 2 },
    t: '-2 FOR, +2 INT',
    traits: 'Curieux, volubile, passionné de mécanique, astucieux et téméraire.',
    ageDepart: '40 ans',
    esperanceVie: '250 ans',
    taille: '0,90 m à 1,15 m',
    poids: '20 kg à 30 kg',
    descriptionComplete:
      'Les gnomes ont l\'esprit toujours en ébullition. Fascinés par les énigmes, les mécanismes alchimiques, les horloges, la poudre et les énergies arcaniques, ils ne cessent d\'inventer, d\'expérimenter et de démonter tout ce qui leur tombe sous la main.\n\nMalgré leur petite taille, leur vivacité d\'esprit et leur sens de l\'humour sont inépuisables. Face au danger, ils déploient des trésors de ruse et de malice qui déroutent les adversaires les plus redoutables.',
    relations:
      'Ils s\'entendent à merveille avec les nains forgerons et les forgesorts avec qui ils partagent l\'amour de l\'ingénierie, tout en fascinant les magiciens par leurs théories extravagantes mais souvent fonctionnelles.',
    nomsExemples:
      'Masculins : Boddynock, Dimble, Fonkin, Gimble, Glim, Gerbo, Jebeddo, Namfoodle, Roondar, Seebo, Zook, Fizban, Cog.\nFéminins : Bimpnottin, Breena, Caramip, Donella, Ella, Lilli, Loopmottin, Nissa, Nyx, Oda, Waywocket, Trixie.',
    cap: [
      {
        n: 'Don étrange',
        t: 'Le joueur choisit l\'une des deux options suivantes à la création :',
      },
    ],
    opts: [
      {
        n: 'Génie intellectuel (+5 INT)',
        t: 'Bonus permanent de +5 à tous les tests de caractéristiques basés sur l\'Intelligence.',
      },
      {
        n: 'Sort inné d\'Ensorceleur',
        t: 'Obtient un sort de rang 1 d\'Ensorceleur utilisable normalement, même lorsqu\'il porte une armure métallique sans aucune pénalité.',
      },
    ],
  },
];

export const OFFICIAL_DRS_PROFILS: ProfilData[] = [
  {
    id: 'arquebusier',
    n: 'Arquebusier',
    dv: 8,
    traits: 'Précis, méthodique avec la poudre, les rouages et la balistique.',
    eq: 'Pétoire (DM 1d10), épée longue, dague, armure de cuir souple.',
    ar: 'Armes à 1 main, armes à distance et armes à poudre. Chemise de mailles max, aucun bouclier.',
    descriptionComplete:
      'L’Arquebusier est le pionnier des temps nouveaux, maniant le salpêtre, le plomb et les mécanismes d’horlogerie avec une précision mortelle. Dédaignant le corps à corps prolongé, il fait pleuvoir une grêle de balles dévastatrices à distance avant même que l’ennemi n’ait pu tirer son épée.',
    voiesNoms: ['Voie de l\'artilleur', 'Voie du pistolero', 'Voie du tir', 'Voie du traqueur', 'Voie de la précision'],
    roleTactique: 'Tireur d\'élite à distance, dégâts perçants massifs et contrôle du champ de bataille.',
  },
  {
    id: 'barbare',
    n: 'Barbare',
    dv: 12,
    traits: 'Instinctif, féroce, rustique, puissant et indomptable.',
    eq: 'Hache à 2 mains (DM 2d6), 2 javelots, dague, armure de cuir.',
    ar: 'Toutes armes de contact et armes de jet. Armure de cuir max, bouclier autorisé.',
    descriptionComplete:
      'Issu des étendues glacées ou des steppes arides, le Barbare puise sa force dans une rage primordiale et un dédain souverain de la souffrance. Doté du plus grand dé de vie du jeu (d12), il charge en première ligne pour faucher des rangs entiers d’ennemis à grands coups de hache.',
    voiesNoms: ['Voie du colosse', 'Voie du berserk', 'Voie du pourfendeur', 'Voie du pagne', 'Voie de la survie'],
    roleTactique: 'Tank berserk de première ligne, encaisse énormément de PV et inflige des dégâts brutaux.',
  },
  {
    id: 'barde',
    n: 'Barde',
    dv: 6,
    mag: 'CHA',
    traits: 'Charismatique, conteur d\'histoires, agile et séducteur.',
    eq: 'Rapière (DM 1d6, Crit 19-20), dague, luth ou instrument, armure de cuir.',
    ar: 'Armes légères à 1 main. Cuir renforcé max, aucun bouclier.',
    descriptionComplete:
      'Le Barde est un voyageur inspiré, un diplomate et un maître de la magie des sons. Grâce à ses chants et ses tirades héroïques, il décuple le courage de ses compagnons, sème le doute dans l\'esprit adverse et utilise sa rapière avec une grâce étourdissante.',
    voiesNoms: ['Voie de l\'escrime', 'Voie de la musique', 'Voie du saltimbanque', 'Voie de la séduction', 'Voie du vagabond'],
    roleTactique: 'Soutien polyvalent, buffs d\'équipe, contrôle mental et diplomatie de groupe.',
  },
  {
    id: 'chevalier',
    n: 'Chevalier',
    dv: 10,
    traits: 'Sens du devoir, protecteur juré, honorable et inébranlable.',
    eq: 'Épée longue, grand bouclier, lance d\'arçon, demi-plaque d\'acier.',
    ar: 'Toutes les armes de contact. Toutes les armures et tous les boucliers.',
    descriptionComplete:
      'Vêtu d’acier étincelant et guidé par un code d’honneur rigoureux, le Chevalier est le rempart inébranlable du groupe. Expert du combat monté et de la protection d’autrui, il force les adversaires à l\'affronter plutôt que de s\'en prendre à ses compagnons plus vulnérables.',
    voiesNoms: ['Voie du cavalier', 'Voie du héros', 'Voie du meneur d\'hommes', 'Voie de la guerre', 'Voie du bouclier'],
    roleTactique: 'Protecteur lourd, provocation des ennemis, défense collective et charge héroïque.',
  },
  {
    id: 'druide',
    n: 'Druide',
    dv: 8,
    mag: 'SAG',
    traits: 'Gardien de l\'équilibre naturel, calme, contemplatif et sage.',
    eq: 'Bâton ferré, dague, arc court, armure de cuir souple.',
    ar: 'Bâton, dague, épieu, arc court. Armure de cuir, bouclier en bois uniquement.',
    descriptionComplete:
      'Prêtre des forces primitives de la Terre et du Ciel, le Druide commande aux éléments, soigne les blessures avec des baies magiques et peut même adopter la forme redoutable de grands prédateurs sauvages.',
    voiesNoms: ['Voie des animaux', 'Voie du fauve', 'Voie de la nature', 'Voie des végétaux', 'Voie du métamorphe'],
    roleTactique: 'Soutien hybride, métamorphose au corps à corps, sorts de soins et contrôle de zone.',
  },
  {
    id: 'ensorceleur',
    n: 'Ensorceleur',
    dv: 4,
    mag: 'CHA',
    traits: 'Fier, imprévisible, magie innée spontanée et volcanique.',
    eq: 'Bâton ferré, dague, potion de soins légers.',
    ar: 'Dague et bâton uniquement. Aucune armure physique.',
    descriptionComplete:
      'Contrairement au magicien qui étudie de vieux grimoires, l\'Ensorceleur porte la magie dans son sang, héritée d\'une ascendance féerique ou draconique. Il lance ses sorts par pure force de volonté, façonnant des illusions et des déflagrations d\'énergie brute.',
    voiesNoms: ['Voie de l\'air', 'Voie de la divination', 'Voie de l\'envoûteur', 'Voie des illusions', 'Voie du sang'],
    roleTactique: 'Magie spontanée dévastatrice, contrôle mental, illusions et manipulation charismatique.',
  },
  {
    id: 'forgesort',
    n: 'Forgesort',
    dv: 6,
    mag: 'INT',
    traits: 'Ingénieux, alchimiste, artisan des arcanes et méticuleux.',
    eq: 'Dague, marteau d\'artisan, bâton ferré, trousse d\'outils.',
    ar: 'Armes simples, marteau, arbalète. Armure de cuir simple max.',
    descriptionComplete:
      'Artisan-mage de génie, le Forgesort enchante les armes et les armures sur le champ de bataille, fabrique des potions instables et insuffle de la magie dans des golems ou des automates mécaniques.',
    voiesNoms: ['Voie des artefacts', 'Voie des élixirs', 'Voie du métal', 'Voie du golem', 'Voie de la poudre'],
    roleTactique: 'Artisan magique, enchantement de l\'équipement du groupe, potions et compagnon golem.',
  },
  {
    id: 'guerrier',
    n: 'Guerrier',
    dv: 10,
    traits: 'Discipline militaire, solide au front, pragmatique et endurant.',
    eq: 'Épée longue, épée à 2 mains, grand bouclier, cotte de mailles.',
    ar: 'Toutes les armes. Demi-plaque max et grand bouclier.',
    descriptionComplete:
      'Le Guerrier est le maître incontesté de l’art martial pur. Formé au maniement de chaque arme et armure, il ne compte ni sur la magie ni sur les dieux mais sur son entraînement de fer, sa force et sa tactique militaire.',
    voiesNoms: ['Voie du bouclier', 'Voie du combat', 'Voie du maître d\'armes', 'Voie du soldat', 'Voie de la résistance'],
    roleTactique: 'Combattant d\'élite au corps à corps, polyvalence des armes et résistance physique.',
  },
  {
    id: 'magicien',
    n: 'Magicien',
    dv: 4,
    mag: 'INT',
    traits: 'Érudit, studieux, savant voué aux mystères arcaniques.',
    eq: 'Bâton de voyage, dague, grimoire arcanique, potion de soin.',
    ar: 'Dague et bâton uniquement. Aucune armure physique.',
    descriptionComplete:
      'Le Magicien est le savant de l\'occulte. Ayant passé des années penché sur des parchemins anciens, il maîtrise les équations arcaniques qui déchaînent boules de feu, rayons de glace, barrières de protection et téléportations.',
    voiesNoms: ['Voie de la magie destructrice', 'Voie de la magie élémentaire', 'Voie de la magie protectrice', 'Voie du téléporteur', 'Voie de l\'invocateur'],
    roleTactique: 'Bombardier magique à zone d\'effet, contrôle arcanique et utilitaires majeurs.',
  },
  {
    id: 'moine',
    n: 'Moine',
    dv: 8,
    mag: 'SAG',
    traits: 'Ascète, rigoureux, cherchant l\'harmonie du corps et de l\'esprit.',
    eq: 'Bâton ferré, chapelet de méditation, tenue de voyage.',
    ar: 'Aucune armure physique. Combat dévastateur à mains nues.',
    descriptionComplete:
      'Le Moine forge son propre corps comme une arme parfaite. Sans armure et souvent sans arme, il se déplace à une vitesse surhumaine, pare les flèches en plein vol et frappe ses ennemis de rafales d\'attaques paralysantes.',
    voiesNoms: ['Voie de la maîtrise', 'Voie de la méditation', 'Voie du ki', 'Voie de la vitesse', 'Voie du vent'],
    roleTactique: 'Mobilité extrême, frappes multiples à mains nues et défense naturelle par la Sagesse.',
  },
  {
    id: 'necromancien',
    n: 'Nécromancien',
    dv: 4,
    mag: 'INT',
    traits: 'Fasciné par le trépas, stoïque, pragmatique et sans tabous.',
    eq: 'Bâton sacrificiel, dague en os, potion de soin.',
    ar: 'Dague et bâton uniquement. Aucune armure physique.',
    descriptionComplete:
      'Maître des frontières entre la vie et la mort, le Nécromancien commande aux ombres, affaiblit ses ennemis par des malédictions glaçantes et peut relever des serviteurs morts-vivants pour combattre à sa place.',
    voiesNoms: ['Voie de la mort', 'Voie des squelettes', 'Voie des ombres', 'Voie de la corruption', 'Voie du sang noir'],
    roleTactique: 'Affaiblissement des boss, absorption de vie et convocation de serviteurs morts-vivants.',
  },
  {
    id: 'pretre',
    n: 'Prêtre',
    dv: 8,
    mag: 'SAG',
    traits: 'Dévoué à son panthéon, pilier spirituel et protecteur du groupe.',
    eq: 'Masse de guerre, petit bouclier en acier, chemise de mailles.',
    ar: 'Armes contondantes à 1 main + arme sacrée de sa divinité. Chemise de mailles, bouclier.',
    descriptionComplete:
      'Le Prêtre est le canal terrestre de la volonté des dieux. Armé de sa foi et d’une lourde masse d’armes, il bannit les démons et les morts-vivants tout en soignant les blessures mortelles de ses compagnons.',
    voiesNoms: ['Voie de la foi', 'Voie de la prière', 'Voie de la guerre sainte', 'Voie des soins', 'Voie de la spiritualité'],
    roleTactique: 'Soigneur principal, bénédictions d\'équipe, châtiment des morts-vivants et combat au contact.',
  },
  {
    id: 'rodeur',
    n: 'Rôdeur',
    dv: 8,
    traits: 'Pisteur aguerri, discret, observateur et protecteur des grands espaces.',
    eq: 'Arc court, carquois de 20 flèches, épée longue, dague, cuir renforcé.',
    ar: 'Armes à 1 main et armes à distance. Cuir renforcé max, aucun bouclier.',
    descriptionComplete:
      'Le Rôdeur est l\'œil et l\'oreille du groupe en milieu hostile. Maître de l\'embuscade, du pistage et de la survie, il est souvent accompagné d\'un fidèle compagnon animal et décoche des tirs foudroyants à l\'arc.',
    voiesNoms: ['Voie de l\'archer', 'Voie du compagnon animal', 'Voie de la forêt', 'Voie de l\'escarmouche', 'Voie du pisteur'],
    roleTactique: 'Tireur d\'élite, pistage, survie en extérieur et compagnon de combat animal.',
  },
  {
    id: 'voleur',
    n: 'Voleur',
    dv: 6,
    traits: 'Agile, opportuniste, esprit vif, observateur et discret.',
    eq: 'Rapière, 5 dagues de jet, outils de crochetage de maître, armure de cuir souple.',
    ar: 'Armes légères à 1 main, armes à distance. Cuir simple max, aucun bouclier.',
    descriptionComplete:
      'Le Voleur est l’expert des situations délicates : désarmement de pièges, déverrouillage de coffres impénétrables et filature dans les ruelles sombres. En combat, il frappe par surprise pour infliger des blessures critiques dévastatrices.',
    voiesNoms: ['Voie de l\'assassin', 'Voie de l\'aventurier', 'Voie du déplacement', 'Voie de la roublardise', 'Voie du voleur'],
    roleTactique: 'Attaques sournoises critiques massives, crochetage de serrures et désamorçage de pièges.',
  },
];
