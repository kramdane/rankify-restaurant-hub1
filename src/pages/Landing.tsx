import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Star, MessageSquare, Gift, ChevronRight, Shield, Zap, LineChart } from "lucide-react";
import Header from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Your Customers Are Your Crown
                <span className="block text-[#8B5CF6]">When Was the Last Time You Asked for Their Opinion?</span>
              </h1>
              <p className="max-w-[600px] mx-auto text-muted text-lg md:text-xl">
                Rankify helps local businesses collect reviews, engage customers, and build loyalty effortlessly.
              </p>
            </div>
            <div className="flex gap-4">
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  Get Started for Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" asChild>
                <Link to="#how-it-works" className="gap-2">
                  Discover How It Works
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="relative">
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <img
                src="/lovable-uploads/b9429ec9-eb27-42d2-ab5b-a8098a2403b2.png"
                alt="Rankify Dashboard"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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
            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-[#8B5CF6]" />
                <CardTitle>Review Collection 📝</CardTitle>
                <CardDescription>
                  Collect and showcase reviews from your customers effortlessly
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="h-12 w-12 text-[#8B5CF6]" />
                <CardTitle>Smart Communication 💬</CardTitle>
                <CardDescription>
                  Engage your audience via Email, SMS, and WhatsApp
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <LineChart className="h-12 w-12 text-[#8B5CF6]" />
                <CardTitle>Analytics Dashboard 📊</CardTitle>
                <CardDescription>
                  Track your growth and customer satisfaction in real-time
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 bg-accent" id="how-it-works">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              How It Works 🎯
            </h2>
            <p className="max-w-[900px] text-muted md:text-xl">
              Three simple steps to transform your customer relationships
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="rounded-full bg-[#8B5CF6] p-4">
                <span className="text-2xl text-white">1</span>
              </div>
              <h3 className="text-xl font-bold">Sign Up in Minutes ⚡</h3>
              <p className="text-muted">Set up your profile and link your business</p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="rounded-full bg-[#8B5CF6] p-4">
                <span className="text-2xl text-white">2</span>
              </div>
              <h3 className="text-xl font-bold">Engage Customers 🤝</h3>
              <p className="text-muted">Collect reviews and send offers easily</p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="rounded-full bg-[#8B5CF6] p-4">
                <span className="text-2xl text-white">3</span>
              </div>
              <h3 className="text-xl font-bold">Grow Your Business 📈</h3>
              <p className="text-muted">Watch your reviews, loyalty, and sales soar</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full border-t bg-accent py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-[#8B5CF6]">40% 📈</div>
                <p className="text-muted">More repeat customers with loyalty rewards</p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-[#8B5CF6]">20% ⭐</div>
                <p className="text-muted">Increase in average customer ratings</p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-[#8B5CF6]">2x 🚀</div>
                <p className="text-muted">Faster review responses vs competitors</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full py-12 md:py-24" id="pricing">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Simple, Transparent Pricing 💰
            </h2>
            <p className="max-w-[900px] text-muted md:text-xl">
              Choose the plan that's right for your business
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <div className="text-3xl font-bold">$29/mo</div>
                <CardDescription>Perfect for small businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-left">
                  <li>✅ Up to 100 reviews/month</li>
                  <li>✅ Basic analytics</li>
                  <li>✅ Email support</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-[#8B5CF6]">
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <div className="text-3xl font-bold">$99/mo</div>
                <CardDescription>For growing businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-left">
                  <li>✅ Unlimited reviews</li>
                  <li>✅ Advanced analytics</li>
                  <li>✅ Priority support</li>
                  <li>✅ Custom branding</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <div className="text-3xl font-bold">Custom</div>
                <CardDescription>For large organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-left">
                  <li>✅ All Pro features</li>
                  <li>✅ Custom integration</li>
                  <li>✅ Dedicated support</li>
                  <li>✅ SLA guarantee</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24" id="get-started">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready to Make Every Customer Your Biggest Fan? 🌟
              </h2>
              <p className="max-w-[600px] text-muted md:text-xl">
                Join thousands of businesses already growing with Rankify
              </p>
            </div>
            <div className="flex gap-4">
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  Sign Up for Free Today
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row md:py-0">
          <p className="text-center text-sm leading-loose text-muted md:text-left">
            © 2024 Rankify. Helping Local Businesses Thrive One Customer at a Time.
          </p>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/about" className="text-muted hover:text-foreground">
              About
            </Link>
            <Link to="/features" className="text-muted hover:text-foreground">
              Features
            </Link>
            <Link to="/contact" className="text-muted hover:text-foreground">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Landing;