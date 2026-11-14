import React, { useState } from 'react';
import {
  Printer,
  ChevronUp,
  Sparkles,
  Zap,
  Plus,
  Minus,
  Trash2,
  BookOpen,
  Package,
  Shield,
  Swords,
  Scroll,
  HelpCircle,
  FileDown,
  FileUp,
  X,
  Check,
  Search,
  Info,
  ExternalLink,
  Download,
  Lock,
  Heart,
  Users,
  Map,
  MapPin,
  AlertCircle,
  Send,
  Coins,
  Calculator,
  RefreshCw,
  Camera,
} from 'lucide-react';
import { OSGILD_REGIONS, OSGILD_DEITIES, OSGILD_ACADEMIES } from '../../data/osgildLore';
import { DetailModal, DetailItem } from '../DetailModal';
import { StateBadgeList } from '../common/StateBadgeList';
import { BbeOfficialSheetModal } from './BbeOfficialSheetModal';
import { DeleteCharacterModal } from './DeleteCharacterModal';
import { TableTransferModal } from './TableTransferModal';
import { OsgildLorePj } from './OsgildLorePj';
import { THARNEA_ARTIFACTS } from '../../data/tharneaSupplement';
import { MoneyCalculatorModal } from '../common/MoneyCalculatorModal';
import { useToast } from '../common/ToastContext';
import { PortraitPicker } from '../common/PortraitPicker';
import { resolveActionRule } from '../../data/actionRules';
import {
  ARMES_CATALOG,
  ARMURES_CATALOG,
  BIENS_CATALOG,
  ALL_PJ_EQUIPMENT,
  CARAC_LIST,
  EQUIPEMENTS,
  ETATS,
  PROFILS,
  RACES,
  SORTS_CATALOG,
  VOIES_CATALOG,
  calcStats,
  getMod,
} from '../../data/coDatabase';
import {
  CaracName,
  Character,
  Equipment,
  InventoryItem,
  ProfilData,
  RaceData,
  SpellItem,
  WeaponItem,
} from '../../types/chroniques';

interface PjSheetProps {
  pj: Character | null;
  onUpdatePj: (updated: Character) => void;
  onOpenWizard: () => void;
  onSendToMjTable?: () => void;
  isTharneaActive?: boolean;
  onSwitchHero?: () => void;
  rosterCount?: number;
  onDeletePj?: (id: string) => void;
}

