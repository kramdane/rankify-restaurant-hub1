import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addDays, startOfDay, endOfDay, startOfMonth, subMonths, subYears } from "date-fns";

export type TimeRange = {
  start: Date;
  end: Date;
};

interface TimeRangeSelectProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

export const TimeRangeSelect = ({ value, onChange }: TimeRangeSelectProps) => {
  const getSelectedValue = (range: TimeRange) => {
    const now = new Date();
    const today = startOfDay(now);
    const yesterday = startOfDay(addDays(now, -1));
    
    if (range.start.getTime() === today.getTime()) return "today";
    if (range.start.getTime() === yesterday.getTime()) return "yesterday";
    if (range.start.getTime() === startOfDay(addDays(now, -7)).getTime()) return "last7days";
    if (range.start.getTime() === startOfMonth(now).getTime()) return "thisMonth";
    if (range.start.getTime() === startOfDay(subMonths(now, 6)).getTime()) return "last6months";
    if (range.start.getTime() === startOfDay(subYears(now, 1)).getTime()) return "lastYear";
    return "last7days";
  };

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
      <Select onValueChange={handleRangeChange} value={getSelectedValue(value)}>
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent className="bg-white">
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