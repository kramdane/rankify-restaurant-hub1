import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "./settingsFormSchema";

interface BusinessInformationSectionProps {
  form: UseFormReturn<SettingsFormValues>;
}

export function BusinessInformationSection({ form }: BusinessInformationSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Business Information</h2>
        <p className="text-sm text-muted mt-1">Update your restaurant's basic information</p>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Restaurant Name</FormLabel>
              <FormControl>
                <Input {...field} className="bg-accent" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="owner_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner/Manager Name</FormLabel>
              <FormControl>
                <Input {...field} className="bg-accent" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-accent" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-accent" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Address</FormLabel>
              <FormControl>
                <Input {...field} className="bg-accent" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="business_category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Category</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Italian, French, Café" className="bg-accent" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}