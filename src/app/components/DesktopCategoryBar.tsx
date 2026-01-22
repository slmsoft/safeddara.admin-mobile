import { motion } from 'motion/react';
import { Info, MapPin } from 'lucide-react';
import { ServicesIcon } from './icons/ServicesIcon';
import { RentalIcon } from './icons/RentalIcon';
import { RestaurantIcon } from './icons/RestaurantIcon';
import { EntertainmentIcon } from './icons/EntertainmentIcon';
import { HotelIcon } from './icons/HotelIcon';

interface DesktopCategoryBarProps {
  onCategoryClick: (category: string) => void;
}

const categories = [
  { id: 'services', label: 'Услуги', icon: ServicesIcon },
  { id: 'restaurant', label: 'Ресторан', icon: RestaurantIcon },
  { id: 'rental', label: 'Прокат', icon: RentalIcon },
  { id: 'hotels', label: 'Гостиницы', icon: HotelIcon },
  { id: 'about', label: 'О сафеддаре', icon: Info },
  { id: 'address', label: 'Адрес', icon: MapPin },
  { id: 'entertainment', label: 'Развлечение', icon: EntertainmentIcon },
];

export function DesktopCategoryBar({ onCategoryClick }: DesktopCategoryBarProps) {
  return (
    <div className="hidden lg:block bg-white py-8 border-b border-gray-100">
      <div className="w-full px-12">
        <div className="flex items-center justify-between">
          {categories.map((category) => {
            const Icon = category.icon;
            
            return (
              <motion.button
                key={category.id}
                onClick={() => onCategoryClick(category.id)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="group flex flex-col items-center gap-3 w-[130px] p-5 rounded-2xl border-2 border-gray-200 bg-white hover:border-[#71bcf0]/50 hover:shadow-md transition-all duration-300"
              >
                {/* Icon - без круглого фона */}
                <Icon className="w-9 h-9 text-[#71bcf0]" strokeWidth={1.5} />
                <span className="text-sm text-gray-500 font-medium text-center whitespace-nowrap group-hover:text-gray-600 transition-colors">
                  {category.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}