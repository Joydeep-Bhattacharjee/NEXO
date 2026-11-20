'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Home,
  TrendingUp,
  Users,
  Settings,
  HelpCircle,
  Gamepad2,
  Play,
  Ghost,
  Radio,
  Star,
} from 'lucide-react';

export default function Sidebar() {
  const { user, isAuthenticated } = useAuth();

  const menuItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/trending', label: 'Trending', icon: TrendingUp },
    { href: '/following', label: 'Following', icon: Users },
  ];

  const exploreItems = [
    { href: '/games', label: 'Game Hubs', icon: Gamepad2 },
    { href: '/videos', label: 'Videos', icon: Play },
    { href: '/anonymous', label: 'Anonymous', icon: Ghost },
    { href: '/live', label: 'Live Streams', icon: Radio },
  ];

  const favoriteGames = [
    { name: 'Valorant', slug: 'valorant', color: '#FF4655' },
    { name: 'CS2', slug: 'cs2', color: '#F79A1F' },
    { name: 'Minecraft', slug: 'minecraft', color: '#62B47A' },
    { name: 'PUBG', slug: 'pubg', color: '#F2A900' },
  ];

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-card border-r border-gray-800 overflow-y-auto hidden lg:block">
      <div className="p-4 space-y-6">
        {/* Main Menu */}
        <div>
          <h3 className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">
            Menu
          </h3>
          <nav className="space-y-1">
            {menuItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center space-x-3 px-3 py-2.5 text-text-secondary hover:text-white hover:bg-background rounded-lg transition-colors group"
              >
                <Icon className="w-5 h-5 group-hover:text-primary transition-colors" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Explore */}
        <div>
          <h3 className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-3">
            Explore
          </h3>
          <nav className="space-y-1">
            {exploreItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center space-x-3 px-3 py-2.5 text-text-secondary hover:text-white hover:bg-background rounded-lg transition-colors group"
              >
                <Icon className="w-5 h-5 group-hover:text-primary transition-colors" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Favorite Games */}
        {isAuthenticated && (
          <div>
            <h3 className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-3 flex items-center">
              <Star className="w-4 h-4 mr-1" />
              Favorite Games
            </h3>
            <nav className="space-y-1">
              {favoriteGames.map(({ name, slug, color }) => (
                <Link
                  key={slug}
                  href={`/games/${slug}`}
                  className="flex items-center space-x-3 px-3 py-2.5 text-text-secondary hover:text-white hover:bg-background rounded-lg transition-colors"
                >
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: color }}
                  >
                    {name[0]}
                  </div>
                  <span>{name}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}

        {/* Footer Links */}
        <div className="pt-4 border-t border-gray-800">
          <nav className="space-y-1">
            <Link
              href="/settings"
              className="flex items-center space-x-3 px-3 py-2.5 text-text-muted hover:text-white hover:bg-background rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
            <Link
              href="/help"
              className="flex items-center space-x-3 px-3 py-2.5 text-text-muted hover:text-white hover:bg-background rounded-lg transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Help & Support</span>
            </Link>
          </nav>
        </div>

        {/* Version */}
        <div className="text-center text-text-muted text-xs">
          <p>NEXO Gaming v0.1.0 MVP</p>
        </div>
      </div>
    </aside>
  );
}
