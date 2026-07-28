'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { purchasesAPI, productsAPI, suppliersAPI } from '@/lib/api';
import { Plus, Trash2 } from 'lucide-react';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('fa-IR') + ' ' + date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
}

interface PurchaseItem {
  id: string;
  productId: string;
  product?: { id: string; name: string; buyPrice: number };
  quantity: number;
  buyPrice: number;
}

interface Purchase {
  id: string;
  supplierId?: string;
  supplier?: { id: string; name: string };
  total: number;
  paid: number;
  debt: number;
  items: PurchaseItem[];
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  buyPrice: number;
  quantity: number;
}

interface Supplier {
  id: string;
  name: string;
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    supplierId: '',
    paid: '',
    items: [{ productId: '', quantity: '', buyPrice: '' }] as { productId: string; quantity: string; buyPrice: string }[],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [purchasesData, productsData, suppliersData] = await Promise.all([
        purchasesAPI.getAll(),
        productsAPI.getAll(),
        suppliersAPI.getAll(),
      ]);
      setPurchases(purchasesData);
      setProducts(productsData);
      setSuppliers(suppliersData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const purchaseItems = formData.items
        .filter((item) => item.productId && item.quantity && item.buyPrice)
        .map((item) => ({
          productId: item.productId,
          quantity: parseInt(item.quantity),
          buyPrice: parseFloat(item.buyPrice),
        }));

      await purchasesAPI.create({
        supplierId: formData.supplierId || undefined,
        paid: parseFloat(formData.paid) || 0,
        items: purchaseItems,
      });

      setShowForm(false);
      setFormData({
        supplierId: '',
        paid: '',
        items: [{ productId: '', quantity: '', buyPrice: '' }],
      });
      fetchData();
    } catch (error) {
      console.error('Failed to create purchase:', error);
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: '', buyPrice: '' }],
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
    if (confirm('Are you sure you want to delete this purchase?')) {
      try {
        await purchasesAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Failed to delete purchase:', error);
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
          <h1 className="text-2xl font-bold text-gray-900">Purchases</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
          >
            <Plus className="h-4 w-4" />
            New Purchase
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 my-8">
              <h2 className="text-lg font-semibold mb-4">Create New Purchase</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                  <select
                    value={formData.supplierId}
                    onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Select Supplier (Optional)</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="">Select Product</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Buy Price"
                          value={item.buyPrice}
                          onChange={(e) => handleItemChange(index, 'buyPrice', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
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
                    className="text-sm text-amber-600 hover:text-amber-700"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
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
                    className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                  >
                    Create Purchase
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Debt</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {purchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">#{purchase.id.substring(0, 8)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(purchase.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-gray-900">{purchase.supplier?.name || '-'}</td>
                  <td className="px-6 py-4 text-gray-900">{purchase.total.toLocaleString()} تومان</td>
                  <td className="px-6 py-4 text-green-600">{purchase.paid.toLocaleString()} تومان</td>
                  <td className="px-6 py-4">
                    {purchase.debt > 0 ? (
                      <span className="text-red-600 font-medium">{purchase.debt.toLocaleString()} تومان</span>
                    ) : (
                      <span className="text-gray-600">0</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDelete(purchase.id)}
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