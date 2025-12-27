import mongoose, { Schema, Document, Model } from 'mongoose';

// ============================================
// Live Stream Interface & Schema
// ============================================
export interface ILiveStream extends Document {
  _id: mongoose.Types.ObjectId;
  streamer: mongoose.Types.ObjectId;
  title: string;
  description: string;
  thumbnailUrl: string;
  streamKey: string;
  streamUrl: string;
  gameTag: string;
  tags: string[];
  viewers: mongoose.Types.ObjectId[];
  viewerCount: number;
  peakViewers: number;
  isLive: boolean;
  startedAt: Date;
  endedAt?: Date;
  chatEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LiveStreamSchema = new Schema<ILiveStream>(
  {
    streamer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Stream title is required'],
      maxlength: 200,
    },
    description: {
      type: String,
      maxlength: 1000,
      default: '',
    },
    thumbnailUrl: {
      type: String,
      default: '/streams/default-thumbnail.jpg',
    },
    streamKey: {
      type: String,
      required: true,
      unique: true,
      select: false, // Don't expose stream key
    },
    streamUrl: {
      type: String,
      default: '',
    },
    gameTag: {
      type: String,
      required: [true, 'Game tag is required'],
    },
    tags: [{
      type: String,
    }],
    viewers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    viewerCount: {
      type: Number,
      default: 0,
    },
    peakViewers: {
      type: Number,
      default: 0,
    },
    isLive: {
      type: Boolean,
      default: false,
    },
    startedAt: {
      type: Date,
    },
    endedAt: {
      type: Date,
    },
    chatEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
LiveStreamSchema.index({ streamer: 1 });
LiveStreamSchema.index({ isLive: 1, viewerCount: -1 });
LiveStreamSchema.index({ gameTag: 1, isLive: 1 });

export const LiveStream: Model<ILiveStream> = 
  mongoose.models.LiveStream || mongoose.model<ILiveStream>('LiveStream', LiveStreamSchema);

export default LiveStream;
