export type UserRole =
  | 'SUPER_ADMIN'
  | 'TENANT_OWNER'
  | 'BUSINESS_ADMIN'
  | 'MANAGER'
  | 'ACCOUNTANT'
  | 'SALES_MANAGER'
  | 'SALESMAN'
  | 'ORDER_TAKER'
  | 'WAREHOUSE_MANAGER'
  | 'WAREHOUSE_STAFF'
  | 'CASHIER'
  | 'DELIVERY_STAFF'
  | 'REPORT_VIEWER';

export interface RolePermissionConfig {
  canViewFinancials: boolean;        // Profit, total revenue, balance sheet
  canViewPurchaseCosts: boolean;     // Cost of goods, purchase price
  canViewStockValuation: boolean;    // Total inventory value in currency
  canManageProducts: boolean;
  canManageInventory: boolean;
  canCreateSalesOrder: boolean;
  canApproveSalesOrder: boolean;
  canAccessPOS: boolean;
  canManagePurchases: boolean;
  canManageAccounting: boolean;
  canManageDeliveries: boolean;
  canViewReports: boolean;
  canManageSettings: boolean;
  canAccessSuperAdmin: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissionConfig> = {
  SUPER_ADMIN: {
    canViewFinancials: true,
    canViewPurchaseCosts: true,
    canViewStockValuation: true,
    canManageProducts: true,
    canManageInventory: true,
    canCreateSalesOrder: true,
    canApproveSalesOrder: true,
    canAccessPOS: true,
    canManagePurchases: true,
    canManageAccounting: true,
    canManageDeliveries: true,
    canViewReports: true,
    canManageSettings: true,
    canAccessSuperAdmin: true,
  },
  TENANT_OWNER: {
    canViewFinancials: true,
    canViewPurchaseCosts: true,
    canViewStockValuation: true,
    canManageProducts: true,
    canManageInventory: true,
    canCreateSalesOrder: true,
    canApproveSalesOrder: true,
    canAccessPOS: true,
    canManagePurchases: true,
    canManageAccounting: true,
    canManageDeliveries: true,
    canViewReports: true,
    canManageSettings: true,
    canAccessSuperAdmin: false,
  },
  BUSINESS_ADMIN: {
    canViewFinancials: true,
    canViewPurchaseCosts: true,
    canViewStockValuation: true,
    canManageProducts: true,
    canManageInventory: true,
    canCreateSalesOrder: true,
    canApproveSalesOrder: true,
    canAccessPOS: true,
    canManagePurchases: true,
    canManageAccounting: true,
    canManageDeliveries: true,
    canViewReports: true,
    canManageSettings: true,
    canAccessSuperAdmin: false,
  },
  MANAGER: {
    canViewFinancials: true,
    canViewPurchaseCosts: true,
    canViewStockValuation: true,
    canManageProducts: true,
    canManageInventory: true,
    canCreateSalesOrder: true,
    canApproveSalesOrder: true,
    canAccessPOS: true,
    canManagePurchases: true,
    canManageAccounting: false,
    canManageDeliveries: true,
    canViewReports: true,
    canManageSettings: false,
    canAccessSuperAdmin: false,
  },
  ACCOUNTANT: {
    canViewFinancials: true,
    canViewPurchaseCosts: true,
    canViewStockValuation: true,
    canManageProducts: false,
    canManageInventory: false,
    canCreateSalesOrder: false,
    canApproveSalesOrder: true,
    canAccessPOS: false,
    canManagePurchases: true,
    canManageAccounting: true,
    canManageDeliveries: false,
    canViewReports: true,
    canManageSettings: false,
    canAccessSuperAdmin: false,
  },
  SALES_MANAGER: {
    canViewFinancials: false,
    canViewPurchaseCosts: false,
    canViewStockValuation: false,
    canManageProducts: true,
    canManageInventory: false,
    canCreateSalesOrder: true,
    canApproveSalesOrder: true,
    canAccessPOS: true,
    canManagePurchases: false,
    canManageAccounting: false,
    canManageDeliveries: true,
    canViewReports: true,
    canManageSettings: false,
    canAccessSuperAdmin: false,
  },
  SALESMAN: {
    canViewFinancials: false,
    canViewPurchaseCosts: false,
    canViewStockValuation: false,
    canManageProducts: false,
    canManageInventory: false,
    canCreateSalesOrder: true,
    canApproveSalesOrder: false,
    canAccessPOS: true,
    canManagePurchases: false,
    canManageAccounting: false,
    canManageDeliveries: false,
    canViewReports: false,
    canManageSettings: false,
    canAccessSuperAdmin: false,
  },
  // ORDER TAKER: STRICT ZERO-FINANCIAL ACCESS
  ORDER_TAKER: {
    canViewFinancials: false,
    canViewPurchaseCosts: false,
    canViewStockValuation: false,
    canManageProducts: false,
    canManageInventory: false,
    canCreateSalesOrder: true,
    canApproveSalesOrder: false,
    canAccessPOS: false,
    canManagePurchases: false,
    canManageAccounting: false,
    canManageDeliveries: false,
    canViewReports: false,
    canManageSettings: false,
    canAccessSuperAdmin: false,
  },
  WAREHOUSE_MANAGER: {
    canViewFinancials: false,
    canViewPurchaseCosts: false,
    canViewStockValuation: false,
    canManageProducts: true,
    canManageInventory: true,
    canCreateSalesOrder: false,
    canApproveSalesOrder: false,
    canAccessPOS: false,
    canManagePurchases: true,
    canManageAccounting: false,
    canManageDeliveries: true,
    canViewReports: false,
    canManageSettings: false,
    canAccessSuperAdmin: false,
  },
  WAREHOUSE_STAFF: {
    canViewFinancials: false,
    canViewPurchaseCosts: false,
    canViewStockValuation: false,
    canManageProducts: false,
    canManageInventory: true,
    canCreateSalesOrder: false,
    canApproveSalesOrder: false,
    canAccessPOS: false,
    canManagePurchases: false,
    canManageAccounting: false,
    canManageDeliveries: false,
    canViewReports: false,
    canManageSettings: false,
    canAccessSuperAdmin: false,
  },
  CASHIER: {
    canViewFinancials: false,
    canViewPurchaseCosts: false,
    canViewStockValuation: false,
    canManageProducts: false,
    canManageInventory: false,
    canCreateSalesOrder: true,
    canApproveSalesOrder: false,
    canAccessPOS: true,
    canManagePurchases: false,
    canManageAccounting: false,
    canManageDeliveries: false,
    canViewReports: false,
    canManageSettings: false,
    canAccessSuperAdmin: false,
  },
  DELIVERY_STAFF: {
    canViewFinancials: false,
    canViewPurchaseCosts: false,
    canViewStockValuation: false,
    canManageProducts: false,
    canManageInventory: false,
    canCreateSalesOrder: false,
    canApproveSalesOrder: false,
    canAccessPOS: false,
    canManagePurchases: false,
    canManageAccounting: false,
    canManageDeliveries: true,
    canViewReports: false,
    canManageSettings: false,
    canAccessSuperAdmin: false,
  },
  REPORT_VIEWER: {
    canViewFinancials: true,
    canViewPurchaseCosts: true,
    canViewStockValuation: true,
    canManageProducts: false,
    canManageInventory: false,
    canCreateSalesOrder: false,
    canApproveSalesOrder: false,
    canAccessPOS: false,
    canManagePurchases: false,
    canManageAccounting: false,
    canManageDeliveries: false,
    canViewReports: true,
    canManageSettings: false,
    canAccessSuperAdmin: false,
  },
};

export interface Tenant {
  id: string;
  name: string;
  businessType: string;
  slug: string;
  logo?: string;
  currency: string;
  currencySymbol: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  taxNumber?: string;
  invoiceFooterText: string;
  planId: string;
  status: 'active' | 'trial' | 'suspended' | 'expired';
  trialEndsAt: string;
  createdAt: string;
  themeColor: string;
}

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  assignedWarehouseId?: string;
  assignedRoute?: string;
  isActive: boolean;
}

