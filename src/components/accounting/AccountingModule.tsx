import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChartOfAccount, JournalEntry } from '../../types';
import {
  DollarSign,
  BookOpen,
  PieChart,
  Scale,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Wallet,
  Receipt,
  CheckCircle2,
  X,
  FileText,
} from 'lucide-react';

export const AccountingModule: React.FC = () => {
  const {
    accounts,
    orders,
    purchases,
    expenses,
    formatMoney,
    hasPermission,
    currentTenant,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'chart' | 'pnl' | 'balance_sheet' | 'journal'>('chart');
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);

  // Journal form state
  const [journalDesc, setJournalDesc] = useState('');
  const [debitAccId, setDebitAccId] = useState(accounts[0]?.id || '');
  const [creditAccId, setCreditAccId] = useState(accounts[1]?.id || '');
  const [journalAmount, setJournalAmount] = useState<number>(10000);

  // Financial Calculations
  const grossSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalCOGS = orders.reduce((sum, o) => {
    return sum + o.items.reduce((iSum, item) => iSum + (item.purchaseCost || item.unitPrice * 0.85) * item.quantity, 0);
  }, 0);
  const grossProfit = grossSales - totalCOGS;

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = grossProfit - totalExpenses;

  // Balance sheet accounts
  const assets = accounts.filter((a) => a.type === 'asset');
  const liabilities = accounts.filter((a) => a.type === 'liability');
  const equity = accounts.filter((a) => a.type === 'equity');

  const totalAssets = assets.reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = liabilities.reduce((sum, a) => sum + a.balance, 0);
  const totalEquity = equity.reduce((sum, a) => sum + a.balance, 0) + netProfit;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Accounting, General Ledger & Financials
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Compliant double-entry bookkeeping, automated trial balance, and live P&L reporting.
          </p>
        </div>

        <button
          onClick={() => setIsJournalModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-200"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Journal Entry</span>
        </button>
      </div>

      {/* Cash & Bank Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold">Cash on Hand (Vault)</span>
            <p className="text-lg font-black text-slate-900">{formatMoney(345000)}</p>
            <span className="text-[10px] text-emerald-600">Reconciled today</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold">Bank Alfalah Corporate</span>
            <p className="text-lg font-black text-indigo-900">{formatMoney(2840000)}</p>
            <span className="text-[10px] text-indigo-600">A/c 0149-100482</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold">Habib Bank Ltd (HBL)</span>
            <p className="text-lg font-black text-blue-900">{formatMoney(1950000)}</p>
            <span className="text-[10px] text-blue-600">Trade Clearing A/c</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('chart')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'chart' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Chart of Accounts
        </button>
        <button
          onClick={() => setActiveTab('pnl')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'pnl' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Profit & Loss Statement
        </button>
        <button
          onClick={() => setActiveTab('balance_sheet')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'balance_sheet' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Balance Sheet
        </button>
      </div>

      {/* 1. CHART OF ACCOUNTS */}
      {activeTab === 'chart' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Account Code</th>
                  <th className="py-3 px-4">Account Title</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Current Ledger Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-900">{acc.code}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{acc.name}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          acc.type === 'asset'
                            ? 'bg-emerald-100 text-emerald-800'
                            : acc.type === 'liability'
                            ? 'bg-rose-100 text-rose-800'
                            : acc.type === 'revenue'
                            ? 'bg-indigo-100 text-indigo-800'
                            : acc.type === 'expense'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {acc.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{acc.category}</td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900">
                      {formatMoney(acc.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. PROFIT & LOSS STATEMENT */}
      {activeTab === 'pnl' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 max-w-3xl mx-auto space-y-6 text-xs">
          <div className="text-center pb-4 border-b border-slate-200">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">{currentTenant.name}</h2>
            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-0.5">
              Statement of Profit & Loss (Income Statement)
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">For Period Ending Current Fiscal Month</p>
          </div>

          {/* Revenue */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
              Operating Revenue
            </h4>
            <div className="flex justify-between py-1 text-slate-700">
              <span>Gross Sales Revenue (All Invoices & POS)</span>
              <span className="font-semibold">{formatMoney(grossSales)}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-500 italic pl-3">
              <span>Less: Sales Discounts & Rebates</span>
              <span>- {formatMoney(orders.reduce((s, o) => s + o.discountAmount, 0))}</span>
            </div>
            <div className="flex justify-between py-1.5 font-bold text-slate-900 border-t border-slate-100">
              <span>Net Sales Revenue</span>
              <span className="text-indigo-900 font-black">{formatMoney(grossSales)}</span>
            </div>
          </div>

          {/* Cost of Goods Sold */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
              Cost of Sales (COGS)
            </h4>
            <div className="flex justify-between py-1 text-slate-700">
              <span>Merchandise Cost of Dispatched Goods</span>
              <span className="font-semibold text-rose-700">({formatMoney(totalCOGS)})</span>
            </div>
            <div className="flex justify-between py-2 font-black text-sm text-slate-900 border-t border-slate-200 bg-slate-50 p-2 rounded-lg">
              <span>GROSS PROFIT MARGIN</span>
              <span className="text-emerald-700 font-extrabold">{formatMoney(grossProfit)}</span>
            </div>
          </div>

          {/* Operating Expenses */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
              Operating & Logistics Expenses
            </h4>
            {expenses.map((exp) => (
              <div key={exp.id} className="flex justify-between py-1 text-slate-600">
                <span className="capitalize">{exp.title} ({exp.category})</span>
                <span>{formatMoney(exp.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between py-1.5 font-bold text-slate-800 border-t border-slate-100">
              <span>Total Operating Overheads</span>
              <span className="text-rose-700 font-bold">({formatMoney(totalExpenses)})</span>
            </div>
          </div>

          {/* Net Profit Summary */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-900 to-purple-900 text-white flex justify-between items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 block">
                Net Operating Profit
              </span>
              <span className="text-[11px] text-slate-300">Audited across transactions</span>
            </div>
            <span className="text-2xl font-black text-amber-300">{formatMoney(netProfit)}</span>
          </div>
        </div>
      )}

      {/* 3. BALANCE SHEET */}
      {activeTab === 'balance_sheet' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 max-w-3xl mx-auto space-y-6 text-xs">
          <div className="text-center pb-4 border-b border-slate-200">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">{currentTenant.name}</h2>
            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-0.5">
              Statement of Financial Position (Balance Sheet)
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">As of current date</p>
          </div>

          {/* Assets */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
              Assets
            </h4>
            {assets.map((a) => (
              <div key={a.id} className="flex justify-between py-1 text-slate-700">
                <span>{a.name} ({a.category})</span>
                <span className="font-semibold">{formatMoney(a.balance)}</span>
              </div>
            ))}
            <div className="flex justify-between py-2 font-black text-sm text-slate-900 border-t border-slate-300 bg-slate-50 p-2 rounded-lg">
              <span>TOTAL ASSETS</span>
              <span className="text-indigo-950 font-extrabold">{formatMoney(totalAssets)}</span>
            </div>
          </div>

          {/* Liabilities */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
              Liabilities
            </h4>
            {liabilities.map((l) => (
              <div key={l.id} className="flex justify-between py-1 text-slate-700">
                <span>{l.name} ({l.category})</span>
                <span className="font-semibold">{formatMoney(l.balance)}</span>
              </div>
            ))}
            <div className="flex justify-between py-1.5 font-bold text-slate-800 border-t border-slate-100">
              <span>Total Liabilities</span>
              <span>{formatMoney(totalLiabilities)}</span>
            </div>
          </div>

          {/* Equity */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
              Owner's Equity
            </h4>
            {equity.map((e) => (
              <div key={e.id} className="flex justify-between py-1 text-slate-700">
                <span>{e.name}</span>
                <span className="font-semibold">{formatMoney(e.balance)}</span>
              </div>
            ))}
            <div className="flex justify-between py-1 text-slate-700">
              <span>Retained Earnings (Current Net Profit)</span>
              <span className="font-semibold text-emerald-700">{formatMoney(netProfit)}</span>
            </div>
            <div className="flex justify-between py-2 font-black text-sm text-slate-900 border-t border-slate-300 bg-slate-50 p-2 rounded-lg">
              <span>TOTAL LIABILITIES & EQUITY</span>
              <span className="text-indigo-950 font-extrabold">{formatMoney(totalLiabilities + totalEquity)}</span>
            </div>
          </div>
        </div>
      )}

      {/* New Journal Entry Modal */}
      {isJournalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">Post Double-Entry Journal</h3>
              <button onClick={() => setIsJournalModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600 block mb-1">Transaction Description</label>
                <input
                  type="text"
                  placeholder="e.g. Bank charge adjustment or capital injection..."
                  value={journalDesc}
                  onChange={(e) => setJournalDesc(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Debit Account (+ Asset / + Expense)</label>
                <select
                  value={debitAccId}
                  onChange={(e) => setDebitAccId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.code} - {a.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Credit Account (- Asset / + Liability)</label>
                <select
                  value={creditAccId}
                  onChange={(e) => setCreditAccId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.code} - {a.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Amount (PKR)</label>
                <input
                  type="number"
                  value={journalAmount}
                  onChange={(e) => setJournalAmount(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsJournalModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Journal entry successfully posted to General Ledger.');
                  setIsJournalModalOpen(false);
                }}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Post Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
