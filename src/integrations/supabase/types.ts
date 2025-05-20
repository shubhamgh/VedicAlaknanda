export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string
          number: string
          type: string
          capacity: number
          price_per_night: number
          description: string | null
          amenities: string[]
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          number: string
          type: string
          capacity: number
          price_per_night: number
          description?: string | null
          amenities?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          number?: string
          type?: string
          capacity?: number
          price_per_night?: number
          description?: string | null
          amenities?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          room_id: string
          guest_name: string
          guest_email: string
          guest_phone: string
          check_in: string
          check_out: string
          adults: number
          children: number
          total_price: number
          status: string
          special_requests: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          room_id: string
          guest_name: string
          guest_email: string
          guest_phone: string
          check_in: string
          check_out: string
          adults?: number
          children?: number
          total_price: number
          status?: string
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          guest_name?: string
          guest_email?: string
          guest_phone?: string
          check_in?: string
          check_out?: string
          adults?: number
          children?: number
          total_price?: number
          status?: string
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}