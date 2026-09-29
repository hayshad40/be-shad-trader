import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExpenseRecord } from '../../types';
import {
  Receipt,
  Plus,
  Search,
  DollarSign,
  Fuel,
  Lightbulb,
  Building,
  UserCheck,
  Truck,
  Wrench,
  Megaphone,
  Briefcase,
  X,
} from 'lucide-react';

export const ExpenseManagement: React.FC = () => {
  const { expenses, addExpense, formatMoney } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseRecord['category']>('fuel');
  const [amount, setAmount] = useState<number>(5000);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank' | 'card'>('cash');
  const [paidTo, setPaidTo] = useState('');
  const [notes, setNotes] = useState('');

  const filteredExpenses = expenses.filter(
    (e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.paidTo && e.paidTo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleSaveExpense = () => {
    if (!title.trim() || amount <= 0) return;

    addExpense({
      title,
      category,
      amount,
      paymentMethod,
      date: new Date().toISOString().split('T')[0],
      paidTo,
      approvedBy: 'Operations Manager',
      notes,
    });

    setIsAddExpenseOpen(false);
    setTitle('');
    setAmount(5000);
    setPaidTo('');
    setNotes('');
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'fuel': return <Fuel className="w-4 h-4 text-amber-500" />;
      case 'electricity': return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case 'rent': return <Building className="w-4 h-4 text-indigo-500" />;
      case 'salary': return <UserCheck className="w-4 h-4 text-emerald-500" />;
      case 'transport': return <Truck className="w-4 h-4 text-blue-500" />;
      case 'maintenance': return <Wrench className="w-4 h-4 text-slate-500" />;
      default: return <Briefcase className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Operating Expense Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track warehouse rent, van diesel fuel, staff wages, and logistics overheads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-slate-500">Total Month Overheads</span>
            <p className="text-base font-black text-rose-600">{formatMoney(totalExpenseAmount)}</p>
          </div>
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-200"
          >
            <Plus className="w-4 h-4" />
            <span>+ Record Expense Voucher</span>
          </button>
        </div>
      </div>

      {/* Category breakdown cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {[
          { cat: 'fuel', label: 'Van Diesel & Freight', color: 'bg-amber-50 border-amber-200' },
          { cat: 'electricity', label: 'Utilities & Bills', color: 'bg-yellow-50 border-yellow-200' },
          { cat: 'salary', label: 'Field Staff Allowances', color: 'bg-emerald-50 border-emerald-200' },
          { cat: 'maintenance', label: 'Warehouse & Equipment', color: 'bg-slate-50 border-slate-200' },
        ].map((item, idx) => {
          const sum = expenses
            .filter((e) => e.category === item.cat)
            .reduce((s, e) => s + e.amount, 0);
          return (
            <div key={idx} className={`p-3.5 rounded-xl border ${item.color}`}>
              <span className="font-semibold text-slate-600">{item.label}</span>
              <p className="text-base font-black text-slate-900 mt-0.5">{formatMoney(sum)}</p>
            </div>
          );
        })}
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3 border-b border-slate-200 flex justify-between items-center">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Title / Expense Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Paid To</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Approved By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    <div>{exp.title}</div>
                    {exp.notes && <span className="text-[10px] text-slate-400 font-normal">{exp.notes}</span>}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 capitalize px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {getCategoryIcon(exp.category)}
                      <span>{exp.category}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{exp.paidTo || 'Vendor'}</td>
                  <td className="py-3.5 px-4 text-slate-500">{exp.date}</td>
                  <td className="py-3.5 px-4 uppercase text-[10px] font-semibold text-slate-600">
                    {exp.paymentMethod}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-rose-600">
                    {formatMoney(exp.amount)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px] font-medium">
                    {exp.approvedBy || 'Manager'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">Record Operating Expense</h3>
              <button onClick={() => setIsAddExpenseOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600 block mb-1">Expense Description / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Van-08 Fuel Multan Route..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="fuel">Fuel & Logistics</option>
                    <option value="electricity">Electricity & Utilities</option>
                    <option value="rent">Warehouse Rent</option>
                    <option value="salary">Staff Salaries</option>
                    <option value="transport">Freight & Transport</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="office">Office & Telecom</option>
                    <option value="marketing">Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="cash">Cash Voucher</option>
                    <option value="bank">Bank Alfalah</option>
                    <option value="card">Corporate Card</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Amount (PKR)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Paid To / Payee</label>
                <input
                  type="text"
                  placeholder="e.g. PSO Petrol Pump"
                  value={paidTo}
                  onChange={(e) => setPaidTo(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsAddExpenseOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveExpense}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Record Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
