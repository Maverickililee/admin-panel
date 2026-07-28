'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { faqsAPI, Faq } from '@/lib/api';
import { Plus, Pencil, Trash2, Search, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const data = await faqsAPI.getAll();
      setFaqs(data);
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await faqsAPI.delete(id);
      setFaqs(faqs.filter((faq) => faq.id !== id));
    } catch (error) {
      console.error('Failed to delete FAQ:', error);
      alert('Failed to delete FAQ');
    }
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
          <Link
            href="/dashboard/faqs/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="h-5 w-5" />
            Add FAQ
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading FAQs...</p>
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="p-8 text-center">
              <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No FAQs found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Link
                        href={`/dashboard/faqs/${faq.id}/edit`}
                        className="p-2 text-gray-400 hover:text-green-600 transition"
                      >
                        <Pencil className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(faq.id)}
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
