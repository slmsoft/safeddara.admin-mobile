import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { ModernHeader } from './ModernHeader';
import { TicketWithBarcode } from './TicketWithBarcode';
import ticketSkiIcon from '../../assets/ticket-ski-icon.png';

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
              <div className="w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <img src="/icons/ticket.png" alt="" className="w-full h-full object-contain opacity-80" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Нет билетов</h3>
              <p className="text-sm text-gray-500">
                После оплаты услуг билеты появятся здесь
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {paidOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="group bg-white rounded-2xl overflow-hidden cursor-pointer transition-all active:scale-[0.98] shadow-sm hover:shadow-xl border border-gray-100/80"
                >
                  {/* Card — билетный стиль */}
                  <div className="relative">
                    <div 
                      className="px-5 py-4 flex items-center justify-between"
                      style={{
                        background: 'linear-gradient(135deg, #8EA3FE 0%, #71BCF0 50%, #5aa8e0 100%)'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
                          <img src={ticketSkiIcon} alt="" className="w-full h-full object-contain mix-blend-screen" />
                        </div>
                        <div>
                          <p className="text-white/90 text-xs font-medium">Билет №{order.orderNumber}</p>
                          <p className="text-white text-sm font-bold mt-0.5">{order.createdAt}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-xl font-bold">{order.total} смн</p>
                        <p className="text-white/80 text-xs mt-0.5">{order.items.length} {order.items.length === 1 ? 'услуга' : 'услуг'}</p>
                      </div>
                    </div>

                    {/* Services */}
                    <div className="px-5 py-4">
                      <div className="space-y-2">
                        {order.items.slice(0, 2).map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-sm">
                            <span className="text-gray-800 font-medium">{item.name}</span>
                            <span className="text-gray-500">×{item.quantity}</span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-gray-500">+ ещё {order.items.length - 2}</p>
                        )}
                      </div>
                    </div>

                    {/* Footer — призыв к действию */}
                    <div className="px-5 py-3 bg-gradient-to-r from-gray-50 to-blue-50/30 border-t border-gray-100 flex items-center justify-center gap-2">
                      <span className="text-sm font-semibold text-[#71bcf0]">Открыть билет</span>
                      <svg className="w-4 h-4 text-[#71bcf0] group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
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