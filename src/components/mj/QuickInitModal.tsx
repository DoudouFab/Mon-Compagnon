import React, { useEffect, useRef, useState } from 'react';
import { Dices, RotateCcw, ArrowUpDown, X, Eraser } from 'lucide-react';
import { Character, Combatant } from '../../types/chroniques';
import { getPjColor } from '../../utils/pjColors';

interface QuickInitModalProps {
  isOpen: boolean;
  onClose: () => void;
  combatants: Combatant[];
  pjs: Character[];
  onApply: (updates: Record<string, { init: number | null; lastRoll?: number }>, sortAfter: boolean) => void;
}

export const QuickInitModal: React.FC<QuickInitModalProps> = ({
  isOpen,
  onClose,
  combatants,
  pjs,
  onApply,
}) => {
  // Draft string par combatant id : vide par défaut pour saisie directe immédiate
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [rolls, setRolls] = useState<Record<string, number | undefined>>({});
  const [clearedIds, setClearedIds] = useState<Record<string, boolean>>({});
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    setDrafts({});
    setRolls({});
    setClearedIds({});
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 40);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChangeDraft = (id: string, val: string) => {
    setDrafts((prev) => ({ ...prev, [id]: val }));
    setClearedIds((prev) => {
      if (!prev[id]) return prev;
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setRolls((prev) => {
      if (prev[id] === undefined) return prev;
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleRollRow = (c: Combatant) => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    const total = d20 + (c.baseInit || 10);
    setDrafts((prev) => ({ ...prev, [c.id]: String(total) }));
    setRolls((prev) => ({ ...prev, [c.id]: d20 }));
    setClearedIds((prev) => {
      const copy = { ...prev };
      delete copy[c.id];
      return copy;
    });
  };

  const handleRollMonsters = () => {
    const nextDrafts = { ...drafts };
    const nextRolls = { ...rolls };
    const nextCleared = { ...clearedIds };
    combatants.forEach((c) => {
      if (!c.isPj) {
        const d20 = Math.floor(Math.random() * 20) + 1;
        nextDrafts[c.id] = String(d20 + (c.baseInit || 10));
        nextRolls[c.id] = d20;
        delete nextCleared[c.id];
      }
    });
    setDrafts(nextDrafts);
    setRolls(nextRolls);
    setClearedIds(nextCleared);
  };

  const handleClearPjCases = () => {
    const nextDrafts = { ...drafts };
    const nextRolls = { ...rolls };
    const nextCleared = { ...clearedIds };
    combatants.forEach((c) => {
      if (c.isPj) {
        nextDrafts[c.id] = '';
        delete nextRolls[c.id];
        nextCleared[c.id] = true;
      }
    });
    setDrafts(nextDrafts);
    setRolls(nextRolls);
    setClearedIds(nextCleared);
    const firstPjIdx = combatants.findIndex((c) => c.isPj);
    if (firstPjIdx >= 0) {
      setTimeout(() => inputRefs.current[firstPjIdx]?.focus(), 20);
    }
  };

  const handleClearSingle = (id: string) => {
    setDrafts((prev) => ({ ...prev, [id]: '' }));
    setRolls((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setClearedIds((prev) => ({ ...prev, [id]: true }));
  };

  const handleSubmit = (sortAfter: boolean) => {
    const updates: Record<string, { init: number | null; lastRoll?: number }> = {};
    combatants.forEach((c) => {
      const raw = (drafts[c.id] ?? '').trim();
      if (raw !== '') {
        const parsed = parseInt(raw, 10);
        if (!Number.isNaN(parsed)) {
          updates[c.id] = {
            init: parsed,
            lastRoll: rolls[c.id],
          };
        }
      } else if (clearedIds[c.id]) {
        updates[c.id] = {
          init: null,
          lastRoll: undefined,
        };
      }
    });
    onApply(updates, sortAfter);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-3 sm:p-5 animate-fadeIn">
      <div className="bg-[#181410] border-2 border-[#d4a84a] rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden text-[#ede3d1]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#3d3023] bg-gradient-to-r from-[#2c1d12] via-[#1b140f] to-[#14100c] flex items-center justify-between gap-3">
          <div>
            <h3 className="font-serif-co text-lg sm:text-xl font-bold text-[#f3d48d] flex items-center gap-2">
              <Dices className="w-5 h-5 text-[#d4a84a]" />
              <span>Saisie Rapide des Initiatives</span>
            </h3>
            <p className="text-xs text-[#9e907d] mt-0.5">
              Toutes les cases démarrent vides : tapez directement le score d&apos;initiative et appuyez sur Entrée pour passer au suivant.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#231c15] cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Toolbar */}
        <div className="px-5 py-2.5 bg-[#130f0c] border-b border-[#2e241b] flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleRollMonsters}
              className="px-3 py-1.5 rounded-lg bg-[#3a2954] hover:bg-[#4d3670] border border-[#654a93] text-[#dccbff] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Tirer auto Monstres</span>
            </button>
            <button
              type="button"
              onClick={handleClearPjCases}
              className="px-3 py-1.5 rounded-lg bg-[#231c15] hover:bg-[#32271d] border border-[#523d24] text-[#f3d48d] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              title="Remettre toutes les initiatives des PJ à vide"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#d4a84a]" />
              <span>Init PJ à vide</span>
            </button>
          </div>
          <span className="text-[11px] text-[#9e907d]">
            {combatants.length} combattant{combatants.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Rows */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2">
          {combatants.length === 0 ? (
            <p className="text-center text-xs text-[#9e907d] py-8">
              Aucun combattant sur la piste de combat.
            </p>
          ) : (
            combatants.map((c, idx) => {
              const matchedPj = c.isPj
                ? pjs.find(
                    (p) =>
                      (c.pjRefId && p.id === c.pjRefId) ||
                      (p.name && c.n.toLowerCase().startsWith(p.name.toLowerCase()))
                  )
                : undefined;
              const pjCol = c.isPj ? getPjColor(matchedPj || { id: c.pjRefId, name: c.n }, pjs) : null;
              const isCleared = Boolean(clearedIds[c.id]);

              return (
                <div
                  key={c.id || idx}
                  style={
                    pjCol
                      ? {
                          borderColor: pjCol.borderHex,
                          backgroundImage: `linear-gradient(${pjCol.softBg}, ${pjCol.softBg})`,
                        }
                      : undefined
                  }
                  className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 p-2.5 sm:px-3.5 rounded-xl bg-[#14100c] border border-[#32271c]"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {pjCol && (
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: pjCol.hex }}
                        aria-hidden="true"
                      />
                    )}
                    <span
                      style={
                        pjCol
                          ? {
                              backgroundColor: pjCol.tagBg,
                              color: pjCol.hex,
                              borderColor: pjCol.borderHex,
                            }
                          : undefined
                      }
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase border shrink-0 ${
                        c.isPj
                          ? 'bg-[#3b2a1a] text-[#f3d48d] border-[#d4a84a]/40'
                          : 'bg-[#381616] text-[#ff9d9d] border-[#6d2525]'
                      }`}
                    >
                      {c.isPj ? 'PJ' : 'PNJ/M'}
                    </span>
                    <div className="min-w-0">
                      <div
                        className="text-sm font-bold truncate"
                        style={{ color: pjCol ? pjCol.hex : '#ede3d1' }}
                      >
                        {c.n}
                      </div>
                      <div className="text-[10px] text-[#9e907d] flex items-center gap-2">
                        <span>Base : {c.baseInit ?? 10}</span>
                        <span>•</span>
                        <span>
                          Actuel :{' '}
                          <b className="text-[#cbb8a7]">
                            {isCleared ? 'Vide' : c.init !== null && c.init !== undefined ? c.init : 'Vide'}
                          </b>
                        </span>
                        {rolls[c.id] !== undefined && (
                          <span className="text-[#c084fc] font-mono">(d20: {rolls[c.id]})</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Direct empty input + roll + clear */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                    <input
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      type="number"
                      inputMode="numeric"
                      value={drafts[c.id] ?? ''}
                      onChange={(e) => handleChangeDraft(c.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (idx < combatants.length - 1) {
                            inputRefs.current[idx + 1]?.focus();
                          } else {
                            handleSubmit(true);
                          }
                        }
                      }}
                      placeholder={isCleared ? 'Vide' : 'Init...'}
                      className={`w-24 px-2.5 py-1.5 rounded-lg bg-[#0c0907] border text-center font-mono text-sm font-bold outline-none transition-colors ${
                        isCleared
                          ? 'border-[#9c2a2b] text-[#ff9d9d] placeholder-[#ff9d9d]/60'
                          : 'border-[#4a3925] focus:border-[#d4a84a] text-[#f3d48d] placeholder-[#6b5d4c]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRollRow(c)}
                      title={`Tirer 1d20 + ${c.baseInit ?? 10}`}
                      className="p-2 rounded-lg bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] hover:border-[#d4a84a] text-[#d4a84a] cursor-pointer"
                    >
                      <Dices className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleClearSingle(c.id)}
                      title="Mettre cette initiative à vide"
                      className="p-2 rounded-lg bg-[#231c15] hover:bg-[#381616] border border-[#3d3023] hover:border-[#9c2a2b] text-[#9e907d] hover:text-[#ff9d9d] cursor-pointer"
                    >
                      <Eraser className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[#3d3023] bg-[#130f0c] flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] text-[#8a7c69]">
            Astuce : les cases laissées vides conservent leur valeur actuelle (sauf si effacées).
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-xs font-semibold text-[#ede3d1] cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="px-3.5 py-2 rounded-xl bg-[#2b2117] hover:bg-[#3b2d1f] border border-[#5c4529] text-xs font-bold text-[#f3d48d] cursor-pointer"
            >
              Appliquer sans trier
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4a84a] to-[#a87e28] hover:brightness-110 text-[#140e08] font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Appliquer &amp; Trier l&apos;ordre</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
