'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar, AnonymousPostCard } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { Ghost, Search, Plus, Hash, Loader2, X } from 'lucide-react';

interface AnonymousPost {
  _id: string;
  anonymousId: string;
  content: string;
  images: string[];
  reactions: any[];
  comments: any[];
  community: string;
  tags: string[];
  viewCount: number;
  createdAt: string;
}

const defaultCommunities = [
  'General',
  'Confessions',
  'Rants',
  'Questions',
  'Hot Takes',
  'Valorant',
  'CS2',
  'League of Legends',
];

export default function AnonymousPage() {
  const { isAuthenticated, token } = useAuth();
  const [posts, setPosts] = useState<AnonymousPost[]>([]);
  const [communities, setCommunities] = useState<string[]>(defaultCommunities);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create post form
  const [newPost, setNewPost] = useState({
    content: '',
    community: 'General',
    tags: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let url = '/api/anonymous';
        if (selectedCommunity) {
          url += `?community=${encodeURIComponent(selectedCommunity)}`;
        }
        
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setPosts(data.data.posts || []);
          if (data.data.communities?.length > 0) {
            const allCommunities = [...defaultCommunities, ...data.data.communities];
            setCommunities(allCommunities.filter((v, i, a) => a.indexOf(v) === i));
          }
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCommunity]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newPost.content.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/anonymous', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newPost.content,
          community: newPost.community,
          tags: newPost.tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create post');
      }

      const data = await res.json();
      setPosts((prev) => [data.data, ...prev]);
      setNewPost({ content: '', community: 'General', tags: '' });
      setShowCreateModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold text-white flex items-center space-x-3">
                <Ghost className="w-8 h-8 text-text-muted" />
                <span>Go Anonymous</span>
              </h1>
              <p className="text-text-secondary mt-2">
                Share your thoughts anonymously. No identity revealed.
              </p>
            </div>
            {isAuthenticated && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 md:mt-0 inline-flex items-center space-x-2 px-6 py-3 bg-card border border-gray-700 hover:border-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Post Anonymously</span>
              </button>
            )}
          </div>

          {/* Communities Filter */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCommunity('')}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCommunity === ''
                    ? 'bg-primary text-white'
                    : 'bg-card text-text-secondary hover:text-white'
                }`}
              >
                All
              </button>
              {communities.map((community) => (
                <button
                  key={community}
                  onClick={() => setSelectedCommunity(community)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    selectedCommunity === community
                      ? 'bg-primary text-white'
                      : 'bg-card text-text-secondary hover:text-white'
                  }`}
                >
                  {community}
                </button>
              ))}
            </div>
          </div>

          {/* Posts */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-xl border border-gray-800">
              <Ghost className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-secondary">No anonymous posts yet</p>
              {isAuthenticated && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="text-primary hover:underline mt-2"
                >
                  Be the first to post
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <AnonymousPostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card rounded-2xl border border-gray-800 w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Ghost className="w-5 h-5" />
                <span>Post Anonymously</span>
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-text-muted hover:text-white hover:bg-background rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-4 space-y-4">
              {error && (
                <div className="p-3 bg-warning/10 border border-warning/50 rounded-lg text-warning text-sm">
                  {error}
                </div>
              )}

              {/* Community */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Community
                </label>
                <select
                  value={newPost.community}
                  onChange={(e) => setNewPost({ ...newPost, community: e.target.value })}
                  className="w-full bg-background border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                >
                  {communities.map((community) => (
                    <option key={community} value={community}>
                      {community}
                    </option>
                  ))}
                </select>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Your Anonymous Message
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="What's on your mind? Your identity stays hidden..."
                  rows={5}
                  className="w-full bg-background border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-text-muted focus:outline-none focus:border-primary resize-none"
                  maxLength={5000}
                  required
                />
                <p className="text-text-muted text-xs mt-1 text-right">
                  {newPost.content.length}/5000
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Tags (optional)
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    placeholder="rant, gaming, help (comma separated)"
                    className="w-full pl-10 pr-4 py-3 bg-background border border-gray-700 rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="p-3 bg-background rounded-lg text-text-muted text-sm">
                <p className="flex items-center space-x-2">
                  <Ghost className="w-4 h-4" />
                  <span>Your identity will be hidden. You'll appear as "Anon#XXXX"</span>
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!newPost.content.trim() || isSubmitting}
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                <span>{isSubmitting ? 'Posting...' : 'Post Anonymously'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
