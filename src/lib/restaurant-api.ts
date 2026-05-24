import { supabase } from "@/integrations/supabase/client";
import type { OrderStatus } from "@/types/restaurant";

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 1440; // 1 day

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createOrderSession(params: {
  roomNumber?: string;
  tableNumber?: string;
  expiresInMinutes?: number; // optional, allows staff to set expiry
  guestName?: string | null;
  guestPhone?: string | null;
}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) throw new Error("Not authenticated");

  const { roomNumber, tableNumber, guestName, guestPhone } = params;
  if (!roomNumber && !tableNumber) {
    throw new Error("Either room number or table number is required");
  }

  const expiresAt = new Date();
  const expiresIn = params.expiresInMinutes ?? OTP_EXPIRY_MINUTES;
  expiresAt.setMinutes(expiresAt.getMinutes() + expiresIn);

  const otp = generateOTP();

  const { data, error } = await supabase
    .from("order_sessions")
    .insert({
      otp,
      room_number: roomNumber || null,
      table_number: tableNumber || null,
      guest_name: guestName || null,
      guest_phone: guestPhone || null,
      created_by: session.user.id,
      expires_at: expiresAt.toISOString(),
      status: "active",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrderSessionByOTP(otp: string) {
  const { data, error } = await supabase
    .from("order_sessions")
    .select("*")
    .eq("otp", otp)
    .eq("status", "active")
    .single();

  if (error) throw error;
  if (!data) return null;

  const expiresAt = new Date(data.expires_at);
  if (expiresAt < new Date()) {
    return null;
  }
  return data;
}

export async function updateOrderSession(
  sessionId: string,
  updates: { guest_name?: string | null; guest_phone?: string | null },
) {
  const { data, error } = await supabase
    .from("order_sessions")
    .update({
      guest_name: updates.guest_name ?? null,
      guest_phone: updates.guest_phone ?? null,
    })
    .eq("id", sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrdersForSession(sessionId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function closeOrderSession(sessionId: string) {
  const { error } = await supabase
    .from("order_sessions")
    .update({ status: "closed" })
    .eq("id", sessionId);

  if (error) throw error;
}

export async function createOrder(sessionId: string, roomId?: string) {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      session_id: sessionId,
      room_id: roomId ?? null,
      status: "pending",
      total_amount: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addOrderItem(params: {
  orderId: string;
  itemId?: string | null;
  itemName: string;
  quantity: number;
  priceAtTime: number;
  customPrice?: number | null;
  notes?: string | null;
}) {
  const { data, error } = await supabase
    .from("order_items")
    .insert({
      order_id: params.orderId,
      item_id: params.itemId ?? null,
      item_name: params.itemName,
      quantity: params.quantity,
      price_at_time: params.priceAtTime,
      custom_price: params.customPrice ?? null,
      notes: params.notes ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateOrderItem(
  itemId: string,
  updates: {
    quantity?: number;
    custom_price?: number | null;
    notes?: string | null;
  },
) {
  const { data, error } = await supabase
    .from("order_items")
    .update(updates)
    .eq("id", itemId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeOrderItem(itemId: string) {
  const { error } = await supabase
    .from("order_items")
    .delete()
    .eq("id", itemId);
  if (error) throw error;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function recalculateOrderTotal(orderId: string) {
  const { data: items } = await supabase
    .from("order_items")
    .select("quantity, price_at_time, custom_price")
    .eq("order_id", orderId);

  if (!items || items.length === 0) {
    await supabase.from("orders").update({ total_amount: 0 }).eq("id", orderId);
    return 0;
  }

  const total = items.reduce((sum, i) => {
    const price = i.custom_price ?? i.price_at_time;
    return sum + Number(price) * i.quantity;
  }, 0);

  await supabase
    .from("orders")
    .update({ total_amount: total })
    .eq("id", orderId);

  return total;
}

export async function createBill(
  order: any,
  gstIncluded: boolean,
  summary?: any,
  createdAt?: string,
) {
  const payload: any = {
    order_id: order.id,
    gst_included: gstIncluded,
    data: {
      order: order,
      summary: summary ?? null,
    },
  };
  if (createdAt) payload.created_at = createdAt;

  // upsert by order_id to avoid duplicates
  const { data, error } = await supabase
    .from("bills")
    .upsert(payload, { onConflict: "order_id" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getBills(filter: {
  from?: string;
  to?: string;
  gstIncluded?: boolean | null;
}) {
  let q = supabase
    .from("bills")
    .select("*")
    .order("created_at", { ascending: false });
  if (filter.from) q = q.gte("created_at", filter.from);
  if (filter.to) q = q.lte("created_at", filter.to);
  if (typeof filter.gstIncluded === "boolean")
    q = q.eq("gst_included", filter.gstIncluded);

  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}
