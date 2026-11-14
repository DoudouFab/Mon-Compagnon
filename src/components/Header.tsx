import React from 'react';
import {
  Shield,
  Swords,
  Dices,
  ExternalLink,
  Sparkles,
  Copy,
  Lock,
  Radio,
  MessageSquare,
  BookOpen,
} from 'lucide-react';
import { Character } from '../types/chroniques';

interface HeaderProps {
  appMode: 'pj' | 'mj';
  setAppMode: (mode: 'pj' | 'mj') => void;
  onOpenDiceRoller: () => void;
  currentPj: Character | null;
  onSendPjToMj: () => void;
  pjsCountInMj: number;
  isTharneaActive: boolean;
  onToggleTharnea: (active: boolean) => void;
  isMjAuthorized: boolean;
  onPromptUnlockMj: () => void;
  onCopyLink: (type: 'pj' | 'mj') => void;
  onLockToPj: () => void;
  onOpenShareModal: () => void;
  onOpenRoster?: () => void;
  rosterCount?: number;
  onOpenLiveTable?: () => void;
  liveStatus?: 'disconnected' | 'connecting' | 'connected' | 'error';
  liveRoomCode?: string;
  onOpenFeed?: () => void;
  unreadFeedCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  appMode,
  setAppMode,
  onOpenDiceRoller,
  currentPj,
  pjsCountInMj,
  isTharneaActive,
  onToggleTharnea,
  isMjAuthorized,
  onPromptUnlockMj,
  onCopyLink,
  onLockToPj,
  onOpenRoster,
  rosterCount,
  onOpenLiveTable,
  liveStatus = 'disconnected',
  liveRoomCode = '',
  onOpenFeed,
  unreadFeedCount = 0,
}) => {
  const secondTabHref =
    typeof window !== 'undefined'
      ? `${window.location.pathname}${appMode === 'pj' ? '#mj001' : '#pj'}`
      : appMode === 'pj'
      ? '#mj001'
      : '#pj';

  return (
    <header className="no-print sticky top-0 z-40 bg-gradient-to-b from-[#26140f] via-[#17110c] to-[#110e0b] border-b border-[#3d3023] shadow-lg">
      {/* Ligne principale compacte */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2 flex flex-wrap items-center justify-between gap-2.5">
        {/* 1. Identité compacte */}
        <button
          type="button"
          onClick={onOpenRoster}
          className="flex items-center gap-2.5 text-left cursor-pointer group select-none shrink-0"
          title="Retourner à l'accueil 'Mes Héros'"
        >
          <div
            className={`w-8 h-8 rounded-lg p-0.5 shadow-sm flex items-center justify-center transition-transform group-hover:scale-105 ${
              appMode === 'pj'
                ? 'bg-gradient-to-br from-[#d4a84a] to-[#7a5518]'
                : 'bg-gradient-to-br from-[#9c2a2b] to-[#4d1f1c]'
            }`}
          >
            <div className="w-full h-full bg-[#1b140e] rounded-[6px] flex items-center justify-center">
              {appMode === 'pj' ? (
                <Shield className="w-4 h-4 text-[#f3d48d]" />
              ) : (
                <Swords className="w-4 h-4 text-[#ff9d9d]" />
              )}
            </div>
          </div>

          <div className="min-w-0">
            <h1
              className={`font-serif-co text-sm sm:text-base font-bold tracking-wide whitespace-nowrap transition-colors ${
                appMode === 'pj'
                  ? 'text-[#f3d48d] group-hover:text-[#ffe29a]'
                  : 'text-[#ffb8b8] group-hover:text-[#ffd2d2]'
              }`}
            >
              {appMode === 'pj' ? 'Mon compagnon PJ' : 'Console MJ'}
            </h1>
            <p className="hidden xl:block text-[10px] text-[#9e907d] whitespace-nowrap">
              {appMode === 'pj'
                ? 'Chroniques Oubliées · Fiche & Grimoire'
                : "Chroniques Oubliées · Initiative & DRS"}
            </p>
          </div>
        </button>

        {/* 2. Sélecteur PJ / MJ + Héros actif */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <div className="flex items-center bg-[#100d0a] p-1 rounded-lg border border-[#3d3023] shadow-inner">
            <button
              type="button"
              onClick={() => {
                setAppMode('pj');
                window.location.hash = '#pj';
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                appMode === 'pj'
                  ? 'bg-gradient-to-r from-[#d4a84a] to-[#ab8230] text-[#1a1208] shadow-xs'
                  : 'text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#231c15]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Vue PJ</span>
            </button>

            {isMjAuthorized ? (
              <button
                type="button"
                onClick={() => {
                  setAppMode('mj');
                  window.location.hash = '#mj001';
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  appMode === 'mj'
                    ? 'bg-gradient-to-r from-[#9c2a2b] to-[#6d1b1c] text-white shadow-xs'
                    : 'text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#231c15]'
                }`}
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Console MJ</span>
                {pjsCountInMj > 0 && (
                  <span className="text-[10px] px-1 rounded bg-black/30 font-mono tabular-nums text-[#f3d48d]">
                    {pjsCountInMj}
                  </span>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={onPromptUnlockMj}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold text-[#ffb8b8] hover:text-white bg-[#241214] hover:bg-[#36181c] border border-[#9c2a2b]/60 transition-all cursor-pointer ml-1 whitespace-nowrap shrink-0"
                title="Accéder à la Console du Meneur de Jeu"
              >
                <Lock className="w-3 h-3 text-[#ff8080]" />
                <span>Accès MJ</span>
              </button>
            )}
          </div>

          {appMode === 'pj' && (
            <div className="flex items-center gap-1.5 bg-[#100d0a] px-2.5 py-1 rounded-lg border border-[#3d3023] text-xs">
              <span className="font-semibold text-[#f3d48d] truncate max-w-[120px] sm:max-w-[160px]">
                {currentPj ? `${currentPj.name} · Niv.${currentPj.level}` : 'Aucun héros'}
              </span>
              {onOpenRoster && (
                <button
                  type="button"
                  onClick={onOpenRoster}
                  className="text-[10px] px-2 py-0.5 rounded bg-[#2a1d12] hover:bg-[#3b2818] text-[#f3d48d] font-bold border border-[#d4a84a]/40 cursor-pointer transition-colors whitespace-nowrap shrink-0"
                  title="Changer de personnage ou gérer vos héros"
                >
                  Héros{rosterCount !== undefined && rosterCount > 0 ? ` (${rosterCount})` : ''}
                </button>
              )}
            </div>
          )}
        </div>

        {/* 3. Actions principales alignées */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isMjAuthorized && (
            <a
              href="https://doudoufab.github.io/grimoire-jdr-ok-/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-[#2c1d12] to-[#1e130a] hover:from-[#3a2718] hover:to-[#2a1b0e] border border-[#d4a84a]/70 hover:border-[#f3d48d] text-[#f3d48d] hover:text-white transition-all shadow-xs whitespace-nowrap shrink-0"
              title="Ouvrir le Grimoire interactif des Sorts (doudoufab) dans un nouvel onglet (MJ uniquement)"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#d4a84a]" />
              <span>Grimoire JdR</span>
              <ExternalLink className="w-3 h-3 text-[#a0907d]" />
            </a>
          )}

          {onOpenFeed && (
            <button
              type="button"
              onClick={onOpenFeed}
              className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border whitespace-nowrap shrink-0 ${
                unreadFeedCount > 0
                  ? 'bg-[#2c1f12] hover:bg-[#3a2816] text-[#f3d48d] border-[#d4a84a]'
                  : 'bg-[#201913] hover:bg-[#2d231a] text-[#ede3d1] border-[#3d3023]'
              }`}
              title="Ouvrir le volet Historique des notifications & Messagerie MJ / PJ"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#d4a84a]" />
              <span>Messages</span>
              {unreadFeedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#9c2a2b] text-white text-[10px] font-mono tabular-nums font-bold">
                  {unreadFeedCount > 99 ? '99+' : unreadFeedCount}
                </span>
              )}
            </button>
          )}

          {onOpenLiveTable && (
            <button
              type="button"
              onClick={onOpenLiveTable}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border whitespace-nowrap shrink-0 ${
                liveStatus === 'connected'
                  ? 'bg-[#152e1b] hover:bg-[#1d4025] text-[#86efac] border-[#22c55e]/70'
                  : liveStatus === 'connecting'
                  ? 'bg-[#2b2110] text-[#fde68a] border-[#eab308]/70 animate-pulse'
                  : 'bg-[#201913] hover:bg-[#2d231a] text-[#d4a84a] border-[#d4a84a]/40'
              }`}
              title="Gérer la synchronisation temps réel en direct de la table de jeu"
            >
              <Radio
                className={`w-3.5 h-3.5 ${
                  liveStatus === 'connected' ? 'text-green-400 animate-pulse' : 'text-[#d4a84a]'
                }`}
              />
              <span>{liveStatus === 'connected' ? `Direct · ${liveRoomCode}` : 'Table Direct'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenDiceRoller}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-b from-[#3a2954] to-[#251739] hover:from-[#49346b] hover:to-[#2e1d47] text-[#dccbff] border border-[#654a93] transition-all cursor-pointer whitespace-nowrap shrink-0"
            title="Lancer les dés"
          >
            <Dices className="w-3.5 h-3.5 text-[#dccbff]" />
            <span>Dés</span>
          </button>
        </div>
      </div>

      {/* Sous-barre utilitaire ultra-compacte (Extension & Outils MJ) */}
      <div className="border-t border-[#2a2119] bg-[#110d0a]/95">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 py-1 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <label
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border cursor-pointer select-none transition-colors whitespace-nowrap ${
              isTharneaActive
                ? 'bg-[#261123] border-[#782966] text-[#f5c2ef]'
                : 'bg-[#17130f] border-[#30251c] text-[#9e907d] hover:border-[#4d3b2b]'
            }`}
            title="Active ou désactive le pack supplémentaire Tharnéa (61 monstres du Codex de l'Obscure, artéfacts et bonbons alchimiques)"
          >
            <input
              type="checkbox"
              checked={isTharneaActive}
              onChange={(e) => onToggleTharnea(e.target.checked)}
              className="w-3 h-3 accent-[#b8389e] rounded cursor-pointer"
            />
            <Sparkles className={`w-3 h-3 ${isTharneaActive ? 'text-[#f08be0]' : 'text-[#9e907d]'}`} />
            <span className="font-semibold">Extension Tharnéa</span>
            {isTharneaActive && (
              <span className="text-[10px] text-[#e5a8dc] font-mono">· 61 Mobs</span>
            )}
          </label>

          {isMjAuthorized && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => onCopyLink('pj')}
                className="px-2 py-0.5 rounded bg-[#1b1510] hover:bg-[#292018] border border-[#3d3023] text-[#f3d48d] font-medium flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                title="Copier le lien direct pour les JOUEURS (console MJ masquée)"
              >
                <Copy className="w-3 h-3 text-[#d4a84a]" />
                <span>Lien Joueurs</span>
              </button>

              <button
                type="button"
                onClick={() => onCopyLink('mj')}
                className="px-2 py-0.5 rounded bg-[#231214] hover:bg-[#33181b] border border-[#6e2528] text-[#ffb8b8] font-medium flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                title="Copier votre lien privé de MENEUR DE JEU (#mj001)"
              >
                <Lock className="w-3 h-3 text-[#ff8080]" />
                <span>Lien MJ</span>
              </button>

              <a
                href={secondTabHref}
                target="_blank"
                rel="noopener noreferrer"
                title={appMode === 'pj' ? 'Ouvrir la Console MJ dans un 2e onglet' : 'Ouvrir la Fiche PJ dans un 2e onglet'}
                className="px-2 py-0.5 rounded bg-[#1b1510] hover:bg-[#292018] border border-[#3d3023] text-[#cbb8a7] hover:text-[#ede3d1] font-medium flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
              >
                <ExternalLink className="w-3 h-3" />
                <span>{appMode === 'pj' ? '2e onglet MJ' : '2e onglet PJ'}</span>
              </a>

              <button
                type="button"
                onClick={onLockToPj}
                className="px-2 py-0.5 rounded bg-[#17120e] hover:bg-[#251c16] border border-[#3d3023] text-[#9e907d] hover:text-[#ede3d1] flex items-center gap-1 cursor-pointer whitespace-nowrap"
                title="Verrouiller et masquer la Console MJ sur cet écran"
              >
                <Lock className="w-3 h-3" />
                <span>Verrouiller</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
