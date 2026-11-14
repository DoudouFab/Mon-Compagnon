import { Character, Monster } from '../types/chroniques';

/**
 * Générateur d'illustrations & portraits dark-fantasy 100% gratuit et local (SVG vectoriel -> WebP).
 * Respecte strictement les critères du personnage (race, profil, armure, armes)
 * ou de la créature (famille, NC, taille, milieu, aspect physique, attaques).
 */

const hashString = (str: string): number => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};

const PALETTES = [
  { bg1: '#1c120d', bg2: '#3d2214', accent: '#f3d48d', glow: '#d4a84a', aura: '#e08b36' },
  { bg1: '#140f24', bg2: '#2e1b4d', accent: '#e2c6ff', glow: '#a855f7', aura: '#7c3aed' },
  { bg1: '#0f1c18', bg2: '#1b382c', accent: '#b8f2c2', glow: '#4ade80', aura: '#16a34a' },
  { bg1: '#1f0d12', bg2: '#421621', accent: '#ffb8c6', glow: '#e11d48', aura: '#be123c' },
  { bg1: '#0f1724', bg2: '#1d324d', accent: '#bae6fd', glow: '#38bdf8', aura: '#0284c7' },
  { bg1: '#1a1410', bg2: '#332419', accent: '#fde68a', glow: '#f59e0b', aura: '#b45309' },
];

export interface CreatureCriteriaSummary {
  archetypeLabel: string;
  environmentLabel: string;
  scaleLabel: string;
  dangerLabel: string;
}

const detectMonsterArchetype = (m: Monster): { key: string; label: string } => {
  const hay = `${m.n} ${m.fam || ''} ${m.traits || ''} ${m.descPhysique || ''} ${m.att || ''}`.toLowerCase();
  if (/araign|arachn|toile|chitine/.test(hay)) return { key: 'arachnid', label: 'Arachnide / Toile' };
  if (/dragon|wyrm|drake|écaille|souffle/.test(hay)) return { key: 'dragon', label: 'Draconique / Ailé' };
  if (/malin|démon|diable|ombre|néant|abomination|faille|corrompu|tentacul|cauchemar|obscure/.test(hay))
    return { key: 'abyssal', label: 'Entité de l’Obscure / Abomination' };
  if (/squelette|zombie|goules?|fantôme|spectre|liche|vampire|mort-vivant|revenant|momie/.test(hay))
    return { key: 'undead', label: 'Mort-vivant / Spectral' };
  if (/golem|pierre|statue|magma|volcan|armure|colosse|ours/.test(hay))
    return { key: 'golem', label: 'Colosse / Blindé' };
  if (/arbre|plante|fange|champignon|vase|limon|gelée/.test(hay))
    return { key: 'ooze_flora', label: 'Flore / Vase / Fange' };
  if (/loup|bête|bison|sanglier|rat|corbeau|chouette|ours|serpent|animal|griffon|manticore|chimère/.test(hay))
    return { key: 'beast', label: 'Bête / Monstre sauvage' };
  if (/gobelin|orque|troll|ogre|géant|kobold|gnoll|homme-lézard|mino/.test(hay))
    return { key: 'monstrous', label: 'Humanoïde monstrueux' };
  return { key: 'humanoid', label: 'Figure / Combattant' };
};

const detectEnvironment = (m: Monster): { key: string; label: string } => {
  const mil = `${m.milieu || ''} ${m.descPhysique || ''}`.toLowerCase();
  if (/gouffre|faille|obscure|abysse|néant|miroir/.test(mil)) return { key: 'rift', label: 'Faille & Obscure' };
  if (/forêt|bois|sylve|arbre/.test(mil)) return { key: 'forest', label: 'Forêt & Sylve' };
  if (/marais|fange|égout|eau|lac|marécage/.test(mil)) return { key: 'swamp', label: 'Marais & Fange' };
  if (/montagne|volcan|caverne|grotte|souterrain|mine|roche/.test(mil)) return { key: 'cavern', label: 'Cavernes & Roches' };
  if (/manoir|donjon|ruine|urbain|ville|cité|elden|norvhal/.test(mil)) return { key: 'ruins', label: 'Ruines & Cités' };
  return { key: 'wild', label: "Terres sauvages" };
};

export const inspectMonsterCriteria = (m: Monster): CreatureCriteriaSummary => {
  const arch = detectMonsterArchetype(m);
  const env = detectEnvironment(m);
  const taille = m.taille || 'Moyenne';
  return {
    archetypeLabel: arch.label,
    environmentLabel: env.label,
    scaleLabel: taille,
    dangerLabel: `NC ${m.nc}`,
  };
};

const renderEnvironmentBackdrop = (envKey: string, pal: typeof PALETTES[number], seed: number): string => {
  const moonX = 80 + (seed % 224);
  const moonY = 66 + (seed % 34);
  const stars = Array.from({ length: 14 }, (_, i) => {
    const x = ((seed * (i + 3) * 37) % 340) + 22;
    const y = ((seed * (i + 7) * 29) % 160) + 18;
    const r = (i % 3 === 0 ? 1.8 : 1.0);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${pal.accent}" opacity="0.45"/>`;
  }).join('');

  if (envKey === 'rift') {
    return `
      ${stars}
      <path d="M192 20 L176 95 L208 145 L182 230 L198 310" stroke="${pal.glow}" stroke-width="5" fill="none" opacity="0.55" stroke-linecap="round"/>
      <path d="M192 20 L176 95 L208 145 L182 230 L198 310" stroke="#ffffff" stroke-width="1.5" fill="none" opacity="0.6"/>
      <ellipse cx="192" cy="180" rx="130" ry="130" fill="none" stroke="${pal.aura}" stroke-width="1.2" stroke-dasharray="6 8" opacity="0.45"/>
    `;
  }
  if (envKey === 'forest') {
    return `
      <circle cx="${moonX}" cy="${moonY}" r="28" fill="${pal.accent}" opacity="0.22"/>
      <path d="M0 384 L0 190 L28 110 L52 195 L88 125 L118 220 L0 384 Z" fill="#090d0a" opacity="0.8"/>
      <path d="M384 384 L384 185 L350 105 L318 205 L285 135 L258 230 L384 384 Z" fill="#090d0a" opacity="0.8"/>
    `;
  }
  if (envKey === 'ruins') {
    return `
      <circle cx="${moonX}" cy="${moonY}" r="32" fill="${pal.accent}" opacity="0.25"/>
      <rect x="24" y="130" width="26" height="210" fill="#0c0a09" opacity="0.72"/>
      <rect x="334" y="110" width="28" height="230" fill="#0c0a09" opacity="0.72"/>
      <path d="M24 130 L50 115 L50 130 Z M334 110 L362 128 L334 128 Z" fill="#0c0a09" opacity="0.72"/>
      <path d="M90 120 Q192 48 294 120" stroke="${pal.glow}" stroke-width="2" fill="none" opacity="0.3"/>
    `;
  }
  if (envKey === 'cavern') {
    return `
      <path d="M0 0 L80 0 L42 95 L18 50 L0 110 Z" fill="#080605" opacity="0.85"/>
      <path d="M384 0 L300 0 L338 92 L362 45 L384 105 Z" fill="#080605" opacity="0.85"/>
      <path d="M0 384 L0 265 L65 215 L125 275 L250 270 L325 205 L384 260 L384 384 Z" fill="#0b0806" opacity="0.88"/>
    `;
  }
  return `
    ${stars}
    <circle cx="${moonX}" cy="${moonY}" r="30" fill="${pal.accent}" opacity="0.24"/>
    <path d="M0 320 Q96 260 192 295 T384 285 L384 384 L0 384 Z" fill="#090706" opacity="0.82"/>
  `;
};

