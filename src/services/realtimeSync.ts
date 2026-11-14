import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, update, get, remove, onDisconnect } from "firebase/database";
import { Character, Combatant, TableFeedEntry } from '../types/chroniques';
import { sanitizeCharacter } from '../utils/characterSanitizer';

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
  onFeedUpdated?: (entries: TableFeedEntry[]) => void;
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
const clean = <T,>(o: T): T => (o === undefined ? (null as unknown as T) : JSON.parse(JSON.stringify(o)));
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

// Normalise un héros pour s'assurer que base, rb, etats, inventaire, armes, etc. sont toujours valides
export const normalizeHero = (h: any): Character => {
  if (!h || typeof h !== 'object') return h;
  return sanitizeCharacter(h);
};

class RealtimeTableManager {
  private currentRoom: string = '';
  private currentRole: 'mj' | 'pj' = 'pj';
  private listeners: Set<TableLiveEventCallbacks> = new Set();
  private cachedHero: Character | null = null;
  private dbUnsubscribe: (() => void) | null = null;
  private presenceUnsub: (() => void) | null = null;
  private knownHeroKeys = new Set<string>();
  private lastStatus: LiveConnectionStatus = 'disconnected';
  private lastHeroesMap: Record<string, Character> = {};
  private lastHeroesJson: string = '';
  private lastCombatJson: string = '';
  private lastRollTimestamp: number = 0;
  private lastWrittenHeroByKey: Map<string, string> = new Map();
  private lastFeed: TableFeedEntry[] = [];
  private lastFeedJson: string = '';

  public get room(): string {
    return this.currentRoom;
  }

  public get role(): 'mj' | 'pj' {
    return this.currentRole;
  }

  public getLastHeroes(): Character[] {
    return Object.values(this.lastHeroesMap);
  }

  public getLastFeed(): TableFeedEntry[] {
    return this.lastFeed;
  }

  public setRole(role: 'mj' | 'pj', hero?: Character | null) {
    this.currentRole = role;
    if (hero !== undefined) this.cachedHero = hero;
    if (!this.currentRoom) return;
    if (role === 'pj') {
      if (!this.presenceUnsub && this.cachedHero) this.startPresence();
    } else {
      this.stopPresence();
    }
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

  private setStatus(status: LiveConnectionStatus, msg?: string) {
    if (this.lastStatus === status) return;
    this.lastStatus = status;
    this.emit('onStatusChange', status, msg);
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

    // Éviter de reconnecter inutilement si déjà connecté à la même salle avec le même rôle
    if (this.currentRoom === code && this.currentRole === role && this.dbUnsubscribe) {
      if (hero) this.cachedHero = hero;
      return;
    }

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
    this.lastHeroesMap = {};
    this.lastHeroesJson = '';
    this.lastCombatJson = '';
    this.lastRollTimestamp = 0;
    this.lastWrittenHeroByKey.clear();
    this.lastFeed = [];
    this.lastFeedJson = '';

    this.setStatus('connecting', `Connexion à la table ${code}...`);

    try {
      const roomRef = ref(db, 'tables/' + this.currentRoom);

      // S'inscrire aux changements en temps réel sur Firebase
      const unsubscribe = onValue(roomRef, (snapshot) => {
        const roomData = snapshot.val();
        this.setStatus('connected', `Connecté en direct à la table ${code}`);

        // Normaliser les héros reçus de Firebase (garantit etats: [], inventaire: [], etc.)
        const rawHeroes = (roomData && roomData.heroes) || {};
        const normalizedHeroesMap: Record<string, Character> = {};
        Object.entries(rawHeroes).forEach(([k, h]: [string, any]) => {
          if (h && typeof h === 'object') {
            normalizedHeroesMap[k] = normalizeHero(h);
          }
        });

        const heroesJson = JSON.stringify(normalizedHeroesMap);
        if (heroesJson !== this.lastHeroesJson) {
          this.lastHeroesJson = heroesJson;
          this.lastHeroesMap = normalizedHeroesMap;

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
          }
        }

        if (roomData) {
          // Si un nouveau dé a été lancé par quelqu'un d'autre
          if (roomData.lastRoll && roomData.lastRoll.timestamp !== this.lastRollTimestamp) {
            this.lastRollTimestamp = roomData.lastRoll.timestamp || 0;
            this.emit('onDiceRolled', roomData.lastRoll);
          }

          // Si le combat a été mis à jour
          if (roomData.combatants) {
            const combatJson = JSON.stringify(roomData.combatants);
            if (combatJson !== this.lastCombatJson) {
              this.lastCombatJson = combatJson;
              this.emit('onCombatUpdated', roomData.combatants);
            }
          }

          // Historique des notifications et messages (MJ <-> PJ)
          const rawFeed = roomData.feed && typeof roomData.feed === 'object' ? Object.values(roomData.feed) : [];
          const normalizedFeed = (rawFeed as any[])
            .filter((item) => item && typeof item === 'object' && item.id && item.summary)
            .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
            .slice(-200) as TableFeedEntry[];
          const feedJson = JSON.stringify(normalizedFeed);
          if (feedJson !== this.lastFeedJson) {
            this.lastFeedJson = feedJson;
            this.lastFeed = normalizedFeed;
            this.emit('onFeedUpdated', normalizedFeed);
          }
        } else if (this.lastFeedJson !== '[]') {
          this.lastFeedJson = '[]';
          this.lastFeed = [];
          this.emit('onFeedUpdated', []);
        }
      }, (error) => {
        console.error('[Firebase Sync Error]', error);
        this.setStatus('error', 'Liaison serveur indisponible.');
      });

      this.dbUnsubscribe = unsubscribe; // onValue renvoie directement la fonction de désabonnement

      // Joueur : publier sa fiche dès la connexion (présence « en ligne »)
      if (this.currentRole === 'pj') this.startPresence();

      // Annoncer l'arrivée du pair (MJ ou PJ) dans la salle
      const clientName = this.cachedHero?.name || (this.currentRole === 'mj' ? 'Meneur de Jeu' : 'Joueur');
      this.emit('onPeerJoined', clientName, this.currentRole, this.cachedHero || undefined);

    } catch (err: any) {
      this.setStatus('error', err?.message || 'Erreur de connexion');
    }
  }

