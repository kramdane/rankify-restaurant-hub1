import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useState } from "react";
import { MenuForm } from "@/components/MenuForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

const Menu = () => {
  const [showForm, setShowForm] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const handleAddItem = (item: Omit<MenuItem, "id">) => {
    const newItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
    };
    setMenuItems([...menuItems, newItem]);
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Menu Management</h1>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Menu Item
          </Button>
        </div>

        {showForm ? (
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Add New Menu Item</CardTitle>
            </CardHeader>
            <CardContent>
              <MenuForm onSubmit={handleAddItem} onCancel={() => setShowForm(false)} />
            </CardContent>
          </Card>
        ) : null}

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-muted">{item.description}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
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

export default Menu;