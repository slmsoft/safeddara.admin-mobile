import imgImage37 from "../../assets/6f0a5e987497fa96f08371156f8cbb6ea5f2ee68.png";

export function AppPromoSection() {
  return (
    <section className="mt-12 pb-8 px-1 sm:px-2 lg:px-0">
      <div className="relative bg-gradient-to-br from-[#8ea3fe] via-[#71bcf0] to-[#8ea3fe] rounded-3xl overflow-hidden shadow-2xl">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative grid lg:grid-cols-2 gap-8 items-center px-8 lg:px-16 py-10 lg:py-16 overflow-visible">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-white text-xl lg:text-2xl font-medium mb-2">
              Приложение
            </h2>
            <h3 className="text-white text-3xl lg:text-5xl font-black mb-4 lg:mb-6 tracking-tight">
              Сафеддара
            </h3>
            <p className="text-white/90 text-base lg:text-lg leading-relaxed max-w-[320px] mx-auto lg:mx-0 mb-8">
              Кэшбек с каждой покупки в нашем мобильном приложении.
            </p>
            
            {/* Store Badges */}
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
                </svg>
                App store
              </button>
              <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                Play market
              </button>
            </div>
          </div>

          {/* Right Phone mockup */}
          <div className="relative flex justify-center lg:justify-end -mb-10 lg:-mb-16">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-white/30 rounded-[3rem] blur-3xl scale-110" />
              
              {/* Phone image */}
              <div className="relative w-[297px] h-[430px] lg:w-[337px] lg:h-[490px]">
                <img
                  alt="Safeddara App"
                  className="w-full h-full object-contain drop-shadow-2xl"
                  src={imgImage37}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}