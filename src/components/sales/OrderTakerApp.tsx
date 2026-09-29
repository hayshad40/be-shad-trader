import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, Customer, SaleOrder, OrderItem } from '../../types';
import {
  Store,
  Search,
  Plus,
  Minus,
  CheckCircle2,
  Clock,
  Send,
  MapPin,
  Phone,
  Layers,
  ChevronRight,
  ShieldCheck,
  Package,
  Edit3,
  Trash2,
  Lock,
  X,
  AlertCircle,
  XCircle,
  Save,
  Check,
  Truck,
  Map,
  List,
  LayoutGrid,
  TrendingUp,
  BarChart2,
  Printer,
  CheckSquare,
  Download,
  FileSpreadsheet,
  UserPlus,
  ShoppingBag,
  ArrowLeft,
  Tag,
  CreditCard,
  AlertTriangle,
} from 'lucide-react';
import { CustomerRouteMap } from './CustomerRouteMap';
import { SalesVolumeTrendChart } from './SalesVolumeTrendChart';
import { PrintInvoiceModal } from '../common/PrintInvoiceModal';

// Order Status Stepper Helper
const getOrderStatusStep = (status: SaleOrder['orderStatus']): { currentStep: number; isCancelled: boolean } => {
  if (status === 'cancelled') return { currentStep: 0, isCancelled: true };
  if (status === 'pending' || status === 'draft') return { currentStep: 1, isCancelled: false };
  if (status === 'approved' || status === 'picking' || status === 'packed') return { currentStep: 2, isCancelled: false };
  if (status === 'dispatched') return { currentStep: 3, isCancelled: false };
  if (status === 'delivered') return { currentStep: 4, isCancelled: false };
  return { currentStep: 1, isCancelled: false };
};

interface OrderStatusStepperProps {
  status: SaleOrder['orderStatus'];
}

