"use client";

/**
 * Utility functions for working with localStorage
 * These functions are safe to use in both client and server environments
 */

/**
 * Safely get an item from localStorage
 * @param key The key to get from localStorage
 * @param defaultValue The default value to return if the key doesn't exist
 * @returns The value from localStorage or the default value
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Safely set an item in localStorage
 * @param key The key to set in localStorage
 * @param value The value to set
 * @returns true if the operation was successful, false otherwise
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  if (typeof window === "undefined") {
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
 * @param key The key to remove from localStorage
 * @returns true if the operation was successful, false otherwise
 */
export function removeStorageItem(key: string): boolean {
  if (typeof window === "undefined") {
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
 * Check if localStorage is available
 * @returns true if localStorage is available, false otherwise
 */
export function isStorageAvailable(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.error("Error checking localStorage availability:", error);
    // Herhangi bir hata durumunda false döndür
    return false;
  }
}

/**
 * Pending user data interface
 */
export interface PendingUserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

/**
 * Save pending user data to localStorage
 * @param userData The user data to save
 * @returns true if the operation was successful, false otherwise
 */
export function savePendingUserData(userData: PendingUserData): boolean {
  return setStorageItem("pendingUserData", userData);
}

/**
 * Get pending user data from localStorage
 * @returns The pending user data or null if it doesn't exist
 */
export function getPendingUserData(): PendingUserData | null {
  return getStorageItem<PendingUserData | null>("pendingUserData", null);
}

/**
 * Remove pending user data from localStorage
 * @returns true if the operation was successful, false otherwise
 */
export function removePendingUserData(): boolean {
  return removeStorageItem("pendingUserData");
}
