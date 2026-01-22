import { ChevronLeft, Plus, CreditCard, Trash2 } from 'lucide-react';
import cardBgImage from '../../assets/889d10c3b17d7055eb180318a9d532bee39a212e.png';

interface PaymentMethodsPageProps {
  onBack: () => void;
  onAddCard: () => void;
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
  savedCards?: Array<{
    id: string;
    cardNumber: string;
    expiry: string;
    cardType: string;
  }>;
  onDeleteCard?: (cardId: string) => void;
}

export function PaymentMethodsPage({ onBack, onAddCard, savedCards = [], onDeleteCard, onWeatherClick, onLiveClick }: PaymentMethodsPageProps) {
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
          Методы оплаты
        </h1>
      </div>

      {/* Content */}
      {savedCards.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center px-8 pt-32">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <CreditCard className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Список пуст</h2>
          <p className="text-center text-gray-500 mb-8 leading-relaxed">
            Добавьте банковскую карту, чтобы<br />быстрее оплачивать покупки.
          </p>
          
          <button 
            onClick={() => onAddCard && onAddCard()}
            className="w-full max-w-md bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-white py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-yellow-200 hover:shadow-xl"
            type="button"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
            <span className="font-semibold">Добавить карту</span>
          </button>
        </div>
      ) : (
        /* Cards list */
        <div className="px-4 pt-4 space-y-4 pb-6 w-full box-border overflow-hidden">
          {savedCards.map((card) => (
            <div 
              key={card.id}
              className="relative w-full"
            >
              {/* Card with Image Background - Within bounds */}
              <div 
                className="relative w-full overflow-hidden rounded-2xl"
                style={{
                  backgroundImage: `url(${cardBgImage})`,
                  aspectRatio: '1.586',
                  minHeight: '240px',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {/* Delete Button - Fully inside card, not overlapping edges */}
                {onDeleteCard && (
                  <button
                    onClick={() => onDeleteCard(card.id)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-all shadow-lg z-20 active:scale-95"
                    style={{
                      top: '16px',
                      right: '16px'
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {/* Add new card button */}
          <button
            onClick={() => onAddCard && onAddCard()}
            className="w-full bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-700 py-4 px-5 rounded-xl flex items-center justify-center gap-2.5 transition-all border-2 border-dashed border-gray-300"
            type="button"
          >
            <Plus className="w-5 h-5 text-gray-600" strokeWidth={2.5} />
            <span className="font-medium text-sm">Добавить ещё карту</span>
          </button>
        </div>
      )}
    </div>
  );
}