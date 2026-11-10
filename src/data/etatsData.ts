/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PrejudicialStateDef {
  id: string;
  name: string;
  icon: string;
  impactShort: string;
  desc: string;
  color: string;
  borderColor: string;
  textColor: string;
}

export const ETATS_PREJUDICIABLES: PrejudicialStateDef[] = [
  {
    id: 'affaibli',
    name: 'Affaibli',
    icon: '📉',
    impactShort: 'd12 au lieu du d20 sur tous les tests et attaques',
    desc: 'Le personnage utilise un d12 au lieu du d20 pour tous ses tests de caractéristique et jets d\'attaque. Les dés de dégâts ne sont pas modifiés.',
    color: 'bg-[#3b2318]',
    borderColor: 'border-[#a85a32]',
    textColor: 'text-[#ffb38a]',
  },
  {
    id: 'aveugle',
    name: 'Aveuglé',
    icon: '🙈',
    impactShort: 'Init -5, Attaque -5, DEF -5, Déplacement /2',
    desc: 'Initiative -5, Attaque au contact -5, Défense -5, Attaque à distance -10. Déplacements réduits de moitié. Les cibles bénéficient d\'un couvert total si l\'aveuglement persiste.',
    color: 'bg-[#291e14]',
    borderColor: 'border-[#8c6530]',
    textColor: 'text-[#f5d089]',
  },
  {
    id: 'etourdi',
    name: 'Étourdi',
    icon: '⚡',
    impactShort: 'Incapable d\'agir, Défense -5, Tour perdu',
    desc: 'Incapable d\'agir. Défense réduite de -5 points. Perd automatiquement son tour de jeu. Les ennemis obtiennent l\'avantage pour le frapper.',
    color: 'bg-[#332a10]',
    borderColor: 'border-[#a3841e]',
    textColor: 'text-[#ffea75]',
  },
  {
    id: 'immobilise',
    name: 'Immobilisé',
    icon: '⛓️',
    impactShort: 'Déplacement nul, d12 au lieu de d20',
    desc: 'Déplacement nul (vitesse = 0 m). Utilise un d12 au lieu du d20 pour tous ses tests de caractéristique et jets d\'attaque. Subit les attaques avec un malus de défense.',
    color: 'bg-[#23232b]',
    borderColor: 'border-[#5b5b7a]',
    textColor: 'text-[#c7c7e6]',
  },
  {
    id: 'paralyse',
    name: 'Paralysé',
    icon: '🧊',
    impactShort: 'Incapable de bouger, touché auto au contact (Critique garanti)',
    desc: 'Incapable de bouger ou d\'effectuer la moindre action physique ou magique. Touché automatiquement au contact et subit un coup critique garanti sur chaque blessure reçue.',
    color: 'bg-[#142838]',
    borderColor: 'border-[#306894]',
    textColor: 'text-[#94d5ff]',
  },
  {
    id: 'ralenti',
    name: 'Ralenti',
    icon: '🐢',
    impactShort: '1 seule action par tour (soit attaque, soit mouvement)',
    desc: 'Le personnage ne peut effectuer qu\'une seule action par tour : soit attaquer, soit effectuer une action de mouvement (mais pas les deux). Son initiative est divisée par 2.',
    color: 'bg-[#1e2e1a]',
    borderColor: 'border-[#437535]',
    textColor: 'text-[#aee69e]',
  },
  {
    id: 'renverse',
    name: 'Renversé',
    icon: '🤸',
    impactShort: 'Attaque -5, Défense -5, Relever = action de mouvement',
    desc: 'Attaque -5, Défense -5 contre les attaques au contact. En revanche, gagne un couvert partiel (+2 DEF) contre les tirs à distance. Se relever consomme une action de mouvement.',
    color: 'bg-[#332219]',
    borderColor: 'border-[#8f5135]',
    textColor: 'text-[#ffad8a]',
  },
  {
    id: 'surpris',
    name: 'Surpris',
    icon: '❗',
    impactShort: 'Aucune action au 1er tour, Défense -5',
    desc: 'Aucune action possible au 1er tour de combat. Défense amputée de -5 points. Le personnage ne peut pas réagir ni lancer de contre-attaque tant que le 1er tour n\'est pas achevé.',
    color: 'bg-[#3d1818]',
    borderColor: 'border-[#a33939]',
    textColor: 'text-[#ff9999]',
  },
  {
    id: 'asphyxie',
    name: 'Asphyxié',
    icon: '🫧',
    impactShort: '1d6 DM direct chaque tour (ignore l\'armure)',
    desc: 'Privé d\'air par étranglement, noyade ou gaz létal : le personnage subit 1d6 DM direct chaque tour sans tenir compte de son armure. Perd connaissance si ses PV tombent à 0.',
    color: 'bg-[#152936]',
    borderColor: 'border-[#2f6a8f]',
    textColor: 'text-[#9ee0ff]',
  },
  {
    id: 'empoisonne',
    name: 'Empoisonné',
    icon: '🧪',
    impactShort: 'Dégâts réguliers chaque tour & -2 à tous les tests',
    desc: 'Subit des dégâts automatiques au début de chaque tour de jeu et applique un malus de -2 à tous ses tests de caractéristique et d\'attaque jusqu\'à guérison ou dissipation.',
    color: 'bg-[#1a331c]',
    borderColor: 'border-[#38853e]',
    textColor: 'text-[#9effa7]',
  },
  {
    id: 'terrorise',
    name: 'Terrorisé',
    icon: '😱',
    impactShort: 'Fuite obligatoire, -2 à toutes les actions',
    desc: 'Obligation absolue de fuir la source de terreur par tous les moyens possibles. Subit un malus de -2 à toutes ses actions tant que la créature terrifiante reste en vue.',
    color: 'bg-[#331833]',
    borderColor: 'border-[#8a338a]',
    textColor: 'text-[#f5aef5]',
  },
  {
    id: 'endormi',
    name: 'Endormi',
    icon: '💤',
    impactShort: 'Considéré sans défense (Critique auto au contact)',
    desc: 'Plongé dans un sommeil magique ou narcotique : considéré comme sans défense (coup critique automatique au contact). Se réveille immédiatement s\'il subit des DM ou est secoué violemment.',
    color: 'bg-[#211b33]',
    borderColor: 'border-[#54418a]',
    textColor: 'text-[#cdbeff]',
  },
  {
    id: 'invisible',
    name: 'Invisible',
    icon: '👻',
    impactShort: '+5 en attaque & +5 en défense',
    desc: 'Indétectable à la vue : bénéficie de +5 à ses tests d\'attaque et de +5 en Défense contre toute créature incapable de percevoir les entités invisibles.',
    color: 'bg-[#1b2b36]',
    borderColor: 'border-[#3c7091]',
    textColor: 'text-[#b0e7ff]',
  },
  {
    id: 'inconscient',
    name: 'Inconscient / Mourant',
    icon: '💀',
    impactShort: '0 PV : Hors de combat, tests de Constitution contre la mort',
    desc: 'À 0 PV, le personnage s\'effondre. Chaque tour, il doit réussir un test de CON difficulté 10 sous peine de succomber définitivement sans soins d\'urgence.',
    color: 'bg-[#401212]',
    borderColor: 'border-[#b02323]',
    textColor: 'text-[#ff9494]',
  },
];

export function getStateDef(nameOrId: string): PrejudicialStateDef | undefined {
  const q = nameOrId.trim().toLowerCase();
  return ETATS_PREJUDICIABLES.find(
    (e) => e.id === q || e.name.toLowerCase() === q || q.includes(e.name.toLowerCase())
  );
}
