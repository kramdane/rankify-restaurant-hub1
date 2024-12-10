import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TimeRange } from "./TimeRangeSelect";
import { eachDayOfInterval, format, parseISO, startOfDay, endOfDay } from "date-fns";

interface ReviewsChartProps {
  timeRange: TimeRange;
  restaurantId?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-green-600 text-sm">
            Positive Reviews: {payload[0].value}
          </p>
          <p className="text-red-600 text-sm">
            Negative Reviews: {payload[1].value}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export const ReviewsChart = ({ timeRange, restaurantId }: ReviewsChartProps) => {
  const { data: reviews } = useQuery({
    queryKey: ["reviews", restaurantId, timeRange],
    queryFn: async () => {
      if (!restaurantId) return [];
      
      // Format dates for Supabase query
      const startDate = startOfDay(timeRange.start).toISOString();
      const endDate = endOfDay(timeRange.end).toISOString();
      
      console.log('Fetching reviews between:', startDate, 'and', endDate);
      
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .gte("created_at", startDate)
        .lte("created_at", endDate);
        
      if (error) {
        console.error('Error fetching reviews:', error);
        throw error;
      }
      
      console.log('Fetched reviews:', data);
      return data || [];
    },
    enabled: !!restaurantId,
  });

  const days = eachDayOfInterval({
    start: timeRange.start,
    end: timeRange.end,
  });

  const data = days.map(day => {
    const dayStart = startOfDay(day).toISOString();
    const dayEnd = endOfDay(day).toISOString();
    
    const dayReviews = reviews?.filter(review => {
      const reviewDate = parseISO(review.created_at);
      return reviewDate >= parseISO(dayStart) && reviewDate <= parseISO(dayEnd);
    }) || [];

    return {
      date: format(day, 'MMM dd'),
      good: dayReviews.filter(review => review.rating >= 4).length,
      bad: dayReviews.filter(review => review.rating < 4).length,
    };
  });

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis 
            dataKey="date" 
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="good" 
            stackId="reviews" 
            fill="#22c55e" 
            radius={[4, 4, 0, 0]}
            name="Good Reviews" 
          />
          <Bar 
            dataKey="bad" 
            stackId="reviews" 
            fill="#ef4444" 
            radius={[4, 4, 0, 0]}
            name="Bad Reviews" 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};