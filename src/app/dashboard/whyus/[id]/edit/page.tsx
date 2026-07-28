'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { whyusAPI, Whyus } from '@/lib/api';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import Link from 'next/link';

export default function EditWhyusPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => { fetchItem(); }, [id]);

  const fetchItem = async () => {
    try {
      const data = await whyusAPI.getById(id);
      setFormData({ title: data.title, description: data.description });
      setPreviewImage(data.image);
    } catch (error) {
      console.error('Failed to fetch:', error);
      router.push('/dashboard/whyus');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      if (imageFile) data.append('image', imageFile);
      await whyusAPI.update(id, data);
      router.push('/dashboard/whyus');
    } catch (error) {
      console.error('Failed to update:', error);
      alert('Failed to update');
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
          <Link href="/dashboard/whyus" className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Why Us Item</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} required rows={5} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition">
                  {previewImage ? (
                    <div className="relative">
                      <img src={previewImage} alt="Preview" className="mx-auto h-48 w-full object-cover rounded-lg" />
                      <button type="button" onClick={() => { setPreviewImage(null); setImageFile(null); }} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600">×</button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">Click to upload image</p>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Link href="/dashboard/whyus" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">Cancel</Link>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">
              {saving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <><Save className="h-5 w-5" /> Update</>}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}