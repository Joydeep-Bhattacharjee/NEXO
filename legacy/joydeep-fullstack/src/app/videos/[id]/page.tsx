'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ThumbsUp,
  Heart,
  Flame,
  MessageSquare,
  Share2,
  User,
  Eye,
  Clock,
  Gamepad2,
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Link from 'next/link';

interface VideoDetail {
  _id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: number;
  viewCount: number;
  reactions: Array<{ type: string; user: string }>;
  comments: Array<{
    _id: string;
    user: { _id: string; username: string; avatar: string };
    content: string;
    createdAt: string;
  }>;
  author: {
    _id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  game?: {
    name: string;
    slug: string;
  };
  tags: string[];
  createdAt: string;
}

function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function VideoDetailPage({ params }: { params: { id: string } }) {
  const { isAuthenticated, token } = useAuth();
  const [video, setVideo] = useState<VideoDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  // Comment state
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Reaction counts
  const [reactionCounts, setReactionCounts] = useState({
    like: 0,
    love: 0,
    fire: 0,
  });

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`/api/videos/${params.id}`);
        if (!res.ok) {
          throw new Error('Video not found');
        }
        const data = await res.json();
        setVideo(data.data);

        // Count reactions
        const reactions = data.data.reactions || [];
        setReactionCounts({
          like: reactions.filter((r: any) => r.type === 'like').length,
          love: reactions.filter((r: any) => r.type === 'love').length,
          fire: reactions.filter((r: any) => r.type === 'fire').length,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [params.id]);

  const handleReact = async (type: string) => {
    if (!token) return;

    try {
      // In production, call API endpoint
      setReactionCounts((prev) => ({
        ...prev,
        [type]: prev[type as keyof typeof prev] + 1,
      }));
    } catch (error) {
      console.error('Error reacting:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      // In production, call API endpoint
      // For MVP, just add to local state
      const mockComment = {
        _id: Date.now().toString(),
        user: {
          _id: 'current-user',
          username: 'You',
          avatar: '',
        },
        content: newComment,
        createdAt: new Date().toISOString(),
      };

      setVideo((prev) =>
        prev
          ? {
              ...prev,
              comments: [mockComment, ...prev.comments],
            }
          : null
      );
      setNewComment('');
    } catch (error) {
      console.error('Error commenting:', error);
    } finally {
      setIsSubmittingComment(false);
    }
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

  if (error || !video) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="max-w-3xl mx-auto px-4 py-20 text-center">
            <Play className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h1 className="text-2xl font-heading font-bold text-white mb-2">
              Video Not Found
            </h1>
            <p className="text-text-secondary mb-6">{error}</p>
            <Link
              href="/videos"
              className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors"
            >
              Back to Videos
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
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4">
              {/* Video Player */}
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden group">
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                    <Play className="w-20 h-20 text-white/50" />
                  </div>
                )}

                {/* Play Button Overlay */}
                {!isPlaying && (
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors"
                  >
                    <div className="w-20 h-20 flex items-center justify-center bg-primary/80 rounded-full">
                      <Play className="w-10 h-10 text-white ml-1" fill="currentColor" />
                    </div>
                  </button>
                )}

                {/* Player Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-4">
                      <button onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </button>
                      <button onClick={() => setIsMuted(!isMuted)}>
                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                      </button>
                      <span className="text-sm">{formatDuration(video.duration)}</span>
                    </div>
                    <button>
                      <Maximize className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/80 text-white text-sm rounded">
                  {formatDuration(video.duration)}
                </div>
              </div>

              {/* Video Info */}
              <div>
                <h1 className="text-2xl font-heading font-bold text-white">
                  {video.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-text-secondary">
                  <span className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{video.viewCount.toLocaleString()} views</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
                  </span>
                  {video.game && (
                    <Link
                      href={`/games/${video.game.slug}`}
                      className="flex items-center space-x-1 text-primary hover:text-primary-dark"
                    >
                      <Gamepad2 className="w-4 h-4" />
                      <span>{video.game.name}</span>
                    </Link>
                  )}
                </div>

                {/* Reactions */}
                <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-800">
                  <button
                    onClick={() => handleReact('like')}
                    className="flex items-center space-x-2 px-4 py-2 bg-card hover:bg-card/80 rounded-lg transition-colors"
                  >
                    <ThumbsUp className="w-5 h-5 text-blue-400" />
                    <span className="text-white">{reactionCounts.like}</span>
                  </button>
                  <button
                    onClick={() => handleReact('love')}
                    className="flex items-center space-x-2 px-4 py-2 bg-card hover:bg-card/80 rounded-lg transition-colors"
                  >
                    <Heart className="w-5 h-5 text-red-400" />
                    <span className="text-white">{reactionCounts.love}</span>
                  </button>
                  <button
                    onClick={() => handleReact('fire')}
                    className="flex items-center space-x-2 px-4 py-2 bg-card hover:bg-card/80 rounded-lg transition-colors"
                  >
                    <Flame className="w-5 h-5 text-orange-400" />
                    <span className="text-white">{reactionCounts.fire}</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-card hover:bg-card/80 rounded-lg transition-colors ml-auto">
                    <Share2 className="w-5 h-5" />
                    <span className="text-text-secondary">Share</span>
                  </button>
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-gray-800">
                <Link href={`/profile/${video.author.username}`} className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 overflow-hidden">
                    {video.author.avatar ? (
                      <img
                        src={video.author.avatar}
                        alt={video.author.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-white hover:text-primary transition-colors">
                      {video.author.displayName}
                    </p>
                    <p className="text-sm text-text-secondary">@{video.author.username}</p>
                  </div>
                </Link>
                {isAuthenticated && (
                  <button className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors">
                    Follow
                  </button>
                )}
              </div>

              {/* Description */}
              <div className="p-4 bg-card rounded-xl border border-gray-800">
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="font-medium text-white">Description</span>
                  {showDescription ? (
                    <ChevronUp className="w-5 h-5 text-text-muted" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-muted" />
                  )}
                </button>
                {showDescription && (
                  <div className="mt-3 pt-3 border-t border-gray-800">
                    <p className="text-text-secondary whitespace-pre-wrap">
                      {video.description || 'No description provided.'}
                    </p>
                    {video.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {video.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-background text-text-secondary text-sm rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Comments Sidebar */}
            <div className="bg-card rounded-xl border border-gray-800 h-fit max-h-[calc(100vh-120px)] flex flex-col">
              <div className="p-4 border-b border-gray-800">
                <h2 className="font-semibold text-white flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Comments ({video.comments.length})</span>
                </h2>
              </div>

              {/* Comment Form */}
              {isAuthenticated ? (
                <form onSubmit={handleComment} className="p-4 border-b border-gray-800">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-2 bg-background border border-gray-700 rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary text-sm"
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim() || isSubmittingComment}
                      className="p-2 bg-primary hover:bg-primary-dark text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmittingComment ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 border-b border-gray-800 text-center">
                  <Link href="/login" className="text-primary hover:underline text-sm">
                    Login to comment
                  </Link>
                </div>
              )}

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {video.comments.length === 0 ? (
                  <p className="text-center text-text-muted py-8">
                    No comments yet. Be the first!
                  </p>
                ) : (
                  video.comments.map((comment) => (
                    <div key={comment._id} className="flex space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0 overflow-hidden">
                        {comment.user.avatar ? (
                          <img
                            src={comment.user.avatar}
                            alt={comment.user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-white text-sm">
                            {comment.user.username}
                          </span>
                          <span className="text-text-muted text-xs">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-text-secondary text-sm mt-1">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
