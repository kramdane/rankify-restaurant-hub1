import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

interface MenuCategoryProps {
  category: string;
  items: MenuItem[];
}

export const MenuCategory = ({ category, items }: MenuCategoryProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = async (itemId: string) => {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Menu item deleted successfully",
    });
    
    queryClient.invalidateQueries({ queryKey: ["menuItems"] });
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle>{category}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {items.map((item) => (
            <div 
              key={item.id}
              className="flex justify-between items-start border-b pb-4 last:border-0 hover:bg-gray-50 rounded-lg p-3 transition-colors"
            >
              <div className="space-y-1 flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">${item.price.toFixed(2)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};