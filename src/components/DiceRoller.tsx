import React, { useState } from 'react';
import { Dices, RotateCcw, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { useToast } from './common/ToastContext';

interface DiceRollHistory {
  id: string;
  timestamp: string;
  formula: string;
  inputRoll: number;
  modifier: number;
  total: number;
  isCritical?: boolean;
  isFumble?: boolean;
  label?: string;
  mode: 'physique' | 'virtuel';
}

interface DiceRollerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({ isOpen, onClose }) => {
  const { warning } = useToast();
  // Physical Dice Entry (default & primary)
  const [selectedDie, setSelectedDie] = useState<number>(20);
  const [physicalRollInput, setPhysicalRollInput] = useState<string>('');
  const [modifier, setModifier] = useState<number>(0);
  const [rollLabel, setRollLabel] = useState<string>('Test');
  const [history, setHistory] = useState<DiceRollHistory[]>([]);
  const [latestRoll, setLatestRoll] = useState<DiceRollHistory | null>(null);

  const [targetDefInput, setTargetDefInput] = useState<string>('12');

  if (!isOpen) return null;

  const handleApplyPhysicalRoll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const rollVal = parseInt(physicalRollInput);
    if (isNaN(rollVal)) {
      warning('Veuillez entrer le chiffre obtenu sur votre dé physique.');
      return;
    }

    const total = rollVal + modifier;
    const targetDef = parseInt(targetDefInput) || 10;
    // Règle de critique boosté de la table :
    // Critique si 20 naturel au dé OU si le résultat d'attaque est supérieur de 10 ou plus à la DEF adverse
    const isAttackRoll = rollLabel.includes('Attaque');
    const isCritical =
      (selectedDie === 20 && rollVal === 20) ||
      (selectedDie === 20 && isAttackRoll && total >= targetDef + 10);
    const isFumble = selectedDie === 20 && rollVal === 1;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    const newRoll: DiceRollHistory = {
      id: 'r_' + Date.now(),
      timestamp: timeStr,
      formula: `d${selectedDie} (${rollVal}) ${modifier >= 0 ? '+' + modifier : modifier}${isAttackRoll ? ` vs DEF ${targetDef}` : ''}`,
      inputRoll: rollVal,
      modifier,
      total,
      isCritical,
      isFumble,
      label: rollLabel,
      mode: 'physique',
    };

    setLatestRoll(newRoll);
    setHistory((prev) => [newRoll, ...prev.slice(0, 14)]);
    setPhysicalRollInput('');
  };

  const handleVirtualFallbackRoll = () => {
    const rollVal = Math.floor(Math.random() * selectedDie) + 1;
    const total = rollVal + modifier;
    const targetDef = parseInt(targetDefInput) || 10;
    const isAttackRoll = rollLabel.includes('Attaque');
    const isCritical =
      (selectedDie === 20 && rollVal === 20) ||
      (selectedDie === 20 && isAttackRoll && total >= targetDef + 10);
    const isFumble = selectedDie === 20 && rollVal === 1;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    const newRoll: DiceRollHistory = {
      id: 'r_' + Date.now(),
      timestamp: timeStr,
      formula: `d${selectedDie} (${rollVal}) ${modifier >= 0 ? '+' + modifier : modifier}${isAttackRoll ? ` vs DEF ${targetDef}` : ''}`,
      inputRoll: rollVal,
      modifier,
      total,
      isCritical,
      isFumble,
      label: rollLabel,
      mode: 'virtuel',
    };

    setLatestRoll(newRoll);
    setHistory((prev) => [newRoll, ...prev.slice(0, 14)]);
  };

  const diceTypes = [4, 6, 8, 10, 12, 20, 100];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-[#181410] border-2 border-[#d4a84a] rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#3d3023] flex items-center justify-between bg-gradient-to-r from-[#291712] via-[#1c130e] to-[#14100c]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#d4a84a]/20 text-[#f3d48d] border border-[#d4a84a]/40">
              <Dices className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">
                Calculateur de Dé Physique (Table Réelle)
              </h3>
              <p className="text-xs text-[#a0907d]">
                Lancez vos vrais dés à la table et entrez le résultat ici
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#231c15] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Sélection du Type de Dé */}
          <div>
            <label className="text-[11px] font-bold text-[#d4a84a] uppercase tracking-wider block mb-2">
              1. Choisissez votre dé physique lancé
            </label>
            <div className="grid grid-cols-7 gap-1.5">
              {diceTypes.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDie(d)}
                  className={`py-2 px-1 rounded-xl text-center font-serif-co font-bold text-xs sm:text-sm border transition-all cursor-pointer ${
                    selectedDie === d
                      ? 'bg-gradient-to-b from-[#d4a84a] to-[#ab8230] text-[#1a1208] border-[#d4a84a] shadow-md scale-105'
                      : 'bg-[#201812] text-[#ede3d1] border-[#3d3023] hover:border-[#d4a84a]/60 hover:bg-[#2b2018]'
                  }`}
                >
                  d{d}
                </button>
              ))}
            </div>
          </div>

          {/* Formulaire d'Entrée Manuelle du Dé Physique */}
          <form onSubmit={handleApplyPhysicalRoll} className="p-4 rounded-xl bg-[#120e0a] border border-[#d4a84a]/40 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#f3d48d] uppercase tracking-wider">
                2. Case de saisie : Résultat du vrai d{selectedDie}
              </label>
              <span className="text-[10px] text-[#6fa85b] font-bold bg-[#1b2b18] px-2 py-0.5 rounded border border-[#2b4d24]">
                🎲 Lancer Manuel Réel
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Case Résultat du Dé */}
              <div className="space-y-1">
                <span className="text-[10px] text-[#9e907d] font-bold block">
                  Dé physique d{selectedDie} :
                </span>
                <input
                  type="number"
                  min="1"
                  max={selectedDie}
                  placeholder={`1-${selectedDie}`}
                  autoFocus
                  value={physicalRollInput}
                  onChange={(e) => setPhysicalRollInput(e.target.value)}
                  className="w-full text-center font-serif-co text-2xl font-bold text-[#f3d48d] bg-[#1a1410] border-2 border-[#d4a84a] rounded-xl py-2 focus:outline-hidden focus:ring-2 focus:ring-[#d4a84a]"
                />
              </div>

              {/* Modificateur */}
              <div className="space-y-1">
                <span className="text-[10px] text-[#9e907d] font-bold block">
                  Modificateur :
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setModifier((m) => m - 1)}
                    className="w-8 h-10 rounded-lg bg-[#201812] border border-[#3d3023] text-sm font-bold text-[#ede3d1] hover:border-[#d4a84a] cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={modifier}
                    onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
                    className="w-full text-center font-bold text-base text-[#ede3d1] bg-[#1a1410] border border-[#3d3023] rounded-lg py-2 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setModifier((m) => m + 1)}
                    className="w-8 h-10 rounded-lg bg-[#201812] border border-[#3d3023] text-sm font-bold text-[#ede3d1] hover:border-[#d4a84a] cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Libellé du Jet */}
              <div className="space-y-1">
                <span className="text-[10px] text-[#9e907d] font-bold block">
                  Type de jet :
                </span>
                <select
                  value={rollLabel}
                  onChange={(e) => setRollLabel(e.target.value)}
                  className="w-full h-10 px-2 text-xs font-semibold text-[#ede3d1] bg-[#1a1410] border border-[#3d3023] rounded-lg focus:outline-hidden"
                >
                  <option value="Attaque Contact">⚔️ Attaque Contact</option>
                  <option value="Attaque Distance">🏹 Attaque Distance</option>
                  <option value="Attaque Magique">✨ Attaque Magique</option>
                  <option value="Dégâts d'Arme">💥 Dégâts d'Arme</option>
                  <option value="Test FOR">Test Force (FOR)</option>
                  <option value="Test DEX">Test Dextérité (DEX)</option>
                  <option value="Test CON">Test Constitution (CON)</option>
                  <option value="Test INT">Test Intelligence (INT)</option>
                  <option value="Test SAG">Test Sagesse (SAG)</option>
                  <option value="Test CHA">Test Charisme (CHA)</option>
                  <option value="Initiative">⚡ Initiative</option>
                  <option value="Autre">🎲 Autre jet</option>
                </select>
              </div>
            </div>

            {/* Champ DEF Adverse pour la règle de critique boosté */}
            {rollLabel.includes('Attaque') && (
              <div className="p-2.5 rounded-lg bg-[#18110d] border border-[#d4a84a]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="text-[11px] text-[#cbb8a7]">
                  <b className="text-[#f3d48d]">⚡ Règle du Critique Boosté :</b>{' '}
                  Critique si <b>20 nat.</b> OU si total <b className="text-[#6fa85b]">≥ DEF adverse + 10</b> !
                </div>
                <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                  <span className="text-[10px] text-[#9e907d] font-bold">DEF adverse :</span>
                  <input
                    type="number"
                    min="1"
                    value={targetDefInput}
                    onChange={(e) => setTargetDefInput(e.target.value)}
                    className="w-14 h-7 text-center font-bold text-xs bg-[#241a13] border border-[#523d29] focus:border-[#d4a84a] rounded text-[#ede3d1] outline-hidden font-mono"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d4a84a] via-[#e5bd62] to-[#ab8230] hover:brightness-110 text-[#1a1208] text-sm font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-[#1a1208]" />
              <span>Calculer le Total avec Modificateur</span>
            </button>
          </form>

          {/* Affichage du Dernier Résultat Calculé */}
          {latestRoll && (
            <div
              className={`p-4 rounded-xl border flex items-center justify-between shadow-lg ${
                latestRoll.isCritical
                  ? 'bg-[#1a2e16] border-[#4ade80] text-[#86efac]'
                  : latestRoll.isFumble
                  ? 'bg-[#2e1616] border-[#f87171] text-[#fca5a5]'
                  : 'bg-[#1e1711] border-[#d4a84a]/60 text-[#ede3d1]'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#d4a84a]">
                    {latestRoll.label} :
                  </span>
                  <span className="text-xs font-mono text-[#b0a08d]">
                    {latestRoll.formula}
                  </span>
                  {latestRoll.isCritical && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#16a34a] text-white">
                      CRITIQUE (20 NATUREL) !
                    </span>
                  )}
                  {latestRoll.isFumble && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#dc2626] text-white">
                      ÉCHEC CRITIQUE (1) !
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#9e907d] mt-0.5">
                  Dé réel : <b>{latestRoll.inputRoll}</b> {latestRoll.modifier !== 0 && `| Bonus : ${latestRoll.modifier >= 0 ? '+' + latestRoll.modifier : latestRoll.modifier}`}
                </div>
              </div>

              <div className="text-right">
                <span className="text-3xl font-serif-co font-bold text-[#f3d48d]">
                  {latestRoll.total}
                </span>
                <span className="block text-[10px] text-[#9e907d]">TOTAL</span>
              </div>
            </div>
          )}

          {/* Secours : Tirage virtuel si les dés sont oubliés */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#807262]">
              Dés physiques oubliés à la maison ?
            </span>
            <button
              type="button"
              onClick={handleVirtualFallbackRoll}
              className="text-xs text-[#9e907d] hover:text-[#d4a84a] underline flex items-center gap-1 cursor-pointer"
            >
              <Dices className="w-3.5 h-3.5" />
              Lancer virtuel de secours (d{selectedDie})
            </button>
          </div>

          {/* Historique des Jets */}
          {history.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#3d3023]">
              <div className="flex items-center justify-between text-xs font-bold text-[#d4a84a]">
                <span>Historique de la séance</span>
                <button
                  type="button"
                  onClick={() => {
                    setHistory([]);
                    setLatestRoll(null);
                  }}
                  className="text-[10px] text-[#9e907d] hover:text-[#ede3d1] cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Effacer
                </button>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {history.map((h) => (
                  <div
                    key={h.id}
                    className="p-2 rounded-lg bg-[#14100c] border border-[#2d2217] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#807262]">{h.timestamp}</span>
                      <span className="font-semibold text-[#ede3d1]">{h.label}</span>
                      <span className="text-[#a0907d] text-[11px]">({h.formula})</span>
                    </div>
                    <span className="font-bold font-serif-co text-sm text-[#f3d48d]">
                      {h.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#3d3023] bg-[#120f0c] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-xs font-bold text-[#ede3d1] cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
