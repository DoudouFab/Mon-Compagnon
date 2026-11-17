import React, { useState } from 'react';
import { Download, ExternalLink, Share, X, CheckCircle2, WifiOff } from 'lucide-react';
import { useOnlineStatus, usePWAInstall } from '../../hooks/usePWAInstall';
import { useToast } from './ToastContext';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isInIframe, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const { success, info } = useToast();

  // Déjà lancée comme application installée : masquer le bouton
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        success("Application installée ! Retrouvez « CO Compagnon » sur votre écran d'accueil.");
      } else {
        info("Installation annulée. Vous pouvez réessayer à tout moment.");
      }
      return;
    }
    setShowGuideModal(true);
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '/';

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-[#234729] to-[#17301b] hover:from-[#2c5934] hover:to-[#1d3d22] text-[#b9f6c3] border border-[#4c8f56]/70 transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-xs"
        title={
          isInstallable
            ? "Installer l'application sur votre appareil (accès rapide & hors-ligne)"
            : "Installer l'application sur votre appareil"
        }
      >
        <Download className="w-3.5 h-3.5 text-[#86efac]" />
        <span className="hidden sm:inline">Installer l&apos;appli</span>
        <span className="sm:hidden">Installer</span>
      </button>

      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-[#181410] border border-[#d4a84a]/60 p-5 shadow-2xl space-y-4 text-[#ede3d1]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <img
                  src="/Mon-Compagnon/pwa-192x192.png"
                  alt="Icône CO Compagnon"
                  className="w-10 h-10 rounded-xl border border-[#d4a84a]/60 shadow-sm shrink-0"
                />
                <div>
                  <h3 className="font-serif-co text-base font-bold text-[#f3d48d]">
                    Installer l&apos;application
                  </h3>
                  <p className="text-[11px] text-[#9e907d]">
                    Accès plein écran &amp; données disponibles hors-ligne
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="p-1 rounded-lg text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#231c15] cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isInIframe ? (
              <div className="space-y-3">
                <p className="text-xs text-[#cbbba6] leading-relaxed">
                  L&apos;application est actuellement ouverte dans une fenêtre intégrée : pour déclencher
                  l&apos;installation native sur votre appareil, ouvrez-la d&apos;abord directement dans un onglet du navigateur.
                </p>
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#d4a84a] to-[#ab8230] hover:brightness-110 text-[#1a1208] font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Ouvrir l&apos;appli dans un onglet pour installer</span>
                </a>
              </div>
            ) : isIOS ? (
              <div className="space-y-2.5 bg-[#231c15] border border-[#3d3023] rounded-lg p-3.5 text-xs text-[#cbbba6]">
                <p className="font-bold text-[#f3d48d]">Sur iPhone / iPad (Safari) :</p>
                <ol className="space-y-1.5 list-decimal list-inside">
                  <li>
                    Appuyez sur le bouton <strong className="text-white inline-flex items-center gap-1"><Share className="w-3.5 h-3.5 text-[#7db5ff]" /> Partager</strong> dans la barre Safari.
                  </li>
                  <li>
                    Faites défiler et choisissez <strong className="text-white">Sur l&apos;écran d&apos;accueil</strong>.
                  </li>
                  <li>
                    Appuyez sur <strong className="text-white">Ajouter</strong>.
                  </li>
                </ol>
              </div>
            ) : (
              <div className="space-y-2.5 bg-[#231c15] border border-[#3d3023] rounded-lg p-3.5 text-xs text-[#cbbba6]">
                <p className="font-bold text-[#f3d48d]">Installation depuis votre navigateur :</p>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>
                    <strong className="text-white">Chrome / Edge (PC) :</strong> cliquez sur l&apos;icône d&apos;installation dans la barre d&apos;adresse (à droite) ou menu ⋮ → <em>Installer l&apos;application</em>.
                  </li>
                  <li>
                    <strong className="text-white">Android (Chrome) :</strong> ouvrez le menu ⋮ → <em>Ajouter à l&apos;écran d&apos;accueil / Installer</em>.
                  </li>
                  <li>
                    <strong className="text-white">Safari Mac :</strong> menu <em>Fichier → Ajouter au Dock</em>.
                  </li>
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#6fa85b] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Compatible mode hors-ligne
              </span>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-3.5 py-1.5 rounded-lg bg-[#231c15] hover:bg-[#32271d] border border-[#3d3023] text-xs font-semibold text-[#ede3d1] cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="no-print fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-[#854d0e] border border-[#d4a84a] px-3 py-1.5 text-xs font-semibold text-[#fef3c7] shadow-lg">
      <WifiOff className="w-3.5 h-3.5 text-[#fde047]" />
      <span>Mode hors-ligne — Données locales actives</span>
    </div>
  );
};
