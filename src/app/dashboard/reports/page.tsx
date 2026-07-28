'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { reportsAPI, productsAPI } from '@/lib/api';
import { BarChart3, AlertCircle, CreditCard } from 'lucide-react';

interface LowStockProduct {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  minStock: number;
  unit: string;
}

interface DebtCustomer {
  id: string;
  name: string;
  phone?: string;
  debt: number;
}

interface ProfitProduct {
  name: string;
  totalProfit: number;
}

interface ProfitReport {
  totalProfit: number;
  profitByProduct: ProfitProduct[];
}

export default function ReportsPage() {
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [debtReport, setDebtReport] = useState<DebtCustomer[]>([]);
  const [profitReport, setProfitReport] = useState<ProfitReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [lowStock, debts, profit] = await Promise.all([
        productsAPI.getLowStock(),
        reportsAPI.getDebtReport(),
        reportsAPI.getProfitReport(),
      ]);
      setLowStockProducts(lowStock);
      setDebtReport(debts);
      setProfitReport(profit);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
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
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Low Stock Products
            </h2>
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-500">No low stock products</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                    <th className="pb-2">Product</th>
                    <th className="pb-2">Stock</th>
                    <th className="pb-2">Min Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map((p) => (
                    <tr key={p.id} className="border-t border-gray-100">
                      <td className="py-2">
                        <div className="font-medium text-gray-900">{p.name}</div>
                        <div className="text-sm text-gray-500">SKU: {p.sku}</div>
                      </td>
                      <td className="py-2 text-red-600 font-medium">{p.quantity} {p.unit}</td>
                      <td className="py-2 text-gray-600">{p.minStock} {p.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-red-500" />
              Customer Debts
            </h2>
            {debtReport.length === 0 ? (
              <p className="text-gray-500">No customer debts</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Phone</th>
                    <th className="pb-2">Debt</th>
                  </tr>
                </thead>
                <tbody>
                  {debtReport.map((c) => (
                    <tr key={c.id} className="border-t border-gray-100">
                      <td className="py-2 font-medium text-gray-900">{c.name}</td>
                      <td className="py-2 text-gray-600">{c.phone || '-'}</td>
                      <td className="py-2 text-red-600 font-medium">{c.debt.toLocaleString()} تومان</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-lime-500" />
            Profit Report
          </h2>
          <div className="mb-4">
            <p className="text-3xl font-bold text-lime-600">
              {profitReport?.totalProfit?.toLocaleString() || 0} تومان
            </p>
            <p className="text-sm text-gray-500">Total Profit</p>
          </div>
          {profitReport?.profitByProduct && profitReport.profitByProduct.length > 0 && (
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                  <th className="pb-2">Product</th>
                  <th className="pb-2">Profit</th>
                </tr>
              </thead>
              <tbody>
                {profitReport.profitByProduct.map((p, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="py-2 font-medium text-gray-900">{p.name}</td>
                    <td className="py-2 text-lime-600 font-medium">{p.totalProfit.toLocaleString()} تومان</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}