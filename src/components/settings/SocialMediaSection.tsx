import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { SettingsFormValues } from "./settingsFormSchema";

interface SocialMediaSectionProps {
  form: UseFormReturn<SettingsFormValues>;
}

export function SocialMediaSection({ form }: SocialMediaSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media & Online Presence</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="facebook_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook Page Link</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://facebook.com/your-page" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="google_business_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Google My Business Link</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://business.google.com/your-business" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tripadvisor_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tripadvisor Profile Link</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://tripadvisor.com/your-restaurant" />
              </FormControl>
              <FormMessage />
            </Item>
          )}
        />
      </CardContent>
    </Card>
  );
}