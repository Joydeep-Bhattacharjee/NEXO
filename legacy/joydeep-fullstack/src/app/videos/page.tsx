'use client';

import React, { useEffect, useState } from 'react';
import { VideoCard } from '@/components';
import FacebookNavbar from '@/components/layout/FacebookNavbar';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import { Search, Filter, Loader2, Play, Upload, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface Video {
  _id: string;
  author: { _id: string; username: string; avatar: string };
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  viewCount: number;
  reactions: any[];
  gameTag: string;
  createdAt: string;
}

export default function VideosPage() {
  const { isAuthenticated } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<string>('');

  const games = ['Valorant', 'CS2', 'PUBG', 'Minecraft', 'Free Fire', 'League of Legends', 'Fortnite', 'Apex Legends'];

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        let url = '/api/videos?limit=24';
        if (selectedGame) {
          url += `&gameTag=${encodeURIComponent(selectedGame)}`;
        }
        
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setVideos(data.data.videos || []);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [selectedGame]);

  // Filter by search
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.author.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f1626]">
      <FacebookNavbar />
      
      <div className="pt-14 flex">
        <LeftSidebar />
        
        <main className="flex-1 min-h-[calc(100vh-56px)] ml-0 lg:ml-[280px] xl:mr-[280px]">
          <div className="max-w-[900px] mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-heading font-bold text-white flex items-center space-x-3">
                <Play className="w-7 h-7 text-primary" />
                <span>Videos</span>
              </h1>
              <p className="text-[#8899a6] mt-1 text-sm">
                Watch clips, highlights, and gameplay from the community
              </p>
            </div>
            {isAuthenticated && (
              <Link
                href="/videos/upload"
                className="mt-4 md:mt-0 inline-flex items-center space-x-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-[#0a101a] font-semibold rounded-lg transition-colors"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Video</span>
              </Link>
            )}
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a5568]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#141d2e] border border-[#1a2744] rounded-lg text-white placeholder-[#4a5568] focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-[#4a5568]" />
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="bg-[#141d2e] border border-[#1a2744] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary"
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

          {/* Videos Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center py-20 bg-[#141d2e] rounded-xl border border-[#1a2744]">
              <Play className="w-12 h-12 text-[#4a5568] mx-auto mb-4" />
              <p className="text-[#8899a6]">No videos found</p>
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
            <>
              {/* Trending Section */}
              {!searchQuery && !selectedGame && filteredVideos.length >= 3 && (
                <div className="mb-6">
                  <h2 className="text-white font-semibold flex items-center space-x-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span>Trending Now</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filteredVideos.slice(0, 3).map((video) => (
                      <VideoCard key={video._id} video={video} />
                    ))}
                  </div>
                </div>
              )}

              {/* All Videos */}
              <h2 className="text-white font-semibold mb-4">All Videos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVideos.map((video) => (
                  <VideoCard key={video._id} video={video} />
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
