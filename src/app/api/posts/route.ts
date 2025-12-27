import { NextRequest } from 'next/server';
import { connectDB, isMockMode } from '@/lib/db/connection';
import { Post } from '@/lib/db/models';
import { authenticateRequest } from '@/lib/auth/jwt';
import { successResponse, errorResponse, unauthorizedResponse, handleApiError } from '@/lib/api/response';
import { mockPosts } from '@/lib/db/mockData';

/**
 * GET /api/posts
 * Get all posts (feed)
 */
export async function GET(request: NextRequest) {
  try {
    // Check if using mock mode
    if (isMockMode()) {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');
      const gameTag = searchParams.get('gameTag');

      let filteredPosts = [...mockPosts];
      if (gameTag) {
        filteredPosts = filteredPosts.filter(p => p.gameTag === gameTag);
      }

      return successResponse({
        posts: filteredPosts.slice(0, limit),
        pagination: {
          page,
          limit,
          total: filteredPosts.length,
          pages: 1,
        },
      });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const gameTag = searchParams.get('gameTag');
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = { visibility: 'public' };
    if (gameTag) {
      query.gameTag = gameTag;
    }
    
    const posts = await Post.find(query)
      .populate('author', 'username gamerTag avatar')
      .populate('comments.user', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Post.countDocuments(query);
    
    return successResponse({
      posts,
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
 * POST /api/posts
 * Create a new post
 */
export async function POST(request: NextRequest) {
  try {
    const payload = authenticateRequest(request);
    
    if (!payload) {
      return unauthorizedResponse();
    }
    
    await connectDB();
    
    const body = await request.json();
    const { content, images, gameTag, visibility } = body;
    
    if (!content || content.trim().length === 0) {
      return errorResponse('Post content is required', 400);
    }
    
    const post = await Post.create({
      author: payload.userId,
      content: content.trim(),
      images: images || [],
      gameTag,
      visibility: visibility || 'public',
    });
    
    // Populate author info
    await post.populate('author', 'username gamerTag avatar');
    
    return successResponse(post, 'Post created successfully', 201);
    
  } catch (error) {
    return handleApiError(error);
  }
}
