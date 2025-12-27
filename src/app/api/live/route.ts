import { NextRequest } from 'next/server';
import { connectDB, isMockMode } from '@/lib/db/connection';
import { LiveStream } from '@/lib/db/models';
import { authenticateRequest, generateStreamKey } from '@/lib/auth/jwt';
import { successResponse, errorResponse, unauthorizedResponse, handleApiError } from '@/lib/api/response';
import { mockLiveStreams } from '@/lib/db/mockData';

/**
 * GET /api/live
 * Get all live streams
 */
export async function GET(request: NextRequest) {
  try {
    // Mock mode
    if (isMockMode()) {
      return successResponse({ data: mockLiveStreams });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const gameTag = searchParams.get('gameTag');
    const liveOnly = searchParams.get('live') !== 'false';
    
    // Build query
    const query: any = {};
    if (liveOnly) {
      query.isLive = true;
    }
    if (gameTag) {
      query.gameTag = gameTag;
    }
    
    const streams = await LiveStream.find(query)
      .populate('streamer', 'username gamerTag avatar')
      .sort({ viewerCount: -1, startedAt: -1 });
    
    return successResponse(streams);
    
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/live
 * Create a new stream (go live)
 */
export async function POST(request: NextRequest) {
  try {
    const payload = authenticateRequest(request);
    
    if (!payload) {
      return unauthorizedResponse();
    }
    
    await connectDB();
    
    const body = await request.json();
    const { title, description, gameTag, tags } = body;
    
    if (!title || !gameTag) {
      return errorResponse('Title and game tag are required', 400);
    }
    
    // Check if user already has a live stream
    const existingStream = await LiveStream.findOne({
      streamer: payload.userId,
      isLive: true,
    });
    
    if (existingStream) {
      return errorResponse('You already have an active stream', 400);
    }
    
    // Generate stream key
    const streamKey = generateStreamKey();
    
    const stream = await LiveStream.create({
      streamer: payload.userId,
      title: title.trim(),
      description: description?.trim() || '',
      streamKey,
      gameTag,
      tags: tags || [],
      isLive: true,
      startedAt: new Date(),
    });
    
    await stream.populate('streamer', 'username gamerTag avatar');
    
    // Return with stream key (only shown once)
    return successResponse({
      stream,
      streamKey, // Include for streamer to use
    }, 'Stream created', 201);
    
  } catch (error) {
    return handleApiError(error);
  }
}
