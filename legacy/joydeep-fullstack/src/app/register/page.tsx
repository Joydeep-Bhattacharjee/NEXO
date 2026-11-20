'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Gamepad2, Eye, EyeOff, Loader2, X } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(true);

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.email, formData.password, formData.username);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* Background - Facebook login page style */}
      <div className="w-full max-w-[980px] flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 py-10">
        
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left lg:pt-10 lg:max-w-[500px]">
          <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
            <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <span className="text-5xl font-bold text-primary">NEXO</span>
          </div>
          <h2 className="text-xl lg:text-2xl text-text-primary leading-relaxed">
            Join the ultimate gaming community. Share moments, find teammates, and level up together.
          </h2>
        </div>

        {/* Right Side - Sign Up Modal Card */}
        <div className="w-full max-w-[430px]">
          <div className="bg-card rounded-lg shadow-fb-xl p-4">
            {/* Header */}
            <div className="text-center pb-3 border-b border-border relative">
              <h2 className="text-2xl font-bold text-text-primary">Sign Up</h2>
              <p className="text-sm text-text-muted mt-1">It's quick and easy.</p>
              <Link 
                href="/login" 
                className="absolute top-0 right-0 p-2 text-text-muted hover:bg-hover rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="pt-4 space-y-3">
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg text-warning text-sm">
                  {error}
                </div>
              )}

              {/* Username */}
              <input
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
                minLength={3}
                maxLength={30}
                className="fb-input text-sm"
              />

              {/* Email */}
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                required
                className="fb-input text-sm"
              />

              {/* Password */}
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="New password"
                  required
                  minLength={6}
                  className="fb-input text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Confirm Password */}
              <input
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
                className="fb-input text-sm"
              />

              {/* Terms Text */}
              <p className="text-xs text-text-muted px-1">
                By clicking Sign Up, you agree to our{' '}
                <Link href="/terms" className="text-primary hover:underline">Terms</Link>,{' '}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> and{' '}
                <Link href="/cookies" className="text-primary hover:underline">Cookies Policy</Link>.
              </p>

              {/* Submit Button */}
              <div className="pt-2 text-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="fb-btn bg-accent hover:bg-accent/90 text-white px-16 py-2 text-lg font-bold"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  ) : (
                    'Sign Up'
                  )}
                </button>
              </div>
            </form>

            {/* Already have account */}
            <div className="text-center mt-5 pt-4 border-t border-border">
              <Link href="/login" className="text-primary text-sm font-medium hover:underline">
                Already have an account?
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-[980px] mt-auto py-6 px-4">
        <div className="flex flex-wrap justify-center gap-3 text-xs text-text-muted">
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/help" className="hover:underline">Help</Link>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/terms" className="hover:underline">Terms</Link>
          <Link href="/games" className="hover:underline">Games</Link>
          <span>© 2024 NEXO Gaming</span>
        </div>
      </footer>
    </div>
  );
}
