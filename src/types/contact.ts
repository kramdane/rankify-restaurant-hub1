export interface Contact {
  id: string;
  firstname: string;
  lastname: string;
  phone: string | null;
  email: string | null;
  addeddate: string;
  reviewcount: number;
}