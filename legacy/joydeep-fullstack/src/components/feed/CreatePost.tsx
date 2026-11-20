'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Image, Video, Gamepad2, Smile, X, Loader2 } from 'lucide-react';

interface CreatePostProps {
  onPostCreated?: () => void;
  gameTag?: string;
}

const gameOptions = [
  'Valorant', 'Counter-Strike 2', 'PUBG', 'Minecraft', 'Free Fire',
  'League of Legends', 'Fortnite', 'Apex Legends', 'Dota 2', 'Overwatch 2'
];

export default function CreatePost({ onPostCreated, gameTag: defaultGameTag }: CreatePostProps) {
  const { user, token, isAuthenticated } = useAuth();
  const [content, setContent] = useState('');
  const [selectedGame, setSelectedGame] = useState(defaultGameTag || '');
  const [showGameSelector, setShowGameSelector] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !token) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: content.trim(),
          gameTag: selectedGame || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create post');
      }

      setContent('');
      setSelectedGame(defaultGameTag || '');
      onPostCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-[#141d2e] border border-[#1a2744] rounded-xl p-6 text-center">
        <p className="text-[#8899a6]">
          <a href="/login" className="text-primary hover:underline">Login</a> or{' '}
          <a href="/register" className="text-primary hover:underline">register</a> to create posts
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#141d2e] border border-[#1a2744] rounded-xl overflow-hidden">
      <form onSubmit={handleSubmit}>
        <div className="p-4">
          <div className="flex space-x-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-primary font-bold">
                  {user?.username?.[0]?.toUpperCase()}
                </span>
              )}
            </div>

            {/* Input */}
            <div className="flex-1">
              <div 
                className="w-full bg-[#0f1626] border border-[#1a2744] rounded-lg px-4 py-2.5 cursor-text"
                onClick={() => {
                  const textarea = document.getElementById('create-post-textarea');
                  textarea?.focus();
                }}
              >
                <textarea
                  id="create-post-textarea"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`What's on your mind, ${user?.username}?`}
                  className="w-full bg-transparent text-text-primary placeholder-[#4a5568] resize-none focus:outline-none min-h-[24px] max-h-[200px]"
                  maxLength={5000}
                  rows={1}
                  style={{ height: content ? 'auto' : '24px' }}
                />
              </div>

              {/* Selected Game Tag */}
              {selectedGame && (
                <div className="flex items-center space-x-2 mt-3">
                  <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    🎮 {selectedGame}
                    <button
                      type="button"
                      onClick={() => setSelectedGame('')}
                      className="ml-2 hover:text-primary/70"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                </div>
              )}

              {/* Error */}
              {error && (
                <p className="text-warning text-sm mt-2">{error}</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="px-4 py-3 border-t border-[#1a2744] flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <button
              type="button"
              className="flex items-center space-x-2 px-3 py-2 text-[#00FF88] hover:bg-[#1a2744] rounded-lg transition-colors"
              title="Add image"
            >
              <Image className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">Photo</span>
            </button>
            <button
              type="button"
              className="flex items-center space-x-2 px-3 py-2 text-[#FF10F0] hover:bg-[#1a2744] rounded-lg transition-colors"
              title="Add video"
            >
              <Video className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">Video</span>
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowGameSelector(!showGameSelector)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  selectedGame
                    ? 'text-primary bg-primary/10'
                    : 'text-primary hover:bg-[#1a2744]'
                }`}
                title="Tag a game"
              >
                <Gamepad2 className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">Game</span>
              </button>

              {/* Game Selector Dropdown */}
              {showGameSelector && (
                <div className="absolute bottom-full left-0 mb-2 w-52 bg-[#141d2e] rounded-xl border border-[#1a2744] py-2 max-h-64 overflow-y-auto z-10">
                  {gameOptions.map((game) => (
                    <button
                      key={game}
                      type="button"
                      onClick={() => {
                        setSelectedGame(game);
                        setShowGameSelector(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-[#1a2744] transition-colors ${
                        selectedGame === game ? 'text-primary bg-primary/5' : 'text-text-primary'
                      }`}
                    >
                      {game}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="fb-btn fb-btn-primary px-5 py-2 text-sm font-semibold"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            <span>Post</span>
          </button>
        </div>
      </form>
    </div>
  );
}
