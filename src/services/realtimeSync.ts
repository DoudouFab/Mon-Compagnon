import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, off, update, get } from "firebase/database";
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

class RealtimeTableManager {
  private currentRoom: string = '';
  private currentRole: 'mj' | 'pj' = 'pj';
  private callbacks: TableLiveEventCallbacks = {};
  private cachedHero: Character | null = null;
  private dbUnsubscribe: (() => void) | null = null;

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

    this.callbacks.onStatusChange?.('connecting', `Connexion à la table ${code}...`);

    try {
      const roomRef = ref(db, 'tables/' + this.currentRoom);

      // S'inscrire aux changements en temps réel sur Firebase
      const unsubscribe = onValue(roomRef, (snapshot) => {
        const roomData = snapshot.val();
        this.callbacks.onStatusChange?.('connected', `Connecté en direct à la table ${code}`);

        if (roomData) {
          this.callbacks.onRoomState?.(roomData);

          // Si des héros sont présents dans la salle, on prévient l'interface (pour le MJ)
          if (roomData.heroes) {
            this.callbacks.onHeroesChanged?.(roomData.heroes);
            
            // Optionnel : si le client connecté est le MJ, on peut notifier l'arrivée/MAJ de chaque héros
            if (this.currentRole === 'mj') {
              Object.values(roomData.heroes).forEach((h: any) => {
                if (h && h.name) {
                  this.callbacks.onPeerJoined?.(h.name, 'pj', h);
                }
              });
            }
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

      this.dbUnsubscribe = () => off(roomRef, 'value', unsubscribe);

      // Annoncer l'arrivée du pair (MJ ou PJ) dans la salle
      const clientName = this.cachedHero?.name || (this.currentRole === 'mj' ? 'Meneur de Jeu' : 'Joueur');
      this.callbacks.onPeerJoined?.(clientName, this.currentRole, this.cachedHero || undefined);

    } catch (err: any) {
      this.callbacks.onStatusChange?.('error', err?.message || 'Erreur de connexion');
    }
  }

  public disconnect() {
    if (this.dbUnsubscribe) {
      this.dbUnsubscribe();
      this.dbUnsubscribe = null;
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

    const heroRef = ref(db, `tables/${this.currentRoom}/heroes/${hero.id}`);
    set(heroRef, hero).then(() => {
      this.callbacks.onHeroUpdated?.(hero);
    }).catch(err => console.error(err));
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
