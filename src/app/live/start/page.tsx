'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Radio,
  Video,
  Settings,
  Copy,
  Eye,
  EyeOff,
  Gamepad2,
  Hash,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

const categories = [
  'Gaming',
  'Just Chatting',
  'Esports',
  'Music',
  'Creative',
  'IRL',
  'Sports',
  'Other',
];

const popularGames = [
  'Valorant',
  'League of Legends',
  'Counter-Strike 2',
  'Fortnite',
  'Minecraft',
  'Apex Legends',
  'Call of Duty',
  'Genshin Impact',
];

export default function StartStreamPage() {
  const { isAuthenticated, token, user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Gaming',
    game: '',
    tags: '',
  });

  const [streamKey, setStreamKey] = useState('');
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const generateStreamKey = () => {
    setIsGeneratingKey(true);
    // Simulate generating a stream key
    setTimeout(() => {
      const key = `nexo_${Math.random().toString(36).substring(2, 15)}_${Date.now().toString(36)}`;
      setStreamKey(key);
      setIsGeneratingKey(false);
    }, 1000);
  };

  const copyStreamKey = () => {
    navigator.clipboard.writeText(streamKey);
    setSuccess('Stream key copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !formData.title.trim()) return;

    setIsCreating(true);
    setError('');

    try {
      const res = await fetch('/api/live', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          game: formData.game || undefined,
          tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
          streamKey: streamKey || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create stream');
      }

      const data = await res.json();
      setSuccess('Stream created successfully!');
      
      // Redirect to the stream page
      setTimeout(() => {
        router.push(`/live/${data.data._id}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsCreating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="max-w-3xl mx-auto px-4 py-20 text-center">
            <Radio className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h1 className="text-2xl font-heading font-bold text-white mb-2">
              Login Required
            </h1>
            <p className="text-text-secondary mb-6">
              Please log in to start streaming
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-white flex items-center space-x-3">
              <Radio className="w-8 h-8 text-accent" />
              <span>Go Live</span>
            </h1>
            <p className="text-text-secondary mt-2">
              Set up your stream and start broadcasting to your audience
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 p-4 bg-warning/10 border border-warning/50 rounded-lg flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
              <p className="text-warning">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-success/10 border border-success/50 rounded-lg flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
              <p className="text-success">{success}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stream Settings Form */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Stream Info Card */}
                <div className="bg-card rounded-xl border border-gray-800 p-6">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <Video className="w-5 h-5" />
                    <span>Stream Information</span>
                  </h2>

                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Stream Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter a catchy title for your stream"
                        className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary"
                        maxLength={100}
                        required
                      />
                      <p className="text-text-muted text-xs mt-1 text-right">
                        {formData.title.length}/100
                      </p>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Tell viewers what your stream is about..."
                        rows={3}
                        className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary resize-none"
                        maxLength={500}
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Game */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        <Gamepad2 className="w-4 h-4 inline mr-1" />
                        Game (optional)
                      </label>
                      <select
                        value={formData.game}
                        onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                      >
                        <option value="">Select a game</option>
                        {popularGames.map((game) => (
                          <option key={game} value={game}>
                            {game}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        <Hash className="w-4 h-4 inline mr-1" />
                        Tags
                      </label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="ranked, pro, chill (comma separated)"
                        className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Stream Key Card */}
                <div className="bg-card rounded-xl border border-gray-800 p-6">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Stream Key</span>
                  </h2>

                  <p className="text-text-secondary text-sm mb-4">
                    Use this key in your streaming software (OBS, Streamlabs, etc.) to connect to NEXO.
                  </p>

                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <input
                          type={showStreamKey ? 'text' : 'password'}
                          value={streamKey}
                          readOnly
                          placeholder="Generate a stream key"
                          className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white placeholder-text-muted focus:outline-none pr-20"
                        />
                        {streamKey && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() => setShowStreamKey(!showStreamKey)}
                              className="p-1.5 text-text-muted hover:text-white transition-colors"
                            >
                              {showStreamKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              type="button"
                              onClick={copyStreamKey}
                              className="p-1.5 text-text-muted hover:text-white transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={generateStreamKey}
                        disabled={isGeneratingKey}
                        className="px-4 py-3 bg-background border border-gray-700 hover:border-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                      >
                        {isGeneratingKey ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <RefreshCw className="w-5 h-5" />
                        )}
                        <span>{streamKey ? 'Reset' : 'Generate'}</span>
                      </button>
                    </div>

                    <div className="p-3 bg-background rounded-lg text-text-muted text-sm">
                      <p className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          Keep your stream key private. Anyone with this key can stream to your channel.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!formData.title.trim() || isCreating}
                  className="w-full py-4 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isCreating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Radio className="w-5 h-5" />
                  )}
                  <span>{isCreating ? 'Creating Stream...' : 'Create Stream'}</span>
                </button>
              </form>
            </div>

            {/* Preview & Tips */}
            <div className="space-y-6">
              {/* Stream Preview */}
              <div className="bg-card rounded-xl border border-gray-800 p-4">
                <h3 className="font-semibold text-white mb-3">Stream Preview</h3>
                <div className="aspect-video bg-background rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Radio className="w-12 h-12 text-text-muted mx-auto mb-2" />
                    <p className="text-text-muted text-sm">Preview will appear here</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="font-medium text-white truncate">
                    {formData.title || 'Your stream title'}
                  </p>
                  <p className="text-sm text-text-secondary truncate">
                    {user?.displayName || user?.username || 'Your name'}
                  </p>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-card rounded-xl border border-gray-800 p-4">
                <h3 className="font-semibold text-white mb-3">Tips for a Great Stream</h3>
                <ul className="space-y-3 text-sm text-text-secondary">
                  <li className="flex items-start space-x-2">
                    <span className="text-success">✓</span>
                    <span>Use a descriptive, engaging title</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-success">✓</span>
                    <span>Add relevant tags to help viewers find you</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-success">✓</span>
                    <span>Test your audio and video quality before going live</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-success">✓</span>
                    <span>Interact with your chat to build community</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-success">✓</span>
                    <span>Stream at a consistent schedule</span>
                  </li>
                </ul>
              </div>

              {/* Quick Links */}
              <div className="bg-card rounded-xl border border-gray-800 p-4">
                <h3 className="font-semibold text-white mb-3">Resources</h3>
                <div className="space-y-2">
                  <a
                    href="#"
                    className="block p-2 bg-background rounded-lg text-text-secondary hover:text-white transition-colors text-sm"
                  >
                    📖 Streaming Guide
                  </a>
                  <a
                    href="#"
                    className="block p-2 bg-background rounded-lg text-text-secondary hover:text-white transition-colors text-sm"
                  >
                    🎬 OBS Setup Tutorial
                  </a>
                  <a
                    href="#"
                    className="block p-2 bg-background rounded-lg text-text-secondary hover:text-white transition-colors text-sm"
                  >
                    🎤 Audio Best Practices
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
