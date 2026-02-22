import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOrderSessionContext } from "@/contexts/OrderSessionContext";
import { useMenu } from "@/hooks/useMenu";
import {
  createOrder,
  addOrderItem,
  recalculateOrderTotal,
} from "@/lib/restaurant-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import type { MenuItem } from "@/hooks/useMenu";
import { Minus, Plus, ShoppingCart } from "lucide-react";

interface CartItem {
  item: MenuItem;
  quantity: number;
}

export default function OrderMenu() {
  const { sessionId, roomOrTable, clearSession } = useOrderSessionContext();
  const navigate = useNavigate();
  const { data, isLoading } = useMenu();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [placing, setPlacing] = useState(false);

  if (!sessionId) {
    navigate("/order");
    return null;
  }

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const found = prev.find((c) => c.item.id === item.id);
      if (found) {
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const found = prev.find((c) => c.item.id === itemId);
      if (!found) return prev;
      if (found.quantity === 1) {
        return prev.filter((c) => c.item.id !== itemId);
      }
      return prev.map((c) =>
        c.item.id === itemId ? { ...c, quantity: c.quantity - 1 } : c
      );
    });
  };

  const cartTotal = cart.reduce(
    (sum, c) => sum + c.item.price * c.quantity,
    0
  );
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
      for (const { item, quantity } of cart) {
        await addOrderItem({
          orderId: order.id,
          itemId: item.id,
          itemName: item.name,
          quantity,
          priceAtTime: item.price,
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

  const categories = data?.categories ?? [];
  const items = data?.items ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-hotel-dark">Menu</h1>
              {roomOrTable && (
                <p className="text-sm text-muted-foreground">{roomOrTable}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => clearSession()}>
                End Session
              </Button>
              <Link to="/order">
                <Button variant="ghost">Change OTP</Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {categories.map((cat) => {
                const catItems = items.filter((i) => i.category_id === cat.id);
                if (catItems.length === 0) return null;
                return (
                  <section key={cat.id}>
                    <h2 className="text-xl font-semibold mb-4 text-hotel-dark">
                      {cat.name}
                    </h2>
                    <div className="grid gap-3">
                      {catItems.map((item) => (
                        <Card
                          key={item.id}
                          className="flex flex-row items-center justify-between p-4"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.name}</span>
                              {item.is_veg && (
                                <Badge
                                  variant="outline"
                                  className="text-green-600 border-green-600"
                                >
                                  Veg
                                </Badge>
                              )}
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
                            <span>₹{item.price * quantity}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t pt-4">
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
