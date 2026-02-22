import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MenuCategory {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  is_available: boolean;
  is_veg: boolean;
  created_at: string;
}

export function useMenu() {
  return useQuery({
    queryKey: ["menu"],
    queryFn: async () => {
      const [catRes, itemRes] = await Promise.all([
        supabase.from("menu_categories").select("*").order("sort_order"),
        supabase.from("menu_items").select("*").eq("is_available", true),
      ]);
      if (catRes.error) throw catRes.error;
      if (itemRes.error) throw itemRes.error;
      return {
        categories: (catRes.data ?? []) as MenuCategory[],
        items: (itemRes.data ?? []) as MenuItem[],
      };
    },
  });
}

export function useMenuAdmin() {
  return useQuery({
    queryKey: ["menu-admin"],
    queryFn: async () => {
      const [catRes, itemRes] = await Promise.all([
        supabase.from("menu_categories").select("*").order("sort_order"),
        supabase.from("menu_items").select("*"),
      ]);
      if (catRes.error) throw catRes.error;
      if (itemRes.error) throw itemRes.error;
      return {
        categories: (catRes.data ?? []) as MenuCategory[],
        items: (itemRes.data ?? []) as MenuItem[],
      };
    },
  });
}
