import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import Logo2 from '../../imports/Logo2';

interface WebFooterProps {
  onAboutClick?: () => void;
  onTariffsClick?: () => void;
  onHotelsClick?: () => void;
  onRestaurantClick?: () => void;
  onNewsClick?: () => void;
  onRentalClick?: () => void;
  onCableCarClick?: () => void;
  onIceRinkClick?: () => void;
  onSchoolClick?: () => void;
  onEntertainmentClick?: () => void;
}

export function WebFooter({
  onAboutClick,
  onTariffsClick,
  onHotelsClick,
  onRestaurantClick,
  onNewsClick,
  onRentalClick,
  onCableCarClick,
  onIceRinkClick,
  onSchoolClick,
  onEntertainmentClick
}: WebFooterProps) {
  return (
    <footer className="hidden lg:block bg-[#f8f9fa] text-gray-800 mt-24 border-t border-gray-200">
      <div className="max-w-[1400px] mx-auto px-8 py-16">
        <div className="grid grid-cols-4 gap-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="h-[58px] w-auto">
                <Logo2 />
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Современный горнолыжный курорт в живописных горах Таджикистана. Отдых для всей семьи круглый год.
            </p>
            
            {/* Social Media */}
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-gray-200 hover:bg-[#71bcf0] hover:text-white rounded-full flex items-center justify-center transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-200 hover:bg-[#71bcf0] hover:text-white rounded-full flex items-center justify-center transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-200 hover:bg-[#71bcf0] hover:text-white rounded-full flex items-center justify-center transition-all">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold mb-5 text-gray-900">Быстрые ссылки</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button className="text-gray-600 hover:text-[#71bcf0] transition-colors" onClick={onAboutClick}>О сафеддаре</button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-[#71bcf0] transition-colors" onClick={onTariffsClick}>Услуги</button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-[#71bcf0] transition-colors" onClick={onHotelsClick}>Гостиница</button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-[#71bcf0] transition-colors" onClick={onRestaurantClick}>Ресторан</button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-[#71bcf0] transition-colors" onClick={onNewsClick}>Новости</button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-base font-bold mb-5 text-gray-900">Услуги</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button className="text-gray-600 hover:text-[#71bcf0] transition-colors" onClick={onRentalClick}>Прокат снаряжения</button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-[#71bcf0] transition-colors" onClick={onCableCarClick}>Канатная дорога</button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-[#71bcf0] transition-colors" onClick={onIceRinkClick}>Каток</button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-[#71bcf0] transition-colors" onClick={onSchoolClick}>Школа катания</button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-[#71bcf0] transition-colors" onClick={onEntertainmentClick}>Развлечения</button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base font-bold mb-5 text-gray-900">Контакты</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 text-[#71bcf0]" />
                <div>
                  <p className="text-gray-600 font-medium">+992 37 224 00 00</p>
                  <p className="text-gray-500 text-xs mt-0.5">Ежедневно 8:00 - 20:00</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 text-[#71bcf0]" />
                <a href="mailto:info@safeddara.tj" className="text-gray-600 hover:text-[#71bcf0] transition-colors">
                  info@safeddara.tj
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-[#71bcf0]" />
                <p className="text-gray-600">
                  Варзобский район, Таджикистан
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-500">
              © 2026 Сафеддара. Все права защищены.
            </p>
            <p className="text-gray-500">
              Powered by{' '}
              <a 
                href="https://www.instagram.com/slm_technology/?hl=ru" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-[#71bcf0] hover:text-[#4fa8e0] transition-colors cursor-pointer"
              >
                SLMTECH
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}