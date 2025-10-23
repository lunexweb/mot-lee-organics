interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheConfig {
  defaultTTL: number; // Default TTL in milliseconds
  maxSize: number; // Maximum number of entries
  cleanupInterval: number; // Cleanup interval in milliseconds
}

export class CacheService {
  private static cache: Map<string, CacheEntry<any>> = new Map();
  private static config: CacheConfig = {
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxSize: 1000,
    cleanupInterval: 60 * 1000 // 1 minute
  };
  private static cleanupTimer: NodeJS.Timeout | null = null;

  static initialize(config?: Partial<CacheConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }

    // Start cleanup timer
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  static set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const entryTTL = ttl || this.config.defaultTTL;

    // Remove oldest entries if cache is full
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      ttl: entryTTL
    });
  }

  static get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    
    // Check if entry has expired
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  static has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    const now = Date.now();
    
    // Check if entry has expired
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  static delete(key: string): boolean {
    return this.cache.delete(key);
  }

  static clear(): void {
    this.cache.clear();
  }

  static size(): number {
    return this.cache.size;
  }

  static keys(): string[] {
    return Array.from(this.cache.keys());
  }

  static cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  private static evictOldest(): void {
    let oldestKey = '';
    let oldestTimestamp = Date.now();

    this.cache.forEach((entry, key) => {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  static getStats() {
    const now = Date.now();
    let expiredCount = 0;
    let totalSize = 0;

    this.cache.forEach((entry) => {
      totalSize += JSON.stringify(entry.data).length;
      if (now - entry.timestamp > entry.ttl) {
        expiredCount++;
      }
    });

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      expiredEntries: expiredCount,
      totalDataSize: totalSize,
      hitRate: this.calculateHitRate()
    };
  }

  private static hitCount = 0;
  private static missCount = 0;

  static recordHit() {
    this.hitCount++;
  }

  static recordMiss() {
    this.missCount++;
  }

  private static calculateHitRate(): number {
    const total = this.hitCount + this.missCount;
    return total === 0 ? 0 : (this.hitCount / total) * 100;
  }

  static destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.clear();
  }
}

// Cache key generators
export const CacheKeys = {
  products: 'products',
  product: (id: string) => `product:${id}`,
  reviews: (productId: string) => `reviews:${productId}`,
  user: (id: string) => `user:${id}`,
  orders: (userId: string) => `orders:${userId}`,
  cart: (userId: string) => `cart:${userId}`,
  wishlist: (userId: string) => `wishlist:${userId}`,
  coupons: 'coupons',
  inventory: 'inventory',
  lowStock: 'lowStock',
  tracking: (trackingNumber: string) => `tracking:${trackingNumber}`,
  shipping: (province: string, weight: number) => `shipping:${province}:${weight}`
};

// Cache TTL constants (in milliseconds)
export const CacheTTL = {
  SHORT: 60 * 1000, // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 30 * 60 * 1000, // 30 minutes
  VERY_LONG: 60 * 60 * 1000, // 1 hour
  PERSISTENT: 24 * 60 * 60 * 1000 // 24 hours
};

// Initialize cache service
CacheService.initialize();
