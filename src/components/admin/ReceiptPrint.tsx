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
const ADDRESS = "Narkota, Rudraprayag, Uttarakhand";
const GSTIN = "05CKIPM9560K1ZM";

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

  const guestName = order.order_sessions?.guest_name ?? "";
  const guestPhone = order.order_sessions?.guest_phone ?? "";
  const guestHtml = [
    guestName ? `<div>Guest: ${guestName}</div>` : "",
    guestPhone ? `<div>Contact: ${guestPhone}</div>` : "",
  ]
    .filter(Boolean)
    .join("\n");

  // Tax handling: if includeGST is true, we'll add CGST+SGST (2.5% each) on subtotal
  const cgstRate = 0.025;
  const sgstRate = 0.025;
  const itemsWithGST = order.order_items.map((oi) => {
    const marked = Number(oi.custom_price ?? oi.price_at_time);
    const price = marked;
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

  // Tax calculation: CGST + SGST applied on subtotalAfterDiscount
  const cgstAmount = includeGST ? subtotalAfterDiscount * cgstRate : 0;
  const sgstAmount = includeGST ? subtotalAfterDiscount * sgstRate : 0;
  const grandTotalExact = subtotalAfterDiscount + cgstAmount + sgstAmount;
  const grandTotal = Math.ceil(grandTotalExact);

  function formatDateOnly(dateStr: string | undefined | null) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

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
            <td style="text-align:right;padding:6px 8px">₹${oi.price.toFixed(2)}</td>
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
          <title></title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            @page { margin: 0 }
            html,body{height:100%;}
            body{font-family:monospace;padding:0;margin:0;color:#000}
            h1{font-size:18px;margin:0}
            table{width:100%;border-collapse:collapse;table-layout:fixed;margin-top:8px}
            th,td{padding:6px 8px;border-bottom:1px solid #eee}
            th:first-child, td:first-child{width:55%}
            th:nth-child(2), td:nth-child(2){width:10%;text-align:right}
            th:nth-child(3), td:nth-child(3){width:15%;text-align:right}
            th:nth-child(4), td:nth-child(4){width:20%;text-align:right}
            .total{font-weight:bold;margin-top:8px;display:flex;justify-content:space-between}
            .bill{page-break-inside:avoid;break-inside:avoid}
            @media print{ html,body{margin:0;padding:0} .print-controls{display:none!important} }
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
              <div>Date: ${formatDateOnly(order.created_at)}</div>
            </div>
            ${order.order_sessions?.guest_name ? `<div>Guest: ${order.order_sessions.guest_name}</div>` : ""}
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
            ${
              includeGST
                ? `
              <div style="display:flex;justify-content:space-between;margin-top:6px"><div>CGST (2.5%)</div><div>₹${cgstAmount.toFixed(2)}</div></div>
              <div style="display:flex;justify-content:space-between;margin-top:6px"><div>SGST (2.5%)</div><div>₹${sgstAmount.toFixed(2)}</div></div>
              <div style="margin-top:6px;font-size:12px">Calculation: Subtotal (₹${subtotalAfterDiscount.toFixed(2)}) + CGST (2.5%) + SGST (2.5%) = ₹${grandTotal.toFixed(2)}</div>
            `
                : ""
            }
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
          cgstAmount,
          sgstAmount,
          grandTotal,
        });
      } catch (err) {
        // non-fatal, still attempt to print
        // eslint-disable-next-line no-console
        console.error("Failed to save bill:", err);
      }
      try {
        // clear title & try to hide URL in some browsers (user print settings may still show headers)
        try {
          win.document.title = "";
          if (win.history && win.history.replaceState) {
            try {
              win.history.replaceState(null, "", "");
            } catch (e) {}
          }
        } catch (e) {}
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
              <p>Date: {formatDateOnly(order.created_at)}</p>
              {guestName && <p>Guest: {guestName}</p>}
              {guestPhone && <p>Contact: {guestPhone}</p>}
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
                        <td className="right">₹{oi.price.toFixed(2)}</td>
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
                    <span>CGST (2.5%)</span>
                    <span>₹{cgstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGST (2.5%)</span>
                    <span>₹{sgstAmount.toFixed(2)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between total">
                <span>Grand Total</span>
                <span>
                  ₹
                  {Number(grandTotal.toFixed(2)) +
                    Number(cgstAmount.toFixed(2)) +
                    Number(sgstAmount.toFixed(2))}
                </span>
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
