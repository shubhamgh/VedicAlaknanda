import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { OrderWithDetails } from "@/hooks/useOrders";
import { Printer } from "lucide-react";

const HOTEL_NAME = "Hotel Vedic Alaknanda";
const ADDRESS = "Kedarnath Road, Rudraprayag, Uttarakhand";
const GSTIN = "XX XXXXXXXXX XXX X";

export default function ReceiptPrint({
  order,
}: {
  order: OrderWithDetails;
}) {
  const [open, setOpen] = useState(false);
  const [includeGST, setIncludeGST] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const roomOrTable =
    order.order_sessions?.room_number
      ? `Room ${order.order_sessions.room_number}`
      : order.order_sessions?.table_number
        ? `Table ${order.order_sessions.table_number}`
        : "—";

  const subtotal = order.order_items.reduce(
    (sum, i) =>
      sum + Number(i.custom_price ?? i.price_at_time) * i.quantity,
    0
  );

  // If GST included: prices are shown as tax-inclusive; we back-calculate base and add 5% GST line
  const gstRate = 0.05;
  const baseIfIncluded = includeGST ? subtotal / (1 + gstRate) : subtotal;
  const gstAmount = includeGST ? subtotal - baseIfIncluded : 0;
  const grandTotal = subtotal;

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${order.id.slice(0, 8)}</title>
          <style>
            body { font-family: monospace; padding: 20px; font-size: 14px; }
            h1 { font-size: 18px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { text-align: left; padding: 4px 8px; border-bottom: 1px solid #eee; }
            .right { text-align: right; }
            .total { font-weight: bold; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      win.close();
    }, 250);
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
      >
        <Printer className="h-4 w-4 mr-1" /> Bill
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Bill</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeGST}
                onChange={(e) => setIncludeGST(e.target.checked)}
              />
              <span>Include 5% GST</span>
            </label>
            <div
              ref={printRef}
              className="border rounded p-4 bg-white text-black text-sm space-y-2"
            >
              <h1 className="text-center font-bold">{HOTEL_NAME}</h1>
              <p className="text-center text-xs">{ADDRESS}</p>
              {includeGST && (
                <p className="text-center text-xs">GSTIN: {GSTIN}</p>
              )}
              <hr />
              <p>
                Order #: {order.id.slice(0, 8)} | {roomOrTable}
              </p>
              <p>
                Date: {new Date(order.created_at).toLocaleString()}
              </p>
              <hr />
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th className="right">Qty</th>
                    <th className="right">Price</th>
                    <th className="right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_items.map((oi) => {
                    const price = Number(oi.custom_price ?? oi.price_at_time);
                    const amt = price * oi.quantity;
                    return (
                      <tr key={oi.id}>
                        <td>{oi.item_name ?? "Item"}{oi.notes ? ` (${oi.notes})` : ""}</td>
                        <td className="right">{oi.quantity}</td>
                        <td className="right">₹{price.toFixed(2)}</td>
                        <td className="right">₹{amt.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <hr />
              {includeGST ? (
                <>
                  <div className="flex justify-between">
                    <span>Subtotal (incl. GST)</span>
                    <span>₹{baseIfIncluded.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span>₹{gstAmount.toFixed(2)}</span>
                  </div>
                </>
              ) : null}
              <div className="flex justify-between total">
                <span>Grand Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <Button className="w-full" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" /> Print Receipt
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
