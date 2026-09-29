import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  ShoppingCart,
  Layers,
  Package,
  Truck,
  Users,
  Building,
  CreditCard,
  Receipt,
  FileText,
  BarChart3,
  Settings,
  ShieldCheck,
  Globe,
  Sparkles,
  ChevronRight,
  ClipboardList,
  Store,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentView, setCurrentView, currentUser, hasPermission, t, orders, products, deliveries } = useApp();

  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'pending').length;
  const lowStockCount = products.filter((p) => p.currentStock <= p.minStock).length;
  const activeDeliveriesCount = deliveries.filter((d) => d.status === 'in_transit' || d.status === 'assigned').length;

  // Granular menu items based on roles & permissions
  const menuItems = [
    {
      id: 'landing',
      label: t('landing'),
      icon: Globe,
      allowed: true,
      badge: 'Public',
      badgeColor: 'bg-slate-100 text-slate-600',
    },
    {
      id: 'dashboard',
      label: t('dashboard'),
      icon: LayoutDashboard,
      allowed: currentUser.role !== 'ORDER_TAKER' && currentUser.role !== 'DELIVERY_STAFF',
    },
    {
      id: 'pos',
      label: t('pos'),
      icon: ShoppingCart,
      allowed: hasPermission('canAccessPOS'),
      badge: 'Fast',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'ordertaker',
      label: t('order_taker'),
      icon: Store,
      allowed: true, // Everyone can test the field order taker view
      badge: 'Field Rep',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'orders',
      label: t('sales_orders'),
      icon: ClipboardList,
      allowed: hasPermission('canCreateSalesOrder') || hasPermission('canApproveSalesOrder'),
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : undefined,
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 'inventory',
      label: t('inventory'),
      icon: Package,
      allowed: currentUser.role !== 'ORDER_TAKER' && currentUser.role !== 'DELIVERY_STAFF',
      badge: lowStockCount > 0 ? `${lowStockCount} low` : undefined,
      badgeColor: 'bg-rose-100 text-rose-700 font-bold',
    },
    {
      id: 'purchases',
      label: t('purchases'),
      icon: Layers,
      allowed: hasPermission('canManagePurchases'),
    },
    {
      id: 'customers',
      label: t('customers'),
      icon: Users,
      allowed: currentUser.role !== 'DELIVERY_STAFF',
    },
    {
      id: 'suppliers',
      label: t('suppliers'),
      icon: Building,
      allowed: hasPermission('canManagePurchases') || hasPermission('canManageAccounting'),
    },
    {
      id: 'deliveries',
      label: t('deliveries'),
      icon: Truck,
      allowed: hasPermission('canManageDeliveries') || currentUser.role === 'DELIVERY_STAFF',
      badge: activeDeliveriesCount > 0 ? `${activeDeliveriesCount}` : undefined,
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'accounting',
      label: t('accounting'),
      icon: DollarSign,
      allowed: hasPermission('canManageAccounting') || hasPermission('canViewFinancials'),
    },
    {
      id: 'expenses',
      label: t('expenses'),
      icon: Receipt,
      allowed: hasPermission('canViewFinancials') || currentUser.role === 'MANAGER',
    },
    {
      id: 'reports',
      label: t('reports'),
      icon: BarChart3,
      allowed: hasPermission('canViewReports'),
    },
    {
      id: 'settings',
      label: t('settings'),
      icon: Settings,
      allowed: hasPermission('canManageSettings'),
    },
    {
      id: 'superadmin',
      label: t('super_admin'),
      icon: ShieldCheck,
      allowed: currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'TENANT_OWNER',
      badge: 'SaaS',
      badgeColor: 'bg-purple-100 text-purple-800 font-bold',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800`}
      >
        {/* Top Logo in Sidebar */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
          <div
            onClick={() => {
              setCurrentView('landing');
              onClose();
            }}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-base shadow-xs">
              B
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight">
                BE SHAD <span className="text-indigo-400">TRADER</span>
              </span>
              <p className="text-[10px] text-slate-400">ERP & Distribution Hub</p>
            </div>
          </div>
        </div>

        {/* Current User Role Notice */}
        <div className="px-4 py-3 mx-3 my-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Role</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                currentUser.role === 'ORDER_TAKER'
                  ? 'bg-amber-500/20 text-amber-300'
                  : currentUser.role === 'SUPER_ADMIN'
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'bg-emerald-500/20 text-emerald-300'
              }`}
            >
              {currentUser.role}
            </span>
          </div>
          <p className="text-xs font-medium text-white truncate mt-1">{currentUser.name}</p>
          {currentUser.role === 'ORDER_TAKER' && (
            <p className="text-[10px] text-amber-400/90 mt-1 font-medium leading-tight">
              Strict RBAC: Financials & Costs Hidden
            </p>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            if (!item.allowed) return null;
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition group ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${
                      item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Prominent Footer Credit in Sidebar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60">
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border border-indigo-900/40 text-center">
            <p className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">Presented by</p>
            <p className="text-xs font-extrabold text-white mt-0.5">Hayeshad Media</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Commercial SaaS v2.5</p>
          </div>
        </div>
      </aside>
    </>
  );
};