export interface Warehouse {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  city: string;
  address: string;
  isMain: boolean;
}

export interface Product {
  id: string;
  tenantId: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  brand: string;
  unit: string; // e.g. "Pcs", "Carton", "Box", "Kg"
  purchasePrice: number;
  salePrice: number;
  wholesalePrice: number;
  retailPrice: number;
  minStock: number;
  currentStock: number;
  warehouseStocks: Record<string, number>; // warehouseId -> stock
  status: 'active' | 'inactive';
  description?: string;
  image?: string;
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  company: string;
  phone: string;
  whatsapp?: string;
  email: string;
  address: string;
  city: string;
  area: string;
  route?: string;
  creditLimit: number;
  openingBalance: number;
  currentBalance: number;
  assignedSalesmanId?: string;
  latitude?: number;
  longitude?: number;
}

export interface Supplier {
  id: string;
  tenantId: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  openingBalance: number;
  currentBalance: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  purchaseCost?: number; // Hidden from order taker
  discountPercent: number;
  taxPercent: number;
  total: number;
}

export type OrderStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'picking'
  | 'packed'
  | 'dispatched'
  | 'delivered'
  | 'partially_delivered'
  | 'cancelled'
  | 'returned';

export type PaymentStatus = 'paid' | 'partial' | 'unpaid';

