import { Product, Transaction, BusinessConfig, AuditLog, LogAction, LogEntityType, Customer } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'kasir_insight_products',
  TRANSACTIONS: 'kasir_insight_transactions',
  CONFIG: 'kasir_insight_config',
  LOGS: 'kasir_insight_logs',
  CUSTOMERS: 'kasir_insight_customers',
};

// Initial data for demo if empty
const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Titanium Spigot V1', sellingPrice: 245000, cogs: 180000, stock: 15, category: 'Hardware', lowStockThreshold: 5, healthyStockThreshold: 10 },
  { id: '2', name: 'Steel Tensile Cable', sellingPrice: 580000, cogs: 420000, stock: 3, category: 'Cables', lowStockThreshold: 5, healthyStockThreshold: 15 },
  { id: '3', name: 'Ultra-Clear Tempered', sellingPrice: 1290000, cogs: 950000, stock: 10, category: 'Glass', lowStockThreshold: 2, healthyStockThreshold: 8 },
  { id: '4', name: 'M12 Anchor Bolt', sellingPrice: 85000, cogs: 45000, stock: 50, category: 'Hardware', lowStockThreshold: 10, healthyStockThreshold: 25 },
];

export const db = {
  getProducts: (): Product[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(data);
  },

  saveProducts: (products: Product[]) => {
    const oldProducts = db.getProducts();
    
    // Check for new products
    products.forEach(p => {
      const exists = oldProducts.find(op => op.id === p.id);
      if (!exists) {
        db.addLog('create', 'product', p.id, `Created product: ${p.name}`);
      } else if (JSON.stringify(exists) !== JSON.stringify(p)) {
        db.addLog('update', 'product', p.id, `Updated product: ${p.name}`);
      }
    });

    // Check for deleted products
    oldProducts.forEach(op => {
      const stillExists = products.find(p => p.id === op.id);
      if (!stillExists) {
        db.addLog('delete', 'product', op.id, `Deleted product: ${op.name}`);
      }
    });

    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  getTransactions: (): Transaction[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  },

  saveTransaction: (transaction: Transaction) => {
    const transactions = db.getTransactions();
    transactions.push(transaction);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));

    db.addLog('create', 'transaction', transaction.id, `Created transaction with total: ${transaction.totalAmount}`);

    // Update stock
    const products = db.getProducts();
    transaction.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        product.stock -= item.quantity;
      }
    });
    db.saveProducts(products);
  },

  updateTransaction: (transaction: Transaction) => {
    const transactions = db.getTransactions();
    const index = transactions.findIndex(t => t.id === transaction.id);
    if (index !== -1) {
      const old = transactions[index];
      transactions[index] = transaction;
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
      
      if (old.status !== transaction.status) {
        db.addLog('update', 'transaction', transaction.id, `Updated transaction status to: ${transaction.status}`);
      } else {
        db.addLog('update', 'transaction', transaction.id, `Updated transaction details`);
      }
    }
  },

  getLogs: (): AuditLog[] => {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  },

  addLog: (action: LogAction, entityType: LogEntityType, entityId: string, details: string) => {
    const logs = db.getLogs();
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      action,
      entityType,
      entityId,
      details
    };
    logs.push(newLog);
    // Keep only last 500 logs to prevent localStorage bloat
    if (logs.length > 500) logs.shift();
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  },

  getConfig: (): BusinessConfig => {
    const data = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return data ? JSON.parse(data) : { type: 'custom', name: '', initialized: false };
  },

  saveConfig: (config: BusinessConfig) => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  },
  
  getCustomers: (): Customer[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return data ? JSON.parse(data) : [];
  },

  saveCustomers: (customers: Customer[]) => {
    const oldCustomers = db.getCustomers();
    
    // Check for new customers
    customers.forEach(c => {
      const exists = oldCustomers.find(oc => oc.id === c.id);
      if (!exists) {
        db.addLog('create', 'customer', c.id, `Created customer: ${c.name}`);
      } else if (JSON.stringify(exists) !== JSON.stringify(c)) {
        db.addLog('update', 'customer', c.id, `Updated customer: ${c.name}`);
      }
    });

    // Check for deleted customers
    oldCustomers.forEach(oc => {
      const stillExists = customers.find(c => c.id === oc.id);
      if (!stillExists) {
        db.addLog('delete', 'customer', oc.id, `Deleted customer: ${oc.name}`);
      }
    });

    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  },
};
