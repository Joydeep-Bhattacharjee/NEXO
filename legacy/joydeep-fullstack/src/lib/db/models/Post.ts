import mongoose, { Schema, Document, Model } from 'mongoose';

// ============================================
// Reaction Types
// ============================================
export type ReactionType = 'like' | 'love' | 'fire' | 'sad' | 'angry';

export interface IReaction {
  user: mongoose.Types.ObjectId;
  type: ReactionType;
  createdAt: Date;
}

// ============================================
// Comment Interface
// ============================================
export interface IComment extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  content: string;
  reactions: IReaction[];
  replies: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Post Interface & Schema
// ============================================
export interface IPost extends Document {
  _id: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  images: string[];
  reactions: IReaction[];
  comments: IComment[];
  gameTag?: string;
  visibility: 'public' | 'followers' | 'private';
  isEdited: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReactionSchema = new Schema<IReaction>(
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

const CommentSchema = new Schema<IComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      maxlength: 1000,
    },
    reactions: [ReactionSchema],
    replies: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    }],
  },
  {
    timestamps: true,
  }
);

const PostSchema = new Schema<IPost>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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
    comments: [CommentSchema],
    gameTag: {
      type: String,
    },
    visibility: {
      type: String,
      enum: ['public', 'followers', 'private'],
      default: 'public',
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
PostSchema.index({ author: 1, createdAt: -1 });
PostSchema.index({ gameTag: 1 });
PostSchema.index({ content: 'text' });

export const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
