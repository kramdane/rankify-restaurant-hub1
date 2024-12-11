import Header from "@/components/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <DashboardPreview />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Landing;