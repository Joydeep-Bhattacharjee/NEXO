'use client';

import React, { useEffect, useState } from 'react';
import { LiveStreamCard } from '@/components';
import FacebookNavbar from '@/components/layout/FacebookNavbar';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import { useAuth } from '@/context/AuthContext';
import { Radio, Search, Filter, Loader2, Zap } from 'lucide-react';
import Link from 'next/link';

interface LiveStream {
  _id: string;
  streamer: { _id: string; username: string; gamerTag: string; avatar: string };
  title: string;
  thumbnailUrl: string;
  gameTag: string;
  viewerCount: number;
  isLive: boolean;
  tags: string[];
}

export default function LivePage() {
  const { isAuthenticated } = useAuth();
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<string>('');

  const games = ['Valorant', 'CS2', 'PUBG', 'Minecraft', 'Free Fire', 'League of Legends', 'Fortnite', 'Apex Legends'];

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        let url = '/api/live';
        if (selectedGame) {
          url += `?gameTag=${encodeURIComponent(selectedGame)}`;
        }
        
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setStreams(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching streams:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreams();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchStreams, 30000);
    return () => clearInterval(interval);
  }, [selectedGame]);

  // Filter by search
  const filteredStreams = streams.filter((stream) =>
    stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stream.streamer.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const liveCount = streams.filter((s) => s.isLive).length;
  const totalViewers = streams.reduce((acc, s) => acc + s.viewerCount, 0);

  return (
    <div className="min-h-screen bg-[#0f1626]">
      <FacebookNavbar />
      
      <div className="pt-14 flex">
        <LeftSidebar />
        
        <main className="flex-1 min-h-[calc(100vh-56px)] ml-0 lg:ml-[280px] xl:mr-[280px]">
          <div className="max-w-[900px] mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-heading font-bold text-white flex items-center space-x-3">
                <Radio className="w-7 h-7 text-[#FF10F0]" />
                <span>Live Streams</span>
                {liveCount > 0 && (
                  <span className="px-2 py-1 bg-[#FF10F0] text-white text-xs font-bold rounded">
                    {liveCount} LIVE
                  </span>
                )}
              </h1>
              <p className="text-[#8899a6] mt-1 text-sm">
                Watch gamers streaming live right now
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              {/* Stats */}
              <div className="hidden md:flex items-center space-x-6 text-[#8899a6] text-sm">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>{totalViewers.toLocaleString()} viewers</span>
                </div>
              </div>
              
              {isAuthenticated && (
                <Link
                  href="/live/start"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#FF10F0] hover:bg-[#FF10F0]/90 text-white font-semibold rounded-lg transition-colors"
                >
                  <Radio className="w-5 h-5" />
                  <span>Go Live</span>
                </Link>
              )}
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a5568]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search streams..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#141d2e] border border-[#1a2744] rounded-lg text-white placeholder-[#4a5568] focus:outline-none focus:border-[#FF10F0] transition-colors"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-[#4a5568]" />
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="bg-[#141d2e] border border-[#1a2744] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#FF10F0]"
              >
                <option value="">All Games</option>
                {games.map((game) => (
                  <option key={game} value={game}>
                    {game}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Streams Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#FF10F0] animate-spin" />
            </div>
          ) : filteredStreams.length === 0 ? (
            <div className="text-center py-20 bg-[#141d2e] rounded-xl border border-[#1a2744]">
              <Radio className="w-12 h-12 text-[#4a5568] mx-auto mb-4" />
              <p className="text-[#8899a6]">No one is live right now</p>
              <p className="text-[#4a5568] text-sm mt-2">Check back later or start your own stream!</p>
              {isAuthenticated && (
                <Link
                  href="/live/start"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-[#FF10F0] text-white rounded-lg mt-6 hover:bg-[#FF10F0]/90 transition-colors"
                >
                  <Radio className="w-5 h-5" />
                  <span>Start Streaming</span>
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Featured Stream */}
              {filteredStreams[0] && (
                <div className="mb-6">
                  <h2 className="text-white font-semibold mb-4 flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <span>Featured Stream</span>
                  </h2>
                  <Link href={`/live/${filteredStreams[0]._id}`} className="block group">
                    <div className="relative aspect-video bg-[#0a101a] rounded-xl overflow-hidden">
                      <img
                        src={filteredStreams[0].thumbnailUrl || '/streams/default-thumbnail.jpg'}
                        alt={filteredStreams[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      
                      {/* Live badge */}
                      <div className="absolute top-4 left-4 flex items-center space-x-2 px-3 py-1.5 bg-[#FF10F0] rounded text-white font-bold">
                        <Radio className="w-4 h-4" />
                        <span>LIVE</span>
                      </div>
                      
                      {/* Viewer count */}
                      <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 rounded text-white text-sm">
                        {filteredStreams[0].viewerCount.toLocaleString()} viewers
                      </div>
                      
                      {/* Stream info */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 rounded-full bg-primary/20 ring-2 ring-[#FF10F0] flex items-center justify-center">
                            {filteredStreams[0].streamer.avatar ? (
                              <img
                                src={filteredStreams[0].streamer.avatar}
                                alt={filteredStreams[0].streamer.username}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-primary text-xl font-bold">
                                {filteredStreams[0].streamer.username[0].toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white">{filteredStreams[0].title}</h3>
                            <p className="text-[#8899a6]">{filteredStreams[0].streamer.username}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* All Streams */}
              <h2 className="text-white font-semibold mb-4">All Live Streams</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStreams.map((stream) => (
                  <LiveStreamCard key={stream._id} stream={stream} />
                ))}
              </div>
            </>
          )}
          </div>
        </main>
        
        <RightSidebar />
      </div>
    </div>
  );
}