const renderMonsterSilhouette = (archKey: string, m: Monster, pal: typeof PALETTES[number], seed: number): string => {
  const hay = `${m.n} ${m.taille || ''} ${m.descPhysique || ''} ${m.att || ''}`.toLowerCase();
  const isColossal = /coloss|titan|géant|massive|3,00|4,00|5,00|6,00/.test(hay);
  const scale = isColossal ? 1.07 : /petite|minuscule|0,50|0,80|1,00/.test(hay) ? 0.86 : 0.98;
  const eyeColor = pal.glow;

  const wrap = (inner: string) =>
    `<g transform="translate(192,198) scale(${scale}) translate(-192,-198)">${inner}</g>`;

  if (archKey === 'arachnid') {
    return wrap(`
      <g stroke="${pal.accent}" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.9">
        <path d="M165 185 L105 130 L68 205"/>
        <path d="M160 202 L88 180 L55 262"/>
        <path d="M165 218 L98 232 L78 308"/>
        <path d="M172 232 L126 276 L118 332"/>
        <path d="M219 185 L279 130 L316 205"/>
        <path d="M224 202 L296 180 L329 262"/>
        <path d="M219 218 L286 232 L306 308"/>
        <path d="M212 232 L258 276 L266 332"/>
      </g>
      <ellipse cx="192" cy="175" rx="46" ry="54" fill="#120b14" stroke="${pal.glow}" stroke-width="3"/>
      <circle cx="192" cy="228" r="28" fill="#1a101d" stroke="${pal.accent}" stroke-width="2.5"/>
      <circle cx="178" cy="224" r="4" fill="#ff3355"/>
      <circle cx="206" cy="224" r="4" fill="#ff3355"/>
      <circle cx="187" cy="214" r="3" fill="#ff6680"/>
      <circle cx="197" cy="214" r="3" fill="#ff6680"/>
      <path d="M178 248 L184 268 L192 252 L200 268 L206 248" stroke="${pal.accent}" stroke-width="3" fill="none"/>
    `);
  }

  if (archKey === 'dragon') {
    return wrap(`
      <path d="M192 175 L62 85 L86 185 L125 168 L142 225 Z" fill="#140d10" stroke="${pal.glow}" stroke-width="2.5"/>
      <path d="M192 175 L322 85 L298 185 L259 168 L242 225 Z" fill="#140d10" stroke="${pal.glow}" stroke-width="2.5"/>
      <path d="M148 330 Q158 220 192 165 Q226 220 236 330 Z" fill="#1c1114" stroke="${pal.accent}" stroke-width="2.5"/>
      <path d="M192 108 L168 148 L178 185 L206 185 L216 148 Z" fill="#211317" stroke="${pal.glow}" stroke-width="2.5"/>
      <path d="M174 120 L146 72 L166 112 M210 120 L238 72 L218 112" stroke="${pal.accent}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <circle cx="182" cy="144" r="4" fill="${eyeColor}"/>
      <circle cx="202" cy="144" r="4" fill="${eyeColor}"/>
    `);
  }

  if (archKey === 'undead') {
    return wrap(`
      <path d="M120 340 Q135 215 192 170 Q249 215 264 340 Q228 318 192 338 Q156 318 120 340 Z" fill="#14141c" stroke="${pal.glow}" stroke-width="2.5"/>
      <circle cx="192" cy="138" r="34" fill="#e5dec9" stroke="#2c241b" stroke-width="2.5"/>
      <path d="M174 164 L178 182 L206 182 L210 164" fill="#d4ccb4"/>
      <circle cx="179" cy="136" r="7" fill="#0d090c"/>
      <circle cx="205" cy="136" r="7" fill="#0d090c"/>
      <circle cx="179" cy="136" r="3" fill="${eyeColor}"/>
      <circle cx="205" cy="136" r="3" fill="${eyeColor}"/>
      <path d="M188 150 L192 142 L196 150 Z" fill="#1b1410"/>
      <path d="M178 172 L206 172 M183 166 L183 178 M192 166 L192 178 M201 166 L201 178" stroke="#2c241b" stroke-width="2"/>
    `);
  }

  if (archKey === 'abyssal') {
    return wrap(`
      <g stroke="${pal.glow}" stroke-width="5" fill="none" opacity="0.85" stroke-linecap="round">
        <path d="M150 245 Q92 225 74 285"/>
        <path d="M156 268 Q95 292 86 340"/>
        <path d="M234 245 Q292 225 310 285"/>
        <path d="M228 268 Q289 292 298 340"/>
      </g>
      <path d="M135 335 Q142 188 192 122 Q242 188 249 335 Z" fill="#120b18" stroke="${pal.accent}" stroke-width="2.5"/>
      <path d="M168 128 Q145 78 124 88 M216 128 Q239 78 260 88" stroke="${pal.accent}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <ellipse cx="192" cy="158" rx="18" ry="11" fill="#060408" stroke="${pal.glow}" stroke-width="2"/>
      <ellipse cx="192" cy="158" rx="4" ry="9" fill="${eyeColor}"/>
      <path d="M168 205 L192 232 L216 205" stroke="${pal.glow}" stroke-width="2.5" fill="none"/>
    `);
  }

  if (archKey === 'golem') {
    return wrap(`
      <path d="M98 338 L112 182 L152 148 L232 148 L272 182 L286 338 Z" fill="#1f1a17" stroke="${pal.accent}" stroke-width="3"/>
      <path d="M162 148 L168 96 L216 96 L222 148 Z" fill="#2b241f" stroke="${pal.glow}" stroke-width="2.5"/>
      <path d="M138 192 L176 238 L156 290 M246 196 L212 248 L228 300" stroke="${pal.glow}" stroke-width="3" fill="none" opacity="0.85"/>
      <rect x="174" y="114" width="12" height="6" rx="2" fill="${eyeColor}"/>
      <rect x="198" y="114" width="12" height="6" rx="2" fill="${eyeColor}"/>
    `);
  }

  if (archKey === 'beast') {
    return wrap(`
      <path d="M118 335 Q128 210 192 178 Q256 210 266 335 Z" fill="#1b1410" stroke="${pal.accent}" stroke-width="2.5"/>
      <path d="M148 166 L138 96 L172 128 L212 128 L246 96 L236 166 Q192 198 148 166 Z" fill="#241a13" stroke="${pal.glow}" stroke-width="2.5"/>
      <circle cx="176" cy="150" r="5" fill="${eyeColor}"/>
      <circle cx="208" cy="150" r="5" fill="${eyeColor}"/>
      <path d="M174 176 L181 190 L192 178 L203 190 L210 176" stroke="#f5ebd6" stroke-width="3" fill="none"/>
    `);
  }

  // humanoid / monstrous fallback
  const hasShield = /bouclier|garde|soldat|élite|varn|ours/.test(hay);
  const hasSword = /épée|lame|hache|dague|lance/.test(hay);
  return wrap(`
    <path d="M116 340 Q126 205 192 182 Q258 205 268 340 Z" fill="#1b1613" stroke="${pal.accent}" stroke-width="2.5"/>
    <path d="M164 134 Q164 96 192 96 Q220 96 220 134 L214 166 Q192 180 170 166 Z" fill="#241c17" stroke="${pal.glow}" stroke-width="2.5"/>
    ${seed % 2 === 0 ? `<path d="M160 120 Q192 84 224 120" stroke="${pal.accent}" stroke-width="3" fill="none"/>` : ''}
    <circle cx="181" cy="134" r="3.5" fill="${eyeColor}"/>
    <circle cx="203" cy="134" r="3.5" fill="${eyeColor}"/>
    ${hasShield ? `<path d="M236 205 L288 205 L282 268 L262 292 L242 268 Z" fill="#291f17" stroke="${pal.glow}" stroke-width="3"/>` : ''}
    ${hasSword ? `<path d="M98 292 L124 148 L134 156 L110 296 Z" fill="#d8dee9" stroke="${pal.accent}" stroke-width="1.5"/>` : ''}
  `);
};

