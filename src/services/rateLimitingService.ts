interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class RateLimitingService {
  private static limits: Map<string, RateLimitEntry> = new Map();
  private static configs: Map<string, RateLimitConfig> = new Map();

  // Default rate limit configurations
  private static defaultConfigs: Record<string, RateLimitConfig> = {
    login: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5,
      message: 'Too many login attempts. Please try again later.'
    },
    register: {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 3,
      message: 'Too many registration attempts. Please try again later.'
    },
    addToCart: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 20,
      message: 'Too many cart operations. Please slow down.'
    },
    placeOrder: {
      windowMs: 5 * 60 * 1000, // 5 minutes
      maxRequests: 3,
      message: 'Too many order attempts. Please try again later.'
    },
    addReview: {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 5,
      message: 'Too many review submissions. Please try again later.'
    },
    applyCoupon: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 10,
      message: 'Too many coupon attempts. Please slow down.'
    },
    general: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 100,
      message: 'Too many requests. Please slow down.'
    }
  };

  static initialize() {
    // Initialize default configurations
    Object.entries(this.defaultConfigs).forEach(([key, config]) => {
      this.configs.set(key, config);
    });
  }

  static setConfig(endpoint: string, config: RateLimitConfig) {
    this.configs.set(endpoint, config);
  }

  static checkRateLimit(identifier: string, endpoint: string = 'general'): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    message?: string;
  } {
    const config = this.configs.get(endpoint) || this.defaultConfigs.general;
    const key = `${identifier}:${endpoint}`;
    const now = Date.now();
    
    let entry = this.limits.get(key);
    
    // If no entry exists or window has expired, create new entry
    if (!entry || now > entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + config.windowMs
      };
      this.limits.set(key, entry);
    }
    
    // Increment request count
    entry.count++;
    
    // Check if limit exceeded
    if (entry.count > config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        message: config.message
      };
    }
    
    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetTime
    };
  }

  static getRemainingRequests(identifier: string, endpoint: string = 'general'): number {
    const key = `${identifier}:${endpoint}`;
    const entry = this.limits.get(key);
    
    if (!entry) {
      const config = this.configs.get(endpoint) || this.defaultConfigs.general;
      return config.maxRequests;
    }
    
    const now = Date.now();
    if (now > entry.resetTime) {
      const config = this.configs.get(endpoint) || this.defaultConfigs.general;
      return config.maxRequests;
    }
    
    const config = this.configs.get(endpoint) || this.defaultConfigs.general;
    return Math.max(0, config.maxRequests - entry.count);
  }

  static getResetTime(identifier: string, endpoint: string = 'general'): number {
    const key = `${identifier}:${endpoint}`;
    const entry = this.limits.get(key);
    
    if (!entry) {
      const now = Date.now();
      const config = this.configs.get(endpoint) || this.defaultConfigs.general;
      return now + config.windowMs;
    }
    
    return entry.resetTime;
  }

  static reset(identifier: string, endpoint?: string) {
    if (endpoint) {
      const key = `${identifier}:${endpoint}`;
      this.limits.delete(key);
    } else {
      // Reset all limits for this identifier
      const keysToDelete: string[] = [];
      this.limits.forEach((_, key) => {
        if (key.startsWith(`${identifier}:`)) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach(key => this.limits.delete(key));
    }
  }

  static cleanup() {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.limits.forEach((entry, key) => {
      if (now > entry.resetTime) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.limits.delete(key));
  }

  static getStats(identifier: string, endpoint: string = 'general') {
    const key = `${identifier}:${endpoint}`;
    const entry = this.limits.get(key);
    const config = this.configs.get(endpoint) || this.defaultConfigs.general;
    
    if (!entry) {
      return {
        count: 0,
        limit: config.maxRequests,
        remaining: config.maxRequests,
        resetTime: Date.now() + config.windowMs
      };
    }
    
    const now = Date.now();
    if (now > entry.resetTime) {
      return {
        count: 0,
        limit: config.maxRequests,
        remaining: config.maxRequests,
        resetTime: now + config.windowMs
      };
    }
    
    return {
      count: entry.count,
      limit: config.maxRequests,
      remaining: Math.max(0, config.maxRequests - entry.count),
      resetTime: entry.resetTime
    };
  }
}

// Initialize rate limiting on module load
RateLimitingService.initialize();

// Cleanup expired entries every 5 minutes
setInterval(() => {
  RateLimitingService.cleanup();
}, 5 * 60 * 1000);
