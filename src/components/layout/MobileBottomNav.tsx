import React from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, ShoppingCart, Store, Package, Menu } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenSidebar: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenSidebar }) => {
  const { currentView, setCurrentView, currentUser } = useApp();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 lg:hidden shadow-lg">
      <div className="grid grid-cols-5 h-14">
        {/* Dashboard */}
        <button
          onClick={() => setCurrentView(currentUser.role === 'ORDER_TAKER' ? 'ordertaker' : 'dashboard')}
          className={`flex flex-col items-center justify-center gap-1 transition ${
            currentView === 'dashboard' || (currentUser.role === 'ORDER_TAKER' && currentView === 'ordertaker')
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* POS */}
        <button
          onClick={() => setCurrentView('pos')}
          className={`flex flex-col items-center justify-center gap-1 transition ${
            currentView === 'pos' ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="text-[10px]">POS</span>
        </button>

        {/* Order Taker */}
        <button
          onClick={() => setCurrentView('ordertaker')}
          className={`flex flex-col items-center justify-center gap-1 transition ${
            currentView === 'ordertaker' ? 'text-amber-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="p-1.5 -mt-3 rounded-full bg-amber-500 text-white shadow-md">
            <Store className="w-4 h-4" />
          </div>
          <span className="text-[10px]">Order Taker</span>
        </button>

        {/* Inventory */}
        <button
          onClick={() => setCurrentView('inventory')}
          className={`flex flex-col items-center justify-center gap-1 transition ${
            currentView === 'inventory' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span className="text-[10px]">Stock</span>
        </button>

        {/* More / Menu */}
        <button
          onClick={onOpenSidebar}
          className="flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-slate-800 transition"
        >
          <Menu className="w-4 h-4" />
          <span className="text-[10px]">Menu</span>
        </button>
      </div>
    </div>
  );
};
