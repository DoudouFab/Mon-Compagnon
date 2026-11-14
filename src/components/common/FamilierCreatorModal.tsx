import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Shield,
  Swords,
  Sparkles,
  Link2,
  Heart,
  Zap,
  Check,
  Footprints,
} from 'lucide-react';
import { CaracName, Character, Combatant, WeaponItem } from '../../types/chroniques';
import { CARAC_LIST, getMod } from '../../data/coDatabase';
import {
  FAMILIERS_PRESETS,
  FamilierCategorie,
  FamilierPreset,
  createFamilierFromPreset,
} from '../../data/familiersCatalog';
import { buildFamilierPortraitDataUrl } from '../../utils/fantasyPortraitGenerator';
import { PortraitPicker } from './PortraitPicker';
import { useToast } from './ToastContext';

interface FamilierCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (familierChar: Character, combatant: Combatant | null, isEdit: boolean) => void;
  mastersList?: Character[];
  defaultMaster?: { id?: string; name: string } | null;
  editingFamilier?: Character | null;
  isMj?: boolean;
}

const DEFAULT_FAM_CARACS: Record<CaracName, number> = {
  FOR: 8,
  DEX: 15,
  CON: 12,
  INT: 10,
  SAG: 13,
  CHA: 12,
};

const CATEGORIES: FamilierCategorie[] = [
  'Compagnon Rôdeur',
  'Arcanique',
  'Éclaireur',
  'Compagnon Animal',
  'Exotique',
  'Monture',
];

