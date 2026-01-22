import svgPaths from "./svg-2aphi4xwli";
import clsx from "clsx";
type WrapperProps = {
  additionalClassNames?: string;
};

function Wrapper({ children, additionalClassNames = "" }: React.PropsWithChildren<WrapperProps>) {
  return (
    <div className={additionalClassNames}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        {children}
      </svg>
    </div>
  );
}
type Frame22Props = {
  additionalClassNames?: string;
};

function Frame22({ children, additionalClassNames = "" }: React.PropsWithChildren<Frame22Props>) {
  return <Wrapper additionalClassNames={clsx("absolute size-[16px] translate-x-[-50%]", additionalClassNames)}>{children}</Wrapper>;
}

function Frame() {
  return (
    <div className="h-[28px] relative shrink-0 w-[92px]" data-name="Frame">
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[28px] left-0 right-0 text-[20px] text-white top-[calc(50%-14px)]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Профиль
      </p>
    </div>
  );
}

function Frame1() {
  return (
    <Wrapper additionalClassNames="relative shrink-0 size-[16px]">
      <g id="Frame">
        <path d={svgPaths.p20cbf380} fill="var(--fill-0, white)" id="Vector" />
      </g>
    </Wrapper>
  );
}

function Frame2() {
  return (
    <div className="absolute bg-[#6acaea] content-stretch flex h-[60px] items-center justify-between left-0 p-[16px] right-0 top-0" data-name="Frame">
      <Frame />
      <Frame1 />
    </div>
  );
}

function Frame3() {
  return (
    <Frame22 additionalClassNames="left-[calc(50%-154.75px)] top-[12px]">
      <g clipPath="url(#clip0_8_1248)" id="Frame">
        <path d={svgPaths.p1a0ad970} fill="var(--fill-0, #6ACAEA)" id="Vector" />
      </g>
      <defs>
        <clipPath id="clip0_8_1248">
          <rect fill="white" height="16" width="16" />
        </clipPath>
      </defs>
    </Frame22>
  );
}

function Frame4() {
  return (
    <div className="absolute h-[40px] left-0 right-0 rounded-[8px] top-[240px]" data-name="Frame">
      <Frame3 />
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[9.52%] not-italic right-[68.15%] text-[16px] text-black top-[calc(50%-12px)]">Выход</p>
    </div>
  );
}

function Frame5() {
  return (
    <Frame22 additionalClassNames="left-[calc(50%-154.75px)] top-[12px]">
      <g id="Frame">
        <path d={svgPaths.p3b25ab00} fill="var(--fill-0, #6ACAEA)" id="Vector" />
      </g>
    </Frame22>
  );
}

function Frame6() {
  return (
    <div className="absolute h-[40px] left-0 right-0 rounded-[8px] top-[192px]" data-name="Frame">
      <Frame5 />
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[9.52%] not-italic right-[58.33%] text-[16px] text-black top-[calc(50%-12px)]">Профиль</p>
    </div>
  );
}

function Frame7() {
  return (
    <Frame22 additionalClassNames="left-[calc(50%-154.75px)] top-[11px]">
      <g clipPath="url(#clip0_8_1235)" id="Frame">
        <path d={svgPaths.p52bc400} fill="var(--fill-0, #6ACAEA)" id="Vector" />
      </g>
      <defs>
        <clipPath id="clip0_8_1235">
          <rect fill="white" height="16" width="16" />
        </clipPath>
      </defs>
    </Frame22>
  );
}

function Frame8() {
  return (
    <div className="absolute h-[40px] left-0 right-0 rounded-[8px] top-[144px]" data-name="Frame">
      <Frame7 />
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[9.52%] not-italic right-[38.69%] text-[16px] text-black top-[calc(50%-13px)]">Способ оплата</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute h-[24px] left-[25.86%] right-[8.62%] top-1/2 translate-y-[-50%]" data-name="Frame">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-0 not-italic right-[-38.45%] text-[16px] text-white top-[calc(50%-12px)]">Кули Душанбе</p>
    </div>
  );
}

function Frame10() {
  return (
    <Frame22 additionalClassNames="left-[calc(50%-65px)] top-[12px]">
      <g clipPath="url(#clip0_8_1253)" id="Frame">
        <path d={svgPaths.p23fcfc00} fill="var(--fill-0, white)" id="Vector" />
      </g>
      <defs>
        <clipPath id="clip0_8_1253">
          <rect fill="white" height="16" width="16" />
        </clipPath>
      </defs>
    </Frame22>
  );
}

