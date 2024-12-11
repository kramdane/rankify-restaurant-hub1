import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TimeRange } from "@/components/TimeRangeSelect";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { LoadingSpinner } from "./LoadingSpinner";

interface ReviewsChartProps {
  timeRange: TimeRange;
  restaurantId?: number;
}

export const ReviewsChart = ({ timeRange, restaurantId }: ReviewsChartProps) => {
  const { data: reviewStats, isLoading } = useQuery({
    queryKey: ["review-stats", restaurantId, timeRange],
    queryFn: async () => {
      if (!restaurantId) return [];
      
      const { data, error } = await supabase
        .from("reviews")
        .select("rating, created_at")
        .eq("reviews.restaurant_id", restaurantId)
        .gte("created_at", timeRange.start.toISOString())
        .lte("created_at", timeRange.end.toISOString());

      if (error) throw error;

      // Process data to get rating distribution
      const distribution = Array(5).fill(0);
      data?.forEach((review) => {
        distribution[review.rating - 1]++;
      });

      return distribution.map((count, index) => ({
        rating: index + 1,
        count,
      }));
    },
    enabled: !!restaurantId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={reviewStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="rating" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};