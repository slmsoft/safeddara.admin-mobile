import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import wallpaper1 from '../../assets/wallpaper1.jpg';
import wallpaper2 from '../../assets/wallpaper2.mp4';
import wallpaper3 from '../../assets/wallpaper3.mp4';

const slides = [
  {
    id: 1,
    image: wallpaper1,
    type: 'image' as const
  },
  {
    id: 2,
    video: wallpaper2,
    type: 'video' as const
  },
  {
    id: 3,
    video: wallpaper3,
    type: 'video' as const
  }
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // 4 seconds

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full max-w-[370px] lg:max-w-[1440px] mx-auto h-[220px] lg:h-[500px] overflow-hidden rounded-3xl lg:rounded-[20px] mt-6 lg:mt-8 shadow-2xl lg:shadow-none">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-300 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image or Video */}
          {slide.type === 'image' && slide.image ? (
          <img 
            className="w-full h-full object-cover" 
            src={slide.image} 
            alt={`Slide ${slide.id}`}
          />
          ) : slide.type === 'video' && slide.video ? (
            <video 
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={slide.video} type="video/mp4" />
            </video>
          ) : null}

          {/* Gradient Overlay for better text readability - Mobile only */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent lg:hidden" />
        </div>
      ))}

      {/* Next Arrow - Desktop only */}
      <button
        onClick={nextSlide}
        className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full items-center justify-center shadow-lg transition-all hover:scale-110 z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      {/* Previous Arrow - Desktop only */}
      <button
        onClick={prevSlide}
        className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full items-center justify-center shadow-lg transition-all hover:scale-110 z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>

      {/* Pagination dots */}
      <div className="absolute bottom-6 left-6 lg:bottom-8 lg:left-1/2 lg:-translate-x-1/2 flex items-center gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 lg:h-2 rounded-full shadow-lg transition-all duration-300 ${
              i === currentSlide 
                ? 'w-8 lg:w-12 bg-white' 
                : 'w-1.5 lg:w-2 bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}