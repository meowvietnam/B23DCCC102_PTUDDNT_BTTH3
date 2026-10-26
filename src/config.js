import { Platform } from 'react-native';

/**
 * Application Configuration
 * Máy ảo Android: http://10.0.2.2:3000
 * iOS / Web / Thiết bị khác: http://localhost:3000
 * Nếu dùng thiết bị thật: thay bằng http://<IP-LAN-may-tinh>:3000
 */
export const BASE_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:3000' 
  : 'http://localhost:3000';

export const TIMEOUT = 10000; // 10 giây timeout theo yêu cầu A1

export const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 giờ cho cache

export default {
  BASE_URL,
  TIMEOUT,
  CACHE_TTL,
};
