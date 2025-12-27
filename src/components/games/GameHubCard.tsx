'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Radio, Eye, Verified } from 'lucide-react';

interface GameHubCardProps {
  game: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    coverImage: string;
    icon: string;
    genre: string[];
    platforms: string[];
    stats: {
      totalPosts: number;
      totalVideos: number;
      activeUsers: number;
    };
    isVerified: boolean;
  };
}

export default function GameHubCard({ game }: GameHubCardProps) {
  return (
    <Link href={`/games/${game.slug}`} className="group block">
      <article className="bg-card rounded-xl border border-gray-800 overflow-hidden hover:border-primary/50 transition-all">
        {/* Cover Image */}
        <div className="relative h-32 bg-gray-900 overflow-hidden">
          <img
            src={game.coverImage || '/games/default-cover.jpg'}
            alt={game.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent"></div>
          
          {/* Game Icon */}
          <div className="absolute -bottom-6 left-4">
            <div className="w-16 h-16 rounded-xl bg-card border-4 border-card overflow-hidden shadow-lg">
              <img
                src={game.icon || '/games/default-icon.png'}
                alt={game.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="pt-8 pb-4 px-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-white font-semibold flex items-center space-x-2">
                <span>{game.name}</span>
                {game.isVerified && (
                  <Verified className="w-4 h-4 text-primary fill-primary" />
                )}
              </h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {(game.genre || []).slice(0, 2).map((g) => (
                  <span
                    key={g}
                    className="px-2 py-0.5 bg-background text-text-muted text-xs rounded"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="text-text-secondary text-sm mt-3 line-clamp-2">
            {game.description}
          </p>

          {/* Stats */}
          <div className="flex items-center space-x-4 mt-4 text-sm">
            <div className="flex items-center space-x-1 text-text-muted">
              <Users className="w-4 h-4" />
              <span>{(game.stats?.activeUsers ?? 0).toLocaleString()} members</span>
            </div>
            <div className="flex items-center space-x-1 text-accent">
              <Radio className="w-4 h-4" />
              <span>Active</span>
            </div>
          </div>

          {/* Platforms */}
          <div className="flex flex-wrap gap-1 mt-3">
            {(game.platforms || []).map((platform) => (
              <span
                key={platform}
                className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
