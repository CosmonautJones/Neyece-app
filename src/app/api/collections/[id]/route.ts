import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";
import {
  getUserByClerkId,
  getCollectionById,
  updateCollection,
  deleteCollection,
  getCollectionVenues,
} from "@/lib/supabase/queries";
import type { Collection } from "@/lib/supabase/types";
import { z } from "zod";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient();
  const { collection: raw } = await getCollectionById(supabase, params.id);
  const collection = raw as Collection | null;
  if (!collection) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { items } = await getCollectionVenues(supabase, params.id);

  return NextResponse.json({ collection, venues: items });
}

const updateSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().max(200).optional(),
  is_public: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { user } = await getUserByClerkId(supabase, clerkId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Verify ownership
  const { collection: existing } = await getCollectionById(supabase, params.id);
  const coll = existing as Collection | null;
  if (!coll || coll.user_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { collection } = await updateCollection(supabase, params.id, parsed.data);
  return NextResponse.json({ collection });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  await deleteCollection(supabase, params.id);
  return NextResponse.json({ ok: true });
}
