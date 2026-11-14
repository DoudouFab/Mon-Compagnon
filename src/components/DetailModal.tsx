import React, { useEffect, useState } from 'react';
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
  HelpCircle,
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
import { useToast } from './common/ToastContext';
import { SORTS_CATALOG, VOIES_CATALOG } from '../data/coDatabase';
import {
  ActionRuleInfo,
  COF_ACTION_RULES,
  resolveActionRule,
} from '../data/actionRules';

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
        portee?: string;
        duree?: string;
        cibles?: string;
        test?: string;
        degats?: string;
        limites?: string;
        actionCost?: string;
        nature?: string;
        composantes?: string;
        natureDegats?: string;
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
  | {
      type: 'actionRule';
      data: {
        actionCost?: string;
        isLimited?: boolean;
        isSpell?: boolean;
        sourceTitle?: string;
      };
    }
  | { type: 'rule' | 'regle'; data: RuleChapter }
  | { type: 'state' | 'etat'; data: PrejudicialState }
  | { type: 'race'; data: RaceData }
  | { type: 'profil'; data: ProfilData };

function findWayRankByName(name?: string): (WayRank & { wayName: string; profil: string; rang: number }) | undefined {
  const target = (name || '').toLowerCase().trim();
  if (!target) return undefined;
  for (const way of Object.values(VOIES_CATALOG)) {
    for (let i = 0; i < way.r.length; i++) {
      const rk = way.r[i];
      if (rk.n.toLowerCase().trim() === target) {
        return { ...rk, wayName: way.nom, profil: way.profil, rang: i + 1 };
      }
    }
  }
  return undefined;
}

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

const EMPTY_PJ_IDS: string[] = [];

