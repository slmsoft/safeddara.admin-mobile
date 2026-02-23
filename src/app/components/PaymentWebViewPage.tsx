import { ChevronLeft } from 'lucide-react';
import { ModernHeader } from './ModernHeader';

interface PaymentWebViewPageProps {
  paymentUrl: string;
  onBack: () => void;
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
}

/**
 * Страница оплаты — WebView со ссылкой от API (Swagger: orderURL из GET /payments/all)
 * Хедер прикреплён сверху, навигация < Оплата — снизу хедера, затем WebView.
 */
export function PaymentWebViewPage({ paymentUrl, onBack, onWeatherClick, onLiveClick }: PaymentWebViewPageProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50 min-h-screen">
      {/* Хедер прикреплён сверху (погода, лого, LIVE) */}
      <ModernHeader onWeatherClick={onWeatherClick} onLiveClick={onLiveClick} />

      {/* Навигация < Оплата — снизу хедера, прикреплена */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 sticky top-[72px] z-30">
        <div className="flex items-center justify-between px-4 py-3 gap-2">
          <button onClick={onBack} className="transition-all active:scale-95" type="button" aria-label="Назад">
            <ChevronLeft className="w-6 h-6 text-[#71bcf0]" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 flex-1 text-center">Оплата</h1>
          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-[#71bcf0] whitespace-nowrap"
          >
            Новая вкладка
          </a>
        </div>
      </div>

      {/* WebView — без sandbox: страница банка может не работать в sandbox-iframe */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <iframe
          src={paymentUrl}
          className="w-full border-0 bg-white block"
          style={{ height: 'calc(100% + 80px)', marginTop: '-80px' }}
          title="Оплата"
          allow="payment"
        />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.25s ease-out; }
        .animate-slideUp { animation: slideUp 0.35s ease-out 0.1s both; }
      `}</style>
    </div>
  );
}
