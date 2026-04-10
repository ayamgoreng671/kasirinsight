export type BusinessType = 'coffee' | 'retail' | 'services' | 'custom';

export interface Product {
  id: string;
  name: string;
  sellingPrice: number;
  cogs: number;
  stock: number;
  category: string;
  lowStockThreshold: number;
  healthyStockThreshold: number;
  image?: string;
}

export type TransactionStatus = 'paid' | 'packed' | 'sent';

export interface TransactionItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  cogs: number;
}

export interface Transaction {
  id: string;
  timestamp: number;
  totalAmount: number;
  items: TransactionItem[];
  status: TransactionStatus;
  customerId?: string;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
  note: string;
}

export interface BusinessConfig {
  type: BusinessType;
  name: string;
  initialized: boolean;
}

export type LogAction = 'create' | 'update' | 'delete';
export type LogEntityType = 'product' | 'transaction' | 'customer';

export interface AuditLog {
  id: string;
  timestamp: number;
  action: LogAction;
  entityType: LogEntityType;
  entityId: string;
  details: string;
}
