import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: {
    reviewer_name: string;
    comment: string;
    created_at: string;
    rating: number;
  } | null;
}

export const ReviewDialog = ({ open, onOpenChange, review }: ReviewDialogProps) => {
  if (!review) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Review from {review.reviewer_name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {format(new Date(review.created_at), "PPP")}
            </p>
            <p className="text-sm">{review.comment}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};