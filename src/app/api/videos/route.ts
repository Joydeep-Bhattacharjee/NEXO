import { NextRequest } from 'next/server';
import { connectDB, isMockMode } from '@/lib/db/connection';
import { Video } from '@/lib/db/models';
import { authenticateRequest } from '@/lib/auth/jwt';
import { successResponse, errorResponse, unauthorizedResponse, handleApiError } from '@/lib/api/response';
import { mockVideos } from '@/lib/db/mockData';

/**
 * GET /api/videos
 * Get all videos
 */
export async function GET(request: NextRequest) {
  try {
    // Mock mode
    if (isMockMode()) {
      const { searchParams } = new URL(request.url);
      const limit = parseInt(searchParams.get('limit') || '12');
      
      return successResponse({
        videos: mockVideos.slice(0, limit),
        pagination: {
          page: 1,
          limit,
          total: mockVideos.length,
          pages: 1,
        },
      });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const gameTag = searchParams.get('gameTag');
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query: any = { visibility: 'public', isProcessing: false };
    if (gameTag) {
      query.gameTag = gameTag;
    }
    
    const videos = await Video.find(query)
      .populate('author', 'username gamerTag avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Video.countDocuments(query);
    
    return successResponse({
      videos,
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
 * POST /api/videos
 * Upload a new video (mock - stores metadata only)
 */
export async function POST(request: NextRequest) {
  try {
    const payload = authenticateRequest(request);
    
    if (!payload) {
      return unauthorizedResponse();
    }
    
    await connectDB();
    
    const body = await request.json();
    const { title, description, thumbnailUrl, videoUrl, duration, gameTag, tags, visibility } = body;
    
    if (!title || !gameTag) {
      return errorResponse('Title and game tag are required', 400);
    }
    
    const video = await Video.create({
      author: payload.userId,
      title: title.trim(),
      description: description?.trim() || '',
      thumbnailUrl: thumbnailUrl || '/thumbnails/default.jpg',
      videoUrl: videoUrl || '/videos/sample.mp4',
      duration: duration || 0,
      gameTag,
      tags: tags || [],
      visibility: visibility || 'public',
    });
    
    await video.populate('author', 'username gamerTag avatar');
    
    return successResponse(video, 'Video uploaded successfully', 201);
    
  } catch (error) {
    return handleApiError(error);
  }
}
