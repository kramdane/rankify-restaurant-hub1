import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewsChart } from "@/components/ReviewsChart";
import { RecentReviews } from "@/components/RecentReviews";
import { TimeRange } from "@/components/TimeRangeSelect";

interface AnalyticsSectionProps {
  timeRange: TimeRange;
  restaurantId?: number;
}

export const AnalyticsSection = ({ timeRange, restaurantId }: AnalyticsSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Reviews Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewsChart timeRange={timeRange} restaurantId={restaurantId} />
        </CardContent>
      </Card>
      
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentReviews restaurantId={restaurantId} />
        </CardContent>
      </Card>
    </div>
  );
};