"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { eventBus } from "@/lib/eventSystem";

interface PersistOptions<T> {
  key: string;
  version?: number;
  storage?: Storage;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
  migrate?: (persistedValue: any, version: number) => T;
  validateOnLoad?: (value: T) => boolean;
  defaultValue?: T | (() => T);
}

interface StorageData<T> {
  value: T;
  version: number;
  timestamp: number;
}

export function usePersistentState<T>(options: PersistOptions<T>) {
  const {
    key,
    version = 1,
    storage = typeof window !== "undefined" ? localStorage : null,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    migrate,
    validateOnLoad,
    defaultValue,
  } = options;

  const [state, setState] = useState<T>(() => {
    // Initialize from storage during client-side hydration
    if (typeof window !== "undefined" && storage) {
      try {
        const storedData = storage.getItem(key);
        if (storedData) {
          const { value, version: storedVersion }: StorageData<T> = deserialize(storedData);

          // Handle version mismatch with migration
          if (storedVersion !== version && migrate) {
            const migratedValue = migrate(value, storedVersion);
            if (validateOnLoad && !validateOnLoad(migratedValue)) {
              return typeof defaultValue === "function"
                ? (defaultValue as () => T)()
                : defaultValue as T;
            }
            return migratedValue;
          }

          // Validate loaded value
          if (validateOnLoad && !validateOnLoad(value)) {
            return typeof defaultValue === "function"
              ? (defaultValue as () => T)()
              : defaultValue as T;
          }

          return value;
        }
      } catch (error) {
        console.error("Error loading persistent state:", error);
      }
    }

    // Return default value if no stored value or during SSR
    return typeof defaultValue === "function"
      ? (defaultValue as () => T)()
      : defaultValue as T;
  });

  // Keep track of last saved timestamp to prevent race conditions
  const lastSaved = useRef<number>(Date.now());

  // Persist state changes to storage
  const persistState = useCallback(
    (newValue: T) => {
      if (storage) {
        try {
          const timestamp = Date.now();
          const data: StorageData<T> = {
            value: newValue,
            version,
            timestamp,
          };
          storage.setItem(key, serialize(data));
          lastSaved.current = timestamp;

          // Notify other tabs/windows of the state change
          eventBus.emit("persistentState:change", {
            key,
            value: newValue,
            timestamp,
          });
        } catch (error) {
          console.error("Error persisting state:", error);
        }
      }
    },
    [key, version, storage, serialize]
  );

  // Listen for changes from other tabs/windows
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue && storage) {
        try {
          const { value, timestamp }: StorageData<T> = deserialize(event.newValue);

          // Only update if the change is newer than our last save
          if (timestamp > lastSaved.current) {
            setState(value);
            lastSaved.current = timestamp;
          }
        } catch (error) {
          console.error("Error handling storage change:", error);
        }
      }
    };

    // Listen for storage events from other tabs/windows
    window.addEventListener("storage", handleStorageChange);

    // Listen for changes from other parts of the application
    const unsubscribe = eventBus.on("persistentState:change", (event: any) => {
      if (event.key === key && event.timestamp > lastSaved.current) {
        setState(event.value);
        lastSaved.current = event.timestamp;
      }
    });

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      unsubscribe();
    };
  }, [key, deserialize, storage]);

  // Persist state changes to storage
  useEffect(() => {
    persistState(state);
  }, [state, persistState]);

  // Enhanced setState that accepts a function updater
  const setPersistedState = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setState((prev) => {
        const newValue = typeof updater === "function"
          ? (updater as (prev: T) => T)(prev)
          : updater;
        return newValue;
      });
    },
    []
  );

  // Clear persisted state
  const clear = useCallback(() => {
    if (storage) {
      try {
        storage.removeItem(key);
        setState(
          typeof defaultValue === "function"
            ? (defaultValue as () => T)()
            : defaultValue as T
        );
      } catch (error) {
        console.error("Error clearing persistent state:", error);
      }
    }
  }, [key, storage, defaultValue]);

  return [state, setPersistedState, clear] as const;
}

// Utility hook for managing persisted objects with partial updates
export function usePersistentObject<T extends object>(
  options: Omit<PersistOptions<T>, "defaultValue"> & { defaultValue: T }
) {
  const [state, setState, clear] = usePersistentState<T>(options);

  const updateObject = useCallback(
    (updates: Partial<T>) => {
      setState((prev) => ({
        ...prev,
        ...updates,
      }));
    },
    [setState]
  );

  return [state, updateObject, clear] as const;
}

// Utility hook for managing persisted arrays with common operations
export function usePersistentArray<T>(
  options: Omit<PersistOptions<T[]>, "defaultValue"> & { defaultValue: T[] }
) {
  const [state, setState, clear] = usePersistentState<T[]>(options);

  const addItem = useCallback(
    (item: T) => {
      setState((prev) => [...prev, item]);
    },
    [setState]
  );

  const removeItem = useCallback(
    (predicate: (item: T) => boolean) => {
      setState((prev) => prev.filter((item) => !predicate(item)));
    },
    [setState]
  );

  const updateItem = useCallback(
    (predicate: (item: T) => boolean, updates: Partial<T>) => {
      setState((prev) =>
        prev.map((item) =>
          predicate(item) ? { ...item, ...updates } : item
        )
      );
    },
    [setState]
  );

  return [state, { addItem, removeItem, updateItem, setState }, clear] as const;
}
