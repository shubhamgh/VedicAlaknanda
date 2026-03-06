import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { OrderWithDetails } from "@/hooks/useOrders";
import { createBill } from "@/lib/restaurant-api";
import { Printer } from "lucide-react";

const HOTEL_NAME = "Hotel Vedic Alaknanda";
const ADDRESS = "Kedarnath Road, Rudraprayag, Uttarakhand";
const GSTIN = "XX XXXXXXXXX XXX X";

export default function ReceiptPrint({ order }: { order: OrderWithDetails }) {
  const [open, setOpen] = useState(false);
  const [includeGST, setIncludeGST] = useState(false);
  const [discountType, setDiscountType] = useState<"none" | "percent" | "flat">(
    "none",
  );
  const [discountValue, setDiscountValue] = useState(0);
  const printRef = useRef<HTMLDivElement>(null);

  const roomOrTable = order.order_sessions?.room_number
    ? `Room ${order.order_sessions.room_number}`
    : order.order_sessions?.table_number
      ? `Table ${order.order_sessions.table_number}`
      : "—";

  // GST handling: if includeGST is true, marked price is GST-inclusive.
  // Back-calc base price: base = marked / (1 + gstRate)
  const gstRate = 0.05;
  const itemsWithGST = order.order_items.map((oi) => {
    const marked = Number(oi.custom_price ?? oi.price_at_time);
    const price = includeGST ? marked / (1 + gstRate) : marked;
    return { ...oi, price };
  });

  const subtotal = itemsWithGST.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );

  // Discount logic
  let discountAmount = 0;
  if (discountType === "percent" && discountValue > 0) {
    discountAmount = subtotal * (discountValue / 100);
  } else if (discountType === "flat" && discountValue > 0) {
    discountAmount = discountValue;
  }
  const subtotalAfterDiscount = subtotal - discountAmount;

  // GST calculation: compute exact GST on subtotalAfterDiscount and ceil final total
  const gstAmountExact = includeGST ? subtotalAfterDiscount * gstRate : 0;
  const grandTotalExact = subtotalAfterDiscount + gstAmountExact;
  const grandTotal = Math.ceil(grandTotalExact);

  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (!win) return;

    const itemsHtml = itemsWithGST
      .map((oi) => {
        const amt = oi.price * oi.quantity;
        return `
          <tr>
            <td style="padding:6px 8px">${oi.item_name ?? "Item"}${oi.notes ? ` (${oi.notes})` : ""}</td>
            <td style="text-align:right;padding:6px 8px">${oi.quantity}</td>
            <td style="text-align:right;padding:6px 8px">₹${includeGST ? oi.price.toFixed(4) : oi.price.toFixed(2)}</td>
            <td style="text-align:right;padding:6px 8px">₹${amt.toFixed(2)}</td>
          </tr>`;
      })
      .join("\n");

    const gstLine = includeGST
      ? `<div style="text-align:center;font-size:12px">GSTIN: ${GSTIN}</div>`
      : "";

    const discountHtml =
      discountType !== "none" && discountValue > 0
        ? `<div style="display:flex;justify-content:space-between;margin-top:6px;"><div>Discount ${discountType === "percent" ? `(${discountValue}%)` : ""}</div><div>-₹${discountAmount.toFixed(2)}</div></div>`
        : "";

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${order.id.slice(0, 8)}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body{font-family:monospace;padding:16px;margin:0;color:#000}
            h1{font-size:18px;margin:0}
            table{width:100%;border-collapse:collapse;table-layout:fixed;margin-top:8px}
            th,td{padding:6px 8px;border-bottom:1px solid #eee}
            th:first-child, td:first-child{width:55%}
            th:nth-child(2), td:nth-child(2){width:10%;text-align:right}
            th:nth-child(3), td:nth-child(3){width:15%;text-align:right}
            th:nth-child(4), td:nth-child(4){width:20%;text-align:right}
            .total{font-weight:bold;margin-top:8px;display:flex;justify-content:space-between}
            .bill{page-break-inside:avoid;break-inside:avoid}
            @media print{ body{padding:0} .print-controls{display:none!important} }
          </style>
        </head>
        <body>
          <div class="bill" style="padding:8px">
            <h1 style="text-align:center">${HOTEL_NAME}</h1>
            <div style="text-align:center;font-size:12px">${ADDRESS}</div>
            ${gstLine}
            <hr />
            <div style="display:flex;justify-content:space-between;margin-top:8px">
              <div>Order #: ${order.id.slice(0, 8)}</div>
              <div>Date: ${new Date(order.created_at).toLocaleString()}</div>
            </div>
            <table>
              <thead>
                <tr>
                  <th style="text-align:left;padding:6px 8px">Item</th>
                  <th style="text-align:right;padding:6px 8px">Qty</th>
                  <th style="text-align:right;padding:6px 8px">Price</th>
                  <th style="text-align:right;padding:6px 8px">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            ${discountHtml}
            ${includeGST ? `<div style="display:flex;justify-content:space-between;margin-top:6px"><div>GST (5%)</div><div>₹${gstAmountExact.toFixed(2)}</div></div>` : ""}
            <div class="total"><span>Grand Total</span><span>₹${grandTotal.toFixed(2)}</span></div>
          </div>
        </body>
      </html>
    `;

    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(async () => {
      try {
        await createBill(order, includeGST, {
          subtotal,
          discountAmount,
          gstAmount: gstAmountExact,
          grandTotal,
        });
      } catch (err) {
        // non-fatal, still attempt to print
        // eslint-disable-next-line no-console
        console.error("Failed to save bill:", err);
      }
      try {
        win.print();
      } catch (e) {
        /* ignore */
      }
      try {
        win.close();
      } catch (e) {
        /* ignore */
      }
    }, 250);
  };

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Printer className="h-4 w-4 mr-1" /> Bill
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Bill</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="print-controls space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeGST}
                  onChange={(e) => setIncludeGST(e.target.checked)}
                />
                <span>Include 5% GST</span>
              </label>
              <div className="flex items-center gap-2">
                <span>Discount:</span>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="border rounded px-2 py-1"
                >
                  <option value="none">None</option>
                  <option value="percent">%</option>
                  <option value="flat">Flat</option>
                </select>
                {discountType !== "none" && (
                  <input
                    type="number"
                    min={0}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="border rounded px-2 py-1 w-20"
                    placeholder={
                      discountType === "percent" ? "Percent" : "Amount"
                    }
                  />
                )}
              </div>
            </div>
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
              <p>Date: {new Date(order.created_at).toLocaleString()}</p>
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
                  {itemsWithGST.map((oi) => {
                    const amt = oi.price * oi.quantity;
                    return (
                      <tr key={oi.id}>
                        <td>
                          {oi.item_name ?? "Item"}
                          {oi.notes ? ` (${oi.notes})` : ""}
                        </td>
                        <td className="right">{oi.quantity}</td>
                        <td className="right">
                          ₹
                          {includeGST
                            ? oi.price.toFixed(4)
                            : oi.price.toFixed(2)}
                        </td>
                        <td className="right">₹{amt.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <hr />
              {discountType !== "none" && discountValue > 0 && (
                <div className="flex justify-between">
                  <span>
                    Discount{" "}
                    {discountType === "percent" ? `(${discountValue}%)` : ""}
                  </span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              {includeGST && (
                <>
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span>₹{gstAmountExact.toFixed(2)}</span>
                  </div>
                </>
              )}
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
