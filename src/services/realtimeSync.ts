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

class RealtimeTableManager {
  private currentRoom: string = '';
  private currentRole: 'mj' | 'pj' = 'pj';
  private callbacks: TableLiveEventCallbacks = {};
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

  public setCallbacks(cbs: TableLiveEventCallbacks) {
    this.callbacks = { ...this.callbacks, ...cbs };
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

    this.callbacks.onStatusChange?.('connecting', `Connexion à la table ${code}...`);

    try {
      const roomRef = ref(db, 'tables/' + this.currentRoom);

      // S'inscrire aux changements en temps réel sur Firebase
      const unsubscribe = onValue(roomRef, (snapshot) => {
        const roomData = snapshot.val();
        this.callbacks.onStatusChange?.('connected', `Connecté en direct à la table ${code}`);

        // Toujours prévenir l'interface, même salle vide : le MJ voit ainsi « 0 joueur en ligne ».
        this.callbacks.onHeroesChanged?.((roomData && roomData.heroes) || {});

        if (roomData) {
          this.callbacks.onRoomState?.(roomData);

          // Le MJ est averti une seule fois par nouveau héros (et non à chaque mise à jour de la salle)
          if (roomData.heroes && this.currentRole === 'mj') {
            Object.entries(roomData.heroes).forEach(([k, h]: [string, any]) => {
              if (h && h.name && !this.knownHeroKeys.has(k)) {
                this.knownHeroKeys.add(k);
                this.callbacks.onPeerJoined?.(h.name, 'pj', h);
              }
            });
          }

          // Si un nouveau dé a été lancé par quelqu'un d'autre
          if (roomData.lastRoll) {
            this.callbacks.onDiceRolled?.(roomData.lastRoll);
          }

          // Si le combat a été mis à jour
          if (roomData.combatants) {
            this.callbacks.onCombatUpdated?.(roomData.combatants);
          }
        }
      }, (error) => {
        console.error('[Firebase Sync Error]', error);
        this.callbacks.onStatusChange?.('error', 'Liaison serveur indisponible.');
      });

      this.dbUnsubscribe = unsubscribe; // onValue renvoie directement la fonction de désabonnement

      // Joueur : publier sa fiche dès la connexion (présence « en ligne »)
      if (this.currentRole === 'pj') this.startPresence();

      // Annoncer l'arrivée du pair (MJ ou PJ) dans la salle
      const clientName = this.cachedHero?.name || (this.currentRole === 'mj' ? 'Meneur de Jeu' : 'Joueur');
      this.callbacks.onPeerJoined?.(clientName, this.currentRole, this.cachedHero || undefined);

    } catch (err: any) {
      this.callbacks.onStatusChange?.('error', err?.message || 'Erreur de connexion');
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
    this.callbacks.onPeerLeft?.(clientName, this.currentRole);

    this.currentRoom = '';
    this.callbacks.onStatusChange?.('disconnected', 'Déconnecté');
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
      this.callbacks.onHeroUpdated?.(hero);
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
        const updatedHero = snapshot.val();
        this.callbacks.onHeroPatchedByDm?.(heroId, patch, updatedHero);
      }
    }).catch(err => console.error(err));
  }

  public syncCombat(combatants: Combatant[]) {
    if (!this.currentRoom) return;

    const combatRef = ref(db, `tables/${this.currentRoom}/combatants`);
    set(combatRef, combatants).then(() => {
      this.callbacks.onCombatUpdated?.(combatants);
    }).catch(err => console.error(err));
  }

  public rollDice(roll: any) {
    if (!this.currentRoom) return;

    const roomRef = ref(db, 'tables/' + this.currentRoom);
    update(roomRef, {
      lastRoll: { ...roll, timestamp: Date.now() }
    }).then(() => {
      this.callbacks.onDiceRolled?.(roll);
    }).catch(err => console.error(err));
  }
}

export const realtimeTable = new RealtimeTableManager();
