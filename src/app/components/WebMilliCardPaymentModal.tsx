import { useState } from 'react';
import { X, CreditCard } from 'lucide-react';
import cardBgImage from '../../assets/889d10c3b17d7055eb180318a9d532bee39a212e.png';

interface WebMilliCardPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPay: (cardNumber: string, cvv: string, expiry: string) => void;
  totalAmount: number;
  itemsCount: number;
  productsAmount: number;
  savedCards?: Array<{
    id: string;
    cardNumber: string;
    expiry: string;
    cardType: string;
  }>;
}

export function WebMilliCardPaymentModal({ 
  isOpen, 
  onClose, 
  onPay, 
  totalAmount,
  itemsCount,
  productsAmount,
  savedCards = []
}: WebMilliCardPaymentModalProps) {
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
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Dialog - VERY COMPACT */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl animate-fadeInScale">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Modal Header */}
          <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Данные карты Корти Милли</h2>
            </div>
            <button 
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="grid grid-cols-2 gap-4 p-4">
            {/* Left Column - Form */}
            <div className="space-y-3">
              {/* Card Preview - BIGGER */}
              <div className="relative w-full aspect-[1.586] rounded-2xl overflow-hidden">
                <img 
                  src={cardBgImage} 
                  alt="Card" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Saved Cards - MINI */}
              {savedCards.length > 0 && (
                <div className="space-y-1.5">
                  {savedCards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => setSelectedCardId(card.id === selectedCardId ? null : card.id)}
                      className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 border rounded-lg transition-all hover:shadow"
                      style={{
                        borderColor: selectedCardId === card.id ? '#71bcf0' : '#e5e7eb',
                        background: selectedCardId === card.id ? '#e0f2fe' : undefined
                      }}
                    >
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 text-xs">
                          {card.cardType} •••• {card.cardNumber.slice(-4)}
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedCardId === card.id ? 'border-[#71bcf0] bg-[#71bcf0]' : 'border-gray-300'
                      }`}>
                        {selectedCardId === card.id && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                      </div>
                    </button>
                  ))}
                  <div className="text-center py-1">
                    <span className="text-[9px] text-gray-400">или новая карта</span>
                  </div>
                </div>
              )}

              {/* Card Number */}
              <div>
                <label className="block text-[10px] font-semibold text-gray-600 mb-1">Номер карты</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="0000 0000 0000 0000"
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#71bcf0] text-gray-900 placeholder-gray-400 text-xs"
                />
              </div>

              {/* CVV and Expiry */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-600 mb-1">CVV</label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={handleCvvChange}
                    placeholder="123"
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#71bcf0] text-gray-900 placeholder-gray-400 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-600 mb-1">Срок</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#71bcf0] text-gray-900 placeholder-gray-400 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="flex flex-col justify-between">
              {/* Payment Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-4 border border-blue-100">
                <h4 className="font-bold text-gray-900 text-sm mb-3">К оплате</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Страховка</span>
                    <span className="font-semibold text-gray-900 text-xs">0 смн</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Товары</span>
                    <span className="font-semibold text-gray-900 text-xs">
                      {productsAmount.toLocaleString('ru-RU')} смн
                    </span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-[#71bcf0]/30">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900 text-sm">Итого</span>
                      <span className="font-bold text-[#71bcf0] text-xl">
                        {totalAmount.toLocaleString('ru-RU')} смн
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePay}
                disabled={!isFormValid}
                className={`w-full py-3 rounded-xl font-bold text-sm mt-3 transition-all ${
                  isFormValid
                    ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:from-[#059669] hover:to-[#047857] shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isFormValid ? 'Оплатить' : 'Заполните поля'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translate(-50%, -48%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.3s ease-out;
        }
      `}</style>
    </>
  );
}