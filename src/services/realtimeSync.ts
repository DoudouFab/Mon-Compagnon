import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, update, get, remove, onDisconnect } from "firebase/database";
import { Character, Combatant } from '../types/chroniques';

export type LiveConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface TableLiveEventCallbacks {
  onStatusChange?: (status: LiveConnectionStatus, msg?: string) => void;
  onHeroUpdated?: (hero: Character) => void;
  onHeroPatchedByDm?: (heroId: string, patch: Partial<Character>, hero: Character) => void;
  onCombatUpdated?: (combatants: Combatant[]) => void;
  onDiceRolled?: (roll: any) => void;
  onPeerJoined?: (clientName: string, role: string, hero?: Character) => void;
  onPeerLeft?: (clientName: string, role: string) => void;
  onRoomState?: (state: any) => void;
  onHeroesChanged?: (heroesMap: Record<string, Character>) => void;
}

// Configuration Firebase intégrée avec vos identifiants
const firebaseConfig = {
  apiKey: "AIzaSyAPBHhNIAN4XfV0ApCgvxTsxNsHAEZE-wU",
  authDomain: "mon-compagnon-jdr-by-doudou.firebaseapp.com",
  databaseURL: "https://mon-compagnon-jdr-by-doudou-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mon-compagnon-jdr-by-doudou",
  storageBucket: "mon-compagnon-jdr-by-doudou.firebasestorage.app",
  messagingSenderId: "1060857747832",
  appId: "1:1060857747832:web:a152f52cd7605df734d08d",
  measurementId: "G-7JRC2QNJRL"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Firebase refuse les valeurs "undefined" : on nettoie la fiche avant écriture.
const clean = <T,>(o: T): T => JSON.parse(JSON.stringify(o));
// Clé stable d'un héros dans la base (certains personnages n'ont pas d'id).
const heroKey = (h: Character): string =>
  h.id || 'h_' + (h.name || 'sans_nom').toLowerCase().replace(/[^a-z0-9]+/g, '_');

// Normalise les états reçus de Firebase (Firebase RTDB supprime les clés dont la valeur est un tableau vide [])
export const normalizeEtats = (etats: any): string[] => {
  if (!etats) return [];
  if (Array.isArray(etats)) return etats.filter((x): x is string => typeof x === 'string' && !!x.trim());
  if (typeof etats === 'object') return Object.values(etats).filter((x): x is string => typeof x === 'string' && !!x.trim());
  return [];
};

// Normalise un héros pour s'assurer que etats, inventaire, armes, etc. sont toujours des tableaux valides
export const normalizeHero = (h: any): Character => {
  if (!h || typeof h !== 'object') return h;
  return {
    ...h,
    etats: normalizeEtats(h.etats),
    inventaire: Array.isArray(h.inventaire) ? h.inventaire : h.inventaire ? Object.values(h.inventaire) : [],
    armes: Array.isArray(h.armes) ? h.armes : h.armes ? Object.values(h.armes) : [],
    customSorts: Array.isArray(h.customSorts) ? h.customSorts : h.customSorts ? Object.values(h.customSorts) : [],
    caps: Array.isArray(h.caps) ? h.caps : h.caps ? Object.values(h.caps) : [],
  };
};

class RealtimeTableManager {
  private currentRoom: string = '';
  private currentRole: 'mj' | 'pj' = 'pj';
  private listeners: Set<TableLiveEventCallbacks> = new Set();
  private cachedHero: Character | null = null;
  private dbUnsubscribe: (() => void) | null = null;
  private presenceUnsub: (() => void) | null = null;
  private knownHeroKeys = new Set<string>();

  public get room(): string {
    return this.currentRoom;
  }

  public get role(): 'mj' | 'pj' {
    return this.currentRole;
  }

  public subscribe(cbs: TableLiveEventCallbacks): () => void {
    this.listeners.add(cbs);
    return () => {
      this.listeners.delete(cbs);
    };
  }

  public setCallbacks(cbs: TableLiveEventCallbacks) {
    this.listeners.add(cbs);
  }

  public removeCallbacks(cbs: TableLiveEventCallbacks) {
    this.listeners.delete(cbs);
  }

  private emit<K extends keyof TableLiveEventCallbacks>(
    key: K,
    ...args: Parameters<NonNullable<TableLiveEventCallbacks[K]>>
  ) {
    for (const listener of Array.from(this.listeners)) {
      const fn = listener[key] as any;
      if (typeof fn === 'function') {
        try {
          fn(...args);
        } catch (err) {
          console.error(`[RealtimeSync emit error on ${String(key)}]`, err);
        }
      }
    }
  }

  public connect(roomCode: string, role: 'mj' | 'pj', hero?: Character | null) {
    const code = roomCode.trim().toUpperCase();
    if (!code) return;

    this.currentRoom = code;
    this.currentRole = role;
    this.cachedHero = hero || null;

    // Nettoyer une éventuelle écoute précédente
    if (this.dbUnsubscribe) {
      this.dbUnsubscribe();
      this.dbUnsubscribe = null;
    }
    this.stopPresence();
    this.knownHeroKeys = new Set<string>();

    this.emit('onStatusChange', 'connecting', `Connexion à la table ${code}...`);

    try {
      const roomRef = ref(db, 'tables/' + this.currentRoom);

      // S'inscrire aux changements en temps réel sur Firebase
      const unsubscribe = onValue(roomRef, (snapshot) => {
        const roomData = snapshot.val();
        this.emit('onStatusChange', 'connected', `Connecté en direct à la table ${code}`);

        // Normaliser les héros reçus de Firebase (garantit etats: [], inventaire: [], etc.)
        const rawHeroes = (roomData && roomData.heroes) || {};
        const normalizedHeroesMap: Record<string, Character> = {};
        Object.entries(rawHeroes).forEach(([k, h]: [string, any]) => {
          if (h && typeof h === 'object') {
            normalizedHeroesMap[k] = normalizeHero(h);
          }
        });

        // Toujours prévenir l'interface, même salle vide : le MJ voit ainsi « 0 joueur en ligne ».
        this.emit('onHeroesChanged', normalizedHeroesMap);

        if (roomData) {
          const normalizedRoomData = {
            ...roomData,
            heroes: Object.values(normalizedHeroesMap),
          };
          this.emit('onRoomState', normalizedRoomData);

          // Le MJ est averti une seule fois par nouveau héros (et non à chaque mise à jour de la salle)
          if (roomData.heroes && this.currentRole === 'mj') {
            Object.entries(normalizedHeroesMap).forEach(([k, h]) => {
              if (h && h.name && !this.knownHeroKeys.has(k)) {
                this.knownHeroKeys.add(k);
                this.emit('onPeerJoined', h.name, 'pj', h);
              }
            });
          }

          // Si un nouveau dé a été lancé par quelqu'un d'autre
          if (roomData.lastRoll) {
            this.emit('onDiceRolled', roomData.lastRoll);
          }

          // Si le combat a été mis à jour
          if (roomData.combatants) {
            this.emit('onCombatUpdated', roomData.combatants);
          }
        }
      }, (error) => {
        console.error('[Firebase Sync Error]', error);
        this.emit('onStatusChange', 'error', 'Liaison serveur indisponible.');
      });

      this.dbUnsubscribe = unsubscribe; // onValue renvoie directement la fonction de désabonnement

      // Joueur : publier sa fiche dès la connexion (présence « en ligne »)
      if (this.currentRole === 'pj') this.startPresence();

      // Annoncer l'arrivée du pair (MJ ou PJ) dans la salle
      const clientName = this.cachedHero?.name || (this.currentRole === 'mj' ? 'Meneur de Jeu' : 'Joueur');
      this.emit('onPeerJoined', clientName, this.currentRole, this.cachedHero || undefined);

    } catch (err: any) {
      this.emit('onStatusChange', 'error', err?.message || 'Erreur de connexion');
    }
  }

  // Publie la fiche du joueur à la connexion, la retire s'il part, et la republie après une coupure réseau.
  private startPresence() {
    this.stopPresence();
    const hero = this.cachedHero;
    if (!hero || !this.currentRoom) return;
    const heroRef = ref(db, `tables/${this.currentRoom}/heroes/${heroKey(hero)}`);
    this.presenceUnsub = onValue(ref(db, '.info/connected'), (snap) => {
      if (snap.val() === true && this.cachedHero) {
        onDisconnect(heroRef)
          .remove()
          .then(() => set(heroRef, clean(this.cachedHero)))
          .catch((e) => console.error('[Firebase Presence Error]', e));
      }
    });
  }

  private stopPresence() {
    if (this.presenceUnsub) {
      this.presenceUnsub();
      this.presenceUnsub = null;
    }
  }

  public disconnect() {
    if (this.dbUnsubscribe) {
      this.dbUnsubscribe();
      this.dbUnsubscribe = null;
    }
    this.stopPresence();
    if (this.currentRole === 'pj' && this.cachedHero && this.currentRoom) {
      remove(ref(db, `tables/${this.currentRoom}/heroes/${heroKey(this.cachedHero)}`)).catch(() => {});
    }
    const clientName = this.cachedHero?.name || (this.currentRole === 'mj' ? 'Meneur de Jeu' : 'Joueur');
    this.emit('onPeerLeft', clientName, this.currentRole);

    this.currentRoom = '';
    this.emit('onStatusChange', 'disconnected', 'Déconnecté');
  }

  public send(payload: any) {
    if (!this.currentRoom) return;
    
    // Méthode utilitaire générique pour envoyer des données sur Firebase
    const roomRef = ref(db, 'tables/' + this.currentRoom);
    update(roomRef, {
      [payload.type]: payload,
      lastUpdate: Date.now()
    }).catch((e) => {
      console.error('[Firebase Send Error]', e);
    });
  }

  // Action methods adaptées pour Firebase
  public updateHero(hero: Character) {
    this.cachedHero = hero;
    if (!this.currentRoom) return;

    const heroRef = ref(db, `tables/${this.currentRoom}/heroes/${heroKey(hero)}`);
    set(heroRef, clean(hero)).then(() => {
      this.emit('onHeroUpdated', hero);
    }).catch(err => console.error(err));
    if (this.currentRole === 'pj' && !this.presenceUnsub) this.startPresence();
  }

  public dmPatchHero(heroId: string, patch: Partial<Character>) {
    if (!this.currentRoom) return;

    const heroRef = ref(db, `tables/${this.currentRoom}/heroes/${heroId}`);
    update(heroRef, patch).then(async () => {
      // Récupérer le héro mis à jour pour déclencher le callback
      const snapshot = await get(heroRef);
      if (snapshot.exists()) {
        const updatedHero = normalizeHero(snapshot.val());
        this.emit('onHeroPatchedByDm', heroId, patch, updatedHero);
      }
    }).catch(err => console.error(err));
  }

  public syncCombat(combatants: Combatant[]) {
    if (!this.currentRoom) return;

    const combatRef = ref(db, `tables/${this.currentRoom}/combatants`);
    set(combatRef, combatants).then(() => {
      this.emit('onCombatUpdated', combatants);
    }).catch(err => console.error(err));
  }

  public rollDice(roll: any) {
    if (!this.currentRoom) return;

    const roomRef = ref(db, 'tables/' + this.currentRoom);
    update(roomRef, {
      lastRoll: { ...roll, timestamp: Date.now() }
    }).then(() => {
      this.emit('onDiceRolled', roll);
    }).catch(err => console.error(err));
  }
}

export const realtimeTable = new RealtimeTableManager();
