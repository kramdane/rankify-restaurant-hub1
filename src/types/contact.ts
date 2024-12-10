export interface Contact {
  id: string;
  firstname: string;
  lastname: string;
  phone: string | null;
  email: string | null;
  addeddate: string;
  reviewcount: number;
  created_at: string | null;
  updated_at: string | null;
  customer_reviews?: {
    average_rating: number;
    review_count: number;
    review_ids: string[];
  }[] | null;
}