import { getCurrentUser } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";
import { MOCK_VENUES, MOCK_SCORES } from "@/lib/mock-data";
import { DiscoverFeed } from "@/components/discover";
import { BottomNav } from "@/components/discover";

export default async function DiscoverPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (!user.onboarded) redirect("/quiz");

  // TODO: Replace with real Supabase venues + computeScoresForUser when connected
  const venues = MOCK_VENUES;
  const scores: Record<string, number> = MOCK_SCORES;

  return (
    <div className="min-h-screen bg-cream">
      <DiscoverFeed
        venues={venues}
        scores={scores}
        userName={user.name}
        city={user.city}
      />
      <BottomNav />
    </div>
  );
}
