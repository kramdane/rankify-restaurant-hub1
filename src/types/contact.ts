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
  customer_reviews: {
    average_rating: number;
    email: string;
    last_review_date: string;
    phone: string;
    restaurant_id: string;
    review_count: number;
    review_ids: string[];
    reviewer_name: string;
  }[] | null;
}