import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { createServerClient } from "@/lib/supabase/server";

const waitlistSchema = z.object({
  email: z.email("Please enter a valid email address"),
  city: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = waitlistSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const { error } = await supabase.from("waitlist").insert({
      email: parsed.data.email,
      city: parsed.data.city ?? null,
    });

    if (error) {
      // Unique constraint violation = duplicate email
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "You're already on the waitlist!" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "You're in!" }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
