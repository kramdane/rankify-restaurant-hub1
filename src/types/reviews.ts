export type ReviewSource = 'form' | 'google' | 'facebook' | 'tripadvisor';

export interface Review {
  id: number;
  restaurant_id: number;
  rating: number;
  comment: string;
  reviewer_name: string;
  email?: string;
  phone?: string;
  created_at: string;
  source: ReviewSource;
  external_review_id?: string;
}