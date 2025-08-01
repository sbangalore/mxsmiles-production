import type { Request, Response, NextFunction } from 'express';

// Safe compression middleware - just passes through without compression if needed
export const compressionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Simple pass-through middleware for deployment stability
  // This ensures the server starts even if compression fails
  next();
};

console.log('Using safe compression middleware (no compression) for deployment stability');