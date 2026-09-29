import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { LandingPage } from './components/landing/LandingPage';
import { BusinessDashboard } from './components/dashboard/BusinessDashboard';
import { POSModule } from './components/pos/POSModule';
import { SalesManagement } from './components/sales/SalesManagement';
import { OrderTakerApp } from './components/sales/OrderTakerApp';
import { InventoryManagement } from './components/inventory/InventoryManagement';
import { PurchaseManagement } from './components/purchases/PurchaseManagement';
import { CustomerManagement } from './components/crm/CustomerManagement';
import { SupplierManagement } from './components/crm/SupplierManagement';
import { AccountingModule } from './components/accounting/AccountingModule';
import { ExpenseManagement } from './components/expenses/ExpenseManagement';
import { DeliveryManagement } from './components/delivery/DeliveryManagement';
import { ReportingCenter } from './components/reports/ReportingCenter';
import { SuperAdminPanel } from './components/superadmin/SuperAdminPanel';
import { BusinessSettings } from './components/settings/BusinessSettings';
import { PrintInvoiceModal } from './components/common/PrintInvoiceModal';
import { PrintReceiptModal } from './components/common/PrintReceiptModal';
import { AIAssistantModal } from './components/ai/AIAssistantModal';

const MainAppContent: React.FC = () => {
  const { currentView, activeOrderForPrint, setActiveOrderForPrint } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If on public landing page, show full-screen modern landing page
  if (currentView === 'landing') {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-1 relative">
        {/* Left Responsive Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 flex flex-col min-w-0 pb-16 lg:pb-6">
          <div className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
            {currentView === 'dashboard' && <BusinessDashboard />}
            {currentView === 'pos' && <POSModule />}
            {currentView === 'orders' && <SalesManagement />}
            {currentView === 'ordertaker' && <OrderTakerApp />}
            {currentView === 'inventory' && <InventoryManagement />}
            {currentView === 'purchases' && <PurchaseManagement />}
            {currentView === 'customers' && <CustomerManagement />}
            {currentView === 'suppliers' && <SupplierManagement />}
            {currentView === 'accounting' && <AccountingModule />}
            {currentView === 'expenses' && <ExpenseManagement />}
            {currentView === 'deliveries' && <DeliveryManagement />}
            {currentView === 'reports' && <ReportingCenter />}
            {currentView === 'superadmin' && <SuperAdminPanel />}
            {currentView === 'settings' && <BusinessSettings />}
          </div>

          {/* Persistent Footer in App */}
          <footer className="mt-auto px-6 py-4 border-t border-slate-200 text-center text-xs text-slate-500 bg-white hidden lg:block">
            <span>Be Shad Trader Distribution & Accounting Platform</span>
            <span className="mx-2">•</span>
            <span className="font-semibold text-indigo-700">Presented by Hayeshad Media</span>
            <span className="mx-2">•</span>
            <span>All Rights Reserved © 2026</span>
          </footer>
        </main>
      </div>

      {/* Mobile Bottom Navigation for Smartphones */}
      <MobileBottomNav onOpenSidebar={() => setIsSidebarOpen(true)} />

      {/* Global Modals */}
      {activeOrderForPrint && activeOrderForPrint.type === 'pos_sale' && (
        <PrintReceiptModal
          order={activeOrderForPrint}
          onClose={() => setActiveOrderForPrint(null)}
        />
      )}

      {activeOrderForPrint && activeOrderForPrint.type !== 'pos_sale' && (
        <PrintInvoiceModal
          order={activeOrderForPrint}
          onClose={() => setActiveOrderForPrint(null)}
        />
      )}

      <AIAssistantModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
