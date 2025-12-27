'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { PostCard, CreatePost, VideoCard, LiveStreamCard } from '@/components';
import FacebookNavbar from '@/components/layout/FacebookNavbar';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import { useAuth } from '@/context/AuthContext';
import { TrendingUp, Flame, Radio, Play, ChevronRight, Loader2, Image, Video, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Types
interface Post {
  _id: string;
  author: {
    _id: string;
    username: string;
    gamerTag: string;
    avatar: string;
  };
  content: string;
  images: string[];
  reactions: any[];
  comments: any[];
  gameTag?: string;
  viewCount: number;
  createdAt: string;
  isEdited: boolean;
}

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

export default function HomePage() {
  const { isAuthenticated, token, user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'feed' | 'videos' | 'live'>('feed');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Fetch feed data
  const fetchFeed = useCallback(async () => {
    try {
      const [postsRes, videosRes, liveRes] = await Promise.all([
        fetch('/api/posts?limit=10'),
        fetch('/api/videos?limit=6'),
        fetch('/api/live?live=true'),
      ]);

      if (postsRes.ok) {
        const data = await postsRes.json();
        setPosts(data.data.posts || []);
      }

      if (videosRes.ok) {
        const data = await videosRes.json();
        setVideos(data.data.videos || []);
      }

      if (liveRes.ok) {
        const data = await liveRes.json();
        setLiveStreams(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const handlePostCreated = () => {
    fetchFeed();
  };

  // Show loading while checking auth
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1626]">
      {/* Facebook-style Navbar */}
      <FacebookNavbar />
      
      {/* Main Layout - 3 Columns */}
      <div className="pt-14 flex">
        {/* Left Sidebar */}
        <LeftSidebar />
        
        {/* Center Feed */}
        <main className="flex-1 min-h-[calc(100vh-56px)] ml-0 lg:ml-[280px] xl:mr-[280px]">
          <div className="max-w-[680px] mx-auto px-4 py-6">

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <>
              {/* Feed Tab */}
              {activeTab === 'feed' && (
                <div className="space-y-6">
                  {/* Create Post */}
                  <CreatePost onPostCreated={handlePostCreated} />

                  {/* Posts */}
                  <div className="space-y-4">
                    {posts.length === 0 ? (
                      <div className="text-center py-12 bg-[#141d2e] rounded-xl border border-[#1a2744]">
                        <p className="text-[#8899a6]">No posts yet. Be the first to share!</p>
                      </div>
                    ) : (
                      posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Videos Tab */}
              {activeTab === 'videos' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {videos.length === 0 ? (
                      <div className="col-span-full text-center py-12 bg-card rounded-xl shadow-fb">
                        <p className="text-text-muted">No videos yet</p>
                      </div>
                    ) : (
                      videos.map((video) => (
                        <VideoCard key={video._id} video={video} />
                      ))
                    )}
                  </div>
                  <div className="mt-6 text-center">
                    <Link
                      href="/videos"
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-card shadow-fb rounded-lg text-text-muted hover:text-text-primary hover:shadow-fb-lg transition-all"
                    >
                      <span>View All Videos</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Live Tab */}
              {activeTab === 'live' && (
                <div>
                  {liveStreams.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-xl shadow-fb">
                      <Radio className="w-12 h-12 text-text-muted mx-auto mb-4" />
                      <p className="text-text-muted">No one is live right now</p>
                      <p className="text-text-muted text-sm mt-1">Check back later or start your own stream!</p>
                      {isAuthenticated && (
                        <Link
                          href="/live/start"
                          className="inline-flex items-center space-x-2 px-6 py-3 bg-live text-white rounded-lg mt-4 hover:bg-live/90 transition-colors"
                        >
                          <Radio className="w-5 h-5" />
                          <span>Go Live</span>
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {liveStreams.map((stream) => (
                        <LiveStreamCard key={stream._id} stream={stream} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          </div>
        </main>
        
        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
}
