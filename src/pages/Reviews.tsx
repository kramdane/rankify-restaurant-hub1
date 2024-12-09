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
import { Star, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";

const Reviews = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<"date" | "rating">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        navigate("/login");
        return null;
      }
      return user;
    },
  });

  const { data: restaurant, isLoading: isLoadingRestaurant } = useQuery({
    queryKey: ["restaurant", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data: restaurant, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching restaurant:", error);
        return null;
      }
      return restaurant;
    },
    enabled: !!user?.id,
  });

  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["reviews", restaurant?.id, sortBy, sortOrder],
    queryFn: async () => {
      if (!restaurant?.id) return [];
      const query = supabase
        .from("reviews")
        .select("*")
        .eq("restaurant_id", restaurant.id)
        .order(sortBy === "date" ? "created_at" : "rating", { ascending: sortOrder === "asc" });

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching reviews:", error);
        return [];
      }
      return data || [];
    },
    enabled: !!restaurant?.id,
  });

  const handleExport = async () => {
    if (!reviews || !startDate || !endDate) return;

    const filteredReviews = reviews.filter(review => {
      const reviewDate = new Date(review.created_at);
      return reviewDate >= startDate && reviewDate <= endDate;
    });

    const csvContent = [
      ["Date", "Heure", "Note", "Nom", "Email", "Téléphone", "Commentaire"].join(","),
      ...filteredReviews.map(review => [
        format(new Date(review.created_at), "dd/MM/yyyy"),
        format(new Date(review.created_at), "HH:mm"),
        review.rating,
        review.reviewer_name,
        review.email || "",
        review.phone || "",
        `"${review.comment || ""}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `reviews_${format(startDate, "dd-MM-yyyy")}_to_${format(endDate, "dd-MM-yyyy")}.csv`;
    link.click();
  };

  if (isLoadingRestaurant || isLoadingReviews) {
    return <div>Loading...</div>;
  }

  if (!restaurant) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold">No restaurant found</h2>
          <p className="text-gray-600 mt-2">Please create a restaurant first.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Reviews</h1>
            <div className="w-96">
              <ReviewLink restaurantId={restaurant.id} />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  if (sortBy === "date") {
                    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
                  }
                  setSortBy("date");
                }}
              >
                Trier par date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (sortBy === "rating") {
                    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
                  }
                  setSortBy("rating");
                }}
              >
                Trier par note {sortBy === "rating" && (sortOrder === "asc" ? "↑" : "↓")}
              </Button>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Exporter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Exporter les avis</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex flex-col gap-2">
                    <label>Date de début</label>
                    <DatePicker date={startDate} setDate={setStartDate} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label>Date de fin</label>
                    <DatePicker date={endDate} setDate={setEndDate} />
                  </div>
                  <Button 
                    onClick={handleExport}
                    disabled={!startDate || !endDate}
                    className="w-full"
                  >
                    Exporter en CSV
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Note</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Heure</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Commentaire</TableHead>
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
                <TableCell>{format(new Date(review.created_at), "dd/MM/yyyy")}</TableCell>
                <TableCell>{format(new Date(review.created_at), "HH:mm")}</TableCell>
                <TableCell>{review.reviewer_name}</TableCell>
                <TableCell>{review.email || "-"}</TableCell>
                <TableCell>{review.phone || "-"}</TableCell>
                <TableCell>{review.comment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default Reviews;