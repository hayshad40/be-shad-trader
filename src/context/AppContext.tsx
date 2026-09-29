import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Tenant,
  User,
  UserRole,
  RolePermissionConfig,
  ROLE_PERMISSIONS,
  Product,
  Customer,
  Supplier,
  Warehouse,
  SaleOrder,
  PurchaseRecord,
  StockMovement,
  ChartOfAccount,
  ExpenseRecord,
  DeliveryTask,
  SubscriptionPlan,
  AuditLog,
  SupportTicket,
  OrderStatus,
} from '../types';
import {
  SEED_TENANTS,
  SEED_USERS,
  SEED_WAREHOUSES,
  SEED_PRODUCTS,
  SEED_CUSTOMERS,
  SEED_SUPPLIERS,
  SEED_ORDERS,
  SEED_PURCHASES,
  SEED_STOCK_MOVEMENTS,
  SEED_ACCOUNTS,
  SEED_EXPENSES,
  SEED_DELIVERIES,
  SEED_PLANS,
  SEED_AUDIT_LOGS,
  SEED_TICKETS,
} from '../data/seedData';
import {
  auth,
  db,
  testConnection,
  signInWithGoogle,
  logOut,
  handleFirestoreError,
  OperationType,
  onAuthStateChanged,
  doc,
  setDoc,
  collection,
  onSnapshot,
} from '../firebase/config';
import { User as FirebaseUser } from 'firebase/auth';

// Multi-language translation dictionary (English & Urdu)
const TRANSLATIONS: Record<string, { en: string; ur: string }> = {
  dashboard: { en: 'Dashboard', ur: 'ڈیش بورڈ' },
  pos: { en: 'POS Counter', ur: 'پی او ایس کاؤنٹر' },
  sales_orders: { en: 'Sales & Distribution', ur: 'سیلز اور ڈسٹری بیوشن' },
  order_taker: { en: 'Field Order Taker', ur: 'فیلڈ آرڈر ٹیکر' },
  inventory: { en: 'Inventory & Warehouses', ur: 'انوینٹری اور گودام' },
  purchases: { en: 'Purchases & Inward', ur: 'خریداری اور سپلائرز' },
  customers: { en: 'Customers & CRM', ur: 'گاہک اور کسٹمر لیجر' },
  suppliers: { en: 'Suppliers & Payables', ur: 'سپلائرز اور واجبات' },
  accounting: { en: 'Accounting & Finance', ur: 'اکاؤنٹنگ اور مالیات' },
  expenses: { en: 'Expense Tracker', ur: 'اخراجات کا حساب' },
  deliveries: { en: 'Dispatch & Van Delivery', ur: 'ڈلیوری اور وین سپلائی' },
  reports: { en: 'Business Reports', ur: 'کاروباری رپورٹس' },
  settings: { en: 'Business Settings', ur: 'کاروباری سیٹنگز' },
  super_admin: { en: 'Super Admin SaaS', ur: 'سپر ایڈمن پینل' },
  landing: { en: 'Public Website', ur: 'ویب سائٹ' },
  today_sales: { en: "Today's Sales", ur: 'آج کی سیلز' },
  net_profit: { en: 'Estimated Profit', ur: 'خالص منافع' },
  receivables: { en: 'Outstanding Receivables', ur: 'وصول طلب رقم' },
  payables: { en: 'Outstanding Payables', ur: 'واجب الادا رقم' },
  current_stock: { en: 'Stock on Hand', ur: 'موجودہ اسٹاک' },
  low_stock_items: { en: 'Low Stock Alerts', ur: 'کم اسٹاک انتباہ' },
  search_placeholder: { en: 'Search products, invoices, customers...', ur: 'پروڈکٹس، انوائس یا گاہک تلاش کریں...' },
  switch_tenant: { en: 'Switch Business', ur: 'کاروبار تبدیل کریں' },
  switch_role: { en: 'Switch Role (Test RBAC)', ur: 'کردار تبدیل کریں' },
  new_order: { en: 'New Order', ur: 'نیا آرڈر' },
  new_sale: { en: 'New Sale', ur: 'نئی سیل' },
  quick_pos: { en: 'POS Billing', ur: 'فوری پی او ایس' },
  presented_by: { en: 'Presented by Hayeshad Media', ur: 'Presented by Hayeshad Media' },
};

interface AppContextType {
  // Navigation & View
  currentView: string;
  setCurrentView: (view: string) => void;
  language: 'en' | 'ur';
  setLanguage: (lang: 'en' | 'ur') => void;
  t: (key: string) => string;
  currency: string;
  setCurrency: (c: string) => void;
  formatMoney: (amount: number) => string;

  // Tenant Multi-tenancy
  currentTenant: Tenant;
  tenants: Tenant[];
  switchTenant: (tenantId: string) => void;
  createTenant: (data: Partial<Tenant>) => Tenant;
  updateTenant: (tenantId: string, updates: Partial<Tenant>) => void;
  updateTenantPlan: (tenantId: string, planId: string) => void;
  toggleTenantStatus: (tenantId: string) => void;

  // RBAC & Current User
  currentUser: User;
  users: User[];
  switchUserRole: (role: UserRole) => void;
  permissions: RolePermissionConfig;
  hasPermission: (perm: keyof RolePermissionConfig) => boolean;

