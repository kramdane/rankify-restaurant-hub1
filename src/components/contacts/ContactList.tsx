import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Star } from "lucide-react";
import { Contact } from "@/types/contact";

interface ContactListProps {
  contacts: Contact[];
  onContactSelect: (contact: Contact) => void;
  selectedContactReviews: any;
  calculateAverageRating: (reviews: any[]) => string;
  handleExportCSV: () => void;
}

export const ContactList = ({
  contacts,
  onContactSelect,
  selectedContactReviews,
  calculateAverageRating,
  handleExportCSV,
}: ContactListProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <Button onClick={handleExportCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

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
                  onClick={() => onContactSelect(contact)}
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
                {contact.customer_reviews?.[0]?.average_rating?.toFixed(1) || "0.0"}
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};