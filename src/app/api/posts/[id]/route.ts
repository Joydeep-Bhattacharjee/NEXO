import { NextRequest } from 'next/server';
import { connectDB, isMockMode } from '@/lib/db/connection';
import { Post } from '@/lib/db/models';
import { authenticateRequest } from '@/lib/auth/jwt';
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse, handleApiError } from '@/lib/api/response';
import { mockPosts } from '@/lib/db/mockData';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/posts/[id]
 * Get a single post by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Mock mode: return mock post
    if (isMockMode()) {
      const post = mockPosts.find(p => p._id === params.id) || mockPosts[0];
      return successResponse({ ...post, viewCount: (post.viewCount || 0) + 1 });
    }
    
    await connectDB();
    
    const post = await Post.findById(params.id)
      .populate('author', 'username gamerTag avatar')
      .populate('comments.user', 'username avatar');
    
    if (!post) {
      return notFoundResponse('Post');
    }
    
    // Increment view count
    post.viewCount += 1;
    await post.save();
    
    return successResponse(post);
    
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/posts/[id]
 * Update a post
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
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
    
    // Check ownership
    if (post.author.toString() !== payload.userId) {
      return errorResponse('Not authorized to edit this post', 403);
    }
    
    const body = await request.json();
    const { content, images, gameTag, visibility } = body;
    
    if (content) post.content = content;
    if (images) post.images = images;
    if (gameTag !== undefined) post.gameTag = gameTag;
    if (visibility) post.visibility = visibility;
    post.isEdited = true;
    
    await post.save();
    await post.populate('author', 'username gamerTag avatar');
    
    return successResponse(post, 'Post updated successfully');
    
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/posts/[id]
 * Delete a post
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
    
    // Check ownership
    if (post.author.toString() !== payload.userId) {
      return errorResponse('Not authorized to delete this post', 403);
    }
    
    await post.deleteOne();
    
    return successResponse(null, 'Post deleted successfully');
    
  } catch (error) {
    return handleApiError(error);
  }
}
