import { useState, useEffect, useCallback, useRef } from 'react';
import { getCache, setCache } from '../storage/cache';

/**
 * Custom hook implementing "Cache first, network after" strategy
 * 
 * @param {string} key - Cache key in AsyncStorage
 * @param {() => Promise<any>} fetcher - API fetcher function
 * @returns {{
 *   data: any,
 *   loading: boolean,
 *   error: any,
 *   refreshing: boolean,
 *   lastUpdated: string | null,
 *   refresh: () => Promise<void>
 * }}
 */
export function useCachedQuery(key, fetcher) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  // Primary load: Cache first, then Network
  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      // 1. Try reading from cache first
      try {
        const cached = await getCache(key);
        if (cached && cached.data !== undefined) {
          setData(cached.data);
          setLastUpdated(cached.savedAt);
          // If we had cache, we can turn off full-screen blocking loading
          setLoading(false);
        }
      } catch (cacheErr) {
        console.warn(`[useCachedQuery] Error reading cache for ${key}:`, cacheErr);
      }
    }

    // 2. Fetch fresh data from Network API
    try {
      const freshData = await fetcherRef.current();
      setData(freshData);
      const savedAt = new Date().toISOString();
      setLastUpdated(savedAt);
      setError(null);
      await setCache(key, freshData);
    } catch (apiErr) {
      console.warn(`[useCachedQuery] API fetch failed for ${key}:`, apiErr?.message || apiErr);
      // If we don't have any cached data at all, expose the error
      setData(prev => {
        if (!prev) {
          setError(apiErr);
        }
        return prev;
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [key]);

  useEffect(() => {
    let isMounted = true;
    loadData();
    return () => {
      isMounted = false;
    };
  }, [loadData]);

  const refresh = useCallback(async () => {
    await loadData(true);
  }, [loadData]);

  return {
    data,
    loading,
    error,
    refreshing,
    lastUpdated,
    refresh,
  };
}

export default useCachedQuery;
