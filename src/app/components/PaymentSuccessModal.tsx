import { Check } from 'lucide-react';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  paymentMethod: string;
  transactionId?: string;
}

export function PaymentSuccessModal({ 
  isOpen, 
  onClose, 
  amount,
  paymentMethod,
  transactionId = Math.random().toString(36).substring(2, 10).toUpperCase()
}: PaymentSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-6 pointer-events-none">
        <div 
          className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 pointer-events-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
          style={{ animation: 'slideUpBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        >
          {/* Success Icon with Animation */}
          <div className="relative mx-auto mb-6" style={{ width: '100px', height: '100px' }}>
            {/* Outer Circle - Animated */}
            <div 
              className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-green-600"
              style={{ 
                animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s backwards'
              }}
            />
            
            {/* Check Icon - Animated */}
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{ 
                animation: 'checkBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s backwards'
              }}
            >
              <Check className="w-14 h-14 text-white" strokeWidth={3} />
            </div>

            {/* Pulse Rings */}
            <div 
              className="absolute inset-0 rounded-full border-4 border-green-300"
              style={{ 
                animation: 'pulse1 1.5s ease-out 0.6s infinite'
              }}
            />
            <div 
              className="absolute inset-0 rounded-full border-4 border-green-200"
              style={{ 
                animation: 'pulse2 1.5s ease-out 0.8s infinite'
              }}
            />
          </div>

          {/* Title */}
          <h2 
            className="text-2xl font-bold text-gray-900 text-center mb-2"
            style={{ 
              animation: 'fadeInUp 0.5s ease-out 0.5s backwards'
            }}
          >
            Оплата успешна!
          </h2>
          
          {/* Subtitle */}
          <p 
            className="text-gray-600 text-center mb-6"
            style={{ 
              animation: 'fadeInUp 0.5s ease-out 0.6s backwards'
            }}
          >
            Ваш платеж был успешно обработан
          </p>

          {/* Payment Details Card */}
          <div 
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 mb-6 space-y-3"
            style={{ 
              animation: 'fadeInUp 0.5s ease-out 0.7s backwards'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Сумма платежа</span>
              <span className="text-lg font-bold text-gray-900">
                {amount.toLocaleString('ru-RU')} смн
              </span>
            </div>
            
            <div className="h-px bg-gray-200"></div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Способ оплаты</span>
              <span className="text-sm font-semibold text-gray-900">{paymentMethod}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">ID транзакции</span>
              <span className="text-xs font-mono text-gray-700 bg-white px-2 py-1 rounded">
                {transactionId}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Дата и время</span>
              <span className="text-sm text-gray-900">
                {new Date().toLocaleString('ru-RU', { 
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          {/* Success Message */}
          <div 
            className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6"
            style={{ 
              animation: 'fadeInUp 0.5s ease-out 0.8s backwards'
            }}
          >
            <p className="text-sm text-green-800 text-center">
              ✨ Детали заказа отправлены на вашу почту
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-semibold hover:from-green-600 hover:to-green-700 active:scale-98 transition-all shadow-lg hover:shadow-xl"
            style={{ 
              animation: 'fadeInUp 0.5s ease-out 0.9s backwards'
            }}
          >
            Отлично!
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUpBounce {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          60% {
            opacity: 1;
            transform: translateY(-10px) scale(1.02);
          }
          100% {
            transform: translateY(0) scale(1);
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes checkBounce {
          0% {
            transform: scale(0) rotate(-45deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(5deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

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

        @keyframes pulse1 {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes pulse2 {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}