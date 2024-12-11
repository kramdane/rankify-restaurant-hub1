import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Users, MessageSquare, Gift } from "lucide-react";
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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-accent py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Your Customers Are Your Crown
                </h1>
                <p className="max-w-[600px] text-muted md:text-xl">
                  When Was the Last Time You Asked for Their Opinion? Rankify helps local businesses collect reviews, engage customers, and build loyalty effortlessly.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/register">
                  <Button size="lg" className="gap-2">
                    Get Started for Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" asChild>
                  <Link to="#how-it-works">Discover How It Works</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                alt="Dashboard Preview"
                className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32" id="features">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Transform Feedback into Growth
              </h2>
              <p className="max-w-[900px] text-muted md:text-xl">
                Powerful tools to help you collect, manage, and leverage customer feedback
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Star className="h-10 w-10 text-primary" />
                <CardTitle>Review Collection</CardTitle>
                <CardDescription>
                  Collect and showcase reviews from your customers effortlessly
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <MessageSquare className="h-10 w-10 text-primary" />
                <CardTitle>Smart Communication</CardTitle>
                <CardDescription>
                  Engage your audience via Email, SMS, and WhatsApp
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Gift className="h-10 w-10 text-primary" />
                <CardTitle>Loyalty Rewards</CardTitle>
                <CardDescription>
                  Create a loyalty program that keeps them coming back
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full border-t bg-accent py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="text-4xl font-bold">40%</div>
                <p className="text-muted">More repeat customers with loyalty rewards</p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="text-4xl font-bold">20%</div>
                <p className="text-muted">Increase in average customer ratings</p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="text-4xl font-bold">2x</div>
                <p className="text-muted">Faster review responses vs competitors</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32" id="get-started">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready to Make Every Customer Your Biggest Fan?
              </h2>
              <p className="max-w-[600px] text-muted md:text-xl">
                Join thousands of businesses already growing with Rankify
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
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