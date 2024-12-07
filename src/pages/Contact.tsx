import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    phone: "+1 234-567-8901",
    email: "jane.smith@example.com",
    addedDate: "2024-03-02",
    reviewCount: 5,
  },
  // Add more mock data as needed
];

const Contact = () => {
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
                      {contact.firstName} {contact.lastName}
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
    </DashboardLayout>
  );
};

export default Contact;