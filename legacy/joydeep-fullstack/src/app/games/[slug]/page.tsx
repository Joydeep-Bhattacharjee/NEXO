'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Sidebar, PostCard, CreatePost, VideoCard, ChatBox } from '@/components';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  Video,
  MessageSquare,
  Settings,
  Bell,
  Share2,
  Loader2,
  Verified,
  Play,
} from 'lucide-react';

interface GameHub {
  _id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  icon: string;
  genre: string[];
  platforms: string[];
  developer: string;
  publisher: string;
  members: any[];
  moderators: any[];
  stats: {
    totalPosts: number;
    totalVideos: number;
    activeUsers: number;
  };
  isVerified: boolean;
}

export default function GameHubPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user, token, isAuthenticated } = useAuth();
  
  const [gameHub, setGameHub] = useState<GameHub | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'videos' | 'chat'>('posts');
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const fetchGameHub = async () => {
      try {
        const res = await fetch(`/api/games/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setGameHub(data.data.gameHub);
          setPosts(data.data.posts || []);
          setVideos(data.data.videos || []);
          
          // Check if user is member
          if (user && data.data.gameHub.members) {
            setIsMember(data.data.gameHub.members.some((m: any) => m._id === user._id || m === user._id));
          }
        }
      } catch (error) {
        console.error('Error fetching game hub:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchGameHub();
    }
  }, [slug, user]);

  const handleJoinLeave = async () => {
    if (!token) return;
    
    try {
      const method = isMember ? 'DELETE' : 'POST';
      const res = await fetch(`/api/games/${slug}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        setIsMember(!isMember);
        if (gameHub) {
          setGameHub({
            ...gameHub,
            stats: {
              ...gameHub.stats,
              activeUsers: isMember ? gameHub.stats.activeUsers - 1 : gameHub.stats.activeUsers + 1,
            },
          });
        }
      }
    } catch (error) {
      console.error('Error joining/leaving:', error);
    }
  };

  const handlePostCreated = async () => {
    const res = await fetch(`/api/games/${slug}?tab=posts`);
    if (res.ok) {
      const data = await res.json();
      setPosts(data.data.posts || []);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!gameHub) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Game Hub Not Found</h1>
          <p className="text-text-secondary">The game you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64">
        {/* Cover Banner */}
        <div className="relative h-64 bg-gray-900">
          <img
            src={gameHub.coverImage || '/games/default-cover.jpg'}
            alt={gameHub.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
        </div>

        {/* Game Info */}
        <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
            {/* Icon */}
            <div className="w-32 h-32 rounded-2xl bg-card border-4 border-background overflow-hidden shadow-xl">
              <img
                src={gameHub.icon || '/games/default-icon.png'}
                alt={gameHub.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 mt-4 md:mt-0">
              <h1 className="text-3xl font-heading font-bold text-white flex items-center space-x-2">
                <span>{gameHub.name}</span>
                {gameHub.isVerified && (
                  <Verified className="w-6 h-6 text-primary fill-primary" />
                )}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="text-text-secondary">{gameHub.developer}</span>
                {gameHub.genre.map((g) => (
                  <span key={g} className="px-2 py-0.5 bg-primary/20 text-primary text-sm rounded">
                    {g}
                  </span>
                ))}
              </div>
              <div className="flex items-center space-x-6 mt-4 text-text-secondary">
                <span className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{gameHub.stats.activeUsers.toLocaleString()} members</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{gameHub.stats.totalPosts} posts</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Video className="w-4 h-4" />
                  <span>{gameHub.stats.totalVideos} videos</span>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              {isAuthenticated && (
                <button
                  onClick={handleJoinLeave}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${
                    isMember
                      ? 'bg-card border border-gray-700 text-text-secondary hover:text-white'
                      : 'bg-primary hover:bg-primary-dark text-white'
                  }`}
                >
                  {isMember ? 'Joined' : 'Join'}
                </button>
              )}
              <button className="p-2.5 bg-card border border-gray-700 rounded-lg text-text-secondary hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2.5 bg-card border border-gray-700 rounded-lg text-text-secondary hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-text-secondary mt-6 max-w-3xl">
            {gameHub.description}
          </p>

          {/* Platforms */}
          <div className="flex flex-wrap gap-2 mt-4">
            {gameHub.platforms.map((platform) => (
              <span
                key={platform}
                className="px-3 py-1 bg-card border border-gray-800 text-text-muted text-sm rounded-full"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 mt-8">
          <div className="flex items-center space-x-1 bg-card rounded-lg p-1 border border-gray-800">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'posts'
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-white hover:bg-background'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Posts</span>
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'videos'
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-white hover:bg-background'
              }`}
            >
              <Play className="w-5 h-5" />
              <span>Videos</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'bg-accent text-background'
                  : 'text-text-secondary hover:text-white hover:bg-background'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Live Chat</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {activeTab === 'posts' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <CreatePost onPostCreated={handlePostCreated} gameTag={gameHub.name} />
                {posts.length === 0 ? (
                  <div className="text-center py-12 bg-card rounded-xl border border-gray-800">
                    <p className="text-text-secondary">No posts yet. Be the first to share!</p>
                  </div>
                ) : (
                  posts.map((post) => <PostCard key={post._id} post={post} />)
                )}
              </div>
              <div className="hidden lg:block">
                <div className="bg-card rounded-xl border border-gray-800 p-4 sticky top-20">
                  <h3 className="text-white font-semibold mb-4">About</h3>
                  <p className="text-text-secondary text-sm">{gameHub.description}</p>
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-text-muted text-sm">Developer</p>
                    <p className="text-white">{gameHub.developer}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-text-muted text-sm">Publisher</p>
                    <p className="text-white">{gameHub.publisher}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-card rounded-xl border border-gray-800">
                  <p className="text-text-secondary">No videos yet</p>
                </div>
              ) : (
                videos.map((video) => <VideoCard key={video._id} video={video} />)
              )}
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="h-[600px]">
              <ChatBox
                roomId={gameHub.slug}
                roomType="game"
                roomName={gameHub.name}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
