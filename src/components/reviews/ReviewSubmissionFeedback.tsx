import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface ReviewSubmissionFeedbackProps {
  rating: number;
  preferredPlatform?: string;
  socialMediaUrls: {
    google_business_url?: string;
    facebook_url?: string;
    tripadvisor_url?: string;
  };
}

export function ReviewSubmissionFeedback({ rating, preferredPlatform = "google", socialMediaUrls }: ReviewSubmissionFeedbackProps) {
  const getSocialMediaUrl = () => {
    switch (preferredPlatform) {
      case "facebook":
        return socialMediaUrls.facebook_url;
      case "google":
        return socialMediaUrls.google_business_url;
      case "tripadvisor":
        return socialMediaUrls.tripadvisor_url;
      default:
        return null;
    }
  };

  const getPlatformName = () => {
    switch (preferredPlatform) {
      case "facebook":
        return "Facebook";
      case "google":
        return "Google";
      case "tripadvisor":
        return "Tripadvisor";
      default:
        return "";
    }
  };

  if (rating <= 3) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>We're Sorry About Your Experience</CardTitle>
          <CardDescription>
            We take your feedback seriously and would like to make things right.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Our team will contact you soon to get more information and improve our service.</p>
        </CardContent>
      </Card>
    );
  }

  const socialMediaUrl = getSocialMediaUrl();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thank You for Your Positive Review!</CardTitle>
        <CardDescription>
          We're glad you enjoyed your experience with us.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Would you mind sharing your experience on {getPlatformName()}? It would help us a lot!</p>
        {socialMediaUrl && (
          <Button onClick={() => window.open(socialMediaUrl, "_blank")} className="w-full">
            Leave a Review on {getPlatformName()} <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}