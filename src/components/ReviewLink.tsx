import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Copy } from "lucide-react";

interface ReviewLinkProps {
  restaurantId: string;
}

export const ReviewLink = ({ restaurantId }: ReviewLinkProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const reviewLink = `${window.location.origin}/review/${restaurantId}`;

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