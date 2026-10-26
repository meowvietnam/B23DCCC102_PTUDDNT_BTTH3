import { useState, useEffect } from 'react';
import { NativeModules } from 'react-native';

let NetInfo = null;
if (NativeModules && NativeModules.RNCNetInfo) {
  try {
    NetInfo = require('@react-native-community/netinfo').default;
  } catch (err) {
    console.warn('Could not load @react-native-community/netinfo:', err);
  }
}

/**
 * Custom hook to monitor network connectivity
 * Uses @react-native-community/netinfo with graceful fallback if native module is compiling or unlinked
 * 
 * @returns {{ isOnline: boolean }}
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // If native module is available
    if (NetInfo) {
      NetInfo.fetch().then(state => {
        const online = Boolean(state.isConnected && state.isInternetReachable !== false);
        setIsOnline(online);
      }).catch(() => {});

      const unsubscribe = NetInfo.addEventListener(state => {
        const online = Boolean(state.isConnected && state.isInternetReachable !== false);
        setIsOnline(online);
      });

      return () => {
        unsubscribe();
      };
    }

    // Graceful fallback for seamless development
    let isMounted = true;
    const checkFallback = async () => {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 3000);
        await fetch('https://clients3.google.com/generate_204', {
          method: 'HEAD',
          signal: controller.signal,
        });
        clearTimeout(timer);
        if (isMounted) setIsOnline(true);
      } catch (_) {
        try {
          await fetch('http://10.0.2.2:3000/students/1', { method: 'HEAD' });
          if (isMounted) setIsOnline(true);
        } catch (e) {
          if (isMounted) setIsOnline(false);
        }
      }
    };

    checkFallback();
    const interval = setInterval(checkFallback, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { isOnline };
}

export default useNetworkStatus;
