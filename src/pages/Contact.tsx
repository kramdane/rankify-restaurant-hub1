import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Star, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Contact {
  id: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  addeddate: string;
  reviewcount: number;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
}

const Contact = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const { data: contacts, isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load contacts");
        throw error;
      }

      return data as Contact[];
    },
  });

  const { data: selectedContactReviews } = useQuery({
    queryKey: ["contact-reviews", selectedContact?.id],
    enabled: !!selectedContact,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, rating, comment, created_at")
        .eq("email", selectedContact?.email)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load reviews");
        throw error;
      }

      return data as Review[];
    },
  });

  const handleExportCSV = () => {
    if (!contacts) return;

    const headers = ["First Name", "Last Name", "Phone", "Email", "Added Date", "Review Count", "Average Rating"];
    const csvData = contacts.map((contact) => [
      contact.firstname,
      contact.lastname,
      contact.phone || "",
      contact.email || "",
      new Date(contact.addeddate).toLocaleDateString(),
      contact.reviewcount || 0,
      calculateAverageRating(selectedContactReviews || []),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

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

  const calculateAverageRating = (reviews: Review[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Contacts</h1>
          <Button onClick={handleExportCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contact List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Added Date</TableHead>
                  <TableHead>Reviews</TableHead>
                  <TableHead>Average Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts?.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <button
                        onClick={() => setSelectedContact(contact)}
                        className="text-primary hover:underline focus:outline-none"
                      >
                        {contact.firstname} {contact.lastname}
                      </button>
                    </TableCell>
                    <TableCell>{contact.phone || "-"}</TableCell>
                    <TableCell>{contact.email || "-"}</TableCell>
                    <TableCell>{new Date(contact.addeddate).toLocaleDateString()}</TableCell>
                    <TableCell>{contact.reviewcount || 0}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      {calculateAverageRating(selectedContactReviews || [])}
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Reviews by {selectedContact?.firstname} {selectedContact?.lastname}
            </DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg">
                <span>Average Rating:</span>
                <div className="flex items-center gap-1">
                  <span className="font-bold">
                    {calculateAverageRating(selectedContactReviews || [])}
                  </span>
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
              <div className="space-y-4">
                {selectedContactReviews?.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Contact;