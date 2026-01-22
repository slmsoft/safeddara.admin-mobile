import { useState } from 'react';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { ModernHeader } from './ModernHeader';

interface AktivbonkPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPay: (cardNumber: string, cvv: string, expiry: string) => void;
  totalAmount: number;
  itemsCount: number;
  productsAmount: number;
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
}

export function AktivbonkPaymentModal({ 
  isOpen, 
  onClose, 
  onPay, 
  totalAmount,
  itemsCount,
  productsAmount,
  onWeatherClick,
  onLiveClick
}: AktivbonkPaymentModalProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiry, setExpiry] = useState('');

  if (!isOpen) return null;

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const groups = numbers.match(/.{1,4}/g);
    return groups ? groups.join(' ') : '';
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      const formatted = value.length >= 3 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;
      setExpiry(formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handlePay = () => {
    if (cardNumber.replace(/\s/g, '').length === 16 && cvv.length === 3 && expiry.length === 5) {
      onPay(cardNumber, cvv, expiry);
    }
  };

  const isFormValid = cardNumber.replace(/\s/g, '').length === 16 && cvv.length === 3 && expiry.length === 5;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-white z-50"
      />
      
      {/* Page */}
      <div className="fixed inset-0 z-50 overflow-y-auto bg-white animate-slideIn">
        <div className="min-h-screen w-full max-w-[402px] mx-auto">
          {/* Modern Header */}
          <ModernHeader
            onWeatherClick={onWeatherClick}
            onLiveClick={onLiveClick}
          />
          
          {/* Content */}
          <div className="px-4 sm:px-6 py-4 pb-32">
            {/* Title with back button */}
            <div className="flex items-center gap-3 mb-6">
              <button 
                onClick={onClose}
                className="flex-shrink-0 -ml-1"
              >
                <ChevronLeft className="w-6 h-6 text-[#71bcf0]" strokeWidth={2.5} />
              </button>
              <h3 className="text-lg font-bold text-gray-900">
                Выберите способ оплаты
              </h3>
            </div>

            {/* Card Number Input with Dropdown Icon */}
            <div className="mb-4 relative">
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="Введите номер карты"
                className="w-full px-4 py-4 rounded-xl bg-[#f5f7fa] border-0 focus:outline-none focus:ring-2 focus:ring-[#71bcf0]/30 text-gray-900 placeholder-gray-400 pr-12"
              />
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#71bcf0]" />
            </div>

            {/* CVV and Expiry */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <input
                type="text"
                value={cvv}
                onChange={handleCvvChange}
                placeholder="CVV-код"
                className="px-4 py-4 rounded-xl bg-[#f5f7fa] border-0 focus:outline-none focus:ring-2 focus:ring-[#71bcf0]/30 text-gray-900 placeholder-gray-400"
              />
              <input
                type="text"
                value={expiry}
                onChange={handleExpiryChange}
                placeholder="Срок действия"
                className="px-4 py-4 rounded-xl bg-[#f5f7fa] border-0 focus:outline-none focus:ring-2 focus:ring-[#71bcf0]/30 text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Payment Summary */}
            <div className="mb-8">
              <h4 className="font-bold text-gray-900 mb-4 text-lg">К оплате</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Сумма страховки</span>
                  <span className="font-medium text-gray-900">0 смн</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Товары на сумму</span>
                  <span className="font-medium text-gray-900">
                    {productsAmount.toLocaleString('ru-RU')} смн
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="font-bold text-gray-900 text-lg">Итого</span>
                  <span className="font-bold text-gray-900 text-lg">
                    {totalAmount.toLocaleString('ru-RU')} смн
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Buttons - Fixed at bottom */}
          <div className="fixed bottom-0 left-0 right-0 bg-white px-6 pb-8 pt-4 w-full lg:max-w-[402px] lg:mx-auto shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={!isFormValid}
              className={`w-full py-4 rounded-2xl font-semibold transition-all ${
                isFormValid
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 active:scale-98 shadow-md'
                  : 'bg-[#f0f4f8] text-gray-400 cursor-not-allowed'
              }`}
            >
              Оплатить
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}