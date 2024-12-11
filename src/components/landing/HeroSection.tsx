import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Your Customers Are Your Crown
              <span className="block text-[#8B5CF6]">When Was the Last Time You Asked for Their Opinion?</span>
            </h1>
            <p className="max-w-[600px] mx-auto text-muted text-lg md:text-xl">
              Avify helps local businesses collect reviews, engage customers, and build loyalty effortlessly.
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
  );
};