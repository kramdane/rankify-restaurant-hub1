import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare, Menu as MenuIcon, TrendingUp } from "lucide-react";
import { ReviewsChart } from "@/components/ReviewsChart";
import { RecentReviews } from "@/components/RecentReviews";
import { SimpleChat } from "@/components/SimpleChat";
import { WordWall } from "@/components/WordWall";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TimeRangeSelect, TimeRange } from "@/components/TimeRangeSelect";
import { useState } from "react";
import { addDays, startOfDay, endOfDay } from "date-fns";

// ... keep existing code (imports and other unchanged sections)

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
      color: "bg-blue-500",
      iconColor: "text-blue-500",
    },
    {
      title: "Review Rate",
      value: averageRating,
      icon: TrendingUp,
      trend: ratingChange,
      color: "bg-green-500",
      iconColor: "text-green-500",
    },
    {
      title: "Active Campaigns",
      value: "3",
      icon: MessageSquare,
      trend: "0%",
      color: "bg-purple-500",
      iconColor: "text-purple-500",
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`absolute inset-0 h-1 ${stat.color}`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className={`inline-flex items-center text-xs mt-1 ${
                  stat.trend.startsWith('+') 
                    ? 'text-green-600' 
                    : stat.trend.startsWith('-') 
                      ? 'text-red-600' 
                      : 'text-muted'
                }`}>
                  <span>{stat.trend}</span>
                  <span className="ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Review Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <WordWall restaurantId={restaurant?.id} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Reviews Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewsChart timeRange={timeRange} restaurantId={restaurant?.id} />
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentReviews restaurantId={restaurant?.id} />
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="fixed bottom-4 right-4">
        <SimpleChat />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
