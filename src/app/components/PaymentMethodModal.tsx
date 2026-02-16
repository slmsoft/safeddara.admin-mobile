/**
 * Модалка выбора способа оплаты — строго по Swagger:
 * GET /cards/all, POST /cards/add, POST /orders/products/create, GET /payments/all
 */
import { useState, useRef } from 'react';
import { Plus } from 'lucide-react';
import { cardsApi } from '../../api/cards';
import type { Card } from '../../api/types';

interface SavedCardItem {
  id: string;
  cardNumber: string;
  expiry: string;
  cardType: string;
}

function CardIconSmall({ cardType }: { cardType: string }) {
  const isVisa = /visa|vsa|^4/i.test(cardType);
  const isMc = /master|mcr|^5/i.test(cardType);
  return (
    <div
      className={`w-12 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
        isVisa ? 'bg-gradient-to-br from-[#1A1F71] to-[#2D3A9F]' : isMc ? 'bg-gradient-to-br from-[#EB001B] to-[#F79E1B]' : 'bg-gray-800'
      }`}
    >
      {isVisa ? (
        <span className="text-white font-bold text-[9px] tracking-wider">VISA</span>
      ) : isMc ? (
        <div className="flex -space-x-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 opacity-90" />
        </div>
      ) : (
        <span className="text-white/80 text-[7px] font-medium">MILLI</span>
      )}
    </div>
  );
}

function getCardTypeLabel(cardType: string): string {
  if (/visa|vsa/i.test(cardType)) return 'Visa Gold';
  if (/master|mcr/i.test(cardType)) return 'Mastercard Platinum';
  return 'Корти Милли';
}

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedCards: Array<SavedCardItem>;
  onCreateOrder: (cardId: number) => Promise<void>;
}

export function PaymentMethodModal({
  isOpen,
  onClose,
  savedCards,
  onCreateOrder,
}: PaymentMethodModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiry, setExpiry] = useState('');
  const [holder, setHolder] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  if (!isOpen) return null;

  const formatCardNumber = (v: string) => {
    const n = v.replace(/\D/g, '').slice(0, 16); // Строго 16 цифр — предотвращает дублирование при вставке
    return n.match(/.{1,4}/g)?.join(' ') || n;
  };
  const formatExpiry = (v: string) => {
    const n = v.replace(/\D/g, '');
    if (n.length >= 2) return n.slice(0, 2) + '/' + n.slice(2, 4);
    return n;
  };

  const handleSelectCard = async (cardId: string) => {
    if (submittingRef.current) return;
    const num = parseInt(cardId.replace('card-', ''), 10);
    if (isNaN(num)) return;
    submittingRef.current = true;
    setIsLoading(true);
    setError(null);
    try {
      await onCreateOrder(num);
      onClose();
    } catch (e: any) {
      setError(e.message || 'Ошибка');
    } finally {
      submittingRef.current = false;
      setIsLoading(false);
    }
  };

  const getLast4 = (num: string) => (num.replace(/\s/g, '') || num).slice(-4);
  const isCardAlreadySaved = (enteredLast4: string) =>
    savedCards.some((c) => getLast4(c.cardNumber) === enteredLast4);

  const handleAddAndPay = async () => {
    if (submittingRef.current) return;
    const pan = cardNumber.replace(/\s/g, '');
    if (pan.length !== 16 || !cvv || !expiry) {
      setError('Заполните все поля');
      return;
    }
    if (isCardAlreadySaved(getLast4(cardNumber))) {
      setError('Эта карта уже добавлена');
      return;
    }
    submittingRef.current = true;
    setIsLoading(true);
    setError(null);
    const [expMonth, expYear] = expiry.split('/');
    const cardData: Card = {
      pan,
      cvv: cvv || undefined,
      expMonth: expMonth?.trim() || undefined,
      expYear: expYear?.trim() || undefined,
      holder: holder.trim() || undefined,
    };
    try {
      const res = await cardsApi.addCard(cardData);
      if (!res.success || !res.data || typeof res.data !== 'object') {
        throw new Error(res.message || 'Ошибка добавления карты');
      }
      const uc = (res.data as any).userCard;
      const newCardId = uc?.cardId ?? uc?.id;
      if (!newCardId) throw new Error('Не удалось получить ID карты');
      await onCreateOrder(newCardId);
      onClose();
    } catch (e: any) {
      const msg = e?.message || e?.response?.data?.message || '';
      setError(/duplicate|23505|unique constraint/i.test(String(msg)) ? 'Эта карта уже добавлена' : msg || 'Ошибка');
    } finally {
      submittingRef.current = false;
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:bottom-auto z-50 lg:w-full lg:max-w-md animate-slideUp lg:animate-fadeIn bg-white rounded-t-3xl lg:rounded-3xl px-6 py-6 shadow-2xl">
        <h2 className="text-center text-base lg:text-lg font-semibold text-gray-900 mb-6">
          Выберите способ оплаты
        </h2>

        {!showAddForm ? (
          <div className="space-y-3 mb-4">
            {savedCards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleSelectCard(card.id)}
                disabled={isLoading}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 transition-all active:scale-[0.98] disabled:opacity-50 text-left"
              >
                <CardIconSmall cardType={card.cardType} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{getCardTypeLabel(card.cardType)}</p>
                  <p className="text-gray-500 text-xs mt-0.5">•••• {card.cardNumber.slice(-4)}</p>
                </div>
              </button>
            ))}
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#71bcf0] hover:bg-blue-50/30 transition-all"
            >
              <div className="w-12 h-9 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                <Plus className="w-5 h-5 text-gray-500" strokeWidth={2.5} />
              </div>
              <span className="font-medium text-gray-700">Добавить карту</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Назад
            </button>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Номер карты</label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                maxLength={19}
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="0000 0000 0000 0000"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#71bcf0]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="123"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#71bcf0]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Срок (MM/YY)</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value).slice(0, 5))}
                placeholder="MM/YY"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#71bcf0]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Держатель (необяз.)</label>
              <input
                type="text"
                value={holder}
                onChange={(e) => setHolder(e.target.value)}
                placeholder="IVAN IVANOV"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#71bcf0]"
              />
            </div>
            {error && (
              <div className="p-3 bg-red-50 rounded-xl text-red-600 text-sm">{error}</div>
            )}
            <button
              onClick={handleAddAndPay}
              disabled={isLoading || cardNumber.replace(/\s/g, '').length !== 16 || !cvv || !expiry}
              className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-white rounded-2xl font-semibold disabled:opacity-50"
            >
              {isLoading ? 'Ожидание...' : 'Добавить и оплатить'}
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translate(-50%, -48%); } to { opacity: 1; transform: translate(-50%, -50%); } }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </>
  );
}