export const FamilierCreatorModal: React.FC<FamilierCreatorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  mastersList = [],
  defaultMaster = null,
  editingFamilier = null,
  isMj = true,
}) => {
  const { warning, info } = useToast();

  const [presetCatFilter, setPresetCatFilter] = useState<'all' | FamilierCategorie>('all');
  const [presetSousFamilleFilter, setPresetSousFamilleFilter] = useState<'all' | 'Félin' | 'Canidé' | 'Rapace'>('all');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(FAMILIERS_PRESETS[0].id);

  const [name, setName] = useState('');
  const [espece, setEspece] = useState('Corbeau');
  const [categorie, setCategorie] = useState<FamilierCategorie>('Éclaireur');
  const [rolePnj, setRolePnj] = useState<'Familier' | 'Compagnon'>('Familier');
  const [level, setLevel] = useState(1);
  const [masterKey, setMasterKey] = useState<string>('');
  const [caracs, setCaracs] = useState<Record<CaracName, number>>({ ...DEFAULT_FAM_CARACS });
  const [hp, setHp] = useState(8);
  const [hpMax, setHpMax] = useState(8);
  const [def, setDef] = useState(15);
  const [pmMax, setPmMax] = useState(2);
  const [pmCurrent, setPmCurrent] = useState(2);
  const [vitesse, setVitesse] = useState('Vol 18 m · Sol 4 m');
  const [taille, setTaille] = useState('40 cm');
  const [poids, setPoids] = useState('1,2 kg');
  const [age, setAge] = useState('3 ans');
  const [armes, setArmes] = useState<WeaponItem[]>([]);
  const [capacitesSpeciales, setCapacitesSpeciales] = useState<{ n: string; t: string }[]>([]);
  const [notes, setNotes] = useState('');
  const [portrait, setPortrait] = useState<string | undefined>(undefined);
  const [addToCombat, setAddToCombat] = useState(false);

  const eligibleMasters = useMemo(
    () => mastersList.filter((m) => !m.isFamilier),
    [mastersList]
  );

  const findMasterKey = (id?: string, mName?: string): string => {
    if (id) {
      const byId = eligibleMasters.find((m) => m.id === id);
      if (byId) return byId.id || byId.name;
    }
    if (mName) {
      const byName = eligibleMasters.find(
        (m) => m.name.trim().toLowerCase() === mName.trim().toLowerCase()
      );
      if (byName) return byName.id || byName.name;
    }
    return '';
  };

  const applyPresetToForm = (preset: FamilierPreset) => {
    setSelectedPresetId(preset.id);
    setName(preset.name);
    setEspece(preset.espece);
    setCategorie(preset.categorie);
    setRolePnj(
      preset.typeCompagnon ||
        (preset.categorie === 'Monture' || preset.categorie === 'Compagnon Rôdeur'
          ? 'Compagnon'
          : 'Familier')
    );
    setLevel(preset.level);
    setCaracs({ ...preset.base });
    setHp(preset.hp);
    setHpMax(preset.hp);
    setDef(preset.def);
    setPmMax(preset.pmMax);
    setPmCurrent(preset.pmMax);
    setVitesse(preset.vitesse);
    setTaille(preset.taille);
    setPoids(preset.poids);
    setAge(preset.age);
    setArmes(preset.armes.map((w) => ({ ...w })));
    setCapacitesSpeciales(preset.capacitesSpeciales.map((c) => ({ ...c })));
    setNotes(preset.persoTraits);
    setPortrait(buildFamilierPortraitDataUrl(preset.espece, preset.name, 0));
  };

  useEffect(() => {
    if (!isOpen) return;

    if (editingFamilier) {
      setSelectedPresetId('');
      setName(editingFamilier.name || '');
      setEspece(editingFamilier.familierEspece || 'Compagnon');
      const resolvedCat = (CATEGORIES.includes(editingFamilier.familierCategorie as FamilierCategorie)
        ? editingFamilier.familierCategorie
        : 'Compagnon Animal') as FamilierCategorie;
      setCategorie(resolvedCat);
      setRolePnj(
        editingFamilier.rolePnj === 'Compagnon' ||
          resolvedCat === 'Monture' ||
          resolvedCat === 'Compagnon Rôdeur'
          ? 'Compagnon'
          : 'Familier'
      );
      setLevel(editingFamilier.level || 1);
      setMasterKey(findMasterKey(editingFamilier.masterId, editingFamilier.masterName));
      setCaracs({ ...DEFAULT_FAM_CARACS, ...(editingFamilier.base || {}) });
      const resolvedMaxHp =
        editingFamilier.hpMaxManual ?? editingFamilier.hpMaxAuto ?? editingFamilier.hpBase ?? 10;
      setHpMax(resolvedMaxHp);
      setHp(editingFamilier.hp ?? resolvedMaxHp);
      setDef(editingFamilier.defManual ?? 13);
      const resolvedPmMax = editingFamilier.pmMaxManual ?? 0;
      setPmMax(resolvedPmMax);
      setPmCurrent(editingFamilier.pm ?? resolvedPmMax);
      setVitesse(editingFamilier.vitesse || '15 m');
      setTaille(editingFamilier.taille || '50 cm');
      setPoids(editingFamilier.poids || '5 kg');
      setAge(editingFamilier.age || '3 ans');
      setArmes((editingFamilier.armes || []).map((w) => ({ ...w })));
      setCapacitesSpeciales((editingFamilier.capacitesSpeciales || []).map((c) => ({ ...c })));
      setNotes(editingFamilier.persoTraits || '');
      setPortrait(editingFamilier.portrait);
      setAddToCombat(false);
    } else {
      setMasterKey(
        defaultMaster ? findMasterKey(defaultMaster.id, defaultMaster.name) || defaultMaster.id || defaultMaster.name : ''
      );
      setAddToCombat(false);
      applyPresetToForm(FAMILIERS_PRESETS[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingFamilier]);

  if (!isOpen) return null;

  const resolveSelectedMaster = (): { id?: string; name: string } | null => {
    if (!masterKey) return null;
    const found = eligibleMasters.find(
      (m) => (m.id && m.id === masterKey) || m.name === masterKey
    );
    if (found) return { id: found.id, name: found.name };
    if (defaultMaster && (defaultMaster.id === masterKey || defaultMaster.name === masterKey)) {
      return { id: defaultMaster.id, name: defaultMaster.name };
    }
    return null;
  };

  const buildCombatantForFamilier = (fam: Character): Combatant => {
    const totalDex = (fam.base.DEX || 10) + (fam.rb?.DEX || 0);
    const weaponsStr =
      (fam.armes || []).map((w) => `${w.n} (${w.dm})`).join(', ') || 'Attaque naturelle (1d4)';
    const masterInfo = fam.masterName ? `Lié à ${fam.masterName}` : 'Indépendant';
    return {
      id: `c_${fam.id || Date.now()}`,
      n: fam.name,
      isPj: true,
      isPnj: true,
      isFamilier: true,
      ...(fam.masterName ? { masterName: fam.masterName } : {}),
      hp: fam.hp,
      hpMax: fam.hpMaxManual || fam.hpBase || fam.hp,
      def: fam.defManual ?? 14,
      baseInit: totalDex,
      init: totalDex,
      notes: `🐾 Familier (${fam.familierEspece || 'Compagnon'}) · ${masterInfo} · ${weaponsStr}`,
      pjRefId: fam.id,
      etats: fam.etats || [],
    };
  };

  const handleQuickAddPreset = (preset: FamilierPreset) => {
    const master = resolveSelectedMaster();
    const famChar = createFamilierFromPreset(preset, master);
    const combatant = isMj && addToCombat ? buildCombatantForFamilier(famChar) : null;
    onSave(famChar, combatant, false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      warning('Veuillez saisir un nom pour ce familier.');
      return;
    }

    const master = resolveSelectedMaster();
    const trimmedName = name.trim();
    const cleanArmes = armes.filter((w) => w.n.trim().length > 0);
    const cleanCaps = capacitesSpeciales.filter((c) => c.n.trim().length > 0 || c.t.trim().length > 0);
    const finalId = editingFamilier?.id || `fam_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const safeHpMax = Math.max(1, hpMax || 1);
    const safeHp = Math.max(0, Math.min(safeHpMax, editingFamilier ? hp : safeHpMax));
    const safePmMax = Math.max(0, pmMax || 0);
    const safePm = Math.max(0, Math.min(safePmMax, editingFamilier ? pmCurrent : safePmMax));

    const famCharacter: Character = {
      ...(editingFamilier || {}),
      id: finalId,
      name: trimmedName,
      player: master?.name ? `${rolePnj} de ${master.name}` : `${rolePnj} (Disponible)`,
      race: editingFamilier?.race || 'humain',
      profil: editingFamilier?.profil || 'rodeur',
      level: Math.max(1, level || 1),
      base: { ...caracs },
      rb: editingFamilier?.rb || {},
      hpBase: safeHpMax,
      hpMaxAuto: safeHpMax,
      hpMaxManual: safeHpMax,
      hp: safeHp,
      pmMaxManual: safePmMax,
      pm: safePm,
      ptsCap: editingFamilier?.ptsCap || 0,
      ptsCapCadeaux: editingFamilier?.ptsCapCadeaux || 0,
      bourse: editingFamilier?.bourse || { po: 0, pa: 0, pc: 0 },
      caps: editingFamilier?.caps || [],
      armes: cleanArmes,
      inventaire: editingFamilier?.inventaire || [],
      customSorts: editingFamilier?.customSorts || [],
      arm: '',
      bou: '',
      bonus: editingFamilier?.bonus || { pv: 0, def: 0, init: 0 },
      persoTraits: notes.trim(),
      age: age.trim(),
      taille: taille.trim(),
      poids: poids.trim(),
      etats: editingFamilier?.etats || [],
      isPnj: true,
      rolePnj,
      isFamilier: true,
      familierEspece: espece.trim() || 'Compagnon',
      familierCategorie: categorie,
      masterId: master?.id,
      masterName: master?.name,
      defManual: Math.max(5, def || 10),
      vitesse: vitesse.trim() || '15 m',
      capacitesSpeciales: cleanCaps,
      portrait: portrait || buildFamilierPortraitDataUrl(espece.trim() || 'Compagnon', trimmedName, 0),
    };

    const combatant = !editingFamilier && isMj && addToCombat ? buildCombatantForFamilier(famCharacter) : null;
    onSave(famCharacter, combatant, Boolean(editingFamilier));
    onClose();
  };

  const filteredPresets = FAMILIERS_PRESETS.filter((p) => {
    if (presetCatFilter !== 'all' && p.categorie !== presetCatFilter) return false;
    if (presetSousFamilleFilter !== 'all' && p.sousFamille !== presetSousFamilleFilter) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/85 backdrop-blur-xs p-2 sm:p-4 animate-fadeIn">
      <div className="bg-[#181410] border-2 border-[#6fa85b]/80 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-5 py-3 border-b border-[#3d3023] bg-gradient-to-r from-[#14261a] via-[#1a1912] to-[#181410] flex items-center justify-between shrink-0 gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#6fa85b]/20 border border-[#6fa85b]/50 flex items-center justify-center text-lg shrink-0">
              🐾
            </div>
            <div className="min-w-0">
              <h3 className="font-serif-co text-base sm:text-lg font-bold text-[#b8f2c2] truncate">
                {editingFamilier
                  ? `Modifier ${rolePnj === 'Compagnon' ? 'le Compagnon' : 'le Familier'} · ${editingFamilier.name}`
                  : 'Créateur de Familier & Compagnon (Base Pré-établie & Fiche Complète)'}
              </h3>
              <p className="text-[11px] text-[#9e907d] truncate">
                {FAMILIERS_PRESETS.length} familiers courants, compagnons animaux (Rôdeur) et montures prêts en 1 clic ou entièrement personnalisables
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#231c15] cursor-pointer shrink-0"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Galerie des Modèles Pré-remplis */}
          {!editingFamilier && (
            <div className="bg-[#121914] border border-[#2f5236] rounded-xl p-3 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#86efac] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Base de Données · Familiers &amp; Compagnons Courants
                </span>
                <div className="flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPresetCatFilter('all');
                      setPresetSousFamilleFilter('all');
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      presetCatFilter === 'all' && presetSousFamilleFilter === 'all'
                        ? 'bg-[#6fa85b] text-black'
                        : 'bg-[#1c261e] text-[#a7c4ad] hover:text-white'
                    }`}
                  >
                    Tous ({FAMILIERS_PRESETS.length})
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setPresetCatFilter(cat);
                        if (cat !== 'Compagnon Rôdeur') setPresetSousFamilleFilter('all');
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        presetCatFilter === cat
                          ? 'bg-[#6fa85b] text-black'
                          : 'bg-[#1c261e] text-[#a7c4ad] hover:text-white'
                      }`}
                    >
                      {cat === 'Compagnon Rôdeur' ? '🏹 Compagnon Rôdeur' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sous-filtre rapide Voie du Compagnon Rôdeur (Félins / Canidés / Rapaces) */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#233b28]">
                <span className="text-[10px] font-bold text-[#f3d48d]">
                  🏹 Voie du Compagnon (Rôdeur) :
                </span>
                {[
                  { key: 'all', label: 'Toutes familles' },
                  { key: 'Félin', label: '🐆 Félins' },
                  { key: 'Canidé', label: '🐺 Canidés' },
                  { key: 'Rapace', label: '🦅 Rapaces' },
                ].map((sf) => (
                  <button
                    key={sf.key}
                    type="button"
                    onClick={() => {
                      if (sf.key === 'all') {
                        setPresetSousFamilleFilter('all');
                      } else {
                        setPresetCatFilter('Compagnon Rôdeur');
                        setPresetSousFamilleFilter(sf.key as 'Félin' | 'Canidé' | 'Rapace');
                      }
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      presetSousFamilleFilter === sf.key
                        ? 'bg-[#d4a84a] text-black'
                        : 'bg-[#1b241c] text-[#cbb8a7] hover:text-white border border-[#2f4534]'
                    }`}
                  >
                    {sf.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                {filteredPresets.map((preset) => {
                  const isSelected = selectedPresetId === preset.id;
                  const thumb = buildFamilierPortraitDataUrl(preset.espece, preset.name, 0);
                  return (
                    <div
                      key={preset.id}
                      onClick={() => {
                        applyPresetToForm(preset);
                        info(`Modèle « ${preset.name} » chargé dans le formulaire.`);
                      }}
                      className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-[#1d3322] border-[#6fa85b] shadow-sm'
                          : 'bg-[#181f1a] hover:bg-[#1e2921] border-[#2e4031]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={thumb}
                          alt={preset.name}
                          className="w-10 h-10 rounded-lg object-cover border border-[#6fa85b]/50 shrink-0"
                        />
                        <div className="min-w-0">
                          <b className="text-[11px] text-[#e8f5e9] block truncate">{preset.name}</b>
                          <span className="text-[10px] text-[#9ec4a6] block truncate">
                            {preset.sousFamille ? `${preset.sousFamille} · ` : ''}
                            {preset.hp} PV · DEF {preset.def}
                            {preset.pmMax > 0 ? ` · ${preset.pmMax} PM` : ''}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickAddPreset(preset);
                        }}
                        className="px-2 py-1 rounded-lg bg-[#6fa85b] hover:bg-[#82c06c] text-black font-extrabold text-[10px] shrink-0 cursor-pointer"
                        title="Ajouter et lier ce familier pré-rempli immédiatement"
                      >
                        + Direct
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Liaison au Maître (PJ / PNJ) */}
          <div className="bg-[#1b1610] border border-[#d4a84a]/50 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-[#d4a84a] shrink-0" />
              <div>
                <b className="text-xs text-[#f3d48d] block">Liaison au Maître (PJ ou PNJ)</b>
                <span className="text-[10px] text-[#9e907d]">
                  Associez ce familier à son compagnon ou laissez-le disponible dans la liste
                </span>
              </div>
            </div>
            <select
              value={masterKey}
              onChange={(e) => setMasterKey(e.target.value)}
              disabled={!isMj && Boolean(defaultMaster)}
              className="sm:min-w-[260px] px-3 py-1.5 bg-[#120e0a] border border-[#d4a84a]/60 rounded-lg text-xs font-semibold text-[#ede3d1] outline-none disabled:opacity-80"
            >
              {isMj && <option value="">— Aucun maître lié (Disponible) —</option>}
              {eligibleMasters.map((m) => {
                const key = m.id || m.name;
                return (
                  <option key={key} value={key}>
                    {m.isPnj ? '🤝 PNJ' : '🛡️ PJ'} · {m.name} (Niv. {m.level})
                  </option>
                );
              })}
              {!isMj && defaultMaster && eligibleMasters.length === 0 && (
                <option value={defaultMaster.id || defaultMaster.name}>
                  🛡️ PJ · {defaultMaster.name}
                </option>
              )}
            </select>
          </div>

          {/* Identité & Portrait */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-end gap-2">
                <div className="flex-1">
                  <label className="text-[10px] font-bold uppercase text-[#9e907d] block mb-1">
                    Nom du {rolePnj} *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Huginn, Fauve, Aldric, Foudre..."
                    className="w-full px-3 py-1.5 bg-[#231c15] border border-[#3d3023] focus:border-[#6fa85b] rounded-lg text-xs text-[#ede3d1] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-[#9e907d] block mb-1">
                    Type de lien
                  </label>
                  <div className="flex rounded-lg overflow-hidden border border-[#3d3023] bg-[#14100c]">
                    {(['Familier', 'Compagnon'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRolePnj(r)}
                        className={`px-3 py-1.5 text-[11px] font-bold cursor-pointer transition-colors ${
                          rolePnj === r
                            ? 'bg-[#6fa85b] text-black'
                            : 'text-[#9e907d] hover:text-[#ede3d1]'
                        }`}
                      >
                        {r === 'Familier' ? '🐾 Familier' : '🤝 Compagnon'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-[#9e907d] block mb-1">
                  Espèce / Profil
                </label>
                <input
                  type="text"
                  value={espece}
                  onChange={(e) => setEspece(e.target.value)}
                  placeholder="Corbeau, Loup, Lynx, Aigle, Destrier..."
                  className="w-full px-3 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-[#9e907d] block mb-1">
                  Catégorie
                </label>
                <select
                  value={categorie}
                  onChange={(e) => {
                    const nextCat = e.target.value as FamilierCategorie;
                    setCategorie(nextCat);
                    if (nextCat === 'Monture' || nextCat === 'Compagnon Rôdeur') {
                      setRolePnj('Compagnon');
                    }
                  }}
                  className="w-full px-3 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-[#9e907d] block mb-1">
                  Vitesse / Déplacement
                </label>
                <input
                  type="text"
                  value={vitesse}
                  onChange={(e) => setVitesse(e.target.value)}
                  placeholder="Ex: Vol 18 m · Sol 4 m"
                  className="w-full px-3 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <div>
                  <label className="text-[10px] font-bold uppercase text-[#9e907d] block mb-1">
                    Niveau
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={level}
                    onChange={(e) => setLevel(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-2 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] text-center font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-[#9e907d] block mb-1">
                    Taille
                  </label>
                  <input
                    type="text"
                    value={taille}
                    onChange={(e) => setTaille(e.target.value)}
                    className="w-full px-2 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-[#9e907d] block mb-1">
                    Poids
                  </label>
                  <input
                    type="text"
                    value={poids}
                    onChange={(e) => setPoids(e.target.value)}
                    className="w-full px-2 py-1.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
                  />
                </div>
              </div>
            </div>

            <PortraitPicker
              value={portrait}
              onChange={setPortrait}
              compact={true}
              label="Portrait du Familier"
              characterDraft={{
                name: name || espece,
                familierEspece: espece,
                familierCategorie: categorie,
                isFamilier: true,
                persoTraits: notes,
              }}
            />
          </div>

          {/* PV, DEF, PM & 6 Caractéristiques */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5 grid grid-cols-3 gap-2 bg-[#14100c] border border-[#3d3023] rounded-xl p-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-[#ff9999] flex items-center gap-1 mb-1">
                  <Heart className="w-3 h-3" /> PV Max
                </label>
                <input
                  type="number"
                  min={1}
                  value={hpMax}
                  onChange={(e) => {
                    const v = Math.max(1, parseInt(e.target.value, 10) || 1);
                    setHpMax(v);
                    if (!editingFamilier) setHp(v);
                  }}
                  className="w-full px-2 py-1.5 bg-[#231c15] border border-[#4d2828] rounded-lg text-sm font-bold text-[#ede3d1] text-center outline-none"
                />
                {editingFamilier && (
                  <div className="mt-1">
                    <span className="text-[9px] text-[#9e907d] block">Actuels</span>
                    <input
                      type="number"
                      min={0}
                      max={hpMax}
                      value={hp}
                      onChange={(e) => setHp(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full px-1.5 py-0.5 bg-[#1b1212] border border-[#4d2828] rounded text-[11px] font-bold text-[#ff9999] text-center"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-[#86efac] flex items-center gap-1 mb-1">
                  <Shield className="w-3 h-3" /> DEF
                </label>
                <input
                  type="number"
                  min={5}
                  max={35}
                  value={def}
                  onChange={(e) => setDef(parseInt(e.target.value, 10) || 10)}
                  className="w-full px-2 py-1.5 bg-[#231c15] border border-[#2f5236] rounded-lg text-sm font-bold text-[#86efac] text-center outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-[#8dbbff] flex items-center gap-1 mb-1">
                  <Zap className="w-3 h-3" /> PM Max
                </label>
                <input
                  type="number"
                  min={0}
                  value={pmMax}
                  onChange={(e) => {
                    const v = Math.max(0, parseInt(e.target.value, 10) || 0);
                    setPmMax(v);
                    if (!editingFamilier) setPmCurrent(v);
                  }}
                  className="w-full px-2 py-1.5 bg-[#231c15] border border-[#2b3d63] rounded-lg text-sm font-bold text-[#8dbbff] text-center outline-none"
                />
                {editingFamilier && pmMax > 0 && (
                  <div className="mt-1">
                    <span className="text-[9px] text-[#9e907d] block">Actuels</span>
                    <input
                      type="number"
                      min={0}
                      max={pmMax}
                      value={pmCurrent}
                      onChange={(e) => setPmCurrent(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full px-1.5 py-0.5 bg-[#111722] border border-[#2b3d63] rounded text-[11px] font-bold text-[#8dbbff] text-center"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-7 bg-[#14100c] border border-[#3d3023] rounded-xl p-3">
              <span className="text-[10px] font-bold uppercase text-[#d4a84a] block mb-1.5">
                6 Caractéristiques &amp; Modificateurs
              </span>
              <div className="grid grid-cols-6 gap-1.5">
                {CARAC_LIST.map((c) => {
                  const val = caracs[c] ?? 10;
                  const mod = getMod(val);
                  return (
                    <div key={c} className="bg-[#231c15] border border-[#30251a] rounded-lg p-1.5 text-center">
                      <span className="text-[9px] font-bold text-[#9e907d] block">{c}</span>
                      <input
                        type="number"
                        min={1}
                        max={26}
                        value={val}
                        onChange={(e) =>
                          setCaracs((prev) => ({ ...prev, [c]: parseInt(e.target.value, 10) || 10 }))
                        }
                        className="w-full text-center font-serif-co font-bold text-sm text-[#ede3d1] bg-transparent outline-none"
                      />
                      <span
                        className={`text-[10px] font-mono font-bold ${
                          mod >= 0 ? 'text-[#6fa85b]' : 'text-[#cf5544]'
                        }`}
                      >
                        {mod >= 0 ? `+${mod}` : mod}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Attaques Naturelles & Armes */}
          <div className="bg-[#14100c] border border-[#3d3023] rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-[#d4a84a] flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5" /> Attaques Naturelles &amp; Morsures ({armes.length})
              </span>
              <button
                type="button"
                onClick={() =>
                  setArmes((prev) => [
                    ...prev,
                    { n: 'Attaque naturelle', t: 'Contact', dm: '1d4', crit: '20', por: 'Contact', props: '' },
                  ])
                }
                className="px-2 py-1 rounded bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-[10px] font-bold text-[#f3d48d] flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Ajouter une attaque
              </button>
            </div>
            {armes.length > 0 ? (
              <div className="space-y-2">
                {armes.map((w, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 bg-[#1e1711] border border-[#30251a] rounded-lg p-2 items-center"
                  >
                    <input
                      type="text"
                      value={w.n}
                      onChange={(e) =>
                        setArmes((prev) => prev.map((it, i) => (i === idx ? { ...it, n: e.target.value } : it)))
                      }
                      placeholder="Nom (ex: Morsure)"
                      className="sm:col-span-3 px-2 py-1 bg-[#14100c] border border-[#3d3023] rounded text-xs text-[#f3d48d] font-semibold outline-none"
                    />
                    <select
                      value={w.t}
                      onChange={(e) =>
                        setArmes((prev) => prev.map((it, i) => (i === idx ? { ...it, t: e.target.value } : it)))
                      }
                      className="sm:col-span-2 px-1.5 py-1 bg-[#14100c] border border-[#3d3023] rounded text-[11px] text-[#ede3d1] outline-none"
                    >
                      <option value="Contact">Contact</option>
                      <option value="Distance">Distance</option>
                      <option value="Magie">Magie</option>
                    </select>
                    <input
                      type="text"
                      value={w.dm}
                      onChange={(e) =>
                        setArmes((prev) => prev.map((it, i) => (i === idx ? { ...it, dm: e.target.value } : it)))
                      }
                      placeholder="DM (1d6)"
                      className="sm:col-span-2 px-2 py-1 bg-[#14100c] border border-[#3d3023] rounded text-xs text-[#ff9999] font-mono outline-none"
                    />
                    <input
                      type="text"
                      value={w.por}
                      onChange={(e) =>
                        setArmes((prev) => prev.map((it, i) => (i === idx ? { ...it, por: e.target.value } : it)))
                      }
                      placeholder="Portée"
                      className="sm:col-span-2 px-2 py-1 bg-[#14100c] border border-[#3d3023] rounded text-xs text-[#99bbff] outline-none"
                    />
                    <input
                      type="text"
                      value={w.props || ''}
                      onChange={(e) =>
                        setArmes((prev) => prev.map((it, i) => (i === idx ? { ...it, props: e.target.value } : it)))
                      }
                      placeholder="Effet / Propriétés"
                      className="sm:col-span-2 px-2 py-1 bg-[#14100c] border border-[#3d3023] rounded text-[11px] text-[#cbb8a7] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setArmes((prev) => prev.filter((_, i) => i !== idx))}
                      className="sm:col-span-1 p-1 text-[#9e907d] hover:text-[#cf5544] flex justify-center cursor-pointer"
                      title="Supprimer cette attaque"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-[#9e907d] italic">Aucune attaque définie.</p>
            )}
          </div>

          {/* Capacités Spéciales du Familier */}
          <div className="bg-[#14100c] border border-[#2f5236] rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-[#86efac] flex items-center gap-1.5">
                <Footprints className="w-3.5 h-3.5" /> Capacités Spéciales &amp; Traits du Familier ({capacitesSpeciales.length})
              </span>
              <button
                type="button"
                onClick={() =>
                  setCapacitesSpeciales((prev) => [
                    ...prev,
                    { n: 'Nouveau trait', t: 'Décrivez l’effet spécial ou le bonus accordé au maître.' },
                  ])
                }
                className="px-2 py-1 rounded bg-[#1b291e] hover:bg-[#243828] border border-[#3c6b45] text-[10px] font-bold text-[#86efac] flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Ajouter une capacité
              </button>
            </div>
            {capacitesSpeciales.length > 0 ? (
              <div className="space-y-2">
                {capacitesSpeciales.map((cap, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 bg-[#18211a] border border-[#2b3f2f] rounded-lg p-2 items-start"
                  >
                    <input
                      type="text"
                      value={cap.n}
                      onChange={(e) =>
                        setCapacitesSpeciales((prev) =>
                          prev.map((it, i) => (i === idx ? { ...it, n: e.target.value } : it))
                        )
                      }
                      placeholder="Titre capacité"
                      className="sm:col-span-4 px-2 py-1 bg-[#111713] border border-[#2f4534] rounded text-xs font-bold text-[#b8f2c2] outline-none"
                    />
                    <textarea
                      rows={2}
                      value={cap.t}
                      onChange={(e) =>
                        setCapacitesSpeciales((prev) =>
                          prev.map((it, i) => (i === idx ? { ...it, t: e.target.value } : it))
                        )
                      }
                      placeholder="Description mécanique..."
                      className="sm:col-span-7 px-2 py-1 bg-[#111713] border border-[#2f4534] rounded text-[11px] text-[#ede3d1] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setCapacitesSpeciales((prev) => prev.filter((_, i) => i !== idx))}
                      className="sm:col-span-1 p-1 text-[#9e907d] hover:text-[#cf5544] flex justify-center cursor-pointer"
                      title="Supprimer cette capacité"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-[#9e907d] italic">Aucune capacité spéciale ajoutée.</p>
            )}
          </div>

          {/* Notes RP & Option Combat */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-[#9e907d] block">
              Caractère, Comportement &amp; Notes Roleplay
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tempérament, lien avec le maître, particularités physiques..."
              className="w-full px-3 py-2 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs text-[#ede3d1] outline-none"
            />

            {!editingFamilier && isMj && (
              <label className="inline-flex items-center gap-2 text-xs text-[#cbb8a7] cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={addToCombat}
                  onChange={(e) => setAddToCombat(e.target.checked)}
                  className="w-4 h-4 accent-[#6fa85b]"
                />
                <span>Envoyer également sur la Piste de Combat dès la création</span>
              </label>
            )}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#30251a]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-xs font-semibold text-[#ede3d1] cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6fa85b] to-[#4c823b] hover:brightness-110 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>
                {editingFamilier
                  ? 'Enregistrer les modifications'
                  : `Créer & Enregistrer le ${rolePnj}`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
