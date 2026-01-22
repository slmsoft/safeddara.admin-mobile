import { useState } from 'react';
import { ChevronLeft, CreditCard } from 'lucide-react';
import { ModernHeader } from './ModernHeader';
import cardBgImage from '../../assets/889d10c3b17d7055eb180318a9d532bee39a212e.png';

interface MilliCardPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPay: (cardNumber: string, cvv: string, expiry: string) => void;
  totalAmount: number;
  itemsCount: number;
  productsAmount: number;
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
  savedCards?: Array<{
    id: string;
    cardNumber: string;
    expiry: string;
    cardType: string;
  }>;
}

export function MilliCardPaymentModal({ 
  isOpen, 
  onClose, 
  onPay, 
  totalAmount,
  itemsCount,
  productsAmount,
  onWeatherClick,
  onLiveClick,
  savedCards = []
}: MilliCardPaymentModalProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiry, setExpiry] = useState('');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

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
    if (selectedCardId) {
      // Pay with saved card
      const selectedCard = savedCards.find(c => c.id === selectedCardId);
      if (selectedCard) {
        onPay(selectedCard.cardNumber, '***', selectedCard.expiry);
      }
    } else if (cardNumber.replace(/\s/g, '').length === 16 && cvv.length === 3 && expiry.length === 5) {
      // Pay with new card
      onPay(cardNumber, cvv, expiry);
    }
  };

  const isFormValid = selectedCardId || (cardNumber.replace(/\s/g, '').length === 16 && cvv.length === 3 && expiry.length === 5);

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
            <div className="flex items-center gap-3 mb-8">
              <button 
                onClick={onClose}
                className="flex-shrink-0 -ml-1 hover:bg-gray-100 rounded-full p-1 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" strokeWidth={2.5} />
              </button>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Введите данные вашей карты
                </h3>
                <p className="text-sm text-gray-500 font-medium">Корти Милли</p>
              </div>
            </div>

            {/* Black Card Preview - более красивый с градиентом */}
            <div className="relative w-full aspect-[1.586] rounded-3xl overflow-hidden mb-8">
              <img 
                src={cardBgImage} 
                alt="Card Background" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Saved Cards */}
            {savedCards.length > 0 && (
              <div className="mb-6 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Сохраненные карты
                </p>
                {savedCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => setSelectedCardId(card.id === selectedCardId ? null : card.id)}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 rounded-2xl transition-all hover:shadow-md active:scale-[0.98]"
                    style={{
                      borderColor: selectedCardId === card.id ? '#71bcf0' : 'transparent',
                      background: selectedCardId === card.id ? 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)' : undefined
                    }}
                  >
                    {/* Card Icon */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a] flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth="2"/>
                          <path d="M2 10h20" strokeWidth="2"/>
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-gray-900 text-base">
                          {card.cardType} •••• {card.cardNumber.slice(-4)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Истекает {card.expiry}
                        </div>
                      </div>
                    </div>
                    
                    {/* Radio Button */}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedCardId === card.id 
                        ? 'border-[#71bcf0] bg-[#71bcf0] shadow-sm' 
                        : 'border-gray-300'
                    }`}>
                      {selectedCardId === card.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Divider if there are saved cards */}
            {savedCards.length > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">или новая карта</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              </div>
            )}

            {/* Card Form Section */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-5 mb-6 border border-gray-200/50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Данные карты
              </p>
              
              {/* Card Number Input */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  Номер карты
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="0000 0000 0000 0000"
                    className="w-full px-4 py-4 rounded-xl bg-white border-2 border-gray-200 focus:outline-none focus:border-[#71bcf0] transition-colors text-gray-900 placeholder-gray-400 font-medium"
                  />
                  <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* CVV and Expiry */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    CVV-код
                  </label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={handleCvvChange}
                    placeholder="123"
                    className="w-full px-4 py-4 rounded-xl bg-white border-2 border-gray-200 focus:outline-none focus:border-[#71bcf0] transition-colors text-gray-900 placeholder-gray-400 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    Срок действия
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    className="w-full px-4 py-4 rounded-xl bg-white border-2 border-gray-200 focus:outline-none focus:border-[#71bcf0] transition-colors text-gray-900 placeholder-gray-400 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Payment Summary - более стильный */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-6 border border-blue-100">
              <h4 className="font-bold text-gray-900 mb-5 text-base flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#71bcf0] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                К оплате
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Сумма страховки</span>
                  <span className="font-semibold text-gray-900">0 смн</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Товары на сумму</span>
                  <span className="font-semibold text-gray-900">
                    {productsAmount.toLocaleString('ru-RU')} смн
                  </span>
                </div>
                <div className="pt-4 border-t-2 border-[#71bcf0]/30">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-base">Итого</span>
                    <span className="font-bold text-[#71bcf0] text-2xl">
                      {totalAmount.toLocaleString('ru-RU')} смн
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Buttons - Fixed at bottom */}
          <div className="fixed bottom-0 left-0 right-0 bg-white px-6 pb-8 pt-5 w-full lg:max-w-[402px] lg:mx-auto shadow-[0_-8px_24px_rgba(0,0,0,0.08)] border-t border-gray-100">
            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={!isFormValid}
              className={`w-full py-5 rounded-2xl font-bold text-base transition-all ${
                isFormValid
                  ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:from-[#059669] hover:to-[#047857] active:scale-[0.98] shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isFormValid ? 'Оплатить' : 'Заполните все поля'}
            </button>
            
            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-gray-500 font-medium">Безопасная оплата SSL</span>
            </div>
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