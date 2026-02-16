import { ChevronLeft, CreditCard } from 'lucide-react';
import { useState, useRef } from 'react';
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
  onNeedLogin?: () => void;
}

export function AddCardPage({ onBack, onAddCard, savedCards, onNeedLogin }: AddCardPageProps) {
  const { isAuthenticated } = useAuth();
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiry, setExpiry] = useState('');
  const [holder, setHolder] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 16);
    return numbers.match(/.{1,4}/g)?.join(' ') || numbers;
  };

  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 4);
    if (numbers.length >= 2) return numbers.slice(0, 2) + '/' + numbers.slice(2, 4);
    return numbers;
  };

  const getLast4 = (num: string) => (num.replace(/\s/g, '') || num).slice(-4);
  const isCardAlreadySaved = (enteredLast4: string) =>
    (savedCards ?? []).some((c: any) => getLast4(c.cardNumber) === enteredLast4);

  const handleSave = async () => {
    if (!isAuthenticated) {
      setError('Сессия истекла или вы не вошли в аккаунт. Войдите снова.');
      return;
    }
    if (isCardAlreadySaved(getLast4(cardNumber))) {
      setError('Эта карта уже добавлена');
      return;
    }
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const [expMonth, expYear] = expiry.split('/');
      const cardData: Card = {
        pan: cardNumber.replace(/\s/g, ''),
        cvv: cvv || undefined,
        expMonth: expMonth || undefined,
        expYear: expYear || undefined,
        holder: holder.trim() || undefined,
      };
      const response = await cardsApi.addCard(cardData);
      if (response.success) {
        onAddCard(cardNumber, expiry);
        onBack();
      } else {
        setError(response.message || 'Ошибка');
      }
    } catch (err: any) {
      const msg = err?.message || err?.response?.data?.message || '';
      setError(/duplicate|23505|unique constraint/i.test(String(msg)) ? 'Эта карта уже добавлена' : msg || 'Ошибка');
    } finally {
      submittingRef.current = false;
      setIsLoading(false);
    }
  };

  const isValid = cardNumber.replace(/\s/g, '').length === 16 && cvv.length >= 3 && expiry.length === 5;

  return (
    <div className="min-h-screen bg-white" style={{ maxWidth: '402px', margin: '0 auto' }}>
      <div className="px-5 py-4 flex items-center sticky top-0 z-10 bg-white">
        <button onClick={onBack} className="transition-all active:scale-95" type="button">
          <ChevronLeft className="w-6 h-6 text-[#71bcf0]" />
        </button>
        <h1 className="absolute left-0 right-0 text-center text-base font-semibold text-gray-900 pointer-events-none">
          Добавить карту
        </h1>
      </div>

      <div className="flex flex-col min-h-[calc(100vh-60px)]">
        <div className="flex-1 px-5 pt-6 space-y-4 overflow-auto pb-4">
          {/* Номер карты */}
          <div className="relative">
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="Введите номер карты"
              className="w-full px-4 py-4 pr-12 bg-gray-100 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-[#71bcf0]/30 text-gray-900 placeholder:text-gray-500 font-mono"
            />
            <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#71bcf0]" />
          </div>

          {/* CVV и Срок действия */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="CVV-код"
              className="w-full px-4 py-4 bg-gray-100 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-[#71bcf0]/30 text-gray-900 placeholder:text-gray-500 font-mono"
            />
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              placeholder="Срок действия"
              className="w-full px-4 py-4 bg-gray-100 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-[#71bcf0]/30 text-gray-900 placeholder:text-gray-500 font-mono"
            />
          </div>

          {/* Holder — для бэкенда (Swagger: entities.Card.holder) */}
          <input
            type="text"
            value={holder}
            onChange={(e) => setHolder(e.target.value)}
            placeholder="Держатель карты"
            className="w-full px-4 py-4 bg-gray-100 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-[#71bcf0]/30 text-gray-900 placeholder:text-gray-500"
          />

          {error && (
            <div className="space-y-2">
              <p className="text-red-500 text-sm text-center">{error}</p>
              {!isAuthenticated && onNeedLogin && (
                <button
                  type="button"
                  onClick={onNeedLogin}
                  className="w-full py-2.5 rounded-lg bg-[#71bcf0] text-white text-sm font-medium hover:bg-[#5aa8e0] transition-colors"
                >
                  Войти в аккаунт
                </button>
              )}
            </div>
          )}
        </div>

        {/* Сохранить — внизу как у «Добавить карту» */}
        <div className="flex-shrink-0 p-4 pt-2 pb-6">
          <button
            onClick={handleSave}
            disabled={!isValid || isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg bg-gray-200 text-gray-500 font-medium text-sm disabled:opacity-100 disabled:cursor-not-allowed enabled:bg-green-600 enabled:text-white enabled:hover:bg-green-700 transition-colors"
          >
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
}
