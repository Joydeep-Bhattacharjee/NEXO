'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Settings,
  Shield,
  Globe,
  LogOut,
  Moon,
  HelpCircle,
  MessageCircle,
  ChevronRight,
  Search,
  MoreHorizontal,
  Circle,
} from 'lucide-react';

interface OnlineFriend {
  id: string;
  name: string;
  avatar?: string;
  game?: string;
  isOnline: boolean;
}

const dummyFriends: OnlineFriend[] = [
  { id: '1', name: 'ProGamer99', isOnline: true, game: 'Valorant' },
  { id: '2', name: 'NightHawk', isOnline: true, game: 'CS2' },
  { id: '3', name: 'ShadowKing', isOnline: true },
  { id: '4', name: 'DragonSlayer', isOnline: true, game: 'League of Legends' },
  { id: '5', name: 'PhoenixRise', isOnline: false },
  { id: '6', name: 'CyberWolf', isOnline: true },
];

export default function RightSidebar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isAuthenticated) return null;

  const filteredFriends = dummyFriends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineFriends = filteredFriends.filter((f) => f.isOnline);

  return (
    <aside className="fixed right-0 top-14 h-[calc(100vh-56px)] w-[280px] overflow-y-auto py-4 px-3 hidden xl:block border-l border-[#1a2744] bg-[#0a101a]">
      {/* Settings Panel */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[#4a5568] font-semibold text-xs uppercase tracking-wider">Quick Settings</h3>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-primary text-sm hover:text-primary/80 transition-colors"
          >
            {showSettings ? 'Hide' : 'Show'}
          </button>
        </div>

        {showSettings && (
          <div className="bg-[#141d2e] border border-[#1a2744] rounded-xl p-3 space-y-1">
            {/* Settings */}
            <Link
              href="/settings"
              className="flex items-center justify-between p-2 rounded-lg hover:bg-[#1a2744] transition-all border border-transparent hover:border-primary/20"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#00FFFF]/10 border border-[#00FFFF]/20 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-[#00FFFF]" />
                </div>
                <span className="text-sm font-medium text-text-primary">Settings</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#4a5568]" />
            </Link>

            {/* Privacy & Security */}
            <Link
              href="/settings/privacy"
              className="flex items-center justify-between p-2 rounded-lg hover:bg-[#1a2744] transition-all border border-transparent hover:border-primary/20"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#A020F0]/10 border border-[#A020F0]/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-[#A020F0]" />
                </div>
                <span className="text-sm font-medium text-text-primary">Privacy & Security</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#4a5568]" />
            </Link>

            {/* Language */}
            <Link
              href="/settings/language"
              className="flex items-center justify-between p-2 rounded-lg hover:bg-[#1a2744] transition-all border border-transparent hover:border-primary/20"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#00FF88]/10 border border-[#00FF88]/20 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-[#00FF88]" />
                </div>
                <span className="text-sm font-medium text-text-primary">Language</span>
              </div>
              <span className="text-xs text-[#8899a6]">English</span>
            </Link>

            {/* Dark Mode Toggle - Already on */}
            <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#1a2744] transition-all border border-transparent hover:border-primary/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#00FFFF]/10 border border-[#00FFFF]/20 flex items-center justify-center">
                  <Moon className="w-4 h-4 text-[#00FFFF]" />
                </div>
                <span className="text-sm font-medium text-text-primary">Dark Mode</span>
              </div>
              <div className="w-10 h-6 bg-[#00FFFF]/30 rounded-full relative cursor-pointer border border-[#00FFFF]/50">
                <div className="absolute right-1 top-1 w-4 h-4 bg-[#00FFFF] rounded-full transition-transform" />
              </div>
            </button>

            {/* Help */}
            <Link
              href="/help"
              className="flex items-center justify-between p-2 rounded-lg hover:bg-[#1a2744] transition-all border border-transparent hover:border-primary/20"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-[#FF6B00]" />
                </div>
                <span className="text-sm font-medium text-text-primary">Help & Support</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#4a5568]" />
            </Link>

            {/* Divider */}
            <div className="border-t border-[#1a2744] my-2" />

            {/* Logout */}
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-[#FF10F0]/10 transition-all border border-transparent hover:border-[#FF10F0]/30"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FF10F0]/10 border border-[#FF10F0]/20 flex items-center justify-center">
                <LogOut className="w-4 h-4 text-[#FF10F0]" />
              </div>
              <span className="text-sm font-medium text-[#FF10F0]">Log Out</span>
            </button>
          </div>
        )}
      </div>

      {/* Contacts / Online Friends */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[#4a5568] font-semibold text-xs uppercase tracking-wider">Contacts</h3>
          <div className="flex items-center space-x-2">
            <button className="p-1.5 hover:bg-[#1a2744] rounded-lg transition-colors">
              <Search className="w-4 h-4 text-[#4a5568]" />
            </button>
            <button className="p-1.5 hover:bg-[#1a2744] rounded-lg transition-colors">
              <MoreHorizontal className="w-4 h-4 text-[#4a5568]" />
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-[#141d2e] rounded-lg text-sm text-text-primary placeholder-[#4a5568] border border-[#1a2744] focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Online Count */}
        <p className="text-xs text-[#00FF88] mb-2 px-2 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#00FF88]"></span>
          {onlineFriends.length} friends online
        </p>

        {/* Friends List */}
        <div className="space-y-1">
          {filteredFriends.map((friend) => (
            <button
              key={friend.id}
              className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-[#1a2744] transition-all border border-transparent hover:border-primary/20"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/30">
                  {friend.avatar ? (
                    <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-primary font-bold text-sm">
                      {friend.name[0].toUpperCase()}
                    </span>
                  )}
                </div>
                {friend.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#00FF88] border-2 border-[#0a101a] rounded-full" />
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-text-primary">{friend.name}</p>
                {friend.game && (
                  <p className="text-xs text-[#A020F0]">Playing {friend.game}</p>
                )}
              </div>
            </button>
          ))}
        </div>

        {filteredFriends.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-[#8899a6]">No friends found</p>
          </div>
        )}
      </div>

      {/* Sponsored / Ads Section (Placeholder) */}
      <div className="mt-6 pt-4 border-t border-[#1a2744]">
        <h3 className="text-[#4a5568] font-semibold text-xs uppercase tracking-wider mb-3">Sponsored</h3>
        <div className="bg-[#141d2e] border border-[#1a2744] rounded-xl p-3">
          <div className="w-full h-24 bg-gradient-to-br from-primary/10 via-[#A020F0]/10 to-[#00FF88]/10 rounded-lg mb-2 flex items-center justify-center border border-primary/20">
            <span className="text-[#8899a6] text-sm text-primary font-gaming">NEXO PRO</span>
          </div>
          <p className="text-xs text-[#4a5568]">nexogaming.com</p>
          <p className="text-sm text-text-primary font-medium">Join NEXO Pro for exclusive features</p>
        </div>
      </div>
    </aside>
  );
}
