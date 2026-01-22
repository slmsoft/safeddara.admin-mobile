import milliCardLogo from '../../assets/cb437bc156df0f27af54b856b636f303c0794bb5.png';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectKaspi: () => void;
  onSelectCard: () => void;
  savedCards?: Array<{
    id: string;
    cardNumber: string;
    expiry: string;
    cardType: string;
  }>;
  onSelectSavedCard?: (cardId: string) => void;
}

export function PaymentMethodModal({ isOpen, onClose, onSelectKaspi, onSelectCard, savedCards = [], onSelectSavedCard }: PaymentMethodModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal - Mobile: bottom sheet, Desktop: centered dialog */}
      <div className="fixed bottom-0 left-0 right-0 lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:bottom-auto z-50 lg:w-full lg:max-w-md animate-slideUp lg:animate-fadeIn">
        <div className="bg-white rounded-t-3xl lg:rounded-3xl px-6 py-6 w-full shadow-2xl lg:max-w-none">
          <h2 className="text-center text-base lg:text-lg font-semibold text-gray-900 mb-6">
            Выберите способ оплаты
          </h2>

          <div className="space-y-3 mb-4">
            {/* Saved Cards */}
            {savedCards.length > 0 && savedCards.map((card) => (
              <button
                key={card.id}
                onClick={() => onSelectSavedCard?.(card.id)}
                className="w-full flex items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  {/* Корти Милли Logo - Dark Square */}
                  <div className="w-12 h-12 rounded-lg bg-[#2c2c2c] flex items-center justify-center flex-shrink-0">
                    <img 
                      src={milliCardLogo} 
                      alt="Корти Милли" 
                      className="w-7 h-7 object-contain"
                    />
                  </div>
                  <span className="text-base font-medium text-gray-900">
                    Card •••• {card.cardNumber.slice(-4)}
                  </span>
                </div>
                
                {/* Beautiful Blue Radio Button */}
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#71bcf0] to-[#4a9fd8] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                </div>
              </button>
            ))}

            {/* Оплата Корти Милли - с черной иконкой */}
            <button
              onClick={onSelectKaspi}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all active:scale-[0.98]"
            >
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center flex-shrink-0 shadow-sm">
                <img 
                  src={milliCardLogo} 
                  alt="Корти Милли" 
                  className="w-7 h-7 object-contain"
                />
              </div>
              <span className="text-base font-medium text-gray-900">Оплата Корти Милли</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -48%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}