import { getCurrentUser } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Already onboarded? Skip quiz and go to discover
  if (user?.onboarded) {
    redirect("/discover");
  }

  return <>{children}</>;
}
