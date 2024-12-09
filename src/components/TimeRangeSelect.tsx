import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { addDays, startOfDay, endOfDay, startOfMonth, subMonths, subYears } from "date-fns";

export type TimeRange = {
  start: Date;
  end: Date;
};

interface TimeRangeSelectProps {
  onChange: (range: TimeRange) => void;
}

export const TimeRangeSelect = ({ onChange }: TimeRangeSelectProps) => {
  const handleRangeChange = (value: string) => {
    const now = new Date();
    let end = endOfDay(now);
    let start;

    switch (value) {
      case "today":
        start = startOfDay(now);
        break;
      case "yesterday":
        start = startOfDay(addDays(now, -1));
        end = endOfDay(addDays(now, -1));
        break;
      case "last7days":
        start = startOfDay(addDays(now, -7));
        break;
      case "thisMonth":
        start = startOfMonth(now);
        break;
      case "last6months":
        start = startOfDay(subMonths(now, 6));
        break;
      case "lastYear":
        start = startOfDay(subYears(now, 1));
        break;
      default:
        return;
    }

    if (start) {
      onChange({ start, end });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Select onValueChange={handleRangeChange} defaultValue="last7days">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="last7days">Last 7 days</SelectItem>
          <SelectItem value="thisMonth">This month</SelectItem>
          <SelectItem value="last6months">Last 6 months</SelectItem>
          <SelectItem value="lastYear">Last year</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};