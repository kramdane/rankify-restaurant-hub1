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
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SettingsFormProps {
  userId: string;
}

export function SettingsForm({ userId }: SettingsFormProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [pendingValues, setPendingValues] = useState<SettingsFormValues | null>(null);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
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

  const { isLoading, data: restaurantData } = useQuery({
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
      return data;
    },
    enabled: !!userId,
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 1000 * 60 * 5, // Keep data in cache for 5 minutes (formerly cacheTime)
  });

  // Update form when data is loaded
  useEffect(() => {
    if (restaurantData) {
      console.log("Updating form with restaurant data:", restaurantData);
      form.reset({
        name: restaurantData.name || "",
        owner_name: restaurantData.owner_name || "",
        phone: restaurantData.phone || "",
        email: restaurantData.email || "",
        address: restaurantData.address || "",
        business_category: restaurantData.business_category || "",
        facebook_url: restaurantData.facebook_url || "",
        google_business_url: restaurantData.google_business_url || "",
        tripadvisor_url: restaurantData.tripadvisor_url || "",
        preferred_social_media: restaurantData.preferred_social_media || "google",
      });
    }
  }, [restaurantData, form]);

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
      setShowSaveDialog(false);
    },
    onError: (error) => {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings: " + error.message);
      setShowSaveDialog(false);
    },
  });

  useEffect(() => {
    const unblock = navigate((nextLocation) => {
      if (hasUnsavedChanges && location.pathname !== nextLocation.pathname) {
        setPendingNavigation(nextLocation.pathname);
        setShowSaveDialog(true);
        return false;
      }
      return true;
    });

    return () => {
      unblock();
    };
  }, [navigate, hasUnsavedChanges, location]);

  useEffect(() => {
    const subscription = form.watch(() => {
      setHasUnsavedChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = (values: SettingsFormValues) => {
    setPendingValues(values);
    setShowSaveDialog(true);
  };

  const handleConfirmSave = () => {
    if (pendingValues) {
      mutation.mutate(pendingValues, {
        onSuccess: () => {
          setHasUnsavedChanges(false);
          if (pendingNavigation) {
            navigate(pendingNavigation);
          }
          setShowSaveDialog(false);
          setPendingNavigation(null);
          queryClient.invalidateQueries({ queryKey: ["restaurant", userId] });
          toast.success("Settings saved successfully");
        },
        onError: (error) => {
          console.error("Error saving settings:", error);
          toast.error("Failed to save settings: " + error.message);
          setShowSaveDialog(false);
          setPendingNavigation(null);
        },
      });
    }
  };

  const handleCancelSave = () => {
    setShowSaveDialog(false);
    setPendingValues(null);
    if (pendingNavigation) {
      setHasUnsavedChanges(false);
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const handleDiscardChanges = () => {
    if (pendingNavigation) {
      setHasUnsavedChanges(false);
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
    setShowSaveDialog(false);
    setPendingValues(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
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

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Changes</DialogTitle>
            <DialogDescription>
              {pendingNavigation 
                ? "You have unsaved changes. Would you like to save them before leaving?"
                : "Are you sure you want to save these changes to your settings?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            {pendingNavigation ? (
              <>
                <Button variant="destructive" onClick={handleDiscardChanges}>
                  Discard Changes
                </Button>
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmSave} disabled={mutation.isPending}>
                  {mutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancelSave}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmSave} disabled={mutation.isPending}>
                  {mutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
