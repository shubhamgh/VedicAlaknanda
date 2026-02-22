import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { canAccessKitchen } from "@/types/restaurant";
import { useOrders } from "@/hooks/useOrders";
import { updateOrderStatus } from "@/lib/restaurant-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types/restaurant";

const KDS_STATUSES: OrderStatus[] = ["pending", "confirmed", "preparing", "ready"];

function formatElapsed(createdAt: string): string {
  const d = new Date(createdAt);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  const m = Math.floor(diff / 60);
  const s = diff % 60;
  return `${m}m ${s}s`;
}

function isOverdue(createdAt: string, thresholdMinutes = 20): boolean {
  const d = new Date(createdAt);
  const now = new Date();
  const diffMinutes = (now.getTime() - d.getTime()) / (1000 * 60);
  return diffMinutes >= thresholdMinutes;
}

export default function Kitchen() {
  const navigate = useNavigate();
  const { role, isLoading } = useProfile();
  const { data: orders, isLoading: ordersLoading } = useOrders(KDS_STATUSES);

  useEffect(() => {
    if (!isLoading && !canAccessKitchen(role)) {
      navigate("/admin-login");
    }
  }, [isLoading, role, navigate]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!canAccessKitchen(role)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Kitchen Display</h1>
          <Button variant="outline" onClick={() => navigate("/admin")}>
            Admin Dashboard
          </Button>
        </div>

        {ordersLoading ? (
          <div className="text-muted-foreground">Loading orders...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {orders?.map((order) => {
              const roomOrTable =
                order.order_sessions?.room_number
                  ? `Room ${order.order_sessions.room_number}`
                  : order.order_sessions?.table_number
                    ? `Table ${order.order_sessions.table_number}`
                    : "—";
              const overdue = isOverdue(order.created_at);

              return (
                <Card
                  key={order.id}
                  className={`overflow-hidden ${
                    overdue ? "border-red-500 ring-2 ring-red-500" : ""
                  }`}
                >
                  <CardHeader className="py-3 px-4 flex flex-row justify-between items-center bg-gray-800">
                    <span className="font-mono text-sm">#{order.id.slice(0, 8)}</span>
                    <span className="text-sm">{roomOrTable}</span>
                    <Badge
                      variant={overdue ? "destructive" : "secondary"}
                      className="tabular-nums"
                    >
                      {formatElapsed(order.created_at)}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-4">
                    <ul className="space-y-1 mb-4 text-sm">
                      {order.order_items.map((oi) => (
                        <li key={oi.id} className="flex justify-between">
                          <span>
                            {oi.item_name ?? "Item"} × {oi.quantity}
                          </span>
                          {oi.notes && (
                            <span className="text-amber-400 text-xs">
                              ({oi.notes})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      {order.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusChange(order.id, "confirmed")
                          }
                        >
                          Confirm
                        </Button>
                      )}
                      {(order.status === "pending" ||
                        order.status === "confirmed") && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            handleStatusChange(order.id, "preparing")
                          }
                        >
                          Preparing
                        </Button>
                      )}
                      {order.status === "preparing" && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() =>
                            handleStatusChange(order.id, "ready")
                          }
                        >
                          Ready
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {orders?.length === 0 && !ordersLoading && (
          <div className="text-center py-12 text-muted-foreground">
            No active orders
          </div>
        )}
      </div>
    </div>
  );
}
