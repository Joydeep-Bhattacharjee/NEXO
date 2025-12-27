import mongoose, { Schema, Document, Model } from 'mongoose';

// ============================================
// Game Hub Interface & Schema
// ============================================
export interface IGameHub extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  icon: string;
  genre: string[];
  platforms: string[];
  releaseDate: Date;
  developer: string;
  publisher: string;
  members: mongoose.Types.ObjectId[];
  moderators: mongoose.Types.ObjectId[];
  stats: {
    totalPosts: number;
    totalVideos: number;
    activeUsers: number;
  };
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GameHubSchema = new Schema<IGameHub>(
  {
    name: {
      type: String,
      required: [true, 'Game name is required'],
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: 2000,
      default: '',
    },
    coverImage: {
      type: String,
      default: '/games/default-cover.jpg',
    },
    icon: {
      type: String,
      default: '/games/default-icon.png',
    },
    genre: [{
      type: String,
    }],
    platforms: [{
      type: String,
      enum: ['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile', 'Cross-Platform'],
    }],
    releaseDate: {
      type: Date,
    },
    developer: {
      type: String,
    },
    publisher: {
      type: String,
    },
    members: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    moderators: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    stats: {
      totalPosts: { type: Number, default: 0 },
      totalVideos: { type: Number, default: 0 },
      activeUsers: { type: Number, default: 0 },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
GameHubSchema.index({ slug: 1 });
GameHubSchema.index({ name: 'text', description: 'text' });

export const GameHub: Model<IGameHub> = mongoose.models.GameHub || mongoose.model<IGameHub>('GameHub', GameHubSchema);

export default GameHub;
