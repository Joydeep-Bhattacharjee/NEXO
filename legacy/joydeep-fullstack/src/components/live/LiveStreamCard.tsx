'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Eye, Radio } from 'lucide-react';

interface LiveStreamCardProps {
  stream: {
    _id: string;
    streamer: {
      _id: string;
      username: string;
      gamerTag: string;
      avatar: string;
    };
    title: string;
    thumbnailUrl: string;
    gameTag: string;
    viewerCount: number;
    isLive: boolean;
    tags: string[];
  };
}

export default function LiveStreamCard({ stream }: LiveStreamCardProps) {
  return (
    <Link href={`/live/${stream._id}`} className="group block">
      <article className="bg-[#141d2e] rounded-xl border border-[#1a2744] overflow-hidden hover:border-[#FF10F0]/50 transition-all">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-[#0a101a] overflow-hidden">
          <img
            src={stream.thumbnailUrl || '/streams/default-thumbnail.jpg'}
            alt={stream.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Live Badge */}
          {stream.isLive && (
            <div className="absolute top-2 left-2 flex items-center space-x-1 px-2 py-1 bg-[#FF10F0] rounded text-white text-xs font-bold">
              <Radio className="w-3 h-3" />
              <span>LIVE</span>
            </div>
          )}

          {/* Viewer Count */}
          <div className="absolute bottom-2 left-2 flex items-center space-x-1 px-2 py-1 bg-black/80 rounded text-white text-xs">
            <Eye className="w-3 h-3" />
            <span>{stream.viewerCount.toLocaleString()} viewers</span>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-[#FF10F0]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Info */}
        <div className="p-4">
          {/* Game Tag */}
          {stream.gameTag && (
            <span className="inline-block px-2 py-1 bg-[#FF10F0]/20 text-[#FF10F0] text-xs font-medium rounded mb-2">
              {stream.gameTag}
            </span>
          )}
          
          <div className="flex items-start space-x-3">
            {/* Streamer Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#FF10F0]/20 border border-[#FF10F0]/30 flex items-center justify-center">
                {stream.streamer.avatar ? (
                  <img
                    src={stream.streamer.avatar}
                    alt={stream.streamer.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-[#FF10F0] font-bold">
                    {stream.streamer.username[0].toUpperCase()}
                  </span>
                )}
              </div>
              {stream.isLive && (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#FF10F0] rounded-full border-2 border-[#141d2e]"></span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate group-hover:text-[#FF10F0] transition-colors">
                {stream.title}
              </h3>
              <p className="text-[#8899a6] text-sm">{stream.streamer.username}</p>
            </div>
          </div>

          {/* Tags */}
          {stream.tags && stream.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {stream.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-[#0f1626] text-[#8899a6] text-xs rounded hover:bg-[#1a2744] transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
