import { ChevronLeft, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export interface Order {
  id: string;
  orderNumber: string;
  items: {
    id: string;
    name: string;
    categoryName: string;
    price: number;
    quantity: number;
    date: string;
    image: string;
    description: string;
  }[];
  total: number;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
}

interface PurchaseHistoryPageProps {
  onBack?: () => void;
  orders?: Order[];
  onPayOrder?: (orderId: string) => void;
  onCancelOrder?: (orderId: string) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function PurchaseHistoryPage({ onBack, orders = [], onPayOrder, onCancelOrder, onRefresh, isLoading = false }: PurchaseHistoryPageProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('history');

  const activeOrders = orders.filter(order => order.status === 'pending');
  const historyOrders = orders.filter(order => order.status === 'paid' || order.status === 'cancelled');

  const displayedOrders = activeTab === 'active' ? activeOrders : historyOrders;

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Ожидает оплаты';
      case 'paid':
        return 'Оплачено';
      case 'cancelled':
        return 'Отменено';
      default:
        return '';
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'text-amber-500';
      case 'paid':
        return 'text-green-500';
      case 'cancelled':
        return 'text-gray-400';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="px-5 py-4">
          <div className="flex items-center gap-4 relative">
            <button
              onClick={() => onBack?.()}
              className="relative z-10 flex items-center justify-center min-w-[44px] min-h-[44px] -m-2 transition-all active:scale-95"
              type="button"
              aria-label="Назад"
            >
              <ChevronLeft className="w-6 h-6 text-[#71bcf0]" strokeWidth={2.5} />
            </button>
            <h1 className="flex-1 text-center text-base font-semibold text-gray-900 -ml-9 pointer-events-none">История покупок</h1>
            {onRefresh ? (
              <button
                onClick={() => onRefresh()}
                disabled={isLoading}
                className="flex-shrink-0 p-2 -m-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                type="button"
                aria-label="Обновить"
              >
                <RefreshCw className={`w-5 h-5 text-[#71bcf0] ${isLoading ? 'animate-spin' : ''}`} strokeWidth={2} />
              </button>
            ) : (
              <div className="w-6 flex-shrink-0" />
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-5 pb-4">
          <div className="flex gap-2 bg-gray-100/50 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-2.5 rounded-xl font-medium transition-all text-sm ${
                activeTab === 'active'
                  ? 'bg-gradient-to-r from-[#5b9fd4] to-[#3d7ba8] text-white shadow-md'
                  : 'text-gray-500 bg-transparent'
              }`}
            >
              Активно
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2.5 rounded-xl font-medium transition-all text-sm ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-[#5b9fd4] to-[#3d7ba8] text-white shadow-md'
                  : 'text-gray-500 bg-transparent'
              }`}
            >
              История
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6 space-y-4">
        {displayedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm text-center">
              {activeTab === 'active' 
                ? 'У вас пока нет активных покупок' 
                : 'У вас пока нет истории покупок'}
            </p>
          </div>
        ) : (
          displayedOrders.map((order) => (
            <div key={order.id} className="space-y-3">
              {/* Date */}
              <p className="text-xs text-gray-400">{order.createdAt}</p>

              {/* Order Card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
                {/* Order Header */}
                <div className="flex items-start justify-between pb-3 border-b border-gray-50">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">№ {order.orderNumber}</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {order.items.map(item => item.categoryName).join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-medium mb-1 ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </p>
                    <p className="font-bold text-gray-900">
                      {order.total.toLocaleString()} смн
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-20 h-20 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{item.price.toLocaleString()} смн</p>
                        <p className="text-xs text-gray-400">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons — по Swagger: оплата только при создании заказа */}
                {order.status === 'pending' && (
                  <div className="flex gap-2 pt-2">
                    <span className="flex-1 py-3 rounded-xl bg-amber-50 text-amber-800 text-center text-sm font-medium">
                      Ожидание оплаты
                    </span>
                    <button
                      onClick={() => onCancelOrder?.(order.id)}
                      className="flex-1 border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                    >
                      Отменить
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}