import { useState, useEffect } from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';
import { ModernHeader } from './ModernHeader';

interface CartItem {
  id: string;
  category: string;
  name: string;
  description: string;
  date: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartPageProps {
  onBack?: () => void;
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
  cartItems: CartItem[];
  onUpdateCart: (items: CartItem[]) => void;
  onCheckout?: () => void;
}

export function CartPage({ onBack, onWeatherClick, onLiveClick, cartItems: initialCartItems, onUpdateCart, onCheckout }: CartPageProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  // Update local state when prop changes
  useEffect(() => {
    setCartItems(initialCartItems);
  }, [initialCartItems]);

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const updateQuantity = (id: string, delta: number) => {
    const updatedItems = cartItems.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    setCartItems(updatedItems);
    onUpdateCart?.(updatedItems);
  };

  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    onUpdateCart?.(updatedItems);
  };

  const clearCart = () => {
    setCartItems([]);
    onUpdateCart?.([]);
  };

  const handleClearAll = () => {
    clearCart();
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader onWeatherClick={onWeatherClick} onLiveClick={onLiveClick} />

      {/* Header with Title and Clear Button */}
      <div className="bg-white px-5 py-4 flex items-center justify-between sticky top-[104px] z-40">
        <h1 className="flex-1 text-center text-base font-semibold text-gray-900">
          Корзина ({totalItems})
        </h1>
        <button
          onClick={handleClearAll}
          className="text-sm text-red-500 font-medium hover:text-red-600 transition-colors"
          type="button"
        >
          Очистить
        </button>
      </div>

      {/* Cart Items */}
      <div className="px-5 pt-5 pb-8 space-y-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Trash2 className="w-12 h-12 text-gray-300" />
            </div>
            <p className="text-gray-400">Корзина пуста</p>
          </div>
        ) : (
          <>
            {cartItems.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-sm overflow-hidden"
                style={{
                  animation: `fadeInUp 0.3s ease-out ${index * 0.05}s backwards`
                }}
              >
                <div className="p-4">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400 mb-1">{item.category}</p>
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                            {item.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                          type="button"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-gray-500">
                          Дата: {item.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price and Quantity Controls */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <span className="font-semibold text-gray-900">
                      {formatPrice(item.price)} смн
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700 active:scale-95 transition-transform"
                        type="button"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-lg bg-[#71bcf0] flex items-center justify-center text-white active:scale-95 transition-transform"
                        type="button"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Bottom Bar with Total and Checkout - INLINE (not fixed) */}
            <div className="bg-white rounded-3xl shadow-sm p-5 mb-20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Итого</span>
                <span className="font-bold text-xl text-gray-900">
                  {formatPrice(totalPrice)} смн
                </span>
              </div>

              <button 
                onClick={() => {
                  if (onCheckout) {
                    onCheckout();
                  }
                }}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-semibold hover:from-green-600 hover:to-green-700 active:scale-98 transition-all shadow-lg"
                type="button"
              >
                Оплатить
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
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
      `}</style>
    </div>
  );
}