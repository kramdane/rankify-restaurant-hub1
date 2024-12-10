import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ReviewLinkProps {
  restaurantId: string;
}

export const ReviewLink = ({ restaurantId }: ReviewLinkProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState<any>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      console.log("Fetching restaurant with ID:", restaurantId);
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', restaurantId)
        .single();

      if (error) {
        console.error('Error fetching restaurant:', error);
        toast.error('Error generating review link');
        return;
      }

      console.log("Found restaurant:", data);
      setRestaurant(data);
      setLoading(false);
    };

    fetchRestaurant();
  }, [restaurantId]);

  const reviewLink = `${window.location.origin}/review/${restaurant?.id}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(reviewLink);
      setIsCopied(true);
      toast.success("Review link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  if (loading) {
    return <div>Loading review link...</div>;
  }

  return (
    <div className="flex gap-2">
      <Input
        value={reviewLink}
        readOnly
        className="bg-gray-50"
      />
      <Button
        onClick={copyLink}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Copy className="h-4 w-4" />
        {isCopied ? "Copied!" : "Copy"}
      </Button>
    </div>
  );
};