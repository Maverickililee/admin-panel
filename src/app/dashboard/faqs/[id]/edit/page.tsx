'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { faqsAPI, Faq } from '@/lib/api';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function EditFaqPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ question: '', answer: '' });

  useEffect(() => { fetchFaq(); }, [id]);

  const fetchFaq = async () => {
    try {
      const data = await faqsAPI.getById(id);
      setFormData({ question: data.question, answer: data.answer });
    } catch (error) {
      console.error('Failed to fetch FAQ:', error);
      router.push('/dashboard/faqs');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await faqsAPI.update(id, formData);
      router.push('/dashboard/faqs');
    } catch (error) {
      console.error('Failed to update FAQ:', error);
      alert('Failed to update FAQ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/faqs" className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit FAQ</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
                <input type="text" name="question" value={formData.question} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Answer *</label>
                <textarea name="answer" value={formData.answer} onChange={handleChange} required rows={5} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Link href="/dashboard/faqs" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">Cancel</Link>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">
              {saving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <><Save className="h-5 w-5" /> Update FAQ</>}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}