import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Building2,
  FileText,
  DollarSign,
  Palette,
  Shield,
  Save,
  CheckCircle2,
  RefreshCw,
  Database,
  Lock,
} from 'lucide-react';

export const BusinessSettings: React.FC = () => {
  const { currentTenant, updateTenant, resetToDemoData, currentUser, firebaseUser, isFirestoreConnected, loginWithGoogle, logoutUser } = useApp();

  const [name, setName] = useState(currentTenant.name);
  const [phone, setPhone] = useState(currentTenant.phone);
  const [email, setEmail] = useState(currentTenant.email);
  const [address, setAddress] = useState(currentTenant.address);
  const [city, setCity] = useState(currentTenant.city);
  const [taxNumber, setTaxNumber] = useState(currentTenant.taxNumber || '');
  const [invoiceFooter, setInvoiceFooter] = useState(currentTenant.invoiceFooterText);
  const [themeColor, setThemeColor] = useState(currentTenant.themeColor || '#4f46e5');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateTenant(currentTenant.id, {
      name,
      phone,
      email,
      address,
      city,
      taxNumber,
      invoiceFooterText: invoiceFooter,
      themeColor,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Business Profile & White-Label Customization
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure tenant branding, printed invoice footers, legal NTN, and system defaults.
          </p>
        </div>
        {isSaved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div>
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2 mb-4">
            Commercial Business Identity
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Company / Organization Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Trade / Business Registration No.</label>
              <input
                type="text"
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value)}
                placeholder="e.g. REG-4892104"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Official Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Official Contact Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Physical Address & City</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2 mb-4">
            Print & Receipt White-Label Customization
          </h3>
          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Printed Invoice & Thermal Receipt Footer Message
              </label>
              <textarea
                rows={3}
                value={invoiceFooter}
                onChange={(e) => setInvoiceFooter(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                This notice will appear at the bottom of all laser invoices and 80mm thermal receipts.
              </p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-2">Theme Accent Color</label>
              <div className="flex gap-3 items-center">
                {['#4f46e5', '#059669', '#0284c7', '#d97706', '#dc2626', '#7c3aed'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setThemeColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-7 h-7 rounded-full border-2 transition ${
                      themeColor === c ? 'border-slate-900 scale-110 shadow-xs' : 'border-transparent'
                    }`}
                  />
                ))}
                <span className="font-mono text-slate-500 text-[11px]">{themeColor}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all demo data back to clean factory state?')) {
                resetToDemoData();
              }
            }}
            className="px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Factory Seed Data</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>

      {/* Cloud Database & Firebase Authentication Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Cloud Database & Authentication (Firebase)</h3>
              <p className="text-xs text-slate-500">Live multi-tenant data sync with Firestore and Google Sign-in</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{isFirestoreConnected ? 'Firestore Connected' : 'Ready'}</span>
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium block">Firebase Project ID</span>
            <span className="font-mono font-semibold text-slate-800">gen-lang-client-0738746966</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium block">Firestore Database ID</span>
            <span className="font-mono font-semibold text-slate-800 text-[11px] truncate block" title="ai-studio-beshadtraderdist-19647c2a-c649-4ecf-8469-95503f10ea73">
              ai-studio-beshadtraderdist-19647c2a-c649-4ecf-8469-95503f10ea73
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium block">Security Rules</span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Deployed & ABAC Hardened (rules_version = '2')</span>
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium block">Google Authentication Status</span>
            {firebaseUser ? (
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 truncate">{firebaseUser.email}</span>
                <button
                  type="button"
                  onClick={() => logoutUser()}
                  className="text-xs text-rose-600 font-bold hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Not signed in</span>
                <button
                  type="button"
                  onClick={() => loginWithGoogle()}
                  className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[11px] font-bold hover:bg-indigo-700"
                >
                  Sign in with Google
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Presented by Hayeshad Media Footer Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 text-slate-300 text-center text-xs space-y-1">
        <p className="font-bold text-white text-sm">BE SHAD TRADER - MULTI-TENANT ENTERPRISE SAAS</p>
        <p className="text-slate-400">Presented by Hayeshad Media • All Rights Reserved © 2026</p>
      </div>
    </div>
  );
};
