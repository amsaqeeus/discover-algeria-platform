export interface Review {
  id: string;
  authorName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  vibeFeedback?: string;
}

export interface Spot {
  id: string;
  title: string;
  wilaya: string;
  wilayaCode: string;
  description: string;
  photo: string;
  googleMapsUrl: string;
  vibes: string[];
  idealFor: string;
  bestTimeToVisit?: string;
  entryFee?: string;
  submittedBy: string;
  createdAt: string;
  isApproved: boolean;
  reviews: Review[];
}

export type VibeCategory = {
  id: string;
  label: string;
  description: string;
};
