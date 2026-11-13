import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Shield,
  Download,
  ExternalLink,
  AlertCircle,
  Smartphone,
  Share2,
  Lock,
  Package,
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMjAuthorized: boolean;
  onDownloadOfflineMjHtml: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  isMjAuthorized,
  onDownloadOfflineMjHtml,
}) => {
  const [copiedType, setCopiedType] = useState<'pj' | 'mj' | null>(null);

  if (!isOpen) return null;

  const origin = window.location.origin;
  const pathname = window.location.pathname;
  const pjUrl = `${origin}${pathname}#pj`;
  // Only define mjUrl if isMjAuthorized to avoid any exposure in player mode
  const mjUrl = isMjAuthorized ? `${origin}${pathname}#mj` : '';

  const copyToClipboard = (type: 'pj' | 'mj') => {
    const targetUrl = type === 'pj' ? pjUrl : mjUrl;
    if (!targetUrl) return;

    const markCopied = () => {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(targetUrl).then(markCopied).catch(() => {
        try {
          const el = document.createElement('textarea');
          el.value = targetUrl;
          el.style.position = 'fixed';
          el.style.opacity = '0';
          document.body.appendChild(el);
          el.select();
          document.execCommand('copy');
          document.body.removeChild(el);
          markCopied();
        } catch {}
      });
    } else {
      try {
        const el = document.createElement('textarea');
        el.value = targetUrl;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        markCopied();
      } catch {}
    }
  };

  const handleDownloadPjHtml = () => {
    const a = document.createElement('a');
    a.href = '/assets/aistudio/CO_Compagnon_ac323e33.html';
    a.download = 'Fiche_Joueur_Chroniques_Oubliees_Offline.html';
    a.click();
  };

  const handleDownloadGitHubZip = () => {
    const a = document.createElement('a');
    a.href = '/mon-depot.zip';
    a.download = 'mon-depot.zip';
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#1a1410] border-2 border-[#d4a84a]/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3d3023] bg-gradient-to-r from-[#2b1712] via-[#1c130d] to-[#14100c]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#d4a84a]/15 text-[#f3d48d] border border-[#d4a84a]/30">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-co text-lg font-bold text-[#f3d48d]">
                {isMjAuthorized ? "Liens d'Accès & Partage de Table (Meneur)" : "Partager la Fiche Joueur"}
              </h3>
              <p className="text-xs text-[#a0907d]">
                {isMjAuthorized
                  ? "Distribuez l'application à vos joueurs ou accédez à votre console privée"
                  : "Votre lien de connexion direct & version 100% autonome hors-ligne"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#2b2016] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Explanation Banner regarding 404 */}
          <div className="p-3.5 rounded-xl bg-[#2a1715] border border-[#cf5544]/50 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#ff8a80] shrink-0 mt-0.5" />
            <div className="text-xs text-[#ede3d1] space-y-1">
              <p className="font-bold text-[#ffb8b8]">
                À propos des adresses Web et des liens partagés
              </p>
              <p className="text-[#c7b5a2] leading-relaxed">
                Les liens ci-dessous sont générés <strong className="text-white">en direct depuis votre navigateur actif</strong>.
                {isMjAuthorized && " Seul le Meneur de Jeu a accès au lien secret de la Console MJ."}
              </p>
            </div>
          </div>

          {/* Section 1 : Liens en Ligne */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4a84a] flex items-center gap-1.5">
              <span>{isMjAuthorized ? "1. Liens Web Actifs (Séparés)" : "1. Votre Lien Web Joueur"}</span>
            </h4>

            {/* Carte Lien PJ (Visible par Joueur et MJ) */}
            <div className="p-3.5 rounded-xl bg-[#15110d] border border-[#3d3023] hover:border-[#d4a84a]/50 transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-bold text-sm text-[#f3d48d]">
                  <Shield className="w-4 h-4 text-[#d4a84a]" />
                  {isMjAuthorized ? "Lien pour les JOUEURS (Fiche PJ uniquement)" : "Lien direct vers votre Fiche Joueur"}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1f2d1a] text-[#86efac] border border-[#22c55e]/30">
                  Interface MJ 100% masquée
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={pjUrl}
                  className="flex-1 bg-[#0d0b09] border border-[#2d2217] rounded-lg px-3 py-1.5 text-xs text-[#c9bba6] font-mono select-all focus:outline-hidden"
                />
                <button
                  onClick={() => copyToClipboard('pj')}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#d4a84a] to-[#ab8230] hover:brightness-110 text-[#1a1208] text-xs font-bold flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
                >
                  {copiedType === 'pj' ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copier
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-[#8e8070]">
                {isMjAuthorized
                  ? "Donnez ce lien à vos joueurs. Ils ne verront que leur feuille de personnage et grimoire de voies."
                  : "Enregistrez ce lien dans vos favoris pour retrouver directement votre héros."}
              </p>
            </div>

            {/* Carte Lien MJ : STRICTEMENT VISIBLE UNIQUEMENT PAR LE MJ */}
            {isMjAuthorized && (
              <div className="p-3.5 rounded-xl bg-[#1b1214] border border-[#522023] hover:border-[#9c2a2b] transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold text-sm text-[#ffb8b8]">
                    <Lock className="w-4 h-4 text-[#ff8080]" />
                    Lien PRIVÉ Meneur de Jeu (Console MJ)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#3b1518] text-[#ff9d9d] border border-[#cf5544]/40">
                    Accès Réservé au MJ
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={mjUrl}
                    className="flex-1 bg-[#0d0b09] border border-[#3b1e22] rounded-lg px-3 py-1.5 text-xs text-[#ffcaca] font-mono select-all focus:outline-hidden"
                  />
                  <button
                    onClick={() => copyToClipboard('mj')}
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#9c2a2b] to-[#6d1b1c] hover:brightness-110 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
                  >
                    {copiedType === 'mj' ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copié !
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copier
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-[#a07c7c]">
                  🔒 Ne donnez jamais ce lien aux joueurs. Il déverrouille l'écran de combat, le Bestiaire (114 monstres), la Boîte à Bonbons et les tables de butin.
                </p>
              </div>
            )}
          </div>

          {/* Section 2 : Astuce AI Studio plein écran */}
          <div className="p-3.5 rounded-xl bg-[#171310] border border-[#3d3023] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#ede3d1]">
              <ExternalLink className="w-4 h-4 text-[#d4a84a]" />
              Astuce : Ouvrir l'application dans son propre onglet de navigateur
            </div>
            <p className="text-xs text-[#9e907d] leading-relaxed">
              Pour une ergonomie maximale et pour que l'adresse s'affiche directement dans votre barre d'URL :
              cliquez sur le petit bouton <strong>« Ouvrir dans un nouvel onglet » (icône ↗)</strong> situé tout en haut à droite du panneau dans Google AI Studio.
            </p>
          </div>

          {/* Section 3 : Fichiers HTML 100% Autonomes (Hors-Ligne / Sans Serveur) */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-[#1e1711] to-[#120e0a] border border-[#d4a84a]/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#d4a84a]" />
                <h4 className="font-serif-co text-sm font-bold text-[#f3d48d]">
                  Alternative Zéro-Serveur (100% Hors-Ligne &amp; Illimité)
                </h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#3d2a17] text-[#d4a84a] font-bold">
                Idéal autour de la table
              </span>
            </div>
            <p className="text-xs text-[#a89987] leading-relaxed">
              Aucune dépendance à un serveur ni à Internet. Téléchargez l'application sous forme de fichier <code>.html</code> autonome. Ouvrez-le d'un simple double-clic sur PC, Mac, tablette ou smartphone.
            </p>

            <div className={`grid gap-2.5 pt-1 ${isMjAuthorized ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
              <button
                onClick={handleDownloadPjHtml}
                className="p-3 rounded-xl bg-[#191410] hover:bg-[#251d16] border border-[#d4a84a]/60 text-left transition-all group flex items-start gap-2.5 shadow-xs cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-[#3d2a17] text-[#d4a84a] group-hover:scale-105 transition-transform">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#f3d48d]">
                    Fiche Joueur Offline (.html)
                  </div>
                  <div className="text-[10px] text-[#9e907d]">
                    Fichier autonome complet pour jouer même sans connexion.
                  </div>
                </div>
              </button>

              {/* Téléchargement MJ Offline : STRICTEMENT VISIBLE UNIQUEMENT PAR LE MJ */}
              {isMjAuthorized && (
                <button
                  onClick={onDownloadOfflineMjHtml}
                  className="p-3 rounded-xl bg-[#231215] hover:bg-[#32171c] border border-[#9c2a2b] text-left transition-all group flex items-start gap-2.5 shadow-xs cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-[#4d1f1c] text-[#ff9d9d] group-hover:scale-105 transition-transform">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#ffb8b8]">
                      Console MJ Offline (.html)
                    </div>
                    <div className="text-[10px] text-[#a07c7c]">
                      Préchargé avec les 114 monstres, règles &amp; bonbons.
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Section 4 : Dépôt GitHub & Sauvegarde Complète (mon-depot/) */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-[#181a20] to-[#101216] border border-[#4a5568]/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#93c5fd]" />
                <h4 className="font-serif-co text-sm font-bold text-[#bfdbfe]">
                  Sauvegarde &amp; Export Dépôt GitHub (mon-depot/)
                </h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#1e293b] text-[#93c5fd] font-bold border border-[#3b82f6]/30">
                100% Autonome
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Téléchargez l'archive complète avec la structure exacte demandée (<code>index.html</code> d'accueil + <code>pj/</code> + <code>mj/</code> sécurisé par mot de passe). Prêt à être déployé sur GitHub Pages ou votre propre hébergeur web.
            </p>

            <button
              onClick={handleDownloadGitHubZip}
              className="w-full p-3 rounded-xl bg-[#1e293b]/60 hover:bg-[#1e293b] border border-[#3b82f6]/50 text-left transition-all group flex items-center justify-between shadow-xs cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#0f172a] text-[#60a5fa] border border-[#3b82f6]/30 group-hover:scale-105 transition-transform">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#bfdbfe]">
                    Télécharger l'Archive mon-depot.zip
                  </div>
                  <div className="text-[10px] text-[#94a3b8]">
                    Contient <code>index.html</code>, <code>pj/</code> et <code>mj/</code> (mot de passe MJ : <code>mj</code>).
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-[#60a5fa] px-3 py-1.5 rounded-lg bg-[#1e3a8a]/40 border border-[#3b82f6]/30">
                Télécharger .ZIP
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[#3d3023] bg-[#120f0d] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#2b2017] hover:bg-[#3d2d20] border border-[#4d3a2a] text-xs font-bold text-[#ede3d1] transition-all cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