export const PjSheet: React.FC<PjSheetProps> = ({
  pj,
  onUpdatePj,
  onOpenWizard,
  onSendToMjTable,
  isTharneaActive = true,
  onSwitchHero,
  rosterCount,
  onDeletePj,
}) => {
  const { success, error, warning, info } = useToast();
  const [activeTab, setActiveTab] = useState<'fiche' | 'voies' | 'sorts' | 'sac' | 'lore'>('fiche');
  const [isPtsCapInfoOpen, setIsPtsCapInfoOpen] = useState<boolean>(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);
  const [isMoneyCalcOpen, setIsMoneyCalcOpen] = useState<boolean>(false);
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState<boolean>(false);
  const [confirmDeleteItemIdx, setConfirmDeleteItemIdx] = useState<number | null>(null);

  // Drawer & Modals state
  const [catalogDrawer, setCatalogDrawer] = useState<'armes' | 'armures' | 'biens' | 'sorts' | 'tharnea' | null>(null);
  const [catalogQuery, setCatalogQuery] = useState<string>('');
  const [detailItem, setDetailItem] = useState<DetailItem | null>(null);
  const [isLevelUpOpen, setIsLevelUpOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [levelUpDiceResult, setLevelUpDiceResult] = useState<number>(4);
  const [levelUpMethod, setLevelUpMethod] = useState<'roll' | 'average'>('average');
  const [isBbePrintOpen, setIsBbePrintOpen] = useState<boolean>(false);
  const [selectedWayProfil, setSelectedWayProfil] = useState<string>('mine');
  const [waySearchQuery, setWaySearchQuery] = useState<string>('');
  const [isCustomSpellOpen, setIsCustomSpellOpen] = useState<boolean>(false);

  // Recovery & Carac Info modals state
  const [activeCaracInfo, setActiveCaracInfo] = useState<CaracName | 'ALL' | null>(null);
  const [isHpRecoveryInfoOpen, setIsHpRecoveryInfoOpen] = useState<boolean>(false);
  const [isPmRecoveryInfoOpen, setIsPmRecoveryInfoOpen] = useState<boolean>(false);

  // Custom Spell Form state
  const [customSpellName, setCustomSpellName] = useState('');
  const [customSpellRank, setCustomSpellRank] = useState(1);
  const [customSpellRange, setCustomSpellRange] = useState('30 m');
  const [customSpellDesc, setCustomSpellDesc] = useState('');

  if (!pj) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <div className="bg-[#181410] border border-[#d4a84a] rounded-xl p-8 shadow-2xl space-y-4">
          <Shield className="w-12 h-12 text-[#d4a84a] mx-auto opacity-80" />
          <h2 className="font-serif-co text-2xl font-bold text-[#f3d48d]">
            Compagnon de Table – Chroniques Oubliées
          </h2>
          <p className="text-sm text-[#9e907d] max-w-md mx-auto">
            Aucun personnage n'est sélectionné. Vous pouvez créer un nouveau héros grâce à
            l'assistant officiel en 7 étapes ou importer une fiche sauvegardée.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenWizard}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#d4a84a] to-[#ab8230] text-[#1a1208] font-bold text-sm shadow-md flex items-center gap-2 hover:brightness-110"
            >
              <Sparkles className="w-4 h-4" /> Créer un Héros (7 étapes)
            </button>
            <label className="px-5 py-2.5 rounded-lg bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-[#ede3d1] font-semibold text-sm cursor-pointer flex items-center gap-2">
              <FileUp className="w-4 h-4" /> Charger une Fiche (JSON)
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => handleImportJson(e)}
              />
            </label>
          </div>
        </div>
      </div>
    );
  }

  const st = calcStats(pj);
  const pr: ProfilData = PROFILS.find((x) => x.id === pj.profil) || {
    id: pj.profil,
    n: pj.profil,
    dv: 8,
    traits: '',
    eq: '',
    ar: '',
  };
  const rc: RaceData = RACES.find((x) => x.id === pj.race) || {
    id: pj.race,
    n: pj.race,
    d: '',
    t: '',
    traits: '',
    cap: [],
    b: {},
  };

  // Health Stats
  const hpMax = st ? st.hpMax : 10;
  const hpPct = Math.max(0, Math.min(100, Math.round((100 * pj.hp) / Math.max(1, hpMax))));
  const hpColor = hpPct > 50 ? '#6fa85b' : hpPct > 25 ? '#c97d32' : '#cf5544';

  // Mana Stats
  const pmCurrent = pj.pm !== undefined && pj.pm !== null ? pj.pm : (st ? st.pmMax : 0);
  const pmMax = st ? st.pmMax : 0;
  const pmPct = pmMax > 0 ? Math.max(0, Math.min(100, Math.round((100 * pmCurrent) / pmMax))) : 0;

  // Currency Bourse (PO, PA, PC)
  const currentBourse = pj.bourse || { po: 0, pa: 0, pc: 0 };
  const totalCopper = (currentBourse.po || 0) * 100 + (currentBourse.pa || 0) * 10 + (currentBourse.pc || 0);
  const totalGold = (totalCopper / 100).toFixed(2);
  const handleUpdateBourse = (nextBourse: { po: number; pa: number; pc: number }) => {
    onUpdatePj({ ...pj, bourse: nextBourse });
  };

  // Spells (from ways ranks + custom)
  const allSpells: SpellItem[] = [];
  pj.caps.forEach((c) => {
    const v = VOIES_CATALOG[c.wayKey];
    if (v && v.r && v.r[c.rank - 1]) {
      const rk = v.r[c.rank - 1];
      if (rk.S) {
        allSpells.push({
          id: `${c.wayKey}_${c.rank}`,
          n: rk.n,
          voie: v.nom,
          rang: c.rank,
          portee: '30 m',
          t: rk.t,
          L: rk.L,
        });
      }
    }
  });
  if (pj.customSorts) {
    pj.customSorts.forEach((cs, i) => {
      allSpells.push({
        id: `cust_${i}`,
        n: cs.n,
        voie: cs.voie || 'Personnalisé',
        rang: cs.rang || 1,
        portee: cs.portee || 'Contact',
        t: cs.t,
        L: cs.L || 1,
      });
    });
  }

  // Modifiers update helper
  const updateCarac = (c: CaracName, val: number) => {
    const rb = pj.rb[c] || 0;
    const newBase = val - rb;
    onUpdatePj({
      ...pj,
      base: {
        ...pj.base,
        [c]: newBase,
      },
    });
  };

  // Health helpers
  const alterHp = (delta: number) => {
    const newHp = delta === 9999 ? hpMax : Math.max(0, Math.min(hpMax, pj.hp + delta));
    onUpdatePj({ ...pj, hp: newHp });
  };

  const setHpDirect = (val: number) => {
    onUpdatePj({ ...pj, hp: Math.max(0, Math.min(hpMax, val)) });
  };

  const setHpMaxDirect = (val: number) => {
    const valMax = Math.max(1, val);
    onUpdatePj({
      ...pj,
      hpMaxManual: valMax,
      hp: Math.min(pj.hp, valMax),
    });
  };

  // Prejudicial States helper
  const handleToggleState = (stateName: string) => {
    const current = pj.etats || [];
    const exists = current.includes(stateName);
    const newStates = exists
      ? current.filter((s) => s !== stateName)
      : [...current, stateName];
    onUpdatePj({ ...pj, etats: newStates });
  };

  // Mana helpers
  const alterPm = (delta: number) => {
    const current = pj.pm ?? pmMax;
    const newPm = delta === 9999 ? pmMax : Math.max(0, Math.min(pmMax, current + delta));
    onUpdatePj({ ...pj, pm: newPm });
  };

  const setPmDirect = (val: number) => {
    onUpdatePj({ ...pj, pm: Math.max(0, Math.min(pmMax, val)) });
  };

  const setPmMaxDirect = (val: number) => {
    const valMax = Math.max(0, val);
    onUpdatePj({
      ...pj,
      pmMaxManual: valMax,
      pm: Math.min(pj.pm ?? 0, valMax),
    });
  };

  const castSpell = (spell: SpellItem) => {
    const cost = spell.rang || 1;
    const current = pj.pm ?? pmMax;
    if (current < cost) {
      error(`Pas assez de Points de Mana pour lancer ${spell.n} ! (Requis: ${cost} PM, Actuel: ${current} PM)`);
      return;
    }
    const remaining = current - cost;
    onUpdatePj({ ...pj, pm: remaining });
    success(`✨ ${spell.n} lancé avec succès ! (-${cost} PM, restant : ${remaining} PM)`);
  };

  // Level Up
  const handleLevelUpConfirm = () => {
    const modCon = st ? st.m.CON : 0;
    // Règle demandée : la moitié du dé + mod CON (et non la moitié du dé + 1 + mod)
    const avgRoll = Math.floor(pr.dv / 2);
    const effectiveRoll = levelUpMethod === 'average' ? avgRoll : levelUpDiceResult;
    const gainedHp = Math.max(1, effectiveRoll + modCon);
    const newLevel = pj.level + 1;
    const newHpMaxAuto = (pj.hpMaxAuto || pj.hpBase || 10) + gainedHp;
    const newHp = pj.hp + gainedHp;
    const newPts = (pj.ptsCap || 0) + 2;

    // PM calculation based on official COF rules
    const isProfaneMajor = ['magicien', 'ensorceleur', 'necromancien'].includes(pj.profil);
    const isDivineOrHybrid = ['pretre', 'druide', 'barde', 'forgesort'].includes(pj.profil);
    const gainedPm = isProfaneMajor ? 2 : isDivineOrHybrid ? 1 : 0;
    const newPm = pj.pm !== undefined && pj.pm !== null ? pj.pm + gainedPm : undefined;

    onUpdatePj({
      ...pj,
      level: newLevel,
      hpMaxAuto: newHpMaxAuto,
      hpMaxManual: pj.hpMaxManual ? pj.hpMaxManual + gainedHp : null,
      hp: newHp,
      pm: newPm,
      ptsCap: newPts,
    });

    setIsLevelUpOpen(false);
    const pmText =
      gainedPm > 0
        ? ` | +${gainedPm} PM (${isProfaneMajor ? 'Magie profane' : 'Magie divine/hybride'})`
        : '';
    success(
      `Niveau ${newLevel} atteint ! +${gainedHp} PV (${levelUpMethod === 'average' ? `Moyenne d${pr.dv}=${avgRoll}` : `Dé d${pr.dv}=${levelUpDiceResult}`}, CON ${modCon >= 0 ? '+' + modCon : modCon})${pmText} | +2 pts de capacités.`
    );
  };

  // Download Offline Standalone HTML App
  const handleDownloadOfflineHtml = async () => {
    try {
      const res = await fetch('/assets/aistudio/CO_Compagnon_ac323e33.html');
      const htmlText = await res.text();
      const injectedHtml = htmlText.replace(
        'let pj = LS.get("co_pj_local", null);',
        `let pj = ${JSON.stringify(pj)};`
      );
      const blob = new Blob([injectedHtml], { type: 'text/html;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${(pj.name || 'Compagnon_PJ').replace(/\s+/g, '_')}_Offline.html`;
      a.click();
      success(
        "Application HTML autonome téléchargée ! Double-cliquez dessus pour l'ouvrir même hors-ligne."
      );
    } catch (err: any) {
      error('Erreur lors du téléchargement : ' + err.message);
    }
  };

  // JSON Export / Import
  const handleExportJson = () => {
    const a = document.createElement('a');
    a.href =
      'data:application/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(pj, null, 2));
    a.download = (pj.name || 'personnage').replace(/\s+/g, '_') + '_CO.json';
    a.click();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (!data.name || !data.base) throw new Error('Format de fichier JSON non reconnu.');
        onUpdatePj(data);
        success(`Héros "${data.name}" importé avec succès !`);
      } catch (err: any) {
        error("Erreur lors de l'import : " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const isWayAccessible = (wayProfil: string) => {
    const wp = (wayProfil || '').toLowerCase().trim();
    const pp = (pj.profil || '').toLowerCase().trim();
    const prId = (pr.id || '').toLowerCase().trim();
    const prName = (pr.n || '').toLowerCase().trim();
    const rcId = (pj.race || '').toLowerCase().trim();
    const rcName = (rc.n || '').toLowerCase().trim();
    return wp === pp || wp === prId || wp === prName || wp === rcId || wp === rcName || wp === `race:${rcId}`;
  };

  // Way unlock
  const handleLearnRank = (wKey: string, rankNum: number, cost: number) => {
    const way = VOIES_CATALOG[wKey];
    if (way && !isWayAccessible(way.profil)) {
      error(`Action interdite : Votre héros (${pr.n}) ne peut pas accéder aux voies d'un autre profil (${way.profil}). Seules les voies de votre profil vous sont accessibles.`);
      return;
    }
    if ((pj.ptsCap || 0) < cost) return;
    const newCaps = [...pj.caps, { wayKey: wKey, rank: rankNum }];
    onUpdatePj({
      ...pj,
      ptsCap: pj.ptsCap - cost,
      caps: newCaps,
    });
  };

  // Lookup catalog entry ONLY for items the PJ already owns (or for name-matching ownership)
  const findCatalogEquipmentByName = (name: string): Equipment | undefined => {
    const key = name.trim().toLowerCase();
    if (!key) return undefined;
    return (
      THARNEA_ARTIFACTS.find((x) => x.n.trim().toLowerCase() === key) ||
      EQUIPEMENTS.find((x) => x.n.trim().toLowerCase() === key)
    );
  };

  const CANDIES_12 = React.useMemo(
    () => THARNEA_ARTIFACTS.filter((a) => a.cat === 'Bonbon Alchimique'),
    []
  );

  const getAnonymousCandyName = (fullName: string): string =>
    fullName.split(' ').slice(0, 2).join(' ');

  const CANDY_COLOR_SWATCH: Record<string, string> = {
    'Bonbon Bleu des Profondeurs': 'bg-[#1e6091]',
    'Bonbon Orange Ampoule': 'bg-[#ea580c]',
    'Bonbon Vert Caméléon': 'bg-[#166534]',
    'Bonbon Blanc Souffle-Tempête': 'bg-[#e2e8f0]',
    'Bonbon Pourpre des Bêtes': 'bg-[#7e22ce]',
    'Bonbon Noir de l’Abysse': 'bg-[#18181b]',
    'Bonbon Vert-Pomme Fringant': 'bg-[#65a30d]',
    'Bonbon Turquoise Centaure': 'bg-[#0d9488]',
    'Bonbon Jaune Métamorphe-Garde-Robe': 'bg-[#ca8a04]',
    'Bonbon Rouge Piment-Glaire': 'bg-[#dc2626]',
    'Bonbon Marron Coupe-Faim de Fer': 'bg-[#78350f]',
    'Bonbon Rose Crépusculaire': 'bg-[#db2777]',
  };

  const isItemOwnedByPj = (itemName: string): boolean => {
    const key = itemName.trim().toLowerCase();
    if (!key) return false;
    if ((pj.armes || []).some((w) => w.n.trim().toLowerCase() === key)) return true;
    if (pj.arm && pj.arm.trim().toLowerCase() === key) return true;
    if (pj.bou && pj.bou.trim().toLowerCase() === key) return true;
    if ((pj.inventaire || []).some((it) => it.n.trim().toLowerCase() === key && (it.q ?? 1) > 0)) {
      return true;
    }
    return false;
  };

  const equipOwnedInventoryItem = (invItem: InventoryItem) => {
    const cat = findCatalogEquipmentByName(invItem.n);
    if (!cat) return;
    if (cat.cat?.includes('Bouclier') || cat.n.toLowerCase().includes('bouclier')) {
      onUpdatePj({ ...pj, bou: cat.n });
      success(`🛡️ "${cat.n}" équipé en main secondaire !`);
      return;
    }
    if (cat.cat?.includes('Armure') || cat.def !== undefined) {
      onUpdatePj({ ...pj, arm: cat.n });
      success(`🛡️ "${cat.n}" équipé comme armure !`);
      return;
    }
    if (cat.dm) {
      const armes = [...(pj.armes || [])];
      if (!armes.some((w) => w.n.trim().toLowerCase() === cat.n.trim().toLowerCase())) {
        armes.push({
          n: cat.n,
          t: cat.cat?.includes('Distance') ? 'Distance' : cat.cat?.includes('Poudre') ? 'Poudre' : 'Contact',
          dm: cat.dm,
          crit: cat.crit || '20',
          por: cat.por || (cat.cat?.includes('Distance') ? '30 m' : 'Contact'),
          props: cat.props || cat.desc || '',
          note: cat.source === 'tharnea' ? 'Codex Tharnéa' : '',
        });
        onUpdatePj({ ...pj, armes });
        success(`⚔️ "${cat.n}" préparé dans votre Arsenal !`);
      } else {
        info(`"${cat.n}" est déjà dans votre Arsenal.`);
      }
    }
  };

  // Only spells can be learned by the PJ from the Grimoire drawer; all equipment/loot is MJ-granted only.
  const handleSelectFromDrawer = (item: Equipment | SpellItem) => {
    if (catalogDrawer === 'sorts') {
      const spell = item as SpellItem;
      const customSorts = pj.customSorts || [];
      if (customSorts.some((s) => s.n.toLowerCase() === spell.n.toLowerCase())) {
        info('Vous connaissez déjà ce sortilège !');
        return;
      }
      onUpdatePj({
        ...pj,
        customSorts: [...customSorts, spell],
      });
      setCatalogDrawer(null);
      success(`✨ ${spell.n} ajouté à votre Grimoire !`);
      return;
    }
    warning('Seul le MJ peut vous octroyer cet objet.');
  };

  const setItemQty = (idx: number, qty: number) => {
    const inv = [...pj.inventaire];
    if (qty <= 0) {
      inv[idx].q = 0;
      onUpdatePj({ ...pj, inventaire: inv });
      setConfirmDeleteItemIdx(idx);
      return;
    }
    inv[idx].q = qty;
    onUpdatePj({ ...pj, inventaire: inv });
  };

  const updateItemNote = (idx: number, note: string) => {
    const inv = [...pj.inventaire];
    inv[idx].note = note;
    onUpdatePj({ ...pj, inventaire: inv });
  };

  const removeItem = (idx: number) => {
    const inv = [...pj.inventaire];
    inv.splice(idx, 1);
    onUpdatePj({ ...pj, inventaire: inv });
  };

  const removeWeapon = (idx: number) => {
    const armes = [...pj.armes];
    armes.splice(idx, 1);
    onUpdatePj({ ...pj, armes });
  };

  const handleSaveCustomSpell = () => {
    if (!customSpellName.trim()) {
      warning('Veuillez renseigner un nom de sort.');
      return;
    }
    const customSorts = pj.customSorts || [];
    customSorts.push({
      n: customSpellName.trim(),
      rang: customSpellRank,
      portee: customSpellRange,
      t: customSpellDesc.trim(),
      L: 1,
    });
    onUpdatePj({ ...pj, customSorts });
    setIsCustomSpellOpen(false);
    setCustomSpellName('');
    setCustomSpellDesc('');
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-2.5">
      {/* Hero Banner (Always on top) */}
      <div className="print-card bg-gradient-to-r from-[#361917] via-[#241712] to-[#181410] border border-[#d4a84a]/60 rounded-xl p-3 sm:p-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          <div className="flex items-start gap-3.5">
            <button
              type="button"
              onClick={() => setIsPortraitModalOpen(true)}
              className="no-print group relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-[#d4a84a]/60 hover:border-[#f3d48d] bg-[#120e0a] shrink-0 flex items-center justify-center shadow-lg cursor-pointer transition-all"
              title="Cliquer pour ajouter, importer ou générer un portrait"
            >
              {pj.portrait ? (
                <img
                  src={pj.portrait}
                  alt={pj.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-[#9e907d] group-hover:text-[#f3d48d]">
                  <Camera className="w-5 h-5 mx-auto mb-0.5" />
                  <span className="text-[9px] font-bold uppercase block">Portrait</span>
                </div>
              )}
              <span className="absolute inset-x-0 bottom-0 bg-black/70 text-[9px] font-bold text-[#f3d48d] py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                Modifier
              </span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-co text-2xl sm:text-3xl font-bold text-[#f3d48d]">
                  {pj.name}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#120f0c] text-[#d4a84a] border border-[#d4a84a]/40 font-mono font-bold">
                  Niv. {pj.level}
                </span>
              </div>
            <p className="text-xs sm:text-sm text-[#9e907d] mt-1 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setDetailItem({ type: 'race', data: rc })}
                className="text-[#f3d48d] hover:text-[#fff] hover:underline flex items-center gap-1 font-bold cursor-pointer bg-[#231c15] px-2.5 py-0.5 rounded border border-[#3d3023] transition-colors"
                title="Cliquer pour afficher la fiche de race officielle complète (co-drs.org)"
              >
                <span>{rc.n}</span>
                <Info className="w-3.5 h-3.5 text-[#d4a84a]" />
              </button>
              <button
                type="button"
                onClick={() => setDetailItem({ type: 'profil', data: pr })}
                className="text-[#f3d48d] hover:text-[#fff] hover:underline flex items-center gap-1 font-bold cursor-pointer bg-[#231c15] px-2.5 py-0.5 rounded border border-[#3d3023] transition-colors"
                title="Cliquer pour afficher la fiche de classe officielle complète (co-drs.org)"
              >
                <span>{pr.n}</span>
                <Info className="w-3.5 h-3.5 text-[#cbafff]" />
              </button>
              {pj.player && <span>• Joueur : {pj.player}</span>}
              {pj.ptsCap > 0 && (
                <span className="text-xs font-bold text-[#6fa85b] bg-[#122410] px-2 py-0.5 rounded border border-[#274721]">
                  +{pj.ptsCap} pt{pj.ptsCap > 1 ? 's' : ''} de capacité
                </span>
              )}
            </p>

            {/* Editable Mensurations (Âge, Taille, Poids) in header */}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1 bg-[#231c15] px-2 py-1 rounded border border-[#3d3023]">
                <span className="text-[#9e907d] text-[11px] font-bold">Âge :</span>
                <input
                  type="text"
                  value={pj.age || ''}
                  placeholder="ex: 25 ans"
                  onChange={(e) => onUpdatePj({ ...pj, age: e.target.value })}
                  className="w-18 bg-transparent text-[#f3d48d] font-semibold text-xs outline-hidden focus:border-b border-[#d4a84a]"
                  title="Modifier l'âge du personnage"
                />
              </div>

              <div className="flex items-center gap-1 bg-[#231c15] px-2 py-1 rounded border border-[#3d3023]">
                <span className="text-[#9e907d] text-[11px] font-bold">Taille :</span>
                <input
                  type="text"
                  value={pj.taille || ''}
                  placeholder="ex: 1,80 m"
                  onChange={(e) => onUpdatePj({ ...pj, taille: e.target.value })}
                  className="w-18 bg-transparent text-[#f3d48d] font-semibold text-xs outline-hidden focus:border-b border-[#d4a84a]"
                  title="Modifier la taille du personnage"
                />
              </div>

              <div className="flex items-center gap-1 bg-[#231c15] px-2 py-1 rounded border border-[#3d3023]">
                <span className="text-[#9e907d] text-[11px] font-bold">Poids :</span>
                <input
                  type="text"
                  value={pj.poids || ''}
                  placeholder="ex: 80 kg"
                  onChange={(e) => onUpdatePj({ ...pj, poids: e.target.value })}
                  className="w-18 bg-transparent text-[#f3d48d] font-semibold text-xs outline-hidden focus:border-b border-[#d4a84a]"
                  title="Modifier le poids du personnage"
                />
              </div>
            </div>
            {/* Quick States in header */}
            <div className="mt-2.5 pt-2 border-t border-[#3d3023]/60 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9e907d]">États :</span>
              <StateBadgeList
                activeStates={pj.etats || []}
                onToggleState={handleToggleState}
                onSelectDetail={(state) => setDetailItem({ type: 'etat', data: state })}
                allowEdit={true}
                compact={false}
              />
            </div>
          </div>
          </div>

          {/* Quick Header Actions */}
          <div className="no-print flex flex-wrap lg:justify-end items-center gap-1.5 lg:max-w-[440px]">
            {onSwitchHero && (
              <button
                onClick={onSwitchHero}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#3d2a17] to-[#291b0f] hover:brightness-110 border border-[#d4a84a] text-xs font-bold text-[#f3d48d] flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                title="Changer de personnage, en créer un autre ou afficher la liste de vos héros"
              >
                <Users className="w-3.5 h-3.5 text-[#d4a84a]" />
                <span>Mes Héros {rosterCount !== undefined && rosterCount > 0 ? `(${rosterCount})` : ''}</span>
              </button>
            )}
            {onSendToMjTable && (
              <button
                onClick={() => setIsTransferModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#855325] via-[#a86a30] to-[#6e3e16] hover:brightness-110 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                title="Envoyer votre personnage à la table du MJ (téléphone vers PC ou direct)"
              >
                <Send className="w-3.5 h-3.5 text-[#ffe099]" />
                <span>Envoyer au MJ</span>
              </button>
            )}
            <button
              onClick={() => setIsBbePrintOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#2c1712] to-[#1c120c] hover:bg-[#381c15] border border-[#d4a84a] text-xs font-bold text-[#f3d48d] flex items-center gap-1.5 transition-all shadow-md hover:scale-102 cursor-pointer"
              title="Affiche et imprime la feuille de personnage A4 officielle conforme à Black Book Éditions"
            >
              <Printer className="w-3.5 h-3.5 text-[#d4a84a]" />
              <span>Imprimer Fiche Officielle (A4)</span>
            </button>
            <button
              onClick={() => {
                setLevelUpDiceResult(Math.ceil(pr.dv / 2));
                setIsLevelUpOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#d4a84a] to-[#ab8230] hover:brightness-110 text-black text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <ChevronUp className="w-4 h-4" /> Niveau Supérieur
            </button>
            <button
              onClick={handleExportJson}
              title="Télécharger la fiche au format JSON"
              className="p-1.5 rounded-lg bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-[#ede3d1]"
            >
              <FileDown className="w-4 h-4 text-[#d4a84a]" />
            </button>
            <label
              title="Charger un personnage existant"
              className="p-1.5 rounded-lg bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-[#ede3d1] cursor-pointer"
            >
              <FileUp className="w-4 h-4 text-[#d4a84a]" />
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => handleImportJson(e)}
              />
            </label>
            <button
              onClick={onOpenWizard}
              className="px-2.5 py-1.5 rounded-lg bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-xs text-[#9e907d] hover:text-[#ede3d1] cursor-pointer"
            >
              + Nouveau
            </button>
            {onDeletePj && (
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-2.5 py-1.5 rounded-lg bg-[#2b1416] hover:bg-[#3d181c] border border-[#7a242a] text-xs font-semibold text-[#ff8080] hover:text-[#ffb8b8] flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                title="Oublier et effacer définitivement ce personnage (double validation)"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Oublier</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="no-print flex items-center gap-1 bg-[#181410] p-1.5 rounded-xl border border-[#3d3023] overflow-x-auto">
        <button
          onClick={() => setActiveTab('fiche')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
            activeTab === 'fiche'
              ? 'bg-[#d4a84a] text-black shadow-sm'
              : 'text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#231c15]'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Fiche &amp; Combat</span>
        </button>

        <button
          onClick={() => setActiveTab('voies')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
            activeTab === 'voies'
              ? 'bg-[#d4a84a] text-black shadow-sm'
              : 'text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#231c15]'
          }`}
        >
          <Scroll className="w-4 h-4" />
          <span>Arbre des Voies</span>
        </button>

        <button
          onClick={() => setActiveTab('sorts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
            activeTab === 'sorts'
              ? 'bg-[#3a2954] text-[#dccbff] border border-[#654a93] shadow-sm'
              : 'text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#231c15]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Grimoire &amp; Arcanes</span>
          {allSpells.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 font-mono">
              {allSpells.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sac')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'sac'
              ? 'bg-[#d4a84a] text-black shadow-sm'
              : 'text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#231c15]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Sac &amp; Matériel</span>
          {pj.inventaire && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 font-mono">
              {pj.inventaire.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('lore')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'lore'
              ? 'bg-gradient-to-r from-[#855325] to-[#593313] text-[#f7e0b5] shadow-sm border border-[#a8743d]'
              : 'text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#231c15]'
          }`}
        >
          <Map className="w-4 h-4 text-[#d4a84a]" />
          <span>Les Terres d&apos;Osgild</span>
        </button>
      </div>

      {/* ==================== TAB 1 : FICHE & COMBAT ==================== */}
      {activeTab === 'fiche' && (
        <div className="space-y-3">
          {/* JAUGES PV & PM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* JAUGE DE VIE (PV) */}
            <div className="print-card bg-[#181410] border border-[#3d3023] rounded-xl p-3 sm:p-3.5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#9c2a2b]" />
                  <h3 className="font-serif-co text-base font-bold text-[#f3d48d]">
                    Points de Vie (PV)
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsHpRecoveryInfoOpen(true)}
                    className="px-2.5 py-1 rounded-lg bg-[#2a1717] hover:bg-[#3d1f1f] text-[#ffb3b3] border border-[#a83232]/60 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                    title="Cliquer pour afficher les règles officielles de récupération des PV (repos court, nuit, auberge)"
                  >
                    <Info className="w-3.5 h-3.5 text-[#ff8080]" />
                    <span>Récupération</span>
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <span className="text-[#9e907d]">Actuel :</span>
                  <input
                    type="number"
                    min="0"
                    max={hpMax}
                    value={pj.hp}
                    onChange={(e) => setHpDirect(parseInt(e.target.value) || 0)}
                    className="w-14 text-center font-bold text-[#ede3d1] bg-[#231c15] border border-[#3d3023] rounded py-0.5 text-sm"
                  />
                  <span>/</span>
                  <input
                    type="number"
                    min="1"
                    title="Modifier le PV Max"
                    value={hpMax}
                    onChange={(e) => setHpMaxDirect(parseInt(e.target.value) || 1)}
                    className="w-14 text-center font-bold text-[#f3d48d] bg-[#231c15] border border-[#3d3023] rounded py-0.5 text-sm"
                  />
                </div>
              </div>

              {/* JAUGE-CURSEUR INTERACTIVE UNIFIÉE : La jauge EST le curseur */}
              <div className="relative w-full h-8 bg-[#0b0908] border border-[#4d2828] rounded-xl overflow-hidden shadow-inner group my-2 select-none">
                {/* Remplissage de la jauge */}
                <div
                  className="h-full transition-all duration-150 rounded-l-xl"
                  style={{
                    width: `${hpPct}%`,
                    background: `linear-gradient(90deg, ${hpColor}cc 0%, ${hpColor} 100%)`,
                  }}
                />

                {/* Aiguille curseur subtile */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white/90 shadow-[0_0_8px_white] pointer-events-none transition-all duration-150"
                  style={{ left: `calc(${hpPct}% - 2px)` }}
                />

                {/* Données intégrées au cœur de la jauge */}
                <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-bold text-white pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#ff8080]" />
                    <span>{pj.hp} / {hpMax} PV</span>
                  </span>
                  <span className="font-mono text-[11px] bg-black/40 px-2 py-0.5 rounded text-white/95 border border-white/10">
                    {hpPct}%
                  </span>
                </div>

                {/* Curseur range transparent superposé pour glisser/cliquer sur la jauge */}
                <input
                  type="range"
                  min="0"
                  max={hpMax}
                  value={pj.hp}
                  onChange={(e) => setHpDirect(parseInt(e.target.value) || 0)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
                  title="Glisser ou cliquer n'importe où sur la jauge pour ajuster les PV"
                />
              </div>

              {/* Boutons d'ajustement ergonomiques */}
              <div className="no-print flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => alterHp(-5)}
                  className="flex-1 py-1.5 bg-[#201515] hover:bg-[#301c1c] border border-[#4d2828] text-xs font-bold rounded-lg text-[#ff9999] transition-colors"
                >
                  -5
                </button>
                <button
                  type="button"
                  onClick={() => alterHp(-1)}
                  className="flex-1 py-1.5 bg-[#201515] hover:bg-[#301c1c] border border-[#4d2828] text-xs font-bold rounded-lg text-[#ff9999] transition-colors"
                >
                  -1
                </button>
                <button
                  type="button"
                  onClick={() => alterHp(1)}
                  className="flex-1 py-1.5 bg-[#152016] hover:bg-[#1d3020] border border-[#264528] text-xs font-bold rounded-lg text-[#8ce08e] transition-colors"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() => alterHp(5)}
                  className="flex-1 py-1.5 bg-[#152016] hover:bg-[#1d3020] border border-[#264528] text-xs font-bold rounded-lg text-[#8ce08e] transition-colors"
                >
                  +5
                </button>
                <button
                  type="button"
                  onClick={() => alterHp(9999)}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-[#d4a84a] to-[#ab8230] hover:brightness-110 text-black text-xs font-extrabold rounded-lg shadow-sm transition-all"
                >
                  Soin Max
                </button>
              </div>
            </div>

            {/* JAUGE DE MANA / PM (Si magique) */}
            {st?.mag ? (
              <div className="print-card bg-[#181410] border border-[#3a69a1]/60 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3a69a1]" />
                    <h3 className="font-serif-co text-base font-bold text-[#8dbbff]">
                      Points de Sort / Mana (PM)
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsPmRecoveryInfoOpen(true)}
                      className="px-2 py-0.5 rounded bg-[#172433] hover:bg-[#1e344d] text-[#8dbbff] border border-[#3a69a1]/60 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                      title="Cliquer pour afficher les règles officielles de récupération du Mana (méditation, nuit)"
                    >
                      <Info className="w-3 h-3 text-[#7db5ff]" />
                      <span>Récupération</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <span className="text-[#9e907d]">Actuel :</span>
                    <input
                      type="number"
                      min="0"
                      max={pmMax}
                      value={pmCurrent}
                      onChange={(e) => setPmDirect(parseInt(e.target.value) || 0)}
                      className="w-14 text-center font-bold text-[#8dbbff] bg-[#231c15] border border-[#3a69a1]/50 rounded py-0.5 text-sm"
                    />
                    <span>/</span>
                    <input
                      type="number"
                      min="0"
                      title="Modifier le PM Max"
                      value={pmMax}
                      onChange={(e) => setPmMaxDirect(parseInt(e.target.value) || 0)}
                      className="w-14 text-center font-bold text-[#8dbbff] bg-[#231c15] border border-[#3a69a1]/50 rounded py-0.5 text-sm"
                    />
                  </div>
                </div>

                {/* JAUGE-CURSEUR MANA INTERACTIVE UNIFIÉE */}
                <div className="relative w-full h-8 bg-[#0b0908] border border-[#2b3d63] rounded-xl overflow-hidden shadow-inner group my-2 select-none">
                  <div
                    className="h-full transition-all duration-150 rounded-l-xl bg-gradient-to-r from-[#1e4575] via-[#2a5d99] to-[#4a8fe8]"
                    style={{ width: `${pmPct}%` }}
                  />

                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white/90 shadow-[0_0_8px_#7db5ff] pointer-events-none transition-all duration-150"
                    style={{ left: `calc(${pmPct}% - 2px)` }}
                  />

                  <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-bold text-white pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#7db5ff]" />
                      <span>{pmCurrent} / {pmMax} PM</span>
                    </span>
                    <span className="font-mono text-[11px] bg-black/40 px-2 py-0.5 rounded text-white/95 border border-white/10">
                      {pmPct}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max={pmMax}
                    value={pmCurrent}
                    onChange={(e) => setPmDirect(parseInt(e.target.value) || 0)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
                    title="Glisser ou cliquer n'importe où sur la jauge pour ajuster les PM"
                  />
                </div>

                <div className="no-print flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => alterPm(-3)}
                    className="flex-1 py-1.5 bg-[#141b26] hover:bg-[#1d2738] border border-[#2b3d63] text-xs font-bold rounded-lg text-[#99bbff] transition-colors"
                  >
                    -3
                  </button>
                  <button
                    type="button"
                    onClick={() => alterPm(-1)}
                    className="flex-1 py-1.5 bg-[#141b26] hover:bg-[#1d2738] border border-[#2b3d63] text-xs font-bold rounded-lg text-[#99bbff] transition-colors"
                  >
                    -1
                  </button>
                  <button
                    type="button"
                    onClick={() => alterPm(1)}
                    className="flex-1 py-1.5 bg-[#141b26] hover:bg-[#1d2738] border border-[#2b3d63] text-xs font-bold rounded-lg text-[#99bbff] transition-colors"
                  >
                    +1
                  </button>
                  <button
                    type="button"
                    onClick={() => alterPm(3)}
                    className="flex-1 py-1.5 bg-[#141b26] hover:bg-[#1d2738] border border-[#2b3d63] text-xs font-bold rounded-lg text-[#99bbff] transition-colors"
                  >
                    +3
                  </button>
                  <button
                    type="button"
                    onClick={() => alterPm(9999)}
                    className="px-3.5 py-1.5 bg-[#233a59] hover:bg-[#2d4b73] border border-[#3a69a1] text-[#8dbbff] text-xs font-bold rounded-lg shadow-xs transition-all"
                  >
                    Méditation
                  </button>
                </div>
              </div>
            ) : (
              <div className="print-card bg-[#181410] border border-[#3d3023] rounded-xl p-4 flex flex-col justify-center text-center">
                <span className="text-xs uppercase tracking-widest text-[#9e907d] font-bold block mb-1">
                  Vocation Martiale
                </span>
                <p className="text-sm text-[#ede3d1]">
                  Profil non magique. Vous utilisez votre endurance physique et vos capacités martiales au combat.
                </p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <button
                    onClick={onSendToMjTable}
                    className="px-4 py-1.5 bg-[#231c15] hover:bg-[#32271d] border border-[#d4a84a]/50 text-[#f3d48d] rounded-lg text-xs font-semibold"
                  >
                    ⚔️ Synchroniser avec la Table MJ
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ÉTATS PRÉJUDICIABLES & CONDITIONS DE COMBAT */}
          <div className="print-card bg-[#181410] border border-[#cf5544]/50 rounded-xl p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#cf5544] animate-pulse" />
                <h3 className="font-serif-co text-base font-bold text-[#ffb8b8]">
                  États Préjudiciables &amp; Conditions
                </h3>
                <span className="text-xs text-[#9e907d]">
                  ({(pj.etats || []).length} actif{(pj.etats || []).length > 1 ? 's' : ''})
                </span>
              </div>
              <StateBadgeList
                activeStates={pj.etats || []}
                onToggleState={handleToggleState}
                onSelectDetail={(state) => setDetailItem({ type: 'etat', data: state })}
                allowEdit={true}
                compact={false}
              />
            </div>

            {(pj.etats || []).length === 0 ? (
              <p className="text-xs text-[#9e907d] italic bg-[#231c15] p-2.5 rounded-lg border border-[#3d3023]">
                🛡️ Aucun état préjudiciable en cours. Le héros est en pleine possession de ses moyens physiques et mentaux. Cliquez sur « + Modifier les états » pour lui infliger une condition (aveuglé, étourdi, immobilisé...).
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {(pj.etats || []).map((stName) => {
                  return (
                    <div
                      key={stName}
                      onClick={() => {
                        // find state details in data
                        const found = ETATS.find((x) => x.n === stName || x.id === stName);
                        if (found) setDetailItem({ type: 'etat', data: found });
                      }}
                      className="cursor-pointer bg-[#241515] hover:bg-[#331c1c] border border-[#cf5544]/60 rounded-lg p-2.5 flex items-start justify-between gap-2 transition-all hover:scale-101 shadow-xs"
                      title="Cliquer pour afficher la règle officielle complète"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-[#ffb8b8]">
                          <span>{stName}</span>
                          <Info className="w-3.5 h-3.5 text-[#ff9d9d] opacity-75" />
                        </div>
                        <span className="text-[11px] text-[#e8c7c7] block line-clamp-2">
                          Impact mécanique : Cliquez pour lire le malus officiel.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleState(stName);
                        }}
                        className="text-[#9e907d] hover:text-[#ff9d9d] p-1 rounded hover:bg-black/40"
                        title="Dissiper cet état"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 6 CARACTÉRISTIQUES */}
          <div className="print-card bg-[#181410] border border-[#3d3023] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h3 className="font-serif-co text-base font-bold text-[#f3d48d]">
                Caractéristiques &amp; Modificateurs
              </h3>
              <button
                type="button"
                onClick={() => setActiveCaracInfo('ALL')}
                className="px-2.5 py-1 rounded-lg bg-[#231c15] hover:bg-[#32271d] border border-[#d4a84a]/50 text-[#f3d48d] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                title="Afficher le tableau officiel des actions et caractéristiques associées"
              >
                <Info className="w-3.5 h-3.5 text-[#d4a84a]" />
                <span>Guide des Actions (exemples &amp; tests)</span>
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {CARAC_LIST.map((c) => {
                const total = (pj.base[c] || 10) + (pj.rb[c] || 0);
                const mod = getMod(total);
                const rb = pj.rb[c] || 0;

                return (
                  <div
                    key={c}
                    className="bg-[#231c15] border border-[#3d3023] hover:border-[#d4a84a]/60 rounded-lg p-2.5 text-center flex flex-col items-center justify-between relative group transition-all"
                  >
                    <div className="w-full flex items-center justify-between pb-1">
                      <small className="text-[11px] font-bold uppercase tracking-wider text-[#9e907d]">
                        {c}
                      </small>
                      <button
                        type="button"
                        onClick={() => setActiveCaracInfo(c)}
                        className="p-1.5 rounded text-[#9e907d] hover:text-[#f3d48d] hover:bg-[#3d3023] transition-colors cursor-pointer"
                        title={`Afficher les actions et tests types pour ${c}`}
                      >
                        <Info className="w-3.5 h-3.5 text-[#d4a84a]" />
                      </button>
                    </div>

                    <input
                      type="number"
                      value={total}
                      onChange={(e) => updateCarac(c, parseInt(e.target.value) || 10)}
                      className="w-full text-center font-serif-co font-bold text-xl text-[#f3d48d] bg-transparent my-1 outline-none"
                    />
                    <div className="text-sm font-bold text-[#6fa85b]">
                      {mod >= 0 ? `+${mod}` : mod}
                    </div>
                    {rb !== 0 && (
                      <span className="text-[9px] text-[#9e907d]">
                        race {rb > 0 ? `+${rb}` : rb}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* TACTIQUE & COMBAT */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            <div className="bg-[#231c15] border border-[#3d3023] rounded-lg p-3 text-center">
              <small className="text-[10px] text-[#9e907d] uppercase font-bold block">
                Défense
              </small>
              <b className="font-serif-co text-2xl text-[#f3d48d]">{st?.def}</b>
              <span className="text-[10px] text-[#9e907d] block mt-0.5">
                {pj.arm ? pj.arm : 'Sans armure'}
              </span>
            </div>

            <div className="bg-[#231c15] border border-[#3d3023] rounded-lg p-3 text-center">
              <small className="text-[10px] text-[#9e907d] uppercase font-bold block">
                Initiative
              </small>
              <b className="font-serif-co text-2xl text-[#ede3d1]">{st?.init}</b>
              <span className="text-[10px] text-[#9e907d] block mt-0.5">Base DEX</span>
            </div>

            <div className="bg-[#231c15] border border-[#3d3023] rounded-lg p-3 text-center">
              <small className="text-[10px] text-[#9e907d] uppercase font-bold block">
                Att. Contact
              </small>
              <b className="font-serif-co text-2xl text-[#ede3d1]">
                {st && st.ct >= 0 ? `+${st.ct}` : st?.ct}
              </b>
              <span className="text-[10px] text-[#9e907d] block mt-0.5">Niveau + FOR</span>
            </div>

            <div className="bg-[#231c15] border border-[#3d3023] rounded-lg p-3 text-center">
              <small className="text-[10px] text-[#9e907d] uppercase font-bold block">
                Att. Distance
              </small>
              <b className="font-serif-co text-2xl text-[#ede3d1]">
                {st && st.di >= 0 ? `+${st.di}` : st?.di}
              </b>
              <span className="text-[10px] text-[#9e907d] block mt-0.5">Niveau + DEX</span>
            </div>

            <div className="bg-[#231c15] border border-[#3a2954] rounded-lg p-3 text-center">
              <small className="text-[10px] text-[#cbafff] uppercase font-bold block">
                Att. Magique
              </small>
              <b className="font-serif-co text-2xl text-[#cbafff]">
                {st && st.mg !== null ? (st.mg >= 0 ? `+${st.mg}` : st.mg) : '-'}
              </b>
              <span className="text-[10px] text-[#9e907d] block mt-0.5">
                {st?.mag ? `${st.mag} + Niv` : 'Non magique'}
              </span>
            </div>

            <div className="bg-[#231c15] border border-[#855325] rounded-lg p-3 text-center">
              <small className="text-[10px] text-[#ffd09b] uppercase font-bold block">
                Déplacement
              </small>
              <b className="font-serif-co text-2xl text-[#ffd09b]">{st?.deplacement} m</b>
              <span className="text-[10px] text-[#9e907d] block mt-0.5">
                Course : {(st?.deplacement || 10) * 2} m
              </span>
            </div>
          </div>

          {/* ACTIONS & ARSENAL RAPIDE */}
          <div className="print-card bg-[#181410] border border-[#3d3023] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Swords className="w-4 h-4 text-[#d4a84a]" />
                <h3 className="font-serif-co text-base font-bold text-[#f3d48d]">
                  Arsenal Équipé en Combat
                </h3>
              </div>
              <button
                onClick={() => {
                  setCatalogDrawer('armes');
                  setCatalogQuery('');
                }}
                className="no-print px-3 py-1 rounded-lg bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] hover:border-[#d4a84a] text-xs font-semibold text-[#f3d48d] flex items-center gap-1 cursor-pointer"
                title="Consulter les noms des armes (détails et octroi réservés au MJ)"
              >
                <BookOpen className="w-3.5 h-3.5" /> Armurerie (Noms seuls)
              </button>
            </div>

            <div className="space-y-2">
              {pj.armes && pj.armes.length > 0 ? (
                pj.armes.map((ar, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      setDetailItem({
                        type: 'equipment',
                        data: {
                          n: ar.n,
                          cat: ar.t,
                          dm: ar.dm,
                          crit: ar.crit,
                          por: ar.por,
                          props: ar.props,
                          desc: ar.note || ar.props,
                        },
                      })
                    }
                    className="p-3 bg-[#231c15] hover:bg-[#2d2218] border border-[#3d3023] hover:border-[#d4a84a] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer transition-all group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <b className="text-[#f3d48d] text-sm group-hover:underline">{ar.n}</b>
                        <span className="text-[10px] bg-[#1e2f47] text-[#b0d7ff] px-2 py-0.5 rounded font-bold">
                          {ar.t}
                        </span>
                        <span className="text-[10px] text-[#9e907d] group-hover:text-[#d4a84a]">
                          (Cliquer pour détails)
                        </span>
                      </div>
                      <div className="text-xs text-[#9e907d] mt-0.5">
                        Dégâts : <b className="text-[#ede3d1]">{ar.dm}</b> • Portée : {ar.por} • Critique : {ar.crit}
                        {ar.props && <span> • {ar.props}</span>}
                      </div>
                      {ar.note && <div className="text-[11px] text-[#ede3d1] italic mt-1">{ar.note}</div>}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeWeapon(i);
                        }}
                        className="no-print p-1 rounded text-[#9e907d] hover:text-[#cf5544] hover:bg-[#181410]"
                        title="Déséquiper"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#9e907d] italic py-2">
                  Aucune arme équipée pour le moment. Votre MJ vous octroiera vos nouvelles armes en partie.
                </p>
              )}
            </div>
          </div>

          {/* ==================== BOURSE & FINANCES DE L'AVENTURIER (PO • PA • PC) ==================== */}
          <div className="print-card bg-[#181410] border border-[#d4a84a]/50 rounded-xl p-4 shadow-lg space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3d3023] pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#d4a84a]/20 border border-[#d4a84a]/40 text-[#f3d48d]">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-co text-base font-bold text-[#f3d48d] flex items-center gap-2">
                    <span>Bourse &amp; Trésorerie de l'Aventurier</span>
                  </h3>
                  <p className="text-[11px] text-[#9e907d]">
                    Règle officielle COF : <b>1 PO = 10 PA</b> • <b>1 PA = 10 PC</b> (1 PO = 100 PC)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="text-xs font-mono font-bold bg-[#120f0c] px-2.5 py-1 rounded-lg border border-[#3d3023] text-[#ede3d1]">
                  Valeur totale : <b className="text-[#f3d48d]">≈ {totalGold} PO</b> <span className="text-[#9e907d]">({totalCopper} PC)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMoneyCalcOpen(true)}
                  className="no-print px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#d4a84a] to-[#ab8230] hover:brightness-110 text-[#1a1208] text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  title="Ouvrir la Calculatrice Ancienne (transactions, rendu de monnaie, partage de butin et abaque)"
                >
                  <Calculator className="w-3.5 h-3.5 text-[#1a1208]" />
                  <span>Calculatrice &amp; Butin</span>
                </button>
              </div>
            </div>

            {/* Grille des 3 monnaies : PO, PA, PC */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Pièces d'Or */}
              <div className="bg-[#241a10] border border-[#d4a84a]/60 rounded-xl p-3 flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#f3d48d] flex items-center gap-1.5">
                    <span className="text-base select-none">🟡</span> Pièces d'Or (PO)
                  </span>
                  <span className="text-[10px] text-[#9e907d] font-mono">1 PO = 10 PA</span>
                </div>
                <div className="my-1.5 flex items-center justify-between">
                  <input
                    type="number"
                    min="0"
                    value={currentBourse.po || 0}
                    onChange={(e) => handleUpdateBourse({ ...currentBourse, po: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-20 bg-[#120c07] border border-[#5c4028] focus:border-[#d4a84a] rounded-lg px-2 py-1 text-lg font-bold font-serif-co text-[#f3d48d] outline-none"
                  />
                  <div className="flex items-center gap-1 no-print">
                    <button
                      type="button"
                      onClick={() => handleUpdateBourse({ ...currentBourse, po: Math.max(0, (currentBourse.po || 0) - 1) })}
                      className="w-7 h-7 rounded bg-[#170e08] hover:bg-[#2e1d10] text-[#ede3d1] font-bold text-xs border border-[#4d341f] flex items-center justify-center cursor-pointer"
                      title="-1 PO"
                    >
                      -1
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateBourse({ ...currentBourse, po: (currentBourse.po || 0) + 1 })}
                      className="w-7 h-7 rounded bg-[#170e08] hover:bg-[#2e1d10] text-[#f3d48d] font-bold text-xs border border-[#4d341f] flex items-center justify-center cursor-pointer"
                      title="+1 PO"
                    >
                      +1
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateBourse({ ...currentBourse, po: (currentBourse.po || 0) + 5 })}
                      className="px-1.5 h-7 rounded bg-[#332110] hover:bg-[#4a3017] text-[#f3d48d] font-bold text-[10px] border border-[#6b4722] flex items-center justify-center cursor-pointer"
                      title="+5 PO"
                    >
                      +5
                    </button>
                  </div>
                </div>
              </div>

              {/* Pièces d'Argent */}
              <div className="bg-[#1b1e24] border border-[#8ea0b5]/60 rounded-xl p-3 flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#cbd5e1] flex items-center gap-1.5">
                    <span className="text-base select-none">⚪</span> Pièces d'Argent (PA)
                  </span>
                  <span className="text-[10px] text-[#8ea0b5] font-mono">1 PA = 10 PC</span>
                </div>
                <div className="my-1.5 flex items-center justify-between">
                  <input
                    type="number"
                    min="0"
                    value={currentBourse.pa || 0}
                    onChange={(e) => handleUpdateBourse({ ...currentBourse, pa: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-20 bg-[#0f1217] border border-[#3b4759] focus:border-[#8ea0b5] rounded-lg px-2 py-1 text-lg font-bold font-serif-co text-[#cbd5e1] outline-none"
                  />
                  <div className="flex items-center gap-1 no-print">
                    <button
                      type="button"
                      onClick={() => handleUpdateBourse({ ...currentBourse, pa: Math.max(0, (currentBourse.pa || 0) - 1) })}
                      className="w-7 h-7 rounded bg-[#13161c] hover:bg-[#252c38] text-[#ede3d1] font-bold text-xs border border-[#3b4759] flex items-center justify-center cursor-pointer"
                      title="-1 PA"
                    >
                      -1
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateBourse({ ...currentBourse, pa: (currentBourse.pa || 0) + 1 })}
                      className="w-7 h-7 rounded bg-[#13161c] hover:bg-[#252c38] text-[#cbd5e1] font-bold text-xs border border-[#3b4759] flex items-center justify-center cursor-pointer"
                      title="+1 PA"
                    >
                      +1
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateBourse({ ...currentBourse, pa: (currentBourse.pa || 0) + 5 })}
                      className="px-1.5 h-7 rounded bg-[#253040] hover:bg-[#334257] text-[#cbd5e1] font-bold text-[10px] border border-[#4d607a] flex items-center justify-center cursor-pointer"
                      title="+5 PA"
                    >
                      +5
                    </button>
                  </div>
                </div>
              </div>

              {/* Pièces de Cuivre */}
              <div className="bg-[#241712] border border-[#b87333]/60 rounded-xl p-3 flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#f59e0b] flex items-center gap-1.5">
                    <span className="text-base select-none">🟤</span> Pièces de Cuivre (PC)
                  </span>
                  <span className="text-[10px] text-[#b87333] font-mono">10 PC = 1 PA</span>
                </div>
                <div className="my-1.5 flex items-center justify-between">
                  <input
                    type="number"
                    min="0"
                    value={currentBourse.pc || 0}
                    onChange={(e) => handleUpdateBourse({ ...currentBourse, pc: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-20 bg-[#140b07] border border-[#522919] focus:border-[#f59e0b] rounded-lg px-2 py-1 text-lg font-bold font-serif-co text-[#f59e0b] outline-none"
                  />
                  <div className="flex items-center gap-1 no-print">
                    <button
                      type="button"
                      onClick={() => handleUpdateBourse({ ...currentBourse, pc: Math.max(0, (currentBourse.pc || 0) - 1) })}
                      className="w-7 h-7 rounded bg-[#170e0a] hover:bg-[#331c13] text-[#ede3d1] font-bold text-xs border border-[#4d281a] flex items-center justify-center cursor-pointer"
                      title="-1 PC"
                    >
                      -1
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateBourse({ ...currentBourse, pc: (currentBourse.pc || 0) + 1 })}
                      className="w-7 h-7 rounded bg-[#170e0a] hover:bg-[#331c13] text-[#f59e0b] font-bold text-xs border border-[#4d281a] flex items-center justify-center cursor-pointer"
                      title="+1 PC"
                    >
                      +1
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateBourse({ ...currentBourse, pc: (currentBourse.pc || 0) + 5 })}
                      className="px-1.5 h-7 rounded bg-[#3d1f14] hover:bg-[#522919] text-[#f59e0b] font-bold text-[10px] border border-[#733a24] flex items-center justify-center cursor-pointer"
                      title="+5 PC"
                    >
                      +5
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions rapides de change & optimisation */}
            <div className="no-print pt-1 flex items-center justify-between gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    const totalCu = (currentBourse.po || 0) * 100 + (currentBourse.pa || 0) * 10 + (currentBourse.pc || 0);
                    const newPo = Math.floor(totalCu / 100);
                    const rem = totalCu % 100;
                    const newPa = Math.floor(rem / 10);
                    const newPc = rem % 10;
                    handleUpdateBourse({ po: newPo, pa: newPa, pc: newPc });
                  }}
                  className="px-2.5 py-1 bg-[#140e0a] hover:bg-[#261b13] border border-[#4d3623] text-[#f3d48d] rounded-md font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Convertir le cuivre en argent et l'argent en or pour alléger la bourse"
                >
                  <RefreshCw className="w-3 h-3 text-[#d4a84a]" /> Optimiser la monnaie
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if ((currentBourse.po || 0) < 1) {
                      warning("Pas assez de Pièces d'Or pour faire la monnaie.");
                      return;
                    }
                    handleUpdateBourse({
                      po: (currentBourse.po || 0) - 1,
                      pa: (currentBourse.pa || 0) + 10,
                      pc: currentBourse.pc || 0,
                    });
                  }}
                  className="px-2 py-1 bg-[#140e0a] hover:bg-[#261b13] border border-[#4d3623] text-[#ede3d1] rounded-md font-semibold cursor-pointer transition-colors"
                  title="Casser 1 PO en 10 PA"
                >
                  1 PO ➔ 10 PA
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if ((currentBourse.pa || 0) < 1) {
                      warning("Pas assez de Pièces d'Argent pour faire la monnaie.");
                      return;
                    }
                    handleUpdateBourse({
                      po: currentBourse.po || 0,
                      pa: (currentBourse.pa || 0) - 1,
                      pc: (currentBourse.pc || 0) + 10,
                    });
                  }}
                  className="px-2 py-1 bg-[#140e0a] hover:bg-[#261b13] border border-[#4d3623] text-[#ede3d1] rounded-md font-semibold cursor-pointer transition-colors"
                  title="Casser 1 PA en 10 PC"
                >
                  1 PA ➔ 10 PC
                </button>
              </div>

              <span className="text-[11px] text-[#9e907d] italic">
                Synchronisé en direct avec la console MJ
              </span>
            </div>
          </div>

          {/* SORTS D'ACTION RAPIDE EN DIRECT SUR PAGE 1 */}
          {st?.mag && (
            <div className="print-card bg-[#181410] border border-[#3a2954] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#cbafff]" />
                  <h3 className="font-serif-co text-base font-bold text-[#cbafff]">
                    Sorts d'Action Rapide
                  </h3>
                </div>
                <span className="text-xs text-[#9e907d]">
                  Coût : <b>1 PM par Rang</b> (Cliquer sur un sort pour détails)
                </span>
              </div>

              <div className="space-y-2">
                {allSpells.length > 0 ? (
                  allSpells.map((s, idx) => {
                    const cost = s.rang || 1;
                    const canCast = pmCurrent >= cost;

                    return (
                      <div
                        key={idx}
                        onClick={() => setDetailItem({ type: 'spell', data: s })}
                        className="p-3 bg-[#231c15] hover:bg-[#261833] border-l-4 border-l-[#3a69a1] border border-[#3d3023] hover:border-[#cbafff] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer transition-all group"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <b className="text-[#cbafff] text-sm group-hover:underline">{s.n}</b>
                            <span className="text-[11px] text-[#9e907d]">
                              Rang {cost} • Portée : {s.portee}
                            </span>
                            {(() => {
                              const ar = resolveActionRule(s.actionCost, s.L === 1, true);
                              return (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDetailItem({
                                      type: 'actionRule',
                                      data: {
                                        actionCost: s.actionCost,
                                        isLimited: s.L === 1,
                                        isSpell: true,
                                        sourceTitle: s.n,
                                      },
                                    });
                                  }}
                                  className={`px-2 py-0.5 rounded border text-[11px] font-bold cursor-pointer transition-all ${ar.badgeStyle}`}
                                  title="Cliquer pour comprendre ce type d'action"
                                >
                                  {ar.shortLabel}
                                </button>
                              );
                            })()}
                          </div>
                          <p className="text-xs text-[#ede3d1] mt-0.5">{s.t}</p>
                        </div>

                        <div className="no-print self-end sm:self-auto">
                          <button
                            disabled={!canCast}
                            onClick={(e) => {
                              e.stopPropagation();
                              castSpell(s);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                              canCast
                                ? 'bg-[#233a59] hover:bg-[#32527d] text-[#8dbbff] border border-[#3a69a1]'
                                : 'opacity-40 bg-[#1f2630] text-[#9e907d] cursor-not-allowed'
                            }`}
                          >
                            <Zap className="w-3.5 h-3.5" />
                            <span>Lancer (-{cost} PM)</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-[#9e907d] italic py-2">
                    Aucun sort mémorisé. Rendez-vous dans l'onglet Grimoire pour en ajouter.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TRAITS ROLEPLAY & NOTES */}
          <div className="print-card bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-3">
            <h3 className="font-serif-co text-base font-bold text-[#f3d48d]">
              Caractère, Ascendance &amp; Roleplay
            </h3>
            <div className="p-3 bg-[#231c15] rounded-lg border border-[#3d3023] text-xs space-y-1.5">
              <div>
                <b className="text-[#f3d48d]">Ascendance raciale :</b> {rc.traits || 'Aucun'}
              </div>
              <div>
                <b className="text-[#f3d48d]">Vocation du profil :</b> {pr.traits || 'Aucun'}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#9e907d] uppercase tracking-wider block mb-1">
                Notes personnelles &amp; Objectifs du Héros :
              </label>
              <textarea
                rows={3}
                value={pj.persoTraits || ''}
                onChange={(e) => onUpdatePj({ ...pj, persoTraits: e.target.value })}
                placeholder="Secrets, ennemis jurés, dettes d'honneur, description physique..."
                className="w-full p-2.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] focus:border-[#d4a84a] outline-none font-sans"
              />
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2 : VOIES HÉROÏQUES ==================== */}
      {activeTab === 'voies' && (
        <div className="space-y-4">
          <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">
                  Arbre des Voies Héroïques
                </h3>
                <p className="text-xs text-[#9e907d]">
                  Les voies propres à votre profil sont auréolées d'or ⭐. Filtrez par profil ci-dessous ou cherchez une aptitude.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#ede3d1]">
                  Points de capacité disponibles :
                </span>
                <span className="text-base font-serif-co font-bold text-[#6fa85b] bg-[#122410] px-3 py-1 rounded-lg border border-[#274721]">
                  {pj.ptsCap || 0}
                </span>
                <button
                  type="button"
                  onClick={() => setIsPtsCapInfoOpen(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#2e1f13] hover:bg-[#422c1b] border border-[#d4a84a] text-[#f3d48d] transition-all cursor-pointer shadow-xs flex items-center gap-1.5 text-xs font-bold"
                  title="Point d'attention sur les points de capacité et règle officielle"
                >
                  <AlertCircle className="w-4 h-4 text-[#e5a93c]" />
                  <span>Règle &amp; RP</span>
                </button>
              </div>
            </div>

            {/* Filter controls by Profil & Search */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#30251a]">
              <div className="relative">
                <Search className="w-4 h-4 text-[#9e907d] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Rechercher une voie ou un pouvoir..."
                  value={waySearchQuery}
                  onChange={(e) => setWaySearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] focus:border-[#d4a84a] outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-[#9e907d] whitespace-nowrap font-medium">
                  Filtrer par Profil :
                </label>
                <select
                  value={selectedWayProfil}
                  onChange={(e) => setSelectedWayProfil(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] focus:border-[#d4a84a] outline-none cursor-pointer"
                >
                  <option value="mine">⭐ Voies autorisées pour {pj.name} (Profil {pr.n} &amp; Race {rc.n})</option>
                  <option value="all">Toutes les voies (avec voies hors-profil verrouillées 🔒)</option>
                  <option disabled>──────────</option>
                  {PROFILS.map((p) => (
                    <option key={p.id} value={p.id}>
                      Profil : {p.n} {isWayAccessible(p.id) ? '⭐ (Votre profil)' : '(🔒 Hors-profil)'}
                    </option>
                  ))}
                  <option disabled>──────────</option>
                  <option value="race">Voies Raciales</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(VOIES_CATALOG)
              .filter(([wKey, way]) => {
                if (selectedWayProfil === 'mine') {
                  return isWayAccessible(way.profil);
                }
                if (selectedWayProfil !== 'all') {
                  if (selectedWayProfil === 'race') return way.profil.startsWith('race:');
                  return way.profil.toLowerCase() === selectedWayProfil.toLowerCase();
                }
                return true;
              })
              .filter(([wKey, way]) => {
                if (!waySearchQuery) return true;
                const q = waySearchQuery.toLowerCase();
                return (
                  way.nom.toLowerCase().includes(q) ||
                  way.profil.toLowerCase().includes(q) ||
                  way.r.some((r) => r.n.toLowerCase().includes(q) || r.t.toLowerCase().includes(q))
                );
              })
              .sort(([keyA, wayA], [keyB, wayB]) => {
                const isAccA = isWayAccessible(wayA.profil);
                const isAccB = isWayAccessible(wayB.profil);
                if (isAccA && !isAccB) return -1;
                if (!isAccA && isAccB) return 1;
                return wayA.nom.localeCompare(wayB.nom);
              })
              .map(([wKey, way]) => {
              const isAcc = isWayAccessible(way.profil);
              const ranksInWay = pj.caps.filter((c) => c.wayKey === wKey).map((c) => c.rank);
              const myRank = ranksInWay.reduce((max, r) => Math.max(max, r), 0);

              return (
                <details
                  key={wKey}
                  open={isAcc}
                  className={`bg-[#181410] border-2 rounded-xl overflow-hidden transition-all ${
                    isAcc
                      ? 'border-[#d4a84a] shadow-md shadow-[#d4a84a]/10'
                      : 'border-[#2d2218] opacity-75'
                  }`}
                >
                  <summary className="px-4 py-3 cursor-pointer font-serif-co font-bold text-[#f3d48d] hover:bg-[#231c15] flex items-center justify-between select-none">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isAcc ? (
                        <span className="text-xs px-2.5 py-0.5 rounded font-sans font-bold bg-[#3b2a1a] text-[#f3d48d] border border-[#d4a84a]/60">
                          ⭐ Voie autorisée ({pr.n})
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded font-sans font-medium bg-[#1d1611] text-[#9e907d] border border-[#382b1e] flex items-center gap-1">
                          <Lock className="w-3 h-3 text-[#cf5544]" /> Réservé au profil {way.profil}
                        </span>
                      )}
                      <span className="text-base text-[#f3d48d]">{way.nom}</span>
                    </div>
                    <span className="text-xs font-sans font-bold text-[#d4a84a] bg-[#291e12] px-3 py-1 rounded-full border border-[#d4a84a]/40">
                      {ranksInWay.length} / 5 acquis {myRank > 0 ? `(Max R${myRank})` : ''}
                    </span>
                  </summary>

                  <div className="p-4 pt-2 border-t border-[#30251a] space-y-3">
                    <div className="text-[11px] text-[#9e907d] italic pb-1">
                      {isAcc
                        ? "Cette voie comporte 5 rangs successifs (Rangs 1 à 5). Débloquez chaque rang dans l'ordre pour faire évoluer votre héros."
                        : `🔒 Cette voie est réservée exclusivement au profil ${way.profil}. Un ${pr.n} ne peut pas y débloquer de capacités.`}
                    </div>
                    {way.r.map((rk, idx) => {
                      const rankNum = idx + 1;
                      const hasRank = ranksInWay.includes(rankNum);
                      const isNext = !hasRank && (rankNum === 1 || ranksInWay.includes(rankNum - 1));
                      const cost = rankNum <= 2 ? 1 : 2;
                      const canAfford = (pj.ptsCap || 0) >= cost;

                      let statusClass = 'border-[#30251a] bg-[#14100c] text-[#c9bba8]';
                      let badge = `À débloquer (${cost} pt${cost > 1 ? 's' : ''})`;
                      if (!isAcc) {
                        statusClass = 'border-[#261e16] bg-[#120e0a]/80 text-[#827668]';
                        badge = '🔒 Non accessible';
                      } else if (hasRank) {
                        statusClass = 'border-[#4e873f] bg-[#122410]/50 text-[#ede3d1] shadow-xs';
                        badge = 'Acquis ✓';
                      } else if (isNext) {
                        statusClass =
                          'border-[#d4a84a] bg-[#2d2217] text-[#ffffff] shadow-md shadow-[#d4a84a]/20 ring-1 ring-[#d4a84a]/60';
                        badge = canAfford
                          ? `⭐ Déblocable immédiatement (${cost} pt${cost > 1 ? 's' : ''})`
                          : `Nécessite ${cost} pt${cost > 1 ? 's' : ''}`;
                      }

                      return (
                        <div
                          key={rankNum}
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
                          className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all cursor-pointer hover:border-[#d4a84a] group ${statusClass}`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border ${
                              !isAcc
                                ? 'bg-[#1b1511] text-[#6d6154] border-[#302419]'
                                : hasRank
                                ? 'bg-[#6fa85b] text-black border-[#6fa85b]'
                                : isNext
                                ? 'bg-[#d4a84a] text-black border-[#d4a84a] font-black'
                                : 'bg-[#231c15] text-[#9e907d] border-[#423628]'
                            }`}
                          >
                            R{rankNum}
                          </div>

                          <div className="flex-1 space-y-1">
                            <div className="flex flex-wrap items-center justify-between gap-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-[#9e907d]">
                                  Rang {rankNum} :
                                </span>
                                <b className="text-[#f3d48d] text-sm group-hover:underline">{rk.n}</b>
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5">
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
                                      className={`text-[11px] font-bold px-2.5 py-1 rounded-md border cursor-pointer transition-all ${ar.badgeStyle}`}
                                      title="Cliquer pour comprendre ce type d'action en COF"
                                    >
                                      {ar.shortLabel}
                                    </button>
                                  );
                                })()}
                                {rk.S ? (
                                  <span className="text-[11px] font-bold bg-[#1e2f47] text-[#b0d7ff] px-2 py-0.5 rounded-md border border-[#2b4c6f]">
                                    Sort ({rankNum} PM)
                                  </span>
                                ) : null}
                                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                                  !isAcc ? 'bg-[#1e1712] text-[#807263]' : hasRank ? 'bg-[#183615] text-[#95e683]' : isNext ? 'bg-[#402f18] text-[#ffd67a]' : 'bg-[#1e1711] text-[#9e907d]'
                                }`}>
                                  {badge}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-[#ede3d1] leading-snug">{rk.t}</p>

                            {isAcc && isNext && canAfford && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLearnRank(wKey, rankNum, cost);
                                }}
                                className="mt-2 px-3.5 py-1.5 bg-[#d4a84a] hover:bg-[#e0b555] text-black font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-all hover:scale-102"
                              >
                                <Check className="w-3.5 h-3.5" /> Débloquer Rang {rankNum} (-{cost} pt{cost > 1 ? 's' : ''})
                              </button>
                            )}

                            {!isAcc && (
                              <div className="mt-2 text-xs text-[#9c8b78] italic flex items-center gap-1.5 py-1.5 px-3 rounded bg-[#17110d] border border-[#2b2016]">
                                <Lock className="w-3.5 h-3.5 text-[#cf5544] shrink-0" />
                                <span>Voie réservée au profil {way.profil} — non sélectionnable pour votre personnage</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== TAB 3 : GRIMOIRE & SORTS ==================== */}
      {activeTab === 'sorts' && (
        <div className="space-y-4">
          <div className="bg-[#181410] border border-[#3a2954] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif-co text-lg font-bold text-[#cbafff]">
                Grimoire &amp; Arcanes
              </h3>
              <p className="text-xs text-[#9e907d]">
                Attaque Magique :{' '}
                <b className="text-[#cbafff]">
                  {st && st.mg !== null ? (st.mg >= 0 ? `+${st.mg}` : st.mg) : 'Non magique'}
                </b>{' '}
                • Réserve : <b className="text-[#8dbbff]">{pmCurrent} / {pmMax} PM</b>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCatalogDrawer('sorts')}
                className="px-3 py-1.5 bg-[#3a2954] hover:bg-[#4d3670] border border-[#654a93] text-[#dccbff] text-xs font-bold rounded-lg flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" /> Catalogue des Sorts
              </button>
              <button
                onClick={() => setIsCustomSpellOpen(true)}
                className="px-3 py-1.5 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-[#ede3d1] text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Créer un Sort
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {allSpells.length > 0 ? (
              allSpells.map((s, idx) => {
                const cost = s.rang || 1;
                const canCast = pmCurrent >= cost;
                const isCustom = s.id?.startsWith('cust_');

                return (
                  <div
                    key={idx}
                    onClick={() => setDetailItem({ type: 'spell', data: s })}
                    className="p-3.5 bg-[#181410] hover:bg-[#221630] border-l-4 border-l-[#3a69a1] border border-[#3d3023] hover:border-[#cbafff] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 cursor-pointer transition-all group"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <b className="text-[#cbafff] text-sm font-serif-co group-hover:underline">{s.n}</b>
                        <span className="text-[11px] bg-[#291b3b] text-[#dccbff] px-2 py-0.5 rounded border border-[#492d6e]">
                          Rang {cost} ({cost} PM)
                        </span>
                        {(() => {
                          const ar = resolveActionRule(s.actionCost, s.L === 1, true);
                          return (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDetailItem({
                                  type: 'actionRule',
                                  data: {
                                    actionCost: s.actionCost,
                                    isLimited: s.L === 1,
                                    isSpell: true,
                                    sourceTitle: s.n,
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
                        <span className="text-[11px] text-[#9e907d]">Portée : {s.portee}</span>
                        {s.voie && (
                          <span className="text-[11px] text-[#9e907d]">• Voie : {s.voie}</span>
                        )}
                      </div>
                      <p className="text-xs text-[#ede3d1]">{s.t}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        disabled={!canCast}
                        onClick={(e) => {
                          e.stopPropagation();
                          castSpell(s);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                          canCast
                            ? 'bg-[#233a59] hover:bg-[#32527d] text-[#8dbbff] border border-[#3a69a1]'
                            : 'opacity-40 bg-[#1f2630] text-[#9e907d] cursor-not-allowed'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Lancer (-{cost} PM)</span>
                      </button>

                      {isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const cIndex = parseInt(s.id!.split('_')[1]);
                            const list = [...(pj.customSorts || [])];
                            list.splice(cIndex, 1);
                            onUpdatePj({ ...pj, customSorts: list });
                          }}
                          className="p-1 rounded text-[#9e907d] hover:text-[#cf5544] hover:bg-[#231c15]"
                          title="Supprimer ce sort"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 bg-[#181410] border border-[#3d3023] rounded-xl text-center text-xs text-[#9e907d]">
                Aucun sort mémorisé. Utilisez le bouton « Catalogue des Sorts » ci-dessus pour en ajouter ou débloquez les rangs de sorts dans vos voies.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 4 : SAC & MATÉRIEL ==================== */}
      {activeTab === 'sac' && (
        <div className="space-y-4">
          <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">
                Sacoche, Équipement &amp; Tentes
              </h3>
              <p className="text-xs text-[#9e907d]">
                Consultez les objets octroyés par votre MJ et gérez vos consommables. Tant qu&apos;un objet n&apos;est pas acquis, les catalogues ne révèlent que son nom.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {isTharneaActive && (
                <button
                  onClick={() => {
                    setCatalogDrawer('tharnea');
                    setCatalogQuery('');
                  }}
                  className="px-3 py-1.5 bg-gradient-to-r from-[#4d1945] to-[#2b0c27] hover:brightness-110 border border-[#b8389e] text-[#f7cbf2] text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer"
                  title="Liste des noms d'objets Tharnéa (détails masqués tant que le MJ ne vous les octroie pas)"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#ff8fed]" /> Codex Tharnéa (Noms seuls)
                </button>
              )}
              <button
                onClick={() => {
                  setCatalogDrawer('biens');
                  setCatalogQuery('');
                }}
                className="px-3 py-1.5 bg-[#231c15] hover:bg-[#32271d] border border-[#d4a84a]/60 text-[#f3d48d] text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Liste des noms d'équipements (détails masqués tant que non acquis)"
              >
                <BookOpen className="w-3.5 h-3.5" /> Catalogue (Noms seuls)
              </button>
            </div>
          </div>

          {/* PROTECTIONS ÉQUIPÉES */}
          <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-serif-co text-sm font-bold text-[#f3d48d]">
                Armures &amp; Protections Équipées
              </h4>
              <button
                onClick={() => {
                  setCatalogDrawer('armures');
                  setCatalogQuery('');
                }}
                className="text-xs text-[#d4a84a] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <BookOpen className="w-3 h-3" /> Protections (Noms seuls)
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={!pj.arm || pj.arm === 'Aucune armure'}
                onClick={() => {
                  if (!pj.arm || pj.arm === 'Aucune armure') return;
                  const cat = findCatalogEquipmentByName(pj.arm);
                  setDetailItem({
                    type: 'equipment',
                    data: cat || { n: pj.arm, cat: 'Armure', desc: 'Armure actuellement équipée.' },
                  });
                }}
                className={`bg-[#231c15] p-3 rounded-lg border border-[#3d3023] text-left transition-colors ${
                  pj.arm && pj.arm !== 'Aucune armure' ? 'hover:border-[#d4a84a] cursor-pointer' : 'cursor-default'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-[#9e907d] block">
                  Armure de Corps
                </span>
                <b className="text-[#ede3d1] text-sm">{pj.arm || 'Aucune armure'}</b>
              </button>
              <button
                type="button"
                disabled={!pj.bou || pj.bou === 'Aucun bouclier'}
                onClick={() => {
                  if (!pj.bou || pj.bou === 'Aucun bouclier') return;
                  const cat = findCatalogEquipmentByName(pj.bou);
                  setDetailItem({
                    type: 'equipment',
                    data: cat || { n: pj.bou, cat: 'Bouclier', desc: 'Bouclier actuellement équipé.' },
                  });
                }}
                className={`bg-[#231c15] p-3 rounded-lg border border-[#3d3023] text-left transition-colors ${
                  pj.bou && pj.bou !== 'Aucun bouclier' ? 'hover:border-[#d4a84a] cursor-pointer' : 'cursor-default'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-[#9e907d] block">
                  Bouclier
                </span>
                <b className="text-[#ede3d1] text-sm">{pj.bou || 'Aucun bouclier'}</b>
              </button>
            </div>
          </div>

          {/* BOÎTE À BONBONS DE L'OBSCURE (4x12 = 48 BONBONS) */}
          {(pj.candyBox ||
            isItemOwnedByPj("Boîte à Bonbons de l'Obscure") ||
            isItemOwnedByPj("Boite a Bonbons de l'Obscure")) && (() => {
            const defaultCounts: Record<string, number> = {};
            CANDIES_12.forEach((c) => {
              defaultCounts[c.n] = 4;
            });
            const rawBox = pj.candyBox || {
              unlocked: false,
              counts: defaultCounts,
              tasted: [],
              pendingTaste: null,
              rejectedTaste: null,
            };
            const boxCounts = rawBox.counts && typeof rawBox.counts === 'object' ? rawBox.counts : defaultCounts;
            const boxTasted = Array.isArray(rawBox.tasted) ? rawBox.tasted : [];
            const box = {
              unlocked: Boolean(rawBox.unlocked),
              counts: boxCounts,
              tasted: boxTasted,
              pendingTaste: rawBox.pendingTaste || null,
              rejectedTaste: rawBox.rejectedTaste || null,
            };
            const totalLeft = CANDIES_12.reduce(
              (acc, c) => acc + (box.counts[c.n] ?? 4),
              0
            );
            const tastedCount = CANDIES_12.filter((c) =>
              box.tasted.includes(c.n)
            ).length;

            const handleTasteOrTakeCandy = (candyName: string) => {
              const currentCount = box.counts[candyName] ?? 4;
              if (currentCount <= 0) {
                warning(`Il ne reste plus aucun ${getAnonymousCandyName(candyName)} dans votre boîte.`);
                return;
              }
              const wasTasted = box.tasted.includes(candyName) || isItemOwnedByPj(candyName);

              // Le 1er bonbon de chaque couleur doit être validé par pop-up chez le MJ !
              if (!wasTasted) {
                if (box.pendingTaste?.candyName === candyName) {
                  info(`⏳ Demande déjà envoyée au MJ pour ${getAnonymousCandyName(candyName)}. Patientez jusqu'à sa validation.`);
                  return;
                }
                onUpdatePj({
                  ...pj,
                  candyBox: {
                    unlocked: box.unlocked,
                    counts: { ...defaultCounts, ...box.counts },
                    tasted: box.tasted,
                    pendingTaste: { candyName, requestedAt: Date.now() },
                    rejectedTaste: null,
                  },
                });
                info(
                  `📩 Demande envoyée au MJ pour goûter le 1er ${getAnonymousCandyName(candyName)}. En attente de sa validation...`
                );
                return;
              }

              // Déjà goûté & validé : consommation libre des 3 bonbons restants
              const nextCounts: Record<string, number> = {
                ...defaultCounts,
                ...box.counts,
                [candyName]: currentCount - 1,
              };
              onUpdatePj({
                ...pj,
                candyBox: {
                  unlocked: box.unlocked,
                  counts: nextCounts,
                  tasted: box.tasted.includes(candyName) ? box.tasted : [...box.tasted, candyName],
                  pendingTaste: box.pendingTaste || null,
                  rejectedTaste: null,
                },
              });
              success(
                `🍬 1 × ${candyName} consommé (reste ${currentCount - 1}/4 dans la boîte).`
              );
            };

            const handleCancelPendingTaste = () => {
              if (!box.pendingTaste) return;
              onUpdatePj({
                ...pj,
                candyBox: {
                  unlocked: box.unlocked,
                  counts: { ...defaultCounts, ...box.counts },
                  tasted: box.tasted,
                  pendingTaste: null,
                  rejectedTaste: box.rejectedTaste || null,
                },
              });
              info('Demande de dégustation annulée.');
            };

            return (
              <div className="bg-gradient-to-br from-[#280c3d] via-[#1c092b] to-[#14071f] border-2 border-[#d4a84a] rounded-xl p-4 space-y-3 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#7e22ce]/50 pb-2.5">
                  <div>
                    <h4 className="font-serif-co text-base font-bold text-[#fde047] flex items-center gap-2">
                      <span>🎁</span>
                      <span>Boîte à Bonbons de l&apos;Obscure</span>
                    </h4>
                    <p className="text-[11px] text-[#e9d5ff]">
                      {box.unlocked
                        ? `${totalLeft}/48 bonbons restants • ${tastedCount}/12 couleurs validées (1er test validé par le MJ + 3 pour le jeu)`
                        : "Coffret d'ébène scellé — Réussissez à l'ouvrir en jeu et attendez le déblocage du MJ."}
                    </p>
                  </div>
                  {!box.unlocked ? (
                    <button
                      type="button"
                      onClick={() =>
                        info(
                          "🔒 Le coffret est encore scellé ! Réussissez à l'ouvrir en partie : votre MJ le débloquera ensuite pour vous."
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-[#3b1259] hover:bg-[#4e1875] border border-[#d4a84a] text-[#fde047] font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Lock className="w-3.5 h-3.5" /> Ouvrir la boîte
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-[#18301c] text-[#86efac] border border-[#2d5e37] shrink-0">
                      ✓ Coffret ouvert
                    </span>
                  )}
                </div>

                {!box.unlocked ? (
                  <div className="p-3 rounded-lg bg-[#140620] border border-[#581c87]/60 text-xs text-[#d8b4fe] flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#fde047] shrink-0" />
                    <span>
                      Les 48 bonbons (12 couleurs × 4 exemplaires) et leurs effets restent cachés tant que le coffret n&apos;est pas ouvert avec l&apos;accord du MJ.
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {box.pendingTaste && (
                      <div className="p-2.5 rounded-lg bg-[#3b2809] border border-[#d4a84a] text-xs text-[#fde047] flex flex-wrap items-center justify-between gap-2">
                        <span>
                          ⏳ Demande envoyée au MJ pour goûter <b>{getAnonymousCandyName(box.pendingTaste.candyName)}</b> — en attente de sa validation...
                        </span>
                        <button
                          type="button"
                          onClick={handleCancelPendingTaste}
                          className="px-2 py-0.5 rounded bg-[#231808] hover:bg-[#33230d] border border-[#785923] text-[10px] text-[#f3d48d] font-bold cursor-pointer"
                        >
                          Annuler la demande
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {CANDIES_12.map((candy) => {
                        const count = box.counts[candy.n] ?? 4;
                        const revealed = box.tasted.includes(candy.n) || isItemOwnedByPj(candy.n);
                        const isPending = !revealed && box.pendingTaste?.candyName === candy.n;
                        const wasRejected = !revealed && !isPending && box.rejectedTaste?.candyName === candy.n;
                        const anonName = getAnonymousCandyName(candy.n);
                        const swatchClass = CANDY_COLOR_SWATCH[candy.n] || 'bg-[#9333ea]';
                        return (
                          <div
                            key={candy.n}
                            className={`p-3 rounded-lg border flex flex-col justify-between gap-2 ${
                              count <= 0
                                ? 'bg-[#120b17]/60 border-[#2d1e38] opacity-60'
                                : revealed
                                ? 'bg-[#221030] border-[#a855f7]/70'
                                : isPending
                                ? 'bg-[#2e200a] border-[#d4a84a]'
                                : 'bg-[#170c21] border-[#4c1d95]'
                            }`}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span
                                    className={`w-3.5 h-3.5 rounded-full border border-white/40 shrink-0 ${swatchClass}`}
                                    aria-hidden="true"
                                  />
                                  {revealed ? (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setDetailItem({ type: 'equipment', data: candy })
                                      }
                                      className="font-serif-co text-xs font-bold text-[#f5d0fe] hover:text-white hover:underline text-left truncate cursor-pointer flex items-center gap-1"
                                    >
                                      <span className="truncate">{candy.n}</span>
                                      <Info className="w-3 h-3 text-[#d4a84a] shrink-0" />
                                    </button>
                                  ) : (
                                    <span className="font-serif-co text-xs font-bold text-[#e9d5ff] truncate">
                                      {anonName}
                                    </span>
                                  )}
                                </div>
                                <span
                                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                                    count > 0
                                      ? 'bg-[#2e1047] text-[#fde047] border border-[#7e22ce]'
                                      : 'bg-[#1f1726] text-[#8c7a99]'
                                  }`}
                                >
                                  {count}/4
                                </span>
                              </div>

                              {revealed ? (
                                <div className="space-y-1">
                                  <p className="text-[11px] text-[#ede3d1] leading-snug">
                                    {candy.desc}
                                  </p>
                                  {candy.effetSecondaire && (
                                    <p className="text-[10px] text-[#f5b7ff] italic leading-snug">
                                      {candy.effetSecondaire}
                                    </p>
                                  )}
                                </div>
                              ) : isPending ? (
                                <p className="text-[11px] text-[#fde047] italic flex items-center gap-1">
                                  <span>⏳</span>
                                  En attente de validation du MJ...
                                </p>
                              ) : (
                                <div className="space-y-1">
                                  <p className="text-[11px] text-[#a78bfa] italic flex items-center gap-1">
                                    <Lock className="w-3 h-3 shrink-0" />
                                    Effet secret : goûter le 1er nécessite l&apos;accord du MJ.
                                  </p>
                                  {wasRejected && (
                                    <p className="text-[10px] text-[#fca5a5] font-semibold">
                                      🚫 Refusé par le MJ — blocage maintenu.
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              disabled={count <= 0 || isPending}
                              onClick={() => handleTasteOrTakeCandy(candy.n)}
                              className={`w-full py-1.5 px-2.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors ${
                                count <= 0
                                  ? 'bg-[#1c1424] text-[#6d5c7a] cursor-not-allowed'
                                  : isPending
                                  ? 'bg-[#45310f] text-[#fde047] border border-[#d4a84a]/60 cursor-wait'
                                  : revealed
                                  ? 'bg-[#3b1c54] hover:bg-[#4c246e] text-[#f5d0fe] border border-[#a855f7]/60 cursor-pointer'
                                  : 'bg-gradient-to-r from-[#d4a84a] to-[#ab8230] hover:brightness-110 text-[#1a1208] cursor-pointer'
                              }`}
                            >
                              {count <= 0
                                ? 'Épuisé (0/4)'
                                : isPending
                                ? '⏳ Validation MJ attendue'
                                : revealed
                                ? '🍬 Prendre 1 bonbon'
                                : '👅 Demander à goûter (MJ)'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* CONSOMMABLES & MUNITIONS AVEC SAISIE NUMÉRIQUE DIRECTE */}
          <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-3">
            <h4 className="font-serif-co text-sm font-bold text-[#f3d48d]">
              Consommables &amp; Munitions (Saisie Directe)
            </h4>

            {pj.inventaire && pj.inventaire.filter((it) => it.isConsumable).length > 0 ? (
              <div className="space-y-2">
                {pj.inventaire
                  .filter((it) => it.isConsumable)
                  .map((it) => {
                    const globalIdx = pj.inventaire.indexOf(it);
                    const cat = findCatalogEquipmentByName(it.n);
                    return (
                      <div
                        key={globalIdx}
                        className="p-3 bg-[#231c15] border border-[#3d3023] rounded-lg flex flex-col gap-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setDetailItem({
                                type: 'equipment',
                                data: cat
                                  ? { ...cat, desc: cat.desc || it.desc, props: cat.props || (it.note ? `Notes : ${it.note}` : undefined) }
                                  : {
                                      n: it.n,
                                      nom: it.n,
                                      cat: 'Consommable',
                                      desc: it.desc || "Consommable ou munition d'aventure.",
                                      props: it.note ? `Notes : ${it.note}` : undefined,
                                    },
                              })
                            }
                            className="text-left group cursor-pointer"
                          >
                            <b className="text-[#f3d48d] text-sm group-hover:text-[#ffe099] flex items-center gap-1.5 underline-offset-2 hover:underline">
                              {it.n} <Info className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 text-[#d4a84a]" />
                            </b>
                            {it.desc && <p className="text-xs text-[#9e907d]">{it.desc}</p>}
                          </button>

                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-[#9e907d]">Qté :</span>
                            <input
                              type="number"
                              min="0"
                              value={it.q || 1}
                              onChange={(e) => setItemQty(globalIdx, parseInt(e.target.value) || 0)}
                              className="w-14 text-center font-bold text-[#f3d48d] bg-[#181410] border border-[#3d3023] rounded py-0.5 text-xs"
                            />
                            <button
                              onClick={() => setItemQty(globalIdx, (it.q || 1) - 1)}
                              className="w-7 h-7 bg-[#181410] hover:bg-[#2e2318] border border-[#3d3023] rounded flex items-center justify-center text-xs text-[#ede3d1]"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setItemQty(globalIdx, (it.q || 1) + 1)}
                              className="w-7 h-7 bg-[#181410] hover:bg-[#2e2318] border border-[#3d3023] rounded flex items-center justify-center text-xs text-[#ede3d1]"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => removeItem(globalIdx)}
                              className="p-1 rounded text-[#9e907d] hover:text-[#cf5544] hover:bg-[#181410]"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <input
                          type="text"
                          placeholder="Annotations (poids, doses, rangement...)"
                          value={it.note || ''}
                          onChange={(e) => updateItemNote(globalIdx, e.target.value)}
                          className="w-full text-xs bg-[#181410] border border-dashed border-[#3d3023] rounded px-2.5 py-1 text-[#ede3d1] focus:border-solid focus:border-[#d4a84a] outline-none"
                        />
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-xs text-[#9e907d] italic">Aucun consommable enregistré.</p>
            )}
          </div>

          {/* INVENTAIRE GÉNÉRAL (AVEC TENTES, ETC.) */}
          <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-3">
            <h4 className="font-serif-co text-sm font-bold text-[#f3d48d]">
              Inventaire Général (Tentes, Matériel &amp; Équipements Reçus)
            </h4>

            {pj.inventaire && pj.inventaire.filter((it) => !it.isConsumable).length > 0 ? (
              <div className="space-y-2">
                {pj.inventaire
                  .filter((it) => !it.isConsumable)
                  .map((it) => {
                    const globalIdx = pj.inventaire.indexOf(it);
                    const cat = findCatalogEquipmentByName(it.n);
                    const isEquippable = !!(cat && (cat.dm || cat.def !== undefined || cat.cat?.includes('Armure') || cat.cat?.includes('Bouclier')));
                    return (
                      <div
                        key={globalIdx}
                        className="p-3 bg-[#231c15] border border-[#3d3023] rounded-lg flex flex-col gap-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setDetailItem({
                                type: 'equipment',
                                data: cat
                                  ? { ...cat, desc: cat.desc || it.desc, props: cat.props || (it.note ? `Notes : ${it.note}` : undefined) }
                                  : {
                                      n: it.n,
                                      nom: it.n,
                                      cat: "Matériel d'aventure",
                                      desc: it.desc || "Matériel d'exploration et de voyage.",
                                      props: it.note ? `Notes : ${it.note}` : undefined,
                                    },
                              })
                            }
                            className="text-left group cursor-pointer"
                          >
                            <b className="text-[#ede3d1] text-sm group-hover:text-[#f3d48d] flex items-center gap-1.5 underline-offset-2 hover:underline">
                              {it.n} <Info className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 text-[#d4a84a]" />
                            </b>
                            {it.desc && <p className="text-xs text-[#9e907d]">{it.desc}</p>}
                          </button>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {isEquippable && (
                              <button
                                type="button"
                                onClick={() => equipOwnedInventoryItem(it)}
                                className="px-2 py-1 bg-[#2b3f24] hover:bg-[#38542e] border border-[#4e7a3f] text-[#c7f5b8] text-[11px] font-bold rounded cursor-pointer"
                                title="Équiper cet objet que vous possédez"
                              >
                                Équiper
                              </button>
                            )}
                            <span className="text-xs text-[#9e907d]">Qté :</span>
                            <input
                              type="number"
                              min="0"
                              value={it.q || 1}
                              onChange={(e) => setItemQty(globalIdx, parseInt(e.target.value) || 0)}
                              className="w-14 text-center font-bold text-[#ede3d1] bg-[#181410] border border-[#3d3023] rounded py-0.5 text-xs"
                            />
                            <button
                              onClick={() => setItemQty(globalIdx, (it.q || 1) - 1)}
                              className="w-7 h-7 bg-[#181410] hover:bg-[#2e2318] border border-[#3d3023] rounded flex items-center justify-center text-xs text-[#ede3d1]"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setItemQty(globalIdx, (it.q || 1) + 1)}
                              className="w-7 h-7 bg-[#181410] hover:bg-[#2e2318] border border-[#3d3023] rounded flex items-center justify-center text-xs text-[#ede3d1]"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => removeItem(globalIdx)}
                              className="p-1 rounded text-[#9e907d] hover:text-[#cf5544] hover:bg-[#181410]"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <input
                          type="text"
                          placeholder="Annotations..."
                          value={it.note || ''}
                          onChange={(e) => updateItemNote(globalIdx, e.target.value)}
                          className="w-full text-xs bg-[#181410] border border-dashed border-[#3d3023] rounded px-2.5 py-1 text-[#ede3d1] focus:border-solid focus:border-[#d4a84a] outline-none"
                        />
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-xs text-[#9e907d] italic">Sacoche vide.</p>
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 5 : LES TERRES D'OSGILD (LORE DU JOUEUR - ONGLET UNIQUE) ==================== */}
      {activeTab === 'lore' && <OsgildLorePj />}

      {/* ==================== DRAWER CATALOGUE ==================== */}
      {catalogDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#181410] border-l border-[#d4a84a] w-full max-w-md h-full flex flex-col shadow-2xl animate-slideLeft">
            <div className="px-5 py-4 border-b border-[#3d3023] flex items-center justify-between bg-gradient-to-r from-[#291712] to-[#181410]">
              <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">
                {catalogDrawer === 'armes'
                  ? 'Armurerie (Noms seuls)'
                  : catalogDrawer === 'armures'
                  ? 'Protections (Noms seuls)'
                  : catalogDrawer === 'sorts'
                  ? 'Catalogue des Sorts'
                  : catalogDrawer === 'tharnea'
                  ? 'Codex Tharnéa (Noms seuls)'
                  : 'Catalogue Équipement (Noms seuls)'}
              </h3>
              <button
                onClick={() => setCatalogDrawer(null)}
                className="p-1 rounded text-[#9e907d] hover:text-[#ede3d1] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {catalogDrawer !== 'sorts' && (
              <div className="px-4 py-2.5 bg-[#1b140d] border-b border-[#3d3023] flex items-start gap-2 text-[11px] text-[#cbb8a7]">
                <Lock className="w-3.5 h-3.5 text-[#d4a84a] shrink-0 mt-0.5" />
                <span>
                  Tant qu&apos;un objet n&apos;a pas été octroyé par le <b className="text-[#f3d48d]">MJ</b>, seul son nom est visible et aucun ajout autonome n&apos;est permis. Les détails se débloquent dès acquisition.
                </span>
              </div>
            )}

            <div className="p-4 border-b border-[#30251a]">
              <div className="relative">
                <Search className="w-4 h-4 text-[#9e907d] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder={
                    catalogDrawer === 'sorts'
                      ? 'Rechercher par nom, voie, effet...'
                      : "Rechercher par nom d'objet..."
                  }
                  value={catalogQuery}
                  onChange={(e) => setCatalogQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] focus:border-[#d4a84a] outline-none"
                />
              </div>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-2.5">
              {catalogDrawer === 'sorts' &&
                SORTS_CATALOG.filter((s) =>
                  (s.n + s.t + (s.voie || '')).toLowerCase().includes(catalogQuery.toLowerCase())
                ).map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#231c15] border border-[#3d3023] rounded-lg flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setDetailItem({ type: 'spell', data: s })}
                        className="text-left group cursor-pointer"
                      >
                        <b className="text-[#cbafff] text-sm group-hover:text-[#e4d4ff] flex items-center gap-1.5 underline-offset-2 hover:underline">
                          {s.n} <Info className="w-4 h-4 opacity-60 group-hover:opacity-100 text-[#cbafff]" />
                        </b>
                      </button>
                      <button
                        onClick={() => handleSelectFromDrawer(s)}
                        className="px-3 py-1.5 bg-[#3a2954] hover:bg-[#4d3670] border border-[#654a93] text-[#dccbff] text-xs font-bold rounded-lg cursor-pointer"
                      >
                        + Apprendre
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#9e907d]">
                      <span>Rang {s.rang} • Voie : {s.voie || 'Générale'} • Portée : {s.portee}</span>
                      {(() => {
                        const ar = resolveActionRule(s.actionCost, s.L === 1, true);
                        return (
                          <button
                            type="button"
                            onClick={() =>
                              setDetailItem({
                                type: 'actionRule',
                                data: {
                                  actionCost: s.actionCost,
                                  isLimited: s.L === 1,
                                  isSpell: true,
                                  sourceTitle: s.n,
                                },
                              })
                            }
                            className={`px-2 py-0.5 rounded border text-[11px] font-bold cursor-pointer ${ar.badgeStyle}`}
                          >
                            {ar.shortLabel}
                          </button>
                        );
                      })()}
                    </div>
                    <p className="text-xs text-[#ede3d1]">{s.t}</p>
                  </div>
                ))}

              {catalogDrawer === 'tharnea' &&
                THARNEA_ARTIFACTS.filter((it) => {
                  const q = catalogQuery.trim().toLowerCase();
                  if (!q) return true;
                  const owned = isItemOwnedByPj(it.n);
                  const isCandy = it.cat === 'Bonbon Alchimique';
                  const revealed = owned || (isCandy && !!pj.candyBox?.tasted?.includes(it.n));
                  if (revealed) {
                    return (it.n + (it.desc || '') + (it.cat || '')).toLowerCase().includes(q);
                  }
                  const blindName = isCandy ? getAnonymousCandyName(it.n) : it.n;
                  return blindName.toLowerCase().includes(q);
                }).map((it, idx) => {
                  const owned = isItemOwnedByPj(it.n);
                  const isCandy = it.cat === 'Bonbon Alchimique';
                  const revealed = owned || (isCandy && !!pj.candyBox?.tasted?.includes(it.n));
                  const displayName = !isCandy || revealed ? it.n : getAnonymousCandyName(it.n);
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border flex items-center justify-between gap-2 ${
                        revealed
                          ? 'bg-[#241320] border-[#a855f7]/60'
                          : 'bg-[#171217] border-[#302330]'
                      }`}
                    >
                      {revealed ? (
                        <button
                          type="button"
                          onClick={() =>
                            setDetailItem({
                              type: 'equipment',
                              data: it,
                            })
                          }
                          className="flex-1 text-left group cursor-pointer flex items-center gap-2"
                        >
                          <b className="text-[#f7cbf2] text-sm group-hover:text-white group-hover:underline">
                            {displayName}
                          </b>
                          <Info className="w-3.5 h-3.5 text-[#ff8fed] shrink-0" />
                        </button>
                      ) : (
                        <span className="text-sm font-medium text-[#cbb8cb]">{displayName}</span>
                      )}

                      {revealed ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#18301c] text-[#86efac] border border-[#2d5e37] font-bold shrink-0">
                          ✓ {owned ? 'Acquis' : 'Goûté'}
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#1f1821] text-[#9a869c] border border-[#3a2a3d] font-semibold flex items-center gap-1 shrink-0">
                          <Lock className="w-3 h-3" /> {isCandy ? 'Goûter / MJ' : 'MJ seul'}
                        </span>
                      )}
                    </div>
                  );
                })}

              {catalogDrawer !== 'sorts' &&
                catalogDrawer !== 'tharnea' &&
                (catalogDrawer === 'armes'
                  ? ARMES_CATALOG
                  : catalogDrawer === 'armures'
                  ? ARMURES_CATALOG
                  : BIENS_CATALOG
                )
                  .filter((it) => {
                    const q = catalogQuery.trim().toLowerCase();
                    if (!q) return true;
                    const owned = isItemOwnedByPj(it.n);
                    if (owned) {
                      return (it.n + (it.desc || '') + (it.props || '')).toLowerCase().includes(q);
                    }
                    return it.n.toLowerCase().includes(q);
                  })
                  .map((it, idx) => {
                    const owned = isItemOwnedByPj(it.n);
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border flex items-center justify-between gap-2 ${
                          owned
                            ? 'bg-[#231c15] border-[#d4a84a]/60'
                            : 'bg-[#15120e] border-[#2d241b]'
                        }`}
                      >
                        {owned ? (
                          <button
                            type="button"
                            onClick={() =>
                              setDetailItem({
                                type: 'equipment',
                                data: {
                                  ...it,
                                  n: it.n,
                                  nom: it.n,
                                  cat:
                                    it.cat ||
                                    (catalogDrawer === 'armes'
                                      ? 'Arme'
                                      : catalogDrawer === 'armures'
                                      ? 'Armure / Protection'
                                      : 'Bien & Équipement'),
                                },
                              })
                            }
                            className="flex-1 text-left group cursor-pointer flex items-center gap-2"
                          >
                            <b className="text-[#f3d48d] text-sm group-hover:text-[#ffe099] group-hover:underline">
                              {it.n}
                            </b>
                            <Info className="w-3.5 h-3.5 text-[#d4a84a] shrink-0" />
                          </button>
                        ) : (
                          <span className="text-sm font-medium text-[#bba992]">{it.n}</span>
                        )}

                        {owned ? (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#18301c] text-[#86efac] border border-[#2d5e37] font-bold shrink-0">
                            ✓ Acquis
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#1d1711] text-[#8e7e6b] border border-[#33281d] font-semibold flex items-center gap-1 shrink-0">
                            <Lock className="w-3 h-3" /> MJ seul
                          </span>
                        )}
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL PASSAGE DE NIVEAU OFFICIEL COF ==================== */}
      {isLevelUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#181410] border border-[#d4a84a] rounded-xl w-full max-w-lg shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#3d3023] pb-3">
              <div>
                <h3 className="font-serif-co text-xl font-bold text-[#f3d48d]">
                  Passage au Niveau {pj.level + 1}
                </h3>
                <p className="text-xs text-[#9e907d]">
                  Application stricte des règles officielles Chroniques Oubliées Fantasy
                </p>
              </div>
              <span className="text-xs font-bold font-mono px-2 py-1 bg-[#231c15] text-[#d4a84a] border border-[#3d3023] rounded">
                Profil : {pr.n} (d{pr.dv})
              </span>
            </div>

            {/* 1. GESTION DES POINTS DE VIE (PV) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#d4a84a] block">
                1. Mode de gain des Points de Vie (PV)
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLevelUpMethod('average')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    levelUpMethod === 'average'
                      ? 'bg-[#2b1f14] border-[#d4a84a] text-[#f3d48d] shadow-sm'
                      : 'bg-[#181410] border-[#3d3023] text-[#9e907d] hover:border-[#5a4632]'
                  }`}
                >
                  <div className="text-xs font-bold">⚖️ Moyenne arrondie au sup.</div>
                  <div className="text-[11px] text-[#ede3d1] mt-1">
                    Valeur fixe : <b>{Math.floor(pr.dv / 2) + 1} PV</b> (sur d{pr.dv})
                  </div>
                  <div className="text-[10px] text-[#9e907d] mt-0.5">Variante courante de table</div>
                </button>

                <button
                  type="button"
                  onClick={() => setLevelUpMethod('roll')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    levelUpMethod === 'roll'
                      ? 'bg-[#2b1f14] border-[#d4a84a] text-[#f3d48d] shadow-sm'
                      : 'bg-[#181410] border-[#3d3023] text-[#9e907d] hover:border-[#5a4632]'
                  }`}
                >
                  <div className="text-xs font-bold">🎲 Tirage réel Dé de Vie</div>
                  <div className="text-[11px] text-[#ede3d1] mt-1">
                    Lancer physique d{pr.dv} : <b>{levelUpDiceResult}</b>
                  </div>
                  <div className="text-[10px] text-[#9e907d] mt-0.5">Règle de base officielle</div>
                </button>
              </div>

              {levelUpMethod === 'roll' && (
                <div className="p-3 bg-[#231c15] border border-[#3d3023] rounded-lg text-center space-y-1.5">
                  <label className="text-[11px] font-bold text-[#9e907d] uppercase tracking-wider block">
                    Résultat obtenu sur votre d{pr.dv} :
                  </label>
                  <div className="flex items-center justify-center gap-3">
                    <input
                      type="number"
                      min="1"
                      max={pr.dv}
                      value={levelUpDiceResult}
                      onChange={(e) =>
                        setLevelUpDiceResult(
                          Math.max(1, Math.min(pr.dv, parseInt(e.target.value) || 1))
                        )
                      }
                      className="w-20 text-center font-serif-co text-3xl font-bold text-[#f3d48d] bg-[#120f0c] border border-[#3d3023] rounded py-1"
                    />
                  </div>
                </div>
              )}

              {/* Résumé formule PV */}
              <div className="p-3 bg-[#120f0c] border border-[#3d3023] rounded-lg text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#9e907d]">Base DV ({levelUpMethod === 'average' ? 'Moitié du dé' : `d${pr.dv}`}) :</span>
                  <span className="font-bold text-[#ede3d1]">{levelUpMethod === 'average' ? Math.floor(pr.dv / 2) : levelUpDiceResult}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#9e907d]">Modificateur de Constitution (CON) :</span>
                  <span className="font-bold text-[#6fa85b]">
                    {st && st.m.CON >= 0 ? `+${st.m.CON}` : st ? st.m.CON : 0}
                  </span>
                </div>
                <div className="border-t border-[#30251a] pt-1 flex items-center justify-between font-bold">
                  <span className="text-[#ede3d1]">Gain net de PV au niveau {pj.level + 1} :</span>
                  <span className="text-[#f3d48d] text-sm">
                    +{Math.max(1, (levelUpMethod === 'average' ? Math.floor(pr.dv / 2) : levelUpDiceResult) + (st ? st.m.CON : 0))} PV
                  </span>
                </div>
                <div className="text-[10px] text-[#9e907d] italic">
                  * Règle : moitié du dé ({Math.floor(pr.dv / 2)}) + Mod. CON. Garanti à minimum +1 PV par niveau.
                </div>
              </div>
            </div>

            {/* 2. GESTION DES POINTS DE MANA (PM) */}
            <div className="space-y-2 pt-2 border-t border-[#30251a]">
              <label className="text-xs font-bold uppercase tracking-wider text-[#cbafff] block">
                2. Gestion des Points de Mana (PM)
              </label>

              {['magicien', 'ensorceleur', 'necromancien'].includes(pj.profil) ? (
                <div className="p-3 bg-[#251833] border border-[#5a3a7d] rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#e4d4ff]">
                    <span>Magie Profane Majeure ({pr.n}) :</span>
                    <span className="text-[#6fa85b]">+2 PM / niveau</span>
                  </div>
                  <div className="text-[11px] text-[#cbafff]">
                    Formule officielle : <b>(2 × Niveau) + Mod. Mental</b>
                  </div>
                  <div className="text-[11px] text-[#ede3d1] pt-1">
                    Nouveau réservoir max au niveau {pj.level + 1} :{' '}
                    <b className="text-[#f3d48d]">
                      {(pj.level + 1) * 2 + (pr.mag && st ? st.m[pr.mag as keyof typeof st.m] : 0)} PM
                    </b>
                  </div>
                </div>
              ) : ['pretre', 'druide', 'barde', 'forgesort'].includes(pj.profil) ? (
                <div className="p-3 bg-[#1e2333] border border-[#3a497d] rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#cbd7ff]">
                    <span>Magie Divine &amp; Hybride ({pr.n}) :</span>
                    <span className="text-[#6fa85b]">+1 PM / niveau</span>
                  </div>
                  <div className="text-[11px] text-[#cbd7ff]">
                    Formule officielle : <b>(1 × Niveau) + Mod. Mental</b>
                  </div>
                  <div className="text-[11px] text-[#ede3d1] pt-1">
                    Nouveau réservoir max au niveau {pj.level + 1} :{' '}
                    <b className="text-[#f3d48d]">
                      {(pj.level + 1) * 1 + (pr.mag && st ? st.m[pr.mag as keyof typeof st.m] : 0)} PM
                    </b>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-[#181410] border border-[#3d3023] rounded-lg text-xs text-[#9e907d]">
                  Profil non-magique ({pr.n}) : 0 PM (pas de réserve de mana dépensable).
                </div>
              )}
            </div>

            {/* 3. POINTS DE CAPACITÉ ACCORDÉS */}
            <div className="p-3 bg-[#122410]/30 border border-[#274721] rounded-lg text-xs flex items-center justify-between">
              <span className="text-[#ede3d1]">Points de capacité accordés pour vos voies :</span>
              <span className="font-bold text-[#6fa85b] text-sm">+2 Points</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#30251a]">
              <button
                onClick={() => setIsLevelUpOpen(false)}
                className="px-4 py-2 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-xs font-semibold text-[#ede3d1] rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleLevelUpConfirm}
                className="px-5 py-2 bg-gradient-to-r from-[#d4a84a] to-[#ab8230] hover:brightness-110 text-black font-bold text-xs rounded-lg shadow-md"
              >
                Valider Niveau {pj.level + 1}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL CRÉER SORT SUR MESURE ==================== */}
      {isCustomSpellOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#181410] border border-[#654a93] rounded-xl w-full max-w-md shadow-2xl p-5 space-y-3">
            <h3 className="font-serif-co text-lg font-bold text-[#cbafff]">
              Créer un Sortilège sur Mesure
            </h3>

            <div>
              <label className="text-xs font-bold uppercase text-[#9e907d] block mb-1">
                Nom du Sortilège *
              </label>
              <input
                type="text"
                placeholder="Ex: Rayon Glacial, Mur de Flammes..."
                value={customSpellName}
                onChange={(e) => setCustomSpellName(e.target.value)}
                className="w-full px-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none focus:border-[#cbafff]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase text-[#9e907d] block mb-1">
                  Rang du sort (1 à 5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={customSpellRank}
                  onChange={(e) =>
                    setCustomSpellRank(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))
                  }
                  className="w-full px-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#9e907d] block mb-1">
                  Portée
                </label>
                <input
                  type="text"
                  placeholder="Ex: 20 m, Contact..."
                  value={customSpellRange}
                  onChange={(e) => setCustomSpellRange(e.target.value)}
                  className="w-full px-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#9e907d] block mb-1">
                Description &amp; Effets
              </label>
              <textarea
                rows={3}
                placeholder="Dégâts infligés, jet de sauvegarde, durée..."
                value={customSpellDesc}
                onChange={(e) => setCustomSpellDesc(e.target.value)}
                className="w-full px-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsCustomSpellOpen(false)}
                className="px-4 py-2 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-xs font-semibold text-[#ede3d1] rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveCustomSpell}
                className="px-5 py-2 bg-[#3a2954] hover:bg-[#4d3670] border border-[#654a93] text-[#dccbff] font-bold text-xs rounded-lg shadow-md"
              >
                Ajouter au Grimoire
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== FEUILLE DE PERSONNAGE A4 OFFICIELLE BBE ==================== */}
      <BbeOfficialSheetModal
        pj={pj}
        isOpen={isBbePrintOpen}
        onClose={() => setIsBbePrintOpen(false)}
      />

      {/* ==================== MODAL GUIDE DES ACTIONS PAR CARACTÉRISTIQUE ==================== */}
      {activeCaracInfo !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#181410] border border-[#d4a84a] rounded-xl w-full max-w-2xl shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#3d3023] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#2d1f11] border border-[#d4a84a] rounded-lg text-[#d4a84a]">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">
                    Guide des Tests de Caractéristiques &amp; Actions Types
                  </h3>
                  <p className="text-xs text-[#9e907d]">
                    Exemples officiels de situations en jeu et échelle de difficulté (d20 + Modificateur)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveCaracInfo(null)}
                className="p-1.5 rounded-lg text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#231c15]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sélecteur rapide */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <button
                onClick={() => setActiveCaracInfo('ALL')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  activeCaracInfo === 'ALL'
                    ? 'bg-[#d4a84a] text-black shadow-sm'
                    : 'bg-[#231c15] text-[#9e907d] hover:text-[#ede3d1]'
                }`}
              >
                Toutes les Caractéristiques
              </button>
              {(['FOR', 'DEX', 'CON', 'INT', 'SAG', 'CHA'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCaracInfo(c)}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    activeCaracInfo === c
                      ? 'bg-[#d4a84a] text-black shadow-sm'
                      : 'bg-[#231c15] text-[#9e907d] hover:text-[#ede3d1]'
                  }`}
                >
                  {c} {st && (st.m[c] >= 0 ? `(+${st.m[c]})` : `(${st.m[c]})`)}
                </button>
              ))}
            </div>

            {/* Tableau des Actions types demandées par le joueur */}
            <div className="space-y-3">
              {(activeCaracInfo === 'ALL' || activeCaracInfo === 'SAG') && (
                <div className="p-3.5 bg-[#17221c] border border-[#2b593f] rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <b className="font-serif-co text-sm text-[#8ee0aa] flex items-center gap-2">
                      <span>👁️</span> Perception / Vigilance &amp; Intuition &rarr; SAG (Sagesse)
                    </b>
                    <span className="text-[11px] font-mono font-bold text-[#8ee0aa] bg-[#0c1811] px-2 py-0.5 rounded border border-[#2b593f]">
                      Mod. Actuel : {st && st.m.SAG >= 0 ? `+${st.m.SAG}` : st ? st.m.SAG : 0}
                    </span>
                  </div>
                  <ul className="text-xs text-[#ede3d1] space-y-1 pl-4 list-disc">
                    <li><b>Détecter un piège</b> ou une dalle piégée avant de poser le pied.</li>
                    <li><b>Entendre un bruit suspect</b> ou des chuchotements derrière une lourde porte de bois.</li>
                    <li><b>Repérer une embuscade</b> tapie dans les fourrés ou sur les hauteurs.</li>
                    <li><b>Discerner les mensonges</b> ou les intentions cachées d'un interlocuteur (Psychologie).</li>
                    <li><b>Pister une créature</b> ou survivre en milieu hostile sauvage (Orientation).</li>
                  </ul>
                </div>
              )}

              {(activeCaracInfo === 'ALL' || activeCaracInfo === 'DEX') && (
                <div className="p-3.5 bg-[#241c14] border border-[#59422b] rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <b className="font-serif-co text-sm text-[#ffcb8e] flex items-center gap-2">
                      <span>🎯</span> Acrobatie / Discrétion &amp; Finesse &rarr; DEX (Dextérité)
                    </b>
                    <span className="text-[11px] font-mono font-bold text-[#ffcb8e] bg-[#1a120b] px-2 py-0.5 rounded border border-[#59422b]">
                      Mod. Actuel : {st && st.m.DEX >= 0 ? `+${st.m.DEX}` : st ? st.m.DEX : 0}
                    </span>
                  </div>
                  <ul className="text-xs text-[#ede3d1] space-y-1 pl-4 list-disc">
                    <li><b>Sauter par-dessus un gouffre</b> ou franchir un précipice avec élan.</li>
                    <li><b>Marcher sans bruit</b> et se faufiler dans les ombres sans attirer l'attention.</li>
                    <li><b>Crocheter une serrure</b> ou désamorcer délicatement un mécanisme à aiguille.</li>
                    <li><b>Faire les poches</b> d'un garde ou subtiliser une clef à la ceinture.</li>
                    <li><b>Esquiver un piège</b> à déclenchement soudain (flèches murales, chute de pierre).</li>
                  </ul>
                </div>
              )}

              {(activeCaracInfo === 'ALL' || activeCaracInfo === 'FOR') && (
                <div className="p-3.5 bg-[#251515] border border-[#5c2a2a] rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <b className="font-serif-co text-sm text-[#ffa3a3] flex items-center gap-2">
                      <span>⚔️</span> Athlétisme / Force brute &rarr; FOR (Force)
                    </b>
                    <span className="text-[11px] font-mono font-bold text-[#ffa3a3] bg-[#1a0c0c] px-2 py-0.5 rounded border border-[#5c2a2a]">
                      Mod. Actuel : {st && st.m.FOR >= 0 ? `+${st.m.FOR}` : st ? st.m.FOR : 0}
                    </span>
                  </div>
                  <ul className="text-xs text-[#ede3d1] space-y-1 pl-4 list-disc">
                    <li><b>Enfoncer une porte</b> massive en chêne ou forcer un verrou récalcitrant.</li>
                    <li><b>Soulever une herse ou une grille</b> de fer pour permettre aux compagnons de ramper.</li>
                    <li><b>Escalader une paroi rocheuse</b> glissante ou monter à une corde à mains nues.</li>
                    <li><b>Nager à contre-courant</b> dans une rivière tumultueuse ou lutter en combat rapproché.</li>
                    <li><b>Déplacer un rocher</b> obstruant un passage secret ou une entrée de crypte.</li>
                  </ul>
                </div>
              )}

              {(activeCaracInfo === 'ALL' || activeCaracInfo === 'INT') && (
                <div className="p-3.5 bg-[#171c26] border border-[#2b3d5c] rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <b className="font-serif-co text-sm text-[#a3c4ff] flex items-center gap-2">
                      <span>📜</span> Connaissances / Recherche &rarr; INT (Intelligence)
                    </b>
                    <span className="text-[11px] font-mono font-bold text-[#a3c4ff] bg-[#0c111a] px-2 py-0.5 rounded border border-[#2b3d5c]">
                      Mod. Actuel : {st && st.m.INT >= 0 ? `+${st.m.INT}` : st ? st.m.INT : 0}
                    </span>
                  </div>
                  <ul className="text-xs text-[#ede3d1] space-y-1 pl-4 list-disc">
                    <li><b>Identifier un monstre</b>, ses vulnérabilités et ses résistances élémentaires.</li>
                    <li><b>Déchiffrer des runes anciennes</b> ou traduire une inscription en langue oubliée.</li>
                    <li><b>Se souvenir d'une légende</b> historique ou de la généalogie d'une dynastie.</li>
                    <li><b>Comprendre un mécanisme complexe</b> d'horlogerie arcanique ou de puzzle runique.</li>
                    <li><b>Évaluer l'authenticité d'une relique</b> ou d'un parchemin magique.</li>
                  </ul>
                </div>
              )}

              {(activeCaracInfo === 'ALL' || activeCaracInfo === 'CHA') && (
                <div className="p-3.5 bg-[#251725] border border-[#5c2b5c] rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <b className="font-serif-co text-sm text-[#f0aeff] flex items-center gap-2">
                      <span>👑</span> Persuasion / Tromperie &amp; Éloquence &rarr; CHA (Charisme)
                    </b>
                    <span className="text-[11px] font-mono font-bold text-[#f0aeff] bg-[#1a0c1a] px-2 py-0.5 rounded border border-[#5c2b5c]">
                      Mod. Actuel : {st && st.m.CHA >= 0 ? `+${st.m.CHA}` : st ? st.m.CHA : 0}
                    </span>
                  </div>
                  <ul className="text-xs text-[#ede3d1] space-y-1 pl-4 list-disc">
                    <li><b>Négocier un prix avantageux</b> auprès d'un marchand d'armes ou aubergiste.</li>
                    <li><b>Mentir avec aplomb à un garde</b> de faction pour passer sans laisser-passer.</li>
                    <li><b>Convaincre un PNJ méfiant</b> de vous accorder son aide ou une audience princière.</li>
                    <li><b>Intimider une brute de taverne</b> ou haranguer une foule révoltée.</li>
                    <li><b>Séduire ou charmer</b> un noble pour glaner des rumeurs de cour.</li>
                  </ul>
                </div>
              )}

              {(activeCaracInfo === 'ALL' || activeCaracInfo === 'CON') && (
                <div className="p-3.5 bg-[#182417] border border-[#2e592b] rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <b className="font-serif-co text-sm text-[#aeffa3] flex items-center gap-2">
                      <span>🛡️</span> Endurance / Résistance vitale &rarr; CON (Constitution)
                    </b>
                    <span className="text-[11px] font-mono font-bold text-[#aeffa3] bg-[#0d1a0c] px-2 py-0.5 rounded border border-[#2e592b]">
                      Mod. Actuel : {st && st.m.CON >= 0 ? `+${st.m.CON}` : st ? st.m.CON : 0}
                    </span>
                  </div>
                  <ul className="text-xs text-[#ede3d1] space-y-1 pl-4 list-disc">
                    <li><b>Résister au froid mordant</b> d'une tempête de neige ou à une fournaise aride.</li>
                    <li><b>Courir un marathon forcé</b> sur plusieurs lieues sans succomber à l'épuisement.</li>
                    <li><b>Retenir son souffle sous l'eau</b> lors d'une exploration sous-marine.</li>
                    <li><b>Résister aux toxines</b> d'un poison venimeux ou à une maladie contagieuse.</li>
                    <li><b>Lutter contre l'ivresse</b> ou supporter la torture sans perdre connaissance.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Échelle des Difficultés Officielles */}
            <div className="p-3 bg-[#120f0c] border border-[#30251a] rounded-xl space-y-2">
              <b className="text-xs font-bold text-[#d4a84a] uppercase tracking-wider block">
                Échelle Officielle des Difficultés (Chroniques Oubliées)
              </b>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 bg-[#1c1813] border border-[#3d3023] rounded-lg">
                  <span className="text-[10px] text-[#9e907d] block font-bold">Facile</span>
                  <b className="font-serif-co text-base text-[#6fa85b]">Difficulté 10</b>
                  <p className="text-[10px] text-[#ede3d1] mt-0.5">Tâche ordinaire sous pression modérée.</p>
                </div>
                <div className="p-2 bg-[#1c1813] border border-[#3d3023] rounded-lg">
                  <span className="text-[10px] text-[#9e907d] block font-bold">Moyen (Standard)</span>
                  <b className="font-serif-co text-base text-[#f3d48d]">Difficulté 15</b>
                  <p className="text-[10px] text-[#ede3d1] mt-0.5">Défi d'aventurier classique.</p>
                </div>
                <div className="p-2 bg-[#1c1813] border border-[#3d3023] rounded-lg">
                  <span className="text-[10px] text-[#9e907d] block font-bold">Difficile</span>
                  <b className="font-serif-co text-base text-[#c97d32]">Difficulté 20</b>
                  <p className="text-[10px] text-[#ede3d1] mt-0.5">Exploit marquant nécessitant expertise.</p>
                </div>
                <div className="p-2 bg-[#1c1813] border border-[#3d3023] rounded-lg">
                  <span className="text-[10px] text-[#9e907d] block font-bold">Très Difficile / Héroïque</span>
                  <b className="font-serif-co text-base text-[#cf5544]">Difficulté 25</b>
                  <p className="text-[10px] text-[#ede3d1] mt-0.5">Prouesse légendaire frôlant l'impossible.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveCaracInfo(null)}
                className="px-5 py-2 bg-[#d4a84a] hover:bg-[#e0b555] text-black font-bold text-xs rounded-lg shadow-md"
              >
                Compris !
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL GUIDE RÉCUPÉRATION DES POINTS DE VIE (PV) ==================== */}
      {isHpRecoveryInfoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#181410] border border-[#ff8080] rounded-xl w-full max-w-lg shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#3d3023] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#331414] border border-[#ff8080] rounded-lg text-[#ff8080]">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-co text-lg font-bold text-[#ffb3b3]">
                    Règles Officielles : Récupération des Points de Vie (PV)
                  </h3>
                  <p className="text-xs text-[#9e907d]">
                    Système officiel Chroniques Oubliées Fantasy
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsHpRecoveryInfoOpen(false)}
                className="p-1.5 rounded-lg text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#231c15]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#ede3d1]">
              {/* Repos court */}
              <div className="p-3 bg-[#231818] border border-[#4d2828] rounded-xl space-y-1">
                <b className="text-[#ff9999] text-sm flex items-center gap-1.5 font-bold">
                  <span>🎲</span> 1. Récupération par Lancer de Dés de Vie (Règle active standard)
                </b>
                <p className="leading-relaxed">
                  Lorsque vous prenez un repos pour soigner vos blessures, vous lancez des <b>Dés de Vie (DV)</b> de votre profil (<b>d{pr.dv}</b>) auxquels vous ajoutez votre <b>Modificateur de Constitution</b> à chaque dé :
                </p>
                <div className="p-2.5 bg-[#171111] border border-[#4a2222] rounded-lg my-1.5 text-center font-mono space-y-1">
                  <div className="text-xs text-[#ede3d1]">
                    Formule par dé lancé : <b>1 Dé de Vie (d{pr.dv}) + Modificateur CON ({st && st.m.CON >= 0 ? `+${st.m.CON}` : st ? st.m.CON : 0})</b>
                  </div>
                  <div className="text-[#f3d48d] font-bold text-xs">
                    Au Niveau {pj.level} : Vous disposez de <b>{pj.level} Dé{pj.level > 1 ? 's' : ''} de Vie</b> au total ({pj.level}d{pr.dv} + {pj.level} × {st && st.m.CON >= 0 ? `+${st.m.CON}` : st ? st.m.CON : 0})
                  </div>
                </div>
                <p className="text-[11px] text-[#9e907d]">
                  Chaque <b>Point de Récupération (PR)</b> dépensé lors d'un repos court (10 min) permet de lancer <b>1 Dé de Vie (d{pr.dv}) + Mod. CON</b>. Vous disposez de 5 PR par jour.
                </p>
              </div>

              {/* Nuit de repos complet */}
              <div className="p-3 bg-[#1d1e2b] border border-[#373b5e] rounded-xl space-y-1.5">
                <b className="text-[#9ea8ff] text-sm flex items-center gap-1.5 font-bold">
                  <span>🌙</span> 2. Nuit Complète de Sommeil (8 heures de repos)
                </b>
                <p className="leading-relaxed">
                  Après 8 heures de repos ininterrompu dans un camp sécurisé :
                </p>
                <ul className="list-disc pl-4 space-y-1 text-xs">
                  <li>
                    <b>Lancer de dés de vie :</b> Vous pouvez dépenser vos dés de vie / PR pour vous soigner (jusqu'à <b>{pj.level}d{pr.dv} + {pj.level} × Mod. CON</b>).
                  </li>
                  <li>
                    <b>Guérison passive garantie (sans consommer de dés) :</b> Même sans dépenser de dé de vie, votre corps cicatrise automatiquement d'une valeur fixe de <b>[ Niveau ({pj.level}) + Mod. CON ({st && st.m.CON >= 0 ? `+${st.m.CON}` : st ? st.m.CON : 0}) ] PV</b> (minimum 1 PV).
                  </li>
                  <li>
                    ✨ <b>Récupération complète des réserves :</b> Vous regagnez tous vos <b>Points de Récupération (PR)</b> journaliers au réveil !
                  </li>
                </ul>
              </div>

              {/* Convalescence Auberge */}
              <div className="p-3 bg-[#1a2418] border border-[#304d2c] rounded-xl space-y-1.5">
                <b className="text-[#96df8f] text-sm flex items-center gap-1.5 font-bold">
                  <span>🏡</span> 3. Convalescence en Auberge / Havre de Paix (24 heures)
                </b>
                <p className="leading-relaxed">
                  Dans un vrai lit avec repas chaud et sécurité absolue :
                </p>
                <div className="p-2 bg-[#0e170c] border border-[#243d20] rounded font-mono text-[#96df8f] text-center my-1 font-bold text-xs">
                  Récupération passive doublée = [ 2 × (Niveau + Mod. CON) ] PV par 24h + tous les DV / PR régénérés
                </div>
                <p className="text-[11px] text-[#9e907d]">
                  Si un allié pratique des soins médicaux ou de l'herboristerie (test réussi diff 12), ajoutez +1d6 PV bonus par jour.
                </p>
              </div>

              {/* Soins Magiques et Potions */}
              <div className="p-3 bg-[#241d14] border border-[#4d3824] rounded-xl space-y-1">
                <b className="text-[#f3d48d] text-sm flex items-center gap-1.5 font-bold">
                  <span>🧪</span> 4. Potions &amp; Magie de Guérison
                </b>
                <p className="leading-relaxed">
                  Les potions et sorts de soins (Voie de la prière / Voie des soins) restaurent les PV instantanément en plein combat ou en urgence sans consommer de PR :
                </p>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  <li><b>Potion de soins légers :</b> Rend immédiatement <b>1d8 PV</b>.</li>
                  <li><b>Potion de soins modérés :</b> Rend immédiatement <b>2d8 PV</b>.</li>
                  <li><b>Sort "Soins légers" (Prêtre/Druide) :</b> Rend <b>1d8 + Niveau PV</b>.</li>
                </ul>
              </div>

              {/* Alerte 0 PV */}
              <div className="p-2.5 bg-[#2d1212] border border-[#6b2525] rounded-lg text-[11px] text-[#ffb8b8]">
                ⚠️ <b>Inconscience à 0 PV :</b> À 0 PV, le héros s'effondre inconscient et mourant. Il meurt si son état n'est pas stabilisé avant [CON] tours (test de Premiers soins diff 15 ou 1 point de soin magique).
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsHpRecoveryInfoOpen(false)}
                className="px-5 py-2 bg-[#ff8080] hover:bg-[#ff9999] text-black font-bold text-xs rounded-lg shadow-md"
              >
                Fermer l'Aide PV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL GUIDE RÉCUPÉRATION DES POINTS DE MANA (PM) ==================== */}
      {isPmRecoveryInfoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#181410] border border-[#7db5ff] rounded-xl w-full max-w-lg shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#3d3023] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#141e33] border border-[#7db5ff] rounded-lg text-[#7db5ff]">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-co text-lg font-bold text-[#b8d7ff]">
                    Règles Officielles : Récupération des Points de Mana (PM)
                  </h3>
                  <p className="text-xs text-[#9e907d]">
                    Gestion de l'énergie arcanique et divine dans Chroniques Oubliées
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPmRecoveryInfoOpen(false)}
                className="p-1.5 rounded-lg text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#231c15]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#ede3d1]">
              {/* Nuit complète */}
              <div className="p-3 bg-[#162033] border border-[#2e477a] rounded-xl space-y-1">
                <b className="text-[#a3c4ff] text-sm flex items-center gap-1.5 font-bold">
                  <span>🌙</span> 1. Nuit Complète de Sommeil (8 heures) = 100% des PM
                </b>
                <p className="leading-relaxed">
                  Un repos ininterrompu de 8 heures permet au lanceur de sorts de régénérer la totalité de son flux magique :
                </p>
                <div className="p-2 bg-[#0d1421] border border-[#22355c] rounded font-mono text-[#7db5ff] text-center my-1 font-bold text-sm">
                  100% des Points de Mana récupérés au réveil ! (Max : {pmMax} PM)
                </div>
                <p className="text-[11px] text-[#9e907d]">
                  Le sommeil restaure l'équilibre des énergies arcaniques et réaccorde l'âme du prêtre avec sa divinité tutélaire.
                </p>
              </div>

              {/* Méditation */}
              <div className="p-3 bg-[#241a33] border border-[#54367a] rounded-xl space-y-1">
                <b className="text-[#d8aeff] text-sm flex items-center gap-1.5 font-bold">
                  <span>🧘</span> 2. Méditation / Transe Magique (1 heure de repos calme)
                </b>
                <p className="leading-relaxed">
                  Une séance d'étude du grimoire ou de prière silencieuse d'une heure en cours de journée permet de récupérer :
                </p>
                <div className="p-2 bg-[#140e1c] border border-[#3b2457] rounded font-mono text-[#d8aeff] text-center my-1 font-bold">
                  +50% de vos PM Maximaux (arrondi au supérieur)
                </div>
                <p className="text-[11px] text-[#cbafff]">
                  ⚠️ <b>Règle de limitation :</b> Cette méditation arcanique rapide n'est utilisable qu'<b>une seule fois par jour</b> d'aventure.
                </p>
              </div>

              {/* Potions et bonbons */}
              <div className="p-3 bg-[#1a251f] border border-[#2d523e] rounded-xl space-y-1">
                <b className="text-[#96e6b8] text-sm flex items-center gap-1.5 font-bold">
                  <span>🧪</span> 3. Potions de Mana &amp; Bonbons de Tharnéa
                </b>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  <li><b>Potion de Mana mineure :</b> Rend immédiatement <b>1d6 PM</b>.</li>
                  <li><b>Potion de Mana majeure :</b> Rend immédiatement <b>2d6 PM</b>.</li>
                  <li><b>Élixirs &amp; confiseries spéciales :</b> Raretés accordées uniquement par votre MJ.</li>
                </ul>
              </div>

              {/* Coût des sorts */}
              <div className="p-3 bg-[#120f0c] border border-[#30251a] rounded-xl space-y-1 text-[11px]">
                <b className="text-[#d4a84a] block uppercase font-bold">Barème de dépense selon le Rang du Sort :</b>
                <div className="grid grid-cols-5 gap-1.5 text-center font-mono font-bold pt-1">
                  <div className="bg-[#231c15] p-1.5 rounded border border-[#3d3023]">
                    <span className="text-[9px] text-[#9e907d] block">Rang 1</span>
                    <span className="text-[#7db5ff]">1 PM</span>
                  </div>
                  <div className="bg-[#231c15] p-1.5 rounded border border-[#3d3023]">
                    <span className="text-[9px] text-[#9e907d] block">Rang 2</span>
                    <span className="text-[#7db5ff]">2 PM</span>
                  </div>
                  <div className="bg-[#231c15] p-1.5 rounded border border-[#3d3023]">
                    <span className="text-[9px] text-[#9e907d] block">Rang 3</span>
                    <span className="text-[#7db5ff]">3 PM</span>
                  </div>
                  <div className="bg-[#231c15] p-1.5 rounded border border-[#3d3023]">
                    <span className="text-[9px] text-[#9e907d] block">Rang 4</span>
                    <span className="text-[#7db5ff]">4 PM</span>
                  </div>
                  <div className="bg-[#231c15] p-1.5 rounded border border-[#3d3023]">
                    <span className="text-[9px] text-[#9e907d] block">Rang 5</span>
                    <span className="text-[#7db5ff]">5 PM</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsPmRecoveryInfoOpen(false)}
                className="px-5 py-2 bg-[#7db5ff] hover:bg-[#96c3ff] text-black font-bold text-xs rounded-lg shadow-md"
              >
                Fermer l'Aide PM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== UNIVERSAL POP-UP DETAIL MODAL (PRIX STRICTEMENT MASQUÉS AU PJ) ==================== */}
      <DetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        hidePrice={true}
      />

      {/* Double Validation Modal pour Oublier le Héros */}
      {onDeletePj && (
        <DeleteCharacterModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          pj={pj}
          onConfirmDelete={(id) => {
            onDeletePj(id);
            setIsDeleteModalOpen(false);
          }}
        />
      )}

      {/* ==================== MODAL EXPLICATIVE : POINTS DE CAPACITÉ & CADEAUX RP DU MJ ==================== */}
      {isPtsCapInfoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#181410] border-2 border-[#d4a84a] rounded-2xl w-full max-w-lg shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#3d3023] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#d4a84a]/20 text-[#f3d48d] border border-[#d4a84a]/40">
                  <AlertCircle className="w-5 h-5 text-[#f3d48d]" />
                </div>
                <div>
                  <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">
                    Points de Capacité : Règles &amp; Récompenses RP
                  </h3>
                  <p className="text-xs text-[#a0907d]">
                    Système d&apos;attribution et cadeaux du Meneur de Jeu
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPtsCapInfoOpen(false)}
                className="p-1.5 rounded-lg text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#231c15] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#cbb8a7] leading-relaxed">
              <div className="p-3 bg-[#1e1511] border border-[#d4a84a]/40 rounded-xl space-y-1">
                <b className="text-[#f3d48d] text-sm block">📜 Règle Officielle (DRS Chroniques Oubliées) :</b>
                <p>
                  • <b>Au Niveau 1 :</b> Le personnage débute avec <b>2 capacités de rang 1</b> choisies parmi les 5 voies de son profil ou ses voies raciales.
                </p>
                <p>
                  • <b>À chaque passage de niveau (Niv. 2 à 20) :</b> Le héros gagne automatiquement <b>+2 Points de Capacité</b> à dépenser dans ses voies.
                </p>
                <p>
                  • <b>Coût par rang :</b> Dans une voie de son profil, le rang N coûte N points (Rang 1 = 1 pt, Rang 2 = 2 pts, Rang 3 = 3 pts, etc.). Pour une voie hors-profil, le coût est majoré de +1 pt par rang.
                </p>
              </div>

              <div className="p-3 bg-[#14231b] border border-[#276e43] rounded-xl space-y-1">
                <b className="text-[#86efac] text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#86efac]" />
                  <span>🎁 Points de Capacité Cadeaux (Excellent RP) :</span>
                </b>
                <p>
                  Autour de la table, le Meneur de Jeu (MJ) dispose du pouvoir officiel d&apos;octroyer des <b>points de capacité cadeaux</b> directement depuis son écran de contrôle pour récompenser :
                </p>
                <ul className="list-disc pl-5 space-y-0.5 text-[#ede3d1]">
                  <li>Une interprétation roleplay particulièrement mémorable, héroïque ou émouvante.</li>
                  <li>Une idée tactique créative qui débloque une situation désespérée.</li>
                  <li>L&apos;accomplissement d&apos;une quête personnelle majeure ou d&apos;un sacrifice pour ses compagnons.</li>
                </ul>
                <p className="text-[11px] text-[#9ee7b8] italic pt-1">
                  Les points offerts par le MJ s&apos;ajoutent instantanément à votre total disponible ci-dessus !
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#30251a]">
              <button
                onClick={() => setIsPtsCapInfoOpen(false)}
                className="px-5 py-2 bg-gradient-to-r from-[#d4a84a] to-[#ab8230] hover:brightness-110 text-black font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Compris !
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL TRANSFERT PJ VERS MJ ==================== */}
      {onSendToMjTable && (
        <TableTransferModal
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
          pj={pj}
          onSendLocal={onSendToMjTable}
        />
      )}

      {/* ==================== CALCULATRICE ANCIENNE & BOURSE MODAL ==================== */}
      <MoneyCalculatorModal
        isOpen={isMoneyCalcOpen}
        onClose={() => setIsMoneyCalcOpen(false)}
        currentBourse={currentBourse}
        onUpdateBourse={handleUpdateBourse}
        characterName={pj.name}
        partyCount={rosterCount || 4}
        isMj={false}
      />

      {/* ==================== MODAL CONFIRMATION SUPPRESSION OBJET (QTE 0) ==================== */}
      {confirmDeleteItemIdx !== null && pj.inventaire[confirmDeleteItemIdx] && (
        <div className="no-print fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#181410] border border-[#d4a84a] rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <h4 className="font-serif-co text-lg font-bold text-[#f3d48d]">
              Supprimer cet objet du sac ?
            </h4>
            <p className="text-xs text-[#cbb8a7] leading-relaxed">
              La quantité de <b className="text-[#ede3d1]">« {pj.inventaire[confirmDeleteItemIdx].n} »</b> est tombée à <b>0</b>. Voulez-vous le supprimer définitivement de votre sacoche ou le conserver à 0 ?
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#30251a]">
              <button
                type="button"
                onClick={() => setConfirmDeleteItemIdx(null)}
                className="px-4 py-2 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-xs font-semibold text-[#ede3d1] rounded-lg cursor-pointer"
              >
                Garder à 0
              </button>
              <button
                type="button"
                onClick={() => {
                  const inv = [...pj.inventaire];
                  inv.splice(confirmDeleteItemIdx, 1);
                  onUpdatePj({ ...pj, inventaire: inv });
                  setConfirmDeleteItemIdx(null);
                }}
                className="px-4 py-2 bg-[#7a2020] hover:bg-[#992b2b] text-white font-bold text-xs rounded-lg cursor-pointer"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL PORTRAIT PERSONNAGE ==================== */}
      {isPortraitModalOpen && (
        <div className="no-print fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#181410] border-2 border-[#d4a84a] rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#30251a] pb-3">
              <div>
                <h4 className="font-serif-co text-lg font-bold text-[#f3d48d]">
                  Portrait de {pj.name}
                </h4>
                <p className="text-[11px] text-[#9e907d]">
                  Générez un portrait adapté à sa race/profil (avec variantes) ou importez votre propre image.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPortraitModalOpen(false)}
                className="p-1.5 rounded-lg text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#231c15] cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <PortraitPicker
              value={pj.portrait}
              onChange={(url) => onUpdatePj({ ...pj, portrait: url })}
              characterDraft={{
                name: pj.name,
                race: pj.race,
                profil: pj.profil,
                isPnj: pj.isPnj,
                rolePnj: pj.rolePnj,
                persoTraits: pj.persoTraits,
              }}
              label="Portrait du personnage"
            />

            <div className="flex justify-end pt-2 border-t border-[#30251a]">
              <button
                type="button"
                onClick={() => setIsPortraitModalOpen(false)}
                className="px-5 py-2 bg-gradient-to-r from-[#d4a84a] to-[#ab8230] hover:brightness-110 text-black font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Terminer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discreet Signature */}
      <div className="text-right text-[10px] text-[#4d3d2e] font-mono tracking-wider pt-2 select-none">
        Doudou, F.P
      </div>
    </div>
  );
};
