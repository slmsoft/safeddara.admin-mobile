import { ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import imgStop from "../../assets/7753130ac9e68f2c0cdf2ce05a14aa9a5b45cbf6.png";
import imgOvertake from "../../assets/eaacd43a64c93ad922b6d2aebf3a0fe989bd52e9.png";
import imgStart from "../../assets/eaacd43a64c93ad922b6d2aebf3a0fe989bd52e9.png";
import imgSpeed from "../../assets/ee14e275c62b39c858dbd0fecd0ff2177234675f.png";
import imgRespect from "../../assets/5ff6b2125d1466215713a39a20a3a12e3b730fe9.png";
import imgTrajectory from "../../assets/699653789b9822158faa81dd1b8e9f4c99cd6f66.png";
import imgHelp from "../../assets/016c404bb7bc5115f57c6bea45e50ecab2e7ef0e.png";
import imgSigns from "../../assets/66071ca029e0e7fd23b1e8bee7a92f6c91217af3.png";
import imgID from "../../assets/d1aa749bdfba7a4e3916b72d39dc04b4f849ed49.png";

interface RulesPageProps {
  onBack?: () => void;
}

interface Rule {
  title: string;
  description: string[];
  image: string;
}

export function RulesPage({ onBack }: RulesPageProps) {
  const allRules: Rule[] = [
    {
      title: 'Остановка на склоне',
      description: [
        'Если вы решили остановиться на склоне, делайте это на краю трассы, где вас хорошо видно.',
        'Не останавливайтесь в узких местах и за перегибами, где вас не видно.'
      ],
      image: imgStop
    },
    {
      title: 'Обгон',
      description: [
        'При обгоне оставляйте достаточно места обгоняемому для маневра.',
        'Обгоняемый имеет преимущество.'
      ],
      image: imgOvertake
    },
    {
      title: 'Начало движения',
      description: [
        'При начале движения или въезде на трассу убедитесь, что это безопасно для вас и окружающих.',
        'Преимущество у тех, кто уже движется по склону.'
      ],
      image: imgStart
    },
    {
      title: 'Скорость',
      description: [
        'Выбирайте скорость в зависимости от обстановки на склоне.',
        'В туман и при большом количестве людей спускайтесь аккуратно.',
        'Не «подрезайте» других.'
      ],
      image: imgSpeed
    },
    {
      title: 'Уважайте окружающих',
      description: [
        'Не подвергайте риску других и не наносите вреда ни своим поведением, ни своим снаряжением.',
        'Выбирайте трассы, соответствующие вашему уровню катания.',
        'Соблюдайте очереди на подъемниках.'
      ],
      image: imgRespect
    },
    {
      title: 'Траектория движения',
      description: [
        'Вы ответственны за тех, кто ниже вас по склону.',
        'Выбирайте такую траекторию движения, которая не помешает движению тех, кто находится ниже по склону.'
      ],
      image: imgTrajectory
    },
    {
      title: 'Помогите пострадавшему',
      description: [
        'При несчастном случае вы обязаны оказать помощь пострадавшему.',
        'Вызовите спасателей и обозначьте место происшествия.',
        'Не покидайте место происшествия без необходимости.'
      ],
      image: imgHelp
    },
    {
      title: 'Соблюдайте знаки и разметку',
      description: [
        'Соблюдайте знаки, разметку и указатели на склоне.',
        'Они предупреждают об опасности и помогают ориентироваться на трассе.',
        'Катайтесь только на открытых трассах.'
      ],
      image: imgSigns
    },
    {
      title: 'Имейте при себе удостоверение',
      description: [
        'Все участники, причастные к инциденту, должны предъявить свои данные.',
        'Имейте при себе документы, удостоверяющие личность.',
        'Будьте готовы оказать содействие спасательной службе.'
      ],
      image: imgID
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => onBack && onBack()}
            className="transition-all active:scale-95"
            type="button"
          >
            <ChevronLeft className="w-6 h-6 text-[#71bcf0]" />
          </button>
          
          <h1 className="text-lg font-semibold text-gray-900">Правила FIS</h1>
          
          <div className="w-10" />
        </div>
      </div>

      {/* Desktop Content */}
      <div className="hidden lg:block">
        <div className="max-w-[1400px] mx-auto px-8 py-12">
          {/* Back Button and Title */}
          <div className="mb-12">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </div>
              <span className="font-medium">Назад</span>
            </button>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Правила FIS</h1>
            <p className="text-lg text-gray-600">Международные правила поведения на горнолыжных склонах</p>
          </div>

          {/* Rules Grid - 4 Columns */}
          <div className="grid grid-cols-4 gap-6">
            {allRules.map((rule, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                {/* Rule Image */}
                <div className="w-full bg-white p-6">
                  <img
                    src={rule.image}
                    alt={rule.title}
                    className="w-full h-56 object-contain"
                  />
                </div>

                {/* Rule Content */}
                <div className="px-6 pb-6 space-y-3">
                  <h3 className="font-bold text-lg text-gray-900">
                    {rule.title}
                  </h3>

                  <div className="space-y-2">
                    {rule.description.map((line, idx) => (
                      <p key={idx} className="text-sm text-gray-600 leading-relaxed">
                        • {line}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="lg:hidden px-4 pt-6 pb-20">
        {/* Rules List */}
        <div className="space-y-6">
          {allRules.map((rule, index) => (
            <div key={index} className="bg-white rounded-2xl overflow-hidden border border-gray-300 shadow-sm">
              {/* Rule Image */}
              <div className="w-full bg-gray-50">
                <img
                  src={rule.image}
                  alt={rule.title}
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Rule Content */}
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-gray-900">
                  {rule.title}
                </h3>

                <div className="space-y-1">
                  {rule.description.map((line, idx) => (
                    <p key={idx} className="text-sm text-gray-600 leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}