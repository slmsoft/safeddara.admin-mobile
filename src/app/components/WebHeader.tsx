import { Search, ShoppingCart, User, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import Logo2 from '../../imports/Logo2';
import imgImage3 from "../../assets/ebae83f33e4d2f058e97a8ff6bbe791f72edd7e0.png";
import imgImage4 from "../../assets/fcfce042201db85d1fd639b173bba9d37b60e35c.png";

interface WebHeaderProps {
  onWeatherClick: () => void;
  onLiveClick: () => void;
  onCartClick: () => void;
  onProfileClick: () => void;
  onMenuClick: () => void;
  onLogoClick?: () => void;
  cartItemsCount?: number;
  onAboutClick?: () => void;
  onTariffsClick?: () => void;
  onNewsClick?: () => void;
  onServicesClick?: () => void;
  currentPage?: string;
  onFavoritesClick?: () => void;
  favoritesCount?: number;
}

export function WebHeader({ 
  onWeatherClick, 
  onLiveClick, 
  onCartClick, 
  onProfileClick,
  onLogoClick,
  cartItemsCount = 0,
  onAboutClick,
  onTariffsClick,
  onNewsClick,
  onServicesClick,
  currentPage = 'home',
  onFavoritesClick,
  favoritesCount = 0
}: WebHeaderProps) {
  return (
    <header className="hidden lg:block bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-8 h-[72px] flex items-center justify-between">
        {/* Left - Logo and Nav Links */}
        <div className="flex items-center gap-12">
          {/* Logo - Safeddara Logo - Home Button */}
          <motion.button
            onClick={() => onLogoClick && onLogoClick()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center h-12 w-auto cursor-pointer transition-all"
            type="button"
          >
            <Logo2 />
          </motion.button>

          {/* Nav Links */}
          <nav className="flex items-center gap-6">
            <motion.button
              onClick={() => onWeatherClick && onWeatherClick()}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-sky-50 px-3 py-1.5 rounded-full border border-blue-100 shadow-sm hover:shadow-md transition-all"
              type="button"
            >
              <div className="w-4 h-4">
                <img alt="weather" className="w-full h-full object-cover" src={imgImage3} />
              </div>
              <span className="text-sm font-medium text-gray-700">25°C</span>
            </motion.button>

            <motion.button
              onClick={() => onLiveClick && onLiveClick()}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-gradient-to-r from-red-50 to-pink-50 px-3 py-1.5 rounded-full border border-red-100 shadow-sm hover:shadow-md transition-all"
              type="button"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <div className="flex-none rotate-180 scale-y-[-100%]">
                  <img alt="live" className="w-4 h-4 object-cover" src={imgImage4} />
                </div>
              </div>
              <span className="text-sm font-semibold text-red-500">LIVE</span>
            </motion.button>

            <button 
              className={`text-sm transition-colors relative ${
                currentPage === 'about' 
                  ? 'text-[#71bcf0] font-semibold' 
                  : 'text-gray-600 hover:text-[#71bcf0]'
              }`}
              onClick={() => onAboutClick && onAboutClick()}
              type="button"
            >
              О сафеддаре
              {currentPage === 'about' && (
                <div className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-[#71bcf0]" />
              )}
            </button>

            <button 
              className={`text-sm transition-colors relative ${
                currentPage === 'tariffs' 
                  ? 'text-[#71bcf0] font-semibold' 
                  : 'text-gray-600 hover:text-[#71bcf0]'
              }`}
              onClick={() => onServicesClick && onServicesClick()}
              type="button"
            >
              Услуги
              {currentPage === 'tariffs' && (
                <div className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-[#71bcf0]" />
              )}
            </button>

            <button 
              className={`text-sm transition-colors relative ${
                currentPage === 'news' 
                  ? 'text-[#71bcf0] font-semibold' 
                  : 'text-gray-600 hover:text-[#71bcf0]'
              }`}
              onClick={() => onNewsClick && onNewsClick()}
              type="button"
            >
              Новости
              {currentPage === 'news' && (
                <div className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-[#71bcf0]" />
              )}
            </button>
          </nav>
        </div>

        {/* Right - Icons */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-gray-600 hover:text-[#71bcf0] hover:bg-gray-50 rounded-lg transition-all"
          >
            <Search className="w-5 h-5" />
          </motion.button>

          {/* Profile */}
          <motion.button
            onClick={() => onProfileClick && onProfileClick()}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-gray-600 hover:text-[#71bcf0] hover:bg-gray-50 rounded-lg transition-all"
            type="button"
          >
            <User className="w-5 h-5" />
          </motion.button>

          {/* Cart */}
          <motion.button
            onClick={() => onCartClick && onCartClick()}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-2 text-gray-600 hover:text-[#71bcf0] hover:bg-gray-50 rounded-lg transition-all"
            type="button"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {cartItemsCount}
              </span>
            )}
          </motion.button>

          {/* Favorites */}
          <motion.button
            onClick={() => onFavoritesClick && onFavoritesClick()}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-2 text-gray-600 hover:text-[#71bcf0] hover:bg-gray-50 rounded-lg transition-all"
            type="button"
          >
            <Heart className="w-5 h-5" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {favoritesCount}
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
}