import { NextRequest } from 'next/server';
import { connectDB, isMockMode } from '@/lib/db/connection';
import { User } from '@/lib/db/models';
import { hashPassword, generateToken } from '@/lib/auth/jwt';
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response';

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, username } = body;
    
    // Auto-generate gamerTag from username
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const gamerTag = `${username}#${randomNum}`;
    
    // Validation
    if (!email || !password || !username) {
      return errorResponse('All fields are required', 400);
    }
    
    if (password.length < 6) {
      return errorResponse('Password must be at least 6 characters', 400);
    }
    
    if (username.length < 3 || username.length > 30) {
      return errorResponse('Username must be between 3 and 30 characters', 400);
    }

    // Mock mode - just return success with mock user
    if (isMockMode()) {
      const mockToken = 'mock-jwt-token-' + Date.now();
      const userData = {
        _id: 'new-user-' + Date.now(),
        email,
        username,
        gamerTag,
        avatar: '',
        bio: '',
        favoriteGames: [],
        followers: 0,
        following: 0,
      };
      
      return successResponse({ user: userData, token: mockToken }, 'Registration successful (Mock Mode)');
    }

    await connectDB();
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return errorResponse('Email already registered', 409);
      }
      return errorResponse('Username already taken', 409);
    }
    
    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    
    const user = await User.create({
      email,
      password: hashedPassword,
      username,
      gamerTag,
    });
    
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
    };
    
    return successResponse({ user: userData, token }, 'Registration successful', 201);
    
  } catch (error) {
    return handleApiError(error);
  }
}
