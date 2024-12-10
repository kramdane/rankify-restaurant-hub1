import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  totalReviews: number;
  reviewsChange: string;
  averageRating: string;
  ratingChange: string;
}

export const StatsCards = ({ totalReviews, reviewsChange, averageRating, ratingChange }: StatsCardsProps) => {
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
  );
};