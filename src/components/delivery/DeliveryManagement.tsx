import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DeliveryTask } from '../../types';
import {
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  Phone,
  DollarSign,
  PenTool,
  Search,
  X,
  FileCheck,
  AlertCircle,
} from 'lucide-react';

export const DeliveryManagement: React.FC = () => {
  const { deliveries, updateDeliveryStatus, formatMoney } = useApp();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryTask | null>(null);
  const [signatureName, setSignatureName] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('Delivered intact. Payment received.');

  const filteredDeliveries = deliveries.filter((d) => {
    const matchesTab = activeTab === 'all' || d.status === activeTab;
    const matchesSearch =
      d.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.driverName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleConfirmDelivery = () => {
    if (!selectedDelivery || !signatureName.trim()) return;

    updateDeliveryStatus(
      selectedDelivery.id,
      'delivered',
      `${signatureName.trim()} (Customer Signed)`,
      deliveryNote
    );

    setSelectedDelivery(null);
    setSignatureName('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Van Dispatch & Route Delivery Board
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Assign logistics vans, track dispatches, record customer digital signatures and cash collection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 font-semibold">
            <span>Active Van Fleet: 8 Delivery Units</span>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex gap-1 text-xs">
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'assigned', label: 'Assigned to Van' },
            { id: 'in_transit', label: 'In Transit' },
            { id: 'delivered', label: 'Delivered' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
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
            placeholder="Search order #, customer, driver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Delivery Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDeliveries.map((del) => (
          <div
            key={del.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {del.orderNumber}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    del.status === 'delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : del.status === 'in_transit'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {del.status.replace('_', ' ')}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900">{del.customerName}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{del.deliveryAddress}</span>
              </p>
              {del.customerPhone && (
                <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{del.customerPhone}</span>
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Assigned Van / Driver:</span>
                <span className="font-semibold text-slate-800">{del.driverName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Territory Route:</span>
                <span className="font-medium text-slate-700">{del.route}</span>
              </div>
              <div className="flex justify-between items-baseline font-bold">
                <span className="text-slate-700">Cash to Collect:</span>
                <span className={del.amountToCollect > 0 ? 'text-amber-700 font-black' : 'text-emerald-700'}>
                  {formatMoney(del.amountToCollect)}
                </span>
              </div>

              {del.signature && (
                <div className="p-2 bg-emerald-50/80 border border-emerald-200 rounded-lg text-[11px] text-emerald-900">
                  <span className="font-semibold block">Proof of Delivery Signature:</span>
                  <span className="font-serif italic text-xs mt-0.5 block">{del.signature}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              {del.status !== 'delivered' ? (
                <button
                  onClick={() => {
                    setSelectedDelivery(del);
                    setSignatureName(del.customerName.split(' ')[0] || 'Receiver');
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Customer Signature & Deliver</span>
                </button>
              ) : (
                <div className="w-full py-2 bg-slate-100 text-slate-500 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Delivered & Verified</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Signature Pad Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">Proof of Delivery Confirmation</h3>
              <button onClick={() => setSelectedDelivery(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800">{selectedDelivery.customerName}</p>
                <p className="text-slate-600 font-mono mt-0.5">{selectedDelivery.orderNumber}</p>
                {selectedDelivery.amountToCollect > 0 && (
                  <p className="text-emerald-700 font-bold mt-1">
                    Cash Collected: {formatMoney(selectedDelivery.amountToCollect)}
                  </p>
                )}
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Receiver Name / Signature</label>
                <input
                  type="text"
                  placeholder="e.g. Malik Imran (Manager)"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Simulated Digital Signature Canvas</label>
                <div className="h-20 bg-slate-100 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs italic font-serif">
                  {signatureName ? `${signatureName} ✍️` : 'Customer signs here on mobile screen'}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Driver Delivery Remarks</label>
                <input
                  type="text"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedDelivery(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelivery}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Confirm Delivery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
