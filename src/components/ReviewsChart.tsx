import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TimeRange } from "@/components/TimeRangeSelect";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { LoadingSpinner } from "./LoadingSpinner";
import { format, eachDayOfInterval } from "date-fns";
import { Card, CardContent } from "./ui/card";

interface ReviewsChartProps {
  timeRange: TimeRange;
  restaurantId?: number | string;
}

export const ReviewsChart = ({ timeRange, restaurantId }: ReviewsChartProps) => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["review-stats", restaurantId, timeRange],
    queryFn: async () => {
      if (!restaurantId) return [];
      
      const { data, error } = await supabase
        .from("reviews")
        .select("rating, created_at")
        .eq("restaurant_id", restaurantId)
        .gte("created_at", timeRange.start.toISOString())
        .lte("created_at", timeRange.end.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching reviews:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!restaurantId,
  });

  // Process data for daily distribution
  const dailyData = reviews ? eachDayOfInterval({
    start: timeRange.start,
    end: timeRange.end
  }).map(date => {
    const dayReviews = reviews.filter(review => 
      format(new Date(review.created_at), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    
    const goodReviews = dayReviews.filter(review => review.rating >= 4).length;
    const badReviews = dayReviews.filter(review => review.rating < 4).length;

    return {
      date: format(date, 'MMM dd'),
      good: goodReviews,
      bad: badReviews
    };
  }) : [];

  // Process data for accumulative chart
  const accumulativeData = dailyData.reduce((acc, curr, index) => {
    const previous = acc[index - 1] || { accGood: 0, accBad: 0 };
    acc.push({
      date: curr.date,
      accGood: previous.accGood + curr.good,
      accBad: previous.accBad + curr.bad
    });
    return acc;
  }, [] as Array<{ date: string; accGood: number; accBad: number }>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!reviews?.length) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No reviews data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium mb-4">Daily Review Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date"
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
                  dataKey="good" 
                  fill="hsl(var(--success))"
                  name="Good Reviews (4-5 ★)"
                  stackId="stack"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="bad" 
                  fill="hsl(var(--destructive))"
                  name="Bad Reviews (1-3 ★)"
                  stackId="stack"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium mb-4">Accumulative Reviews Over Time</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accumulativeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date"
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
                <Line 
                  type="monotone" 
                  dataKey="accGood" 
                  stroke="hsl(var(--success))"
                  name="Good Reviews (4-5 ★)"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="accBad" 
                  stroke="hsl(var(--destructive))"
                  name="Bad Reviews (1-3 ★)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};