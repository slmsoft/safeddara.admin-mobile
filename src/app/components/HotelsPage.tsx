import { useState, useEffect } from 'react';
import { ChevronLeft, MapPin, Users } from 'lucide-react';
import { ModernHeader } from './ModernHeader';
import { usePageScroll } from '../hooks/usePageScroll';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { FavoriteIcon } from './ProfileIcons';
import { backendApi, type Accommodation } from '../../api/backendApi';
import cottageImage from '../../assets/67efe2a08cddf9fa1b091ced4088929ef5af6c58.png';
import hotelRoomImage from '../../assets/25c317e42bf5f261055669edb14cc195cf786636.png';

function accommodationToItem(a: Accommodation): AccommodationItem {
  return {
    id: a.id,
    title: a.title,
    capacity: a.capacity,
    price: a.pricePerNight,
    images: a.images?.length ? a.images : [cottageImage],
  };
}

interface HotelsPageProps {
  onWeatherClick?: () => void;
  onLiveClick?: () => void;
  onBack?: () => void;
  onRoomSelect?: (room: any) => void;
  favorites?: string[];
  onToggleFavorite?: (itemId: string, item: AccommodationItem) => void;
  initialTab?: TabType;
}

type TabType = 'all' | 'safedara' | 'cottages' | 'hotel';

interface AccommodationItem {
  id: string;
  title: string;
  capacity: number;
  price: number;
  images: string[];
}

