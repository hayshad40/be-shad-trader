import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Filter,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  Package,
  Users,
} from 'lucide-react';

export const ReportingCenter: React.FC = () => {
  const { products, customers, orders, purchases, expenses, formatMoney, currentTenant } = useApp();

  const [reportType, setReportType] = useState<'sales_prod' | 'debtors' | 'stock_val' | 'pnl_summary'>('sales_prod');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Aggregated data for Sales by Product
  const salesByProduct: Record<string, { name: string; sku: string; qty: number; revenue: number }> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      if (!salesByProduct[item.productId]) {
        salesByProduct[item.productId] = {
          name: item.productName,
          sku: item.sku,
          qty: 0,
          revenue: 0,
        };
      }
      salesByProduct[item.productId].qty += item.quantity;
      salesByProduct[item.productId].revenue += item.total;
    });
  });

  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    const dateStr = new Date().toISOString().split('T')[0];

    const escapeCSV = (val: any) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    if (reportType === 'sales_prod') {
      headers = ['Product Name', 'SKU', 'Units Sold', 'Gross Revenue (PKR)', 'Avg Revenue Per Unit'];
      rows = Object.values(salesByProduct).map((item) => [
        escapeCSV(item.name),
        escapeCSV(item.sku),
        escapeCSV(item.qty),
        escapeCSV(item.revenue),
        escapeCSV(item.qty > 0 ? Math.round(item.revenue / item.qty) : 0),
      ]);
    } else if (reportType === 'debtors') {
      headers = ['Customer Name', 'Shop / Company', 'Market Area', 'Phone', 'Credit Limit (PKR)', 'Outstanding Balance (PKR)', 'Credit Status'];
      rows = customers.map((c) => [
        escapeCSV(c.name),
        escapeCSV(c.company),
        escapeCSV(c.area),
        escapeCSV(c.phone),
        escapeCSV(c.creditLimit),
        escapeCSV(c.currentBalance),
        escapeCSV(c.currentBalance > c.creditLimit ? 'Over Limit' : 'Within Limit'),
      ]);
    } else if (reportType === 'stock_val') {
      headers = ['Product Name', 'SKU', 'Category', 'Available Stock Units', 'Cost Price (PKR)', 'Wholesale Price (PKR)', 'Total Asset Valuation (PKR)'];
      rows = products.map((p) => [
        escapeCSV(p.name),
        escapeCSV(p.sku),
        escapeCSV(p.category),
        escapeCSV(p.currentStock),
        escapeCSV(p.purchasePrice),
        escapeCSV(p.wholesalePrice || p.salePrice),
        escapeCSV(p.currentStock * p.purchasePrice),
      ]);
    } else {
      // P&L Summary
      const totalSales = orders.reduce((s, o) => s + o.totalAmount, 0);
      const totalPurchases = purchases.reduce((s, p) => s + p.totalAmount, 0);
      const totalExp = expenses.reduce((s, e) => s + e.amount, 0);
      const grossMargin = totalSales - totalPurchases;
      const netProfit = grossMargin - totalExp;

      headers = ['Financial Account Line', 'Amount (PKR)'];
      rows = [
        [escapeCSV('Gross Sales Revenue'), escapeCSV(totalSales)],
        [escapeCSV('Cost of Goods Restocked (COGS)'), escapeCSV(totalPurchases)],
        [escapeCSV('Gross Operating Margin'), escapeCSV(grossMargin)],
        [escapeCSV('Total Operational Expenses'), escapeCSV(totalExp)],
        [escapeCSV('Net Bottom-line Business Profit'), escapeCSV(netProfit)],
      ];
    }

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${currentTenant.name.replace(/\s+/g, '_')}_${reportType}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportNotice(`Report "${reportType}" exported successfully as CSV for ${currentTenant.name}.`);
    setTimeout(() => setExportNotice(null), 3500);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Business Intelligence & Reports Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate audited statements, inventory valuation matrices, and customer debtor ledgers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrintReport}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">{exportNotice}</span>
          </div>
          <button
            onClick={() => setExportNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 p-0.5 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Report Selector Pills */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setReportType('sales_prod')}
          className={`px-3.5 py-2 rounded-xl transition ${
            reportType === 'sales_prod' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Sales by Product Performance
        </button>
        <button
          onClick={() => setReportType('debtors')}
          className={`px-3.5 py-2 rounded-xl transition ${
            reportType === 'debtors' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Customer Debtors & Aging Khata
        </button>
        <button
          onClick={() => setReportType('stock_val')}
          className={`px-3.5 py-2 rounded-xl transition ${
            reportType === 'stock_val' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Inventory Valuation & Stock Holding
        </button>
      </div>

      {/* Report Display Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-6" id="printable-invoice">
        {/* Report Header */}
        <div className="border-b border-slate-200 pb-4 mb-4 flex justify-between items-start">
          <div>
            <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">
              {currentTenant.name} - Executive Report
            </h2>
            <p className="text-xs text-indigo-600 font-semibold mt-0.5">
              {reportType === 'sales_prod' && 'Product Sales Volume & Turnover'}
              {reportType === 'debtors' && 'Aging Analysis of Trade Receivables'}
              {reportType === 'stock_val' && 'Inventory Valuation by Depot Location'}
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p>Generated: {new Date().toLocaleDateString()}</p>
            <p className="font-semibold text-slate-700">Presented by Hayeshad Media</p>
          </div>
        </div>

        {/* 1. SALES BY PRODUCT */}
        {reportType === 'sales_prod' && (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3 text-center">Units Sold</th>
                <th className="py-2.5 px-3 text-right">Gross Invoiced Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.values(salesByProduct).map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{item.name}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{item.sku}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-700">{item.qty}</td>
                  <td className="py-2.5 px-3 text-right font-black text-indigo-950">
                    {formatMoney(item.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 2. CUSTOMER DEBTORS */}
        {reportType === 'debtors' && (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Customer / Outlet</th>
                <th className="py-2.5 px-3">Route Area</th>
                <th className="py-2.5 px-3 text-right">Credit Limit</th>
                <th className="py-2.5 px-3 text-right">Outstanding Due</th>
                <th className="py-2.5 px-3 text-center">Risk Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers
                .filter((c) => c.currentBalance > 0)
                .map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      <div>{c.name}</div>
                      <span className="text-[10px] text-slate-400">{c.company}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{c.area}, {c.city}</td>
                    <td className="py-2.5 px-3 text-right text-slate-600 font-medium">
                      {formatMoney(c.creditLimit)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-amber-800">
                      {formatMoney(c.currentBalance)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          c.currentBalance > c.creditLimit
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.currentBalance > c.creditLimit ? 'Over Limit' : 'Current'}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {/* 3. STOCK VALUATION */}
        {reportType === 'stock_val' && (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Product Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-center">Stock on Hand</th>
                <th className="py-2.5 px-3 text-right">Wholesale Rate</th>
                <th className="py-2.5 px-3 text-right">Total Holding Valuation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => {
                const totalVal = p.currentStock * (p.wholesalePrice || p.salePrice);
                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{p.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{p.category}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                      {p.currentStock} {p.unit}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-700">
                      {formatMoney(p.wholesalePrice || p.salePrice)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-indigo-950">
                      {formatMoney(totalVal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Report Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
          <p>Confidential Business Audit Report • Generated by Be Shad Trader</p>
          <p className="font-bold text-indigo-700 mt-1">Presented by Hayeshad Media</p>
        </div>
      </div>
    </div>
  );
};
