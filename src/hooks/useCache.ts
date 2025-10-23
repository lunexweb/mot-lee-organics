import { useState, useEffect, useCallback } from 'react';
import { CacheService, CacheKeys, CacheTTL } from '@/services/cacheService';

export interface UseCacheOptions<T> {
  key: string;
  fetcher: () => Promise<T> | T;
  ttl?: number;
  enabled?: boolean;
  dependencies?: any[];
}

export const useCache = <T>(options: UseCacheOptions<T>) => {
  const { key, fetcher, ttl = CacheTTL.MEDIUM, enabled = true, dependencies = [] } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Check cache first
    const cachedData = CacheService.get<T>(key);
    if (cachedData !== null) {
      setData(cachedData);
      CacheService.recordHit();
      return;
    }

    CacheService.recordMiss();
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
      CacheService.set(key, result, ttl);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [key, fetcher, ttl, enabled, ...dependencies]);

  const invalidate = useCallback(() => {
    CacheService.delete(key);
    setData(null);
  }, [key]);

  const refresh = useCallback(() => {
    invalidate();
    fetchData();
  }, [invalidate, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    invalidate,
    refresh
  };
};

// Specialized hooks for common use cases
export const useProductsCache = () => {
  return useCache({
    key: CacheKeys.products,
    fetcher: () => {
      // This would typically fetch from an API
      return Promise.resolve([]);
    },
    ttl: CacheTTL.LONG
  });
};

export const useProductCache = (productId: string) => {
  return useCache({
    key: CacheKeys.product(productId),
    fetcher: () => {
      // This would typically fetch from an API
      return Promise.resolve(null);
    },
    ttl: CacheTTL.MEDIUM,
    dependencies: [productId]
  });
};

export const useReviewsCache = (productId: string) => {
  return useCache({
    key: CacheKeys.reviews(productId),
    fetcher: () => {
      // This would typically fetch from an API
      return Promise.resolve([]);
    },
    ttl: CacheTTL.MEDIUM,
    dependencies: [productId]
  });
};

export const useInventoryCache = () => {
  return useCache({
    key: CacheKeys.inventory,
    fetcher: () => {
      // This would typically fetch from an API
      return Promise.resolve([]);
    },
    ttl: CacheTTL.SHORT
  });
};

export const useLowStockCache = () => {
  return useCache({
    key: CacheKeys.lowStock,
    fetcher: () => {
      // This would typically fetch from an API
      return Promise.resolve([]);
    },
    ttl: CacheTTL.SHORT
  });
};

export const useShippingCache = (province: string, weight: number) => {
  return useCache({
    key: CacheKeys.shipping(province, weight),
    fetcher: () => {
      // This would typically fetch from an API
      return Promise.resolve([]);
    },
    ttl: CacheTTL.LONG,
    dependencies: [province, weight]
  });
};
