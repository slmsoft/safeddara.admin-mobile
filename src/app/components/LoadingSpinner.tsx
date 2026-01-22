export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="relative">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-xl animate-pulse" />
      </div>
    </div>
  );
}
