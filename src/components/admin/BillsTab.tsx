import React, { useState } from "react";
import { useAllOrdersForAdmin } from "@/hooks/useOrders";
import { createBill } from "@/lib/restaurant-api";
import { toast } from "@/hooks/use-toast";

export default function BillsTab() {
  const { data: orders = [], isLoading } = useAllOrdersForAdmin();
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [selectedDates, setSelectedDates] = useState<Record<string, string>>(
    {},
  );
  const [includeGST, setIncludeGST] = useState(false);
  const [busy, setBusy] = useState(false);

  const toggle = (id: string) => {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  };

  const setDateFor = (id: string, date: string) => {
    setSelectedDates((s) => ({ ...s, [id]: date }));
  };

  const postSelected = async () => {
    const ids = Object.keys(selected).filter((k) => selected[k]);
    if (ids.length === 0) return;
    setBusy(true);
    let success = 0;
    let failed = 0;
    try {
      for (const id of ids) {
        const order = orders.find((o: any) => o.id === id);
        if (!order) continue;
        try {
          const grandTotal = Number(order.total_amount ?? 0);
          const dateVal = selectedDates[id];
          const createdAt = dateVal
            ? new Date(dateVal + "T00:00:00").toISOString()
            : undefined;
          await createBill(
            order,
            includeGST,
            {
              posted_from: "admin-bulk",
              summary: { grandTotal },
            },
            createdAt,
          );
          success++;
        } catch (err) {
          failed++;
          // eslint-disable-next-line no-console
          console.error("Failed to post bill for", id, err);
        }
      }
    } finally {
      setBusy(false);
      toast({
        title: "Post completed",
        description: `${success} succeeded, ${failed} failed`,
      });
    }
  };

  if (isLoading) return <div>Loading orders...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={includeGST}
            onChange={(e) => setIncludeGST(e.target.checked)}
          />
          <span>Mark posted bills as GST included (5%)</span>
        </label>
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded"
          onClick={postSelected}
          disabled={busy}
        >
          {busy ? "Posting..." : "Post Selected Bills"}
        </button>
      </div>

      <div className="overflow-auto border rounded">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">Select</th>
              <th className="p-2">Order</th>
              <th className="p-2">Date</th>
              <th className="p-2">Items</th>
              <th className="p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o: any) => (
              <tr key={o.id} className="border-t">
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={!!selected[o.id]}
                    onChange={() => toggle(o.id)}
                  />
                </td>
                <td className="p-2">{o.id.slice(0, 8)}</td>
                <td className="p-2">
                  <input
                    type="date"
                    value={
                      selectedDates[o.id] ??
                      (o.created_at
                        ? new Date(o.created_at).toISOString().slice(0, 10)
                        : "")
                    }
                    onChange={(e) => setDateFor(o.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                </td>
                <td className="p-2">{o.order_items?.length ?? 0}</td>
                <td className="p-2">₹{(o.total_amount ?? 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