function Frame11() {
  return (
    <div className="absolute bg-[#0003d2] h-[40px] left-0 right-[46.54%] rounded-[8px] top-[96px]" data-name="Frame">
      <Frame9 />
      <Frame10 />
    </div>
  );
}

function Frame12() {
  return <div className="absolute h-[24px] left-[9.22%] right-[51.5%] top-1/2 translate-y-[-50%]" data-name="Frame" />;
}

function Group() {
  return (
    <div className="absolute inset-[-6.25%_14.39%_0_6.25%]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.2853 19.1248">
        <g id="Group 5">
          <path d={svgPaths.p2cbef300} fill="var(--fill-0, #6ACAEA)" id="Vector" />
          <path d={svgPaths.pfa79b00} fill="var(--fill-0, #6ACAEA)" id="Vector_2" />
          <path d={svgPaths.p9d65b00} fill="var(--fill-0, #6ACAEA)" id="Vector_3" />
          <path d={svgPaths.p11491240} fill="var(--fill-0, #6ACAEA)" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Frame13() {
  return (
    <div className="absolute left-[calc(50%-153.75px)] overflow-clip size-[18px] top-[10px] translate-x-[-50%]" data-name="Frame">
      <Group />
    </div>
  );
}

function Frame14() {
  return (
    <div className="absolute h-[40px] left-0 right-0 rounded-[8px] top-[48px]" data-name="Frame">
      <Frame12 />
      <Frame13 />
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[10.14%] not-italic right-[47.9%] text-[16px] text-black top-[calc(50%-13px)]">Мой прокат</p>
    </div>
  );
}

function Frame15() {
  return <div className="absolute left-0 size-[16px] top-[12px]" data-name="Frame" />;
}

function Group1() {
  return (
    <div className="absolute contents left-0 top-[12px]">
      <Frame15 />
      <div className="absolute inset-[30%_95.39%_30%_0.31%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 16">
          <path d={svgPaths.p26a47d00} fill="var(--fill-0, #6ACAEA)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="absolute h-[40px] left-0 right-0 rounded-[8px] top-0" data-name="Frame">
      <Group1 />
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[9.52%] not-italic right-[50.74%] text-[16px] text-black top-[calc(50%-12px)]">Мои брони</p>
    </div>
  );
}

function Frame17() {
  return (
    <div className="absolute h-[280px] left-[8.06%] right-[4.44%] top-[96px]" data-name="Frame">
      <Frame4 />
      <Frame6 />
      <Frame8 />
      <Frame11 />
      <Frame14 />
      <Frame16 />
    </div>
  );
}

function Frame18() {
  return <div className="absolute h-[56px] left-[40.63%] right-0 top-1/2 translate-y-[-50%]" data-name="Frame" />;
}

function Frame19() {
  return (
    <div className="absolute left-[calc(50%-107.75px)] size-[50px] top-0 translate-x-[-50%]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 50">
        <g id="Frame">
          <g clipPath="url(#clip0_8_1244)">
            <path d="M50 0H0V50H50V0Z" fill="var(--fill-0, #DDDDDD)" id="Vector" />
            <path d={svgPaths.p1dc91280} fill="var(--fill-0, #999999)" id="Vector_2" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_8_1244">
            <path d={svgPaths.ped05680} fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame20() {
  return (
    <div className="absolute h-[56px] left-0 top-[16px] w-[325.5px]" data-name="Frame">
      <Frame18 />
      <p className="absolute font-['Montserrat:Bold',sans-serif] font-bold leading-[28px] left-[26.11%] right-[14.96%] text-[18px] text-black top-[calc(50%-17px)]">Имя Фамилия</p>
      <Frame19 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="absolute bg-[#ddebfc] h-[392px] left-1/2 overflow-clip rounded-[15px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25),0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_0px_0px_0px_black,0px_0px_0px_0px_black] top-[75px] translate-x-[-50%] w-[372px]" data-name="Frame">
      <Frame17 />
      <Frame20 />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-white relative size-full" data-name="профиль">
      <Frame2 />
      <Frame21 />
    </div>
  );
}