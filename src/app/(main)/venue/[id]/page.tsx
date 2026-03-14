import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/actions";
import { MOCK_VENUES, MOCK_SCORES } from "@/lib/mock-data";
import VenueDetail from "@/components/discover/VenueDetail";

interface VenuePageProps {
  params: { id: string };
}

export default async function VenuePage({ params }: VenuePageProps) {
  const { id } = params;
  const user = await getCurrentUser();

  // TODO: Replace with real Supabase query when connected
  const venue = MOCK_VENUES.find((v) => v.id === id);

  if (!venue) {
    notFound();
  }

  const score = MOCK_SCORES[venue.id];

  return (
    <VenueDetail
      venue={venue}
      score={score}
      initialSaved={false}
    />
  );
}
