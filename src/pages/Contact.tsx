import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Contact } from "@/types/contact";
import { ContactList } from "@/components/contacts/ContactList";
import { ContactReviewDialog } from "@/components/contacts/ContactReviewDialog";

const ContactPage = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const { data: contacts, isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      // Get the current user's restaurant ID first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: restaurant, error: restaurantError } = await supabase
        .from("restaurants")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (restaurantError) {
        toast.error("Failed to load restaurant data");
        throw restaurantError;
      }

      // Now fetch customer reviews for this restaurant
      const { data: customerReviews, error: reviewsError } = await supabase
        .from("customer_reviews")
        .select("*")
        .eq("restaurant_id", restaurant.id);

      if (reviewsError) {
        toast.error("Failed to load customer reviews");
        throw reviewsError;
      }

      // Transform the data to match the Contact type
      const contacts = customerReviews.map(review => ({
        id: review.review_ids?.[0] || '', // Using first review ID as contact ID
        firstname: review.reviewer_name?.split(' ')[0] || '',
        lastname: review.reviewer_name?.split(' ')[1] || '',
        email: review.email || '',
        phone: review.phone || '',
        addeddate: review.last_review_date || new Date().toISOString(),
        reviewcount: review.review_count || 0,
        created_at: review.last_review_date || null,
        updated_at: review.last_review_date || null,
        customer_reviews: [{
          average_rating: review.average_rating || 0,
          review_count: review.review_count || 0,
          review_ids: review.review_ids || [],
        }]
      }));

      return contacts as Contact[];
    },
  });

  const { data: selectedContactReviews } = useQuery({
    queryKey: ["contact-reviews", selectedContact?.email],
    enabled: !!selectedContact?.email,
    queryFn: async () => {
      if (!selectedContact?.email) return [];
      
      const { data: reviews, error } = await supabase
        .from("reviews")
        .select("*")
        .in("id", selectedContact.customer_reviews?.[0]?.review_ids || []);

      if (error) {
        toast.error("Failed to load review details");
        throw error;
      }

      return reviews || [];
    },
  });

  const calculateAverageRating = (reviews: any[]) => {
    if (!reviews || reviews.length === 0) return "0.0";
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const handleExportCSV = () => {
    if (!contacts) return;

    const headers = [
      "First Name",
      "Last Name",
      "Phone",
      "Email",
      "Added Date",
      "Review Count",
      "Average Rating",
    ];
    const csvData = contacts.map((contact) => [
      contact.firstname,
      contact.lastname,
      contact.phone || "",
      contact.email || "",
      new Date(contact.addeddate).toLocaleDateString(),
      contact.reviewcount || 0,
      calculateAverageRating(selectedContactReviews || []),
    ]);

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join(
      "\n"
    );

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "contacts.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <CardTitle>Contact List</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactList
            contacts={contacts || []}
            onContactSelect={setSelectedContact}
            selectedContactReviews={selectedContactReviews}
            calculateAverageRating={calculateAverageRating}
            handleExportCSV={handleExportCSV}
          />
        </CardContent>
      </Card>

      <ContactReviewDialog
        selectedContact={selectedContact}
        selectedContactReviews={selectedContactReviews || []}
        calculateAverageRating={calculateAverageRating}
        onOpenChange={(open) => !open && setSelectedContact(null)}
      />
    </DashboardLayout>
  );
};

export default ContactPage;
