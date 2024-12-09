import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ReviewSubmissionFeedback } from "@/components/reviews/ReviewSubmissionFeedback";
import { StarRating } from "@/components/StarRating";

export default function ReviewForm() {
  const { restaurantId } = useParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRating, setSubmittedRating] = useState(0);
  const [rating, setRating] = useState(0);

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
    enabled: !!restaurantId,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const reviewerName = formData.get("reviewer_name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const comment = formData.get("comment") as string;

    await supabase
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
    <div className="container max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold">Leave a Review</h2>
        
        <div>
          <label htmlFor="reviewer_name" className="block text-sm font-medium">
            Your Name
          </label>
          <input
            type="text"
            id="reviewer_name"
            name="reviewer_name"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Rating</label>
          <StarRating value={rating} onChange={setRating} />
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium">
            Your Review
          </label>
          <textarea
            id="comment"
            name="comment"
            required
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}