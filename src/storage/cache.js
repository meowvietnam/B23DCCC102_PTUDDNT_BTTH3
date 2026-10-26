import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Cache Storage Manager
 * Stores data with savedAt timestamp
 */

/**
 * Retrieves cached item by key
 * @param {string} key
 * @returns {Promise<{ data: any, savedAt: string } | null>}
 */
export async function getCache(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[getCache] Error reading key "${key}":`, err);
    return null;
  }
}

/**
 * Saves data to cache with current timestamp
 * @param {string} key
 * @param {any} data
 * @returns {Promise<void>}
 */
export async function setCache(key, data) {
  try {
    const payload = {
      data,
      savedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(payload));
  } catch (err) {
    console.warn(`[setCache] Error writing key "${key}":`, err);
  }
}

export default {
  getCache,
  setCache,
};
