import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Swords,
  Shield,
  Zap,
  Coins,
  BookOpen,
  Sparkles,
  Check,
  AlertTriangle,
  Flame,
  Activity,
  Heart,
  Skull,
  Plus,
  RefreshCw,
  Upload,
  Link2,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import {
  Equipment,
  Monster,
  PrejudicialState,
  ProfilData,
  RaceData,
  RuleChapter,
  SpellItem,
  WayRank,
} from '../types/chroniques';
import {
  buildMonsterVisualSvg,
  inspectMonsterCriteria,
} from '../utils/fantasyPortraitGenerator';
import {
  CachedCreatureVisual,
  getCreatureVisual,
  removeCreatureVisual,
  setCreatureVisual,
} from '../utils/creatureVisualCache';
import { compressImageFile, isSafeImageUrl, svgToCompressedDataUrl } from '../utils/imageUtils';
import { useToast } from './common/ToastContext';

export type DetailItem =
  | { type: 'monster' | 'monstre'; data: Monster }
  | { type: 'equipment' | 'equipement'; data: Equipment }
  | { type: 'spell' | 'sort'; data: SpellItem }
  | {
      type: 'wayRank';
      data: {
        n?: string;
        nom?: string;
        t?: string;
        description?: string;
        L?: number;
        S?: number;
        isLimited?: number;
        isSpell?: number;
        wayName: string;
        profile?: string;
        className?: string;
        rankNum?: number;
        rank?: {
          rang?: number;
          nom?: string;
          description?: string;
          isLimited?: number;
          isSpell?: number;
        };
      };
    }
  | { type: 'rule' | 'regle'; data: RuleChapter }
  | { type: 'state' | 'etat'; data: PrejudicialState }
  | { type: 'race'; data: RaceData }
  | { type: 'profil'; data: ProfilData };

export interface DetailPjRecipient {
  id?: string;
  name: string;
  level?: number;
  profil?: string;
  isPnj?: boolean;
}

