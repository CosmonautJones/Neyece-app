import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getVenueById } from "@/lib/supabase/queries";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Venue ID required" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { venue, error } = await getVenueById(supabase, id);

  if (error || !venue) {
    return NextResponse.json({ error: "Venue not found" }, { status: 404 });
  }

  return NextResponse.json({ venue });
}
