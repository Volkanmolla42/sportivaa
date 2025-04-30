// React Query key constants
export const queryKeys = {
  // User-related keys
  user: (userId?: string) => ["user", userId],
  userRoles: (userId?: string) => ["userRoles", userId],
  userProfile: (userId?: string) => ["userProfile", userId],

  // Gym-related keys
  gyms: ["gyms"] as const,
  gym: (gymId?: string) => ["gym", gymId],
  userGyms: (userId?: string) => ["userGyms", userId],
  managedGyms: (userId?: string) => ["managedGyms", userId],
  gymMembers: (gymId?: string) => ["gymMembers", gymId],

  // Trainer-related keys
  trainerProfile: (userId?: string) => ["trainerProfile", userId],
  trainerGyms: (trainerId?: string) => ["trainerGyms", trainerId],

  // Session-related keys
  sessions: (userId?: string, type?: 'trainer' | 'member') => ["sessions", userId, type],
  sessionDetails: (sessionId?: string) => ["sessionDetails", sessionId],

  // Search-related keys
  userSearch: (query?: string) => ["userSearch", query],

  // Composite keys for related data
  gymWithMembers: (gymId?: string) => ["gym", gymId, "members"],
  gymWithTrainers: (gymId?: string) => ["gym", gymId, "trainers"],
  userWithGyms: (userId?: string) => ["user", userId, "gyms"],
  trainerWithGyms: (trainerId?: string) => ["trainer", trainerId, "gyms"],
} as const;
