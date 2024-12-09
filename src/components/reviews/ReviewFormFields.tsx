import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/StarRating";

interface ReviewFormFieldsProps {
  rating: number;
  setRating: (rating: number) => void;
}

export function ReviewFormFields({ rating, setRating }: ReviewFormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="reviewer_name" className="text-sm font-medium">
          Your Name
        </label>
        <Input
          type="text"
          id="reviewer_name"
          name="reviewer_name"
          required
          placeholder="Enter your name"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          type="email"
          id="email"
          name="email"
          required
          placeholder="Enter your email"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">
          Phone Number
        </label>
        <Input
          type="tel"
          id="phone"
          name="phone"
          placeholder="Enter your phone number"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Rating</label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <div className="space-y-2">
        <label htmlFor="comment" className="text-sm font-medium">
          Your Review
        </label>
        <Textarea
          id="comment"
          name="comment"
          required
          placeholder="Write your review here"
          rows={4}
        />
      </div>
    </>
  );
}