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
  closeOrderSession,
  createOrder,
} from "@/lib/restaurant-api";
import { useMenu } from "@/hooks/useMenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Copy, Phone, Edit2, Trash2, Plus, Minus } from "lucide-react";
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
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [expiresIn, setExpiresIn] = useState<number>(24); // hours
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
        expiresInMinutes: expiresIn * 60,
        guestName: guestName?.trim() || undefined,
        guestPhone: guestPhone?.trim() || undefined,
      });
      const url = `${window.location.origin}/order?otp=${session.otp}`;
      await navigator.clipboard.writeText(`${session.otp}\n${url}`);
      toast({
        title: "Session created",
        description: `OTP: ${session.otp} (copied to clipboard)`,
      });
      setRoomNumber("");
      setTableNumber("");
      setGuestName("");
      setGuestPhone("");
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
          <CardTitle>Create Order Session / Staff Order</CardTitle>
          <p className="text-sm text-muted-foreground">
            Generate an OTP for guest or create a fresh order as staff.
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
            <div className="space-y-2">
              <Label htmlFor="name">Guest/Staff Name</Label>
              <Input
                id="name"
                placeholder="Name"
                value={guestName ?? ""}
                onChange={(e) => setGuestName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Contact</Label>
              <Input
                id="phone"
                placeholder="Phone"
                value={guestPhone ?? ""}
                onChange={(e) => setGuestPhone(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={creating}>
                {creating ? "Creating..." : "Generate OTP / Order"}
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry (hours)</Label>
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
                  guest_name?: string | null;
                  guest_phone?: string | null;
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
                          <div className="mt-2 space-y-4 flex flex-col">
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

                            <div className="flex-1 min-h-0 overflow-y-auto">
                              <SessionOrders sessionId={s.id} />
                            </div>
                          </div>
                          <DialogFooter />
                        </DialogContent>
                      </Dialog>

                      {/* Removed View Orders button as not needed */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyOTP(s.otp)}
                      >
                        <Copy className="h-4 w-4 mr-1" /> Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () => {
                          const ok = window.confirm(
                            `Close session ${s.otp}? This will prevent guests from using this OTP to place new orders.`,
                          );
                          if (!ok) return;
                          try {
                            await closeOrderSession(s.id);
                            queryClient.invalidateQueries({
                              queryKey: ["order-sessions"],
                            });
                            toast({
                              title: "Closed",
                              description: "Session closed",
                            });
                          } catch (err: unknown) {
                            toast({
                              title: "Error",
                              description:
                                err instanceof Error
                                  ? err.message
                                  : "Failed to close session",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        Close
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

  const { data: sessionInfo, isLoading: sessionLoading } = useQuery({
    queryKey: ["order-session", sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_sessions")
        .select("status")
        .eq("id", sessionId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const isActive = sessionInfo?.status === "active";

  const queryClient = useQueryClient();
  const { data: menuData } = useMenu();
  const [showMenu, setShowMenu] = useState(false);

  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState<string>("");
  const [customQuantity, setCustomQuantity] = useState<number>(1);

  const handleAddCustom = async (orderId: string) => {
    const qty = Number(customQuantity);
    if (!customName || !customPrice || Number.isNaN(qty) || qty <= 0) return;
    const price = Number(customPrice);
    try {
      await addOrderItem({
        orderId,
        itemId: undefined,
        itemName: customName,
        quantity: qty,
        priceAtTime: price,
        customPrice: price,
        notes: null,
      });
      setCustomName("");
      setCustomPrice("");
      setCustomQuantity(1);
      await queryClient.invalidateQueries({
        queryKey: ["session-orders", sessionId],
      });
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

  if (isLoading || sessionLoading) return <div>Loading orders...</div>;

  // Always render session orders area; show menu dialog to add items so UI doesn't disappear
  // when orders are created (keeps hooks stable and behavior consistent)
  return (
    <div className="space-y-4">
      {!data || data.length === 0 ? (
        <div className="text-muted-foreground">No orders for this session</div>
      ) : (
        data.map((order: any) => (
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {isActive && (
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">Open Menu</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add items to session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <StaffOrderMenu
                sessionId={sessionId}
                existingOrders={data}
                onPlaced={async () => {
                  await queryClient.invalidateQueries({
                    queryKey: ["session-orders", sessionId],
                  });
                }}
              />
            </div>
            <DialogFooter />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {!isActive && (
        <div className="text-sm text-destructive">
          This session is closed — editing is disabled.
        </div>
      )}
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
                    <EditOrderItemForm item={it} disabled={!isActive} />
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={!isActive}
                      onClick={async () => {
                        try {
                          await removeOrderItem(it.id);
                          await queryClient.invalidateQueries({
                            queryKey: ["session-orders", sessionId],
                          });
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

          <div className="mt-3 grid grid-cols-4 gap-2">
            <Input
              placeholder="Custom name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              disabled={!isActive}
            />
            <Input
              placeholder="Price"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              disabled={!isActive}
            />
            <Input
              placeholder="Qty"
              type="number"
              min={1}
              value={customQuantity}
              onChange={(e) =>
                setCustomQuantity(Math.max(1, Number(e.target.value)))
              }
              disabled={!isActive}
            />
            <Button
              onClick={() => handleAddCustom(order.id)}
              disabled={!isActive}
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function EditOrderItemForm({
  item,
  disabled = false,
}: {
  item: any;
  disabled?: boolean;
}) {
  const [qty, setQty] = useState(item.quantity);
  const [notes, setNotes] = useState(item.notes ?? "");
  const [price, setPrice] = useState<string>(
    String(item.custom_price ?? item.price_at_time),
  );
  const queryClient = useQueryClient();

  const handleSave = async () => {
    if (disabled) return;
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
        disabled={disabled}
      />
      <Input
        className="w-24"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        disabled={disabled}
      />
      <Input
        className="w-48"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={disabled}
      />
      <Button size="sm" onClick={handleSave} disabled={disabled}>
        <Edit2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

function StaffOrderMenu({
  sessionId,
  existingOrders,
  onPlaced,
}: {
  sessionId: string;
  existingOrders: any[] | undefined;
  onPlaced?: () => Promise<void>;
}) {
  const { data } = useMenu();
  const items = data?.items ?? [];
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<{ item: any; quantity: number }[]>([]);
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState<string>("");
  const [customQuantity, setCustomQuantity] = useState<number>(1);
  const [placing, setPlacing] = useState(false);
  const queryClient = useQueryClient();

  const addToCart = (item: any) => {
    setCart((prev) => {
      const found = prev.find((c) => c.item.id === item.id);
      if (found)
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c,
        );
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const found = prev.find((c) => c.item.id === itemId);
      if (!found) return prev;
      if (found.quantity === 1) return prev.filter((c) => c.item.id !== itemId);
      return prev.map((c) =>
        c.item.id === itemId ? { ...c, quantity: c.quantity - 1 } : c,
      );
    });
  };

  const addCustomToCart = (name: string, price: number, quantity: number) => {
    const id = `custom-${Date.now()}`;
    const customItem = { id, name, price };
    setCart((prev) => [...prev, { item: customItem, quantity }]);
    setCustomName("");
    setCustomPrice("");
    setCustomQuantity(1);
  };

  const cartTotal = cart.reduce(
    (sum, c) => sum + Number(c.item.price ?? 0) * c.quantity,
    0,
  );

  const handlePlace = async () => {
    if (cart.length === 0) return;
    setPlacing(true);
    try {
      // create order if none exists else add to first existing order
      let orderId: string;
      if (!existingOrders || existingOrders.length === 0) {
        const ord = await createOrder(sessionId);
        orderId = ord.id;
      } else {
        orderId = existingOrders[0].id;
      }
      for (const c of cart) {
        const isCustom = String(c.item.id).startsWith("custom-");
        await addOrderItem({
          orderId,
          itemId: isCustom ? undefined : c.item.id,
          itemName: c.item.name,
          quantity: c.quantity,
          priceAtTime: Number(c.item.price ?? 0),
          notes: null,
        });
      }
      await recalculateOrderTotal(orderId);
      setCart([]);
      if (onPlaced) await onPlaced();
      toast({ title: "Order updated", description: "Items added to session" });
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to add items",
        variant: "destructive",
      });
    } finally {
      setPlacing(false);
      await queryClient.invalidateQueries({
        queryKey: ["session-orders", sessionId],
      });
    }
  };

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = normalizedQuery
    ? items.filter(
        (i: any) =>
          i.name.toLowerCase().includes(normalizedQuery) ||
          (i.description || "").toLowerCase().includes(normalizedQuery),
      )
    : items;

  return (
    <div className="space-y-4">
      <div>
        <input
          placeholder="Search items"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-auto">
        {filtered.map((it: any) => (
          <div
            key={it.id}
            className="p-2 border rounded flex items-center justify-between"
          >
            <div>
              <div className="font-medium">{it.name}</div>
              <div className="text-sm text-muted-foreground">
                ₹{Number(it.price).toFixed(2)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => removeFromCart(it.id)}
                disabled={!cart.find((c) => c.item.id === it.id)?.quantity}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-6 text-center">
                {cart.find((c) => c.item.id === it.id)?.quantity ?? 0}
              </span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => addToCart(it)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <input
            placeholder="Custom name"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full px-2 py-1 border rounded"
          />
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Price"
            value={customPrice}
            onChange={(e) => setCustomPrice(e.target.value)}
            className="px-2 py-1 border rounded w-32"
          />
          <input
            placeholder="Qty"
            type="number"
            min={1}
            value={customQuantity}
            onChange={(e) =>
              setCustomQuantity(Math.max(1, Number(e.target.value)))
            }
            className="px-2 py-1 border rounded w-24"
          />
          <Button
            onClick={() => {
              const qty = Number(customQuantity);
              if (customName && customPrice && qty > 0)
                addCustomToCart(customName, Number(customPrice), qty);
            }}
          >
            Add Custom
          </Button>
        </div>
      </div>

      <div className="border rounded p-3">
        <div className="mb-2 font-semibold">Cart</div>
        {cart.length === 0 ? (
          <div className="text-sm text-muted-foreground">No items yet</div>
        ) : (
          <ul className="space-y-2">
            {cart.map((c) => (
              <li key={c.item.id} className="flex justify-between">
                <span>
                  {c.item.name} × {c.quantity}
                </span>
                <span>
                  ₹{(Number(c.item.price ?? 0) * c.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="text-right font-bold mt-2">
          Total: ₹{cartTotal.toFixed(2)}
        </div>
        <div className="mt-3 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setCart([])}>
            Clear
          </Button>
          <Button onClick={handlePlace} disabled={placing || cart.length === 0}>
            {placing ? "Adding..." : "Add to Order"}
          </Button>
        </div>
      </div>
    </div>
  );
}
