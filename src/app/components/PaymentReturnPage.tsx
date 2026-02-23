/**
 * Страница возврата после оплаты Commerzbank.
 * Commerzbank перенаправляет сюда после успешной оплаты.
 * Если открыто в iframe — отправляем postMessage родителю, чтобы закрыть WebView и перейти в «Мои брони».
 */
import { useEffect } from 'react';

export function PaymentReturnPage() {
  useEffect(() => {
    try {
      if (window.self !== window.top) {
        // Открыто в iframe — уведомляем родительское окно
        window.parent.postMessage({ type: 'payment_complete', source: 'commerzbank' }, '*');
      }
    } catch {
      // Игнорируем ошибки postMessage
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Оплата успешно выполнена</h1>
        <p className="text-gray-600 text-sm">
          Возвращаемся в приложение...
        </p>
      </div>
    </div>
  );
}
