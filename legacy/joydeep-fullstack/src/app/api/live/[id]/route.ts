import { NextRequest } from 'next/server';
import { connectDB, isMockMode } from '@/lib/db/connection';
import { LiveStream } from '@/lib/db/models';
import { authenticateRequest } from '@/lib/auth/jwt';
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse, handleApiError } from '@/lib/api/response';
import { mockLiveStreams } from '@/lib/db/mockData';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/live/[id]
 * Get a single live stream
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Mock mode: return mock stream or 404
    if (isMockMode()) {
      const stream = mockLiveStreams.find(s => s._id === params.id);
      if (!stream) {
        return notFoundResponse('Stream');
      }
      return successResponse(stream);
    }
    
    await connectDB();
    
    const stream = await LiveStream.findById(params.id)
      .populate('streamer', 'username gamerTag avatar bio');
    
    if (!stream) {
      return notFoundResponse('Stream');
    }
    
    return successResponse(stream);
    
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/live/[id]
 * Update stream info (for streamer only)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = authenticateRequest(request);
    
    if (!payload) {
      return unauthorizedResponse();
    }
    
    await connectDB();
    
    const stream = await LiveStream.findById(params.id);
    
    if (!stream) {
      return notFoundResponse('Stream');
    }
    
    // Check ownership
    if (stream.streamer.toString() !== payload.userId) {
      return errorResponse('Not authorized', 403);
    }
    
    const body = await request.json();
    const { title, description, gameTag, tags, chatEnabled } = body;
    
    if (title) stream.title = title;
    if (description !== undefined) stream.description = description;
    if (gameTag) stream.gameTag = gameTag;
    if (tags) stream.tags = tags;
    if (chatEnabled !== undefined) stream.chatEnabled = chatEnabled;
    
    await stream.save();
    await stream.populate('streamer', 'username gamerTag avatar');
    
    return successResponse(stream, 'Stream updated');
    
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/live/[id]
 * End a live stream
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = authenticateRequest(request);
    
    if (!payload) {
      return unauthorizedResponse();
    }
    
    await connectDB();
    
    const stream = await LiveStream.findById(params.id);
    
    if (!stream) {
      return notFoundResponse('Stream');
    }
    
    // Check ownership
    if (stream.streamer.toString() !== payload.userId) {
      return errorResponse('Not authorized', 403);
    }
    
    // End the stream
    stream.isLive = false;
    stream.endedAt = new Date();
    await stream.save();
    
    return successResponse(null, 'Stream ended');
    
  } catch (error) {
    return handleApiError(error);
  }
}