export function HotelsPage({ onWeatherClick, onLiveClick, onBack, onRoomSelect, favorites, onToggleFavorite, initialTab = 'all' }: HotelsPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [apiAccommodations, setApiAccommodations] = useState<AccommodationItem[] | null>(null);
  const [apiByType, setApiByType] = useState<{ cottage: AccommodationItem[]; safedara_room: AccommodationItem[]; hotel_room: AccommodationItem[] } | null>(null);
  const { containerRef } = usePageScroll('hotels-page');

  useEffect(() => {
    backendApi.getAccommodations()
      .then((res) => {
        if (res.success && res.data?.accommodations) {
          const items = res.data.accommodations.map(accommodationToItem);
          setApiAccommodations(items);
          const byType = {
            cottage: res.data.accommodations.filter((a) => a.type === 'cottage').map(accommodationToItem),
            safedara_room: res.data.accommodations.filter((a) => a.type === 'safedara_room').map(accommodationToItem),
            hotel_room: res.data.accommodations.filter((a) => a.type === 'hotel_room').map(accommodationToItem),
          };
          setApiByType(byType);
        }
      })
      .catch((err) => console.warn('Backend accommodations load failed:', err));
  }, []);

  const cottages: AccommodationItem[] = [
    {
      id: 'cottage-1',
      title: 'Деревянный дом',
      capacity: 4,
      price: 3100,
      images: [
        cottageImage,
        'https://images.unsplash.com/photo-1760627592973-ebfaa06ec117?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjb3R0YWdlJTIwZXh0ZXJpb3J8ZW58MXx8fHwxNzY3Njk4NzI5fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1711145131270-af8729518404?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0YWdlJTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3Njc2OTg3Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080'
      ]
    },
    {
      id: 'cottage-2',
      title: 'Деревянный дом',
      capacity: 6,
      price: 4200,
      images: [
        cottageImage,
        'https://images.unsplash.com/photo-1760627592973-ebfaa06ec117?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjb3R0YWdlJTIwZXh0ZXJpb3J8ZW58MXx8fHwxNzY3Njk4NzI5fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1711145131270-af8729518404?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0YWdlJTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3Njc2OTg3Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080'
      ]
    },
    {
      id: 'cottage-3',
      title: 'Двухэтажный деревянный дом',
      capacity: 7,
      price: 7300,
      images: [
        cottageImage,
        'https://images.unsplash.com/photo-1760627592973-ebfaa06ec117?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjb3R0YWdlJTIwZXh0ZXJpb3J8ZW58MXx8fHwxNzY3Njk4NzI5fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1711145131270-af8729518404?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0YWdlJTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3Njc2OTg3Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080'
      ]
    },
    {
      id: 'cottage-4',
      title: 'Двухэтажный деревянный дом',
      capacity: 9,
      price: 9400,
      images: [
        cottageImage,
        'https://images.unsplash.com/photo-1760627592973-ebfaa06ec117?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjb3R0YWdlJTIwZXh0ZXJpb3J8ZW58MXx8fHwxNzY3Njk4NzI5fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1711145131270-af8729518404?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0YWdlJTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3Njc2OTg3Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080'
      ]
    },
    {
      id: 'cottage-5',
      title: 'Коттеджна',
      capacity: 8,
      price: 3700,
      images: [
        cottageImage,
        'https://images.unsplash.com/photo-1760627592973-ebfaa06ec117?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjb3R0YWdlJTIwZXh0ZXJpb3J8ZW58MXx8fHwxNzY3Njk4NzI5fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1711145131270-af8729518404?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0YWdlJTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3Njc2OTg3Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080'
      ]
    }
  ];

  const safedaraRooms: AccommodationItem[] = [
    {
      id: 'safedara-1',
      title: 'Однокомнатный гостиничный номер',
      capacity: 2,
      price: 950,
      images: [
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzY3NjYwNzI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1572177215152-32f247303126?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMGJлдрvb218ZW58MXx8fHwxNzY3NjY0OTcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1663659505016-d358722c06c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGJhdGhyb29tJTIwbHV4dXJ5fGVufDF8fHx8MTc2NzU5MTk2MHww&ixlib=rb-4.1.0&q=80&w=1080'
      ]
    },
    {
      id: 'safedara-2',
      title: 'Двухкомнатный гостинечный номер',
      capacity: 2,
      price: 1150,
      images: [
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzY3NjYwNzI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1662841540530-2f04bb3291e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHN1aXRlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY3NTk0MjQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1572177215152-32f247303126?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMGJлдрvb218ZW58MXx8fHwxNzY3NjY0OTcxfDA&ixlib=rb-4.1.0&q=80&w=1080'
      ]
    },
    {
      id: 'safedara-3',
      title: 'Трехкомнатный гостиничный номер',
      capacity: 4,
      price: 1400,
      images: [
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzY3NjYwNzI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1662841540530-2f04bb3291e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHN1aXRlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY3NTk0MjQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1663659505016-d358722c06c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGJhdGhyb29tJTIwbHV4dXJ5fGVufDF8fHx8MTc2NzU5MTk2MHww&ixlib=rb-4.1.0&q=80&w=1080'
      ]
    },
    {
      id: 'safedara-4',
      title: 'Семейный трехкомнатный номер',
      capacity: 5,
      price: 2400,
      images: [
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzY3NjYwNzI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1572177215152-32f247303126?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMGJлдрvb218ZW58MXx8fHwxNzY3NjY0OTcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1662841540530-2f04bb3291e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHN1aXRlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY3NTk0MjQxfDA&ixlib=rb-4.1.0&q=80&w=1080'
      ]
    },
    {
      id: 'safedara-5',
      title: 'Семейный пятикомнатный номер',
      capacity: 8,
      price: 3200,
      images: [
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzY3NjYwNzI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1662841540530-2f04bb3291e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHN1aXRlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY3NTk0MjQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1572177215152-32f247303126?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMGJлдрvb218ZW58MXx8fHwxNzY3NjY0OTcxfDA&ixlib=rb-4.1.0&q=80&w=1080'
      ]
    }
  ];

  const hotelRooms: AccommodationItem[] = [
    {
      id: 'hotel-1',
      title: 'Однокомнатный гостиничный номер',
      capacity: 2,
      price: 650,
      images: [
        hotelRoomImage,
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzY3NjYwNzI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1572177215152-32f247303126?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMGJлдрvb218ZW58MXx8fHwxNzY3NjY0OTcxfDA&ixlib=rb-4.1.0&q=80&w=1080'
      ]
    },
    {
      id: 'hotel-2',
      title: 'Однокомнатный гостиничный номер',
      capacity: 4,
      price: 950,
      images: [
        hotelRoomImage,
        'https://images.unsplash.com/photo-1572177215152-32f247303126?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMGJлдрvb218ZW58MXx8fHwxNzY3NjY0OTcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1662841540530-2f04bb3291e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHN1aXRlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY3NTk0MjQxfDA&ixlib=rb-4.1.0&q=80&w=1080'
      ]
    },
    {
      id: 'hotel-3',
      title: 'СПА услуги VIP (1 час)',
      capacity: 6,
      price: 450,
      images: [
        hotelRoomImage,
        'https://images.unsplash.com/photo-1663659505016-d358722c06c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGJhdGhyb29tJTIwbHV4dXJ5fGVufDF8fHx8MTc2NzU5MTk2MHww&ixlib=rb-4.1.0&q=80&w=1080',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzY3NjYwNzI3fDA&ixlib=rb-4.1.0&q=80&w=1080'
      ]
    }
  ];

  const getCurrentItems = (): AccommodationItem[] => {
    const fromApi = apiByType && (apiAccommodations?.length ?? 0) > 0;
    if (fromApi && apiByType) {
      switch (activeTab) {
        case 'all':
          return apiAccommodations ?? [];
        case 'cottages':
          return apiByType.cottage;
        case 'safedara':
          return apiByType.safedara_room;
        case 'hotel':
          return apiByType.hotel_room;
        default:
          return apiAccommodations ?? [];
      }
    }
    switch (activeTab) {
      case 'all':
        return [...cottages, ...safedaraRooms, ...hotelRooms];
      case 'cottages':
        return cottages;
      case 'safedara':
        return safedaraRooms;
      case 'hotel':
        return hotelRooms;
      default:
        return cottages;
    }
  };

  const tabs = [
    { id: 'all' as TabType, label: 'ВСЕ' },
    { id: 'safedara' as TabType, label: 'ГОСТИНИЦА SAFEDARA' },
    { id: 'cottages' as TabType, label: 'КОТТЕДЖИ' },
    { id: 'hotel' as TabType, label: 'ОТЕЛЬ' }
  ];

  // Auto-advance slideshow ONLY for hovered item
  useEffect(() => {
    if (!hoveredItemId) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const item = getCurrentItems().find(i => i.id === hoveredItemId);
        if (!item) return prev;
        
        const currentIndex = prev[hoveredItemId] || 0;
        const nextIndex = (currentIndex + 1) % item.images.length;
        
        return {
          ...prev,
          [hoveredItemId]: nextIndex
        };
      });
    }, 2000); // Change image every 2 seconds

    return () => clearInterval(interval);
  }, [hoveredItemId]);

  const handleDotClick = (itemId: string, dotIndex: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [itemId]: dotIndex
    }));
  };

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-0 w-full overflow-x-hidden">
      <ModernHeader onWeatherClick={onWeatherClick} onLiveClick={onLiveClick} />
      
      {/* Page Header with Tabs - Mobile */}
      <div className="lg:hidden w-full overflow-x-hidden">
        {/* Header Row with Back Button and Title */}
        <div className="w-full max-w-[402px] mx-auto px-5 pt-5 pb-3 box-border">
          <div className="flex items-center gap-3 w-full">
            {/* Back Button */}
            <button
              onClick={() => onBack && onBack()}
              className="transition-all active:scale-95 flex-shrink-0"
              type="button"
            >
              <ChevronLeft className="w-6 h-6 text-[#71bcf0]" />
            </button>
            
            {/* Title */}
            <h1 className="text-base font-semibold text-gray-900 flex-shrink-0">Гостиница</h1>
          </div>
        </div>

        {/* All Tabs in ONE row with horizontal scroll — выравнивание с карточками */}
        <div className="w-full max-w-[402px] mx-auto px-5 pb-3 overflow-x-hidden box-border">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0
                  transition-all duration-300
                  ${activeTab === tab.id
                    ? 'bg-[#71bcf0] text-white shadow-lg'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#71bcf0]'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block w-full">
        <div className="max-w-[1400px] mx-auto px-8 w-full">
          <div className="flex items-center gap-3 py-8 w-full">
            <button
              onClick={onBack}
              className="flex items-center justify-center text-gray-600 hover:text-[#71bcf0] transition-colors flex-shrink-0"
            >
              <ChevronLeft className="w-7 h-7" strokeWidth={2} />
            </button>
            <h1 className="text-4xl font-bold text-gray-900">Гостиница</h1>
          </div>
        </div>

        {/* Desktop Tabs — выравнивание с карточками */}
        <div className="px-8 py-4 w-full overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto flex gap-2 w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                  transition-all duration-300
                  ${activeTab === tab.id
                    ? 'bg-[#71bcf0] text-white shadow-lg'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#71bcf0]'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content - Mobile: 1 column, Desktop: 4 columns */}
      <div className="w-full max-w-[402px] lg:max-w-[1400px] mx-auto overflow-x-hidden">
        <div className="px-5 lg:px-8 py-6 lg:py-8 w-full box-border" ref={containerRef}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 w-full">
            {getCurrentItems().map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 w-full"
                style={{
                  animation: `fadeInUp 0.4s ease-out ${index * 0.1}s backwards`
                }}
                onMouseEnter={() => setHoveredItemId(item.id)}
                onMouseLeave={() => setHoveredItemId(null)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden w-full">
                  <ImageWithFallback
                    src={item.images[currentImageIndex[item.id] || 0]}
                    alt={item.title}
                    className="w-full h-full object-cover transition-opacity duration-500"
                  />
                  
                  {/* Favorite button - moved to right */}
                  <button
                    className="absolute top-3 right-3 hover:scale-110 transition-transform z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite?.(item.id, item);
                    }}
                  >
                    <FavoriteIcon 
                      className={`w-7 h-7 transition-all drop-shadow-lg ${ 
                        favorites?.includes(item.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'fill-white text-white'
                      }`} 
                    />
                  </button>
                  
                  {/* Capacity badge - moved to left */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-md">
                    <Users className="w-4 h-4 text-[#71bcf0]" />
                    <span className="text-sm font-semibold text-gray-700">{item.capacity}</span>
                  </div>
                  
                  {/* Slideshow dots - only show if more than 1 image */}
                  {item.images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {item.images.map((_, dotIndex) => (
                        <button
                          key={dotIndex}
                          onClick={() => handleDotClick(item.id, dotIndex)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            (currentImageIndex[item.id] || 0) === dotIndex
                              ? 'bg-white w-6'
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                          aria-label={`Изображение ${dotIndex + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 w-full box-border">
                  <h3 className="text-base font-bold text-gray-900 mb-3 break-words">{item.title}</h3>
                  
                  <div className="flex items-center justify-between gap-2 w-full">
                    <div className="flex flex-col flex-shrink-0 min-w-0">
                      <span className="text-xs text-gray-500 mb-1">Цена за ночь</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-[#71bcf0]">
                          {item.price.toLocaleString('ru-RU')}
                        </span>
                        <span className="text-sm text-gray-600">смн</span>
                      </div>
                    </div>
                    
                    <button
                      className="px-4 lg:px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold text-xs lg:text-sm hover:shadow-lg transition-all duration-300 hover:scale-105 flex-shrink-0 whitespace-nowrap"
                      onClick={() => onRoomSelect && onRoomSelect({
                        id: item.id,
                        name: item.title,
                        category: activeTab === 'cottages' ? 'Коттеджи' : activeTab === 'safedara' ? 'Гостиница Safedara' : 'Отель',
                        area: activeTab === 'cottages' ? 80 : 45,
                        beds: item.capacity,
                        price: item.price,
                        image: item.images?.[0] || '',
                        images: item.images?.length ? item.images : undefined
                      })}
                    >
                      Забронировать
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}