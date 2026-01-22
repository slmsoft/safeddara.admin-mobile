export function ServicesIcon({ className = "w-5 h-5", size = 20 }: { className?: string; size?: number }) {
  return (
    <svg 
      className={className}
      width={size}
      height={size * 1.1}
      viewBox="0 0 20 22" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect 
        x="3.26155" 
        y="8.28499" 
        width="13.2949" 
        height="12.1718" 
        rx="2.82609" 
        stroke="currentColor" 
        strokeWidth="2"
      />
      <line 
        x1="9.81658" 
        y1="7.54119" 
        x2="9.81658" 
        y2="3.79196" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      <line 
        x1="3.63303" 
        y1="4.70321" 
        x2="15.9325" 
        y2="1.40757" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </svg>
  );
}