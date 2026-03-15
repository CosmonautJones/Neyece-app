import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/actions";
import { BottomNav } from "@/components/discover";
import SavedPageClient from "./client";

export default async function SavedPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-cream">
      <SavedPageClient userId={user.id} />
      <BottomNav />
    </div>
  );
}
