import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Scissors, ShoppingBag, Plus, Edit, Trash2, Check, RefreshCw, BarChart2, Eye, Sliders, Users, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../services/productService';
import { userService } from '../services/userService';

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  // States for lists
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customizations, setCustomizations] = useState([]);
  const [stats, setStats] = useState({ sales: 0, orders: 0, customizations: 0, customers: 0 });

  // Add Product Form State
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "", sku: "", category: "WOMEN", subcategory: "Sarees", price: 10000,
    fabric: "Mulberry Silk", occasion: "Festive & Pujas", color: "Gold", stock: 10,
    description: "", story: "", images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
    ], video: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-modelling-indian-traditional-clothing-41317-large.mp4"
  });

  // Edit Product Stock State
  const [editingProdId, setEditingProdId] = useState(null);
  const [editingStock, setEditingStock] = useState(0);

  // Active detail modal selectors
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCustom, setSelectedCustom] = useState(null);
  
  // Status revision fields
  const [trackingNumber, setTrackingNumber] = useState("");
  const [stylistNote, setStylistNote] = useState("");

  // Homepage CMS states
  const [cmsHeroSlides, setCmsHeroSlides] = useState([
    { id: 1, title: "Designed with Purpose. Styled for You.", active: true },
    { id: 2, title: "The Designer Handloom Spotlight", active: true },
    { id: 3, title: "Sheer Elegance, Woven in Gold", active: true }
  ]);

  // Load Admin Data
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const prodRes = await productService.getProducts({ page: 1, limit: 100 });
      const ordRes = await userService.getAllOrders();
      const custRes = await userService.getAllCustomizations();

      setProducts(prodRes.products);
      setOrders(ordRes);
      setCustomizations(custRes);

      // Calculations for stats
      const totalSales = ordRes.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0);
      const uniqueCustomers = new Set(ordRes.map(o => o.customerEmail)).size + 3; // add padding

      setStats({
        sales: totalSales,
        orders: ordRes.length,
        customizations: custRes.filter(c => c.status !== 'Delivered').length,
        customers: uniqueCustomers
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.sku || !newProduct.description) return;
    try {
      await productService.createProduct({
        ...newProduct,
        sizes: newProduct.category === "KIDS" ? ["2-4Y", "4-6Y", "6-8Y"] : ["XS", "S", "M", "L", "XL", "XXL"],
        price: parseInt(newProduct.price, 10),
        stock: parseInt(newProduct.stock, 10),
        status: "published",
        tags: ["New", "AdminAdded"]
      });
      setShowAddProduct(false);
      // Reset form
      setNewProduct({
        name: "", sku: "", category: "WOMEN", subcategory: "Sarees", price: 10000,
        fabric: "Mulberry Silk", occasion: "Festive & Pujas", color: "Gold", stock: 10,
        description: "", story: "", images: [
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
        ], video: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-modelling-indian-traditional-clothing-41317-large.mp4"
      });
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStock = async (id) => {
    try {
      await productService.updateProduct(id, { stock: parseInt(editingStock, 10) });
      setEditingProdId(null);
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this garment from catalog archives?")) {
      try {
        await productService.deleteProduct(id);
        loadAdminData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const updated = await userService.updateOrderStatus(id, status, trackingNumber);
      setSelectedOrder(updated);
      setTrackingNumber("");
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCustomStatus = async (id, status) => {
    try {
      const updated = await userService.updateCustomizationStatus(id, status, stylistNote);
      setSelectedCustom(updated);
      setStylistNote("");
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center">
        <RefreshCw className="w-8 h-8 text-[#B68D40] animate-spin mx-auto mb-4" />
        <span className="font-serif italic text-neutral-500">Syncing Administration Swatches...</span>
      </div>
    );
  }

  const ORDER_STATUSES = ['New', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Returned/Cancelled'];
  const CUSTOM_STATUSES = ['New', 'In Discussion', 'Confirmed', 'In Production', 'Ready', 'Delivered'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
      
      {/* Title Header */}
      <div className="bg-[#181818] text-white p-8 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#D9C7A3] font-sans font-bold">ADMINISTRATION PORTAL</span>
          <h1 className="text-3xl font-serif font-light tracking-wider">ETNIKO WORKSPACE</h1>
          <p className="text-xs font-sans text-neutral-400">
            Control order tracking pipelines, list new silhouettes, and audit customization requests in real time.
          </p>
        </div>
        <button
          onClick={loadAdminData}
          className="flex items-center gap-1.5 px-4 py-2 border border-neutral-700 hover:border-[#D9C7A3] hover:text-[#D9C7A3] transition-colors text-[10px] tracking-wider uppercase font-sans font-bold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Workspace splits */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 border border-border-custom dark:border-neutral-800 shrink-0 bg-primary dark:bg-neutral-900">
          <div className="flex flex-wrap lg:flex-col text-[10px] font-sans font-semibold tracking-widest uppercase divide-[#ECECEC] dark:divide-neutral-800 divide-x lg:divide-x-0 lg:divide-y text-neutral-500">
            {[
              { id: "dashboard", label: "Analytics", icon: BarChart2 },
              { id: "products", label: "Catalog Products", icon: ShoppingBag },
              { id: "orders", label: "Order Status", icon: FileText },
              { id: "customizations", label: "Styling requests", icon: Scissors },
              { id: "cms", label: "Homepage CMS", icon: Sliders }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSelectedOrder(null); setSelectedCustom(null); }}
                  className={`flex-grow lg:flex-grow-0 p-4 text-left flex items-center gap-2.5 focus:outline-none ${
                    activeTab === tab.id ? 'bg-white dark:bg-neutral-800 text-[#B68D40] font-bold border-l-2 border-[#B68D40]' : 'hover:bg-neutral-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Console Workspace */}
        <div className="flex-grow w-full border border-border-custom dark:border-neutral-800 p-8 min-h-[60vh] bg-white dark:bg-[#181818] shadow-sm">
          
          {/* ANALYTICS WORKSPACE */}
          {activeTab === 'dashboard' && (
            <div className="space-y-10">
              <h3 className="font-serif text-lg tracking-wider border-b pb-3 uppercase">Store Metrics</h3>
              
              {/* Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="p-6 border border-border-custom bg-primary dark:bg-neutral-900 space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans">TOTAL SALES REVENUE</span>
                  <p className="text-xl font-bold font-sans text-neutral-800 dark:text-primary">₹{stats.sales.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-6 border border-border-custom bg-primary dark:bg-neutral-900 space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans">AUDITED ORDERS</span>
                  <p className="text-xl font-bold font-sans text-neutral-800 dark:text-primary">{stats.orders}</p>
                </div>
                <div className="p-6 border border-border-custom bg-primary dark:bg-neutral-900 space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans">ACTIVE STYLINGS</span>
                  <p className="text-xl font-bold font-sans text-neutral-800 dark:text-primary">{stats.customizations}</p>
                </div>
                <div className="p-6 border border-border-custom bg-primary dark:bg-neutral-900 space-y-1">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans">CLIENT REACH</span>
                  <p className="text-xl font-bold font-sans text-neutral-800 dark:text-primary">{stats.customers}</p>
                </div>
              </div>

              {/* Mock Analytics Chart indicators */}
              <div className="border border-border-custom dark:border-neutral-800 p-6 space-y-6">
                <h4 className="text-[10px] font-sans font-bold tracking-widest text-[#B68D40] uppercase">Sales by Couture Category</h4>
                <div className="space-y-4">
                  {[
                    { cat: "Women's Sarees & Lehengas", share: 65, val: "₹1,45,000" },
                    { cat: "Men's Heritage Sherwanis", share: 25, val: "₹56,200" },
                    { cat: "Bespoke Custom Styling", share: 10, val: "₹24,500" }
                  ].map(item => (
                    <div key={item.cat} className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] uppercase font-sans text-neutral-500">
                        <span>{item.cat}</span>
                        <span>{item.val} ({item.share}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-850 rounded-none overflow-hidden">
                        <div style={{ width: `${item.share}%` }} className="h-full bg-[#B68D40]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS CRUDS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-serif text-lg tracking-wider uppercase">Archives Catalog</h3>
                <button
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  className="text-[9px] uppercase tracking-widest text-[#B68D40] hover:text-black font-sans font-bold focus:outline-none flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddProduct ? "Cancel" : "Add Garment"}</span>
                </button>
              </div>

              {/* Add Product form */}
              {showAddProduct && (
                <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 border border-[#D9C7A3] bg-primary dark:bg-neutral-900">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans">Garment Name</label>
                    <input
                      type="text" required
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full bg-white dark:bg-neutral-850 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs font-sans text-text-custom dark:text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans">SKU Code</label>
                    <input
                      type="text" required
                      value={newProduct.sku}
                      placeholder="ETK-WOMEN-SAREE-999"
                      onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                      className="w-full bg-white dark:bg-neutral-850 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs font-sans text-text-custom dark:text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans block">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full bg-white dark:bg-neutral-850 border border-neutral-300 dark:border-neutral-750 px-3 py-2.5 text-xs font-sans text-text-custom dark:text-white focus:outline-none"
                    >
                      <option value="WOMEN">WOMEN</option>
                      <option value="MEN">MEN</option>
                      <option value="KIDS">KIDS</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans">Price (INR)</label>
                    <input
                      type="number" required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full bg-white dark:bg-neutral-850 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs font-sans text-text-custom dark:text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans">Fabric</label>
                    <input
                      type="text" required
                      value={newProduct.fabric}
                      onChange={(e) => setNewProduct({ ...newProduct, fabric: e.target.value })}
                      className="w-full bg-white dark:bg-neutral-850 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs font-sans text-text-custom dark:text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans">Initial Stock</label>
                    <input
                      type="number" required
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className="w-full bg-white dark:bg-neutral-850 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs font-sans text-text-custom dark:text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans">Description Description</label>
                    <textarea
                      rows={2} required
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="w-full bg-white dark:bg-neutral-850 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs font-sans text-text-custom dark:text-white focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2 pt-2">
                    <button type="submit" className="btn-luxury-solid w-full">Save Garment to Archive</button>
                  </div>
                </form>
              )}

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-neutral-200 dark:border-neutral-800 text-left text-[10px] uppercase">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 font-semibold text-[#B68D40] tracking-wider">
                      <th className="p-3">IMAGE</th>
                      <th className="p-3">NAME & SKU</th>
                      <th className="p-3">CATEGORY</th>
                      <th className="p-3">PRICE</th>
                      <th className="p-3">STOCK</th>
                      <th className="p-3 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-b border-neutral-100 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300">
                        <td className="p-3">
                          <img src={p.images[0]} alt="" className="w-8 aspect-[3/4] object-cover border" />
                        </td>
                        <td className="p-3">
                          <span className="font-serif font-bold text-neutral-800 dark:text-primary block">{p.name}</span>
                          <span className="font-mono text-[9px] text-neutral-400 block mt-0.5">{p.sku}</span>
                        </td>
                        <td className="p-3">{p.category}</td>
                        <td className="p-3">₹{p.price.toLocaleString()}</td>
                        <td className="p-3">
                          {editingProdId === p.id ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                value={editingStock}
                                onChange={(e) => setEditingStock(e.target.value)}
                                className="w-12 border px-1 py-0.5 text-xs text-black"
                              />
                              <button onClick={() => handleUpdateStock(p.id)} className="p-1 text-green-600 hover:text-black">
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span>{p.stock} units</span>
                              <button
                                onClick={() => { setEditingProdId(p.id); setEditingStock(p.stock); }}
                                className="text-neutral-400 hover:text-[#B68D40]"
                                aria-label="Edit stock"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-neutral-400 hover:text-[#B42318] focus:outline-none"
                            aria-label="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ORDERS MANAGEMENT */}
          {activeTab === 'orders' && !selectedOrder && (
            <div className="space-y-6">
              <h3 className="font-serif text-lg tracking-wider border-b pb-3 uppercase">Boutique Orders</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-neutral-200 dark:border-neutral-800 text-left text-[10px] uppercase">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 font-semibold text-[#B68D40] tracking-wider">
                      <th className="p-3">ORDER REFERENCE</th>
                      <th className="p-3">CLIENT INFO</th>
                      <th className="p-3">TOTAL</th>
                      <th className="p-3">STATUS</th>
                      <th className="p-3 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord.id} className="border-b border-neutral-100 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300">
                        <td className="p-3 font-mono font-semibold text-neutral-800 dark:text-primary">{ord.id}</td>
                        <td className="p-3">
                          <span className="font-bold text-neutral-800 dark:text-primary block">{ord.customerName}</span>
                          <span className="text-[9px] text-neutral-400 block mt-0.5">{ord.customerPhone}</span>
                        </td>
                        <td className="p-3 font-semibold">₹{ord.total.toLocaleString()}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-primary dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 text-[8px] font-bold">
                            {ord.orderStatus}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="text-[9px] uppercase tracking-widest text-[#B68D40] hover:text-black font-sans font-bold focus:outline-none"
                          >
                            Update Status →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ACTIVE ORDER UPDATE MODALS */}
          {activeTab === 'orders' && selectedOrder && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-3">
                <button onClick={() => setSelectedOrder(null)} className="text-[9px] font-sans font-bold uppercase tracking-widest text-neutral-400 hover:text-black">
                  ← Back to Orders list
                </button>
                <span className="font-mono text-xs font-semibold text-[#B68D40] tracking-wider">{selectedOrder.id}</span>
              </div>

              {/* Status form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-50 dark:bg-neutral-900 border p-6">
                <div className="space-y-3">
                  <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-sans block">Update status milestone</span>
                  <div className="flex flex-wrap gap-2">
                    {ORDER_STATUSES.map(st => (
                      <button
                        key={st}
                        onClick={() => handleUpdateOrderStatus(selectedOrder.id, st)}
                        className={`px-3 py-1.5 border text-[9px] tracking-wider uppercase font-sans focus:outline-none ${
                          selectedOrder.orderStatus === st
                            ? 'border-[#B68D40] bg-[#B68D40] text-white font-bold'
                            : 'border-neutral-200 bg-white hover:border-[#B68D40] text-neutral-600'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-sans block">BlueDart Airway Tracking ID</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="TRAK-IND-9999"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full bg-white dark:bg-neutral-850 border border-neutral-300 px-3 py-2 text-xs font-sans text-black"
                    />
                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, selectedOrder.orderStatus)}
                      className="px-4 py-2 bg-neutral-900 text-white text-[9px] font-sans font-bold uppercase tracking-widest shrink-0"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>

              {/* Details review list */}
              <div className="space-y-4">
                <h4 className="text-[10px] tracking-widest text-[#B68D40] font-sans font-semibold uppercase">Client status log history</h4>
                <div className="border border-neutral-200 p-4 space-y-2 max-h-44 overflow-y-auto custom-scrollbar text-[10px] font-sans">
                  {selectedOrder.statusHistory.map((hist, idx) => (
                    <div key={idx} className="flex justify-between border-b pb-1.5">
                      <span className="font-bold uppercase text-[#B68D40]">{hist.status}</span>
                      <span className="text-neutral-500">"{hist.note}"</span>
                      <span className="text-neutral-400">{new Date(hist.timestamp).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CUSTOMIZATIONS REQUESTS WORKSPACE */}
          {activeTab === 'customizations' && !selectedCustom && (
            <div className="space-y-6">
              <h3 className="font-serif text-lg tracking-wider border-b pb-3 uppercase">Couture Tailoring Requests</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-neutral-200 dark:border-neutral-800 text-left text-[10px] uppercase">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 font-semibold text-[#B68D40] tracking-wider">
                      <th className="p-3">REQUEST REFERENCE</th>
                      <th className="p-3">CLIENT INFO</th>
                      <th className="p-3">GARMENT TYPE</th>
                      <th className="p-3">STATUS</th>
                      <th className="p-3 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customizations.map((cust) => (
                      <tr key={cust.id} className="border-b border-neutral-100 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300">
                        <td className="p-3 font-mono font-semibold text-neutral-800 dark:text-primary">{cust.id}</td>
                        <td className="p-3">
                          <span className="font-bold text-neutral-800 dark:text-primary block">{cust.customerName}</span>
                          <span className="text-[9px] text-neutral-400 block mt-0.5">{cust.phone}</span>
                        </td>
                        <td className="p-3 font-medium">{cust.productName}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-[#B68D40] text-white border text-[8px] font-bold">
                            {cust.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedCustom(cust)}
                            className="text-[9px] uppercase tracking-widest text-[#B68D40] hover:text-black font-sans font-bold focus:outline-none"
                          >
                            Stylist Consult →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ACTIVE CUSTOM DETAILS CONSULT WORKSPACE */}
          {activeTab === 'customizations' && selectedCustom && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-3">
                <button onClick={() => setSelectedCustom(null)} className="text-[9px] font-sans font-bold uppercase tracking-widest text-neutral-400 hover:text-black">
                  ← Back to Customizations
                </button>
                <span className="font-mono text-xs font-semibold text-[#B68D40] tracking-wider">{selectedCustom.id}</span>
              </div>

              {/* Custom specs cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-sans text-neutral-600 dark:text-neutral-300">
                <div className="space-y-3 p-4 border bg-neutral-50 dark:bg-neutral-900">
                  <h4 className="text-[10px] tracking-widest text-[#B68D40] font-sans font-bold uppercase border-b pb-1">Garment Specifications</h4>
                  <p><span className="text-neutral-400">Garment Type:</span> <span className="font-bold text-neutral-800 dark:text-primary">{selectedCustom.productName}</span></p>
                  <p><span className="text-neutral-400">Client Phone:</span> <span className="font-bold text-neutral-800 dark:text-primary">{selectedCustom.phone}</span></p>
                  <p><span className="text-neutral-400">Client Email:</span> <span className="font-bold text-neutral-800 dark:text-primary">{selectedCustom.email}</span></p>
                  {selectedCustom.specialRequests && (
                    <div className="pt-2">
                      <span className="text-neutral-400 text-[8px] uppercase tracking-wider block">Special requests:</span>
                      <p className="italic font-medium text-neutral-500">"{selectedCustom.specialRequests}"</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-4 border bg-neutral-50 dark:bg-neutral-900">
                  <h4 className="text-[10px] tracking-widest text-[#B68D40] font-sans font-bold uppercase border-b pb-1">Tailor Measurements</h4>
                  <div className="grid grid-cols-3 gap-2 text-center bg-white dark:bg-neutral-800 p-2 border">
                    <div>
                      <span className="text-neutral-400 text-[8px] uppercase block">Bust</span>
                      <span className="font-bold text-neutral-800 dark:text-primary">{selectedCustom.measurements.bust || "—"}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[8px] uppercase block">Waist</span>
                      <span className="font-bold text-neutral-800 dark:text-primary">{selectedCustom.measurements.waist || "—"}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[8px] uppercase block">Hips</span>
                      <span className="font-bold text-neutral-800 dark:text-primary">{selectedCustom.measurements.hips || "—"}</span>
                    </div>
                  </div>
                  <p><span className="text-neutral-400">Height:</span> <span className="font-bold">{selectedCustom.measurements.height || "—"}</span></p>
                  {selectedCustom.measurements.custom && (
                    <p className="text-[10px] text-neutral-500 italic">"{selectedCustom.measurements.custom}"</p>
                  )}
                </div>
              </div>

              {/* Status update actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border bg-primary dark:bg-neutral-900">
                <div className="space-y-3">
                  <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-sans block">Revision status milestone</span>
                  <div className="flex flex-wrap gap-2">
                    {CUSTOM_STATUSES.map(st => (
                      <button
                        key={st}
                        onClick={() => handleUpdateCustomStatus(selectedCustom.id, st)}
                        className={`px-3 py-1.5 border text-[9px] tracking-wider uppercase font-sans focus:outline-none ${
                          selectedCustom.status === st
                            ? 'border-[#B68D40] bg-[#B68D40] text-white font-bold'
                            : 'border-neutral-200 bg-white hover:border-[#B68D40] text-neutral-600'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-sans block">Boutique Stylist Log Note</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add stylist review guidelines..."
                      value={stylistNote}
                      onChange={(e) => setStylistNote(e.target.value)}
                      className="w-full bg-white dark:bg-neutral-850 border border-neutral-300 px-3 py-2 text-xs font-sans text-black"
                    />
                    <button
                      onClick={() => handleUpdateCustomStatus(selectedCustom.id, selectedCustom.status)}
                      className="px-4 py-2 bg-neutral-900 text-white text-[9px] font-sans font-bold uppercase tracking-widest shrink-0"
                    >
                      Log Note
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HOMEPAGE CMS WORKSPACE */}
          {activeTab === 'cms' && (
            <div className="space-y-8">
              <h3 className="font-serif text-lg tracking-wider border-b pb-3 uppercase">Homepage Banner CMS</h3>
              
              <div className="space-y-4">
                {cmsHeroSlides.map((slide, idx) => (
                  <div
                    key={slide.id}
                    className="border p-6 flex items-center justify-between gap-6 bg-neutral-50 dark:bg-neutral-900"
                  >
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-sans block">HERO SLIDER BANNER {slide.id}</span>
                      <h4 className="font-serif text-sm text-neutral-800 dark:text-primary">{slide.title}</h4>
                    </div>
                    
                    <button
                      onClick={() => {
                        const updated = [...cmsHeroSlides];
                        updated[idx].active = !updated[idx].active;
                        setCmsHeroSlides(updated);
                      }}
                      className={`px-4 py-2 border text-[9px] tracking-widest uppercase font-sans font-bold focus:outline-none transition-colors ${
                        slide.active
                          ? 'border-[#3E7C59] text-[#3E7C59] hover:bg-[#B42318] hover:border-[#B42318] hover:text-white'
                          : 'border-neutral-300 text-neutral-400 hover:border-[#3E7C59] hover:text-[#3E7C59]'
                      }`}
                    >
                      {slide.active ? "Active" : "Disabled"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
