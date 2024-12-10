import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SortableMenuItem } from "./SortableMenuItem";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  position?: number;
}

interface MenuCategoryProps {
  category: string;
  items: MenuItem[];
  onDragEnd: (event: any) => void;
}

export const MenuCategory = ({ category, items, onDragEnd }: MenuCategoryProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle>{category}</CardTitle>
      </CardHeader>
      <CardContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={items.map(item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-6">
              {items.map((item) => (
                <SortableMenuItem key={item.id} item={item} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
};