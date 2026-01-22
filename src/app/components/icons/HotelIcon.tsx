export function HotelIcon({ className = "w-5 h-5", size = 20 }: { className?: string; size?: number }) {
  const uniqueId = `hotel-gradient-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <svg 
      className={className}
      width={size}
      height={size}
      viewBox="0 0 20 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath={`url(#clip0_${uniqueId})`}>
        <path 
          d="M18 9.178V2.99785C18 1.34474 16.6543 0 15 0H5C3.3457 0 2 1.34474 2 2.99785V9.178C0.838379 9.59176 0 10.6906 0 11.9914V18.9864C0 19.5387 0.278325 20 0.830571 20C1.38282 20 1.62967 19.5387 1.62967 18.9864V17.0592H18.3699V18.9864C18.3699 19.5387 18.6316 19.9659 19.1839 19.9659C19.7361 19.9659 20 19.5387 20 18.9864V11.9914C20 10.6906 19.1616 9.59176 18 9.178ZM4.86339 1.58055H15.1399C15.8682 1.58055 16.4937 2.31431 16.4937 2.99785V8.99356H3.5546V2.99785C3.5546 2.31223 4.21987 1.58055 4.86339 1.58055ZM1.62967 15.4968V11.9914C1.62967 11.4401 2.43753 10.6716 2.9888 10.6716H17.0077C17.5589 10.6716 18.3699 11.4401 18.3699 11.9914V15.4968H1.62967Z" 
          fill={`url(#paint0_radial_${uniqueId})`}
        />
      </g>
      <defs>
        <radialGradient id={`paint0_radial_${uniqueId}`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(10) rotate(90) scale(20)">
          <stop stopColor="#8EA3FE"/>
          <stop offset="1" stopColor="#71BCF0"/>
        </radialGradient>
        <clipPath id={`clip0_${uniqueId}`}>
          <rect width="20" height="20" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}