const renderSignatureCreature = (m: Monster, pal: typeof PALETTES[number], seed: number): string | null => {
  const n = m.n.toLowerCase();
  const hay = `${n} ${m.fam || ''} ${m.descPhysique || ''}`.toLowerCase();
  const eyeGlow = pal.glow;

  // 1. TOM VADOR OMBRAGE (Masque-miroir sans visage, robe blanche effilochée/calcinée en bas, vortex vert sombre de visages, lame & grimoire)
  if (n.includes('tom vador') || n.includes('ombrage')) {
    return `
      <g opacity="0.88">
        <circle cx="192" cy="192" r="145" fill="#071612" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="10 6"/>
        <path d="M70 190 Q110 110 192 90 Q285 110 315 190 Q280 280 192 295 Q105 280 70 190 Z" fill="#0b241d" stroke="#34d399" stroke-width="1.5" opacity="0.7"/>
        <ellipse cx="105" cy="145" rx="14" ry="18" fill="#183b31" opacity="0.85"/>
        <circle cx="100" cy="142" r="2.2" fill="#86efac"/><circle cx="110" cy="142" r="2.2" fill="#86efac"/>
        <ellipse cx="280" cy="150" rx="15" ry="20" fill="#183b31" opacity="0.85"/>
        <circle cx="274" cy="146" r="2.2" fill="#86efac"/><circle cx="286" cy="146" r="2.2" fill="#86efac"/>
      </g>
      <path d="M126 346 L142 182 Q192 162 242 182 L258 346 L236 330 L216 348 L192 328 L168 348 L148 330 Z" fill="#e2dfd9" stroke="#334155" stroke-width="2.5"/>
      <path d="M126 346 L144 268 L178 290 L192 262 L212 292 L242 268 L258 346 L236 330 L216 348 L192 328 L168 348 L148 330 Z" fill="#1f242b" opacity="0.88"/>
      <path d="M168 184 L192 224 L216 184" fill="none" stroke="#94a3b8" stroke-width="2"/>
      <ellipse cx="192" cy="134" rx="28" ry="37" fill="#cbd5e1" stroke="#475569" stroke-width="3"/>
      <path d="M174 114 Q192 104 210 116 L205 162 Q192 168 179 162 Z" fill="#f8fafc" opacity="0.55"/>
      <path d="M178 130 Q185 135 190 128 M196 144 Q202 148 208 142" stroke="#64748b" stroke-width="1.5" fill="none" opacity="0.7"/>
      <path d="M100 300 L132 135 L140 144 L112 304 Z" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
      <rect x="242" y="218" width="38" height="48" rx="4" fill="#1b141a" stroke="#d4a84a" stroke-width="2"/>
      <circle cx="261" cy="242" r="7" fill="none" stroke="#34d399" stroke-width="1.5"/>
    `;
  }

  // 2. TÉO, LE VEILLEUR DES LÉGENDES (Jeune garçon cheveux ébouriffés, tablier cuir, grande besace, épée en bois, pierre bleue)
  if (n.includes('téo') || n.includes('teo')) {
    return `
      <ellipse cx="192" cy="195" rx="130" ry="130" fill="#38bdf8" opacity="0.1"/>
      <path d="M132 345 L145 205 Q192 185 239 205 L252 345 Z" fill="#3b2f26" stroke="#c28e54" stroke-width="2.5"/>
      <path d="M152 214 L232 214 L238 320 L146 320 Z" fill="#7c4a26" stroke="#d99b52" stroke-width="2"/>
      <rect x="214" y="232" width="44" height="52" rx="10" fill="#5c361b" stroke="#f3d48d" stroke-width="2"/>
      <circle cx="228" cy="244" r="5" fill="#93c5fd"/><circle cx="242" cy="250" r="5" fill="#fcd34d"/>
      <circle cx="192" cy="144" r="32" fill="#f0c8a0" stroke="#4a2e1a" stroke-width="2"/>
      <path d="M158 134 Q165 96 196 102 Q226 98 228 136 Q210 116 192 120 Q174 114 158 134 Z" fill="#5b341c"/>
      <path d="M174 104 L164 88 M208 104 L222 90" stroke="#65a30d" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="180" cy="142" r="3.5" fill="#291d14"/><circle cx="204" cy="142" r="3.5" fill="#291d14"/>
      <path d="M180 158 Q192 167 204 158" stroke="#7c3f26" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M108 296 L128 158 L138 162 L120 298 Z" fill="#9a6436" stroke="#d99b52" stroke-width="1.5"/>
      <circle cx="236" cy="272" r="9" fill="#38bdf8" opacity="0.85"/>
    `;
  }

  // 3. VARN LE PROTECTEUR (Colosse armure noire & rouge runique volcanique, heaume tête d'ours, yeux orange, pavois runique rouge)
  if (n.includes('varn')) {
    return `
      <path d="M98 345 L114 176 L154 148 L230 148 L270 176 L286 345 Z" fill="#171314" stroke="#ef4444" stroke-width="3"/>
      <path d="M126 196 L176 226 L146 286 M258 196 L208 226 L238 286" stroke="#f97316" stroke-width="3" fill="none" opacity="0.85"/>
      <path d="M150 152 L144 96 L172 114 L212 114 L240 96 L234 152 Q192 172 150 152 Z" fill="#1c1617" stroke="#f87171" stroke-width="2.5"/>
      <rect x="170" y="128" width="14" height="6" rx="2" fill="#fb923c"/>
      <rect x="200" y="128" width="14" height="6" rx="2" fill="#fb923c"/>
      <path d="M232 184 L298 184 L292 292 L265 322 L238 292 Z" fill="#1f1414" stroke="#ef4444" stroke-width="3.5"/>
      <path d="M265 208 L252 246 L278 246 L262 284" stroke="#f97316" stroke-width="3" fill="none"/>
      <path d="M90 302 L110 152" stroke="#9ca3af" stroke-width="6" stroke-linecap="round"/>
      <circle cx="112" cy="144" r="18" fill="#271c1b" stroke="#f97316" stroke-width="3"/>
    `;
  }

  // 4. LE MALIN (Colosse 3m obsidienne & cendre, veines de magma écarlate, ailes de dragon déchirées, yeux jaunes verticaux)
  if (n.includes('le malin') || n === 'malin') {
    return `
      <path d="M192 175 L46 72 L76 196 L120 176 L136 244 Z" fill="#110b0d" stroke="#ef4444" stroke-width="2.5"/>
      <path d="M192 175 L338 72 L308 196 L264 176 L248 244 Z" fill="#110b0d" stroke="#ef4444" stroke-width="2.5"/>
      <path d="M114 345 L128 182 L192 154 L256 182 L270 345 Z" fill="#161316" stroke="#dc2626" stroke-width="3"/>
      <path d="M150 202 L192 245 L234 202 M162 250 L192 298 L222 250" stroke="#f97316" stroke-width="3.5" fill="none" opacity="0.9"/>
      <path d="M164 150 L152 82 L176 112 L208 112 L232 82 L220 150 Z" fill="#1c181d" stroke="#ef4444" stroke-width="2.5"/>
      <ellipse cx="179" cy="132" rx="3.5" ry="9" fill="#fde047"/>
      <ellipse cx="205" cy="132" rx="3.5" ry="9" fill="#fde047"/>
    `;
  }

  // 5. OURS VERT (Garde d'élite Norvhal) & OURS SANGLANT
  if (n.includes('ours vert') || n.includes('ours sanglant')) {
    const isBlood = n.includes('sanglant');
    const armor = isBlood ? '#3a0e14' : '#143322';
    const trim = isBlood ? '#ef4444' : '#cbd5e1';
    const glow = isBlood ? '#ff2a4d' : '#4ade80';
    return `
      <path d="M104 345 L118 180 L192 154 L266 180 L280 345 Z" fill="${armor}" stroke="${trim}" stroke-width="3"/>
      <path d="M150 154 L142 94 L172 116 L212 116 L242 94 L234 154 Q192 174 150 154 Z" fill="${armor}" stroke="${trim}" stroke-width="2.5"/>
      <circle cx="177" cy="134" r="4.5" fill="${glow}"/><circle cx="207" cy="134" r="4.5" fill="${glow}"/>
      <path d="M236 195 L296 195 L288 286 L266 312 L244 286 Z" fill="${armor}" stroke="${trim}" stroke-width="3"/>
      <circle cx="266" cy="242" r="14" fill="none" stroke="${glow}" stroke-width="2"/>
      <path d="M98 310 L114 148" stroke="#94a3b8" stroke-width="5"/>
      <path d="M114 148 L152 134 L146 184 L112 178 Z" fill="#475569" stroke="${trim}" stroke-width="2"/>
    `;
  }

  // 6. SOLDAT / SOLDAT D'ÉLITE / CHEF D'ARMÉE / VILLAGEOIS / BANDIT / CHEF BANDIT
  if (/soldat|chef d’armée|chef d'armée|général|villageois|bandit/.test(n)) {
    const isBandit = n.includes('bandit');
    const isElite = n.includes('élite') || n.includes('général') || n.includes('chef');
    const armorCol = isBandit ? '#2b2019' : isElite ? '#1e3a2f' : '#25332d';
    const trimCol = isElite ? '#facc15' : isBandit ? '#f87171' : '#cbd5e1';
    return `
      <path d="M118 345 Q128 202 192 180 Q256 202 266 345 Z" fill="${armorCol}" stroke="${trimCol}" stroke-width="2.5"/>
      <circle cx="192" cy="134" r="30" fill="#d9b798" stroke="#2c1d13" stroke-width="2"/>
      ${isBandit
        ? `<path d="M162 138 Q192 150 222 138 L216 164 Q192 172 168 164 Z" fill="#18120e"/>
           <path d="M156 126 Q192 86 228 126" fill="#2c1e16" stroke="${trimCol}" stroke-width="2"/>`
        : `<path d="M156 130 Q192 88 228 130 L220 144 Q192 132 164 144 Z" fill="#64748b" stroke="${trimCol}" stroke-width="2"/>`}
      <circle cx="180" cy="132" r="3" fill="#111"/><circle cx="204" cy="132" r="3" fill="#111"/>
      ${!n.includes('villageois') ? `<path d="M236 208 L286 208 L278 278 L261 298 L244 278 Z" fill="${armorCol}" stroke="${trimCol}" stroke-width="2.5"/>` : ''}
      <path d="M96 300 L122 146 L130 152 L106 304 Z" fill="#e2e8f0" stroke="${trimCol}" stroke-width="1.5"/>
    `;
  }

  // 7. CERVEAU DE LA FAILLE (Cerveau flottant pulsant + visages + tentacules psychiques)
  if (n.includes('cerveau')) {
    return `
      <g stroke="#e879f9" stroke-width="5" fill="none" stroke-linecap="round">
        <path d="M155 215 Q105 265 92 335"/><path d="M175 225 Q150 285 154 345"/>
        <path d="M209 225 Q234 285 230 345"/><path d="M229 215 Q279 265 292 335"/>
      </g>
      <ellipse cx="192" cy="162" rx="74" ry="58" fill="#4c1d4b" stroke="#f0abfc" stroke-width="3"/>
      <path d="M138 152 Q165 128 192 152 Q219 128 246 152 M145 178 Q172 198 192 174 Q212 198 239 178" stroke="#f472b6" stroke-width="3" fill="none"/>
      <circle cx="168" cy="156" r="8" fill="#1f0820"/><circle cx="216" cy="156" r="8" fill="#1f0820"/>
      <circle cx="168" cy="156" r="3.5" fill="#fde047"/><circle cx="216" cy="156" r="3.5" fill="#fde047"/>
    `;
  }

  // 8. PENDLE GLISSANT (Vague de goudron noir occulte absorbant des silhouettes)
  if (n.includes('pendle')) {
    return `
      <path d="M56 340 Q72 230 116 205 Q150 110 198 124 Q246 95 274 198 Q326 220 330 340 Z" fill="#09080c" stroke="#a855f7" stroke-width="3"/>
      <circle cx="152" cy="212" r="14" fill="#cbd5e1" opacity="0.35"/>
      <circle cx="228" cy="192" r="16" fill="#cbd5e1" opacity="0.35"/>
      <circle cx="192" cy="166" r="6" fill="#f43f5e"/><circle cx="212" cy="168" r="5" fill="#f43f5e"/>
    `;
  }

  // 9. SORCIÈRES THARNÉA (Eau / Sang / Os) & MORWÈN / BANSHEE / MÈRE MALKIN
  if (/sorcière|morwèn|mère malkin|banshee/.test(n)) {
    const col = n.includes('eau') ? '#38bdf8' : n.includes('sang') || n.includes('morwèn') ? '#ef4444' : '#e5dec9';
    return `
      ${n.includes('morwèn') ? `<path d="M192 185 L52 80 L88 205 Z M192 185 L332 80 L296 205 Z" fill="#130912" stroke="${col}" stroke-width="2.5"/>` : ''}
      <path d="M116 342 Q132 195 192 162 Q252 195 268 342 Z" fill="#161118" stroke="${col}" stroke-width="2.5"/>
      <circle cx="192" cy="134" r="28" fill="#1f1722" stroke="${col}" stroke-width="2"/>
      <circle cx="181" cy="132" r="4" fill="${col}"/><circle cx="203" cy="132" r="4" fill="${col}"/>
      ${n.includes('os') ? `<circle cx="118" cy="176" r="12" fill="#e5dec9"/><circle cx="266" cy="176" r="12" fill="#e5dec9"/><circle cx="192" cy="82" r="11" fill="#e5dec9"/>` : ''}
      ${n.includes('eau') ? `<path d="M108 260 Q145 215 192 255 Q239 215 276 260" stroke="#38bdf8" stroke-width="4" fill="none"/>` : ''}
    `;
  }

  // 10. BÛCHERON SANS TÊTE
  if (n.includes('bûcheron')) {
    return `
      <path d="M108 342 L124 186 L192 172 L260 186 L276 342 Z" fill="#3a1919" stroke="#f87171" stroke-width="2.5"/>
      <ellipse cx="192" cy="172" rx="22" ry="9" fill="#991b1b" stroke="#fca5a5" stroke-width="2"/>
      <path d="M84 316 L124 128" stroke="#9ca3af" stroke-width="6"/>
      <path d="M124 128 L174 114 L164 176 L120 166 Z" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
    `;
  }

  // 11. CHAMPIMOCHE & CHAMPIGNON SIFFLANT
  if (n.includes('champi')) {
    const isSifflant = n.includes('sifflant');
    const capCol = isSifflant ? '#6b21a8' : '#7c532c';
    return `
      <path d="M148 338 Q154 220 192 215 Q230 220 236 338 Z" fill="#d6cbb8" stroke="#443829" stroke-width="2.5"/>
      <path d="M82 212 Q192 84 302 212 Q245 232 192 222 Q139 232 82 212 Z" fill="${capCol}" stroke="${pal.accent}" stroke-width="3"/>
      <circle cx="145" cy="166" r="10" fill="#fde047" opacity="0.7"/>
      <circle cx="232" cy="176" r="12" fill="#fde047" opacity="0.7"/>
      <circle cx="192" cy="142" r="8" fill="#fde047" opacity="0.7"/>
      <circle cx="176" cy="252" r="4.5" fill="#ef4444"/><circle cx="208" cy="252" r="4.5" fill="#ef4444"/>
      <ellipse cx="192" cy="276" rx="12" ry="8" fill="#18120e"/>
    `;
  }

  // 12. RONCEUR / LAME-BRANCHUE / REVENANT LIÉ À LA TERRE
  if (/ronceur|lame-branchue|revenant lié/.test(n)) {
    return `
      <path d="M128 342 Q140 205 192 162 Q244 205 256 342 Z" fill="#231a12" stroke="#84cc16" stroke-width="2.5"/>
      <path d="M142 192 L82 146 M242 192 L302 146 M168 158 L142 98 M216 158 L242 98" stroke="#4d7c0f" stroke-width="6" stroke-linecap="round"/>
      <circle cx="178" cy="168" r="4.5" fill="#a3e635"/><circle cx="206" cy="168" r="4.5" fill="#a3e635"/>
      <path d="M82 292 L126 168 L138 176 L96 296 Z" fill="#3f6212" stroke="#bef264" stroke-width="1.5"/>
    `;
  }

  // 13. SKELT HERSE-ÉCHINE
  if (n.includes('skelt')) {
    return `
      <path d="M142 338 L160 198 L192 172 L224 198 L242 338 Z" fill="#262420" stroke="#e5dec9" stroke-width="2.5"/>
      <path d="M192 92 L172 152 L192 204 L212 152 Z" fill="#e5dec9" stroke="#44403c" stroke-width="2"/>
      <path d="M168 188 L120 130 M216 188 L264 130 M192 110 L192 64" stroke="#d4d4d8" stroke-width="4" stroke-linecap="round"/>
      <circle cx="182" cy="142" r="4" fill="#ef4444"/><circle cx="202" cy="142" r="4" fill="#ef4444"/>
    `;
  }

  // 14. POULE DÉMONIAQUE / CORBEAU VIGIE / PIQUENEIGE
  if (/poule|corbeau|piqueneige/.test(n)) {
    const isIce = n.includes('piqueneige');
    const isRooster = n.includes('poule');
    const col = isIce ? '#93c5fd' : isRooster ? '#ef4444' : '#e2e8f0';
    return `
      <path d="M136 332 Q130 218 192 184 Q254 218 248 332 Z" fill="#131318" stroke="${col}" stroke-width="2.5"/>
      <circle cx="192" cy="152" r="28" fill="#1b1b22" stroke="${col}" stroke-width="2.5"/>
      <path d="M192 150 L226 162 L192 168 Z" fill="#f59e0b"/>
      <circle cx="184" cy="146" r="4.5" fill="${col}"/>
      ${isRooster ? `<path d="M174 126 L184 104 L196 122 L208 106 L212 128" fill="#dc2626"/>` : ''}
      ${isIce ? `<path d="M120 205 L78 145 M264 205 L306 145" stroke="#bae6fd" stroke-width="4"/>` : ''}
    `;
  }

  // 15. DOPPEL MIROIR / DOPPELGÄNGER
  if (n.includes('doppel')) {
    return `
      <ellipse cx="192" cy="192" rx="92" ry="126" fill="#0f172a" stroke="#94a3b8" stroke-width="4"/>
      <path d="M132 310 Q144 205 192 184 Q240 205 252 310 Z" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
      <ellipse cx="192" cy="136" rx="28" ry="36" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>
      <path d="M136 120 L248 258 M240 105 L146 270" stroke="#38bdf8" stroke-width="1.5" opacity="0.65"/>
    `;
  }

  // 16. CUBE GÉLATINEUX (DRS)
  if (n.includes('cube gélatineux')) {
    return `
      <polygon points="96,128 248,128 288,92 136,92" fill="#22c55e" opacity="0.28" stroke="#86efac" stroke-width="2.5"/>
      <rect x="96" y="128" width="152" height="152" fill="#16a34a" opacity="0.34" stroke="#86efac" stroke-width="3"/>
      <polygon points="248,128 288,92 288,244 248,280" fill="#15803d" opacity="0.32" stroke="#86efac" stroke-width="2.5"/>
      <circle cx="172" cy="196" r="14" fill="#e5dec9" opacity="0.75"/>
      <path d="M164 212 L180 245 M152 222 L192 220" stroke="#e5dec9" stroke-width="3" opacity="0.75"/>
      <path d="M214 166 L228 238" stroke="#cbd5e1" stroke-width="3.5" opacity="0.8"/>
    `;
  }

  // 17. HYDRE À 5 TÊTES (DRS)
  if (n.includes('hydre')) {
    const heads = [104, 146, 192, 238, 280];
    return `
      <ellipse cx="192" cy="292" rx="76" ry="44" fill="#1b2b1a" stroke="#84cc16" stroke-width="2.5"/>
      ${heads
        .map(
          (hx, i) => `
          <path d="M${172 + i * 10} 266 Q${(192 + hx) / 2} 190 ${hx} 122" stroke="#2f4d29" stroke-width="14" fill="none" stroke-linecap="round"/>
          <path d="M${hx - 14} 118 L${hx} 96 L${hx + 14} 118 L${hx} 134 Z" fill="#233b1e" stroke="#a3e635" stroke-width="2"/>
          <circle cx="${hx - 4}" cy="116" r="2.5" fill="#fde047"/><circle cx="${hx + 4}" cy="116" r="2.5" fill="#fde047"/>`
        )
        .join('')}
    `;
  }

  // 18. KRAKEN DES ABYSSES (DRS)
  if (n.includes('kraken')) {
    return `
      <g stroke="#38bdf8" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.85">
        <path d="M150 220 Q84 205 64 295"/><path d="M164 232 Q105 270 96 346"/>
        <path d="M234 220 Q300 205 320 295"/><path d="M220 232 Q279 270 288 346"/>
      </g>
      <path d="M144 226 Q132 120 192 84 Q252 120 240 226 Z" fill="#0c1c2c" stroke="#38bdf8" stroke-width="3"/>
      <circle cx="172" cy="176" r="8" fill="#facc15"/><circle cx="212" cy="176" r="8" fill="#facc15"/>
    `;
  }

  // 19. CENTAURE / GRIFFON / MÉDUSE
  if (n.includes('centaure')) {
    return `
      <ellipse cx="204" cy="264" rx="74" ry="38" fill="#52301b" stroke="${pal.accent}" stroke-width="2.5"/>
      <path d="M148 278 L142 342 M176 286 L172 342 M234 286 L240 342 M262 276 L268 342" stroke="#3d2211" stroke-width="9" stroke-linecap="round"/>
      <path d="M144 242 L152 162 Q178 148 202 162 L206 238 Z" fill="#d9b28c" stroke="#2c1d13" stroke-width="2"/>
      <circle cx="176" cy="134" r="22" fill="#d9b28c" stroke="#2c1d13" stroke-width="2"/>
      <path d="M108 112 Q88 182 108 250" stroke="#f3d48d" stroke-width="4" fill="none"/>
    `;
  }

  if (n.includes('méduse')) {
    return `
      <path d="M126 342 Q140 208 192 182 Q244 208 258 342 Z" fill="#172b24" stroke="#4ade80" stroke-width="2.5"/>
      <circle cx="192" cy="140" r="28" fill="#9fb5a1" stroke="#1e3a2f" stroke-width="2"/>
      <circle cx="181" cy="138" r="4" fill="#fde047"/><circle cx="203" cy="138" r="4" fill="#fde047"/>
      <g stroke="#22c55e" stroke-width="4" fill="none" stroke-linecap="round">
        <path d="M172 118 Q144 82 128 104"/><path d="M186 112 Q180 72 162 84"/>
        <path d="M202 112 Q212 72 228 86"/><path d="M214 120 Q246 88 260 112"/>
      </g>
    `;
  }

  if (n.includes('griffon')) {
    return `
      <path d="M192 184 L58 84 L88 192 L134 176 Z M192 184 L326 84 L296 192 L250 176 Z" fill="#5c4228" stroke="#f3d48d" stroke-width="2.5"/>
      <ellipse cx="192" cy="256" rx="58" ry="44" fill="#9c6f34" stroke="#f3d48d" stroke-width="2.5"/>
      <circle cx="192" cy="158" r="32" fill="#f5efe6" stroke="#b45309" stroke-width="2.5"/>
      <path d="M186 164 L224 176 L186 184 Z" fill="#f59e0b"/>
      <circle cx="182" cy="150" r="4.5" fill="${eyeGlow}"/>
    `;
  }

  // 20. RAT DE CATHÉDRALE / RAT DES CENDRES / RAT-FAILLE
  if (n.includes('rat')) {
    const glow = n.includes('faille') ? '#ef4444' : n.includes('cendres') ? '#fb923c' : '#e2e8f0';
    return `
      <path d="M114 328 Q128 214 192 194 Q256 214 270 328 Z" fill="#1c1614" stroke="${glow}" stroke-width="2.5"/>
      <ellipse cx="152" cy="138" rx="18" ry="22" fill="#291f1b" stroke="${glow}" stroke-width="2"/>
      <ellipse cx="232" cy="138" rx="18" ry="22" fill="#291f1b" stroke="${glow}" stroke-width="2"/>
      <path d="M150 156 Q192 132 234 156 L216 206 Q192 226 168 206 Z" fill="#261e1b" stroke="${glow}" stroke-width="2.5"/>
      <circle cx="176" cy="164" r="4.5" fill="${glow}"/><circle cx="208" cy="164" r="4.5" fill="${glow}"/>
      <path d="M182 204 L186 220 L198 220 L202 204" fill="#fef3c7"/>
    `;
  }

  // 21. BARGHEST / CHIEN NOIR / CHIOT NOIR / KOBAL
  if (/barghest|chien noir|chiot noir|kobal/.test(hay)) {
    const isChiot = n.includes('chiot');
    const sc = isChiot ? 0.78 : 1.04;
    return `
      <g transform="translate(192,210) scale(${sc}) translate(-192,-210)">
        <path d="M122 336 Q132 210 192 184 Q252 210 262 336 Z" fill="#0d0b0e" stroke="${pal.glow}" stroke-width="2.5"/>
        <path d="M148 166 L138 96 L174 128 L210 128 L246 96 L236 166 Q192 202 148 166 Z" fill="#131015" stroke="${pal.glow}" stroke-width="2.5"/>
        <circle cx="175" cy="150" r="5" fill="${n.includes('chiot') ? '#38bdf8' : '#ef4444'}"/>
        <circle cx="209" cy="150" r="5" fill="${n.includes('chiot') ? '#38bdf8' : '#ef4444'}"/>
        ${n.includes('pendu') ? `<ellipse cx="192" cy="202" rx="34" ry="10" fill="none" stroke="#a16207" stroke-width="5"/>` : ''}
      </g>
    `;
  }

  return null;
};

