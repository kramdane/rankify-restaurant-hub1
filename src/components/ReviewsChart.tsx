import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TimeRange } from "@/components/TimeRangeSelect";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { LoadingSpinner } from "./LoadingSpinner";

interface ReviewsChartProps {
  timeRange: TimeRange;
  restaurantId?: number | string;
}

export const ReviewsChart = ({ timeRange, restaurantId }: ReviewsChartProps) => {
  const { data: reviewStats, isLoading } = useQuery({
    queryKey: ["review-stats", restaurantId, timeRange],
    queryFn: async () => {
      if (!restaurantId) return [];
      
      const { data, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("restaurant_id", restaurantId)
        .gte("created_at", timeRange.start.toISOString())
        .lte("created_at", timeRange.end.toISOString());

      if (error) {
        console.error("Error fetching reviews:", error);
        throw error;
      }

      // Initialize distribution array with zeros for ratings 1-5
      const distribution = Array(5).fill(0);
      
      // Count occurrences of each rating
      data?.forEach((review) => {
        if (review.rating >= 1 && review.rating <= 5) {
          distribution[review.rating - 1]++;
        }
      });

      // Transform to chart data format
      return distribution.map((count, index) => ({
        rating: `${index + 1} Star${count !== 1 ? 's' : ''}`,
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

  if (!reviewStats?.length) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No reviews data available
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={reviewStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="rating"
            className="text-muted-foreground text-xs"
          />
          <YAxis 
            allowDecimals={false}
            className="text-muted-foreground text-xs"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px'
            }}
            labelStyle={{
              color: 'hsl(var(--foreground))'
            }}
          />
          <Bar 
            dataKey="count" 
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};