import { useState, useEffect } from 'react';
import { Trash2, Minus, Plus, ChevronLeft } from 'lucide-react';

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

interface WebCartPageProps {
  onBack?: () => void;
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
  cartItems: CartItem[];
  onUpdateCart: (items: CartItem[]) => void;
  onCheckout?: () => void;
}

export function WebCartPage({ onBack, onWeatherClick, onLiveClick, cartItems: initialCartItems, onUpdateCart, onCheckout }: WebCartPageProps) {
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
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center justify-center hover:bg-gray-100 rounded-full p-2 transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" strokeWidth={2.5} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Корзина ({totalItems})
            </h1>
          </div>
          
          {cartItems.length > 0 && (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  console.log('=== Cart: Pay button clicked ===');
                  console.log('onCheckout exists?', !!onCheckout);
                  if (onCheckout) {
                    console.log('Calling onCheckout...');
                    onCheckout();
                  } else {
                    console.error('onCheckout is undefined!');
                  }
                }}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-bold text-base hover:from-green-600 hover:to-green-700 active:scale-[0.98] transition-all shadow-lg"
              >
                Оплатить {formatPrice(totalPrice)} смн
              </button>
              <button
                onClick={handleClearAll}
                className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
              >
                Очистить
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <Trash2 className="w-16 h-16 text-gray-300" />
            </div>
            <p className="text-xl text-gray-400 font-medium">Корзина пуста</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Cart Items Grid - 4 columns */}
            <div className="grid grid-cols-4 gap-6">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all"
                  style={{
                    animation: `fadeInUp 0.3s ease-out ${index * 0.05}s backwards`
                  }}
                >
                  {/* Image */}
                  <div className="relative w-full aspect-[4/3] bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all shadow-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
                      {item.category}
                    </p>
                    <h3 className="font-bold text-gray-900 text-xs mb-1 line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-[10px] text-gray-600 mb-2 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="text-[10px] text-gray-500 mb-2">
                      Дата: <span className="font-semibold text-gray-700">{item.date}</span>
                    </div>

                    {/* Price */}
                    <div className="mb-2 pb-2 border-b border-gray-100">
                      <span className="font-bold text-gray-900 text-base">
                        {formatPrice(item.price)} смн
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 active:scale-95 transition-all"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold text-base text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-lg bg-[#71bcf0] flex items-center justify-center text-white hover:bg-[#5da8d8] active:scale-95 transition-all shadow-md"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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