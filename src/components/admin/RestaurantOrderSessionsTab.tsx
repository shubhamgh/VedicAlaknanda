import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  createOrderSession,
  getOrdersForSession,
  updateOrderItem,
  removeOrderItem,
  addOrderItem,
  recalculateOrderTotal,
} from "@/lib/restaurant-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Copy, Phone, Edit2, Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function RestaurantOrderSessionsTab() {
  const [roomNumber, setRoomNumber] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [expiresIn, setExpiresIn] = useState<number>(30);
  const [creating, setCreating] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["order-sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_sessions")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  // Note: using direct API calls and invalidating queries manually to avoid
  // compatibility/runtime issues with `useMutation` across react-query versions.

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber && !tableNumber) {
      toast({
        title: "Error",
        description: "Enter room or table number",
        variant: "destructive",
      });
      return;
    }
    setCreating(true);
    try {
      const session = await createOrderSession({
        roomNumber: roomNumber || undefined,
        tableNumber: tableNumber || undefined,
        expiresInMinutes: expiresIn,
      });
      const url = `${window.location.origin}/order?otp=${session.otp}`;
      await navigator.clipboard.writeText(`${session.otp}\n${url}`);
      toast({
        title: "Session created",
        description: `OTP: ${session.otp} (copied to clipboard)`,
      });
      setRoomNumber("");
      setTableNumber("");
      queryClient.invalidateQueries({ queryKey: ["order-sessions"] });
    } catch (err: unknown) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to create session",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const copyOTP = (otp: string) => {
    const url = `${window.location.origin}/order`;
    navigator.clipboard.writeText(`${otp}\n${url}`);
    toast({ title: "Copied", description: "OTP and link copied to clipboard" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Order Session</CardTitle>
          <p className="text-sm text-muted-foreground">
            Generate an OTP for room or table. Guest enters OTP at /order to
            start ordering.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <Label htmlFor="room">Room Number</Label>
              <Input
                id="room"
                placeholder="e.g. 101"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="table">Table Number</Label>
              <Input
                id="table"
                placeholder="e.g. 5"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={creating}>
                {creating ? "Creating..." : "Generate OTP"}
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry (minutes)</Label>
              <input
                id="expiry"
                type="number"
                min={1}
                className="w-24 px-2 py-1 border rounded-md"
                value={expiresIn}
                onChange={(e) => setExpiresIn(Number(e.target.value))}
              />
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : sessions?.length === 0 ? (
            <p className="text-muted-foreground">No active sessions</p>
          ) : (
            <div className="space-y-2">
              {sessions?.map(
                (s: {
                  id: string;
                  otp: string;
                  room_number: string | null;
                  table_number: string | null;
                  expires_at: string;
                }) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <span className="font-mono font-bold">{s.otp}</span>
                      <span className="ml-2 text-muted-foreground">
                        {s.room_number
                          ? `Room ${s.room_number}`
                          : `Table ${s.table_number}`}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        Expires: {new Date(s.expires_at).toLocaleString()}
                      </span>
                      {s.guest_name && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Guest: {s.guest_name}{" "}
                          {s.guest_phone && (
                            <a
                              href={`tel:${s.guest_phone}`}
                              className="text-hotel-gold hover:underline ml-2"
                            >
                              <Phone className="inline-block mr-1 w-3 h-3" />
                              {s.guest_phone}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            Open
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Session {s.otp} details</DialogTitle>
                          </DialogHeader>
                          <div className="mt-2 space-y-4">
                            <div>
                              <div className="text-sm text-muted-foreground">
                                {s.room_number
                                  ? `Room ${s.room_number}`
                                  : s.table_number
                                    ? `Table ${s.table_number}`
                                    : ""}
                              </div>
                              {s.guest_name && (
                                <div className="mt-1">
                                  <div className="font-medium">
                                    {s.guest_name}
                                  </div>
                                  {s.guest_phone && (
                                    <a
                                      href={`tel:${s.guest_phone}`}
                                      className="text-hotel-gold hover:underline"
                                    >
                                      {s.guest_phone}
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>

                            <SessionOrders sessionId={s.id} />
                          </div>
                          <DialogFooter />
                        </DialogContent>
                      </Dialog>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigate(`/admin?sessionId=${s.id}`);
                        }}
                      >
                        View Orders
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyOTP(s.otp)}
                      >
                        <Copy className="h-4 w-4 mr-1" /> Copy
                      </Button>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SessionOrders({ sessionId }: { sessionId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["session-orders", sessionId],
    queryFn: async () => {
      return await getOrdersForSession(sessionId);
    },
  });

  const queryClient = useQueryClient();

  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState<string>("");

  const handleAddCustom = async (orderId: string) => {
    if (!customName || !customPrice) return;
    const price = Number(customPrice);
    try {
      await addOrderItem({
        orderId,
        itemId: undefined,
        itemName: customName,
        quantity: 1,
        priceAtTime: price,
        customPrice: price,
        notes: null,
      });
      setCustomName("");
      setCustomPrice("");
      await queryClient.invalidateQueries(["session-orders", sessionId]);
      await recalculateOrderTotal(orderId);
      toast({ title: "Added", description: "Custom item added" });
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to add",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div>Loading orders...</div>;
  if (!data || data.length === 0) return <div>No orders for this session</div>;

  return (
    <div className="space-y-4">
      {data.map((order: any) => (
        <div key={order.id} className="border rounded p-3">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-muted-foreground">Order</div>
              <div className="font-medium">{order.id}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="font-medium">₹{order.total_amount}</div>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {order.order_items?.map((it: any) => (
              <div key={it.id} className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="font-medium">{it.item_name}</div>
                  <div className="text-sm text-muted-foreground">
                    Qty: {it.quantity}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Price: ₹{it.custom_price ?? it.price_at_time}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <EditOrderItemForm item={it} />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        try {
                          await removeOrderItem(it.id);
                          await queryClient.invalidateQueries([
                            "session-orders",
                            sessionId,
                          ]);
                          await recalculateOrderTotal(order.id);
                          toast({
                            title: "Removed",
                            description: "Item removed",
                          });
                        } catch (err: unknown) {
                          toast({
                            title: "Error",
                            description:
                              err instanceof Error ? err.message : "Failed",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <Input
              placeholder="Custom name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
            <Input
              placeholder="Price"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
            />
            <Button onClick={() => handleAddCustom(order.id)}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function EditOrderItemForm({ item }: { item: any }) {
  const [qty, setQty] = useState(item.quantity);
  const [notes, setNotes] = useState(item.notes ?? "");
  const [price, setPrice] = useState<string>(
    String(item.custom_price ?? item.price_at_time),
  );
  const queryClient = useQueryClient();

  const handleSave = async () => {
    try {
      await updateOrderItem(item.id, {
        quantity: qty,
        custom_price: price ? Number(price) : null,
        notes: notes || null,
      });
      await queryClient.invalidateQueries();
      toast({ title: "Saved", description: "Item updated" });
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        className="w-16"
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))}
      />
      <Input
        className="w-24"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <Input
        className="w-48"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <Button size="sm" onClick={handleSave}>
        <Edit2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
