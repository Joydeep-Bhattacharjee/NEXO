import { NextRequest } from 'next/server';
import { connectDB, isMockMode } from '@/lib/db/connection';
import { GameHub, Post, Video } from '@/lib/db/models';
import { authenticateRequest } from '@/lib/auth/jwt';
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse, handleApiError } from '@/lib/api/response';
import { mockGameHubs, mockPosts, mockVideos } from '@/lib/db/mockData';

interface RouteParams {
  params: { slug: string };
}

/**
 * GET /api/games/[slug]
 * Get a game hub by slug with posts and videos
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Mock mode: return mock game hub data
    if (isMockMode()) {
      const gameHub = mockGameHubs.find(g => g.slug === params.slug) || mockGameHubs[0];
      const posts = mockPosts.filter(p => p.gameTag === gameHub?.name);
      const videos = mockVideos.filter(v => v.gameTag === gameHub?.name);
      return successResponse({ gameHub, posts, videos });
    }
    
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const tab = searchParams.get('tab') || 'all'; // all, posts, videos
    
    const gameHub = await GameHub.findOne({ slug: params.slug })
      .populate('moderators', 'username avatar');
    
    if (!gameHub) {
      return notFoundResponse('Game hub');
    }
    
    // Get posts and videos for this game
    let posts: any[] = [];
    let videos: any[] = [];
    
    if (tab === 'all' || tab === 'posts') {
      posts = await Post.find({ gameTag: gameHub.name, visibility: 'public' })
        .populate('author', 'username gamerTag avatar')
        .sort({ createdAt: -1 })
        .limit(20);
    }
    
    if (tab === 'all' || tab === 'videos') {
      videos = await Video.find({ gameTag: gameHub.name, visibility: 'public' })
        .populate('author', 'username gamerTag avatar')
        .sort({ createdAt: -1 })
        .limit(12);
    }
    
    return successResponse({
      gameHub,
      posts,
      videos,
    });
    
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/games/[slug]/join
 * Join a game hub
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = authenticateRequest(request);
    
    if (!payload) {
      return unauthorizedResponse();
    }
    
    await connectDB();
    
    const gameHub = await GameHub.findOne({ slug: params.slug });
    
    if (!gameHub) {
      return notFoundResponse('Game hub');
    }
    
    // Check if already a member
    const isMember = gameHub.members.some(
      (m: any) => m.toString() === payload.userId
    );
    
    if (isMember) {
      return errorResponse('Already a member', 400);
    }
    
    gameHub.members.push(payload.userId as any);
    gameHub.stats.activeUsers += 1;
    await gameHub.save();
    
    return successResponse({ joined: true }, 'Joined game hub');
    
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/games/[slug]/join
 * Leave a game hub
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const payload = authenticateRequest(request);
    
    if (!payload) {
      return unauthorizedResponse();
    }
    
    await connectDB();
    
    const gameHub = await GameHub.findOne({ slug: params.slug });
    
    if (!gameHub) {
      return notFoundResponse('Game hub');
    }
    
    gameHub.members = gameHub.members.filter(
      (m: any) => m.toString() !== payload.userId
    );
    gameHub.stats.activeUsers = Math.max(0, gameHub.stats.activeUsers - 1);
    await gameHub.save();
    
    return successResponse({ left: true }, 'Left game hub');
    
  } catch (error) {
    return handleApiError(error);
  }
}
