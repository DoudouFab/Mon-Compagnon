/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  UserPlus,
  Sparkles,
  Shield,
  Swords,
  Plus,
  Trash2,
  Info,
  Unlock,
  Check,
  Package,
  BookOpen,
} from 'lucide-react';
import { CaracName, Character, Combatant, InventoryItem, WeaponItem } from '../../types/chroniques';
import {
  ARMES_CATALOG,
  ARMURES_CATALOG,
  CARAC_LIST,
  PROFILS,
  RACES,
  VOIES_CATALOG,
  getMod,
} from '../../data/coDatabase';
import {
  ARMOR_RESTRICTIONS_BY_PROFIL,
  RACIAL_ARMOR_NOTES,
  STARTING_PACKAGES_BY_PROFIL,
} from '../../data/startingGearData';
import {
  PNJ_PRESETS,
  PNJ_PRESET_CATEGORIES,
  PnjPreset,
  PnjPresetCategorie,
  createPnjFromPreset,
} from '../../data/pnjPresetsCatalog';
import { buildCharacterPortraitDataUrl } from '../../utils/fantasyPortraitGenerator';
import { useToast } from '../common/ToastContext';
import { PortraitPicker } from '../common/PortraitPicker';
import { DetailItem, DetailModal } from '../DetailModal';
import { resolveActionRule } from '../../data/actionRules';

interface PnjCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pnjChar: Character | null, combatant: Combatant | null) => void;
}

const DEFAULT_CARACS: Record<CaracName, number> = {
  FOR: 14,
  DEX: 12,
  CON: 13,
  INT: 11,
  SAG: 11,
  CHA: 10,
};

const PNJ_STAT_PRESETS: { label: string; stats: Record<CaracName, number> }[] = [
  { label: '⚔️ Guerrier / Contact', stats: { FOR: 16, DEX: 12, CON: 14, INT: 10, SAG: 10, CHA: 10 } },
  { label: '🏹 Agile / Rôdeur', stats: { FOR: 11, DEX: 16, CON: 13, INT: 11, SAG: 12, CHA: 10 } },
  { label: '🔮 Mage / Arcanes', stats: { FOR: 9, DEX: 12, CON: 11, INT: 16, SAG: 13, CHA: 11 } },
  { label: '✨ Prêtre / Druide', stats: { FOR: 12, DEX: 11, CON: 13, INT: 10, SAG: 16, CHA: 11 } },
  { label: '🎭 Barde / Social', stats: { FOR: 10, DEX: 14, CON: 11, INT: 12, SAG: 10, CHA: 16 } },
  { label: '⚖️ Équilibré', stats: { FOR: 13, DEX: 13, CON: 13, INT: 11, SAG: 11, CHA: 11 } },
];

function parseDefBonusFromLabel(label: string): number {
  if (!label) return 0;
  const plusMatch = label.match(/\+(\d+)\s*DEF/i);
  if (plusMatch) return parseInt(plusMatch[1], 10) || 0;
  const catalogMatch = ARMURES_CATALOG.find(
    (a) => a.n.toLowerCase() === label.replace(/\s*\(.*?\)/g, '').trim().toLowerCase()
  );
  if (catalogMatch?.def) return catalogMatch.def;
  const lower = label.toLowerCase();
  if (lower.includes('plaque complète') || lower.includes('harnois')) return 8;
  if (lower.includes('demi-plaque')) return 5;
  if (lower.includes('plaque')) return 6;
  if (lower.includes('maille')) return 4;
  if (lower.includes('cuir renforcé')) return 3;
  if (lower.includes('cuir')) return 2;
  if (lower.includes('grand bouclier') || lower.includes('écu')) return 2;
  if (lower.includes('targe') || lower.includes('rondache') || lower.includes('bouclier')) return 1;
  return 0;
}

