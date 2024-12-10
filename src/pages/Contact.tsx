import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Contact } from "@/types/contact";
import { ContactList } from "@/components/contacts/ContactList";
import { ContactReviewDialog } from "@/components/contacts/ContactReviewDialog";

const ContactPage = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const { data: contacts, isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contacts")
        .select(`
          *,
          customer_reviews (
            review_count,
            average_rating,
            review_ids
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load contacts");
        throw error;
      }

      return data as Contact[];
    },
  });

  const { data: selectedContactReviews } = useQuery({
    queryKey: ["contact-reviews", selectedContact?.email],
    enabled: !!selectedContact?.email,
    queryFn: async () => {
      if (!selectedContact?.email) return [];
      
      const { data: reviewIds } = await supabase
        .from("customer_reviews")
        .select("review_ids")
        .eq("email", selectedContact.email)
        .single();

      if (!reviewIds?.review_ids?.length) return [];

      const { data: reviews, error } = await supabase
        .from("reviews")
        .select("*")
        .in("id", reviewIds.review_ids);

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