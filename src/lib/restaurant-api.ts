import { supabase } from "@/integrations/supabase/client";
import type { OrderStatus } from "@/types/restaurant";

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 30;

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createOrderSession(params: {
  roomNumber?: string;
  tableNumber?: string;
  expiresInMinutes?: number; // optional, allows staff to set expiry
}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) throw new Error("Not authenticated");

  const { roomNumber, tableNumber } = params;
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
  updates: { quantity?: number; custom_price?: number | null; notes?: string | null }
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
  const { error } = await supabase.from("order_items").delete().eq("id", itemId);
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
