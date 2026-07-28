'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { whyusAPI, Whyus } from '@/lib/api';
import { Plus, Pencil, Trash2, Search, Star, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function WhyusPage() {
  const [whyus, setWhyus] = useState<Whyus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWhyus();
  }, []);

  const fetchWhyus = async () => {
    try {
      const data = await whyusAPI.getAll();
      setWhyus(data);
    } catch (error) {
      console.error('Failed to fetch why us:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await whyusAPI.delete(id);
      setWhyus(whyus.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete');
    }
  };

  const filteredItems = whyus.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Why Us</h1>
          <Link
            href="/dashboard/whyus/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="h-5 w-5" />
            Add Item
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center">
              <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No items found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg overflow-hidden">
                  <img
                    src={item.image || '/placeholder.png'}
                    alt={item.title}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-end gap-2 mt-4">
                      <Link
                        href={`/dashboard/whyus/${item.id}/edit`}
                        className="p-2 text-gray-400 hover:text-green-600 transition"
                      >
                        <Pencil className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}