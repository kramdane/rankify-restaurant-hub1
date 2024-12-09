import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Template {
  id: string;
  name: string;
  content: string;
  channel: string;
}

interface TemplateSelectionProps {
  value: string;
  onChange: (value: string) => void;
  channel: string;
}

export const TemplateSelection = ({ value, onChange, channel }: TemplateSelectionProps) => {
  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates', channel],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('channel', channel);
      
      if (error) throw error;
      return data as Template[];
    },
  });

  if (isLoading) return <div>Loading templates...</div>;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a template" />
      </SelectTrigger>
      <SelectContent>
        {templates?.map((template) => (
          <SelectItem key={template.id} value={template.id}>
            {template.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};