export const buildMonsterVisualSvg = (monster: Monster, variantSeed = 0): string => {
  const seed = hashString(monster.n + (monster.source || '')) + variantSeed * 7919;
  const pal = PALETTES[(seed + variantSeed) % PALETTES.length];
  const arch = detectMonsterArchetype(monster);
  const env = detectEnvironment(monster);

  const backdrop = renderEnvironmentBackdrop(env.key, pal, seed);
  const signature = renderSignatureCreature(monster, pal, seed);
  const body = signature || renderMonsterSilhouette(arch.key, monster, pal, seed);

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 384" width="384" height="384">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="${pal.bg2}"/>
      <stop offset="100%" stop-color="${pal.bg1}"/>
    </radialGradient>
    <radialGradient id="auraGrad" cx="50%" cy="52%" r="48%">
      <stop offset="0%" stop-color="${pal.glow}" stop-opacity="0.34"/>
      <stop offset="100%" stop-color="${pal.bg1}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="384" height="384" fill="url(#bgGrad)"/>
  <circle cx="192" cy="196" r="165" fill="url(#auraGrad)"/>
  ${backdrop}
  ${body}
  <rect x="8" y="8" width="368" height="368" rx="18" fill="none" stroke="${pal.glow}" stroke-width="2.5" opacity="0.7"/>
  <rect x="16" y="16" width="352" height="352" rx="14" fill="none" stroke="${pal.accent}" stroke-width="1" opacity="0.35"/>
  <text x="192" y="362" text-anchor="middle" font-family="Georgia, serif" font-size="13" font-weight="bold" fill="${pal.accent}" opacity="0.88">${monster.n.slice(0, 30).replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>
</svg>`.trim();
};

const renderFamilierArtwork = (char: Partial<Character>, pal: typeof PALETTES[number], seed: number): string => {
  const hay = `${char.familierEspece || ''} ${char.name || ''} ${char.familierCategorie || ''} ${char.persoTraits || ''}`.toLowerCase();
  const eyeGlow = pal.glow;

  // Draconique / Pseudodragon
  if (/dragon|pseudodragon|wyverne|drake/.test(hay)) {
    return `
      <path d="M192 184 L54 88 L88 188 L128 172 L144 232 Z" fill="#1b0e14" stroke="${pal.glow}" stroke-width="2.5"/>
      <path d="M192 184 L330 88 L296 188 L256 172 L240 232 Z" fill="#1b0e14" stroke="${pal.glow}" stroke-width="2.5"/>
      <path d="M148 334 Q158 228 192 174 Q226 228 236 334 Z" fill="#29121a" stroke="${pal.accent}" stroke-width="2.5"/>
      <path d="M160 226 Q192 250 224 226 M156 262 Q192 288 228 262" stroke="${pal.accent}" stroke-width="2" fill="none" opacity="0.65"/>
      <path d="M192 114 L164 152 L176 190 L208 190 L220 152 Z" fill="#331520" stroke="${pal.glow}" stroke-width="2.5"/>
      <path d="M174 126 L146 78 L168 118 M210 126 L238 78 L216 118" stroke="${pal.accent}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="180" cy="148" r="4.5" fill="${eyeGlow}"/>
      <circle cx="204" cy="148" r="4.5" fill="${eyeGlow}"/>
      <path d="M236 300 Q296 290 308 236 L320 226 L310 248" stroke="${pal.glow}" stroke-width="4" fill="none" stroke-linecap="round"/>
    `;
  }

  // Oiseaux : Corbeau, Chouette, Hibou, Faucon
  if (/corbeau|chouette|hibou|faucon|rapace|oiseau|aigle/.test(hay)) {
    const isOwl = /chouette|hibou/.test(hay);
    const isFalcon = /faucon|aigle|rapace/.test(hay);
    const bodyFill = isOwl ? '#2b241d' : isFalcon ? '#3b2618' : '#121318';
    const wingStroke = isOwl ? '#fde68a' : isFalcon ? '#f59e0b' : pal.accent;
    return `
      <path d="M110 330 Q122 206 192 178 Q262 206 274 330 Z" fill="${bodyFill}" stroke="${wingStroke}" stroke-width="2.5"/>
      <path d="M116 254 Q70 190 96 138 Q128 182 146 228 Z" fill="${bodyFill}" stroke="${pal.glow}" stroke-width="2" opacity="0.9"/>
      <path d="M268 254 Q314 190 288 138 Q256 182 238 228 Z" fill="${bodyFill}" stroke="${pal.glow}" stroke-width="2" opacity="0.9"/>
      <circle cx="192" cy="146" r="36" fill="${bodyFill}" stroke="${wingStroke}" stroke-width="2.5"/>
      ${isOwl ? `
        <path d="M158 118 L144 92 L176 114 M226 118 L240 92 L208 114" stroke="${wingStroke}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="177" cy="144" r="11" fill="#14100c" stroke="${pal.accent}" stroke-width="2"/>
        <circle cx="207" cy="144" r="11" fill="#14100c" stroke="${pal.accent}" stroke-width="2"/>
        <circle cx="177" cy="144" r="5" fill="#fde047"/>
        <circle cx="207" cy="144" r="5" fill="#fde047"/>
        <path d="M186 154 L192 168 L198 154 Z" fill="#f59e0b"/>
      ` : `
        <circle cx="180" cy="140" r="5" fill="${eyeGlow}"/>
        <circle cx="204" cy="140" r="5" fill="${eyeGlow}"/>
        <path d="M186 148 L224 158 L186 168 Z" fill="#f59e0b" stroke="#78350f" stroke-width="1.5"/>
      `}
    `;
  }

  // Félins : Chat noir, Panthère, Lynx
  if (/chat|félin|panthère|lynx|tigre/.test(hay)) {
    return `
      <path d="M132 338 Q144 218 192 196 Q240 218 252 338 Z" fill="#111015" stroke="${pal.glow}" stroke-width="2.5"/>
      <path d="M244 316 Q306 294 298 226 Q294 202 276 210" stroke="${pal.accent}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M152 146 L142 86 L180 120 L204 120 L242 86 L232 146 Q240 192 192 204 Q144 192 152 146 Z" fill="#16141c" stroke="${pal.accent}" stroke-width="2.5"/>
      <ellipse cx="176" cy="150" rx="8" ry="5" fill="${eyeGlow}"/>
      <ellipse cx="208" cy="150" rx="8" ry="5" fill="${eyeGlow}"/>
      <ellipse cx="176" cy="150" rx="2" ry="4.5" fill="#09080c"/>
      <ellipse cx="208" cy="150" rx="2" ry="4.5" fill="#09080c"/>
      <path d="M187 166 L197 166 L192 172 Z" fill="#fda4af"/>
      <path d="M158 164 L120 158 M158 172 L120 176 M226 164 L264 158 M226 172 L264 176" stroke="${pal.accent}" stroke-width="1.5" opacity="0.75"/>
    `;
  }

  // Canidés : Loup, Molosse, Chien, Renard
  if (/loup|molosse|chien|renard|canidé/.test(hay)) {
    const isFox = /renard/.test(hay);
    const fur = isFox ? '#6b2c14' : '#26211e';
    return `
      <path d="M114 338 Q128 210 192 182 Q256 210 270 338 Z" fill="${fur}" stroke="${pal.accent}" stroke-width="2.5"/>
      <path d="M148 168 L138 88 L174 126 L210 126 L246 88 L236 168 Q192 214 148 168 Z" fill="${fur}" stroke="${pal.glow}" stroke-width="2.5"/>
      <path d="M174 166 L192 198 L210 166 Z" fill="#171311" stroke="${pal.accent}" stroke-width="1.5"/>
      <circle cx="176" cy="146" r="5" fill="${eyeGlow}"/>
      <circle cx="208" cy="146" r="5" fill="${eyeGlow}"/>
      <ellipse cx="192" cy="192" rx="8" ry="6" fill="#0b0908"/>
      <path d="M174 202 L180 212 L192 204 L204 212 L210 202" stroke="#f5ebd6" stroke-width="2.5" fill="none"/>
    `;
  }

  // Mustélidés / Rongeurs : Furet, Belette, Rat, Souris
  if (/furet|belette|hermine|rat|souris|écureuil/.test(hay)) {
    return `
      <path d="M138 338 Q148 228 192 204 Q236 228 246 338 Z" fill="#3b2c20" stroke="${pal.accent}" stroke-width="2.5"/>
      <path d="M236 322 Q302 310 314 252" stroke="#5c4433" stroke-width="10" fill="none" stroke-linecap="round"/>
      <circle cx="156" cy="128" r="17" fill="#3b2c20" stroke="${pal.glow}" stroke-width="2"/>
      <circle cx="228" cy="128" r="17" fill="#3b2c20" stroke="${pal.glow}" stroke-width="2"/>
      <path d="M154 144 Q192 116 230 144 L214 192 Q192 210 170 192 Z" fill="#4f3b2c" stroke="${pal.accent}" stroke-width="2.5"/>
      <ellipse cx="192" cy="182" rx="18" ry="12" fill="#e6d5c3"/>
      <circle cx="178" cy="156" r="4.5" fill="#111"/>
      <circle cx="206" cy="156" r="4.5" fill="#111"/>
      <circle cx="177" cy="154" r="1.5" fill="#fff"/>
      <circle cx="205" cy="154" r="1.5" fill="#fff"/>
      <circle cx="192" cy="184" r="4.5" fill="#fda4af"/>
    `;
  }

  // Batraciens / Reptiles : Crapaud, Grenouille, Serpent
  if (/crapaud|grenouille|batracien|serpent|lézard/.test(hay)) {
    return `
      <ellipse cx="192" cy="248" rx="92" ry="74" fill="#1c3624" stroke="#84cc16" stroke-width="3"/>
      <ellipse cx="192" cy="264" rx="60" ry="44" fill="#365c36" opacity="0.65"/>
      <circle cx="152" cy="168" r="22" fill="#23452c" stroke="#bef264" stroke-width="2.5"/>
      <circle cx="232" cy="168" r="22" fill="#23452c" stroke="#bef264" stroke-width="2.5"/>
      <ellipse cx="152" cy="168" rx="10" ry="6" fill="#fde047"/>
      <ellipse cx="232" cy="168" rx="10" ry="6" fill="#fde047"/>
      <rect x="148" y="165" width="8" height="4" rx="1.5" fill="#111"/>
      <rect x="228" y="165" width="8" height="4" rx="1.5" fill="#111"/>
      <path d="M132 222 Q192 252 252 222" stroke="#112416" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="144" cy="256" r="8" fill="#a3e635" opacity="0.35"/>
      <circle cx="234" cy="242" r="10" fill="#a3e635" opacity="0.35"/>
    `;
  }

  // Esprit Follet / Lutin / Diablotin / Fée (fallback familier)
  const stars = Array.from({ length: 8 }, (_, i) => {
    const ang = (i * Math.PI) / 4 + (seed % 5) * 0.2;
    const x = Math.round(192 + Math.cos(ang) * 116);
    const y = Math.round(186 + Math.sin(ang) * 116);
    return `<circle cx="${x}" cy="${y}" r="3.2" fill="${pal.accent}" opacity="0.8"/>`;
  }).join('');

  return `
    ${stars}
    <path d="M192 178 Q92 94 74 168 Q112 204 176 206 Z" fill="${pal.glow}" opacity="0.32" stroke="${pal.accent}" stroke-width="2"/>
    <path d="M192 178 Q292 94 310 168 Q272 204 208 206 Z" fill="${pal.glow}" opacity="0.32" stroke="${pal.accent}" stroke-width="2"/>
    <circle cx="192" cy="184" r="44" fill="${pal.glow}" opacity="0.45"/>
    <circle cx="192" cy="184" r="24" fill="#ffffff" opacity="0.9"/>
    <circle cx="183" cy="180" r="3.5" fill="${pal.bg1}"/>
    <circle cx="201" cy="180" r="3.5" fill="${pal.bg1}"/>
  `;
};

export const buildCharacterPortraitSvg = (char: Partial<Character>, variantSeed = 0): string => {
  const seed = hashString(`${char.name || 'Heros'}_${char.familierEspece || char.race || 'humain'}_${char.profil || 'guerrier'}`) + variantSeed * 4999;
  const pal = PALETTES[(seed + variantSeed) % PALETTES.length];

  if (char.isFamilier || char.familierEspece) {
    const artwork = renderFamilierArtwork(char, pal, seed);
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 384" width="384" height="384">
  <defs>
    <radialGradient id="famBg" cx="50%" cy="40%" r="72%">
      <stop offset="0%" stop-color="${pal.bg2}"/>
      <stop offset="100%" stop-color="${pal.bg1}"/>
    </radialGradient>
  </defs>
  <rect width="384" height="384" fill="url(#famBg)"/>
  <circle cx="192" cy="182" r="144" fill="${pal.glow}" opacity="0.16"/>
  <circle cx="192" cy="182" r="134" fill="none" stroke="${pal.accent}" stroke-width="1.2" stroke-dasharray="6 6" opacity="0.45"/>
  ${artwork}
  <rect x="8" y="8" width="368" height="368" rx="20" fill="none" stroke="${pal.glow}" stroke-width="2.5" opacity="0.75"/>
  <text x="192" y="362" text-anchor="middle" font-family="Georgia, serif" font-size="13" font-weight="bold" fill="${pal.accent}" opacity="0.92">${(char.name || char.familierEspece || 'Familier').slice(0, 28).replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>
</svg>`.trim();
  }

  const race = (char.race || 'humain').toLowerCase();
  const profil = (char.profil || 'guerrier').toLowerCase();

  const isElf = race.includes('elfe');
  const isDwarf = race.includes('nain');
  const isOrc = race.includes('orque');
  const isSmall = race.includes('halfelin') || race.includes('gnome');

  const isArcane = /magicien|ensorceleur|necromancien|forgesort/.test(profil);
  const isDivine = /pretre|druide|paladin|moine/.test(profil);
  const isStealth = /voleur|rodeur|barde|arquebusier/.test(profil);

  const skinTone = isOrc ? '#5a7350' : isElf ? '#e8d7c5' : isDwarf ? '#d9b596' : '#dec0a4';
  const cloakTone = isArcane ? '#281845' : isDivine ? '#3a2c16' : isStealth ? '#172821' : '#381916';

  const ears = isElf
    ? `<path d="M150 142 L126 124 L152 154 Z M234 142 L258 124 L232 154 Z" fill="${skinTone}" stroke="#2b1e16" stroke-width="1.5"/>`
    : '';
  const beard = isDwarf
    ? `<path d="M158 164 Q192 246 226 164 L216 205 L192 228 L168 205 Z" fill="#6b3e22" stroke="#29170b" stroke-width="2"/>`
    : '';
  const tusks = isOrc
    ? `<path d="M174 176 L178 163 L183 176 Z M201 176 L206 163 L210 176 Z" fill="#f7f1e3"/>`
    : '';
  const hoodOrHelm = isArcane || isStealth
    ? `<path d="M142 152 Q192 78 242 152 L230 185 Q192 162 154 185 Z" fill="${cloakTone}" stroke="${pal.glow}" stroke-width="2" opacity="0.9"/>`
    : `<path d="M154 134 Q192 94 230 134 L224 148 Q192 136 160 148 Z" fill="#6b7280" stroke="${pal.accent}" stroke-width="2"/>`;

  const weaponBadge = isArcane
    ? `<line x1="286" y1="312" x2="306" y2="106" stroke="${pal.accent}" stroke-width="5" stroke-linecap="round"/><circle cx="307" cy="96" r="14" fill="${pal.glow}" opacity="0.85"/>`
    : isDivine
    ? `<circle cx="192" cy="144" r="76" fill="none" stroke="${pal.glow}" stroke-width="3" stroke-dasharray="8 6" opacity="0.65"/>`
    : isStealth
    ? `<path d="M96 112 Q78 195 96 278" stroke="${pal.accent}" stroke-width="4" fill="none"/><line x1="96" y1="112" x2="96" y2="278" stroke="#cbd5e1" stroke-width="1.5"/>`
    : `<path d="M286 286 L310 120 L318 128 L296 290 Z" fill="#d1d5db" stroke="${pal.accent}" stroke-width="1.5"/><line x1="274" y1="268" x2="314" y2="272" stroke="${pal.glow}" stroke-width="5" stroke-linecap="round"/>`;

  const scale = isSmall ? 0.92 : isOrc ? 1.06 : 1;

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 384" width="384" height="384">
  <defs>
    <radialGradient id="pjBg" cx="50%" cy="38%" r="72%">
      <stop offset="0%" stop-color="${pal.bg2}"/>
      <stop offset="100%" stop-color="${pal.bg1}"/>
    </radialGradient>
  </defs>
  <rect width="384" height="384" fill="url(#pjBg)"/>
  <circle cx="192" cy="162" r="136" fill="${pal.glow}" opacity="0.14"/>
  <g transform="translate(192,205) scale(${scale}) translate(-192,-205)">
    ${weaponBadge}
    <path d="M98 358 Q112 214 192 192 Q272 214 286 358 Z" fill="${cloakTone}" stroke="${pal.glow}" stroke-width="2.5"/>
    <path d="M148 212 L192 252 L236 212" fill="none" stroke="${pal.accent}" stroke-width="2.5" opacity="0.7"/>
    ${ears}
    <ellipse cx="192" cy="148" rx="34" ry="41" fill="${skinTone}" stroke="#261912" stroke-width="2"/>
    ${hoodOrHelm}
    <circle cx="179" cy="148" r="3.5" fill="#18120e"/>
    <circle cx="205" cy="148" r="3.5" fill="#18120e"/>
    <path d="M182 169 Q192 174 202 169" stroke="#573928" stroke-width="2" fill="none" stroke-linecap="round"/>
    ${tusks}
    ${beard}
  </g>
  <rect x="8" y="8" width="368" height="368" rx="20" fill="none" stroke="${pal.glow}" stroke-width="2.5" opacity="0.72"/>
  <text x="192" y="362" text-anchor="middle" font-family="Georgia, serif" font-size="13" font-weight="bold" fill="${pal.accent}" opacity="0.9">${(char.name || 'Aventurier').slice(0, 28).replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>
</svg>`.trim();
};

export const buildFamilierPortraitDataUrl = (
  espece: string,
  name?: string,
  variantSeed = 0
): string => {
  const svg = buildCharacterPortraitSvg(
    {
      isFamilier: true,
      familierEspece: espece,
      name: name || espece,
    },
    variantSeed
  );
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
};
