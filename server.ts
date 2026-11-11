import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

app.use(express.json());

interface ConnectedClient {
  ws: WebSocket;
  room: string;
  role: 'mj' | 'pj';
  clientName: string;
  heroId?: string;
}

interface RoomData {
  roomCode: string;
  createdAt: number;
  mjConnected: boolean;
  heroes: Record<string, any>; // heroId -> Character data
  combatants: any[];
  recentRolls: any[];
}

const rooms = new Map<string, RoomData>();
const clients = new Map<WebSocket, ConnectedClient>();

const getOrCreateRoom = (roomCode: string): RoomData => {
  const code = roomCode.trim().toUpperCase();
  if (!rooms.has(code)) {
    rooms.set(code, {
      roomCode: code,
      createdAt: Date.now(),
      mjConnected: false,
      heroes: {},
      combatants: [],
      recentRolls: [],
    });
  }
  return rooms.get(code)!;
};

const broadcastToRoom = (roomCode: string, payload: any, senderWs?: WebSocket) => {
  const code = roomCode.trim().toUpperCase();
  const json = JSON.stringify(payload);

  for (const [ws, client] of clients.entries()) {
    if (client.room === code && ws.readyState === WebSocket.OPEN) {
      if (!senderWs || ws !== senderWs) {
        try {
          ws.send(json);
        } catch (e) {
          console.error('[WS Send Error]', e);
        }
      }
    }
  }
};

// Setup WebSocket Server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (messageRaw: string) => {
    try {
      const data = JSON.parse(messageRaw.toString());
      const { type, roomCode, role, hero, patch, heroId, roll, combatants } = data;
      const normalizedRoom = (roomCode || '').trim().toUpperCase();

      if (!normalizedRoom) return;
      const room = getOrCreateRoom(normalizedRoom);

      switch (type) {
        case 'join': {
          const clientName = data.clientName || (hero ? hero.name : role === 'mj' ? 'Meneur de Jeu' : 'Joueur');
          clients.set(ws, {
            ws,
            room: normalizedRoom,
            role: role || 'pj',
            clientName,
            heroId: hero?.id,
          });

          if (role === 'mj') {
            room.mjConnected = true;
          }

          if (hero && hero.id) {
            room.heroes[hero.id] = hero;
          }

          // Send back full room state to the joining client
          ws.send(
            JSON.stringify({
              type: 'room_state',
              roomCode: normalizedRoom,
              role,
              roomData: {
                heroes: Object.values(room.heroes),
                combatants: room.combatants,
                recentRolls: room.recentRolls,
                mjConnected: room.mjConnected,
              },
            })
          );

          // Notify room of new hero/client
          broadcastToRoom(
            normalizedRoom,
            {
              type: 'peer_joined',
              clientName,
              role,
              hero: hero || null,
              heroesList: Object.values(room.heroes),
            },
            ws
          );
          break;
        }

        case 'hero_update': {
          // Player updated their hero (HP, PM, inventory, spells)
          if (hero && hero.id) {
            room.heroes[hero.id] = hero;
            broadcastToRoom(
              normalizedRoom,
              {
                type: 'hero_updated',
                hero,
              },
              ws
            );
          }
          break;
        }

        case 'dm_patch_hero': {
          // GM modified player's hero (took damage, added state, gifted ability point)
          if (heroId && patch && room.heroes[heroId]) {
            room.heroes[heroId] = {
              ...room.heroes[heroId],
              ...patch,
            };
            broadcastToRoom(normalizedRoom, {
              type: 'hero_patched_by_dm',
              heroId,
              patch,
              hero: room.heroes[heroId],
            });
          }
          break;
        }

        case 'combat_sync': {
          // GM synced combat tracker
          if (Array.isArray(combatants)) {
            room.combatants = combatants;
            broadcastToRoom(
              normalizedRoom,
              {
                type: 'combat_updated',
                combatants,
              },
              ws
            );
          }
          break;
        }

        case 'dice_roll': {
          // Broadcast dice roll to table
          if (roll) {
            room.recentRolls = [roll, ...room.recentRolls.slice(0, 20)];
            broadcastToRoom(normalizedRoom, {
              type: 'dice_rolled',
              roll,
            });
          }
          break;
        }

        default:
          break;
      }
    } catch (err) {
      console.error('[WS Message Parse Error]', err);
    }
  });

  ws.on('close', () => {
    const client = clients.get(ws);
    if (client) {
      clients.delete(ws);
      const room = rooms.get(client.room);
      if (room) {
        if (client.role === 'mj') {
          room.mjConnected = false;
        }
        broadcastToRoom(client.room, {
          type: 'peer_left',
          clientName: client.clientName,
          role: client.role,
        });
      }
    }
  });
});

// API health and table status endpoints
app.get('/api/table-status/:roomCode', (req, res) => {
  const code = req.params.roomCode.trim().toUpperCase();
  const room = rooms.get(code);
  if (!room) {
    return res.status(404).json({ exists: false });
  }
  return res.json({
    exists: true,
    roomCode: code,
    heroesCount: Object.keys(room.heroes).length,
    mjConnected: room.mjConnected,
  });
});

// Serve frontend with Vite middlewares in dev or static dist in prod
async function setupServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(import.meta.dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(import.meta.dirname, 'dist', 'index.html'));
    });
  }

  server.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Chroniques Oubliées Server] Serveur actif sur http://0.0.0.0:${PORT}`);
  });
}

setupServer();
