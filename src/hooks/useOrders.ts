import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "delivered",
  "completed",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderWithDetails {
  id: string;
  session_id: string;
  room_id: string | null;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  updated_at: string;
  order_items: {
    id: string;
    item_name: string | null;
    quantity: number;
    price_at_time: number;
    custom_price: number | null;
    notes: string | null;
  }[];
  order_sessions: {
    room_number: string | null;
    table_number: string | null;
  } | null;
}

export function useOrders(statusFilter?: OrderStatus[]) {
  return useQuery({
    queryKey: ["orders", statusFilter],
    queryFn: async () => {
      let q = supabase
        .from("orders")
        .select(
          `
          *,
          order_items (*),
          order_sessions (room_number, table_number)
        `
        )
        .neq("status", "cancelled")
        .neq("status", "completed")
        .order("created_at", { ascending: true });

      if (statusFilter && statusFilter.length > 0) {
        q = q.in("status", statusFilter);
      }

      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as OrderWithDetails[];
    },
    refetchInterval: 5000,
  });
}

export function useAllOrdersForAdmin() {
  return useQuery({
    queryKey: ["orders-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items (*),
          order_sessions (room_number, table_number)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as unknown as OrderWithDetails[];
    },
    refetchInterval: 5000,
  });
}
