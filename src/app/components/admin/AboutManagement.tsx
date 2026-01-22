import { useState } from 'react';
import { Info, Save, MapPin, Phone, Mail, Globe } from 'lucide-react';

interface AboutData {
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  openingTime: string;
  closingTime: string;
}

export function AboutManagement() {
  const [aboutData, setAboutData] = useState<AboutData>({
    description: 'Горнолыжный курорт Сафеддара - это современный горнолыжный комплекс, расположенный в живописных горах Таджикистана. Курорт предлагает первоклассные условия для катания на лыжах и сноуборде, а также широкий спектр дополнительных услуг: от комфортабельного размещения до изысканной кухни в ресторанах.',
    address: 'Горы Сафеддара, Таджикистан',
    phone: '+992 123 456 789',
    email: 'info@safedara.tj',
    website: 'https://safedara.tj',
    openingTime: '08:00',
    closingTime: '22:00'
  });

  const handleSave = () => {
    alert('Изменения сохранены!');
    // Здесь будет сохранение данных
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#161b2e] border border-[#1e2537] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center">
            <Info className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-200">О курорте Сафеддара</h2>
            <p className="text-sm text-gray-400">Информация о курорте и контакты</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0d1117] border border-[#1e2537] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Описание</h3>
            <textarea
              value={aboutData.description}
              onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
              className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg p-4 text-gray-300 min-h-[200px] focus:outline-none focus:border-blue-500"
              placeholder="Описание курорта..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0d1117] border border-[#1e2537] rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <h4 className="text-sm font-semibold text-gray-200">Адрес</h4>
              </div>
              <input
                type="text"
                value={aboutData.address}
                onChange={(e) => setAboutData({ ...aboutData, address: e.target.value })}
                className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg p-3 text-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="Адрес курорта"
              />
            </div>

            <div className="bg-[#0d1117] border border-[#1e2537] rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <h4 className="text-sm font-semibold text-gray-200">Телефон</h4>
              </div>
              <input
                type="text"
                value={aboutData.phone}
                onChange={(e) => setAboutData({ ...aboutData, phone: e.target.value })}
                className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg p-3 text-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="+992 123 456 789"
              />
            </div>

            <div className="bg-[#0d1117] border border-[#1e2537] rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <h4 className="text-sm font-semibold text-gray-200">Email</h4>
              </div>
              <input
                type="email"
                value={aboutData.email}
                onChange={(e) => setAboutData({ ...aboutData, email: e.target.value })}
                className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg p-3 text-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="info@safedara.tj"
              />
            </div>

            <div className="bg-[#0d1117] border border-[#1e2537] rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-5 h-5 text-blue-400" />
                <h4 className="text-sm font-semibold text-gray-200">Сайт</h4>
              </div>
              <input
                type="url"
                value={aboutData.website}
                onChange={(e) => setAboutData({ ...aboutData, website: e.target.value })}
                className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg p-3 text-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="https://safedara.tj"
              />
            </div>
          </div>

          <div className="bg-[#0d1117] border border-[#1e2537] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Часы работы</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Открытие</label>
                <input 
                  type="time" 
                  value={aboutData.openingTime}
                  onChange={(e) => setAboutData({ ...aboutData, openingTime: e.target.value })}
                  className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg p-3 text-gray-300 focus:outline-none focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Закрытие</label>
                <input 
                  type="time" 
                  value={aboutData.closingTime}
                  onChange={(e) => setAboutData({ ...aboutData, closingTime: e.target.value })}
                  className="w-full bg-[#161b2e] border border-[#1e2537] rounded-lg p-3 text-gray-300 focus:outline-none focus:border-blue-500" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-[#1e2537] flex justify-end">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  );
}
