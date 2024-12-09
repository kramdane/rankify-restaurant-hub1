import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ReviewSubmissionFeedback } from "@/components/reviews/ReviewSubmissionFeedback";
import { ReviewFormFields } from "@/components/reviews/ReviewFormFields";
import { useToast } from "@/hooks/use-toast";
import type { ReviewFormData } from "@/types/review";

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

      console.log("Restaurant data:", data);
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
    const reviewData = {
      restaurant_id: restaurantId,
      rating,
      reviewer_name: formData.get("reviewer_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string || null,
      comment: formData.get("comment") as string,
      source: 'form'
    };

    console.log("Submitting review with data:", reviewData);

    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert([reviewData])
        .select()
        .single();

      if (error) {
        console.error("Error submitting review:", error);
        toast({
          title: "Error",
          description: "Failed to submit review. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log("Review submitted successfully:", data);
      setSubmittedRating(rating);
      setIsSubmitted(true);
      toast({
        title: "Success",
        description: "Your review has been submitted successfully!",
      });
    } catch (error) {
      console.error("Unexpected error during review submission:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
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
        <ReviewFormFields rating={rating} setRating={setRating} />
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