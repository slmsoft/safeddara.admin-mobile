import { ChevronLeft, CreditCard, CheckCircle } from 'lucide-react';
import { useState, useRef } from 'react';
import cardBgImage from '../../assets/889d10c3b17d7055eb180318a9d532bee39a212e.png';
import { cardsApi } from '../../api/cards';
import { useAuth } from '../contexts/AuthContext';
import type { Card } from '../../api/types';

interface AddCardPageProps {
  onBack: () => void;
  onAddCard: (cardNumber: string, expiry: string) => void;
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
  onDeleteCard?: (cardId: string) => void;
  savedCards?: any[];
}

export function AddCardPage({ onBack, onAddCard, onWeatherClick, onLiveClick, onDeleteCard, savedCards }: AddCardPageProps) {
  const { isAuthenticated } = useAuth();
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiry, setExpiry] = useState('');
  const [holder, setHolder] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\s/g, '');
    const formatted = numbers.match(/.{1,4}/g)?.join(' ') || numbers;
    return formatted;
  };

  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2, 4);
    }
    return numbers;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16); // Строго 16 цифр — защита от дублирования при вставке
    setCardNumber(formatCardNumber(value));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setExpiry(formatExpiry(value));
    }
  };

  const getLast4 = (num: string) => (num.replace(/\s/g, '') || num).slice(-4);
  const isCardAlreadySaved = (enteredLast4: string) =>
    (savedCards ?? []).some((c) => getLast4(c.cardNumber) === enteredLast4);

  const handleSave = async () => {
    if (!isAuthenticated) {
      setError('Необходима авторизация для сохранения карты');
      return;
    }
    const last4 = getLast4(cardNumber);
    if (isCardAlreadySaved(last4)) {
      setError('Эта карта уже добавлена');
      return;
    }
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      // Parse expiry
      const [expMonth, expYear] = expiry.split('/');
      
      // Swagger entities.Card: pan (required), cvv, expMonth, expYear, holder
      const cardData: Card = {
        pan: cardNumber.replace(/\s/g, ''),
        cvv: cvv || undefined,
        expMonth: expMonth || undefined,
        expYear: expYear || undefined,
        holder: holder.trim() || undefined,
      };

      const response = await cardsApi.addCard(cardData);
      if (response.success) {
        // API returns {"userCard": {...}} in data, but we don't need it for success modal
        setShowSuccessModal(true);
      } else {
        setError(response.message || 'Ошибка при сохранении карты');
      }
    } catch (err: any) {
      const msg = err?.message || err?.response?.data?.message || '';
      setError(
        /duplicate|23505|unique constraint/i.test(String(msg))
          ? 'Эта карта уже добавлена'
          : msg || 'Ошибка при сохранении карты'
      );
      console.error('Error adding card:', err);
    } finally {
      submittingRef.current = false;
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    onAddCard(cardNumber, expiry);
    setShowSuccessModal(false);
  };

  const handleCancel = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="min-h-screen bg-white pb-6" style={{ maxWidth: '402px', margin: '0 auto' }}>
      {/* Header */}
      <div className="bg-white px-5 py-4 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => onBack && onBack()}
          className="transition-all active:scale-95 z-10"
          type="button"
        >
          <ChevronLeft className="w-6 h-6 text-[#71bcf0]" />
        </button>
        <h1 className="absolute left-0 right-0 text-center text-base font-semibold text-gray-900 pointer-events-none">
          Добавить карту
        </h1>
      </div>

      {/* Content */}
      <div className="px-5 pt-6 space-y-6">
        {/* Virtual Card Preview - Clean Background Only */}
        <div className="relative w-full aspect-[1.586] rounded-2xl overflow-hidden">
          <img 
            src={cardBgImage} 
            alt="Card Background" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Info Text */}
          <p className="text-gray-600 text-sm text-center px-4">
            Введите данные банковской карты
          </p>

          {/* Card Number */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Номер карты
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="0000 0000 0000 0000"
              className="w-full px-4 py-4 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all text-gray-900 placeholder:text-gray-400 font-mono text-lg"
            />
            <div className="absolute right-4 top-[42px]">
              <CreditCard className="w-5 h-5 text-[#D4AF37]" />
            </div>
          </div>

          {/* Card Holder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Имя держателя карты (необязательно)
            </label>
            <input
              type="text"
              value={holder}
              onChange={(e) => setHolder(e.target.value)}
              placeholder="IVAN IVANOV"
              className="w-full px-4 py-4 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all text-gray-900 placeholder:text-gray-400 uppercase"
            />
          </div>

          {/* CVV and Expiry */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV-код
              </label>
              <input
                type="text"
                value={cvv}
                onChange={handleCvvChange}
                placeholder="123"
                maxLength={3}
                className="w-full px-4 py-4 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all text-gray-900 placeholder:text-gray-400 font-mono text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Срок действия
              </label>
              <input
                type="text"
                value={expiry}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                className="w-full px-4 py-4 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all text-gray-900 placeholder:text-gray-400 font-mono text-lg"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!cardNumber || !cvv || !expiry || cardNumber.replace(/\s/g, '').length !== 16 || isLoading || !isAuthenticated}
            className="w-full py-4 bg-gray-200 text-gray-400 rounded-2xl font-semibold text-base disabled:opacity-100 enabled:bg-gradient-to-r enabled:from-[#D4AF37] enabled:to-[#F4D03F] enabled:text-white enabled:shadow-lg enabled:shadow-yellow-200 transition-all mt-6"
          >
            {isLoading ? 'Сохранение...' : 'Сохранить карту'}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 animate-in zoom-in-95 duration-200">
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-9 h-9 text-green-500" strokeWidth={2.5} />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Подтвердить добавление?
            </h3>

            {/* Description */}
            <p className="text-gray-500 text-center mb-6 leading-relaxed">
              Карта **** {cardNumber.slice(-4)} будет добавлена в методы оплаты
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-white rounded-2xl font-semibold hover:shadow-lg transition-all shadow-yellow-200"
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}