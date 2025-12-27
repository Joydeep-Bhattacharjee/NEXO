import mongoose, { Schema, Document, Model } from 'mongoose';
import { IReaction } from './Post';

// ============================================
// Video Interface & Schema
// ============================================
export interface IVideo extends Document {
  _id: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number; // in seconds
  reactions: IReaction[];
  comments: mongoose.Types.ObjectId[];
  gameTag: string;
  tags: string[];
  viewCount: number;
  isProcessing: boolean;
  visibility: 'public' | 'followers' | 'private';
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

const VideoSchema = new Schema<IVideo>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Video title is required'],
      maxlength: 200,
    },
    description: {
      type: String,
      maxlength: 2000,
      default: '',
    },
    thumbnailUrl: {
      type: String,
      default: '/thumbnails/default.jpg',
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required'],
    },
    duration: {
      type: Number,
      default: 0,
    },
    reactions: [ReactionSchema],
    comments: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    }],
    gameTag: {
      type: String,
      required: [true, 'Game tag is required'],
    },
    tags: [{
      type: String,
    }],
    viewCount: {
      type: Number,
      default: 0,
    },
    isProcessing: {
      type: Boolean,
      default: false,
    },
    visibility: {
      type: String,
      enum: ['public', 'followers', 'private'],
      default: 'public',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
VideoSchema.index({ author: 1, createdAt: -1 });
VideoSchema.index({ gameTag: 1 });
VideoSchema.index({ tags: 1 });
VideoSchema.index({ title: 'text', description: 'text' });

export const Video: Model<IVideo> = mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);

export default Video;
