import React, { useState } from 'react';
import { Send, QrCode, Copy, Check, X, Shield, Sparkles, Smartphone, Monitor } from 'lucide-react';
import { Character } from '../../types/chroniques';

interface TableTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  pj: Character;
  onSendLocal: () => void;
}

export const TableTransferModal: React.FC<TableTransferModalProps> = ({
  isOpen,
  onClose,
  pj,
  onSendLocal,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate lightweight sync code for easy table sharing
  const exportPayload = {
    cof_sync: 'hero_v1',
    timestamp: Date.now(),
    hero: pj,
  };
  const jsonStr = JSON.stringify(exportPayload);
  const base64Code = typeof btoa !== 'undefined' ? btoa(unescape(encodeURIComponent(jsonStr))) : '';

  const handleCopyCode = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(base64Code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    } else {
      prompt('Copiez ce code de transfert :', base64Code);
    }
  };

  const handleSendAndClose = () => {
    onSendLocal();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-[#181410] border-2 border-[#d4a84a] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#3d3023] flex items-center justify-between bg-gradient-to-r from-[#291712] via-[#1c130e] to-[#14100c]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#d4a84a]/20 text-[#f3d48d] border border-[#d4a84a]/40">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">
                Envoyer {pj.name} à la Table du MJ
              </h3>
              <p className="text-xs text-[#a0907d]">
                Connexion directe Téléphone (PJ) &harr; Ordinateur (MJ)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#231c15] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs text-[#cbb8a7] leading-relaxed">
          {/* Method 1: Instant local broadcast */}
          <div className="p-4 rounded-xl bg-[#1e1511] border border-[#d4a84a]/60 space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#f3d48d]">
              <Sparkles className="w-4 h-4 text-[#d4a84a]" />
              <span>Méthode 1 : Synchronisation Instantanée (Même Appareil / Réseau Local)</span>
            </div>
            <p>
              Si vous êtes sur le même appareil ou le même navigateur, ce bouton transfère directement la fiche complète de <b>{pj.name}</b> dans la Console MJ et le gestionnaire de combat.
            </p>
            <button
              onClick={handleSendAndClose}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#d4a84a] via-[#e5bd62] to-[#ab8230] hover:brightness-110 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Send className="w-4 h-4 text-black" />
              <span>Transférer Immédiatement vers la Console MJ</span>
            </button>
          </div>

          {/* Method 2: Cross device code (Phone to PC) */}
          <div className="p-4 rounded-xl bg-[#120f0c] border border-[#3d3023] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-[#f3d48d]">
                <Smartphone className="w-4 h-4 text-[#7db5ff]" />
                <span>Méthode 2 : Téléphone &rarr; PC du Meneur (Code Rapide)</span>
              </div>
              <Monitor className="w-4 h-4 text-[#9e907d]" />
            </div>
            <p>
              Pour envoyer votre fiche depuis votre téléphone vers l&apos;ordinateur du MJ sans aucun câble : copiez ce code court ci-dessous et envoyez-le par chat (Discord, WhatsApp, SMS) au MJ. Il lui suffit de cliquer sur « 📥 Coller Fiche Joueur » sur son PC !
            </p>

            <div className="relative">
              <textarea
                readOnly
                rows={3}
                value={base64Code}
                className="w-full p-2.5 bg-[#0d0a08] border border-[#3d3023] rounded-lg font-mono text-[10px] text-[#7db5ff] select-all outline-hidden resize-none"
              />
            </div>

            <button
              onClick={handleCopyCode}
              className={`w-full py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                copied
                  ? 'bg-[#1a3821] border-[#4ade80] text-[#86efac]'
                  : 'bg-[#231c15] hover:bg-[#32271d] border-[#d4a84a]/60 text-[#f3d48d]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#4ade80]" /> Code copié dans le presse-papier !
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#d4a84a]" /> Copier le Code de Transfert
                </>
              )}
            </button>
          </div>

          <div className="p-3 bg-[#131b14] border border-[#276e43] rounded-xl text-[11px] text-[#9ee7b8] flex items-start gap-2">
            <Shield className="w-4 h-4 text-[#86efac] shrink-0 mt-0.5" />
            <span>
              <b>Synchronisation automatique en direct :</b> Quand le MJ modifie vos PV, vous attribue un état (Empoisonné, Terrorisé...) ou vous offre des points de capacité pour votre RP, les changements sont immédiatement effectifs !
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
