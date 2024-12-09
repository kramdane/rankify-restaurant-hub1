import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TimeRange } from "./TimeRangeSelect";
import { eachDayOfInterval, format, isWithinInterval } from "date-fns";

interface ReviewsChartProps {
  timeRange: TimeRange;
  restaurantId?: number;
}

export const ReviewsChart = ({ timeRange, restaurantId }: ReviewsChartProps) => {
  const { data: reviews } = useQuery({
    queryKey: ["reviews", restaurantId, timeRange],
    queryFn: async () => {
      if (!restaurantId) return [];
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .gte("created_at", timeRange.start.toISOString())
        .lte("created_at", timeRange.end.toISOString());
      if (error) throw error;
      return data || [];
    },
    enabled: !!restaurantId,
  });

  const days = eachDayOfInterval({
    start: timeRange.start,
    end: timeRange.end,
  });

  const data = days.map(day => {
    const dayReviews = reviews?.filter(review => 
      isWithinInterval(new Date(review.created_at), {
        start: new Date(format(day, 'yyyy-MM-dd')),
        end: new Date(format(day, 'yyyy-MM-dd 23:59:59')),
      })
    ) || [];

    return {
      date: format(day, 'MMM dd'),
      good: dayReviews.filter(review => review.rating >= 4).length,
      bad: dayReviews.filter(review => review.rating < 4).length,
    };
  });

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Reviews Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="good" stackId="reviews" fill="#22c55e" name="Good Reviews" />
            <Bar dataKey="bad" stackId="reviews" fill="#ef4444" name="Bad Reviews" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};