export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      campaign_recipients: {
        Row: {
          campaign_id: string | null
          contact_id: string | null
          created_at: string | null
          id: string
          opened_at: string | null
          responded_at: string | null
          sent_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          campaign_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          id?: string
          opened_at?: string | null
          responded_at?: string | null
          sent_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string | null
          contact_id?: string | null
          created_at?: string | null
          id?: string
          opened_at?: string | null
          responded_at?: string | null
          sent_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_recipients_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_recipients_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          channel: Database["public"]["Enums"]["message_channel"]
          created_at: string | null
          id: string
          name: string
          opened_count: number | null
          response_count: number | null
          scheduled_at: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["campaign_status"] | null
          template_id: string | null
          total_recipients: number | null
          updated_at: string | null
        }
        Insert: {
          channel: Database["public"]["Enums"]["message_channel"]
          created_at?: string | null
          id?: string
          name: string
          opened_count?: number | null
          response_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          template_id?: string | null
          total_recipients?: number | null
          updated_at?: string | null
        }
        Update: {
          channel?: Database["public"]["Enums"]["message_channel"]
          created_at?: string | null
          id?: string
          name?: string
          opened_count?: number | null
          response_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["campaign_status"] | null
          template_id?: string | null
          total_recipients?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          addeddate: string | null
          created_at: string | null
          email: string | null
          firstname: string
          id: string
          lastname: string
          phone: string | null
          reviewcount: number | null
          updated_at: string | null
        }
        Insert: {
          addeddate?: string | null
          created_at?: string | null
          email?: string | null
          firstname: string
          id?: string
          lastname: string
          phone?: string | null
          reviewcount?: number | null
          updated_at?: string | null
        }
        Update: {
          addeddate?: string | null
          created_at?: string | null
          email?: string | null
          firstname?: string
          id?: string
          lastname?: string
          phone?: string | null
          reviewcount?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          restaurant_id: string | null
          role: Database["public"]["Enums"]["message_role"]
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          restaurant_id?: string | null
          role: Database["public"]["Enums"]["message_role"]
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          restaurant_id?: string | null
          role?: Database["public"]["Enums"]["message_role"]
        }
        Relationships: [
          {
            foreignKeyName: "messages_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          address: string | null
          business_category: string | null
          business_hours: Json | null
          created_at: string
          description: string | null
          email: string | null
          facebook_url: string | null
          google_business_url: string | null
          id: string
          name: string
          owner_name: string | null
          phone: string | null
          tripadvisor_url: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          business_category?: string | null
          business_hours?: Json | null
          created_at?: string
          description?: string | null
          email?: string | null
          facebook_url?: string | null
          google_business_url?: string | null
          id?: string
          name?: string
          owner_name?: string | null
          phone?: string | null
          tripadvisor_url?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          business_category?: string | null
          business_hours?: Json | null
          created_at?: string
          description?: string | null
          email?: string | null
          facebook_url?: string | null
          google_business_url?: string | null
          id?: string
          name?: string
          owner_name?: string | null
          phone?: string | null
          tripadvisor_url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          email: string | null
          id: string
          phone: string | null
          rating: number
          restaurant_id: string
          reviewer_name: string
          source: Database["public"]["Enums"]["review_source"]
        }
        Insert: {
          comment?: string | null
          created_at?: string
          email?: string | null
          id?: string
          phone?: string | null
          rating: number
          restaurant_id: string
          reviewer_name: string
          source?: Database["public"]["Enums"]["review_source"]
        }
        Update: {
          comment?: string | null
          created_at?: string
          email?: string | null
          id?: string
          phone?: string | null
          rating?: number
          restaurant_id?: string
          reviewer_name?: string
          source?: Database["public"]["Enums"]["review_source"]
        }
        Relationships: [
          {
            foreignKeyName: "reviews_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          channel: Database["public"]["Enums"]["message_channel"]
          content: string
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          channel: Database["public"]["Enums"]["message_channel"]
          content: string
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          channel?: Database["public"]["Enums"]["message_channel"]
          content?: string
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_chat: {
        Args: {
          message: string
          restaurant_id?: string
        }
        Returns: string
      }
    }
    Enums: {
      campaign_status: "draft" | "scheduled" | "sent" | "completed"
      message_channel: "email" | "sms" | "whatsapp"
      message_role: "user" | "assistant"
      review_source: "form" | "google" | "facebook" | "tripadvisor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
