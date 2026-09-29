import React, { useMemo, useState } from 'react';
import { SaleOrder } from '../../types';
import { useApp } from '../../context/AppContext';
import { Printer, X, FileText, CheckCircle2, ChevronDown, Layers, MapPin, Phone } from 'lucide-react';

interface PrintInvoiceModalProps {
  order?: SaleOrder | null;
  orders?: SaleOrder[] | null;
  onClose: () => void;
}

export const PrintInvoiceModal: React.FC<PrintInvoiceModalProps> = ({ order, orders, onClose }) => {
  const { currentTenant, formatMoney } = useApp();
  const [activeTab, setActiveTab] = useState<string>('all');

  const orderList: SaleOrder[] = useMemo(() => {
    if (orders && orders.length > 0) return orders;
    if (order) return [order];
    return [];
  }, [order, orders]);

  if (orderList.length === 0) return null;

  const isBulk = orderList.length > 1;
  const totalBatchAmount = orderList.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalItemsCount = orderList.reduce(
    (sum, o) => sum + (o.items ? o.items.reduce((iSum, item) => iSum + (item.quantity || 0), 0) : 0),
    0
  );

  const handlePrint = () => {
    window.print();
  };

  const displayedOrders = activeTab === 'all'
    ? orderList
    : orderList.filter((o) => o.id === activeTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Toolbar (hidden during print) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800 print:hidden gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-600 rounded-xl text-white shadow-xs">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">
                  {isBulk
                    ? `Bulk Field Invoices (${orderList.length} Orders Selected)`
                    : `Sales Invoice #${orderList[0].invoiceNumber || orderList[0].orderNumber}`}
                </h3>
                {isBulk && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    BATCH PRINT
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {isBulk
                  ? `Batch manifest & individual customer invoices • Total: ${formatMoney(totalBatchAmount)} (${totalItemsCount} units)`
                  : 'Ready for high-resolution printing or PDF export'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{isBulk ? `Print All ${orderList.length} Invoices` : 'Print Invoice'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation for Bulk Mode (hidden during print) */}
        {isBulk && (
          <div className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-100 border-b border-slate-200 overflow-x-auto text-xs print:hidden">
            <span className="text-slate-500 font-medium shrink-0 mr-1">View Filter:</span>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition shrink-0 ${
                activeTab === 'all'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              All Invoices & Manifest ({orderList.length})
            </button>
            {orderList.map((ord, idx) => (
              <button
                key={ord.id}
                onClick={() => setActiveTab(ord.id)}
                className={`px-2.5 py-1 rounded-lg font-medium transition shrink-0 truncate max-w-[170px] ${
                  activeTab === ord.id
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
                title={`${ord.orderNumber} - ${ord.customerName}`}
              >
                #{idx + 1} {ord.customerName}
              </button>
            ))}
          </div>
        )}

        {/* Printable Container */}
        <div className="p-6 sm:p-8 overflow-y-auto bg-white text-slate-900 space-y-8" id="printable-invoice">
          {/* Print CSS helper for page breaks */}
          <style dangerouslySetInnerHTML={{ __html: `
            @media print {
              body {
                background: white !important;
                color: black !important;
              }
              .page-break {
                page-break-after: always !important;
                break-after: page !important;
              }
              .print-container {
                padding: 0 !important;
                margin: 0 !important;
              }
            }
          `}} />

          {/* Batch Summary Manifest (Only printed/displayed if bulk and viewing all) */}
          {isBulk && activeTab === 'all' && (
            <div className="page-break pb-8 border-b-2 border-dashed border-slate-300">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-xl font-black text-amber-700">BE SHAD TRADER</span>
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">{currentTenant.name}</p>
                    <p className="text-xs text-slate-500">{currentTenant.address}, {currentTenant.city}</p>
                    <p className="text-xs text-slate-500">Phone: {currentTenant.phone} | Email: {currentTenant.email}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 font-bold text-xs uppercase rounded-md tracking-wider mb-1.5 border border-amber-300">
                      FIELD DISPATCH BATCH MANIFEST
                    </span>
                    <p className="text-xs text-slate-500">
                      Generated: <span className="font-semibold text-slate-800">{new Date().toLocaleString()}</span>
                    </p>
                    <p className="text-xs text-slate-500">
                      Total Bookings: <span className="font-bold text-slate-800">{orderList.length} Retail Outlets</span>
                    </p>
                  </div>
                </div>

                {/* Batch Stats KPI row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                    <span className="text-[11px] text-slate-500 block font-medium">Selected Orders</span>
                    <span className="text-lg font-black text-slate-900">{orderList.length}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                    <span className="text-[11px] text-slate-500 block font-medium">Total Item Units</span>
                    <span className="text-lg font-black text-indigo-700">{totalItemsCount} Units</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                    <span className="text-[11px] text-slate-500 block font-medium">Batch Sales Volume</span>
                    <span className="text-lg font-black text-amber-700 font-mono">{formatMoney(totalBatchAmount)}</span>
                  </div>
                </div>

                {/* Manifest Order Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Order Number</th>
                        <th className="py-2.5 px-3">Customer / Outlet</th>
                        <th className="py-2.5 px-3">Area / Route</th>
                        <th className="py-2.5 px-3 text-center">Items</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                        <th className="py-2.5 px-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orderList.map((ord, idx) => (
                        <tr key={ord.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-indigo-700">{ord.orderNumber}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{ord.customerName}</td>
                          <td className="py-2.5 px-3 text-slate-600">{ord.customerArea || 'General Route'}</td>
                          <td className="py-2.5 px-3 text-center text-slate-700">{ord.items.length} items</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                              {ord.orderStatus}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                            {formatMoney(ord.totalAmount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-100/80 font-bold text-slate-900 border-t border-slate-200">
                      <tr>
                        <td colSpan={4} className="py-2.5 px-3 text-left">
                          BATCH GRAND TOTAL ({orderList.length} Orders)
                        </td>
                        <td className="py-2.5 px-3 text-center text-indigo-800">{totalItemsCount} units</td>
                        <td></td>
                        <td className="py-2.5 px-3 text-right text-amber-800 font-mono text-sm">
                          {formatMoney(totalBatchAmount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Sign-off signatures */}
                <div className="grid grid-cols-2 gap-8 pt-4">
                  <div className="border-t border-slate-300 pt-2 text-center text-xs text-slate-500">
                    <p className="font-semibold text-slate-700">Field Representative Signature & Date</p>
                  </div>
                  <div className="border-t border-slate-300 pt-2 text-center text-xs text-slate-500">
                    <p className="font-semibold text-slate-700">Warehouse Dispatcher Clearance</p>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <div className="inline-flex items-center gap-2 text-[11px] text-amber-800 font-semibold bg-amber-50 py-1 px-3 rounded-full border border-amber-200">
                    <span>Presented by Hayeshad Media</span>
                    <span>•</span>
                    <span>Be Shad Trader Distribution ERP</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Individual Detailed Invoices */}
          {displayedOrders.map((ord, orderIdx) => {
            const isLast = orderIdx === displayedOrders.length - 1;

            return (
              <div
                key={ord.id}
                id={`invoice-${ord.id}`}
                className={`space-y-6 ${!isLast ? 'page-break pb-8 border-b-2 border-dashed border-slate-200' : ''}`}
              >
                {/* Header */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl font-black tracking-tight text-indigo-700">BE SHAD TRADER</span>
                    </div>
                    <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{currentTenant.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{currentTenant.address}, {currentTenant.city}</p>
                    <p className="text-xs text-slate-500">Phone: {currentTenant.phone} | Email: {currentTenant.email}</p>
                    {currentTenant.taxNumber && (
                      <p className="text-xs text-slate-500">Trade Reg No: <span className="font-mono">{currentTenant.taxNumber}</span></p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs uppercase rounded-md tracking-wider mb-2 border border-indigo-100">
                      SALES INVOICE
                    </span>
                    <p className="text-sm font-bold text-slate-800">Invoice: #{ord.invoiceNumber || ord.orderNumber}</p>
                    <p className="text-xs text-slate-500">Date: {ord.orderDate}</p>
                    {ord.dueDate && <p className="text-xs text-slate-500">Due Date: {ord.dueDate}</p>}
                    <div className="mt-2">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                          ord.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.paymentStatus === 'partial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        Payment: {ord.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bill To */}
                <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Billed To Customer</p>
                    <h4 className="font-bold text-base text-slate-900">{ord.customerName}</h4>
                    {ord.customerPhone && <p className="text-xs text-slate-600 mt-0.5">Phone: {ord.customerPhone}</p>}
                    {ord.customerArea && <p className="text-xs text-slate-600">Area: {ord.customerArea}</p>}
                    {ord.deliveryAddress && <p className="text-xs text-slate-600">Address: {ord.deliveryAddress}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Dispatch & Terms</p>
                    <p className="text-xs text-slate-700"><span className="text-slate-400">Status:</span> <span className="capitalize font-semibold">{ord.orderStatus}</span></p>
                    <p className="text-xs text-slate-700"><span className="text-slate-400">Payment Mode:</span> <span className="capitalize font-semibold">{ord.paymentMethod || 'Cash'}</span></p>
                    <p className="text-xs text-slate-700"><span className="text-slate-400">Warehouse:</span> Central Dispatch Hub</p>
                  </div>
                </div>

                {/* Line Items Table */}
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-300 text-slate-600 font-bold uppercase tracking-wider">
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3">SKU</th>
                      <th className="py-2.5 px-3 text-center">Unit</th>
                      <th className="py-2.5 px-3 text-right">Price</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ord.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{item.productName}</td>
                        <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{item.sku}</td>
                        <td className="py-2.5 px-3 text-center text-slate-600">{item.unit}</td>
                        <td className="py-2.5 px-3 text-right text-slate-700">{formatMoney(item.unitPrice)}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-900">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-indigo-950">{formatMoney(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals Calculation */}
                <div className="flex justify-between items-start pt-4 border-t border-slate-200">
                  <div className="max-w-xs text-xs text-slate-500">
                    {ord.notes && (
                      <div className="mb-3">
                        <span className="font-semibold text-slate-700">Notes / Instructions:</span>
                        <p className="mt-0.5 text-slate-600 italic bg-amber-50/80 border border-amber-200 p-2 rounded-md">{ord.notes}</p>
                      </div>
                    )}
                    {ord.proofSignature && (
                      <div className="mt-4 p-2 border border-slate-200 rounded-md bg-slate-50">
                        <span className="font-semibold text-slate-700 block">Received By Customer Signature:</span>
                        <span className="font-serif italic text-sm text-indigo-900 mt-1 block">{ord.proofSignature}</span>
                      </div>
                    )}
                  </div>

                  <div className="w-64 space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 text-slate-600">
                      <span>Subtotal:</span>
                      <span className="font-semibold">{formatMoney(ord.subtotal)}</span>
                    </div>
                    {ord.discountAmount > 0 && (
                      <div className="flex justify-between py-1 text-emerald-600">
                        <span>Special Discount:</span>
                        <span className="font-semibold">- {formatMoney(ord.discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-t-2 border-slate-300 text-sm font-bold text-slate-900">
                      <span>Invoice Total:</span>
                      <span className="text-indigo-700 font-extrabold">{formatMoney(ord.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between py-1 text-slate-700 border-t border-slate-100">
                      <span>Amount Paid:</span>
                      <span className="font-semibold text-emerald-700">{formatMoney(ord.paidAmount)}</span>
                    </div>
                    <div className="flex justify-between py-1 text-slate-800 font-bold bg-slate-100 px-2 py-1 rounded">
                      <span>Balance Due:</span>
                      <span className={ord.balanceAmount > 0 ? 'text-rose-600 font-black' : 'text-emerald-700 font-bold'}>
                        {formatMoney(ord.balanceAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer & Presented by attribution */}
                <div className="mt-8 pt-4 border-t border-slate-200 text-center">
                  <p className="text-xs text-slate-600 font-medium">{currentTenant.invoiceFooterText}</p>
                  <div className="mt-3 flex items-center justify-center gap-2 text-xs text-indigo-700 font-semibold bg-indigo-50/70 py-1.5 px-3 rounded-full mx-auto w-fit border border-indigo-100">
                    <span>Presented by Hayeshad Media</span>
                    <span>•</span>
                    <span>Be Shad Trader Distribution ERP</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
