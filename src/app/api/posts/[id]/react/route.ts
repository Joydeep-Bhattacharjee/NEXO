import { NextRequest } from 'next/server';
import { connectDB, isMockMode } from '@/lib/db/connection';
import { Post, ReactionType } from '@/lib/db/models';
import { authenticateRequest } from '@/lib/auth/jwt';
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse, handleApiError } from '@/lib/api/response';
import { mockPosts } from '@/lib/db/mockData';

interface RouteParams {
  params: { id: string };
}

/**
 * POST /api/posts/[id]/react
 * Add or update reaction on a post
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = authenticateRequest(request);
    
    // Mock mode: return success with mock reaction
    if (isMockMode()) {
      const body = await request.json();
      const post = mockPosts.find(p => p._id === params.id) || mockPosts[0];
      return successResponse({
        ...post,
        reactions: [...(post?.reactions || []), { user: 'demo-user', type: body.type }]
      }, 'Reaction added');
    }
    
    if (!payload) {
      return unauthorizedResponse();
    }
    
    await connectDB();
    
    const body = await request.json();
    const { type } = body as { type: ReactionType };
    
    if (!type || !['like', 'love', 'fire', 'sad', 'angry'].includes(type)) {
      return errorResponse('Invalid reaction type', 400);
    }
    
    const post = await Post.findById(params.id);
    
    if (!post) {
      return notFoundResponse('Post');
    }
    
    // Check if user already reacted
    const existingReactionIndex = post.reactions.findIndex(
      (r: any) => r.user.toString() === payload.userId
    );
    
    if (existingReactionIndex > -1) {
      // Update existing reaction
      post.reactions[existingReactionIndex].type = type;
    } else {
      // Add new reaction
      post.reactions.push({
        user: payload.userId as any,
        type,
        createdAt: new Date(),
      });
    }
    
    await post.save();
    
    return successResponse({
      reactions: post.reactions,
      reactionCount: post.reactions.length,
    }, 'Reaction added');
    
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/posts/[id]/react
 * Remove reaction from a post
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = authenticateRequest(request);
    
    if (!payload) {
      return unauthorizedResponse();
    }
    
    await connectDB();
    
    const post = await Post.findById(params.id);
    
    if (!post) {
      return notFoundResponse('Post');
    }
    
    // Remove user's reaction
    post.reactions = post.reactions.filter(
      (r: any) => r.user.toString() !== payload.userId
    );
    
    await post.save();
    
    return successResponse({
      reactions: post.reactions,
      reactionCount: post.reactions.length,
    }, 'Reaction removed');
    
  } catch (error) {
    return handleApiError(error);
  }
}
