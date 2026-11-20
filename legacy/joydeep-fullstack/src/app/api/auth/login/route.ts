import { NextRequest } from 'next/server';
import { connectDB, isMockMode } from '@/lib/db/connection';
import { User } from '@/lib/db/models';
import { comparePassword, generateToken } from '@/lib/auth/jwt';
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response';
import { demoUser } from '@/lib/db/mockData';

/**
 * POST /api/auth/login
 * Authenticate user and return token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // Validation
    if (!email || !password) {
      return errorResponse('Email and password are required', 400);
    }

    // Mock mode - accept any login or use demo credentials
    if (isMockMode()) {
      // Accept demo@nexo.com/demo123 or any credentials
      const mockToken = 'mock-jwt-token-' + Date.now();
      const userData = {
        _id: demoUser._id,
        email: email,
        username: email.split('@')[0] || 'DemoUser',
        gamerTag: `${email.split('@')[0]}#0001`,
        avatar: demoUser.avatar,
        bio: demoUser.bio,
        favoriteGames: demoUser.favoriteGames,
        followers: 0,
        following: 0,
      };
      
      return successResponse({ user: userData, token: mockToken }, 'Login successful (Mock Mode)');
    }

    await connectDB();
    
    // Validation
    if (!email || !password) {
      return errorResponse('Email and password are required', 400);
    }
    
    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return errorResponse('Invalid credentials', 401);
    }
    
    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    
    if (!isValidPassword) {
      return errorResponse('Invalid credentials', 401);
    }
    
    // Update online status
    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();
    
    // Generate token
    const token = generateToken(user);
    
    // Return user data (without password)
    const userData = {
      _id: user._id,
      email: user.email,
      username: user.username,
      gamerTag: user.gamerTag,
      avatar: user.avatar,
      bio: user.bio,
      favoriteGames: user.favoriteGames,
      followers: user.followers.length,
      following: user.following.length,
    };
    
    return successResponse({ user: userData, token }, 'Login successful');
    
  } catch (error) {
    return handleApiError(error);
  }
}
