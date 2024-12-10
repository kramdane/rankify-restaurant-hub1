import { useState } from "react";
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

interface Word {
  word: string;
  sentiment: "positive" | "negative" | "neutral";
  count: number;
}

const sentimentColors = {
  positive: "bg-success hover:bg-success/90",
  negative: "bg-destructive hover:bg-destructive/90",
  neutral: "bg-muted hover:bg-muted/90",
};

const textColors = {
  positive: "text-success-foreground",
  negative: "text-destructive-foreground",
  neutral: "text-muted-foreground",
};

export const WordWall = ({ restaurantId }: { restaurantId?: string }) => {
  const [filter, setFilter] = useState<"all" | "positive" | "negative" | "neutral">("all");
  const [search, setSearch] = useState("");

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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredWords?.map((word, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <button
                    className={`p-4 rounded-lg ${sentimentColors[word.sentiment]} ${
                      textColors[word.sentiment]
                    } text-sm font-medium transition-colors duration-200 w-full text-center relative group`}
                  >
                    <span className="absolute top-1 right-2 text-xs opacity-50">
                      {word.count}x
                    </span>
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
    </div>
  );
};