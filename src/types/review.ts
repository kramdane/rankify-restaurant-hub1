export interface ReviewFormData {
  reviewer_name: string;
  email: string;
  phone?: string;
  rating: number;
  comment: string;
  restaurant_id: string;
  source: 'form';
}