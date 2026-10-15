export interface Destination {
  id: string;
  name: string;
  tagline: string;
  category: string;
  region: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  description: string;
  highlights: string[];
  bestTimeToVisit: string;
  timing: string;
  howToReach: string;
  entryFee: string;
  insiderTip: string;
}

export interface SuggestedTrail {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  difficulty: string;
  tag: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  description: string;
  itinerary: { time: string; title: string; desc: string }[];
  keyStops: string[];
  featured?: boolean;
}

export interface ReviewItem {
  id: number;
  name: string;
  role: string;
  rating: number;
  review: string;
  date: string;
}

export interface GuideStory {
  id: string;
  title: string;
  category: string;
  readTime: string;
  imageUrl: string;
  summary: string;
  date: string;
}
