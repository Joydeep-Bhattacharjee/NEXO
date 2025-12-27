import mongoose, { Schema, Document, Model } from 'mongoose';

// ============================================
// User Interface & Schema
// ============================================
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  username: string;
  gamerTag: string;
  avatar: string;
  bio: string;
  favoriteGames: string[];
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  isOnline: boolean;
  lastSeen: Date;
  privacy: {
    showOnlineStatus: boolean;
    showActivity: boolean;
    allowMessages: 'everyone' | 'followers' | 'none';
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Don't include password by default in queries
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    gamerTag: {
      type: String,
      required: [true, 'Gamer tag is required'],
      trim: true,
      maxlength: 50,
    },
    avatar: {
      type: String,
      default: '/avatars/default.png',
    },
    bio: {
      type: String,
      maxlength: 500,
      default: '',
    },
    favoriteGames: [{
      type: String,
    }],
    followers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    following: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    privacy: {
      showOnlineStatus: { type: Boolean, default: true },
      showActivity: { type: Boolean, default: true },
      allowMessages: {
        type: String,
        enum: ['everyone', 'followers', 'none'],
        default: 'everyone',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ gamerTag: 'text', username: 'text' });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
