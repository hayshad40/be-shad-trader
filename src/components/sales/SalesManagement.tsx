import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OrderStatus, SaleOrder } from '../../types';
import {
  ClipboardList,
  Search,
  Plus,
  Filter,
  Printer,
  CheckCircle2,
  Truck,
  Eye,
  FileText,
  DollarSign,
  ChevronDown,
  X,
  Package,
} from 'lucide-react';

export const SalesManagement: React.FC = () => {
  const {
    orders,
    customers,
    products,
    warehouses,
    createSalesOrder,
    updateOrderStatus,
    setActiveOrderForPrint,
    formatMoney,
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  // New Order Form State
  const [newCustomerId, setNewCustomerId] = useState(customers[0]?.id || '');
  const [newWarehouseId, setNewWarehouseId] = useState(warehouses[0]?.id || '');
  const [newLines, setNewLines] = useState<Array<{ productId: string; quantity: number }>>([
    { productId: products[0]?.id || '', quantity: 5 },
  ]);
  const [newPaymentStatus, setNewPaymentStatus] = useState<'paid' | 'partial' | 'unpaid'>('unpaid');
  const [newPaidAmount, setNewPaidAmount] = useState<number>(0);
  const [newNotes, setNewNotes] = useState('');

  const filteredOrders = orders.filter((o) => {
    const matchesTab = activeTab === 'all' || o.orderStatus === activeTab;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.invoiceNumber && o.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleAddLine = () => {
    setNewLines((prev) => [...prev, { productId: products[0]?.id || '', quantity: 1 }]);
  };

  const handleRemoveLine = (idx: number) => {
    setNewLines((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleLineChange = (idx: number, field: 'productId' | 'quantity', val: any) => {
    setNewLines((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    );
  };

  const calculatedSubtotal = newLines.reduce((sum, line) => {
    const prod = products.find((p) => p.id === line.productId);
    return sum + (prod?.salePrice || 0) * (line.quantity || 1);
  }, 0);

  const handleSaveOrder = () => {
    const customer = customers.find((c) => c.id === newCustomerId);
    const items = newLines.map((line) => {
      const prod = products.find((p) => p.id === line.productId)!;
      return {
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        quantity: line.quantity,
        unit: prod.unit,
        unitPrice: prod.salePrice,
        purchaseCost: prod.purchasePrice,
        discountPercent: 0,
        taxPercent: 0,
        total: prod.salePrice * line.quantity,
      };
    });

    createSalesOrder({
      customerId: newCustomerId,
      customerName: customer?.name || 'Customer',
      customerPhone: customer?.phone || '',
      customerArea: customer?.area || '',
      deliveryAddress: customer?.address || '',
      warehouseId: newWarehouseId,
      items,
      subtotal: calculatedSubtotal,
      totalAmount: calculatedSubtotal,
      paidAmount: newPaidAmount,
      notes: newNotes,
      orderStatus: 'approved',
    });

    setIsNewOrderModalOpen(false);
    setNewLines([{ productId: products[0]?.id || '', quantity: 5 }]);
    setNewPaidAmount(0);
    setNewNotes('');
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Sales Orders & Distribution Invoices
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete fulfillment workflow: Quotation → Sales Order → Picking → Dispatch → Delivery
          </p>
        </div>

        <button
          onClick={() => setIsNewOrderModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-200"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Sales Order</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex gap-1 overflow-x-auto w-full sm:w-auto text-xs">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending', label: 'Pending Approval' },
            { id: 'approved', label: 'Approved' },
            { id: 'dispatched', label: 'In Transit' },
            { id: 'delivered', label: 'Delivered' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice #, customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Order / Invoice #</th>
                <th className="py-3 px-4">Customer & City</th>
                <th className="py-3 px-4">Date & Warehouse</th>
                <th className="py-3 px-4 text-center">Items</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-center">Order Status</th>
                <th className="py-3 px-4 text-center">Payment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-950">
                    <div>{order.invoiceNumber || order.orderNumber}</div>
                    <span className="text-[10px] text-slate-400 font-normal capitalize">
                      {order.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-800">{order.customerName}</p>
                    <p className="text-[11px] text-slate-500">{order.customerArea || 'Main Market'}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div>{order.orderDate}</div>
                    <span className="text-[10px] text-slate-400">Central Lahore WH</span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                    {order.items.reduce((s, i) => s + i.quantity, 0)} units
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-slate-900">
                    {formatMoney(order.totalAmount)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        order.orderStatus === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'dispatched'
                          ? 'bg-blue-100 text-blue-800'
                          : order.orderStatus === 'approved'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        order.paymentStatus === 'paid'
                          ? 'bg-emerald-50 text-emerald-700'
                          : order.paymentStatus === 'partial'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {order.orderStatus === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'approved')}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded"
                        >
                          Approve
                        </button>
                      )}
                      {order.orderStatus === 'approved' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'dispatched')}
                          className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold rounded"
                        >
                          Dispatch
                        </button>
                      )}
                      {order.orderStatus === 'dispatched' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded"
                        >
                          Delivered
                        </button>
                      )}
                      <button
                        onClick={() => setActiveOrderForPrint(order)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 rounded hover:bg-slate-100"
                        title="Print Professional Invoice"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Order Modal */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-base text-slate-900">Create New Sales Order</h3>
                <p className="text-xs text-slate-500">Book wholesale or retail distribution order</p>
              </div>
              <button onClick={() => setIsNewOrderModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
              {/* Customer and Warehouse */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Customer Account</label>
                  <select
                    value={newCustomerId}
                    onChange={(e) => setNewCustomerId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.company})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Dispatch Warehouse</label>
                  <select
                    value={newWarehouseId}
                    onChange={(e) => setNewWarehouseId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Order Lines */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Product Lines</span>
                  <button
                    onClick={handleAddLine}
                    className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
                  >
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
                          {p.name} - {formatMoney(p.salePrice)}
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
                      <button onClick={() => handleRemoveLine(idx)} className="p-1 text-rose-500 hover:bg-rose-50 rounded">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Paid Amount (Advance)</label>
                  <input
                    type="number"
                    value={newPaidAmount}
                    onChange={(e) => setNewPaidAmount(Number(e.target.value))}
                    placeholder="0"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Delivery Notes</label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Urgent delivery note..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Total Summary */}
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex justify-between items-center">
                <span className="font-semibold text-slate-700">Calculated Invoice Subtotal:</span>
                <span className="text-lg font-black text-indigo-700">{formatMoney(calculatedSubtotal)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setIsNewOrderModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOrder}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs"
              >
                Confirm & Create Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
