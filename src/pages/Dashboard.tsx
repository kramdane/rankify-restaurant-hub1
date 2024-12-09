import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare, Menu as MenuIcon, TrendingUp } from "lucide-react";
import { ReviewsChart } from "@/components/ReviewsChart";
import { RecentReviews } from "@/components/RecentReviews";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TimeRangeSelect, TimeRange } from "@/components/TimeRangeSelect";
import { useState } from "react";
import { addDays, startOfDay, endOfDay } from "date-fns";

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>({
    start: startOfDay(addDays(new Date(), -7)),
    end: endOfDay(new Date()),
  });

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
  });

  const { data: restaurant } = useQuery({
    queryKey: ["restaurant", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: reviews } = useQuery({
    queryKey: ["reviews", restaurant?.id, timeRange],
    queryFn: async () => {
      if (!restaurant?.id) return [];
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("restaurant_id", restaurant.id)
        .gte("created_at", timeRange.start.toISOString())
        .lte("created_at", timeRange.end.toISOString());
      if (error) throw error;
      return data || [];
    },
    enabled: !!restaurant?.id,
  });

  const totalReviews = reviews?.length || 0;
  const averageRating = reviews?.length 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const stats = [
    {
      title: "Total Reviews",
      value: totalReviews.toString(),
      icon: Star,
      trend: `${reviews?.length || 0} in selected period`,
    },
    {
      title: "Menu Items",
      value: "45",
      icon: MenuIcon,
      trend: "3 new items added",
    },
    {
      title: "Active Campaigns",
      value: "3",
      icon: MessageSquare,
      trend: "2 ending soon",
    },
    {
      title: "Review Rate",
      value: averageRating,
      icon: TrendingUp,
      trend: "Average rating in period",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {restaurant?.name || "Restaurant Name"}</h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your restaurant
          </p>
        </div>

        <TimeRangeSelect onChange={setTimeRange} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-600 mt-1">{stat.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ReviewsChart timeRange={timeRange} restaurantId={restaurant?.id} />
          <RecentReviews />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;