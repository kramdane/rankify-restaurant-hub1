import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare, Menu as MenuIcon, TrendingUp } from "lucide-react";
import { ReviewsChart } from "@/components/ReviewsChart";
import { RecentReviews } from "@/components/RecentReviews";
import { ChatBot } from "@/components/ChatBot";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TimeRangeSelect, TimeRange } from "@/components/TimeRangeSelect";
import { useState } from "react";
import { addDays, startOfDay, endOfDay } from "date-fns";
import { FloatingChatBot } from "@/components/FloatingChatBot";

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

  const { data: previousPeriodReviews } = useQuery({
    queryKey: ["previous-reviews", restaurant?.id, timeRange],
    queryFn: async () => {
      if (!restaurant?.id) return [];
      const periodLength = timeRange.end.getTime() - timeRange.start.getTime();
      const previousStart = new Date(timeRange.start.getTime() - periodLength);
      const previousEnd = new Date(timeRange.end.getTime() - periodLength);

      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("restaurant_id", restaurant.id)
        .gte("created_at", previousStart.toISOString())
        .lte("created_at", previousEnd.toISOString());
      if (error) throw error;
      return data || [];
    },
    enabled: !!restaurant?.id,
  });

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  const totalReviews = reviews?.length || 0;
  const previousTotalReviews = previousPeriodReviews?.length || 0;
  const reviewsChange = calculatePercentageChange(totalReviews, previousTotalReviews);

  const averageRating = reviews?.length 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";
  const previousAverageRating = previousPeriodReviews?.length
    ? (previousPeriodReviews.reduce((sum, review) => sum + review.rating, 0) / previousPeriodReviews.length).toFixed(1)
    : "0.0";
  const ratingChange = calculatePercentageChange(parseFloat(averageRating), parseFloat(previousAverageRating));

  const stats = [
    {
      title: "Total Reviews",
      value: totalReviews.toString(),
      icon: Star,
      trend: reviewsChange,
    },
    {
      title: "Menu Items",
      value: "45",
      icon: MenuIcon,
      trend: "+5%",
    },
    {
      title: "Active Campaigns",
      value: "3",
      icon: MessageSquare,
      trend: "0%",
    },
    {
      title: "Review Rate",
      value: averageRating,
      icon: TrendingUp,
      trend: ratingChange,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {restaurant?.name || "Business Name"}
          </h1>
          <p className="text-muted mt-2">
            Here's what's happening with your business
          </p>
        </div>

        <TimeRangeSelect onChange={setTimeRange} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className={`text-xs mt-1 ${stat.trend.startsWith('+') ? 'text-green-600' : stat.trend.startsWith('-') ? 'text-red-600' : 'text-muted'}`}>
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReviewsChart timeRange={timeRange} restaurantId={restaurant?.id} />
          <RecentReviews restaurantId={restaurant?.id} />
        </div>
      </div>
      <FloatingChatBot restaurantId={restaurant?.id} />
    </DashboardLayout>
  );
};

export default Dashboard;
