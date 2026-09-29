import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Sparkles,
  Globe,
  Coins,
  Shield,
  Building2,
  Bell,
  Search,
  Plus,
  RefreshCw,
  ShoppingCart,
  Menu,
  CheckCircle2,
  ChevronDown,
  Layers,
  ArrowRight,
  ExternalLink,
  Database,
  LogIn,
  LogOut,
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const {
    currentTenant,
    tenants,
    switchTenant,
    currentUser,
    switchUserRole,
    language,
    setLanguage,
    currency,
    setCurrency,
    t,
    setIsAIModalOpen,
    setCurrentView,
    currentView,
    resetToDemoData,
    products,
    customers,
    firebaseUser,
    isFirestoreConnected,
    loginWithGoogle,
    logoutUser,
    isFirebaseAuthLoading,
  } = useApp();

  const [isTenantMenuOpen, setIsTenantMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const rolesList: { role: UserRole; label: string; desc: string }[] = [
    { role: 'TENANT_OWNER', label: 'Tenant Owner / MD', desc: 'Full business access & all financials' },
    { role: 'ORDER_TAKER', label: 'Field Order Taker', desc: 'STRICT: No profit, no costs, order entry only' },
    { role: 'CASHIER', label: 'POS Cashier', desc: 'Fast checkout counter & receipt printing' },
    { role: 'ACCOUNTANT', label: 'Accountant', desc: 'Financial ledgers, P&L, balance sheets' },
    { role: 'SALESMAN', label: 'Route Salesman', desc: 'Customer routes, delivery invoices' },
    { role: 'WAREHOUSE_MANAGER', label: 'Warehouse In-charge', desc: 'Multi-warehouse stock, inward & transfers' },
    { role: 'DELIVERY_STAFF', label: 'Van Delivery Driver', desc: 'Dispatches, signatures & cash collection' },
    { role: 'SUPER_ADMIN', label: 'SaaS Super Admin', desc: 'Platform tenant controls & subscriptions' },
  ];

  const searchResults = searchQuery.trim()
    ? [
        ...products
          .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 4)
          .map((p) => ({ type: 'Product', title: p.name, subtitle: `${p.sku} • Stock: ${p.currentStock}`, action: () => setCurrentView('inventory') })),
        ...customers
          .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.company.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 4)
          .map((c) => ({ type: 'Customer', title: c.name, subtitle: `${c.company} • ${c.city}`, action: () => setCurrentView('customers') })),
      ]
    : [];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs backdrop-blur-md">
      <div className="px-4 sm:px-6 flex items-center justify-between h-16 gap-3">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 lg:hidden transition"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-indigo-500 text-white flex items-center justify-center font-black text-lg shadow-sm shadow-indigo-200 group-hover:scale-105 transition">
              B
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  BE SHAD <span className="text-indigo-600">TRADER</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  SaaS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-none hidden sm:block">
                Presented by Hayeshad Media
              </p>
            </div>
          </div>
        </div>

        {/* Center: Global Search & Shortcuts */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-2 relative">
          <div className="w-full relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100/80 hover:bg-slate-100 border border-transparent focus:border-indigo-400 focus:bg-white rounded-xl transition focus:outline-hidden"
            />
          </div>

          {/* Search Dropdown Results */}
          {isSearchOpen && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
              <div className="p-2 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Search Results</span>
                <button onClick={() => setIsSearchOpen(false)} className="text-xs hover:text-slate-800">Close</button>
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                {searchResults.map((res, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      res.action();
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="p-2.5 hover:bg-indigo-50/60 cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-800">{res.title}</span>
                      <p className="text-[11px] text-slate-500">{res.subtitle}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 font-medium text-slate-600">
                      {res.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right side controls: Tenant, Role, Language, Quick Actions, AI */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Action: POS */}
          <button
            onClick={() => setCurrentView('pos')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              currentView === 'pos'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>POS Billing</span>
          </button>

          {/* Quick Action: Field Order Taker */}
          <button
            onClick={() => setCurrentView('ordertaker')}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              currentView === 'ordertaker'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Order Taker</span>
          </button>

          {/* AI Copilot Button */}
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg text-xs font-medium shadow-xs shadow-indigo-200 transition"
            title="Ask AI Business Copilot"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">AI Copilot</span>
          </button>

          {/* Active Tenant Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setIsTenantMenuOpen(!isTenantMenuOpen);
                setIsRoleMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-800 rounded-lg text-xs font-medium transition border border-slate-200"
              title="Multi-tenant business switcher"
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span className="max-w-[100px] sm:max-w-[130px] truncate">{currentTenant.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isTenantMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Active SaaS Tenants
                </div>
                <div className="space-y-1">
                  {tenants.map((tItem) => (
                    <button
                      key={tItem.id}
                      onClick={() => {
                        switchTenant(tItem.id);
                        setIsTenantMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition ${
                        tItem.id === currentTenant.id
                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div>
                        <p className="font-medium truncate">{tItem.name}</p>
                        <p className="text-[10px] text-slate-400">{tItem.businessType}</p>
                      </div>
                      {tItem.id === currentTenant.id && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setCurrentView('superadmin');
                      setIsTenantMenuOpen(false);
                    }}
                    className="w-full text-center text-xs text-indigo-600 font-medium hover:underline p-1 flex items-center justify-center gap-1"
                  >
                    <span>Manage All Tenants</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Active Role Switcher (RBAC Tester) */}
          <div className="relative">
            <button
              onClick={() => {
                setIsRoleMenuOpen(!isRoleMenuOpen);
                setIsTenantMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-medium transition"
              title="Test RBAC security permissions"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline font-mono text-[11px]">{currentUser.role}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isRoleMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                  <span>Switch Role (Test RBAC)</span>
                  <span className="text-[10px] text-indigo-600 font-normal">Instant Switch</span>
                </div>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {rolesList.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        switchUserRole(r.role);
                        setIsRoleMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs flex items-start justify-between transition ${
                        currentUser.role === r.role
                          ? 'bg-amber-50/80 text-amber-950 font-semibold border border-amber-200'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold">{r.label}</span>
                          {r.role === 'ORDER_TAKER' && (
                            <span className="px-1.5 py-0.2 bg-rose-100 text-rose-700 text-[9px] rounded font-bold">
                              Restricted
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{r.desc}</p>
                      </div>
                      {currentUser.role === r.role && (
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Firebase Database Live Sync Pill */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition bg-slate-50 border-slate-200 text-slate-700"
            title={isFirestoreConnected ? "Connected to Cloud Firestore database" : "Connecting to Cloud Firestore..."}
          >
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${isFirestoreConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
              <span className="hidden xl:inline text-slate-600 font-semibold">Firestore</span>
            </span>
          </div>

          {/* Firebase Google Auth */}
          {firebaseUser ? (
            <div className="relative">
              <button
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                  setIsTenantMenuOpen(false);
                  setIsRoleMenuOpen(false);
                }}
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-lg text-xs font-medium transition border border-indigo-200"
                title="Google Account"
              >
                {firebaseUser.photoURL ? (
                  <img
                    src={firebaseUser.photoURL}
                    alt={firebaseUser.displayName || 'User'}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {(firebaseUser.displayName || firebaseUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden md:inline max-w-[100px] truncate text-[11px] font-semibold">
                  {firebaseUser.displayName || firebaseUser.email?.split('@')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-indigo-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                  <div className="p-2 border-b border-slate-100">
                    <p className="font-bold text-xs text-slate-800 truncate">
                      {firebaseUser.displayName || 'Google User'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{firebaseUser.email}</p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>Firebase Auth Active</span>
                    </div>
                  </div>
                  <div className="mt-1 space-y-1">
                    <button
                      onClick={() => {
                        logoutUser();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg text-xs flex items-center gap-2 text-rose-600 hover:bg-rose-50 transition font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out from Firebase</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={async () => {
                try {
                  setIsSigningIn(true);
                  await loginWithGoogle();
                } catch (e) {
                  console.error(e);
                } finally {
                  setIsSigningIn(false);
                }
              }}
              disabled={isSigningIn}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-xs transition hover:border-slate-400"
              title="Sign in with Google Account"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{isSigningIn ? 'Connecting...' : 'Google Login'}</span>
            </button>
          )}

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition text-xs font-bold"
            title="Switch Language (English / Urdu)"
          >
            {language === 'en' ? 'اردو' : 'EN'}
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={() => {
              if (window.confirm('Reset all tenant products, customers, and orders to fresh seed data?')) {
                resetToDemoData();
              }
            }}
            className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition hidden xl:block"
            title="Reset to fresh demo seed data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
