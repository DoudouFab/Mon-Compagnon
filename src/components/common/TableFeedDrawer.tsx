import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  X,
  Send,
  Lock,
  Users,
  Bell,
  MessageSquare,
  Heart,
  Zap,
  Coins,
  Backpack,
  ShieldAlert,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { Character, TableFeedEntry } from '../../types/chroniques';
import { getPjColor } from '../../utils/pjColors';

interface TableFeedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  appMode: 'pj' | 'mj';
  currentPj: Character | null;
  pjsList: Character[];
  entries: TableFeedEntry[];
  onSendMessage: (payload: {
    text: string;
    scope: 'all' | 'secret';
    targetHero?: Character | null;
  }) => void;
  onClearFeed?: () => void;
  isLiveConnected: boolean;
  liveRoomCode?: string;
}

const formatTime = (ts: number) => {
  try {
    return new Date(ts).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

const getCategoryIcon = (category?: TableFeedEntry['category']) => {
  switch (category) {
    case 'hp':
      return <Heart className="w-3.5 h-3.5 text-[#f87171] shrink-0" />;
    case 'pm':
      return <Zap className="w-3.5 h-3.5 text-[#60a5fa] shrink-0" />;
    case 'bourse':
      return <Coins className="w-3.5 h-3.5 text-[#f3d48d] shrink-0" />;
    case 'inventaire':
      return <Backpack className="w-3.5 h-3.5 text-[#d4a84a] shrink-0" />;
    case 'etats':
      return <ShieldAlert className="w-3.5 h-3.5 text-[#fbbf24] shrink-0" />;
    case 'capacite':
    case 'fiche':
      return <Sparkles className="w-3.5 h-3.5 text-[#c084fc] shrink-0" />;
    default:
      return <Bell className="w-3.5 h-3.5 text-[#d4a84a] shrink-0" />;
  }
};

export const TableFeedDrawer: React.FC<TableFeedDrawerProps> = ({
  isOpen,
  onClose,
  appMode,
  currentPj,
  pjsList,
  entries,
  onSendMessage,
  onClearFeed,
  isLiveConnected,
  liveRoomCode,
}) => {
  const [filterKind, setFilterKind] = useState<'all' | 'message' | 'event'>('all');
  const [mjHeroFilter, setMjHeroFilter] = useState<string>('all');
  const [msgScope, setMsgScope] = useState<'all' | 'secret'>(() =>
    appMode === 'pj' ? 'secret' : 'all'
  );
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');
  const [draft, setDraft] = useState<string>('');
  const listEndRef = useRef<HTMLDivElement | null>(null);

  // Garder un destinataire valide sélectionné côté MJ quand la liste des PJ évolue
  useEffect(() => {
    if (appMode === 'mj' && pjsList.length > 0) {
      const exists = pjsList.some((p) => (p.id || p.name) === selectedTargetId);
      if (!exists) {
        setSelectedTargetId(pjsList[0].id || pjsList[0].name);
      }
    }
  }, [appMode, pjsList, selectedTargetId]);

  // Ajuster le mode par défaut lors du changement de vue MJ / PJ
  useEffect(() => {
    setMsgScope(appMode === 'pj' ? 'secret' : 'all');
  }, [appMode]);

  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      if (filterKind !== 'all' && item.kind !== filterKind) return false;
      if (appMode === 'mj' && mjHeroFilter !== 'all') {
        const matchTarget =
          item.targetHeroId === mjHeroFilter ||
          item.senderHeroId === mjHeroFilter ||
          (item.targetHeroName || '').toLowerCase() === mjHeroFilter.toLowerCase() ||
          (item.senderRole === 'pj' && item.senderName.toLowerCase() === mjHeroFilter.toLowerCase());
        if (!matchTarget && item.scope !== 'all') return false;
        if (!matchTarget && item.scope === 'all' && item.senderRole === 'pj') return false;
      }
      return true;
    });
  }, [entries, filterKind, appMode, mjHeroFilter]);

  useEffect(() => {
    if (isOpen) {
      listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, filteredEntries.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanText = draft.trim();
    if (!cleanText) return;

    let targetHero: Character | null = null;
    if (appMode === 'mj' && msgScope === 'secret') {
      targetHero =
        pjsList.find((p) => (p.id || p.name) === selectedTargetId) || pjsList[0] || null;
      if (!targetHero) return;
    } else if (appMode === 'pj' && msgScope === 'secret') {
      targetHero = currentPj;
    }

    onSendMessage({
      text: cleanText,
      scope: msgScope,
      targetHero,
    });
    setDraft('');
  };

  return (
    <div className="no-print fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-[1px] transition-opacity"
        aria-hidden="true"
      />

      {/* Side Drawer Panel */}
      <aside
        aria-label="Journal et messages de la table"
        className="relative z-10 w-full max-w-md h-full bg-[#14100c] border-l border-[#3d3023] shadow-2xl flex flex-col text-[#ede3d1]"
      >
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-[#3d3023] bg-gradient-to-r from-[#241611] via-[#1a130e] to-[#14100c] flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#d4a84a] shrink-0" />
              <h2 className="font-serif-co text-sm sm:text-base font-bold text-[#f3d48d] truncate">
                {appMode === 'mj'
                  ? 'Journal MJ & Messagerie'
                  : `Journal & Messages${currentPj ? ` · ${currentPj.name}` : ''}`}
              </h2>
            </div>
            <p className="text-[11px] text-[#9e907d] truncate mt-0.5">
              {isLiveConnected && liveRoomCode
                ? `Table en direct (${liveRoomCode})`
                : 'Mode local (historique de session)'}
              {appMode === 'pj' && ' · Privé à votre héros'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {appMode === 'mj' && onClearFeed && entries.length > 0 && (
              <button
                type="button"
                onClick={onClearFeed}
                title="Effacer l'historique et les messages"
                className="p-1.5 rounded-lg text-[#9e907d] hover:text-[#fca5a5] hover:bg-[#2a1515] border border-transparent hover:border-[#6e2d2d] transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer le volet"
              className="p-1.5 rounded-lg text-[#9e907d] hover:text-[#ede3d1] hover:bg-[#241c15] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-4 py-2.5 border-b border-[#2b2219] bg-[#18130e] flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1 p-1 bg-[#100d0a] rounded-lg border border-[#30251b]">
            {(
              [
                { id: 'all', label: 'Tout' },
                { id: 'message', label: 'Messages' },
                { id: 'event', label: 'Notifications' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterKind(tab.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filterKind === tab.id
                    ? 'bg-[#362717] text-[#f3d48d]'
                    : 'text-[#9e907d] hover:text-[#ede3d1]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {appMode === 'mj' && pjsList.length > 0 && (
            <select
              value={mjHeroFilter}
              onChange={(e) => setMjHeroFilter(e.target.value)}
              aria-label="Filtrer par personnage"
              className="bg-[#100d0a] border border-[#3d3023] rounded-lg px-2 py-1 text-[11px] text-[#ede3d1] outline-none focus:border-[#d4a84a] max-w-[150px]"
            >
              <option value="all">Tous les PJ ({pjsList.length})</option>
              {pjsList.map((pj) => (
                <option key={pj.id || pj.name} value={pj.id || pj.name}>
                  {pj.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Privacy Notice for Players */}
        {appMode === 'pj' && (
          <div className="px-4 py-2 bg-[#17130f] border-b border-[#2b2219] text-[11px] text-[#9e907d] flex items-center gap-2 shrink-0">
            <Lock className="w-3.5 h-3.5 text-[#d4a84a] shrink-0" />
            <span>
              Confidentialité : seuls vos échanges avec le MJ et les messages publics s&apos;affichent ici.
            </span>
          </div>
        )}

        {/* Chronological Feed List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredEntries.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6 py-10 text-[#8a7c69]">
              <MessageSquare className="w-8 h-8 mb-2 opacity-40 text-[#d4a84a]" />
              <p className="text-xs font-semibold text-[#cbb8a7]">
                Aucune notification ni message pour le moment
              </p>
              <p className="text-[11px] mt-1 leading-relaxed">
                Les changements de PV, bourse, états ou équipement et vos messages MJ ↔ PJ apparaîtront ici en direct.
              </p>
            </div>
          ) : (
            filteredEntries.map((item) => {
              const isMessage = item.kind === 'message';
              const isSecret = item.scope === 'secret';
              const heroRef =
                item.kind === 'message'
                  ? item.senderRole === 'pj'
                    ? { id: item.senderHeroId, name: item.senderName }
                    : isSecret
                    ? { id: item.targetHeroId, name: item.targetHeroName }
                    : null
                  : { id: item.targetHeroId || item.senderHeroId, name: item.targetHeroName || item.senderName };
              const pjCol = heroRef ? getPjColor(heroRef, pjsList) : null;

              if (isMessage) {
                const isOwn =
                  (appMode === 'mj' && item.senderRole === 'mj') ||
                  (appMode === 'pj' &&
                    item.senderRole === 'pj' &&
                    currentPj &&
                    ((item.senderHeroId && item.senderHeroId === currentPj.id) ||
                      item.senderName.toLowerCase() === currentPj.name.toLowerCase()));

                return (
                  <div
                    key={item.id}
                    style={
                      pjCol
                        ? {
                            borderColor: isSecret ? 'rgba(180, 68, 82, 0.7)' : pjCol.borderHex,
                            backgroundImage: `linear-gradient(${pjCol.softBg}, ${pjCol.softBg})`,
                          }
                        : undefined
                    }
                    className={`rounded-xl p-3 border text-xs space-y-1.5 ${
                      pjCol
                        ? 'bg-[#16120e]'
                        : isSecret
                        ? 'bg-[#211517] border-[#75333b]'
                        : isOwn
                        ? 'bg-[#221a12] border-[#6b4f26]'
                        : 'bg-[#1b1611] border-[#3d3023]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 min-w-0 font-semibold">
                        {pjCol && (
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: pjCol.hex }}
                            aria-hidden="true"
                          />
                        )}
                        {isSecret ? (
                          <Lock className="w-3 h-3 text-[#fca5a5] shrink-0" />
                        ) : (
                          <Users className="w-3 h-3 text-[#d4a84a] shrink-0" />
                        )}
                        <span
                          className="truncate"
                          style={{
                            color: item.senderRole === 'mj' ? '#ffb8b8' : pjCol ? pjCol.hex : '#f3d48d',
                          }}
                        >
                          {item.senderName}
                        </span>
                        <span className="text-[#8a7c69]">·</span>
                        <span
                          className={isSecret ? 'text-[#fca5a5]' : 'text-[#9e907d]'}
                          style={
                            isSecret && item.senderRole === 'mj' && pjCol
                              ? { color: pjCol.hex }
                              : undefined
                          }
                        >
                          {isSecret
                            ? item.senderRole === 'mj'
                              ? `Secret → ${item.targetHeroName || 'PJ'}`
                              : 'Secret → MJ'
                            : 'À tous'}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono tabular-nums text-[#8a7c69] shrink-0">
                        {formatTime(item.timestamp)}
                      </span>
                    </div>

                    <p className="text-[#ede3d1] leading-relaxed whitespace-pre-wrap break-words">
                      {item.summary}
                    </p>
                  </div>
                );
              }

              // Notification d'événement MJ <-> PJ
              return (
                <div
                  key={item.id}
                  style={
                    pjCol
                      ? {
                          borderColor: pjCol.borderHex,
                          backgroundImage: `linear-gradient(${pjCol.softBg}, ${pjCol.softBg})`,
                        }
                      : undefined
                  }
                  className="rounded-lg px-3 py-2 bg-[#16120e] border border-[#2f251c] text-xs flex items-start gap-2.5"
                >
                  <div className="mt-0.5">{getCategoryIcon(item.category)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 text-[11px] text-[#9e907d]">
                      <span
                        className="font-semibold truncate flex items-center gap-1.5"
                        style={{ color: pjCol ? pjCol.hex : '#f3d48d' }}
                      >
                        {pjCol && (
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: pjCol.hex }}
                            aria-hidden="true"
                          />
                        )}
                        <span className="truncate">{item.targetHeroName || item.senderName}</span>
                      </span>
                      <span className="text-[10px] font-mono tabular-nums shrink-0">
                        {formatTime(item.timestamp)}
                      </span>
                    </div>
                    <p className="text-[#ede3d1] leading-snug mt-0.5">{item.summary}</p>
                    {item.detail && (
                      <p className="text-[10px] text-[#8a7c69] mt-0.5">{item.detail}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={listEndRef} />
        </div>

        {/* Message Composer */}
        <form
          onSubmit={handleSubmit}
          className="p-3.5 border-t border-[#3d3023] bg-[#18130e] space-y-2.5 shrink-0"
        >
          {/* Mode selector: Public vs Secret */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 p-1 bg-[#100d0a] rounded-lg border border-[#30251b]">
              <button
                type="button"
                onClick={() => setMsgScope('all')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  msgScope === 'all'
                    ? 'bg-[#362717] text-[#f3d48d]'
                    : 'text-[#9e907d] hover:text-[#ede3d1]'
                }`}
              >
                <Users className="w-3 h-3" />
                <span>À tous</span>
              </button>
              <button
                type="button"
                onClick={() => setMsgScope('secret')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  msgScope === 'secret'
                    ? 'bg-[#4d1e24] text-[#fecaca]'
                    : 'text-[#9e907d] hover:text-[#ede3d1]'
                }`}
              >
                <Lock className="w-3 h-3" />
                <span>{appMode === 'mj' ? 'Secret (1 PJ)' : 'Secret au MJ'}</span>
              </button>
            </div>

            {appMode === 'mj' && msgScope === 'secret' && (() => {
              const targetObj = pjsList.find((pj) => (pj.id || pj.name) === selectedTargetId) || pjsList[0];
              const targetCol = targetObj ? getPjColor(targetObj, pjsList) : null;
              return (
                <div className="flex items-center gap-1.5 flex-1 min-w-[130px]">
                  {targetCol && (
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: targetCol.hex }}
                      aria-hidden="true"
                    />
                  )}
                  <select
                    value={selectedTargetId}
                    onChange={(e) => setSelectedTargetId(e.target.value)}
                    aria-label="Destinataire secret"
                    style={targetCol ? { borderColor: targetCol.borderHex, color: targetCol.hex } : undefined}
                    className="w-full bg-[#100d0a] border border-[#75333b] rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-[#fecaca] outline-none focus:border-[#d4a84a]"
                  >
                    {pjsList.length === 0 ? (
                      <option value="">Aucun PJ disponible</option>
                    ) : (
                      pjsList.map((pj) => (
                        <option key={pj.id || pj.name} value={pj.id || pj.name} className="text-[#ede3d1] bg-[#100d0a]">
                          Pour : {pj.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              );
            })()}
          </div>

          {/* Input + Send */}
          <div className="flex items-end gap-2">
            <textarea
              rows={2}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={
                msgScope === 'secret'
                  ? appMode === 'mj'
                    ? 'Message secret visible uniquement par ce PJ...'
                    : 'Chuchoter un message secret au MJ...'
                  : 'Écrire un message à toute la table...'
              }
              className="flex-1 resize-none rounded-xl bg-[#0f0c09] border border-[#3d3023] focus:border-[#d4a84a] px-3 py-2 text-xs text-[#ede3d1] placeholder-[#756756] outline-none"
            />
            <button
              type="submit"
              disabled={!draft.trim() || (appMode === 'mj' && msgScope === 'secret' && pjsList.length === 0)}
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-b from-[#d4a84a] to-[#a87e28] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed text-[#140e08] font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Envoyer</span>
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
};
