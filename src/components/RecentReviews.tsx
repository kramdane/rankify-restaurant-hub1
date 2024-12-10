import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";

export const RecentReviews = ({ restaurantId }: { restaurantId?: number }) => {
  const navigate = useNavigate();

  const { data: reviews } = useQuery({
    queryKey: ["recent-reviews", restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data || [];
    },
    enabled: !!restaurantId,
  });

  return (
    <div className="space-y-4">
      {reviews?.map((review) => (
        <div
          key={review.id}
          className="flex items-start space-x-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-600">
                {review.reviewer_name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 truncate">
                {review.reviewer_name}
              </p>
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">{review.comment}</p>
            <p className="mt-1 text-xs text-gray-500">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
      <div className="pt-4 border-t">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate("/dashboard/reviews")}
        >
          View all reviews
        </Button>
      </div>
    </div>
  );
};