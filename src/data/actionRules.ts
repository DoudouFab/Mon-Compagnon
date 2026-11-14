export interface ActionRuleInfo {
  id:
    | 'limitee'
    | 'attaque'
    | 'mouvement'
    | 'gratuite'
    | 'reaction'
    | 'passif'
    | 'rituel';
  label: string;
  shortLabel: string;
  badgeStyle: string;
  resume: string;
  definition: string;
  ceQuIlResteDansLeTour: string;
  exemples: string;
}

export const COF_ACTION_RULES: Record<ActionRuleInfo['id'], ActionRuleInfo> = {
  limitee: {
    id: 'limitee',
    label: 'Action Limitée (L)',
    shortLabel: 'Action Limitée (L)',
    badgeStyle: 'bg-[#4a1c1d] hover:bg-[#612527] text-[#ffb8b8] border-[#8c3437]',
    resume: 'Consomme tout le tour actif (Attaque + Mouvement).',
    definition:
      'En Chroniques Oubliées Fantasy, une Action Limitée (notée L) demande une concentration ou un effort complet : elle consomme à la fois votre Action d’Attaque (A) ET votre Action de Mouvement (M) du tour.',
    ceQuIlResteDansLeTour:
      'Après une Action Limitée, vous ne pouvez plus vous déplacer (sauf règle spéciale ou pas d’ajustement toléré par le MJ) ni porter d’autre attaque durant ce tour. Vous conservez uniquement vos Actions Gratuites (parler brièvement, lâcher un objet) et votre éventuelle Réaction hors de votre tour.',
    exemples:
      'Lancer la plupart des sortilèges puissants, recharger une arbalète lourde ou arme à poudre, déclencher une Attaque double ou une Attaque circulaire.',
  },
  attaque: {
    id: 'attaque',
    label: 'Action d’Attaque (A)',
    shortLabel: 'Action d’Attaque (A)',
    badgeStyle: 'bg-[#3d2814] hover:bg-[#52351a] text-[#fcd34d] border-[#875828]',
    resume: 'Action principale du tour (laisse le Mouvement disponible).',
    definition:
      'L’Action d’Attaque (ou action standard) permet de porter une frappe au contact, d’effectuer un tir à distance, d’utiliser une capacité active non limitée ou de boire une potion.',
    ceQuIlResteDansLeTour:
      'Vous conservez votre Action de Mouvement (M) (10 m de déplacement, avant ou après l’action), vos Actions Gratuites (parler, activer un talent gratuit) et votre Réaction hors tour. Vous pouvez aussi convertir votre Action d’Attaque en une seconde Action de Mouvement (20 m au total).',
    exemples:
      'Frapper avec une épée, tirer à l’arc, effectuer une Feinte magistrale, un Coup de bouclier ou boire un élixir en main.',
  },
  mouvement: {
    id: 'mouvement',
    label: 'Action de Mouvement (M)',
    shortLabel: 'Action de Mouvement (M)',
    badgeStyle: 'bg-[#17332b] hover:bg-[#1f473c] text-[#6ee7b7] border-[#2e6b59]',
    resume: 'Se déplacer jusqu’à sa vitesse (10 m) ou manœuvrer.',
    definition:
      'Une Action de Mouvement sert à parcourir jusqu’à sa vitesse de déplacement (10 m de base en COF, hors bonus), se relever si on est Renversé, ouvrir une porte, dégainer une arme ou recharger rapidement avec un talent dédié.',
    ceQuIlResteDansLeTour:
      'Vous conservez votre Action d’Attaque (A) (pour frapper, lancer un sort non limité ou courir une 2e fois sur 10 m supplémentaires), vos Actions Gratuites et votre Réaction.',
    exemples:
      'Se déplacer de 10 m, se relever du sol, recharger une arme à feu avec « Rouleau de tir », ramasser un objet à terre.',
  },
  gratuite: {
    id: 'gratuite',
    label: 'Action Gratuite / Rapide (équiv. Action Bonus)',
    shortLabel: 'Action Gratuite / Bonus',
    badgeStyle: 'bg-[#172b1b] hover:bg-[#1f3b25] text-[#9be8a4] border-[#366b3f]',
    resume: 'Instantanée (0 coût d’action principale ni de mouvement).',
    definition:
      'Chroniques Oubliées Fantasy n’utilise pas de case « Action Bonus » séparée comme d’autres systèmes : les aptitudes instantanées sont des Actions Gratuites / Rapides qui jouent exactement le rôle d’une action bonus sans consommer votre Action d’Attaque ni votre Mouvement.',
    ceQuIlResteDansLeTour:
      'Vous conservez l’intégralité de votre tour normal : 1 Action Limitée (L) OU 1 Action d’Attaque (A) + 1 Action de Mouvement (M), ainsi que votre Réaction. Le MJ limite les abus à 1 ou 2 actions gratuites tactiques raisonnables par tour.',
    exemples:
      'Entrer en Rage du berserk, dégainer avec « Dégainer rapide », se désengager avec « Échappatoire miraculeuse », échanger son Initiative, prononcer une phrase courte.',
  },
  reaction: {
    id: 'reaction',
    label: 'Réaction (hors tour)',
    shortLabel: 'Réaction',
    badgeStyle: 'bg-[#2b1f47] hover:bg-[#3a2a61] text-[#d8b4fe] border-[#61459e]',
    resume: 'Se déclenche immédiatement en réponse à un événement adverse.',
    definition:
      'Une Réaction est une réponse instantanée déclenchée pendant le tour d’un autre combattant (par exemple lorsqu’un ennemi vous attaque, vous rate ou tire à distance).',
    ceQuIlResteDansLeTour:
      'Sauf indication contraire, vous disposez d’une seule Réaction par round (de votre tour au suivant). Elle ne consomme ni votre Action d’Attaque ni votre Action de Mouvement de votre propre tour.',
    exemples:
      'Bouclier d’énergie, Prescience du combat, Parade martiale, Riposte éclair, Encaisser un coup, Déviation de projectiles, Roulade d’esquive.',
  },
  passif: {
    id: 'passif',
    label: 'Passif (0 action)',
    shortLabel: 'Passif (permanent)',
    badgeStyle: 'bg-[#262119] hover:bg-[#332c21] text-[#e5d3b3] border-[#544734]',
    resume: 'Effet permanent ou déclenché automatiquement sans action.',
    definition:
      'Une capacité Passive est toujours active dès qu’elle est acquise (bonus de DEF, PV, Initiative, immunité, vision nocturne) ou s’applique automatiquement à vos jets sans coûter la moindre action.',
    ceQuIlResteDansLeTour:
      'N’entame en rien votre économie d’action : vous conservez l’ensemble de votre tour normal (L, ou A + M, + gratuites + réaction).',
    exemples:
      'Armure sur mesure, Robustesse, Attaque sournoise (s’ajoute à l’attaque), 6ème sens, Arme de prédilection, Peau de pierre.',
  },
  rituel: {
    id: 'rituel',
    label: 'Rituel / Hors combat',
    shortLabel: 'Hors combat / Rituel',
    badgeStyle: 'bg-[#1a2636] hover:bg-[#22334a] text-[#93c5fd] border-[#385985]',
    resume: 'Nécessite plusieurs minutes ou heures au calme (hors mêlée).',
    definition:
      'Capacité de préparation, d’artisanat arcanique ou de récupération qui demande du temps (repos court, atelier, gravure, alchimie ou rituel) et ne peut pas être lancée dans l’urgence d’un round de 10 secondes.',
    ceQuIlResteDansLeTour:
      'Non utilisable pendant un combat actif (ou consomme tout un repos/temps calme), mais ses créations (élixirs, runes, automates, objets renforcés) restent ensuite actives ou utilisables en combat.',
    exemples:
      'Forge d’artefact, Élixir de vigueur, Baguette suprême, Soins de campagne, Ballade apaisante (repos court).',
  },
};

export function resolveActionRule(
  actionCost?: string,
  isLimited?: boolean,
  isSpell?: boolean
): ActionRuleInfo {
  const raw = (actionCost || '').toLowerCase();
  if (raw.includes('passif') && !raw.includes('limitée') && !raw.includes('réaction')) {
    return COF_ACTION_RULES.passif;
  }
  if (raw.includes('réaction') || raw.includes('reaction')) {
    return COF_ACTION_RULES.reaction;
  }
  if (raw.includes('gratuite') || raw.includes('bonus') || raw.includes('rapide')) {
    return COF_ACTION_RULES.gratuite;
  }
  if (raw.includes('mouvement')) {
    return COF_ACTION_RULES.mouvement;
  }
  if (raw.includes('rituel') || raw.includes('hors combat') || raw.includes('atelier')) {
    return COF_ACTION_RULES.rituel;
  }
  if (raw.includes('limitée') || raw.includes('(l)') || isLimited) {
    return COF_ACTION_RULES.limitee;
  }
  if (raw.includes('attaque') || raw.includes('(a)') || isSpell) {
    return COF_ACTION_RULES.attaque;
  }
  return COF_ACTION_RULES.passif;
}
