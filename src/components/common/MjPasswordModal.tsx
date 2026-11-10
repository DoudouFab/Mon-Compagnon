import React, { useState, useEffect, useRef } from 'react';
import { Lock, X, KeyRound, ShieldAlert } from 'lucide-react';

interface MjPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const MjPasswordModal: React.FC<MjPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = password.trim().toLowerCase();
    if (val === 'mjmdp' || val === 'doudoufab') {
      try {
        localStorage.setItem('cof_mj_access', 'granted');
        sessionStorage.setItem('cof_mj_auth', 'true');
      } catch {}
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => inputRef.current?.select(), 50);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#181112] border-2 border-[#9c2a2b] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#4d1f22] bg-gradient-to-r from-[#3b1518] to-[#1a0f11]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#cf5544]/20 text-[#ff9d9d] border border-[#cf5544]/40">
              <Lock className="w-5 h-5 text-[#ff8080]" />
            </div>
            <div>
              <h3 className="font-serif-co text-lg font-bold text-[#ffb8b8]">
                Accès Meneur de Jeu
              </h3>
              <p className="text-xs text-[#a07c7c]">
                Espace réservé à la maîtrise de jeu (MJ)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9e7d7d] hover:text-[#ede3d1] hover:bg-[#2b1719] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-[#c9b5a6] leading-relaxed">
            Pour basculer vers la <strong>Console Meneur de Jeu</strong> (Bestiaire 114 créatures, suivi de combat, Boîte à Bonbons, butin, lore des Terres d&apos;Osgild et règles), veuillez entrer votre mot de passe secret MJ :
          </p>

          <div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#9e7d7d] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Mot de passe secret MJ"
                className="w-full bg-[#0f0a0b] border border-[#522023] focus:border-[#d4a84a] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#ede3d1] placeholder-[#6d5555] outline-hidden transition-colors"
              />
            </div>
            {error && (
              <p className="text-xs text-[#ff8080] font-bold mt-1.5 flex items-center gap-1 animate-shake">
                <ShieldAlert className="w-3.5 h-3.5" /> Mot de passe incorrect.
              </p>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#3b1e22]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#251719] hover:bg-[#331c20] border border-[#4a2628] text-xs font-bold text-[#c9b5a6] transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#9c2a2b] to-[#6d1b1c] hover:brightness-110 text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Déverrouiller la Console MJ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
