import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";

type MenuItem = Tables<"menu_items">;
type Restaurant = Tables<"restaurants">;

const PublicMenu = () => {
  const { restaurantId } = useParams();

  const { data: restaurant } = useQuery<Restaurant>({
    queryKey: ["public-restaurant", restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", restaurantId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["public-menu-items", restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .eq("active", true)
        .order("category", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Group menu items by category
  const groupedMenuItems = menuItems.reduce((acc: Record<string, MenuItem[]>, item) => {
    const category = item.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">{restaurant?.name}</h1>
          {restaurant?.description && (
            <p className="text-muted mt-2">{restaurant.description}</p>
          )}
        </div>

        <div className="space-y-8">
          {Object.entries(groupedMenuItems).map(([category, items]) => (
            <Card key={category} className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start border-b pb-4 last:border-0">
                      <div className="space-y-1 flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <span className="font-semibold">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="text-muted-foreground text-sm" style={{ fontSize: "0.8em" }}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicMenu;