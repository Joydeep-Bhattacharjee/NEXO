import mongoose, { Schema, Document, Model } from 'mongoose';
import { IReaction } from './Post';

// ============================================
// Anonymous Post Interface & Schema
// ============================================
export interface IAnonymousPost extends Document {
  _id: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId; // Hidden from public
  anonymousId: string; // Display ID like "Anon#1234"
  content: string;
  images: string[];
  reactions: IReaction[];
  comments: {
    anonymousId: string;
    content: string;
    reactions: IReaction[];
    createdAt: Date;
  }[];
  community: string; // Sub-community name
  tags: string[];
  viewCount: number;
  reportCount: number;
  isHidden: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReactionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['like', 'love', 'fire', 'sad', 'angry'],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const AnonymousCommentSchema = new Schema(
  {
    anonymousId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    reactions: [ReactionSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const AnonymousPostSchema = new Schema<IAnonymousPost>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false, // Never expose real author
    },
    anonymousId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
      maxlength: 5000,
    },
    images: [{
      type: String,
    }],
    reactions: [ReactionSchema],
    comments: [AnonymousCommentSchema],
    community: {
      type: String,
      required: [true, 'Community is required'],
    },
    tags: [{
      type: String,
    }],
    viewCount: {
      type: Number,
      default: 0,
    },
    reportCount: {
      type: Number,
      default: 0,
      select: false,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
AnonymousPostSchema.index({ community: 1, createdAt: -1 });
AnonymousPostSchema.index({ tags: 1 });
AnonymousPostSchema.index({ content: 'text' });

export const AnonymousPost: Model<IAnonymousPost> = 
  mongoose.models.AnonymousPost || mongoose.model<IAnonymousPost>('AnonymousPost', AnonymousPostSchema);

export default AnonymousPost;
