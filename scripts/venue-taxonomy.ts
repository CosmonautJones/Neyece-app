/**
 * Venue category + neighborhood taxonomy for seed queries.
 *
 * Each category maps to a Google Places text search query template.
 * Neighborhoods are per-city to ensure good geographic coverage.
 */

export interface CityConfig {
  id: string;
  label: string;
  neighborhoods: string[];
}

export const CATEGORIES = [
  { id: "restaurant", query: "best restaurants" },
  { id: "bar", query: "best bars and cocktail bars" },
  { id: "cafe", query: "best coffee shops and cafes" },
  { id: "park", query: "parks and outdoor spaces" },
  { id: "gallery", query: "art galleries and museums" },
  { id: "club", query: "nightclubs and music venues" },
  { id: "lounge", query: "lounges and wine bars" },
  { id: "market", query: "food markets and food halls" },
  { id: "bookstore", query: "bookstores and independent shops" },
  { id: "rooftop", query: "rooftop bars and restaurants" },
] as const;

export const CITIES: CityConfig[] = [
  {
    id: "nyc",
    label: "New York City",
    neighborhoods: [
      "SoHo, Manhattan",
      "Williamsburg, Brooklyn",
      "Lower East Side, Manhattan",
      "West Village, Manhattan",
      "Bushwick, Brooklyn",
      "East Village, Manhattan",
      "Chelsea, Manhattan",
      "Park Slope, Brooklyn",
      "Greenpoint, Brooklyn",
      "Harlem, Manhattan",
      "DUMBO, Brooklyn",
      "Nolita, Manhattan",
    ],
  },
  {
    id: "la",
    label: "Los Angeles",
    neighborhoods: [
      "Silver Lake, Los Angeles",
      "Venice, Los Angeles",
      "Downtown Los Angeles",
      "Highland Park, Los Angeles",
      "Los Feliz, Los Angeles",
      "Echo Park, Los Angeles",
      "West Hollywood",
      "Santa Monica",
      "Arts District, Los Angeles",
      "Koreatown, Los Angeles",
    ],
  },
  {
    id: "chicago",
    label: "Chicago",
    neighborhoods: [
      "Wicker Park, Chicago",
      "Logan Square, Chicago",
      "River North, Chicago",
      "West Loop, Chicago",
      "Lincoln Park, Chicago",
      "Bucktown, Chicago",
      "Pilsen, Chicago",
      "Andersonville, Chicago",
      "Hyde Park, Chicago",
      "Old Town, Chicago",
    ],
  },
  {
    id: "miami",
    label: "Miami",
    neighborhoods: [
      "Wynwood, Miami",
      "South Beach, Miami Beach",
      "Little Havana, Miami",
      "Brickell, Miami",
      "Design District, Miami",
      "Coconut Grove, Miami",
      "Coral Gables",
      "Midtown, Miami",
      "Little Haiti, Miami",
      "Edgewater, Miami",
    ],
  },
];

export function getCityById(id: string): CityConfig | undefined {
  return CITIES.find((c) => c.id === id);
}
