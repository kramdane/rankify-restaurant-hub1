import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ChatContainer } from "./chat/ChatContainer";

export const ChatBot = ({ restaurantId }: { restaurantId?: number }) => {
  const { data: restaurant } = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: async () => {
      if (!restaurantId) return null;
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", restaurantId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!restaurantId,
  });

  const { data: reviews } = useQuery({
    queryKey: ["all-reviews", restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!restaurantId,
  });

  return (
    <ChatContainer
      restaurantId={restaurantId}
      reviews={reviews}
      ownerName={restaurant?.owner_name}
    />
  );
};