import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
                  <span className="font-semibold">${item.price.toFixed(2)}</span>
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