import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import {
  getUserByClerkId,
  getCollectionById,
  addToCollection,
  removeFromCollection,
} from "@/lib/supabase/queries";
import type { Collection } from "@/lib/supabase/types";
import { z } from "zod";

const venueSchema = z.object({
  venueId: z.string().uuid(),
  notes: z.string().max(200).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = venueSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { user } = await getUserByClerkId(supabase, clerkId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { collection: existing } = await getCollectionById(supabase, params.id);
  const coll = existing as Collection | null;
  if (!coll || coll.user_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { item, error } = await addToCollection(
    supabase,
    params.id,
    parsed.data.venueId,
    parsed.data.notes
  );

  if (error) {
    return NextResponse.json({ error: "Failed to add" }, { status: 500 });
  }

  return NextResponse.json({ item }, { status: 201 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { venueId } = await req.json();
  if (!venueId) {
    return NextResponse.json({ error: "venueId required" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { user } = await getUserByClerkId(supabase, clerkId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { collection: existing } = await getCollectionById(supabase, params.id);
  const coll = existing as Collection | null;
  if (!coll || coll.user_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await removeFromCollection(supabase, params.id, venueId);
  return NextResponse.json({ ok: true });
}
