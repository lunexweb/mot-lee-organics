import { useState, useCallback } from 'react';
import { RateLimitingService } from '@/services/rateLimitingService';
import { toast } from 'sonner';

export interface UseRateLimitOptions {
  endpoint: string;
  identifier?: string;
  onRateLimitExceeded?: (message: string) => void;
}

export const useRateLimit = (options: UseRateLimitOptions) => {
  const { endpoint, identifier = 'anonymous', onRateLimitExceeded } = options;
  const [isRateLimited, setIsRateLimited] = useState(false);

  const checkRateLimit = useCallback(() => {
    const result = RateLimitingService.checkRateLimit(identifier, endpoint);
    
    if (!result.allowed) {
      setIsRateLimited(true);
      const message = result.message || 'Rate limit exceeded';
      
      if (onRateLimitExceeded) {
        onRateLimitExceeded(message);
      } else {
        toast.error(message);
      }
      
      return false;
    }
    
    setIsRateLimited(false);
    return true;
  }, [identifier, endpoint, onRateLimitExceeded]);

  const getRemainingRequests = useCallback(() => {
    return RateLimitingService.getRemainingRequests(identifier, endpoint);
  }, [identifier, endpoint]);

  const getResetTime = useCallback(() => {
    return RateLimitingService.getResetTime(identifier, endpoint);
  }, [identifier, endpoint]);

  const getStats = useCallback(() => {
    return RateLimitingService.getStats(identifier, endpoint);
  }, [identifier, endpoint]);

  const reset = useCallback(() => {
    RateLimitingService.reset(identifier, endpoint);
    setIsRateLimited(false);
  }, [identifier, endpoint]);

  return {
    checkRateLimit,
    isRateLimited,
    getRemainingRequests,
    getResetTime,
    getStats,
    reset
  };
};
