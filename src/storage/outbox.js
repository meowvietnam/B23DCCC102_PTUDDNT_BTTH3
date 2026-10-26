import AsyncStorage from '@react-native-async-storage/async-storage';
import { KEYS } from './keys';

/**
 * Outbox Storage Queue
 * Queues offline mutation actions: { id, method, url, body, createdAt }
 */

/**
 * Retrieves all actions currently in outbox queue in FIFO order
 * @returns {Promise<Array<{ id: string|number, method: string, url: string, body: any, createdAt: string }>>}
 */
export async function getAll() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.OUTBOX_QUEUE);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (err) {
    console.warn('[outbox.getAll] Error reading outbox:', err);
    return [];
  }
}

/**
 * Appends a new action to the end of the outbox queue
 * @param {{ id?: string|number, method: string, url: string, body?: any, createdAt?: string }} action
 * @returns {Promise<Object>} The saved action with id and createdAt
 */
export async function enqueue(action) {
  try {
    const list = await getAll();
    const item = {
      id: action.id || `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      method: (action.method || 'POST').toUpperCase(),
      url: action.url,
      body: action.body || null,
      createdAt: action.createdAt || new Date().toISOString(),
    };
    list.push(item);
    await AsyncStorage.setItem(KEYS.OUTBOX_QUEUE, JSON.stringify(list));
    return item;
  } catch (err) {
    console.warn('[outbox.enqueue] Error enqueueing action:', err);
    throw err;
  }
}

/**
 * Removes an action from the queue by id
 * @param {string|number} id
 * @returns {Promise<void>}
 */
export async function remove(id) {
  try {
    const list = await getAll();
    const filtered = list.filter(item => String(item.id) !== String(id));
    await AsyncStorage.setItem(KEYS.OUTBOX_QUEUE, JSON.stringify(filtered));
  } catch (err) {
    console.warn(`[outbox.remove] Error removing action "${id}":`, err);
  }
}

export default {
  getAll,
  enqueue,
  remove,
};
