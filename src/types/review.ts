export interface ReviewFormData {
  reviewer_name: string;
  email: string;
  phone: string | null;
  rating: number;
  comment: string;
  restaurant_id: string;
  source: 'form';
}