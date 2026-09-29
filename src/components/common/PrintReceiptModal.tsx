import React from 'react';
import { SaleOrder } from '../../types';
import { useApp } from '../../context/AppContext';
import { Printer, X } from 'lucide-react';

interface PrintReceiptModalProps {
  order: SaleOrder | null;
  onClose: () => void;
}

export const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({ order, onClose }) => {
  const { currentTenant, formatMoney } = useApp();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold">Thermal POS Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 80mm Thermal Receipt Preview */}
        <div className="p-6 bg-white font-mono text-xs text-slate-900 overflow-y-auto max-h-[80vh]" id="printable-receipt">
          {/* Header */}
          <div className="text-center pb-3 border-b border-dashed border-slate-300">
            <h2 className="text-base font-black tracking-tight uppercase">BE SHAD TRADER</h2>
            <p className="text-[11px] font-bold text-slate-700">{currentTenant.name}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{currentTenant.address}</p>
            <p className="text-[10px] text-slate-500">Tel: {currentTenant.phone}</p>
            {currentTenant.taxNumber && <p className="text-[10px] text-slate-500">NTN: {currentTenant.taxNumber}</p>}
          </div>

          {/* Receipt Info */}
          <div className="py-2 border-b border-dashed border-slate-300 space-y-0.5 text-[11px]">
            <div className="flex justify-between">
              <span>Receipt:</span>
              <span className="font-bold">{order.invoiceNumber || order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{order.orderDate}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="truncate max-w-[140px] font-semibold">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Cashier:</span>
              <span>Counter Point #01</span>
            </div>
          </div>

          {/* Items */}
          <div className="py-2 border-b border-dashed border-slate-300">
            <div className="grid grid-cols-12 font-bold pb-1 text-[11px] border-b border-slate-200">
              <span className="col-span-6">Item</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-4 text-right">Price</span>
            </div>
            <div className="divide-y divide-slate-100 py-1 space-y-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 text-[10px] pt-1">
                  <div className="col-span-6 truncate pr-1">
                    <span className="font-medium text-slate-800">{item.productName}</span>
                  </div>
                  <div className="col-span-2 text-center font-bold">{item.quantity}</div>
                  <div className="col-span-4 text-right font-bold">{formatMoney(item.total)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="py-2 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatMoney(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount:</span>
                <span>-{formatMoney(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black pt-1 border-t border-slate-300">
              <span>TOTAL:</span>
              <span>{formatMoney(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between font-semibold pt-0.5">
              <span>Paid ({order.paymentMethod}):</span>
              <span>{formatMoney(order.paidAmount)}</span>
            </div>
            {order.balanceAmount > 0 && (
              <div className="flex justify-between text-rose-600 font-bold">
                <span>Due Balance:</span>
                <span>{formatMoney(order.balanceAmount)}</span>
              </div>
            )}
          </div>

          {/* Footer note & attribution */}
          <div className="text-center pt-3 space-y-1 text-[10px] text-slate-500">
            <p className="font-semibold text-slate-700">Thank you for visiting us!</p>
            <p>Goods once sold can be exchanged within 3 days with receipt.</p>
            <div className="mt-3 pt-2 border-t border-dashed border-slate-300 text-slate-600 font-bold">
              Presented by Hayeshad Media
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
