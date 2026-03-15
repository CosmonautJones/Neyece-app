import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/actions";
import { BottomNav } from "@/components/discover";
import ProfilePageClient from "./client";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-cream">
      <ProfilePageClient user={user} />
      <BottomNav />
    </div>
  );
}
