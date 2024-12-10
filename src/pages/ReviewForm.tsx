import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ReviewFormFields } from "@/components/reviews/ReviewFormFields";
import { ReviewSubmissionFeedback } from "@/components/reviews/ReviewSubmissionFeedback";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReviewForm() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rating, setRating] = useState(0);

  console.log("Current restaurantId from params:", restaurantId);

  const { data: restaurant, isLoading: isLoadingRestaurant } = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: async () => {
      if (!restaurantId) return null;
      
      console.log("Fetching restaurant with ID:", restaurantId);
      
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", restaurantId) // Changed from user_id to id
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Restaurant data:", data);
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
            source: "form",
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
      <div className="min-h-screen bg-[#F6FAFF] flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl bg-white shadow-lg">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-[#333333] mb-4">Restaurant not found</h2>
            <p className="text-[#7D7D7D] mb-6">
              The restaurant you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="text-[#007BFF] hover:text-[#0056b3] transition-colors"
            >
              Go back
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#F6FAFF] flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl bg-white shadow-lg">
          <CardContent className="p-6">
            <ReviewSubmissionFeedback
              rating={rating}
              preferredPlatform={restaurant.preferred_social_media}
              socialMediaUrls={{
                google_business_url: restaurant.google_business_url,
                facebook_url: restaurant.facebook_url,
                tripadvisor_url: restaurant.tripadvisor_url,
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6FAFF] flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl bg-white shadow-lg">
        <CardHeader className="space-y-1 p-6">
          <CardTitle className="text-2xl font-bold text-[#333333]">Leave a Review</CardTitle>
          <p className="text-[#7D7D7D]">Share your experience at {restaurant.name}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <ReviewFormFields rating={rating} setRating={setRating} />
            <button
              type="submit"
              className="w-full bg-[#007BFF] text-white py-3 px-4 rounded-lg hover:bg-[#0056b3] transition-colors duration-200 font-medium"
            >
              Submit Review
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}