interface DetailModalProps {
  item: DetailItem | null;
  onClose: () => void;
  onAction?: (action: string, payload?: any) => void;
  hidePrice?: boolean;
  pjRecipients?: DetailPjRecipient[];
  selectedPjIds?: string[];
  onChangeSelectedPjIds?: (pjIds: string[]) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  item,
  onClose,
  onAction,
  hidePrice = false,
  pjRecipients,
  selectedPjIds = [],
  onChangeSelectedPjIds,
}) => {
  const { success, warning, error } = useToast();
  const monsterFileRef = useRef<HTMLInputElement>(null);
  const [monsterVisual, setMonsterVisual] = useState<CachedCreatureVisual | null>(null);
  const [visualSeed, setVisualSeed] = useState<number>(0);
  const [visualBusy, setVisualBusy] = useState<boolean>(false);
  const [showVisualUrlInput, setShowVisualUrlInput] = useState<boolean>(false);
  const [visualUrlDraft, setVisualUrlDraft] = useState<string>('');
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(selectedPjIds);

  useEffect(() => {
    setLocalSelectedIds(selectedPjIds);
  }, [selectedPjIds, item]);

  const isMonster = item && (item.type === 'monster' || item.type === 'monstre');
  const currentMonster = isMonster ? (item.data as Monster) : null;

  useEffect(() => {
    if (currentMonster) {
      const cached = getCreatureVisual(currentMonster);
      setMonsterVisual(cached);
      setVisualSeed(cached?.variantSeed || 0);
      setShowVisualUrlInput(false);
      setVisualUrlDraft('');
    } else {
      setMonsterVisual(null);
    }
  }, [currentMonster?.n, currentMonster?.source]);

  if (!item) return null;

  const handleGenerateMonsterVisual = async (nextSeed: number) => {
    if (!currentMonster) return;
    setVisualBusy(true);
    try {
      const svg = buildMonsterVisualSvg(currentMonster, nextSeed);
      const dataUrl = await svgToCompressedDataUrl(svg, 384, 0.85);
      const saved = setCreatureVisual(currentMonster, {
        url: dataUrl,
        mode: 'generated',
        variantSeed: nextSeed,
      });
      setVisualSeed(nextSeed);
      setMonsterVisual({
        url: dataUrl,
        mode: 'generated',
        variantSeed: nextSeed,
        updatedAt: Date.now(),
      });
      if (!saved) {
        warning('Visuel généré, mais le cache local du navigateur est plein.');
      }
    } catch (err: any) {
      error('Erreur de génération : ' + (err?.message || 'Erreur inconnue'));
    } finally {
      setVisualBusy(false);
    }
  };

  const handleUploadMonsterVisual = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !currentMonster) return;
    setVisualBusy(true);
    try {
      const compressed = await compressImageFile(file, 384, 0.8);
      setCreatureVisual(currentMonster, { url: compressed, mode: 'uploaded' });
      setMonsterVisual({ url: compressed, mode: 'uploaded', updatedAt: Date.now() });
      success(`Visuel de "${currentMonster.n}" importé et mis en cache !`);
    } catch (err: any) {
      error(err?.message || "Impossible d'importer l'image.");
    } finally {
      setVisualBusy(false);
    }
  };

  const handleApplyMonsterUrl = () => {
    if (!currentMonster) return;
    if (!visualUrlDraft.trim() || !isSafeImageUrl(visualUrlDraft)) {
      warning("Veuillez saisir une URL d'image valide (https://... ou /...).");
      return;
    }
    const cleanUrl = visualUrlDraft.trim();
    setCreatureVisual(currentMonster, { url: cleanUrl, mode: 'url' });
    setMonsterVisual({ url: cleanUrl, mode: 'url', updatedAt: Date.now() });
    setShowVisualUrlInput(false);
    setVisualUrlDraft('');
    success(`Visuel lié à "${currentMonster.n}" !`);
  };

  const handleClearMonsterVisual = () => {
    if (!currentMonster) return;
    removeCreatureVisual(currentMonster);
    setMonsterVisual(currentMonster.imageUrl ? { url: currentMonster.imageUrl, mode: 'url', updatedAt: 0 } : null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-3 sm:p-5 animate-fadeIn">
      <div className="bg-[#181410] border-2 border-[#d4a84a] rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-[#ede3d1]">
        {/* Modal Top Header with Entity Type Color */}
        <div
          className={`px-5 py-4 border-b border-[#3d3023] flex items-center justify-between ${
            item.type === 'monster' || item.type === 'monstre'
              ? 'bg-gradient-to-r from-[#3d1a1c] to-[#1a120e]'
              : item.type === 'spell' || item.type === 'sort'
              ? 'bg-gradient-to-r from-[#311b47] to-[#1a120e]'
              : item.type === 'equipment' || item.type === 'equipement'
              ? 'bg-gradient-to-r from-[#3b2a15] to-[#1a120e]'
              : item.type === 'race'
              ? 'bg-gradient-to-r from-[#20331a] to-[#141d11]'
              : item.type === 'profil'
              ? 'bg-gradient-to-r from-[#362314] to-[#1e150f]'
              : item.type === 'state' || item.type === 'etat'
              ? 'bg-gradient-to-r from-[#3d1818] to-[#1a120e]'
              : 'bg-gradient-to-r from-[#291e12] to-[#1a120e]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black/40 border border-[#d4a84a]/40 flex items-center justify-center shrink-0">
              {(item.type === 'monster' || item.type === 'monstre') && <Skull className="w-5 h-5 text-[#ff9d9d]" />}
              {(item.type === 'spell' || item.type === 'sort') && <Zap className="w-5 h-5 text-[#cbafff]" />}
              {(item.type === 'equipment' || item.type === 'equipement') && <Coins className="w-5 h-5 text-[#f3d48d]" />}
              {item.type === 'wayRank' && <Sparkles className="w-5 h-5 text-[#f3d48d]" />}
              {(item.type === 'rule' || item.type === 'regle') && <BookOpen className="w-5 h-5 text-[#8dbbff]" />}
              {(item.type === 'state' || item.type === 'etat') && <Activity className="w-5 h-5 text-[#ff9d9d]" />}
              {item.type === 'race' && <Shield className="w-5 h-5 text-[#8ed476]" />}
              {item.type === 'profil' && <Swords className="w-5 h-5 text-[#f3d48d]" />}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#9e907d] block">
                {(item.type === 'monster' || item.type === 'monstre') && `Fiche de Créature · NC ${item.data.nc}`}
                {(item.type === 'spell' || item.type === 'sort') && `Sortilège · Rang ${item.data.rang}`}
                {(item.type === 'equipment' || item.type === 'equipement') &&
                  `Équipement · ${item.data.cat || item.data.type || 'Bien'}`}
                {item.type === 'wayRank' &&
                  `Capacité · ${item.data.wayName} (Rang ${
                    item.data.rankNum || item.data.rank?.rang || 1
                  })`}
                {(item.type === 'rule' || item.type === 'regle') && `Règle Officielle · ${item.data.cat}`}
                {(item.type === 'state' || item.type === 'etat') && 'État Préjudiciable (COF)'}
                {item.type === 'race' && `Race Jouable du DRS · ${item.data.n}`}
                {item.type === 'profil' && `Vocation & Profil de Classe · ${item.data.n}`}
              </span>
              <h3 className="font-serif-co text-xl font-bold text-[#f3d48d]">
                {(item.type === 'monster' || item.type === 'monstre') && item.data.n}
                {(item.type === 'spell' || item.type === 'sort') && item.data.n}
                {(item.type === 'equipment' || item.type === 'equipement') && (item.data.n || item.data.nom)}
                {item.type === 'wayRank' &&
                  (item.data.n || item.data.nom || item.data.rank?.nom)}
                {(item.type === 'rule' || item.type === 'regle') && item.data.t}
                {(item.type === 'state' || item.type === 'etat') && `${item.data.icon ? item.data.icon + ' ' : ''}${item.data.name || item.data.n}`}
                {item.type === 'race' && item.data.n}
                {item.type === 'profil' && item.data.n}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#231c15] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* ==================== 1. MONSTER DETAILS ==================== */}
          {(item.type === 'monster' || item.type === 'monstre') && (
            <div className="space-y-4">
              {item.data.source === 'tharnea' && (
                <div className="flex items-center justify-between p-2.5 bg-[#31162b] border border-[#6b285b] rounded-xl text-xs text-[#f5b8ec]">
                  <span className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#ff77e1]" />
                    Codex de l'Obscure · Tharnéa {item.data.num ? `(N°${item.data.num})` : ''}
                  </span>
                  <span className="text-[11px] font-mono text-[#d696cd] italic">
                    {item.data.milieu || "L'Obscure"}
                  </span>
                </div>
              )}

              {/* Visuel de la créature (aperçu immédiat gratuit / variante / importé / cache) */}
              {(() => {
                const crit = inspectMonsterCriteria(item.data);
                const liveSvgPreview = !monsterVisual?.url
                  ? `data:image/svg+xml;utf8,${encodeURIComponent(buildMonsterVisualSvg(item.data, visualSeed))}`
                  : null;
                const displayUrl = monsterVisual?.url || liveSvgPreview;
                return (
                  <div className="bg-[#14100c] border border-[#3d3023] rounded-xl p-3 flex flex-col sm:flex-row items-center gap-3.5">
                    <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-[#d4a84a]/60 bg-[#0d0a08] shrink-0 flex items-center justify-center shadow-inner relative">
                      {displayUrl ? (
                        <img
                          src={displayUrl}
                          alt={item.data.n}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-2 text-[#7a6b59]">
                          <ImageIcon className="w-8 h-8 mx-auto opacity-50 mb-1" />
                          <span className="text-[10px] block leading-tight">
                            Aucun visuel en cache
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-[#231c15] border border-[#3d3023] text-[#f3d48d] font-semibold">
                          {crit.archetypeLabel}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#231c15] border border-[#3d3023] text-[#cbb8a7]">
                          📍 {crit.environmentLabel}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#231c15] border border-[#3d3023] text-[#cbb8a7]">
                          📏 {crit.scaleLabel}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#231c15] border border-[#3d3023] text-[#ff9d9d] font-bold">
                          {crit.dangerLabel}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          disabled={visualBusy}
                          onClick={() => handleGenerateMonsterVisual(monsterVisual?.mode === 'generated' ? visualSeed + 1 : 0)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#2a1d12] hover:bg-[#3b2919] border border-[#d4a84a]/60 text-[#f3d48d] text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          title="Générer un visuel gratuit fidèle aux critères de la créature (ou rafraîchir une variante)"
                        >
                          {monsterVisual?.mode === 'generated' ? (
                            <RefreshCw className="w-3.5 h-3.5" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {monsterVisual?.mode === 'generated'
                              ? 'Variante (Refresh)'
                              : 'Générer visuel (critères)'}
                          </span>
                        </button>

                        <button
                          type="button"
                          disabled={visualBusy}
                          onClick={() => monsterFileRef.current?.click()}
                          className="px-2.5 py-1.5 rounded-lg bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-[#ede3d1] text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          title="Importer votre propre illustration pour cette créature"
                        >
                          <Upload className="w-3.5 h-3.5 text-[#86efac]" />
                          <span>Importer visuel</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowVisualUrlInput((s) => !s)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-[#cbb8a7] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Link2 className="w-3.5 h-3.5 text-[#93c5fd]" />
                          <span>URL</span>
                        </button>

                        {monsterVisual && (
                          <button
                            type="button"
                            onClick={handleClearMonsterVisual}
                            className="px-2 py-1.5 rounded-lg bg-[#301616] hover:bg-[#471f1f] border border-[#6b2525] text-[#fca5a5] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            title="Retirer le visuel en cache"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <input
                        ref={monsterFileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleUploadMonsterVisual}
                        className="hidden"
                      />

                      {showVisualUrlInput && (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="url"
                            value={visualUrlDraft}
                            onChange={(e) => setVisualUrlDraft(e.target.value)}
                            placeholder="https://exemple.com/creature.jpg"
                            className="flex-1 bg-[#1e1711] border border-[#3d3023] focus:border-[#d4a84a] rounded-lg px-2.5 py-1 text-xs text-[#ede3d1] outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleApplyMonsterUrl}
                            className="px-2.5 py-1 rounded-lg bg-[#d4a84a] text-black font-bold text-xs cursor-pointer"
                          >
                            OK
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Stat badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-3 text-center">
                  <small className="text-[10px] text-[#9e907d] uppercase font-bold block">
                    Niveau Rencontre
                  </small>
                  <b className="font-serif-co text-xl text-[#f3d48d]">NC {item.data.nc}</b>
                </div>
                <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-3 text-center">
                  <small className="text-[10px] text-[#9e907d] uppercase font-bold block">
                    Points de Vie
                  </small>
                  <b className="font-serif-co text-xl text-[#6fa85b]">{item.data.pv} PV</b>
                </div>
                <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-3 text-center">
                  <small className="text-[10px] text-[#9e907d] uppercase font-bold block">
                    Défense (DEF)
                  </small>
                  <b className="font-serif-co text-xl text-[#ede3d1]">{item.data.def}</b>
                </div>
                <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-3 text-center">
                  <small className="text-[10px] text-[#9e907d] uppercase font-bold block">
                    Initiative
                  </small>
                  <b className="font-serif-co text-xl text-[#ede3d1]">{item.data.init}</b>
                </div>
              </div>

              {/* Gabarit, Poids & Milieu */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-[#231c15] border border-[#3d3023] rounded-xl p-2.5 text-[#ede3d1]">
                <div>
                  <span className="text-[10px] text-[#9e907d] uppercase block">Gabarit / Taille :</span>
                  <b>{item.data.taille || 'Moyenne (1,50 à 2 m)'}</b>
                </div>
                <div>
                  <span className="text-[10px] text-[#9e907d] uppercase block">Poids estimé :</span>
                  <b>{item.data.poids || 'Variable'}</b>
                </div>
                <div>
                  <span className="text-[10px] text-[#9e907d] uppercase block">Milieu / Famille :</span>
                  <b>{item.data.milieu || item.data.fam || "Terres d'Osgild"}</b>
                </div>
              </div>

              {/* Caractéristiques 6-voies si présentes */}
              {item.data.caracs && (
                <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-3 space-y-1.5">
                  <div className="text-[10px] font-bold text-[#d4a84a] uppercase tracking-wider">
                    Caractéristiques Détaillées
                  </div>
                  <div className="grid grid-cols-6 gap-1.5 text-center">
                    {(['FOR', 'DEX', 'CON', 'INT', 'SAG', 'CHA'] as const).map((c) => {
                      const val = item.data.caracs?.[c] ?? 0;
                      return (
                        <div key={c} className="bg-[#231c15] border border-[#30251a] rounded p-1">
                          <span className="text-[9px] text-[#9e907d] block font-bold">{c}</span>
                          <b className="text-xs text-[#f3d48d]">
                            {val >= 0 ? `+${val}` : val}
                          </b>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Vitesse & Sauvegardes si Boss */}
              {(item.data.vitesse || item.data.sauvegardes || item.data.resistances) && (
                <div className="bg-[#211612] border border-[#4a2e22] rounded-xl p-3 text-xs space-y-1">
                  {item.data.vitesse && (
                    <div>
                      <b className="text-[#f3d48d]">Vitesse de déplacement :</b> {item.data.vitesse}
                    </div>
                  )}
                  {item.data.sauvegardes && (
                    <div>
                      <b className="text-[#f3d48d]">Sauvegardes :</b> {item.data.sauvegardes}
                    </div>
                  )}
                  {item.data.resistances && (
                    <div>
                      <b className="text-[#f3d48d]">Résistances :</b> {item.data.resistances}
                    </div>
                  )}
                </div>
              )}

              {/* Attaques */}
              <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#f3d48d] uppercase tracking-wider">
                  <Swords className="w-4 h-4 text-[#d4a84a]" />
                  <span>Attaques &amp; Dégâts en Combat</span>
                </div>
                <p className="text-sm font-semibold text-[#ede3d1] leading-relaxed">
                  {item.data.att}
                </p>
              </div>

              {/* Apparence Physique Simple (à décrire aux joueurs) */}
              {item.data.descPhysique && (
                <div className="bg-[#1b1611] border border-[#4a3925] rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#f3d48d] uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 text-[#d4a84a]" />
                    <span>Apparence Physique (Description rapide MJ)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#ede3d1] leading-relaxed italic">
                    {item.data.descPhysique}
                  </p>
                </div>
              )}

              {/* Description & Traits */}
              <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#f3d48d] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#d4a84a]" />
                  <span>Capacités, Traits &amp; Tempérament</span>
                </div>
                <p className="text-xs text-[#ede3d1] leading-relaxed whitespace-pre-line">
                  {item.data.traits}
                </p>
              </div>

              {/* Pouvoirs Spéciaux */}
              {item.data.pouvoirs && item.data.pouvoirs.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#cbafff] uppercase tracking-wider">
                    <Zap className="w-4 h-4 text-[#cbafff]" />
                    <span>Pouvoirs Spéciaux &amp; Capacités d'Ombre</span>
                  </div>
                  <div className="space-y-2">
                    {item.data.pouvoirs.map((p, i) => (
                      <div
                        key={i}
                        className="p-3 bg-[#1d1424] border border-[#442859] rounded-xl text-xs space-y-0.5"
                      >
                        <b className="text-[#f3d48d] block">• {p.n}</b>
                        <p className="text-[#ede3d1] leading-relaxed">{p.t}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Directives Tactiques pour le Meneur de Jeu */}
              {item.data.tactique ? (
                <div className="p-3.5 bg-[#17110c] border border-[#472f1a] rounded-xl text-xs text-[#ede3d1] space-y-1">
                  <b className="text-[#d4a84a] flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#d4a84a]" />
                    Directives Tactiques pour le Meneur de Jeu :
                  </b>
                  <p className="leading-relaxed text-[#c7bcac]">{item.data.tactique}</p>
                </div>
              ) : (
                <div className="p-3 bg-[#120f0c] border border-[#30251a] rounded-xl text-xs text-[#9e907d]">
                  <b className="text-[#d4a84a]">Conseils tactiques MJ :</b> Utilisez les particularités
                  du terrain (embuscades, charges, morsures) pour exploiter les points forts de cette
                  créature.
                </div>
              )}

              {/* Butin et Reliques */}
              {item.data.butin && (
                <div className="p-3 bg-[#1d1b13] border border-[#4a3b1a] rounded-xl text-xs space-y-1">
                  <b className="text-[#f3d48d] flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-[#f3d48d]" />
                    Butin &amp; Reliques à récupérer :
                  </b>
                  <p className="text-[#ede3d1] whitespace-pre-line">{item.data.butin}</p>
                </div>
              )}

              {/* Origine & Rôle Narratif (Figures majeures Tharnéa) */}
              {item.data.origineNarratif && (
                <div className="p-3.5 bg-[#17141a] border border-[#48385c] rounded-xl text-xs space-y-1">
                  <b className="text-[#cbafff] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#cbafff]" />
                    Origine &amp; Rôle Narratif :
                  </b>
                  <p className="text-[#ede3d1] leading-relaxed whitespace-pre-line">{item.data.origineNarratif}</p>
                </div>
              )}

              {/* Liens Personnels avec les PJ */}
              {item.data.liensPj && (
                <div className="p-3.5 bg-[#1a1514] border border-[#5e342d] rounded-xl text-xs space-y-1">
                  <b className="text-[#ffad99] flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-[#ffad99]" />
                    Liens Personnels avec les PJ :
                  </b>
                  <p className="text-[#ede3d1] leading-relaxed whitespace-pre-line">{item.data.liensPj}</p>
                </div>
              )}

              {/* Secret de la Figure Majeure */}
              {item.data.secret && (
                <div className="p-3.5 bg-[#10141a] border border-[#2d445c] rounded-xl text-xs space-y-1">
                  <b className="text-[#8dbbff] flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#8dbbff]" />
                    Secret Caché (Réservé au MJ) :
                  </b>
                  <p className="text-[#ede3d1] leading-relaxed whitespace-pre-line">{item.data.secret}</p>
                </div>
              )}
            </div>
          )}

          {/* ==================== 2. EQUIPMENT DETAILS ==================== */}
          {(item.type === 'equipment' || item.type === 'equipement') && (
            <div className="space-y-4">
              {item.data.source === 'tharnea' && (
                <div className="flex items-center justify-between p-2.5 bg-[#2d1b10] border border-[#663b1e] rounded-xl text-xs text-[#f3d48d]">
                  <span className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#f3d48d]" />
                    Extension Tharnéa · Artéfact &amp; Alchimie
                  </span>
                  <span className="text-[11px] text-[#baa488] italic">
                    {item.data.cat || item.data.type || 'Relique'}
                  </span>
                </div>
              )}

              {/* Pastille de bonbon si couleur */}
              {item.data.couleur && (
                <div className="flex items-center gap-3 p-3 bg-[#231c15] border border-[#3d3023] rounded-xl">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white/60 shadow-md shrink-0"
                    style={{ backgroundColor: item.data.couleur }}
                  />
                  <div>
                    <b className="text-sm text-[#f3d48d] block">{item.data.n}</b>
                    <span className="text-xs text-[#9e907d]">
                      Friandise alchimique spéciale de Tharnéa
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {!hidePrice && (
                  <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-3 text-center">
                    <small className="text-[10px] text-[#9e907d] uppercase font-bold block">Prix indicatif (MJ)</small>
                    <b className="font-serif-co text-xl text-[#f3d48d]">{item.data.prix || 'Sur mesure'}</b>
                  </div>
                )}

                {item.data.dm && (
                  <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-3 text-center">
                    <small className="text-[10px] text-[#9e907d] uppercase font-bold block">Dégâts (DM)</small>
                    <b className="font-serif-co text-xl text-[#ff9d9d]">{item.data.dm}</b>
                  </div>
                )}

                {item.data.def !== undefined && (
                  <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-3 text-center">
                    <small className="text-[10px] text-[#9e907d] uppercase font-bold block">Protection</small>
                    <b className="font-serif-co text-xl text-[#6fa85b]">+{item.data.def} DEF</b>
                  </div>
                )}

                {item.data.crit && (
                  <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-3 text-center">
                    <small className="text-[10px] text-[#9e907d] uppercase font-bold block">Critique</small>
                    <b className="font-serif-co text-lg text-[#ede3d1]">{item.data.crit}</b>
                  </div>
                )}

                {item.data.por && (
                  <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-3 text-center">
                    <small className="text-[10px] text-[#9e907d] uppercase font-bold block">Portée</small>
                    <b className="font-serif-co text-lg text-[#ede3d1]">{item.data.por}</b>
                  </div>
                )}

                {item.data.activation && (
                  <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-3 text-center">
                    <small className="text-[10px] text-[#9e907d] uppercase font-bold block">Activation</small>
                    <b className="text-xs text-[#ede3d1]">{item.data.activation}</b>
                  </div>
                )}
              </div>

              {item.data.isPack && (
                <div className="p-3 bg-[#382b1b] border border-[#523d24] rounded-xl text-xs text-[#f3d48d]">
                  🎒 <b>Pack Complet de Voyage :</b> Contient un sac à dos renforcé, 15m de corde avec grappin d'acier, paillasse portable et couverture chaude, 5 torches de résine, briquet à silex et amadou, 7 rations de voyage, gourde en cuir (1L) et potion de soins légers.
                </div>
              )}

              {/* Effet Principal / Description */}
              <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-4 space-y-1.5">
                <b className="text-xs font-bold text-[#f3d48d] uppercase tracking-wider block">
                  Description &amp; Effets Principaux
                </b>
                <p className="text-xs text-[#ede3d1] leading-relaxed">
                  {item.data.desc || item.data.props || "Aucune restriction particulière pour cet équipement."}
                </p>
              </div>

              {/* Effet secondaire loufoque */}
              {item.data.effetSecondaire && (
                <div className="p-3.5 bg-[#2d1f11] border border-[#734b1a] rounded-xl text-xs space-y-1">
                  <b className="text-[#f3d48d] flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#f3d48d]" />
                    Effet Secondaire Imprévisible :
                  </b>
                  <p className="text-[#ede3d1] leading-relaxed">{item.data.effetSecondaire}</p>
                </div>
              )}

              {/* Limites ou Risques */}
              {item.data.limite && (
                <div className="p-3 bg-[#241313] border border-[#522424] rounded-xl text-xs space-y-1 text-[#ffb0b0]">
                  <b>⚠️ Contraintes &amp; Risques :</b> {item.data.limite}
                </div>
              )}

              {/* Action Octroi MJ (sélection multiple PJ & PNJ par cases à cocher) */}
              {onAction && pjRecipients && pjRecipients.length > 0 && (
                <div className="pt-3 border-t border-[#30251a] space-y-2.5 bg-[#120e0a] p-3 rounded-xl border">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#f3d48d]">
                      Octroyer à (PJ &amp; PNJ) — {localSelectedIds.length}/{pjRecipients.length} sélectionné(s) :
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const all = pjRecipients.map((p) => p.id || p.name);
                          setLocalSelectedIds(all);
                          onChangeSelectedPjIds?.(all);
                        }}
                        className="px-2 py-1 rounded bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-[10px] font-bold text-[#f3d48d] cursor-pointer"
                      >
                        Tout sélectionner
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLocalSelectedIds([]);
                          onChangeSelectedPjIds?.([]);
                        }}
                        className="px-2 py-1 rounded bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-[10px] font-semibold text-[#9e907d] cursor-pointer"
                      >
                        Tout désélectionner
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                    {pjRecipients.map((p) => {
                      const pid = p.id || p.name;
                      const checked = localSelectedIds.includes(pid);
                      return (
                        <label
                          key={pid}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                            checked
                              ? 'bg-[#1c2e16] border-[#6fa85b] text-[#ede3d1]'
                              : 'bg-[#1c1611] border-[#30251a] text-[#bba992] hover:border-[#4d3b29]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              const next = checked
                                ? localSelectedIds.filter((id) => id !== pid)
                                : [...localSelectedIds, pid];
                              setLocalSelectedIds(next);
                              onChangeSelectedPjIds?.(next);
                            }}
                            className="w-3.5 h-3.5 accent-[#6fa85b] cursor-pointer shrink-0"
                          />
                          <span className="truncate font-semibold flex-1">{p.name}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                              p.isPnj
                                ? 'bg-[#1e3a5f] text-[#93c5fd]'
                                : 'bg-[#3b2a14] text-[#f3d48d]'
                            }`}
                          >
                            {p.isPnj ? 'PNJ' : 'PJ'}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (localSelectedIds.length === 0) {
                          warning('Cochez au moins un PJ ou PNJ destinataire.');
                          return;
                        }
                        onAction('give_to_pj', { item: item.data, pjIds: localSelectedIds });
                        onClose();
                      }}
                      disabled={localSelectedIds.length === 0}
                      className={`px-4 py-2 font-bold text-xs rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        localSelectedIds.length > 0
                          ? 'bg-[#6fa85b] hover:bg-[#7ebd67] text-black'
                          : 'bg-[#2a2219] text-[#7a6b59] border border-[#3d3023] cursor-not-allowed'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      {localSelectedIds.length > 0
                        ? `Octroyer aux ${localSelectedIds.length} sélectionné(s)`
                        : 'Cochez au moins un destinataire'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== 3. SPELL DETAILS ==================== */}
          {(item.type === 'spell' || item.type === 'sort') && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-[#231c15] border border-[#3a2954] rounded-xl p-3 text-center">
                  <small className="text-[10px] text-[#cbafff] uppercase font-bold block">Rang</small>
                  <b className="font-serif-co text-xl text-[#f3d48d]">Rang {item.data.rang}</b>
                </div>
                <div className="bg-[#231c15] border border-[#3a2954] rounded-xl p-3 text-center">
                  <small className="text-[10px] text-[#cbafff] uppercase font-bold block">Coût en Mana</small>
                  <b className="font-serif-co text-xl text-[#8dbbff]">{item.data.rang} PM</b>
                </div>
                <div className="bg-[#231c15] border border-[#3a2954] rounded-xl p-3 text-center">
                  <small className="text-[10px] text-[#cbafff] uppercase font-bold block">Portée</small>
                  <b className="font-serif-co text-sm text-[#ede3d1]">{item.data.portee || 'Contact'}</b>
                </div>
                <div className="bg-[#231c15] border border-[#3a2954] rounded-xl p-3 text-center">
                  <small className="text-[10px] text-[#cbafff] uppercase font-bold block">Durée</small>
                  <b className="font-serif-co text-sm text-[#ede3d1]">{item.data.duree || 'Instantané'}</b>
                </div>
              </div>

              {item.data.voie && (
                <div className="text-xs text-[#9e907d]">
                  Voie associée : <b className="text-[#cbafff]">{item.data.voie}</b>
                </div>
              )}

              <div className="bg-[#231c15] border border-[#3a2954] rounded-xl p-4 space-y-1.5">
                <b className="text-xs font-bold text-[#cbafff] uppercase tracking-wider block">
                  Description &amp; Effets Magiques
                </b>
                <p className="text-xs sm:text-sm text-[#ede3d1] leading-relaxed">
                  {item.data.t}
                </p>
              </div>

              <div className="p-3 bg-[#181320] border border-[#3d2757] rounded-xl text-xs text-[#cbafff]">
                ⚡ <b>Règle de lancement :</b> Lancer un sortilège consomme une action d'attaque (ou action limitée si spécifié) et coûte 1 PM par Rang du sort. Il peut être lancé plusieurs fois par jour tant que le héros possède des Points de Mana suffisants.
              </div>
            </div>
          )}

          {/* ==================== 4. WAY RANK DETAILS ==================== */}
          {item.type === 'wayRank' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold bg-[#3b2a1a] text-[#f3d48d] px-3 py-1 rounded-lg border border-[#d4a84a]/40">
                  {item.data.wayName} · Rang {item.data.rankNum || item.data.rank?.rang || 1}
                </span>
                <span className="text-xs text-[#9e907d] bg-[#231c15] px-2.5 py-1 rounded-lg border border-[#3d3023]">
                  Profil : {item.data.profile || item.data.className || 'Héroïque'}
                </span>
                {item.data.L || item.data.isLimited || item.data.rank?.isLimited ? (
                  <span className="text-xs font-bold bg-[#4a1c1d] text-[#ffb8b8] px-2 py-1 rounded">
                    Action Limitée (L)
                  </span>
                ) : null}
                {item.data.S || item.data.isSpell || item.data.rank?.isSpell ? (
                  <span className="text-xs font-bold bg-[#1e2f47] text-[#b0d7ff] px-2 py-1 rounded">
                    Sort Arcanique (*)
                  </span>
                ) : null}
              </div>

              <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-4 space-y-2">
                <b className="text-xs font-bold text-[#f3d48d] uppercase tracking-wider block">
                  Effet Mécanique Officiel
                </b>
                <p className="text-sm text-[#ede3d1] leading-relaxed">
                  {item.data.t ||
                    item.data.description ||
                    item.data.rank?.description ||
                    'Aucun texte descriptif.'}
                </p>
              </div>

              <div className="p-3 bg-[#120f0c] border border-[#30251a] rounded-xl text-xs text-[#9e907d] space-y-1">
                <b className="text-[#f3d48d]">Règle d'acquisition :</b>
                <p>
                  Les rangs 1 et 2 coûtent <b>1 point de capacité</b> chacun. Les rangs 3, 4 et 5 coûtent <b>2 points de capacité</b> chacun. Vous devez acquérir les rangs dans l'ordre croissant au sein de la même voie.
                </p>
              </div>
            </div>
          )}

          {/* ==================== 5. RULE DETAILS ==================== */}
          {(item.type === 'rule' || item.type === 'regle') && (
            <div className="space-y-4">
              <span className="text-xs font-bold bg-[#1e2f47] text-[#b0d7ff] px-2.5 py-1 rounded-lg border border-[#2d4973]">
                Section : {item.data.cat}
              </span>

              <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-4 space-y-2">
                <b className="text-xs font-bold text-[#f3d48d] uppercase tracking-wider block">
                  Énoncé Officiel des Règles du DRS
                </b>
                <p className="text-xs sm:text-sm text-[#ede3d1] leading-relaxed whitespace-pre-line">
                  {item.data.c}
                </p>
              </div>
            </div>
          )}

          {/* ==================== 6. STATE DETAILS ==================== */}
          {(item.type === 'state' || item.type === 'etat') && (
            <div className="space-y-3.5">
              <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl select-none">{item.data.icon || '⚠️'}</span>
                  <div>
                    <h4 className="text-base font-bold text-[#f3d48d]">
                      État Préjudiciable : {item.data.name || item.data.n}
                    </h4>
                    <span className="text-xs text-[#9e907d]">Règles officielles Chroniques Oubliées Fantasy</span>
                  </div>
                </div>

                {(item.data.impactCourt || item.data.impactShort) && (
                  <div className="p-3 bg-[#3d1818] border border-[#a33939] rounded-lg text-xs font-bold text-[#ffb3b3]">
                    ⚡ Impact mécanique immédiat : {item.data.impactCourt || item.data.impactShort}
                  </div>
                )}

                <div className="text-xs sm:text-sm text-[#ede3d1] leading-relaxed pt-1 bg-[#181410] border border-[#30251a] p-3 rounded-lg">
                  <b className="text-[#f3d48d] block text-xs uppercase mb-1">Énoncé Officiel DRS :</b>
                  {item.data.desc || item.data.t}
                </div>
              </div>

              {/* Les 4 Piliers Explicatifs demandés par le MJ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {/* 1. QUAND */}
                <div className="p-3 bg-[#1d1713] border border-[#4d3822] rounded-xl space-y-1 text-xs">
                  <b className="text-[#f3d48d] flex items-center gap-1.5 font-bold">
                    <span>🕒</span> Quand s'applique-t-il ?
                  </b>
                  <p className="text-[#ede3d1] leading-relaxed">
                    {item.data.quand || "Lors d'une attaque spéciale, sortilège néfaste, échec critique ou piège de zone."}
                  </p>
                </div>

                {/* 2. COMMENT */}
                <div className="p-3 bg-[#181a24] border border-[#32416b] rounded-xl space-y-1 text-xs">
                  <b className="text-[#9bb8ff] flex items-center gap-1.5 font-bold">
                    <span>🎲</span> Comment s'applique-t-il ? (Mécanique)
                  </b>
                  <p className="text-[#ede3d1] leading-relaxed">
                    {item.data.comment || (item.data.impactCourt || item.data.t)}
                  </p>
                </div>

                {/* 3. POURQUOI */}
                <div className="p-3 bg-[#241724] border border-[#6b326b] rounded-xl space-y-1 text-xs">
                  <b className="text-[#f0a6f0] flex items-center gap-1.5 font-bold">
                    <span>🧬</span> Pourquoi ? (Justification en jeu)
                  </b>
                  <p className="text-[#ede3d1] leading-relaxed">
                    {item.data.pourquoi || "Perte de repères biologiques, sidération psychique, choc traumatique ou entrave physique."}
                  </p>
                </div>

                {/* 4. GUÉRISON */}
                <div className="p-3 bg-[#152416] border border-[#2b592e] rounded-xl space-y-1 text-xs">
                  <b className="text-[#8be391] flex items-center gap-1.5 font-bold">
                    <span>🌿</span> Comment en guérir / s'en libérer ?
                  </b>
                  <p className="text-[#ede3d1] leading-relaxed">
                    {item.data.guerison || "Test de sauvegarde à la fin du tour, soin divin, potion de délivrance ou fin de combat."}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#120f0c] border border-[#30251a] rounded-xl text-[11px] text-[#9e907d]">
                💡 <b>Règle de cumul :</b> Les états préjudiciables se cumulent avec les malus de positionnement (tenaille, obscurité). Deux états identiques ne se cumulent pas mais réinitialisent la durée d'effet.
              </div>
            </div>
          )}

          {/* ==================== 7. RACE DETAILS (CO-DRS.ORG COMPLET) ==================== */}
          {item.type === 'race' && (
            <div className="space-y-4">
              {/* Lore et Origines */}
              <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <b className="text-xs font-bold text-[#8ed476] uppercase tracking-wider">
                    Présentation &amp; Origines (DRS)
                  </b>
                  {item.data.traits && (
                    <span className="text-[11px] text-[#9e907d] italic">
                      « {item.data.traits} »
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-[#ede3d1] leading-relaxed whitespace-pre-line">
                  {item.data.descriptionComplete || item.data.d}
                </p>
              </div>

              {/* Repères Physiques et Démographiques officiels */}
              <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-2.5">
                <b className="text-xs font-bold text-[#f3d48d] uppercase tracking-wider block">
                  Repères Physiques &amp; Démographiques Officiels (co-drs.org)
                </b>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                  <div className="bg-[#231c15] p-2.5 rounded-lg border border-[#3d3023]">
                    <span className="text-[10px] text-[#9e907d] uppercase font-bold block">
                      Âge de départ
                    </span>
                    <b className="text-[#f3d48d] text-sm">{item.data.ageDepart || '18 ans'}</b>
                  </div>
                  <div className="bg-[#231c15] p-2.5 rounded-lg border border-[#3d3023]">
                    <span className="text-[10px] text-[#9e907d] uppercase font-bold block">
                      Espérance de vie
                    </span>
                    <b className="text-[#ede3d1] text-sm">{item.data.esperanceVie || '100 ans'}</b>
                  </div>
                  <div className="bg-[#231c15] p-2.5 rounded-lg border border-[#3d3023]">
                    <span className="text-[10px] text-[#9e907d] uppercase font-bold block">
                      Taille moyenne
                    </span>
                    <b className="text-[#ede3d1] text-sm">{item.data.taille || '1,70 m'}</b>
                  </div>
                  <div className="bg-[#231c15] p-2.5 rounded-lg border border-[#3d3023]">
                    <span className="text-[10px] text-[#9e907d] uppercase font-bold block">
                      Poids moyen
                    </span>
                    <b className="text-[#ede3d1] text-sm">{item.data.poids || '70 kg'}</b>
                  </div>
                </div>
              </div>

              {/* Modificateurs de Caractéristiques */}
              <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <b className="text-xs font-bold text-[#f3d48d] uppercase tracking-wider">
                    Modificateurs de Caractéristiques Raciaux
                  </b>
                  <span className="text-xs font-mono font-bold text-[#8ed476]">
                    {item.data.t || 'Aucun modificateur'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {item.data.b && Object.entries(item.data.b).length > 0 ? (
                    Object.entries(item.data.b).map(([carac, val]) => (
                      <span
                        key={carac}
                        className={`px-3 py-1 rounded-lg text-xs font-bold font-mono border ${
                          (val as number) > 0
                            ? 'bg-[#1b2f18] text-[#8ed476] border-[#39632f]'
                            : 'bg-[#3b1919] text-[#ff9d9d] border-[#6b2b2b]'
                        }`}
                      >
                        {carac} : {(val as number) > 0 ? `+${val}` : val}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#9e907d] italic">
                      Aucun malus ni bonus : grande liberté de répartition des modificateurs.
                    </span>
                  )}
                  {item.data.defb ? (
                    <span className="px-3 py-1 rounded-lg text-xs font-bold font-mono bg-[#1b2b3a] text-[#8dbbff] border border-[#2b4b6b]">
                      Défense native : +{item.data.defb} DEF
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Capacités Raciales Détaillées */}
              <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-4 space-y-3">
                <b className="text-xs font-bold text-[#f3d48d] uppercase tracking-wider block">
                  Capacités Raciales Officielles
                </b>
                {item.data.cap &&
                  item.data.cap.map((cp, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#181410] border border-[#3d3023] rounded-lg space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#d4a84a]" />
                        <b className="text-sm text-[#f3d48d]">{cp.n}</b>
                      </div>
                      <p className="text-xs text-[#ede3d1] leading-relaxed">{cp.t}</p>
                    </div>
                  ))}

                {/* Options au choix */}
                {item.data.opts && item.data.opts.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <span className="text-xs font-bold text-[#8ed476] block">
                      Options au choix lors de la création :
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.data.opts.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className="p-3 bg-[#1d1712] border border-[#4d3b26] rounded-lg text-xs space-y-1"
                        >
                          <b className="text-[#f3d48d] block font-serif-co text-xs">
                            Option {oIdx + 1} : {opt.n}
                          </b>
                          <p className="text-[#ede3d1] leading-relaxed">{opt.t}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Relations & Noms typiques */}
              {(item.data.relations || item.data.nomsExemples) && (
                <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-3">
                  {item.data.relations && (
                    <div>
                      <b className="text-xs font-bold text-[#9e907d] uppercase tracking-wider block mb-1">
                        Relations avec les autres peuples
                      </b>
                      <p className="text-xs text-[#ede3d1] leading-relaxed">
                        {item.data.relations}
                      </p>
                    </div>
                  )}
                  {item.data.nomsExemples && (
                    <div>
                      <b className="text-xs font-bold text-[#9e907d] uppercase tracking-wider block mb-1">
                        Traditions &amp; Exemples de noms
                      </b>
                      <p className="text-xs text-[#d4a84a] whitespace-pre-line leading-relaxed font-mono">
                        {item.data.nomsExemples}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ==================== 8. PROFIL DETAILS (CO-DRS.ORG COMPLET) ==================== */}
          {item.type === 'profil' && (
            <div className="space-y-4">
              {/* Description et Rôle */}
              <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <b className="text-xs font-bold text-[#f3d48d] uppercase tracking-wider">
                    Vocation &amp; Style de Jeu
                  </b>
                  {item.data.roleTactique && (
                    <span className="text-[11px] text-[#8dbbff] font-semibold">
                      {item.data.roleTactique}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-[#ede3d1] leading-relaxed whitespace-pre-line">
                  {item.data.descriptionComplete || item.data.traits}
                </p>
              </div>

              {/* Badges Chiffrés de Profil */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="bg-[#181410] p-3 rounded-xl border border-[#3d3023] text-center">
                  <span className="text-[10px] text-[#9e907d] uppercase font-bold block">
                    Dé de Vie (DV)
                  </span>
                  <b className="font-serif-co text-2xl text-[#f3d48d]">d{item.data.dv}</b>
                  <span className="text-[10px] text-[#6fa85b] block mt-0.5">
                    + Mod. CON aux PV / niveau
                  </span>
                </div>

                <div className="bg-[#181410] p-3 rounded-xl border border-[#3d3023] text-center">
                  <span className="text-[10px] text-[#9e907d] uppercase font-bold block">Magie</span>
                  <b className="font-serif-co text-2xl text-[#cbafff]">{item.data.mag || 'Aucune'}</b>
                  <span className="text-[10px] text-[#9e907d] block mt-0.5">
                    {item.data.mag ? `Caractéristique d'incantation` : 'Profil martial'}
                  </span>
                </div>

                <div className="bg-[#181410] p-3 rounded-xl border border-[#3d3023] text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-[#9e907d] uppercase font-bold block">
                    Protection Max
                  </span>
                  <b className="font-serif-co text-xs text-[#ede3d1] block line-clamp-2 mt-1">
                    {item.data.ar}
                  </b>
                </div>
              </div>

              {/* Armes et Équipement de départ */}
              <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-4 space-y-3">
                <div>
                  <b className="text-xs font-bold text-[#f3d48d] uppercase tracking-wider block mb-1">
                    Armes &amp; Protections Autorisées
                  </b>
                  <p className="text-xs text-[#ede3d1]">{item.data.ar}</p>
                </div>

                <div className="pt-2 border-t border-[#30251a]">
                  <b className="text-xs font-bold text-[#f3d48d] uppercase tracking-wider block mb-1">
                    Équipement de Départ Gratuit
                  </b>
                  <p className="text-xs text-[#ede3d1] font-semibold">{item.data.eq}</p>
                </div>
              </div>

              {/* Les 5 Voies associées au profil */}
              {item.data.voiesNoms && item.data.voiesNoms.length > 0 && (
                <div className="bg-[#181410] border border-[#3d3023] rounded-xl p-4 space-y-2">
                  <b className="text-xs font-bold text-[#cbafff] uppercase tracking-wider block">
                    Les 5 Voies Héroïques Disponibles (DRS)
                  </b>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.data.voiesNoms.map((vn, vIdx) => (
                      <div
                        key={vIdx}
                        className="p-2.5 bg-[#231c15] border border-[#3d3023] rounded-lg text-xs flex items-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#cbafff]" />
                        <b className="text-[#ede3d1]">{vn}</b>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer with Action Buttons */}
        <div className="px-5 py-3 border-t border-[#3d3023] bg-[#120f0c] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-xs font-semibold rounded-lg text-[#ede3d1]"
          >
            Fermer
          </button>

          <div className="flex items-center gap-2">
            {item.type === 'race' && onAction && (
              <button
                onClick={() => {
                  onAction('selectRace', item.data);
                  onClose();
                }}
                className="px-5 py-2 bg-gradient-to-r from-[#d4a84a] to-[#ab8230] hover:brightness-110 text-black font-bold text-xs rounded-lg shadow-md flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Choisir la Race {item.data.n}
              </button>
            )}

            {item.type === 'profil' && onAction && (
              <button
                onClick={() => {
                  onAction('selectProfil', item.data);
                  onClose();
                }}
                className="px-5 py-2 bg-gradient-to-r from-[#d4a84a] to-[#ab8230] hover:brightness-110 text-black font-bold text-xs rounded-lg shadow-md flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Choisir le Profil {item.data.n}
              </button>
            )}

            {item.type === 'monster' && onAction && (
              <button
                onClick={() => {
                  onAction('addMonsterToCombat', item.data);
                  onClose();
                }}
                className="px-5 py-2 bg-gradient-to-r from-[#9c2a2b] to-[#6d1b1c] hover:brightness-110 text-white font-bold text-xs rounded-lg shadow-md flex items-center gap-1.5"
              >
                <Swords className="w-3.5 h-3.5" /> Envoyer au Combat
              </button>
            )}

            {item.type === 'spell' && onAction && (
              <button
                onClick={() => {
                  onAction('castSpell', item.data);
                  onClose();
                }}
                className="px-5 py-2 bg-[#233a59] hover:bg-[#32527d] border border-[#3a69a1] text-[#8dbbff] font-bold text-xs rounded-lg shadow-md flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" /> Lancer ce Sort (-{item.data.rang} PM)
              </button>
            )}

            {item.type === 'equipment' && onAction && (
              <button
                onClick={() => {
                  onAction('addEquipment', item.data);
                  onClose();
                }}
                className="px-5 py-2 bg-[#d4a84a] hover:bg-[#e0b555] text-black font-bold text-xs rounded-lg shadow-md flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Choisir cet Objet
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function SkullIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="12" r="1" />
      <circle cx="15" cy="12" r="1" />
      <path d="M8 20v2h8v-2" />
      <path d="m12.5 17-.5-1-.5 1h1z" />
      <path d="M16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20" />
    </svg>
  );
}
