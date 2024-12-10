import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Star, ArrowUp, ArrowDown } from "lucide-react";
import { Contact } from "@/types/contact";
import { useState } from "react";

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
  const [sortField, setSortField] = useState<'addeddate' | 'average_rating'>('addeddate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: 'addeddate' | 'average_rating') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    if (sortField === 'addeddate') {
      const dateA = new Date(a.addeddate).getTime();
      const dateB = new Date(b.addeddate).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      const ratingA = a.customer_reviews?.[0]?.average_rating || 0;
      const ratingB = b.customer_reviews?.[0]?.average_rating || 0;
      return sortDirection === 'asc' ? ratingA - ratingB : ratingB - ratingA;
    }
  });

  const getSortIcon = (field: 'addeddate' | 'average_rating') => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <Button onClick={handleExportCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Table>
        <TableHeader className="bg-primary">
          <TableRow>
            <TableHead className="text-primary-foreground">Name</TableHead>
            <TableHead className="text-primary-foreground">Phone</TableHead>
            <TableHead className="text-primary-foreground">Email</TableHead>
            <TableHead 
              className="text-primary-foreground cursor-pointer"
              onClick={() => handleSort('addeddate')}
            >
              <div className="flex items-center gap-2">
                Added Date {getSortIcon('addeddate')}
              </div>
            </TableHead>
            <TableHead className="text-primary-foreground">Reviews</TableHead>
            <TableHead 
              className="text-primary-foreground cursor-pointer"
              onClick={() => handleSort('average_rating')}
            >
              <div className="flex items-center gap-2">
                Average Rating {getSortIcon('average_rating')}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedContacts?.map((contact) => (
            <TableRow 
              key={contact.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onContactSelect(contact)}
            >
              <TableCell>{contact.firstname} {contact.lastname}</TableCell>
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