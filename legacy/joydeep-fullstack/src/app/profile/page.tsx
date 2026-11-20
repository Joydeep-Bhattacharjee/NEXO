'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import {
  User,
  Settings,
  Edit3,
  Camera,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Users,
  Video,
  MessageSquare,
  Heart,
  ThumbsUp,
  Flame,
  Loader2,
  X,
  Save,
  Eye,
  EyeOff,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  avatar: string;
  banner: string;
  bio: string;
  country: string;
  socialLinks: {
    twitter?: string;
    twitch?: string;
    discord?: string;
    youtube?: string;
  };
  followersCount: number;
  followingCount: number;
  postsCount?: number;
  videosCount?: number;
  createdAt: string;
  privacySettings: {
    profileVisibility: string;
    showOnlineStatus: boolean;
  };
}

export default function ProfilePage() {
  const { user, isAuthenticated, logout, token } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'videos' | 'about'>('posts');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Edit form
  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: '',
    country: '',
    twitter: '',
    twitch: '',
    discord: '',
    youtube: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setProfile(data.data);
          setEditForm({
            displayName: data.data.displayName || '',
            bio: data.data.bio || '',
            country: data.data.country || '',
            twitter: data.data.socialLinks?.twitter || '',
            twitch: data.data.socialLinks?.twitch || '',
            discord: data.data.socialLinks?.discord || '',
            youtube: data.data.socialLinks?.youtube || '',
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    // In production, this would call an API endpoint
    // For MVP, we'll just update local state
    setTimeout(() => {
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              displayName: editForm.displayName,
              bio: editForm.bio,
              country: editForm.country,
              socialLinks: {
                twitter: editForm.twitter,
                twitch: editForm.twitch,
                discord: editForm.discord,
                youtube: editForm.youtube,
              },
            }
          : null
      );
      setIsUpdating(false);
      setShowEditModal(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !profile) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <div className="max-w-3xl mx-auto px-4 py-20 text-center">
            <User className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h1 className="text-2xl font-heading font-bold text-white mb-2">
              Not Logged In
            </h1>
            <p className="text-text-secondary mb-6">
              Please log in to view your profile
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
        {/* Banner */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30">
          {profile.banner && (
            <img
              src={profile.banner}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        {/* Profile Info */}
        <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            {/* Avatar & Name */}
            <div className="flex items-end space-x-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-card border-4 border-background overflow-hidden">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/20">
                      <User className="w-12 h-12 text-primary" />
                    </div>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-card border border-gray-700 rounded-full text-text-muted hover:text-white transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="pb-2">
                <h1 className="text-2xl font-heading font-bold text-white">
                  {profile.displayName}
                </h1>
                <p className="text-text-secondary">@{profile.username}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <button
                onClick={() => setShowEditModal(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-card border border-gray-700 hover:border-gray-600 text-white rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-2 bg-card border border-gray-700 hover:border-gray-600 text-text-muted hover:text-white rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-6 mt-6">
            <div className="text-center">
              <p className="text-xl font-bold text-white">{profile.followersCount}</p>
              <p className="text-sm text-text-muted">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-white">{profile.followingCount}</p>
              <p className="text-sm text-text-muted">Following</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-white">{profile.postsCount || 0}</p>
              <p className="text-sm text-text-muted">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-white">{profile.videosCount || 0}</p>
              <p className="text-sm text-text-muted">Videos</p>
            </div>
          </div>

          {/* Bio & Info */}
          {profile.bio && (
            <p className="mt-4 text-text-primary">{profile.bio}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-text-secondary">
            {profile.country && (
              <span className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{profile.country}</span>
              </span>
            )}
            <span className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>
                Joined {formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true })}
              </span>
            </span>
            {profile.socialLinks?.twitter && (
              <a
                href={`https://twitter.com/${profile.socialLinks.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 hover:text-primary"
              >
                <LinkIcon className="w-4 h-4" />
                <span>@{profile.socialLinks.twitter}</span>
              </a>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center space-x-1 mt-8 border-b border-gray-800">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'posts'
                  ? 'text-white border-primary'
                  : 'text-text-secondary hover:text-white border-transparent'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'videos'
                  ? 'text-white border-primary'
                  : 'text-text-secondary hover:text-white border-transparent'
              }`}
            >
              Videos
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'about'
                  ? 'text-white border-primary'
                  : 'text-text-secondary hover:text-white border-transparent'
              }`}
            >
              About
            </button>
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {activeTab === 'posts' && (
              <div className="text-center py-12 bg-card rounded-xl border border-gray-800">
                <MessageSquare className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <p className="text-text-secondary">No posts yet</p>
                <Link
                  href="/"
                  className="text-primary hover:underline text-sm mt-2 inline-block"
                >
                  Create your first post
                </Link>
              </div>
            )}

            {activeTab === 'videos' && (
              <div className="text-center py-12 bg-card rounded-xl border border-gray-800">
                <Video className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <p className="text-text-secondary">No videos yet</p>
                <Link
                  href="/videos"
                  className="text-primary hover:underline text-sm mt-2 inline-block"
                >
                  Upload your first video
                </Link>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="bg-card rounded-xl border border-gray-800 p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">About</h3>
                  <p className="text-text-secondary">
                    {profile.bio || 'No bio yet. Click "Edit Profile" to add one.'}
                  </p>
                </div>

                <div className="border-t border-gray-800 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-text-secondary">
                      <User className="w-5 h-5" />
                      <span>@{profile.username}</span>
                    </div>
                    {profile.country && (
                      <div className="flex items-center space-x-3 text-text-secondary">
                        <MapPin className="w-5 h-5" />
                        <span>{profile.country}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-3 text-text-secondary">
                      <Calendar className="w-5 h-5" />
                      <span>
                        Joined {formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>

                {(profile.socialLinks?.twitter ||
                  profile.socialLinks?.twitch ||
                  profile.socialLinks?.discord ||
                  profile.socialLinks?.youtube) && (
                  <div className="border-t border-gray-800 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Social Links</h3>
                    <div className="flex flex-wrap gap-3">
                      {profile.socialLinks?.twitter && (
                        <a
                          href={`https://twitter.com/${profile.socialLinks.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-background rounded-lg text-text-secondary hover:text-white transition-colors"
                        >
                          Twitter
                        </a>
                      )}
                      {profile.socialLinks?.twitch && (
                        <a
                          href={`https://twitch.tv/${profile.socialLinks.twitch}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-background rounded-lg text-text-secondary hover:text-white transition-colors"
                        >
                          Twitch
                        </a>
                      )}
                      {profile.socialLinks?.youtube && (
                        <a
                          href={profile.socialLinks.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-background rounded-lg text-text-secondary hover:text-white transition-colors"
                        >
                          YouTube
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card rounded-2xl border border-gray-800 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-800 sticky top-0 bg-card">
              <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 text-text-muted hover:text-white hover:bg-background rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editForm.displayName}
                  onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Bio
                </label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={editForm.country}
                  onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                  placeholder="e.g., United States"
                />
              </div>

              <div className="border-t border-gray-800 pt-4">
                <h3 className="text-white font-medium mb-3">Social Links</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.twitter}
                    onChange={(e) => setEditForm({ ...editForm, twitter: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                    placeholder="Twitter username"
                  />
                  <input
                    type="text"
                    value={editForm.twitch}
                    onChange={(e) => setEditForm({ ...editForm, twitch: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                    placeholder="Twitch username"
                  />
                  <input
                    type="text"
                    value={editForm.discord}
                    onChange={(e) => setEditForm({ ...editForm, discord: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                    placeholder="Discord username"
                  />
                  <input
                    type="text"
                    value={editForm.youtube}
                    onChange={(e) => setEditForm({ ...editForm, youtube: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                    placeholder="YouTube channel URL"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isUpdating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card rounded-2xl border border-gray-800 w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </h2>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-2 text-text-muted hover:text-white hover:bg-background rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Privacy Settings */}
              <div className="space-y-3">
                <h3 className="text-white font-medium">Privacy</h3>
                <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Eye className="w-5 h-5 text-text-muted" />
                    <span className="text-text-primary">Profile Visibility</span>
                  </div>
                  <select className="bg-card border border-gray-700 rounded-lg px-3 py-1 text-white text-sm focus:outline-none">
                    <option value="public">Public</option>
                    <option value="followers">Followers Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <div className="flex items-center space-x-3">
                    <EyeOff className="w-5 h-5 text-text-muted" />
                    <span className="text-text-primary">Show Online Status</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>

              {/* Account Actions */}
              <div className="border-t border-gray-800 pt-4 space-y-3">
                <h3 className="text-white font-medium">Account</h3>
                <button
                  onClick={() => {
                    logout();
                    setShowSettingsModal(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 p-3 bg-warning/10 border border-warning/50 text-warning rounded-lg hover:bg-warning/20 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
