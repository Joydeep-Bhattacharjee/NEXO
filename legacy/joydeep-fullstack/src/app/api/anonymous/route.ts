import { NextRequest } from 'next/server';
import { connectDB, isMockMode } from '@/lib/db/connection';
import { AnonymousPost } from '@/lib/db/models';
import { authenticateRequest, generateAnonymousId } from '@/lib/auth/jwt';
import { successResponse, errorResponse, unauthorizedResponse, handleApiError } from '@/lib/api/response';
import { mockAnonymousPosts } from '@/lib/db/mockData';

/**
 * GET /api/anonymous
 * Get anonymous posts
 */
export async function GET(request: NextRequest) {
  try {
    // Mock mode: return mock anonymous posts
    if (isMockMode()) {
      const { searchParams } = new URL(request.url);
      const community = searchParams.get('community');
      let posts = mockAnonymousPosts;
      if (community) {
        posts = posts.filter(p => p.community === community);
      }
      const communities = Array.from(new Set(mockAnonymousPosts.map(p => p.community)));
      return successResponse({
        posts,
        communities,
        pagination: { page: 1, limit: 20, total: posts.length, pages: 1 },
      });
    }
    
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const community = searchParams.get('community');
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = { isHidden: false };
    if (community) {
      query.community = community;
    }
    
    const posts = await AnonymousPost.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await AnonymousPost.countDocuments(query);
    
    // Get available communities
    const communities = await AnonymousPost.distinct('community');
    
    return successResponse({
      posts,
      communities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/anonymous
 * Create an anonymous post
 */
export async function POST(request: NextRequest) {
  try {
    const payload = authenticateRequest(request);
    
    // Mock mode: return mock created post
    if (isMockMode()) {
      const body = await request.json();
      const anonymousId = 'Mock_User_' + Math.random().toString(36).substr(2, 4);
      return successResponse({
        _id: 'mock-anon-' + Date.now(),
        anonymousId,
        content: body.content,
        community: body.community || 'general',
        reactions: [],
        comments: [],
        viewCount: 0,
        isHidden: false,
        createdAt: new Date().toISOString(),
      }, 'Anonymous post created successfully');
    }
    
    if (!payload) {
      return unauthorizedResponse();
    }
    
    await connectDB();
    
    const body = await request.json();
    const { content, images, community, tags } = body;
    
    if (!content || content.trim().length === 0) {
      return errorResponse('Post content is required', 400);
    }
    
    if (!community) {
      return errorResponse('Community is required', 400);
    }
    
    // Generate anonymous ID for this post
    const anonymousId = generateAnonymousId();
    
    const post = await AnonymousPost.create({
      author: payload.userId,
      anonymousId,
      content: content.trim(),
      images: images || [],
      community,
      tags: tags || [],
    });
    
    // Return without author info
    const responsePost = post.toObject();
    delete (responsePost as any).author;
    
    return successResponse(responsePost, 'Anonymous post created', 201);
    
  } catch (error) {
    return handleApiError(error);
  }
}
