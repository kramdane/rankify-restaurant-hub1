import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  position?: number;
}

interface SortableMenuItemProps {
  item: MenuItem;
}

export const SortableMenuItem = ({ item }: SortableMenuItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex justify-between items-start border-b pb-4 last:border-0">
        <div className="space-y-1 flex-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button {...listeners} className="cursor-grab hover:cursor-grabbing p-1">
                <GripVertical className="h-4 w-4 text-gray-400" />
              </button>
              <h3 className="text-lg font-semibold">{item.name}</h3>
            </div>
            <span className="font-semibold">${item.price.toFixed(2)}</span>
          </div>
          <p className="text-muted-foreground text-sm" style={{ fontSize: "0.8em" }}>
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
};