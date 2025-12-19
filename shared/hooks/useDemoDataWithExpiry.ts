import { useEffect, useRef, useState, useCallback } from 'react';

const DEMO_DATA_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds

interface UseDemoDataConfig<T> {
  seedData: T;
  storageKey: string;
  onReset?: () => void;
}

/**
 * Hook for managing demo data with automatic expiry
 * - Stores data in localStorage with timestamp
 * - Automatically resets to seed data after 15 minutes
 * - Provides countdown timer
 */
export const useDemoDataWithExpiry = <T>({
  seedData,
  storageKey,
  onReset,
}: UseDemoDataConfig<T>) => {
  const [data, setData] = useState<T>(seedData);
  const [timeRemaining, setTimeRemaining] = useState<number>(15);
  const expiryTimerRef = useRef<NodeJS.Timeout>();
  const countdownRef = useRef<NodeJS.Timeout>();
  const lastResetRef = useRef<number>(Date.now());

  // Initialize from localStorage if available and not expired
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    const timestamp = localStorage.getItem(`${storageKey}:timestamp`);

    if (stored && timestamp) {
      const elapsed = Date.now() - parseInt(timestamp);

      if (elapsed < DEMO_DATA_TTL) {
        try {
          setData(JSON.parse(stored));
          lastResetRef.current = parseInt(timestamp);
          const remaining = Math.ceil((DEMO_DATA_TTL - elapsed) / 1000 / 60);
          setTimeRemaining(remaining);
        } catch {
          // Invalid JSON, use seed data
        }
      } else {
        // Data expired, reset it
        localStorage.removeItem(storageKey);
        localStorage.removeItem(`${storageKey}:timestamp`);
        setTimeRemaining(15);
      }
    }
  }, [storageKey]);

  // Start countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const elapsed = Date.now() - lastResetRef.current;
      const remaining = Math.max(0, Math.ceil((DEMO_DATA_TTL - elapsed) / 1000 / 60));
      setTimeRemaining(remaining);

      if (remaining === 0) {
        resetData();
      }
    };

    countdownRef.current = setInterval(updateCountdown, 30000); // Update every 30 seconds

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // Save data to localStorage
  const saveData = useCallback(
    (newData: T) => {
      setData(newData);
      localStorage.setItem(storageKey, JSON.stringify(newData));
      localStorage.setItem(`${storageKey}:timestamp`, Date.now().toString());
      lastResetRef.current = Date.now();
      setTimeRemaining(15);

      // Clear existing timer
      if (expiryTimerRef.current) {
        clearTimeout(expiryTimerRef.current);
      }

      // Set new timer for expiry
      expiryTimerRef.current = setTimeout(() => {
        resetData();
      }, DEMO_DATA_TTL);
    },
    [storageKey],
  );

  // Reset to seed data
  const resetData = useCallback(() => {
    setData(seedData);
    localStorage.removeItem(storageKey);
    localStorage.removeItem(`${storageKey}:timestamp`);
    lastResetRef.current = Date.now();
    setTimeRemaining(15);
    onReset?.();
  }, [seedData, storageKey, onReset]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (expiryTimerRef.current) clearTimeout(expiryTimerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  return { data, saveData, resetData, timeRemaining };
};
