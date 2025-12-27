'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Sidebar, ChatBox } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { formatDistanceToNow } from 'date-fns';
import {
  Radio,
  User,
  Users,
  Heart,
  Gift,
  Share2,
  Settings,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Play,
  Pause,
  Loader2,
  Eye,
  Gamepad2,
  MessageCircle,
} from 'lucide-react';
import Link from 'next/link';

interface LiveStreamDetail {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  streamKey: string;
  isLive: boolean;
  viewerCount: number;
  peakViewerCount: number;
  category: string;
  tags: string[];
  streamer: {
    _id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  game?: {
    name: string;
    slug: string;
  };
  startedAt: string;
  createdAt: string;
}

export default function LiveStreamPage({ params }: { params: { id: string } }) {
  const { isAuthenticated, token, user } = useAuth();
  const { joinRoom, leaveRoom, sendMessage, messages } = useSocket();
  const [stream, setStream] = useState<LiveStreamDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Player state
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const playerRef = useRef<HTMLDivElement>(null);

  // Viewer count simulation
  const [viewerCount, setViewerCount] = useState(0);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const res = await fetch(`/api/live/${params.id}`);
        if (!res.ok) {
          throw new Error('Stream not found');
        }
        const data = await res.json();
        setStream(data.data);
        setViewerCount(data.data.viewerCount);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStream();
  }, [params.id]);

  // Join chat room when stream loads
  useEffect(() => {
    if (stream) {
      joinRoom(stream._id, 'stream');
      return () => {
        leaveRoom(stream._id, 'stream');
      };
    }
  }, [stream, joinRoom, leaveRoom]);

  // Simulate viewer count changes
  useEffect(() => {
    if (!stream?.isLive) return;

    const interval = setInterval(() => {
      setViewerCount((prev) => {
        const change = Math.floor(Math.random() * 10) - 4;
        return Math.max(1, prev + change);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [stream?.isLive]);

  const handleFullscreen = () => {
    if (!playerRef.current) return;

    if (!isFullscreen) {
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleSendMessage = (content: string) => {
    if (!stream) return;
    sendMessage(stream._id, 'stream', content);
  };

  if (isLoading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !stream) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="max-w-3xl mx-auto px-4 py-20 text-center">
            <Radio className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h1 className="text-2xl font-heading font-bold text-white mb-2">
              Stream Not Found
            </h1>
            <p className="text-text-secondary mb-6">{error}</p>
            <Link
              href="/live"
              className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors"
            >
              Back to Live Streams
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">
          {/* Main Content */}
          <div className={`flex-1 flex flex-col ${showChat ? 'lg:mr-80' : ''}`}>
            {/* Video Player */}
            <div ref={playerRef} className="relative bg-black aspect-video lg:aspect-auto lg:flex-1">
              {stream.thumbnail ? (
                <img
                  src={stream.thumbnail}
                  alt={stream.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-primary/20">
                  <Radio className="w-20 h-20 text-accent animate-pulse" />
                </div>
              )}

              {/* Live Badge */}
              {stream.isLive && (
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <span className="flex items-center space-x-1 px-2 py-1 bg-accent text-white text-sm font-semibold rounded">
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>LIVE</span>
                  </span>
                  <span className="flex items-center space-x-1 px-2 py-1 bg-black/60 text-white text-sm rounded">
                    <Eye className="w-4 h-4" />
                    <span>{viewerCount.toLocaleString()}</span>
                  </span>
                </div>
              )}

              {/* Offline Message */}
              {!stream.isLive && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <div className="text-center">
                    <Radio className="w-16 h-16 text-text-muted mx-auto mb-4" />
                    <p className="text-xl font-semibold text-white">Stream Offline</p>
                    <p className="text-text-secondary mt-2">
                      {stream.streamer.displayName} is not streaming right now
                    </p>
                  </div>
                </div>
              )}

              {/* Player Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button onClick={() => setIsMuted(!isMuted)} className="text-white hover:text-primary transition-colors">
                      {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setShowChat(!showChat)}
                      className="text-white hover:text-primary transition-colors lg:hidden"
                    >
                      <MessageCircle className="w-6 h-6" />
                    </button>
                    <button onClick={handleFullscreen} className="text-white hover:text-primary transition-colors">
                      {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stream Info */}
            <div className="p-4 bg-card border-t border-gray-800">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* Streamer Info */}
                <div className="flex items-start space-x-4">
                  <Link href={`/profile/${stream.streamer.username}`}>
                    <div className="w-14 h-14 rounded-full bg-primary/20 overflow-hidden ring-2 ring-accent">
                      {stream.streamer.avatar ? (
                        <img
                          src={stream.streamer.avatar}
                          alt={stream.streamer.displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-7 h-7 text-primary" />
                        </div>
                      )}
                    </div>
                  </Link>
                  <div>
                    <h1 className="text-xl font-semibold text-white">{stream.title}</h1>
                    <Link
                      href={`/profile/${stream.streamer.username}`}
                      className="text-text-secondary hover:text-primary transition-colors"
                    >
                      {stream.streamer.displayName}
                    </Link>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-text-muted">
                      {stream.game && (
                        <Link
                          href={`/games/${stream.game.slug}`}
                          className="flex items-center space-x-1 text-primary hover:text-primary-dark"
                        >
                          <Gamepad2 className="w-4 h-4" />
                          <span>{stream.game.name}</span>
                        </Link>
                      )}
                      <span className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{viewerCount.toLocaleString()} watching</span>
                      </span>
                      {stream.startedAt && stream.isLive && (
                        <span>
                          Started {formatDistanceToNow(new Date(stream.startedAt), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  {isAuthenticated && (
                    <>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors">
                        <Heart className="w-5 h-5" />
                        <span>Follow</span>
                      </button>
                      <button className="p-2 bg-card border border-gray-700 hover:border-gray-600 text-text-muted hover:text-white rounded-lg transition-colors">
                        <Gift className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <button className="p-2 bg-card border border-gray-700 hover:border-gray-600 text-text-muted hover:text-white rounded-lg transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Description & Tags */}
              {(stream.description || stream.tags.length > 0) && (
                <div className="mt-4 pt-4 border-t border-gray-800">
                  {stream.description && (
                    <p className="text-text-secondary">{stream.description}</p>
                  )}
                  {stream.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {stream.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-background text-text-secondary text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Chat Sidebar */}
          {showChat && (
            <div className="fixed lg:absolute right-0 top-0 bottom-0 w-80 bg-card border-l border-gray-800 flex flex-col z-40 hidden lg:flex">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <h2 className="font-semibold text-white flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Live Chat</span>
                </h2>
                <button
                  onClick={() => setShowChat(false)}
                  className="p-1 text-text-muted hover:text-white transition-colors"
                >
                  <Minimize className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatBox
                  roomId={stream._id}
                  roomType="stream"
                  roomName={stream.title}
                />
              </div>
            </div>
          )}

          {/* Chat Toggle Button (when hidden) */}
          {!showChat && (
            <button
              onClick={() => setShowChat(true)}
              className="fixed right-4 bottom-4 p-3 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg transition-colors z-40 hidden lg:flex"
            >
              <MessageCircle className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
