import { DashboardLayout } from "@/components/DashboardLayout";
import { TimeRangeSelect, TimeRange } from "@/components/TimeRangeSelect";
import { useState } from "react";
import { addDays, startOfDay, endOfDay } from "date-fns";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { AnalyticsSection } from "@/components/dashboard/AnalyticsSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { WordWall } from "@/components/WordWall";
import { SimpleChat } from "@/components/SimpleChat";

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

        <StatsCards
          totalReviews={totalReviews}
          reviewsChange={reviewsChange}
          averageRating={averageRating}
          ratingChange={ratingChange}
        />

        <AnalyticsSection timeRange={timeRange} restaurantId={restaurant?.id} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WordWall restaurantId={restaurant?.id} />
          <SimpleChat />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;