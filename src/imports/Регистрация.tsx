function Frame() {
  return (
    <div className="absolute bg-[#6acaea] h-[48px] left-0 overflow-clip right-0 rounded-[15px] shadow-[0px_2px_4px_-2px_rgba(0,0,0,0.1),0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_0px_0px_0px_black,0px_0px_0px_0px_black] top-[140px]" data-name="Frame">
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[24px] left-[calc(50%+0.5px)] text-[16px] text-center text-nowrap text-white top-[12px] translate-x-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Отправить код
      </p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute bg-white border border-[#d1d5db] border-solid h-[50px] left-0 overflow-clip right-0 rounded-[8px] shadow-[0px_2px_4px_-2px_rgba(0,0,0,0.1),0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_0px_0px_0px_black,0px_0px_0px_0px_black] top-[66px]" data-name="Frame">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[12px] not-italic text-[#b2b2b2] text-[16px] text-nowrap top-[11px]">{` Номер телефон`}</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute bg-white border border-[#d1d5db] border-solid h-[50px] left-0 overflow-clip right-0 rounded-[8px] shadow-[0px_2px_4px_-2px_rgba(0,0,0,0.1),0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_0px_0px_0px_black,0px_0px_0px_0px_black] top-0" data-name="Frame">
      <p className="absolute font-['Segoe_UI_Emoji:Regular',sans-serif] leading-[24px] left-[12px] not-italic text-[#b2b2b2] text-[16px] top-[11px] w-[547px]">Имя пользователя</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute h-[188px] left-1/2 top-[calc(50%+19px)] translate-x-[-50%] translate-y-[-50%] w-[326px]" data-name="Frame">
      <Frame />
      <Frame1 />
      <Frame2 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute bg-[#c2ddfe] h-[282px] left-1/2 overflow-clip rounded-[25px] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)] top-[30px] translate-x-[-50%] w-[370px]">
      <Frame3 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[329px] top-[58px]">
      <div className="absolute bg-white left-[329px] rounded-[32px] size-[32px] top-[58px]" />
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-[341px] not-italic text-[#6acaea] text-[17px] text-nowrap top-[62px]">1</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[284px] top-[51px]">
      <div className="absolute bg-[#6acaea] h-[40px] left-[284px] rounded-[8px] top-[51px] w-[80px]" />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[294px] not-italic text-[17px] text-nowrap text-white top-[62px]">шаг</p>
      <Group />
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute h-[32px] left-[9.45%] right-[9.58%] top-[calc(50%-101px)] translate-y-[-50%]" data-name="Frame">
      <p className="absolute font-['Roboto:Bold',sans-serif] font-bold leading-[32px] left-0 right-[55.45%] text-[24px] text-black text-nowrap top-[calc(50%-16px)]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Регистрация
      </p>
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-white relative size-full" data-name="регистрация">
      <Frame5 />
      <Group1 />
      <Frame4 />
    </div>
  );
}