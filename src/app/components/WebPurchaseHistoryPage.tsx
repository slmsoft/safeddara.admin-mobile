import { ChevronLeft, RefreshCw } from 'lucide-react';
import skiMountainIcon from '../../assets/ski-mountain-icon.png';
import { useState } from 'react';

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
  onRefresh?: () => void;
  isLoading?: boolean;
}

type HistoryFilter = 'all' | 'successful' | 'unsuccessful';

export function WebPurchaseHistoryPage({ onBack, orders = [], onPayOrder, onRefresh, isLoading = false }: WebPurchaseHistoryPageProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('history');
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('all');

  const activeOrders = orders.filter(order => order.status === 'pending');
  const historyOrders = orders.filter(order => order.status === 'paid' || order.status === 'cancelled');
  const successfulOrders = historyOrders.filter(o => o.status === 'paid');
  const unsuccessfulOrders = historyOrders.filter(o => o.status === 'cancelled');

  const displayedOrders = activeTab === 'active'
    ? activeOrders
    : historyFilter === 'successful'
      ? successfulOrders
      : historyFilter === 'unsuccessful'
        ? unsuccessfulOrders
        : historyOrders;

  const getTypeText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Ожидает оплаты';
      case 'paid':
        return 'Покупка';
      case 'cancelled':
        return 'Отменено';
      default:
        return 'Покупка';
    }
  };

  const getAmountColor = (status: Order['status']) => {
    switch (status) {
      case 'paid':
        return 'text-green-600';
      case 'pending':
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f7fc] to-white">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-100/80">
        <div className="max-w-[1400px] mx-auto px-8 py-5">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => onBack?.()}
              className="relative z-10 flex items-center justify-center min-w-[44px] min-h-[44px] -m-2 transition-all active:scale-95 rounded-xl hover:bg-[#e8f4fc]/50"
              type="button"
              aria-label="Назад"
            >
              <ChevronLeft className="w-6 h-6 text-[#5b9fd4]" strokeWidth={2.5} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">История покупок</h1>
            {onRefresh && (
              <button
                onClick={() => onRefresh()}
                disabled={isLoading}
                className="ml-auto p-2 rounded-xl hover:bg-[#e8f4fc]/50 transition-colors disabled:opacity-50"
                type="button"
                aria-label="Обновить"
              >
                <RefreshCw className={`w-5 h-5 text-[#5b9fd4] ${isLoading ? 'animate-spin' : ''}`} strokeWidth={2} />
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="space-y-4">
            <div className="flex gap-2 max-w-md bg-gray-100/60 p-1.5 rounded-2xl">
              <button
                onClick={() => setActiveTab('active')}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all text-base ${
                  activeTab === 'active'
                    ? 'bg-gradient-to-r from-[#5b9fd4] to-[#3d7ba8] text-white shadow-lg shadow-[#5b9fd4]/25'
                    : 'text-gray-500 bg-transparent hover:text-gray-700'
                }`}
              >
                Активно
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all text-base ${
                  activeTab === 'history'
                    ? 'bg-gradient-to-r from-[#5b9fd4] to-[#3d7ba8] text-white shadow-lg shadow-[#5b9fd4]/25'
                    : 'text-gray-500 bg-transparent hover:text-gray-700'
                }`}
              >
                История
              </button>
            </div>

            {/* Фильтр внутри «История» — успешные / неуспешные */}
            {activeTab === 'history' && (
              <div className="flex gap-2 max-w-lg bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                <button
                  onClick={() => setHistoryFilter('all')}
                  className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    historyFilter === 'all'
                      ? 'bg-white text-[#5b9fd4] shadow-sm border border-gray-100'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Все
                </button>
                <button
                  onClick={() => setHistoryFilter('successful')}
                  className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                    historyFilter === 'successful'
                      ? 'bg-white text-green-600 shadow-sm border border-green-100'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Успешные
                </button>
                <button
                  onClick={() => setHistoryFilter('unsuccessful')}
                  className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                    historyFilter === 'unsuccessful'
                      ? 'bg-white text-red-500 shadow-sm border border-red-100'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Неуспешные
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content — горнолыжный курорт */}
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {displayedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#e8f4fc] to-[#d4ebf7] flex items-center justify-center mb-6 shadow-inner p-5">
              <img src={skiMountainIcon} alt="" className="w-full h-full object-contain" />
            </div>
            <p className="text-gray-500 text-lg text-center max-w-[280px]">
              {activeTab === 'active' 
                ? 'У вас пока нет активных покупок' 
                : historyFilter === 'successful'
                  ? 'Нет успешных транзакций'
                  : historyFilter === 'unsuccessful'
                    ? 'Нет неуспешных транзакций'
                    : 'У вас пока нет истории покупок'}
            </p>
          </div>
        ) : (
          <div className="max-w-2xl space-y-4">
            {displayedOrders.map((order) => (
              <div 
                key={order.id} 
                className="flex items-center gap-5 px-6 py-5 bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100/50 hover:shadow-md hover:border-[#e8f4fc] transition-all"
              >
                {/* Icon — горнолыжная тематика */}
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#e8f4fc] to-[#d4ebf7] flex items-center justify-center p-2">
                  {order.items[0]?.image ? (
                    <img
                      src={order.items[0].image}
                      alt=""
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <img src={skiMountainIcon} alt="" className="w-full h-full object-contain" />
                  )}
                </div>

                {/* Описание */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-base">
                    {order.items.map(item => item.categoryName).join(', ')}
                  </p>
                  <p className={`text-sm ${order.status === 'pending' ? 'text-amber-500' : order.status === 'cancelled' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {getTypeText(order.status)}
                  </p>
                  {order.createdAt && (
                    <p className="text-xs text-gray-400 mt-1">{order.createdAt}</p>
                  )}
                </div>

                {/* Сумма — успешные: -X зелёный, невыполненные/отмена: красный */}
                <div className="flex-shrink-0">
                  <p className={`font-semibold text-base ${getAmountColor(order.status)}`}>
                    {order.status === 'paid' ? `-${order.total.toLocaleString()}` : order.total.toLocaleString()} смн
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}