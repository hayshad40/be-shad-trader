import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  Package,
  Search,
  Plus,
  ArrowRightLeft,
  SlidersHorizontal,
  AlertTriangle,
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  History,
  X,
  Layers,
} from 'lucide-react';

export const InventoryManagement: React.FC = () => {
  const {
    products,
    warehouses,
    stockMovements,
    adjustStock,
    transferStock,
    addProduct,
    formatMoney,
    hasPermission,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'stock' | 'movements' | 'low_stock'>('stock');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarehouseFilter, setSelectedWarehouseFilter] = useState('all');

  // Transfer Modal State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferProductId, setTransferProductId] = useState(products[0]?.id || '');
  const [fromWhId, setFromWhId] = useState(warehouses[0]?.id || '');
  const [toWhId, setToWhId] = useState(warehouses[1]?.id || warehouses[0]?.id || '');
  const [transferQty, setTransferQty] = useState<number>(10);
  const [transferNote, setTransferNote] = useState('');

  // Adjustment Modal State
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustProductId, setAdjustProductId] = useState(products[0]?.id || '');
  const [adjustWhId, setAdjustWhId] = useState(warehouses[0]?.id || '');
  const [adjustQty, setAdjustQty] = useState<number>(5);
  const [adjustReason, setAdjustReason] = useState('Physical audit count correction');

  // Add Product Modal State
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdBarcode, setNewProdBarcode] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Grains & Pulses');
  const [newProdBrand, setNewProdBrand] = useState('Be Shad Brand');
  const [newProdUnit, setNewProdUnit] = useState('Carton');
  const [newProdPurchasePrice, setNewProdPurchasePrice] = useState(2500);
  const [newProdSalePrice, setNewProdSalePrice] = useState(2900);
  const [newProdMinStock, setNewProdMinStock] = useState(15);
  const [newProdOpeningStock, setNewProdOpeningStock] = useState(50);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLowStock = activeTab !== 'low_stock' || p.currentStock <= p.minStock;
    return matchesSearch && matchesLowStock;
  });

  const handleExecuteTransfer = () => {
    if (fromWhId === toWhId) {
      alert('Origin and destination warehouses must be different!');
      return;
    }
    transferStock(transferProductId, fromWhId, toWhId, transferQty, transferNote);
    setIsTransferModalOpen(false);
    setTransferNote('');
  };

  const handleExecuteAdjustment = () => {
    adjustStock(adjustProductId, adjustWhId, adjustQty, adjustReason);
    setIsAdjustModalOpen(false);
  };

  const handleCreateProduct = () => {
    if (!newProdName.trim() || !newProdSku.trim()) return;

    addProduct({
      name: newProdName,
      sku: newProdSku,
      barcode: newProdBarcode || `8964000${Date.now().toString().slice(-4)}`,
      category: newProdCategory,
      brand: newProdBrand,
      unit: newProdUnit,
      purchasePrice: newProdPurchasePrice,
      wholesalePrice: newProdSalePrice,
      retailPrice: Math.round(newProdSalePrice * 1.08),
      salePrice: newProdSalePrice,
      minStock: newProdMinStock,
      currentStock: newProdOpeningStock,
      warehouseStocks: { [warehouses[0]?.id || 'wh_main_lhr']: newProdOpeningStock },
      status: 'active',
    });

    setIsNewProductOpen(false);
    setNewProdName('');
    setNewProdSku('');
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Inventory & Multi-Warehouse Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time stock ledger, inter-depot transfers, and automatic safety stock monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Transfer Stock</span>
          </button>
          <button
            onClick={() => setIsAdjustModalOpen(true)}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Adjust Stock</span>
          </button>
          <button
            onClick={() => setIsNewProductOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Product</span>
          </button>
        </div>
      </div>

      {/* Warehouse Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {warehouses.map((wh) => {
          const totalUnitsInWh = products.reduce(
            (sum, p) => sum + (p.warehouseStocks[wh.id] || 0),
            0
          );
          return (
            <div key={wh.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">{wh.name}</span>
                <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                  {wh.code}
                </span>
              </div>
              <p className="text-xl font-black text-indigo-950 mt-1">{totalUnitsInWh.toLocaleString()} Units</p>
              <p className="text-[11px] text-slate-500">{wh.address}, {wh.city}</p>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex gap-1 text-xs">
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              activeTab === 'stock' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Stock Overview ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('low_stock')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'low_stock' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Low Stock Alerts</span>
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              activeTab === 'movements' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Movement Audit Trail ({stockMovements.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search product name, SKU, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Main Stock Table */}
      {activeTab !== 'movements' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Product & Brand</th>
                  <th className="py-3 px-4">SKU / Barcode</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Unit</th>
                  {hasPermission('canViewPurchaseCosts') && (
                    <th className="py-3 px-4 text-right">Purchase Price</th>
                  )}
                  <th className="py-3 px-4 text-right">Wholesale Rate</th>
                  <th className="py-3 px-4 text-center">Lahore WH</th>
                  <th className="py-3 px-4 text-center">Karachi Hub</th>
                  <th className="py-3 px-4 text-center">Total Stock</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const isLow = p.currentStock <= p.minStock;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-bold text-slate-800">
                        <div>{p.name}</div>
                        <span className="text-[10px] text-slate-400 font-normal">{p.brand}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        <div>{p.sku}</div>
                        <span className="text-[10px] text-slate-400">{p.barcode}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{p.category}</td>
                      <td className="py-3 px-4 text-center text-slate-500">{p.unit}</td>
                      {hasPermission('canViewPurchaseCosts') && (
                        <td className="py-3 px-4 text-right text-slate-600">
                          {formatMoney(p.purchasePrice)}
                        </td>
                      )}
                      <td className="py-3 px-4 text-right font-black text-slate-900">
                        {formatMoney(p.wholesalePrice || p.salePrice)}
                      </td>
                      <td className="py-3 px-4 text-center font-medium text-slate-700">
                        {p.warehouseStocks['wh_main_lhr'] ?? p.currentStock}
                      </td>
                      <td className="py-3 px-4 text-center font-medium text-slate-700">
                        {p.warehouseStocks['wh_khi_hub'] ?? 0}
                      </td>
                      <td className="py-3 px-4 text-center font-black text-indigo-950">
                        {p.currentStock}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isLow
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isLow ? `Low (Min: ${p.minStock})` : 'In Stock'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Movement Audit Trail Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Item & SKU</th>
                  <th className="py-3 px-4 text-center">Movement Type</th>
                  <th className="py-3 px-4 text-center">Quantity Change</th>
                  <th className="py-3 px-4">Warehouse Location</th>
                  <th className="py-3 px-4 font-mono">Reference #</th>
                  <th className="py-3 px-4">Logged By / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stockMovements.map((sm) => (
                  <tr key={sm.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {new Date(sm.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      <div>{sm.productName}</div>
                      <span className="font-mono text-[10px] text-slate-400">{sm.sku}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {sm.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-black">
                      <span className={sm.quantityChange > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                        {sm.quantityChange > 0 ? `+${sm.quantityChange}` : sm.quantityChange}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {sm.warehouseName}
                      {sm.toWarehouseName && ` → ${sm.toWarehouseName}`}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                      {sm.referenceNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      <span className="font-medium text-slate-700">{sm.createdBy}</span>
                      {sm.notes && <p className="italic">{sm.notes}</p>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Transfer Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">Inter-Warehouse Stock Transfer</h3>
              <button onClick={() => setIsTransferModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600 block mb-1">Select Item to Transfer</label>
                <select
                  value={transferProductId}
                  onChange={(e) => setTransferProductId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Total Stock: {p.currentStock} {p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">From Origin WH</label>
                  <select
                    value={fromWhId}
                    onChange={(e) => setFromWhId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">To Destination WH</label>
                  <select
                    value={toWhId}
                    onChange={(e) => setToWhId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Transfer Quantity (Units)</label>
                <input
                  type="number"
                  min="1"
                  value={transferQty}
                  onChange={(e) => setTransferQty(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Transfer Note / Driver Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Dispatched via Logistics Van #04..."
                  value={transferNote}
                  onChange={(e) => setTransferNote(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteTransfer}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Execute Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">Stock Adjustment / Count Correction</h3>
              <button onClick={() => setIsAdjustModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600 block mb-1">Product</label>
                <select
                  value={adjustProductId}
                  onChange={(e) => setAdjustProductId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Warehouse</label>
                <select
                  value={adjustWhId}
                  onChange={(e) => setAdjustWhId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">
                  Quantity Adjustment (+ to add, - to write off damage)
                </label>
                <input
                  type="number"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Audit Reason</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteAdjustment}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Save Adjustment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isNewProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">Add New Product to Catalog</h3>
              <button onClick={() => setIsNewProductOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="font-bold text-slate-600 block mb-1">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sunflower Cooking Oil 5L"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">SKU Code</label>
                <input
                  type="text"
                  placeholder="OIL-SNF-5L"
                  value={newProdSku}
                  onChange={(e) => setNewProdSku(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Category</label>
                <input
                  type="text"
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Purchase Cost</label>
                <input
                  type="number"
                  value={newProdPurchasePrice}
                  onChange={(e) => setNewProdPurchasePrice(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Wholesale Sale Rate</label>
                <input
                  type="number"
                  value={newProdSalePrice}
                  onChange={(e) => setNewProdSalePrice(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Minimum Safety Stock</label>
                <input
                  type="number"
                  value={newProdMinStock}
                  onChange={(e) => setNewProdMinStock(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Opening Stock (Units)</label>
                <input
                  type="number"
                  value={newProdOpeningStock}
                  onChange={(e) => setNewProdOpeningStock(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsNewProductOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProduct}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
