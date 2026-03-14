import { NextResponse } from "next/server";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  // Get Svix headers
  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  // Verify the webhook
  const body = await request.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let event: WebhookEvent;
  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServerClient();

  switch (event.type) {
    case "user.created": {
      const { id, email_addresses, first_name, last_name } = event.data;
      const email = email_addresses[0]?.email_address;
      if (!email) break;

      const name = [first_name, last_name].filter(Boolean).join(" ") || null;

      await supabase.from("users").insert({
        clerk_id: id,
        email,
        name,
      });
      break;
    }

    case "user.updated": {
      const { id, email_addresses, first_name, last_name } = event.data;
      const email = email_addresses[0]?.email_address;

      const name = [first_name, last_name].filter(Boolean).join(" ") || null;

      await supabase
        .from("users")
        .update({ email, name })
        .eq("clerk_id", id);
      break;
    }

    case "user.deleted": {
      const { id } = event.data;
      if (id) {
        await supabase.from("users").delete().eq("clerk_id", id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
