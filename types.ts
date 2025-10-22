export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Destination {
  name: string;
  description: string;
  location: Coordinates;
  suggestedDays: number;
  imageUrl: string;
}

export interface BoundingBox {
    north: number;
    south: number;
    east: number;
    west: number;
}

export interface TravelPlan {
  destinations: Destination[];
  boundingBox: BoundingBox;
}

export interface Activity {
  name: string;
  description: string;
}

export interface DailyPlan {
  day: number;
  title: string;
  activities: Activity[];
}

export interface PackingAndTips {
  packingList: string[];
  travelTips: string[];
}

export interface MovieRecommendation {
  title: string;
  reason: string;
}

export interface Entertainment {
  movieRecommendations: MovieRecommendation[];
  streamingSites: string[];
}

export interface DestinationDetails {
  dailyPlans: DailyPlan[];
  directionsToNext: string;
  packingAndTips: PackingAndTips;
  entertainment: Entertainment;
}