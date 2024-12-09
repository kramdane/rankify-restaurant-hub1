import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ReviewSubmissionFeedback } from "@/components/reviews/ReviewSubmissionFeedback";
import { StarRating } from "@/components/StarRating";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export default function ReviewForm() {
  const { restaurantId } = useParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRating, setSubmittedRating] = useState(0);
  const [rating, setRating] = useState(0);
  const { toast } = useToast();

  const { data: restaurant } = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: async () => {
      if (!restaurantId) throw new Error("Restaurant ID is required");
      
      console.log("Fetching restaurant with ID:", restaurantId);
      
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", restaurantId)
        .single();

      if (error) {
        console.error("Error fetching restaurant:", error);
        throw error;
      }
      return data;
    },
    enabled: !!restaurantId,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submission started");

    if (!restaurantId) {
      console.error("Restaurant ID is missing");
      toast({
        title: "Error",
        description: "Restaurant ID is missing",
        variant: "destructive",
      });
      return;
    }

    if (!rating) {
      console.log("Rating is required");
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const reviewerName = formData.get("reviewer_name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const comment = formData.get("comment") as string;

    console.log("Submitting review with data:", {
      restaurantId,
      rating,
      reviewerName,
      email,
      phone,
      comment,
    });

    const { error } = await supabase
      .from("reviews")
      .insert([{
        restaurant_id: restaurantId,
        rating,
        reviewer_name: reviewerName,
        email,
        phone,
        comment,
        source: 'form'
      }]);

    if (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
      return;
    }

    console.log("Review submitted successfully");
    setSubmittedRating(rating);
    setIsSubmitted(true);
    toast({
      title: "Success",
      description: "Your review has been submitted successfully!",
    });
  };

  if (isSubmitted) {
    return (
      <div className="container max-w-2xl mx-auto p-6">
        <ReviewSubmissionFeedback
          rating={submittedRating}
          preferredPlatform={restaurant?.preferred_social_media}
          socialMediaUrls={{
            google_business_url: restaurant?.google_business_url,
            facebook_url: restaurant?.facebook_url,
            tripadvisor_url: restaurant?.tripadvisor_url,
          }}
        />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold">Leave a Review</h2>
        
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

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}