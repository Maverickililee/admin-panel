'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { blogsAPI, Blog } from '@/lib/api';
import { Plus, Pencil, Trash2, Search, Eye, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/contexts/ToastContext';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await blogsAPI.getAll();
      setBlogs(data);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    setDeleting(true);
    setDeleteId(id);
    try {
      await blogsAPI.delete(id);
      setBlogs(blogs.filter((blog) => blog.id !== id));
      showToast('success', 'Blog deleted successfully');
    } catch (error) {
      console.error('Failed to delete blog:', error);
      showToast('error', 'Failed to delete blog. Please try again.');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
          <Link
            href="/dashboard/blogs/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="h-5 w-5" />
            Add Blog
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading blogs...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="p-8 text-center">
              <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No blogs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBlogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={blog.image || '/placeholder.png'}
                          alt={blog.title}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {blog.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {blog.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/blogs/${blog.id}`}
                            className="p-2 text-gray-400 hover:text-indigo-600 transition"
                          >
                            <Eye className="h-5 w-5" />
                          </Link>
                          <Link
                            href={`/dashboard/blogs/${blog.id}/edit`}
                            className="p-2 text-gray-400 hover:text-green-600 transition"
                          >
                            <Pencil className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(blog.id)}
                            disabled={deleting && deleteId === blog.id}
                            className="p-2 text-gray-400 hover:text-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deleting && deleteId === blog.id ? (
                              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-red-600"></div>
                            ) : (
                              <Trash2 className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}