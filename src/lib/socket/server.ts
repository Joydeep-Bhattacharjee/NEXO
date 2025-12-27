import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

// Types for chat messages
export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  avatar?: string;
  content: string;
  timestamp: Date;
  type: 'message' | 'system' | 'emote';
}

// Types for room management
export interface RoomUser {
  socketId: string;
  userId: string;
  username: string;
  avatar?: string;
  joinedAt: Date;
}

// Store for active rooms and users
const rooms = new Map<string, Set<RoomUser>>();
const userSockets = new Map<string, string>(); // userId -> socketId

/**
 * Initialize Socket.io server
 */
export function initializeSocketServer(httpServer: HTTPServer): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Connection handler
  io.on('connection', (socket: Socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // Authenticate user
    socket.on('authenticate', (data: { userId: string; username: string; avatar?: string }) => {
      const { userId, username, avatar } = data;
      
      // Store socket mapping
      userSockets.set(userId, socket.id);
      socket.data.user = { userId, username, avatar };
      
      socket.emit('authenticated', { success: true });
      console.log(`✅ User authenticated: ${username}`);
    });

    // Join a chat room (game hub or live stream)
    socket.on('join_room', (data: { roomId: string; roomType: 'game' | 'stream' }) => {
      const { roomId, roomType } = data;
      const user = socket.data.user;
      
      if (!user) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      // Leave previous rooms of same type
      socket.rooms.forEach((room: string) => {
        if (room.startsWith(roomType + ':')) {
          socket.leave(room);
        }
      });

      const fullRoomId = `${roomType}:${roomId}`;
      socket.join(fullRoomId);

      // Track room users
      if (!rooms.has(fullRoomId)) {
        rooms.set(fullRoomId, new Set());
      }
      
      const roomUser: RoomUser = {
        socketId: socket.id,
        userId: user.userId,
        username: user.username,
        avatar: user.avatar,
        joinedAt: new Date(),
      };
      
      rooms.get(fullRoomId)?.add(roomUser);

      // Notify room of new user
      socket.to(fullRoomId).emit('user_joined', {
        userId: user.userId,
        username: user.username,
        avatar: user.avatar,
      });

      // Send current users to new member
      const currentUsers = Array.from(rooms.get(fullRoomId) || []);
      socket.emit('room_users', { users: currentUsers, count: currentUsers.length });

      console.log(`👥 ${user.username} joined room: ${fullRoomId}`);
    });

    // Leave a room
    socket.on('leave_room', (data: { roomId: string; roomType: 'game' | 'stream' }) => {
      const { roomId, roomType } = data;
      const user = socket.data.user;
      const fullRoomId = `${roomType}:${roomId}`;

      socket.leave(fullRoomId);

      // Remove from room tracking
      const roomUsers = rooms.get(fullRoomId);
      if (roomUsers && user) {
        roomUsers.forEach((u) => {
          if (u.userId === user.userId) {
            roomUsers.delete(u);
          }
        });
      }

      // Notify room
      if (user) {
        socket.to(fullRoomId).emit('user_left', {
          userId: user.userId,
          username: user.username,
        });
      }
    });

    // Send chat message
    socket.on('chat_message', (data: { roomId: string; roomType: 'game' | 'stream'; content: string }) => {
      const { roomId, roomType, content } = data;
      const user = socket.data.user;

      if (!user) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      if (!content || content.trim().length === 0) {
        return;
      }

      const fullRoomId = `${roomType}:${roomId}`;
      
      const message: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        roomId: fullRoomId,
        userId: user.userId,
        username: user.username,
        avatar: user.avatar,
        content: content.trim().substring(0, 500), // Limit message length
        timestamp: new Date(),
        type: 'message',
      };

      // Broadcast to room including sender
      io.to(fullRoomId).emit('new_message', message);
    });

    // Typing indicator
    socket.on('typing_start', (data: { roomId: string; roomType: 'game' | 'stream' }) => {
      const { roomId, roomType } = data;
      const user = socket.data.user;
      
      if (user) {
        const fullRoomId = `${roomType}:${roomId}`;
        socket.to(fullRoomId).emit('user_typing', {
          userId: user.userId,
          username: user.username,
        });
      }
    });

    socket.on('typing_stop', (data: { roomId: string; roomType: 'game' | 'stream' }) => {
      const { roomId, roomType } = data;
      const user = socket.data.user;
      
      if (user) {
        const fullRoomId = `${roomType}:${roomId}`;
        socket.to(fullRoomId).emit('user_stopped_typing', {
          userId: user.userId,
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      const user = socket.data.user;
      
      if (user) {
        userSockets.delete(user.userId);
        
        // Remove from all rooms
        rooms.forEach((users, roomId) => {
          users.forEach((u) => {
            if (u.socketId === socket.id) {
              users.delete(u);
              // Notify room
              io.to(roomId).emit('user_left', {
                userId: user.userId,
                username: user.username,
              });
            }
          });
        });
      }

      console.log(`🔌 User disconnected: ${socket.id}`);
    });
  });

  return io;
}

export default initializeSocketServer;
