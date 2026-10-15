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

export interface TourPackage {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  price: number | string;
  originalPrice?: number | string;
  tag?: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  description: string;
  itinerary: { day?: string; time?: string; title: string; desc: string }[];
  includes?: string[];
  inclusions?: string[];
  featured?: boolean;
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

export interface Neighborhood {
  id: string;
  name: string;
  bengaliName: string;
  tagline: string;
  vibe: string;
  era: string;
  description: string;
  coverImage: string;
  keySpots: string[];
  signatureFood: string;
  bestWalkingTime: string;
  transitTip: string;
  quote: string;
  quoteAuthor: string;
  colorScheme: {
    accent: string;
    badgeBg: string;
  };
}

export interface SeasonalEvent {
  id: string;
  title: string;
  bengaliTitle: string;
  season: 'Autumn' | 'Late Autumn' | 'Winter' | 'Spring' | 'Summer' | 'Monsoon';
  months: string;
  tagline: string;
  description: string;
  imageUrl: string;
  rituals: string[];
  delicacies: string[];
  travelerTips: string[];
  heritageSignificance: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'Architecture' | 'River & Ghats' | 'Street Life' | 'Trams & Transit' | 'Gastronomy';
  location: string;
  imageUrl: string;
  caption: string;
  filmStock: string;
  cameraNote: string;
  yearTaken: string;
}

export interface TransitMode {
  id: string;
  name: string;
  bengaliName: string;
  tagline: string;
  operatingSince: string;
  fareRange: string;
  operatingHours: string;
  summary: string;
  routes: { name: string; stops: string; note: string }[];
  insiderAdvice: string[];
  keyPhrase: { bengali: string; phonetic: string; english: string };
  badgeText: string;
}

export interface DiaryItem {
  id: string;
  title: string;
  category: 'Landmark' | 'Trail' | 'Food' | 'Story' | 'Neighborhood';
  location: string;
  imageUrl: string;
  addedAt: string;
  visited?: boolean;
  notes?: string;
}

