import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, Skull, Check } from 'lucide-react';
import { Character } from '../../types/chroniques';

interface DeleteCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  pj: Character | null;
  onConfirmDelete: (id: string) => void;
}

export const DeleteCharacterModal: React.FC<DeleteCharacterModalProps> = ({
  isOpen,
  onClose,
  pj,
  onConfirmDelete,
}) => {
  const [typedName, setTypedName] = useState('');
  const [hasCheckedConsent, setHasCheckedConsent] = useState(false);

  if (!isOpen || !pj) return null;

  const isNameMatching =
    typedName.trim().toLowerCase() === (pj.name || '').trim().toLowerCase();
  const canDelete = isNameMatching && hasCheckedConsent;

  const handleFinalDelete = () => {
    if (!canDelete) return;
    onConfirmDelete(pj.id || '');
    onClose();
    setTypedName('');
    setHasCheckedConsent(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#181112] border-2 border-[#9c2a2b] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-[#3b1216] via-[#241012] to-[#170d0f] border-b border-[#5e1e23] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#9c2a2b]/30 text-[#ff8080] border border-[#9c2a2b]/50">
              <Skull className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-co text-lg font-bold text-[#ffb8b8]">
                Oublier définitivement ce Héros
              </h3>
              <p className="text-[11px] text-[#b88c8f]">
                Suppression irréversible avec double validation
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              setTypedName('');
              setHasCheckedConsent(false);
            }}
            className="p-1 rounded-lg text-[#b88c8f] hover:text-white hover:bg-[#3d181c] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs text-[#ede3d1]">
          <div className="p-3.5 rounded-xl bg-[#2b1416] border border-[#7a242a] flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#ff6b6b] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-[#ff9999]">
                Attention : vous êtes sur le point d'effacer ce personnage
              </p>
              <p className="text-[#d9b8bb] leading-relaxed">
                Le héros <strong className="text-white">« {pj.name} »</strong> (Niv. {pj.level} {pj.profil}, {pj.race}) sera définitivement effacé de vos sauvegardes locales. Ses caractéristiques, voies apprises et son inventaire seront détruits.
              </p>
            </div>
          </div>

          {/* Étape 1 de double validation : Saisie du nom exact */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] font-bold text-[#ffb8b8] uppercase tracking-wider block">
              1ère validation : Tapez le nom exact du héros pour confirmer
            </label>
            <p className="text-[11px] text-[#9e907d]">
              Recopiez ci-dessous : <b className="text-white font-mono">{pj.name}</b>
            </p>
            <input
              type="text"
              placeholder={pj.name}
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              className="w-full px-3 py-2 bg-[#120b0c] border border-[#5e1e23] focus:border-[#cf5544] rounded-lg text-sm font-semibold text-white outline-none"
            />
          </div>

          {/* Étape 2 de double validation : Case à cocher de consentement */}
          <label className="flex items-start gap-2.5 p-3 rounded-lg bg-[#201013] border border-[#4d1a1e] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hasCheckedConsent}
              onChange={(e) => setHasCheckedConsent(e.target.checked)}
              className="w-4 h-4 accent-[#cf5544] rounded mt-0.5 cursor-pointer"
            />
            <span className="text-[11px] text-[#e0c0c3] leading-snug">
              Je confirme vouloir <strong>oublier définitivement</strong> ce personnage et je comprends que cette action ne peut pas être annulée.
            </span>
          </label>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-[#401518] bg-[#120b0c] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={() => {
              onClose();
              setTypedName('');
              setHasCheckedConsent(false);
            }}
            className="px-4 py-2 rounded-xl bg-[#231718] hover:bg-[#331f22] border border-[#4d2629] text-xs font-semibold text-[#ede3d1] transition-colors cursor-pointer"
          >
            Conserver mon Héros
          </button>

          <button
            type="button"
            disabled={!canDelete}
            onClick={handleFinalDelete}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
              canDelete
                ? 'bg-gradient-to-r from-[#b91c1c] to-[#7f1d1d] hover:brightness-110 text-white cursor-pointer'
                : 'bg-[#2b181a] text-[#734c50] border border-[#3d2024] cursor-not-allowed opacity-60'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Oublier Définitivement ce Héros</span>
          </button>
        </div>
      </div>
    </div>
  );
};
