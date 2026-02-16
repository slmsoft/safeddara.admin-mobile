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

interface WebPurchaseHistoryPageProps {
  onBack?: () => void;
  orders?: Order[];
  onPayOrder?: (orderId: string) => void;
  onCancelOrder?: (orderId: string) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function WebPurchaseHistoryPage({ onBack, orders = [], onPayOrder, onCancelOrder, onRefresh, isLoading = false }: WebPurchaseHistoryPageProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('history');

  const activeOrders = orders.filter(order => order.status === 'pending');
  const historyOrders = orders.filter(order => order.status === 'paid' || order.status === 'cancelled');

  const displayedOrders = activeTab === 'active' ? activeOrders : historyOrders;

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-8 py-5">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => onBack?.()}
              className="relative z-10 flex items-center justify-center min-w-[44px] min-h-[44px] -m-2 transition-all active:scale-95 rounded-lg hover:bg-gray-100"
              type="button"
              aria-label="Назад"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" strokeWidth={2.5} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">История покупок</h1>
            {onRefresh && (
              <button
                onClick={() => onRefresh()}
                disabled={isLoading}
                className="ml-auto p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                type="button"
                aria-label="Обновить"
              >
                <RefreshCw className={`w-5 h-5 text-[#71bcf0] ${isLoading ? 'animate-spin' : ''}`} strokeWidth={2} />
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-4 max-w-md">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all text-base ${
                activeTab === 'active'
                  ? 'bg-gradient-to-r from-[#5b9fd4] to-[#3d7ba8] text-white shadow-md'
                  : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Активно
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all text-base ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-[#5b9fd4] to-[#3d7ba8] text-white shadow-md'
                  : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
              }`}
            >
              История
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {displayedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg text-center">
              {activeTab === 'active' 
                ? 'У вас пока нет активных покупок' 
                : 'У вас пока нет истории покупок'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-5">
            {displayedOrders.map((order, index) => (
              <div 
                key={order.id} 
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all"
                style={{
                  animation: `fadeInUp 0.3s ease-out ${index * 0.05}s backwards`
                }}
              >
                {/* Order Image (first item) */}
                <div className="relative w-full aspect-[4/3] bg-gray-100">
                  {order.items[0] && (
                    <img
                      src={order.items[0].image}
                      alt={order.items[0].name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    <div className={`px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[11px] font-bold ${getStatusColor(order.status)} shadow-md`}>
                      {getStatusText(order.status)}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 space-y-2">
                  {/* Order Info */}
                  <div className="pb-2 border-b border-gray-100">
                    <p className="text-[10px] text-gray-400 mb-0.5">№ {order.orderNumber}</p>
                    <h3 className="font-bold text-gray-900 text-xs mb-0.5 line-clamp-1">
                      {order.items.map(item => item.categoryName).join(', ')}
                    </h3>
                    <p className="text-[10px] text-gray-500">{order.createdAt}</p>
                  </div>

                  {/* Items Count */}
                  <div className="text-[11px] text-gray-600">
                    {order.items.length === 1 ? (
                      <div>
                        <p className="font-semibold text-gray-900 mb-0.5 line-clamp-1">{order.items[0].name}</p>
                        <p className="text-gray-500">{order.items[0].date}</p>
                      </div>
                    ) : (
                      <p>Товаров: <span className="font-semibold text-gray-900">{order.items.length} шт</span></p>
                    )}
                  </div>

                  {/* Total Price */}
                  <div className="pt-1.5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-gray-500">Итого:</span>
                      <span className="font-bold text-gray-900 text-base">
                        {order.total.toLocaleString()} смн
                      </span>
                    </div>

                    {/* Action Buttons — по Swagger: оплата только при создании заказа */}
                    {order.status === 'pending' ? (
                      <div className="space-y-1.5">
                        <span className="w-full block py-2 rounded-xl bg-amber-50 text-amber-800 text-center text-xs font-semibold">
                          Ожидание оплаты
                        </span>
                        <button
                          onClick={() => onCancelOrder?.(order.id)}
                          className="w-full border border-gray-200 text-gray-600 font-semibold py-2 rounded-xl hover:bg-gray-50 transition-colors text-xs"
                        >
                          Отменить
                        </button>
                      </div>
                    ) : (
                      <div className="h-[68px]" /> // Spacer to maintain consistent card height
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}