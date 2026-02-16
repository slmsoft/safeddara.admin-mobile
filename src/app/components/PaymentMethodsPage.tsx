import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Plus, CreditCard, Trash2 } from 'lucide-react';
import { cardsApi } from '../../api/cards';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import type { Card } from '../../api/types';

interface DisplayCard {
  id: string;
  cardNumber: string;
  maskedNumber: string;
  cardType: string;
  cardTypeLabel: string;
  expiry: string;
}

function getCardDisplay(masked: string, cardBrand?: string): { typeLabel: string; shortId: string } {
  const digits = masked.replace(/\D/g, '');
  if (masked.startsWith('4') || digits.startsWith('4') || /visa|vsa/i.test(cardBrand || '')) {
    return { typeLabel: 'Visa Gold', shortId: 'VSA' };
  }
  if (masked.startsWith('5') || digits.startsWith('5') || /master|mcr/i.test(cardBrand || '')) {
    return { typeLabel: 'Mastercard Platinum', shortId: 'MCR' };
  }
  return { typeLabel: 'Корти Милли', shortId: 'ALF' };
}

/** Карта в стиле референса: тёмно-синяя, чип, KORTI MILLI, маска номера. Свайп влево — удаление */
function CardVisual({ card, onDelete }: { card: DisplayCard; onDelete?: () => void }) {
  const [swipeX, setSwipeX] = useState(0);
  const touchStart = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientX - touchStart.current;
    if (delta < 0) setSwipeX(Math.max(delta, -90));
    else setSwipeX(Math.min(delta * 0.3, 0));
  };
  const handleTouchEnd = () => {
    if (swipeX < -55 && onDelete) {
      onDelete();
    }
    setSwipeX(0);
  };

  const isVisa = /visa|vsa|^4/i.test(card.cardType);
  const isMc = /master|mcr|^5/i.test(card.cardType);
  const bgClass = isVisa ? 'from-[#1A1F71] to-[#2D3A9F]' : isMc ? 'from-[#EB001B] to-[#2D2D2D]' : 'from-[#0f172a] to-[#1e3a5f]';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-red-500" onTouchEnd={handleTouchEnd} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
      {onDelete && (
        <div className="absolute inset-y-0 right-0 w-[90px] flex items-center justify-center rounded-r-2xl z-0">
          <Trash2 className="w-6 h-6 text-white" />
        </div>
      )}
      <div
        className={`relative overflow-hidden bg-gradient-to-br ${bgClass} p-5 min-h-[120px] z-10 rounded-l-2xl shadow-lg ${onDelete ? '' : 'rounded-r-2xl'}`}
        style={{
          transform: onDelete ? `translateX(${swipeX}px)` : undefined,
          transition: 'transform 0.15s ease-out',
        }}
      >
        <div className="absolute top-3 right-3 opacity-30">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-white">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        </div>
        <div className="pt-8">
          <p className="text-white/90 font-bold text-sm tracking-widest uppercase">{card.cardTypeLabel}</p>
          <p className="text-white/80 text-xs mt-2 font-mono tracking-wider">{card.maskedNumber}</p>
        </div>
        <div className="absolute bottom-4 right-4 flex -space-x-2">
          <div className="w-6 h-6 rounded-full border-2 border-white/50" />
          <div className="w-6 h-6 rounded-full border-2 border-white/50 bg-white/20" />
        </div>
      </div>
    </div>
  );
}

interface PaymentMethodsPageProps {
  onBack: () => void;
  onAddCard: () => void;
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
  savedCards?: Array<{ id: string; cardNumber: string; expiry: string; cardType: string }>;
  onDeleteCard?: (cardId: string) => void;
}

