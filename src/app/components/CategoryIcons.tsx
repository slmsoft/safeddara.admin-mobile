import { useState, useRef } from 'react';
import { Info, MapPin } from 'lucide-react';
import { ServicesIcon } from './icons/ServicesIcon';
import { RentalIcon } from './icons/RentalIcon';
import { RestaurantIcon } from './icons/RestaurantIcon';
import { EntertainmentIcon } from './icons/EntertainmentIcon';
import { HotelIcon } from './icons/HotelIcon';

interface CategoryIconsProps {
  onCategoryClick?: (category: string) => void;
}

const categories = [
  { id: 1, name: 'Услуги', icon: ServicesIcon },
  { id: 2, name: 'Ресторан', icon: RestaurantIcon },
  { id: 3, name: 'Прокат', icon: RentalIcon },
  { id: 7, name: 'Гостиницы', icon: HotelIcon },
  { id: 5, name: 'О сафеддаре', icon: Info },
  { id: 6, name: 'Адрес', icon: MapPin },
  { id: 4, name: 'Развлечение', icon: EntertainmentIcon },
];

export function CategoryIcons({ onCategoryClick }: CategoryIconsProps) {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Скорость скролла
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleCategoryClick = (categoryId: number, categoryName: string) => {
    setActiveCategory(categoryId);
    
    // Use onCategoryClick if provided (from home page)
    if (onCategoryClick) {
      onCategoryClick(categoryName);
      return;
    }
  };

  return (
    <div className="mt-6 overflow-hidden">
      {/* Horizontal scrollable container on mobile, grid on desktop */}
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`overflow-x-scroll lg:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-1 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} lg:cursor-default`}
      >
        <div className="flex lg:grid lg:grid-cols-6 gap-4 pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id, category.name)}
                className={`group flex flex-col items-center gap-3 transition-all hover:scale-105 active:scale-95 flex-shrink-0 w-[110px] lg:w-[120px] p-5 rounded-2xl border-2 ${
                  isActive 
                    ? 'border-[#71bcf0] bg-white shadow-md' 
                    : 'border-gray-200 bg-white hover:border-[#71bcf0]/50 hover:shadow-sm'
                }`}
                type="button"
              >
                {/* Icon - без круглого фона */}
                <Icon 
                  className={`w-9 h-9 lg:w-10 lg:h-10 group-hover:scale-110 transition-all duration-300 ${
                    isActive ? 'text-[#71bcf0]' : 'text-[#71bcf0]'
                  }`}
                  strokeWidth={2} 
                />

                {/* Label */}
                <span className={`text-sm font-semibold text-center leading-tight whitespace-nowrap transition-colors duration-300 ${
                  isActive ? 'text-gray-600' : 'text-gray-500 group-hover:text-gray-600'
                }`}>
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}