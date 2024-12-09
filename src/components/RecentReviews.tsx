import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
    <Card className="col-span-full lg:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Reviews</CardTitle>
        <Button variant="ghost" onClick={() => navigate("/dashboard/reviews")}>
          View all
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews?.map((review) => (
          <div
            key={review.id}
            className="flex items-start space-x-4 border-b border-gray-100 pb-4 last:border-0"
          >
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
            <div className="flex-1">
              <p className="text-sm text-gray-600">{review.comment}</p>
              <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                <span>{review.reviewer_name}</span>
                <span>{new Date(review.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};