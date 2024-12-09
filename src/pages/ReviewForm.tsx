import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ReviewSubmissionFeedback } from "@/components/reviews/ReviewSubmissionFeedback";

export default function ReviewForm() {
  const { restaurantId } = useParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRating, setSubmittedRating] = useState(0);

  const { data: restaurant } = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", restaurantId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (formData: any) => {
    const { rating } = formData;
    // Assuming you have a function to submit the review
    await supabase
      .from("reviews")
      .insert([{ restaurant_id: restaurantId, rating }]);

    setSubmittedRating(rating);
    setIsSubmitted(true);
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold">Leave a Review</h2>
      <div>
        <label htmlFor="rating" className="block text-sm font-medium">
          Rating
        </label>
        <input
          type="number"
          id="rating"
          name="rating"
          min="1"
          max="5"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
        Submit Review
      </button>
    </form>
  );
}