export const PnjCreatorModal: React.FC<PnjCreatorModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const { warning, info } = useToast();
  const [portrait, setPortrait] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [role, setRole] = useState<
    'Allié du groupe' | 'Mercenaire' | 'Guide' | "Garde d'Élite" | 'PNJ Notif' | 'Ennemi'
  >('Allié du groupe');
  const [race, setRace] = useState('humain');
  const [profil, setProfil] = useState('guerrier');
  const [level, setLevel] = useState(2);
  const [caracs, setCaracs] = useState<Record<CaracName, number>>({ ...DEFAULT_CARACS });
  const [hp, setHp] = useState(20);
  const [def, setDef] = useState(17);
  const [pmMax, setPmMax] = useState(0);

  // Équipement synchronisé avec le profil
  const [armes, setArmes] = useState<WeaponItem[]>([]);
  const [arm, setArm] = useState('');
  const [bou, setBou] = useState('');
  const [inventaire, setInventaire] = useState<InventoryItem[]>([]);
  const [weaponCatalogPick, setWeaponCatalogPick] = useState('');

  // Voies & Rangs du profil (0 blocage : tout rang R1..R5 sélectionnable librement)
  const [selectedCaps, setSelectedCaps] = useState<{ wayKey: string; rank: number }[]>([]);
  const [detailItem, setDetailItem] = useState<DetailItem | null>(null);

  const [pnjPresetCat, setPnjPresetCat] = useState<'all' | PnjPresetCategorie>('all');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');

  const [notes, setNotes] = useState("Allié fidèle recruté en jeu. Obéit aux directives du groupe.");
  const [addToGroup, setAddToGroup] = useState(true);
  const [addToCombat, setAddToCombat] = useState(true);

  const currentRace = useMemo(() => RACES.find((r) => r.id === race) || RACES[0], [race]);
  const currentProfil = useMemo(() => PROFILS.find((p) => p.id === profil) || PROFILS[0], [profil]);
  const rb = useMemo(() => currentRace.b || {}, [currentRace]);

  const armorRule = ARMOR_RESTRICTIONS_BY_PROFIL[profil] || {
    allowedArmors: 'Selon profil',
    allowedShields: 'Selon profil',
    note: '',
  };
  const racialArmorNote = RACIAL_ARMOR_NOTES[race];

  const profileWays = useMemo(
    () =>
      Object.entries(VOIES_CATALOG).filter(
        ([, v]) => v.profil === profil || v.profil === `race:${race}`
      ),
    [profil, race]
  );

  const armorCatalogList = useMemo(
    () => ARMURES_CATALOG.filter((a) => !a.t?.toLowerCase().includes('bouclier')),
    []
  );
  const shieldCatalogList = useMemo(
    () => ARMURES_CATALOG.filter((a) => a.t?.toLowerCase().includes('bouclier')),
    []
  );

  const computeStats = (
    profId: string,
    raceId: string,
    lvl: number,
    baseStats: Record<CaracName, number>,
    armorLabel: string,
    shieldLabel: string
  ) => {
    const pr = PROFILS.find((p) => p.id === profId) || PROFILS[0];
    const rc = RACES.find((r) => r.id === raceId) || RACES[0];
    const raceB = rc.b || {};
    const dv = pr.dv || 8;
    const modCon = getMod((baseStats.CON || 10) + (raceB.CON || 0));
    const modDex = getMod((baseStats.DEX || 10) + (raceB.DEX || 0));
    const modSag = getMod((baseStats.SAG || 10) + (raceB.SAG || 0));

    const baseHp = Math.max(1, dv + modCon);
    const avgGain = Math.max(1, Math.floor(dv / 2) + 1 + modCon);
    const nextHp = Math.max(1, baseHp + Math.max(0, lvl - 1) * avgGain);

    const armBonus = parseDefBonusFromLabel(armorLabel);
    const bouBonus = parseDefBonusFromLabel(shieldLabel);
    const moineBonus = profId === 'moine' && !armorLabel ? Math.max(0, modSag) : 0;
    const nextDef = 10 + modDex + armBonus + bouBonus + moineBonus;

    let nextPm = 0;
    if (pr.mag) {
      const magCarac = pr.mag as CaracName;
      const modMag = getMod((baseStats[magCarac] || 10) + (raceB[magCarac] || 0));
      nextPm = Math.max(0, lvl + Math.max(0, modMag));
    }
    return { nextHp, nextDef, nextPm };
  };

  const applyProfileDefaults = (
    nextProfil: string,
    nextRace: string,
    nextLevel: number,
    nextCaracs: Record<CaracName, number>
  ) => {
    const pkg = STARTING_PACKAGES_BY_PROFIL[nextProfil] || STARTING_PACKAGES_BY_PROFIL.guerrier;
    const clonedArmes = pkg.armes.map((w) => ({ ...w }));
    const clonedInv = pkg.inventaire.map((it) => ({ ...it }));
    setArmes(clonedArmes);
    setArm(pkg.arm || '');
    setBou(pkg.bou || '');
    setInventaire(clonedInv);

    const { nextHp, nextDef, nextPm } = computeStats(
      nextProfil,
      nextRace,
      nextLevel,
      nextCaracs,
      pkg.arm || '',
      pkg.bou || ''
    );
    setHp(nextHp);
    setDef(nextDef);
    setPmMax(nextPm);
  };

  // Réinitialiser proprement à l'ouverture
  useEffect(() => {
    if (!isOpen) return;
    setPnjPresetCat('all');
    setSelectedPresetId('');
    setPortrait(undefined);
    setName('');
    setRole('Allié du groupe');
    setRace('humain');
    setProfil('guerrier');
    setLevel(2);
    const initCaracs = { ...DEFAULT_CARACS };
    setCaracs(initCaracs);
    setSelectedCaps([]);
    setWeaponCatalogPick('');
    setNotes("Allié fidèle recruté en jeu. Obéit aux directives du groupe.");
    setAddToGroup(true);
    setAddToCombat(true);
    applyProfileDefaults('guerrier', 'humain', 2, initCaracs);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectProfil = (nextProfil: string) => {
    setProfil(nextProfil);
    // Garder uniquement les capacités compatibles avec le nouveau profil (ou race)
    setSelectedCaps((prev) =>
      prev.filter((c) => {
        const w = VOIES_CATALOG[c.wayKey];
        return w && (w.profil === nextProfil || w.profil === `race:${race}`);
      })
    );
    applyProfileDefaults(nextProfil, race, level, caracs);
  };

  const handleSelectRace = (nextRace: string) => {
    setRace(nextRace);
    const { nextHp, nextDef, nextPm } = computeStats(profil, nextRace, level, caracs, arm, bou);
    setHp(nextHp);
    setDef(nextDef);
    setPmMax(nextPm);
  };

  const handleLevelChange = (nextLevel: number) => {
    const safeLvl = Math.max(1, Math.min(20, nextLevel || 1));
    setLevel(safeLvl);
    const { nextHp, nextDef, nextPm } = computeStats(profil, race, safeLvl, caracs, arm, bou);
    setHp(nextHp);
    setDef(nextDef);
    setPmMax(nextPm);
  };

  const handleCaracChange = (c: CaracName, val: number) => {
    const updated = { ...caracs, [c]: Math.max(3, Math.min(24, val || 10)) };
    setCaracs(updated);
    const { nextHp, nextDef, nextPm } = computeStats(profil, race, level, updated, arm, bou);
    setHp(nextHp);
    setDef(nextDef);
    setPmMax(nextPm);
  };

  const handleApplyPreset = (presetStats: Record<CaracName, number>) => {
    const updated = { ...presetStats };
    setCaracs(updated);
    const { nextHp, nextDef, nextPm } = computeStats(profil, race, level, updated, arm, bou);
    setHp(nextHp);
    setDef(nextDef);
    setPmMax(nextPm);
  };

  const handleArmorChange = (nextArm: string) => {
    setArm(nextArm);
    const { nextHp, nextDef, nextPm } = computeStats(profil, race, level, caracs, nextArm, bou);
    setHp(nextHp);
    setDef(nextDef);
    setPmMax(nextPm);
  };

  const handleShieldChange = (nextBou: string) => {
    setBou(nextBou);
    const { nextHp, nextDef, nextPm } = computeStats(profil, race, level, caracs, arm, nextBou);
    setHp(nextHp);
    setDef(nextDef);
    setPmMax(nextPm);
  };

  const handleAutoRecalc = () => {
    const { nextHp, nextDef, nextPm } = computeStats(profil, race, level, caracs, arm, bou);
    setHp(nextHp);
    setDef(nextDef);
    setPmMax(nextPm);
    info('PV, DEF et PM recalculés selon la race, le profil et les protections équipées.');
  };

  const handleAddWeaponFromCatalog = (weaponName: string) => {
    if (!weaponName) return;
    const found = ARMES_CATALOG.find((a) => a.n === weaponName);
    if (!found) return;
    setArmes((prev) => [
      ...prev,
      {
        n: found.n,
        t: found.t || 'Contact',
        dm: found.dm || '1d6',
        crit: found.crit || '20',
        por: found.por || 'Contact',
        props: found.props || found.desc || '',
      },
    ]);
    setWeaponCatalogPick('');
  };

  const handleAddCustomWeapon = () => {
    setArmes((prev) => [
      ...prev,
      {
        n: 'Nouvelle arme',
        t: 'Contact',
        dm: '1d6',
        crit: '20',
        por: 'Contact',
      },
    ]);
  };

  // ZÉRO blocage sur les rangs : le MJ peut cliquer directement sur R4 sans avoir R1, R2 ou R3 !
  const toggleWayRank = (wayKey: string, rankNum: number) => {
    setSelectedCaps((prev) => {
      const exists = prev.some((c) => c.wayKey === wayKey && c.rank === rankNum);
      if (exists) {
        return prev.filter((c) => !(c.wayKey === wayKey && c.rank === rankNum));
      }
      return [...prev, { wayKey, rank: rankNum }].sort(
        (a, b) => a.wayKey.localeCompare(b.wayKey) || a.rank - b.rank
      );
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      warning('Veuillez entrer un nom pour le PNJ.');
      return;
    }

    const id = `pnj_${Date.now()}`;
    const trimmedName = name.trim();
    const validArmes = armes.filter((w) => w.n.trim().length > 0);
    const mainWeaponSummary =
      validArmes.length > 0
        ? validArmes.map((w) => `${w.n} (${w.dm})`).join(', ')
        : 'Mains nues (1d4)';

    let pnjCharacter: Character | null = null;
    let pnjCombatant: Combatant | null = null;

    if (addToGroup) {
      pnjCharacter = {
        id,
        name: trimmedName,
        player: `PNJ · ${role}`,
        race,
        profil,
        level,
        base: { ...caracs },
        rb: { ...rb },
        hpBase: hp,
        hpMaxAuto: hp,
        hpMaxManual: hp,
        hp,
        pmMaxManual: pmMax,
        pm: pmMax,
        ptsCap: 0,
        ptsCapCadeaux: 0,
        bourse: { po: 0, pa: 10, pc: 0 },
        caps: [...selectedCaps],
        armes: validArmes,
        inventaire: inventaire.length > 0 ? [...inventaire] : [{ n: 'Sacoche de voyage', q: 1, desc: 'Vivres & bourse' }],
        customSorts: [],
        arm: arm.trim(),
        bou: bou.trim(),
        bonus: { pv: 0, def: 0, init: 0 },
        persoTraits: `${role} — ${notes}`,
        etats: [],
        isPnj: true,
        rolePnj: role,
        ...(portrait ? { portrait } : {}),
      };
    }

    if (addToCombat) {
      const totalDex = (caracs.DEX || 10) + (rb.DEX || 0);
      pnjCombatant = {
        id: `c_${id}`,
        n: `${trimmedName} (${role})`,
        isPj: addToGroup,
        isPnj: true,
        hp,
        hpMax: hp,
        def,
        baseInit: totalDex,
        init: totalDex,
        notes: `${mainWeaponSummary} • ${[arm, bou].filter(Boolean).join(' + ') || 'Sans armure'} (DEF ${def}) • ${notes}`,
        ...(addToGroup ? { pjRefId: id } : {}),
        etats: [],
      };
    }

    onSave(pnjCharacter, pnjCombatant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 sm:p-4 animate-fadeIn">
      <div className="bg-[#181410] border border-[#d4a84a] rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#3d3023] bg-gradient-to-r from-[#291712] via-[#20140e] to-[#181410] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#d4a84a]/20 border border-[#d4a84a]/40 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-[#f3d48d]" />
            </div>
            <div>
              <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">
                Créateur de PNJ Complet (Profil, Équipement &amp; Voies Libres)
              </h3>
              <p className="text-xs text-[#9e907d]">
                Équipement et armes synchronisés au profil · Rangs des voies du profil sélectionnables sans prérequis
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded text-[#9e907d] hover:text-[#ede3d1] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Base de Données PNJ Pré-tirés */}
          <div className="bg-[#12161d] border border-[#364d68] rounded-xl p-3 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#93c5fd] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Base de Données · PNJ Pré-tirés ({PNJ_PRESETS.length})
              </span>
              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPnjPresetCat('all')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                    pnjPresetCat === 'all'
                      ? 'bg-[#60a5fa] text-black'
                      : 'bg-[#1b2430] text-[#a5bedb] hover:text-white'
                  }`}
                >
                  Tous ({PNJ_PRESETS.length})
                </button>
                {PNJ_PRESET_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setPnjPresetCat(cat)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      pnjPresetCat === cat
                        ? 'bg-[#60a5fa] text-black'
                        : 'bg-[#1b2430] text-[#a5bedb] hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {PNJ_PRESETS.filter((p) => pnjPresetCat === 'all' || p.categorie === pnjPresetCat).map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                const fullName = preset.titre ? `${preset.name}, ${preset.titre}` : preset.name;
                const raceLabel = RACES.find((r) => r.id === preset.race)?.n || preset.race;
                const profLabel = PROFILS.find((pr) => pr.id === preset.profil)?.n || preset.profil;
                const thumb = buildCharacterPortraitDataUrl(
                  { name: fullName, race: preset.race, profil: preset.profil, persoTraits: preset.notes },
                  0
                );
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      setSelectedPresetId(preset.id);
                      setName(fullName);
                      setRole(preset.role);
                      setRace(preset.race);
                      setProfil(preset.profil);
                      setLevel(preset.level);
                      setCaracs({ ...preset.base });
                      setHp(preset.hp);
                      setDef(preset.def);
                      setPmMax(preset.pmMax);
                      setArm(preset.arm);
                      setBou(preset.bou);
                      setArmes(preset.armes.map((w) => ({ ...w })));
                      setInventaire(preset.inventaire.map((it) => ({ ...it })));
                      setSelectedCaps(preset.caps.map((c) => ({ ...c })));
                      setNotes(preset.notes);
                      setAddToGroup(true);
                      setAddToCombat(
                        preset.role === 'Ennemi' ||
                          preset.role === 'Mercenaire' ||
                          preset.role === "Garde d'Élite"
                      );
                      setPortrait(thumb);
                    }}
                    className={`p-2 rounded-lg border cursor-pointer transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-[#1a293d] border-[#60a5fa] shadow-sm'
                        : 'bg-[#161c24] border-[#2b3b4e] hover:border-[#4d7ca8]'
                    }`}
                  >
                    <img
                      src={thumb}
                      alt={preset.name}
                      className="w-10 h-10 rounded-lg object-cover border border-[#364d68] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <b className="text-[11px] text-[#e2efff] truncate">{preset.name}</b>
                        <span className="text-[9px] font-mono text-[#93c5fd] shrink-0">
                          Niv {preset.level}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#9eb4cc] truncate">{preset.titre}</div>
                      <div className="flex items-center justify-between gap-1 mt-0.5">
                        <span className="text-[9px] text-[#7c94b0] truncate">
                          {raceLabel} · {profLabel} · {preset.hp} PV / DEF {preset.def}
                        </span>
                        <button
                          type="button"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            const created = createPnjFromPreset(preset, {
                              addToGroup: true,
                              addToCombat:
                                preset.role === 'Ennemi' ||
                                preset.role === 'Mercenaire' ||
                                preset.role === "Garde d'Élite",
                            });
                            onSave(created.pnjChar, created.combatant);
                            onClose();
                          }}
                          className="px-1.5 py-0.5 rounded bg-[#223d5e] hover:bg-[#2d5280] text-[#cce3ff] text-[9px] font-bold shrink-0 cursor-pointer"
                          title="Créer et intégrer directement ce PNJ pré-tiré"
                        >
                          + Direct
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 1. Identité, Rôle, Race, Profil, Niveau */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold uppercase text-[#9e907d] block mb-1">
                Nom du PNJ / Titre *
              </label>
              <input
                type="text"
                placeholder="Ex: Frère Aldren, Varn le Protecteur..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-[#ede3d1] text-xs focus:border-[#d4a84a] outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-[#9e907d] block mb-1">
                Rôle dans l&apos;équipe
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-[#ede3d1] text-xs focus:border-[#d4a84a] outline-none"
              >
                <option value="Allié du groupe">Allié du groupe</option>
                <option value="Mercenaire">Mercenaire (contrat)</option>
                <option value="Guide">Guide / Pisteur</option>
                <option value="Garde d'Élite">Garde d&apos;Élite</option>
                <option value="PNJ Notif">PNJ à escorter</option>
                <option value="Ennemi">Antagoniste</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-[#9e907d] block mb-1">
                Niveau
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={level}
                onChange={(e) => handleLevelChange(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-[#f3d48d] text-xs focus:border-[#d4a84a] outline-none text-center font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-[#14100c] border border-[#3d3023] rounded-xl space-y-1.5">
              <label className="text-[11px] font-bold uppercase text-[#d4a84a] block">
                Race
              </label>
              <select
                value={race}
                onChange={(e) => handleSelectRace(e.target.value)}
                className="w-full px-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-[#ede3d1] text-xs focus:border-[#d4a84a] outline-none capitalize"
              >
                {RACES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.n} {r.t ? `(${r.t})` : ''}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#9e907d] leading-snug">
                <b className="text-[#8ed476]">{currentRace.t || 'Équilibré'}</b>
                {racialArmorNote ? ` · ${racialArmorNote}` : ''}
              </p>
            </div>

            <div className="p-3 bg-[#14100c] border border-[#3d3023] rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase text-[#d4a84a]">
                  Profil (Armes, Armures &amp; Voies liées)
                </label>
                <span className="text-[10px] font-mono text-[#9bb8ff]">
                  d{currentProfil.dv} {currentProfil.mag ? `· Magie ${currentProfil.mag}` : ''}
                </span>
              </div>
              <select
                value={profil}
                onChange={(e) => handleSelectProfil(e.target.value)}
                className="w-full px-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-[#ede3d1] text-xs focus:border-[#d4a84a] outline-none capitalize"
              >
                {PROFILS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.n} (d{p.dv}{p.mag ? `, ${p.mag}` : ''})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#cbb8a7] leading-snug">
                🛡️ <b>Autorisé :</b> {armorRule.allowedArmors} · {armorRule.allowedShields}
              </p>
            </div>
          </div>

          {/* 2. Caractéristiques (Base + Bonus racial = Total & Modificateur) */}
          <div className="p-3.5 bg-[#120f0c] border border-[#3d3023] rounded-xl space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase text-[#d4a84a]">
                Caractéristiques (Score de base + Bonus racial = Total)
              </span>
              <div className="flex flex-wrap items-center gap-1">
                {PNJ_STAT_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleApplyPreset(preset.stats)}
                    className="px-2 py-0.5 rounded bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-[10px] text-[#f3d48d] cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleAutoRecalc}
                  className="px-2 py-0.5 rounded bg-[#2d2111] hover:bg-[#3d2d17] border border-[#d4a84a]/60 text-[10px] text-[#f3d48d] flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" /> Recalculer
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {CARAC_LIST.map((c) => {
                const baseVal = caracs[c] ?? 10;
                const racialBonus = rb[c] || 0;
                const total = baseVal + racialBonus;
                const mod = getMod(total);

                return (
                  <div
                    key={c}
                    className="p-2 bg-[#1c1611] border border-[#33251a] rounded-lg text-center space-y-0.5"
                  >
                    <span className="text-[10px] font-bold text-[#9e907d] block">{c}</span>
                    <input
                      type="number"
                      min="3"
                      max="24"
                      value={baseVal}
                      onChange={(e) => handleCaracChange(c, parseInt(e.target.value, 10))}
                      className="w-full text-center text-sm font-bold text-[#f3d48d] bg-[#14100c] border border-[#30251a] rounded py-0.5 outline-none"
                    />
                    <div className="text-[10px] font-mono text-[#cbb8a7]">
                      {racialBonus !== 0 ? (
                        <span>
                          {racialBonus > 0 ? `+${racialBonus}` : racialBonus} = <b>{total}</b>
                        </span>
                      ) : (
                        <span>Total {total}</span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#6fa85b] block">
                      {mod >= 0 ? `+${mod}` : mod}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. PV, DEF, PM Max */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-2.5 bg-[#1b1212] border border-[#522424] rounded-xl text-center">
              <label className="text-[10px] font-bold uppercase text-[#ff9d9d] block mb-1">
                Points de Vie (PV)
              </label>
              <input
                type="number"
                min="1"
                value={hp}
                onChange={(e) => setHp(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-2 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-[#f3d48d] text-base font-bold text-center"
              />
            </div>

            <div className="p-2.5 bg-[#121922] border border-[#294161] rounded-xl text-center">
              <label className="text-[10px] font-bold uppercase text-[#94d5ff] block mb-1">
                Défense (DEF)
              </label>
              <input
                type="number"
                min="5"
                value={def}
                onChange={(e) => setDef(Math.max(5, parseInt(e.target.value, 10) || 10))}
                className="w-full px-2 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-[#f3d48d] text-base font-bold text-center"
              />
            </div>

            <div className="p-2.5 bg-[#171224] border border-[#3d2963] rounded-xl text-center">
              <label className="text-[10px] font-bold uppercase text-[#c4b5fd] block mb-1">
                Points de Mana (PM)
              </label>
              <input
                type="number"
                min="0"
                value={pmMax}
                onChange={(e) => setPmMax(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full px-2 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-[#9bb8ff] text-base font-bold text-center"
              />
            </div>
          </div>

          {/* 4. Armes, Armures & Équipement du Profil */}
          <div className="p-3.5 bg-[#14100c] border border-[#3d3023] rounded-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-serif-co text-sm font-bold text-[#f3d48d] flex items-center gap-1.5">
                <Swords className="w-4 h-4 text-[#d4a84a]" />
                <span>Armes &amp; Équipement du Profil ({currentProfil.n})</span>
              </h4>
              <button
                type="button"
                onClick={() => applyProfileDefaults(profil, race, level, caracs)}
                className="px-2.5 py-1 rounded-lg bg-[#231c15] hover:bg-[#32271d] border border-[#d4a84a]/50 text-[11px] font-semibold text-[#f3d48d] cursor-pointer"
              >
                ↺ Réappliquer le paquetage du profil
              </button>
            </div>

            {/* Armure & Bouclier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-[#9e907d] flex items-center gap-1 mb-1">
                  <Shield className="w-3 h-3 text-[#94d5ff]" /> Armure équipée
                </label>
                <div className="flex gap-1.5">
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value === '__NONE__') handleArmorChange('');
                      else if (e.target.value) handleArmorChange(e.target.value);
                    }}
                    className="px-2 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-[#f3d48d] text-xs outline-none max-w-[140px]"
                  >
                    <option value="">Choisir...</option>
                    <option value="__NONE__">Aucune armure</option>
                    {armorCatalogList.map((a) => (
                      <option key={a.n} value={`${a.n} (+${a.def || 0} DEF)`}>
                        {a.n} (+{a.def || 0})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Aucune / Cuir souple..."
                    value={arm}
                    onChange={(e) => handleArmorChange(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-[#ede3d1] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-[#9e907d] flex items-center gap-1 mb-1">
                  <Shield className="w-3 h-3 text-[#6fa85b]" /> Bouclier équipé
                </label>
                <div className="flex gap-1.5">
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value === '__NONE__') handleShieldChange('');
                      else if (e.target.value) handleShieldChange(e.target.value);
                    }}
                    className="px-2 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-[#f3d48d] text-xs outline-none max-w-[140px]"
                  >
                    <option value="">Choisir...</option>
                    <option value="__NONE__">Aucun bouclier</option>
                    {shieldCatalogList.map((b) => (
                      <option key={b.n} value={`${b.n} (+${b.def || 0} DEF)`}>
                        {b.n} (+{b.def || 0})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Aucun / Bouclier..."
                    value={bou}
                    onChange={(e) => handleShieldChange(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-[#ede3d1] text-xs"
                  />
                </div>
              </div>
            </div>

            {armorRule.note && (
              <p className="text-[11px] text-[#cbb8a7] bg-[#1d1610] border border-[#332619] rounded-lg px-2.5 py-1.5">
                ℹ️ <b>Règle d&apos;équipement {currentProfil.n} :</b> {armorRule.note}
              </p>
            )}

            {/* Armes */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase text-[#9e907d]">
                  Armes du PNJ ({armes.length})
                </span>
                <div className="flex items-center gap-1.5">
                  <select
                    value={weaponCatalogPick}
                    onChange={(e) => handleAddWeaponFromCatalog(e.target.value)}
                    className="px-2 py-1 bg-[#231c15] border border-[#3d3023] rounded-lg text-[#f3d48d] text-[11px] outline-none"
                  >
                    <option value="">+ Ajouter arme DRS...</option>
                    {ARMES_CATALOG.map((w) => (
                      <option key={w.n} value={w.n}>
                        {w.n} ({w.dm} · {w.t})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddCustomWeapon}
                    className="px-2 py-1 rounded-lg bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-[11px] text-[#ede3d1] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Arme libre
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                {armes.map((w, wIdx) => (
                  <div
                    key={wIdx}
                    className="grid grid-cols-12 gap-1.5 items-center bg-[#1c1611] border border-[#30251a] rounded-lg p-1.5"
                  >
                    <input
                      type="text"
                      value={w.n}
                      onChange={(e) =>
                        setArmes((prev) =>
                          prev.map((it, i) => (i === wIdx ? { ...it, n: e.target.value } : it))
                        )
                      }
                      placeholder="Nom de l'arme"
                      className="col-span-4 px-2 py-1 bg-[#14100c] border border-[#30251a] rounded text-[#ede3d1] text-xs font-semibold"
                    />
                    <input
                      type="text"
                      value={w.dm}
                      onChange={(e) =>
                        setArmes((prev) =>
                          prev.map((it, i) => (i === wIdx ? { ...it, dm: e.target.value } : it))
                        )
                      }
                      placeholder="1d8"
                      className="col-span-2 px-2 py-1 bg-[#14100c] border border-[#30251a] rounded text-[#ff9d9d] text-xs font-mono font-bold text-center"
                    />
                    <input
                      type="text"
                      value={w.t}
                      onChange={(e) =>
                        setArmes((prev) =>
                          prev.map((it, i) => (i === wIdx ? { ...it, t: e.target.value } : it))
                        )
                      }
                      placeholder="Contact / Distance"
                      className="col-span-3 px-2 py-1 bg-[#14100c] border border-[#30251a] rounded text-[#cbb8a7] text-[11px]"
                    />
                    <input
                      type="text"
                      value={w.por}
                      onChange={(e) =>
                        setArmes((prev) =>
                          prev.map((it, i) => (i === wIdx ? { ...it, por: e.target.value } : it))
                        )
                      }
                      placeholder="Portée"
                      className="col-span-2 px-2 py-1 bg-[#14100c] border border-[#30251a] rounded text-[#93c5fd] text-[11px] text-center"
                    />
                    <button
                      type="button"
                      onClick={() => setArmes((prev) => prev.filter((_, i) => i !== wIdx))}
                      className="col-span-1 p-1 text-[#9e907d] hover:text-[#ff7b7b] flex justify-center cursor-pointer"
                      title="Retirer cette arme"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Équipement du sac généré */}
            <div className="pt-1 border-t border-[#30251a]">
              <span className="text-[10px] font-bold uppercase text-[#9e907d] flex items-center gap-1 mb-1">
                <Package className="w-3 h-3 text-[#d4a84a]" />
                Équipement du profil inclus ({inventaire.length} objets) :
              </span>
              <div className="flex flex-wrap gap-1.5">
                {inventaire.map((it, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded bg-[#1d1712] border border-[#33261a] text-[#ede3d1] flex items-center gap-1"
                  >
                    <span>
                      {it.q > 1 ? `${it.q}× ` : ''}
                      {it.n}
                    </span>
                    <button
                      type="button"
                      onClick={() => setInventaire((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-[#9e907d] hover:text-[#ff7b7b] ml-0.5 cursor-pointer"
                      title="Retirer de l'équipement"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Arbre des Voies du Profil — Zéro blocage de rang */}
          <div className="p-3.5 bg-[#120f0c] border border-[#d4a84a]/60 rounded-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="font-serif-co text-sm font-bold text-[#f3d48d] flex items-center gap-1.5">
                  <Unlock className="w-4 h-4 text-[#86efac]" />
                  <span>Arbre des Voies du Profil ({currentProfil.n}) — Sélection Libre Sans Blocage</span>
                </h4>
                <p className="text-[11px] text-[#cbb8a7]">
                  Seules les voies de ce profil sont accessibles. Vous pouvez activer directement n&apos;importe quel rang (ex : R4 sans avoir R1–R3) !
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-[#291e12] border border-[#d4a84a]/50 text-[11px] font-bold text-[#f3d48d]">
                  {selectedCaps.length} capacité(s) choisie(s)
                </span>
                {selectedCaps.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedCaps([])}
                    className="px-2 py-1 rounded bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-[10px] text-[#9e907d] cursor-pointer"
                  >
                    Tout décocher
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2.5">
              {profileWays.map(([wKey, way]) => {
                const pickedRanks = selectedCaps
                  .filter((c) => c.wayKey === wKey)
                  .map((c) => c.rank);

                return (
                  <details
                    key={wKey}
                    open={pickedRanks.length > 0}
                    className="bg-[#181410] border border-[#3d3023] rounded-xl overflow-hidden"
                  >
                    <summary className="px-3.5 py-2.5 cursor-pointer hover:bg-[#231c15] flex items-center justify-between gap-2 select-none">
                      <div className="flex items-center gap-2 min-w-0">
                        <b className="font-serif-co text-sm text-[#f3d48d] truncate">{way.nom}</b>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#261d14] text-[#cbb8a7] border border-[#3d3023]">
                          {way.profil.startsWith('race:') ? 'Voie raciale' : currentProfil.n}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {[1, 2, 3, 4, 5].map((rNum) => {
                          const active = pickedRanks.includes(rNum);
                          return (
                            <span
                              key={rNum}
                              className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center border ${
                                active
                                  ? 'bg-[#6fa85b] text-black border-[#86efac]'
                                  : 'bg-[#120f0c] text-[#9e907d] border-[#3d3023]'
                              }`}
                            >
                              R{rNum}
                            </span>
                          );
                        })}
                      </div>
                    </summary>

                    <div className="p-3 pt-2 border-t border-[#30251a] grid grid-cols-1 gap-2">
                      {way.r.map((rk, rIdx) => {
                        const rankNum = rIdx + 1;
                        const active = pickedRanks.includes(rankNum);
                        return (
                          <div
                            key={rankNum}
                            className={`p-2.5 rounded-lg border flex items-start justify-between gap-2.5 transition-all ${
                              active
                                ? 'bg-[#172915] border-[#6fa85b]'
                                : 'bg-[#14100c] border-[#30251a] hover:border-[#59442e]'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => toggleWayRank(wKey, rankNum)}
                              className="flex items-start gap-2.5 text-left flex-1 cursor-pointer"
                            >
                              <span
                                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border ${
                                  active
                                    ? 'bg-[#6fa85b] text-black border-[#86efac]'
                                    : 'bg-[#231c15] text-[#f3d48d] border-[#423628]'
                                }`}
                              >
                                {active ? <Check className="w-4 h-4" /> : `R${rankNum}`}
                              </span>
                              <div className="space-y-0.5 min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <b className="text-xs sm:text-sm text-[#f3d48d]">{rk.n}</b>
                                  {rk.S === 1 && (
                                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#1e2f47] text-[#b0d7ff] font-bold">
                                      Sort ({rankNum} PM)
                                    </span>
                                  )}
                                  {(() => {
                                    const ar = resolveActionRule(rk.actionCost, rk.L === 1, rk.S === 1);
                                    return (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setDetailItem({
                                            type: 'actionRule',
                                            data: {
                                              actionCost: rk.actionCost,
                                              isLimited: rk.L === 1,
                                              isSpell: rk.S === 1,
                                              sourceTitle: rk.n,
                                            },
                                          });
                                        }}
                                        className={`text-[11px] px-2 py-0.5 rounded border font-bold cursor-pointer transition-all ${ar.badgeStyle}`}
                                        title="Cliquer pour comprendre ce type d'action"
                                      >
                                        {ar.shortLabel}
                                      </button>
                                    );
                                  })()}
                                </div>
                                <p className="text-xs text-[#ede3d1] leading-snug">{rk.t}</p>
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setDetailItem({
                                  type: 'wayRank',
                                  data: {
                                    ...rk,
                                    wayName: way.nom,
                                    profile: way.profil,
                                    rankNum,
                                  },
                                })
                              }
                              className="p-2 rounded-lg bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-[#f3d48d] shrink-0 cursor-pointer"
                              title="Voir les détails complets de ce rang"
                            >
                              <Info className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                );
              })}
            </div>
          </div>

          {/* 6. Notes, Portrait & Intégration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase text-[#9e907d] block mb-1">
                  Notes RP &amp; Traits du PNJ
                </label>
                <textarea
                  rows={3}
                  placeholder="Personnalité, serment, tactique..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-[#ede3d1] text-xs outline-none focus:border-[#d4a84a]"
                />
              </div>

              <div className="p-3 bg-[#231c15] border border-[#3d3023] rounded-xl space-y-2">
                <span className="text-[11px] font-bold uppercase text-[#d4a84a] block">
                  Options d&apos;intégration :
                </span>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={addToGroup}
                    onChange={(e) => setAddToGroup(e.target.checked)}
                    className="w-4 h-4 accent-[#d4a84a] rounded"
                  />
                  <span className="text-xs text-[#ede3d1] font-medium">
                    Insérer dans le <b>Groupe d&apos;Aventuriers (PJ/PNJ)</b>
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={addToCombat}
                    onChange={(e) => setAddToCombat(e.target.checked)}
                    className="w-4 h-4 accent-[#d4a84a] rounded"
                  />
                  <span className="text-xs text-[#ede3d1] font-medium">
                    Ajouter à la <b>Piste d&apos;Initiative (Combat)</b>
                  </span>
                </label>
              </div>
            </div>

            <PortraitPicker
              value={portrait}
              onChange={setPortrait}
              characterDraft={{
                name: name || 'PNJ',
                race,
                profil,
                persoTraits: notes,
              }}
              compact
              label="Visuel / Portrait du PNJ (Optionnel)"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#30251a]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-xs font-semibold text-[#ede3d1] rounded-lg cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-[#d4a84a] to-[#ab8230] hover:brightness-110 text-black font-bold text-xs rounded-lg shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Créer et Intégrer le PNJ</span>
            </button>
          </div>
        </form>
      </div>

      <DetailModal item={detailItem} onClose={() => setDetailItem(null)} />
    </div>
  );
};
