import { ChevronLeft, Plus } from 'lucide-react';

interface InsurancePageProps {
  onBack?: () => void;
}

export function InsurancePage({ onBack }: InsurancePageProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10">
        <div className="px-5 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onBack && onBack()}
              className="transition-all active:scale-95"
              type="button"
            >
              <ChevronLeft className="w-6 h-6 text-[#71bcf0]" />
            </button>
            <h1 className="font-bold text-gray-900">Данные для страхования</h1>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-32">
        <h2 className="font-bold text-gray-900 mb-2 text-center">
          Список пуст :(
        </h2>
        <p className="text-sm text-gray-500 text-center leading-relaxed">
          Добавьте данные, чтобы застраховать<br />
          здоровье во время катания.
        </p>
      </div>

      {/* Fixed Bottom Button */}
      <div className="sticky bottom-0 px-5 pb-8 pt-4 bg-white">
        <button className="w-full bg-[#2C3E50] text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-[#34495e] transition-colors shadow-lg">
          <Plus className="w-5 h-5" />
          Добавить карту
        </button>
      </div>
    </div>
  );
}
