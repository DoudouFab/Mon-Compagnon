import React, { useState } from 'react';
import {
  Swords,
  Users,
  Skull,
  Coins,
  BookOpen,
  Sparkles,
  Dices,
  RotateCcw,
  Plus,
  Trash2,
  FileDown,
  FileUp,
  Search,
  Filter,
  Check,
  ChevronDown,
  ChevronRight,
  Shield,
  Layers,
  ArrowUpDown,
  Zap,
  Info,
  ExternalLink,
  Download,
  Map,
  MapPin,
  Gift,
  ClipboardPaste,
  X,
} from 'lucide-react';
import {
  OSGILD_GEOGRAPHY_ASCII,
  OSGILD_REGIONS,
  OSGILD_FACTIONS_ASCII,
  OSGILD_ACADEMIES,
  OSGILD_DEITIES,
} from '../../data/osgildLore';
import { DetailModal, DetailItem } from '../DetailModal';
import { StateBadgeList } from '../common/StateBadgeList';
import { PnjCreatorModal } from './PnjCreatorModal';
import { CharacterSheetModal } from './CharacterSheetModal';
import { OsgildLoreMj } from './OsgildLoreMj';
import {
  BESTIAIRE,
  EQUIPEMENTS,
  ETATS,
  PROFILS,
  RACES,
  REGLES,
  SORTS_CATALOG,
  VOIES_CATALOG,
  getMod,
} from '../../data/coDatabase';
import {
  THARNEA_MONSTERS,
  THARNEA_ARTIFACTS,
  THARNEA_LORE_RULES,
} from '../../data/tharneaSupplement';
import {
  Character,
  Combatant,
  Equipment,
  Monster,
  PrejudicialState,
  ProfilData,
  RaceData,
  RuleChapter,
  SpellItem,
} from '../../types/chroniques';
import { realtimeTable } from '../../services/realtimeSync';

interface MjTableData {
  pjs: Character[];
  combatants: Combatant[];
  bestiaire: Monster[];
  equipements: Equipment[];
  regles: RuleChapter[];
  etats: PrejudicialState[];
  races: RaceData[];
  profils: ProfilData[];
  sorts: SpellItem[];
}

interface MjConsoleProps {
  tableData: MjTableData;
  onUpdateTableData: (updated: MjTableData) => void;
  currentActivePj: Character | null;
  onImportActivePj: () => void;
  isTharneaActive?: boolean;
}

