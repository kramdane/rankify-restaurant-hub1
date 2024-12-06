import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare, Menu as MenuIcon, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Reviews",
      value: "128",
      icon: Star,
      trend: "+12% from last month",
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
      value: "4.8",
      icon: TrendingUp,
      trend: "+0.3 from last month",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Restaurant Name</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your restaurant</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-600 mt-1">{stat.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;