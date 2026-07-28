import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  id: string;
  title: string;
  description: string;
  image: string;
  category?: string;
  time?: string;
  content?: string;
  link?: string;
  keywords?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface Aboutus {
  id: string;
  title: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export interface Hero {
  id: string;
  slogan: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Whyus {
  id: string;
  title: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  unit: string;
  minStock: number;
  categoryId?: string;
  category?: Category;
  supplierId?: string;
  supplier?: Supplier;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  debt?: number;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  debt: number;
}

export interface SaleItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface Sale {
  id: string;
  customerId?: string;
  customer?: Customer;
  total: number;
  paid: number;
  debt: number;
  items: SaleItem[];
  createdAt: string;
}

export interface PurchaseItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  buyPrice: number;
}

export interface Purchase {
  id: string;
  supplierId?: string;
  supplier?: Supplier;
  total: number;
  paid: number;
  debt: number;
  items: PurchaseItem[];
  createdAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  totalCustomers: number;
  totalDebt: number;
  totalSales: number;
  totalPurchases: number;
  profit: number;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },
  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/users/register', { username, email, password });
    return response.data;
  },
  currentUser: async () => {
    const response = await api.get('/users/current');
    return response.data;
  },
};

// Blogs API
export const blogsAPI = {
  getAll: async () => {
    const response = await api.get<Blog[]>('/blogs');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Blog>(`/blogs/${id}`);
    return response.data;
  },
  create: async (data: FormData) => {
    const response = await api.post<Blog>('/blogs', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  update: async (id: string, data: FormData) => {
    const response = await api.put<Blog>(`/blogs/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  },
};

// Services API
export const servicesAPI = {
  getAll: async () => {
    const response = await api.get<Service[]>('/services');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Service>(`/services/${id}`);
    return response.data;
  },
  create: async (data: FormData) => {
    const response = await api.post<Service>('/services', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  update: async (id: string, data: FormData) => {
    const response = await api.put<Service>(`/services/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },
};

// About Us API
export const aboutusAPI = {
  getAll: async () => {
    const response = await api.get<Aboutus[]>('/aboutus');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Aboutus>(`/aboutus/${id}`);
    return response.data;
  },
  create: async (data: FormData) => {
    const response = await api.post<Aboutus>('/aboutus', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  update: async (id: string, data: FormData) => {
    const response = await api.put<Aboutus>(`/aboutus/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/aboutus/${id}`);
    return response.data;
  },
};

// Contacts API
export const contactsAPI = {
  getAll: async () => {
    const response = await api.get<Contact[]>('/contacts');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Contact>(`/contacts/${id}`);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/contacts/${id}`);
    return response.data;
  },
};

// FAQs API
export const faqsAPI = {
  getAll: async () => {
    const response = await api.get<Faq[]>('/faq');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Faq>(`/faq/${id}`);
    return response.data;
  },
  create: async (data: Omit<Faq, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<Faq>('/faq', data);
    return response.data;
  },
  update: async (id: string, data: Omit<Faq, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.put<Faq>(`/faq/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/faq/${id}`);
    return response.data;
  },
};

// Heroes API
export const heroesAPI = {
  getAll: async () => {
    const response = await api.get<Hero[]>('/heros');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Hero>(`/heros/${id}`);
    return response.data;
  },
  create: async (data: Omit<Hero, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<Hero>('/heros', data);
    return response.data;
  },
  update: async (id: string, data: Omit<Hero, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.put<Hero>(`/heros/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/heros/${id}`);
    return response.data;
  },
};

// Why Us API
export const whyusAPI = {
  getAll: async () => {
    const response = await api.get<Whyus[]>('/whyus');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Whyus>(`/whyus/${id}`);
    return response.data;
  },
  create: async (data: FormData) => {
    const response = await api.post<Whyus>('/whyus', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  update: async (id: string, data: FormData) => {
    const response = await api.put<Whyus>(`/whyus/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/whyus/${id}`);
    return response.data;
  },
};

// Products API
export const productsAPI = {
  getAll: async () => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },
  getLowStock: async () => {
    const response = await api.get<Product[]>('/products/low-stock');
    return response.data;
  },
  create: async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'category' | 'supplier'>) => {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },
  update: async (id: string, data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'category' | 'supplier'>>) => {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },
  create: async (data: Omit<Category, 'id'>) => {
    const response = await api.post<Category>('/categories', data);
    return response.data;
  },
  update: async (id: string, data: Partial<Omit<Category, 'id'>>) => {
    const response = await api.put<Category>(`/categories/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

// Suppliers API
export const suppliersAPI = {
  getAll: async () => {
    const response = await api.get<Supplier[]>('/suppliers');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Supplier>(`/suppliers/${id}`);
    return response.data;
  },
  create: async (data: Omit<Supplier, 'id' | 'debt'>) => {
    const response = await api.post<Supplier>('/suppliers', data);
    return response.data;
  },
  update: async (id: string, data: Partial<Omit<Supplier, 'id' | 'debt'>>) => {
    const response = await api.put<Supplier>(`/suppliers/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/suppliers/${id}`);
    return response.data;
  },
};

// Customers API
export const customersAPI = {
  getAll: async () => {
    const response = await api.get<Customer[]>('/customers');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
  },
  create: async (data: Omit<Customer, 'id' | 'debt'>) => {
    const response = await api.post<Customer>('/customers', data);
    return response.data;
  },
  update: async (id: string, data: Partial<Omit<Customer, 'id' | 'debt'>>) => {
    const response = await api.put<Customer>(`/customers/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },
};

// Sales API
export const salesAPI = {
  getAll: async () => {
    const response = await api.get<Sale[]>('/sales');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Sale>(`/sales/${id}`);
    return response.data;
  },
  create: async (data: { customerId?: string; items: { productId: string; quantity: number; price: number }[]; paid: number }) => {
    const response = await api.post<Sale>('/sales', data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/sales/${id}`);
    return response.data;
  },
};

// Purchases API
export const purchasesAPI = {
  getAll: async () => {
    const response = await api.get<Purchase[]>('/purchases');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Purchase>(`/purchases/${id}`);
    return response.data;
  },
  create: async (data: { supplierId?: string; items: { productId: string; quantity: number; buyPrice: number }[]; paid: number }) => {
    const response = await api.post<Purchase>('/purchases', data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/purchases/${id}`);
    return response.data;
  },
};

// Reports API
export const reportsAPI = {
  getDashboardStats: async () => {
    const response = await api.get<DashboardStats>('/reports/dashboard');
    return response.data;
  },
  getInventoryReport: async () => {
    const response = await api.get<[]>('/reports/inventory');
    return response.data;
  },
  getDebtReport: async () => {
    const response = await api.get<[]>('/reports/debts');
    return response.data;
  },
  getProfitReport: async () => {
    const response = await api.get<{ totalProfit: number; profitByProduct: { name: string; totalProfit: number }[] }>('/reports/profit');
    return response.data;
  },
};
