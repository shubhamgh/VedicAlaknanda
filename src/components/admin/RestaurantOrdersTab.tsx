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
    // Ask for confirmation when marking as completed or cancelled
    if (status === "completed" || status === "cancelled") {
      const ok = window.confirm(
        `Are you sure you want to mark this order as ${STATUS_LABELS[status]}?`,
      );
      if (!ok) return;
    }

    await updateOrderStatus(orderId, status);
  };

  // Group orders by session so multiple orders from same OTP appear as one
  const ordersArr = orders
    ? sessionFilter
      ? orders.filter((o) => o.session_id === sessionFilter)
      : orders
    : [];

  const groupOrdersBySession = (arr: any[]) => {
    const map = new Map<string, any>();
    for (const o of arr) {
      const sid = o.session_id ?? o.id;
      if (!map.has(sid)) {
        map.set(sid, {
          session_id: sid,
          order_ids: [],
          order_sessions: o.order_sessions,
          created_at: o.created_at,
          order_items: [],
          total_amount: 0,
          statuses: new Set<string>(),
        });
      }
      const g = map.get(sid);
      g.order_ids.push(o.id);
      g.order_items = g.order_items.concat(o.order_items || []);
      g.total_amount = (g.total_amount || 0) + Number(o.total_amount ?? 0);
      if (new Date(o.created_at) < new Date(g.created_at))
        g.created_at = o.created_at;
      g.statuses.add(o.status);
    }
    return Array.from(map.values()).map((g) => ({
      id: g.session_id,
      order_ids: g.order_ids,
      order_sessions: g.order_sessions,
      created_at: g.created_at,
      order_items: g.order_items,
      total_amount: g.total_amount,
      // if multiple statuses, pick the most recent order's status as representative
      status: g.statuses.size === 1 ? Array.from(g.statuses)[0] : "pending",
    }));
  };

  const handleGroupStatusChange = async (
    orderIds: string[],
    status: OrderStatus,
  ) => {
    if (status === "completed" || status === "cancelled") {
      const ok = window.confirm(
        `Are you sure you want to mark these orders as ${STATUS_LABELS[status]}?`,
      );
      if (!ok) return;
    }
    await Promise.all(orderIds.map((id) => updateOrderStatus(id, status)));
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Restaurant Orders</h2>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="space-y-6">
          {/* Active / in-progress orders grouped by session */}
          {groupOrdersBySession(
            ordersArr.filter(
              (o) => o.status !== "completed" && o.status !== "cancelled",
            ),
          ).map((group) => {
            const roomOrTable = group.order_sessions?.room_number
              ? `Room ${group.order_sessions.room_number}`
              : group.order_sessions?.table_number
                ? `Table ${group.order_sessions.table_number}`
                : "—";

            const representativeOrder = {
              id: group.id,
              order_sessions: group.order_sessions,
              created_at: group.created_at,
              order_items: group.order_items,
              total_amount: group.total_amount,
            } as any;

            return (
              <Card key={group.id}>
                <CardContent className="p-4">
                  <div className="flex flex-wrap justify-between gap-4">
                    <div>
                      <span className="font-mono text-sm">
                        #{group.id.slice(0, 8)}
                      </span>
                      <span className="ml-2 text-muted-foreground">
                        {roomOrTable}
                      </span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        {new Date(group.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {STATUS_LABELS[group.status as OrderStatus]}
                      </Badge>
                      <Select
                        value={group.status}
                        onValueChange={(v) =>
                          handleGroupStatusChange(
                            group.order_ids,
                            v as OrderStatus,
                          )
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
                      <ReceiptPrint order={representativeOrder} />
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1 text-sm">
                    {group.order_items.map((oi: any, idx: number) => (
                      <li key={`${group.id}-i-${idx}`}>
                        {oi.item_name ?? "Item"} × {oi.quantity} — ₹
                        {(
                          Number(oi.custom_price ?? oi.price_at_time) *
                          oi.quantity
                        ).toFixed(2)}
                        {oi.notes && (
                          <span className="text-muted-foreground">
                            {" "}
                            ({oi.notes})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 font-semibold">
                    Total: ₹{Number(group.total_amount).toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Completed / cancelled orders grouped by session */}
          <div className="space-y-4">
            {groupOrdersBySession(
              ordersArr.filter(
                (o) => o.status === "completed" || o.status === "cancelled",
              ),
            ).map((group) => {
              const roomOrTable = group.order_sessions?.room_number
                ? `Room ${group.order_sessions.room_number}`
                : group.order_sessions?.table_number
                  ? `Table ${group.order_sessions.table_number}`
                  : "—";

              const representativeOrder = {
                id: group.id,
                order_sessions: group.order_sessions,
                created_at: group.created_at,
                order_items: group.order_items,
                total_amount: group.total_amount,
              } as any;

              return (
                <Card key={group.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap justify-between gap-4">
                      <div>
                        <span className="font-mono text-sm">
                          #{group.id.slice(0, 8)}
                        </span>
                        <span className="ml-2 text-muted-foreground">
                          {roomOrTable}
                        </span>
                        <span className="ml-2 text-sm text-muted-foreground">
                          {new Date(group.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {STATUS_LABELS[group.status as OrderStatus]}
                        </Badge>
                        <ReceiptPrint order={representativeOrder} />
                      </div>
                    </div>
                    <ul className="mt-3 space-y-1 text-sm">
                      {group.order_items.map((oi: any, idx: number) => (
                        <li key={`${group.id}-c-${idx}`}>
                          {oi.item_name ?? "Item"} × {oi.quantity} — ₹
                          {(
                            Number(oi.custom_price ?? oi.price_at_time) *
                            oi.quantity
                          ).toFixed(2)}
                          {oi.notes && (
                            <span className="text-muted-foreground">
                              {" "}
                              ({oi.notes})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 font-semibold">
                      Total: ₹{Number(group.total_amount).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {orders?.length === 0 && !isLoading && (
        <p className="text-muted-foreground">No orders yet</p>
      )}
    </div>
  );
}
