'use client';

import { useToast } from '@/contexts/ToastContext';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useEffect } from 'react';

export default function Toast() {
  const { toasts, removeToast } = useToast();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg ${getBgColor(toast.type)} animate-in slide-in-from-right duration-300`}
        >
          {getIcon(toast.type)}
          <p className="text-sm font-medium text-gray-900">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-auto text-gray-400 hover:text-gray-600 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
