import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { InsightsPanel } from "./components/InsightsPanel";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  Plus,
  Minus,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Coffee,
  Store,
  Wrench,
  Cpu,
  History,
  ClipboardList,
  X,
  Trash2,
  Users,
  Phone,
  MapPin,
  FileText,
  BarChart3,
  Calendar,
  ArrowRightLeft,
  RefreshCw
} from 'lucide-react';
import { db } from './lib/db';
import { Product, Transaction, BusinessConfig, BusinessType, TransactionStatus, AuditLog, Customer, BankAccount, StockMovement, MovementType, StockMovementReason } from './types';
import { cn, formatCurrency } from './lib/utils';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { format, subDays, isSameDay, startOfDay } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- Components ---

const ITEMS_PER_PAGE = 6;

const Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 mt-10 pb-10">
      <button 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-3 rounded-xl bg-[#2d3449]/60 border border-[#3a4a46]/40 text-[#00f5d4] disabled:opacity-10 hover:bg-[#00f5d4]/10 hover:border-[#00f5d4]/60 transition-all shadow-lg"
      >
        <ChevronLeft size={20} />
      </button>
      <div className="px-6 py-2 rounded-xl bg-[#0b1326] border border-[#3a4a46]/30 shadow-inner">
        <span className="text-[10px] font-black text-[#dae2fd] uppercase tracking-[0.2em]">
          Architecture Page <span className="text-[#00f5d4]">{currentPage}</span> / {totalPages}
        </span>
      </div>
      <button 
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-3 rounded-xl bg-[#2d3449]/60 border border-[#3a4a46]/40 text-[#00f5d4] disabled:opacity-10 hover:bg-[#00f5d4]/10 hover:border-[#00f5d4]/60 transition-all shadow-lg"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-4 px-6 py-4 w-full transition-all ease-in-out duration-300 group",
      active 
        ? "bg-gradient-to-r from-[#00f5d4]/10 to-transparent text-[#00f5d4] border-r-2 border-[#00f5d4]" 
        : "text-[#dae2fd]/40 hover:text-[#d7fff3] hover:bg-[#2d3449]/20"
    )}
  >
    <Icon size={20} className={cn(active ? "fill-[#00f5d4]/20" : "")} />
    <span className="font-headline font-bold text-sm uppercase tracking-widest">{label}</span>
  </button>
);

// --- Pages ---