const OrderStatusStepper: React.FC<OrderStatusStepperProps> = ({ status }) => {
  const { currentStep, isCancelled } = getOrderStatusStep(status);

  if (isCancelled) {
    return (
      <div className="mt-3 py-2 px-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-800">
        <div className="flex items-center gap-2">
          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-bold">Order Cancelled</span>
          <span className="text-[11px] text-rose-600">• Booking voided prior to warehouse fulfillment</span>
        </div>
      </div>
    );
  }

  const steps = [
    {
      id: 1,
      title: 'Pending',
      subtitle: 'Field Booked',
      icon: Clock,
      activeColor: 'bg-amber-500 text-white ring-4 ring-amber-100',
    },
    {
      id: 2,
      title: 'Warehouse Picking',
      subtitle: 'Stock Allocated',
      icon: Package,
      activeColor: 'bg-indigo-600 text-white ring-4 ring-indigo-100',
    },
    {
      id: 3,
      title: 'Dispatched',
      subtitle: 'On Delivery Van',
      icon: Truck,
      activeColor: 'bg-blue-600 text-white ring-4 ring-blue-100',
    },
    {
      id: 4,
      title: 'Delivered',
      subtitle: 'Signed & Confirmed',
      icon: CheckCircle2,
      activeColor: 'bg-emerald-600 text-white ring-4 ring-emerald-100',
    },
  ];

  const getStatusSummary = () => {
    switch (currentStep) {
      case 1:
        return 'Step 1/4: Awaiting Warehouse Credit & Packing Approval (Editable by Rep)';
      case 2:
        return 'Step 2/4: Warehouse Picking & Allocation in Progress at Central Depot';
      case 3:
        return 'Step 3/4: Order Dispatched with Delivery Van — Route en route';
      case 4:
        return 'Step 4/4: Order Fully Delivered & Customer Signature Recorded';
      default:
        return '';
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-slate-200/80 bg-slate-50/50 rounded-xl p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
          <span>Fulfillment Progress Tracker</span>
        </span>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            currentStep === 4
              ? 'bg-emerald-100 text-emerald-800'
              : currentStep === 3
              ? 'bg-blue-100 text-blue-800'
              : currentStep === 2
              ? 'bg-indigo-100 text-indigo-800'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {getStatusSummary()}
        </span>
      </div>

      <div className="relative">
        {/* Track Line behind steps */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />
        {/* Completed Progress fill */}
        <div
          className="absolute top-4 left-6 h-0.5 bg-emerald-500 transition-all duration-500 -z-0"
          style={{
            width:
              currentStep === 1
                ? '0%'
                : currentStep === 2
                ? '33%'
                : currentStep === 3
                ? '66%'
                : 'calc(100% - 3rem)',
          }}
        />

        <div className="grid grid-cols-4 gap-1 relative z-10">
          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex flex-col items-center text-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 font-bold text-xs ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isCurrent
                      ? step.activeColor
                      : 'bg-white border-2 border-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-4 h-4" />}
                </div>

                <div className="mt-1.5 px-0.5">
                  <p
                    className={`text-[11px] font-bold leading-tight ${
                      isCurrent
                        ? 'text-slate-900'
                        : isCompleted
                        ? 'text-emerald-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-[9px] text-slate-500 hidden sm:block mt-0.5 font-medium leading-none">
                    {step.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const OrderTakerApp: React.FC = () => {
  const {
    customers,
    products,
    orders,
    createSalesOrder,
    updateSalesOrder,
    cancelPendingOrder,
    addCustomer,
    currentUser,
    formatMoney,
  } = useApp();

  const [activeStep, setActiveStep] = useState<'customer' | 'catalog' | 'review'>('customer');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(customers[0] || null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerViewMode, setCustomerViewMode] = useState<'map' | 'list' | 'split'>('map');
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<string>('All');
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [orderItems, setOrderItems] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [orderNotes, setOrderNotes] = useState('');
  const [orderPaymentTerms, setOrderPaymentTerms] = useState<'cod' | 'credit_7' | 'credit_15' | 'credit_30' | 'advance'>('cod');
  const [orderDiscountType, setOrderDiscountType] = useState<'flat' | 'percent'>('flat');
  const [orderDiscountValue, setOrderDiscountValue] = useState<number>(0);
  const [deliverySchedule, setDeliverySchedule] = useState<'today_evening' | 'tomorrow_morning' | 'custom'>('tomorrow_morning');
  const [customDeliveryDate, setCustomDeliveryDate] = useState<string>('');
  const [submittedOrderNumber, setSubmittedOrderNumber] = useState<string | null>(null);
  const [lastSubmittedOrder, setLastSubmittedOrder] = useState<SaleOrder | null>(null);

  // New Outlet Registration state
  const [isAddOutletOpen, setIsAddOutletOpen] = useState(false);
  const [newOutletName, setNewOutletName] = useState('');
  const [newOutletCompany, setNewOutletCompany] = useState('');
  const [newOutletPhone, setNewOutletPhone] = useState('');
  const [newOutletArea, setNewOutletArea] = useState('Shah Alam Market');
  const [newOutletAddress, setNewOutletAddress] = useState('');
  const [newOutletCreditLimit, setNewOutletCreditLimit] = useState(50000);
  const [outletCreatedNotice, setOutletCreatedNotice] = useState<string | null>(null);

  // Cancel Pending Order in-app confirmation modal
  const [orderToCancel, setOrderToCancel] = useState<SaleOrder | null>(null);
  const [cancelReason, setCancelReason] = useState('Customer requested order cancellation or quantity change');
  const [editModalWarning, setEditModalWarning] = useState<string | null>(null);

  // Recent bookings filter and editing state
  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'processed'>('all');
  const [showSalesTrend, setShowSalesTrend] = useState<boolean>(true);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [selectedPendingOrderIds, setSelectedPendingOrderIds] = useState<string[]>([]);
  const [bulkOrdersToPrint, setBulkOrdersToPrint] = useState<SaleOrder[] | null>(null);
  const [csvExportNotification, setCsvExportNotification] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<SaleOrder | null>(null);
  const [editItems, setEditItems] = useState<OrderItem[]>([]);
  const [editNotes, setEditNotes] = useState('');
  const [editAddProductId, setEditAddProductId] = useState<string>(products[0]?.id || '');
  const [editNotification, setEditNotification] = useState<string | null>(null);

  // Field rep view: only active customer routes
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.company.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.area.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const updateItemQty = (product: Product, change: number) => {
    setOrderItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        const nextQty = existing.quantity + change;
        if (nextQty <= 0) return prev.filter((i) => i.product.id !== product.id);
        return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: nextQty } : i));
      }
      if (change > 0) {
        return [...prev, { product, quantity: 1 }];
      }
      return prev;
    });
  };

  const setItemExactQty = (product: Product, qty: number) => {
    setOrderItems((prev) => {
      if (qty <= 0) return prev.filter((i) => i.product.id !== product.id);
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: qty } : i));
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const getItemQty = (productId: string) => {
    return orderItems.find((i) => i.product.id === productId)?.quantity || 0;
  };

  const subtotal = orderItems.reduce(
    (sum, i) => sum + (i.product.wholesalePrice || i.product.salePrice) * i.quantity,
    0
  );

  const calculatedDiscountAmount =
    orderDiscountType === 'percent'
      ? Math.round((subtotal * Math.min(100, Math.max(0, orderDiscountValue))) / 100)
      : Math.min(subtotal, Math.max(0, orderDiscountValue));

  const finalTotalAmount = Math.max(0, subtotal - calculatedDiscountAmount);

  const handleRegisterNewOutlet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOutletName.trim()) return;

    const newCust: Omit<Customer, 'id' | 'tenantId'> = {
      name: newOutletName.trim(),
      company: newOutletCompany.trim() || newOutletName.trim(),
      phone: newOutletPhone.trim() || '+92 300 0000000',
      email: '',
      address: newOutletAddress.trim() || `${newOutletArea}, Lahore`,
      city: 'Lahore',
      area: newOutletArea.trim() || 'Shah Alam Market',
      route: newOutletArea.trim() || 'Shah Alam Market',
      creditLimit: Number(newOutletCreditLimit) || 50000,
      openingBalance: 0,
      currentBalance: 0,
      latitude: 31.582,
      longitude: 74.329,
    };

    addCustomer(newCust);
    const createdCustomerObj: Customer = {
      ...newCust,
      id: `cust_${Date.now()}`,
      tenantId: 'tenant_beshad',
    };
    setSelectedCustomer(createdCustomerObj);
    setIsAddOutletOpen(false);
    setOutletCreatedNotice(`Outlet "${newOutletName}" successfully registered on route!`);
    setNewOutletName('');
    setNewOutletCompany('');
    setNewOutletPhone('');
    setNewOutletAddress('');

    setTimeout(() => {
      setOutletCreatedNotice(null);
    }, 4000);
  };

  const handleSubmitOrder = () => {
    if (!selectedCustomer || orderItems.length === 0) return;

    const items = orderItems.map((i) => {
      const price = i.product.wholesalePrice || i.product.salePrice;
      return {
        productId: i.product.id,
        productName: i.product.name,
        sku: i.product.sku,
        quantity: i.quantity,
        unit: i.product.unit,
        unitPrice: price,
        discountPercent: 0,
        taxPercent: 0,
        total: price * i.quantity,
      };
    });

    const dueDateVal =
      orderPaymentTerms === 'credit_7'
        ? new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
        : orderPaymentTerms === 'credit_15'
        ? new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
        : orderPaymentTerms === 'credit_30'
        ? new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

    const termsLabel =
      orderPaymentTerms === 'cod'
        ? 'Cash on Delivery (COD)'
        : orderPaymentTerms === 'credit_7'
        ? '7 Days Credit'
        : orderPaymentTerms === 'credit_15'
        ? '15 Days Credit'
        : orderPaymentTerms === 'credit_30'
        ? '30 Days Credit'
        : 'Advance Payment Received';

    const deliveryScheduleText =
      deliverySchedule === 'today_evening'
        ? 'Urgent Evening Dispatch'
        : deliverySchedule === 'tomorrow_morning'
        ? 'Next Morning Routine Route Dispatch'
        : `Scheduled: ${customDeliveryDate || 'Standard Dispatch'}`;

    const fullNotes = [
      `Field Booking (${currentUser.name})`,
      `Terms: ${termsLabel}`,
      `Delivery: ${deliveryScheduleText}`,
      orderNotes ? `Note: ${orderNotes}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    const newOrder = createSalesOrder({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      customerArea: selectedCustomer.area,
      deliveryAddress: selectedCustomer.address,
      items,
      subtotal,
      discountAmount: calculatedDiscountAmount,
      totalAmount: finalTotalAmount,
      paidAmount: orderPaymentTerms === 'advance' ? finalTotalAmount : 0,
      paymentMethod: orderPaymentTerms === 'advance' || orderPaymentTerms === 'cod' ? 'cash' : 'credit',
      dueDate: dueDateVal,
      notes: fullNotes,
      orderStatus: 'pending',
    });

    setSubmittedOrderNumber(newOrder.orderNumber);
    setLastSubmittedOrder(newOrder);
    setOrderItems([]);
    setOrderNotes('');
    setOrderDiscountValue(0);
  };

  // Start editing a pending order
  const handleOpenEdit = (order: SaleOrder) => {
    setEditingOrder(order);
    setEditItems(order.items.map((item) => ({ ...item })));
    setEditNotes(order.notes || '');
    setEditAddProductId(products[0]?.id || '');
    setEditNotification(null);
    setEditModalWarning(null);
  };

  // Modify quantity of item in edit modal
  const handleEditItemQty = (productId: string, change: number) => {
    setEditItems((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + change;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              total: item.unitPrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  // Remove line from editing order
  const handleRemoveEditItem = (productId: string) => {
    if (editItems.length <= 1) {
      setEditModalWarning('Order must contain at least one product line.');
      setTimeout(() => setEditModalWarning(null), 3500);
      return;
    }
    setEditItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Add a new product to editing order
  const handleAddProductToEdit = () => {
    const prod = products.find((p) => p.id === editAddProductId);
    if (!prod) return;

    setEditItems((prev) => {
      const existing = prev.find((item) => item.productId === prod.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === prod.id
            ? { ...item, quantity: item.quantity + 1, total: item.unitPrice * (item.quantity + 1) }
            : item
        );
      }
      const price = prod.wholesalePrice || prod.salePrice;
      const newItem: OrderItem = {
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        quantity: 1,
        unit: prod.unit,
        unitPrice: price,
        discountPercent: 0,
        taxPercent: 0,
        total: price,
      };
      return [...prev, newItem];
    });
  };

  // Save changes to pending order
  const handleSaveOrderEdit = () => {
    if (!editingOrder || editItems.length === 0) return;

    const calculatedTotal = editItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    updateSalesOrder(editingOrder.id, {
      items: editItems.map((i) => ({ ...i, total: i.unitPrice * i.quantity })),
      subtotal: calculatedTotal,
      totalAmount: calculatedTotal,
      notes: editNotes,
    });

    setEditNotification(`Order ${editingOrder.orderNumber} successfully updated!`);
    setTimeout(() => {
      setEditingOrder(null);
      setEditNotification(null);
    }, 1200);
  };

  // Cancel pending order with clean in-app confirmation
  const handleInitiateCancel = (order: SaleOrder) => {
    setOrderToCancel(order);
  };

  const handleConfirmCancelOrder = () => {
    if (!orderToCancel) return;
    cancelPendingOrder(orderToCancel.id, cancelReason);
    setOrderToCancel(null);
  };

  // Filtered recent orders (status + search by Order Number or Customer Name)
  const displayedOrders = orders.filter((ord) => {
    // Status filter
    if (bookingFilter === 'pending' && ord.orderStatus !== 'pending') return false;
    if (bookingFilter === 'processed' && ord.orderStatus === 'pending') return false;

    // Search query filter (Order Number or Customer Name)
    if (historySearchQuery.trim()) {
      const q = historySearchQuery.toLowerCase().trim();
      const matchesOrderNo =
        ord.orderNumber.toLowerCase().includes(q) ||
        (ord.invoiceNumber && ord.invoiceNumber.toLowerCase().includes(q));
      const matchesCustomer =
        ord.customerName.toLowerCase().includes(q) ||
        (ord.customerArea && ord.customerArea.toLowerCase().includes(q));

      if (!matchesOrderNo && !matchesCustomer) {
        return false;
      }
    }

    return true;
  });

  const pendingCount = orders.filter((o) => o.orderStatus === 'pending').length;
  const allPendingOrders = orders.filter((o) => o.orderStatus === 'pending');
  const selectedPendingOrders = orders.filter(
    (o) => o.orderStatus === 'pending' && selectedPendingOrderIds.includes(o.id)
  );
  const selectedOrdersTotal = selectedPendingOrders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0
  );
  const isAllPendingSelected =
    allPendingOrders.length > 0 &&
    allPendingOrders.every((o) => selectedPendingOrderIds.includes(o.id));

  const toggleSelectPendingOrder = (orderId: string) => {
    setSelectedPendingOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const handleToggleSelectAllPending = () => {
    if (isAllPendingSelected) {
      setSelectedPendingOrderIds([]);
    } else {
      setSelectedPendingOrderIds(allPendingOrders.map((o) => o.id));
    }
  };

  const handlePrintSelectedPendingSummaries = () => {
    if (selectedPendingOrders.length > 0) {
      setBulkOrdersToPrint(selectedPendingOrders);
    } else if (allPendingOrders.length > 0) {
      setSelectedPendingOrderIds(allPendingOrders.map((o) => o.id));
      setBulkOrdersToPrint(allPendingOrders);
    }
  };

  const handlePrintSingleSummary = (order: SaleOrder) => {
    setBulkOrdersToPrint([order]);
  };

  // Export filtered list of orders to CSV for offline reporting
  const exportOrdersToCSV = () => {
    if (displayedOrders.length === 0) return;

    const headers = [
      'Order Number',
      'Invoice Number',
      'Order Date',
      'Due Date',
      'Customer Name',
      'Customer Phone',
      'Customer Area',
      'Delivery Address',
      'Order Status',
      'Payment Status',
      'Payment Method',
      'Line Items Breakdown',
      'Total Items Qty',
      'Subtotal (PKR)',
      'Discount (PKR)',
      'Total Amount (PKR)',
      'Paid Amount (PKR)',
      'Balance Due (PKR)',
      'Delivery Notes / Instructions',
      'Booked By Representative',
    ];

    const escapeCSV = (str: string | number | undefined | null) => {
      if (str === undefined || str === null) return '""';
      const text = String(str).replace(/"/g, '""');
      return `"${text}"`;
    };

    const rows = displayedOrders.map((ord) => {
      const itemsSummary = ord.items
        ? ord.items.map((i) => `${i.productName} (x${i.quantity} ${i.unit} @ Rs. ${i.unitPrice})`).join('; ')
        : '';
      const totalUnits = ord.items ? ord.items.reduce((s, i) => s + i.quantity, 0) : 0;

      return [
        escapeCSV(ord.orderNumber),
        escapeCSV(ord.invoiceNumber || ''),
        escapeCSV(ord.orderDate),
        escapeCSV(ord.dueDate || ''),
        escapeCSV(ord.customerName),
        escapeCSV(ord.customerPhone || ''),
        escapeCSV(ord.customerArea || ''),
        escapeCSV(ord.deliveryAddress || ''),
        escapeCSV(ord.orderStatus.toUpperCase()),
        escapeCSV(ord.paymentStatus.toUpperCase()),
        escapeCSV(ord.paymentMethod ? ord.paymentMethod.toUpperCase() : 'CASH'),
        escapeCSV(itemsSummary),
        escapeCSV(totalUnits),
        escapeCSV(ord.subtotal),
        escapeCSV(ord.discountAmount),
        escapeCSV(ord.totalAmount),
        escapeCSV(ord.paidAmount),
        escapeCSV(ord.balanceAmount),
        escapeCSV(ord.notes || ''),
        escapeCSV(currentUser.name),
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const todayStr = new Date().toISOString().split('T')[0];
    const cleanFilter = bookingFilter === 'all' ? 'all' : bookingFilter;
    link.setAttribute('href', url);
    link.setAttribute('download', `field-bookings-${cleanFilter}-${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCsvExportNotification(`Successfully exported ${displayedOrders.length} bookings to CSV`);
    setTimeout(() => {
      setCsvExportNotification(null);
    }, 4000);
  };

  const editingSubtotal = editItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Field Rep Mobile Header */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-indigo-800 text-white p-5 rounded-2xl shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-xs">
              <Store className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight">Field Order Taker Terminal</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/30 text-amber-200 font-mono font-bold">
                  MOBILE OPTIMIZED
                </span>
              </div>
              <p className="text-xs text-amber-100">
                Route Sales Rep: <span className="font-semibold">{currentUser.name}</span>
              </p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-amber-200 block">Strict Data Isolation</span>
            <span className="text-xs font-bold text-white">Wholesale Catalog Only</span>
          </div>
        </div>

        {/* Step Navigation Pill */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/20 text-xs">
          <button
            onClick={() => setActiveStep('customer')}
            className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
              activeStep === 'customer'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <span>1. Customer</span>
            {selectedCustomer && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
          </button>
          <button
            onClick={() => setActiveStep('catalog')}
            className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
              activeStep === 'catalog'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <span>2. Add Items</span>
            {orderItems.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-black">
                {orderItems.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveStep('review')}
            className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
              activeStep === 'review'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <span>3. Review & Submit</span>
          </button>
        </div>
      </div>

      {/* STEP 1: CUSTOMER SELECTION */}
      {activeStep === 'customer' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-slate-900">Select Customer on Route</h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                  {filteredCustomers.length} Outlets
                </span>
              </div>
              <p className="text-xs text-slate-500">
                View GPS locations on territory route or select from outlet list
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* View Switcher Tabs */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setCustomerViewMode('map')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                    customerViewMode === 'map'
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Interactive Route Map"
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>Map View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerViewMode('list')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                    customerViewMode === 'list'
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Outlet Cards List"
                >
                  <List className="w-3.5 h-3.5" />
                  <span>List View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerViewMode('split')}
                  className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                    customerViewMode === 'split'
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Side-by-side Map & List"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Split View</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-60">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search route customer or area..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Register New Outlet Button */}
              <button
                type="button"
                onClick={() => setIsAddOutletOpen(true)}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs shrink-0 cursor-pointer"
                title="Register a new retail shop/outlet on this market route"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Register Outlet</span>
              </button>
            </div>
          </div>

          {/* New Outlet Registered Banner */}
          {outletCreatedNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">{outletCreatedNotice}</span>
              </div>
              <button
                onClick={() => setOutletCreatedNotice(null)}
                className="text-emerald-700 hover:text-emerald-900 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Conditional Views: Map, List, or Split */}
          {customerViewMode === 'map' && (
            <CustomerRouteMap
              customers={filteredCustomers}
              selectedCustomer={selectedCustomer}
              onSelectCustomer={(cust) => setSelectedCustomer(cust)}
              currentRoute={selectedRouteFilter}
              onRouteChange={(r) => setSelectedRouteFilter(r)}
            />
          )}

          {customerViewMode === 'list' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[460px] overflow-y-auto p-1">
              {filteredCustomers.map((cust, idx) => {
                const isSelected = selectedCustomer?.id === cust.id;
                return (
                  <div
                    key={cust.id}
                    onClick={() => setSelectedCustomer(cust)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                            Stop #{idx + 1}
                          </span>
                          <span className="text-[10px] text-amber-700 font-semibold">{cust.route}</span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-900">{cust.name}</h4>
                        <p className="text-[11px] text-slate-600 font-medium">{cust.company}</p>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{cust.area}, {cust.city}</span>
                      </span>
                      <span className="font-semibold text-slate-700">
                        Balance: {formatMoney(cust.currentBalance)}
                      </span>
                    </div>

                    {cust.latitude && cust.longitude && (
                      <div className="mt-1 text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <span>📍 GPS: {cust.latitude.toFixed(4)}, {cust.longitude.toFixed(4)}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {customerViewMode === 'split' && (
            <div className="grid lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7">
                <CustomerRouteMap
                  customers={filteredCustomers}
                  selectedCustomer={selectedCustomer}
                  onSelectCustomer={(cust) => setSelectedCustomer(cust)}
                  currentRoute={selectedRouteFilter}
                  onRouteChange={(r) => setSelectedRouteFilter(r)}
                />
              </div>
              <div className="lg:col-span-5 max-h-[460px] overflow-y-auto space-y-2.5 pr-1">
                <div className="text-xs font-bold text-slate-700 mb-1">Outlets List on Route:</div>
                {filteredCustomers.map((cust, idx) => {
                  const isSelected = selectedCustomer?.id === cust.id;
                  return (
                    <div
                      key={cust.id}
                      onClick={() => setSelectedCustomer(cust)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                            #{idx + 1}
                          </span>
                          <span className="font-bold text-xs text-slate-900">{cust.name}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 pl-6">{cust.company} • {cust.area}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-xs text-slate-800 block">{formatMoney(cust.currentBalance)}</span>
                        {isSelected && <span className="text-[10px] text-amber-700 font-bold">Selected</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customer Selection Footer Action */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-xs text-slate-600">
              {selectedCustomer ? (
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Active Outlet: <strong>{selectedCustomer.name}</strong> ({selectedCustomer.company})</span>
                </div>
              ) : (
                <span className="text-amber-700">Please click an outlet on the map or list to select</span>
              )}
            </div>

            <button
              onClick={() => setActiveStep('catalog')}
              disabled={!selectedCustomer}
              className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm shadow-amber-200"
            >
              <span>Continue to Products ({selectedCustomer?.name || 'Select Outlet'})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PRODUCT CATALOG */}
      {activeStep === 'catalog' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-slate-900">Wholesale Product Catalog</h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                  For: {selectedCustomer?.name}
                </span>
              </div>
              <p className="text-xs text-slate-500">All prices show wholesale rate with available saleable stock</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products or SKU..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition font-medium ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Items */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {filteredProducts.map((p) => {
              const qty = getItemQty(p.id);
              return (
                <div
                  key={p.id}
                  className={`p-3 rounded-xl border transition flex flex-col justify-between ${
                    qty > 0 ? 'bg-amber-50/50 border-amber-400' : 'bg-white border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start text-[10px] text-slate-400">
                      <span>{p.sku}</span>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                        {p.currentStock} {p.unit} in stock
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-800 mt-1 line-clamp-2">{p.name}</h4>
                    <p className="text-[10px] text-slate-500">{p.brand}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Wholesale Rate</span>
                      <span className="font-extrabold text-xs text-slate-900">
                        {formatMoney(p.wholesalePrice || p.salePrice)}
                      </span>
                      {qty > 0 && (
                        <span className="text-[10px] text-amber-700 font-bold block mt-0.5">
                          Line: {formatMoney((p.wholesalePrice || p.salePrice) * qty)}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5">
                        {qty > 0 ? (
                          <>
                            <button
                              type="button"
                              onClick={() => updateItemQty(p, -1)}
                              className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100 font-bold transition cursor-pointer"
                              title="Decrease 1 unit"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={qty}
                              onChange={(e) => setItemExactQty(p, parseInt(e.target.value) || 0)}
                              className="w-12 py-1 text-center font-black text-xs bg-amber-50 border border-amber-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                              title="Enter exact quantity directly"
                            />
                            <button
                              type="button"
                              onClick={() => updateItemQty(p, 1)}
                              className="w-7 h-7 rounded-lg bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center font-bold transition shadow-2xs cursor-pointer"
                              title="Increase 1 unit"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => updateItemQty(p, 1)}
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>

                      {/* Quick Bulk Presets */}
                      {qty > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold pt-0.5">
                          <span className="text-[9px] text-slate-400">Add:</span>
                          <button
                            type="button"
                            onClick={() => updateItemQty(p, 5)}
                            className="px-1.5 py-0.5 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 rounded text-[10px] transition cursor-pointer"
                            title="Add 5 units"
                          >
                            +5
                          </button>
                          <button
                            type="button"
                            onClick={() => updateItemQty(p, 10)}
                            className="px-1.5 py-0.5 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 rounded text-[10px] transition cursor-pointer"
                            title="Add 10 units"
                          >
                            +10
                          </button>
                          <button
                            type="button"
                            onClick={() => updateItemQty(p, 25)}
                            className="px-1.5 py-0.5 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 rounded text-[10px] transition cursor-pointer"
                            title="Add 25 units"
                          >
                            +25
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-between items-center border-t border-slate-100">
            <div className="text-xs">
              <span className="text-slate-500">Order Items:</span>{' '}
              <span className="font-bold text-slate-900">{orderItems.length} lines</span> |{' '}
              <span className="text-slate-500">Estimated Total:</span>{' '}
              <span className="font-black text-amber-700">{formatMoney(subtotal)}</span>
            </div>
            <button
              onClick={() => setActiveStep('review')}
              disabled={orderItems.length === 0}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
            >
              <span>Review Order</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & SUBMISSION */}
      {activeStep === 'review' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          {submittedOrderNumber ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Order Booked Successfully!</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  Order reference <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">{submittedOrderNumber}</span> has been dispatched to Central Warehouse for credit approval and packing.
                </p>
              </div>

              {lastSubmittedOrder && (
                <div className="max-w-md mx-auto p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Retail Outlet:</span>
                    <span className="font-bold text-slate-800">{lastSubmittedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Items Booked:</span>
                    <span className="font-bold text-slate-800">
                      {lastSubmittedOrder.items.length} lines ({lastSubmittedOrder.items.reduce((s, i) => s + i.quantity, 0)} units)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Terms:</span>
                    <span className="font-bold text-slate-800 capitalize">
                      {lastSubmittedOrder.notes?.includes('Terms:')
                        ? lastSubmittedOrder.notes.split('|')[1]?.trim()
                        : 'Cash on Delivery (COD)'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
                    <span className="font-bold text-slate-700">Total Order Value:</span>
                    <span className="font-black text-amber-700">{formatMoney(lastSubmittedOrder.totalAmount)}</span>
                  </div>
                </div>
              )}

              <div className="pt-2 flex flex-wrap justify-center gap-2.5">
                {lastSubmittedOrder && (
                  <button
                    onClick={() => handlePrintSingleSummary(lastSubmittedOrder)}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-amber-200 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / Share Booking Slip</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setSubmittedOrderNumber(null);
                    setLastSubmittedOrder(null);
                    setActiveStep('customer');
                  }}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Store className="w-4 h-4" />
                  <span>Book Another Customer Order</span>
                </button>
                <button
                  onClick={() => {
                    setSubmittedOrderNumber(null);
                    setLastSubmittedOrder(null);
                    const historyElem = document.getElementById('recent-field-bookings-section');
                    if (historyElem) historyElem.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  <span>View in Fulfillment Tracker</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-base text-slate-900">Order Summary & Confirmation</h2>
                  <p className="text-xs text-slate-500">Verify customer details, payment terms, and lines before dispatching to warehouse</p>
                </div>
                <button
                  onClick={() => setActiveStep('catalog')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Products</span>
                </button>
              </div>

              {/* Customer Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{selectedCustomer?.name}</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                      {selectedCustomer?.area || 'Route Outlet'}
                    </span>
                  </div>
                  <p className="text-slate-600">{selectedCustomer?.company}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">{selectedCustomer?.address}, {selectedCustomer?.city}</p>
                  {selectedCustomer?.phone && (
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{selectedCustomer.phone}</span>
                    </p>
                  )}
                </div>
                <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4">
                  <span className="text-[11px] text-slate-400 block">Current Ledger Balance</span>
                  <span className="font-extrabold text-sm text-slate-800">
                    {formatMoney(selectedCustomer?.currentBalance || 0)}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Credit Limit: {formatMoney(selectedCustomer?.creditLimit || 50000)}
                  </span>
                </div>
              </div>

              {/* Order Items Table with Inline Controls */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Product</th>
                      <th className="py-2.5 px-3 text-center">Unit</th>
                      <th className="py-2.5 px-3 text-right">Wholesale Rate</th>
                      <th className="py-2.5 px-3 text-center">Qty Booked</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                      <th className="py-2.5 px-2 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orderItems.map((item) => (
                      <tr key={item.product.id}>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">
                          <div>{item.product.name}</div>
                          <span className="font-mono text-[10px] text-slate-400">{item.product.sku}</span>
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-500">{item.product.unit}</td>
                        <td className="py-2.5 px-3 text-right text-slate-700">
                          {formatMoney(item.product.wholesalePrice || item.product.salePrice)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="inline-flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
                            <button
                              type="button"
                              onClick={() => updateItemQty(item.product, -1)}
                              className="w-5 h-5 rounded bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center font-bold text-slate-900">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateItemQty(item.product, 1)}
                              className="w-5 h-5 rounded bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-amber-700">
                          {formatMoney((item.product.wholesalePrice || item.product.salePrice) * item.quantity)}
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => setOrderItems((prev) => prev.filter((i) => i.product.id !== item.product.id))}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                            title="Remove line item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Commercial Terms & Delivery Settings */}
              <div className="grid sm:grid-cols-2 gap-3 text-xs bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
                {/* Payment Terms Selector */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Payment Terms / Credit Window</span>
                  </label>
                  <select
                    value={orderPaymentTerms}
                    onChange={(e) => setOrderPaymentTerms(e.target.value as any)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="cod">Cash on Delivery (COD on Van Arrival)</option>
                    <option value="credit_7">7 Days Route Credit</option>
                    <option value="credit_15">15 Days Route Credit</option>
                    <option value="credit_30">30 Days Month-End Credit</option>
                    <option value="advance">Advance Cash Received in Field</option>
                  </select>
                </div>

                {/* Delivery Scheduling */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Delivery Dispatch Scheduling</span>
                  </label>
                  <select
                    value={deliverySchedule}
                    onChange={(e) => setDeliverySchedule(e.target.value as any)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="tomorrow_morning">Next Morning Routine Route Dispatch (Standard)</option>
                    <option value="today_evening">Urgent Evening Same-Day Dispatch</option>
                    <option value="custom">Custom Delivery Date</option>
                  </select>
                  {deliverySchedule === 'custom' && (
                    <input
                      type="date"
                      value={customDeliveryDate}
                      onChange={(e) => setCustomDeliveryDate(e.target.value)}
                      className="mt-1.5 w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  )}
                </div>

                {/* Order Discount Option */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Wholesale Bulk Discount</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={orderDiscountType}
                      onChange={(e) => setOrderDiscountType(e.target.value as any)}
                      className="w-28 p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="flat">Flat PKR (Rs.)</option>
                      <option value="percent">Percentage (%)</option>
                    </select>
                    <input
                      type="number"
                      min="0"
                      value={orderDiscountValue || ''}
                      placeholder={orderDiscountType === 'percent' ? 'e.g. 5%' : 'e.g. 500'}
                      onChange={(e) => setOrderDiscountValue(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Delivery Notes */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Delivery Instructions / Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Deliver before 2:00 PM, call manager on arrival..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Order Financial Calculation Breakdown */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="space-y-0.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Gross Items Subtotal:</span>
                    <span className="font-bold text-slate-800">{formatMoney(subtotal)}</span>
                  </div>
                  {calculatedDiscountAmount > 0 && (
                    <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                      <span>Wholesale Discount Applied:</span>
                      <span>-{formatMoney(calculatedDiscountAmount)}</span>
                    </div>
                  )}
                  <div className="text-[11px] text-slate-500">
                    Total Units: {orderItems.reduce((s, i) => s + i.quantity, 0)} across {orderItems.length} product lines
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block uppercase tracking-wider font-semibold">
                    Net Payable Booking Amount:
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-amber-800">{formatMoney(finalTotalAmount)}</span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setActiveStep('catalog')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Back to Catalog
                </button>
                <button
                  type="button"
                  onClick={handleSubmitOrder}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-200 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Field Order ({formatMoney(finalTotalAmount)})</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Field Rep Order History, Sales Trend Chart & Pending Order Editing */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-slate-900">Your Recent Field Bookings</h3>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                  {pendingCount} Pending Edit Available
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Orders in <span className="font-semibold text-amber-700">pending</span> status can be modified directly before warehouse picking and dispatch.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
            {/* 7-Day Trend Chart Toggle Button */}
            <button
              onClick={() => setShowSalesTrend(!showSalesTrend)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                showSalesTrend
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent'
              }`}
              title="Toggle 7-day sales volume line chart"
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              <span>{showSalesTrend ? 'Hide Trend Chart' : 'Show 7-Day Trend Chart'}</span>
            </button>

            {/* Bulk Print Action Button in Header */}
            {allPendingOrders.length > 0 && (
              <button
                onClick={handlePrintSelectedPendingSummaries}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                  selectedPendingOrderIds.length > 0
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
                }`}
                title="Select multiple pending orders and print all their summaries at once using the PrintInvoiceModal"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>
                  {selectedPendingOrderIds.length > 0
                    ? `Print Summaries (${selectedPendingOrderIds.length})`
                    : `Bulk Print Pending (${allPendingOrders.length})`}
                </span>
              </button>
            )}

            {/* Filter Pills */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold shrink-0">
              <button
                onClick={() => setBookingFilter('all')}
                className={`px-3 py-1 rounded-lg transition ${
                  bookingFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({orders.length})
              </button>
              <button
                onClick={() => setBookingFilter('pending')}
                className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${
                  bookingFilter === 'pending' ? 'bg-white text-amber-800 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Pending ({pendingCount})</span>
              </button>
              <button
                onClick={() => setBookingFilter('processed')}
                className={`px-3 py-1 rounded-lg transition ${
                  bookingFilter === 'processed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Processed
              </button>
            </div>

            {/* Export CSV Button in Header */}
            <button
              onClick={exportOrdersToCSV}
              disabled={displayedOrders.length === 0}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer ${
                displayedOrders.length > 0
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              }`}
              title="Export filtered list of orders to CSV file for offline reporting"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* 7-Day Sales Volume Trend Line Chart (Recharts) */}
        {showSalesTrend && (
          <div className="pt-1">
            <SalesVolumeTrendChart
              orders={orders}
              currentUser={currentUser}
              formatMoney={formatMoney}
            />
          </div>
        )}

        {/* History Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order # (e.g. SO-2026) or Customer Name..."
              value={historySearchQuery}
              onChange={(e) => setHistorySearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-amber-500 rounded-xl transition focus:outline-hidden"
            />
            {historySearchQuery && (
              <button
                onClick={() => setHistorySearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2.5 text-xs text-slate-500 flex-wrap">
            <span>
              Showing <span className="font-bold text-slate-800">{displayedOrders.length}</span> of {orders.length} bookings
            </span>
            {historySearchQuery && (
              <button
                onClick={() => setHistorySearchQuery('')}
                className="text-amber-700 hover:underline font-semibold text-[11px]"
              >
                Clear
              </button>
            )}

            {/* Quick Export CSV Button */}
            <button
              onClick={exportOrdersToCSV}
              disabled={displayedOrders.length === 0}
              className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 text-[11px] border shadow-2xs cursor-pointer ${
                displayedOrders.length > 0
                  ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
              }`}
              title="Export current filtered list of orders to CSV file for offline reporting"
            >
              <Download className="w-3 h-3 text-emerald-600" />
              <span>Export CSV ({displayedOrders.length})</span>
            </button>
          </div>
        </div>

        {/* CSV Export Success Banner */}
        {csvExportNotification && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">{csvExportNotification}</span>
              <span className="text-[11px] text-emerald-700 hidden sm:inline">• UTF-8 formatted CSV ready for Microsoft Excel & Google Sheets</span>
            </div>
            <button
              onClick={() => setCsvExportNotification(null)}
              className="text-emerald-700 hover:text-emerald-900 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Bulk Action & Selection Bar for Pending Orders */}
        {allPendingOrders.length > 0 && (
          <div className="p-3 bg-gradient-to-r from-amber-50/90 via-amber-50/60 to-slate-50 border border-amber-200/90 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 select-none">
                <input
                  type="checkbox"
                  checked={isAllPendingSelected}
                  onChange={handleToggleSelectAllPending}
                  className="w-4 h-4 text-amber-600 rounded border-amber-400 focus:ring-amber-500 cursor-pointer"
                />
                <span>
                  {selectedPendingOrderIds.length > 0
                    ? `${selectedPendingOrderIds.length} of ${allPendingOrders.length} Pending Orders Selected`
                    : `Select All Pending Bookings (${allPendingOrders.length})`}
                </span>
              </label>

              {selectedPendingOrderIds.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full border border-amber-300">
                    Total: {formatMoney(selectedOrdersTotal)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              {selectedPendingOrderIds.length > 0 && (
                <button
                  onClick={() => setSelectedPendingOrderIds([])}
                  className="px-2.5 py-1 text-slate-500 hover:text-slate-800 text-[11px] font-semibold transition cursor-pointer"
                >
                  Deselect All
                </button>
              )}

              {/* Bulk Action Print Button */}
              <button
                onClick={handlePrintSelectedPendingSummaries}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer ${
                  selectedPendingOrderIds.length > 0
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
                title="Select multiple pending orders and print all their summaries at once using the PrintInvoiceModal"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>
                  {selectedPendingOrderIds.length > 0
                    ? `Print Selected Summaries (${selectedPendingOrderIds.length})`
                    : `Bulk Print Pending (${allPendingOrders.length})`}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Orders List */}
        <div className="divide-y divide-slate-100 text-xs">
          {displayedOrders.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="font-semibold text-slate-600">
                {historySearchQuery
                  ? `No bookings found matching "${historySearchQuery}"`
                  : 'No orders found in this filter.'}
              </p>
              {historySearchQuery ? (
                <button
                  onClick={() => setHistorySearchQuery('')}
                  className="mt-2.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-semibold hover:bg-amber-100 transition"
                >
                  Clear search query
                </button>
              ) : (
                <p className="text-[11px] mt-1">Book new customer orders using the form above.</p>
              )}
            </div>
          ) : (
            displayedOrders.map((ord) => {
              const isPending = ord.orderStatus === 'pending';
              const isSelected = isPending && selectedPendingOrderIds.includes(ord.id);

              return (
                <div
                  key={ord.id}
                  className={`py-4 px-4 rounded-2xl transition flex flex-col gap-3 ${
                    isPending
                      ? isSelected
                        ? 'bg-amber-100/70 border-2 border-amber-500 shadow-md ring-2 ring-amber-300 my-2'
                        : 'bg-amber-50/40 border-2 border-amber-300/80 my-2 shadow-xs'
                      : 'bg-white border border-slate-200/90 my-2 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox for Pending Orders Multi-Selection */}
                    {isPending && (
                      <div className="pt-1 shrink-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectPendingOrder(ord.id)}
                          className="w-4 h-4 text-amber-600 rounded border-amber-400 focus:ring-amber-500 cursor-pointer"
                          title={`Select ${ord.orderNumber} for bulk summary printing`}
                        />
                      </div>
                    )}

                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-indigo-700 font-mono text-sm">{ord.orderNumber}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-[11px] text-slate-500">{ord.orderDate}</span>
                          {isPending ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300">
                              Pending Approval (Editable)
                            </span>
                          ) : (
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                ord.orderStatus === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.orderStatus === 'dispatched'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {ord.orderStatus}
                            </span>
                          )}
                        </div>

                        <p className="font-bold text-slate-900 text-sm">
                          {ord.customerName}
                        </p>

                        <div className="text-[11px] text-slate-600 line-clamp-1">
                          <span className="font-medium text-slate-500">Items:</span>{' '}
                          {ord.items.map((i) => `${i.productName} (${i.quantity})`).join(', ')}
                        </div>

                        {ord.notes && (
                          <p className="text-[10px] text-slate-500 italic bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block">
                            Note: {ord.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                        <div className="text-right">
                          <span className="font-black text-sm sm:text-base text-slate-900">
                            {formatMoney(ord.totalAmount)}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            {ord.items.reduce((s, i) => s + i.quantity, 0)} Units Booked
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 pt-1">
                          {/* Print Summary Button */}
                          <button
                            onClick={() => handlePrintSingleSummary(ord)}
                            className="p-1.5 text-slate-600 hover:text-amber-800 hover:bg-amber-100/70 rounded-lg transition border border-slate-200 cursor-pointer"
                            title={`Print invoice summary for ${ord.orderNumber}`}
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {isPending ? (
                            <>
                              <button
                                onClick={() => handleOpenEdit(ord)}
                                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer"
                                title="Edit quantities and items before warehouse packaging"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>

                              <button
                                onClick={() => handleInitiateCancel(ord)}
                                className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                                title="Cancel pending order"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <div
                              className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg"
                              title="This order has already been processed or dispatched by the warehouse and cannot be edited by field representatives."
                            >
                              <Lock className="w-3 h-3 text-slate-400" />
                              <span>Locked by WH</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Status Stepper Visualizer */}
                  <OrderStatusStepper status={ord.orderStatus} />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* EDIT PENDING ORDER MODAL */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-base sm:text-lg text-slate-900">
                    Edit Pending Booking: {editingOrder.orderNumber}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300">
                    Pending Warehouse Review
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Customer: <span className="font-bold text-slate-800">{editingOrder.customerName}</span> •{' '}
                  {editingOrder.customerArea || 'Market Route'}
                </p>
              </div>
              <button
                onClick={() => setEditingOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification alert if saved */}
            {editNotification && (
              <div className="my-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{editNotification}</span>
              </div>
            )}

            {/* Instructions Banner */}
            <div className="my-2 p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                You can adjust product quantities, add more wholesale items, or update delivery notes. Changes take effect immediately in the central warehouse packing queue.
              </span>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto py-2 space-y-4 text-xs">
              {/* Line Items Table */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    Current Order Items ({editItems.length})
                  </span>
                  <span className="text-[11px] text-slate-500">Wholesale Unit Pricing</span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Product Description</th>
                        <th className="py-2.5 px-3 text-center">Unit</th>
                        <th className="py-2.5 px-3 text-right">Wholesale Rate</th>
                        <th className="py-2.5 px-3 text-center">Quantity</th>
                        <th className="py-2.5 px-3 text-right">Line Total</th>
                        <th className="py-2.5 px-2 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {editItems.map((item) => (
                        <tr key={item.productId} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-semibold text-slate-800">
                            <div>{item.productName}</div>
                            <span className="font-mono text-[10px] text-slate-400">{item.sku}</span>
                          </td>
                          <td className="py-2.5 px-3 text-center text-slate-500">{item.unit}</td>
                          <td className="py-2.5 px-3 text-right text-slate-700 font-medium">
                            {formatMoney(item.unitPrice)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <div className="inline-flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
                              <button
                                onClick={() => handleEditItemQty(item.productId, -1)}
                                className="w-6 h-6 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-bold text-slate-900">{item.quantity}</span>
                              <button
                                onClick={() => handleEditItemQty(item.productId, 1)}
                                className="w-6 h-6 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-right font-black text-amber-800">
                            {formatMoney(item.unitPrice * item.quantity)}
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <button
                              onClick={() => handleRemoveEditItem(item.productId)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add More Items to Pending Order */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700 text-xs block">
                  + Add Additional Wholesale Product to this Booking
                </span>
                <div className="flex gap-2">
                  <select
                    value={editAddProductId}
                    onChange={(e) => setEditAddProductId(e.target.value)}
                    className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.sku}) — Wholesale {formatMoney(p.wholesalePrice || p.salePrice)} [Stock: {p.currentStock} {p.unit}]
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddProductToEdit}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>
              </div>

              {/* Delivery Notes */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Delivery Notes & Instructions
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="e.g. Deliver before 1:00 PM, contact shopkeeper upon arrival..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Summary box */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex justify-between items-center">
                <div>
                  <span className="text-xs font-semibold text-slate-600 block">Updated Order Total:</span>
                  <span className="text-[11px] text-slate-500">
                    {editItems.reduce((s, i) => s + i.quantity, 0)} total units across {editItems.length} line items
                  </span>
                </div>
                <span className="text-xl font-black text-amber-800">{formatMoney(editingSubtotal)}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-200 flex justify-between items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const toCancel = editingOrder;
                  setEditingOrder(null);
                  handleInitiateCancel(toCancel);
                }}
                className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Cancel This Order
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Discard Changes
                </button>

                <button
                  type="button"
                  onClick={handleSaveOrderEdit}
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-200 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Update Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER NEW OUTLET MODAL */}
      {isAddOutletOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">Register New Route Outlet</h3>
                  <p className="text-xs text-slate-500">Quickly add a retail shop directly from field territory</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddOutletOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterNewOutlet} className="space-y-3.5 pt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Outlet / Shop Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Al-Madina Karyana & General Store"
                  value={newOutletName}
                  onChange={(e) => setNewOutletName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Proprietor / Contact Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Haji Muhammad Asif"
                    value={newOutletCompany}
                    onChange={(e) => setNewOutletCompany(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile / WhatsApp Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. 0300-1234567"
                    value={newOutletPhone}
                    onChange={(e) => setNewOutletPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Territory Route / Market Area</label>
                  <input
                    type="text"
                    placeholder="e.g. Shah Alam Market"
                    value={newOutletArea}
                    onChange={(e) => setNewOutletArea(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Approved Credit Limit (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    value={newOutletCreditLimit}
                    onChange={(e) => setNewOutletCreditLimit(Number(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Delivery Address / Shop #</label>
                <input
                  type="text"
                  placeholder="e.g. Shop # 14-B, Ghalib Market, Gulberg III"
                  value={newOutletAddress}
                  onChange={(e) => setNewOutletAddress(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOutletOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-sm shadow-amber-200 cursor-pointer"
                >
                  Save & Select Outlet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CANCEL ORDER IN-APP CONFIRMATION MODAL */}
      {orderToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-base text-slate-900">Cancel Pending Order?</h3>
                <p className="text-xs text-slate-600">
                  Are you sure you want to void pending booking{' '}
                  <span className="font-mono font-bold text-slate-900">{orderToCancel.orderNumber}</span> for{' '}
                  <span className="font-bold text-slate-900">{orderToCancel.customerName}</span>?
                </p>
                <p className="text-[11px] text-slate-500">
                  Total value: <strong className="text-rose-700">{formatMoney(orderToCancel.totalAmount)}</strong>
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-1.5 text-xs">
              <label className="block font-bold text-slate-700">Reason for Cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              >
                <option value="Customer requested order change or postponement">
                  Customer requested order change or postponement
                </option>
                <option value="Customer credit limit exceeded / payment pending">
                  Customer credit limit exceeded / payment pending
                </option>
                <option value="Duplicate booking booked in error">
                  Duplicate booking booked in error
                </option>
                <option value="Store closed during sales route visit">
                  Store closed during sales route visit
                </option>
              </select>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setOrderToCancel(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancelOrder}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition shadow-xs cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk / Single Invoices Print Modal */}
      {bulkOrdersToPrint && (
        <PrintInvoiceModal
          orders={bulkOrdersToPrint}
          onClose={() => setBulkOrdersToPrint(null)}
        />
      )}
    </div>
  );
};
