'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import {
  Heart,
  Flame,
  Frown,
  Angry,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Bookmark,
  Send,
} from 'lucide-react';

interface Author {
  _id: string;
  username: string;
  gamerTag: string;
  avatar: string;
}

interface Reaction {
  user: string;
  type: 'like' | 'love' | 'fire' | 'sad' | 'angry';
}

interface Comment {
  _id: string;
  user: Author;
  content: string;
  createdAt: string;
}

interface PostCardProps {
  post: {
    _id: string;
    author: Author;
    content: string;
    images: string[];
    reactions: Reaction[];
    comments: Comment[];
    gameTag?: string;
    viewCount: number;
    createdAt: string;
    isEdited: boolean;
  };
  onReact?: (postId: string, type: string) => void;
  onComment?: (postId: string, content: string) => void;
}

const reactionIcons = {
  like: { icon: Heart, color: 'text-neon-pink', bg: 'bg-neon-pink/10' },
  love: { icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10' },
  fire: { icon: Flame, color: 'text-neon-orange', bg: 'bg-neon-orange/10' },
  sad: { icon: Frown, color: 'text-neon-cyan', bg: 'bg-neon-cyan/10' },
  angry: { icon: Angry, color: 'text-red-600', bg: 'bg-red-600/10' },
};

export default function PostCard({ post, onReact, onComment }: PostCardProps) {
  const { user, token } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find user's reaction
  const userReaction = post.reactions.find((r) => r.user === user?._id);

  // Count reactions by type
  const reactionCounts = post.reactions.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleReaction = async (type: string) => {
    if (!token) return;
    
    try {
      await fetch(`/api/posts/${post._id}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type }),
      });
      onReact?.(post._id, type);
    } catch (error) {
      console.error('Error reacting:', error);
    }
    setShowReactions(false);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !commentText.trim()) return;
    
    setIsSubmitting(true);
    try {
      await fetch(`/api/posts/${post._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentText }),
      });
      onComment?.(post._id, commentText);
      setCommentText('');
    } catch (error) {
      console.error('Error commenting:', error);
    }
    setIsSubmitting(false);
  };

  return (
    <article className="bg-[#141d2e] border border-[#1a2744] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center border border-primary/30">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-primary font-bold">
                {post.author.username[0].toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="text-text-primary font-semibold hover:text-primary cursor-pointer transition-colors">{post.author.username}</p>
            <div className="flex items-center space-x-2 text-text-muted text-xs">
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
              {post.isEdited && <span className="text-text-muted">(edited)</span>}
            </div>
          </div>
        </div>
        
        <button className="p-2 text-text-muted hover:text-primary hover:bg-hover rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Game Tag */}
      {post.gameTag && (
        <div className="px-4 pb-2">
          <span className="gaming-badge gaming-badge-purple">
            🎮 {post.gameTag}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-text-primary whitespace-pre-wrap text-[15px]">{post.content}</p>
      </div>

      {/* Images */}
      {post.images.length > 0 && (
        <div className={`grid gap-0.5 ${post.images.length === 1 ? '' : 'grid-cols-2'}`}>
          {post.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Post image ${idx + 1}`}
              className="w-full h-72 object-cover cursor-pointer hover:brightness-110 transition-all"
            />
          ))}
        </div>
      )}

      {/* Reactions Summary */}
      {post.reactions.length > 0 && (
        <div className="px-4 py-2 flex items-center justify-between text-sm text-text-muted">
          <div className="flex items-center space-x-1">
            <div className="flex -space-x-1">
              {Object.keys(reactionCounts).slice(0, 3).map((type) => {
                const { icon: Icon, color } = reactionIcons[type as keyof typeof reactionIcons];
                return (
                  <div key={type} className={`w-[18px] h-[18px] rounded-full ${color} flex items-center justify-center bg-background-card border border-border`}>
                    <Icon className="w-3 h-3 fill-current" />
                  </div>
                );
              })}
            </div>
            <span className="ml-1">{post.reactions.length}</span>
          </div>
          {post.comments.length > 0 && (
            <button onClick={() => setShowComments(!showComments)} className="hover:text-primary transition-colors">
              {post.comments.length} comments
            </button>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mx-4 py-1 border-t border-border flex items-center">
        {/* Reaction Button */}
        <div className="relative flex-1">
          <button
            onClick={() => setShowReactions(!showReactions)}
            className={`w-full flex items-center justify-center space-x-2 py-2 rounded-lg font-medium transition-all ${
              userReaction
                ? `${reactionIcons[userReaction.type].color}`
                : 'text-text-muted hover:bg-hover hover:text-primary'
            }`}
          >
            {userReaction ? (
              React.createElement(reactionIcons[userReaction.type].icon, {
                className: 'w-5 h-5 fill-current',
              })
            ) : (
              <Heart className="w-5 h-5" />
            )}
            <span className="text-sm">Like</span>
          </button>

          {/* Reaction Picker */}
          {showReactions && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex items-center space-x-1 p-2 gaming-card">
              {Object.entries(reactionIcons).map(([type, { icon: Icon, color }]) => (
                <button
                  key={type}
                  onClick={() => handleReaction(type)}
                  className={`p-2 rounded-full hover:scale-125 hover:bg-hover transition-all ${color}`}
                  title={type}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comment Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center space-x-2 py-2 text-text-muted hover:bg-hover hover:text-primary rounded-lg transition-all"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Comment</span>
        </button>

        {/* Share */}
        <button className="flex-1 flex items-center justify-center space-x-2 py-2 text-text-muted hover:bg-hover hover:text-neon-green rounded-lg transition-all">
          <Share2 className="w-5 h-5" />
          <span className="text-sm font-medium">Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 py-3 border-t border-border space-y-3">
          {/* Comment Form */}
          {user && (
            <form onSubmit={handleComment} className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-primary text-sm font-bold">
                  {user.username[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full bg-background border-none rounded-full px-4 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim() || isSubmitting}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary disabled:opacity-30 hover:bg-primary/10 rounded-full transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-2">
            {post.comments.slice(0, 5).map((comment) => (
              <div key={comment._id} className="flex space-x-2">
                <div className="w-8 h-8 rounded-full bg-hover flex items-center justify-center flex-shrink-0">
                  <span className="text-text-primary text-sm font-bold">
                    {comment.user.username[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="bg-background rounded-2xl px-3 py-2 inline-block">
                    <p className="text-text-primary text-sm font-semibold">{comment.user.username}</p>
                    <p className="text-text-primary text-sm">{comment.content}</p>
                  </div>
                  <div className="flex items-center space-x-3 mt-1 ml-3">
                    <button className="text-xs font-medium text-text-muted hover:underline">Like</button>
                    <button className="text-xs font-medium text-text-muted hover:underline">Reply</button>
                    <span className="text-xs text-text-muted">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {post.comments.length > 5 && (
              <button className="text-text-muted text-sm font-medium hover:underline ml-10">
                View all {post.comments.length} comments
              </button>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
