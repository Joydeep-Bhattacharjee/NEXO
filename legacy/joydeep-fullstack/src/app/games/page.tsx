'use client';

import React, { useEffect, useState } from 'react';
import { GameHubCard } from '@/components';
import FacebookNavbar from '@/components/layout/FacebookNavbar';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import { Search, Filter, Loader2, Gamepad2 } from 'lucide-react';

interface GameHub {
  _id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  icon: string;
  genre: string[];
  platforms: string[];
  stats: {
    totalPosts: number;
    totalVideos: number;
    activeUsers: number;
  };
  isVerified: boolean;
}

export default function GamesPage() {
  const [games, setGames] = useState<GameHub[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');

  useEffect(() => {
    const fetchGames = async () => {
      try {
        // First try to seed if no games exist
        await fetch('/api/seed', { method: 'POST' });
        
        const res = await fetch('/api/games');
        if (res.ok) {
          const data = await res.json();
          setGames(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Filter games
  const filteredGames = games.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = !selectedPlatform || game.platforms.includes(selectedPlatform);
    return matchesSearch && matchesPlatform;
  });

  const platforms = ['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile'];

  return (
    <div className="min-h-screen bg-[#0f1626]">
      <FacebookNavbar />
      
      <div className="pt-14 flex">
        <LeftSidebar />
        
        <main className="flex-1 min-h-[calc(100vh-56px)] ml-0 lg:ml-[280px] xl:mr-[280px]">
          <div className="max-w-[900px] mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-heading font-bold text-white flex items-center space-x-3">
              <Gamepad2 className="w-7 h-7 text-primary" />
              <span>Game Hubs</span>
            </h1>
            <p className="text-[#8899a6] mt-1 text-sm">
              Join communities for your favorite games
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a5568]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#141d2e] border border-[#1a2744] rounded-lg text-white placeholder-[#4a5568] focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-[#4a5568]" />
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="bg-[#141d2e] border border-[#1a2744] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary"
              >
                <option value="">All Platforms</option>
                {platforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Games Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="text-center py-20 bg-[#141d2e] rounded-xl border border-[#1a2744]">
              <Gamepad2 className="w-12 h-12 text-[#4a5568] mx-auto mb-4" />
              <p className="text-[#8899a6]">No games found</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-primary hover:underline mt-2"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGames.map((game) => (
                <GameHubCard key={game._id} game={game} />
              ))}
            </div>
          )}
          </div>
        </main>
        
        <RightSidebar />
      </div>
    </div>
  );
}
