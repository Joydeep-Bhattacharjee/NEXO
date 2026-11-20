'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';
import { Send, Users, Smile, Settings } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChatBoxProps {
  roomId: string;
  roomType: 'game' | 'stream';
  roomName: string;
}

export default function ChatBox({ roomId, roomType, roomName }: ChatBoxProps) {
  const {
    messages,
    roomUsers,
    typingUsers,
    isConnected,
    joinRoom,
    leaveRoom,
    sendMessage,
    startTyping,
    stopTyping,
  } = useSocket();

  const [input, setInput] = useState('');
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Join room on mount
  useEffect(() => {
    if (isConnected) {
      joinRoom(roomId, roomType);
    }

    return () => {
      if (isConnected) {
        leaveRoom(roomId, roomType);
      }
    };
  }, [isConnected, roomId, roomType, joinRoom, leaveRoom]);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    // Handle typing indicator
    startTyping(roomId, roomType);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      stopTyping(roomId, roomType);
    }, 2000);

    setTypingTimeout(timeout);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessage(roomId, roomType, input.trim());
    setInput('');
    stopTyping(roomId, roomType);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold">{roomName} Chat</h3>
          <div className="flex items-center space-x-2 text-text-muted text-sm">
            <Users className="w-4 h-4" />
            <span>{roomUsers.length} online</span>
            {isConnected ? (
              <span className="flex items-center space-x-1 text-success">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                <span>Connected</span>
              </span>
            ) : (
              <span className="text-warning">Connecting...</span>
            )}
          </div>
        </div>
        <button className="p-2 text-text-muted hover:text-white hover:bg-background rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-text-muted py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex space-x-3 ${msg.type === 'system' ? 'justify-center' : ''}`}
            >
              {msg.type === 'system' ? (
                <p className="text-text-muted text-sm italic">{msg.content}</p>
              ) : (
                <>
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-gaming flex items-center justify-center flex-shrink-0">
                    {msg.avatar ? (
                      <img
                        src={msg.avatar}
                        alt={msg.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-bold">
                        {msg.username[0].toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-white font-medium text-sm">{msg.username}</span>
                      <span className="text-text-muted text-xs">
                        {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-text-primary text-sm break-words">{msg.content}</p>
                  </div>
                </>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="px-4 py-2 text-text-muted text-sm">
          {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 text-text-muted hover:text-white hover:bg-background rounded-lg transition-colors"
          >
            <Smile className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Send a message..."
            disabled={!isConnected}
            className="flex-1 bg-background border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-text-muted focus:outline-none focus:border-primary disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || !isConnected}
            className="p-2 bg-primary rounded-lg text-white disabled:opacity-50 hover:bg-primary-dark transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
