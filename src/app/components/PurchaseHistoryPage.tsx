import { ChevronLeft, RefreshCw } from 'lucide-react';
import skiMountainIcon from '../../assets/ski-mountain-icon.png';
import { useState, useRef } from 'react';

const PULL_THRESHOLD = 70;
const MAX_PULL = 100;

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
  onRefresh?: () => void;
  isLoading?: boolean;
}

type HistoryFilter = 'all' | 'successful' | 'unsuccessful';

export function PurchaseHistoryPage({ onBack, orders = [], onPayOrder, onRefresh, isLoading = false }: PurchaseHistoryPageProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('history');
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('all');
  const [pullOffset, setPullOffset] = useState(0);
  const touchStartY = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!onRefresh || isLoading) return;
    const scrollTop = scrollRef.current?.scrollTop ?? 0;
    if (scrollTop > 0) return;
    const deltaY = e.touches[0].clientY - touchStartY.current;
    if (deltaY > 0) {
      const offset = Math.min(deltaY * 0.5, MAX_PULL);
      setPullOffset(offset);
    }
  };

  const handleTouchEnd = () => {
    if (pullOffset >= PULL_THRESHOLD && onRefresh) {
      onRefresh();
    }
    setPullOffset(0);
  };

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
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100/80">
        <div className="px-5 py-4">
          <div className="flex items-center gap-4 relative">
            <button
              onClick={() => onBack?.()}
              className="relative z-10 flex items-center justify-center min-w-[44px] min-h-[44px] -m-2 transition-all active:scale-95 rounded-full hover:bg-[#e8f4fc]/50"
              type="button"
              aria-label="Назад"
            >
              <ChevronLeft className="w-6 h-6 text-[#5b9fd4]" strokeWidth={2.5} />
            </button>
            <h1 className="flex-1 text-center text-base font-semibold text-gray-900 -ml-9 pointer-events-none">История покупок</h1>
            <div className="w-10 flex-shrink-0" />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-5 pb-4 space-y-3">
          <div className="flex gap-2 bg-gray-100/60 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all text-sm ${
                activeTab === 'active'
                  ? 'bg-gradient-to-r from-[#5b9fd4] to-[#3d7ba8] text-white shadow-lg shadow-[#5b9fd4]/25'
                  : 'text-gray-500 bg-transparent hover:text-gray-700'
              }`}
            >
              Активно
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all text-sm ${
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
            <div className="flex gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-100">
              <button
                onClick={() => setHistoryFilter('all')}
                className={`flex-1 py-2 rounded-lg font-medium text-xs transition-all ${
                  historyFilter === 'all'
                    ? 'bg-white text-[#5b9fd4] shadow-sm border border-gray-100'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Все
              </button>
              <button
                onClick={() => setHistoryFilter('successful')}
                className={`flex-1 py-2 rounded-lg font-medium text-xs transition-all flex items-center justify-center gap-1 ${
                  historyFilter === 'successful'
                    ? 'bg-white text-green-600 shadow-sm border border-green-100'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Успешные
              </button>
              <button
                onClick={() => setHistoryFilter('unsuccessful')}
                className={`flex-1 py-2 rounded-lg font-medium text-xs transition-all flex items-center justify-center gap-1 ${
                  historyFilter === 'unsuccessful'
                    ? 'bg-white text-red-500 shadow-sm border border-red-100'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Неуспешные
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content — pull-to-refresh */}
      <div
        ref={scrollRef}
        className="overflow-y-auto overscroll-contain"
        style={{ height: activeTab === 'history' ? 'calc(100vh - 195px)' : 'calc(100vh - 140px)', touchAction: 'pan-y' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Pull indicator / Refreshing — только во вкладке «Активно» (в «История» уже есть результат) */}
        {activeTab === 'active' && (
          <div
            className="flex flex-col items-center justify-center overflow-hidden transition-all duration-200"
            style={{
              height: isLoading ? 56 : pullOffset,
              opacity: pullOffset > 0 || isLoading ? 1 : 0,
            }}
          >
            <div className="flex flex-col items-center gap-1 py-2">
              <RefreshCw
                className={`w-6 h-6 text-[#5b9fd4] transition-transform ${pullOffset >= PULL_THRESHOLD && !isLoading ? 'rotate-180' : ''} ${isLoading ? 'animate-spin' : ''}`}
                strokeWidth={2}
              />
              <span className="text-xs text-gray-500">
                {isLoading ? 'Обновление...' : pullOffset >= PULL_THRESHOLD ? 'Отпустите для обновления' : 'Потяните для обновления'}
              </span>
            </div>
          </div>
        )}

        <div className="px-5 py-5">
        {displayedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#e8f4fc] to-[#d4ebf7] flex items-center justify-center mb-5 shadow-inner p-4">
              <img src={skiMountainIcon} alt="" className="w-full h-full object-contain" />
            </div>
            <p className="text-gray-500 text-sm text-center max-w-[200px]">
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
          <div className="space-y-3">
            {displayedOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100/50 hover:shadow-md hover:border-[#e8f4fc] transition-all"
                >
                    {/* Icon — горнолыжная тематика */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-[#e8f4fc] to-[#d4ebf7] flex items-center justify-center p-1.5">
                      {order.items[0]?.image ? (
                        <img src={order.items[0].image} alt="" className="w-full h-full rounded-xl object-cover" />
                      ) : (
                        <img src={skiMountainIcon} alt="" className="w-full h-full object-contain" />
                      )}
                    </div>

                    {/* Описание */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-[15px] truncate">
                        {order.items.map(item => item.categoryName).join(', ')}
                      </p>
                      <p className={`text-[13px] ${order.status === 'pending' ? 'text-amber-500' : order.status === 'cancelled' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {getTypeText(order.status)}
                      </p>
                      {order.createdAt && (
                        <p className="text-[11px] text-gray-400 mt-0.5">{order.createdAt}</p>
                      )}
                    </div>

                    {/* Сумма — успешные: -X зелёный, невыполненные/отмена: красный */}
                    <div className="flex-shrink-0">
                      <p className={`font-semibold text-[15px] ${getAmountColor(order.status)}`}>
                        {order.status === 'paid' ? `-${order.total.toLocaleString()}` : order.total.toLocaleString()} смн
                      </p>
                    </div>
                </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}