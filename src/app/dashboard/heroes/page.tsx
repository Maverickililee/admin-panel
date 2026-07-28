'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { heroesAPI, Hero } from '@/lib/api';
import { Plus, Pencil, Trash2, Search, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function HeroesPage() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      const data = await heroesAPI.getAll();
      setHeroes(data);
    } catch (error) {
      console.error('Failed to fetch heroes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero?')) return;
    try {
      await heroesAPI.delete(id);
      setHeroes(heroes.filter((hero) => hero.id !== id));
    } catch (error) {
      console.error('Failed to delete hero:', error);
      alert('Failed to delete hero');
    }
  };

  const filteredHeroes = heroes.filter(
    (hero) =>
      hero.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hero.slogan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hero.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Heroes</h1>
          <Link
            href="/dashboard/heroes/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="h-5 w-5" />
            Add Hero
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search heroes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading heroes...</p>
            </div>
          ) : filteredHeroes.length === 0 ? (
            <div className="p-8 text-center">
              <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No heroes found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {filteredHeroes.map((hero) => (
                <div key={hero.id} className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
                  <p className="text-sm opacity-80 mb-1">{hero.slogan}</p>
                  <h3 className="text-xl font-bold mb-2">{hero.title}</h3>
                  <p className="text-sm opacity-90 line-clamp-2">{hero.description}</p>
                  <div className="flex items-center justify-end gap-2 mt-4">
                    <Link
                      href={`/dashboard/heroes/${hero.id}/edit`}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
                    >
                      <Pencil className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(hero.id)}
                      className="p-2 bg-white/20 rounded-lg hover:bg-red-500 transition"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
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
