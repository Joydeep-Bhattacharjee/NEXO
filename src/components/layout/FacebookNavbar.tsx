'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Home,
  Play,
  Gamepad2,
  Radio,
  Bell,
  MessageCircle,
  Search,
  Menu,
  Settings,
  EyeOff,
  LogOut,
} from 'lucide-react';

export default function FacebookNavbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/videos', icon: Play, label: 'Watch' },
    { href: '/games', icon: Gamepad2, label: 'Gaming' },
    { href: '/live', icon: Radio, label: 'Live' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a101a] border-b border-[#1a2744] h-14">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left Section - Logo & Search */}
        <div className="flex items-center space-x-3">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center transition-all group-hover:bg-primary/30">
              <Gamepad2 className="w-6 h-6 text-primary" />
            </div>
            <span className="hidden lg:block text-xl font-gaming font-bold text-primary">NEXO</span>
          </Link>

          {/* Search */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a5568]" />
            <input
              type="text"
              placeholder="Search"
              className="w-40 pl-10 pr-3 py-2 bg-[#141d2e] rounded-lg text-sm text-text-primary placeholder-[#4a5568] border border-[#1a2744] focus:outline-none focus:border-primary focus:w-52 transition-all"
            />
          </div>
        </div>

        {/* Center Section - Navigation */}
        <nav className="hidden md:flex items-center space-x-1 absolute left-1/2 -translate-x-1/2">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative px-10 py-3 rounded-lg transition-all group ${
                isActive(href)
                  ? 'text-primary'
                  : 'text-text-muted hover:bg-[#1a2744] hover:text-text-primary'
              }`}
              title={label}
            >
              <Icon className="w-6 h-6" />
              {isActive(href) && (
                <div className="absolute bottom-0 left-2 right-2 h-[3px] bg-primary rounded-t-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Section - Actions & Settings Menu */}
        <div className="flex items-center space-x-2">
          {/* Messenger */}
          <button className="w-10 h-10 rounded-lg bg-[#141d2e] border border-[#1a2744] flex items-center justify-center hover:border-primary/50 transition-colors relative">
            <MessageCircle className="w-5 h-5 text-[#8899a6]" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF10F0] text-white text-xs font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-lg bg-[#141d2e] border border-[#1a2744] flex items-center justify-center hover:border-primary/50 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-[#8899a6]" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-[#0a101a] text-xs font-bold rounded-full flex items-center justify-center">
                5
              </span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#141d2e] border border-[#1a2744] rounded-xl overflow-hidden">
                <div className="p-4 border-b border-[#1a2744]">
                  <h3 className="text-xl font-gaming font-bold text-text-primary">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-3 hover:bg-[#1a2744] cursor-pointer flex items-start space-x-3 border-b border-[#1a2744]/50 last:border-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                        <Gamepad2 className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-primary">
                          <span className="font-semibold text-primary">Player{i}</span> liked your post about the new game update.
                        </p>
                        <p className="text-xs text-primary/70 mt-1">{i} hour ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Hamburger Menu with Settings */}
          <div className="relative">
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="w-10 h-10 rounded-lg bg-[#141d2e] border border-[#1a2744] flex items-center justify-center hover:border-primary/50 transition-colors"
            >
              <Menu className="w-6 h-6 text-[#8899a6]" />
            </button>

            {/* Settings Dropdown */}
            {showSettingsMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#141d2e] border border-[#1a2744] rounded-xl overflow-hidden">
                <div className="p-2">
                  {/* Go Anonymous */}
                  <Link
                    href="/anonymous"
                    className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-[#1a2744] transition-colors"
                    onClick={() => setShowSettingsMenu(false)}
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#A020F0]/10 border border-[#A020F0]/20 flex items-center justify-center">
                      <EyeOff className="w-5 h-5 text-[#A020F0]" />
                    </div>
                    <span className="font-medium text-text-primary">Go Anonymous</span>
                  </Link>

                  {/* Settings */}
                  <Link
                    href="/settings"
                    className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-[#1a2744] transition-colors"
                    onClick={() => setShowSettingsMenu(false)}
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#00FFFF]/10 border border-[#00FFFF]/20 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-[#00FFFF]" />
                    </div>
                    <span className="font-medium text-text-primary">Settings & Privacy</span>
                  </Link>

                  <div className="border-t border-[#1a2744] my-2" />

                  {/* Log Out */}
                  <button
                    onClick={() => {
                      logout();
                      setShowSettingsMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-[#FF10F0]/10 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#FF10F0]/10 border border-[#FF10F0]/20 flex items-center justify-center">
                      <LogOut className="w-5 h-5 text-[#FF10F0]" />
                    </div>
                    <span className="font-medium text-[#FF10F0]">Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search - shown on small screens */}
      <div className="md:hidden px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a5568]" />
          <input
            type="text"
            placeholder="Search NEXO"
            className="w-full pl-10 pr-4 py-2 bg-[#141d2e] rounded-lg text-sm text-text-primary placeholder-[#4a5568] border border-[#1a2744] focus:outline-none focus:border-primary"
          />
        </div>
      </div>
    </header>
  );
}