  // Publie la fiche du joueur à la connexion, la retire s'il part, et la republie après une coupure réseau.
  private startPresence() {
    this.stopPresence();
    const hero = this.cachedHero;
    if (!hero || !this.currentRoom) return;
    const key = heroKey(hero);
    const heroRef = ref(db, `tables/${this.currentRoom}/heroes/${key}`);
    this.presenceUnsub = onValue(ref(db, '.info/connected'), (snap) => {
      if (snap.val() === true && this.cachedHero) {
        const cleaned = clean(this.cachedHero);
        this.lastWrittenHeroByKey.set(key, JSON.stringify(cleaned));
        onDisconnect(heroRef)
          .remove()
          .then(() => set(heroRef, cleaned))
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
    this.lastHeroesMap = {};
    this.lastHeroesJson = '';
    this.lastCombatJson = '';
    this.lastRollTimestamp = 0;
    this.lastWrittenHeroByKey.clear();
    this.lastFeed = [];
    this.lastFeedJson = '';
    this.setStatus('disconnected', 'Déconnecté');
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

    const key = heroKey(hero);
    const cleaned = clean(hero);
    const serialized = JSON.stringify(cleaned);

    // Ignorer si les données exactes viennent déjà d'être écrites ou reçues
    if (this.lastWrittenHeroByKey.get(key) === serialized) return;
    const existingRemote = this.lastHeroesMap[key];
    if (existingRemote && JSON.stringify(clean(existingRemote)) === serialized) return;

    this.lastWrittenHeroByKey.set(key, serialized);
    const heroRef = ref(db, `tables/${this.currentRoom}/heroes/${key}`);
    set(heroRef, cleaned).catch(err => console.error(err));
    if (this.currentRole === 'pj' && !this.presenceUnsub) this.startPresence();
  }

  public dmPatchHero(heroId: string, patch: Partial<Character>) {
    if (!this.currentRoom) return;

    const heroRef = ref(db, `tables/${this.currentRoom}/heroes/${heroId}`);
    update(heroRef, clean(patch)).then(async () => {
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

    const cleaned = clean(combatants);
    const combatJson = JSON.stringify(cleaned);
    if (combatJson === this.lastCombatJson) return;
    this.lastCombatJson = combatJson;

    const combatRef = ref(db, `tables/${this.currentRoom}/combatants`);
    set(combatRef, cleaned).catch(err => console.error(err));
  }

  public rollDice(roll: any) {
    if (!this.currentRoom) return;

    const ts = Date.now();
    this.lastRollTimestamp = ts;
    const roomRef = ref(db, 'tables/' + this.currentRoom);
    update(roomRef, {
      lastRoll: clean({ ...roll, timestamp: ts })
    }).catch(err => console.error(err));
  }

  public sendFeedEntry(entry: TableFeedEntry) {
    if (!this.currentRoom || !entry?.id) return;
    const entryRef = ref(db, `tables/${this.currentRoom}/feed/${entry.id}`);
    set(entryRef, clean(entry)).catch((err) => console.error('[Firebase Feed Error]', err));
  }

  public clearFeed() {
    if (!this.currentRoom) return;
    const feedRef = ref(db, `tables/${this.currentRoom}/feed`);
    remove(feedRef).catch((err) => console.error('[Firebase Clear Feed Error]', err));
  }
}

export const realtimeTable = new RealtimeTableManager();
