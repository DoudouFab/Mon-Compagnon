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
}

class RealtimeTableManager {
  private ws: WebSocket | null = null;
  private currentRoom: string = '';
  private currentRole: 'mj' | 'pj' = 'pj';
  private callbacks: TableLiveEventCallbacks = {};
  private reconnectTimer: any = null;
  private isIntentionalDisconnect: boolean = false;
  private cachedHero: Character | null = null;

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
    this.isIntentionalDisconnect = false;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
    }

    this.callbacks.onStatusChange?.('connecting', `Connexion à la table ${code}...`);

    try {
      const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
      const wsProtocol = isHttps ? 'wss:' : 'ws:';
      const host = typeof window !== 'undefined' ? window.location.host : 'localhost:3000';
      const wsUrl = `${wsProtocol}//${host}`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.callbacks.onStatusChange?.('connected', `Connecté en direct à la table ${code}`);
        // Send join payload
        this.send({
          type: 'join',
          roomCode: this.currentRoom,
          role: this.currentRole,
          hero: this.cachedHero,
          clientName: this.cachedHero?.name || (this.currentRole === 'mj' ? 'Meneur de Jeu' : 'Joueur'),
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleIncomingMessage(data);
        } catch (e) {
          console.error('[WS Client Parse Error]', e);
        }
      };

      this.ws.onerror = (e) => {
        console.warn('[WS Client Error]', e);
        this.callbacks.onStatusChange?.('error', 'Liaison serveur indisponible.');
      };

      this.ws.onclose = () => {
        if (!this.isIntentionalDisconnect) {
          this.callbacks.onStatusChange?.('disconnected', 'Déconnecté de la table.');
          // Auto retry after 4s
          this.reconnectTimer = setTimeout(() => {
            if (!this.isIntentionalDisconnect && this.currentRoom) {
              this.connect(this.currentRoom, this.currentRole, this.cachedHero);
            }
          }, 4000);
        } else {
          this.callbacks.onStatusChange?.('disconnected', 'Session fermée.');
        }
      };
    } catch (err: any) {
      this.callbacks.onStatusChange?.('error', err?.message || 'Erreur de connexion');
    }
  }

  public disconnect() {
    this.isIntentionalDisconnect = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
    }
    this.currentRoom = '';
    this.callbacks.onStatusChange?.('disconnected', 'Déconnecté');
  }

  public send(payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({ ...payload, roomCode: this.currentRoom }));
      } catch (e) {
        console.error('[WS Send Error]', e);
      }
    }
  }

  // Action methods
  public updateHero(hero: Character) {
    this.cachedHero = hero;
    this.send({
      type: 'hero_update',
      hero,
    });
  }

  public dmPatchHero(heroId: string, patch: Partial<Character>) {
    this.send({
      type: 'dm_patch_hero',
      heroId,
      patch,
    });
  }

  public syncCombat(combatants: Combatant[]) {
    this.send({
      type: 'combat_sync',
      combatants,
    });
  }

  public rollDice(roll: any) {
    this.send({
      type: 'dice_roll',
      roll,
    });
  }

  private handleIncomingMessage(msg: any) {
    switch (msg.type) {
      case 'room_state':
        this.callbacks.onRoomState?.(msg.roomData);
        break;
      case 'hero_updated':
        this.callbacks.onHeroUpdated?.(msg.hero);
        break;
      case 'hero_patched_by_dm':
        this.callbacks.onHeroPatchedByDm?.(msg.heroId, msg.patch, msg.hero);
        break;
      case 'combat_updated':
        this.callbacks.onCombatUpdated?.(msg.combatants);
        break;
      case 'dice_rolled':
        this.callbacks.onDiceRolled?.(msg.roll);
        break;
      case 'peer_joined':
        this.callbacks.onPeerJoined?.(msg.clientName, msg.role, msg.hero);
        break;
      case 'peer_left':
        this.callbacks.onPeerLeft?.(msg.clientName, msg.role);
        break;
      default:
        break;
    }
  }
}

export const realtimeTable = new RealtimeTableManager();
