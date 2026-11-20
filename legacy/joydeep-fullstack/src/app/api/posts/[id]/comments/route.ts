import { NextRequest } from 'next/server';
import { connectDB, isMockMode } from '@/lib/db/connection';
import { Post } from '@/lib/db/models';
import { authenticateRequest } from '@/lib/auth/jwt';
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse, handleApiError } from '@/lib/api/response';
import { mockPosts, demoUser } from '@/lib/db/mockData';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/posts/[id]/comments
 * Get comments for a post
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Mock mode: return mock comments
    if (isMockMode()) {
      const post = mockPosts.find(p => p._id === params.id);
      return successResponse(post?.comments || []);
    }
    
    await connectDB();
    
    const post = await Post.findById(params.id)
      .select('comments')
      .populate('comments.user', 'username avatar');
    
    if (!post) {
      return notFoundResponse('Post');
    }
    
    return successResponse(post.comments);
    
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/posts/[id]/comments
 * Add a comment to a post
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = authenticateRequest(request);
    
    // Mock mode: return success with mock comment
    if (isMockMode()) {
      const body = await request.json();
      return successResponse({
        _id: 'mock-comment-' + Date.now(),
        user: { _id: demoUser._id, username: demoUser.username, avatar: '' },
        content: body.content,
        createdAt: new Date().toISOString(),
      }, 'Comment added');
    }
    
    if (!payload) {
      return unauthorizedResponse();
    }
    
    await connectDB();
    
    const body = await request.json();
    const { content } = body;
    
    if (!content || content.trim().length === 0) {
      return errorResponse('Comment content is required', 400);
    }
    
    const post = await Post.findById(params.id);
    
    if (!post) {
      return notFoundResponse('Post');
    }
    
    const newComment = {
      user: payload.userId,
      content: content.trim(),
      reactions: [],
      replies: [],
    };
    
    post.comments.push(newComment as any);
    await post.save();
    
    // Get the populated comment
    await post.populate('comments.user', 'username avatar');
    
    const addedComment = post.comments[post.comments.length - 1];
    
    return successResponse(addedComment, 'Comment added', 201);
    
  } catch (error) {
    return handleApiError(error);
  }
}
