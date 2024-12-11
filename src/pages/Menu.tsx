import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { MenuForm } from "@/components/MenuForm";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { MenuCategory } from "@/components/menu/MenuCategory";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
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
        .order("position", { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!restaurant?.id,
  });

  const addMenuItem = useMutation({
    mutationFn: async (item: Omit<MenuItem, "id" | "category">) => {
      if (!restaurant?.id) throw new Error("No restaurant found");
      const position = menuItems.length;
      const { data, error } = await supabase
        .from("menu_items")
        .insert([{ 
          ...item, 
          restaurant_id: restaurant.id, 
          position,
          category: "Menu Items" 
        }])
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

  const handleAddItem = (item: Omit<MenuItem, "id" | "category">) => {
    addMenuItem.mutate(item);
  };

  const groupedMenuItems = {
    "Menu Items": menuItems
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 px-4 md:px-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Menu Management</h1>
          <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Menu Item
          </Button>
        </div>

        {showForm && (
          <div className="w-full">
            <MenuForm 
              onSubmit={handleAddItem} 
              onCancel={() => setShowForm(false)} 
            />
          </div>
        )}

        <div className="space-y-8">
          {Object.entries(groupedMenuItems).map(([category, items]) => (
            <MenuCategory
              key={category}
              category={category}
              items={items}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Menu;