const Onboarding = ({ onComplete }: { onComplete: (config: BusinessConfig) => void }) => {
  const types: { id: BusinessType, title: string, desc: string, icon: any }[] = [
    { id: 'coffee', title: 'Coffee Shop', desc: 'Optimized for high-volume quick service and table management.', icon: Coffee },
    { id: 'retail', title: 'Retail Store', desc: 'Advanced inventory tracking and SKU management.', icon: Store },
    { id: 'services', title: 'Services', desc: 'Built for appointment scheduling and professional invoicing.', icon: Wrench },
    { id: 'custom', title: 'Custom', desc: 'A blank canvas for unique business models.', icon: Cpu },
  ];

  return (
    <div className="min-h-screen bg-[#0b1326] flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <span className="text-[#00f5d4] font-headline font-bold uppercase tracking-[0.4em] text-xs mb-4 block">Initialization Phase 01</span>
        <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tight text-[#dae2fd] mb-6">
          Architect Your Business <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5d4] to-[#4edea3]">Architecture</span>
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full">
        {types.map((type, i) => (
          <motion.button
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onComplete({ 
              type: type.id, 
              name: type.title, 
              address: '', 
              phone: '', 
              bankAccounts: [], 
              initialized: true 
            })}
            className="bg-[#2d3449]/40 backdrop-blur-xl p-8 rounded-xl border border-[#3a4a46]/15 flex flex-col items-start text-left hover:bg-[#2d3449]/60 hover:border-[#00f5d4]/40 transition-all group"
          >
            <div className="w-14 h-14 rounded-lg bg-[#171f33] flex items-center justify-center mb-8 border border-[#3a4a46]/20 group-hover:border-[#00f5d4]/40 transition-colors">
              <type.icon className="text-[#00f5d4]" size={28} />
            </div>
            <h3 className="font-headline text-2xl font-bold text-[#dae2fd] mb-3 group-hover:text-[#00f5d4] transition-colors">{type.title}</h3>
            <p className="text-[#dae2fd]/60 text-sm font-light leading-relaxed mb-6">{type.desc}</p>
            <div className="mt-auto flex items-center gap-2 text-[#00f5d4] font-headline font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Initialize <ChevronRight size={14} />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const Dashboard = ({ transactions, products }: { transactions: Transaction[], products: Product[] }) => {
  // Insight 1: Best Selling (Today)
  const today = startOfDay(new Date());
  const todayTransactions = transactions.filter(t => t.timestamp >= today.getTime());
  
  const productSales: Record<string, { name: string, qty: number }> = {};
  todayTransactions.forEach(t => {
    t.items.forEach(item => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = { name: item.productName, qty: 0 };
      }
      productSales[item.productId].qty += item.quantity;
    });
  });

  const bestSelling = Object.values(productSales).sort((a, b) => b.qty - a.qty)[0];

  // Insight 2: Revenue Trend (Last 7 days)
  const trendData = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayTotal = transactions
      .filter(t => isSameDay(new Date(t.timestamp), date))
      .reduce((sum, t) => sum + t.totalAmount, 0);
    return {
      name: format(date, 'EEE'),
      revenue: dayTotal
    };
  });

  // Insight 3: Low Stock
  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-4xl font-black font-headline text-[#dae2fd] tracking-tighter mb-1">Financial Command <span className="text-[#00f5d4]">Pulse</span></h1>
        <p className="text-[#dae2fd]/60 font-label text-sm uppercase tracking-[0.2em]">Real-time operational architectural insights</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Revenue Chart */}
        <div className="md:col-span-8 bg-[#2d3449]/40 backdrop-blur-xl rounded-xl p-6 border border-[#3a4a46]/15 flex flex-col h-96 relative overflow-hidden">
          <div className="flex justify-between items-start z-10 mb-4">
            <div>
              <h3 className="font-headline font-bold text-xl text-[#dae2fd]">Revenue Trend</h3>
              <p className="text-[#4edea3] text-2xl font-black font-headline tracking-tight">
                {formatCurrency(trendData[trendData.length - 1].revenue)}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-[#222a3d] px-3 py-1 rounded-full border border-[#3a4a46]/15">
              <TrendingUp size={14} className="text-[#4edea3]" />
              <span className="text-[#4edea3] text-xs font-bold">Live</span>
            </div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3a4a46" vertical={false} />
                <XAxis dataKey="name" stroke="#83948f" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171f33', border: '1px solid #3a4a46', borderRadius: '8px' }}
                  itemStyle={{ color: '#00f5d4' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#00f5d4" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#00f5d4' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Best Seller */}
        <div className="md:col-span-4 bg-[#2d3449]/40 backdrop-blur-xl rounded-xl p-6 border border-[#3a4a46]/15 flex flex-col justify-between h-96">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline font-bold text-xl text-[#dae2fd]">Top Product</h3>
              <span className="bg-[#00f5d4] text-[#00382f] px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_0_12px_rgba(0,245,212,0.4)]">Today</span>
            </div>
            {bestSelling ? (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden h-40 bg-[#171f33] flex items-center justify-center">
                  <Package size={48} className="text-[#00f5d4]/20" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060e20] to-transparent"></div>
                </div>
                <div>
                  <p className="font-headline font-bold text-lg text-[#dae2fd]">{bestSelling.name}</p>
                  <p className="text-[#dae2fd]/60 text-xs font-label uppercase tracking-wider">{bestSelling.qty} Units Sold Today</p>
                </div>
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-[#dae2fd]/40 italic">No sales today</div>
            )}
          </div>
          <div className="bg-[#222a3d] p-4 rounded-lg border border-[#3a4a46]/15">
            <p className="text-xs text-[#00f5d4] font-bold">Recommendation:</p>
            <p className="text-xs text-[#dae2fd]/60">Consider increasing stock or running a promo for this item.</p>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="md:col-span-6 bg-[#2d3449]/40 backdrop-blur-xl rounded-xl p-6 border border-[#3a4a46]/15">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#93000a]/20 flex items-center justify-center border border-[#ffb4ab]/30">
              <AlertTriangle className="text-[#ffb4ab]" size={18} />
            </div>
            <h3 className="font-headline font-bold text-xl text-[#dae2fd] uppercase tracking-tight">Stock Warning Cluster</h3>
          </div>
          <div className="space-y-4 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
            {lowStockProducts.length > 0 ? lowStockProducts.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-[#131b2e] rounded-lg border-l-2 border-[#ffb4ab]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#2d3449] rounded-md flex items-center justify-center">
                    <Package size={20} className="text-[#dae2fd]/40" />
                  </div>
                  <div>
                    <p className="text-[#dae2fd] font-headline font-bold text-sm">{p.name}</p>
                    <p className="text-[#dae2fd]/60 text-[10px] uppercase">Critical Level</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#ffb4ab] font-headline font-black">{p.stock} Units</p>
                  <p className="text-[#dae2fd]/60 text-[10px] uppercase">Restock Required</p>
                </div>
              </div>
            )) : (
              <div className="text-[#dae2fd]/40 text-center py-8">All stock levels are optimal.</div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="md:col-span-3 bg-[#2d3449]/40 backdrop-blur-xl rounded-xl p-6 border border-[#3a4a46]/15 flex flex-col justify-center items-center text-center">
          <div className="w-24 h-24 rounded-full border-[8px] border-[#2d3449] flex items-center justify-center relative mb-4">
            <div className="absolute inset-0 rounded-full border-[8px] border-[#00f5d4] border-t-transparent -rotate-45"></div>
            <span className="text-[#00f5d4] font-headline font-black text-2xl tracking-tighter">92%</span>
          </div>
          <h4 className="font-headline font-bold text-[#dae2fd] text-sm uppercase tracking-widest">Efficiency</h4>
          <p className="text-[10px] text-[#dae2fd]/60 font-label uppercase mt-1">Optimal Infrastructure</p>
        </div>

        <div className="md:col-span-3 bg-[#2d3449]/40 backdrop-blur-xl rounded-xl p-6 border border-[#3a4a46]/15 flex flex-col justify-center">
          <span className="text-[#dae2fd]/60 font-label text-[10px] uppercase tracking-[0.3em] mb-2">Daily Summary</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black font-headline text-[#dae2fd]">{todayTransactions.length}</span>
            <span className="text-[#4edea3] text-sm font-bold uppercase">Sales</span>
          </div>
          <p className="text-[10px] text-[#dae2fd]/60 mt-2 font-medium">Total volume processed today.</p>
        </div>
      </div>
    </div>
  );
};

const Checkout = ({ products, customers, transactions, onComplete }: { products: Product[], customers: Customer[], transactions: Transaction[], onComplete: (t: Transaction) => void }) => {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [search, setSearch] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.phone.includes(customerSearch)
  );

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  const addToCart = (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product || product.stock <= (cart[id] || 0)) return;
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const next = { ...prev };
      if (next[id] > 1) next[id]--;
      else delete next[id];
      return next;
    });
  };

  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const p = products.find(prod => prod.id === id)!;
    return { ...p, qty: qty as number };
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.sellingPrice * (item.qty as number)), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    // Auto-increment ID logic
    const numericIds = transactions
      .map(t => parseInt(t.id))
      .filter(id => !isNaN(id));
    const nextId = (numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1).toString();

    const transaction: Transaction = {
      id: nextId,
      timestamp: Date.now(),
      totalAmount: total,
      status: 'paid',
      customerId: selectedCustomerId || undefined,
      items: cartItems.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.qty as number,
        price: item.sellingPrice,
        cogs: item.cogs
      }))
    };
    onComplete(transaction);
    setCart({});
    setSelectedCustomerId('');
  };

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden">
      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-[#d7fff3] mb-2">Quick Checkout</h1>
            <p className="text-xs text-[#83948f] uppercase tracking-[0.2em] font-medium">Select items for transaction</p>
          </div>
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#83948f] group-focus-within:text-[#00f5d4] transition-colors" size={18} />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter products..."
              className="w-full bg-transparent border-0 border-b border-[#3a4a46]/20 focus:ring-0 focus:border-[#00f5d4] text-[#dae2fd] pl-12 py-3 transition-all duration-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginatedProducts.map(product => (
            <div key={product.id} className="bg-[#2d3449]/40 backdrop-blur-xl group relative overflow-hidden rounded-xl border border-[#3a4a46]/15 hover:border-[#00f5d4]/40 transition-all duration-500 p-1">
              <div className="relative h-40 rounded-lg overflow-hidden mb-4 bg-[#171f33] flex items-center justify-center">
                <Package size={40} className="text-[#00f5d4]/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060e20]/80 to-transparent"></div>
                <span className={cn(
                  "absolute bottom-3 left-3 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest",
                  product.stock > 0 ? "bg-[#00f5d4] text-[#00382f]" : "bg-[#93000a] text-[#ffdad6]"
                )}>
                  {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                </span>
              </div>
              <div className="px-3 pb-4">
                <h3 className="font-headline text-lg font-bold text-[#dae2fd] mb-1">{product.name}</h3>
                <p className="text-xs text-[#83948f] mb-4">{product.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#d7fff3] font-headline text-xl font-extrabold">{formatCurrency(product.sellingPrice)}</span>
                  <button 
                    onClick={() => addToCart(product.id)}
                    disabled={product.stock <= (cart[product.id] || 0)}
                    className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#2d3449] border border-[#3a4a46]/20 text-[#00f5d4] hover:bg-[#00f5d4] hover:text-[#00382f] transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Cart Sidebar */}
      <div className="w-full md:w-[400px] bg-[#060e20] border-l border-[#3a4a46]/15 flex flex-col relative z-10">
        <div className="p-8 border-b border-[#3a4a46]/15">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-2xl font-extrabold tracking-tight">Active Bill</h2>
            <span className="text-[10px] font-bold text-[#00f5d4] bg-[#00f5d4]/10 px-3 py-1 rounded-full border border-[#00f5d4]/20 tracking-widest uppercase">
              Draft {new Date().getHours()}{new Date().getMinutes()}
            </span>
          </div>

          {/* Customer Selection */}
          <div className="relative">
            <label className="block text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold mb-2">Customer</label>
            <div 
              onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
              className="w-full bg-[#171f33] border border-[#3a4a46]/30 rounded-lg px-4 py-3 text-sm flex items-center justify-between cursor-pointer hover:border-[#00f5d4]/40 transition-all"
            >
              <div className="flex items-center gap-3">
                <Users size={16} className="text-[#00f5d4]/60" />
                <span className={selectedCustomer ? "text-[#dae2fd]" : "text-[#dae2fd]/40"}>
                  {selectedCustomer ? selectedCustomer.name : 'No customer selected'}
                </span>
              </div>
              <ChevronRight size={16} className={cn("text-[#dae2fd]/40 transition-transform", isCustomerDropdownOpen ? "rotate-90" : "")} />
            </div>

            <AnimatePresence>
              {isCustomerDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsCustomerDropdownOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-[#171f33] border border-[#3a4a46]/30 rounded-xl shadow-2xl z-20 overflow-hidden"
                  >
                    <div className="p-3 border-b border-[#3a4a46]/15">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#dae2fd]/20" size={14} />
                        <input 
                          type="text"
                          autoFocus
                          value={customerSearch}
                          onChange={e => setCustomerSearch(e.target.value)}
                          placeholder="Search customers..."
                          className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg pl-9 pr-4 py-2 text-xs text-[#dae2fd] focus:border-[#00f5d4] outline-none"
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto scrollbar-hide">
                      <button 
                        onClick={() => {
                          setSelectedCustomerId('');
                          setIsCustomerDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-xs hover:bg-[#2d3449]/40 transition-colors border-b border-[#3a4a46]/10 flex items-center justify-between"
                      >
                        <span className="text-[#dae2fd]/40 italic">No customer selected</span>
                        {!selectedCustomerId && <CheckCircle2 size={14} className="text-[#00f5d4]" />}
                      </button>
                      {filteredCustomers.map(c => (
                        <button 
                          key={c.id}
                          onClick={() => {
                            setSelectedCustomerId(c.id);
                            setIsCustomerDropdownOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left text-xs hover:bg-[#2d3449]/40 transition-colors border-b border-[#3a4a46]/10 flex items-center justify-between"
                        >
                          <div>
                            <p className="font-bold text-[#dae2fd]">{c.name}</p>
                            <p className="text-[10px] text-[#dae2fd]/40">{c.phone}</p>
                          </div>
                          {selectedCustomerId === c.id && <CheckCircle2 size={14} className="text-[#00f5d4]" />}
                        </button>
                      ))}
                      {filteredCustomers.length === 0 && (
                        <div className="px-4 py-6 text-center text-[10px] text-[#dae2fd]/20 uppercase font-bold tracking-widest">
                          No results found
                        </div>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 scrollbar-hide">
          {cartItems.length > 0 ? cartItems.map(item => (
            <div key={item.id} className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#171f33] flex items-center justify-center border border-[#3a4a46]/15 flex-shrink-0">
                <Package size={20} className="text-[#00f5d4]/40" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-[#dae2fd] leading-tight">{item.name}</h4>
                  <p className="text-sm font-headline font-bold">{formatCurrency(item.sellingPrice * (item.qty as number))}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-[#83948f] uppercase tracking-wider">Qty: {item.qty} units</p>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="w-6 h-6 rounded border border-[#3a4a46]/20 flex items-center justify-center hover:bg-[#222a3d]"
                    >
                      <Minus size={14} />
                    </button>
                    <input 
                      type="number"
                      min="1"
                      max={item.stock}
                      value={cart[item.id] === 0 ? '' : cart[item.id]}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                        if (!isNaN(val) && val <= item.stock) {
                          setCart(prev => ({ ...prev, [item.id]: val }));
                        }
                      }}
                      onBlur={() => {
                        if ((cart[item.id] || 0) < 1) {
                          setCart(prev => ({ ...prev, [item.id]: 1 }));
                        }
                      }}
                      className="w-12 bg-[#0b1326] border border-[#3a4a46]/20 rounded text-center text-xs font-bold py-1 focus:border-[#00f5d4] outline-none"
                    />
                    <button 
                      onClick={() => addToCart(item.id)}
                      className="w-6 h-6 rounded border border-[#3a4a46]/20 flex items-center justify-center hover:bg-[#222a3d]"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="h-full flex flex-col items-center justify-center text-[#dae2fd]/20 space-y-4">
              <ShoppingCart size={48} />
              <p className="text-sm uppercase tracking-widest font-bold">Cart is empty</p>
            </div>
          )}
        </div>

        <div className="p-8 bg-[#222a3d]/40 backdrop-blur-xl border-t border-[#3a4a46]/15">
          <div className="space-y-3 mb-8">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-[#83948f] uppercase tracking-widest">Subtotal</span>
              <span className="text-[#dae2fd]">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs font-medium">
              <span className="text-[#83948f] uppercase tracking-widest">Tax (10%)</span>
              <span className="text-[#dae2fd]">{formatCurrency(tax)}</span>
            </div>
            <div className="pt-4 border-t border-[#3a4a46]/10 flex justify-between items-end">
              <span className="text-[10px] font-bold text-[#00f5d4] uppercase tracking-[0.3em]">Total Payable</span>
              <span className="text-3xl font-headline font-extrabold text-[#00f5d4] drop-shadow-[0_0_12px_rgba(0,245,212,0.5)]">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
            className="w-full bg-gradient-to-r from-[#00f5d4] to-[#4edea3] text-[#00382f] font-headline font-extrabold py-5 rounded-xl shadow-[0_0_32px_rgba(0,245,212,0.3)] hover:shadow-[0_0_48px_rgba(0,245,212,0.5)] transition-all active:scale-95 duration-200 text-lg tracking-tight flex items-center justify-center gap-3 disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <CheckCircle2 size={24} />
            Complete Sale
          </button>
        </div>
      </div>
    </div>
  );
};

const Products = ({ products, onUpdate }: { products: Product[], onUpdate: (p: Product[]) => void }) => {
  const [editing, setEditing] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'healthy' | 'warning' | 'critical'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const status = p.stock >= p.healthyStockThreshold ? 'healthy' : 
                  p.stock > p.lowStockThreshold ? 'warning' : 'critical';
    
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    
    const updated = editing.id 
      ? products.map(p => p.id === editing.id ? editing : p)
      : [...products, { ...editing, id: Math.random().toString(36).substr(2, 9) }];
    
    onUpdate(updated);
    setEditing(null);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-[#dae2fd] mb-2">Inventory Ledger</h1>
          <p className="text-[#dae2fd]/60 font-body">Manage your digital architecture. Real-time valuation and stock precision.</p>
        </div>
        <button 
          onClick={() => setEditing({ id: '', name: '', sellingPrice: 0, cogs: 0, stock: 0, category: 'General', lowStockThreshold: 5, healthyStockThreshold: 10 })}
          className="bg-gradient-to-br from-[#00f5d4] to-[#4edea3] text-[#00382f] px-6 py-3 rounded-md font-headline font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(0,245,212,0.3)] hover:scale-[1.02] transition-transform active:scale-95"
        >
          <Plus size={18} /> Add New Product
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-[#2d3449]/20 p-4 rounded-xl border border-[#3a4a46]/10">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#83948f] group-focus-within:text-[#00f5d4] transition-colors" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products by name or category..."
            className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg pl-12 pr-4 py-2 text-[#dae2fd] focus:border-[#00f5d4] outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold">Status:</span>
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-2 text-xs font-bold text-[#dae2fd] focus:border-[#00f5d4] outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="healthy">Healthy</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 text-[10px] uppercase tracking-widest text-[#dae2fd]/60 font-bold">
          <div className="col-span-4">Product Specification</div>
          <div className="col-span-2 text-center">In-Stock</div>
          <div className="col-span-2 text-center">Selling Price</div>
          <div className="col-span-2 text-center">Profit/Unit</div>
          <div className="col-span-2 text-center">Status</div>
        </div>

        {paginatedProducts.length > 0 ? paginatedProducts.map(p => (
          <div key={p.id} className="grid grid-cols-12 gap-4 items-center px-6 py-5 bg-[#2d3449]/40 backdrop-blur-xl rounded-lg border border-[#3a4a46]/10 hover:border-[#00f5d4]/30 transition-all group">
            <div className="col-span-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded bg-[#171f33] flex items-center justify-center border border-[#3a4a46]/20">
                <Package size={20} className="text-[#00f5d4]/40" />
              </div>
              <div>
                <h4 className="font-headline font-bold text-[#dae2fd] group-hover:text-[#00f5d4] transition-colors">{p.name}</h4>
                <p className="text-xs text-[#dae2fd]/60">{p.category}</p>
              </div>
            </div>
            <div className="col-span-2 text-center font-headline font-bold text-[#dae2fd]">{p.stock} <span className="text-[10px] text-[#dae2fd]/60 font-normal">units</span></div>
            <div className="col-span-2 text-center font-headline font-bold text-[#dae2fd]">{formatCurrency(p.sellingPrice)}</div>
            <div className="col-span-2 text-center font-headline font-bold text-[#4edea3]">{formatCurrency(p.sellingPrice - p.cogs)}</div>
            <div className="col-span-2 flex justify-between items-center">
              <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border",
                p.stock >= p.healthyStockThreshold 
                  ? "bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/20" 
                  : p.stock > p.lowStockThreshold
                  ? "bg-[#ffb4ab]/10 text-[#ffb4ab] border-[#ffb4ab]/20"
                  : "bg-[#93000a]/10 text-[#ffb4ab] border-[#93000a]/20"
              )}>
                {p.stock >= p.healthyStockThreshold ? 'Healthy' : p.stock > p.lowStockThreshold ? 'Warning' : 'Critical'}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => setEditing(p)} className="text-[#dae2fd]/40 hover:text-[#dae2fd] transition-colors">
                  <Settings size={18} />
                </button>
                <button 
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                      onUpdate(products.filter(prod => prod.id !== p.id));
                    }
                  }}
                  className="text-[#ffb4ab]/40 hover:text-[#ffb4ab] transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-[#2d3449]/20 rounded-xl border border-dashed border-[#3a4a46]/30">
            <Package className="mx-auto mb-4 text-[#dae2fd]/20" size={48} />
            <p className="text-[#dae2fd]/40 uppercase tracking-widest font-bold">No products match your filters</p>
          </div>
        )}
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditing(null)}
              className="absolute inset-0 bg-[#060e20]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[#171f33] border border-[#3a4a46]/30 rounded-2xl p-8 w-full max-w-md shadow-2xl"
            >
              <h2 className="text-2xl font-headline font-bold text-[#dae2fd] mb-6">{editing.id ? 'Edit Product' : 'New Product'}</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#dae2fd]/60 mb-2">Product Name</label>
                  <input 
                    required
                    value={editing.name}
                    onChange={e => setEditing({ ...editing, name: e.target.value })}
                    className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-3 text-[#dae2fd] focus:border-[#00f5d4] outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#dae2fd]/60 mb-2">Selling Price (IDR)</label>
                    <input 
                      type="number"
                      required
                      value={editing.sellingPrice}
                      onChange={e => setEditing({ ...editing, sellingPrice: Number(e.target.value) })}
                      className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-3 text-[#dae2fd] focus:border-[#00f5d4] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#dae2fd]/60 mb-2">COGS (IDR)</label>
                    <input 
                      type="number"
                      required
                      value={editing.cogs}
                      onChange={e => setEditing({ ...editing, cogs: Number(e.target.value) })}
                      className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-3 text-[#dae2fd] focus:border-[#00f5d4] outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#dae2fd]/60 mb-2">Stock</label>
                    <input 
                      type="number"
                      required
                      disabled={!!editing.id}
                      value={editing.stock}
                      onChange={e => setEditing({ ...editing, stock: Number(e.target.value) })}
                      className={cn(
                        "w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-3 text-[#dae2fd] focus:border-[#00f5d4] outline-none transition-all",
                        editing.id && "opacity-50 cursor-not-allowed"
                      )}
                    />
                    {editing.id && <p className="text-[8px] text-[#dae2fd]/40 mt-1 uppercase tracking-widest">Stock must be adjusted in Stock Management</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#dae2fd]/60 mb-2">Profit/Unit</label>
                    <div className="w-full bg-[#0b1326]/50 border border-[#3a4a46]/10 rounded-lg px-4 py-3 text-[#4edea3] font-bold">
                      {formatCurrency(editing.sellingPrice - editing.cogs)}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#dae2fd]/60 mb-2">Low Stock Threshold</label>
                    <input 
                      type="number"
                      required
                      value={editing.lowStockThreshold}
                      onChange={e => setEditing({ ...editing, lowStockThreshold: Number(e.target.value) })}
                      className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-3 text-[#dae2fd] focus:border-[#00f5d4] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#dae2fd]/60 mb-2">Healthy Stock Threshold</label>
                    <input 
                      type="number"
                      required
                      value={editing.healthyStockThreshold}
                      onChange={e => setEditing({ ...editing, healthyStockThreshold: Number(e.target.value) })}
                      className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-3 text-[#dae2fd] focus:border-[#00f5d4] outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#dae2fd]/60 mb-2">Category</label>
                  <input 
                    required
                    value={editing.category}
                    onChange={e => setEditing({ ...editing, category: e.target.value })}
                    className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-3 text-[#dae2fd] focus:border-[#00f5d4] outline-none transition-all"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setEditing(null)}
                    className="flex-1 px-6 py-3 rounded-lg border border-[#3a4a46]/30 text-[#dae2fd]/60 hover:text-[#dae2fd] transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-[#00f5d4] text-[#00382f] font-bold py-3 rounded-lg hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HistoryPage = ({ transactions, customers, onUpdateTransaction, config }: { transactions: Transaction[], customers: Customer[], onUpdateTransaction: (t: Transaction) => void, config: BusinessConfig }) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'simple' | 'range'>('simple');
  
  // Simple Filter State
  const now = new Date();
  const [year, setYear] = useState<string>(now.getFullYear().toString());
  const [month, setMonth] = useState<string>((now.getMonth() + 1).toString());
  const [day, setDay] = useState<string>(now.getDate().toString());

  // Range Filter State
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  const generateInvoice = (transaction: Transaction) => {
    const doc = new jsPDF();
    const customer = customers.find(c => c.id === transaction.customerId);

    // Header
    if (config.logo) {
      try {
        doc.addImage(config.logo, 'PNG', 10, 10, 30, 30);
      } catch (e) {
        console.error('Error adding logo to PDF', e);
      }
    }
    doc.setFontSize(20);
    doc.text(config.name || '{Business name}', 50, 20);
    doc.setFontSize(10);
    doc.text(config.address || '{Business Address}', 50, 28);
    doc.text(config.phone || '{Business phone number}', 50, 34);

    // Transaction Info
    doc.text(`Tanggal : ${format(new Date(transaction.timestamp), 'dd/MM/yyyy HH:mm')}`, 10, 50);
    doc.text(`Invoice : ${transaction.id}`, 10, 56);
    doc.text(`Operator : admin`, 150, 50);

    // Customer Info
    doc.text(`Nama : ${customer?.name || '-'}`, 10, 66);
    doc.text(`Telepon : ${customer?.phone || '-'}`, 10, 72);

    // Items Table
    const tableData = transaction.items.map((item, index) => [
      index + 1,
      item.productName,
      '-', // Berat
      formatCurrency(item.price),
      formatCurrency(item.price),
      '-', // Diskon
      '-', // Disc > 10kg
      formatCurrency(item.price * item.quantity),
      '-', // Kondisi
      '-'  // Keterangan
    ]);

    autoTable(doc, {
      startY: 80,
      head: [['No', 'Produk', 'Berat(gr)', 'Harga/gr', 'Harga', 'Diskon', 'Disc >10kg', 'Sub Total', 'Kondisi', 'Keterangan']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [45, 52, 73], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 80;

    // Totals
    doc.text('Sub Total', 140, finalY + 10);
    doc.text(formatCurrency(transaction.totalAmount), 180, finalY + 10, { align: 'right' });
    doc.text('Ongkos Kirim', 140, finalY + 16);
    doc.text('Rp -', 180, finalY + 16, { align: 'right' });
    doc.text('Total', 140, finalY + 22);
    doc.setFontSize(12);
    doc.text(formatCurrency(transaction.totalAmount), 180, finalY + 22, { align: 'right' });

    // Bank Accounts
    doc.setFontSize(10);
    doc.text('Rekening Pelunasan', 10, finalY + 35);
    config.bankAccounts?.forEach((bank, index) => {
      if (bank.bankName) {
        doc.text(`${bank.bankName} - ${bank.accountNumber} (${bank.accountName})`, 10, finalY + 42 + (index * 6));
      }
    });

    // Shipping Slip (Bottom part)
    const slipY = 220;
    doc.setLineDashPattern([2, 2], 0);
    doc.line(10, slipY - 5, 200, slipY - 5);
    doc.setLineDashPattern([], 0);
    doc.text('Slip Pengiriman', 10, slipY - 2);

    doc.rect(10, slipY, 90, 60); // Penerima box
    doc.text('Penerima:', 15, slipY + 10);
    doc.setFontSize(12);
    doc.text(customer?.name || '#N/A', 15, slipY + 20);
    doc.setFontSize(10);
    doc.text(customer?.address || '#N/A', 15, slipY + 30, { maxWidth: 80 });
    doc.text(customer?.phone || '#N/A', 15, slipY + 50);

    doc.rect(110, slipY, 90, 60); // Pengirim box
    doc.text('Pengirim:', 115, slipY + 10);
    doc.setFontSize(12);
    doc.text(config.name || '{Business name}', 115, slipY + 20);
    doc.setFontSize(10);
    doc.text(config.address || '{Business address}', 115, slipY + 30, { maxWidth: 80 });
    doc.text(config.phone || '{Business phone number}', 115, slipY + 50);

    doc.save(`Invoice_${transaction.id}.pdf`);
  };

  const statuses: TransactionStatus[] = ['paid', 'packed', 'sent'];

  const filteredTransactions = transactions.filter(t => {
    const tDate = new Date(t.timestamp);
    const customer = customers.find(c => c.id === t.customerId);
    
    // Search Filter
    const matchesSearch = t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.items.some(item => item.productName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (customer && customer.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;

    // Date Filter
    if (filterMode === 'simple') {
      const matchesYear = year === 'all' || tDate.getFullYear().toString() === year;
      const matchesMonth = month === 'all' || (tDate.getMonth() + 1).toString() === month;
      const matchesDay = day === 'all' || tDate.getDate().toString() === day;
      return matchesYear && matchesMonth && matchesDay;
    } else {
      // Range Filter
      if (!startDate || !endDate) return true; // Show all if range not fully set? 
      // Prompt says "Disable the filter to select all the transaction" for range.
      // I'll interpret this as: if range is active, you MUST select a range to see anything, 
      // OR if range is active, it filters by the range.
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      return t.timestamp >= start && t.timestamp <= end;
    }
  });

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = [...filteredTransactions].reverse().slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
  const totalProfit = filteredTransactions.reduce((sum, t) => {
    const tProfit = t.items.reduce((iSum, item) => iSum + (item.quantity * (item.price - item.cogs)), 0);
    return sum + tProfit;
  }, 0);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, year, month, day, filterMode, startDate, endDate]);

  const years = Array.from({ length: 5 }, (_, i) => (now.getFullYear() - i).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-[#dae2fd] mb-2">Transaction Ledger</h1>
          <p className="text-[#dae2fd]/60 font-body">Historical record of all architectural financial exchanges.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#2d3449]/40 backdrop-blur-xl p-4 rounded-xl border border-[#3a4a46]/10 min-w-[160px]">
            <p className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold mb-1">Total Revenue</p>
            <p className="text-2xl font-headline font-black text-[#00f5d4] tracking-tight">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="bg-[#2d3449]/40 backdrop-blur-xl p-4 rounded-xl border border-[#3a4a46]/10 min-w-[160px]">
            <p className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold mb-1">Total Profit</p>
            <p className="text-2xl font-headline font-black text-[#4edea3] tracking-tight">{formatCurrency(totalProfit)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 bg-[#2d3449]/20 p-6 rounded-2xl border border-[#3a4a46]/10">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#83948f] group-focus-within:text-[#00f5d4] transition-colors" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by Transaction ID or Product Name..."
              className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg pl-12 pr-4 py-2 text-[#dae2fd] focus:border-[#00f5d4] outline-none transition-all"
            />
          </div>
          <div className="flex bg-[#0b1326] p-1 rounded-lg border border-[#3a4a46]/30">
            <button 
              onClick={() => setFilterMode('simple')}
              className={cn(
                "px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                filterMode === 'simple' ? "bg-[#00f5d4] text-[#00382f]" : "text-[#dae2fd]/40 hover:text-[#dae2fd]"
              )}
            >
              Simple Date
            </button>
            <button 
              onClick={() => setFilterMode('range')}
              className={cn(
                "px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                filterMode === 'range' ? "bg-[#00f5d4] text-[#00382f]" : "text-[#dae2fd]/40 hover:text-[#dae2fd]"
              )}
            >
              Date Range
            </button>
          </div>
        </div>

        {filterMode === 'simple' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold">Year</label>
              <select 
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-2 text-xs font-bold text-[#dae2fd] focus:border-[#00f5d4] outline-none"
              >
                <option value="all">All Years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold">Month</label>
              <select 
                value={month}
                onChange={e => setMonth(e.target.value)}
                className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-2 text-xs font-bold text-[#dae2fd] focus:border-[#00f5d4] outline-none"
              >
                <option value="all">All Months</option>
                {months.map(m => <option key={m} value={m}>{format(new Date(2000, parseInt(m) - 1), 'MMMM')}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold">Day</label>
              <select 
                value={day}
                onChange={e => setDay(e.target.value)}
                className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-2 text-xs font-bold text-[#dae2fd] focus:border-[#00f5d4] outline-none"
              >
                <option value="all">All Days</option>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold">Start Date & Time</label>
              <input 
                type="datetime-local"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-2 text-xs font-bold text-[#dae2fd] focus:border-[#00f5d4] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold">End Date & Time</label>
              <input 
                type="datetime-local"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-2 text-xs font-bold text-[#dae2fd] focus:border-[#00f5d4] outline-none"
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 text-[10px] uppercase tracking-widest text-[#dae2fd]/60 font-bold">
          <div className="col-span-2">Transaction ID</div>
          <div className="col-span-2">Timestamp</div>
          <div className="col-span-2">Items Summary</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-right">Profit</div>
          <div className="col-span-2 text-right">Total Amount</div>
        </div>

        {paginatedTransactions.length > 0 ? paginatedTransactions.map(t => {
          const profit = t.items.reduce((sum, item) => sum + (item.quantity * (item.price - item.cogs)), 0);
          return (
            <div 
              key={t.id} 
              onClick={() => setSelectedTransaction(t)}
              className="grid grid-cols-12 gap-4 items-center px-6 py-5 bg-[#2d3449]/40 backdrop-blur-xl rounded-lg border border-[#3a4a46]/10 hover:border-[#00f5d4]/30 transition-all group cursor-pointer"
            >
              <div className="col-span-2">
                <p className="font-headline font-bold text-[#dae2fd] group-hover:text-[#00f5d4] transition-colors uppercase tracking-wider text-sm">
                  #{t.id}
                </p>
              </div>
              <div className="col-span-2 text-sm text-[#dae2fd]/60">
                {format(new Date(t.timestamp), 'MMM dd, yyyy • HH:mm')}
              </div>
              <div className="col-span-2">
                <p className="text-xs text-[#dae2fd]/80 truncate">
                  {t.items.map(item => `${item.quantity}x ${item.productName}`).join(', ')}
                </p>
              </div>
              <div className="col-span-2 flex justify-center" onClick={e => e.stopPropagation()}>
                <select 
                  value={t.status}
                  onChange={(e) => onUpdateTransaction({ ...t, status: e.target.value as TransactionStatus })}
                  className="bg-[#0b1326] border border-[#3a4a46]/30 rounded px-2 py-1 text-[10px] uppercase font-bold text-[#00f5d4] focus:border-[#00f5d4] outline-none cursor-pointer"
                >
                  {statuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 text-right font-headline font-bold text-[#4edea3]">
                {formatCurrency(profit)}
              </div>
              <div className="col-span-2 text-right font-headline font-bold text-[#00f5d4]">
                {formatCurrency(t.totalAmount)}
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-20 bg-[#2d3449]/20 rounded-xl border border-dashed border-[#3a4a46]/30">
            <History className="mx-auto mb-4 text-[#dae2fd]/20" size={48} />
            <p className="text-[#dae2fd]/40 uppercase tracking-widest font-bold">No transactions recorded yet</p>
          </div>
        )}
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Transaction Detail Modal */}
      <AnimatePresence>
        {selectedTransaction && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTransaction(null)}
              className="absolute inset-0 bg-[#060e20]/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#171f33] border border-[#3a4a46]/30 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-[#3a4a46]/15 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-headline font-bold text-[#dae2fd] mb-1 tracking-tight">Transaction Detail</h2>
                  <p className="text-[10px] text-[#00f5d4] font-black uppercase tracking-[0.3em]">ID: #{selectedTransaction.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedTransaction(null)}
                  className="w-10 h-10 rounded-full bg-[#2d3449] flex items-center justify-center text-[#dae2fd]/60 hover:text-[#dae2fd] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold mb-2">Timestamp</p>
                    <p className="text-[#dae2fd] font-headline font-bold">{format(new Date(selectedTransaction.timestamp), 'MMMM dd, yyyy • HH:mm:ss')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold mb-2">Fulfillment Status</p>
                    <span className="px-3 py-1 rounded-full bg-[#00f5d4]/10 text-[#00f5d4] text-[10px] font-black uppercase tracking-widest border border-[#00f5d4]/20">
                      {selectedTransaction.status}
                    </span>
                  </div>
                </div>

                {selectedTransaction.customerId && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold mb-2">Customer Information</p>
                    <div className="p-4 bg-[#0b1326] rounded-xl border border-[#3a4a46]/10 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#2d3449] flex items-center justify-center text-[#00f5d4]">
                        <Users size={18} />
                      </div>
                      <div>
                        <p className="text-[#dae2fd] font-headline font-bold text-sm">
                          {customers.find(c => c.id === selectedTransaction.customerId)?.name || 'Unknown Customer'}
                        </p>
                        <p className="text-[10px] text-[#dae2fd]/40 uppercase">
                          {customers.find(c => c.id === selectedTransaction.customerId)?.phone || 'No phone'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold mb-4">Items Summary</p>
                  <div className="space-y-3">
                    {selectedTransaction.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-4 bg-[#0b1326] rounded-xl border border-[#3a4a46]/10">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-[#2d3449] flex items-center justify-center text-[#00f5d4]/40">
                            <Package size={18} />
                          </div>
                          <div>
                            <p className="text-[#dae2fd] font-headline font-bold text-sm">{item.productName}</p>
                            <p className="text-[10px] text-[#dae2fd]/40 uppercase">{formatCurrency(item.price)} per unit</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[#dae2fd] font-headline font-bold">{formatCurrency(item.price * item.quantity)}</p>
                          <p className="text-[10px] text-[#4edea3] font-bold uppercase">Profit: {formatCurrency((item.price - item.cogs) * item.quantity)}</p>
                          <p className="text-[10px] text-[#00f5d4] font-bold uppercase">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-[#222a3d]/40 border-t border-[#3a4a46]/15 flex justify-between items-end">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold mb-1">Total Architecture Value</p>
                  <p className="text-4xl font-headline font-black text-[#00f5d4] tracking-tighter">{formatCurrency(selectedTransaction.totalAmount)}</p>
                  <p className="text-sm font-headline font-bold text-[#4edea3] mt-2">
                    Total Profit: {formatCurrency(selectedTransaction.items.reduce((sum, item) => sum + (item.quantity * (item.price - item.cogs)), 0))}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-4">
                  <button 
                    onClick={() => generateInvoice(selectedTransaction)}
                    className="bg-[#00f5d4] text-[#00382f] px-6 py-3 rounded-xl font-headline font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(0,245,212,0.2)]"
                  >
                    <FileText size={18} />
                    Generate Invoice
                  </button>
                  <div className="text-right">
                    <p className="text-[10px] text-[#dae2fd]/40 uppercase mb-1">Tax Included (10%)</p>
                    <p className="text-xs text-[#dae2fd]/60 italic font-light">Verified Offline Transaction</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Customers = ({ customers, onUpdate }: { customers: Customer[], onUpdate: (c: Customer[]) => void }) => {
  const [editing, setEditing] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    
    const updated = editing.id 
      ? customers.map(c => c.id === editing.id ? editing : c)
      : [...customers, { ...editing, id: Math.random().toString(36).substr(2, 9) }];
    
    onUpdate(updated);
    setEditing(null);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-[#dae2fd] mb-2">Customer Directory</h1>
          <p className="text-[#dae2fd]/60 font-body">Manage your client architecture and relationship history.</p>
        </div>
        <button 
          onClick={() => setEditing({ id: '', name: '', address: '', phone: '', note: '' })}
          className="bg-gradient-to-br from-[#00f5d4] to-[#4edea3] text-[#00382f] px-6 py-3 rounded-md font-headline font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(0,245,212,0.3)] hover:scale-[1.02] transition-transform active:scale-95"
        >
          <Plus size={18} /> Add New Customer
        </button>
      </div>

      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#83948f] group-focus-within:text-[#00f5d4] transition-colors" size={18} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search customers by name, phone, or address..."
          className="w-full bg-[#2d3449]/20 border border-[#3a4a46]/30 rounded-lg pl-12 pr-4 py-2 text-[#dae2fd] focus:border-[#00f5d4] outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedCustomers.length > 0 ? paginatedCustomers.map(c => (
          <div key={c.id} className="bg-[#2d3449]/40 backdrop-blur-xl rounded-xl border border-[#3a4a46]/15 p-6 hover:border-[#00f5d4]/40 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-[#171f33] flex items-center justify-center border border-[#3a4a46]/20 group-hover:border-[#00f5d4]/40 transition-colors">
                <Users size={24} className="text-[#00f5d4]" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(c)} className="text-[#dae2fd]/40 hover:text-[#dae2fd] transition-colors">
                  <Settings size={18} />
                </button>
                <button 
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${c.name}?`)) {
                      onUpdate(customers.filter(cust => cust.id !== c.id));
                    }
                  }}
                  className="text-[#ffb4ab]/40 hover:text-[#ffb4ab] transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <h3 className="text-xl font-headline font-bold text-[#dae2fd] mb-4">{c.name}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-[#dae2fd]/60">
                <Phone size={14} className="text-[#00f5d4]/40" />
                <span>{c.phone || 'No phone number'}</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-[#dae2fd]/60">
                <MapPin size={14} className="text-[#00f5d4]/40 mt-1" />
                <span className="leading-tight">{c.address || 'No address provided'}</span>
              </div>
              {c.note && (
                <div className="flex items-start gap-3 text-sm text-[#dae2fd]/60">
                  <FileText size={14} className="text-[#00f5d4]/40 mt-1" />
                  <span className="italic leading-tight">{c.note}</span>
                </div>
              )}
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-20 bg-[#2d3449]/20 rounded-xl border border-dashed border-[#3a4a46]/30">
            <Users className="mx-auto mb-4 text-[#dae2fd]/20" size={48} />
            <p className="text-[#dae2fd]/40 uppercase tracking-widest font-bold">No customers found</p>
          </div>
        )}
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditing(null)}
              className="absolute inset-0 bg-[#060e20]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[#171f33] border border-[#3a4a46]/30 rounded-2xl p-8 w-full max-w-md shadow-2xl"
            >
              <h2 className="text-2xl font-headline font-bold text-[#dae2fd] mb-6">{editing.id ? 'Edit Customer' : 'New Customer'}</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#dae2fd]/60 mb-2">Customer Name</label>
                  <input 
                    required
                    value={editing.name}
                    onChange={e => setEditing({ ...editing, name: e.target.value })}
                    className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-3 text-[#dae2fd] focus:border-[#00f5d4] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#dae2fd]/60 mb-2">Phone Number</label>
                  <input 
                    value={editing.phone}
                    onChange={e => setEditing({ ...editing, phone: e.target.value })}
                    className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-3 text-[#dae2fd] focus:border-[#00f5d4] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#dae2fd]/60 mb-2">Address</label>
                  <textarea 
                    rows={2}
                    value={editing.address}
                    onChange={e => setEditing({ ...editing, address: e.target.value })}
                    className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-3 text-[#dae2fd] focus:border-[#00f5d4] outline-none transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#dae2fd]/60 mb-2">Notes / Description</label>
                  <textarea 
                    rows={3}
                    value={editing.note}
                    onChange={e => setEditing({ ...editing, note: e.target.value })}
                    className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-3 text-[#dae2fd] focus:border-[#00f5d4] outline-none transition-all resize-none"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setEditing(null)}
                    className="flex-1 px-6 py-3 rounded-lg border border-[#3a4a46]/30 text-[#dae2fd]/60 hover:text-[#dae2fd] transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-[#00f5d4] text-[#00382f] font-bold py-3 rounded-lg hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Save Customer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ReportPage = ({ transactions, products, customers }: { transactions: Transaction[], products: Product[], customers: Customer[] }) => {
  const [filterMode, setFilterMode] = useState<'simple' | 'range'>('simple');
  const [aggregation, setAggregation] = useState<'day' | 'month' | 'year'>('day');
  const now = new Date();
  const [year, setYear] = useState<string>(now.getFullYear().toString());
  const [month, setMonth] = useState<string>((now.getMonth() + 1).toString());
  const [day, setDay] = useState<string>('all');

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTransactions = transactions.filter(t => {
    const tDate = new Date(t.timestamp);
    if (filterMode === 'simple') {
      const matchesYear = year === 'all' || tDate.getFullYear().toString() === year;
      const matchesMonth = month === 'all' || (tDate.getMonth() + 1).toString() === month;
      const matchesDay = day === 'all' || tDate.getDate().toString() === day;
      return matchesYear && matchesMonth && matchesDay;
    } else {
      if (!startDate || !endDate) return true;
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      return t.timestamp >= start && t.timestamp <= end;
    }
  });

  const aggregatedData: Record<string, { revenue: number, profit: number, count: number }> = {};
  filteredTransactions.forEach(t => {
    let dateKey = '';
    const date = new Date(t.timestamp);
    if (aggregation === 'day') dateKey = format(date, 'yyyy-MM-dd');
    else if (aggregation === 'month') dateKey = format(date, 'yyyy-MM');
    else dateKey = format(date, 'yyyy');

    if (!aggregatedData[dateKey]) {
      aggregatedData[dateKey] = { revenue: 0, profit: 0, count: 0 };
    }
    aggregatedData[dateKey].revenue += t.totalAmount;
    aggregatedData[dateKey].profit += t.items.reduce((sum, item) => sum + (item.quantity * (item.price - item.cogs)), 0);
    aggregatedData[dateKey].count += 1;
  });

  const reportList = Object.entries(aggregatedData).map(([date, data]) => ({
    date,
    ...data
  })).sort((a, b) => b.date.localeCompare(a.date));

  const totalPages = Math.ceil(reportList.length / ITEMS_PER_PAGE);
  const paginatedReport = reportList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const totalRevenue = reportList.reduce((sum, d) => sum + d.revenue, 0);
  const totalProfit = reportList.reduce((sum, d) => sum + d.profit, 0);
  const totalCount = reportList.reduce((sum, d) => sum + d.count, 0);

  // Product Performance Analysis
  const productStats: Record<string, { name: string, quantity: number, revenue: number, profit: number }> = {};
  filteredTransactions.forEach(t => {
    t.items.forEach(item => {
      if (!productStats[item.productId]) {
        productStats[item.productId] = { name: item.productName, quantity: 0, revenue: 0, profit: 0 };
      }
      productStats[item.productId].quantity += item.quantity;
      productStats[item.productId].revenue += item.quantity * item.price;
      productStats[item.productId].profit += item.quantity * (item.price - item.cogs);
    });
  });

  const productList = Object.values(productStats);
  const topSelling = [...productList].sort((a, b) => b.quantity - a.quantity).slice(0, 5);
  const mostProfitable = [...productList].sort((a, b) => b.profit - a.profit).slice(0, 5);
  
  const soldProductIds = new Set(Object.keys(productStats));
  const deadStock = products.filter(p => !soldProductIds.has(p.id));

  // Customer Insights
  const customerStats: Record<string, { name: string, totalSpend: number, frequency: number, firstTransaction: number }> = {};
  
  // First, find first transaction for all customers to determine new vs returning
  const firstTransactions: Record<string, number> = {};
  transactions.forEach(t => {
    if (t.customerId) {
      if (!firstTransactions[t.customerId] || t.timestamp < firstTransactions[t.customerId]) {
        firstTransactions[t.customerId] = t.timestamp;
      }
    }
  });

  let newCustomerRevenue = 0;
  let returningCustomerRevenue = 0;
  const filteredPeriodStart = filteredTransactions.length > 0 
    ? Math.min(...filteredTransactions.map(t => t.timestamp))
    : 0;

  filteredTransactions.forEach(t => {
    if (t.customerId) {
      if (!customerStats[t.customerId]) {
        const customer = customers.find(c => c.id === t.customerId);
        customerStats[t.customerId] = { 
          name: customer?.name || 'Unknown Customer', 
          totalSpend: 0, 
          frequency: 0,
          firstTransaction: firstTransactions[t.customerId]
        };
      }
      customerStats[t.customerId].totalSpend += t.totalAmount;
      customerStats[t.customerId].frequency += 1;

      // New vs Returning logic
      if (firstTransactions[t.customerId] >= filteredPeriodStart) {
        newCustomerRevenue += t.totalAmount;
      } else {
        returningCustomerRevenue += t.totalAmount;
      }
    } else {
      // Guest transactions are treated as new? Or just ignored for this specific metric?
      // Usually guest checkout is treated as "New" or "Guest"
      newCustomerRevenue += t.totalAmount;
    }
  });

  const topCustomers = Object.values(customerStats)
    .sort((a, b) => b.totalSpend - a.totalSpend)
    .slice(0, 5);

  useEffect(() => {
    setCurrentPage(1);
  }, [year, month, day, filterMode, startDate, endDate]);

  const years = Array.from({ length: 5 }, (_, i) => (now.getFullYear() - i).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-[#dae2fd] mb-2">Business Reports</h1>
          <p className="text-[#dae2fd]/60 font-body">Daily aggregation of architectural financial performance.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#2d3449]/40 backdrop-blur-xl p-4 rounded-xl border border-[#3a4a46]/10 min-w-[140px]">
            <p className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold mb-1">Total Revenue</p>
            <p className="text-xl font-headline font-black text-[#00f5d4] tracking-tight">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="bg-[#2d3449]/40 backdrop-blur-xl p-4 rounded-xl border border-[#3a4a46]/10 min-w-[140px]">
            <p className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold mb-1">Total Profit</p>
            <p className="text-xl font-headline font-black text-[#4edea3] tracking-tight">{formatCurrency(totalProfit)}</p>
          </div>
          <div className="bg-[#2d3449]/40 backdrop-blur-xl p-4 rounded-xl border border-[#3a4a46]/10 min-w-[140px]">
            <p className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold mb-1">Transactions</p>
            <p className="text-xl font-headline font-black text-[#dae2fd] tracking-tight">{totalCount}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 bg-[#2d3449]/20 p-6 rounded-2xl border border-[#3a4a46]/10">
        <div className="flex justify-between items-center">
          <div className="flex bg-[#0b1326] p-1 rounded-lg border border-[#3a4a46]/30">
            <button 
              onClick={() => setAggregation('day')}
              className={cn(
                "px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                aggregation === 'day' ? "bg-[#00f5d4] text-[#00382f]" : "text-[#dae2fd]/40 hover:text-[#dae2fd]"
              )}
            >
              Daily
            </button>
            <button 
              onClick={() => setAggregation('month')}
              className={cn(
                "px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                aggregation === 'month' ? "bg-[#00f5d4] text-[#00382f]" : "text-[#dae2fd]/40 hover:text-[#dae2fd]"
              )}
            >
              Monthly
            </button>
            <button 
              onClick={() => setAggregation('year')}
              className={cn(
                "px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                aggregation === 'year' ? "bg-[#00f5d4] text-[#00382f]" : "text-[#dae2fd]/40 hover:text-[#dae2fd]"
              )}
            >
              Yearly
            </button>
          </div>
          <div className="flex bg-[#0b1326] p-1 rounded-lg border border-[#3a4a46]/30">
            <button 
              onClick={() => setFilterMode('simple')}
              className={cn(
                "px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                filterMode === 'simple' ? "bg-[#00f5d4] text-[#00382f]" : "text-[#dae2fd]/40 hover:text-[#dae2fd]"
              )}
            >
              Simple Date
            </button>
            <button 
              onClick={() => setFilterMode('range')}
              className={cn(
                "px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                filterMode === 'range' ? "bg-[#00f5d4] text-[#00382f]" : "text-[#dae2fd]/40 hover:text-[#dae2fd]"
              )}
            >
              Date Range
            </button>
          </div>
        </div>

        {filterMode === 'simple' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold">Year</label>
              <select 
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-2 text-xs font-bold text-[#dae2fd] focus:border-[#00f5d4] outline-none"
              >
                <option value="all">All Years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold">Month</label>
              <select 
                value={month}
                onChange={e => setMonth(e.target.value)}
                className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-2 text-xs font-bold text-[#dae2fd] focus:border-[#00f5d4] outline-none"
              >
                <option value="all">All Months</option>
                {months.map(m => <option key={m} value={m}>{format(new Date(2000, parseInt(m) - 1), 'MMMM')}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold">Day</label>
              <select 
                value={day}
                onChange={e => setDay(e.target.value)}
                className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-2 text-xs font-bold text-[#dae2fd] focus:border-[#00f5d4] outline-none"
              >
                <option value="all">All Days</option>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold">Start Date</label>
              <input 
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-2 text-xs font-bold text-[#dae2fd] focus:border-[#00f5d4] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold">End Date</label>
              <input 
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-2 text-xs font-bold text-[#dae2fd] focus:border-[#00f5d4] outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Product Performance Analysis */}
<div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                          <InsightsPanel
          reportList={reportList}
          productList={productList}
          topSelling={topSelling}
          mostProfitable={mostProfitable}
          deadStock={deadStock}
          totalRevenue={totalRevenue}
        />
</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Top Selling Products */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#00f5d4]/10 rounded-lg text-[#00f5d4]">
              <TrendingUp size={20} />
            </div>
            <h2 className="text-xl font-headline font-bold text-[#dae2fd]">Top Selling Products</h2>
          </div>
          <div className="bg-[#2d3449]/20 rounded-2xl border border-[#3a4a46]/10 overflow-hidden">
            {topSelling.length > 0 ? topSelling.map((p, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 border-b border-[#3a4a46]/10 last:border-0 hover:bg-[#2d3449]/40 transition-colors">
                <div>
                  <p className="text-sm font-headline font-bold text-[#dae2fd]">{p.name}</p>
                  <p className="text-[10px] text-[#dae2fd]/40 uppercase tracking-widest font-bold">{p.quantity} Units Sold</p>
                </div>
                <p className="font-headline font-bold text-[#00f5d4]">{formatCurrency(p.revenue)}</p>
              </div>
            )) : (
              <div className="p-8 text-center text-[#dae2fd]/20 italic text-sm">No sales data available</div>
            )}
          </div>
        </div>

        {/* Most Profitable Products */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#4edea3]/10 rounded-lg text-[#4edea3]">
              <TrendingUp size={20} />
            </div>
            <h2 className="text-xl font-headline font-bold text-[#dae2fd]">Most Profitable Products</h2>
          </div>
          <div className="bg-[#2d3449]/20 rounded-2xl border border-[#3a4a46]/10 overflow-hidden">
            {mostProfitable.length > 0 ? mostProfitable.map((p, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 border-b border-[#3a4a46]/10 last:border-0 hover:bg-[#2d3449]/40 transition-colors">
                <div>
                  <p className="text-sm font-headline font-bold text-[#dae2fd]">{p.name}</p>
                  <p className="text-[10px] text-[#dae2fd]/40 uppercase tracking-widest font-bold">Margin: {((p.profit / p.revenue) * 100).toFixed(1)}%</p>
                </div>
                <p className="font-headline font-bold text-[#4edea3]">{formatCurrency(p.profit)}</p>
              </div>
            )) : (
              <div className="p-8 text-center text-[#dae2fd]/20 italic text-sm">No profit data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Dead Stock Report */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#ffb4ab]/10 rounded-lg text-[#ffb4ab]">
            <AlertTriangle size={20} />
          </div>
          <h2 className="text-xl font-headline font-bold text-[#dae2fd]">Dead Stock Report</h2>
        </div>
        <div className="bg-[#2d3449]/20 rounded-2xl border border-[#3a4a46]/10 overflow-hidden">
          {deadStock.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {deadStock.map(p => (
                <div key={p.id} className="p-4 bg-[#0b1326] rounded-xl border border-[#3a4a46]/10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#2d3449] flex items-center justify-center text-[#dae2fd]/20">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-headline font-bold text-[#dae2fd]">{p.name}</p>
                    <p className="text-[10px] text-[#dae2fd]/40 uppercase tracking-widest font-bold">Stock: {p.stock} | {p.category}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <CheckCircle2 className="mx-auto mb-4 text-[#4edea3]/40" size={48} />
              <p className="text-[#dae2fd]/40 uppercase tracking-widest font-bold">All products have sales activity in this period!</p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
        {/* Top Customers */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#00f5d4]/10 rounded-lg text-[#00f5d4]">
              <Users size={20} />
            </div>
            <h2 className="text-xl font-headline font-bold text-[#dae2fd]">Top Customers</h2>
          </div>
          <div className="bg-[#2d3449]/20 rounded-2xl border border-[#3a4a46]/10 overflow-hidden">
            {topCustomers.length > 0 ? topCustomers.map((c, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 border-b border-[#3a4a46]/10 last:border-0 hover:bg-[#2d3449]/40 transition-colors">
                <div>
                  <p className="text-sm font-headline font-bold text-[#dae2fd]">{c.name}</p>
                  <p className="text-[10px] text-[#dae2fd]/40 uppercase tracking-widest font-bold">{c.frequency} Visits</p>
                </div>
                <p className="font-headline font-bold text-[#00f5d4]">{formatCurrency(c.totalSpend)}</p>
              </div>
            )) : (
              <div className="p-8 text-center text-[#dae2fd]/20 italic text-sm">No customer data available</div>
            )}
          </div>
        </div>

        {/* New vs. Returning Customers */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#4edea3]/10 rounded-lg text-[#4edea3]">
              <History size={20} />
            </div>
            <h2 className="text-xl font-headline font-bold text-[#dae2fd]">New vs. Returning</h2>
          </div>
          <div className="bg-[#2d3449]/20 rounded-2xl border border-[#3a4a46]/10 p-6 h-full flex flex-col justify-center">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <p className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold">New Customers</p>
                  <p className="text-sm font-headline font-bold text-[#00f5d4]">{formatCurrency(newCustomerRevenue)}</p>
                </div>
                <div className="h-2 bg-[#0b1326] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#00f5d4] transition-all duration-1000" 
                    style={{ width: `${(newCustomerRevenue / (newCustomerRevenue + returningCustomerRevenue || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-2">
                  <p className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold">Returning Customers</p>
                  <p className="text-sm font-headline font-bold text-[#4edea3]">{formatCurrency(returningCustomerRevenue)}</p>
                </div>
                <div className="h-2 bg-[#0b1326] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#4edea3] transition-all duration-1000" 
                    style={{ width: `${(returningCustomerRevenue / (newCustomerRevenue + returningCustomerRevenue || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="pt-4 border-t border-[#3a4a46]/10 flex justify-between items-center">
                <p className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold">Retention Rate</p>
                <p className="text-lg font-headline font-bold text-[#dae2fd]">
                  {((returningCustomerRevenue / (newCustomerRevenue + returningCustomerRevenue || 1)) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 text-[10px] uppercase tracking-widest text-[#dae2fd]/60 font-bold">
          <div className="col-span-3">Date</div>
          <div className="col-span-2 text-center">Transactions</div>
          <div className="col-span-3 text-right">Revenue</div>
          <div className="col-span-3 text-right">Profit</div>
          <div className="col-span-1"></div>

        </div>

        {paginatedReport.length > 0 ? paginatedReport.map(item => (
          <div key={item.date} className="grid grid-cols-12 gap-4 items-center px-6 py-5 bg-[#2d3449]/40 backdrop-blur-xl rounded-lg border border-[#3a4a46]/10 hover:border-[#00f5d4]/30 transition-all group">
            <div className="col-span-3">
              <p className="font-headline font-bold text-[#dae2fd] group-hover:text-[#00f5d4] transition-colors uppercase tracking-wider text-sm">
                {aggregation === 'day' ? format(new Date(item.date), 'EEEE, MMM dd, yyyy') : 
                 aggregation === 'month' ? format(new Date(item.date), 'MMMM yyyy') : 
                 item.date}
              </p>
            </div>
            <div className="col-span-2 text-center text-sm font-bold text-[#dae2fd]/60">
              {item.count}
            </div>
            <div className="col-span-3 text-right font-headline font-bold text-[#00f5d4]">
              {formatCurrency(item.revenue)}
            </div>
            <div className="col-span-3 text-right font-headline font-bold text-[#4edea3]">
              {formatCurrency(item.profit)}
            </div>
            <div className="col-span-1 flex justify-end">
              <TrendingUp size={16} className={cn(item.profit > 0 ? "text-[#4edea3]" : "text-[#ffb4ab]")} />
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-[#2d3449]/20 rounded-xl border border-dashed border-[#3a4a46]/30">
            <BarChart3 className="mx-auto mb-4 text-[#dae2fd]/20" size={48} />
            <p className="text-[#dae2fd]/40 uppercase tracking-widest font-bold">No data for selected period</p>
          </div>
        )}
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

const StockManagement = ({ products, onUpdateProducts }: { products: Product[], onUpdateProducts: (p: Product[]) => void }) => {
  const [movements, setMovements] = useState<StockMovement[]>(db.getStockMovements());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMovement, setNewMovement] = useState<{ productId: string, type: MovementType, quantity: number, movementType: StockMovementReason }>({
    productId: '',
    type: 'IN',
    quantity: 0,
    movementType: 'restock'
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'simple' | 'range'>('simple');
  const now = new Date();
  const [year, setYear] = useState<string>(now.getFullYear().toString());
  const [month, setMonth] = useState<string>((now.getMonth() + 1).toString());
  const [day, setDay] = useState<string>(now.getDate().toString());
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productSearchQuery, setProductSearchQuery] = useState('');

  const filteredMovements = movements.filter(m => {
    const product = products.find(p => p.id === m.productId);
    const mDate = new Date(m.createdAt);
    
    // Search Filter
    const matchesSearch = product?.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         m.movementType.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    // Date Filter
    if (filterMode === 'simple') {
      const matchesYear = year === 'all' || mDate.getFullYear().toString() === year;
      const matchesMonth = month === 'all' || (mDate.getMonth() + 1).toString() === month;
      const matchesDay = day === 'all' || mDate.getDate().toString() === day;
      return matchesYear && matchesMonth && matchesDay;
    } else {
      if (!startDate || !endDate) return true;
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      return m.createdAt >= start && m.createdAt <= end;
    }
  });

  const totalPages = Math.ceil(filteredMovements.length / ITEMS_PER_PAGE);
  const paginatedMovements = [...filteredMovements].reverse().slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, year, month, day, filterMode, startDate, endDate]);

  const years = Array.from({ length: 5 }, (_, i) => (now.getFullYear() - i).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  const handleAddMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMovement.productId || newMovement.quantity <= 0) return;

    db.addStockMovement(newMovement);
    
    // Update product stock
    const updatedProducts = products.map(p => {
      if (p.id === newMovement.productId) {
        const adjustment = newMovement.type === 'IN' ? newMovement.quantity : -newMovement.quantity;
        return { ...p, stock: p.stock + adjustment };
      }
      return p;
    });
    
    onUpdateProducts(updatedProducts);
    setMovements(db.getStockMovements());
    setShowAddModal(false);
    setNewMovement({ productId: '', type: 'IN', quantity: 0, movementType: 'restock' });
    setProductSearchQuery('');
  };

  const filteredProductsForModal = products.filter(p => 
    p.name.toLowerCase().includes(productSearchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-[#dae2fd] mb-2">Stock Management</h1>
          <p className="text-[#dae2fd]/60 font-body">Track architectural inventory mutations and supply chain flow.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-br from-[#00f5d4] to-[#4edea3] text-[#00382f] px-6 py-3 rounded-md font-headline font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(0,245,212,0.3)] hover:scale-[1.02] transition-transform active:scale-95"
        >
          <Plus size={18} /> Record Movement
        </button>
      </div>

      <div className="space-y-6 bg-[#2d3449]/20 p-6 rounded-2xl border border-[#3a4a46]/10">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#83948f] group-focus-within:text-[#00f5d4] transition-colors" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by Product Name or Reason..."
              className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg pl-12 pr-4 py-2 text-[#dae2fd] focus:border-[#00f5d4] outline-none transition-all"
            />
          </div>
          <div className="flex bg-[#0b1326] p-1 rounded-lg border border-[#3a4a46]/30">
            <button 
              onClick={() => setFilterMode('simple')}
              className={cn(
                "px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                filterMode === 'simple' ? "bg-[#00f5d4] text-[#00382f]" : "text-[#dae2fd]/40 hover:text-[#dae2fd]"
              )}
            >
              Simple Date
            </button>
            <button 
              onClick={() => setFilterMode('range')}
              className={cn(
                "px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                filterMode === 'range' ? "bg-[#00f5d4] text-[#00382f]" : "text-[#dae2fd]/40 hover:text-[#dae2fd]"
              )}
            >
              Date Range
            </button>
          </div>
        </div>

        {filterMode === 'simple' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold">Year</label>
              <select 
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-2 text-xs font-bold text-[#dae2fd] focus:border-[#00f5d4] outline-none"
              >
                <option value="all">All Years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold">Month</label>
              <select 
                value={month}
                onChange={e => setMonth(e.target.value)}
                className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-2 text-xs font-bold text-[#dae2fd] focus:border-[#00f5d4] outline-none"
              >
                <option value="all">All Months</option>
                {months.map(m => <option key={m} value={m}>{format(new Date(2000, parseInt(m) - 1), 'MMMM')}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold">Day</label>
              <select 
                value={day}
                onChange={e => setDay(e.target.value)}
                className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-2 text-xs font-bold text-[#dae2fd] focus:border-[#00f5d4] outline-none"
              >
                <option value="all">All Days</option>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#83948f]" size={14} />
                <input 
                  type="date" 
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg pl-10 pr-4 py-2 text-xs font-bold text-[#dae2fd] focus:border-[#00f5d4] outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#83948f]" size={14} />
                <input 
                  type="date" 
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg pl-10 pr-4 py-2 text-xs font-bold text-[#dae2fd] focus:border-[#00f5d4] outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 text-[10px] uppercase tracking-widest text-[#dae2fd]/60 font-bold">
          <div className="col-span-3">Timestamp</div>
          <div className="col-span-3">Product</div>
          <div className="col-span-2 text-center">Type</div>
          <div className="col-span-2 text-center">Quantity</div>
          <div className="col-span-2 text-center">Reason</div>
        </div>

        {paginatedMovements.map(m => {
          const product = products.find(p => p.id === m.productId);
          return (
            <div key={m.id} className="grid grid-cols-12 gap-4 items-center px-6 py-4 bg-[#2d3449]/40 backdrop-blur-xl rounded-lg border border-[#3a4a46]/10 hover:border-[#dae2fd]/10 transition-all group">
              <div className="col-span-3 text-xs text-[#dae2fd]/60">
                {format(new Date(m.createdAt), 'MMM dd, yyyy • HH:mm')}
              </div>
              <div className="col-span-3 font-headline font-bold text-[#dae2fd]">
                {product?.name || 'Unknown Product'}
              </div>
              <div className="col-span-2 flex justify-center">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                  m.type === 'IN' ? "bg-[#4edea3]/10 text-[#4edea3] border-[#4edea3]/20" : "bg-[#ffb4ab]/10 text-[#ffb4ab] border-[#ffb4ab]/20"
                )}>
                  {m.type}
                </span>
              </div>
              <div className="col-span-2 text-center font-headline font-bold text-[#dae2fd]">
                {m.quantity}
              </div>
              <div className="col-span-2 flex justify-center">
                <span className="text-[10px] text-[#dae2fd]/60 uppercase font-bold tracking-widest border border-[#3a4a46]/30 px-2 py-1 rounded bg-[#0b1326]/40">
                  {m.movementType}
                </span>
              </div>
            </div>
          );
        })}

        {filteredMovements.length === 0 && (
          <div className="text-center py-20 bg-[#2d3449]/20 rounded-xl border border-dashed border-[#3a4a46]/30">
            <ArrowRightLeft className="mx-auto mb-4 text-[#dae2fd]/20" size={48} />
            <p className="text-[#dae2fd]/40 uppercase tracking-widest font-bold">No stock movements recorded</p>
          </div>
        )}
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-[#060e20]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[#171f33] border border-[#3a4a46]/30 rounded-2xl p-8 w-full max-w-md shadow-2xl"
            >
              <h2 className="text-2xl font-headline font-bold text-[#dae2fd] mb-6">Record Stock Movement</h2>
              <form onSubmit={handleAddMovement} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#dae2fd]/60 mb-2">Product</label>
                  <div className="space-y-2">
                    <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#83948f] group-focus-within:text-[#00f5d4] transition-colors" size={14} />
                      <input 
                        type="text"
                        placeholder="Search product..."
                        value={productSearchQuery}
                        onChange={e => setProductSearchQuery(e.target.value)}
                        className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg pl-9 pr-4 py-2 text-xs text-[#dae2fd] focus:border-[#00f5d4] outline-none transition-all"
                      />
                    </div>
                    <select 
                      required
                      value={newMovement.productId}
                      onChange={e => setNewMovement({ ...newMovement, productId: e.target.value })}
                      className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-3 text-[#dae2fd] focus:border-[#00f5d4] outline-none transition-all"
                    >
                      <option value="">Select Product</option>
                      {filteredProductsForModal.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (Current: {p.stock})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#dae2fd]/60 mb-2">Movement Type</label>
                    <div className="flex bg-[#0b1326] p-1 rounded-lg border border-[#3a4a46]/30">
                      <button 
                        type="button"
                        onClick={() => setNewMovement({ ...newMovement, type: 'IN' })}
                        className={cn(
                          "flex-1 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                          newMovement.type === 'IN' ? "bg-[#4edea3] text-[#00382f]" : "text-[#dae2fd]/40"
                        )}
                      >
                        IN
                      </button>
                      <button 
                        type="button"
                        onClick={() => setNewMovement({ ...newMovement, type: 'OUT' })}
                        className={cn(
                          "flex-1 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
                          newMovement.type === 'OUT' ? "bg-[#ffb4ab] text-[#00382f]" : "text-[#dae2fd]/40"
                        )}
                      >
                        OUT
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#dae2fd]/60 mb-2">Quantity</label>
                    <input 
                      type="number"
                      required
                      min="1"
                      value={newMovement.quantity}
                      onChange={e => setNewMovement({ ...newMovement, quantity: Number(e.target.value) })}
                      className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-3 text-[#dae2fd] focus:border-[#00f5d4] outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#dae2fd]/60 mb-2">Reason</label>
                  <select 
                    required
                    value={newMovement.movementType}
                    onChange={e => setNewMovement({ ...newMovement, movementType: e.target.value as StockMovementReason })}
                    className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-3 text-[#dae2fd] focus:border-[#00f5d4] outline-none transition-all"
                  >
                    <option value="restock">Restock</option>
                    <option value="adjustment">Adjustment</option>
                    <option value="sale">Sale</option>
                    <option value="opening">Opening</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 rounded-lg border border-[#3a4a46]/30 text-[#dae2fd]/60 hover:text-[#dae2fd] transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-[#00f5d4] text-[#00382f] font-bold py-3 rounded-lg hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SettingsPage = ({ config, onUpdateConfig, logs }: { config: BusinessConfig, onUpdateConfig: (c: BusinessConfig) => void, logs: AuditLog[] }) => {
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'logs'>('general');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateConfig({ ...config, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateBank = (index: number, field: keyof BankAccount, value: string) => {
    const newBanks = [...(config.bankAccounts || [])];
    if (!newBanks[index]) {
      newBanks[index] = { bankName: '', accountNumber: '', accountName: '' };
    }
    newBanks[index] = { ...newBanks[index], [field]: value };
    onUpdateConfig({ ...config, bankAccounts: newBanks });
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-[#dae2fd] mb-2">Settings</h1>
          <p className="text-[#dae2fd]/60 font-body">Manage your architectural terminal configuration and audit trails.</p>
        </div>
        <div className="flex bg-[#2d3449]/20 p-1 rounded-lg border border-[#3a4a46]/10">
          <button 
            onClick={() => setActiveSubTab('general')}
            className={cn(
              "px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
              activeSubTab === 'general' ? "bg-[#00f5d4] text-[#00382f]" : "text-[#dae2fd]/40 hover:text-[#dae2fd]"
            )}
          >
            General
          </button>
          <button 
            onClick={() => setActiveSubTab('logs')}
            className={cn(
              "px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all",
              activeSubTab === 'logs' ? "bg-[#00f5d4] text-[#00382f]" : "text-[#dae2fd]/40 hover:text-[#dae2fd]"
            )}
          >
            Audit Logs
          </button>
        </div>
      </div>

      {activeSubTab === 'general' ? (
        <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#2d3449]/20 p-8 rounded-2xl border border-[#3a4a46]/10 space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-headline font-bold text-[#dae2fd]">Business Identity</h2>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl bg-[#0b1326] border-2 border-dashed border-[#3a4a46]/30 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#00f5d4]/50">
                    {config.logo ? (
                      <img src={config.logo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Plus size={24} className="text-[#dae2fd]/20" />
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <p className="text-[10px] text-center mt-2 text-[#dae2fd]/40 uppercase font-bold tracking-widest">Business Logo</p>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold">Business Name</label>
                    <input 
                      type="text"
                      value={config.name}
                      onChange={e => onUpdateConfig({ ...config, name: e.target.value })}
                      className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-2 text-sm font-bold text-[#dae2fd] focus:border-[#00f5d4] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold">Phone Number</label>
                    <input 
                      type="text"
                      value={config.phone || ''}
                      onChange={e => onUpdateConfig({ ...config, phone: e.target.value })}
                      className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-2 text-sm font-bold text-[#dae2fd] focus:border-[#00f5d4] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold">Business Address</label>
                <textarea 
                  rows={3}
                  value={config.address || ''}
                  onChange={e => onUpdateConfig({ ...config, address: e.target.value })}
                  className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-3 text-sm font-bold text-[#dae2fd] focus:border-[#00f5d4] outline-none transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold">Terminal Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['coffee', 'retail', 'services', 'custom'] as BusinessType[]).map(type => (
                    <button
                      key={type}
                      onClick={() => onUpdateConfig({ ...config, type })}
                      className={cn(
                        "p-3 rounded-xl border transition-all flex items-center gap-3",
                        config.type === type 
                          ? "bg-[#00f5d4]/10 border-[#00f5d4] text-[#00f5d4]" 
                          : "bg-[#0b1326] border-[#3a4a46]/30 text-[#dae2fd]/40 hover:border-[#dae2fd]/20"
                      )}
                    >
                      {type === 'coffee' && <Coffee size={16} />}
                      {type === 'retail' && <Store size={16} />}
                      {type === 'services' && <Wrench size={16} />}
                      {type === 'custom' && <Cpu size={16} />}
                      <span className="text-[10px] font-black uppercase tracking-widest">{type}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-[#3a4a46]/10">
              <button 
                onClick={() => onUpdateConfig({ ...config, initialized: false })}
                className="w-full px-6 py-3 bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 text-[#ffb4ab] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#ffb4ab]/20 transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={14} />
                Reset Terminal Configuration
              </button>
            </div>
          </div>

          <div className="bg-[#2d3449]/20 p-8 rounded-2xl border border-[#3a4a46]/10 space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-headline font-bold text-[#dae2fd]">Payment Information</h2>
              <p className="text-xs text-[#dae2fd]/40 font-body">Add up to 3 bank accounts for invoice generation.</p>
              
              {[0, 1, 2].map(idx => (
                <div key={idx} className="p-4 bg-[#0b1326]/40 rounded-xl border border-[#3a4a46]/20 space-y-4">
                  <p className="text-[10px] font-black text-[#00f5d4] uppercase tracking-widest">Bank Account #{idx + 1}</p>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold">Bank Name</label>
                      <input 
                        type="text"
                        placeholder="e.g. BCA, Mandiri"
                        value={config.bankAccounts?.[idx]?.bankName || ''}
                        onChange={e => updateBank(idx, 'bankName', e.target.value)}
                        className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-2 text-xs font-bold text-[#dae2fd] focus:border-[#00f5d4] outline-none transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold">Account Number</label>
                        <input 
                          type="text"
                          value={config.bankAccounts?.[idx]?.accountNumber || ''}
                          onChange={e => updateBank(idx, 'accountNumber', e.target.value)}
                          className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-2 text-xs font-bold text-[#dae2fd] focus:border-[#00f5d4] outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-[#dae2fd]/40 font-bold">Account Name</label>
                        <input 
                          type="text"
                          value={config.bankAccounts?.[idx]?.accountName || ''}
                          onChange={e => updateBank(idx, 'accountName', e.target.value)}
                          className="w-full bg-[#0b1326] border border-[#3a4a46]/30 rounded-lg px-4 py-2 text-xs font-bold text-[#dae2fd] focus:border-[#00f5d4] outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <LogsPage logs={logs} />
      )}
    </div>
  );
};

const LogsPage = ({ logs }: { logs: AuditLog[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);
  const paginatedLogs = [...logs].reverse().slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-[#dae2fd] mb-2">Audit Logs</h1>
        <p className="text-[#dae2fd]/60 font-body">Real-time system activity and architectural mutation tracking.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 text-[10px] uppercase tracking-widest text-[#dae2fd]/60 font-bold">
          <div className="col-span-2">Timestamp</div>
          <div className="col-span-2">Action</div>
          <div className="col-span-2">Entity</div>
          <div className="col-span-6">Details</div>
        </div>

        {paginatedLogs.length > 0 ? paginatedLogs.map(log => (
          <div key={log.id} className="grid grid-cols-12 gap-4 items-center px-6 py-4 bg-[#2d3449]/40 backdrop-blur-xl rounded-lg border border-[#3a4a46]/10 hover:border-[#dae2fd]/10 transition-all group">
            <div className="col-span-2 text-[10px] text-[#dae2fd]/60 font-mono">
              {format(new Date(log.timestamp), 'HH:mm:ss')}
              <br/>
              {format(new Date(log.timestamp), 'MMM dd, yyyy')}
            </div>
            <div className="col-span-2">
              <span className={cn(
                "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                log.action === 'create' ? "bg-[#4edea3]/10 text-[#4edea3]" :
                log.action === 'update' ? "bg-[#00f5d4]/10 text-[#00f5d4]" :
                "bg-[#ffb4ab]/10 text-[#ffb4ab]"
              )}>
                {log.action}
              </span>
            </div>
            <div className="col-span-2 text-[10px] font-headline font-bold text-[#dae2fd]/80 uppercase tracking-wider">
              {log.entityType}
            </div>
            <div className="col-span-6 text-xs text-[#dae2fd] font-medium">
              {log.details}
              <p className="text-[9px] text-[#dae2fd]/30 mt-1 uppercase">ID: {log.entityId}</p>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-[#2d3449]/20 rounded-xl border border-dashed border-[#3a4a46]/30">
            <ClipboardList className="mx-auto mb-4 text-[#dae2fd]/20" size={48} />
            <p className="text-[#dae2fd]/40 uppercase tracking-widest font-bold">No system logs recorded yet</p>
          </div>
        )}
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [config, setConfig] = useState<BusinessConfig>(db.getConfig());
  const [products, setProducts] = useState<Product[]>(db.getProducts());
  const [transactions, setTransactions] = useState<Transaction[]>(db.getTransactions());
  const [customers, setCustomers] = useState<Customer[]>(db.getCustomers());
  const [logs, setLogs] = useState<AuditLog[]>(db.getLogs());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'checkout' | 'products' | 'customers' | 'history' | 'report' | 'stock' | 'settings'>('dashboard');

  useEffect(() => {
    db.saveConfig(config);
  }, [config]);

  useEffect(() => {
    db.saveProducts(products);
    setLogs(db.getLogs());
  }, [products]);

  useEffect(() => {
    db.saveCustomers(customers);
    setLogs(db.getLogs());
  }, [customers]);

  const handleOnboarding = (newConfig: BusinessConfig) => {
    setConfig(newConfig);
  };

  const handleTransaction = (t: Transaction) => {
    db.saveTransaction(t);
    setTransactions(db.getTransactions());
    setProducts(db.getProducts());
    setLogs(db.getLogs());
    setActiveTab('dashboard');
  };

  const handleProductsUpdate = (newProducts: Product[]) => {
    setProducts(newProducts);
  };

  const handleTransactionUpdate = (t: Transaction) => {
    db.updateTransaction(t);
    setTransactions(db.getTransactions());
    setLogs(db.getLogs());
  };

  if (!config.initialized) {
    return <Onboarding onComplete={handleOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-body flex flex-col">
      {/* Top Nav */}
      <header className="fixed top-0 w-full z-50 bg-[#0b1326]/60 backdrop-blur-3xl flex justify-between items-center px-8 h-20 bg-gradient-to-b from-[#2d3449]/20 to-transparent shadow-[0_8px_32px_rgba(0,223,193,0.06)]">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-black tracking-tighter text-[#00f5d4] drop-shadow-[0_0_8px_rgba(0,245,212,0.4)] font-headline">KasirInsight</span>
          <div className="hidden md:flex gap-6 items-center font-headline font-bold tracking-tight">
            <button onClick={() => setActiveTab('dashboard')} className={cn("px-4 py-2 rounded-lg transition-all", activeTab === 'dashboard' ? "text-[#d7fff3] border-b-2 border-[#00f5d4]" : "text-[#dae2fd]/60 hover:bg-[#2d3449]/40")}>Dashboard</button>
            <button onClick={() => setActiveTab('checkout')} className={cn("px-4 py-2 rounded-lg transition-all", activeTab === 'checkout' ? "text-[#d7fff3] border-b-2 border-[#00f5d4]" : "text-[#dae2fd]/60 hover:bg-[#2d3449]/40")}>Checkout</button>
            <button onClick={() => setActiveTab('products')} className={cn("px-4 py-2 rounded-lg transition-all", activeTab === 'products' ? "text-[#d7fff3] border-b-2 border-[#00f5d4]" : "text-[#dae2fd]/60 hover:bg-[#2d3449]/40")}>Products</button>
            <button onClick={() => setActiveTab('customers')} className={cn("px-4 py-2 rounded-lg transition-all", activeTab === 'customers' ? "text-[#d7fff3] border-b-2 border-[#00f5d4]" : "text-[#dae2fd]/60 hover:bg-[#2d3449]/40")}>Customers</button>
            <button onClick={() => setActiveTab('history')} className={cn("px-4 py-2 rounded-lg transition-all", activeTab === 'history' ? "text-[#d7fff3] border-b-2 border-[#00f5d4]" : "text-[#dae2fd]/60 hover:bg-[#2d3449]/40")}>Transactions</button>
            <button onClick={() => setActiveTab('report')} className={cn("px-4 py-2 rounded-lg transition-all", activeTab === 'report' ? "text-[#d7fff3] border-b-2 border-[#00f5d4]" : "text-[#dae2fd]/60 hover:bg-[#2d3449]/40")}>Reports</button>
            <button onClick={() => setActiveTab('stock')} className={cn("px-4 py-2 rounded-lg transition-all", activeTab === 'stock' ? "text-[#d7fff3] border-b-2 border-[#00f5d4]" : "text-[#dae2fd]/60 hover:bg-[#2d3449]/40")}>Stock</button>
            <button onClick={() => setActiveTab('settings')} className={cn("px-4 py-2 rounded-lg transition-all", activeTab === 'settings' ? "text-[#d7fff3] border-b-2 border-[#00f5d4]" : "text-[#dae2fd]/60 hover:bg-[#2d3449]/40")}>Settings</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell size={20} className="text-[#00f5d4]" />
            {products.some(p => p.stock <= p.lowStockThreshold) && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ffb4ab] rounded-full"></span>
            )}
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-[#3a4a46]/15 overflow-hidden">
            <div className="w-full h-full bg-[#2d3449] flex items-center justify-center text-[#00f5d4]">
              <Store size={20} />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-20">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-64 z-40 bg-[#060e20] border-r border-[#3a4a46]/15 flex flex-col pt-24 pb-8 hidden lg:flex">
          <div className="px-6 mb-10 flex items-center gap-4">
            <div className="w-12 h-12 bg-[#222a3d] rounded-lg flex items-center justify-center border border-[#3a4a46]/15">
              {config.type === 'coffee' && <Coffee className="text-[#00f5d4]" />}
              {config.type === 'retail' && <Store className="text-[#00f5d4]" />}
              {config.type === 'services' && <Wrench className="text-[#00f5d4]" />}
              {config.type === 'custom' && <Cpu className="text-[#00f5d4]" />}
            </div>
            <div>
              <p className="font-headline font-bold text-xs uppercase tracking-widest text-[#dae2fd]">{config.name}</p>
              <p className="text-[10px] text-[#83948f] tracking-wider uppercase">{config.type} Terminal</p>
            </div>
          </div>
          <nav className="flex-1 space-y-2">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarItem icon={ShoppingCart} label="Checkout" active={activeTab === 'checkout'} onClick={() => setActiveTab('checkout')} />
            <SidebarItem icon={Package} label="Products" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
            <SidebarItem icon={Users} label="Customers" active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} />
            <SidebarItem icon={History} label="Transactions" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
            <SidebarItem icon={BarChart3} label="Reports" active={activeTab === 'report'} onClick={() => setActiveTab('report')} />
            <SidebarItem icon={ArrowRightLeft} label="Stock" active={activeTab === 'stock'} onClick={() => setActiveTab('stock')} />
            <SidebarItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </nav>
          <div className="mt-auto px-4">
            <SidebarItem icon={LogOut} label="Logout" onClick={() => setConfig({ ...config, initialized: false })} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:pl-64 flex-1 bg-[#0b1326] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full overflow-y-auto scrollbar-hide"
            >
              {activeTab === 'dashboard' && <Dashboard transactions={transactions} products={products} />}
              {activeTab === 'checkout' && <Checkout products={products} customers={customers} transactions={transactions} onComplete={handleTransaction} />}
              {activeTab === 'products' && <Products products={products} onUpdate={handleProductsUpdate} />}
              {activeTab === 'customers' && <Customers customers={customers} onUpdate={setCustomers} />}
              {activeTab === 'history' && <HistoryPage transactions={transactions} customers={customers} onUpdateTransaction={handleTransactionUpdate} config={config} />}
              {activeTab === 'report' && <ReportPage transactions={transactions} products={products} customers={customers} />}
              {activeTab === 'stock' && <StockManagement products={products} onUpdateProducts={handleProductsUpdate} />}
              {activeTab === 'settings' && <SettingsPage config={config} onUpdateConfig={setConfig} logs={logs} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* HUD Layer */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-8 py-4 bg-[#2d3449]/60 backdrop-blur-2xl rounded-full border border-[#00f5d4]/20 shadow-2xl flex items-center gap-8 z-50 pointer-events-none md:pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-[#4edea3] rounded-full animate-pulse shadow-[0_0_8px_rgba(78,222,163,0.8)]"></div>
          <p className="text-[10px] font-bold text-[#4edea3] uppercase tracking-widest">System Online</p>
        </div>
        <div className="h-4 w-[1px] bg-[#3a4a46]/30"></div>
        <div className="flex items-center gap-3">
          <TrendingUp size={14} className="text-[#00f5d4]" />
          <p className="text-[10px] font-bold text-[#dae2fd] uppercase tracking-widest">Peak Load Optimization Active</p>
        </div>
      </div>
    </div>
  );
}
