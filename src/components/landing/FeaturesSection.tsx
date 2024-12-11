import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Zap, LineChart, MessageSquare, Gift, Star } from "lucide-react";

const features = [
  {
    icon: Star,
    title: "Review Collection & Management",
    description: "Collect and organize customer reviews in one central dashboard to build trust with your audience."
  },
  {
    icon: MessageSquare,
    title: "Smart Communication Channels",
    description: "Connect with customers via Email, SMS, or WhatsApp to share updates and personalized offers."
  },
  {
    icon: Zap,
    title: "AI-Powered Recommendations",
    description: "Use AI to analyze preferences and provide unique recommendations that increase satisfaction."
  },
  {
    icon: LineChart,
    title: "Online Menu/Catalog Creation",
    description: "Create and manage your menu online, keeping offerings accessible to customers anytime."
  },
  {
    icon: Gift,
    title: "Reward and Retain Customers",
    description: "Motivate repeat visits with a built-in rewards system that makes every interaction meaningful."
  },
  {
    icon: Shield,
    title: "Actionable Insights Dashboard",
    description: "Get a bird's-eye view of customer interactions and make informed decisions to grow."
  }
];

export const FeaturesSection = () => {
  return (
    <section className="w-full py-12 md:py-24" id="features">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
            Features designed for you 🚀
          </h2>
          <p className="max-w-[900px] text-muted md:text-xl">
            Everything you need to manage your customer relationships effectively
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <feature.icon className="h-12 w-12 text-[#8B5CF6]" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};