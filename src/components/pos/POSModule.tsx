import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  Search,
  Barcode,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  CreditCard,
  DollarSign,
  User,
  Printer,
  Sparkles,
  ArrowRight,
  Layers,
} from 'lucide-react';

export const POSModule: React.FC = () => {
  const { products, customers, formatMoney, processPOSCheckout, currentTenant } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('cust_1');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [cart, setCart] = useState<Array<{ product: Product; quantity: number }>>([
    { product: products[0] || ({} as Product), quantity: 2 },
    { product: products[4] || ({} as Product), quantity: 1 },
  ]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bank' | 'credit' | 'split'>('cash');

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, change: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + change;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as Array<{ product: Product; quantity: number }>
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product.salePrice || 0) * item.quantity, 0);
  const totalPayable = Math.max(0, subtotal - discountAmount);

  const handleCompleteSale = () => {
    if (cart.length === 0) return;

    const selectedCust = customers.find((c) => c.id === selectedCustomerId);
    const cartItems = cart.map((i) => ({
      ...i.product,
      quantity: i.quantity,
    }));

    processPOSCheckout(
      cartItems,
      selectedCustomerId,
      selectedCust?.name || 'Counter Customer',
      paymentMethod,
      discountAmount
    );

    setCart([]);
    setDiscountAmount(0);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col lg:flex-row gap-4 overflow-hidden">
      {/* Left: Product Catalog & Search */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Top Controls: Barcode scan simulation & search */}
        <div className="p-4 border-b border-slate-200 space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Scan barcode or search by item name / SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white border border-transparent focus:border-indigo-400 rounded-xl text-xs transition focus:outline-hidden"
              />
            </div>
            <button
              onClick={() => {
                if (filteredProducts.length > 0) addToCart(filteredProducts[0]);
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              title="Simulate barcode scan beep"
            >
              <Barcode className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Scan Beep</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition font-medium ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredProducts.map((p) => {
            const inCart = cart.find((i) => i.product.id === p.id);
            return (
              <div
                key={p.id}
                onClick={() => addToCart(p)}
                className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between group ${
                  inCart
                    ? 'bg-indigo-50/50 border-indigo-300 ring-2 ring-indigo-500/20'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono text-slate-400 truncate">{p.sku}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        p.currentStock <= p.minStock
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {p.currentStock} {p.unit}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 group-hover:text-indigo-600 transition line-clamp-2">
                    {p.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{p.brand}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900">
                    {formatMoney(p.salePrice)}
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white text-indigo-600 flex items-center justify-center transition">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Cart & Fast Checkout Panel */}
      <div className="w-full lg:w-96 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
        {/* Cart Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">Billing Cart ({cart.length})</h3>
          </div>
          {cart.length > 0 && (
            <button
              onClick={() => setCart([])}
              className="text-[11px] text-rose-600 hover:underline font-semibold"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Customer Selector */}
        <div className="p-3 border-b border-slate-200 bg-white">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Customer / Account
          </label>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="cust_walkin">Walk-in Counter Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.company})
              </option>
            ))}
          </select>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 p-3 overflow-y-auto space-y-2">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <ShoppingCart className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-xs font-semibold">Your cart is empty</p>
              <p className="text-[11px]">Click items or scan barcodes to begin billing</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs gap-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{item.product.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {formatMoney(item.product.salePrice)} × {item.quantity}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateQuantity(item.product.id, -1)}
                    className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-100"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center font-bold text-slate-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, 1)}
                    className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-100"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Calculation & Checkout Button */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-semibold">{formatMoney(subtotal)}</span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span>Discount</span>
            <div className="flex items-center gap-1">
              <span className="text-slate-400">Rs.</span>
              <input
                type="number"
                value={discountAmount || ''}
                onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                placeholder="0"
                className="w-16 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-right text-xs"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
            <span className="font-bold text-sm text-slate-800">Total Due</span>
            <span className="font-black text-xl text-indigo-700">{formatMoney(totalPayable)}</span>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(true)}
            disabled={cart.length === 0}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold rounded-xl text-sm transition shadow-md shadow-emerald-200 flex items-center justify-center gap-2 mt-2"
          >
            <span>Proceed to Payment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Payment Dialog Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-base text-slate-900">Checkout Settlement</h3>
                <p className="text-xs text-slate-500">Choose payment method to complete sale</p>
              </div>
              <span className="text-xl font-black text-emerald-600">{formatMoney(totalPayable)}</span>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'cash', label: 'Cash on Counter', icon: DollarSign },
                  { id: 'card', label: 'Debit / Card', icon: CreditCard },
                  { id: 'bank', label: 'Bank Transfer', icon: CheckCircle },
                  { id: 'credit', label: 'Credit (Khata)', icon: User },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition text-xs font-semibold ${
                        paymentMethod === m.id
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-500/20'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customer Notice */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Billed Customer:</span>
                <span className="font-semibold text-slate-800">
                  {customers.find((c) => c.id === selectedCustomerId)?.name || 'Walk-in Customer'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice Items:</span>
                <span className="font-semibold text-slate-800">{cart.length} Products</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt Format:</span>
                <span className="font-mono text-[11px] text-slate-600">80mm Thermal Receipt</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleCompleteSale}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-emerald-200 flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Complete & Print Receipt</span>
              </button>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
