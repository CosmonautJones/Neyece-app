/**
 * Supabase Database types.
 *
 * In production, regenerate with:
 *   npx supabase gen types typescript --project-id <project-id> > src/lib/supabase/types.ts
 *
 * These are manually defined to match our migration schema until
 * we connect to a live Supabase project.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          clerk_id: string;
          email: string;
          name: string | null;
          city: string | null;
          vibe_profile: Json;
          onboarded: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clerk_id: string;
          email: string;
          name?: string | null;
          city?: string | null;
          vibe_profile?: Json;
          onboarded?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clerk_id?: string;
          email?: string;
          name?: string | null;
          city?: string | null;
          vibe_profile?: Json;
          onboarded?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      venues: {
        Row: {
          id: string;
          name: string;
          neighborhood: string | null;
          city: string;
          lat: number | null;
          lng: number | null;
          category: string | null;
          google_place_id: string | null;
          vibe_tags: Json;
          description: string | null;
          image_url: string | null;
          price_level: number | null;
          hours: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          neighborhood?: string | null;
          city: string;
          lat?: number | null;
          lng?: number | null;
          category?: string | null;
          google_place_id?: string | null;
          vibe_tags?: Json;
          description?: string | null;
          image_url?: string | null;
          price_level?: number | null;
          hours?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          neighborhood?: string | null;
          city?: string;
          lat?: number | null;
          lng?: number | null;
          category?: string | null;
          google_place_id?: string | null;
          vibe_tags?: Json;
          description?: string | null;
          image_url?: string | null;
          price_level?: number | null;
          hours?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      vibe_profiles: {
        Row: {
          id: string;
          user_id: string;
          answers: Json;
          fingerprint_vector: number[];
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          answers?: Json;
          fingerprint_vector?: number[];
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          answers?: Json;
          fingerprint_vector?: number[];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "vibe_profiles_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      neyece_scores: {
        Row: {
          id: string;
          venue_id: string;
          user_id: string;
          score: number;
          computed_at: string;
        };
        Insert: {
          id?: string;
          venue_id: string;
          user_id: string;
          score: number;
          computed_at?: string;
        };
        Update: {
          id?: string;
          venue_id?: string;
          user_id?: string;
          score?: number;
          computed_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "neyece_scores_venue_id_fkey";
            columns: ["venue_id"];
            referencedRelation: "venues";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "neyece_scores_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      saved_spots: {
        Row: {
          id: string;
          user_id: string;
          venue_id: string;
          notes: string | null;
          saved_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          venue_id: string;
          notes?: string | null;
          saved_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          venue_id?: string;
          notes?: string | null;
          saved_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "saved_spots_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "saved_spots_venue_id_fkey";
            columns: ["venue_id"];
            referencedRelation: "venues";
            referencedColumns: ["id"];
          },
        ];
      };
      user_signals: {
        Row: {
          id: string;
          user_id: string;
          venue_id: string;
          signal_type: "save" | "unsave" | "neyece" | "view" | "share";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          venue_id: string;
          signal_type: "save" | "unsave" | "neyece" | "view" | "share";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          venue_id?: string;
          signal_type?: "save" | "unsave" | "neyece" | "view" | "share";
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_signals_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_signals_venue_id_fkey";
            columns: ["venue_id"];
            referencedRelation: "venues";
            referencedColumns: ["id"];
          },
        ];
      };
      waitlist: {
        Row: {
          id: string;
          email: string;
          city: string | null;
          converted: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          city?: string | null;
          converted?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          city?: string | null;
          converted?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

// Convenience type aliases
export type User = Database["public"]["Tables"]["users"]["Row"];
export type Venue = Database["public"]["Tables"]["venues"]["Row"];
export type VibeProfile = Database["public"]["Tables"]["vibe_profiles"]["Row"];
export type NeyeceScore = Database["public"]["Tables"]["neyece_scores"]["Row"];
export type SavedSpot = Database["public"]["Tables"]["saved_spots"]["Row"];
export type UserSignal = Database["public"]["Tables"]["user_signals"]["Row"];
export type SignalType = UserSignal["signal_type"];
export type WaitlistEntry = Database["public"]["Tables"]["waitlist"]["Row"];
