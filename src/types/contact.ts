export interface Contact {
  id: string;
  firstname: string;
  lastname: string;
  phone: string | null;
  email: string | null;
  addeddate: string;
  reviewcount: number;
  customer_reviews?: {
    review_count: number;
    average_rating: number;
    review_ids: string[];
  } | null;
}