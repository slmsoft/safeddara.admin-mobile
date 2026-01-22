import svgPaths from "../../imports/svg-ewyk1kdmg2";

// Wrapper for SVG
function Wrapper2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative size-full">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 157.575 157.621">
        {children}
      </svg>
    </div>
  );
}

function Wrapper1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative size-full">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 163.095 163.143">
        {children}
      </svg>
    </div>
  );
}

// WhatsApp Icon (Green)
export function WhatsAppIcon() {
  return (
    <div className="w-10 h-10">
      <Wrapper2>
        <path d={svgPaths.p121b7240} fill="#00E510" id="Vector" />
        <g id="Group_2">
          <path d={svgPaths.p3dbb5380} fill="#FDFDFD" id="Vector_2" />
          <path d={svgPaths.p1f4c6280} fill="#FDFDFD" id="Vector_3" />
        </g>
      </Wrapper2>
    </div>
  );
}

// Telegram Icon (Blue)
export function TelegramIcon() {
  return (
    <div className="w-10 h-10">
      <Wrapper2>
        <path d={svgPaths.p1788c700} fill="#00B0F2" id="Vector" />
        <path d={svgPaths.p11989c00} fill="#FEFFFC" id="Vector_2" />
      </Wrapper2>
    </div>
  );
}

// Instagram Icon (Gradient)
export function InstagramIcon() {
  return (
    <div className="w-10 h-10">
      <Wrapper2>
        <g id="Group">
          <path d={svgPaths.p121b7240} fill="url(#paint0_linear_instagram)" id="Vector" />
          <g id="Group_2">
            <path d={svgPaths.p1604de00} fill="white" id="Vector_2" />
            <path d={svgPaths.p39aa6f00} fill="white" id="Vector_3" />
            <path d={svgPaths.p2c68a100} fill="white" id="Vector_4" />
          </g>
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_instagram" x1="23.0209" x2="134.587" y1="134.593" y2="23.0661">
            <stop stopColor="#FAAD4F" />
            <stop offset="0.35" stopColor="#DD2A7B" />
            <stop offset="0.62" stopColor="#9537B0" />
            <stop offset="1" stopColor="#515BD4" />
          </linearGradient>
        </defs>
      </Wrapper2>
    </div>
  );
}

// YouTube Icon (Red)
export function YouTubeIcon() {
  return (
    <div className="w-10 h-10">
      <Wrapper2>
        <path d={svgPaths.p121b7240} fill="#FF0000" id="Vector" />
        <path clipRule="evenodd" d={svgPaths.p586e980} fill="white" fillRule="evenodd" id="Vector_2" />
      </Wrapper2>
    </div>
  );
}

// Facebook Icon (Blue)
export function FacebookIcon() {
  return (
    <div className="w-10 h-10">
      <Wrapper2>
        <path d={svgPaths.p383fbf80} fill="#1877F2" id="Vector" />
        <path d={svgPaths.p3248e200} fill="white" id="Vector_2" />
      </Wrapper2>
    </div>
  );
}

// TikTok Icon (Black/Gradient)
export function TikTokIcon() {
  return (
    <div className="w-10 h-10">
      <Wrapper2>
        <path d={svgPaths.p121b7240} fill="black" id="Vector" />
        <g id="Group_2">
          <path d={svgPaths.p6a6e580} fill="#FF004F" id="Vector_2" />
          <path d={svgPaths.p3d396e80} fill="#00F7EF" id="Vector_3" />
          <path d={svgPaths.p3b7a4e00} fill="white" id="Vector_4" />
        </g>
      </Wrapper2>
    </div>
  );
}