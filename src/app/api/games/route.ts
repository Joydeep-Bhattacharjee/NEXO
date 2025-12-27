import { NextRequest } from 'next/server';
import { connectDB, isMockMode } from '@/lib/db/connection';
import { GameHub } from '@/lib/db/models';
import { authenticateRequest } from '@/lib/auth/jwt';
import { successResponse, errorResponse, unauthorizedResponse, handleApiError } from '@/lib/api/response';
import { mockGameHubs } from '@/lib/db/mockData';

/**
 * GET /api/games
 * Get all game hubs
 */
export async function GET(request: NextRequest) {
  try {
    // Mock mode
    if (isMockMode()) {
      const { searchParams } = new URL(request.url);
      const search = searchParams.get('search')?.toLowerCase();
      
      let filtered = mockGameHubs;
      if (search) {
        filtered = mockGameHubs.filter(g => 
          g.name.toLowerCase().includes(search) || 
          g.description.toLowerCase().includes(search)
        );
      }
      
      return successResponse(filtered);
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    let query: any = {};
    if (search) {
      query = { $text: { $search: search } };
    }
    
    const games = await GameHub.find(query)
      .sort({ 'stats.activeUsers': -1, name: 1 });
    
    return successResponse(games);
    
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/games
 * Create a new game hub (admin only - simplified for MVP)
 */
export async function POST(request: NextRequest) {
  try {
    const payload = authenticateRequest(request);
    
    if (!payload) {
      return unauthorizedResponse();
    }
    
    await connectDB();
    
    const body = await request.json();
    const { name, description, coverImage, icon, genre, platforms, developer, publisher } = body;
    
    if (!name) {
      return errorResponse('Game name is required', 400);
    }
    
    // Create slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const gameHub = await GameHub.create({
      name,
      slug,
      description: description || '',
      coverImage: coverImage || '/games/default-cover.jpg',
      icon: icon || '/games/default-icon.png',
      genre: genre || [],
      platforms: platforms || [],
      developer: developer || '',
      publisher: publisher || '',
      moderators: [payload.userId],
    });
    
    return successResponse(gameHub, 'Game hub created', 201);
    
  } catch (error) {
    return handleApiError(error);
  }
}
