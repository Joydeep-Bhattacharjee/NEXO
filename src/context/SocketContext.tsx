'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

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

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  messages: ChatMessage[];
  roomUsers: RoomUser[];
  typingUsers: string[];
  joinRoom: (roomId: string, roomType: 'game' | 'stream') => void;
  leaveRoom: (roomId: string, roomType: 'game' | 'stream') => void;
  sendMessage: (roomId: string, roomType: 'game' | 'stream', content: string) => void;
  startTyping: (roomId: string, roomType: 'game' | 'stream') => void;
  stopTyping: (roomId: string, roomType: 'game' | 'stream') => void;
  clearMessages: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Initialize socket connection
  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      // Authenticate after connection
      newSocket.emit('authenticate', {
        userId: user._id,
        username: user.username,
        avatar: user.avatar,
      });
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('authenticated', () => {
      console.log('Socket authenticated');
    });

    newSocket.on('error', (error: { message: string }) => {
      console.error('Socket error:', error.message);
    });

    newSocket.on('new_message', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('room_users', (data: { users: RoomUser[]; count: number }) => {
      setRoomUsers(data.users);
    });

    newSocket.on('user_joined', (data: { userId: string; username: string }) => {
      console.log(`${data.username} joined`);
    });

    newSocket.on('user_left', (data: { userId: string; username: string }) => {
      console.log(`${data.username} left`);
      setRoomUsers((prev) => prev.filter((u) => u.userId !== data.userId));
    });

    newSocket.on('user_typing', (data: { userId: string; username: string }) => {
      setTypingUsers((prev) => {
        if (!prev.includes(data.username)) {
          return [...prev, data.username];
        }
        return prev;
      });
    });

    newSocket.on('user_stopped_typing', (data: { userId: string }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== data.userId));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user]);

  // Join room
  const joinRoom = useCallback((roomId: string, roomType: 'game' | 'stream') => {
    if (socket && isConnected) {
      setMessages([]);
      socket.emit('join_room', { roomId, roomType });
    }
  }, [socket, isConnected]);

  // Leave room
  const leaveRoom = useCallback((roomId: string, roomType: 'game' | 'stream') => {
    if (socket && isConnected) {
      socket.emit('leave_room', { roomId, roomType });
      setMessages([]);
      setRoomUsers([]);
    }
  }, [socket, isConnected]);

  // Send message
  const sendMessage = useCallback((roomId: string, roomType: 'game' | 'stream', content: string) => {
    if (socket && isConnected && content.trim()) {
      socket.emit('chat_message', { roomId, roomType, content });
    }
  }, [socket, isConnected]);

  // Typing indicators
  const startTyping = useCallback((roomId: string, roomType: 'game' | 'stream') => {
    if (socket && isConnected) {
      socket.emit('typing_start', { roomId, roomType });
    }
  }, [socket, isConnected]);

  const stopTyping = useCallback((roomId: string, roomType: 'game' | 'stream') => {
    if (socket && isConnected) {
      socket.emit('typing_stop', { roomId, roomType });
    }
  }, [socket, isConnected]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        messages,
        roomUsers,
        typingUsers,
        joinRoom,
        leaveRoom,
        sendMessage,
        startTyping,
        stopTyping,
        clearMessages,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

export default SocketContext;
