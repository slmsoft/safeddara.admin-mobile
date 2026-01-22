import { useState } from 'react';
import { ChevronLeft, Sun, Wind, Droplets, Maximize, Volume2, SkipBack, SkipForward, Play, Pause, PictureInPicture } from 'lucide-react';
// Image not found in assets, using placeholder
const imgBannerAd = "https://via.placeholder.com/400x200?text=Banner";

interface CamerasPageProps {
  onBack?: () => void;
}

interface Camera {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl?: string;
}

export function CamerasPage({ onBack }: CamerasPageProps) {
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const cameras: Camera[] = [
    {
      id: '1',
      title: 'Базовая станция',
      thumbnail: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80',
      videoUrl: 'https://example.com/stream1'
    },
    {
      id: '2',
      title: 'Средняя станция',
      thumbnail: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800&q=80',
      videoUrl: 'https://example.com/stream2'
    },
    {
      id: '3',
      title: 'Верхняя станция',
      thumbnail: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80',
      videoUrl: 'https://example.com/stream3'
    },
    {
      id: '4',
      title: 'Kids Club',
      thumbnail: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80',
      videoUrl: 'https://example.com/stream4'
    }
  ];

  // Default selected camera for desktop
  const defaultCamera = selectedCamera || cameras[0];

  if (selectedCamera) {
    const currentIndex = cameras.findIndex(c => c.id === selectedCamera.id);
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < cameras.length - 1;

    const goToPrevious = () => {
      if (hasPrevious) {
        setSelectedCamera(cameras[currentIndex - 1]);
        setIsPlaying(false);
      }
    };

    const goToNext = () => {
      if (hasNext) {
        setSelectedCamera(cameras[currentIndex + 1]);
        setIsPlaying(false);
      }
    };

    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setSelectedCamera(null)}
              className="flex items-center justify-center transition-all z-10"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            
            <h1 className="absolute left-0 right-0 text-center text-base font-semibold text-gray-900 pointer-events-none">{selectedCamera.title}</h1>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative bg-black">
          {/* Navigation Arrows */}
          {hasPrevious && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}
          
          {hasNext && (
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform"
            >
              <ChevronLeft className="w-6 h-6 text-white rotate-180" />
            </button>
          )}

          {/* Controls Top */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
            <button className="w-10 h-10 rounded-lg bg-gray-800/80 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform">
              <Maximize className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 rounded-lg bg-gray-800/80 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform">
              <Volume2 className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Video Container */}
          <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
            <img
              src={selectedCamera.thumbnail}
              alt={selectedCamera.title}
              className="w-full h-full object-cover"
            />
            
            {/* Play/Pause Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center active:scale-95 transition-transform shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-gray-900" />
                ) : (
                  <Play className="w-8 h-8 text-gray-900 ml-1" />
                )}
              </button>
            </div>
          </div>

          {/* Video Controls Bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center gap-3 mb-3">
              <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform">
                <SkipBack className="w-4 h-4 text-white" />
              </button>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center active:scale-95 transition-transform"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-gray-900" />
                ) : (
                  <Play className="w-5 h-5 text-gray-900 ml-0.5" />
                )}
              </button>
              
              <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform">
                <SkipForward className="w-4 h-4 text-white" />
              </button>

              <div className="flex-1 flex items-center gap-2">
                <span className="text-xs text-white">00:00</span>
                <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '30%' }} />
                </div>
                <span className="text-xs text-white">-00:00</span>
              </div>

              <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform">
                <Volume2 className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Version */}
      <div className="lg:hidden min-h-screen bg-gray-50">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => onBack && onBack()}
              className="transition-all active:scale-95"
              type="button"
            >
              <ChevronLeft className="w-6 h-6 text-[#71bcf0]" />
            </button>
            
            <h1 className="text-lg font-semibold text-gray-900">Камеры</h1>
            
            <div className="w-10" />
          </div>
        </div>

        {/* Weather Bar */}
        <div className="bg-white px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-[#71bcf0]" />
              <span className="text-gray-700">-9 °C</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-[#71bcf0]" />
              <span className="text-gray-700">0.64 m/s</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-[#71bcf0]" />
              <span className="text-gray-700">0.0 mm</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pt-4 pb-20">
          {/* Ad Banner - Ski Resort Themed */}
          <div className="mb-6">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#71bcf0] to-[#4a9dd9] p-6 shadow-lg">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12" />
              </div>
              
              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      Прокат снаряжения
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Полный комплект лыж и сноуборда
                    </p>
                  </div>
                  <div className="bg-yellow-400 text-gray-900 font-bold px-3 py-1.5 rounded-lg text-sm">
                    -20%
                  </div>
                </div>
                
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white font-medium mb-1">
                      От 50 сом/день
                    </p>
                    <p className="text-blue-100 text-xs">
                      Лыжи • Ботинки • Палки • Шлем
                    </p>
                  </div>
                  
                  <img
                    src="https://images.unsplash.com/photo-1761604227291-db2c1a000f34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2klMjBlcXVpcG1lbnQlMjByZW50YWx8ZW58MXx8fHwxNzY3NTM1MDIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Ski Equipment"
                    className="w-24 h-24 object-cover rounded-lg border-2 border-white/30"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Online Streaming Section */}
          <h2 className="font-bold text-gray-900 mb-4">
            Online трансляция
          </h2>

          {/* Horizontal Scrollable Cameras */}
          <div className="overflow-x-auto -mx-4 px-4 pb-2">
            <div className="flex gap-4" style={{ width: 'max-content' }}>
              {cameras.map((camera) => (
                <button
                  key={camera.id}
                  onClick={() => setSelectedCamera(camera)}
                  className="flex-shrink-0 w-[350px] text-left active:scale-[0.98] transition-transform"
                >
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <div className="relative aspect-[16/10]">
                      <img
                        src={camera.thumbnail}
                        alt={camera.title}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Live Badge */}
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md">
                        LIVE
                      </div>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                      {/* Title */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-semibold text-white">
                          {camera.title}
                        </h3>
                      </div>

                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-xl">
                          <Play className="w-7 h-7 text-gray-900 ml-1" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Version */}
      <div className="hidden lg:block min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1400px] mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onBack && onBack()}
                  className="flex items-center justify-center transition-all hover:bg-gray-100 rounded-full p-2"
                  type="button"
                >
                  <ChevronLeft className="w-7 h-7 text-gray-600" strokeWidth={2} />
                </button>
                <h1 className="text-4xl font-bold text-gray-900">Камеры</h1>
              </div>
              
              {/* Weather Info */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Sun className="w-5 h-5 text-[#71bcf0]" />
                  <span className="text-gray-700">-12°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-5 h-5 text-[#71bcf0]" />
                  <span className="text-gray-700">0.64 m/s</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-[#71bcf0]" />
                  <span className="text-gray-700">0.0 mm</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          {/* Main Video Player */}
          <div className="mb-6">
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '16/9' }}>
              {/* Video/Image */}
              <img
                src={defaultCamera.thumbnail}
                alt={defaultCamera.title}
                className="w-full h-full object-cover"
              />
              
              {/* Play/Pause Overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center hover:scale-110 transition-transform shadow-2xl"
                  >
                    <Play className="w-10 h-10 text-gray-900 ml-1" fill="currentColor" />
                  </button>
                </div>
              )}

              {/* Video Controls Bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" fill="currentColor" />
                    ) : (
                      <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
                    )}
                  </button>
                  
                  <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                    <Volume2 className="w-5 h-5 text-white" />
                  </button>

                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-sm text-white/90">LIVE</span>
                  </div>

                  <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                    <PictureInPicture className="w-5 h-5 text-white" />
                  </button>
                  
                  <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                    <Maximize className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Camera Thumbnails */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Другие камеры</h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {cameras.map((camera) => (
                <button
                  key={camera.id}
                  onClick={() => {
                    setSelectedCamera(camera);
                    setIsPlaying(false);
                  }}
                  className={`text-left transition-all ${
                    defaultCamera.id === camera.id 
                      ? 'ring-2 ring-[#71bcf0] rounded-xl' 
                      : 'hover:scale-105'
                  }`}
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                    {/* Title at top */}
                    <div className="px-4 pt-4 pb-2">
                      <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-gray-200"></span>
                        {camera.title}
                      </h3>
                    </div>
                    
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-gray-100">
                      <img
                        src={camera.thumbnail}
                        alt={camera.title}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Live Badge */}
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                        LIVE
                      </div>

                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors">
                        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
                          <Play className="w-7 h-7 text-gray-900 ml-1" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Title at bottom */}
                    <div className="px-4 py-3 bg-white">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {camera.title}
                      </h3>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}