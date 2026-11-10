/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, X, Info, Search, ShieldAlert, Check, RotateCcw } from 'lucide-react';
import { ETATS_PREJUDICIABLES, getStateDef, PrejudicialStateDef } from '../../data/etatsData';

interface StateBadgeListProps {
  activeStates: string[];
  onChange?: (newStates: string[]) => void;
  onToggleState?: (stateName: string) => void;
  onOpenStateDetail?: (stateDef: PrejudicialStateDef) => void;
  onSelectDetail?: (stateDef: PrejudicialStateDef) => void;
  compact?: boolean;
  readOnly?: boolean;
  allowEdit?: boolean;
  label?: string;
  targetName?: string;
}

export const StateBadgeList: React.FC<StateBadgeListProps> = ({
  activeStates = [],
  onChange,
  onToggleState,
  onOpenStateDetail,
  onSelectDetail,
  compact = false,
  readOnly = false,
  allowEdit = true,
  label,
  targetName,
}) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenDetail = (def: PrejudicialStateDef) => {
    if (onOpenStateDetail) onOpenStateDetail(def);
    else if (onSelectDetail) onSelectDetail(def);
  };

  const toggleState = (name: string) => {
    if (readOnly || allowEdit === false) return;
    if (onToggleState) {
      onToggleState(name);
      return;
    }
    if (onChange) {
      if (activeStates.includes(name)) {
        onChange(activeStates.filter((s) => s !== name));
      } else {
        onChange([...activeStates, name]);
      }
    }
  };

  const removeState = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    if (readOnly || allowEdit === false) return;
    if (onToggleState) {
      onToggleState(name);
      return;
    }
    if (onChange) {
      onChange(activeStates.filter((s) => s !== name));
    }
  };

  const clearAllStates = () => {
    if (readOnly || allowEdit === false) return;
    if (onChange) {
      onChange([]);
    } else if (onToggleState) {
      activeStates.forEach((st) => onToggleState(st));
    }
  };

  const canEdit = !readOnly && allowEdit && (!!onChange || !!onToggleState);

  const filteredStates = ETATS_PREJUDICIABLES.filter((st) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      st.name.toLowerCase().includes(q) ||
      st.impactShort.toLowerCase().includes(q) ||
      st.desc.toLowerCase().includes(q)
    );
  });

  return (
    <div className="relative inline-flex flex-wrap items-center gap-1.5">
      {label && <span className="text-[11px] font-bold text-[#9e907d] mr-1">{label} :</span>}

      {/* Active State Badges */}
      {activeStates.map((stName) => {
        const def = getStateDef(stName);
        const icon = def?.icon || '⚠️';
        const displayName = def?.name || stName;
        const colorClasses = def
          ? `${def.color} ${def.borderColor} ${def.textColor}`
          : 'bg-[#291712] border-[#8a3328] text-[#ffb0a3]';

        if (compact) {
          return (
            <button
              key={stName}
              type="button"
              onClick={() => def && handleOpenDetail(def)}
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold border transition-all hover:scale-105 cursor-pointer shadow-xs ${colorClasses}`}
              title={`${displayName} : ${def?.impactShort || "Cliquer pour voir l'impact"}`}
            >
              <span>{icon}</span>
              <span className="hidden sm:inline">{displayName}</span>
              {canEdit && (
                <span
                  onClick={(e) => removeState(e, stName)}
                  className="ml-0.5 opacity-60 hover:opacity-100 hover:text-red-400 font-bold"
                >
                  ×
                </span>
              )}
            </button>
          );
        }

        return (
          <div
            key={stName}
            onClick={() => def && handleOpenDetail(def)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all hover:scale-102 cursor-pointer shadow-sm ${colorClasses}`}
            title="Cliquer pour afficher la règle officielle en pop-up"
          >
            <span className="text-sm">{icon}</span>
            <span>{displayName}</span>
            {def?.impactShort && (
              <span className="text-[10px] font-normal opacity-80 hidden md:inline">
                ({def.impactShort})
              </span>
            )}
            <Info className="w-3 h-3 opacity-60 hover:opacity-100 ml-0.5" />
            {canEdit && (
              <button
                type="button"
                onClick={(e) => removeState(e, stName)}
                className="ml-1 p-0.5 rounded hover:bg-black/30 hover:text-red-400 transition-colors"
                title="Retirer cet état"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      })}

      {/* Button to open state selector modal (Pop-up Window) */}
      {canEdit && (
        <button
          type="button"
          onClick={() => {
            setSearchQuery('');
            setIsOpenModal(true);
          }}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all shadow-xs cursor-pointer ${
            activeStates.length > 0
              ? 'bg-[#291717] border-[#8a3328] text-[#ffc4be] hover:bg-[#381c1c] hover:border-[#cf5544]'
              : 'bg-[#2a1b14] border-[#7d4822] text-[#f5c69b] hover:bg-[#3d271e] hover:border-[#d4a84a]'
          }`}
          title="Ouvrir la fenêtre de gestion des états préjudiciables"
        >
          <Plus className="w-3.5 h-3.5 text-[#ff8a7a]" />
          <span>{activeStates.length === 0 ? '+ Infliger un état' : '+ Gérer les états'}</span>
        </button>
      )}

      {/* Pop-up Window Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#181410] border-2 border-[#d4a84a]/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#3d3023] bg-gradient-to-r from-[#2b1712] via-[#1c130d] to-[#14100c]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#cf5544]/20 text-[#ff9d9d] border border-[#cf5544]/40">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-co text-lg font-bold text-[#ffb8b8]">
                    Gestion des États Préjudiciables &amp; Conditions
                  </h3>
                  <p className="text-xs text-[#a0907d]">
                    {targetName ? (
                      <>
                        Pour : <strong className="text-[#f3d48d]">{targetName}</strong> • Cochez pour appliquer ou dissiper
                      </>
                    ) : (
                      'Règles officielles de Chroniques Oubliées Fantasy • Cochez pour appliquer ou dissiper'
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#2a1717] border border-[#8a3328] text-[#ffb8b8]">
                  {activeStates.length} actif{activeStates.length > 1 ? 's' : ''}
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="p-1.5 rounded-lg text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#2b2016] transition-colors cursor-pointer"
                  title="Fermer la fenêtre"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Sub-Header: Search & Quick Clear */}
            <div className="p-3 bg-[#14100c] border-b border-[#2d2218] flex items-center justify-between gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-[#9e907d] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un état (ex: aveuglé, étourdi, renversé...)"
                  className="w-full bg-[#0d0b09] border border-[#2d2218] focus:border-[#d4a84a] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#ede3d1] placeholder-[#7d6f5f] outline-hidden"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9e907d] hover:text-[#ede3d1]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {activeStates.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllStates}
                  className="px-3 py-1.5 rounded-lg bg-[#2b1717] hover:bg-[#3d1d1d] border border-[#8a3328] text-[#ffb8b8] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  title="Dissiper et retirer tous les états d'un coup"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Tout dissiper ({activeStates.length})</span>
                </button>
              )}
            </div>

            {/* Modal Body: Cards Grid */}
            <div className="p-4 overflow-y-auto space-y-2.5 max-h-[60vh]">
              {filteredStates.length === 0 ? (
                <div className="text-center py-8 text-[#9e907d] text-xs italic">
                  Aucun état ne correspond à « {searchQuery} ».
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {filteredStates.map((st) => {
                    const isSelected = activeStates.includes(st.name);

                    return (
                      <div
                        key={st.id}
                        onClick={() => toggleState(st.name)}
                        className={`group relative p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-2 shadow-xs ${
                          isSelected
                            ? `${st.color} ${st.borderColor} ${st.textColor} shadow-md ring-1 ring-white/10`
                            : 'bg-[#1a1410] border-[#382b20] text-[#ede3d1] hover:border-[#5a432f] hover:bg-[#201813]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl select-none shrink-0 drop-shadow-sm">
                              {st.icon}
                            </span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-serif-co text-sm font-bold tracking-wide">
                                  {st.name}
                                </span>
                                {isSelected && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-black/40 border border-white/20">
                                    <Check className="w-3 h-3 text-[#86efac]" /> Actif
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Checkbox badge */}
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? 'bg-[#d4a84a] border-[#f3d48d] text-[#1a1208]'
                                : 'bg-[#0f0d0b] border-[#4a3828] text-transparent'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        </div>

                        {/* Impact highlight pill */}
                        <div className="px-2 py-1 rounded-md bg-black/30 border border-white/10 text-[11px] font-semibold text-[#f5c69b] leading-tight">
                          ⚡ {st.impactShort}
                        </div>

                        {/* Description & Detail Button */}
                        <p className="text-[11px] opacity-80 leading-relaxed line-clamp-3">
                          {st.desc}
                        </p>

                        <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[10px]">
                          <span className="text-[#9e907d]">
                            {isSelected ? 'Cliquer pour retirer' : 'Cliquer pour appliquer'}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetail(st);
                            }}
                            className="text-[#d4a84a] hover:text-[#f3d48d] flex items-center gap-1 font-bold underline cursor-pointer"
                            title="Consulter la règle officielle complète"
                          >
                            <Info className="w-3 h-3" />
                            Règles détaillées
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 border-t border-[#3d3023] bg-[#120f0d] flex items-center justify-between gap-3">
              <span className="text-xs text-[#9e907d]">
                {activeStates.length === 0 ? (
                  'Aucun état préjudiciable actif'
                ) : (
                  <>
                    <strong className="text-[#ffb8b8]">{activeStates.length}</strong> état
                    {activeStates.length > 1 ? 's' : ''} actif{activeStates.length > 1 ? 's' : ''} :{' '}
                    <span className="text-[#f3d48d]">{activeStates.join(', ')}</span>
                  </>
                )}
              </span>

              <button
                type="button"
                onClick={() => setIsOpenModal(false)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4a84a] to-[#ab8230] hover:brightness-110 text-[#1a1208] text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
              >
                Terminer &amp; Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

