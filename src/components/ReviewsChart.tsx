import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TimeRange } from "@/components/TimeRangeSelect";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { LoadingSpinner } from "./LoadingSpinner";
import { format, eachDayOfInterval } from "date-fns";

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
    const total = goodReviews + badReviews;

    return {
      date: format(date, 'MMM dd'),
      total,
      good: goodReviews,
      bad: badReviews
    };
  }) : [];

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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-border">
          <p className="font-medium text-sm mb-2">{data.date}</p>
          <div className="space-y-1">
            <p className="text-sm text-success-foreground">
              Good Reviews: <span className="font-medium">{data.good}</span>
            </p>
            <p className="text-sm text-destructive-foreground">
              Bad Reviews: <span className="font-medium">{data.bad}</span>
            </p>
            <p className="text-sm font-medium pt-1 border-t">
              Total: {data.total}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={dailyData} 
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          className="animate-[slideUp_0.4s_ease-out]"
        >
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="0" 
            vertical={false}
            stroke="hsl(var(--border))"
            opacity={0.1}
          />
          <XAxis 
            dataKey="date"
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))', opacity: 0.1 }}
            tickLine={false}
          />
          <YAxis 
            allowDecimals={false}
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))', opacity: 0.1 }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone"
            dataKey="total"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#colorTotal)"
            className="transition-all duration-300"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};