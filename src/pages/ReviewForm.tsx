import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ReviewFormFields } from "@/components/reviews/ReviewFormFields";
import { ReviewSubmissionFeedback } from "@/components/reviews/ReviewSubmissionFeedback";
import { useToast } from "@/hooks/use-toast";

export default function ReviewForm() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rating, setRating] = useState(0);

  const { data: restaurant } = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: async () => {
      if (!restaurantId) return null;
      
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", restaurantId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!restaurantId,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!restaurantId) {
      toast({
        title: "Error",
        description: "Restaurant ID is required",
        variant: "destructive",
      });
      return;
    }

    if (!rating) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const reviewerName = formData.get("reviewer_name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const comment = formData.get("comment");

    if (!reviewerName || !email || !comment) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("reviews")
        .insert([
          {
            restaurant_id: restaurantId,
            rating,
            reviewer_name: reviewerName,
            email,
            phone: phone || null,
            comment,
            source: "form" as const,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Success",
        description: "Thank you for your review!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive",
      });
    }
  };

  if (!restaurant) {
    return (
      <div className="container max-w-2xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Restaurant not found</h2>
          <p className="mt-2 text-gray-600">
            The restaurant you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-primary hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="container max-w-2xl mx-auto p-6">
        <ReviewSubmissionFeedback
          rating={rating}
          preferredPlatform={restaurant.preferred_social_media}
          socialMediaUrls={{
            google_business_url: restaurant.google_business_url,
            facebook_url: restaurant.facebook_url,
            tripadvisor_url: restaurant.tripadvisor_url,
          }}
        />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Leave a Review</h2>
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