export const MjConsole: React.FC<MjConsoleProps> = ({
  tableData,
  onUpdateTableData,
  currentActivePj,
  onImportActivePj,
  isTharneaActive = true,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'combat'
    | 'groupe'
    | 'bestiaire'
    | 'osgild'
    | 'tharnea'
    | 'loot'
    | 'equipements'
    | 'regles'
    | 'races'
    | 'profils'
    | 'voies'
    | 'grimoire'
  >('combat');

  const [isImportCodeModalOpen, setIsImportCodeModalOpen] = useState(false);
  const [transferCodeInput, setTransferCodeInput] = useState('');

  // Search & Filter states
  const [combatSearch, setCombatSearch] = useState('');
  const [combatFilter, setCombatFilter] = useState<'all' | 'pj' | 'monstre' | 'alive' | 'ko'>('all');

  const [pjSearch, setPjSearch] = useState('');
  const [pjProfFilter, setPjProfFilter] = useState('');
  const [pjRaceFilter, setPjRaceFilter] = useState('');

  const [bestSearch, setBestSearch] = useState('');
  const [bestNcFilter, setBestNcFilter] = useState('');
  const [bestFamFilter, setBestFamFilter] = useState('');
  const [bestSourceFilter, setBestSourceFilter] = useState<'all' | 'drs' | 'tharnea'>('all');

  // Tharnea Codex Tab states
  const [tharneaSubTab, setTharneaSubTab] = useState<'monstres' | 'artefacts' | 'bonbons' | 'lore'>('monstres');
  const [tharneaSearch, setTharneaSearch] = useState('');
  const [isPnjCreatorOpen, setIsPnjCreatorOpen] = useState(false);

  // Random Loot Table states
  const [lootSearch, setLootSearch] = useState('');
  const [lootCategoryFilter, setLootCategoryFilter] = useState<'all' | 'armes' | 'armures' | 'biens' | 'tharnea' | 'bonbons'>('all');
  const [rolledLoot, setRolledLoot] = useState<{ item: Equipment; rollNumber: number; date: string } | null>(null);
  const [lootHistory, setLootHistory] = useState<{ item: Equipment; rollNumber: number; date: string }[]>([]);
  const [targetPjForLoot, setTargetPjForLoot] = useState<string>('');

  const [eqSearch, setEqSearch] = useState('');
  const [eqCatFilter, setEqCatFilter] = useState('');
  const [eqSourceFilter, setEqSourceFilter] = useState<'all' | 'drs' | 'tharnea'>('all');

  const [regSearch, setRegSearch] = useState('');
  const [regCatFilter, setRegCatFilter] = useState('');

  const [raceSearch, setRaceSearch] = useState('');
  const [profSearch, setProfSearch] = useState('');
  const [voieSearch, setVoieSearch] = useState('');
  const [voiesProfilFilter, setVoiesProfilFilter] = useState<string>('all');
  const [grimSearch, setGrimSearch] = useState('');
  const [detailItem, setDetailItem] = useState<DetailItem | null>(null);
  const [selectedCharacterModal, setSelectedCharacterModal] = useState<Character | null>(null);

  // Add custom combatant state
  const [isAddCombatantOpen, setIsAddCombatantOpen] = useState(false);
  const [newCombatantName, setNewCombatantName] = useState('');
  const [newCombatantHp, setNewCombatantHp] = useState(15);
  const [newCombatantDef, setNewCombatantDef] = useState(12);
  const [newCombatantInit, setNewCombatantInit] = useState(10);
  const [newCombatantIsPj, setNewCombatantIsPj] = useState(false);
  const [newCombatantNotes, setNewCombatantNotes] = useState('');

  // Liaison Realtime pour écouter l'arrivée des PJ en direct
  React.useEffect(() => {
    realtimeTable.setCallbacks({
      onHeroesChanged: (heroesMap) => {
        const activeHeroes = Object.values(heroesMap) as Character[];
        if (activeHeroes.length > 0) {
          const existingPjs = [...tableData.pjs];
          let hasChanged = false;

          activeHeroes.forEach((h) => {
            const index = existingPjs.findIndex((p) => p.id === h.id || p.name === h.name);
            if (index >= 0) {
              if (JSON.stringify(existingPjs[index]) !== JSON.stringify(h)) {
                existingPjs[index] = h;
                hasChanged = true;
              }
            } else {
              existingPjs.push(h);
              hasChanged = true;
            }
          });

          if (hasChanged) {
            onUpdateTableData({ ...tableData, pjs: existingPjs });
          }
        }
      },
    });
  }, [tableData]);

  // Master Loot Items Catalog (Officiel DRS + Codex Tharnéa + Bonbons Alchimiques)
  const masterLootCatalog: (Equipment & { lootIndex: number; lootCategoryGroup: 'armes' | 'armures' | 'biens' | 'tharnea' | 'bonbons' })[] = React.useMemo(() => {
    const list: (Equipment & { lootIndex: number; lootCategoryGroup: 'armes' | 'armures' | 'biens' | 'tharnea' | 'bonbons' })[] = [];
    let idx = 1;

    // 1. Armes (DRS)
    EQUIPEMENTS.filter((e) => e.cat && e.cat.includes('Arme')).forEach((item) => {
      list.push({ ...item, lootIndex: idx++, lootCategoryGroup: 'armes' });
    });

    // 2. Armures & Protections (DRS)
    EQUIPEMENTS.filter((e) => e.cat && (e.cat.includes('Armure') || e.cat.includes('Bouclier'))).forEach((item) => {
      list.push({ ...item, lootIndex: idx++, lootCategoryGroup: 'armures' });
    });

    // 3. Matériel d'aventure & Biens (DRS)
    EQUIPEMENTS.filter((e) => !e.cat || (!e.cat.includes('Arme') && !e.cat.includes('Armure') && !e.cat.includes('Bouclier'))).forEach((item) => {
      list.push({ ...item, lootIndex: idx++, lootCategoryGroup: 'biens' });
    });

    // 4. Artéfacts de Tharnéa (Reliques hors bonbons)
    THARNEA_ARTIFACTS.filter((e) => !e.cat?.includes('Bonbon')).forEach((item) => {
      list.push({ ...item, lootIndex: idx++, lootCategoryGroup: 'tharnea' });
    });

    // 5. Bonbons Alchimiques & Boîte à Bonbons de Tharnéa
    THARNEA_ARTIFACTS.filter((e) => e.cat?.includes('Bonbon') || e.n.includes('Bonbon')).forEach((item) => {
      list.push({ ...item, lootIndex: idx++, lootCategoryGroup: 'bonbons' });
    });

    return list;
  }, []);

  const handleRollRandomLoot = () => {
    const pool = masterLootCatalog.filter((it) => {
      if (lootCategoryFilter !== 'all' && it.lootCategoryGroup !== lootCategoryFilter) return false;
      if (lootSearch && !(it.n + (it.desc || '') + (it.props || '')).toLowerCase().includes(lootSearch.toLowerCase())) return false;
      return true;
    });

    if (pool.length === 0) {
      alert('Aucun butin ne correspond aux critères de filtre.');
      return;
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    const selectedItem = pool[randomIndex];
    const rollEntry = {
      item: selectedItem,
      rollNumber: selectedItem.lootIndex,
      date: new Date().toLocaleTimeString(),
    };

    setRolledLoot(rollEntry);
    setLootHistory((prev) => [rollEntry, ...prev.slice(0, 8)]);
  };

  const handleGiveLootToPj = (item: Equipment, pjId?: string) => {
    const targetId = pjId || targetPjForLoot;
    if (!targetId) {
      alert('Veuillez sélectionner un personnage PJ dans la liste.');
      return;
    }

    const pjs = [...tableData.pjs];
    const targetIdx = pjs.findIndex((p) => (p.id || p.name) === targetId);
    if (targetIdx === -1) {
      alert('Personnage introuvable dans le groupe.');
      return;
    }

    const targetPj = pjs[targetIdx];
    const inv = [...(targetPj.inventaire || [])];
    const exist = inv.find((x) => x.n === item.n);
    if (exist) {
      exist.q = (exist.q || 1) + (item.q || 1);
    } else {
      inv.push({
        n: item.n,
        desc: item.desc || item.props || '',
        q: item.q || 1,
        isConsumable: !!item.isConsumable || !!item.effetSecondaire,
        note: item.source === 'tharnea' ? 'Codex Tharnéa' : item.cat || '',
      });
    }

    pjs[targetIdx] = { ...targetPj, inventaire: inv };
    onUpdateTableData({ ...tableData, pjs });
    alert(`🎁 "${item.n}" a été ajouté avec succès à l'inventaire de ${targetPj.name} !`);
  };

  // ==================== COMBAT ACTIONS ====================
  const rollOneInit = (index: number) => {
    const list = [...tableData.combatants];
    const c = list[index];
    const d20 = Math.floor(Math.random() * 20) + 1;
    c.lastRoll = d20;
    c.init = d20 + (c.baseInit || 10);
    onUpdateTableData({ ...tableData, combatants: list });
  };

  const rollAllInit = () => {
    const list = tableData.combatants.map((c) => {
      const d20 = Math.floor(Math.random() * 20) + 1;
      return {
        ...c,
        lastRoll: d20,
        init: d20 + (c.baseInit || 10),
      };
    });
    list.sort((a, b) => b.init - a.init);
    onUpdateTableData({ ...tableData, combatants: list });
  };

  const rollMonstersInit = () => {
    const list = tableData.combatants.map((c) => {
      if (!c.isPj) {
        const d20 = Math.floor(Math.random() * 20) + 1;
        return {
          ...c,
          lastRoll: d20,
          init: d20 + (c.baseInit || 10),
        };
      }
      return c;
    });
    list.sort((a, b) => b.init - a.init);
    onUpdateTableData({ ...tableData, combatants: list });
  };

  const sortCombatantsByInit = () => {
    const list = [...tableData.combatants].sort((a, b) => b.init - a.init);
    onUpdateTableData({ ...tableData, combatants: list });
  };

  const clearCombat = () => {
    if (confirm('Voulez-vous vider la piste de combat ?')) {
      onUpdateTableData({ ...tableData, combatants: [] });
    }
  };

  const alterCombatHp = (index: number, delta: number) => {
    const list = [...tableData.combatants];
    const c = list[index];
    c.hp = Math.max(0, Math.min(c.hpMax, c.hp + delta));
    onUpdateTableData({ ...tableData, combatants: list });
  };

  const setCombatHp = (index: number, val: number) => {
    const list = [...tableData.combatants];
    const c = list[index];
    c.hp = Math.max(0, Math.min(c.hpMax, val));
    onUpdateTableData({ ...tableData, combatants: list });
  };

  const removeCombatant = (index: number) => {
    const list = [...tableData.combatants];
    list.splice(index, 1);
    onUpdateTableData({ ...tableData, combatants: list });
  };

  const toggleCombatantState = (index: number, stateName: string) => {
    const list = [...tableData.combatants];
    const c = list[index];
    const current = c.etats || [];
    const exists = current.includes(stateName);
    const nextStates = exists ? current.filter((s) => s !== stateName) : [...current, stateName];
    c.etats = nextStates;

    let nextPjs = tableData.pjs;
    if (c.pjRefId || c.isPj) {
      nextPjs = tableData.pjs.map((p) => {
        if (p.id === (c.pjRefId || c.id) || p.name === c.n) {
          return { ...p, etats: nextStates };
        }
        return p;
      });
    }
    onUpdateTableData({ ...tableData, combatants: list, pjs: nextPjs });
  };

  const handleSavePnj = (pnjChar: Character | null, combatant: Combatant | null) => {
    const nextPjs = pnjChar ? [...tableData.pjs, pnjChar] : tableData.pjs;
    const nextCombatants = combatant ? [...tableData.combatants, combatant] : tableData.combatants;
    onUpdateTableData({ ...tableData, pjs: nextPjs, combatants: nextCombatants });
  };

  const handleAddCustomCombatant = () => {
    if (!newCombatantName.trim()) {
      alert('Veuillez spécifier un nom.');
      return;
    }
    const newC: Combatant = {
      id: 'c_' + Date.now(),
      n: newCombatantName.trim(),
      isPj: newCombatantIsPj,
      hp: newCombatantHp,
      hpMax: newCombatantHp,
      def: newCombatantDef,
      baseInit: newCombatantInit,
      init: newCombatantInit,
      notes: newCombatantNotes.trim(),
    };
    onUpdateTableData({
      ...tableData,
      combatants: [...tableData.combatants, newC],
    });
    setIsAddCombatantOpen(false);
    setNewCombatantName('');
    setNewCombatantNotes('');
  };

  const addMonsterToCombat = (m: Monster) => {
    const newC: Combatant = {
      id: 'm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      n: m.n,
      isPj: false,
      hp: m.pv,
      hpMax: m.pv,
      def: m.def,
      baseInit: m.init,
      init: m.init,
      notes: `${m.att} | ${m.traits}`,
    };
    onUpdateTableData({
      ...tableData,
      combatants: [...tableData.combatants, newC],
    });
    alert(`« ${m.n} » a été ajouté à la piste de combat !`);
  };

  const sendPjToCombat = (pj: Character) => {
    const existing = tableData.combatants.find((c) => c.pjRefId === pj.id || c.n === pj.name);
    if (existing) {
      if (!confirm(`"${pj.name}" est déjà dans le combat. Ajouter une autre occurrence ?`)) {
        return;
      }
    }
    const hpMax = pj.hpMaxManual || pj.hpMaxAuto || pj.hpBase || 10;
    const newC: Combatant = {
      id: 'pj_cmb_' + Date.now(),
      n: pj.name,
      isPj: true,
      hp: pj.hp,
      hpMax: hpMax,
      def: 10 + (getMod((pj.base.DEX || 10) + (pj.rb.DEX || 0))),
      baseInit: (pj.base.DEX || 10) + (pj.rb.DEX || 0),
      init: (pj.base.DEX || 10) + (pj.rb.DEX || 0),
      notes: `${pj.profil} Niv. ${pj.level} (${pj.race})`,
      pjRefId: pj.id,
    };
    onUpdateTableData({
      ...tableData,
      combatants: [...tableData.combatants, newC],
    });
    alert(`"${pj.name}" envoyé au combat !`);
  };

  const addAllPjToCombat = () => {
    if (!tableData.pjs.length) {
      alert("Aucun personnage n'est présent dans le groupe.");
      return;
    }
    const combatantsToAdd: Combatant[] = tableData.pjs.map((p) => {
      const hpMax = p.hpMaxManual || p.hpMaxAuto || p.hpBase || 10;
      return {
        id: 'pj_cmb_' + p.id + '_' + Date.now(),
        n: p.name,
        isPj: true,
        hp: p.hp,
        hpMax: hpMax,
        def: 10 + (getMod((p.base.DEX || 10) + (p.rb.DEX || 0))),
        baseInit: (p.base.DEX || 10) + (p.rb.DEX || 0),
        init: (p.base.DEX || 10) + (p.rb.DEX || 0),
        notes: `${p.profil} Niv. ${p.level} (${p.race})`,
        pjRefId: p.id,
      };
    });
    onUpdateTableData({
      ...tableData,
      combatants: [...tableData.combatants, ...combatantsToAdd],
    });
    setActiveTab('combat');
    alert(`${combatantsToAdd.length} personnages envoyés au combat !`);
  };

  const handleSaveMaster = () => {
    const a = document.createElement('a');
    a.href =
      'data:application/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(tableData, null, 2));
    a.download = 'Campagne_CO_Master.json';
    a.click();
  };

  const handleLoadMaster = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (typeof parsed === 'object') {
          onUpdateTableData({
            ...tableData,
            ...parsed,
          });
          alert('Campagne Master restaurée avec succès !');
        }
      } catch (err: any) {
        alert('Erreur lors du chargement : ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleImportPjFiles = (files: FileList | null) => {
    if (!files || !files.length) return;
    const pjs = [...tableData.pjs];
    let count = 0;
    const fileList = Array.from(files);
    let pending = fileList.length;

    fileList.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (data.name && data.base) {
            const idx = pjs.findIndex((p) => p.name.toLowerCase() === data.name.toLowerCase());
            if (idx >= 0) pjs[idx] = data;
            else pjs.push(data);
            count++;
          }
        } catch (e) {
          console.error(e);
        }
        pending--;
        if (pending === 0) {
          onUpdateTableData({ ...tableData, pjs });
          alert(`${count} fiches de PJ importées avec succès !`);
        }
      };
      reader.readAsText(f);
    });
  };

  const handleDownloadOfflineMjHtml = async () => {
    try {
      const res = await fetch('/assets/aistudio/ai_studio_code_a33982d1.html');
      const htmlText = await res.text();
      const fullExportPayload = {
        pjs: tableData.pjs || [],
        combatants: tableData.combatants || [],
        bestiaire: isTharneaActive ? [...BESTIAIRE, ...THARNEA_MONSTERS] : BESTIAIRE,
        equipements: isTharneaActive ? [...EQUIPEMENTS, ...THARNEA_ARTIFACTS] : EQUIPEMENTS,
        regles: REGLES,
        etats: ETATS,
        races: RACES,
        profils: PROFILS,
        voies: Object.values(VOIES_CATALOG),
        sorts: SORTS_CATALOG,
      };

      let injectedHtml = htmlText.replace(
        /let tableData = LS\.get\("co_mj_table",\s*\{[\s\S]*?\}\);/,
        `let tableData = ${JSON.stringify(fullExportPayload)};`
      );
      if (injectedHtml === htmlText) {
        injectedHtml = htmlText.replace(
          'let tableData = LS.get("co_mj_table", {',
          `let tableData = ${JSON.stringify(fullExportPayload)}; // pre-injected\nlet _dummy = ({`
        );
      }

      const blob = new Blob([injectedHtml], { type: 'text/html;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `Console_MJ_Chroniques_Oubliees_Complete_Offline.html`;
      a.click();
      alert(
        'Application HTML Meneur de Jeu autonome téléchargée ! Elle est désormais 100% pré-remplie avec le Bestiaire, tous les Équipements, les Règles, les États, les Profils, les Voies et l\'Extension Tharnéa. Double-cliquez simplement dessus pour jouer hors-ligne !'
      );
    } catch (err: any) {
      alert("Erreur lors du téléchargement : " + err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* MJ Console Sub-Header & Controls */}
      <div className="bg-gradient-to-r from-[#2e1313] via-[#1c1410] to-[#120f0d] border border-[#9c2a2b]/70 rounded-xl p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif-co text-2xl font-bold text-[#ffb8b8]">
                Console du Meneur de Jeu (MJ)
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#4d1f1c] text-[#ff9d9d] border border-[#cf5544]/50">
                Hub de Table &amp; DRS
              </span>
            </div>
            <p className="text-xs text-[#9e907d] mt-1">
              Gestion de combat, initiatives d20, bestiaire complet (53 monstres), groupe d'aventuriers, règles officielles et équipement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadOfflineMjHtml}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#8b2628] to-[#691c1d] hover:brightness-110 text-xs font-bold text-white flex items-center gap-1.5 shadow-md"
              title="Télécharger l'application HTML autonome du MJ pour jouer hors-ligne"
            >
              <Download className="w-3.5 h-3.5" /> MJ Offline (.html)
            </button>
            <button
              onClick={handleSaveMaster}
              className="px-3 py-1.5 rounded-lg bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] hover:border-[#d4a84a] text-xs font-semibold text-[#f3d48d] flex items-center gap-1.5 shadow-xs"
            >
              <FileDown className="w-3.5 h-3.5 text-[#d4a84a]" /> Sauvegarder (JSON)
            </button>
            <label className="px-3 py-1.5 rounded-lg bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] hover:border-[#d4a84a] text-xs font-semibold text-[#ede3d1] flex items-center gap-1.5 cursor-pointer shadow-xs">
              <FileUp className="w-3.5 h-3.5 text-[#d4a84a]" /> Charger Campagne
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleLoadMaster}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs for MJ */}
      <div className="flex items-center gap-1 bg-[#181410] p-1.5 rounded-xl border border-[#3d3023] overflow-x-auto">
        {[
          { key: 'combat', label: 'Combat & Init', icon: Swords, badge: tableData.combatants.length },
          { key: 'groupe', label: 'Groupe & PNJ', icon: Users, badge: tableData.pjs.length },
          { key: 'bestiaire', label: 'Bestiaire DRS', icon: Skull, badge: BESTIAIRE.length },
          { key: 'osgild', label: "Terres d'Osgild 🗺️", icon: Map, badge: 4 },
          ...(isTharneaActive
            ? [
                {
                  key: 'tharnea',
                  label: '🔮 Codex Tharnéa',
                  icon: Sparkles,
                  badge: THARNEA_MONSTERS.length + THARNEA_ARTIFACTS.length,
                  highlight: true,
                },
              ]
            : []),
          { key: 'loot', label: 'Table de Butin 🎲', icon: Dices, badge: masterLootCatalog.length },
          { key: 'equipements', label: 'Équipements', icon: Coins, badge: EQUIPEMENTS.length },
          { key: 'regles', label: 'Règles & États', icon: BookOpen, badge: REGLES.length + ETATS.length },
          { key: 'races', label: 'Races', icon: Shield, badge: RACES.length },
          { key: 'profils', label: 'Profils', icon: Layers, badge: PROFILS.length },
          { key: 'voies', label: 'Voies & Rangs', icon: Sparkles, badge: Object.keys(VOIES_CATALOG).length },
          { key: 'grimoire', label: 'Grimoire DRS', icon: Zap, badge: SORTS_CATALOG.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          const isTharneaTab = tab.key === 'tharnea';

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? isTharneaTab
                    ? 'bg-gradient-to-r from-[#692994] to-[#4c1670] text-[#f7e6ff] border border-[#a855f7] shadow-md'
                    : 'bg-gradient-to-r from-[#9c2a2b] to-[#751c1d] text-white shadow-sm'
                  : isTharneaTab
                  ? 'text-[#cbafff] bg-[#22152f]/60 hover:bg-[#2b193d] border border-[#6b21a8]/50'
                  : 'text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#231c15]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isTharneaTab && !isActive ? 'text-[#c084fc]' : ''}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? 'bg-black/40 text-[#f3d48d]'
                      : isTharneaTab
                      ? 'bg-[#3b1754] text-[#e9d5ff]'
                      : 'bg-[#231c15] text-[#9e907d]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Bouton Grimoire JdR Externe (doudoufab) */}
        <a
          href="https://doudoufab.github.io/grimoire-jdr-ok-/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold shrink-0 bg-gradient-to-r from-[#2c1d12] to-[#1e130a] hover:from-[#3a2718] hover:to-[#2a1b0e] border border-[#d4a84a]/70 hover:border-[#f3d48d] text-[#f3d48d] hover:text-white transition-all shadow-xs ml-auto"
          title="Ouvrir le Grimoire interactif des Sorts (doudoufab) dans un nouvel onglet"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#d4a84a]" />
          <span>📖 Grimoire JdR</span>
          <ExternalLink className="w-3 h-3 text-[#a0907d]" />
        </a>
      </div>

      {/* ==================== 1. COMBAT & INITIATIVE ==================== */}
      {activeTab === 'combat' && (
        <div className="space-y-4">
          <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">
                  Piste de Combat &amp; Ordre d'Initiative
                </h3>
                <span className="text-xs text-[#9e907d]">
                  Total engagés : <b className="text-[#ede3d1]">{tableData.combatants.length}</b>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={rollAllInit}
                  className="px-3 py-1.5 bg-[#d4a84a] hover:bg-[#e0b555] text-black text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs"
                >
                  <Dices className="w-3.5 h-3.5" /> Lancer TOUT (d20+Base)
                </button>
                <button
                  onClick={rollMonstersInit}
                  className="px-3 py-1.5 bg-[#3a2954] hover:bg-[#4d3670] border border-[#654a93] text-[#dccbff] text-xs font-bold rounded-lg flex items-center gap-1.5"
                >
                  <Dices className="w-3.5 h-3.5" /> Lancer Monstres
                </button>
                <button
                  onClick={sortCombatantsByInit}
                  className="px-3 py-1.5 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-xs font-semibold text-[#ede3d1] rounded-lg flex items-center gap-1.5"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" /> Trier par Init
                </button>
                <button
                  onClick={() => setIsAddCombatantOpen(true)}
                  className="px-3 py-1.5 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-xs font-semibold text-[#f3d48d] rounded-lg flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Combattant
                </button>
                <button
                  onClick={clearCombat}
                  className="px-3 py-1.5 bg-[#381616] hover:bg-[#4d1f1f] border border-[#6d2525] text-[#ff9d9d] text-xs font-semibold rounded-lg flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Vider
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#30251a]">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-[#9e907d] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filtrer par nom ou notes..."
                  value={combatSearch}
                  onChange={(e) => setCombatSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
                />
              </div>

              <select
                value={combatFilter}
                onChange={(e) => setCombatFilter(e.target.value as any)}
                className="px-3 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
              >
                <option value="all">Tous les combattants</option>
                <option value="pj">PJ uniquement</option>
                <option value="monstre">Monstres uniquement</option>
                <option value="alive">En vie (&gt; 0 PV)</option>
                <option value="ko">Inconscients / Morts (0 PV)</option>
              </select>

              {(combatSearch || combatFilter !== 'all') && (
                <button
                  onClick={() => {
                    setCombatSearch('');
                    setCombatFilter('all');
                  }}
                  className="px-2.5 py-1 text-xs text-[#9e907d] hover:text-[#ede3d1]"
                >
                  Effacer
                </button>
              )}
            </div>
          </div>

          {/* Combatants List */}
          <div className="space-y-2.5">
            {tableData.combatants
              .filter((c) => {
                const matchQ = (c.n + (c.notes || '')).toLowerCase().includes(combatSearch.toLowerCase());
                let matchF = true;
                if (combatFilter === 'pj') matchF = !!c.isPj;
                else if (combatFilter === 'monstre') matchF = !c.isPj;
                else if (combatFilter === 'alive') matchF = c.hp > 0;
                else if (combatFilter === 'ko') matchF = c.hp <= 0;
                return matchQ && matchF;
              })
              .map((c, idx) => {
                const globalIdx = tableData.combatants.indexOf(c);
                const pct = Math.max(0, Math.min(100, Math.round((100 * c.hp) / Math.max(1, c.hpMax))));
                const barCol = pct > 50 ? '#6fa85b' : pct > 25 ? '#c97d32' : '#cf5544';

                return (
                  <div
                    key={c.id || idx}
                    className={`p-3.5 bg-[#181410] border-l-4 rounded-xl border border-[#3d3023] space-y-2.5 shadow-sm ${
                      c.isPj ? 'border-l-[#d4a84a]' : 'border-l-[#9c2a2b]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                            c.isPj
                              ? 'bg-[#3b2a1a] text-[#f3d48d] border border-[#d4a84a]/40'
                              : 'bg-[#381616] text-[#ff9d9d] border border-[#6d2525]'
                          }`}
                        >
                          {c.isPj ? 'PJ' : 'Monstre'}
                        </span>
                        <b className="font-serif-co text-base text-[#ede3d1]">{c.n}</b>

                        {/* DÉFENSE / CA */}
                        <div
                          className="flex items-center gap-1.5 bg-[#121c2a] px-2.5 py-1 rounded-lg border border-[#2b4c6f]"
                          title="Classe d'Armure / Défense (10 + DEX + Armure + Bouclier)"
                        >
                          <Shield className="w-3.5 h-3.5 text-[#7db5ff]" />
                          <span className="text-[11px] font-bold text-[#9ec4ff] uppercase">DEF :</span>
                          <input
                            type="number"
                            value={c.def}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              const list = [...tableData.combatants];
                              list[globalIdx].def = val;
                              onUpdateTableData({ ...tableData, combatants: list });
                            }}
                            className="w-12 bg-transparent text-xs font-bold text-white text-center outline-none border-b border-[#2b4c6f]"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#9e907d]">Initiative :</span>
                        <span className="font-mono text-sm font-bold text-[#f3d48d] bg-[#231c15] px-2 py-0.5 rounded border border-[#3d3023]">
                          {c.init} {c.lastRoll !== undefined && `(d20: ${c.lastRoll})`}
                        </span>
                        <button
                          onClick={() => rollOneInit(globalIdx)}
                          className="px-2.5 py-1 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-xs text-[#ede3d1] rounded-lg flex items-center gap-1"
                        >
                          <Dices className="w-3 h-3 text-[#d4a84a]" /> Lancer
                        </button>
                        <button
                          onClick={() => removeCombatant(globalIdx)}
                          className="p-1 hover:bg-[#381616] text-[#9e907d] hover:text-[#ff9d9d] rounded-lg transition-colors"
                          title="Retirer du combat"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* HP Bar & Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#30251a]">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#9e907d]">PV :</span>
                          <input
                            type="number"
                            value={c.hp}
                            onChange={(e) => setCombatHp(globalIdx, parseInt(e.target.value) || 0)}
                            className="w-14 bg-[#231c15] border border-[#3d3023] rounded px-1.5 py-0.5 text-xs text-center font-bold text-[#ede3d1] outline-none"
                          />
                          <span className="text-xs text-[#9e907d]">/ {c.hpMax}</span>
                        </div>

                        {/* Visual Progress Bar */}
                        <div className="flex-1 bg-[#231c15] h-2.5 rounded-full overflow-hidden border border-[#3d3023] max-w-[200px]">
                          <div
                            className="h-full transition-all duration-300"
                            style={{ width: `${pct}%`, backgroundColor: barCol }}
                          />
                        </div>

                        {/* Quick HP Alterations */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => alterCombatHp(globalIdx, -5)}
                            className="px-1.5 py-0.5 bg-[#381616] hover:bg-[#4d1f1f] text-[#ff9d9d] text-xs font-bold rounded"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => alterCombatHp(globalIdx, -1)}
                            className="px-1.5 py-0.5 bg-[#381616] hover:bg-[#4d1f1f] text-[#ff9d9d] text-xs font-bold rounded"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => alterCombatHp(globalIdx, 1)}
                            className="px-1.5 py-0.5 bg-[#1b381b] hover:bg-[#254d25] text-[#9eff9e] text-xs font-bold rounded"
                          >
                            +1
                          </button>
                          <button
                            onClick={() => alterCombatHp(globalIdx, 5)}
                            className="px-1.5 py-0.5 bg-[#1b381b] hover:bg-[#254d25] text-[#9eff9e] text-xs font-bold rounded"
                          >
                            +5
                          </button>
                        </div>
                      </div>

                      {/* Notes / Attacks info */}
                      {c.notes && (
                        <div className="text-xs text-[#9e907d] italic max-w-xs truncate" title={c.notes}>
                          {c.notes}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

            {tableData.combatants.length === 0 && (
              <div className="text-center py-8 text-[#9e907d] text-xs bg-[#181410] border border-[#3d3023] rounded-xl">
                Aucun combattant actif dans la piste de combat. Ajoutez des monstres depuis le Bestiaire ou des PJ depuis l'onglet Groupe.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== 2. GROUPE & PNJ ==================== */}
      {activeTab === 'groupe' && (
        <div className="space-y-4">
          <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">
                  Gestion du Groupe de Personnages (PJ &amp; PNJ)
                </h3>
                <span className="text-xs text-[#9e907d]">
                  Membres enregistrés : <b className="text-[#ede3d1]">{tableData.pjs.length}</b>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={addAllPjToCombat}
                  className="px-3 py-1.5 bg-[#d4a84a] hover:bg-[#e0b555] text-black text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs"
                >
                  <Swords className="w-3.5 h-3.5" /> Envoyer TOUT au combat
                </button>
                <button
                  onClick={() => setIsPnjCreatorOpen(true)}
                  className="px-3 py-1.5 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-xs font-semibold text-[#f3d48d] rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Créer PJ / PNJ
                </button>
                <label className="px-3 py-1.5 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-xs font-semibold text-[#ede3d1] rounded-lg flex items-center gap-1.5 cursor-pointer">
                  <FileUp className="w-3.5 h-3.5 text-[#d4a84a]" /> Importer Fiches (.json)
                  <input
                    type="file"
                    accept=".json"
                    multiple
                    className="hidden"
                    onChange={(e) => handleImportPjFiles(e.target.files)}
                  />
                </label>
              </div>
            </div>

            {/* Filter bar for group */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#30251a]">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-[#9e907d] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filtrer par nom..."
                  value={pjSearch}
                  onChange={(e) => setPjSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tableData.pjs
              .filter((pj) => !pjSearch || pj.name.toLowerCase().includes(pjSearch.toLowerCase()))
              .map((pj, idx) => {
                const hpMax = pj.hpMaxManual || pj.hpMaxAuto || pj.hpBase || 10;
                return (
                  <div key={pj.id || idx} className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-serif-co text-base font-bold text-[#f3d48d]">{pj.name}</h4>
                        <span className="text-xs text-[#9e907d]">
                          {pj.profil} Niv. {pj.level} • {pj.race}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => sendPjToCombat(pj)}
                          className="px-2.5 py-1 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-xs text-[#f3d48d] rounded-lg flex items-center gap-1"
                        >
                          <Swords className="w-3 h-3" /> Combat
                        </button>
                        <button
                          onClick={() => setSelectedCharacterModal(pj)}
                          className="px-2.5 py-1 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-xs text-[#ede3d1] rounded-lg"
                        >
                          Fiche
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#9e907d] pt-2 border-t border-[#30251a]">
                      <span>PV : <b className="text-[#ede3d1]">{pj.hp} / {hpMax}</b></span>
                      <span>DEF : <b className="text-[#ede3d1]">{10 + getMod((pj.base.DEX || 10) + (pj.rb.DEX || 0))}</b></span>
                    </div>
                  </div>
                );
              })}
          </div>

          {tableData.pjs.length === 0 && (
            <div className="text-center py-8 text-[#9e907d] text-xs bg-[#181410] border border-[#3d3023] rounded-xl">
              Aucun personnage dans le groupe pour l'instant. Utilisez le bouton "Créer PJ / PNJ" ou demandez à vos joueurs de se connecter via la table en direct.
            </div>
          )}
        </div>
      )}

      {/* ==================== 3. BESTIAIRE DRS ==================== */}
      {activeTab === 'bestiaire' && (
        <div className="space-y-4">
          <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-3">
            <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">Bestiaire Officiel DRS (53 Monstres)</h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#9e907d] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Rechercher un monstre..."
                value={bestSearch}
                onChange={(e) => setBestSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {BESTIAIRE
              .filter((m) => !bestSearch || (m.n + (m.traits || '')).toLowerCase().includes(bestSearch.toLowerCase()))
              .map((m, idx) => (
                <div key={idx} className="bg-[#181410] border border-[#3d3023] rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif-co font-bold text-sm text-[#ede3d1]">{m.n}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#381616] text-[#ff9d9d] border border-[#6d2525]">
                        NC {m.nc}
                      </span>
                    </div>
                    <p className="text-xs text-[#9e907d] mt-1">PV: {m.pv} • DEF: {m.def} • Init: {m.init}</p>
                    <p className="text-xs text-[#ede3d1] mt-2 line-clamp-2">{m.traits || m.att}</p>
                  </div>
                  <button
                    onClick={() => addMonsterToCombat(m)}
                    className="w-full mt-2 py-1.5 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-xs font-semibold text-[#f3d48d] rounded-lg flex items-center justify-center gap-1.5"
                  >
                    <Swords className="w-3.5 h-3.5" /> Ajouter au combat
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ==================== 4. TERRES D'OSGILD ==================== */}
      {activeTab === 'osgild' && (
        <OsgildLoreMj />
      )}

      {/* ==================== 5. CODEX THARNEA ==================== */}
      {activeTab === 'tharnea' && isTharneaActive && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-[#22152f] to-[#160d21] border border-[#6b21a8]/60 rounded-xl p-4 space-y-2">
            <h3 className="font-serif-co text-lg font-bold text-[#f7e6ff]">Codex Tharnéa (Extension)</h3>
            <p className="text-xs text-[#d8b4fe]">Monstres exclusifs, artéfacts magiques et règles optionnelles de l'univers de Tharnéa.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {THARNEA_MONSTERS.map((m, idx) => (
              <div key={idx} className="bg-[#181410] border border-[#6b21a8]/40 rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif-co font-bold text-sm text-[#f7e6ff]">{m.n}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#3b1754] text-[#e9d5ff]">
                      NC {m.nc}
                    </span>
                  </div>
                  <p className="text-xs text-[#a855f7] mt-1">PV: {m.pv} • DEF: {m.def} • Init: {m.init}</p>
                </div>
                <button
                  onClick={() => addMonsterToCombat(m)}
                  className="w-full mt-2 py-1.5 bg-[#2a1b3d] hover:bg-[#382452] border border-[#6b21a8]/50 text-xs font-semibold text-[#f7e6ff] rounded-lg flex items-center justify-center gap-1.5"
                >
                  <Swords className="w-3.5 h-3.5 text-[#c084fc]" /> Ajouter au combat
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== 6. TABLE DE BUTIN ==================== */}
      {activeTab === 'loot' && (
        <div className="space-y-4">
          <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-3">
            <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">Table de Butin Aléatoire 🎲</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRollRandomLoot}
                className="px-4 py-2 bg-[#d4a84a] hover:bg-[#e0b555] text-black text-xs font-bold rounded-lg flex items-center gap-2 shadow-sm"
              >
                <Dices className="w-4 h-4" /> Tirer un Butin Aléatoire
              </button>
            </div>
          </div>

          {rolledLoot && (
            <div className="bg-[#231c15] border border-[#d4a84a]/50 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#d4a84a] font-bold uppercase">Résultat du tirage</span>
                <span className="text-xs text-[#9e907d]">{rolledLoot.date}</span>
              </div>
              <h4 className="font-serif-co text-base font-bold text-[#f3d48d]">{rolledLoot.item.n}</h4>
              <p className="text-xs text-[#ede3d1]">{rolledLoot.item.desc || rolledLoot.item.props || 'Aucune description'}</p>
              
              {tableData.pjs.length > 0 && (
                <div className="flex items-center gap-2 pt-2 border-t border-[#3d3023]">
                  <select
                    value={targetPjForLoot}
                    onChange={(e) => setTargetPjForLoot(e.target.value)}
                    className="px-3 py-1.5 bg-[#181410] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
                  >
                    <option value="">Sélectionner un PJ destinataire...</option>
                    {tableData.pjs.map((p, i) => (
                      <option key={p.id || i} value={p.id || p.name}>{p.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleGiveLootToPj(rolledLoot.item)}
                    className="px-3 py-1.5 bg-[#9c2a2b] hover:bg-[#b83233] text-white text-xs font-bold rounded-lg"
                  >
                    Donner au PJ
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ==================== 7. ÉQUIPEMENTS ==================== */}
      {activeTab === 'equipements' && (
        <div className="space-y-4">
          <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-3">
            <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">Catalogue des Équipements</h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#9e907d] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Rechercher un équipement..."
                value={eqSearch}
                onChange={(e) => setEqSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            {EQUIPEMENTS
              .filter((eq) => !eqSearch || (eq.n + (eq.cat || '')).toLowerCase().includes(eqSearch.toLowerCase()))
              .map((eq, i) => (
                <div key={i} className="p-3 bg-[#181410] border border-[#3d3023] rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <b className="text-[#ede3d1]">{eq.n}</b>
                    <span className="text-[#9e907d] ml-2">({eq.cat})</span>
                  </div>
                  <span className="text-[#d4a84a] font-mono">{eq.pc ? `${eq.pc} pc` : 'Standard'}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ==================== 8. RÈGLES & ÉTATS ==================== */}
      {activeTab === 'regles' && (
        <div className="space-y-4">
          <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-3">
            <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">Règles Officielles &amp; États Préjudiciables</h3>
          </div>
          <div className="space-y-3">
            {ETATS.map((et, i) => (
              <div key={i} className="p-3 bg-[#181410] border border-[#3d3023] rounded-xl space-y-1">
                <b className="text-[#f3d48d] text-sm">{et.n}</b>
                <p className="text-xs text-[#ede3d1]">{et.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== 9. RACES ==================== */}
      {activeTab === 'races' && (
        <div className="space-y-4">
          <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-3">
            <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">Races Jouables</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {RACES.map((r, i) => (
              <div key={i} className="p-3 bg-[#181410] border border-[#3d3023] rounded-xl space-y-1">
                <b className="text-[#ede3d1]">{r.n}</b>
                <p className="text-xs text-[#9e907d]">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== 10. PROFILS ==================== */}
      {activeTab === 'profils' && (
        <div className="space-y-4">
          <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-3">
            <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">Profils de Personnages</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PROFILS.map((p, i) => (
              <div key={i} className="p-3 bg-[#181410] border border-[#3d3023] rounded-xl space-y-1">
                <b className="text-[#ede3d1]">{p.n}</b>
                <p className="text-xs text-[#9e907d]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== 11. VOIES & RANGS ==================== */}
      {activeTab === 'voies' && (
        <div className="space-y-4">
          <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-3">
            <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">Voies &amp; Capacités</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(VOIES_CATALOG).map(([key, voie]: [string, any], idx) => (
              <div key={idx} className="p-3 bg-[#181410] border border-[#3d3023] rounded-xl space-y-1">
                <b className="text-[#f3d48d] text-sm">{voie.n || key}</b>
                <p className="text-xs text-[#9e907d]">{voie.desc || 'Voie de profil'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== 12. GRIMOIRE DRS ==================== */}
      {activeTab === 'grimoire' && (
        <div className="space-y-4">
          <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-3">
            <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">Grimoire DRS (Sorts)</h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#9e907d] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Rechercher un sort..."
                value={grimSearch}
                onChange={(e) => setGrimSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {SORTS_CATALOG
              .filter((s) => !grimSearch || (s.n + (s.portee || '')).toLowerCase().includes(grimSearch.toLowerCase()))
              .map((s, i) => (
                <div key={i} className="p-2.5 bg-[#181410] border border-[#3d3023] rounded-xl text-xs space-y-0.5">
                  <b className="text-[#f3d48d]">{s.n}</b>
                  <p className="text-[#9e907d]">{s.portee} • {s.duree}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Modales annexes */}
      {isPnjCreatorOpen && (
        <PnjCreatorModal
          onClose={() => setIsPnjCreatorOpen(false)}
          onSave={handleSavePnj}
        />
      )}

      {selectedCharacterModal && (
        <CharacterSheetModal
          character={selectedCharacterModal}
          onClose={() => setSelectedCharacterModal(null)}
          onUpdate={(updated) => {
            const nextPjs = tableData.pjs.map((p) => p.id === updated.id ? updated : p);
            onUpdateTableData({ ...tableData, pjs: nextPjs });
            setSelectedCharacterModal(null);
          }}
        />
      )}
    </div>
  );
};
