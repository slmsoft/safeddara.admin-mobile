import { useState, useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import Logo2 from '@/imports/Logo2';
import { ordersApi } from '../../api/orders';

interface TicketWithBarcodeProps {
  orderId: string;
  orderNumber: string;
  items: Array<{
    name: string;
    categoryName: string;
    price: number;
    quantity: number;
    date: string;
  }>;
  total: number;
  createdAt: string;
  onClose: () => void;
}

export function TicketWithBarcode({
  orderId,
  orderNumber,
  items,
  total,
  createdAt,
  onClose,
}: TicketWithBarcodeProps) {
  const [barcodeUrl, setBarcodeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBarcodeEnlarged, setIsBarcodeEnlarged] = useState(false);

  // Swagger: GET /orders/{id}/barcode — Returns image/png
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchBarcode = async () => {
      if (!orderId) {
        setError('Нет ID заказа');
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const response = await ordersApi.getBarcode(orderId);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;
        if (!cancelled) setBarcodeUrl(url);
        else URL.revokeObjectURL(url);
      } catch (err: any) {
        if (!cancelled) setError(err?.message || 'Не удалось загрузить штрихкод');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchBarcode();

    return () => {
      cancelled = true;
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [orderId]);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header with Back Button */}
      <div className="px-6 py-4 border-b border-gray-100">
        <button
          onClick={onClose}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" strokeWidth={2.5} />
        </button>
      </div>

      {/* Ticket Container */}
      <div className="flex-1 flex items-start justify-center p-6 overflow-auto relative">
        <div className={`w-full max-w-sm transition-opacity duration-300 ${isBarcodeEnlarged ? 'opacity-30' : 'opacity-100'}`}>
          {/* Ticket Card */}
          <div className="bg-white">
            {/* Logo/Brand */}
            <div className="text-center pt-6 pb-4">
              <div className="inline-block flex flex-col items-center">
                <div className="w-24 h-24">
                  <Logo2 />
                </div>
                <p className="text-xs text-gray-500 mt-2">Таджикистан</p>
              </div>
            </div>

            {/* Main Info Grid */}
            <div className="px-6 pb-6 space-y-5">
              {/* Date and Ticket Number */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Дата</p>
                  <p className="text-base font-bold text-gray-900">{createdAt}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Билет №</p>
                  <p className="text-base font-bold text-gray-900">{orderNumber}</p>
                </div>
              </div>

              {/* Services and Total */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Услуги</p>
                  <p className="text-base font-bold text-gray-900">{items.length} шт</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Сумма</p>
                  <p className="text-base font-bold text-gray-900">{total} смн</p>
                </div>
              </div>

              {/* Services List */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Список услуг</p>
                <div className="space-y-1.5">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">• {item.name}</span>
                      <span className="text-gray-500 font-medium">×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Barcode Section — Swagger: GET /orders/{id}/barcode (image/png) */}
            <div className="px-6 pb-8 pt-4">
              <div
                className="flex justify-center cursor-pointer min-h-[80px] items-center"
                onClick={() => barcodeUrl && setIsBarcodeEnlarged(true)}
              >
                {isLoading && (
                  <div className="py-8 text-gray-400 text-sm">Загрузка штрихкода...</div>
                )}
                {error && (
                  <div className="py-8 text-red-500 text-sm text-center">{error}</div>
                )}
                {barcodeUrl && !isLoading && (
                  <img
                    src={barcodeUrl}
                    alt="Штрихкод билета"
                    className="max-w-full h-auto max-h-[80px] object-contain"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enlarged Barcode Overlay */}
        {isBarcodeEnlarged && barcodeUrl && (
          <div
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center backdrop-blur-sm"
            onClick={() => setIsBarcodeEnlarged(false)}
          >
            <div
              className="bg-white rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={barcodeUrl}
                alt="Штрихкод билета"
                className="max-w-full max-h-[300px] object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
