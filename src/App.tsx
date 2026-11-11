/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PjSheet } from './components/pj/PjSheet';
import { PjCreationWizard } from './components/pj/PjCreationWizard';
import { MjConsole } from './components/mj/MjConsole';
import { DiceRoller } from './components/DiceRoller';
import {
  BESTIAIRE,
  EQUIPEMENTS,
  ETATS,
  PROFILS,
  RACES,
  REGLES,
  SAMPLE_HERO,
  SORTS_CATALOG,
  VOIES_CATALOG,
} from './data/coDatabase';
import { THARNEA_MONSTERS, THARNEA_ARTIFACTS } from './data/tharneaSupplement';
import { ShareModal } from './components/ShareModal';
import { CharacterRosterHub } from './components/pj/CharacterRosterHub';
import { MjPasswordModal } from './components/common/MjPasswordModal';
import { LiveTableModal } from './components/common/LiveTableModal';
import { realtimeTable, LiveConnectionStatus } from './services/realtimeSync';
import { Character, Combatant } from './types/chroniques';

export default function App() {
  const [isMjAuthorized, setIsMjAuthorized] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem('cof_mj_access') === 'granted';
    } catch {
      return false;
    }
  });

  const [appMode, setAppMode] = useState<'pj' | 'mj'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const isMjHash = window.location.hash.toLowerCase().includes('mj001');
        const auth = localStorage.getItem('cof_mj_access') === 'granted';
        if (isMjHash && auth) return 'mj';
      } catch {}
    }
    return 'pj';
  });

  const [isDiceRollerOpen, setIsDiceRollerOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMjPasswordModalOpen, setIsMjPasswordModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Live Table state (real-time cross-device sync)
  const [isLiveTableOpen, setIsLiveTableOpen] = useState(false);
  const [liveRoomCode, setLiveRoomCode] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const queryTable = params.get('table');
        if (queryTable) return queryTable.trim().toUpperCase();
        return localStorage.getItem('cof_live_room') || '';
      }
    } catch {}
    return '';
  });
  const [liveStatus, setLiveStatus] = useState<LiveConnectionStatus>('disconnected');
  const [connectedHeroes, setConnectedHeroes] = useState<Character[]>([]);

  // Pack Extension Tharnéa / Codex de l'Obscure toggle state
  const [isTharneaActive, setIsTharneaActive] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('cof_tharnea_active');
      return saved === null ? true : saved === 'true'; // default to true so user immediately sees their pack
    } catch {
      return true;
    }
  });

  const handleToggleTharnea = (active: boolean) => {
    setIsTharneaActive(active);
    try {
      localStorage.setItem('cof_tharnea_active', active ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
    showToast(
      active
        ? "✨ Extension Tharnéa activée : 61 monstres, 30+ artéfacts et 12 bonbons débloqués !"
        : "Extension Tharnéa désactivée : Mode DRS officiel pur."
    );
  };

  // Sync hash and query routing #pj / #mj001
  useEffect(() => {
    const handleUrlSync = () => {
      try {
        const hash = window.location.hash.toLowerCase();
        const isAuth = localStorage.getItem('cof_mj_access') === 'granted';

        if (hash.includes('mj001') || hash === '#mj') {
          if (isAuth) {
            setIsMjAuthorized(true);
            setAppMode('mj');
            if (hash !== '#mj001') {
              window.location.hash = '#mj001';
            }
          } else {
            // Not authorized: do NOT let them in, prompt password modal!
            setIsMjPasswordModalOpen(true);
            setAppMode('pj');
          }
        } else if (hash.includes('pj')) {
          setAppMode('pj');
        }
      } catch (e) {
        console.error(e);
      }
    };
    handleUrlSync();
    window.addEventListener('hashchange', handleUrlSync);
    window.addEventListener('popstate', handleUrlSync);
    return () => {
      window.removeEventListener('hashchange', handleUrlSync);
      window.removeEventListener('popstate', handleUrlSync);
    };
  }, []);

  const handleModeChange = (mode: 'pj' | 'mj') => {
    if (mode === 'mj') {
      if (!isMjAuthorized) {
        setIsMjPasswordModalOpen(true);
        return;
      }
      setAppMode('mj');
      window.location.hash = '#mj001';
      return;
    }
    setAppMode(mode);
    window.location.hash = '#pj';
  };

  const handleCopyLink = (type: 'pj' | 'mj') => {
    try {
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      const url = type === 'pj' ? `${origin}${pathname}#pj` : `${origin}${pathname}#mj001`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(
          () => {
            showToast(
              type === 'pj'
                ? '📋 Lien Joueurs copié ! (Interface MJ totalement invisible pour eux)'
                : '🔐 Lien privé MJ copié ! (#mj001)'
            );
          },
          () => {
            prompt('Copiez ce lien :', url);
          }
        );
      } else {
        prompt('Copiez ce lien :', url);
      }
    } catch {
      showToast('Action impossible sur ce navigateur.');
    }
  };

  const handleLockToPj = () => {
    setIsMjAuthorized(false);
    setAppMode('pj');
    window.location.hash = '#pj';
    try {
      localStorage.removeItem('cof_mj_access');
      sessionStorage.removeItem('cof_mj_auth');
    } catch {}
    showToast('🔒 Mode Joueur activé : la console MJ est désormais verrouillée.');
  };

  const handlePasswordSuccess = () => {
    setIsMjPasswordModalOpen(false);
    setIsMjAuthorized(true);
    setAppMode('mj');
    window.location.hash = '#mj001';
    showToast('🔓 Accès MJ déverrouillé ! Bienvenue dans la Console du Meneur.');
  };

  // Player Characters Roster: empty at start as explicitly requested!
  const [playerRoster, setPlayerRoster] = useState<Character[]>(() => {
    try {
      const saved = localStorage.getItem('co_player_roster');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      // If legacy single character exists and is not the sample hero
      const legacy = localStorage.getItem('co_pj_local');
      if (legacy) {
        const parsedLegacy = JSON.parse(legacy);
        if (parsedLegacy && parsedLegacy.name && parsedLegacy.name !== SAMPLE_HERO.name) {
          return [parsedLegacy];
        }
      }
    } catch (e) {
      console.error(e);
    }
    return []; // Starts completely empty for new player links
  });

  const [activePjId, setActivePjId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('co_active_pjid') || null;
    } catch {
      return null;
    }
  });

  const [showRosterHub, setShowRosterHub] = useState<boolean>(false);

  // Derived current active PJ
  const currentPj: Character | null =
    playerRoster.find((p) => p.id === activePjId) ||
    (playerRoster.length > 0 ? playerRoster[0] : null);

  const handleSelectPj = (pj: Character) => {
    const pjId = pj.id || 'pj_' + Date.now();
    setActivePjId(pjId);
    try {
      localStorage.setItem('co_active_pjid', pjId);
    } catch {}
    setShowRosterHub(false);
    showToast(`Héros "${pj.name}" sélectionné !`);
  };

  const handleUpdateCurrentPj = (updated: Character) => {
    if (realtimeTable.room) {
      realtimeTable.updateHero(updated);
    }
    setPlayerRoster((prev) => {
      const idx = prev.findIndex((p) => p.id === updated.id);
      let nextRoster: Character[];
      if (idx >= 0) {
        nextRoster = [...prev];
        nextRoster[idx] = updated;
      } else {
        nextRoster = [...prev, updated];
      }
      try {
        localStorage.setItem('co_player_roster', JSON.stringify(nextRoster));
        localStorage.setItem('co_pj_local', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return nextRoster;
    });
  };

  const handleAddCharacter = (newChar: Character) => {
    const charWithId: Character = {
      ...newChar,
      id: newChar.id || 'pj_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    };
    setPlayerRoster((prev) => {
      const updated = [...prev, charWithId];
      try {
        localStorage.setItem('co_player_roster', JSON.stringify(updated));
        localStorage.setItem('co_pj_local', JSON.stringify(charWithId));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    const charId = charWithId.id || ('pj_' + Date.now());
    setActivePjId(charId);
    try {
      localStorage.setItem('co_active_pjid', charId);
    } catch {}
    setShowRosterHub(false);
    showToast(`Héros "${charWithId.name}" créé avec succès !`);
  };

  const handleDeletePj = (id: string) => {
    const target = playerRoster.find((p) => p.id === id);
    const charName = target ? target.name : 'personnage';

    setPlayerRoster((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem('co_player_roster', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    if (activePjId === id) {
      const remaining = playerRoster.filter((p) => p.id !== id);
      const nextId = remaining.length > 0 ? (remaining[0].id || null) : null;
      setActivePjId(nextId);
      try {
        if (nextId) localStorage.setItem('co_active_pjid', nextId);
        else localStorage.removeItem('co_active_pjid');
      } catch {}
    }
    showToast(`Personnage "${charName}" oublié et supprimé.`);
  };

  const handleDuplicatePj = (pj: Character) => {
    const clone: Character = {
      ...pj,
      id: 'pj_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: `${pj.name} (Copie)`,
    };
    setPlayerRoster((prev) => {
      const updated = [...prev, clone];
      try {
        localStorage.setItem('co_player_roster', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    showToast(`Copie de "${pj.name}" créée !`);
  };

  const handleExportSinglePj = (pj: Character) => {
    const a = document.createElement('a');
    a.href =
      'data:application/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(pj, null, 2));
    a.download = `${(pj.name || 'personnage').replace(/\s+/g, '_')}_CO.json`;
    a.click();
    showToast(`Fiche de "${pj.name}" exportée en JSON.`);
  };

  const handleExportAllRoster = () => {
    const a = document.createElement('a');
    a.href =
      'data:application/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(playerRoster, null, 2));
    a.download = `Mes_Heros_Chroniques_Oubliees.json`;
    a.click();
    showToast(`Tous vos personnages (${playerRoster.length}) exportés en JSON.`);
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const data = JSON.parse(text);

        // Case 1: Array of characters
        if (Array.isArray(data) && data[0]?.base && data[0]?.name) {
          const formatted = data.map((c, i) => ({
            ...c,
            id: c.id || 'pj_imp_' + Date.now() + '_' + i,
          }));
          setPlayerRoster((prev) => {
            const merged = [...prev, ...formatted];
            try {
              localStorage.setItem('co_player_roster', JSON.stringify(merged));
            } catch {}
            return merged;
          });
          setActivePjId(formatted[0].id);
          setShowRosterHub(false);
          showToast(`${formatted.length} personnages importés avec succès !`);
          return;
        }

        // Case 2: Single character
        if (data.name && data.base) {
          const charWithId = {
            ...data,
            id: data.id || 'pj_' + Date.now(),
          };
          setPlayerRoster((prev) => {
            const exists = prev.findIndex((p) => p.id === charWithId.id || p.name === charWithId.name);
            let updated: Character[];
            if (exists >= 0) {
              updated = [...prev];
              updated[exists] = charWithId;
            } else {
              updated = [...prev, charWithId];
            }
            try {
              localStorage.setItem('co_player_roster', JSON.stringify(updated));
            } catch {}
            return updated;
          });
          setActivePjId(charWithId.id);
          setShowRosterHub(false);
          showToast(`Héros "${charWithId.name}" importé avec succès !`);
          return;
        }

        // Case 3: Master with pjs
        if (data.pjs && Array.isArray(data.pjs)) {
          setPlayerRoster((prev) => {
            const merged = [...prev, ...data.pjs];
            try {
              localStorage.setItem('co_player_roster', JSON.stringify(merged));
            } catch {}
            return merged;
          });
          if (data.pjs[0]?.id) setActivePjId(data.pjs[0].id);
          setShowRosterHub(false);
          showToast(`${data.pjs.length} personnages importés depuis la campagne !`);
          return;
        }

        alert('Format JSON non reconnu pour un personnage Chroniques Oubliées.');
      } catch (err: any) {
        alert('Erreur lors de la lecture du fichier : ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Load MJ table from LocalStorage with full DRS data
  const [tableData, setTableData] = useState(() => {
    try {
      const saved = localStorage.getItem('co_mj_table');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          pjs: parsed.pjs || [SAMPLE_HERO],
          combatants: parsed.combatants || [],
          bestiaire: parsed.bestiaire?.length ? parsed.bestiaire : BESTIAIRE,
          equipements: parsed.equipements?.length ? parsed.equipements : EQUIPEMENTS,
          regles: parsed.regles?.length ? parsed.regles : REGLES,
          etats: parsed.etats?.length ? parsed.etats : ETATS,
          races: parsed.races?.length ? parsed.races : RACES,
          profils: parsed.profils?.length ? parsed.profils : PROFILS,
          sorts: parsed.sorts?.length ? parsed.sorts : SORTS_CATALOG,
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      pjs: [SAMPLE_HERO],
      combatants: [
        {
          id: 'c_init_1',
          n: SAMPLE_HERO.name,
          isPj: true,
          hp: SAMPLE_HERO.hp,
          hpMax: SAMPLE_HERO.hpMaxAuto || 12,
          def: 15,
          baseInit: 12,
          init: 12,
          notes: 'Chevalier Niv. 1',
          pjRefId: SAMPLE_HERO.id,
        },
        {
          id: 'c_init_2',
          n: 'Gobelin éclaireur',
          isPj: false,
          hp: 8,
          hpMax: 8,
          def: 13,
          baseInit: 14,
          init: 14,
          notes: 'Dague +2 (1d4) ou Arc +4 (1d6)',
        },
      ],
      bestiaire: BESTIAIRE,
      equipements: EQUIPEMENTS,
      regles: REGLES,
      etats: ETATS,
      races: RACES,
      profils: PROFILS,
      sorts: SORTS_CATALOG,
    };
  });

  // Persist PJ
  useEffect(() => {
    if (currentPj) {
      try {
        localStorage.setItem('co_pj_local', JSON.stringify(currentPj));
      } catch (e) {
        console.error(e);
      }
    }
  }, [currentPj]);

  // Persist MJ state
  useEffect(() => {
    try {
      localStorage.setItem('co_mj_table', JSON.stringify(tableData));
    } catch (e) {
      console.error(e);
    }
  }, [tableData]);

  // Toast notification auto-dismiss
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showToast = (msg: string) => {
    setNotification(msg);
  };

  // Real-time Live Table Callbacks
  useEffect(() => {
    const unsub = realtimeTable.subscribe({
      onStatusChange: (status, msg) => {
        setLiveStatus(status);
        if (msg) showToast(msg);
      },
      onHeroUpdated: (hero) => {
        setConnectedHeroes((prev) => {
          const idx = prev.findIndex((h) => h.id === hero.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = hero;
            return next;
          }
          return [...prev, hero];
        });
        setTableData((prev: any) => {
          const pjs = [...prev.pjs];
          const idx = pjs.findIndex(
            (p: Character) => (p.id && p.id === hero.id) || p.name.toLowerCase() === hero.name.toLowerCase()
          );
          if (idx >= 0) pjs[idx] = hero;
          else pjs.push(hero);

          const combatants = prev.combatants.map((c: Combatant) => {
            if (c.pjRefId === hero.id || c.n.toLowerCase() === hero.name.toLowerCase()) {
              return { ...c, hp: hero.hp, hpMax: hero.hpMaxAuto || c.hpMax };
            }
            return c;
          });
          return { ...prev, pjs, combatants };
        });
        showToast(`🟢 ${hero.name} mis à jour en direct (${hero.hp} PV) !`);
      },
      onHeroPatchedByDm: (heroId, patch, updatedHero) => {
        if (currentPj && (currentPj.id === heroId || currentPj.name.toLowerCase() === updatedHero.name.toLowerCase())) {
          handleUpdateCurrentPj(updatedHero);
          showToast(`✨ Fiche mise à jour en direct par le Meneur de Jeu !`);
        }
      },
      onPeerJoined: (name, role, hero) => {
        if (hero) {
          setConnectedHeroes((prev) => {
            if (prev.some((h) => h.id === hero.id)) return prev;
            return [...prev, hero];
          });
        }
        showToast(`👋 ${name} a rejoint la table en direct.`);
      },
      onPeerLeft: (name) => {
        showToast(`🚪 ${name} a quitté la table.`);
      },
      // Synchronisation en direct des héros : Joueur (si modifié par MJ) et MJ (si modifié par Joueur)
      onHeroesChanged: (heroesMap) => {
        if (!heroesMap) return;
        const incomingHeroes: Character[] = Object.values(heroesMap).filter(
          (h: any) => h && typeof h === 'object' && h.name
        );

        // 1. Côté Joueur : appliquer en direct les modifications faites par le MJ (PV, PM, états, points de capacité, butin)
        if (appMode === 'pj' && currentPj) {
          const remote = incomingHeroes.find(
            (h) => (h.id && h.id === currentPj.id) || (h.name && h.name.toLowerCase() === currentPj.name.toLowerCase())
          );
          if (remote && (remote.dmPatchAt || 0) > (currentPj.dmPatchAt || 0)) {
            handleUpdateCurrentPj({
              ...currentPj,
              hp: remote.hp,
              pm: remote.pm ?? currentPj.pm,
              ptsCap: remote.ptsCap,
              ptsCapCadeaux: remote.ptsCapCadeaux,
              etats: remote.etats || [],
              inventaire: remote.inventaire || [],
              dmPatchAt: remote.dmPatchAt,
            });
            showToast('✨ Le Meneur de Jeu a mis à jour ta fiche en direct !');
          }
        }

        // 2. Côté Meneur de Jeu (MJ) : appliquer en direct les modifications faites par les Joueurs (PV, PM, états, compétences...)
        if (appMode === 'mj' && incomingHeroes.length > 0) {
          setConnectedHeroes(incomingHeroes);
          setTableData((prev: any) => {
            const pjs = [...prev.pjs];
            let changed = false;

            incomingHeroes.forEach((remoteHero) => {
              const idx = pjs.findIndex(
                (p: Character) =>
                  (remoteHero.id && p.id === remoteHero.id) ||
                  (p.name || '').toLowerCase() === (remoteHero.name || '').toLowerCase()
              );

              if (idx >= 0) {
                const existing = pjs[idx];
                const merged: Character = {
                  ...existing,
                  ...remoteHero,
                  etats: remoteHero.etats !== undefined ? remoteHero.etats : existing.etats,
                };
                if (JSON.stringify(existing) !== JSON.stringify(merged)) {
                  pjs[idx] = merged;
                  changed = true;
                }
              } else {
                pjs.push(remoteHero);
                changed = true;
              }
            });

            if (!changed) return prev;

            const combatants = prev.combatants.map((c: Combatant) => {
              const match = incomingHeroes.find(
                (h) => (h.id && c.pjRefId === h.id) || (h.name && c.n.toLowerCase().startsWith(h.name.toLowerCase()))
              );
              if (match) {
                return {
                  ...c,
                  hp: match.hp,
                  hpMax: match.hpMaxAuto || match.hpMaxManual || c.hpMax,
                  etats: match.etats || c.etats || [],
                };
              }
              return c;
            });

            return { ...prev, pjs, combatants };
          });
        }
      },
      onRoomState: (state) => {
        if (state && Array.isArray(state.heroes)) {
          setConnectedHeroes(state.heroes);
          if (appMode === 'mj' && state.heroes.length > 0) {
            setTableData((prev: any) => {
              const pjs = [...prev.pjs];
              state.heroes.forEach((h: Character) => {
                const idx = pjs.findIndex((p: Character) => p.id === h.id || p.name.toLowerCase() === h.name.toLowerCase());
                if (idx >= 0) pjs[idx] = h;
                else pjs.push(h);
              });
              return { ...prev, pjs };
            });
          }
        }
      },
    });
    return () => {
      unsub();
    };
  }, [currentPj, appMode]);

  // Connexion automatique à la table mémorisée ou reçue par lien (?table=CODE) : sans ça, personne n'est connecté
  useEffect(() => {
    if (liveRoomCode && !realtimeTable.room) {
      realtimeTable.connect(liveRoomCode, appMode, currentPj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Joueur : publier sa fiche dès que la connexion est établie, et quand le héros actif change
  useEffect(() => {
    if (appMode === 'pj' && liveStatus === 'connected' && currentPj) {
      realtimeTable.updateHero(currentPj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appMode, liveStatus, currentPj?.id]);

  // Persist live room code and auto-connect if URL parameter provided
  useEffect(() => {
    try {
      if (liveRoomCode) {
        localStorage.setItem('cof_live_room', liveRoomCode);
      } else {
        localStorage.removeItem('cof_live_room');
      }
    } catch {}
  }, [liveRoomCode]);

  // Sync PJ into MJ table
  const handleSendPjToMj = () => {
    if (!currentPj) return;
    const pjs = [...tableData.pjs];
    const idx = pjs.findIndex(
      (p) => (p.id && p.id === currentPj.id) || p.name.toLowerCase() === currentPj.name.toLowerCase()
    );

    if (idx >= 0) {
      pjs[idx] = { ...currentPj };
      showToast(`Héros "${currentPj.name}" actualisé dans la table MJ !`);
    } else {
      pjs.push({ ...currentPj });
      showToast(`Héros "${currentPj.name}" ajouté à l'équipe MJ !`);
    }

    setTableData({ ...tableData, pjs });
  };

  // Global Drag & Drop for JSON files
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer?.files;
      if (!files || !files.length) return;

      Array.from(files).forEach((file) => {
        if (!file.name.endsWith('.json')) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const data = JSON.parse(ev.target?.result as string);
            if (data.name && data.base) {
              // Character sheet JSON
              handleAddCharacter(data);
            } else if (data.combatants && data.pjs) {
              // Full MJ campaign master
              setTableData((prev) => ({ ...prev, ...data }));
              showToast('Campagne Master MJ chargée avec succès !');
            } else if (Array.isArray(data) && data[0]?.nc !== undefined) {
              // Bestiary
              setTableData((prev) => ({ ...prev, bestiaire: data }));
              showToast(`${data.length} créatures ajoutées au Bestiaire !`);
            }
          } catch (err) {
            console.error('Erreur lecture JSON', err);
          }
        };
        reader.readAsText(file);
      });
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);
    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  // Download Offline Standalone MJ HTML App (100% pre-chargé avec toutes les données)
  const handleDownloadOfflineMjHtml = async () => {
    try {
      const res = await fetch('/assets/aistudio/ai_studio_code_a33982d1.html');
      const htmlText = await res.text();
      const fullExportPayload = {
        pjs: tableData.pjs || [],
        combatants: tableData.combatants || [],
        bestiaire: isTharneaActive ? [...BESTIAIRE, ...THARNEA_MONSTERS] : BESTIAIRE,
        equipements: isTharneaActive ? [...EQUIPEMENTS, ...THARNEA_ARTIFACTS] : EQUIPEMENTS,
        regles: REGLES,
        etats: ETATS,
        races: RACES,
        profils: PROFILS,
        voies: Object.values(VOIES_CATALOG),
        sorts: SORTS_CATALOG,
      };

      let injectedHtml = htmlText.replace(
        /let tableData = LS\.get\("co_mj_table",\s*\{[\s\S]*?\}\);/,
        `let tableData = ${JSON.stringify(fullExportPayload)};`
      );
      if (injectedHtml === htmlText) {
        injectedHtml = htmlText.replace(
          'let tableData = LS.get("co_mj_table", {',
          `let tableData = ${JSON.stringify(fullExportPayload)}; // pre-injected\nlet _dummy = ({`
        );
      }

      const blob = new Blob([injectedHtml], { type: 'text/html;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `Console_MJ_Chroniques_Oubliees_Complete_Offline.html`;
      a.click();
      showToast('📥 Application Meneur de Jeu autonome téléchargée !');
    } catch (err: any) {
      alert('Erreur lors du téléchargement : ' + (err?.message || String(err)));
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0d0b] text-[#ede3d1] flex flex-col font-sans">
      {/* Top Header */}
      <Header
        appMode={appMode}
        setAppMode={handleModeChange}
        onOpenDiceRoller={() => setIsDiceRollerOpen(true)}
        currentPj={currentPj}
        onSendPjToMj={handleSendPjToMj}
        pjsCountInMj={tableData.pjs.length}
        isTharneaActive={isTharneaActive}
        onToggleTharnea={handleToggleTharnea}
        isMjAuthorized={isMjAuthorized}
        onPromptUnlockMj={() => setIsMjPasswordModalOpen(true)}
        onCopyLink={handleCopyLink}
        onLockToPj={handleLockToPj}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenRoster={() => setShowRosterHub(true)}
        rosterCount={playerRoster.length}
        onOpenLiveTable={() => setIsLiveTableOpen(true)}
        liveStatus={liveStatus}
        liveRoomCode={liveRoomCode}
      />

      {/* Toast Notification Banner */}
      {notification && (
        <div className="no-print fixed top-16 right-4 z-50 bg-[#291712] border border-[#d4a84a] text-[#f3d48d] px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span>✨</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 p-3 sm:p-5 max-w-7xl w-full mx-auto pb-16">
        {appMode === 'pj' ? (
          !currentPj || showRosterHub ? (
            <CharacterRosterHub
              roster={playerRoster}
              activePjId={activePjId}
              onSelectPj={handleSelectPj}
              onOpenWizard={() => setIsWizardOpen(true)}
              onImportJson={handleImportJsonFile}
              onDeletePj={handleDeletePj}
              onExportPj={handleExportSinglePj}
              onExportAllRoster={handleExportAllRoster}
              onDuplicatePj={handleDuplicatePj}
            />
          ) : (
            <PjSheet
              pj={currentPj}
              onUpdatePj={handleUpdateCurrentPj}
              onOpenWizard={() => setIsWizardOpen(true)}
              onSendToMjTable={handleSendPjToMj}
              isTharneaActive={isTharneaActive}
              onSwitchHero={() => setShowRosterHub(true)}
              rosterCount={playerRoster.length}
              onDeletePj={handleDeletePj}
            />
          )
        ) : (
          <MjConsole
            tableData={tableData}
            onUpdateTableData={(updated) => {
              if (liveStatus === 'connected' && appMode === 'mj') {
                const now = Date.now();
                updated.pjs.forEach((p: Character) => {
                  const old = tableData.pjs.find(
                    (o: Character) => (o.id && o.id === p.id) || (o.name || '').toLowerCase() === (p.name || '').toLowerCase()
                  );
                  if (!old || JSON.stringify(old) !== JSON.stringify(p)) {
                    realtimeTable.updateHero({ ...p, dmPatchAt: now });
                  }
                });
                if (JSON.stringify(updated.combatants) !== JSON.stringify(tableData.combatants)) {
                  realtimeTable.syncCombat(updated.combatants);
                }
              }
              setTableData(updated);
            }}
            currentActivePj={currentPj}
            onImportActivePj={handleSendPjToMj}
            isTharneaActive={isTharneaActive}
          />
        )}
      </main>

      {/* Footer credits */}
      <footer className="no-print border-t border-[#3d3023]/60 bg-[#120f0c] py-3 px-4 text-center text-[11px] text-[#9e907d]">
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-2">
          <p>
            Chroniques Oubliées Fantasy est un jeu de rôle de Black Book Éditions.
            Contenus sous licence libre OGL consultables sur{' '}
            <a
              href="https://www.co-drs.org/fr"
              target="_blank"
              rel="noreferrer"
              className="text-[#d4a84a] hover:underline"
            >
              co-drs.org
            </a>
            . Compagnon PJ &amp; Console MJ optimisés pour table physique et virtuelle.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            {!isMjAuthorized ? (
              <button
                type="button"
                onClick={() => setIsMjPasswordModalOpen(true)}
                className="text-[10px] text-[#4d3d2e] hover:text-[#9e907d] transition-colors cursor-pointer"
                title="Accès réservé au Meneur de Jeu"
              >
                🔒 Accès MJ
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLockToPj}
                className="text-[10px] text-[#854d31] hover:text-[#d4a84a] transition-colors cursor-pointer"
                title="Masquer la Console MJ pour repasser en vue joueur"
              >
                🔒 Verrouiller MJ
              </button>
            )}
            <span className="text-[10px] text-[#6d5e4b] font-mono tracking-wider select-none">
              Doudou, F.P
            </span>
          </div>
        </div>
      </footer>

      {/* Character Creation Wizard Modal */}
      <PjCreationWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onCharacterCreated={(newChar) => {
          handleAddCharacter(newChar);
        }}
      />

      {/* Virtual Dice Roller Modal */}
      <DiceRoller
        isOpen={isDiceRollerOpen}
        onClose={() => setIsDiceRollerOpen(false)}
      />

      {/* Share & Deployment Links Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        isMjAuthorized={isMjAuthorized}
        onDownloadOfflineMjHtml={handleDownloadOfflineMjHtml}
      />

      {/* MJ Password Authentication Modal */}
      <MjPasswordModal
        isOpen={isMjPasswordModalOpen}
        onClose={() => setIsMjPasswordModalOpen(false)}
        onSuccess={handlePasswordSuccess}
      />

      {/* Real-time Live Table Modal */}
      <LiveTableModal
        isOpen={isLiveTableOpen}
        onClose={() => setIsLiveTableOpen(false)}
        appMode={appMode}
        currentPj={currentPj}
        onUpdatePj={handleUpdateCurrentPj}
        liveRoomCode={liveRoomCode}
        setLiveRoomCode={setLiveRoomCode}
        liveStatus={liveStatus}
        connectedHeroes={connectedHeroes}
        showToast={showToast}
      />
    </div>
  );
}
