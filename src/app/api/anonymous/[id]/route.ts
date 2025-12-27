import { NextRequest } from 'next/server';
import { connectDB, isMockMode } from '@/lib/db/connection';
import { AnonymousPost } from '@/lib/db/models';
import { authenticateRequest, generateAnonymousId } from '@/lib/auth/jwt';
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse, handleApiError } from '@/lib/api/response';
import { mockAnonymousPosts } from '@/lib/db/mockData';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/anonymous/[id]
 * Get a single anonymous post
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Mock mode: return mock anonymous post
    if (isMockMode()) {
      const post = mockAnonymousPosts.find(p => p._id === params.id);
      if (!post || post.isHidden) {
        return notFoundResponse('Post');
      }
      return successResponse({ ...post, viewCount: post.viewCount + 1 });
    }
    
    await connectDB();
    
    const post = await AnonymousPost.findById(params.id);
    
    if (!post || post.isHidden) {
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
 * POST /api/anonymous/[id]/comment
 * Add anonymous comment to a post
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = authenticateRequest(request);
    
    if (!payload) {
      return unauthorizedResponse();
    }
    
    await connectDB();
    
    const body = await request.json();
    const { content } = body;
    
    if (!content || content.trim().length === 0) {
      return errorResponse('Comment content is required', 400);
    }
    
    const post = await AnonymousPost.findById(params.id);
    
    if (!post || post.isHidden) {
      return notFoundResponse('Post');
    }
    
    // Generate anonymous ID for comment
    const anonymousId = generateAnonymousId();
    
    post.comments.push({
      anonymousId,
      content: content.trim(),
      reactions: [],
      createdAt: new Date(),
    });
    
    await post.save();
    
    return successResponse({
      comment: post.comments[post.comments.length - 1],
    }, 'Comment added');
    
  } catch (error) {
    return handleApiError(error);
  }
}
