import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { toast } from "sonner";
import { ReviewDialog } from "./ReviewDialog";

interface Word {
  word: string;
  sentiment: "positive" | "negative" | "neutral";
  count: number;
  reviews: any[];
}

interface Position {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const textColors = {
  positive: "text-green-600",
  negative: "text-red-600",
  neutral: "text-gray-900",
};

export const WordWall = ({ restaurantId }: { restaurantId?: string }) => {
  const [filter, setFilter] = useState<"all" | "positive" | "negative" | "neutral">("all");
  const [search, setSearch] = useState("");
  const [positions, setPositions] = useState<{ [key: string]: Position }>({});
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: words, isLoading, refetch, error } = useQuery({
    queryKey: ["word-wall", restaurantId],
    queryFn: async () => {
      console.log("Analyzing reviews for restaurant:", restaurantId);
      try {
        const { data, error } = await supabase.functions.invoke("analyze-reviews", {
          body: { restaurantId },
        });

        if (error) {
          console.error("Error from analyze-reviews function:", error);
          throw error;
        }

        console.log("Received analysis data:", data);
        return data.words as Word[];
      } catch (error) {
        console.error("Error in word wall query:", error);
        toast.error("Failed to analyze reviews. Please try again.");
        throw error;
      }
    },
    enabled: !!restaurantId,
  });

  useEffect(() => {
    if (!words) return;

    // Initialize random positions for new words
    const containerWidth = window.innerWidth * 0.8;
    const containerHeight = 400;

    const newPositions: { [key: string]: Position } = {};
    words.forEach((word) => {
      if (!positions[word.word]) {
        newPositions[word.word] = {
          x: Math.random() * (containerWidth - 100),
          y: Math.random() * (containerHeight - 40),
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
        };
      }
    });

    setPositions((prev) => ({ ...prev, ...newPositions }));

    // Animation loop
    const animate = () => {
      setPositions((prev) => {
        const updated = { ...prev };
        Object.entries(updated).forEach(([word, pos]) => {
          if (hoveredWord === word) return;

          // Update position
          pos.x += pos.vx;
          pos.y += pos.vy;

          // Bounce off walls
          if (pos.x <= 0 || pos.x >= containerWidth - 100) pos.vx *= -1;
          if (pos.y <= 0 || pos.y >= containerHeight - 40) pos.vy *= -1;
        });
        return updated;
      });
    };

    const intervalId = setInterval(animate, 50);
    return () => clearInterval(intervalId);
  }, [words, hoveredWord]);

  const filteredWords = words?.filter((word) => {
    const matchesFilter = filter === "all" || word.sentiment === filter;
    const matchesSearch = word.word.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (error) {
    console.error("Error in WordWall:", error);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search words..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by sentiment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sentiments</SelectItem>
            <SelectItem value="positive">Positive</SelectItem>
            <SelectItem value="negative">Negative</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredWords?.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          No words found
        </div>
      ) : (
        <TooltipProvider>
          <div className="relative h-[400px] border rounded-lg overflow-hidden">
            {filteredWords?.map((word, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <button
                    className={`absolute p-2 transition-all duration-200 ${
                      textColors[word.sentiment]
                    } text-sm font-medium hover:scale-110`}
                    style={{
                      left: positions[word.word]?.x,
                      top: positions[word.word]?.y,
                      transform: hoveredWord === word.word ? "scale(1.1)" : "scale(1)",
                    }}
                    onMouseEnter={() => setHoveredWord(word.word)}
                    onMouseLeave={() => setHoveredWord(null)}
                    onClick={() => {
                      if (word.reviews?.[0]) {
                        setSelectedReview(word.reviews[0]);
                        setIsDialogOpen(true);
                      }
                    }}
                  >
                    {word.word}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    This word appears {word.count} times and has a{" "}
                    {word.sentiment} sentiment
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      )}

      <ReviewDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        review={selectedReview}
      />
    </div>
  );
};