import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import {
  Users,
  Search,
  Plus,
  Phone,
  MessageSquare,
  DollarSign,
  MapPin,
  Calendar,
  X,
  CreditCard,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const CustomerManagement: React.FC = () => {
  const { customers, addCustomer, receiveCustomerPayment, formatMoney } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Payment Receipt Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentCustomer, setPaymentCustomer] = useState<Customer | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Add Customer Modal
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('Lahore');
  const [newArea, setNewArea] = useState('');
  const [newCreditLimit, setNewCreditLimit] = useState(300000);
  const [newOpeningBalance, setNewOpeningBalance] = useState(0);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalReceivables = customers.reduce((sum, c) => sum + c.currentBalance, 0);

  const handleOpenPayment = (c: Customer) => {
    setPaymentCustomer(c);
    setPaymentAmount(c.currentBalance);
    setIsPaymentModalOpen(true);
  };

  const handleSavePayment = () => {
    if (!paymentCustomer || paymentAmount <= 0) return;
    receiveCustomerPayment(paymentCustomer.id, paymentAmount, paymentMethod, paymentNotes);
    setIsPaymentModalOpen(false);
    setPaymentNotes('');
  };

  const handleSaveCustomer = () => {
    if (!newName.trim()) return;
    addCustomer({
      name: newName,
      company: newCompany || newName,
      phone: newPhone,
      email: newEmail,
      address: newAddress,
      city: newCity,
      area: newArea,
      creditLimit: newCreditLimit,
      openingBalance: newOpeningBalance,
      currentBalance: newOpeningBalance,
    });
    setIsAddCustomerOpen(false);
    setNewName('');
    setNewCompany('');
    setNewPhone('');
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Customer Directory & Accounts Receivable (Khata)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage wholesale clients, credit lines, aging recovery, and payment receipts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-slate-500">Total Outstanding Debtors</span>
            <p className="text-base font-black text-amber-700">{formatMoney(totalReceivables)}</p>
          </div>
          <button
            onClick={() => setIsAddCustomerOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-200"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Customer</span>
          </button>
        </div>
      </div>

      {/* Aging Receivables Breakdown Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-slate-500 font-semibold">Current (0-30 Days)</span>
          <p className="text-base font-bold text-slate-900 mt-0.5">{formatMoney(totalReceivables * 0.55)}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">On terms</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-slate-500 font-semibold">31-60 Days</span>
          <p className="text-base font-bold text-amber-600 mt-0.5">{formatMoney(totalReceivables * 0.25)}</p>
          <span className="text-[10px] text-amber-600 font-semibold">Follow-up due</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-slate-500 font-semibold">61-90 Days</span>
          <p className="text-base font-bold text-rose-600 mt-0.5">{formatMoney(totalReceivables * 0.12)}</p>
          <span className="text-[10px] text-rose-600 font-semibold">Overdue</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-slate-500 font-semibold">90+ Days</span>
          <p className="text-base font-bold text-rose-700 mt-0.5">{formatMoney(totalReceivables * 0.08)}</p>
          <span className="text-[10px] text-rose-700 font-semibold">Critical recovery</span>
        </div>
        <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 col-span-2 sm:col-span-1">
          <span className="text-indigo-700 font-semibold">Total Accounts</span>
          <p className="text-base font-bold text-indigo-950 mt-0.5">{customers.length} Retailers</p>
          <span className="text-[10px] text-indigo-600 font-semibold">Across 5 Territories</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer, business, city, area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Customer / Shop Name</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Phone / Contact</th>
                <th className="py-3 px-4">Territory Area</th>
                <th className="py-3 px-4 text-right">Credit Limit</th>
                <th className="py-3 px-4 text-right">Outstanding Balance</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((cust) => {
                const isOverLimit = cust.currentBalance > cust.creditLimit;
                return (
                  <tr key={cust.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      <div>{cust.name}</div>
                      <span className="text-[10px] text-slate-400 font-normal">{cust.address}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{cust.company}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <span>{cust.phone}</span>
                        {cust.whatsapp && (
                          <a
                            href={`https://wa.me/${cust.whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-[11px]">
                        {cust.area}, {cust.city}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-600 font-medium">
                      {formatMoney(cust.creditLimit)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black">
                      <span className={cust.currentBalance > 0 ? 'text-amber-700' : 'text-emerald-700'}>
                        {formatMoney(cust.currentBalance)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          isOverLimit
                            ? 'bg-rose-100 text-rose-700'
                            : cust.currentBalance > 0
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isOverLimit ? 'Credit Exceeded' : cust.currentBalance > 0 ? 'Active Due' : 'Clear'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenPayment(cust)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-lg transition"
                      >
                        Receive Payment
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Receipt Modal */}
      {isPaymentModalOpen && paymentCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">Record Customer Payment</h3>
              <button onClick={() => setIsPaymentModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800">{paymentCustomer.name}</p>
                <p className="text-slate-600">{paymentCustomer.company}</p>
                <p className="text-amber-700 font-bold mt-1">
                  Current Ledger Balance: {formatMoney(paymentCustomer.currentBalance)}
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Amount Received (PKR)</label>
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
                  <option value="cash">Cash on Hand</option>
                  <option value="bank">Bank Alfalah / Online</option>
                  <option value="cheque">Crossed Cheque</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Receipt Notes / Voucher #</label>
                <input
                  type="text"
                  placeholder="e.g. Cleared via Cheque #948291..."
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
                onClick={handleSavePayment}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Confirm Payment & Update Khata
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">Register New Customer / Outlet</h3>
              <button onClick={() => setIsAddCustomerOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="font-bold text-slate-600 block mb-1">Shop / Outlet Name</label>
                <input
                  type="text"
                  placeholder="e.g. Al-Madina Super Store"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Company / Owner Name</label>
                <input
                  type="text"
                  placeholder="e.g. Malik M. Tariq"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Mobile / WhatsApp</label>
                <input
                  type="text"
                  placeholder="+92 300 1234567"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">City</label>
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Area / Market</label>
                <input
                  type="text"
                  placeholder="e.g. Ichhra Market"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Credit Limit (PKR)</label>
                <input
                  type="number"
                  value={newCreditLimit}
                  onChange={(e) => setNewCreditLimit(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Opening Balance (PKR)</label>
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
                onClick={() => setIsAddCustomerOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCustomer}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Save Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