export function PaymentMethodsPage({ onBack, onAddCard, savedCards: propCards = [], onDeleteCard }: PaymentMethodsPageProps) {
  const { isAuthenticated } = useAuth();
  const [displayCards, setDisplayCards] = useState<DisplayCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCards = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await cardsApi.getAllCards();
        if (response.success && response.data && typeof response.data === 'object') {
          const userCards = (response.data as any).userCards;
          if (Array.isArray(userCards)) {
            const mapped: DisplayCard[] = userCards.map((uc: any, idx: number) => {
              const cardId = uc.cardId ?? uc.id ?? idx;
              const masked = (uc.cardMasked ?? uc.pun ?? '').toString();
              const digits = masked.replace(/\D/g, '');
              const first4 = digits.length >= 8 ? digits.slice(0, 4) : '';
              const last4 = digits.length >= 4 ? digits.slice(-4) : (masked.match(/\d{4}/g)?.pop() || '****');
              const { typeLabel, shortId } = getCardDisplay(masked, uc.cardBrand);
              const maskedFormatted = first4 && last4 ? `${first4}***${shortId}**${last4}` : last4 ? `****${shortId}**${last4}` : masked || `****${last4}`;
              return {
                id: `card-${cardId}`,
                cardNumber: last4 ? `****${last4}` : masked,
                maskedNumber: maskedFormatted,
                cardType: uc.cardBrand || (masked.startsWith('4') ? 'Visa' : masked.startsWith('5') ? 'Mastercard' : 'Milli'),
                cardTypeLabel: typeLabel,
                expiry: (uc.exp ?? '').toString(),
              };
            });
            setDisplayCards(mapped);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки карт');
        console.error('Error loading cards:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadCards();
  }, [isAuthenticated]);

  const handleDeleteCard = (id: string) => {
    setDisplayCards((prev) => prev.filter((c) => c.id !== id));
    onDeleteCard?.(id);
  };

  const savedCards: DisplayCard[] = displayCards.length > 0
    ? displayCards
    : propCards.map((c) => ({
        id: c.id,
        cardNumber: c.cardNumber,
        maskedNumber: c.cardNumber,
        cardType: c.cardType,
        cardTypeLabel: c.cardType === 'Visa' ? 'Visa Gold' : c.cardType === 'Mastercard' ? 'Mastercard Platinum' : 'Корти Милли',
        expiry: c.expiry,
      }));
  return (
    <div className="min-h-screen bg-white overflow-x-hidden" style={{ maxWidth: '402px', margin: '0 auto', width: '100%' }}>
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
          Способ оплаты
        </h1>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center px-8 pt-32">
          <LoadingSpinner size="lg" />
          <p className="text-gray-500 mt-4">Загрузка карт...</p>
        </div>
      ) : error ? (
        <div className="px-4 pt-8">
          <ErrorMessage message={error} onRetry={() => window.location.reload()} />
        </div>
      ) : savedCards.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col min-h-[calc(100vh-60px)]">
          <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <CreditCard className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Список пуст</h2>
            <p className="text-center text-gray-500 leading-relaxed">
              Добавьте банковскую карту, чтобы<br />быстрее оплачивать покупки.
            </p>
          </div>
          <div className="flex-shrink-0 p-4 pt-2 pb-6">
            <button
              onClick={() => onAddCard && onAddCard()}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium text-sm transition-colors"
              type="button"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              <span>Добавить карту</span>
            </button>
          </div>
        </div>
      ) : (
        /* Карты + кнопка добавления внизу */
        <div className="flex flex-col min-h-[calc(100vh-60px)]">
          <div className="flex-1 px-4 pt-4 space-y-3 pb-4 overflow-auto">
            {savedCards.map((card) => (
              <CardVisual key={card.id} card={card} onDelete={onDeleteCard ? () => handleDeleteCard(card.id) : undefined} />
            ))}
          </div>
          <div className="flex-shrink-0 p-4 pt-2 pb-6">
            <button
              onClick={() => onAddCard && onAddCard()}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium text-sm transition-colors"
              type="button"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              <span>Добавить ещё карту</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}