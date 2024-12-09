import { DashboardLayout } from "@/components/DashboardLayout";
import { ReviewLink } from "@/components/ReviewLink";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Star } from "lucide-react";

const Reviews = () => {
  const { data: restaurant } = useQuery({
    queryKey: ["restaurant"],
    queryFn: async () => {
      const { data: restaurant } = await supabase
        .from("restaurants")
        .select("*")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .single();
      return restaurant;
    },
  });

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", restaurant?.id],
    queryFn: async () => {
      if (!restaurant?.id) return [];
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("restaurant_id", restaurant.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!restaurant?.id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Reviews</h1>
          {restaurant && (
            <div className="w-96">
              <ReviewLink restaurantId={restaurant.id} />
            </div>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews?.map((review) => (
              <TableRow key={review.id}>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell>{review.comment}</TableCell>
                <TableCell>{review.reviewer_name}</TableCell>
                <TableCell>
                  {new Date(review.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default Reviews;