export interface QuizQuestion {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  options: QuizOption[];
  multiSelect: boolean;
  /** minimum selections required to proceed */
  minSelections: number;
}

export interface QuizOption {
  id: string;
  label: string;
  emoji: string;
}

export const quizScreens: QuizQuestion[] = [
  {
    id: "energy",
    title: "What's your going-out energy?",
    subtitle: "Pick the vibes that feel like you",
    emoji: "⚡",
    multiSelect: true,
    minSelections: 1,
    options: [
      { id: "chill", label: "Chill & low-key", emoji: "🧘" },
      { id: "lively", label: "Lively & buzzing", emoji: "🎉" },
      { id: "rowdy", label: "Rowdy & wild", emoji: "🔥" },
      { id: "intimate", label: "Intimate & cozy", emoji: "🕯" },
    ],
  },
  {
    id: "setting",
    title: "Your ideal setting?",
    subtitle: "Where do you feel most alive?",
    emoji: "🏙",
    multiSelect: true,
    minSelections: 1,
    options: [
      { id: "rooftop", label: "Rooftop with a view", emoji: "🌆" },
      { id: "hidden", label: "Hidden gem, no sign", emoji: "🤫" },
      { id: "outdoor", label: "Outdoor & open air", emoji: "☀️" },
      { id: "cozy", label: "Cozy corner spot", emoji: "🛋" },
    ],
  },
  {
    id: "vibes",
    title: "Pick your vibe words",
    subtitle: "Choose all that resonate",
    emoji: "✨",
    multiSelect: true,
    minSelections: 2,
    options: [
      { id: "trendy", label: "Trendy", emoji: "💅" },
      { id: "classic", label: "Classic", emoji: "🎩" },
      { id: "artsy", label: "Artsy", emoji: "🎨" },
      { id: "local", label: "Local favorite", emoji: "📍" },
      { id: "upscale", label: "Upscale", emoji: "🥂" },
      { id: "casual", label: "Casual", emoji: "👟" },
    ],
  },
  {
    id: "dealbreakers",
    title: "Any deal-breakers?",
    subtitle: "We'll steer you away from these",
    emoji: "🚫",
    multiSelect: true,
    minSelections: 0,
    options: [
      { id: "loud", label: "Too loud to talk", emoji: "🔊" },
      { id: "no-reservations", label: "No reservations", emoji: "⏰" },
      { id: "far-transit", label: "Far from transit", emoji: "🚇" },
      { id: "expensive", label: "$$$ expensive", emoji: "💸" },
    ],
  },
];

export const launchCities = [
  { id: "nyc", label: "New York City", emoji: "🗽" },
  { id: "la", label: "Los Angeles", emoji: "🌴" },
  { id: "chicago", label: "Chicago", emoji: "🌬" },
  { id: "miami", label: "Miami", emoji: "🌊" },
];

export interface QuizAnswers {
  energy: string[];
  setting: string[];
  vibes: string[];
  dealbreakers: string[];
  city: string;
}

export const emptyAnswers: QuizAnswers = {
  energy: [],
  setting: [],
  vibes: [],
  dealbreakers: [],
  city: "",
};
