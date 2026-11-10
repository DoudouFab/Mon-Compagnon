import React, { useState, useEffect } from 'react';
import {
  Radio,
  Wifi,
  WifiOff,
  Copy,
  Check,
  X,
  Users,
  Shield,
  Smartphone,
  Monitor,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Character } from '../../types/chroniques';
import { realtimeTable, LiveConnectionStatus } from '../../services/realtimeSync';

interface LiveTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  appMode: 'pj' | 'mj';
  currentPj: Character | null;
  onUpdatePj?: (updated: Character) => void;
  liveRoomCode: string;
  setLiveRoomCode: (code: string) => void;
  liveStatus: LiveConnectionStatus;
  connectedHeroes: Character[];
  showToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const LiveTableModal: React.FC<LiveTableModalProps> = ({
  isOpen,
  onClose,
  appMode,
  currentPj,
  liveRoomCode,
  setLiveRoomCode,
  liveStatus,
  connectedHeroes,
  showToast,
}) => {
  const [inputCode, setInputCode] = useState(liveRoomCode || '');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (liveRoomCode) {
      setInputCode(liveRoomCode);
    }
  }, [liveRoomCode]);

  if (!isOpen) return null;

  const handleGenerateRandomCode = () => {
    const prefixes = ['COF', 'OSGILD', 'DRAGON', 'HEROS', 'TABLE', 'TAIE'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(100 + Math.random() * 900);
    const newCode = `${prefix}-${num}`;
    setInputCode(newCode);
  };

  const handleConnect = () => {
    const code = inputCode.trim().toUpperCase();
    if (!code) {
      showToast('Veuillez entrer un code de table.', 'warning');
      return;
    }
    setLiveRoomCode(code);
    realtimeTable.connect(code, appMode, currentPj);
    showToast(`Connexion à la table « ${code} » en cours...`, 'info');
  };

  const handleDisconnect = () => {
    realtimeTable.disconnect();
    setLiveRoomCode('');
    showToast('Déconnecté de la table en direct.', 'info');
  };

  const handleCopyPlayerInviteLink = () => {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const code = (liveRoomCode || inputCode).trim().toUpperCase();
    const inviteUrl = `${origin}${pathname}?table=${code}#pj`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(inviteUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
        showToast('🔗 Lien d’invitation copié ! Envoyez-le à vos joueurs.', 'success');
      });
    }
  };

  const isConnected = liveStatus === 'connected';
  const isConnecting = liveStatus === 'connecting';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#181410] border-2 border-[#d4a84a] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#3d3023] bg-gradient-to-r from-[#291712] via-[#1c130e] to-[#14100c]">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border ${
                isConnected
                  ? 'bg-green-500/20 text-green-400 border-green-500/50'
                  : 'bg-[#d4a84a]/20 text-[#f3d48d] border-[#d4a84a]/40'
              }`}
            >
              <Radio className={`w-6 h-6 ${isConnected ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">
                  Table en Direct · Synchronisation Temps Réel
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isConnected
                      ? 'bg-green-950 text-green-300 border border-green-600'
                      : isConnecting
                      ? 'bg-amber-950 text-amber-300 border border-amber-600 animate-pulse'
                      : 'bg-[#291712] text-[#a0907d] border border-[#3d3023]'
                  }`}
                >
                  {isConnected
                    ? '🟢 Connecté'
                    : isConnecting
                    ? '🟡 Connexion...'
                    : '⚪ Hors-ligne'}
                </span>
              </div>
              <p className="text-xs text-[#a0907d]">
                Liaison instantanée sans rechargement Téléphone (PJ) &harr; Ordinateur (MJ)
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
        <div className="p-5 space-y-4 text-xs text-[#cbb8a7]">
          {/* Explanation */}
          <div className="p-3.5 rounded-xl bg-[#1e1712] border border-[#3d3023] leading-relaxed">
            {appMode === 'mj' ? (
              <p>
                <b>Mode Meneur (MJ) :</b> Activez votre salle de jeu. Vos joueurs rejoignent avec le même code sur leur smartphone : leurs points de vie, mana, états et jets de dés se synchronisent <b>en direct sous vos yeux</b> !
              </p>
            ) : (
              <p>
                <b>Mode Joueur (PJ) :</b> Entrez le code donné par votre Meneur. Dès que vous subissez des dégâts, dépensez du mana ou que le MJ vous attribue un statut, les deux écrans sont synchronisés en direct !
              </p>
            )}
          </div>

          {/* Room Code Input / Controls */}
          <div className="p-4 rounded-xl bg-[#120f0c] border border-[#3d3023] space-y-3">
            <label className="block text-xs font-bold text-[#f3d48d]">
              Code Unique de la Table de Jeu :
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                disabled={isConnected}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="Ex: OSGILD-42, TABLE-101..."
                className="flex-1 py-2.5 px-3.5 bg-[#0d0a08] border border-[#3d3023] focus:border-[#d4a84a] rounded-xl font-mono text-sm font-bold text-[#f3d48d] outline-none tracking-wider disabled:opacity-60"
              />
              {!isConnected && (
                <button
                  type="button"
                  onClick={handleGenerateRandomCode}
                  className="px-3 py-2.5 rounded-xl bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-[#ede3d1] text-xs font-semibold cursor-pointer shrink-0"
                  title="Générer un code aléatoire"
                >
                  <RefreshCw className="w-4 h-4 text-[#d4a84a]" />
                </button>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {!isConnected ? (
                <button
                  type="button"
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#d4a84a] via-[#e5bd62] to-[#ab8230] hover:brightness-110 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Wifi className="w-4 h-4 text-black" />
                  <span>
                    {isConnecting ? 'Connexion en cours...' : 'Rejoindre la Table en Direct'}
                  </span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCopyPlayerInviteLink}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#1e2a1b] hover:bg-[#253821] border border-[#4ade80] text-[#86efac] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span>Lien d'invitation copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-green-400" />
                        <span>Copier le Lien Joueurs (avec code)</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="py-2 px-3.5 rounded-xl bg-[#291316] hover:bg-[#381a1e] border border-[#ef4444]/60 text-[#fca5a5] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <WifiOff className="w-4 h-4" />
                    <span>Quitter</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Connected Heroes List */}
          {isConnected && (
            <div className="p-4 rounded-xl bg-[#120f0c] border border-[#276e43] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#86efac]">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Héros Connectés à la Table ({connectedHeroes.length}) :</span>
                </div>
                <span className="text-[10px] text-[#4ade80] animate-pulse">● En Direct</span>
              </div>

              {connectedHeroes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {connectedHeroes.map((h, idx) => (
                    <div
                      key={h.id || idx}
                      className="p-2.5 rounded-lg bg-[#181e19] border border-[#2d5939] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                        <b className="text-[#ede3d1]">{h.name}</b>
                        <span className="text-[10px] text-[#9e907d]">({h.profil})</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#f3d48d]">
                        {h.hp} PV
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#9e907d] italic">
                  En attente des connexions des joueurs avec le code <b>{liveRoomCode}</b>...
                </p>
              )}
            </div>
          )}

          {/* Quick instructions for cross-device table */}
          <div className="p-3 bg-[#131b14] border border-[#276e43] rounded-xl text-[11px] text-[#9ee7b8] flex items-start gap-2">
            <Shield className="w-4 h-4 text-[#86efac] shrink-0 mt-0.5" />
            <span>
              <b>Magie du temps réel :</b> Les modifications de PV, de Mana, de matériel et les lancers de dés physiques/virtuels se synchronisent sans que personne n&apos;ait besoin d&apos;actualiser la page !
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
