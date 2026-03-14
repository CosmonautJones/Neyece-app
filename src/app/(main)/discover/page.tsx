import { getCurrentUser } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";

export default async function DiscoverPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (!user.onboarded) redirect("/quiz");

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl font-bold text-ink mb-2">
          Welcome, {user.name ?? "friend"} 🎯
        </h1>
        <p className="font-body text-muted text-lg mb-6">
          Your vibe profile is locked in for{" "}
          <span className="font-bold text-ink">{user.city}</span>.
        </p>
        <div className="bg-white border-2 border-ink rounded-2xl shadow-brutal p-6">
          <p className="font-body text-ink">
            Your personalized discovery feed is coming soon. Stay Neyece.
          </p>
        </div>
      </div>
    </div>
  );
}
