'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Ghost, MessageCircle, Heart, Eye } from 'lucide-react';

interface AnonymousPostCardProps {
  post: {
    _id: string;
    anonymousId: string;
    content: string;
    images: string[];
    reactions: any[];
    comments: any[];
    community: string;
    tags: string[];
    viewCount: number;
    createdAt: string;
  };
  onClick?: () => void;
}

export default function AnonymousPostCard({ post, onClick }: AnonymousPostCardProps) {
  return (
    <article
      onClick={onClick}
      className="bg-card rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Anonymous Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
            <Ghost className="w-5 h-5 text-text-muted" />
          </div>
          <div>
            <p className="text-white font-medium">{post.anonymousId}</p>
            <div className="flex items-center space-x-2 text-text-muted text-sm">
              <span className="text-accent">{post.community}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        <p className="text-text-primary whitespace-pre-wrap line-clamp-4">{post.content}</p>
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-1">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-background text-text-muted text-xs rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Images */}
      {post.images.length > 0 && (
        <div className={`grid gap-1 ${post.images.length === 1 ? '' : 'grid-cols-2'}`}>
          {post.images.slice(0, 4).map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Image ${idx + 1}`}
              className="w-full h-48 object-cover"
            />
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-3 border-t border-gray-800 flex items-center justify-between text-text-muted text-sm">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <Heart className="w-4 h-4" />
            <span>{post.reactions.length}</span>
          </span>
          <span className="flex items-center space-x-1">
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments.length}</span>
          </span>
        </div>
        <span className="flex items-center space-x-1">
          <Eye className="w-4 h-4" />
          <span>{post.viewCount}</span>
        </span>
      </div>
    </article>
  );
}