export interface SaleOrder {
  id: string;
  tenantId: string;
  orderNumber: string;
  invoiceNumber?: string;
  type: 'sales_order' | 'quotation' | 'invoice' | 'pos_sale' | 'sale_return';
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerArea?: string;
  warehouseId: string;
  salesmanId?: string;
  orderTakerId?: string;
  deliveryDriverId?: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: 'cash' | 'card' | 'bank' | 'credit' | 'split';
  orderStatus: OrderStatus;
  orderDate: string;
  dueDate?: string;
  deliveryAddress?: string;
  notes?: string;
  proofSignature?: string;
  createdAt: string;
}

export interface PurchaseRecord {
  id: string;
  tenantId: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  warehouseId: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  status: 'ordered' | 'received' | 'partial' | 'returned';
  orderDate: string;
  expectedDate?: string;
  notes?: string;
}

export type StockMovementType =
  | 'purchase'
  | 'sale'
  | 'sale_return'
  | 'purchase_return'
  | 'transfer'
  | 'adjustment'
  | 'damage'
  | 'opening_stock';

export interface StockMovement {
  id: string;
  tenantId: string;
  productId: string;
  productName: string;
  sku: string;
  type: StockMovementType;
  quantityChange: number; // positive or negative
  newBalance: number;
  warehouseId: string;
  warehouseName: string;
  toWarehouseId?: string;
  toWarehouseName?: string;
  referenceNumber: string; // Order #, PO #, Transfer #
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface ChartOfAccount {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  category: string;
  balance: number;
  isSystem?: boolean;
}

export interface JournalEntry {
  id: string;
  tenantId: string;
  date: string;
  referenceNumber: string;
  description: string;
  debitAccountId: string;
  debitAccountName: string;
  creditAccountId: string;
  creditAccountName: string;
  amount: number;
  createdBy: string;
}

export interface ExpenseRecord {
  id: string;
  tenantId: string;
  title: string;
  category: 'rent' | 'electricity' | 'fuel' | 'salary' | 'transport' | 'maintenance' | 'marketing' | 'office' | 'other';
  amount: number;
  paymentMethod: 'cash' | 'bank' | 'card';
  date: string;
  paidTo?: string;
  approvedBy?: string;
  notes?: string;
}

export interface DeliveryTask {
  id: string;
  tenantId: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  area: string;
  amountToCollect: number;
  driverName: string;
  route: string;
  status: 'assigned' | 'in_transit' | 'delivered' | 'partially_delivered' | 'failed';
  dispatchedAt: string;
  deliveredAt?: string;
  notes?: string;
  signature?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  userLimit: number;
  warehouseLimit: number;
  productLimit: number;
  invoiceLimit: number;
  hasAccounting: boolean;
  hasMultiBranch: boolean;
  hasApi: boolean;
  hasCustomBranding: boolean;
  badge?: string;
  description: string;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  module: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface SupportTicket {
  id: string;
  tenantId: string;
  tenantName: string;
  userEmail: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}
