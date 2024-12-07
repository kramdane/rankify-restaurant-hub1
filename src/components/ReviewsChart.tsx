import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

// Mock data - replace with actual data from your backend
const data = [
  { date: "Mon", good: 4, bad: 1 },
  { date: "Tue", good: 3, bad: 2 },
  { date: "Wed", good: 7, bad: 0 },
  { date: "Thu", good: 5, bad: 1 },
  { date: "Fri", good: 6, bad: 2 },
  { date: "Sat", good: 8, bad: 1 },
  { date: "Sun", good: 4, bad: 0 },
];

export const ReviewsChart = () => {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Reviews Last 7 Days</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="good" stackId="reviews" fill="#22c55e" name="Good Reviews" />
            <Bar dataKey="bad" stackId="reviews" fill="#ef4444" name="Bad Reviews" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};