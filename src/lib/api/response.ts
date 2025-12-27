import { NextResponse } from 'next/server';

// Standard API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Send success response
 */
export function successResponse<T>(data: T, message?: string, status: number = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    } as ApiResponse<T>,
    { status }
  );
}

/**
 * Send error response
 */
export function errorResponse(error: string, status: number = 400): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error,
    } as ApiResponse,
    { status }
  );
}

/**
 * Send unauthorized response
 */
export function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse {
  return errorResponse(message, 401);
}

/**
 * Send not found response
 */
export function notFoundResponse(resource: string = 'Resource'): NextResponse {
  return errorResponse(`${resource} not found`, 404);
}

/**
 * Send validation error response
 */
export function validationError(errors: Record<string, string>): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      errors,
    },
    { status: 422 }
  );
}

/**
 * Handle API errors
 */
export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);
  
  if (error instanceof Error) {
    // MongoDB duplicate key error
    if (error.message.includes('duplicate key')) {
      return errorResponse('This resource already exists', 409);
    }
    
    // Validation errors
    if (error.message.includes('validation failed')) {
      return errorResponse(error.message, 422);
    }
    
    return errorResponse(error.message, 500);
  }
  
  return errorResponse('An unexpected error occurred', 500);
}
