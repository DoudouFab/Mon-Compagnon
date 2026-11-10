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
          // Fusionne ou met à jour la liste des pjs dans tableData si besoin
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
      list.push({ ...item, lootIndex: idx++, lootCategoryGroup: 'armures
