import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { ModernHeader } from './ModernHeader';
import { TicketWithBarcode } from './TicketWithBarcode';

interface Order {
  id: string;
  orderNumber: string;
  items: Array<{
    id: string;
    name: string;
    categoryName: string;
    price: number;
    quantity: number;
    date: string;
    image: string;
    description: string;
  }>;
  total: number;
  status: 'paid' | 'pending' | 'cancelled';
  createdAt: string;
}

interface MyTicketsPageProps {
  orders: Order[];
  onBack: () => void;
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
}

export function MyTicketsPage({ orders, onBack, onWeatherClick, onLiveClick }: MyTicketsPageProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Фильтруем только оплаченные заказы
  const paidOrders = orders.filter(order => order.status === 'paid');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <ModernHeader onWeatherClick={onWeatherClick} onLiveClick={onLiveClick} />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="pt-4 pb-3 lg:pt-8 lg:pb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onBack && onBack()}
              className="transition-all active:scale-95"
              type="button"
            >
              <ChevronLeft className="w-5 h-5 text-[#71bcf0]" />
            </button>
            
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
              Мои билеты <span className="text-gray-400 text-base">({paidOrders.length})</span>
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="pb-24 lg:pb-8">
          {paidOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Нет билетов</h3>
              <p className="text-sm text-gray-500">
                После оплаты услуг билеты появятся здесь
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {paidOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-all active:scale-[0.98] border border-gray-100"
                >
                  {/* Header with gradient */}
                  <div 
                    className="px-5 py-3 flex items-center justify-between"
                    style={{
                      background: 'linear-gradient(90deg, #8EA3FE 29.81%, #71BCF0 70.19%)'
                    }}
                  >
                    <div>
                      <p className="text-white/80 text-xs font-medium">№ {order.orderNumber}</p>
                      <p className="text-white text-sm font-bold mt-0.5">{order.createdAt}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-xl font-bold">{order.total} смн</p>
                      <p className="text-white/80 text-xs">{order.items.length} услуг</p>
                    </div>
                  </div>

                  {/* Services List */}
                  <div className="px-5 py-4 min-h-[80px]">
                    {/* Показываем максимум 1 услугу */}
                    <div className="space-y-2">
                      {order.items.slice(0, 1).map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">• {item.name}</span>
                          <span className="text-gray-500 font-medium">×{item.quantity}</span>
                        </div>
                      ))}
                      {/* Если услуг больше 1, показываем многоточие */}
                      {order.items.length > 1 && (
                        <div className="text-sm text-gray-500 italic">
                          ... и еще {order.items.length - 1} услуг
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                    <p className="text-xs font-semibold text-blue-600 text-center">
                      Нажмите для просмотра билета
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ticket Modal */}
      {selectedOrder && (
        <TicketWithBarcode
          orderId={selectedOrder.id}
          orderNumber={selectedOrder.orderNumber}
          items={selectedOrder.items}
          total={selectedOrder.total}
          createdAt={selectedOrder.createdAt}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}