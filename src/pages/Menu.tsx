import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Share2 } from "lucide-react";
import { useState } from "react";
import { MenuForm } from "@/components/MenuForm";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { arrayMove } from "@dnd-kit/sortable";
import { MenuCategory } from "@/components/menu/MenuCategory";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  position?: number;
}

const Menu = () => {
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: restaurant } = useQuery({
    queryKey: ["restaurant"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["menuItems", restaurant?.id],
    queryFn: async () => {
      if (!restaurant?.id) return [];
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", restaurant.id)
        .eq("active", true)
        .order("position", { ascending: true })
        .order("category", { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!restaurant?.id,
  });

  const updateItemPositions = useMutation({
    mutationFn: async (items: MenuItem[]) => {
      const updates = items.map((item, index) => ({
        id: item.id,
        position: index,
      }));

      const { error } = await supabase
        .from("menu_items")
        .upsert(updates, { onConflict: "id" });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      toast({
        title: "Menu order updated",
        description: "The menu items have been reordered successfully",
      });
    },
  });

  const addMenuItem = useMutation({
    mutationFn: async (item: Omit<MenuItem, "id">) => {
      if (!restaurant?.id) throw new Error("No restaurant found");
      const position = menuItems.length;
      const { data, error } = await supabase
        .from("menu_items")
        .insert([{ ...item, restaurant_id: restaurant.id, position }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      setShowForm(false);
      toast({
        title: "Success",
        description: "Menu item added successfully",
      });
    },
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = menuItems.findIndex((item) => item.id === active.id);
      const newIndex = menuItems.findIndex((item) => item.id === over.id);
      
      const newItems = arrayMove(menuItems, oldIndex, newIndex);
      updateItemPositions.mutate(newItems);
    }
  };

  const handleAddItem = (item: Omit<MenuItem, "id">) => {
    addMenuItem.mutate(item);
  };

  const handleShareMenu = async () => {
    if (!restaurant?.id) return;
    
    const shareUrl = `${window.location.origin}/menu/${restaurant.id}`;
    await navigator.clipboard.writeText(shareUrl);
    
    toast({
      title: "Menu Link Copied!",
      description: "Share this link with your customers",
    });
  };

  const groupedMenuItems = menuItems.reduce((acc: Record<string, MenuItem[]>, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Menu Management</h1>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleShareMenu}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" /> Share Menu
            </Button>
            <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Menu Item
            </Button>
          </div>
        </div>

        {showForm && (
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Add New Menu Item</CardTitle>
            </CardHeader>
            <CardContent>
              <MenuForm onSubmit={handleAddItem} onCancel={() => setShowForm(false)} />
            </CardContent>
          </Card>
        )}

        <div className="space-y-8">
          {Object.entries(groupedMenuItems).map(([category, items]) => (
            <MenuCategory
              key={category}
              category={category}
              items={items}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Menu;