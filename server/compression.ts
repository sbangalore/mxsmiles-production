import compression from 'compression';
import type { Request, Response } from 'express';

// Configure compression middleware with conservative settings for maximum stability
export const compressionMiddleware = compression({
  // Enable compression for text-based responses only
  filter: (req: Request, res: Response) => {
    // Skip compression if explicitly disabled
    if (req.headers['x-no-compression']) {
      return false;
    }
    
    // Skip compression for very small responses to avoid overhead
    const contentLength = res.get('Content-Length');
    if (contentLength && parseInt(contentLength) < 1024) {
      return false;
    }
    
    // Only compress text-based content types
    const contentType = res.get('Content-Type');
    if (contentType) {
      return /^text\/|^application\/(json|javascript|xml)/.test(contentType);
    }
    
    // Use default compression filter as fallback
    return compression.filter(req, res);
  },
  // Conservative compression level for stability
  level: 4,
  // Only compress responses larger than 1KB
  threshold: 1024,
  // Use minimal configuration to avoid zlib parameter issues
});