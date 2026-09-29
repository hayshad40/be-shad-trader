import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Truck,
  DollarSign,
  Shield,
  Layers,
  Users,
  Store,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Smartphone,
  ChevronDown,
  Building2,
  BarChart3,
  Search,
  FileCheck,
  Zap,
  Globe,
  Star,
  Check,
  PhoneCall,
  Clock,
  Printer,
  Database,
  Lock,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const {
    setCurrentView,
    switchUserRole,
    plans,
    formatMoney,
    firebaseUser,
    isFirestoreConnected,
    loginWithGoogle,
  } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'pos' | 'ordertaker' | 'delivery'>('dashboard');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  const industries = [
    {
      id: 'distribution',
      title: 'Distribution & FMCG',
      icon: '🚚',
      desc: 'Route sales, field order booking, van sales dispatch, and multi-depot inventory tracking.',
      features: ['Van Inventory tracking', 'Route scheduling', 'Customer credit limits', 'Delivery note signature'],
    },
    {
      id: 'wholesale',
      title: 'Wholesale Traders',
      icon: '📦',
      desc: 'Bulk order volume, tiered price books (Carton/Master Pack), supplier payables and aging ledgers.',
      features: ['Tiered pricing', 'Credit aging (30/60/90 days)', 'Bulk item imports', 'Cash & Bank journals'],
    },
    {
      id: 'retail',
      title: 'Retail Shops & Marts',
      icon: '🏪',
      desc: 'High-speed counter checkout, barcode scanner support, instant receipt printing, and daily reconciliation.',
      features: ['Thermal printer ready', 'Split cash/card payment', 'Barcode generation', 'Shift cash summary'],
    },
    {
      id: 'supermarket',
      title: 'Supermarkets & Hyper',
      icon: '🛒',
      desc: 'Tens of thousands of SKUs, expiration date monitoring, multi-till counter sync, and fast search.',
      features: ['Batch & expiry alerts', 'Multi-cashier logins', 'Frequent buyer loyalty', 'Scalable database'],
    },
    {
      id: 'general_store',
      title: 'General Stores & Kiryana',
      icon: '🏬',
      desc: 'Simple bilingual Urdu/English interface, customer khata credit tracking, and fast search.',
      features: ['Urdu language support', 'Customer Khata records', 'Low stock alerts', 'WhatsApp statements'],
    },
    {
      id: 'electronics',
      title: 'Electronics & Appliances',
      icon: '⚡',
      desc: 'Serial number tracking, warranty recording, technician repair orders, and brand categorization.',
      features: ['IMEI/Serial tracking', 'Warranty receipts', 'Installment tracking', 'Supplier warranty claims'],
    },
    {
      id: 'garments',
      title: 'Garments & Fashion',
      icon: '👕',
      desc: 'Size, color, and fit matrix variations, seasonal discounts, and tag barcode printing.',
      features: ['Color & size matrix', 'Barcode tag printing', 'Seasonal clearance rates', 'Exchange voucher handling'],
    },
    {
      id: 'shoes',
      title: 'Footwear & Shoes',
      icon: '👟',
      desc: 'Pair sizing, brand categories, fast visual inventory search, and wholesale case packaging.',
      features: ['Size run packs', 'Fast returns exchange', 'Brand performance analytics', 'Dead stock alerts'],
    },
    {
      id: 'pharmacy',
      title: 'Pharmacies & Medical',
      icon: '💊',
      desc: 'Batch number management, formula & generic lookup, narcotics regulation, and supplier tracking.',
      features: ['Batch & expiry tracking', 'Doctor prescription notes', 'Supplier returns', 'Temperature logs'],
    },
    {
      id: 'restaurant',
      title: 'Restaurants & Cafes',
      icon: '🍽️',
      desc: 'Kitchen display dispatch, table order taking, raw recipe inventory deduction, and fast billing.',
      features: ['Raw ingredient deduction', 'Table & counter orders', 'Daily food cost analysis', 'Quick Khata Billing'],
    },
    {
      id: 'hardware',
      title: 'Hardware & Sanitary',
      icon: '🔧',
      desc: 'Multiple units (Feet, Meter, Kg, Pieces), contractor credit accounts, and supplier discounts.',
      features: ['Flexible unit conversions', 'Contractor credit ledgers', 'Price quotation generator', 'Weight calculations'],
    },
    {
      id: 'spare_parts',
      title: 'Spare Parts & Auto',
      icon: '🚗',
      desc: 'OEM part number indexing, cross-compatibility search, multi-bin warehouse location, and core credits.',
      features: ['Part number lookup', 'Warehouse bin numbering', 'Alternative part suggestion', 'Wholesale mechanics credit'],
    },
  ];

  const testimonials = [
    {
      quote: "Be Shad Trader replaced three separate fragmented systems for our FMCG business in Multan and Lahore. Our 14 field order takers now book orders directly into the central warehouse with zero stock discrepancies!",
      author: "M. Tariq Al-Hassan",
      role: "Managing Director",
      company: "Al-Hassan Food Distributors (Lahore)",
      metric: "+38% Sales Output in 60 Days",
    },
    {
      quote: "The role-based security is brilliant. Our field order takers cannot see purchase costs or company margins, but they have complete live visibility of available saleable stock and customer credit limits.",
      author: "Haji Abdul Rasheed",
      role: "Founder & CEO",
      company: "Bismillah Cash & Carry Wholesale",
      metric: "Zero Bad-Debt Surprises",
    },
    {
      quote: "The built-in double-entry accounting with instant general ledgers and aging reports saved our accounts team over 25 hours every week during monthly closings. Outstanding software!",
      author: "Farzana Parveen, FCA",
      role: "Head of Accounts",
      company: "Apex Retail Corporation",
      metric: "99.8% Financial Precision",
    },
  ];

  const faqs = [
    {
      q: 'Can field salesmen and order takers use this on their mobile smartphones?',
      a: 'Yes, absolutely. Be Shad Trader is engineered to be 100% responsive and PWA-ready. Field order takers have a specialized touch-optimized interface to select assigned route customers, browse wholesale catalogs, and submit orders in seconds.',
    },
    {
      q: 'Can order takers or cashiers see confidential business profits and purchase costs?',
      a: 'Never. Our strict Role-Based Access Control (RBAC) enforces zero-leakage security. Users with the ORDER_TAKER, SALESMAN, CASHIER, or WAREHOUSE_STAFF roles are completely blocked from viewing profit margins, purchase invoice costs, stock valuation in currency, or company-wide balance sheets.',
    },
    {
      q: 'Does it support multiple warehouses in different cities?',
      a: 'Yes! You can manage centralized warehouses, regional hubs, and city depots (e.g. Lahore Central, Karachi Port, Islamabad Transit). You can perform stock transfers with audit trails, track goods in-transit, and see inventory balances by location.',
    },
    {
      q: 'Does it support thermal receipt printers and barcode scanners?',
      a: 'Yes. The POS module works seamlessly with 80mm and 58mm thermal receipt printers, USB/Bluetooth barcode scanners, and full A4/A5 laser invoice printers.',
    },
    {
      q: 'Can I export my business data to Excel or PDF?',
      a: 'Yes, full data ownership is guaranteed. You can export customer statements, supplier ledgers, stock valuation tables, and sales summaries to CSV/Excel or printable PDF formats at any time.',
    },
    {
      q: 'Does it support the Urdu language and Pakistani Rupee (PKR)?',
      a: 'Yes! The platform includes full bilingual support (English and Urdu with RTL script direction), and supports PKR Rs., USD, AED, SAR, and other international currencies.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 text-white text-xs py-2 px-4 text-center font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Enterprise Launch
          </span>
          <span>Be Shad Trader Multi-Tenant Distribution & Accounting SaaS Platform</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-indigo-200 font-semibold">Presented by Hayeshad Media</span>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-indigo-300">
              B
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  BE SHAD <span className="text-indigo-600">TRADER</span>
                </span>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[11px] font-bold rounded-md border border-indigo-200/80">
                  v2.5
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Presented by Hayeshad Media</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition">Features</a>
            <a href="#distribution" className="hover:text-indigo-600 transition">Distribution</a>
            <a href="#industries" className="hover:text-indigo-600 transition">Industries</a>
            <a href="#pricing" className="hover:text-indigo-600 transition">Pricing</a>
            <a href="#demo" className="hover:text-indigo-600 transition">Live Demo</a>
            <a href="#faq" className="hover:text-indigo-600 transition">FAQ</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {firebaseUser ? (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="max-w-[120px] truncate">{firebaseUser.displayName || firebaseUser.email}</span>
              </div>
            ) : (
              <button
                onClick={() => loginWithGoogle()}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-white border border-slate-300 hover:border-slate-400 rounded-xl transition shadow-2xs"
                title="Sign in with your Google account"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Google Login</span>
              </button>
            )}

            <button
              onClick={() => {
                switchUserRole('ORDER_TAKER');
                setCurrentView('ordertaker');
              }}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              <Store className="w-3.5 h-3.5 text-amber-600" />
              <span>Order Taker Demo</span>
            </button>

            <button
              onClick={() => {
                switchUserRole('TENANT_OWNER');
                setCurrentView('dashboard');
              }}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition shadow-md shadow-indigo-200"
            >
              <span>Launch App</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-100/90 border border-indigo-200 text-indigo-800 text-xs font-bold shadow-2xs">
                  <Database className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Cloud Database & Google Auth Active</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Clean Net Billing (Tax-Exempt)</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Complete Distribution, Inventory & Accounting{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-800">
                  Management Software
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Run your entire supply chain seamlessly: from purchase inward, multi-warehouse stock, and field order booking, to van delivery dispatches, instant POS billing, and real-time double-entry ledgers.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => {
                    switchUserRole('TENANT_OWNER');
                    setCurrentView('dashboard');
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-indigo-300 flex items-center justify-center gap-2 group"
                >
                  <span>Start Free 14-Day Trial</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>

                <button
                  onClick={() => {
                    switchUserRole('CASHIER');
                    setCurrentView('pos');
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-xl text-sm border border-slate-300 transition shadow-xs flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4 text-emerald-600" />
                  <span>Try POS Billing</span>
                </button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 pt-3">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Multi-warehouse ready</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Field mobile PWA</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Dashboard Preview */}
            <div className="lg:col-span-6 relative">
              <div className="bg-slate-900 rounded-3xl p-3 sm:p-5 shadow-2xl border border-slate-800 text-white">
                {/* Simulated App Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono text-slate-400 ml-2">app.beshadtrader.com/live</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live Cloud Engine</span>
                  </div>
                </div>

                {/* Preview Tabs */}
                <div className="flex gap-2 py-3 overflow-x-auto border-b border-slate-800 text-xs">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-3 py-1.5 rounded-lg transition font-medium ${
                      activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Main Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab('pos')}
                    className={`px-3 py-1.5 rounded-lg transition font-medium ${
                      activeTab === 'pos' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    POS Counter
                  </button>
                  <button
                    onClick={() => setActiveTab('ordertaker')}
                    className={`px-3 py-1.5 rounded-lg transition font-medium ${
                      activeTab === 'ordertaker' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Field Order Taker
                  </button>
                  <button
                    onClick={() => setActiveTab('delivery')}
                    className={`px-3 py-1.5 rounded-lg transition font-medium ${
                      activeTab === 'delivery' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Van Dispatch
                  </button>
                </div>

                {/* Tab Previews */}
                <div className="pt-4 min-h-[300px]">
                  {activeTab === 'dashboard' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700">
                          <span className="text-[10px] text-slate-400 uppercase font-bold">Today Sales</span>
                          <p className="text-base sm:text-lg font-black text-indigo-400 mt-1">Rs. 284,500</p>
                          <span className="text-[10px] text-emerald-400 font-medium">↑ 18.4% vs last week</span>
                        </div>
                        <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700">
                          <span className="text-[10px] text-slate-400 uppercase font-bold">Collections</span>
                          <p className="text-base sm:text-lg font-black text-emerald-400 mt-1">Rs. 195,000</p>
                          <span className="text-[10px] text-slate-400 font-medium">7 Bank Transfers</span>
                        </div>
                        <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700">
                          <span className="text-[10px] text-slate-400 uppercase font-bold">Active Orders</span>
                          <p className="text-base sm:text-lg font-black text-amber-400 mt-1">24 Active</p>
                          <span className="text-[10px] text-slate-400 font-medium">18 Dispatched</span>
                        </div>
                      </div>

                      {/* Mini visual chart representation */}
                      <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/80">
                        <div className="flex justify-between items-center text-xs mb-2">
                          <span className="font-semibold text-slate-300">Weekly Distribution Trend</span>
                          <span className="text-[10px] text-indigo-400">Peak: Thursday (Rs. 410K)</span>
                        </div>
                        <div className="h-24 flex items-end gap-2 pt-2">
                          {[45, 60, 80, 50, 95, 75, 88].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                              <div
                                style={{ height: `${h}%` }}
                                className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-sm"
                              />
                              <span className="text-[9px] text-slate-500">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'pos' && (
                    <div className="bg-slate-800/70 p-4 rounded-xl border border-slate-700 space-y-3">
                      <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-700">
                        <span className="font-bold text-emerald-400">POS Retail / Counter Billing</span>
                        <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded font-mono">Receipt #POS-2026-0042</span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between text-slate-300">
                          <span>Basmati Super Kernel Rice (25kg)</span>
                          <span className="font-bold">Rs. 6,900</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Cooking Oil (16 Liter Tin) x 2</span>
                          <span className="font-bold">Rs. 16,800</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Danedar Tea 900g Carton Pack</span>
                          <span className="font-bold">Rs. 18,200</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-700 flex justify-between items-center">
                        <span className="text-xs text-slate-400">Total Payable:</span>
                        <span className="text-xl font-black text-emerald-400">Rs. 41,900</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'ordertaker' && (
                    <div className="bg-slate-800/70 p-4 rounded-xl border border-slate-700 space-y-3">
                      <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-700">
                        <span className="font-bold text-amber-400">Field Order Taker App</span>
                        <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded font-mono">Strict RBAC</span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium">Selected Customer: Malik Grocery (Ichhra)</p>
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-slate-200">Olpers Milk 1L (Carton 12x)</p>
                          <p className="text-[10px] text-slate-400">Stock: 150 Cartons Available</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-indigo-600 rounded text-xs font-bold">10 Qty</span>
                          <span className="font-bold text-white">Rs. 36,000</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 italic">
                        Purchase costs, margins, and total business revenue are permanently locked from field staff view.
                      </p>
                    </div>
                  )}

                  {activeTab === 'delivery' && (
                    <div className="bg-slate-800/70 p-4 rounded-xl border border-slate-700 space-y-3">
                      <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-700">
                        <span className="font-bold text-blue-400">Van Dispatch & Delivery Board</span>
                        <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded font-mono">Van #08</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="p-2 rounded bg-slate-900 flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-white">Al-Madina Mart & Bakers (DHA)</p>
                            <p className="text-[10px] text-slate-400">Invoice #INV-2026-1002 • Pre-Paid</p>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 text-[10px] font-bold">
                            In Transit
                          </span>
                        </div>
                        <div className="p-2 rounded bg-slate-900 flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-white">Bismillah Cash & Carry (Ravi Rd)</p>
                            <p className="text-[10px] text-slate-400">Amount to collect: Rs. 183,810</p>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 text-[10px] font-bold">
                            Assigned
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer preview note */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Be Shad Trader Commercial SaaS Platform</span>
                  <span className="text-indigo-400 font-semibold">Presented by Hayeshad Media</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUSTED BY BUSINESSES */}
      <section className="py-10 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            Powering 1,200+ Wholesale Distributors, Supermarkets & Retail Businesses Across Pakistan
          </p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 items-center justify-items-center opacity-70 grayscale hover:grayscale-0 transition duration-300">
            <span className="font-extrabold text-slate-800 text-sm tracking-tight">AL-KARAM GRAINS</span>
            <span className="font-extrabold text-slate-800 text-sm tracking-tight">HABIB OIL MILLS</span>
            <span className="font-extrabold text-slate-800 text-sm tracking-tight">NATIONAL FOODS DIST</span>
            <span className="font-extrabold text-slate-800 text-sm tracking-tight">APEX SUPERMARKET</span>
            <span className="font-extrabold text-slate-800 text-sm tracking-tight">SHAHID TRADERS</span>
            <span className="font-extrabold text-slate-800 text-sm tracking-tight">BISMILLAH CASH-N-CARRY</span>
          </div>
        </div>
      </section>

      {/* 3 & 4. CORE DISTRIBUTION WORKFLOW SECTION */}
      <section id="distribution" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              End-to-End Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              The Complete Distribution & Supply Chain Engine
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              From container port arrival to van sales and digital customer signature confirmation.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Supplier Purchase & Inward',
                desc: 'Record purchase orders, verify supplier bills, and automatically increment warehouse stock upon goods receipt.',
                icon: Layers,
                color: 'text-indigo-600 bg-indigo-50',
              },
              {
                step: '02',
                title: 'Multi-Warehouse Allocation',
                desc: 'Store inventory across central hubs and regional depots. Conduct inter-depot stock transfers with full movement audit logs.',
                icon: Package,
                color: 'text-blue-600 bg-blue-50',
              },
              {
                step: '03',
                title: 'Field Order Booking',
                desc: 'Salesmen and order takers visit assigned market territories, check live stock, book orders, and enforce customer credit limits.',
                icon: Store,
                color: 'text-amber-600 bg-amber-50',
              },
              {
                step: '04',
                title: 'Van Dispatch & Collection',
                desc: 'Warehouse picks and packs stock. Delivery drivers obtain customer digital signatures and record cash collections into the ledger.',
                icon: Truck,
                color: 'text-emerald-600 bg-emerald-50',
              },
            ].map((st, idx) => {
              const Icon = st.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition relative group"
                >
                  <span className="text-3xl font-black text-slate-200 group-hover:text-indigo-100 transition absolute top-4 right-4">
                    {st.step}
                  </span>
                  <div className={`w-12 h-12 rounded-xl ${st.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">{st.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. INDUSTRY SOLUTIONS CARDS (12 Industries) */}
      <section id="industries" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Tailored Vertical Solutions
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              Engineered for Every Trade & Wholesale Industry
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Whether you run a large FMCG supply fleet or a bustling high-volume retail counter, Be Shad Trader adapts to your workflow.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {industries.map((ind) => (
              <div
                key={ind.id}
                onClick={() => setSelectedIndustry(ind.id)}
                className="bg-slate-50 hover:bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="text-3xl mb-3">{ind.icon}</div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition">
                    {ind.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{ind.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-indigo-600 font-semibold">
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            ))}
          </div>

          {/* Industry Details Modal */}
          {selectedIndustry && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
                {(() => {
                  const currentInd = industries.find((i) => i.id === selectedIndustry);
                  if (!currentInd) return null;
                  return (
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-4xl">{currentInd.icon}</span>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{currentInd.title}</h3>
                          <p className="text-xs text-indigo-600 font-semibold">Specialized Industry Configuration</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mb-4">{currentInd.desc}</p>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Key Features Included:</h4>
                      <ul className="space-y-2 mb-6">
                        {currentInd.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedIndustry(null);
                            setCurrentView('dashboard');
                          }}
                          className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition"
                        >
                          Launch Demo for this Industry
                        </button>
                        <button
                          onClick={() => setSelectedIndustry(null)}
                          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. CORE FEATURES IN-DEPTH GRID */}
      <section id="features" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Enterprise Feature Matrix
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              Everything Your Distribution Company Needs
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              From POS barcode scanning to double-entry general ledgers and route sales management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">High-Speed POS Billing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Scan barcodes, search products by name or SKU, handle cash, card, credit, and split payments. Print 80mm thermal receipts with 1-click.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Strict Role Security (RBAC)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Granular permissions prevent field order takers, cashiers, and warehouse staff from seeing confidential purchase costs, margins, and net profit.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Double-Entry Accounting</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full Chart of Accounts, Bank & Cash accounts, General Ledger, Trial Balance, automated Profit & Loss statements, and Balance Sheets.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Multi-Warehouse Inventory</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track stock across multiple cities and regional branches. Transfer stock with inter-depot tracking, conduct adjustments, and receive low-stock alerts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Customer & Supplier CRM</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Detailed customer profiles, WhatsApp messaging shortcuts, credit limits, 30/60/90 days aging receivables, and supplier payment scheduling.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Van Dispatch & Signatures</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Assign delivery vans to specific routes, track orders in-transit, capture digital proof of delivery signatures, and reconcile cash collected.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-indigo-200/80 shadow-xs space-y-3 bg-gradient-to-br from-indigo-50/30 to-white">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base text-slate-900">Cloud Database & Auth</h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">Live</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Powered by Firebase Firestore Enterprise and Google Sign-In. Orders, bookings, and ledger movements synchronize across all field and warehouse devices with ABAC zero-trust security.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-amber-200/80 shadow-xs space-y-3 bg-gradient-to-br from-amber-50/30 to-white">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base text-slate-900">Field Order Taker Suite</h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold">New</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Field reps can book orders, track fulfillment progress via an interactive Stepper Visualizer (Pending → Picking → Dispatched → Delivered), search booking history, and edit pending orders directly before warehouse processing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-emerald-200/80 shadow-xs space-y-3 bg-gradient-to-br from-emerald-50/30 to-white">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base text-slate-900">Clean Net Billing (Tax-Exempt)</h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">Tax-Free</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Designed specifically for wholesale and distribution trade with 0% tax complexity. Direct item costs, transparent gross-to-net margins, and straightforward ledger balance reconciliation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LIVE DEMO SECTION */}
      <section id="demo" className="py-20 bg-indigo-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20">
            Interactive Live Sandbox
          </span>
          <h2 className="text-3xl sm:text-5xl font-black mt-4 tracking-tight">
            Experience the Be Shad Trader Engine Right Now
          </h2>
          <p className="text-indigo-200 text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Loaded with 52+ realistic products, 20+ active customer accounts, 12 suppliers, and real accounting transactions.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mt-10">
            <button
              onClick={() => {
                switchUserRole('TENANT_OWNER');
                setCurrentView('dashboard');
              }}
              className="p-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-left transition group"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-bold text-base text-white">Owner / MD View</h4>
              <p className="text-xs text-indigo-200 mt-1">Full KPIs, sales, purchases, profit & general ledgers.</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs text-amber-300 font-semibold group-hover:translate-x-1 transition">
                <span>Launch Owner Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            <button
              onClick={() => {
                switchUserRole('ORDER_TAKER');
                setCurrentView('ordertaker');
              }}
              className="p-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-left transition group"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center mb-3">
                <Store className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-bold text-base text-white">Field Order Taker</h4>
              <p className="text-xs text-indigo-200 mt-1">Mobile field interface. Zero financial visibility.</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs text-amber-300 font-semibold group-hover:translate-x-1 transition">
                <span>Test Field App</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            <button
              onClick={() => {
                switchUserRole('CASHIER');
                setCurrentView('pos');
              }}
              className="p-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-left transition group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center mb-3">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-bold text-base text-white">POS Cashier Counter</h4>
              <p className="text-xs text-indigo-200 mt-1">Barcode scanner, fast cart, and thermal receipts.</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs text-amber-300 font-semibold group-hover:translate-x-1 transition">
                <span>Open POS Terminal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Customer Success Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              Trusted by Fast-Growing Distribution Networks
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((tItem, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic mb-4">"{tItem.quote}"</p>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 mb-2">
                    {tItem.metric}
                  </span>
                  <p className="font-bold text-sm text-slate-900">{tItem.author}</p>
                  <p className="text-xs text-slate-500">{tItem.role}, {tItem.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. PRICING SECTION */}
      <section id="pricing" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              SaaS Subscription Plans
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              Transparent, Value-Packed Pricing for Growing Businesses
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Start with a 14-day free trial. Upgrade, downgrade, or cancel anytime.
            </p>

            {/* Monthly / Yearly Toggle */}
            <div className="mt-6 inline-flex items-center gap-3 p-1.5 bg-slate-200/80 rounded-xl">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
                  billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                  billingCycle === 'yearly' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Yearly Billing</span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((p) => {
              const price = billingCycle === 'monthly' ? p.priceMonthly : Math.round(p.priceYearly / 12);
              const isPopular = p.id === 'plan_business';

              return (
                <div
                  key={p.id}
                  className={`bg-white rounded-3xl p-6 border transition flex flex-col justify-between relative ${
                    isPopular
                      ? 'border-indigo-500 shadow-xl shadow-indigo-100 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 shadow-xs hover:shadow-md'
                  }`}
                >
                  {p.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-full tracking-wider shadow-sm">
                      {p.badge}
                    </span>
                  )}

                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">{p.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{p.description}</p>

                    <div className="mt-4 mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-900">${price}</span>
                        <span className="text-xs text-slate-500 font-medium">/ month</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {billingCycle === 'yearly' ? `Billed $${p.priceYearly} annually` : 'Billed month-to-month'}
                      </p>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-600 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 font-semibold text-slate-800">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Up to {p.userLimit} Team Users</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{p.warehouseLimit} Multi-Warehouses</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{p.productLimit.toLocaleString()} Catalog Products</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{p.invoiceLimit.toLocaleString()} Invoices / Month</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className={`w-4 h-4 ${p.hasAccounting ? 'text-emerald-600' : 'text-slate-300'} shrink-0`} />
                        <span className={p.hasAccounting ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                          Double-Entry General Ledgers
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className={`w-4 h-4 ${p.hasCustomBranding ? 'text-emerald-600' : 'text-slate-300'} shrink-0`} />
                        <span className={p.hasCustomBranding ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                          White-Label Invoice Branding
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4">
                    <button
                      onClick={() => {
                        switchUserRole('TENANT_OWNER');
                        setCurrentView('dashboard');
                      }}
                      className={`w-full py-3 rounded-xl text-xs font-bold transition shadow-xs ${
                        isPopular
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      Start Free Trial
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. INTERACTIVE FAQ SECTION */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm text-slate-800 flex justify-between items-center hover:bg-slate-50 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      activeFaq === idx ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 bg-slate-50/50 border-t border-slate-100 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. BIG CALL TO ACTION BANNER */}
      <section className="py-16 bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 text-white relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready to Supercharge Your Distribution Operations?
          </h2>
          <p className="text-indigo-200 text-sm sm:text-base max-w-2xl mx-auto">
            Join over 1,200 businesses saving hours every day on order booking, inventory reconciliation, and financial reporting.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                switchUserRole('TENANT_OWNER');
                setCurrentView('dashboard');
              }}
              className="px-8 py-4 bg-white text-indigo-900 font-extrabold rounded-xl text-sm hover:bg-indigo-50 transition shadow-xl"
            >
              Launch Live App Now
            </button>
            <button
              onClick={() => {
                switchUserRole('ORDER_TAKER');
                setCurrentView('ordertaker');
              }}
              className="px-8 py-4 bg-indigo-950/80 text-white border border-indigo-400/40 font-semibold rounded-xl text-sm hover:bg-indigo-950 transition"
            >
              Try Field Order Taker View
            </button>
          </div>
          <p className="text-xs text-indigo-300 font-medium pt-2">
            Presented by Hayeshad Media • 14-day free trial • Full customer data privacy
          </p>
        </div>
      </section>

      {/* 12. FOOTER (With requested Presented by Hayeshad Media) */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
            {/* Column 1: Brand Info */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-base">
                  B
                </div>
                <span className="font-black text-xl text-white tracking-tight">
                  BE SHAD <span className="text-indigo-400">TRADER</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Enterprise Multi-Tenant SaaS platform for distribution businesses, wholesalers, retail chains, supermarkets, and field sales teams.
              </p>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 max-w-xs">
                <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Software Architect & Production</p>
                <p className="text-sm font-extrabold text-white mt-0.5">Presented by Hayeshad Media</p>
                <p className="text-[11px] text-slate-400 mt-0.5">All Rights Reserved © 2026</p>
              </div>
            </div>

            {/* Column 2: Solutions */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Product</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => setCurrentView('dashboard')} className="hover:text-white">Business Dashboard</button></li>
                <li><button onClick={() => setCurrentView('pos')} className="hover:text-white">Fast POS Counter</button></li>
                <li><button onClick={() => setCurrentView('ordertaker')} className="hover:text-white">Field Order Taker</button></li>
                <li><button onClick={() => setCurrentView('inventory')} className="hover:text-white">Multi-Warehouse Stock</button></li>
                <li><button onClick={() => setCurrentView('accounting')} className="hover:text-white">Double-Entry Accounting</button></li>
                <li><button onClick={() => setCurrentView('deliveries')} className="hover:text-white">Van Dispatch Delivery</button></li>
              </ul>
            </div>

            {/* Column 3: Industries */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Industries</h4>
              <ul className="space-y-2 text-xs">
                <li><span className="hover:text-white">FMCG Distribution</span></li>
                <li><span className="hover:text-white">Supermarkets & Retail</span></li>
                <li><span className="hover:text-white">Electronics Wholesale</span></li>
                <li><span className="hover:text-white">Pharmaceuticals</span></li>
                <li><span className="hover:text-white">Hardware & Sanitary</span></li>
                <li><span className="hover:text-white">Spare Parts</span></li>
              </ul>
            </div>

            {/* Column 4: Platform & Support */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => setCurrentView('superadmin')} className="hover:text-white">Super Admin SaaS</button></li>
                <li><button onClick={() => setCurrentView('settings')} className="hover:text-white">White-Label Branding</button></li>
                <li><button onClick={() => setCurrentView('reports')} className="hover:text-white">Financial Audits</button></li>
                <li><span className="hover:text-white">Privacy & Isolation</span></li>
                <li><span className="hover:text-white">API Documentation</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>© 2026 Be Shad Trader. Complete Distribution & Accounting SaaS. Presented by Hayeshad Media.</p>
            <div className="flex gap-6">
              <span className="hover:text-white cursor-pointer">Security Policy</span>
              <span className="hover:text-white cursor-pointer">Terms of Service</span>
              <span className="hover:text-white cursor-pointer">Multi-Tenant Isolation SLA</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
