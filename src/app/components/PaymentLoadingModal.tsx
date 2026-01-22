export function PaymentLoadingModal() {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-300" />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-10 text-center animate-in zoom-in-95 duration-300">
          {/* Animated Loader */}
          <div className="relative mx-auto mb-6" style={{ width: '80px', height: '80px' }}>
            {/* Spinning Ring */}
            <div 
              className="absolute inset-0 rounded-full border-4 border-gray-200"
              style={{
                borderTopColor: '#10b981',
                animation: 'spin 1s linear infinite'
              }}
            />
            
            {/* Inner Circle */}
            <div 
              className="absolute inset-2 rounded-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center"
              style={{
                animation: 'pulse 2s ease-in-out infinite'
              }}
            >
              <div className="text-2xl">💳</div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Обработка платежа...
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 text-sm">
            Пожалуйста, подождите. Это займет всего несколько секунд.
          </p>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div 
              className="w-2 h-2 rounded-full bg-green-500"
              style={{ animation: 'bounce 1.4s ease-in-out infinite' }}
            />
            <div 
              className="w-2 h-2 rounded-full bg-green-500"
              style={{ animation: 'bounce 1.4s ease-in-out 0.2s infinite' }}
            />
            <div 
              className="w-2 h-2 rounded-full bg-green-500"
              style={{ animation: 'bounce 1.4s ease-in-out 0.4s infinite' }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
        }
      `}</style>
    </>
  );
}
