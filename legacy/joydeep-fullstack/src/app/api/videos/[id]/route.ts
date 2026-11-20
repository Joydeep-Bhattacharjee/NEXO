import { NextRequest } from 'next/server';
import { connectDB, isMockMode } from '@/lib/db/connection';
import { Video } from '@/lib/db/models';
import { authenticateRequest } from '@/lib/auth/jwt';
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse, handleApiError } from '@/lib/api/response';
import { mockVideos } from '@/lib/db/mockData';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/videos/[id]
 * Get a single video by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Mock mode: return mock video
    if (isMockMode()) {
      const video = mockVideos.find(v => v._id === params.id) || mockVideos[0];
      return successResponse({ ...video, viewCount: (video?.viewCount || 0) + 1 });
    }
    
    await connectDB();
    
    const video = await Video.findById(params.id)
      .populate('author', 'username gamerTag avatar');
    
    if (!video) {
      return notFoundResponse('Video');
    }
    
    // Increment view count
    video.viewCount += 1;
    await video.save();
    
    return successResponse(video);
    
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/videos/[id]
 * Delete a video
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = authenticateRequest(request);
    
    if (!payload) {
      return unauthorizedResponse();
    }
    
    await connectDB();
    
    const video = await Video.findById(params.id);
    
    if (!video) {
      return notFoundResponse('Video');
    }
    
    // Check ownership
    if (video.author.toString() !== payload.userId) {
      return errorResponse('Not authorized to delete this video', 403);
    }
    
    await video.deleteOne();
    
    return successResponse(null, 'Video deleted successfully');
    
  } catch (error) {
    return handleApiError(error);
  }
}
