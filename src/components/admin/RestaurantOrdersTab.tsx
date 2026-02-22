import { useNavigate, useLocation } from "react-router-dom";
import { useAllOrdersForAdmin } from "@/hooks/useOrders";
import { updateOrderStatus } from "@/lib/restaurant-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OrderStatus } from "@/types/restaurant";
import ReceiptPrint from "./ReceiptPrint";
import { ChefHat } from "lucide-react";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function RestaurantOrdersTab() {
  const navigate = useNavigate();
  const { data: orders, isLoading } = useAllOrdersForAdmin();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sessionFilter = params.get("sessionId");

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Restaurant Orders</h2>
        <Button onClick={() => navigate("/kitchen")} variant="outline">
          <ChefHat className="h-4 w-4 mr-2" /> Kitchen Display
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="space-y-4">
          {(orders ? (sessionFilter ? orders.filter(o => o.session_id === sessionFilter) : orders) : []).map((order) => {
            const roomOrTable =
              order.order_sessions?.room_number
                ? `Room ${order.order_sessions.room_number}`
                : order.order_sessions?.table_number
                  ? `Table ${order.order_sessions.table_number}`
                  : "—";

            return (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex flex-wrap justify-between gap-4">
                    <div>
                      <span className="font-mono text-sm">#{order.id.slice(0, 8)}</span>
                      <span className="ml-2 text-muted-foreground">{roomOrTable}</span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {STATUS_LABELS[order.status as OrderStatus]}
                      </Badge>
                      <Select
                        value={order.status}
                        onValueChange={(v) =>
                          handleStatusChange(order.id, v as OrderStatus)
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(
                            [
                              "pending",
                              "confirmed",
                              "preparing",
                              "ready",
                              "delivered",
                              "completed",
                              "cancelled",
                            ] as OrderStatus[]
                          ).map((s) => (
                            <SelectItem key={s} value={s}>
                              {STATUS_LABELS[s]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <ReceiptPrint order={order} />
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1 text-sm">
                    {order.order_items.map((oi) => (
                      <li key={oi.id}>
                        {oi.item_name ?? "Item"} × {oi.quantity} — ₹
                        {(Number(oi.custom_price ?? oi.price_at_time) * oi.quantity).toFixed(
                          2
                        )}
                        {oi.notes && (
                          <span className="text-muted-foreground"> ({oi.notes})</span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 font-semibold">
                    Total: ₹{Number(order.total_amount).toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {orders?.length === 0 && !isLoading && (
        <p className="text-muted-foreground">No orders yet</p>
      )}
    </div>
  );
}
