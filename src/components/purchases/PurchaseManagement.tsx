import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PurchaseRecord } from '../../types';
import {
  Layers,
  Search,
  Plus,
  Building,
  CheckCircle2,
  Calendar,
  X,
  FileCheck,
  PackageCheck,
  Truck,
} from 'lucide-react';

export const PurchaseManagement: React.FC = () => {
  const {
    purchases,
    suppliers,
    warehouses,
    products,
    createPurchase,
    formatMoney,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isNewPurchaseOpen, setIsNewPurchaseOpen] = useState(false);

  // New PO state
  const [newSupplierId, setNewSupplierId] = useState(suppliers[0]?.id || '');
  const [newWarehouseId, setNewWarehouseId] = useState(warehouses[0]?.id || '');
  const [newLines, setNewLines] = useState<Array<{ productId: string; quantity: number }>>([
    { productId: products[0]?.id || '', quantity: 20 },
  ]);
  const [newPaidAmount, setNewPaidAmount] = useState<number>(0);
  const [newNotes, setNewNotes] = useState('Bulk restocking order received in good condition.');

  const filteredPurchases = purchases.filter(
    (p) =>
      p.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculatedSubtotal = newLines.reduce((sum, line) => {
    const prod = products.find((p) => p.id === line.productId);
    return sum + (prod?.purchasePrice || 0) * (line.quantity || 1);
  }, 0);

  const handleAddLine = () => {
    setNewLines((prev) => [...prev, { productId: products[0]?.id || '', quantity: 10 }]);
  };

  const handleRemoveLine = (idx: number) => {
    setNewLines((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleLineChange = (idx: number, field: 'productId' | 'quantity', val: any) => {
    setNewLines((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    );
  };

  const handleSavePurchase = () => {
    const supplier = suppliers.find((s) => s.id === newSupplierId);
    const items = newLines.map((line) => {
      const prod = products.find((p) => p.id === line.productId)!;
      return {
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        quantity: line.quantity,
        unit: prod.unit,
        unitPrice: prod.purchasePrice,
        discountPercent: 0,
        taxPercent: 0,
        total: prod.purchasePrice * line.quantity,
      };
    });

    createPurchase({
      supplierId: newSupplierId,
      supplierName: supplier?.name || 'Supplier',
      warehouseId: newWarehouseId,
      items,
      subtotal: calculatedSubtotal,
      totalAmount: calculatedSubtotal,
      paidAmount: newPaidAmount,
      notes: newNotes,
      status: 'received',
    });

    setIsNewPurchaseOpen(false);
    setNewLines([{ productId: products[0]?.id || '', quantity: 20 }]);
    setNewPaidAmount(0);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Purchases & Supplier Inward Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Record supplier orders, stock inward receipts, and trade creditor payables.
          </p>
        </div>

        <button
          onClick={() => setIsNewPurchaseOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-200"
        >
          <Plus className="w-4 h-4" />
          <span>+ Record Goods Inward</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
          <span>Active Inward Records: {purchases.length}</span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search PO #, supplier name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">PO Reference #</th>
                <th className="py-3 px-4">Supplier Name</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-center">Items Received</th>
                <th className="py-3 px-4 text-right">Invoice Total</th>
                <th className="py-3 px-4 text-right">Amount Paid</th>
                <th className="py-3 px-4 text-center">Inward Status</th>
                <th className="py-3 px-4 text-center">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPurchases.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-900">{po.poNumber}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{po.supplierName}</td>
                  <td className="py-3.5 px-4 text-slate-600">{po.orderDate}</td>
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-700">
                    {po.items.reduce((s, i) => s + i.quantity, 0)} units
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-slate-900">
                    {formatMoney(po.totalAmount)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-700">
                    {formatMoney(po.paidAmount)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {po.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        po.paymentStatus === 'paid'
                          ? 'bg-emerald-50 text-emerald-700'
                          : po.paymentStatus === 'partial'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {po.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Purchase Modal */}
      {isNewPurchaseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">Record Inward Goods Receipt</h3>
              <button onClick={() => setIsNewPurchaseOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Supplier</label>
                  <select
                    value={newSupplierId}
                    onChange={(e) => setNewSupplierId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Destination Warehouse</label>
                  <select
                    value={newWarehouseId}
                    onChange={(e) => setNewWarehouseId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Lines */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Items Received</span>
                  <button onClick={handleAddLine} className="text-indigo-600 font-bold hover:underline flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                {newLines.map((line, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <select
                      value={line.productId}
                      onChange={(e) => handleLineChange(idx, 'productId', e.target.value)}
                      className="flex-1 p-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} - Cost: {formatMoney(p.purchasePrice)}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1 w-24">
                      <span className="text-slate-400">Qty:</span>
                      <input
                        type="number"
                        min="1"
                        value={line.quantity}
                        onChange={(e) => handleLineChange(idx, 'quantity', Number(e.target.value))}
                        className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-center"
                      />
                    </div>
                    {newLines.length > 1 && (
                      <button onClick={() => handleRemoveLine(idx)} className="p-1 text-rose-500">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Paid to Supplier (PKR)</label>
                  <input
                    type="number"
                    value={newPaidAmount}
                    onChange={(e) => setNewPaidAmount(Number(e.target.value))}
                    placeholder="0"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Inward Notes</label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex justify-between items-center">
                <span className="font-semibold text-slate-700">Total Inward Value:</span>
                <span className="text-lg font-black text-indigo-700">{formatMoney(calculatedSubtotal)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setIsNewPurchaseOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePurchase}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Save & Update Warehouse Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
