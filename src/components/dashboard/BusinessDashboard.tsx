import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Truck,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Users,
  Building,
  Printer,
  ChevronRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
  RefreshCw,
  Eye,
  ShieldCheck,
} from 'lucide-react';

export const BusinessDashboard: React.FC = () => {
  const {
    currentTenant,
    currentUser,
    hasPermission,
    orders,
    purchases,
    expenses,
    products,
    customers,
    suppliers,
    formatMoney,
    setCurrentView,
    updateOrderStatus,
    setActiveOrderForPrint,
    setIsAIModalOpen,
  } = useApp();

  const [dateFilter, setDateFilter] = useState<'today' | 'this_week' | 'this_month' | 'this_year'>('this_month');

  // Strict check: Order Taker should not see this screen at all or will be redirected
  if (currentUser.role === 'ORDER_TAKER') {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Field Order Taker Workspace</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          As a designated Field Order Taker, your security policy routes you directly to the field customer booking application. Financial indicators and company profit ledgers are strictly confidential.
        </p>
        <button
          onClick={() => setCurrentView('ordertaker')}
          className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition"
        >
          Open Field Order Taker App
        </button>
      </div>
    );
  }

  // Calculate actual real KPIs from data
  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalCollected = orders.reduce((sum, o) => sum + o.paidAmount, 0);
  const totalPurchases = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalReceivables = customers.reduce((sum, c) => sum + c.currentBalance, 0);
  const totalPayables = suppliers.reduce((sum, s) => sum + s.currentBalance, 0);

  // Approximate gross profit: Sales Revenue - COGS (calculated item costs)
  const totalCOGS = orders.reduce((sum, o) => {
    return (
      sum +
      o.items.reduce((iSum, item) => iSum + (item.purchaseCost || item.unitPrice * 0.85) * item.quantity, 0)
    );
  }, 0);

  const estimatedNetProfit = Math.max(0, totalSales - totalCOGS - totalExpenses);

  const lowStockItems = products.filter((p) => p.currentStock <= p.minStock);
  const totalInventoryUnits = products.reduce((sum, p) => sum + p.currentStock, 0);
  const totalStockValuation = products.reduce((sum, p) => sum + p.currentStock * p.purchasePrice, 0);

  // Category counts
  const categorySplit: Record<string, number> = {};
  products.forEach((p) => {
    categorySplit[p.category] = (categorySplit[p.category] || 0) + p.currentStock;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {currentTenant.name}
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {currentTenant.businessType}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Welcome back, <span className="font-semibold text-slate-700">{currentUser.name}</span> ({currentUser.role}). Overview of live distribution & accounting metrics.
          </p>
        </div>

        {/* Date Filters & AI Assistant trigger */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(['today', 'this_week', 'this_month', 'this_year'] as const).map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => setDateFilter(filterKey)}
                className={`px-3 py-1.5 rounded-lg transition capitalize ${
                  dateFilter === filterKey ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {filterKey.replace('_', ' ')}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs hover:from-indigo-700 hover:to-indigo-800 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">Ask AI</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Sales */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Sales</span>
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900">{formatMoney(totalSales)}</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> {orders.length} Orders
          </span>
        </div>

        {/* Total Collected */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Collected Cash</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900">{formatMoney(totalCollected)}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">
            {Math.round((totalCollected / (totalSales || 1)) * 100)}% Settled
          </span>
        </div>

        {/* Net Profit (Strict RBAC protection) */}
        {hasPermission('canViewFinancials') ? (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Est. Net Profit</span>
              <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-lg font-black text-purple-700">{formatMoney(estimatedNetProfit)}</p>
            <span className="text-[10px] text-purple-600 font-medium">After COGS & Expenses</span>
          </div>
        ) : (
          <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 space-y-1 opacity-70">
            <span className="text-xs text-slate-400">Net Profit</span>
            <p className="text-sm font-bold text-slate-400">Locked by RBAC</p>
            <span className="text-[10px] text-slate-400">Restricted Profile</span>
          </div>
        )}

        {/* Outstanding Receivables */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Receivables</span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg font-black text-amber-600">{formatMoney(totalReceivables)}</p>
          <span className="text-[10px] text-slate-500">Customer Debtors</span>
        </div>

        {/* Outstanding Payables */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Payables</span>
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg font-black text-rose-600">{formatMoney(totalPayables)}</p>
          <span className="text-[10px] text-slate-500">Supplier Dues</span>
        </div>

        {/* Low Stock Alerts */}
        <div
          onClick={() => setCurrentView('inventory')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1 cursor-pointer hover:border-rose-300 transition"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Stock Alerts</span>
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg font-black text-rose-700">{lowStockItems.length} Items</p>
          <span className="text-[10px] text-rose-600 font-semibold hover:underline">
            Below safety stock →
          </span>
        </div>
      </div>

      {/* Visual Charts & Split Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Sales & Collection Trend */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Weekly Distribution & Delivery Flow</h3>
              <p className="text-xs text-slate-500">Volume across wholesale routes (Lahore, Karachi, Islamabad)</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <span className="text-slate-600">Sales Invoices</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Collections</span>
              </div>
            </div>
          </div>

          {/* Interactive Chart Visual */}
          <div className="h-64 flex items-end gap-3 pt-6 px-2">
            {[
              { day: 'Mon', sales: 120, coll: 95 },
              { day: 'Tue', sales: 180, coll: 140 },
              { day: 'Wed', sales: 240, coll: 210 },
              { day: 'Thu', sales: 310, coll: 260 },
              { day: 'Fri', sales: 290, coll: 230 },
              { day: 'Sat', sales: 380, coll: 340 },
              { day: 'Sun', sales: 150, coll: 110 },
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                <div className="w-full flex items-end justify-center gap-1 h-48">
                  {/* Sales bar */}
                  <div
                    style={{ height: `${(d.sales / 380) * 100}%` }}
                    className="w-1/2 bg-gradient-to-t from-indigo-700 to-indigo-500 rounded-t-md group-hover:brightness-110 transition"
                  />
                  {/* Collection bar */}
                  <div
                    style={{ height: `${(d.coll / 380) * 100}%` }}
                    className="w-1/2 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md group-hover:brightness-110 transition"
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-600">{d.day}</span>

                {/* Tooltip on hover */}
                <div className="absolute -top-10 bg-slate-900 text-white text-[10px] py-1 px-2 rounded pointer-events-none opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20">
                  Sales: Rs. {d.sales}K | Coll: Rs. {d.coll}K
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Peak delivery volume: Saturday Wholesale Restocking</span>
            <span className="font-semibold text-indigo-600">Average Daily Turnover: Rs. 238,000</span>
          </div>
        </div>

        {/* Top Product Categories & Stock Value */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Inventory Distribution by Category</h3>
            <p className="text-xs text-slate-500 mb-4">Stock on hand across all 3 central warehouses</p>

            <div className="space-y-3">
              {Object.entries(categorySplit)
                .slice(0, 5)
                .map(([cat, qty], idx) => {
                  const percentage = Math.round((qty / (totalInventoryUnits || 1)) * 100);
                  const colors = ['bg-indigo-600', 'bg-emerald-600', 'bg-amber-500', 'bg-blue-600', 'bg-rose-500'];
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-700">{cat}</span>
                        <span className="font-bold text-slate-900">
                          {qty} units ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${percentage}%` }}
                          className={`h-full ${colors[idx % colors.length]} rounded-full`}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {hasPermission('canViewStockValuation') && (
            <div className="mt-5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Total Inventory Asset Value
              </span>
              <p className="text-xl font-black text-indigo-900 mt-0.5">{formatMoney(totalStockValuation)}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{products.length} active SKUs in database</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Pipeline Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">Recent Distribution Orders</h3>
            <p className="text-xs text-slate-500">Live order pipeline status and customer invoice tracking</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentView('orders')}
              className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition"
            >
              View All Orders ({orders.length})
            </button>
            <button
              onClick={() => setCurrentView('pos')}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition"
            >
              + Quick POS Sale
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Order / Invoice #</th>
                <th className="py-3 px-4">Customer & Route</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Payment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 6).map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-900">
                    {order.invoiceNumber || order.orderNumber}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-800">{order.customerName}</p>
                    <p className="text-[11px] text-slate-500">{order.customerArea || 'Lahore Territory'}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{order.orderDate}</td>
                  <td className="py-3 px-4 text-right font-black text-slate-900">
                    {formatMoney(order.totalAmount)}
                  </td>
                  <td className="py-3 px-4 text-center">
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
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        order.paymentStatus === 'paid'
                          ? 'text-emerald-700 bg-emerald-50'
                          : order.paymentStatus === 'partial'
                          ? 'text-amber-700 bg-amber-50'
                          : 'text-rose-700 bg-rose-50'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
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
                      <button
                        onClick={() => setActiveOrderForPrint(order)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 rounded hover:bg-slate-100"
                        title="Print Invoice"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
