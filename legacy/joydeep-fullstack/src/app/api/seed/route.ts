import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { GameHub } from '@/lib/db/models';
import { successResponse, handleApiError } from '@/lib/api/response';

/**
 * POST /api/seed
 * Seed database with initial game hubs (for MVP demo)
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Check if games already exist
    const existingGames = await GameHub.countDocuments();
    if (existingGames > 0) {
      return successResponse({ message: 'Database already seeded' });
    }
    
    // Initial game hubs
    const games = [
      {
        name: 'Valorant',
        slug: 'valorant',
        description: 'A 5v5 character-based tactical shooter by Riot Games. Precise gunplay meets unique agent abilities.',
        genre: ['FPS', 'Tactical Shooter'],
        platforms: ['PC'],
        developer: 'Riot Games',
        publisher: 'Riot Games',
        coverImage: '/games/valorant-cover.jpg',
        icon: '/games/valorant-icon.png',
        isVerified: true,
      },
      {
        name: 'Counter-Strike 2',
        slug: 'cs2',
        description: 'The next evolution of Counter-Strike. A free-to-play competitive shooter with responsive gunplay.',
        genre: ['FPS', 'Tactical Shooter'],
        platforms: ['PC'],
        developer: 'Valve',
        publisher: 'Valve',
        coverImage: '/games/cs2-cover.jpg',
        icon: '/games/cs2-icon.png',
        isVerified: true,
      },
      {
        name: 'PUBG: Battlegrounds',
        slug: 'pubg',
        description: 'The original battle royale experience. Drop in, gear up, and compete to be the last one standing.',
        genre: ['Battle Royale', 'Shooter'],
        platforms: ['PC', 'PlayStation', 'Xbox', 'Mobile'],
        developer: 'KRAFTON',
        publisher: 'KRAFTON',
        coverImage: '/games/pubg-cover.jpg',
        icon: '/games/pubg-icon.png',
        isVerified: true,
      },
      {
        name: 'Minecraft',
        slug: 'minecraft',
        description: 'A sandbox game where players explore blocky, procedurally generated 3D worlds with virtually infinite terrain.',
        genre: ['Sandbox', 'Survival'],
        platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile'],
        developer: 'Mojang Studios',
        publisher: 'Xbox Game Studios',
        coverImage: '/games/minecraft-cover.jpg',
        icon: '/games/minecraft-icon.png',
        isVerified: true,
      },
      {
        name: 'Free Fire',
        slug: 'free-fire',
        description: 'A battle royale game developed by Garena. Fast-paced action with 50 players on a remote island.',
        genre: ['Battle Royale', 'Shooter'],
        platforms: ['Mobile'],
        developer: 'Garena',
        publisher: 'Garena',
        coverImage: '/games/freefire-cover.jpg',
        icon: '/games/freefire-icon.png',
        isVerified: true,
      },
      {
        name: 'League of Legends',
        slug: 'league-of-legends',
        description: 'A fast-paced, competitive online game that blends the speed and intensity of an RTS with RPG elements.',
        genre: ['MOBA'],
        platforms: ['PC'],
        developer: 'Riot Games',
        publisher: 'Riot Games',
        coverImage: '/games/lol-cover.jpg',
        icon: '/games/lol-icon.png',
        isVerified: true,
      },
      {
        name: 'Fortnite',
        slug: 'fortnite',
        description: 'A free-to-play battle royale game with building mechanics and frequent collaborations with popular franchises.',
        genre: ['Battle Royale', 'Shooter'],
        platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile'],
        developer: 'Epic Games',
        publisher: 'Epic Games',
        coverImage: '/games/fortnite-cover.jpg',
        icon: '/games/fortnite-icon.png',
        isVerified: true,
      },
      {
        name: 'Apex Legends',
        slug: 'apex-legends',
        description: 'A free-to-play hero shooter battle royale game. Master an ever-growing roster of diverse Legends.',
        genre: ['Battle Royale', 'Hero Shooter'],
        platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile'],
        developer: 'Respawn Entertainment',
        publisher: 'Electronic Arts',
        coverImage: '/games/apex-cover.jpg',
        icon: '/games/apex-icon.png',
        isVerified: true,
      },
    ];
    
    await GameHub.insertMany(games);
    
    return successResponse({ message: 'Database seeded successfully', gamesAdded: games.length }, 'Seeded', 201);
    
  } catch (error) {
    return handleApiError(error);
  }
}
