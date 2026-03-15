// Clients
export { supabase, createAuthClient } from "./client";
export { createServerClient, createAuthServerClient } from "./server";

// Types
export type {
  Database,
  Json,
  User,
  Venue,
  VibeProfile,
  NeyeceScore,
  SavedSpot,
  WaitlistEntry,
} from "./types";

// Queries
export {
  getUserByClerkId,
  getUserById,
  upsertUser,
  updateUser,
  getVenueById,
  getVenuesByCity,
  getVenuesByNeighborhood,
  getVenuesByCategory,
  searchVenues,
  upsertVenue,
  getVibeProfile,
  upsertVibeProfile,
  getScoresForUser,
  getScoreForVenue,
  upsertScore,
  getFeaturedVenues,
  getNearbyGems,
  getSavedSpots,
  isSpotSaved,
  saveSpot,
  unsaveSpot,
  addToWaitlist,
  getWaitlistCount,
} from "./queries";
