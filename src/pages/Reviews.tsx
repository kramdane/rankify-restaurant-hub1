import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReviewsChart } from "@/components/ReviewsChart";
import { TimeRangeSelect } from "@/components/TimeRangeSelect";
import { useState } from "react";
import { addDays } from "date-fns";

const Reviews = () => {
  const [timeRange, setTimeRange] = useState({
    start: addDays(new Date(), -7),
    end: new Date(),
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 px-4 md:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Reviews Analytics</h1>
          <TimeRangeSelect value={timeRange} onChange={setTimeRange} />
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Reviews Over Time</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="min-h-[400px] w-full">
              <ReviewsChart timeRange={timeRange} />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reviews;