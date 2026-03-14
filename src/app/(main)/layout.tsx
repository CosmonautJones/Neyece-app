import { getCurrentUser } from "@/lib/supabase/actions";
import { redirect } from "next/navigation";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Not signed in
  if (!user) {
    redirect("/sign-in");
  }

  // Not onboarded yet — send to quiz
  if (!user.onboarded) {
    redirect("/quiz");
  }

  return <>{children}</>;
}
