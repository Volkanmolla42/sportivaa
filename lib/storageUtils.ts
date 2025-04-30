"use client";

import { BasicUser } from "@/contexts/AuthContext";

// Storage keys
const STORAGE_KEYS = {
  PENDING_USER: "pendingUser",
  USER_PREFERENCES: "userPreferences",
  STORAGE_TEST: "__storage_test__",
} as const;

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEYS.STORAGE_TEST, STORAGE_KEYS.STORAGE_TEST);
    localStorage.removeItem(STORAGE_KEYS.STORAGE_TEST);
    return true;
  } catch (error) {
    console.error("Error checking localStorage availability:", error);
    return false;
  }
}

/**
 * Safely get an item from localStorage
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (!isStorageAvailable()) {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Safely set an item in localStorage
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage:`, error);
    return false;
  }
}

/**
 * Safely remove an item from localStorage
 */
export function removeStorageItem(key: string): boolean {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage:`, error);
    return false;
  }
}

/**
 * Save pending user data during signup flow
 */
export function savePendingUserData(userData: BasicUser): boolean {
  return setStorageItem(STORAGE_KEYS.PENDING_USER, userData);
}

/**
 * Get pending user data saved during signup
 */
export function getPendingUserData(): BasicUser | null {
  return getStorageItem<BasicUser | null>(STORAGE_KEYS.PENDING_USER, null);
}

/**
 * Remove pending user data after successful signup
 */
export function removePendingUserData(): boolean {
  return removeStorageItem(STORAGE_KEYS.PENDING_USER);
}

/**
 * Update user preferences in local storage
 */
export function updateUserPreferences(preferences: Record<string, unknown>): boolean {
  const currentPrefs = getUserPreferences();
  return setStorageItem(STORAGE_KEYS.USER_PREFERENCES, { ...currentPrefs, ...preferences });
}

/**
 * Get user preferences from local storage
 */
export function getUserPreferences(): Record<string, unknown> {
  return getStorageItem<Record<string, unknown>>(STORAGE_KEYS.USER_PREFERENCES, {});
}

/**
 * Clear all user-related data from storage
 */
export function clearUserData(): void {
  if (!isStorageAvailable()) return;

  try {
    removeStorageItem(STORAGE_KEYS.PENDING_USER);
    removeStorageItem(STORAGE_KEYS.USER_PREFERENCES);
  } catch (error) {
    console.error("Error clearing user data:", error);
  }
}
