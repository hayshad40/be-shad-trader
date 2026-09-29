import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Tenant } from '../../types';
import {
  ShieldCheck,
  Building2,
  Users,
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Sparkles,
  LifeBuoy,
  X,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const SuperAdminPanel: React.FC = () => {
  const {
    tenants,
    plans,
    createTenant,
    updateTenantPlan,
    toggleTenantStatus,
    tickets,
    auditLogs,
    formatMoney,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'tenants' | 'plans' | 'tickets' | 'logs'>('tenants');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewTenantOpen, setIsNewTenantOpen] = useState(false);

  // New Tenant State
  const [name, setName] = useState('');
  const [businessType, setBusinessType] = useState('FMCG & Goods Distribution');
  const [phone, setPhone] = useState('+92 300 1234567');
  const [city, setCity] = useState('Lahore');
  const [planId, setPlanId] = useState('plan_business');

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.businessType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeTenantsCount = tenants.filter((t) => t.status === 'active').length;
  const trialTenantsCount = tenants.filter((t) => t.status === 'trial').length;
  const totalMRR = tenants.reduce((sum, t) => {
    const plan = plans.find((p) => p.id === t.planId);
    return sum + (plan?.priceMonthly || 79);
  }, 0);

  const handleCreateTenant = () => {
    if (!name.trim()) return;

    createTenant({
      name,
      businessType,
      phone,
      city,
      planId,
      currency: 'PKR',
      currencySymbol: 'Rs.',
    });

    setIsNewTenantOpen(false);
    setName('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl shadow-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-600/30 rounded-xl border border-purple-500/40 text-purple-300">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">SaaS Super Admin Control Hub</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/30 text-purple-300 border border-purple-400/40">
                PLATFORM ROOT
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Multi-tenant provisioning, subscription billing, plan quotas, and cross-organization audits.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewTenantOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>+ Provision New Business</span>
        </button>
      </div>

      {/* Global SaaS Platform Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500">Total Provisioned Tenants</span>
          <p className="text-2xl font-black text-slate-900">{tenants.length} Businesses</p>
          <span className="text-[10px] text-emerald-600 font-semibold">{activeTenantsCount} Active Paid</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500">Free Trials In-Progress</span>
          <p className="text-2xl font-black text-amber-600">{trialTenantsCount} Trials</p>
          <span className="text-[10px] text-slate-400">14-Day evaluation</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500">Monthly Recurring Revenue</span>
          <p className="text-2xl font-black text-indigo-700">${totalMRR} / mo</p>
          <span className="text-[10px] text-indigo-600 font-semibold">Across active plans</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500">Open Support Tickets</span>
          <p className="text-2xl font-black text-purple-700">{tickets.length} In-Queue</p>
          <span className="text-[10px] text-purple-600 font-semibold">100% SLA uptime</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('tenants')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'tenants' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Tenants ({tenants.length})
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'plans' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Subscription Plans ({plans.length})
        </button>
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'tickets' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Support Tickets ({tickets.length})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'logs' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Security Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* 1. TENANTS LIST */}
      {activeTab === 'tenants' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Business Name & Slug</th>
                  <th className="py-3 px-4">Industry / Type</th>
                  <th className="py-3 px-4">City & Contact</th>
                  <th className="py-3 px-4">Active Plan</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTenants.map((t) => {
                  const plan = plans.find((p) => p.id === t.planId) || plans[1];
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        <div>{t.name}</div>
                        <span className="font-mono text-[10px] text-slate-400 font-normal">
                          {t.slug}.beshadtrader.com
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{t.businessType}</td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div>{t.city}</div>
                        <span className="text-[10px] text-slate-400">{t.phone}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={t.planId}
                          onChange={(e) => updateTenantPlan(t.id, e.target.value)}
                          className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                        >
                          {plans.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} (${p.priceMonthly}/mo)
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            t.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : t.status === 'trial'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => toggleTenantStatus(t.id)}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded transition ${
                            t.status === 'active'
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {t.status === 'active' ? 'Suspend Tenant' : 'Activate Tenant'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. PLANS MATRIX */}
      {activeTab === 'plans' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-base text-slate-900">{p.name}</h3>
                {p.badge && (
                  <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                    {p.badge}
                  </span>
                )}
              </div>
              <p className="text-2xl font-black text-slate-900">${p.priceMonthly} <span className="text-xs text-slate-400 font-normal">/ month</span></p>
              <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                <p>• Up to {p.userLimit} Users</p>
                <p>• {p.warehouseLimit} Multi-Warehouses</p>
                <p>• {p.productLimit.toLocaleString()} Catalog SKUs</p>
                <p>• {p.invoiceLimit.toLocaleString()} Invoices / Month</p>
                <p>• Accounting: {p.hasAccounting ? 'Enabled' : 'Disabled'}</p>
                <p>• Custom Branding: {p.hasCustomBranding ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. SUPPORT TICKETS */}
      {activeTab === 'tickets' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Subject & Tenant</th>
                  <th className="py-3 px-4">Message Summary</th>
                  <th className="py-3 px-4 text-center">Priority</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.map((tick) => (
                  <tr key={tick.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      <div>{tick.subject}</div>
                      <span className="text-[10px] text-indigo-600 font-semibold">{tick.tenantName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-sm truncate">{tick.message}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700">
                        {tick.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                        {tick.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{new Date(tick.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. SECURITY AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Operator</th>
                  <th className="py-3 px-4">Module</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800">{log.userName}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">{log.userRole}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{log.module}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700 text-[11px]">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Provision New Tenant Modal */}
      {isNewTenantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">Provision New Multi-Tenant Client</h3>
              <button onClick={() => setIsNewTenantOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600 block mb-1">Company / Organization Name</label>
                <input
                  type="text"
                  placeholder="e.g. Al-Noor Food Distributors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Industry Type</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="FMCG & Goods Distribution">FMCG & Goods Distribution</option>
                  <option value="Supermarket & Retail Store">Supermarket & Retail Store</option>
                  <option value="Wholesale Traders">Wholesale Traders</option>
                  <option value="Electronics & Spare Parts">Electronics & Spare Parts</option>
                  <option value="Pharmacy Distribution">Pharmacy Distribution</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">City Hub</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Initial Plan</label>
                <select
                  value={planId}
                  onChange={(e) => setPlanId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (${p.priceMonthly}/mo)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsNewTenantOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTenant}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Provision Organization
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
