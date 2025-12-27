'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Eye, Heart, Clock } from 'lucide-react';

interface VideoCardProps {
  video: {
    _id: string;
    author: {
      _id: string;
      username: string;
      avatar: string;
    };
    title: string;
    description: string;
    thumbnailUrl: string;
    duration: number;
    viewCount: number;
    reactions: any[];
    gameTag: string;
    createdAt: string;
  };
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatViews(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/videos/${video._id}`} className="group block">
      <article className="bg-[#141d2e] rounded-xl border border-[#1a2744] overflow-hidden hover:border-primary/50 transition-all">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-[#0a101a] overflow-hidden">
          <img
            src={video.thumbnailUrl || '/thumbnails/default.jpg'}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-white text-xs font-medium flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{formatDuration(video.duration)}</span>
          </div>

          {/* Play Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          {/* Game Tag - Above Title */}
          {video.gameTag && (
            <span className="inline-block px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded mb-2">
              {video.gameTag}
            </span>
          )}
          
          <h3 className="text-white font-medium line-clamp-2 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          
          <div className="mt-2 flex items-center space-x-3">
            {/* Author Avatar */}
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
              {video.author.avatar ? (
                <img
                  src={video.author.avatar}
                  alt={video.author.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-primary text-sm font-bold">
                  {video.author.username[0].toUpperCase()}
                </span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-[#8899a6] text-sm truncate">{video.author.username}</p>
              <div className="flex items-center space-x-3 text-[#4a5568] text-xs">
                <span className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{formatViews(video.viewCount)} views</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Heart className="w-3 h-3" />
                  <span>{video.reactions.length}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
