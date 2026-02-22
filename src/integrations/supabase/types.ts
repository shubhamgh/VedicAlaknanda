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
      administrators: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          address: string | null
          adults: number
          booking_source: string | null
          check_in: string
          check_out: string
          children: number
          created_at: string | null
          custom_booking_source: string | null
          gov_id_number: string | null
          guest_email: string
          guest_name: string
          guest_phone: string
          id: string
          room_id: string | null
          special_requests: string | null
          status: string
          total_price: number
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          adults?: number
          booking_source?: string | null
          check_in: string
          check_out: string
          children?: number
          created_at?: string | null
          custom_booking_source?: string | null
          gov_id_number?: string | null
          guest_email: string
          guest_name: string
          guest_phone: string
          id?: string
          room_id?: string | null
          special_requests?: string | null
          status?: string
          total_price: number
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          adults?: number
          booking_source?: string | null
          check_in?: string
          check_out?: string
          children?: number
          created_at?: string | null
          custom_booking_source?: string | null
          gov_id_number?: string | null
          guest_email?: string
          guest_name?: string
          guest_phone?: string
          id?: string
          room_id?: string | null
          special_requests?: string | null
          status?: string
          total_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          read: boolean
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          read?: boolean
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean
          subject?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          subscribed_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          entered_on: string
          gender: string | null
          id: string
          image: string | null
          name: string
          rating: number
          review: string
          source: string | null
        }
        Insert: {
          entered_on?: string
          gender?: string | null
          id?: string
          image?: string | null
          name: string
          rating: number
          review: string
          source?: string | null
        }
        Update: {
          entered_on?: string
          gender?: string | null
          id?: string
          image?: string | null
          name?: string
          rating?: number
          review?: string
          source?: string | null
        }
        Relationships: []
      }
      rooms: {
        Row: {
          created_at: string | null
          id: string
          number: string
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          number: string
          status?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          number?: string
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_logs: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          created_at: string
          device_type: string | null
          id: string
          ip_address: string | null
          os: string | null
          path: string | null
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          ip_address?: string | null
          os?: string | null
          path?: string | null
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          ip_address?: string | null
          os?: string | null
          path?: string | null
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          role: "super_admin" | "manager" | "staff" | "kitchen" | "guest_session"
          name: string | null
          email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role?: "super_admin" | "manager" | "staff" | "kitchen" | "guest_session"
          name?: string | null
          email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: "super_admin" | "manager" | "staff" | "kitchen" | "guest_session"
          name?: string | null
          email?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      menu_categories: {
        Row: {
          id: string
          name: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          sort_order?: number
          created_at?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          id: string
          category_id: string
          name: string
          description: string | null
          price: number
          is_available: boolean
          is_veg: boolean
          created_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          description?: string | null
          price: number
          is_available?: boolean
          is_veg?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          description?: string | null
          price?: number
          is_available?: boolean
          is_veg?: boolean
          created_at?: string
        }
        Relationships: [{ foreignKeyName: "menu_items_category_id_fkey"; columns: ["category_id"]; referencedRelation: "menu_categories"; referencedColumns: ["id"] }]
      }
      order_sessions: {
        Row: {
          id: string
          otp: string
          room_number: string | null
          table_number: string | null
          created_by: string | null
          expires_at: string
          status: "active" | "closed"
          created_at: string
        }
        Insert: {
          id?: string
          otp: string
          room_number?: string | null
          table_number?: string | null
          created_by?: string | null
          expires_at: string
          status?: "active" | "closed"
          created_at?: string
        }
        Update: {
          id?: string
          otp?: string
          room_number?: string | null
          table_number?: string | null
          created_by?: string | null
          expires_at?: string
          status?: "active" | "closed"
          created_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          session_id: string
          room_id: string | null
          status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "completed" | "cancelled"
          total_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          room_id?: string | null
          status?: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "completed" | "cancelled"
          total_amount?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          room_id?: string | null
          status?: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "completed" | "cancelled"
          total_amount?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: "orders_session_id_fkey"; columns: ["session_id"]; referencedRelation: "order_sessions"; referencedColumns: ["id"] },
          { foreignKeyName: "orders_room_id_fkey"; columns: ["room_id"]; referencedRelation: "rooms"; referencedColumns: ["id"] }
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          item_id: string | null
          quantity: number
          price_at_time: number
          custom_price: number | null
          notes: string | null
          item_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          item_id?: string | null
          quantity: number
          price_at_time: number
          custom_price?: number | null
          notes?: string | null
          item_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          item_id?: string | null
          quantity?: number
          price_at_time?: number
          custom_price?: number | null
          notes?: string | null
          item_name?: string | null
          created_at?: string
        }
        Relationships: [
          { foreignKeyName: "order_items_order_id_fkey"; columns: ["order_id"]; referencedRelation: "orders"; referencedColumns: ["id"] },
          { foreignKeyName: "order_items_item_id_fkey"; columns: ["item_id"]; referencedRelation: "menu_items"; referencedColumns: ["id"] }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "super_admin" | "manager" | "staff" | "kitchen" | "guest_session"
      order_session_status: "active" | "closed"
      order_status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "completed" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["super_admin", "manager", "staff", "kitchen", "guest_session"] as const,
      order_session_status: ["active", "closed"] as const,
      order_status: ["pending", "confirmed", "preparing", "ready", "delivered", "completed", "cancelled"] as const,
    },
  },
} as const