export const DetailModal: React.FC<DetailModalProps> = ({
  item,
  onClose,
  onAction,
  hidePrice = false,
  pjRecipients,
  selectedPjIds = EMPTY_PJ_IDS,
  onChangeSelectedPjIds,
}) => {
  const { warning } = useToast();
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(selectedPjIds);
  const [activeActionHelp, setActiveActionHelp] = useState<ActionRuleInfo | null>(null);
  const selectedPjIdsKey = selectedPjIds.join('|');

  useEffect(() => {
    setLocalSelectedIds((prev) =>
      prev.join('|') === selectedPjIdsKey ? prev : [...selectedPjIds]
    );
    setActiveActionHelp(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPjIdsKey, item]);

  if (!item) return null;

  const renderActionEconomyPanel = (rule: ActionRuleInfo, inlineClosable = true) => (
    <div className="p-3 bg-[#14111c] border-2 border-[#7c5cba] rounded-xl space-y-2.5 text-xs animate-fadeIn">
      <div className="flex items-center justify-between gap-2 border-b border-[#3a2954] pb-2">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#d8b4fe] shrink-0" />
          <b className="text-sm text-[#f3d48d]">
            Règle d’Action : {rule.label}
          </b>
        </div>
        {inlineClosable && (
          <button
            type="button"
            onClick={() => setActiveActionHelp(null)}
            className="px-2.5 py-1 rounded-lg bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-xs font-semibold text-[#ede3d1] cursor-pointer"
          >
            Masquer
          </button>
        )}
      </div>

      <div className="space-y-1.5 leading-snug">
        <p className="text-[#ede3d1]">
          <b className="text-[#cbafff]">Qu’est-ce que c’est ?</b> {rule.definition}
        </p>
        <p className="text-[#cde7ff] bg-[#162030] border border-[#2a4263] p-2 rounded-lg">
          <b className="text-[#8dbbff]">Ce qu’il reste dans votre tour :</b> {rule.ceQuIlResteDansLeTour}
        </p>
        <p className="text-[#cbbba6]">
          <b className="text-[#f3d48d]">Exemples :</b> {rule.exemples}
        </p>
      </div>

      <div className="pt-2 border-t border-[#30251a] space-y-1.5">
        <b className="text-[11px] uppercase tracking-wider text-[#9e907d] block">
          Économie d’un tour en Chroniques Oubliées Fantasy (cliquer pour comparer) :
        </b>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {Object.values(COF_ACTION_RULES).map((ar) => {
            const selected = ar.id === rule.id;
            return (
              <button
                key={ar.id}
                type="button"
                onClick={() => setActiveActionHelp(ar)}
                className={`text-left p-2 rounded-lg border transition-all cursor-pointer ${
                  selected
                    ? 'bg-[#2a1f3d] border-[#cbafff] text-white shadow-sm'
                    : 'bg-[#1a1612] border-[#30251a] text-[#cbbba6] hover:border-[#6a518c]'
                }`}
              >
                <b className="text-xs block text-[#f3d48d]">{ar.shortLabel}</b>
                <span className="text-[11px] leading-snug block opacity-90">{ar.resume}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-2 sm:p-4 animate-fadeIn">
      <div className="bg-[#181410] border-2 border-[#d4a84a] rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-[#ede3d1]">
        {/* Modal Top Header with Entity Type Color */}
        <div
          className={`px-4 py-3 border-b border-[#3d3023] flex items-center justify-between ${
            item.type === 'monster' || item.type === 'monstre'
              ? 'bg-gradient-to-r from-[#3d1a1c] to-[#1a120e]'
              : item.type === 'spell' || item.type === 'sort' || item.type === 'actionRule'
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
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-black/40 border border-[#d4a84a]/40 flex items-center justify-center shrink-0">
              {(item.type === 'monster' || item.type === 'monstre') && <Skull className="w-5 h-5 text-[#ff9d9d]" />}
              {(item.type === 'spell' || item.type === 'sort') && <Zap className="w-5 h-5 text-[#cbafff]" />}
              {(item.type === 'equipment' || item.type === 'equipement') && <Coins className="w-5 h-5 text-[#f3d48d]" />}
              {item.type === 'wayRank' && <Sparkles className="w-5 h-5 text-[#f3d48d]" />}
              {item.type === 'actionRule' && <HelpCircle className="w-5 h-5 text-[#cbafff]" />}
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
                {item.type === 'actionRule' &&
                  `Économie d’Action COF${item.data.sourceTitle ? ` · ${item.data.sourceTitle}` : ''}`}
                {(item.type === 'rule' || item.type === 'regle') && `Règle Officielle · ${item.data.cat}`}
                {(item.type === 'state' || item.type === 'etat') && 'État Préjudiciable (COF)'}
                {item.type === 'race' && `Race Jouable du DRS · ${item.data.n}`}
                {item.type === 'profil' && `Vocation & Profil de Classe · ${item.data.n}`}
              </span>
              <h3 className="font-serif-co text-lg sm:text-xl font-bold text-[#f3d48d]">
                {(item.type === 'monster' || item.type === 'monstre') && item.data.n}
                {(item.type === 'spell' || item.type === 'sort') && item.data.n}
                {(item.type === 'equipment' || item.type === 'equipement') && (item.data.n || item.data.nom)}
                {item.type === 'wayRank' &&
                  (item.data.n || item.data.nom || item.data.rank?.nom)}
                {item.type === 'actionRule' &&
                  resolveActionRule(item.data.actionCost, item.data.isLimited, item.data.isSpell).label}
                {(item.type === 'rule' || item.type === 'regle') && item.data.t}
                {(item.type === 'state' || item.type === 'etat') && `${item.data.icon ? item.data.icon + ' ' : ''}${item.data.name || item.data.n}`}
                {item.type === 'race' && item.data.n}
                {item.type === 'profil' && item.data.n}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#231c15] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-3.5 sm:p-4 overflow-y-auto space-y-3">
          {/* ==================== 0. ACTION RULE EXPLANATION ==================== */}
          {item.type === 'actionRule' && (() => {
            const currentRule =
              activeActionHelp ||
              resolveActionRule(item.data.actionCost, item.data.isLimited, item.data.isSpell);
            return renderActionEconomyPanel(currentRule, false);
          })()}
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
                <p className="text-sm font-semibold text-[#ede3d1] leading-snug">
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
                  <p className="text-xs sm:text-sm text-[#ede3d1] leading-snug italic">
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
                <p className="text-xs text-[#ede3d1] leading-snug whitespace-pre-line">
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
                        <p className="text-[#ede3d1] leading-snug">{p.t}</p>
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
                  <p className="leading-snug text-[#c7bcac]">{item.data.tactique}</p>
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
                  <p className="text-[#ede3d1] leading-snug whitespace-pre-line">{item.data.origineNarratif}</p>
                </div>
              )}

              {/* Liens Personnels avec les PJ */}
              {item.data.liensPj && (
                <div className="p-3.5 bg-[#1a1514] border border-[#5e342d] rounded-xl text-xs space-y-1">
                  <b className="text-[#ffad99] flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-[#ffad99]" />
                    Liens Personnels avec les PJ :
                  </b>
                  <p className="text-[#ede3d1] leading-snug whitespace-pre-line">{item.data.liensPj}</p>
                </div>
              )}

              {/* Secret de la Figure Majeure */}
              {item.data.secret && (
                <div className="p-3.5 bg-[#10141a] border border-[#2d445c] rounded-xl text-xs space-y-1">
                  <b className="text-[#8dbbff] flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#8dbbff]" />
                    Secret Caché (Réservé au MJ) :
                  </b>
                  <p className="text-[#ede3d1] leading-snug whitespace-pre-line">{item.data.secret}</p>
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
                <p className="text-xs text-[#ede3d1] leading-snug">
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
                  <p className="text-[#ede3d1] leading-snug">{item.data.effetSecondaire}</p>
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
          {(item.type === 'spell' || item.type === 'sort') && (() => {
            const matchedCatalog = SORTS_CATALOG.find(
              (s) => s.n.toLowerCase().trim() === (item.data.n || '').toLowerCase().trim()
            );
            const matchedWayRank = findWayRankByName(item.data.n);
            const rawText = matchedWayRank?.t && matchedWayRank.t.length >= (item.data.t || '').length
              ? matchedWayRank.t
              : matchedCatalog?.t && matchedCatalog.t.length > (item.data.t || '').length
              ? matchedCatalog.t
              : item.data.t || matchedCatalog?.t || '';
            const portee = item.data.portee || matchedWayRank?.portee || matchedCatalog?.portee || (rawText.match(/\b(\d+\s*m(?:ètres?)?)\b/i)?.[1] || 'À vue / Contact');
            const duree = item.data.duree || matchedWayRank?.duree || matchedCatalog?.duree || (rawText.toLowerCase().includes('tour') ? '1d4 à 1d6 tours' : rawText.toLowerCase().includes('combat') ? '1 combat' : 'Instantané');
            const cibles = item.data.cibles || matchedWayRank?.cibles || matchedCatalog?.cibles;
            const testInfo = item.data.test || matchedWayRank?.test || matchedCatalog?.test || (
              rawText.toLowerCase().includes('test de') || rawText.toLowerCase().includes('dd ')
                ? 'Jet / Résistance précisé dans l’énoncé ci-dessus (SINON Attaque magique [d20 + Niveau + Mod. Magie] vs DEF).'
                : rawText.toLowerCase().includes('attaque') || rawText.toLowerCase().includes('dm')
                ? 'Jet d’Attaque magique [d20 + Niveau + Mod. Magie] contre la DEF de la cible (sauf mention « infaillible »).'
                : 'Aucun jet si la cible est volontaire ou consentante ; test d’Attaque magique / SAG opposé contre un ennemi.'
            );
            const degats = item.data.degats || matchedWayRank?.degats || matchedCatalog?.degats || (rawText.match(/(\[?[\dd+\s]+(?:Mod\.\s*\w+)?\]?\s*DM[^.,;]*)/i)?.[1] || undefined);
            const limites = item.data.limites || matchedWayRank?.limites || matchedCatalog?.limites;
            const isLimited = (item.data.L ?? matchedWayRank?.L ?? matchedCatalog?.L) === 1;
            const actionCost = item.data.actionCost || matchedWayRank?.actionCost || matchedCatalog?.actionCost || (isLimited ? 'Action Limitée (L)' : 'Action d’Attaque (A)');
            const nature = item.data.nature || matchedWayRank?.nature || matchedCatalog?.nature || 'Sortilège arcanique / divin';
            const composantes = item.data.composantes || matchedWayRank?.composantes || matchedCatalog?.composantes || 'Verbale (V : incantation audible) + Somatique (S : gestes visibles)';
            const natureDegats = item.data.natureDegats || matchedWayRank?.natureDegats || matchedCatalog?.natureDegats || 'Magique';
            const actionRule = resolveActionRule(actionCost, isLimited, true);

            return (
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="bg-[#231c15] border border-[#3a2954] rounded-xl p-2 text-center">
                    <small className="text-[10px] text-[#cbafff] uppercase font-bold block">Rang</small>
                    <b className="font-serif-co text-base sm:text-lg text-[#f3d48d]">Rang {item.data.rang}</b>
                  </div>
                  <div className="bg-[#231c15] border border-[#3a2954] rounded-xl p-2 text-center">
                    <small className="text-[10px] text-[#cbafff] uppercase font-bold block">Coût en Mana</small>
                    <b className="font-serif-co text-base sm:text-lg text-[#8dbbff]">{item.data.rang} PM</b>
                  </div>
                  <div className="bg-[#231c15] border border-[#3a2954] rounded-xl p-2 text-center">
                    <small className="text-[10px] text-[#cbafff] uppercase font-bold block">Portée</small>
                    <b className="text-xs sm:text-sm text-[#ede3d1]">{portee}</b>
                  </div>
                  <div className="bg-[#231c15] border border-[#3a2954] rounded-xl p-2 text-center">
                    <small className="text-[10px] text-[#cbafff] uppercase font-bold block">Durée</small>
                    <b className="text-xs sm:text-sm text-[#ede3d1]">{duree}</b>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {item.data.voie && (
                    <span className="text-[#9e907d] bg-[#181410] px-2.5 py-1.5 rounded-lg border border-[#30251a]">
                      Voie : <b className="text-[#cbafff]">{item.data.voie}</b>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setActiveActionHelp((prev) =>
                        prev?.id === actionRule.id ? null : actionRule
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg font-bold border inline-flex items-center gap-1.5 cursor-pointer transition-all shadow-xs ${actionRule.badgeStyle}`}
                    title="Cliquez pour afficher l'explication complète de ce type d'action en COF"
                  >
                    <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{actionCost}</span>
                    <span className="text-[10px] opacity-85 underline ml-0.5">
                      {activeActionHelp?.id === actionRule.id ? 'Masquer règle' : 'C’est quoi ?'}
                    </span>
                  </button>
                </div>

                {activeActionHelp && renderActionEconomyPanel(activeActionHelp, true)}

                <div className="bg-[#231c15] border border-[#3a2954] rounded-xl p-3 space-y-1">
                  <b className="text-xs font-bold text-[#cbafff] uppercase tracking-wider block">
                    Description &amp; Effets Magiques
                  </b>
                  <p className="text-sm text-[#ede3d1] leading-snug">
                    {rawText}
                  </p>
                </div>

                {/* Nature, Composantes & Nature des dégâts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-[#1b1526] border border-[#432d63] rounded-xl space-y-0.5">
                    <b className="text-[#d8b4fe] block">✨ Nature du sort :</b>
                    <p className="text-[#ede3d1] leading-snug">{nature}</p>
                  </div>
                  <div className="p-2.5 bg-[#291519] border border-[#612832] rounded-xl space-y-0.5">
                    <b className="text-[#fda4af] block">🩸 Nature des dégâts / Effet :</b>
                    <p className="text-[#ede3d1] leading-snug">{natureDegats}</p>
                  </div>
                  <div className="p-2.5 bg-[#142029] border border-[#294c66] rounded-xl space-y-0.5 sm:col-span-2">
                    <b className="text-[#7dd3fc] block">🖐️ Composantes &amp; Visibilité (à voir / à entendre) :</b>
                    <p className="text-[#ede3d1] leading-snug">{composantes}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {cibles && (
                    <div className="p-2.5 bg-[#171d29] border border-[#2d4063] rounded-xl space-y-0.5">
                      <b className="text-[#93c5fd] block">🎯 Cibles &amp; Zone :</b>
                      <p className="text-[#ede3d1] leading-snug">{cibles}</p>
                    </div>
                  )}
                  {degats && (
                    <div className="p-2.5 bg-[#281515] border border-[#612828] rounded-xl space-y-0.5">
                      <b className="text-[#fca5a5] block">💥 Dégâts / Effet chiffré :</b>
                      <p className="text-[#ede3d1] leading-snug">{degats}</p>
                    </div>
                  )}
                  <div className="p-2.5 bg-[#1d1729] border border-[#443166] rounded-xl space-y-0.5 sm:col-span-2">
                    <b className="text-[#d8b4fe] block">🎲 Test &amp; Jet de Résistance :</b>
                    <p className="text-[#ede3d1] leading-snug">{testInfo}</p>
                  </div>
                  {limites && (
                    <div className="p-2.5 bg-[#241a10] border border-[#664620] rounded-xl space-y-0.5 sm:col-span-2">
                      <b className="text-[#fcd34d] block">⚠️ Limites &amp; Précisions de jeu :</b>
                      <p className="text-[#ede3d1] leading-snug">{limites}</p>
                    </div>
                  )}
                </div>

                <div className="p-2.5 bg-[#181320] border border-[#3d2757] rounded-xl text-xs text-[#cbafff] leading-snug">
                  ⚡ <b>Règle de lancement COF :</b> Lancer un sort coûte <b>{item.data.rang} PM</b> (1 PM par Rang) et consomme l’action indiquée ci-dessus (cliquez dessus pour voir le détail). Attaque magique = <b>d20 + Niveau + Mod. Magie</b> (INT, SAG ou CHA selon le profil).
                </div>
              </div>
            );
          })()}

          {/* ==================== 4. WAY RANK DETAILS ==================== */}
          {item.type === 'wayRank' && (() => {
            const rankNum = item.data.rankNum || item.data.rank?.rang || 1;
            const rankName = item.data.n || item.data.nom || item.data.rank?.nom || '';
            const matchedWayRank = findWayRankByName(rankName);
            const matchedSpell = SORTS_CATALOG.find(
              (s) => s.n.toLowerCase().trim() === rankName.toLowerCase().trim()
            );
            const rawEffect =
              item.data.t ||
              item.data.description ||
              item.data.rank?.description ||
              matchedWayRank?.t ||
              matchedSpell?.t ||
              'Aucun texte descriptif.';
            const displayEffect =
              matchedWayRank?.t && matchedWayRank.t.length >= rawEffect.length
                ? matchedWayRank.t
                : matchedSpell?.t && matchedSpell.t.length > rawEffect.length
                ? matchedSpell.t
                : rawEffect;
            const isLimited = Boolean(item.data.L ?? item.data.isLimited ?? item.data.rank?.isLimited ?? matchedWayRank?.L);
            const isSpell = Boolean(item.data.S ?? item.data.isSpell ?? item.data.rank?.isSpell ?? matchedWayRank?.S);
            const portee = item.data.portee || matchedWayRank?.portee || matchedSpell?.portee || (isSpell ? (displayEffect.match(/\b(\d+\s*m(?:ètres?)?)\b/i)?.[1] || 'À vue / Contact') : 'Personnelle / Contact');
            const duree = item.data.duree || matchedWayRank?.duree || matchedSpell?.duree || (isSpell ? (displayEffect.toLowerCase().includes('tour') ? '1d4 à 1d6 tours' : displayEffect.toLowerCase().includes('combat') ? '1 combat' : 'Instantané') : 'Selon effet');
            const cibles = item.data.cibles || matchedWayRank?.cibles || matchedSpell?.cibles;
            const testInfo = item.data.test || matchedWayRank?.test || matchedSpell?.test || (
              isSpell
                ? (displayEffect.toLowerCase().includes('test') || displayEffect.toLowerCase().includes('dd ')
                    ? 'Test précisé dans l’effet ci-dessus (ou Attaque magique [d20 + Niveau + Mod. Magie] vs DEF).'
                    : 'Jet d’Attaque magique [d20 + Niveau + Mod. Magie] vs DEF contre un adversaire ; réussite automatique sur soi ou cible consentante.')
                : undefined
            );
            const degats = item.data.degats || matchedWayRank?.degats || matchedSpell?.degats || (displayEffect.match(/(\[?[\dd+\s]+(?:Mod\.\s*\w+)?\]?\s*DM[^.,;]*)/i)?.[1] || undefined);
            const limites = item.data.limites || matchedWayRank?.limites || matchedSpell?.limites;
            const actionCost = item.data.actionCost || matchedWayRank?.actionCost || matchedSpell?.actionCost || (isLimited ? 'Action Limitée (L)' : isSpell ? 'Action d’Attaque (A)' : 'Passif (0 action)');
            const nature = item.data.nature || matchedWayRank?.nature || matchedSpell?.nature || (isSpell ? 'Sortilège de profil' : 'Capacité / Technique de profil');
            const composantes = item.data.composantes || matchedWayRank?.composantes || matchedSpell?.composantes || (isSpell ? 'Verbale (V) + Somatique (S)' : 'Aucune composante magique');
            const natureDegats = item.data.natureDegats || matchedWayRank?.natureDegats || matchedSpell?.natureDegats || 'Selon capacité';
            const actionRule = resolveActionRule(actionCost, isLimited, isSpell);

            return (
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold bg-[#3b2a1a] text-[#f3d48d] px-3 py-1.5 rounded-lg border border-[#d4a84a]/40">
                    {item.data.wayName} · Rang {rankNum}
                  </span>
                  <span className="text-xs text-[#9e907d] bg-[#231c15] px-2.5 py-1.5 rounded-lg border border-[#3d3023]">
                    Profil : {item.data.profile || item.data.className || matchedWayRank?.profil || 'Héroïque'}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveActionHelp((prev) =>
                        prev?.id === actionRule.id ? null : actionRule
                      )
                    }
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border inline-flex items-center gap-1.5 cursor-pointer transition-all shadow-xs ${actionRule.badgeStyle}`}
                    title="Cliquez pour afficher l'explication complète de ce type d'action en COF"
                  >
                    <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{actionCost}</span>
                    <span className="text-[10px] opacity-85 underline ml-0.5">
                      {activeActionHelp?.id === actionRule.id ? 'Masquer règle' : 'C’est quoi ?'}
                    </span>
                  </button>
                  {isSpell && (
                    <span className="text-xs font-bold bg-[#1e2f47] text-[#b0d7ff] px-2.5 py-1.5 rounded-lg border border-[#2e4b73]">
                      Sortilège ({rankNum} PM)
                    </span>
                  )}
                </div>

                {activeActionHelp && renderActionEconomyPanel(activeActionHelp, true)}

                <div className={`grid grid-cols-2 ${isSpell ? 'sm:grid-cols-3' : ''} gap-2`}>
                  <div className="bg-[#1b1612] border border-[#3d3023] rounded-xl p-2 text-center">
                    <small className="text-[10px] text-[#9e907d] uppercase font-bold block">Portée</small>
                    <b className="text-xs sm:text-sm text-[#ede3d1]">{portee}</b>
                  </div>
                  <div className="bg-[#1b1612] border border-[#3d3023] rounded-xl p-2 text-center">
                    <small className="text-[10px] text-[#9e907d] uppercase font-bold block">Durée</small>
                    <b className="text-xs sm:text-sm text-[#ede3d1]">{duree}</b>
                  </div>
                  {isSpell && (
                    <div className="bg-[#1b1612] border border-[#3a2954] rounded-xl p-2 text-center col-span-2 sm:col-span-1">
                      <small className="text-[10px] text-[#cbafff] uppercase font-bold block">Coût Mana</small>
                      <b className="text-xs sm:text-sm text-[#8dbbff]">{rankNum} PM</b>
                    </div>
                  )}
                </div>

                <div className="bg-[#231c15] border border-[#3d3023] rounded-xl p-3 space-y-1">
                  <b className="text-xs font-bold text-[#f3d48d] uppercase tracking-wider block">
                    Effet Mécanique Officiel
                  </b>
                  <p className="text-sm text-[#ede3d1] leading-snug">
                    {displayEffect}
                  </p>
                </div>

                {/* Nature, Composantes & Nature des dégâts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-[#1b1526] border border-[#432d63] rounded-xl space-y-0.5">
                    <b className="text-[#d8b4fe] block">✨ Nature de la capacité / sort :</b>
                    <p className="text-[#ede3d1] leading-snug">{nature}</p>
                  </div>
                  <div className="p-2.5 bg-[#291519] border border-[#612832] rounded-xl space-y-0.5">
                    <b className="text-[#fda4af] block">🩸 Nature des dégâts / Effet :</b>
                    <p className="text-[#ede3d1] leading-snug">{natureDegats}</p>
                  </div>
                  <div className="p-2.5 bg-[#142029] border border-[#294c66] rounded-xl space-y-0.5 sm:col-span-2">
                    <b className="text-[#7dd3fc] block">🖐️ Composantes &amp; Visibilité (à voir / à entendre) :</b>
                    <p className="text-[#ede3d1] leading-snug">{composantes}</p>
                  </div>
                </div>

                {(cibles || testInfo || degats || limites) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {cibles && (
                      <div className="p-2.5 bg-[#171d29] border border-[#2d4063] rounded-xl space-y-0.5">
                        <b className="text-[#93c5fd] block">🎯 Cibles &amp; Zone :</b>
                        <p className="text-[#ede3d1] leading-snug">{cibles}</p>
                      </div>
                    )}
                    {degats && (
                      <div className="p-2.5 bg-[#281515] border border-[#612828] rounded-xl space-y-0.5">
                        <b className="text-[#fca5a5] block">💥 Dégâts / Effet chiffré :</b>
                        <p className="text-[#ede3d1] leading-snug">{degats}</p>
                      </div>
                    )}
                    {testInfo && (
                      <div className="p-2.5 bg-[#1d1729] border border-[#443166] rounded-xl space-y-0.5 sm:col-span-2">
                        <b className="text-[#d8b4fe] block">🎲 Test &amp; Jet de Résistance :</b>
                        <p className="text-[#ede3d1] leading-snug">{testInfo}</p>
                      </div>
                    )}
                    {limites && (
                      <div className="p-2.5 bg-[#241a10] border border-[#664620] rounded-xl space-y-0.5 sm:col-span-2">
                        <b className="text-[#fcd34d] block">⚠️ Limites &amp; Précisions de jeu :</b>
                        <p className="text-[#ede3d1] leading-snug">{limites}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="p-2.5 bg-[#120f0c] border border-[#30251a] rounded-xl text-xs text-[#9e907d] space-y-0.5 leading-snug">
                  <b className="text-[#f3d48d]">Règle d&apos;acquisition :</b>
                  <p>
                    Les rangs 1 et 2 coûtent <b>1 point de capacité</b> chacun. Les rangs 3, 4 et 5 coûtent <b>2 points de capacité</b> chacun (pour les PJ, progression dans l&apos;ordre croissant ; pour les PNJ du MJ, sélection libre sans blocage de rang).
                  </p>
                </div>
              </div>
            );
          })()}

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
                <p className="text-xs sm:text-sm text-[#ede3d1] leading-snug whitespace-pre-line">
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

                <div className="text-xs sm:text-sm text-[#ede3d1] leading-snug pt-1 bg-[#181410] border border-[#30251a] p-3 rounded-lg">
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
                  <p className="text-[#ede3d1] leading-snug">
                    {item.data.quand || "Lors d'une attaque spéciale, sortilège néfaste, échec critique ou piège de zone."}
                  </p>
                </div>

                {/* 2. COMMENT */}
                <div className="p-3 bg-[#181a24] border border-[#32416b] rounded-xl space-y-1 text-xs">
                  <b className="text-[#9bb8ff] flex items-center gap-1.5 font-bold">
                    <span>🎲</span> Comment s'applique-t-il ? (Mécanique)
                  </b>
                  <p className="text-[#ede3d1] leading-snug">
                    {item.data.comment || (item.data.impactCourt || item.data.t)}
                  </p>
                </div>

                {/* 3. POURQUOI */}
                <div className="p-3 bg-[#241724] border border-[#6b326b] rounded-xl space-y-1 text-xs">
                  <b className="text-[#f0a6f0] flex items-center gap-1.5 font-bold">
                    <span>🧬</span> Pourquoi ? (Justification en jeu)
                  </b>
                  <p className="text-[#ede3d1] leading-snug">
                    {item.data.pourquoi || "Perte de repères biologiques, sidération psychique, choc traumatique ou entrave physique."}
                  </p>
                </div>

                {/* 4. GUÉRISON */}
                <div className="p-3 bg-[#152416] border border-[#2b592e] rounded-xl space-y-1 text-xs">
                  <b className="text-[#8be391] flex items-center gap-1.5 font-bold">
                    <span>🌿</span> Comment en guérir / s'en libérer ?
                  </b>
                  <p className="text-[#ede3d1] leading-snug">
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
                <p className="text-xs sm:text-sm text-[#ede3d1] leading-snug whitespace-pre-line">
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
                      <p className="text-xs text-[#ede3d1] leading-snug">{cp.t}</p>
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
                          <p className="text-[#ede3d1] leading-snug">{opt.t}</p>
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
                      <p className="text-xs text-[#ede3d1] leading-snug">
                        {item.data.relations}
                      </p>
                    </div>
                  )}
                  {item.data.nomsExemples && (
                    <div>
                      <b className="text-xs font-bold text-[#9e907d] uppercase tracking-wider block mb-1">
                        Traditions &amp; Exemples de noms
                      </b>
                      <p className="text-xs text-[#d4a84a] whitespace-pre-line leading-snug font-mono">
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
                <p className="text-xs sm:text-sm text-[#ede3d1] leading-snug whitespace-pre-line">
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
