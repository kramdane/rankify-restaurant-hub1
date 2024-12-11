import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { BusinessInformationSection } from "./BusinessInformationSection";
import { SocialMediaSection } from "./SocialMediaSection";
import { settingsFormSchema, type SettingsFormValues } from "./settingsFormSchema";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface SettingsFormProps {
  userId: string;
}

export function SettingsForm({ userId }: SettingsFormProps) {
  const queryClient = useQueryClient();
  
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      name: "",
      owner_name: "",
      phone: "",
      email: "",
      address: "",
      business_category: "",
      facebook_url: "",
      google_business_url: "",
      tripadvisor_url: "",
      preferred_social_media: "google",
    },
  });

  const { isLoading } = useQuery({
    queryKey: ["restaurant", userId],
    queryFn: async () => {
      console.log("Fetching restaurant data for user:", userId);
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching restaurant data:", error);
        throw error;
      }
      
      console.log("Fetched restaurant data:", data);
      
      if (data) {
        // Update form with the fetched data, handling null values
        form.reset({
          name: data.name || "",
          owner_name: data.owner_name || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          business_category: data.business_category || "",
          facebook_url: data.facebook_url || "",
          google_business_url: data.google_business_url || "",
          tripadvisor_url: data.tripadvisor_url || "",
          preferred_social_media: data.preferred_social_media || "google",
        });
      }
      
      return data;
    },
    enabled: !!userId,
  });

  const mutation = useMutation({
    mutationFn: async (values: SettingsFormValues) => {
      const { data: existingRestaurant, error: queryError } = await supabase
        .from("restaurants")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (queryError && queryError.code !== 'PGRST116') {
        throw queryError;
      }

      if (existingRestaurant) {
        const { error } = await supabase
          .from("restaurants")
          .update(values)
          .eq("user_id", userId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("restaurants")
          .insert([{ ...values, user_id: userId }]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant", userId] });
      toast.success("Settings saved successfully");
    },
    onError: (error) => {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings: " + error.message);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  const onSubmit = (values: SettingsFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BusinessInformationSection form={form} />
        <SocialMediaSection form={form} />
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}