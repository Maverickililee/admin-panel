'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { salesAPI, productsAPI, customersAPI } from '@/lib/api';
import { Plus, Trash2 } from 'lucide-react';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('fa-IR') + ' ' + date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
}

interface SaleItem {
  id: string;
  productId: string;
  product?: { id: string; name: string; sellPrice: number };
  quantity: number;
  price: number;
}

interface Sale {
  id: string;
  customerId?: string;
  customer?: { id: string; name: string };
  total: number;
  paid: number;
  debt: number;
  items: SaleItem[];
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  sellPrice: number;
  quantity: number;
}

interface Customer {
  id: string;
  name: string;
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    paid: '',
    items: [{ productId: '', quantity: '', price: '' }] as { productId: string; quantity: string; price: string }[],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [salesData, productsData, customersData] = await Promise.all([
        salesAPI.getAll(),
        productsAPI.getAll(),
        customersAPI.getAll(),
      ]);
      setSales(salesData);
      setProducts(productsData);
      setCustomers(customersData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const saleItems = formData.items
        .filter((item) => item.productId && item.quantity && item.price)
        .map((item) => ({
          productId: item.productId,
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price),
        }));

      await salesAPI.create({
        customerId: formData.customerId || undefined,
        paid: parseFloat(formData.paid) || 0,
        items: saleItems,
      });

      setShowForm(false);
      setFormData({
        customerId: '',
        paid: '',
        items: [{ productId: '', quantity: '', price: '' }],
      });
      fetchData();
    } catch (error) {
      console.error('Failed to create sale:', error);
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: '', price: '' }],
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this sale?')) {
      try {
        await salesAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Failed to delete sale:', error);
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            <Plus className="h-4 w-4" />
            New Sale
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 my-8">
              <h2 className="text-lg font-semibold mb-4">Create New Sale</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <select
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select Customer (Optional)</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Items</label>
                  {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-5">
                        <select
                          value={item.productId}
                          onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="">Select Product</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Price"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          disabled={formData.items.length === 1}
                          className="w-full px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    + Add Item
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.paid}
                    onChange={(e) => setFormData({ ...formData, paid: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    Create Sale
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Debt</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">#{sale.id.substring(0, 8)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(sale.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-gray-900">{sale.customer?.name || '-'}</td>
                  <td className="px-6 py-4 text-gray-900">{sale.total.toLocaleString()} تومان</td>
                  <td className="px-6 py-4 text-green-600">{sale.paid.toLocaleString()} تومان</td>
                  <td className="px-6 py-4">
                    {sale.debt > 0 ? (
                      <span className="text-red-600 font-medium">{sale.debt.toLocaleString()} تومان</span>
                    ) : (
                      <span className="text-gray-600">0</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDelete(sale.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}