import * as z from "zod";

export const settingsFormSchema = z.object({
  name: z.string().min(2, "Restaurant name must be at least 2 characters"),
  owner_name: z.string().min(2, "Owner name must be at least 2 characters"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  business_category: z.string().min(2, "Category must be at least 2 characters"),
  facebook_url: z.string().url().optional().or(z.literal("")),
  google_business_url: z.string().url().optional().or(z.literal("")),
  tripadvisor_url: z.string().url().optional().or(z.literal("")),
  preferred_social_media: z.enum(["google", "facebook", "tripadvisor"]).default("google"),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;