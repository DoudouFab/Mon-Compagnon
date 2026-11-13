/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Coins,
  Calculator,
  Plus,
  Minus,
  ArrowRightLeft,
  Users,
  Check,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { CurrencyBourse } from '../../types/chroniques';
import { useToast } from './ToastContext';

interface MoneyCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBourse: CurrencyBourse;
  onUpdateBourse: (newBourse: CurrencyBourse) => void;
  characterName?: string;
  partyCount?: number;
  isMj?: boolean;
  onDistributeToAllPjs?: (share: CurrencyBourse) => void;
}

export const MoneyCalculatorModal: React.FC<MoneyCalculatorModalProps> = ({
  isOpen,
  onClose,
  currentBourse,
  onUpdateBourse,
  characterName,
  partyCount = 4,
  isMj = false,
  onDistributeToAllPjs,
}) => {
  const { error, warning, success } = useToast();
  const [activeTab, setActiveTab] = useState<'transaction' | 'partage' | 'calculatrice'>('transaction');

  // Transaction Inputs
  const [transPo, setTransPo] = useState<number>(0);
  const [transPa, setTransPa] = useState<number>(0);
  const [transPc, setTransPc] = useState<number>(0);
  const [transReason, setTransReason] = useState<string>('');

  // Partage de butin
  const [lootPo, setLootPo] = useState<number>(100);
  const [lootPa, setLootPa] = useState<number>(0);
  const [lootPc, setLootPc] = useState<number>(0);
  const [splitCount, setSplitCount] = useState<number>(partyCount > 0 ? partyCount : 4);

  // Mini calculatrice arithmétique
  const [calcDisplay, setCalcDisplay] = useState<string>('0');
  const [calcMemory, setCalcMemory] = useState<number | null>(null);
  const [calcOp, setCalcOp] = useState<string | null>(null);
  const [calcClearNext, setCalcClearNext] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentPo = currentBourse?.po || 0;
  const currentPa = currentBourse?.pa || 0;
  const currentPc = currentBourse?.pc || 0;

  // Valeur totale en Cuivre (base 1 PO = 10 PA, 1 PA = 10 PC => 1 PO = 100 PC)
  const totalInCopper = currentPo * 100 + currentPa * 10 + currentPc;
  const totalInGold = (totalInCopper / 100).toFixed(2);

  // Ajouter de l'argent
  const handleAddCoins = () => {
    const nextBourse: CurrencyBourse = {
      po: Math.max(0, currentPo + (transPo || 0)),
      pa: Math.max(0, currentPa + (transPa || 0)),
      pc: Math.max(0, currentPc + (transPc || 0)),
    };
    onUpdateBourse(nextBourse);
    setTransPo(0);
    setTransPa(0);
    setTransPc(0);
    setTransReason('');
  };

  // Payer / Dépenser avec rendu de monnaie intelligent
  const handlePayCoins = () => {
    const costInCopper = (transPo || 0) * 100 + (transPa || 0) * 10 + (transPc || 0);
    if (costInCopper <= 0) return;

    if (costInCopper > totalInCopper) {
      error(`Fonds insuffisants ! Coût total: ${costInCopper} PC (${(costInCopper / 100).toFixed(2)} PO), mais votre bourse ne contient que ${totalInCopper} PC.`);
      return;
    }

    const remainingCopper = totalInCopper - costInCopper;
    // Conversion optimisée standard
    const newPo = Math.floor(remainingCopper / 100);
    const remAfterPo = remainingCopper % 100;
    const newPa = Math.floor(remAfterPo / 10);
    const newPc = remAfterPo % 10;

    onUpdateBourse({ po: newPo, pa: newPa, pc: newPc });
    setTransPo(0);
    setTransPa(0);
    setTransPc(0);
    setTransReason('');
  };

  // Optimiser la monnaie (changer le petit cuivre en argent et l'argent en or)
  const handleOptimizeChange = () => {
    const newPo = Math.floor(totalInCopper / 100);
    const remAfterPo = totalInCopper % 100;
    const newPa = Math.floor(remAfterPo / 10);
    const newPc = remAfterPo % 10;
    onUpdateBourse({ po: newPo, pa: newPa, pc: newPc });
  };

  // Faire de la menue monnaie (casser 1 PO en 10 PA, ou 1 PA en 10 PC)
  const handleBreakGold = () => {
    if (currentPo < 1) {
      warning("Vous n'avez pas de Pièce d'Or à casser.");
      return;
    }
    onUpdateBourse({ po: currentPo - 1, pa: currentPa + 10, pc: currentPc });
  };

  const handleBreakSilver = () => {
    if (currentPa < 1) {
      warning("Vous n'avez pas de Pièce d'Argent à casser.");
      return;
    }
    onUpdateBourse({ po: currentPo, pa: currentPa - 1, pc: currentPc + 10 });
  };

  // Calcul du partage de butin
  const totalLootCopper = (lootPo || 0) * 100 + (lootPa || 0) * 10 + (lootPc || 0);
  const shareCopper = splitCount > 0 ? Math.floor(totalLootCopper / splitCount) : 0;
  const remainderCopper = splitCount > 0 ? totalLootCopper % splitCount : 0;

  const sharePo = Math.floor(shareCopper / 100);
  const sharePa = Math.floor((shareCopper % 100) / 10);
  const sharePc = shareCopper % 10;

  // Calculatrice simple
  const handleCalcDigit = (digit: string) => {
    if (calcClearNext) {
      setCalcDisplay(digit);
      setCalcClearNext(false);
    } else {
      setCalcDisplay(calcDisplay === '0' ? digit : calcDisplay + digit);
    }
  };

  const handleCalcOp = (op: string) => {
    const val = parseFloat(calcDisplay);
    if (calcMemory !== null && calcOp) {
      const res = executeCalc(calcMemory, val, calcOp);
      setCalcMemory(res);
      setCalcDisplay(String(res));
    } else {
      setCalcMemory(val);
    }
    setCalcOp(op);
    setCalcClearNext(true);
  };

  const executeCalc = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? Math.round((a / b) * 100) / 100 : 0;
      default: return b;
    }
  };

  const handleCalcEquals = () => {
    if (calcMemory !== null && calcOp) {
      const val = parseFloat(calcDisplay);
      const res = executeCalc(calcMemory, val, calcOp);
      setCalcDisplay(String(res));
      setCalcMemory(null);
      setCalcOp(null);
      setCalcClearNext(true);
    }
  };

  const handleCalcClear = () => {
    setCalcDisplay('0');
    setCalcMemory(null);
    setCalcOp(null);
    setCalcClearNext(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#16120e] border-2 border-[#d4a84a] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* En-tête Ancien en Cuivre & Laiton */}
        <div className="flex items-center justify-between p-4 border-b border-[#3d3023] bg-gradient-to-r from-[#2a1b14] via-[#1e1510] to-[#140e0b]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#d4a84a]/20 text-[#f3d48d] border border-[#d4a84a]/40 shadow-inner">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-co text-lg font-bold text-[#f3d48d] flex items-center gap-2">
                <span>Calculatrice Ancienne &amp; Bourse</span>
              </h3>
              <p className="text-xs text-[#a0907d]">
                {characterName ? (
                  <>Bourse de <strong className="text-[#ede3d1]">{characterName}</strong> • Règle CO : 1 PO = 10 PA = 100 PC</>
                ) : (
                  'Gestionnaire de trésorerie • Règle officielle CO : 1 PO = 10 PA = 100 PC'
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#2b2016] transition-colors cursor-pointer"
            title="Fermer la calculatrice"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tableau de bord de la Bourse Actuelle */}
        <div className="p-4 bg-[#1e1712] border-b border-[#302419]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#9e907d] uppercase tracking-wider flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-[#d4a84a]" /> Contenu de la Bourse
            </span>
            <span className="text-xs font-bold text-[#d4a84a] bg-[#140e0a] px-2.5 py-0.5 rounded-full border border-[#4d3623]">
              Valeur totale : ≈ {totalInGold} PO ({totalInCopper} PC)
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {/* PIÈCES D'OR */}
            <div className="bg-[#2a2015] border border-[#d4a84a]/60 rounded-xl p-3 flex flex-col items-center justify-between shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#f3d48d] uppercase">
                <span className="text-base select-none">🟡</span>
                <span>Pièces d'Or (PO)</span>
              </div>
              <div className="text-2xl font-serif-co font-bold text-[#ffffff] my-1">
                {currentPo}
              </div>
              <div className="flex items-center gap-1 w-full justify-center">
                <button
                  type="button"
                  onClick={() => onUpdateBourse({ ...currentBourse, po: Math.max(0, currentPo - 1) })}
                  className="w-6 h-6 rounded bg-[#1c140c] hover:bg-[#332213] text-[#ede3d1] font-bold text-xs flex items-center justify-center border border-[#4a341f] cursor-pointer"
                  title="-1 PO"
                >
                  -1
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateBourse({ ...currentBourse, po: currentPo + 1 })}
                  className="w-6 h-6 rounded bg-[#1c140c] hover:bg-[#332213] text-[#f3d48d] font-bold text-xs flex items-center justify-center border border-[#4a341f] cursor-pointer"
                  title="+1 PO"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateBourse({ ...currentBourse, po: currentPo + 10 })}
                  className="px-1.5 h-6 rounded bg-[#382713] hover:bg-[#4d3419] text-[#f3d48d] font-bold text-[10px] flex items-center justify-center border border-[#6b4c27] cursor-pointer"
                  title="+10 PO"
                >
                  +10
                </button>
              </div>
            </div>

            {/* PIÈCES D'ARGENT */}
            <div className="bg-[#1f2228] border border-[#8ea0b5]/60 rounded-xl p-3 flex flex-col items-center justify-between shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#cbd5e1] uppercase">
                <span className="text-base select-none">⚪</span>
                <span>Argent (PA)</span>
              </div>
              <div className="text-2xl font-serif-co font-bold text-[#ffffff] my-1">
                {currentPa}
              </div>
              <div className="flex items-center gap-1 w-full justify-center">
                <button
                  type="button"
                  onClick={() => onUpdateBourse({ ...currentBourse, pa: Math.max(0, currentPa - 1) })}
                  className="w-6 h-6 rounded bg-[#13161c] hover:bg-[#252c38] text-[#ede3d1] font-bold text-xs flex items-center justify-center border border-[#3b4759] cursor-pointer"
                  title="-1 PA"
                >
                  -1
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateBourse({ ...currentBourse, pa: currentPa + 1 })}
                  className="w-6 h-6 rounded bg-[#13161c] hover:bg-[#252c38] text-[#cbd5e1] font-bold text-xs flex items-center justify-center border border-[#3b4759] cursor-pointer"
                  title="+1 PA"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateBourse({ ...currentBourse, pa: currentPa + 10 })}
                  className="px-1.5 h-6 rounded bg-[#2c3747] hover:bg-[#3d4b61] text-[#cbd5e1] font-bold text-[10px] flex items-center justify-center border border-[#52637a] cursor-pointer"
                  title="+10 PA"
                >
                  +10
                </button>
              </div>
            </div>

            {/* PIÈCES DE CUIVRE */}
            <div className="bg-[#291b15] border border-[#b87333]/60 rounded-xl p-3 flex flex-col items-center justify-between shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#f59e0b] uppercase">
                <span className="text-base select-none">🟤</span>
                <span>Cuivre (PC)</span>
              </div>
              <div className="text-2xl font-serif-co font-bold text-[#ffffff] my-1">
                {currentPc}
              </div>
              <div className="flex items-center gap-1 w-full justify-center">
                <button
                  type="button"
                  onClick={() => onUpdateBourse({ ...currentBourse, pc: Math.max(0, currentPc - 1) })}
                  className="w-6 h-6 rounded bg-[#170e0a] hover:bg-[#331c13] text-[#ede3d1] font-bold text-xs flex items-center justify-center border border-[#4d281a] cursor-pointer"
                  title="-1 PC"
                >
                  -1
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateBourse({ ...currentBourse, pc: currentPc + 1 })}
                  className="w-6 h-6 rounded bg-[#170e0a] hover:bg-[#331c13] text-[#f59e0b] font-bold text-xs flex items-center justify-center border border-[#4d281a] cursor-pointer"
                  title="+1 PC"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateBourse({ ...currentBourse, pc: currentPc + 10 })}
                  className="px-1.5 h-6 rounded bg-[#3b1e13] hover:bg-[#522919] text-[#f59e0b] font-bold text-[10px] flex items-center justify-center border border-[#733a24] cursor-pointer"
                  title="+10 PC"
                >
                  +10
                </button>
              </div>
            </div>
          </div>

          {/* Outils de conversion rapide */}
          <div className="mt-2.5 flex items-center justify-between gap-2 flex-wrap text-[11px]">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleOptimizeChange}
                className="px-2.5 py-1 bg-[#140e0a] hover:bg-[#261b13] border border-[#4d3623] text-[#f3d48d] rounded-md font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                title="Convertir automatiquement le cuivre en argent, et l'argent en or pour alléger la bourse"
              >
                <RefreshCw className="w-3 h-3 text-[#d4a84a]" /> Optimiser la monnaie
              </button>
              <button
                type="button"
                onClick={handleBreakGold}
                className="px-2 py-1 bg-[#140e0a] hover:bg-[#261b13] border border-[#4d3623] text-[#ede3d1] rounded-md font-semibold cursor-pointer transition-colors"
                title="Casser 1 PO en 10 PA"
              >
                1 PO ➔ 10 PA
              </button>
              <button
                type="button"
                onClick={handleBreakSilver}
                className="px-2 py-1 bg-[#140e0a] hover:bg-[#261b13] border border-[#4d3623] text-[#ede3d1] rounded-md font-semibold cursor-pointer transition-colors"
                title="Casser 1 PA en 10 PC"
              >
                1 PA ➔ 10 PC
              </button>
            </div>
          </div>
        </div>

        {/* Onglets d'action */}
        <div className="flex border-b border-[#302419] bg-[#120e0a]">
          <button
            type="button"
            onClick={() => setActiveTab('transaction')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'transaction'
                ? 'border-[#d4a84a] text-[#f3d48d] bg-[#1a140f]'
                : 'border-transparent text-[#9e907d] hover:text-[#ede3d1]'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" /> Dépense / Gain
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('partage')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'partage'
                ? 'border-[#d4a84a] text-[#f3d48d] bg-[#1a140f]'
                : 'border-transparent text-[#9e907d] hover:text-[#ede3d1]'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Partage de Butin
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calculatrice')}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'calculatrice'
                ? 'border-[#d4a84a] text-[#f3d48d] bg-[#1a140f]'
                : 'border-transparent text-[#9e907d] hover:text-[#ede3d1]'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" /> Abaque &amp; Calculs
          </button>
        </div>

        {/* Corps des onglets */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {/* TAB 1: TRANSACTION (GAINS OU DÉPENSES AVEC RENDU DE MONNAIE) */}
          {activeTab === 'transaction' && (
            <div className="space-y-4">
              <div className="bg-[#19130e] p-3 rounded-xl border border-[#3d2b1c] space-y-3">
                <span className="text-xs font-bold text-[#f3d48d] block uppercase tracking-wider">
                  Montant de la Transaction
                </span>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-[#f3d48d] font-bold block mb-1">🟡 Or (PO)</label>
                    <input
                      type="number"
                      min="0"
                      value={transPo || ''}
                      onChange={(e) => setTransPo(Math.max(0, parseInt(e.target.value) || 0))}
                      placeholder="0"
                      className="w-full bg-[#0d0907] border border-[#4d3623] rounded-lg px-2.5 py-1.5 text-center font-bold text-[#f3d48d] text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#cbd5e1] font-bold block mb-1">⚪ Argent (PA)</label>
                    <input
                      type="number"
                      min="0"
                      value={transPa || ''}
                      onChange={(e) => setTransPa(Math.max(0, parseInt(e.target.value) || 0))}
                      placeholder="0"
                      className="w-full bg-[#0d0907] border border-[#3b4759] rounded-lg px-2.5 py-1.5 text-center font-bold text-[#cbd5e1] text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#f59e0b] font-bold block mb-1">🟤 Cuivre (PC)</label>
                    <input
                      type="number"
                      min="0"
                      value={transPc || ''}
                      onChange={(e) => setTransPc(Math.max(0, parseInt(e.target.value) || 0))}
                      placeholder="0"
                      className="w-full bg-[#0d0907] border border-[#4d281a] rounded-lg px-2.5 py-1.5 text-center font-bold text-[#f59e0b] text-sm outline-none"
                    />
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Motif (ex: Achat rations, Nuit taverne, Récompense quête...)"
                  value={transReason}
                  onChange={(e) => setTransReason(e.target.value)}
                  className="w-full bg-[#0d0907] border border-[#2d1f14] rounded-lg px-3 py-1.5 text-xs text-[#ede3d1] outline-none"
                />

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleAddCoins}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#17301c] to-[#0f2413] hover:from-[#204227] hover:to-[#17361d] border border-[#2e5936] text-[#86efac] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4 text-[#86efac]" /> Recevoir / Trouver (+)
                  </button>
                  <button
                    type="button"
                    onClick={handlePayCoins}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#381616] to-[#260e0e] hover:from-[#4d1f1f] hover:to-[#381616] border border-[#6b2525] text-[#fca5a5] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Minus className="w-4 h-4 text-[#fca5a5]" /> Payer / Dépenser (-)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PARTAGE DE BUTIN ÉQUITABLE */}
          {activeTab === 'partage' && (
            <div className="space-y-3">
              <div className="bg-[#19130e] p-3.5 rounded-xl border border-[#3d2b1c] space-y-3">
                <span className="text-xs font-bold text-[#f3d48d] block uppercase tracking-wider">
                  Trésor Total du Groupe à Partager
                </span>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-[#f3d48d] font-bold block mb-1">🟡 Or (PO)</label>
                    <input
                      type="number"
                      min="0"
                      value={lootPo || ''}
                      onChange={(e) => setLootPo(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-[#0d0907] border border-[#4d3623] rounded-lg px-2.5 py-1.5 text-center font-bold text-[#f3d48d] text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#cbd5e1] font-bold block mb-1">⚪ Argent (PA)</label>
                    <input
                      type="number"
                      min="0"
                      value={lootPa || ''}
                      onChange={(e) => setLootPa(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-[#0d0907] border border-[#3b4759] rounded-lg px-2.5 py-1.5 text-center font-bold text-[#cbd5e1] text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#f59e0b] font-bold block mb-1">🟤 Cuivre (PC)</label>
                    <input
                      type="number"
                      min="0"
                      value={lootPc || ''}
                      onChange={(e) => setLootPc(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-[#0d0907] border border-[#4d281a] rounded-lg px-2.5 py-1.5 text-center font-bold text-[#f59e0b] text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between bg-[#120d09] p-2.5 rounded-lg border border-[#2b1e13]">
                  <span className="text-xs text-[#9e907d]">Nombre de parts / Héros :</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSplitCount(Math.max(1, splitCount - 1))}
                      className="w-7 h-7 rounded bg-[#23170e] hover:bg-[#362316] text-[#ede3d1] font-bold border border-[#4a341f] flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-serif-co font-bold text-base text-[#f3d48d] w-8 text-center">
                      {splitCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSplitCount(splitCount + 1)}
                      className="w-7 h-7 rounded bg-[#23170e] hover:bg-[#362316] text-[#ede3d1] font-bold border border-[#4a341f] flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Résultat du partage */}
                <div className="p-3 bg-[#131d14] border border-[#27592e] rounded-xl text-center space-y-1">
                  <span className="text-[11px] font-bold text-[#86efac] uppercase tracking-wide block">
                    Part exacte par Aventurier :
                  </span>
                  <div className="text-lg font-serif-co font-bold text-[#ffffff] flex items-center justify-center gap-2">
                    <span className="text-[#f3d48d]">{sharePo} PO</span> •{' '}
                    <span className="text-[#cbd5e1]">{sharePa} PA</span> •{' '}
                    <span className="text-[#f59e0b]">{sharePc} PC</span>
                  </div>
                  {remainderCopper > 0 && (
                    <span className="text-[10px] text-[#9e907d] block">
                      (Reliquat restant pour la caisse de groupe : {remainderCopper} PC)
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateBourse({
                        po: currentPo + sharePo,
                        pa: currentPa + sharePa,
                        pc: currentPc + sharePc,
                      });
                      success(`Part ajoutée à votre bourse : +${sharePo} PO, ${sharePa} PA, ${sharePc} PC !`);
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#d4a84a] to-[#ab8230] text-[#1a1208] font-bold text-xs shadow-md hover:brightness-110 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" /> Ajouter ma part à ma bourse
                  </button>

                  {isMj && onDistributeToAllPjs && (
                    <button
                      type="button"
                      onClick={() => {
                        onDistributeToAllPjs({ po: sharePo, pa: sharePa, pc: sharePc });
                      }}
                      className="py-2.5 px-3 rounded-xl bg-[#291712] border border-[#d4a84a] text-[#f3d48d] font-bold text-xs shadow-md hover:bg-[#3d2319] flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Distribuer immédiatement cette part à tous les PJ de la table"
                    >
                      <Sparkles className="w-4 h-4 text-[#d4a84a]" /> Distribuer à tous les PJ
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ABAQUE & CALCULATRICE ARITHMÉTIQUE */}
          {activeTab === 'calculatrice' && (
            <div className="space-y-3">
              <div className="bg-[#120d09] p-3 rounded-xl border border-[#3d2b1c] max-w-xs mx-auto">
                {/* Écran d'affichage vintage */}
                <div className="bg-[#1c221a] border-2 border-[#3b4737] rounded-lg p-3 text-right font-mono text-2xl font-bold text-[#86efac] mb-3 shadow-inner overflow-x-auto">
                  {calcDisplay}
                </div>

                {/* Pavé de boutons */}
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={handleCalcClear}
                    className="p-2.5 rounded-lg bg-[#381616] hover:bg-[#4d2020] text-[#fca5a5] font-bold text-sm cursor-pointer border border-[#6b2525]"
                  >
                    C
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCalcOp('÷')}
                    className="p-2.5 rounded-lg bg-[#2a1d13] hover:bg-[#3d2b1c] text-[#f3d48d] font-bold text-sm cursor-pointer border border-[#4d3623]"
                  >
                    ÷
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCalcOp('×')}
                    className="p-2.5 rounded-lg bg-[#2a1d13] hover:bg-[#3d2b1c] text-[#f3d48d] font-bold text-sm cursor-pointer border border-[#4d3623]"
                  >
                    ×
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCalcOp('-')}
                    className="p-2.5 rounded-lg bg-[#2a1d13] hover:bg-[#3d2b1c] text-[#f3d48d] font-bold text-sm cursor-pointer border border-[#4d3623]"
                  >
                    -
                  </button>

                  {['7', '8', '9'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleCalcDigit(d)}
                      className="p-2.5 rounded-lg bg-[#1f1610] hover:bg-[#302319] text-[#ede3d1] font-bold text-sm cursor-pointer border border-[#3b2b1d]"
                    >
                      {d}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleCalcOp('+')}
                    className="p-2.5 rounded-lg bg-[#2a1d13] hover:bg-[#3d2b1c] text-[#f3d48d] font-bold text-sm cursor-pointer border border-[#4d3623]"
                  >
                    +
                  </button>

                  {['4', '5', '6'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleCalcDigit(d)}
                      className="p-2.5 rounded-lg bg-[#1f1610] hover:bg-[#302319] text-[#ede3d1] font-bold text-sm cursor-pointer border border-[#3b2b1d]"
                    >
                      {d}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleCalcEquals}
                    className="row-span-2 p-2.5 rounded-lg bg-[#d4a84a] hover:bg-[#e0b555] text-black font-bold text-lg cursor-pointer flex items-center justify-center shadow-md"
                  >
                    =
                  </button>

                  {['1', '2', '3'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleCalcDigit(d)}
                      className="p-2.5 rounded-lg bg-[#1f1610] hover:bg-[#302319] text-[#ede3d1] font-bold text-sm cursor-pointer border border-[#3b2b1d]"
                    >
                      {d}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleCalcDigit('0')}
                    className="col-span-2 p-2.5 rounded-lg bg-[#1f1610] hover:bg-[#302319] text-[#ede3d1] font-bold text-sm cursor-pointer border border-[#3b2b1d]"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCalcDigit('.')}
                    className="p-2.5 rounded-lg bg-[#1f1610] hover:bg-[#302319] text-[#ede3d1] font-bold text-sm cursor-pointer border border-[#3b2b1d]"
                  >
                    .
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pied de fenêtre */}
        <div className="p-3 border-t border-[#3d3023] bg-[#120e0a] flex items-center justify-between">
          <span className="text-[11px] text-[#9e907d]">
            Toutes les modifications sont synchronisées en direct.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4a84a] to-[#ab8230] text-[#1a1208] text-xs font-bold transition-all shadow-md hover:brightness-110 cursor-pointer"
          >
            Fermer la calculatrice
          </button>
        </div>
      </div>
    </div>
  );
};