  // Data Collections (Scoped to currentTenant)
  products: Product[];
  customers: Customer[];
  suppliers: Supplier[];
  warehouses: Warehouse[];
  orders: SaleOrder[];
  purchases: PurchaseRecord[];
  stockMovements: StockMovement[];
  accounts: ChartOfAccount[];
  expenses: ExpenseRecord[];
  deliveries: DeliveryTask[];
  plans: SubscriptionPlan[];
  auditLogs: AuditLog[];
  tickets: SupportTicket[];

  // Mutations
  createSalesOrder: (order: Partial<SaleOrder>) => SaleOrder;
  updateSalesOrder: (orderId: string, updates: Partial<SaleOrder>) => void;
  cancelPendingOrder: (orderId: string, reason?: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => void;
  processPOSCheckout: (
    items: any[],
    customerId: string,
    customerName: string,
    paymentMethod: 'cash' | 'card' | 'bank' | 'credit' | 'split',
    discountAmount: number
  ) => SaleOrder;
  createPurchase: (purchase: Partial<PurchaseRecord>) => PurchaseRecord;
  adjustStock: (productId: string, warehouseId: string, qtyChange: number, notes: string) => void;
  transferStock: (productId: string, fromWh: string, toWh: string, qty: number, notes?: string) => void;
  addExpense: (expense: Omit<ExpenseRecord, 'id' | 'tenantId'>) => void;
  addProduct: (product: Omit<Product, 'id' | 'tenantId'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'tenantId'>) => void;
  addSupplier: (supplier: Omit<Supplier, 'id' | 'tenantId'>) => void;
  receiveCustomerPayment: (customerId: string, amount: number, paymentMethod: string, notes?: string) => void;
  makeSupplierPayment: (supplierId: string, amount: number, paymentMethod: string, notes?: string) => void;
  updateDeliveryStatus: (deliveryId: string, status: DeliveryTask['status'], signature?: string, notes?: string) => void;
  createTicket: (subject: string, message: string, priority: SupportTicket['priority']) => void;
  resetToDemoData: () => void;

  // AI Assistant Modal
  isAIModalOpen: boolean;
  setIsAIModalOpen: (open: boolean) => void;
  activeOrderForPrint: SaleOrder | null;
  setActiveOrderForPrint: (order: SaleOrder | null) => void;

  // Firebase Auth & Cloud Firestore
  firebaseUser: FirebaseUser | null;
  isFirebaseAuthLoading: boolean;
  isFirestoreConnected: boolean;
  loginWithGoogle: () => Promise<void>;
  logoutUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'be_shad_trader_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state or defaults
  const [currentView, setCurrentView] = useState<string>('landing');
  const [language, setLanguageState] = useState<'en' | 'ur'>('en');
  const [currency, setCurrency] = useState<string>('PKR');
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [activeOrderForPrint, setActiveOrderForPrint] = useState<SaleOrder | null>(null);

  // Firebase Auth & Cloud Firestore State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isFirebaseAuthLoading, setIsFirebaseAuthLoading] = useState<boolean>(true);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(false);

  // Core entities state
  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tenants`);
    return saved ? JSON.parse(saved) : SEED_TENANTS;
  });

  const [currentTenantId, setCurrentTenantId] = useState<string>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_cur_tenant`) || 'tenant_beshad';
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : SEED_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_cur_user`) || 'user_owner';
  });

  const [warehouses, setWarehouses] = useState<Warehouse[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_warehouses`);
    return saved ? JSON.parse(saved) : SEED_WAREHOUSES;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_products`);
    return saved ? JSON.parse(saved) : SEED_PRODUCTS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_customers`);
    return saved ? JSON.parse(saved) : SEED_CUSTOMERS;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_suppliers`);
    return saved ? JSON.parse(saved) : SEED_SUPPLIERS;
  });

  const [orders, setOrders] = useState<SaleOrder[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_orders`);
    return saved ? JSON.parse(saved) : SEED_ORDERS;
  });

  const [purchases, setPurchases] = useState<PurchaseRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_purchases`);
    return saved ? JSON.parse(saved) : SEED_PURCHASES;
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sm`);
    return saved ? JSON.parse(saved) : SEED_STOCK_MOVEMENTS;
  });

  const [accounts, setAccounts] = useState<ChartOfAccount[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_accounts`);
    return saved ? JSON.parse(saved) : SEED_ACCOUNTS;
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_expenses`);
    return saved ? JSON.parse(saved) : SEED_EXPENSES;
  });

  const [deliveries, setDeliveries] = useState<DeliveryTask[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_deliveries`);
    return saved ? JSON.parse(saved) : SEED_DELIVERIES;
  });

  const [plans, setPlans] = useState<SubscriptionPlan[]>(SEED_PLANS);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
    return saved ? JSON.parse(saved) : SEED_AUDIT_LOGS;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tickets`);
    return saved ? JSON.parse(saved) : SEED_TICKETS;
  });

  // Keep local storage synced
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tenants`, JSON.stringify(tenants));
    localStorage.setItem(`${STORAGE_KEY}_cur_tenant`, currentTenantId);
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
    localStorage.setItem(`${STORAGE_KEY}_cur_user`, currentUserId);
    localStorage.setItem(`${STORAGE_KEY}_warehouses`, JSON.stringify(warehouses));
    localStorage.setItem(`${STORAGE_KEY}_products`, JSON.stringify(products));
    localStorage.setItem(`${STORAGE_KEY}_customers`, JSON.stringify(customers));
    localStorage.setItem(`${STORAGE_KEY}_suppliers`, JSON.stringify(suppliers));
    localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(orders));
    localStorage.setItem(`${STORAGE_KEY}_purchases`, JSON.stringify(purchases));
    localStorage.setItem(`${STORAGE_KEY}_sm`, JSON.stringify(stockMovements));
    localStorage.setItem(`${STORAGE_KEY}_accounts`, JSON.stringify(accounts));
    localStorage.setItem(`${STORAGE_KEY}_expenses`, JSON.stringify(expenses));
    localStorage.setItem(`${STORAGE_KEY}_deliveries`, JSON.stringify(deliveries));
    localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
    localStorage.setItem(`${STORAGE_KEY}_tickets`, JSON.stringify(tickets));
  }, [
    tenants,
    currentTenantId,
    users,
    currentUserId,
    warehouses,
    products,
    customers,
    suppliers,
    orders,
    purchases,
    stockMovements,
    accounts,
    expenses,
    deliveries,
    auditLogs,
    tickets,
  ]);

  // Firebase Firestore Connection Test & Realtime Auth Setup
  useEffect(() => {
    testConnection().then((connected) => {
      setIsFirestoreConnected(connected);
    });

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      setIsFirebaseAuthLoading(false);

      if (fbUser) {
        const email = fbUser.email || '';
        const isSuperAdminEmail = email.toLowerCase() === 'hayshad40@gmail.com';
        const role: UserRole = isSuperAdminEmail ? 'SUPER_ADMIN' : 'TENANT_OWNER';

        const updatedProfile: User = {
          id: fbUser.uid,
          tenantId: currentTenantId,
          name: fbUser.displayName || email.split('@')[0] || 'Authenticated User',
          email: email,
          role: role,
          phone: fbUser.phoneNumber || '+92 300 0000000',
          avatar: fbUser.photoURL || undefined,
          isActive: true,
        };

        setCurrentUserId(fbUser.uid);
        setUsers((prev) => {
          const exists = prev.find((u) => u.id === fbUser.uid);
          if (exists) {
            return prev.map((u) => (u.id === fbUser.uid ? { ...u, ...updatedProfile } : u));
          }
          return [updatedProfile, ...prev];
        });

        // Persist user profile to Firestore
        try {
          await setDoc(
            doc(db, 'users', fbUser.uid),
            {
              id: fbUser.uid,
              email: updatedProfile.email,
              name: updatedProfile.name,
              role: updatedProfile.role,
              tenantId: currentTenantId,
              phone: updatedProfile.phone,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (err) {
          console.warn('Could not sync user profile to firestore:', err);
        }

        // Attach realtime Firestore listener for orders
        const ordersCol = collection(db, 'orders');
        const unsubOrders = onSnapshot(
          ordersCol,
          (snapshot) => {
            if (!snapshot.empty) {
              const cloudOrders: SaleOrder[] = [];
              snapshot.forEach((d) => {
                cloudOrders.push(d.data() as SaleOrder);
              });
              setOrders((prev) => {
                const map = new Map<string, SaleOrder>();
                cloudOrders.forEach((o) => map.set(o.id, o));
                prev.forEach((o) => {
                  if (!map.has(o.id)) map.set(o.id, o);
                });
                return Array.from(map.values());
              });
            }
          },
          (error) => {
            handleFirestoreError(error, OperationType.LIST, 'orders');
          }
        );

        return () => {
          unsubOrders();
        };
      }
    });

    return () => unsubscribe();
  }, [currentTenantId]);

  const loginWithGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google Sign In error:', err);
      throw err;
    }
  };

  const logoutUser = async () => {
    try {
      await logOut();
      setFirebaseUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const persistDocToFirestore = async (col: string, id: string, data: any) => {
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, col, id), JSON.parse(JSON.stringify(data)), { merge: true });
      } catch (err) {
        console.warn(`Firestore sync write error on ${col}/${id}:`, err);
      }
    }
  };

  // Set RTL attribute on body when Urdu is selected
  const setLanguage = (lang: 'en' | 'ur') => {
    setLanguageState(lang);
    if (lang === 'ur') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ur');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'en');
    }
  };

  const t = (key: string): string => {
    if (TRANSLATIONS[key]) {
      return TRANSLATIONS[key][language] || TRANSLATIONS[key].en;
    }
    return key;
  };

  // Current active tenant
  const currentTenant =
    tenants.find((t) => t.id === currentTenantId) || tenants[0] || SEED_TENANTS[0];

  // Current active user
  const currentUser =
    users.find((u) => u.id === currentUserId) || users[0] || SEED_USERS[1];

  const permissions = ROLE_PERMISSIONS[currentUser.role] || ROLE_PERMISSIONS.SALESMAN;

  const hasPermission = (perm: keyof RolePermissionConfig): boolean => {
    return !!permissions[perm];
  };

  // Money formatting helper
  const formatMoney = (amount: number): string => {
    const symbol = currentTenant.currencySymbol || 'Rs.';
    return `${symbol} ${Number(amount || 0).toLocaleString('en-US', {
      maximumFractionDigits: 0,
    })}`;
  };

  // Switch role helper (for demonstration & permission verification)
  const switchUserRole = (newRole: UserRole) => {
    const matchingUser = users.find((u) => u.role === newRole);
    if (matchingUser) {
      setCurrentUserId(matchingUser.id);
    } else {
      // Temporarily update current user role
      const updatedUser: User = { ...currentUser, role: newRole };
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    }
    // Audit log
    logAction('Security & Roles', 'ROLE_SWITCH', `User switched to ${newRole}`);
  };

  const switchTenant = (tenantId: string) => {
    setCurrentTenantId(tenantId);
    logAction('Tenancy', 'TENANT_SWITCH', `Switched active tenant context to ${tenantId}`);
  };

  const logAction = (module: string, action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      tenantId: currentTenant.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      module,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 99)]);
  };

  // FILTERED COLLECTIONS FOR CURRENT TENANT
  // (Data isolation: Tenant A never sees Tenant B data!)
  const tenantProducts = products.filter(
    (p) => p.tenantId === currentTenant.id || currentTenant.id === 'tenant_beshad' // Fallback for initial demo seed
  );
  const tenantCustomers = customers.filter(
    (c) => c.tenantId === currentTenant.id || currentTenant.id === 'tenant_beshad'
  );
  const tenantSuppliers = suppliers.filter(
    (s) => s.tenantId === currentTenant.id || currentTenant.id === 'tenant_beshad'
  );
  const tenantWarehouses = warehouses.filter(
    (w) => w.tenantId === currentTenant.id || currentTenant.id === 'tenant_beshad'
  );
  const tenantOrders = orders.filter(
    (o) => o.tenantId === currentTenant.id || currentTenant.id === 'tenant_beshad'
  );
  const tenantPurchases = purchases.filter(
    (p) => p.tenantId === currentTenant.id || currentTenant.id === 'tenant_beshad'
  );
  const tenantStockMovements = stockMovements.filter(
    (sm) => sm.tenantId === currentTenant.id || currentTenant.id === 'tenant_beshad'
  );
  const tenantAccounts = accounts.filter(
    (a) => a.tenantId === currentTenant.id || currentTenant.id === 'tenant_beshad'
  );
  const tenantExpenses = expenses.filter(
    (e) => e.tenantId === currentTenant.id || currentTenant.id === 'tenant_beshad'
  );
  const tenantDeliveries = deliveries.filter(
    (d) => d.tenantId === currentTenant.id || currentTenant.id === 'tenant_beshad'
  );
  const tenantAuditLogs = auditLogs.filter(
    (l) => l.tenantId === currentTenant.id || currentTenant.id === 'tenant_beshad'
  );

  // MUTATION IMPLEMENTATIONS
  const createSalesOrder = (orderData: Partial<SaleOrder>): SaleOrder => {
    const orderSeq = 1000 + tenantOrders.length + 1;
    const orderNumber = `SO-${new Date().getFullYear()}-${orderSeq}`;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${orderSeq}`;

    const newOrder: SaleOrder = {
      id: `ord_${Date.now()}`,
      tenantId: currentTenant.id,
      orderNumber,
      invoiceNumber,
      type: orderData.type || 'sales_order',
      customerId: orderData.customerId || '',
      customerName: orderData.customerName || 'Walk-in Customer',
      customerPhone: orderData.customerPhone || '',
      customerArea: orderData.customerArea || '',
      warehouseId: orderData.warehouseId || tenantWarehouses[0]?.id || 'wh_main_lhr',
      salesmanId: orderData.salesmanId || currentUser.id,
      orderTakerId: currentUser.role === 'ORDER_TAKER' ? currentUser.id : undefined,
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      discountAmount: orderData.discountAmount || 0,
      taxAmount: orderData.taxAmount || 0,
      totalAmount: orderData.totalAmount || 0,
      paidAmount: orderData.paidAmount || 0,
      balanceAmount: (orderData.totalAmount || 0) - (orderData.paidAmount || 0),
      paymentStatus:
        (orderData.paidAmount || 0) >= (orderData.totalAmount || 0)
          ? 'paid'
          : (orderData.paidAmount || 0) > 0
          ? 'partial'
          : 'unpaid',
      paymentMethod: orderData.paymentMethod || 'cash',
      orderStatus: orderData.orderStatus || (currentUser.role === 'ORDER_TAKER' ? 'pending' : 'approved'),
      orderDate: new Date().toISOString().split('T')[0],
      dueDate: orderData.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      deliveryAddress: orderData.deliveryAddress || '',
      notes: orderData.notes || '',
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Deduct stock if order is approved or delivered
    if (newOrder.orderStatus === 'approved' || newOrder.orderStatus === 'delivered') {
      newOrder.items.forEach((item) => {
        deductProductStock(item.productId, newOrder.warehouseId, item.quantity, newOrder.orderNumber);
      });
    }

    // Update customer balance if unpaid/partial
    if (newOrder.customerId && newOrder.balanceAmount > 0) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === newOrder.customerId
            ? { ...c, currentBalance: c.currentBalance + newOrder.balanceAmount }
            : c
        )
      );
    }

    // Create automatic delivery task if dispatched or approved
    if (newOrder.orderStatus === 'approved' || newOrder.orderStatus === 'dispatched') {
      const newTask: DeliveryTask = {
        id: `del_${Date.now()}`,
        tenantId: currentTenant.id,
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        customerName: newOrder.customerName,
        customerPhone: newOrder.customerPhone || '',
        deliveryAddress: newOrder.deliveryAddress || 'Customer Address',
        area: newOrder.customerArea || 'City Area',
        amountToCollect: newOrder.balanceAmount,
        driverName: 'Hamza Javed (Van-08)',
        route: 'City Route',
        status: newOrder.orderStatus === 'dispatched' ? 'in_transit' : 'assigned',
        dispatchedAt: new Date().toISOString(),
      };
      setDeliveries((prev) => [newTask, ...prev]);
    }

    persistDocToFirestore('orders', newOrder.id, newOrder);
    logAction('Sales & Orders', 'CREATE_ORDER', `Created ${newOrder.orderNumber} for ${newOrder.customerName} (${formatMoney(newOrder.totalAmount)})`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, notes?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          // If moving to approved from pending, deduct stock now
          if (o.orderStatus === 'pending' && status === 'approved') {
            o.items.forEach((item) => {
              deductProductStock(item.productId, o.warehouseId, item.quantity, o.orderNumber);
            });
          }
          return { ...o, orderStatus: status, notes: notes ? `${o.notes || ''} | ${notes}` : o.notes };
        }
        return o;
      })
    );

    // Sync delivery status if relevant
    setDeliveries((prev) =>
      prev.map((d) => {
        if (d.orderId === orderId) {
          if (status === 'delivered') return { ...d, status: 'delivered', deliveredAt: new Date().toISOString() };
          if (status === 'dispatched') return { ...d, status: 'in_transit' };
        }
        return d;
      })
    );

    logAction('Sales & Orders', 'UPDATE_ORDER_STATUS', `Order ${orderId} updated to status: ${status}`);
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      persistDocToFirestore('orders', orderId, { ...targetOrder, orderStatus: status, notes: notes ? `${targetOrder.notes || ''} | ${notes}` : targetOrder.notes });
    }
  };

  const updateSalesOrder = (orderId: string, updates: Partial<SaleOrder>) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated: SaleOrder = { ...o, ...updates };
          if (updates.items) {
            const subtotal = updates.items.reduce((sum, item) => sum + item.total, 0);
            const discountAmount = updates.discountAmount !== undefined ? updates.discountAmount : o.discountAmount;
            const taxAmount = updates.taxAmount !== undefined ? updates.taxAmount : o.taxAmount;
            const totalAmount = Math.max(0, subtotal - discountAmount + taxAmount);
            const paidAmount = updates.paidAmount !== undefined ? updates.paidAmount : o.paidAmount;
            const balanceAmount = totalAmount - paidAmount;
            updated.subtotal = subtotal;
            updated.totalAmount = totalAmount;
            updated.balanceAmount = balanceAmount;
            updated.paymentStatus = paidAmount >= totalAmount ? 'paid' : paidAmount > 0 ? 'partial' : 'unpaid';
          }
          return updated;
        }
        return o;
      })
    );

    // Sync delivery amount if task exists
    if (updates.totalAmount !== undefined || updates.items) {
      setDeliveries((prev) =>
        prev.map((d) => {
          if (d.orderId === orderId) {
            const ord = tenantOrders.find((o) => o.id === orderId);
            const newTotal = updates.totalAmount !== undefined ? updates.totalAmount : (ord?.totalAmount || d.amountToCollect);
            return { ...d, amountToCollect: newTotal };
          }
          return d;
        })
      );
    }

    logAction('Sales & Orders', 'UPDATE_ORDER_DETAILS', `Field representative edited order ${orderId}`);
    const editedOrder = orders.find((o) => o.id === orderId);
    if (editedOrder) {
      persistDocToFirestore('orders', orderId, { ...editedOrder, ...updates });
    }
  };

  const cancelPendingOrder = (orderId: string, reason?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const cancelled = {
            ...o,
            orderStatus: 'cancelled' as OrderStatus,
            notes: `${o.notes ? o.notes + ' | ' : ''}Cancelled by field representative: ${reason || 'Customer request'}`,
          };
          persistDocToFirestore('orders', orderId, cancelled);
          return cancelled;
        }
        return o;
      })
    );
    setDeliveries((prev) =>
      prev.map((d) => (d.orderId === orderId ? { ...d, status: 'failed', notes: 'Cancelled by field rep' } : d))
    );
    logAction('Sales & Orders', 'CANCEL_ORDER', `Pending order ${orderId} cancelled before warehouse dispatch`);
  };

  const processPOSCheckout = (
    items: any[],
    customerId: string,
    customerName: string,
    paymentMethod: 'cash' | 'card' | 'bank' | 'credit' | 'split',
    discountAmount: number
  ): SaleOrder => {
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const totalAmount = Math.max(0, subtotal - discountAmount);
    const paidAmount = paymentMethod === 'credit' ? 0 : totalAmount;
    const balanceAmount = totalAmount - paidAmount;

    const receiptSeq = 100 + tenantOrders.length + 1;
    const receiptNumber = `POS-${new Date().getFullYear()}-${receiptSeq}`;

    const newSale: SaleOrder = {
      id: `pos_${Date.now()}`,
      tenantId: currentTenant.id,
      orderNumber: receiptNumber,
      invoiceNumber: receiptNumber,
      type: 'pos_sale',
      customerId: customerId || 'cust_walkin',
      customerName: customerName || 'Counter Retail Customer',
      warehouseId: tenantWarehouses[0]?.id || 'wh_main_lhr',
      salesmanId: currentUser.id,
      items: items.map((i) => ({
        productId: i.id,
        productName: i.name,
        sku: i.sku,
        quantity: i.quantity,
        unit: i.unit,
        unitPrice: i.salePrice || i.unitPrice,
        purchaseCost: i.purchasePrice,
        discountPercent: 0,
        taxPercent: 0,
        total: (i.salePrice || i.unitPrice) * i.quantity,
      })),
      subtotal,
      discountAmount,
      taxAmount: 0,
      totalAmount,
      paidAmount,
      balanceAmount,
      paymentStatus: paidAmount >= totalAmount ? 'paid' : balanceAmount === totalAmount ? 'unpaid' : 'partial',
      paymentMethod,
      orderStatus: 'delivered',
      orderDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newSale, ...prev]);

    // Deduct stock immediately
    items.forEach((item) => {
      deductProductStock(item.id, newSale.warehouseId, item.quantity, newSale.orderNumber);
    });

    // Update customer balance if credit sale
    if (customerId && balanceAmount > 0) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === customerId ? { ...c, currentBalance: c.currentBalance + balanceAmount } : c))
      );
    }

    logAction('POS Counter', 'POS_SALE', `Completed checkout ${receiptNumber} (${formatMoney(totalAmount)})`);
    setActiveOrderForPrint(newSale);
    return newSale;
  };

  const deductProductStock = (productId: string, warehouseId: string, quantity: number, refNumber: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const currentWhStock = p.warehouseStocks[warehouseId] || p.currentStock || 0;
          const newWhStock = Math.max(0, currentWhStock - quantity);
          const newTotalStock = Math.max(0, p.currentStock - quantity);

          // Add movement record
          const movement: StockMovement = {
            id: `sm_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            tenantId: currentTenant.id,
            productId: p.id,
            productName: p.name,
            sku: p.sku,
            type: 'sale',
            quantityChange: -quantity,
            newBalance: newTotalStock,
            warehouseId,
            warehouseName: tenantWarehouses.find((w) => w.id === warehouseId)?.name || 'Central Warehouse',
            referenceNumber: refNumber,
            notes: `Auto stock deduction for sales order/POS`,
            createdAt: new Date().toISOString(),
            createdBy: currentUser.name,
          };
          setStockMovements((smPrev) => [movement, ...smPrev]);

          return {
            ...p,
            currentStock: newTotalStock,
            warehouseStocks: { ...p.warehouseStocks, [warehouseId]: newWhStock },
          };
        }
        return p;
      })
    );
  };

  const createPurchase = (purchaseData: Partial<PurchaseRecord>): PurchaseRecord => {
    const poSeq = 500 + tenantPurchases.length + 1;
    const poNumber = `PO-${new Date().getFullYear()}-${poSeq}`;
    const newPO: PurchaseRecord = {
      id: `po_${Date.now()}`,
      tenantId: currentTenant.id,
      poNumber,
      supplierId: purchaseData.supplierId || '',
      supplierName: purchaseData.supplierName || 'General Supplier',
      warehouseId: purchaseData.warehouseId || tenantWarehouses[0]?.id || 'wh_main_lhr',
      items: purchaseData.items || [],
      subtotal: purchaseData.subtotal || 0,
      taxAmount: purchaseData.taxAmount || 0,
      totalAmount: purchaseData.totalAmount || 0,
      paidAmount: purchaseData.paidAmount || 0,
      paymentStatus:
        (purchaseData.paidAmount || 0) >= (purchaseData.totalAmount || 0)
          ? 'paid'
          : (purchaseData.paidAmount || 0) > 0
          ? 'partial'
          : 'unpaid',
      status: purchaseData.status || 'received',
      orderDate: new Date().toISOString().split('T')[0],
      notes: purchaseData.notes || '',
    };

    setPurchases((prev) => [newPO, ...prev]);

    // If marked received, add stock to product
    if (newPO.status === 'received') {
      newPO.items.forEach((item) => {
        setProducts((prev) =>
          prev.map((p) => {
            if (p.id === item.productId) {
              const currentWh = p.warehouseStocks[newPO.warehouseId] || 0;
              const newTotal = p.currentStock + item.quantity;
              return {
                ...p,
                currentStock: newTotal,
                warehouseStocks: { ...p.warehouseStocks, [newPO.warehouseId]: currentWh + item.quantity },
              };
            }
            return p;
          })
        );

        const movement: StockMovement = {
          id: `sm_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          tenantId: currentTenant.id,
          productId: item.productId,
          productName: item.productName,
          sku: item.sku,
          type: 'purchase',
          quantityChange: item.quantity,
          newBalance: 100, // estimated
          warehouseId: newPO.warehouseId,
          warehouseName: tenantWarehouses.find((w) => w.id === newPO.warehouseId)?.name || 'Central Warehouse',
          referenceNumber: newPO.poNumber,
          notes: `Goods Inward from ${newPO.supplierName}`,
          createdAt: new Date().toISOString(),
          createdBy: currentUser.name,
        };
        setStockMovements((smPrev) => [movement, ...smPrev]);
      });
    }

    logAction('Purchases', 'CREATE_PURCHASE', `Recorded PO ${newPO.poNumber} for ${newPO.supplierName} (${formatMoney(newPO.totalAmount)})`);
    return newPO;
  };

  const adjustStock = (productId: string, warehouseId: string, qtyChange: number, notes: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const currentWh = p.warehouseStocks[warehouseId] || 0;
          const newWh = Math.max(0, currentWh + qtyChange);
          const newTotal = Math.max(0, p.currentStock + qtyChange);

          const movement: StockMovement = {
            id: `sm_${Date.now()}`,
            tenantId: currentTenant.id,
            productId: p.id,
            productName: p.name,
            sku: p.sku,
            type: qtyChange < 0 ? 'damage' : 'adjustment',
            quantityChange: qtyChange,
            newBalance: newTotal,
            warehouseId,
            warehouseName: tenantWarehouses.find((w) => w.id === warehouseId)?.name || 'Warehouse',
            referenceNumber: `ADJ-${Date.now().toString().slice(-4)}`,
            notes,
            createdAt: new Date().toISOString(),
            createdBy: currentUser.name,
          };
          setStockMovements((smPrev) => [movement, ...smPrev]);

          return {
            ...p,
            currentStock: newTotal,
            warehouseStocks: { ...p.warehouseStocks, [warehouseId]: newWh },
          };
        }
        return p;
      })
    );
    logAction('Inventory', 'STOCK_ADJUSTMENT', `Adjusted stock by ${qtyChange} for product ${productId}. Note: ${notes}`);
  };

  const transferStock = (productId: string, fromWh: string, toWh: string, qty: number, notes?: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const fromWhStock = Math.max(0, (p.warehouseStocks[fromWh] || 0) - qty);
          const toWhStock = (p.warehouseStocks[toWh] || 0) + qty;

          const movement: StockMovement = {
            id: `sm_${Date.now()}`,
            tenantId: currentTenant.id,
            productId: p.id,
            productName: p.name,
            sku: p.sku,
            type: 'transfer',
            quantityChange: -qty,
            newBalance: p.currentStock,
            warehouseId: fromWh,
            warehouseName: tenantWarehouses.find((w) => w.id === fromWh)?.name || fromWh,
            toWarehouseId: toWh,
            toWarehouseName: tenantWarehouses.find((w) => w.id === toWh)?.name || toWh,
            referenceNumber: `TRF-${Date.now().toString().slice(-4)}`,
            notes: notes || 'Inter-warehouse stock transfer',
            createdAt: new Date().toISOString(),
            createdBy: currentUser.name,
          };
          setStockMovements((smPrev) => [movement, ...smPrev]);

          return {
            ...p,
            warehouseStocks: {
              ...p.warehouseStocks,
              [fromWh]: fromWhStock,
              [toWh]: toWhStock,
            },
          };
        }
        return p;
      })
    );
    logAction('Inventory', 'STOCK_TRANSFER', `Transferred ${qty} units of ${productId} from ${fromWh} to ${toWh}`);
  };

  const addExpense = (expenseData: Omit<ExpenseRecord, 'id' | 'tenantId'>) => {
    const newExp: ExpenseRecord = {
      ...expenseData,
      id: `exp_${Date.now()}`,
      tenantId: currentTenant.id,
    };
    setExpenses((prev) => [newExp, ...prev]);
    logAction('Expenses', 'ADD_EXPENSE', `Recorded expense: ${newExp.title} (${formatMoney(newExp.amount)})`);
  };

  const addProduct = (prodData: Omit<Product, 'id' | 'tenantId'>) => {
    const newProd: Product = {
      ...prodData,
      id: `prod_${Date.now()}`,
      tenantId: currentTenant.id,
    };
    setProducts((prev) => [newProd, ...prev]);
    logAction('Products', 'CREATE_PRODUCT', `Added new product: ${newProd.name} (${newProd.sku})`);
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, ...updates } : p)));
    logAction('Products', 'UPDATE_PRODUCT', `Updated product details for ${productId}`);
  };

  const addCustomer = (custData: Omit<Customer, 'id' | 'tenantId'>) => {
    const newCust: Customer = {
      ...custData,
      id: `cust_${Date.now()}`,
      tenantId: currentTenant.id,
    };
    setCustomers((prev) => [newCust, ...prev]);
    logAction('Customers', 'CREATE_CUSTOMER', `Registered customer: ${newCust.name} (${newCust.company})`);
  };

  const addSupplier = (supData: Omit<Supplier, 'id' | 'tenantId'>) => {
    const newSup: Supplier = {
      ...supData,
      id: `sup_${Date.now()}`,
      tenantId: currentTenant.id,
    };
    setSuppliers((prev) => [newSup, ...prev]);
    logAction('Suppliers', 'CREATE_SUPPLIER', `Registered supplier: ${newSup.name}`);
  };

  const receiveCustomerPayment = (customerId: string, amount: number, paymentMethod: string, notes?: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, currentBalance: Math.max(0, c.currentBalance - amount) } : c))
    );
    logAction('Payments', 'RECEIVE_PAYMENT', `Received ${formatMoney(amount)} from customer ${customerId} via ${paymentMethod}. Notes: ${notes || 'Ledger recovery'}`);
  };

  const makeSupplierPayment = (supplierId: string, amount: number, paymentMethod: string, notes?: string) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === supplierId ? { ...s, currentBalance: Math.max(0, s.currentBalance - amount) } : s))
    );
    logAction('Payments', 'SUPPLIER_PAYMENT', `Paid ${formatMoney(amount)} to supplier ${supplierId} via ${paymentMethod}`);
  };

  const updateDeliveryStatus = (
    deliveryId: string,
    status: DeliveryTask['status'],
    signature?: string,
    notes?: string
  ) => {
    setDeliveries((prev) =>
      prev.map((d) => {
        if (d.id === deliveryId) {
          const updated: DeliveryTask = {
            ...d,
            status,
            signature: signature || d.signature,
            notes: notes ? `${d.notes || ''} | ${notes}` : d.notes,
            deliveredAt: status === 'delivered' ? new Date().toISOString() : d.deliveredAt,
          };
          // Also sync related order status if delivered
          if (status === 'delivered') {
            updateOrderStatus(d.orderId, 'delivered', `Delivered by ${d.driverName}`);
          }
          return updated;
        }
        return d;
      })
    );
    logAction('Delivery', 'UPDATE_DELIVERY', `Delivery ${deliveryId} updated to ${status}`);
  };

  const createTenant = (data: Partial<Tenant>): Tenant => {
    const newTenant: Tenant = {
      id: `tenant_${Date.now()}`,
      name: data.name || 'New Enterprise Business',
      businessType: data.businessType || 'Distribution & Wholesale',
      slug: (data.name || 'new-business').toLowerCase().replace(/[^a-z0-9]/g, '-'),
      currency: data.currency || 'PKR',
      currencySymbol: data.currencySymbol || 'Rs.',
      phone: data.phone || '+92 300 0000000',
      email: data.email || 'admin@newbusiness.com',
      address: data.address || 'Commercial Plaza, Main Boulevard',
      city: data.city || 'Lahore',
      invoiceFooterText: 'Thank you for choosing us! Presented by Hayeshad Media.',
      planId: data.planId || 'plan_business',
      status: 'active',
      trialEndsAt: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      themeColor: data.themeColor || '#4f46e5',
    };
    setTenants((prev) => [...prev, newTenant]);
    switchTenant(newTenant.id);
    logAction('Super Admin', 'CREATE_TENANT', `Provisioned new multi-tenant organization: ${newTenant.name}`);
    return newTenant;
  };

  const updateTenant = (tenantId: string, updates: Partial<Tenant>) => {
    setTenants((prev) => prev.map((t) => (t.id === tenantId ? { ...t, ...updates } : t)));
    logAction('Settings', 'UPDATE_TENANT', `Updated business profile for ${tenantId}`);
  };

  const updateTenantPlan = (tenantId: string, planId: string) => {
    setTenants((prev) => prev.map((t) => (t.id === tenantId ? { ...t, planId, status: 'active' } : t)));
    logAction('Subscriptions', 'PLAN_CHANGE', `Tenant ${tenantId} changed plan to ${planId}`);
  };

  const toggleTenantStatus = (tenantId: string) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === tenantId) {
          const nextStatus = t.status === 'active' ? 'suspended' : 'active';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
    logAction('Super Admin', 'TENANT_STATUS_TOGGLE', `Tenant ${tenantId} status toggled`);
  };

  const createTicket = (subject: string, message: string, priority: SupportTicket['priority']) => {
    const newTicket: SupportTicket = {
      id: `tick_${Date.now()}`,
      tenantId: currentTenant.id,
      tenantName: currentTenant.name,
      userEmail: currentUser.email,
      subject,
      message,
      priority,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    setTickets((prev) => [newTicket, ...prev]);
    logAction('Support', 'CREATE_TICKET', `Ticket logged: ${subject}`);
  };

  const resetToDemoData = () => {
    localStorage.clear();
    setTenants(SEED_TENANTS);
    setCurrentTenantId('tenant_beshad');
    setUsers(SEED_USERS);
    setCurrentUserId('user_owner');
    setWarehouses(SEED_WAREHOUSES);
    setProducts(SEED_PRODUCTS);
    setCustomers(SEED_CUSTOMERS);
    setSuppliers(SEED_SUPPLIERS);
    setOrders(SEED_ORDERS);
    setPurchases(SEED_PURCHASES);
    setStockMovements(SEED_STOCK_MOVEMENTS);
    setAccounts(SEED_ACCOUNTS);
    setExpenses(SEED_EXPENSES);
    setDeliveries(SEED_DELIVERIES);
    setPlans(SEED_PLANS);
    setAuditLogs(SEED_AUDIT_LOGS);
    setTickets(SEED_TICKETS);
    setCurrentView('dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        language,
        setLanguage,
        t,
        currency,
        setCurrency,
        formatMoney,
        currentTenant,
        tenants,
        switchTenant,
        createTenant,
        updateTenant,
        updateTenantPlan,
        toggleTenantStatus,
        currentUser,
        users,
        switchUserRole,
        permissions,
        hasPermission,
        products: tenantProducts,
        customers: tenantCustomers,
        suppliers: tenantSuppliers,
        warehouses: tenantWarehouses,
        orders: tenantOrders,
        purchases: tenantPurchases,
        stockMovements: tenantStockMovements,
        accounts: tenantAccounts,
        expenses: tenantExpenses,
        deliveries: tenantDeliveries,
        plans,
        auditLogs: tenantAuditLogs,
        tickets,
        createSalesOrder,
        updateSalesOrder,
        cancelPendingOrder,
        updateOrderStatus,
        processPOSCheckout,
        createPurchase,
        adjustStock,
        transferStock,
        addExpense,
        addProduct,
        updateProduct,
        addCustomer,
        addSupplier,
        receiveCustomerPayment,
        makeSupplierPayment,
        updateDeliveryStatus,
        createTicket,
        resetToDemoData,
        isAIModalOpen,
        setIsAIModalOpen,
        activeOrderForPrint,
        setActiveOrderForPrint,
        firebaseUser,
        isFirebaseAuthLoading,
        isFirestoreConnected,
        loginWithGoogle,
        logoutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
