import React, { useState } from "react";
import { getBills } from "@/lib/restaurant-api";

export default function ReportsTab() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [gstFilter, setGstFilter] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runReport = async () => {
    setLoading(true);
    try {
      const filter: any = {};
      // `from` and `to` are date-only (YYYY-MM-DD) — expand to full-day range
      if (from) {
        const f = new Date(from + "T00:00:00");
        filter.from = f.toISOString();
      }
      if (to) {
        const t = new Date(to + "T23:59:59.999");
        filter.to = t.toISOString();
      }
      if (gstFilter === "included") filter.gstIncluded = true;
      else if (gstFilter === "excluded") filter.gstIncluded = false;
      else filter.gstIncluded = null;

      const rows = await getBills(filter);
      setResults(rows);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex flex-col">
          <label>From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div className="flex flex-col">
          <label>To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div className="flex flex-col">
          <label>GST</label>
          <select
            value={gstFilter ?? "all"}
            onChange={(e) =>
              setGstFilter(e.target.value === "all" ? null : e.target.value)
            }
            className="border rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="included">GST Included</option>
            <option value="excluded">GST Excluded</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={runReport}
            className="px-3 py-1 bg-indigo-600 text-white rounded"
          >
            {loading ? "Loading..." : "Run Report"}
          </button>
          <button
            onClick={() => downloadPrintable(results)}
            className="px-3 py-1 bg-slate-600 text-white rounded"
          >
            Download Printable
          </button>
        </div>
      </div>

      <div className="overflow-auto border rounded">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">Bill ID</th>
              <th className="p-2">Order</th>
              <th className="p-2">Date</th>
              <th className="p-2">GST Included</th>
              <th className="p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r: any) => {
              const order = r.data?.order;
              const summary = r.data?.summary ?? {};
              const total = summary.grandTotal ?? computeTotalFromOrder(order);
              return (
                <tr key={r.id} className="border-t">
                  <td className="p-2">{r.id.slice(0, 8)}</td>
                  <td className="p-2">{r.order_id?.slice(0, 8)}</td>
                  <td className="p-2">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                  <td className="p-2">{r.gst_included ? "Yes" : "No"}</td>
                  <td className="p-2">
                    {total != null ? `₹${Number(total).toFixed(2)}` : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  function downloadPrintable(bills: any[]) {
    if (!bills || bills.length === 0) return;
    const parts: string[] = [];
    for (const r of bills) {
      const order = r.data?.order;
      const summary = r.data?.summary ?? {};
      const items = order?.order_items ?? [];
      const total = summary.grandTotal ?? computeTotalFromOrder(order);
      const itemsHtml = items
        .map((it: any) => {
          const price = Number(it.custom_price ?? it.price_at_time ?? 0);
          const qty = Number(it.quantity ?? 0);
          const amount = price * qty;
          return `
            <tr>
              <td style="padding:4px 8px">${it.item_name ?? "Item"}</td>
              <td style="text-align:right;padding:4px 8px">${qty}</td>
              <td style="text-align:right;padding:4px 8px">₹${price.toFixed(2)}</td>
              <td style="text-align:right;padding:4px 8px">₹${amount.toFixed(2)}</td>
            </tr>`;
        })
        .join("\n");

      const gstLine = r.gst_included
        ? `<div style="text-align:center;font-size:12px;">GSTIN: XX XXXXXXXXX XXX X</div>`
        : "";
      const html = `
          <div class="bill" style="padding:20px;font-family:monospace; page-break-inside:avoid; break-inside:avoid;">
            <h2 style="text-align:center;margin:0">Hotel Vedic Alaknanda</h2>
            <div style="text-align:center;font-size:12px;">Kedarnath Road, Rudraprayag, Uttarakhand</div>
            ${gstLine}
            <hr />
            <div style="display:flex;justify-content:space-between;margin-top:8px;">
              <div>Bill: ${r.id.slice(0, 8)}</div>
              <div>Date: ${new Date(r.created_at).toLocaleString()}</div>
            </div>
            <table style="width:100%;border-collapse:collapse;margin-top:8px;">
              <thead>
                <tr>
                  <th style="text-align:left;padding:4px 8px">Item</th>
                  <th style="text-align:right;padding:4px 8px">Qty</th>
                  <th style="text-align:right;padding:4px 8px">Price</th>
                  <th style="text-align:right;padding:4px 8px">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            <div style="margin-top:8px; text-align:right; font-weight:bold;">Total: ₹${Number(total ?? 0).toFixed(2)}</div>
          </div>`;
      parts.push(html);
    }

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Printable Bills</title>
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <style>
            body{font-family:monospace;padding:8px;margin:0;}
            .bill{page-break-inside:avoid;break-inside:avoid;margin-bottom:12px;padding:12px;border-bottom:1px solid #ddd}
            table{width:100%;border-collapse:collapse;table-layout:fixed}
            th,td{padding:6px 8px;border-bottom:1px solid #eee}
            th:first-child, td:first-child{width:55%}
            th:nth-child(2), td:nth-child(2){width:10%}
            th:nth-child(3), td:nth-child(3){width:15%}
            th:nth-child(4), td:nth-child(4){width:20%}
            @media print{ .bill{page-break-inside:avoid;break-inside:avoid} }
          </style>
        </head>
        <body>
          ${parts.join("\n")}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    // let user decide to print, but also open print dialog
    setTimeout(() => {
      try {
        win.print();
      } catch (e) {
        /* ignore */
      }
    }, 300);
  }
}

function computeTotalFromOrder(order: any) {
  if (!order || !order.order_items) return null;
  try {
    return order.order_items.reduce((sum: number, it: any) => {
      const price = Number(it.custom_price ?? it.price_at_time ?? 0);
      const qty = Number(it.quantity ?? 0);
      return sum + price * qty;
    }, 0);
  } catch (e) {
    return null;
  }
}
