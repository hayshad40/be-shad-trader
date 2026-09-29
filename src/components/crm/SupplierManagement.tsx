import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Supplier } from '../../types';
import {
  Building,
  Search,
  Plus,
  Phone,
  Mail,
  DollarSign,
  X,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';

export const SupplierManagement: React.FC = () => {
  const { suppliers, addSupplier, makeSupplierPayment, formatMoney } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Add Supplier Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newOpeningBalance, setNewOpeningBalance] = useState(0);

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPayables = suppliers.reduce((sum, s) => sum + s.currentBalance, 0);

  const handleOpenPayment = (s: Supplier) => {
    setSelectedSupplier(s);
    setPaymentAmount(Math.min(s.currentBalance, 250000));
    setIsPaymentModalOpen(true);
  };

  const handleExecutePayment = () => {
    if (!selectedSupplier || paymentAmount <= 0) return;
    makeSupplierPayment(selectedSupplier.id, paymentAmount, paymentMethod, paymentNotes);
    setIsPaymentModalOpen(false);
    setPaymentNotes('');
  };

  const handleCreateSupplier = () => {
    if (!newName.trim()) return;
    addSupplier({
      name: newName,
      company: newCompany || newName,
      phone: newPhone,
      email: newEmail,
      address: newAddress,
      openingBalance: newOpeningBalance,
      currentBalance: newOpeningBalance,
    });
    setIsAddOpen(false);
    setNewName('');
    setNewCompany('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Suppliers & Accounts Payable
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage principal manufacturers, FMCG distributors, and supplier payment vouchers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-slate-500">Total Supplier Liabilities</span>
            <p className="text-base font-black text-rose-600">{formatMoney(totalPayables)}</p>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-200"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Supplier</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search manufacturer, distributor, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Supplier List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Supplier / Manufacturer</th>
                <th className="py-3 px-4">Address & Location</th>
                <th className="py-3 px-4">Phone / Contact</th>
                <th className="py-3 px-4 text-right">Opening Balance</th>
                <th className="py-3 px-4 text-right">Current Payable Balance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSuppliers.map((sup) => (
                <tr key={sup.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    <div>{sup.name}</div>
                    <span className="text-[10px] text-slate-400 font-normal">{sup.email}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{sup.address}</td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{sup.phone}</td>
                  <td className="py-3.5 px-4 text-right text-slate-500">{formatMoney(sup.openingBalance)}</td>
                  <td className="py-3.5 px-4 text-right font-black text-rose-700">
                    {formatMoney(sup.currentBalance)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenPayment(sup)}
                      className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold rounded-lg transition"
                    >
                      Pay Supplier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment to Supplier Modal */}
      {isPaymentModalOpen && selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">Issue Payment to Supplier</h3>
              <button onClick={() => setIsPaymentModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800">{selectedSupplier.name}</p>
                <p className="text-rose-700 font-bold mt-1">
                  Payable Dues: {formatMoney(selectedSupplier.currentBalance)}
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Disbursement Amount (PKR)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="bank">Bank Alfalah Corporate Transfer</option>
                  <option value="hbl">HBL Trade Account</option>
                  <option value="cash">Cash Voucher</option>
                  <option value="cheque">Company Crossed Cheque</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Transaction Ref / Cheque #</label>
                <input
                  type="text"
                  placeholder="e.g. Online FT Ref #88921..."
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleExecutePayment}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Record Supplier Disbursement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">Register New Supplier / Principal</h3>
              <button onClick={() => setIsAddOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="font-bold text-slate-600 block mb-1">Supplier Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dalda Foods Limited"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Phone</label>
                <input
                  type="text"
                  placeholder="+92 21 35000000"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Email</label>
                <input
                  type="text"
                  placeholder="orders@supplier.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="col-span-2">
                <label className="font-bold text-slate-600 block mb-1">Address / Industrial Zone</label>
                <input
                  type="text"
                  placeholder="Plot 12, Industrial Area, Karachi"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Opening Payable Balance</label>
                <input
                  type="number"
                  value={newOpeningBalance}
                  onChange={(e) => setNewOpeningBalance(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSupplier}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Save Supplier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
