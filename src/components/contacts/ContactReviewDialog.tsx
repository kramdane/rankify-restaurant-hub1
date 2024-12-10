import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Contact } from "@/types/contact";

interface ContactReviewDialogProps {
  selectedContact: Contact | null;
  selectedContactReviews: any[];
  calculateAverageRating: (reviews: any[]) => string;
  onOpenChange: (open: boolean) => void;
}

export const ContactReviewDialog = ({
  selectedContact,
  selectedContactReviews,
  calculateAverageRating,
  onOpenChange,
}: ContactReviewDialogProps) => {
  if (!selectedContact) return null;

  return (
    <Dialog open={!!selectedContact} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Reviews by {selectedContact?.firstname} {selectedContact?.lastname}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg">
            <span>Average Rating:</span>
            <div className="flex items-center gap-1">
              <span className="font-bold">
                {calculateAverageRating(selectedContactReviews || [])}
              </span>
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
          <div className="space-y-4">
            {selectedContactReviews?.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};