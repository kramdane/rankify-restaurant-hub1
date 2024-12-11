import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="w-full py-12 md:py-24" id="get-started">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Ready to Make Every Customer Your Biggest Fan? 🌟
            </h2>
            <p className="max-w-[600px] text-muted md:text-xl">
              Join thousands of businesses already growing with Avify
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
  );
};