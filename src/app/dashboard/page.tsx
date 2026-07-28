'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { blogsAPI, servicesAPI, aboutusAPI, contactsAPI, faqsAPI, heroesAPI, whyusAPI, reportsAPI } from '@/lib/api';
import { FileText, Briefcase, Info, Mail, HelpCircle, Image, Star, TrendingUp, Package, ShoppingCart, Users, BarChart3 } from 'lucide-react';

interface Stats {
  blogs: number;
  services: number;
  aboutus: number;
  contacts: number;
  faqs: number;
  heroes: number;
  whyus: number;
  totalProducts: number;
  lowStockProducts: number;
  totalCustomers: number;
  totalDebt: number;
  totalSales: number;
  totalPurchases: number;
  profit: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    blogs: 0,
    services: 0,
    aboutus: 0,
    contacts: 0,
    faqs: 0,
    heroes: 0,
    whyus: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    totalCustomers: 0,
    totalDebt: 0,
    totalSales: 0,
    totalPurchases: 0,
    profit: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [blogs, services, aboutus, contacts, faqs, heroes, whyus, dashboard] = await Promise.all([
        blogsAPI.getAll(),
        servicesAPI.getAll(),
        aboutusAPI.getAll(),
        contactsAPI.getAll(),
        faqsAPI.getAll(),
        heroesAPI.getAll(),
        whyusAPI.getAll(),
        reportsAPI.getDashboardStats(),
      ]);

      setStats({
        blogs: blogs.length,
        services: services.length,
        aboutus: aboutus.length,
        contacts: contacts.length,
        faqs: faqs.length,
        heroes: heroes.length,
        whyus: whyus.length,
        totalProducts: dashboard.totalProducts,
        lowStockProducts: dashboard.lowStockProducts,
        totalCustomers: dashboard.totalCustomers,
        totalDebt: dashboard.totalDebt,
        totalSales: dashboard.totalSales,
        totalPurchases: dashboard.totalPurchases,
        profit: dashboard.profit,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { name: 'Blogs', value: stats.blogs, icon: FileText, color: 'bg-blue-500', href: '/dashboard/blogs' },
    { name: 'Services', value: stats.services, icon: Briefcase, color: 'bg-green-500', href: '/dashboard/services' },
    { name: 'About Us', value: stats.aboutus, icon: Info, color: 'bg-purple-500', href: '/dashboard/aboutus' },
    { name: 'Contacts', value: stats.contacts, icon: Mail, color: 'bg-yellow-500', href: '/dashboard/contacts' },
    { name: 'FAQs', value: stats.faqs, icon: HelpCircle, color: 'bg-pink-500', href: '/dashboard/faqs' },
    { name: 'Heroes', value: stats.heroes, icon: Image, color: 'bg-indigo-500', href: '/dashboard/heroes' },
    { name: 'Why Us', value: stats.whyus, icon: Star, color: 'bg-orange-500', href: '/dashboard/whyus' },
    { name: 'Products', value: stats.totalProducts, icon: Package, color: 'bg-teal-500', href: '/dashboard/products' },
    { name: 'Customers', value: stats.totalCustomers, icon: Users, color: 'bg-cyan-500', href: '/dashboard/customers' },
    { name: 'Total Sales', value: stats.totalSales, icon: ShoppingCart, color: 'bg-emerald-500', href: '/dashboard/sales' },
    { name: 'Total Debt', value: stats.totalDebt, icon: BarChart3, color: 'bg-red-500', href: '/dashboard/reports' },
    { name: 'Profit', value: stats.profit, icon: TrendingUp, color: 'bg-lime-500', href: '/dashboard/reports' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <TrendingUp className="h-4 w-4" />
            Overview of your content
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(11)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat) => (
              <a
                key={stat.name}
                href={stat.href}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className={`h-12 w-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </a>
            ))}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/dashboard/blogs/new"
              className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
            >
              <FileText className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-600">Create Blog</span>
            </a>
            <a
              href="/dashboard/services/new"
              className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
            >
              <Briefcase className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-600">Create Service</span>
            </a>
            <a
              href="/dashboard/products/new"
              className="flex items-center gap-3 p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition"
            >
              <Package className="h-5 w-5 text-teal-600" />
              <span className="font-medium text-teal-600">Add Product</span>
            </a>
            <a
              href="/dashboard/sales/new"
              className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition"
            >
              <ShoppingCart className="h-5 w-5 text-emerald-600" />
              <span className="font-medium text-emerald-600">New Sale</span>
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
