'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Users,
  Server,
  Gamepad2,
  Swords,
  Trophy,
  Target,
  Crosshair,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const gameTypes = [
  { name: 'FPS Games', icon: Crosshair, href: '/games?type=fps', color: '#FF10F0' },
  { name: 'Battle Royale', icon: Target, href: '/games?type=br', color: '#FF6B00' },
  { name: 'MOBA', icon: Swords, href: '/games?type=moba', color: '#A020F0' },
  { name: 'Sports', icon: Trophy, href: '/games?type=sports', color: '#39FF14' },
];

export default function LeftSidebar() {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [showAllGames, setShowAllGames] = React.useState(false);

  if (!isAuthenticated) return null;

  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-56px)] w-[280px] overflow-y-auto py-4 px-2 hidden lg:block bg-[#0a101a]">
      <nav className="space-y-1">
        {/* User Profile - Main */}
        <Link
          href="/profile"
          className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all mb-2 ${
            pathname === '/profile' 
              ? 'bg-primary/10 border border-primary/30' 
              : 'bg-[#141d2e] border border-[#1a2744] hover:border-primary/30'
          }`}
        >
          <div className="w-11 h-11 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <span className="text-primary font-bold text-lg">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-text-primary">{user?.displayName || user?.username || 'User'}</p>
            <p className="text-xs text-[#8899a6]">View your profile</p>
          </div>
        </Link>

        {/* Friends */}
        <Link
          href="/friends"
          className={`flex items-center space-x-3 px-2 py-2.5 rounded-lg transition-all ${
            pathname === '/friends' 
              ? 'bg-[#00FFFF]/10 text-[#00FFFF] border border-[#00FFFF]/30' 
              : 'hover:bg-[#1a2744] text-[#8899a6] hover:text-text-primary border border-transparent hover:border-primary/20'
          }`}
        >
          <div className="w-9 h-9 rounded-lg bg-[#00FFFF]/10 flex items-center justify-center border border-[#00FFFF]/20">
            <Users className="w-5 h-5 text-[#00FFFF]" />
          </div>
          <span className="font-medium">Friends</span>
        </Link>

        {/* Servers */}
        <Link
          href="/servers"
          className={`flex items-center space-x-3 px-2 py-2.5 rounded-lg transition-all ${
            pathname === '/servers' 
              ? 'bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30' 
              : 'hover:bg-[#1a2744] text-[#8899a6] hover:text-text-primary border border-transparent hover:border-primary/20'
          }`}
        >
          <div className="w-9 h-9 rounded-lg bg-[#00FF88]/10 flex items-center justify-center border border-[#00FF88]/20">
            <Server className="w-5 h-5 text-[#00FF88]" />
          </div>
          <span className="font-medium">Servers</span>
        </Link>

        {/* Game Hubs */}
        <Link
          href="/games"
          className={`flex items-center space-x-3 px-2 py-2.5 rounded-lg transition-all ${
            pathname === '/games' 
              ? 'bg-[#A020F0]/10 text-[#A020F0] border border-[#A020F0]/30' 
              : 'hover:bg-[#1a2744] text-[#8899a6] hover:text-text-primary border border-transparent hover:border-primary/20'
          }`}
        >
          <div className="w-9 h-9 rounded-lg bg-[#A020F0]/10 flex items-center justify-center border border-[#A020F0]/20">
            <Gamepad2 className="w-5 h-5 text-[#A020F0]" />
          </div>
          <span className="font-medium">Game Hubs</span>
        </Link>

        {/* Divider */}
        <div className="border-t border-[#1a2744] my-3 mx-2" />

        {/* Game Types Section */}
        <div className="px-2">
          <h3 className="text-[#4a5568] text-xs font-semibold mb-2 px-2 uppercase tracking-wider">Game Types</h3>
          
          {gameTypes.slice(0, showAllGames ? undefined : 3).map(({ name, icon: Icon, href, color }) => (
            <Link
              key={name}
              href={href}
              className="flex items-center space-x-3 px-2 py-2.5 rounded-lg hover:bg-[#1a2744] transition-all text-[#8899a6] hover:text-text-primary border border-transparent hover:border-primary/20"
            >
              <div 
                className="w-9 h-9 rounded-lg flex items-center justify-center border"
                style={{ backgroundColor: `${color}15`, borderColor: `${color}30` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <span className="font-medium">{name}</span>
            </Link>
          ))}

          {/* See More/Less Button */}
          <button
            onClick={() => setShowAllGames(!showAllGames)}
            className="w-full flex items-center space-x-3 px-2 py-2.5 rounded-lg hover:bg-[#1a2744] transition-all text-[#8899a6]"
          >
            <div className="w-9 h-9 rounded-lg bg-[#141d2e] border border-[#1a2744] flex items-center justify-center">
              {showAllGames ? (
                <ChevronUp className="w-5 h-5 text-[#4a5568]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#4a5568]" />
              )}
            </div>
            <span className="font-medium">{showAllGames ? 'See Less' : 'See More'}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-[#1a2744] my-3 mx-2" />

        {/* Your Shortcuts */}
        <div className="px-2">
          <h3 className="text-[#4a5568] text-xs font-semibold mb-2 px-2 uppercase tracking-wider">Your Shortcuts</h3>
          
          {/* Favorite Games */}
          {['Valorant', 'CS2', 'League of Legends'].map((game) => (
            <Link
              key={game}
              href={`/games/${game.toLowerCase().replace(/\s+/g, '-')}`}
              className="flex items-center space-x-3 px-2 py-2.5 rounded-lg hover:bg-[#1a2744] transition-all text-[#8899a6] hover:text-text-primary border border-transparent hover:border-primary/20"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                <span className="text-background font-bold text-sm">{game[0]}</span>
              </div>
              <span className="font-medium">{game}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="mt-6 px-4 text-xs text-[#4a5568]">
        <p>Privacy · Terms · Advertising · Cookies</p>
        <p className="mt-1 text-[#4a5568]/50">NEXO Gaming © 2024</p>
      </div>
    </aside>
  );
}
