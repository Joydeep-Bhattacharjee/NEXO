// Standalone Socket.io server
// Run with: npx ts-node --esm server/socket.ts

import { createServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

const PORT = process.env.SOCKET_PORT || 3001;

// Types
interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  avatar?: string;
  content: string;
  timestamp: Date;
  type: 'message' | 'system' | 'emote';
}

interface RoomUser {
  socketId: string;
  userId: string;
  username: string;
  avatar?: string;
  joinedAt: Date;
}

// State
const rooms = new Map<string, Set<RoomUser>>();

// Create HTTP server
const httpServer = createServer();

// Create Socket.io server
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket: Socket) => {
  console.log(`🔌 Connected: ${socket.id}`);

  // Authenticate
  socket.on('authenticate', (data: { userId: string; username: string; avatar?: string }) => {
    socket.data.user = data;
    socket.emit('authenticated', { success: true });
    console.log(`✅ Authenticated: ${data.username}`);
  });

  // Join room
  socket.on('join_room', (data: { roomId: string; roomType: 'game' | 'stream' }) => {
    const { roomId, roomType } = data;
    const user = socket.data.user;
    
    if (!user) {
      socket.emit('error', { message: 'Not authenticated' });
      return;
    }

    const fullRoomId = `${roomType}:${roomId}`;
    socket.join(fullRoomId);

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

    // Notify others
    socket.to(fullRoomId).emit('user_joined', {
      userId: user.userId,
      username: user.username,
      avatar: user.avatar,
    });

    // Send user list
    const users = Array.from(rooms.get(fullRoomId) || []);
    socket.emit('room_users', { users, count: users.length });

    // System message
    io.to(fullRoomId).emit('new_message', {
      id: `sys_${Date.now()}`,
      roomId: fullRoomId,
      userId: 'system',
      username: 'System',
      content: `${user.username} joined the chat`,
      timestamp: new Date(),
      type: 'system',
    });

    console.log(`👥 ${user.username} joined ${fullRoomId}`);
  });

  // Chat message
  socket.on('chat_message', (data: { roomId: string; roomType: 'game' | 'stream'; content: string }) => {
    const { roomId, roomType, content } = data;
    const user = socket.data.user;

    if (!user || !content?.trim()) return;

    const fullRoomId = `${roomType}:${roomId}`;

    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      roomId: fullRoomId,
      userId: user.userId,
      username: user.username,
      avatar: user.avatar,
      content: content.trim().substring(0, 500),
      timestamp: new Date(),
      type: 'message',
    };

    io.to(fullRoomId).emit('new_message', message);
  });

  // Typing indicators
  socket.on('typing_start', (data: { roomId: string; roomType: 'game' | 'stream' }) => {
    const user = socket.data.user;
    if (user) {
      socket.to(`${data.roomType}:${data.roomId}`).emit('user_typing', {
        userId: user.userId,
        username: user.username,
      });
    }
  });

  socket.on('typing_stop', (data: { roomId: string; roomType: 'game' | 'stream' }) => {
    const user = socket.data.user;
    if (user) {
      socket.to(`${data.roomType}:${data.roomId}`).emit('user_stopped_typing', {
        userId: user.userId,
      });
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    const user = socket.data.user;
    
    if (user) {
      rooms.forEach((users, roomId) => {
        users.forEach((u) => {
          if (u.socketId === socket.id) {
            users.delete(u);
            io.to(roomId).emit('user_left', {
              userId: user.userId,
              username: user.username,
            });
            io.to(roomId).emit('new_message', {
              id: `sys_${Date.now()}`,
              roomId,
              userId: 'system',
              username: 'System',
              content: `${user.username} left the chat`,
              timestamp: new Date(),
              type: 'system',
            });
          }
        });
      });
    }

    console.log(`🔌 Disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.io server running on port ${PORT}`);
});
