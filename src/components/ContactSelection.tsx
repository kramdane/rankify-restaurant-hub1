import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface ContactSelectionProps {
  selectedContacts: string[];
  onContactToggle: (contactId: string) => void;
  channel: string;
}

export const ContactSelection = ({ selectedContacts, onContactToggle, channel }: ContactSelectionProps) => {
  const { data: contacts, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Contact[];
    },
  });

  const handleSelectAll = () => {
    if (!contacts) return;
    contacts.forEach(contact => {
      if (!selectedContacts.includes(contact.id)) {
        onContactToggle(contact.id);
      }
    });
  };

  if (isLoading) return <div>Loading contacts...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" onClick={handleSelectAll}>
          Select All
        </Button>
      </div>
      <div className="space-y-2">
        {contacts?.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
          >
            <Checkbox
              id={contact.id}
              checked={selectedContacts.includes(contact.id)}
              onCheckedChange={() => onContactToggle(contact.id)}
            />
            <label
              htmlFor={contact.id}
              className="flex-1 flex items-center justify-between cursor-pointer"
            >
              <span>{contact.firstName} {contact.lastName}</span>
              <span className="text-sm text-gray-500">
                {channel === "email" ? contact.email : contact.phone}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};