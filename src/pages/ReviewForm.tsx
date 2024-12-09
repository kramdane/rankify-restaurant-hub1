import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Star } from "lucide-react";

const ReviewForm = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewerName, setReviewerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      // First, add the contact
      const { data: contact, error: contactError } = await supabase
        .from('contacts')
        .upsert({
          firstName: reviewerName.split(' ')[0],
          lastName: reviewerName.split(' ').slice(1).join(' '),
          email,
          phone,
          restaurant_id: restaurantId,
        }, {
          onConflict: 'email,phone,restaurant_id'
        });

      if (contactError) throw contactError;

      // Then add the review
      const { error: reviewError } = await supabase
        .from("reviews")
        .insert({
          restaurant_id: restaurantId,
          rating,
          reviewer_name: reviewerName,
          email,
          phone,
          comment,
          created_at: new Date().toISOString(),
        });

      if (reviewError) throw reviewError;

      toast.success("Thank you for your review!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error submitting review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Leave a Review</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((index) => (
              <button
                key={index}
                type="button"
                className="focus:outline-none"
                onMouseEnter={() => setHoveredRating(index)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(index)}
              >
                <Star
                  className={`w-8 h-8 ${
                    index <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Your Name
            </label>
            <Input
              id="name"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium">
              Phone
            </label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="comment" className="block text-sm font-medium">
              Your Comment
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={4}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !rating}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;