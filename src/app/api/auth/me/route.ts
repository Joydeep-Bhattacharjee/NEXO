import { NextRequest } from 'next/server';
import { connectDB, isMockMode } from '@/lib/db/connection';
import { User } from '@/lib/db/models';
import { authenticateRequest } from '@/lib/auth/jwt';
import { successResponse, errorResponse, unauthorizedResponse, handleApiError } from '@/lib/api/response';
import { demoUser } from '@/lib/db/mockData';

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const payload = authenticateRequest(request);
    
    // In mock mode, return demo user if token starts with 'mock-'
    if (isMockMode()) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.includes('mock-')) {
        return successResponse({
          _id: demoUser._id,
          email: demoUser.email,
          username: demoUser.username,
          gamerTag: demoUser.gamerTag,
          avatar: demoUser.avatar,
          bio: demoUser.bio,
          favoriteGames: demoUser.favoriteGames,
          followers: [],
          following: [],
          isOnline: true,
          privacy: { showOnlineStatus: true, allowDirectMessages: true },
          createdAt: demoUser.createdAt,
        });
      }
      return unauthorizedResponse();
    }

    if (!payload) {
      return unauthorizedResponse();
    }
    
    await connectDB();
    
    const user = await User.findById(payload.userId)
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar');
    
    if (!user) {
      return errorResponse('User not found', 404);
    }
    
    const userData = {
      _id: user._id,
      email: user.email,
      username: user.username,
      gamerTag: user.gamerTag,
      avatar: user.avatar,
      bio: user.bio,
      favoriteGames: user.favoriteGames,
      followers: user.followers,
      following: user.following,
      isOnline: user.isOnline,
      privacy: user.privacy,
      createdAt: user.createdAt,
    };
    
    return successResponse(userData);
    
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/auth/me
 * Update current user profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const payload = authenticateRequest(request);
    
    // In mock mode, return success with demo user
    if (isMockMode()) {
      const body = await request.json();
      return successResponse({
        ...demoUser,
        ...body,
      }, 'Profile updated successfully');
    }
    
    if (!payload) {
      return unauthorizedResponse();
    }
    
    await connectDB();
    
    const body = await request.json();
    const { username, gamerTag, avatar, bio, favoriteGames, privacy } = body;
    
    // Check if username is being changed and is unique
    if (username) {
      const existingUser = await User.findOne({ username, _id: { $ne: payload.userId } });
      if (existingUser) {
        return errorResponse('Username already taken', 409);
      }
    }
    
    const updateData: any = {};
    if (username) updateData.username = username;
    if (gamerTag) updateData.gamerTag = gamerTag;
    if (avatar) updateData.avatar = avatar;
    if (bio !== undefined) updateData.bio = bio;
    if (favoriteGames) updateData.favoriteGames = favoriteGames;
    if (privacy) updateData.privacy = privacy;
    
    const user = await User.findByIdAndUpdate(
      payload.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return errorResponse('User not found', 404);
    }
    
    return successResponse(user, 'Profile updated successfully');
    
  } catch (error) {
    return handleApiError(error);
  }
}
