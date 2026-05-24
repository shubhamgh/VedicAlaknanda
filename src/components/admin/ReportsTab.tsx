import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getBills } from "@/lib/restaurant-api";

export default function ReportsTab() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [gstFilter, setGstFilter] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewBills, setPreviewBills] = useState<any[]>([]);

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

  function formatDateOnly(dateStr: string | undefined | null) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  function isoDatePart(dateStr: string | undefined | null) {
    if (!dateStr) return "";
    return new Date(dateStr).toISOString().slice(0, 10);
  }

  function openPreviewForSelected() {
    const ids = Object.keys(selected).filter((k) => selected[k]);
    const bills = ids.length ? results.filter((r) => ids.includes(r.id)) : [];
    if (bills.length === 0) return;
    const items = bills.map((r: any) => {
      const order = r.data?.order;
      return {
        id: r.id,
        row: r,
        guestName: order?.order_sessions?.guest_name ?? "",
        date: isoDatePart(r.created_at) || isoDatePart(order?.created_at),
        discountType: "none",
        discountValue: 0,
      };
    });
    setPreviewBills(items);
    setPreviewOpen(true);
  }

  function updatePreview(idx: number, changes: Partial<any>) {
    setPreviewBills((s) => {
      const copy = [...s];
      copy[idx] = { ...copy[idx], ...changes };
      return copy;
    });
  }

  async function printPreviewed() {
    if (!previewBills || previewBills.length === 0) return;
    const parts: string[] = [];
    for (const p of previewBills) {
      const r = p.row;
      const order = r.data?.order;
      const items = order?.order_items ?? [];
      const subtotal = Number(
        r.data?.summary?.subtotal ?? computeTotalFromOrder(order) ?? 0,
      );
      const cgst = r.gst_included ? subtotal * 0.025 : 0;
      const sgst = r.gst_included ? subtotal * 0.025 : 0;
      const taxes = cgst + sgst;
      const afterTaxes = subtotal + taxes;
      let discount = 0;
      if (p.discountType === "percent" && p.discountValue > 0) {
        discount = afterTaxes * (Number(p.discountValue) / 100);
      } else if (p.discountType === "flat" && p.discountValue > 0) {
        discount = Number(p.discountValue);
      }
      const finalTotal = Number((afterTaxes - discount).toFixed(2));

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
        ? `<div style="text-align:center;font-size:12px;">GSTIN: 05CKIPM9560K1ZM</div>`
        : "";

      const html = `
        <div class="bill" style="padding:20px;font-family:monospace; page-break-inside:avoid; break-inside:avoid;">
          <h2 style="text-align:center;margin:0">Hotel Vedic Alaknanda</h2>
          <div style="text-align:center;font-size:12px;">Narkota, Rudraprayag, Uttarakhand</div>
          ${gstLine}
          <hr />
          <div style="display:flex;justify-content:space-between;margin-top:8px;">
            <div>Bill: ${r.id.slice(0, 8)}</div>
            <div>Date: ${formatDateOnly(p.date || r.created_at)}</div>
          </div>
          ${p.guestName ? `<div>Guest: ${p.guestName}</div>` : ""}
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
          ${
            r.gst_included
              ? `
            <div style="display:flex;justify-content:space-between;margin-top:6px"><div>CGST (2.5%)</div><div>₹${cgst.toFixed(2)}</div></div>
            <div style="display:flex;justify-content:space-between;margin-top:6px"><div>SGST (2.5%)</div><div>₹${sgst.toFixed(2)}</div></div>
          `
              : ""
          }
          ${p.discountType !== "none" && p.discountValue > 0 ? `<div style="display:flex;justify-content:space-between;margin-top:6px"><div>Discount ${p.discountType === "percent" ? `(${p.discountValue}%)` : ""}</div><div>-₹${discount.toFixed(2)}</div></div>` : ""}
          <div style="margin-top:8px; text-align:right; font-weight:bold;">Total: ₹${Number(finalTotal ?? 0).toFixed(2)}</div>
        </div>`;

      parts.push(html);
    }

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <!doctype html>
      <html>
        <head>
          <title></title>
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <style>
            @page { margin: 0 }
            html,body{height:100%;}
            body{font-family:monospace;padding:0;margin:0;}
            .bill{page-break-inside:avoid;break-inside:avoid;margin-bottom:12px;padding:12px;border-bottom:1px solid #ddd}
            table{width:100%;border-collapse:collapse;table-layout:fixed}
            th,td{padding:6px 8px;border-bottom:1px solid #eee}
            th:first-child, td:first-child{width:55%}
            th:nth-child(2), td:nth-child(2){width:10%}
            th:nth-child(3), td:nth-child(3){width:15%}
            th:nth-child(4), td:nth-child(4){width:20%}
            @media print{ html,body{margin:0;padding:0} .bill{page-break-inside:avoid;break-inside:avoid} }
          </style>
        </head>
        <body>
          ${parts.join("\n")}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    // best-effort: clear title before printing (browser headers/footers are user-controlled)
    try {
      win.document.title = "";
      // for some browsers, replace history entry to reduce URL showing
      if (win.history && win.history.replaceState) {
        try {
          win.history.replaceState(null, "", "");
        } catch (e) {
          // ignore
        }
      }
    } catch (e) {
      // ignore
    }
    setTimeout(() => {
      try {
        win.print();
      } catch (e) {
        /* ignore */
      }
    }, 300);
    setPreviewOpen(false);
  }

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
          <button
            onClick={() => openPreviewForSelected()}
            className="px-3 py-1 bg-emerald-600 text-white rounded"
          >
            Preview & Print Selected
          </button>

          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Print Preview</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {previewBills.map((p, idx) => {
                  const r = p.row;
                  const order = r.data?.order;
                  const subtotal = Number(
                    r.data?.summary?.subtotal ??
                      computeTotalFromOrder(order) ??
                      0,
                  );
                  const cgst = r.gst_included ? subtotal * 0.025 : 0;
                  const sgst = r.gst_included ? subtotal * 0.025 : 0;
                  const afterTaxes = subtotal + cgst + sgst;
                  let discount = 0;
                  if (p.discountType === "percent" && p.discountValue > 0)
                    discount = afterTaxes * (Number(p.discountValue) / 100);
                  else if (p.discountType === "flat" && p.discountValue > 0)
                    discount = Number(p.discountValue);
                  const finalTotal = Number(afterTaxes - discount).toFixed(2);

                  return (
                    <div
                      key={p.id}
                      className="border rounded p-4 bg-white text-sm"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <div className="font-medium">
                            Bill: {r.id.slice(0, 8)}
                          </div>
                          <div className="text-xs">
                            Order: {r.order_id?.slice(0, 8)}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="date"
                            value={p.date ?? ""}
                            onChange={(e) =>
                              updatePreview(idx, { date: e.target.value })
                            }
                            className="border rounded px-2 py-1"
                          />
                          <input
                            type="text"
                            placeholder="Guest name"
                            value={p.guestName}
                            onChange={(e) =>
                              updatePreview(idx, { guestName: e.target.value })
                            }
                            className="border rounded px-2 py-1"
                          />
                        </div>
                      </div>

                      <div className="mb-2">
                        <table className="w-full text-xs">
                          <thead>
                            <tr>
                              <th className="text-left">Item</th>
                              <th className="text-right">Qty</th>
                              <th className="text-right">Price</th>
                              <th className="text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(order?.order_items ?? []).map((it: any) => (
                              <tr key={it.id}>
                                <td>{it.item_name ?? "Item"}</td>
                                <td className="text-right">{it.quantity}</td>
                                <td className="text-right">
                                  ₹
                                  {(
                                    Number(
                                      it.custom_price ?? it.price_at_time,
                                    ) || 0
                                  ).toFixed(2)}
                                </td>
                                <td className="text-right">
                                  ₹
                                  {(
                                    Number(
                                      it.custom_price ?? it.price_at_time,
                                    ) * Number(it.quantity)
                                  ).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {r.gst_included && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span>CGST (2.5%)</span>
                            <span>₹{cgst.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>SGST (2.5%)</span>
                            <span>₹{sgst.toFixed(2)}</span>
                          </div>
                        </>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        <label className="flex items-center gap-2">
                          <select
                            value={p.discountType}
                            onChange={(e) =>
                              updatePreview(idx, {
                                discountType: e.target.value,
                              })
                            }
                            className="border rounded px-2 py-1"
                          >
                            <option value="none">No discount</option>
                            <option value="percent">%</option>
                            <option value="flat">Flat</option>
                          </select>
                        </label>
                        {p.discountType !== "none" && (
                          <input
                            type="number"
                            min={0}
                            value={p.discountValue}
                            onChange={(e) =>
                              updatePreview(idx, {
                                discountValue: Number(e.target.value),
                              })
                            }
                            className="border rounded px-2 py-1 w-28"
                          />
                        )}
                      </div>

                      {p.discountType !== "none" && p.discountValue > 0 && (
                        <div className="flex justify-between mt-2 text-sm">
                          <span>
                            Discount{" "}
                            {p.discountType === "percent"
                              ? `(${p.discountValue}%)`
                              : ""}
                          </span>
                          <span>-₹{discount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between font-bold mt-3">
                        <span>Final Total</span>
                        <span>₹{finalTotal}</span>
                      </div>
                    </div>
                  );
                })}

                <div className="flex gap-2">
                  <Button onClick={printPreviewed} className="bg-emerald-600">
                    Print
                  </Button>
                  <Button
                    onClick={() => setPreviewOpen(false)}
                    variant="outline"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="overflow-auto border rounded">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">Select</th>
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
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={!!selected[r.id]}
                      onChange={() =>
                        setSelected((s) => ({ ...s, [r.id]: !s[r.id] }))
                      }
                    />
                  </td>
                  <td className="p-2">{r.id.slice(0, 8)}</td>
                  <td className="p-2">{r.order_id?.slice(0, 8)}</td>
                  <td className="p-2">{formatDateOnly(r.created_at)}</td>
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
        ? `<div style="text-align:center;font-size:12px;">GSTIN: 05CKIPM9560K1ZM</div>`
        : "";

      const guestName = order?.order_sessions?.guest_name ?? "";
      const guestPhone = order?.order_sessions?.guest_phone ?? "";

      const guest = [
        guestName ? `<div>Guest: ${guestName}</div>` : "",
        guestPhone ? `<div>Contact: ${guestPhone}</div>` : "",
      ]
        .filter(Boolean)
        .join("\n");

      let cgst = 0;
      let sgst = 0;

      if (r.gst_included) {
        const base = summary.subtotal ?? computeTotalFromOrder(order) ?? 0;
        cgst = base * 0.025;
        sgst = base * 0.025;
      }

      const html = `
      <div class="bill" style="padding:20px;font-family:monospace; page-break-inside:avoid; break-inside:avoid;">
        <h2 style="text-align:center;margin:0">Hotel Vedic Alaknanda</h2>
        <div style="text-align:center;font-size:12px;">Narkota, Rudraprayag, Uttarakhand</div>
        ${gstLine}
        <hr />
        <div style="display:flex;justify-content:space-between;margin-top:8px;">
          <div>Bill: ${r.id.slice(0, 8)}</div>
          <div>Date: ${formatDateOnly(r.created_at)}</div>
        </div>
        ${guest}
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
        ${
          r.gst_included
            ? `
          <div style="display:flex;justify-content:space-between;margin-top:6px">
            <div>CGST (2.5%)</div><div>₹${cgst.toFixed(2)}</div>
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:6px">
            <div>SGST (2.5%)</div><div>₹${sgst.toFixed(2)}</div>
          </div>
        `
            : ""
        }
        <div style="margin-top:8px; text-align:right; font-weight:bold;">
          Total: ₹${
            Number((total ?? 0).toFixed(2)) +
            Number(cgst.toFixed(2)) +
            Number(sgst.toFixed(2))
          }
        </div>
      </div>
    `;

      parts.push(html);
    }

    const win = window.open("", "_blank");
    if (!win) return;

    win.document.write(`
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <style>
          @page {
            size: auto;
            margin: 0;
          }

          body {
            font-family: monospace;
            margin: 0;
            padding: 10px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .bill {
            page-break-inside: avoid;
            break-inside: avoid;
            margin-bottom: 12px;
            padding: 12px;
            border-bottom: 1px solid #ddd;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
          }

          th, td {
            padding: 6px 8px;
            border-bottom: 1px solid #eee;
          }

          th:first-child, td:first-child { width: 55%; }
          th:nth-child(2), td:nth-child(2) { width: 10%; }
          th:nth-child(3), td:nth-child(3) { width: 15%; }
          th:nth-child(4), td:nth-child(4) { width: 20%; }

          @media print {
            body {
              margin: 0;
              padding: 10px;
            }

            .bill {
              page-break-inside: avoid;
              break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        ${parts.join("\n")}
      </body>
    </html>
  `);

    win.document.close();
    win.focus();

    setTimeout(() => {
      try {
        win.print();
      } catch (e) {}
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
