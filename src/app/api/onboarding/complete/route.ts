import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod/v4";
import { createServerClient } from "@/lib/supabase/server";
import { getUserByClerkId, upsertVibeProfile, updateUser } from "@/lib/supabase/queries";
import { generateFingerprintVector } from "@/lib/fingerprint";

const onboardingSchema = z.object({
  energy: z.array(z.string()).min(1, "Pick at least one energy"),
  setting: z.array(z.string()).min(1, "Pick at least one setting"),
  vibes: z.array(z.string()).min(2, "Pick at least two vibes"),
  dealbreakers: z.array(z.string()),
  city: z.string().min(1, "Choose a city"),
});

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = onboardingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const answers = parsed.data;
    const supabase = createServerClient();

    // Look up the user's DB record
    const { user, error: userError } = await getUserByClerkId(supabase, clerkId);
    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found. Please sign in again." },
        { status: 404 }
      );
    }

    // Generate fingerprint vector from answers
    const fingerprintVector = generateFingerprintVector(answers);

    // Save vibe profile
    const { error: profileError } = await upsertVibeProfile(supabase, {
      user_id: user.id,
      answers: answers as unknown as import("@/lib/supabase/types").Json,
      fingerprint_vector: fingerprintVector,
    });

    if (profileError) {
      return NextResponse.json(
        { error: "Failed to save vibe profile" },
        { status: 500 }
      );
    }

    // Update user: set city + mark onboarded
    const { error: updateError } = await updateUser(supabase, user.id, {
      city: answers.city,
      onboarded: true,
    });

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
