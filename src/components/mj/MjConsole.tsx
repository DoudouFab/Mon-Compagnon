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

  // ==================== SYNCHRO TEMPS RÉEL FIREBASE (PJ) ====================
  // Références toujours à jour : l'écouteur est monté une seule fois et doit lire l'état courant.
  const tableDataRef = React.useRef<MjTableData>(tableData);
  const onUpdateTableDataRef = React.useRef(onUpdateTableData);
  tableDataRef.current = tableData;
  onUpdateTableDataRef.current = onUpdateTableData;

  // Joueurs actuellement en ligne (dernier instantané reçu) + compteur de diagnostic
  const [onlineHeroes, setOnlineHeroes] = useState<Character[]>([]);
  const [rtStats, setRtStats] = useState<{ events: number; last: string }>({ events: 0, last: '' });
  // Ajout automatique des nouveaux joueurs à la table (activé par défaut, mémorisé)
  const [autoAddPlayers, setAutoAddPlayers] = useState<boolean>(() => {
    try {
      return localStorage.getItem('co_mj_auto_add_players') !== '0';
    } catch {
      return true;
    }
  });
  const autoAddRef = React.useRef(autoAddPlayers);
  autoAddRef.current = autoAddPlayers;

  React.useEffect(() => {
    let disposed = false;
    realtimeTable.setCallbacks({
      onHeroesChanged: (heroesMap: any) => {
        console.info('[MJ] onHeroesChanged reçu', heroesMap);
        if (disposed) return;
        const hm: any = heroesMap;
        const values: any[] = !hm
          ? []
          : hm instanceof globalThis.Map
          ? Array.from((hm as Map<any, any>).values())
          : Array.isArray(hm)
          ? hm
          : Object.values(hm);
        const incoming = values.filter((h) => h && typeof h === 'object' && h.name) as Character[];
        setRtStats((s) => ({ events: s.events + 1, last: new Date().toLocaleTimeString('fr-FR') }));
        setOnlineHeroes(incoming);
        if (!incoming.length) return;

        const current = tableDataRef.current;
        const pjs = [...current.pjs];
        let changed = false;

        incoming.forEach((hero) => {
          const idx = pjs.findIndex(
            (p) =>
              (!!hero.id && p.id === hero.id) ||
              (p.name || '').toLowerCase() === hero.name.toLowerCase()
          );
          // Nouveau joueur : ajouté d'office si l'option est active, sinon proposé dans « Joueurs en ligne ».
          if (idx === -1) {
            if (autoAddRef.current) {
              pjs.push(hero);
              changed = true;
            }
            return;
          }
          // Fusion : la fiche distante complète/met à jour la locale, les champs propres au MJ sont conservés.
          const merged = { ...pjs[idx], ...hero };
          // Identique à la version locale : on n'écrase rien et on ne déclenche aucune mise à jour.
          if (JSON.stringify(merged) !== JSON.stringify(pjs[idx])) {
            pjs[idx] = merged;
            changed = true;
          }
        });

        if (!changed) return;
        const next: MjTableData = { ...current, pjs };
        tableDataRef.current = next; // évite de perdre une mise à jour si deux événements arrivent avant le rendu
        onUpdateTableDataRef.current(next);
      },
    });
    console.info('[MJ] écouteur onHeroesChanged enregistré');
    return () => {
      disposed = true;
    };
  }, []);

  const isHeroInTable = (h: Character) =>
    tableData.pjs.some(
      (p) => (!!h.id && p.id === h.id) || (p.name || '').toLowerCase() === (h.name || '').toLowerCase()
    );

  const addOnlineHeroes = (heroes: Character[]) => {
    const toAdd = heroes.filter((h) => !isHeroInTable(h));
    if (!toAdd.length) return;
    onUpdateTableData({ ...tableData, pjs: [...tableData.pjs, ...toAdd] });
  };

  // Diagnostic technique du service temps réel (hors clés/jetons) pour comprendre pourquoi rien n'arrive
  const rtDiag = (() => {
    try {
      const o: any = realtimeTable;
      const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(o) || {}).filter((k) => k !== 'constructor');
      const fields: Record<string, any> = {};
      Object.keys(o).forEach((k) => {
        if (/key|token|secret|password/i.test(k)) return;
        const v = o[k];
        fields[k] =
          typeof v === 'function'
            ? 'fonction'
            : Array.isArray(v)
            ? `tableau(${v.length})`
            : v instanceof globalThis.Map
            ? `Map(${(v as Map<any, any>).size})`
            : v && typeof v === 'object'
            ? 'objet'
            : v;
      });
      return JSON.stringify({ methods, fields }, null, 2);
    } catch (e: any) {
      return 'Diagnostic indisponible : ' + e.message;
    }
  })();

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

    // S'il est lié à un PJ du groupe, synchroniser également le groupe
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

  // Add monster to combat
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

  // Send PJ to combat
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

  // Master Save & Load
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

  // Import multi PJ files
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

  // Download Offline Standalone MJ HTML App (100% pre-chargé avec toutes les données)
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

      // Remplacement propre du bloc d'initialisation de tableData pour qu'il contienne l'intégralité des données préchargées
      let injectedHtml = htmlText.replace(
        /let tableData = LS\.get\("co_mj_table",\s*\{[\s\S]*?\}\);/,
        `let tableData = ${JSON.stringify(fullExportPayload)};`
      );
      if (injectedHtml === htmlText) {
        // Fallback replacement si la regex n'a pas matché
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

                        {/* DÉFENSE / CA (Très mise en évidence) */}
                        <div
                          className="flex items-center gap-1.5 bg-[#121c2a] px-2.5 py-1 rounded-lg border border-[#2b4c6f]"
                          title="Classe d'Armure / Défense (10 + DEX + Armure + Bouclier). Modifiable directement."
                        >
                          <Shield className="w-3.5 h-3.5 text-[#7db5ff]" />
                          <span className="text-[11px] font-bold text-[#9ec4ff] uppercase">DEF / CA :</span>
                          <input
                            type="number"
                            value={c.def}
                            onChange={(e) => {
                              const list = [...tableData.combatants];
                              list[globalIdx].def = parseInt(e.target.value) || 10;
                              onUpdateTableData({ ...tableData, combatants: list });
                            }}
                            className="w-10 text-center font-bold text-sm text-[#ffffff] bg-[#0c131c] rounded border border-[#2b4c6f]/60 py-0.5 outline-none"
                          />
                        </div>
                      </div>

                      {/* Initiative input & roll */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <div className="flex items-center gap-1.5 bg-[#120f0c] px-2.5 py-1 rounded-lg border border-[#3d3023]">
                          <span className="text-[11px] text-[#9e907d] font-bold uppercase">Init :</span>
                          <input
                            type="number"
                            value={c.init}
                            onChange={(e) => {
                              const list = [...tableData.combatants];
                              list[globalIdx].init = parseInt(e.target.value) || 0;
                              onUpdateTableData({ ...tableData, combatants: list });
                            }}
                            className="w-12 text-center font-bold text-base text-[#f3d48d] bg-transparent outline-none"
                          />
                        </div>
                        <button
                          onClick={() => rollOneInit(globalIdx)}
                          className="px-2.5 py-1 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] hover:border-[#d4a84a] text-xs font-semibold rounded text-[#ede3d1] flex items-center gap-1"
                        >
                          <Dices className="w-3.5 h-3.5 text-[#d4a84a]" /> Jet
                        </button>
                        {c.lastRoll !== undefined && (
                          <span className="text-[10px] text-[#9e907d] font-mono">
                            (d20: {c.lastRoll})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ÉTATS PRÉJUDICIABLES DU COMBATTANT */}
                    <div className="flex items-center gap-2 flex-wrap bg-[#14100c] px-2.5 py-1.5 rounded-lg border border-[#2d2218]">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#9e907d] shrink-0">
                        États :
                      </span>
                      <StateBadgeList
                        activeStates={c.etats || []}
                        onToggleState={(st) => toggleCombatantState(globalIdx, st)}
                        onSelectDetail={(state) => setDetailItem({ type: 'etat', data: state })}
                        allowEdit={true}
                        compact={true}
                      />
                    </div>

                    {/* HP management */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div>
                          Points de Vie : <b className="text-[#f3d48d]">{c.hp}</b> / {c.hpMax}
                          {c.hp <= 0 && (
                            <span className="ml-2 font-bold text-[#cf5544]">
                              💀 Inconscient / Hors de combat
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => alterCombatHp(globalIdx, -5)}
                            className="w-6 h-6 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] rounded text-xs font-bold text-[#ede3d1]"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => alterCombatHp(globalIdx, -1)}
                            className="w-6 h-6 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] rounded text-xs font-bold text-[#ede3d1]"
                          >
                            -1
                          </button>
                          <input
                            type="number"
                            value={c.hp}
                            onChange={(e) => setCombatHp(globalIdx, parseInt(e.target.value) || 0)}
                            className="w-12 text-center text-xs font-bold text-[#ede3d1] bg-[#120f0c] border border-[#3d3023] rounded py-0.5"
                          />
                          <button
                            onClick={() => alterCombatHp(globalIdx, 1)}
                            className="w-6 h-6 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] rounded text-xs font-bold text-[#ede3d1]"
                          >
                            +1
                          </button>
                          <button
                            onClick={() => alterCombatHp(globalIdx, 5)}
                            className="w-6 h-6 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] rounded text-xs font-bold text-[#ede3d1]"
                          >
                            +5
                          </button>
                          <button
                            onClick={() => removeCombatant(globalIdx)}
                            className="p-1 rounded text-[#9e907d] hover:text-[#cf5544] ml-2"
                            title="Retirer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="bg-[#0c0a08] border border-[#3d3023] rounded-md h-2 overflow-hidden">
                        <div
                          className="h-full transition-all duration-200"
                          style={{ width: `${pct}%`, backgroundColor: barCol }}
                        />
                      </div>
                    </div>

                    {c.notes && (
                      <p className="text-xs text-[#9e907d] bg-[#120f0c] p-2 rounded border border-[#261f18]">
                        {c.notes}
                      </p>
                    )}
                  </div>
                );
              })}

            {tableData.combatants.length === 0 && (
              <div className="p-8 bg-[#181410] border border-[#3d3023] rounded-xl text-center space-y-3">
                <Swords className="w-10 h-10 text-[#9e907d] mx-auto opacity-50" />
                <h4 className="font-serif-co text-base font-bold text-[#ede3d1]">
                  Piste de Combat Vide
                </h4>
                <p className="text-xs text-[#9e907d] max-w-sm mx-auto">
                  Ajoutez des héros depuis l'onglet « Groupe PJ » ou des créatures depuis le « Bestiaire » pour démarrer un affrontement.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== 2. GROUPE PJ ==================== */}
      {activeTab === 'groupe' && (
        <div className="space-y-4">
          {/* Joueurs en ligne (synchro Firebase temps réel) */}
          <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">
                🟢 Joueurs en ligne <span className="text-sm text-[#9e907d]">({onlineHeroes.length})</span>
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-[#9e907d]">
                  Écouteur actif · {rtStats.events} mise(s) à jour reçue(s)
                  {rtStats.last ? ` · dernière à ${rtStats.last}` : ''}
                </span>
                {onlineHeroes.some((h) => !isHeroInTable(h)) && (
                  <button
                    type="button"
                    onClick={() => addOnlineHeroes(onlineHeroes)}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#d4a84a] to-[#ab8230] hover:brightness-110 text-black text-xs font-bold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tout ajouter à la table
                  </button>
                )}
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs text-[#cbb8a7] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoAddPlayers}
                onChange={(e) => {
                  setAutoAddPlayers(e.target.checked);
                  try {
                    localStorage.setItem('co_mj_auto_add_players', e.target.checked ? '1' : '0');
                  } catch {}
                }}
                className="w-3.5 h-3.5 accent-[#d4a84a]"
              />
              Ajouter automatiquement à la table les joueurs qui se connectent
            </label>
            <details className="text-[11px] text-[#9e907d]">
              <summary className="cursor-pointer hover:text-[#ede3d1]">Diagnostic technique (à me copier si rien n'arrive)</summary>
              <pre className="mt-2 p-2 bg-[#0d0a08] border border-[#3d3023] rounded overflow-x-auto text-[#7db5ff]">{rtDiag}</pre>
            </details>
            {onlineHeroes.length === 0 ? (
              <p className="text-xs text-[#9e907d]">
                Aucun joueur connecté pour l'instant. Les héros apparaissent ici dès qu'un joueur ouvre ou modifie sa fiche.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {onlineHeroes.map((h, i) => {
                  const inTable = isHeroInTable(h);
                  return (
                    <div
                      key={(h.id || h.name) + i}
                      className="flex items-center justify-between gap-2 bg-[#120f0c] border border-[#3d3023] rounded-lg px-3 py-2"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-[#ede3d1] truncate">{h.name}</div>
                        <div className="text-[11px] text-[#9e907d] truncate">
                          {[h.race, h.profil, (h as any).level ? `niv. ${(h as any).level}` : ''].filter(Boolean).join(' · ')}
                        </div>
                      </div>
                      {inTable ? (
                        <span className="text-[11px] text-[#7fb069] flex items-center gap-1 shrink-0">
                          <Check className="w-3.5 h-3.5" /> À la table
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addOnlineHeroes([h])}
                          className="px-2.5 py-1 rounded-lg bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] hover:border-[#d4a84a] text-xs font-semibold text-[#f3d48d] flex items-center gap-1 shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" /> Ajouter
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">
                  Groupe d'Aventuriers
                </h3>
                <span className="text-xs text-[#9e907d]">
                  Héros enregistrés : <b className="text-[#ede3d1]">{tableData.pjs.length}</b>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPnjCreatorOpen(true)}
                  className="px-3 py-1.5 bg-gradient-to-r from-[#2c4058] to-[#1a293b] hover:brightness-110 border border-[#4d7ca8] text-[#cce3ff] text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm"
                  title="Créer un nouveau PNJ ou allié officiel et l'intégrer au groupe d'aventuriers"
                >
                  <Plus className="w-3.5 h-3.5 text-[#7db5ff]" /> Créer un PNJ / Allié
                </button>

                {currentActivePj && (
                  <button
                    onClick={onImportActivePj}
                    className="px-3 py-1.5 bg-[#231c15] hover:bg-[#32271d] border border-[#d4a84a] text-[#f3d48d] text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#d4a84a]" /> Importer PJ Actif ({currentActivePj.name.split(' ')[0]})
                  </button>
                )}

                <label className="px-3 py-1.5 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-[#ede3d1] text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer">
                  <FileUp className="w-3.5 h-3.5 text-[#d4a84a]" /> Importer Fiches (JSON)
                  <input
                    type="file"
                    multiple
                    accept=".json"
                    className="hidden"
                    onChange={(e) => handleImportPjFiles(e.target.files)}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setIsImportCodeModalOpen(true)}
                  className="px-3 py-1.5 bg-[#231c15] hover:bg-[#32271d] border border-[#7db5ff]/60 text-[#b5d6ff] text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
                  title="Coller un code de fiche envoyé par un joueur depuis son téléphone"
                >
                  <ClipboardPaste className="w-3.5 h-3.5 text-[#7db5ff]" /> Coller Fiche Joueur
                </button>

                <button
                  onClick={addAllPjToCombat}
                  className="px-3 py-1.5 bg-[#d4a84a] hover:bg-[#e0b555] text-black text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Swords className="w-3.5 h-3.5" /> Envoyer TOUT en Combat
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#30251a]">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="w-3.5 h-3.5 text-[#9e907d] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, joueur, roleplay..."
                  value={pjSearch}
                  onChange={(e) => setPjSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
                />
              </div>

              <select
                value={pjProfFilter}
                onChange={(e) => setPjProfFilter(e.target.value)}
                className="px-3 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
              >
                <option value="">Tous les profils</option>
                {[...new Set(tableData.pjs.map((p) => p.profil).filter(Boolean))].map((pr) => (
                  <option key={pr} value={pr}>
                    {pr}
                  </option>
                ))}
              </select>

              <select
                value={pjRaceFilter}
                onChange={(e) => setPjRaceFilter(e.target.value)}
                className="px-3 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
              >
                <option value="">Toutes les races</option>
                {[...new Set(tableData.pjs.map((p) => p.race).filter(Boolean))].map((rc) => (
                  <option key={rc} value={rc}>
                    {rc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid of PJ cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {tableData.pjs
              .filter((p) => {
                const str = (p.name + (p.player || '') + (p.persoTraits || '')).toLowerCase();
                const matchQ = str.includes(pjSearch.toLowerCase());
                const matchProf = !pjProfFilter || p.profil === pjProfFilter;
                const matchRace = !pjRaceFilter || p.race === pjRaceFilter;
                return matchQ && matchProf && matchRace;
              })
              .map((p, idx) => {
                const hpMax = p.hpMaxManual || p.hpMaxAuto || p.hpBase || 10;
                const defVal = (p as any).def || 12;

                const handleTogglePjState = (stName: string) => {
                  const list = [...tableData.pjs];
                  const current = list[idx].etats || [];
                  const exists = current.includes(stName);
                  const newStates = exists
                    ? current.filter((s) => s !== stName)
                    : [...current, stName];
                  list[idx] = { ...list[idx], etats: newStates };

                  // Sync also combatant if present in tableData.combatants
                  const updatedCombatants = tableData.combatants.map((c) => {
                    if (c.pjRefId === p.id || c.n.startsWith(p.name)) {
                      return { ...c, etats: newStates };
                    }
                    return c;
                  });

                  onUpdateTableData({ ...tableData, pjs: list, combatants: updatedCombatants });
                };

                return (
                  <div
                    key={p.id || idx}
                    className={`p-4 bg-[#181410] border rounded-xl flex flex-col justify-between space-y-3 ${
                      p.isPnj ? 'border-[#3b597a]' : 'border-[#3d3023]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                              p.isPnj
                                ? 'bg-[#18283a] text-[#7db5ff] border border-[#2b4c6f]'
                                : 'bg-[#291e13] text-[#f3d48d] border border-[#d4a84a]/40'
                            }`}
                          >
                            {p.isPnj ? p.rolePnj || 'PNJ Allié' : 'PJ'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedCharacterModal(p)}
                            className="font-serif-co text-base text-[#f3d48d] hover:text-[#fff] hover:underline cursor-pointer flex items-center gap-1.5 font-bold"
                            title="Cliquer pour afficher la fiche complète (Page 1 PJ en mode pop-up)"
                          >
                            <span>{p.name}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-[#d4a84a]" />
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            const list = [...tableData.pjs];
                            list.splice(idx, 1);
                            onUpdateTableData({ ...tableData, pjs: list });
                          }}
                          className="p-1 rounded text-[#9e907d] hover:text-[#cf5544]"
                          title="Supprimer du groupe"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs text-[#9e907d]">
                        {!p.isPnj && (
                          <span>
                            Joueur : <b className="text-[#ede3d1]">{p.player || 'Anonyme'}</b> •{' '}
                          </span>
                        )}
                        {p.race} • {p.profil} Niv. {p.level}
                      </div>

                      {/* PV et DÉFENSE / CA avec ajustement direct par le MJ */}
                      <div className="mt-2.5 flex items-center justify-between text-xs bg-[#120f0c] p-2 rounded-lg border border-[#2d2218]">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const list = [...tableData.pjs];
                              const newHp = Math.max(0, p.hp - 1);
                              list[idx] = { ...list[idx], hp: newHp };
                              onUpdateTableData({ ...tableData, pjs: list });
                            }}
                            className="w-5 h-5 rounded bg-[#2b1416] hover:bg-[#3d1a1e] text-[#ff8080] font-bold flex items-center justify-center cursor-pointer border border-[#6d252b]"
                            title="-1 PV"
                          >
                            -
                          </button>
                          <span>PV :</span>
                          <b className={p.hp <= 0 ? 'text-[#ff5555]' : 'text-[#6fa85b]'}>{p.hp}</b> / {hpMax}
                          <button
                            type="button"
                            onClick={() => {
                              const list = [...tableData.pjs];
                              const newHp = Math.min(hpMax, p.hp + 1);
                              list[idx] = { ...list[idx], hp: newHp };
                              onUpdateTableData({ ...tableData, pjs: list });
                            }}
                            className="w-5 h-5 rounded bg-[#172b1a] hover:bg-[#203d24] text-[#86efac] font-bold flex items-center justify-center cursor-pointer border border-[#276e43]"
                            title="+1 PV"
                          >
                            +
                          </button>
                        </div>
                        <div className="flex items-center gap-1 font-bold text-[#7db5ff]">
                          <Shield className="w-3.5 h-3.5" />
                          <span>DEF :</span>
                          <span className="text-white">{defVal}</span>
                        </div>
                      </div>

                      {/* Points de capacité & Cadeau RP */}
                      <div className="mt-2 flex items-center justify-between bg-[#19130d] p-1.5 px-2.5 rounded-lg border border-[#3d2e1b] text-xs">
                        <span className="text-[#9e907d]">
                          Pts Capacité : <b className="text-[#f3d48d]">{p.ptsCap || 0}</b>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const list = [...tableData.pjs];
                            const currentPts = list[idx].ptsCap || 0;
                            const gifts = (list[idx].ptsCapCadeaux || 0) + 1;
                            list[idx] = { ...list[idx], ptsCap: currentPts + 1, ptsCapCadeaux: gifts };
                            onUpdateTableData({ ...tableData, pjs: list });
                            alert(`🎁 +1 Point de Capacité Cadeau offert à ${p.name} pour son excellent Roleplay ! (Nouveau total : ${currentPts + 1})`);
                          }}
                          className="px-2 py-0.5 rounded bg-gradient-to-r from-[#855325] to-[#593313] hover:brightness-110 text-[#f7e0b5] border border-[#a8743d] font-bold text-[10px] flex items-center gap-1 cursor-pointer shadow-xs"
                          title="Offrir à distance +1 point de capacité pour récompenser un excellent RP"
                        >
                          <Gift className="w-3 h-3 text-[#f3d48d]" />
                          <span>+1 Pt Cadeau RP</span>
                        </button>
                      </div>

                      {/* ÉTATS PRÉJUDICIABLES */}
                      <div className="mt-2.5 pt-2 border-t border-[#261f18]">
                        <div className="flex items-center gap-1.5 mb-1.5 text-[11px] text-[#9e907d] font-bold uppercase">
                          <span>États :</span>
                        </div>
                        <StateBadgeList
                          activeStates={p.etats || []}
                          onToggleState={handleTogglePjState}
                          onSelectDetail={(state) => setDetailItem({ type: 'etat', data: state })}
                          allowEdit={true}
                          compact={true}
                        />
                      </div>

                      {p.persoTraits && (
                        <p className="text-[11px] text-[#9e907d] mt-2 italic line-clamp-2">
                          « {p.persoTraits} »
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedCharacterModal(p)}
                        className="flex-1 py-1.5 bg-[#231c15] hover:bg-[#32271d] border border-[#d4a84a]/60 text-[#f3d48d] text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs"
                        title="Ouvrir la fiche complète détaillée du personnage en pop-up"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#d4a84a]" /> Fiche Complète
                      </button>
                      <button
                        type="button"
                        onClick={() => sendPjToCombat(p)}
                        className="flex-1 py-1.5 bg-gradient-to-r from-[#8b2628] to-[#59191a] hover:brightness-110 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs"
                      >
                        <Swords className="w-3.5 h-3.5" /> Combat
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ==================== 3. BESTIAIRE (DRS + THARNÉA) ==================== */}
      {activeTab === 'bestiaire' && (() => {
        const fullBestiaire = isTharneaActive ? [...THARNEA_MONSTERS, ...BESTIAIRE] : BESTIAIRE;

        return (
          <div className="space-y-4">
            <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">
                    Bestiaire {isTharneaActive ? 'Complet (DRS & Codex de l\'Obscure)' : 'Officiel du DRS'}
                  </h3>
                  <span className="text-xs text-[#9e907d]">
                    Créatures répertoriées : <b className="text-[#ede3d1]">{fullBestiaire.length}</b> (DRS: {BESTIAIRE.length}{isTharneaActive ? ` · Tharnéa: ${THARNEA_MONSTERS.length}` : ''})
                  </span>
                </div>

                {/* Source filter selector */}
                {isTharneaActive && (
                  <div className="flex items-center gap-1 bg-[#120f0c] p-1 rounded-lg border border-[#3d3023]">
                    <button
                      type="button"
                      onClick={() => setBestSourceFilter('all')}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                        bestSourceFilter === 'all'
                          ? 'bg-[#d4a84a] text-black shadow-xs'
                          : 'text-[#9e907d] hover:text-[#ede3d1]'
                      }`}
                    >
                      Tous ({fullBestiaire.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setBestSourceFilter('drs')}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                        bestSourceFilter === 'drs'
                          ? 'bg-[#d4a84a] text-black shadow-xs'
                          : 'text-[#9e907d] hover:text-[#ede3d1]'
                      }`}
                    >
                      DRS Officiel ({BESTIAIRE.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setBestSourceFilter('tharnea')}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                        bestSourceFilter === 'tharnea'
                          ? 'bg-[#8a2d75] text-white shadow-xs'
                          : 'text-[#cca3c7] hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-[#ff8fed]" />
                      <span>Codex de l'Obscure ({THARNEA_MONSTERS.length})</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#30251a]">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-[#9e907d] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Rechercher nom, attaque, capacité, milieu..."
                    value={bestSearch}
                    onChange={(e) => setBestSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
                  />
                </div>

                <select
                  value={bestNcFilter}
                  onChange={(e) => setBestNcFilter(e.target.value)}
                  className="px-3 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
                >
                  <option value="">Tous les NC</option>
                  <option value="0">NC 0</option>
                  <option value="1/2">NC 1/2</option>
                  <option value="1">NC 1</option>
                  <option value="2">NC 2</option>
                  <option value="3">NC 3</option>
                  <option value="4">NC 4</option>
                  <option value="5">NC 5</option>
                  <option value="6">NC 6</option>
                  <option value="7">NC 7</option>
                  <option value="8">NC 8</option>
                  <option value="9">NC 9</option>
                  <option value="10">NC 10+</option>
                </select>

                <select
                  value={bestFamFilter}
                  onChange={(e) => setBestFamFilter(e.target.value)}
                  className="px-3 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
                >
                  <option value="">Toutes Familles / Milieux</option>
                  <option value="Humanoïdes">Humanoïdes</option>
                  <option value="Bêtes">Bêtes</option>
                  <option value="Morts-vivants">Morts-vivants</option>
                  <option value="Géants">Géants</option>
                  <option value="Créatures magiques">Créatures magiques</option>
                  <option value="Dragons">Dragons</option>
                  <option value="Élémentaires">Élémentaires</option>
                  <option value="Démons">Démons</option>
                </select>

                {(bestSearch || bestNcFilter || bestFamFilter || bestSourceFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setBestSearch('');
                      setBestNcFilter('');
                      setBestFamFilter('');
                      setBestSourceFilter('all');
                    }}
                    className="px-2.5 py-1 text-xs text-[#9e907d] hover:text-[#ede3d1]"
                  >
                    Effacer
                  </button>
                )}
              </div>
            </div>

            {/* List of Monsters */}
            <div className="space-y-2.5">
              {fullBestiaire
                .filter((m) => {
                  const isTharneaMob = m.source === 'tharnea' || !!m.source?.toLowerCase().includes('tharnea');
                  if (bestSourceFilter === 'drs') return !isTharneaMob;
                  if (bestSourceFilter === 'tharnea') return isTharneaMob;
                  return true;
                })
                .filter((m) => {
                  const str = (m.n + m.att + m.traits + (m.fam || '') + (m.milieu || '')).toLowerCase();
                  const matchQ = str.includes(bestSearch.toLowerCase());
                  const matchNc =
                    !bestNcFilter ||
                    (bestNcFilter === '10' ? parseInt(m.nc) >= 10 : m.nc === bestNcFilter);
                  const matchFam = !bestFamFilter || m.fam === bestFamFilter;
                  return matchQ && matchNc && matchFam;
                })
                .map((m, idx) => {
                  const isTharnea = m.source === 'tharnea' || !!m.source?.toLowerCase().includes('tharnea');

                  return (
                    <details
                      key={idx}
                      className={`border rounded-xl overflow-hidden transition-all ${
                        isTharnea
                          ? 'bg-[#1b1019] border-[#5e194f]'
                          : 'bg-[#181410] border-[#3d3023]'
                      }`}
                    >
                      <summary className="px-4 py-3 cursor-pointer hover:bg-[#231c15] flex items-center justify-between select-none">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          {isTharnea && (
                            <span className="text-[10px] bg-[#5e194f] text-[#ffddfa] px-1.5 py-0.5 rounded font-mono font-bold border border-[#b8389e]/40">
                              #{m.num || idx + 1}
                            </span>
                          )}
                          <b className="font-serif-co text-base text-[#f3d48d]">{m.n}</b>
                          <span className="text-[10px] bg-[#382b1b] text-[#f3d48d] px-2 py-0.5 rounded font-bold border border-[#523d24]">
                            NC {m.nc}
                          </span>
                          {isTharnea && (
                            <span className="text-[10px] bg-[#3a1435] text-[#ffbdf4] px-1.5 py-0.2 rounded font-bold border border-[#78286a]">
                              Codex Obscure
                            </span>
                          )}
                          <span className="text-xs text-[#9e907d] hidden sm:inline">
                            {m.fam || m.milieu || ''} • PV : {m.pv} • DEF : {m.def} • Init : {m.init}
                          </span>
                        </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailItem({ type: 'monster', data: m });
                      }}
                      className="p-1.5 rounded bg-[#231c15] hover:bg-[#32271d] text-[#d4a84a] hover:text-[#fff] border border-[#3d3023] flex items-center gap-1 text-xs font-semibold"
                      title="Ouvrir la fiche complète en Pop-up"
                    >
                      <Info className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Détails</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addMonsterToCombat(m);
                      }}
                      className="px-3 py-1 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] hover:border-[#d4a84a] text-xs font-bold text-[#f3d48d] rounded flex items-center gap-1"
                    >
                      <Swords className="w-3.5 h-3.5" /> Combat
                    </button>
                  </div>
                </summary>

                <div className="p-4 pt-1 border-t border-[#30251a] space-y-2 text-xs">
                  <div>
                    <b className="text-[#f3d48d]">Attaques :</b>{' '}
                    <span className="text-[#ede3d1]">{m.att}</span>
                  </div>
                  <div>
                    <b className="text-[#f3d48d]">Capacités &amp; Traits :</b>{' '}
                    <span className="text-[#ede3d1]">{m.traits}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="text-[11px] text-[#9e907d]">
                      Famille : {m.fam || 'Non classé'} • PV : {m.pv} • Défense : {m.def} •
                      Initiative : {m.init}
                    </div>
                    <button
                      type="button"
                      onClick={() => setDetailItem({ type: 'monstre', data: m })}
                      className="px-3 py-1 bg-[#2e1d16] hover:bg-[#3d271e] text-[#f3d48d] rounded border border-[#d4a84a]/40 text-xs font-bold flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Fiche Pop-up
                    </button>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </div>
    );
  })()}

      {/* ==================== 3.4 LES TERRES D'OSGILD (LORE OFFICIEL COMPLET MJ) ==================== */}
      {activeTab === 'osgild' && <OsgildLoreMj />}

      {/* ==================== 3.5 CODEX THARNÉA (EXTENSION INÉDITE) ==================== */}
      {activeTab === 'tharnea' && (() => {
        const candies = THARNEA_ARTIFACTS.filter((a) => a.cat === 'Bonbon Alchimique');
        const artifactsOnly = THARNEA_ARTIFACTS.filter((a) => a.cat !== 'Bonbon Alchimique');

        return (
          <div className="space-y-4">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#291338] via-[#1f102b] to-[#120a1c] border border-[#a855f7]/60 rounded-xl p-5 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xl">🔮</span>
                    <h3 className="font-serif-co text-xl font-bold text-[#f3e8ff]">
                      Codex de l'Obscure – Extension Tharnéa
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#4c1d6f] text-[#f5d0fe] border border-[#c084fc]/40">
                      Campagne Inédite
                    </span>
                    <span className="text-[10px] text-[#a855f7] italic font-mono">
                      Signé Doudou, F.P
                    </span>
                  </div>
                  <p className="text-xs text-[#d8b4fe] max-w-2xl">
                    Pack complet de créatures cauchemardesques, artefacts d'ombre, alchimies mystiques et lore militaire de Norvhal, 100% harmonisé avec le système Chroniques Oubliées Fantasy.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-[#170a24] px-3.5 py-2 rounded-lg border border-[#6b21a8]/60">
                  <div className="text-center px-2 border-r border-[#4c1d6f]">
                    <span className="block font-serif-co text-base font-bold text-[#f5d0fe]">{THARNEA_MONSTERS.length}</span>
                    <span className="text-[9px] text-[#c084fc] uppercase">Monstres</span>
                  </div>
                  <div className="text-center px-2 border-r border-[#4c1d6f]">
                    <span className="block font-serif-co text-base font-bold text-[#f5d0fe]">{artifactsOnly.length}</span>
                    <span className="text-[9px] text-[#c084fc] uppercase">Artéfacts</span>
                  </div>
                  <div className="text-center px-2">
                    <span className="block font-serif-co text-base font-bold text-[#f5d0fe]">{candies.length}</span>
                    <span className="text-[9px] text-[#c084fc] uppercase">Bonbons</span>
                  </div>
                </div>
              </div>

              {/* Sub navigation inside Tharnea tab */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-[#4c1d6f]/50 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => { setTharneaSubTab('monstres'); setTharneaSearch(''); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                    tharneaSubTab === 'monstres'
                      ? 'bg-[#9333ea] text-white shadow-md'
                      : 'text-[#d8b4fe] bg-[#1a0c28] hover:bg-[#2c1445] border border-[#581c87]'
                  }`}
                >
                  <Skull className="w-3.5 h-3.5" />
                  <span>Bestiaire de l'Obscure ({THARNEA_MONSTERS.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setTharneaSubTab('artefacts'); setTharneaSearch(''); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                    tharneaSubTab === 'artefacts'
                      ? 'bg-[#9333ea] text-white shadow-md'
                      : 'text-[#d8b4fe] bg-[#1a0c28] hover:bg-[#2c1445] border border-[#581c87]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Artéfacts &amp; Reliques ({artifactsOnly.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setTharneaSubTab('bonbons'); setTharneaSearch(''); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                    tharneaSubTab === 'bonbons'
                      ? 'bg-[#9333ea] text-white shadow-md'
                      : 'text-[#d8b4fe] bg-[#1a0c28] hover:bg-[#2c1445] border border-[#581c87]'
                  }`}
                >
                  <span>🍬</span>
                  <span>Boîte à Bonbons ({candies.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setTharneaSubTab('lore'); setTharneaSearch(''); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                    tharneaSubTab === 'lore'
                      ? 'bg-[#9333ea] text-white shadow-md'
                      : 'text-[#d8b4fe] bg-[#1a0c28] hover:bg-[#2c1445] border border-[#581c87]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Armée &amp; Dossiers Boss</span>
                </button>
              </div>
            </div>

            {/* SUB-TAB 1 : 61 MONSTRES DE THARNÉA */}
            {tharneaSubTab === 'monstres' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 bg-[#181410] p-3 rounded-xl border border-[#3d3023]">
                  <Search className="w-3.5 h-3.5 text-[#9e907d]" />
                  <input
                    type="text"
                    placeholder="Filtrer par nom (#1 Rat, #2 Gobelin, #41 Bogart, #53 Malin...), milieu, pouvoir..."
                    value={tharneaSearch}
                    onChange={(e) => setTharneaSearch(e.target.value)}
                    className="w-full bg-transparent text-xs text-[#ede3d1] outline-none"
                  />
                  {tharneaSearch && (
                    <button
                      onClick={() => setTharneaSearch('')}
                      className="text-xs text-[#9e907d] hover:text-[#ede3d1]"
                    >
                      Effacer
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {THARNEA_MONSTERS
                    .filter((m) => {
                      const query = tharneaSearch.toLowerCase();
                      const numStr = m.num ? `#${m.num}` : '';
                      const fullStr = `${numStr} ${m.n} ${m.fam || ''} ${m.milieu || ''} ${m.att} ${m.traits} ${m.tactique || ''}`.toLowerCase();
                      return fullStr.includes(query);
                    })
                    .map((m) => {
                      return (
                        <div
                          key={m.num || m.n}
                          onClick={() => setDetailItem({ type: 'monstre', data: m })}
                          className="cursor-pointer bg-[#181410] hover:bg-[#20152b] border border-[#581c87]/60 hover:border-[#a855f7] rounded-xl p-3.5 transition-all shadow-sm space-y-2.5"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              {m.num && (
                                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#3b1259] text-[#e9d5ff] border border-[#7e22ce]/60">
                                  #{m.num}
                                </span>
                              )}
                              <h4 className="font-serif-co text-base font-bold text-[#f3e8ff] hover:underline flex items-center gap-1.5">
                                <span>{m.n}</span>
                                <ExternalLink className="w-3.5 h-3.5 text-[#a855f7]" />
                              </h4>
                              <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#9c2a2b] text-white">
                                NC {m.nc}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded bg-[#1e1329] text-[#c084fc] border border-[#4c1d6f]">
                                {m.fam || 'Abomination'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => addMonsterToCombat(m)}
                                className="px-3 py-1 bg-gradient-to-r from-[#9333ea] to-[#7e22ce] hover:brightness-110 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs"
                                title="Ajouter cette créature au tracker de combat"
                              >
                                <Swords className="w-3.5 h-3.5" /> Combat
                              </button>
                              <button
                                type="button"
                                onClick={() => setDetailItem({ type: 'monstre', data: m })}
                                className="px-2.5 py-1 bg-[#231530] hover:bg-[#341d47] border border-[#6b21a8] text-[#e9d5ff] text-xs font-semibold rounded-lg flex items-center gap-1"
                                title="Afficher la fiche complète détaillée en pop-up"
                              >
                                <ExternalLink className="w-3.5 h-3.5" /> Fiche Pop-up
                              </button>
                            </div>
                          </div>

                          {/* Ligne résumé statistiques compacte */}
                          <div className="flex items-center gap-4 text-xs text-[#d8b4fe] flex-wrap bg-[#120a1c] p-2 rounded-lg border border-[#3b1259]/60">
                            <span>Points de Vie : <b className="text-[#6fa85b]">{m.pv} PV</b></span>
                            <span>Défense/CA : <b className="text-[#7db5ff]">{m.def}</b></span>
                            <span>Initiative : <b className="text-[#f3d48d]">{m.init}</b></span>
                            <span className="truncate">Attaque : <b className="text-white">{m.att}</b></span>
                            {m.milieu && <span className="text-[#a78bfa] italic ml-auto">📍 {m.milieu}</span>}
                          </div>

                          {/* Aperçu rapide & lien vers pop-up */}
                          <div className="flex items-center justify-between text-xs text-[#c4b5fd]">
                            <p className="line-clamp-1 italic text-[#a78bfa]">
                              {m.traits || (m.tactique ? `Tactique MJ : ${m.tactique}` : 'Créature du Codex')}
                            </p>
                            <span className="text-[11px] text-[#c084fc] shrink-0 font-medium ml-2 flex items-center gap-1">
                              <span>Voir tactique &amp; pouvoirs complets</span>
                              <ExternalLink className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* SUB-TAB 2 : ARTÉFACTS & RELIQUES */}
            {tharneaSubTab === 'artefacts' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 bg-[#181410] p-3 rounded-xl border border-[#3d3023]">
                  <Search className="w-3.5 h-3.5 text-[#9e907d]" />
                  <input
                    type="text"
                    placeholder="Rechercher une relique (Lame, Anneau, Bâton, Masque, Pendentif...)..."
                    value={tharneaSearch}
                    onChange={(e) => setTharneaSearch(e.target.value)}
                    className="w-full bg-transparent text-xs text-[#ede3d1] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {artifactsOnly
                    .filter((a) => {
                      const str = `${a.n} ${a.cat || ''} ${a.desc || ''} ${a.props || ''}`.toLowerCase();
                      return str.includes(tharneaSearch.toLowerCase());
                    })
                    .map((a, idx) => {
                      return (
                        <div
                          key={a.n || idx}
                          onClick={() => setDetailItem({ type: 'equipement', data: a })}
                          className="cursor-pointer bg-[#181410] hover:bg-[#20152b] border border-[#581c87]/60 hover:border-[#a855f7] rounded-xl p-4 transition-all shadow-sm space-y-2 flex flex-col justify-between"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <b className="font-serif-co text-base text-[#f5d0fe]">{a.n}</b>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#4c1d6f] text-[#f5d0fe] border border-[#7e22ce]/60 shrink-0">
                                {a.cat || 'Artéfact'}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-[#9e907d]">
                              {a.prix && <span>💰 Prix estimé : <b className="text-[#f3d48d]">{a.prix}</b></span>}
                              {a.dm && <span>⚔️ Dégâts : <b className="text-white">{a.dm}</b></span>}
                              {a.def && <span>🛡️ Défense : <b className="text-white">{a.def}</b></span>}
                            </div>

                            <p className="text-xs text-[#d8b4fe] line-clamp-3">
                              {a.desc || a.props}
                            </p>

                            {a.effetSecondaire && (
                              <p className="text-[11px] text-[#fca5a5] bg-[#2a1315] p-1.5 rounded border border-[#7f1d1d]">
                                ⚠️ <b>Contrecoup :</b> {a.effetSecondaire}
                              </p>
                            )}
                          </div>

                          <div className="pt-2 border-t border-[#3b1259] flex items-center justify-between text-[11px] text-[#c084fc]">
                            <span>Cliquer pour la fiche détaillée</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* SUB-TAB 3 : BOÎTE À BONBONS */}
            {tharneaSubTab === 'bonbons' && (
              <div className="space-y-3">
                {/* Carte Vedette : Boîte à Bonbons de l'Obscure */}
                {(() => {
                  const boite = THARNEA_ARTIFACTS.find((a) => a.n.includes('Boîte à Bonbons') || a.n.includes('Boite a Bonbons'));
                  if (!boite) return null;
                  return (
                    <div
                      onClick={() => setDetailItem({ type: 'equipement', data: boite })}
                      className="cursor-pointer bg-gradient-to-r from-[#3b1259] via-[#280c3d] to-[#160624] border-2 border-[#d4a84a] rounded-xl p-4 shadow-xl hover:brightness-110 transition-all space-y-2.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#7e22ce]/50 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🎁</span>
                          <div>
                            <h4 className="font-serif-co text-lg font-bold text-[#fde047] flex items-center gap-2">
                              <span>{boite.n}</span>
                              <ExternalLink className="w-3.5 h-3.5 text-[#fde047]" />
                            </h4>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#d8b4fe]">
                              Coffret d'Ébène Inédit • 36 Bonbons (3x chacun des 12 types)
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#200730] text-[#fde047] border border-[#d4a84a]/50">
                            Prix : {boite.prix || '500 pa'}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDetailItem({ type: 'equipement', data: boite });
                            }}
                            className="px-3 py-1 bg-[#d4a84a] text-black font-bold text-xs rounded-lg flex items-center gap-1 shadow-sm"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Fiche Pop-up
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-[#f5d0fe] leading-relaxed">
                        {boite.desc}
                      </p>
                      <div className="text-[11px] text-[#fde047] italic bg-[#1e072c] p-2 rounded-lg border border-[#7e22ce]/40">
                        ✨ <b>Contenu exact :</b> 3x Bleu, 3x Orange, 3x Vert, 3x Rouge, 3x Violet, 3x Jaune, 3x Noir, 3x Rose, 3x Marron, 3x Doré, 3x Argent, 3x Arc-en-ciel.
                      </div>
                    </div>
                  );
                })()}

                <div className="bg-[#24132b] p-3.5 rounded-xl border border-[#7e22ce]/60 space-y-1">
                  <h4 className="font-serif-co text-sm font-bold text-[#f5d0fe] flex items-center gap-2">
                    <span>🍬</span> Les 12 Bonbons Alchimiques Individuels
                  </h4>
                  <p className="text-xs text-[#d8b4fe]">
                    Chaque bonbon est une confiserie imprégnée d'essences surnaturelles. Cliquez sur un bonbon pour ouvrir sa fiche détaillée en pop-up.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {candies.map((c, idx) => {
                    return (
                      <div
                        key={c.n || idx}
                        onClick={() => setDetailItem({ type: 'equipement', data: c })}
                        className="cursor-pointer bg-[#181410] hover:bg-[#251533] border border-[#a855f7]/40 hover:border-[#c084fc] rounded-xl p-4 transition-all shadow-sm space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <b className="font-serif-co text-sm text-[#f5d0fe]">{c.n}</b>
                            <span className="text-xs">🍬</span>
                          </div>
                          <span className="text-[10px] text-[#c084fc] block mb-2 font-mono">
                            {c.prix || 'Rare confiserie'}
                          </span>
                          <p className="text-xs text-[#ede3d1] line-clamp-3">
                            {c.desc}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-[#3b1259] flex items-center justify-between text-[10px] text-[#c084fc]">
                          <span>Détails &amp; Consommation</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SUB-TAB 4 : LORE, ARMÉE & DOSSIERS BOSS */}
            {tharneaSubTab === 'lore' && (
              <div className="space-y-4">
                <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-3">
                  <h4 className="font-serif-co text-base font-bold text-[#f3d48d] flex items-center gap-2">
                    <span>👑</span> Hiérarchie Militaire de l'Armée du Roi
                  </h4>
                  <p className="text-xs text-[#9e907d]">
                    Documentation officielle sur l'organisation des forces armées du royaume de Norvhal et les factions en guerre.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="bg-[#231c15] p-2.5 rounded-lg border border-[#3d3023]">
                      <b className="text-[#f3d48d] block mb-1">Commandement Suprême</b>
                      <p className="text-[11px] text-[#9e907d]">
                        Le Roi et ses Généraux de Haute-Cour. Décident des grandes purges.
                      </p>
                    </div>
                    <div className="bg-[#231c15] p-2.5 rounded-lg border border-[#3d3023]">
                      <b className="text-[#7db5ff] block mb-1">Garde d'Élite &amp; Ours Vert</b>
                      <p className="text-[11px] text-[#9e907d]">
                        Colosses armurés (NC 4) affectés à la protection des reliques et des hauts dignitaires.
                      </p>
                    </div>
                    <div className="bg-[#231c15] p-2.5 rounded-lg border border-[#3d3023]">
                      <b className="text-[#ede3d1] block mb-1">Infanterie Royale &amp; Soldats</b>
                      <p className="text-[11px] text-[#9e907d]">
                        Ligne de front (NC 2) maniant l'épée longue et le grand pavois.
                      </p>
                    </div>
                    <div className="bg-[#231c15] p-2.5 rounded-lg border border-[#3d3023]">
                      <b className="text-[#cf5544] block mb-1">Bandits &amp; Maître des Pillards</b>
                      <p className="text-[11px] text-[#9e907d]">
                        Mercenaires sans foi ni loi opérant dans les forêts de Tharnéa.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#181410] border border-[#581c87]/60 rounded-xl p-4 space-y-3">
                  <h4 className="font-serif-co text-base font-bold text-[#f5d0fe] flex items-center gap-2">
                    <span>📜</span> Dossiers Majeurs &amp; Antagonistes
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-[#1c0f29] p-3 rounded-lg border border-[#4c1d6f] space-y-1">
                      <b className="text-[#f3d48d] text-sm">Varn le Protecteur (Allié Majeur)</b>
                      <p className="text-[#d8b4fe]">
                        Guerrier vétéran dévoué au sauvetage des rescapés. PV: 45, DEF: 18, Épée bâtarde de vérité 2d6+4.
                      </p>
                    </div>
                    <div className="bg-[#1c0f29] p-3 rounded-lg border border-[#4c1d6f] space-y-1">
                      <b className="text-[#ff9d9d] text-sm">Le Malin (Boss Ultime de l'Obscure)</b>
                      <p className="text-[#d8b4fe]">
                        Entité tentatrice et corrompue (NC 12). PV: 110, DEF: 21, Attaque三重 de ténèbres et aura d'angoisse.
                      </p>
                    </div>
                    <div className="bg-[#1c0f29] p-3 rounded-lg border border-[#4c1d6f] space-y-1">
                      <b className="text-[#ff9d9d] text-sm">Tom Vador Ombrage (Antagoniste)</b>
                      <p className="text-[#d8b4fe]">
                        Seigneur de guerre renégat manipulé par l'Ombre. PV: 75, DEF: 19, Sabre noir 2d8+5.
                      </p>
                    </div>
                    <div className="bg-[#1c0f29] p-3 rounded-lg border border-[#4c1d6f] space-y-1">
                      <b className="text-[#a7f3d0] text-sm">Téo le Veilleur (Guide Mystique)</b>
                      <p className="text-[#d8b4fe]">
                        Érudit silencieux et éclaireur de l'Ombre. Connaît les passages secrets de Tharnéa et les rituels.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ==================== TABLE DE BUTIN ALÉATOIRE (D100) ==================== */}
      {activeTab === 'loot' && (() => {
        const filteredLoot = masterLootCatalog.filter((it) => {
          if (lootCategoryFilter !== 'all' && it.lootCategoryGroup !== lootCategoryFilter) return false;
          if (lootSearch && !(it.n + (it.desc || '') + (it.props || '') + (it.cat || '')).toLowerCase().includes(lootSearch.toLowerCase())) return false;
          return true;
        });

        return (
          <div className="space-y-4">
            {/* Header & Roll Action */}
            <div className="bg-gradient-to-r from-[#291712] via-[#1e130f] to-[#120f0c] border border-[#d4a84a]/60 rounded-xl p-5 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎲</span>
                    <h3 className="font-serif-co text-xl font-bold text-[#f3d48d]">
                      Table de Butin Aléatoire (d100)
                    </h3>
                  </div>
                  <p className="text-xs text-[#9e907d] mt-1">
                    Générez instantanément des trésors parmi l'intégralité des armes, armures, matériel, reliques de Tharnéa et les 12 bonbons alchimiques.
                  </p>
                </div>

                <button
                  onClick={handleRollRandomLoot}
                  className="px-6 py-3 bg-gradient-to-r from-[#d4a84a] via-[#f3d48d] to-[#ab8230] hover:brightness-110 text-black font-extrabold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Dices className="w-5 h-5 text-black" />
                  🎲 Tirer un Butin Aléatoire ({filteredLoot.length} objets)
                </button>
              </div>

              {/* Résultat du tirage en cours */}
              {rolledLoot && (
                <div className="bg-[#18120b] border-2 border-[#d4a84a] rounded-xl p-4.5 shadow-2xl space-y-3 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#42321e] pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 bg-[#d4a84a] text-black font-mono font-black text-sm rounded-lg shadow-sm">
                        N° #{rolledLoot.rollNumber}
                      </span>
                      <b className="font-serif-co text-lg text-[#f3d48d]">
                        {rolledLoot.item.n}
                      </b>
                      <span className="text-xs px-2 py-0.5 rounded font-bold bg-[#382718] text-[#f7d6a1] border border-[#593d25]">
                        {rolledLoot.item.cat || 'Équipement'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#9e907d]">
                        Tiré à {rolledLoot.date}
                      </span>
                      <span className="text-xs bg-[#241a12] text-[#f3d48d] border border-[#d4a84a]/50 px-2.5 py-1 rounded-lg font-bold">
                        Prix indicatif MJ : {rolledLoot.item.prix || 'Rare / Inestimable'}
                      </span>
                    </div>
                  </div>

                  {/* Détails stats de l'objet tiré */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {rolledLoot.item.dm && (
                      <div className="p-2 bg-[#231714] border border-[#4a261f] rounded-lg">
                        <span className="text-[10px] text-[#ff9999] block font-bold">Dégâts (DM)</span>
                        <b className="text-[#ffe0e0] font-mono">{rolledLoot.item.dm} {rolledLoot.item.crit && `(Crit ${rolledLoot.item.crit})`}</b>
                      </div>
                    )}
                    {rolledLoot.item.def !== undefined && (
                      <div className="p-2 bg-[#172418] border border-[#2b4d2c] rounded-lg">
                        <span className="text-[10px] text-[#8ce08e] block font-bold">Protection</span>
                        <b className="text-[#e2ffe0] font-mono">+{rolledLoot.item.def} DEF</b>
                      </div>
                    )}
                    {rolledLoot.item.por && (
                      <div className="p-2 bg-[#171d29] border border-[#263754] rounded-lg">
                        <span className="text-[10px] text-[#93bbff] block font-bold">Portée</span>
                        <b className="text-[#e0edff]">{rolledLoot.item.por}</b>
                      </div>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-[#ede3d1] leading-relaxed">
                    {rolledLoot.item.desc || rolledLoot.item.props}
                  </p>

                  {rolledLoot.item.effetSecondaire && (
                    <div className="p-2.5 bg-[#2b172b] border border-[#6b256b] rounded-lg text-xs text-[#f5b8f5]">
                      ⚠️ <b>Effet Bizarre :</b> {rolledLoot.item.effetSecondaire}
                    </div>
                  )}

                  {/* Actions de distribution */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#332517]">
                    <button
                      onClick={() => setDetailItem({ type: 'equipment', data: rolledLoot.item })}
                      className="px-3 py-1.5 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-xs font-semibold text-[#f3d48d] rounded-lg flex items-center gap-1.5"
                    >
                      <Info className="w-3.5 h-3.5" /> Fiche Détaillée
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#9e907d]">Donner ce butin à :</span>
                      <select
                        value={targetPjForLoot}
                        onChange={(e) => setTargetPjForLoot(e.target.value)}
                        className="px-2.5 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
                      >
                        <option value="">-- Choisir un Héros --</option>
                        {tableData.pjs.map((p) => (
                          <option key={p.id || p.name} value={p.id || p.name}>
                            {p.name} (Niv. {p.level} {p.profil})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleGiveLootToPj(rolledLoot.item)}
                        className="px-4 py-1.5 bg-[#6fa85b] hover:bg-[#7ebd67] text-black font-bold text-xs rounded-lg shadow-sm"
                      >
                        + Ajouter au Sac du PJ
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Historique des tirages récents */}
              {lootHistory.length > 0 && (
                <div className="pt-2 border-t border-[#332517] space-y-1.5">
                  <span className="text-[10px] font-bold text-[#9e907d] uppercase tracking-wider block">
                    Historique des tirages de la session :
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {lootHistory.map((h, i) => (
                      <button
                        key={i}
                        onClick={() => setRolledLoot(h)}
                        className="text-[11px] px-2.5 py-1 bg-[#1c1611] hover:bg-[#2b2118] border border-[#3d3023] text-[#ede3d1] rounded-md flex items-center gap-1.5 font-mono"
                      >
                        <span className="text-[#d4a84a] font-bold">#{h.rollNumber}</span>
                        <span className="text-left truncate max-w-[140px]">{h.item.n}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Barre de Filtres et Recherche de la Table */}
            <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-[#9e907d] absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Filtrer la table par nom, catégorie, effet..."
                    value={lootSearch}
                    onChange={(e) => setLootSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] focus:border-[#d4a84a] outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                  {[
                    { id: 'all', label: `Tous (${masterLootCatalog.length})` },
                    { id: 'armes', label: 'Armes' },
                    { id: 'armures', label: 'Protections' },
                    { id: 'biens', label: 'Biens & Matériel' },
                    { id: 'tharnea', label: 'Artéfacts Tharnéa' },
                    { id: 'bonbons', label: '🍬 Bonbons & Boîte (36)' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setLootCategoryFilter(cat.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        lootCategoryFilter === cat.id
                          ? 'bg-[#d4a84a] text-black shadow-sm'
                          : 'bg-[#231c15] text-[#9e907d] hover:text-[#ede3d1] border border-[#30251a]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table numérotée exhaustive */}
              <div className="overflow-x-auto border border-[#30251a] rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#231c15] text-[#d4a84a] border-b border-[#30251a]">
                      <th className="p-2.5 font-bold font-mono text-center w-12">N°</th>
                      <th className="p-2.5 font-bold">Objet &amp; Description</th>
                      <th className="p-2.5 font-bold">Catégorie</th>
                      <th className="p-2.5 font-bold">Dégâts / DEF / Effet</th>
                      <th className="p-2.5 font-bold text-center">Prix MJ</th>
                      <th className="p-2.5 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#261c14]">
                    {filteredLoot.map((it) => (
                      <tr
                        key={it.lootIndex}
                        className="hover:bg-[#231c15]/70 transition-colors group"
                      >
                        <td className="p-2.5 text-center font-mono font-bold text-[#d4a84a]">
                          #{it.lootIndex}
                        </td>
                        <td className="p-2.5">
                          <b className="text-[#ede3d1] group-hover:text-[#f3d48d] transition-colors block">
                            {it.n}
                          </b>
                          <p className="text-[11px] text-[#9e907d] line-clamp-1">
                            {it.desc || it.props}
                          </p>
                        </td>
                        <td className="p-2.5">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                            it.source === 'tharnea'
                              ? 'bg-[#3b174a] text-[#f0abfc] border-[#6b21a8]'
                              : 'bg-[#261e16] text-[#f3d48d] border-[#473420]'
                          }`}>
                            {it.cat || 'Équipement'}
                          </span>
                        </td>
                        <td className="p-2.5 text-[11px]">
                          {it.dm && <span className="text-[#ff9999] font-mono font-bold">DM : {it.dm} </span>}
                          {it.def !== undefined && <span className="text-[#72d472] font-mono font-bold">+{it.def} DEF </span>}
                          {it.por && <span className="text-[#99bbff] font-mono">Portée : {it.por} </span>}
                          {it.isPack && <span className="text-[#f3d48d] font-bold">🎒 Pack Complet</span>}
                        </td>
                        <td className="p-2.5 text-center font-mono text-xs font-bold text-[#f3d48d]">
                          {it.prix || 'Sur mesure'}
                        </td>
                        <td className="p-2.5 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => setDetailItem({ type: 'equipment', data: it })}
                            className="p-1.5 rounded bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-[#f3d48d] inline-flex items-center"
                            title="Voir la fiche détaillée"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                          {tableData.pjs.length > 0 && (
                            <button
                              onClick={() => handleGiveLootToPj(it, tableData.pjs[0].id || tableData.pjs[0].name)}
                              className="px-2 py-1 rounded bg-[#382b1b] hover:bg-[#4d3b25] border border-[#5a4227] text-white text-[10px] font-bold inline-flex items-center gap-1"
                              title={`Donner à ${tableData.pjs[0].name}`}
                            >
                              + Donner
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ==================== 4. ÉQUIPEMENTS (DRS + THARNÉA) ==================== */}
      {activeTab === 'equipements' && (() => {
        const fullEquipements = isTharneaActive ? [...THARNEA_ARTIFACTS, ...EQUIPEMENTS] : EQUIPEMENTS;

        return (
          <div className="space-y-4">
            <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">
                    Catalogue des Biens, Équipements {isTharneaActive ? '& Artéfacts' : ''}
                  </h3>
                  <span className="text-xs text-[#9e907d]">
                    Objets répertoriés : <b className="text-[#ede3d1]">{fullEquipements.length}</b> (DRS: {EQUIPEMENTS.length}{isTharneaActive ? ` · Tharnéa: ${THARNEA_ARTIFACTS.length}` : ''})
                  </span>
                </div>

                {isTharneaActive && (
                  <div className="flex items-center gap-1 bg-[#120f0c] p-1 rounded-lg border border-[#3d3023]">
                    <button
                      type="button"
                      onClick={() => setEqSourceFilter('all')}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                        eqSourceFilter === 'all'
                          ? 'bg-[#d4a84a] text-black shadow-xs'
                          : 'text-[#9e907d] hover:text-[#ede3d1]'
                      }`}
                    >
                      Tous ({fullEquipements.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setEqSourceFilter('drs')}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                        eqSourceFilter === 'drs'
                          ? 'bg-[#d4a84a] text-black shadow-xs'
                          : 'text-[#9e907d] hover:text-[#ede3d1]'
                      }`}
                    >
                      DRS Officiel ({EQUIPEMENTS.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setEqSourceFilter('tharnea')}
                      className={`px-3 py-1 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                        eqSourceFilter === 'tharnea'
                          ? 'bg-[#8a2d75] text-white shadow-xs'
                          : 'text-[#cca3c7] hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-[#ff8fed]" />
                      <span>Tharnéa ({THARNEA_ARTIFACTS.length})</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#30251a]">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-[#9e907d] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Rechercher arme, armure, tente, artéfact, bonbon..."
                    value={eqSearch}
                    onChange={(e) => setEqSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
                  />
                </div>

                <select
                  value={eqCatFilter}
                  onChange={(e) => setEqCatFilter(e.target.value)}
                  className="px-3 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
                >
                  <option value="">Toutes les catégories</option>
                  {isTharneaActive && (
                    <>
                      <option value="Boîte à Bonbons">🎁 Boîte à Bonbons de l'Obscure (36 bonbons)</option>
                      <option value="Bonbon Alchimique">🍬 Bonbons Alchimiques</option>
                      <option value="Artéfact Majeur">🔮 Artéfacts Majeurs</option>
                      <option value="Talisman & Relique">Talismans &amp; Reliques</option>
                      <option disabled>──────────</option>
                    </>
                  )}
                  <option value="Armes Contact">Armes Contact</option>
                  <option value="Armes Distance">Armes Distance</option>
                  <option value="Armes Poudre">Armes Poudre</option>
                  <option value="Armures">Armures</option>
                  <option value="Boucliers">Boucliers</option>
                  <option value="Campement">Campement &amp; Tentes</option>
                  <option value="Aventure">Matériel d'aventure</option>
                  <option value="Auberge">Auberge &amp; Vivres</option>
                  <option value="Logement">Logement</option>
                  <option value="Montures">Montures</option>
                  <option value="Véhicules">Véhicules</option>
                  <option value="Immobilier">Immobilier</option>
                </select>

                {(eqSearch || eqCatFilter || eqSourceFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setEqSearch('');
                      setEqCatFilter('');
                      setEqSourceFilter('all');
                    }}
                    className="px-2.5 py-1 text-xs text-[#9e907d] hover:text-[#ede3d1]"
                  >
                    Effacer
                  </button>
                )}
              </div>
            </div>

            <div className="bg-[#181410] border border-[#3d3023] rounded-xl overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#3d3023] bg-[#120f0c] text-[#f3d48d]">
                    <th className="p-3">Nom</th>
                    <th className="p-3">Catégorie</th>
                    <th className="p-3">Prix</th>
                    <th className="p-3">DM / DEF / Propriétés &amp; Effets</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#261f18]">
                  {fullEquipements
                    .filter((it) => {
                      const isTharneaItem = it.source === 'tharnea' || !!it.source?.toLowerCase().includes('tharnea');
                      if (eqSourceFilter === 'drs') return !isTharneaItem;
                      if (eqSourceFilter === 'tharnea') return isTharneaItem;
                      return true;
                    })
                    .filter((it) => {
                      const matchQ = (
                        it.n +
                        (it.cat || '') +
                        (it.desc || '') +
                        (it.prix || '') +
                        (it.effetSecondaire || '')
                      )
                        .toLowerCase()
                        .includes(eqSearch.toLowerCase());
                      const matchCat =
                        !eqCatFilter ||
                        (eqCatFilter === 'Boîte à Bonbons'
                          ? it.n.toLowerCase().includes('bonbon') && (it.n.toLowerCase().includes('boîte') || it.n.toLowerCase().includes('boite'))
                          : it.cat?.includes(eqCatFilter));
                      return matchQ && matchCat;
                    })
                    .map((it, idx) => {
                      const isTharnea = it.source === 'tharnea' || !!it.source?.toLowerCase().includes('tharnea');

                      return (
                        <tr
                          key={idx}
                          onClick={() =>
                            setDetailItem({
                              type: 'equipment',
                              data: it,
                            })
                          }
                          className={`transition-colors cursor-pointer group ${
                            isTharnea ? 'hover:bg-[#281324] bg-[#180e16]/40' : 'hover:bg-[#2e2318]'
                          }`}
                          title="Cliquez pour ouvrir la fiche détaillée en Pop-up"
                        >
                          <td className="p-3 font-semibold text-[#ede3d1] group-hover:text-[#f3d48d]">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {it.couleur && (
                                <span
                                  className="w-3 h-3 rounded-full border border-white/50 shrink-0"
                                  style={{ backgroundColor: it.couleur }}
                                />
                              )}
                              <span>{it.n}</span>
                              {isTharnea && (
                                <span className="text-[9px] bg-[#5e194f] text-[#ffddfa] px-1 rounded font-bold">
                                  Tharnéa
                                </span>
                              )}
                              <Info className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-[#d4a84a] transition-opacity" />
                            </div>
                          </td>
                          <td className="p-3">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                isTharnea
                                  ? 'bg-[#3b1235] text-[#ffbdf4] border border-[#78286a]'
                                  : 'bg-[#1e2f47] text-[#b0d7ff]'
                              }`}
                            >
                              {it.cat || '-'}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-[#f3d48d]">
                            {it.prix || '-'}
                          </td>
                          <td className="p-3 text-[#9e907d]">
                            {it.dm && <b className="text-[#ede3d1]">DM: {it.dm} • </b>}
                            {it.def && <b className="text-[#6fa85b]">+{it.def} DEF • </b>}
                            <span>{it.desc}</span>
                            {it.effetSecondaire && (
                              <span className="block text-[11px] text-[#ff9fc8] italic mt-0.5">
                                ⚠️ {it.effetSecondaire}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* ==================== 5. RÈGLES & ÉTATS ==================== */}
      {activeTab === 'regles' && (
        <div className="space-y-4">
          <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">
                  Règles du DRS &amp; États Préjudiciables
                </h3>
                <span className="text-xs text-[#9e907d]">
                  13 États officiels &amp; 29 Chapitres de règles complets
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#30251a]">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-[#9e907d] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Rechercher dans les règles, agonie, couvert, saut, poison..."
                  value={regSearch}
                  onChange={(e) => setRegSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
                />
              </div>

              <select
                value={regCatFilter}
                onChange={(e) => setRegCatFilter(e.target.value)}
                className="px-3 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
              >
                <option value="">Toutes les sections</option>
                <option value="etats">États préjudiciables uniquement</option>
                <option value="Création">Création de perso</option>
                <option value="Actions">Actions &amp; Tests</option>
                <option value="Combat">Combat &amp; Blessures</option>
                <option value="Aventure">Aventure &amp; Exploration</option>
                <option value="Règles Avancées">Règles Avancées (PC, PM, Prestige)</option>
              </select>

              {(regSearch || regCatFilter) && (
                <button
                  onClick={() => {
                    setRegSearch('');
                    setRegCatFilter('');
                  }}
                  className="px-2.5 py-1 text-xs text-[#9e907d] hover:text-[#ede3d1]"
                >
                  Effacer
                </button>
              )}
            </div>
          </div>

          {/* États Section */}
          {(!regCatFilter || regCatFilter === 'etats') && (
            <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#30251a] pb-3">
                <div>
                  <h4 className="font-serif-co text-lg font-bold text-[#f3d48d] flex items-center gap-2">
                    <span>⚠️</span> Les 13 États Préjudiciables (Guide Complet MJ)
                  </h4>
                  <p className="text-xs text-[#9e907d]">
                    Règles exhaustives avec explications : Quand, Comment (mécanique), Pourquoi (justification en jeu) et Comment en guérir.
                  </p>
                </div>
                <span className="text-xs font-bold font-mono px-2.5 py-1 bg-[#231c15] text-[#f3d48d] border border-[#3d3023] rounded-lg">
                  13 États Répertoriés
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {ETATS.filter((e) =>
                  ((e.n || '') + (e.t || '') + (e.quand || '') + (e.comment || '')).toLowerCase().includes(regSearch.toLowerCase())
                ).map((e, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#231c15] border border-[#3d3023] hover:border-[#d4a84a] rounded-xl text-xs space-y-3 transition-colors shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl select-none">{e.icon || '⚠️'}</span>
                        <div>
                          <b className="text-[#f3d48d] text-base font-serif-co">
                            {e.n}
                          </b>
                          {e.impactCourt && (
                            <span className="ml-2 text-[10px] bg-[#3a1d1d] text-[#ffb8b8] px-2 py-0.5 rounded font-bold border border-[#592626]">
                              ⚡ {e.impactCourt}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setDetailItem({ type: 'state', data: e })}
                        className="px-2.5 py-1 bg-[#181410] hover:bg-[#2b2118] border border-[#3d3023] text-[#f3d48d] rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Info className="w-3.5 h-3.5" /> Fiche Pop-up
                      </button>
                    </div>

                    <p className="text-[#ede3d1] text-xs leading-relaxed bg-[#181410] p-2.5 rounded-lg border border-[#30251a]">
                      <b>Énoncé Officiel DRS :</b> {e.t}
                    </p>

                    {/* Les 4 Piliers Détaillés */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 bg-[#1a1511] border border-[#3d2b1a] rounded-lg space-y-0.5">
                        <b className="text-[#f3d48d] block font-bold">🕒 Quand s'applique-t-il ?</b>
                        <p className="text-[#ede3d1]">{e.quand}</p>
                      </div>

                      <div className="p-2.5 bg-[#141724] border border-[#2b3559] rounded-lg space-y-0.5">
                        <b className="text-[#9bb8ff] block font-bold">🎲 Comment s'applique-t-il ? (Mécanique)</b>
                        <p className="text-[#ede3d1]">{e.comment}</p>
                      </div>

                      <div className="p-2.5 bg-[#1f141f] border border-[#4d254d] rounded-lg space-y-0.5">
                        <b className="text-[#f0a6f0] block font-bold">🧬 Pourquoi ? (Justification en jeu)</b>
                        <p className="text-[#ede3d1]">{e.pourquoi}</p>
                      </div>

                      <div className="p-2.5 bg-[#142115] border border-[#234724] rounded-lg space-y-0.5">
                        <b className="text-[#8be391] block font-bold">🌿 Comment en guérir / s'en libérer ?</b>
                        <p className="text-[#ede3d1]">{e.guerison}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Règles Section */}
          {regCatFilter !== 'etats' && (
            <div className="space-y-2.5">
              {REGLES.filter((r) => {
                const matchQ = (r.t + r.c + (r.cat || '')).toLowerCase().includes(regSearch.toLowerCase());
                const matchCat = !regCatFilter || r.cat === regCatFilter;
                return matchQ && matchCat;
              }).map((r, idx) => (
                <details
                  key={idx}
                  open
                  className="bg-[#181410] border border-[#3d3023] rounded-xl overflow-hidden"
                >
                  <summary className="px-4 py-3 cursor-pointer hover:bg-[#231c15] flex items-center justify-between select-none">
                    <div className="flex items-center gap-2">
                      <b className="font-serif-co text-sm text-[#f3d48d]">{r.t}</b>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailItem({ type: 'rule', data: r });
                        }}
                        className="p-1 rounded text-[#9e907d] hover:text-[#d4a84a]"
                        title="Ouvrir la règle en Pop-up"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#d4a84a]" />
                      </button>
                    </div>
                    <span className="text-[10px] bg-[#382b1b] text-[#f3d48d] px-2 py-0.5 rounded font-bold border border-[#523d24]">
                      {r.cat}
                    </span>
                  </summary>
                  <div className="p-4 pt-1 border-t border-[#30251a] text-xs text-[#ede3d1] leading-relaxed">
                    {r.c}
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== 6. RACES ==================== */}
      {activeTab === 'races' && (
        <div className="space-y-3">
          <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4">
            <h3 className="font-serif-co text-lg font-bold text-[#f3d48d] mb-1">
              Races Jouables du DRS
            </h3>
            <p className="text-xs text-[#9e907d]">
              Guide résumé des ascendances et modificateurs raciaux. Cliquez sur une race pour ouvrir sa fiche officielle complète en pop-up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {RACES.map((r) => (
              <div
                key={r.id}
                onClick={() => setDetailItem({ type: 'race', data: r })}
                className="cursor-pointer p-4 bg-[#181410] hover:bg-[#201913] border border-[#3d3023] hover:border-[#d4a84a] rounded-xl space-y-2.5 flex flex-col justify-between transition-all shadow-sm"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <b className="font-serif-co text-base text-[#f3d48d] hover:underline flex items-center gap-1.5">
                      <span>{r.n}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#d4a84a]" />
                    </b>
                    <span className="text-xs font-mono font-bold text-[#6fa85b] bg-[#122410] px-2 py-0.5 rounded border border-[#274721]">
                      {r.t}
                    </span>
                  </div>
                  <p className="text-xs text-[#ede3d1] line-clamp-2">{r.d}</p>
                  <div className="text-[11px] text-[#9e907d] italic">
                    Tempérament : {r.traits}
                  </div>
                  <div className="text-[11px] text-[#cbafff]">
                    ✨ {r.cap.length} capacité{r.cap.length > 1 ? 's' : ''} raciale{r.cap.length > 1 ? 's' : ''} officielles (co-drs.org)
                  </div>
                </div>

                <div className="pt-2 border-t border-[#30251a] flex items-center justify-between text-xs text-[#d4a84a]">
                  <span className="font-semibold">Ouvrir la fiche complète (Pop-up)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== 7. PROFILS (CLASSES) ==================== */}
      {activeTab === 'profils' && (
        <div className="space-y-3">
          <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4">
            <h3 className="font-serif-co text-lg font-bold text-[#f3d48d] mb-1">
              14 Profils &amp; Vocations Martiales
            </h3>
            <p className="text-xs text-[#9e907d]">
              Fiches résumées des profils. Cliquez sur un profil pour ouvrir sa fiche officielle complète en pop-up (dé de vie, équipement, armes et 5 voies).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PROFILS.map((p) => (
              <div
                key={p.id}
                onClick={() => setDetailItem({ type: 'profil', data: p })}
                className="cursor-pointer p-4 bg-[#181410] hover:bg-[#201913] border border-[#3d3023] hover:border-[#d4a84a] rounded-xl space-y-2.5 flex flex-col justify-between transition-all shadow-sm"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <b className="font-serif-co text-base text-[#f3d48d] hover:underline flex items-center gap-1.5">
                      <span>{p.n}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#d4a84a]" />
                    </b>
                    <span className="text-xs font-mono font-bold text-[#cbafff] bg-[#291b3b] px-2 py-0.5 rounded border border-[#492d6e]">
                      Dé de vie : d{p.dv} {p.mag ? `• Magie ${p.mag}` : ''}
                    </span>
                  </div>
                  <p className="text-xs text-[#ede3d1] italic line-clamp-2">« {p.traits} »</p>
                  <div className="text-xs text-[#9e907d] space-y-0.5">
                    <div className="truncate">
                      <b className="text-[#ede3d1]">Armes autorisées :</b> {p.ar}
                    </div>
                    <div className="truncate">
                      <b className="text-[#ede3d1]">Équipement de départ :</b> {p.eq}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#30251a] flex items-center justify-between text-xs text-[#d4a84a]">
                  <span className="font-semibold">Ouvrir la fiche complète &amp; les 5 voies (Pop-up)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== 8. VOIES & CAPACITÉS ==================== */}
      {activeTab === 'voies' && (
        <div className="space-y-4">
          <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">
                  Encyclopédie des 70 Voies Héroïques (350 Rangs)
                </h3>
                <p className="text-xs text-[#9e907d]">
                  Consultez l'arbre complet des voies par profil ou effectuez une recherche globale.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#30251a]">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#9e907d] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Rechercher une voie ou un pouvoir..."
                  value={voieSearch}
                  onChange={(e) => setVoieSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-[#9e907d] whitespace-nowrap">Profil :</label>
                <select
                  value={voiesProfilFilter}
                  onChange={(e) => setVoiesProfilFilter(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none cursor-pointer"
                >
                  <option value="all">Tous les profils (70 voies)</option>
                  {PROFILS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.n}
                    </option>
                  ))}
                  <option value="race">Voies Raciales</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {Object.entries(VOIES_CATALOG)
              .filter(([k, v]) => {
                if (voiesProfilFilter !== 'all') {
                  if (voiesProfilFilter === 'race') return v.profil.startsWith('race:');
                  return v.profil.toLowerCase() === voiesProfilFilter.toLowerCase();
                }
                return true;
              })
              .filter(([k, v]) =>
                (v.nom + v.profil + v.r.map((r) => r.n + r.t).join(' ')).toLowerCase().includes(voieSearch.toLowerCase())
              )
              .map(([wKey, way]) => (
                <details
                  key={wKey}
                  className="bg-[#181410] border border-[#3d3023] rounded-xl overflow-hidden"
                >
                  <summary className="px-4 py-3 cursor-pointer hover:bg-[#231c15] flex items-center justify-between select-none font-serif-co font-bold text-[#f3d48d]">
                    <span>
                      {way.nom}{' '}
                      <span className="text-xs font-sans text-[#9e907d] font-normal">
                        ({way.profil})
                      </span>
                    </span>
                    <span className="text-xs text-[#9e907d] font-sans font-normal">
                      {way.r.length} rangs
                    </span>
                  </summary>

                  <div className="p-4 pt-1 border-t border-[#30251a] space-y-2">
                    {way.r.map((rk, idx) => (
                      <div
                        key={idx}
                        onClick={() =>
                          setDetailItem({
                            type: 'wayRank',
                            data: {
                              wayName: way.nom,
                              className: way.profil,
                              profile: way.profil,
                              rankNum: idx + 1,
                              n: rk.n,
                              t: rk.t,
                              L: rk.L,
                              S: rk.S,
                              rank: {
                                rang: idx + 1,
                                nom: rk.n,
                                description: rk.t,
                                isLimited: rk.L,
                                isSpell: rk.S,
                              },
                            },
                          })
                        }
                        className="p-2.5 bg-[#231c15] hover:bg-[#2d2319] border border-[#3d3023] hover:border-[#d4a84a] rounded-lg text-xs cursor-pointer transition-colors group"
                        title="Cliquez pour ouvrir la fiche détaillée du rang"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <b className="text-[#f3d48d] group-hover:text-[#ffe099] flex items-center gap-1.5">
                            Rang {idx + 1} : {rk.n}{' '}
                            <Info className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 text-[#d4a84a]" />
                          </b>
                          <div className="flex items-center gap-1">
                            {rk.L ? (
                              <span className="text-[9px] bg-[#4a1c1d] text-[#ffb8b8] px-1.5 py-0.2 rounded font-bold">
                                Limitée
                              </span>
                            ) : null}
                            {rk.S ? (
                              <span className="text-[9px] bg-[#1e2f47] text-[#b0d7ff] px-1.5 py-0.2 rounded font-bold">
                                Sort
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <p className="text-[#ede3d1]">{rk.t}</p>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
          </div>
        </div>
      )}

      {/* ==================== 9. GRIMOIRE DRS ==================== */}
      {activeTab === 'grimoire' && (
        <div className="space-y-4">
          <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-3">
            <h3 className="font-serif-co text-lg font-bold text-[#cbafff]">
              Grimoire Global du DRS
            </h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#9e907d] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Rechercher sortilège, dégâts, rayon, projectile..."
                value={grimSearch}
                onChange={(e) => setGrimSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            {SORTS_CATALOG.filter((s) =>
              (s.n + s.t + (s.voie || '')).toLowerCase().includes(grimSearch.toLowerCase())
            ).map((s, idx) => (
              <div
                key={idx}
                onClick={() => setDetailItem({ type: 'spell', data: s })}
                className="p-3.5 bg-[#181410] hover:bg-[#201824] border-l-4 border-l-[#3a69a1] border border-[#3d3023] hover:border-[#cbafff] rounded-lg space-y-1 cursor-pointer transition-colors group"
                title="Cliquez pour ouvrir la fiche du sort en Pop-up"
              >
                <div className="flex items-center justify-between">
                  <b className="text-[#cbafff] group-hover:text-[#e4d4ff] text-sm flex items-center gap-1.5">
                    {s.n} <Info className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 text-[#cbafff]" />
                  </b>
                  <span className="text-[10px] bg-[#291b3b] text-[#dccbff] px-2 py-0.5 rounded font-bold border border-[#492d6e]">
                    Rang {s.rang} • {s.portee}
                  </span>
                </div>
                <div className="text-[11px] text-[#9e907d]">
                  Voie : {s.voie || 'Magie'} • Durée : {s.duree || 'Instantané'}
                </div>
                <p className="text-xs text-[#ede3d1]">{s.t}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== MODAL COMBATTANT SUR MESURE ==================== */}
      {isAddCombatantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#181410] border border-[#d4a84a] rounded-xl w-full max-w-md shadow-2xl p-5 space-y-3">
            <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">
              Ajouter un Combattant à la Piste
            </h3>

            <div>
              <label className="text-xs font-bold uppercase text-[#9e907d] block mb-1">
                Nom du combattant *
              </label>
              <input
                type="text"
                placeholder="Ex: Chef Bandit, Renfort Garde..."
                value={newCombatantName}
                onChange={(e) => setNewCombatantName(e.target.value)}
                className="w-full px-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-bold uppercase text-[#9e907d] block mb-1">
                  PV Max
                </label>
                <input
                  type="number"
                  min="1"
                  value={newCombatantHp}
                  onChange={(e) => setNewCombatantHp(parseInt(e.target.value) || 1)}
                  className="w-full px-2 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] text-center font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#9e907d] block mb-1">
                  Défense
                </label>
                <input
                  type="number"
                  min="5"
                  value={newCombatantDef}
                  onChange={(e) => setNewCombatantDef(parseInt(e.target.value) || 10)}
                  className="w-full px-2 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] text-center font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#9e907d] block mb-1">
                  Base Init
                </label>
                <input
                  type="number"
                  value={newCombatantInit}
                  onChange={(e) => setNewCombatantInit(parseInt(e.target.value) || 10)}
                  className="w-full px-2 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] text-center font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#9e907d] block mb-1">
                Type
              </label>
              <select
                value={newCombatantIsPj ? '1' : '0'}
                onChange={(e) => setNewCombatantIsPj(e.target.value === '1')}
                className="w-full px-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
              >
                <option value="0">Monstre / Adversaire / PNJ</option>
                <option value="1">Personnage Joueur (PJ)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#9e907d] block mb-1">
                Attaques &amp; Notes
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Épée +4 (1d8+2) • Rage de berserk..."
                value={newCombatantNotes}
                onChange={(e) => setNewCombatantNotes(e.target.value)}
                className="w-full px-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsAddCombatantOpen(false)}
                className="px-4 py-2 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-xs font-semibold text-[#ede3d1] rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleAddCustomCombatant}
                className="px-5 py-2 bg-[#d4a84a] hover:bg-[#e0b555] text-black font-bold text-xs rounded-lg shadow-md"
              >
                Ajouter au Combat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== PNJ CREATOR MODAL (MJ) ==================== */}
      <PnjCreatorModal
        isOpen={isPnjCreatorOpen}
        onClose={() => setIsPnjCreatorOpen(false)}
        onSave={handleSavePnj}
      />

      {/* ==================== CHARACTER SHEET MODAL (POP-UP) ==================== */}
      <CharacterSheetModal
        pj={selectedCharacterModal}
        isOpen={!!selectedCharacterModal}
        onClose={() => setSelectedCharacterModal(null)}
        onToggleState={(stName) => {
          if (!selectedCharacterModal) return;
          const list = tableData.pjs.map((p) => {
            if (p.id === selectedCharacterModal.id || p.name === selectedCharacterModal.name) {
              const cur = p.etats || [];
              const updated = cur.includes(stName) ? cur.filter((s) => s !== stName) : [...cur, stName];
              const nextPj = { ...p, etats: updated };
              setSelectedCharacterModal(nextPj);
              return nextPj;
            }
            return p;
          });
          onUpdateTableData({ ...tableData, pjs: list });
        }}
      />

      {/* ==================== UNIVERSAL POP-UP DETAIL MODAL ==================== */}
      <DetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onAction={(action, data) => {
          if (action === 'send_to_combat') {
            addMonsterToCombat(data);
          }
        }}
      />

      {/* ==================== MODAL COLLER CODE FICHE JOUEUR (TÉLÉPHONE -> PC) ==================== */}
      {isImportCodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#181410] border-2 border-[#7db5ff] rounded-2xl w-full max-w-lg shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#30251a] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#7db5ff]/20 text-[#7db5ff] border border-[#7db5ff]/40">
                  <ClipboardPaste className="w-5 h-5 text-[#7db5ff]" />
                </div>
                <div>
                  <h3 className="font-serif-co text-lg font-bold text-[#b5d6ff]">
                    Coller une Fiche Joueur (Transfert Téléphone)
                  </h3>
                  <p className="text-xs text-[#a0907d]">
                    Importez instantanément un personnage envoyé par un joueur
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsImportCodeModalOpen(false)}
                className="p-1.5 rounded-lg text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#231c15] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#cbb8a7]">
              <p>
                Collez ici le code de transfert copié par le joueur depuis son téléphone :
              </p>
              <textarea
                rows={5}
                value={transferCodeInput}
                onChange={(e) => setTransferCodeInput(e.target.value)}
                placeholder="Collez le code de transfert ici..."
                className="w-full p-3 bg-[#0d0a08] border border-[#3d3023] focus:border-[#7db5ff] rounded-xl font-mono text-xs text-[#7db5ff] outline-hidden"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#30251a]">
              <button
                onClick={() => setIsImportCodeModalOpen(false)}
                className="px-4 py-2 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-xs font-semibold text-[#ede3d1] rounded-xl cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  try {
                    const raw = transferCodeInput.trim();
                    if (!raw) return;
                    let decodedStr = raw;
                    if (!raw.startsWith('{')) {
                      decodedStr = decodeURIComponent(escape(atob(raw)));
                    }
                    const parsed = JSON.parse(decodedStr);
                    const hero = parsed.hero || parsed;
                    if (!hero.name || !hero.profil) {
                      alert('Code invalide ou personnage incomplet.');
                      return;
                    }
                    const list = [...tableData.pjs];
                    const existingIdx = list.findIndex(
                      (p) => (p.id && p.id === hero.id) || p.name.toLowerCase() === hero.name.toLowerCase()
                    );
                    if (existingIdx >= 0) {
                      list[existingIdx] = hero;
                    } else {
                      list.push(hero);
                    }
                    onUpdateTableData({ ...tableData, pjs: list });
                    setIsImportCodeModalOpen(false);
                    setTransferCodeInput('');
                    alert(`✅ Héros "${hero.name}" (${hero.race} ${hero.profil}) intégré avec succès à votre table !`);
                  } catch (err: any) {
                    alert('Erreur lors du décodage : ' + err.message);
                  }
                }}
                className="px-5 py-2 bg-gradient-to-r from-[#3a6fa8] to-[#254b73] hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Intégrer le Héros à la Table
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
