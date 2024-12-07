import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Star } from "lucide-react";
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

// Mock data - replace with actual data from your backend
const contacts = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    phone: "+1 234-567-8900",
    email: "john.doe@example.com",
    addedDate: "2024-03-01",
    reviewCount: 3,
    reviews: [
      { id: 1, rating: 5, comment: "Great experience!", date: "2024-03-01" },
      { id: 2, rating: 4, comment: "Good service overall", date: "2024-02-15" },
      { id: 3, rating: 3, comment: "Average experience", date: "2024-02-01" },
    ],
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    phone: "+1 234-567-8901",
    email: "jane.smith@example.com",
    addedDate: "2024-03-02",
    reviewCount: 5,
    reviews: [
      { id: 4, rating: 5, comment: "Excellent service!", date: "2024-03-02" },
      { id: 5, rating: 5, comment: "Amazing food!", date: "2024-02-20" },
      { id: 6, rating: 4, comment: "Very good experience", date: "2024-02-10" },
      { id: 7, rating: 5, comment: "Will come back!", date: "2024-01-30" },
      { id: 8, rating: 4, comment: "Friendly staff", date: "2024-01-15" },
    ],
  },
];

const Contact = () => {
  const [selectedContact, setSelectedContact] = useState<typeof contacts[0] | null>(null);

  const handleExportCSV = () => {
    const headers = ["First Name", "Last Name", "Phone", "Email", "Added Date", "Review Count"];
    const csvData = contacts.map((contact) => [
      contact.firstName,
      contact.lastName,
      contact.phone,
      contact.email,
      contact.addedDate,
      contact.reviewCount,
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

  const calculateAverageRating = (reviews: typeof selectedContact.reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

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
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <button
                        onClick={() => setSelectedContact(contact)}
                        className="text-primary hover:underline focus:outline-none"
                      >
                        {contact.firstName} {contact.lastName}
                      </button>
                    </TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{new Date(contact.addedDate).toLocaleDateString()}</TableCell>
                    <TableCell>{contact.reviewCount}</TableCell>
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
              Reviews by {selectedContact?.firstName} {selectedContact?.lastName}
            </DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg">
                <span>Average Rating:</span>
                <div className="flex items-center gap-1">
                  <span className="font-bold">
                    {calculateAverageRating(selectedContact.reviews)}
                  </span>
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
              <div className="space-y-4">
                {selectedContact.reviews.map((review) => (
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
                          {new Date(review.date).toLocaleDateString()}
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