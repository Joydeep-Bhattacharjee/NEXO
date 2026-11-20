'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Gamepad2, Loader2, Eye, EyeOff, Zap, Users, Radio } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a101a] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FFFF]/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1a2744]/50 rounded-full blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[1100px] flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 py-10 relative z-10">
        
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left lg:pt-10 lg:max-w-[550px]">
          <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Gamepad2 className="w-9 h-9 text-primary" />
            </div>
            <span className="text-6xl font-gaming font-bold text-primary tracking-wider">NEXO</span>
          </div>
          <h2 className="text-xl lg:text-2xl text-text-secondary leading-relaxed mb-8 font-body">
            Connect with gamers worldwide. Share your epic moments, join game hubs, and discover live streams.
          </h2>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            <div className="gaming-badge gaming-badge-cyan flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Game Clips</span>
            </div>
            <div className="gaming-badge gaming-badge-purple flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Game Hubs</span>
            </div>
            <div className="gaming-badge gaming-badge-live flex items-center gap-2">
              <Radio className="w-4 h-4" />
              <span>Live Streams</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-[420px]">
          <div className="bg-[#141d2e] border border-[#1a2744] rounded-xl p-8">
            
            <h3 className="text-2xl font-gaming font-bold text-center text-text-primary mb-6 tracking-wide">
              WELCOME BACK
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg text-warning text-sm text-center">
                  {error}
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm text-text-secondary font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="gaming-input"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm text-text-secondary font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="gaming-input pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="neon-btn neon-btn-primary w-full text-lg py-3.5 font-bold tracking-wider"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                ) : (
                  'ENTER THE ARENA'
                )}
              </button>

              {/* Forgot Password */}
              <div className="text-center">
                <Link href="/forgot-password" className="text-primary text-sm hover:text-primary-light transition-colors">
                  Forgot your password?
                </Link>
              </div>

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-4 text-text-muted uppercase tracking-wider">New to NEXO?</span>
                </div>
              </div>

              {/* Create Account Button */}
              <div className="text-center">
                <Link
                  href="/register"
                  className="neon-btn neon-btn-accent w-full text-lg py-3.5 font-bold tracking-wider"
                >
                  CREATE ACCOUNT
                </Link>
              </div>
            </form>
          </div>

          {/* Create Hub Link */}
          <p className="text-center mt-8 text-sm text-text-muted">
            <span className="text-text-secondary font-medium">Create a Gaming Hub</span> for your favorite game, team, or community.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-[1100px] mt-auto py-6 px-4 relative z-10">
        <div className="flex flex-wrap justify-center gap-4 text-xs text-text-muted">
          <Link href="/about" className="hover:text-primary transition-colors">About</Link>
          <Link href="/help" className="hover:text-primary transition-colors">Help</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
          <Link href="/games" className="hover:text-primary transition-colors">Games</Link>
          <span className="text-text-muted/50">© 2024 NEXO Gaming</span>
        </div>
      </footer>
    </div>
  );
}
