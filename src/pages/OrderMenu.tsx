import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOrderSessionContext } from "@/contexts/OrderSessionContext";
import { useMenu } from "@/hooks/useMenu";
import {
  createOrder,
  addOrderItem,
  recalculateOrderTotal,
  getOrdersForSession,
} from "@/lib/restaurant-api";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RoleGuard } from "@/components/restaurant/RoleGuard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import type { MenuItem } from "@/hooks/useMenu";
import { Minus, Plus, ShoppingCart, ChevronDown } from "lucide-react";

interface CartItem {
  item: MenuItem;
  quantity: number;
  notes?: string | null;
}

export default function OrderMenu() {
  const { sessionId, sessionOtp, roomOrTable, clearSession } =
    useOrderSessionContext();
  const navigate = useNavigate();
  const { data, isLoading } = useMenu();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState<number | string>("");
  const [placing, setPlacing] = useState(false);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  if (!sessionId) {
    navigate("/order");
    return null;
  }

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const found = prev.find((c) => c.item.id === item.id);
      if (found) {
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c,
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const addCustomToCart = (name: string, price: number) => {
    const id = `custom-${Date.now()}`;
    const customItem: MenuItem & { isCustom?: boolean } = {
      id,
      category_id: "custom",
      name,
      description: null,
      price,
      is_available: true,
      is_veg: true,
      created_at: new Date().toISOString(),
    };
    setCart((prev) => [
      ...prev,
      { item: customItem, quantity: 1, notes: null },
    ]);
    setCustomName("");
    setCustomPrice("");
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const found = prev.find((c) => c.item.id === itemId);
      if (!found) return prev;
      if (found.quantity === 1) {
        return prev.filter((c) => c.item.id !== itemId);
      }
      return prev.map((c) =>
        c.item.id === itemId ? { ...c, quantity: c.quantity - 1 } : c,
      );
    });
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items before placing order.",
        variant: "destructive",
      });
      return;
    }
    setPlacing(true);
    try {
      const order = await createOrder(sessionId);
      for (const { item, quantity, notes } of cart) {
        const isCustom = String(item.id).startsWith("custom-");
        await addOrderItem({
          orderId: order.id,
          itemId: isCustom ? undefined : item.id,
          itemName: item.name,
          quantity,
          priceAtTime: item.price,
          notes: notes ?? null,
        });
      }
      await recalculateOrderTotal(order.id);
      setCart([]);
      toast({
        title: "Order placed",
        description: "Your order has been sent to the kitchen.",
      });
      navigate("/order/confirm");
    } catch (err: unknown) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setPlacing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading menu...</div>
        </main>
        <Footer />
      </div>
    );
  }

  function GuestOrders({ sessionId }: { sessionId: string | null }) {
    const { data, isLoading } = useQuery({
      queryKey: ["guest-session-orders", sessionId],
      queryFn: async () => {
        if (!sessionId) return [];
        return await getOrdersForSession(sessionId);
      },
      enabled: !!sessionId,
    });

    if (!sessionId) return <div>No active session</div>;
    if (isLoading) return <div>Loading orders...</div>;
    if (!data || data.length === 0) return <div>No orders yet</div>;

    return (
      <div className="space-y-4">
        {data.map((order: any) => (
          <div key={order.id} className="border rounded p-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-muted-foreground">Order</div>
                <div className="font-medium">#{order.id.slice(0, 8)}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="font-medium">₹{order.total_amount}</div>
              </div>
            </div>
            <ul className="mt-2 space-y-1 text-sm">
              {order.order_items?.map((it: any) => (
                <li key={it.id} className="flex justify-between">
                  <span>
                    {it.item_name} × {it.quantity}
                  </span>
                  <span>
                    ₹
                    {(
                      Number(it.custom_price ?? it.price_at_time) * it.quantity
                    ).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  const categories = data?.categories ?? [];
  const items = data?.items ?? [];

  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = normalizedQuery
    ? items.filter(
        (i) =>
          i.name.toLowerCase().includes(normalizedQuery) ||
          (i.description || "").toLowerCase().includes(normalizedQuery),
      )
    : items;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* page-specific spacer so menu content appears below the fixed header */}
      <div aria-hidden="true" className="h-16 md:h-20" />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-hotel-dark">Menu</h1>
              {roomOrTable && (
                <p className="text-sm text-muted-foreground">{roomOrTable}</p>
              )}
              {/* Show OTP if available */}
              {(sessionOtp || sessionId) && (
                <p className="text-xs text-hotel-gold mt-1">
                  OTP: {(sessionOtp ?? sessionId)?.slice(0, 6)}
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <Button variant="outline" onClick={() => clearSession()}>
                End Session
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    View orders
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Orders for OTP {sessionOtp ?? sessionId?.slice(0, 6)}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-2">
                    <GuestOrders sessionId={sessionId} />
                  </div>
                  <DialogFooter />
                </DialogContent>
              </Dialog>
              <Link to="/order">
                <Button variant="ghost">Change OTP</Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="mb-4 flex items-center gap-2 relative">
                <input
                  aria-label="Search menu"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Search menu items..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-hotel-gold bg-transparent border-none p-1"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                  >
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              {query && (
                <div className="mb-2 text-hotel-gold font-semibold text-sm">
                  Showing results for "{query}"
                </div>
              )}

              {categories.map((cat) => {
                const catItems = filteredItems.filter(
                  (i) => i.category_id === cat.id,
                );
                if (catItems.length === 0) return null;
                const isExpanded = !!expanded[cat.id];
                return (
                  <section key={cat.id}>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-hotel-dark">
                        {cat.name}
                      </h2>
                      <button
                        aria-expanded={isExpanded}
                        onClick={() =>
                          setExpanded((prev) => ({
                            ...prev,
                            [cat.id]: !prev[cat.id],
                          }))
                        }
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <span className="text-xs text-muted-foreground">
                          {catItems.length} items
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-150 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="grid gap-3">
                        {catItems.map((item) => (
                          <Card
                            key={item.id}
                            className="flex flex-row items-center justify-between p-4"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{item.name}</span>
                              </div>
                              {item.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {item.description}
                                </p>
                              )}
                              <p className="text-hotel-gold font-semibold mt-1">
                                ₹{item.price}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => removeFromCart(item.id)}
                                disabled={
                                  !cart.find((c) => c.item.id === item.id)
                                    ?.quantity
                                }
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-6 text-center">
                                {cart.find((c) => c.item.id === item.id)
                                  ?.quantity ?? 0}
                              </span>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => addToCart(item)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-4">
                  <h3 className="font-semibold flex items-center gap-2 mb-4">
                    <ShoppingCart className="h-4 w-4" /> Cart ({cartCount})
                  </h3>
                  {cart.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No items yet
                    </p>
                  ) : (
                    <>
                      <ul className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                        {cart.map(({ item, quantity }) => (
                          <li
                            key={item.id}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {item.name} × {quantity}
                            </span>
                            <div className="text-right">
                              <div>₹{item.price * quantity}</div>
                              <div className="mt-1">
                                <input
                                  placeholder="Notes (less spicy, no onion...)"
                                  className="w-full px-2 py-1 border rounded-md text-sm"
                                  value={
                                    cart.find((c) => c.item.id === item.id)
                                      ?.notes ?? ""
                                  }
                                  onChange={(e) =>
                                    setCart((prev) =>
                                      prev.map((c) =>
                                        c.item.id === item.id
                                          ? { ...c, notes: e.target.value }
                                          : c,
                                      ),
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t pt-4">
                        {/* Custom item section removed for guests. Only staff can add custom items from Order Sessions. */}
                        <div className="flex justify-between font-semibold mb-4">
                          <span>Subtotal</span>
                          <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                        <Button
                          className="w-full"
                          onClick={handlePlaceOrder}
                          disabled={placing}
                        >
                          {placing ? "Placing..." : "Place Order"}
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
