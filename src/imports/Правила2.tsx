import svgPaths from "./svg-hdvyc0ivif";
import clsx from "clsx";
import imgImage36 from "../assets/140ff2effe61c36406a8f8dfd7ea0ca8f65901ed.png";
import imgImage from "../assets/303a4930f3123e601cfeb1c60c55605df7955090.png";
import imgImage1 from "../assets/b8cae430dcc9a061ee984ab29f7f02ffbde1c1b3.png";
import imgImage2 from "../assets/5267a87ea61c445a1eca0bb963bbec3caded4a61.png";
import imgImage3 from "../assets/9c795294b1560f7fea6a0053e20569a7e4ae2e7a.png";
import imgImage4 from "../assets/41d49055e755de8f4baa3b9a8e67cf4a9b29cb31.png";
import imgImage5 from "../assets/b620a98e79e037e889cce539667373d73fab3fb0.png";
import imgImage6 from "../assets/87c32e2629789255fc772f6ee5c44873e5233280.png";
import imgImage7 from "../assets/27bf9d35fb62af6e894095b02d07ebbee89a9e24.png";
import imgImage8 from "../assets/ebae83f33e4d2f058e97a8ff6bbe791f72edd7e0.png";
import imgImage9 from "../assets/fcfce042201db85d1fd639b173bba9d37b60e35c.png";
import imgImage10 from "../assets/8ed869c3977cfcf3e891e0951bf9ac68ac178feb.png";
import imgImage37 from "../assets/744bcdd2ffc7c8f4bc4ee34b9a4520dee719b4e9.png";

function Image1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute h-[148px] left-[calc(50%+9.83px)] top-[10px] translate-x-[-50%] w-[299.654px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {children}
      </div>
    </div>
  );
}
type Text1Props = {
  text: string;
};

function Text1({ text, children }: React.PropsWithChildren<Text1Props>) {
  return (
    <div className="absolute contents left-[10px] not-italic text-black top-[163px]">
      <div className="absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] left-[10px] text-[14px] top-[228px] translate-y-[-50%] w-[372px]">
        <p className="leading-[1.5]">{children}</p>
      </div>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[10px] text-[15px] text-nowrap top-[163px]">{text}</p>
    </div>
  );
}
type TextProps = {
  text: string;
};

function Text({ text, children }: React.PropsWithChildren<TextProps>) {
  return (
    <div className="absolute contents left-[10px] not-italic text-black top-[163px]">
      <div className="absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] left-[10px] text-[14px] top-[217.5px] translate-y-[-50%] w-[352px]">
        <p className="leading-[1.5]">{children}</p>
      </div>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[10px] text-[15px] text-nowrap top-[163px]">{text}</p>
    </div>
  );
}
type DarhboardAltHelperProps = {
  additionalClassNames?: string;
};

function DarhboardAltHelper({ additionalClassNames = "" }: DarhboardAltHelperProps) {
  return (
    <div className={clsx("absolute rounded-[1px]", additionalClassNames)}>
      <div aria-hidden="true" className="absolute border-[1.3px] border-solid border-white inset-[-0.65px] pointer-events-none rounded-[1.65px]" />
    </div>
  );
}
type Helper2Props = {
  text: string;
  text1: string;
};

function Helper2({ text, text1 }: Helper2Props) {
  return <Text text={text1}>{text}</Text>;
}

function Image() {
  return (
    <div className="absolute contents left-[calc(50%+10px)] top-[9px] translate-x-[-50%]">
      <Helper1 text="Обгонять можно слева и справа, сверху и снизу." text1="Обязательно соблюдайте дистанцию, достаточную для маневра." text2="Обгон" />
      <div className="absolute h-[148px] left-[calc(50%+9.83px)] top-[10px] translate-x-[-50%] w-[299.654px]" data-name="image">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage3} />
      </div>
    </div>
  );
}
type Helper1Props = {
  text: string;
  text1: string;
  text2: string;
};

function Helper1({ text, text1, text2 }: Helper1Props) {
  return (
    <div className="absolute contents left-[10px] not-italic text-black top-[163px]">
      <div className="absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] left-[10px] text-[14px] top-[217.5px] translate-y-[-50%] w-[372px]">
        <p className="leading-[1.5]">
          {text}
          <br aria-hidden="true" />
          {text1}
        </p>
      </div>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[10px] text-[15px] text-nowrap top-[163px]">{text2}</p>
    </div>
  );
}
type HelperProps = {
  text: string;
  text1: string;
  text2: string;
};

function Helper({ text, text1, text2 }: HelperProps) {
  return (
    <Text1 text={text2}>
      {text}
      <br aria-hidden="true" />
      {text1}
    </Text1>
  );
}

function Group6() {
  return (
    <div className="absolute contents left-[10px] not-italic text-black top-[163px]">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[10px] text-[15px] top-[275px] w-[207.136px]">Не «подрезайте» других.</p>
      <div className="absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] left-[10px] text-[14px] top-[228px] translate-y-[-50%] w-[372px]">
        <p className="leading-[1.5]">
          Выбирайте скорость в зависимости от обстановки на склоне.
          <br aria-hidden="true" />В туман и при большом количестве людей спускайтесь аккуратно.
        </p>
      </div>
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-[10px] text-[15px] top-[163px] w-[81.375px]">Скорость</p>
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents left-[calc(50%+10px)] top-[9px] translate-x-[-50%]">
      <Group6 />
      <div className="absolute h-[152.146px] left-[calc(50%+4.53px)] top-[10px] translate-x-[-50%] w-[308.05px]" data-name="image 36">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage36} />
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute border border-[rgba(0,0,0,0.5)] border-solid h-[305px] left-1/2 overflow-clip rounded-[15px] top-[295px] translate-x-[-50%] w-[372px]">
      <Group11 />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents left-[10px] not-italic text-black top-[163px]">
      <div className="absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] left-[10px] text-[14px] top-[249.5px] translate-y-[-50%] w-[372px]">
        <p className="leading-[1.5]">
          Не подвергайте риску других и не наносите вреда ни своим поведением, ни своим снаряжением.
          <br aria-hidden="true" />
          Выбирайте трассы, соответствующие вашему уровню катания.
          <br aria-hidden="true" />
          Соблюдайте очереди на подъемники.
        </p>
      </div>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[10px] text-[15px] text-nowrap top-[163px]">Уважайте окружающих</p>
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute contents left-[calc(50%+10px)] top-[9px] translate-x-[-50%]">
      <Group7 />
      <div className="absolute h-[148px] left-[calc(50%+9.83px)] top-[10px] translate-x-[-50%] w-[299.654px]" data-name="image">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage} />
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute border border-[rgba(0,0,0,0.5)] border-solid h-[322px] left-1/2 overflow-clip rounded-[15px] top-[615px] translate-x-[-50%] w-[372px]">
      <Group12 />
    </div>
  );
}

function Group8() {
  return <Text1 text="Траектория движения">Вы ответственны за тех, кто ниже вас по склону. Выбирайте такую траекторию движения, которая не помешает движению тех, кто находится ниже по склону</Text1>;
}

function Group13() {
  return (
    <div className="absolute contents left-[calc(50%+10px)] top-[9px] translate-x-[-50%]">
      <Group8 />
      <Image1>
        <img alt="" className="absolute max-w-none object-50%-50% object-cover size-full" src={imgImage} />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover size-full" src={imgImage1} />
      </Image1>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute border border-[rgba(0,0,0,0.5)] border-solid h-[280px] left-1/2 overflow-clip rounded-[15px] top-[952px] translate-x-[-50%] w-[372px]">
      <Group13 />
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute contents left-[calc(50%+10px)] top-[9px] translate-x-[-50%]">
      <Helper text="Не останавливайтесь там, где вас не видно окружающим." text1="Если упали, как можно скорее переместитесь к краю трассы." text2="Остановка на склоне" />
      <Image1>
        <img alt="" className="absolute max-w-none object-50%-50% object-cover size-full" src={imgImage} />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover size-full" src={imgImage1} />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover size-full" src={imgImage2} />
      </Image1>
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute border border-[rgba(0,0,0,0.5)] border-solid h-[280px] left-1/2 overflow-clip rounded-[15px] top-[1247px] translate-x-[-50%] w-[372px]">
      <Group14 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute border border-[rgba(0,0,0,0.5)] border-solid h-[264px] left-1/2 overflow-clip rounded-[15px] top-[1542px] translate-x-[-50%] w-[372px]">
      <Image />
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute border border-[rgba(0,0,0,0.5)] border-solid h-[264px] left-1/2 overflow-clip rounded-[15px] top-[1821px] translate-x-[-50%] w-[372px]">
      <Image />
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute contents left-[calc(50%+10px)] top-[9px] translate-x-[-50%]">
      <Helper text="Перед началом движения посмотрите вдоль трассы вверх и вниз. Трогайтесь и пересекайте трассу только убедившись," text1="что не мешаете окружающим." text2="Начало движения" />
      <Image1>
        <img alt="" className="absolute max-w-none object-50%-50% object-cover size-full" src={imgImage3} />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover size-full" src={imgImage3} />
      </Image1>
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute border border-[rgba(0,0,0,0.5)] border-solid h-[285px] left-1/2 overflow-clip rounded-[15px] top-[2100px] translate-x-[-50%] w-[372px]">
      <Group15 />
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute contents left-1/2 top-[9px] translate-x-[-50%]">
      <Helper2 text="Если вынуждены идти по склону пешком, держитесь самого края трассы. Не выпускайте из рук снаряжение" text1="Подъем и спуск пешком" />
      <div className="absolute h-[148px] left-[calc(50%+9.83px)] top-[10px] translate-x-[-50%] w-[299.654px]" data-name="image">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage4} />
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute border border-[rgba(0,0,0,0.5)] border-solid h-[265px] left-1/2 overflow-clip rounded-[15px] top-[2400px] translate-x-[-50%] w-[372px]">
      <Group16 />
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents left-[10px] not-italic text-black top-[163px]">
      <div className="absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] left-[10px] text-[14px] top-[207px] translate-y-[-50%] w-[352px]">
        <p className="leading-[1.5]">Если стали свидетелем несчастного случая, предложите помощь, позовите спасателей.</p>
      </div>
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[10px] text-[15px] text-nowrap top-[163px]">Помогите пострадавшему</p>
    </div>
  );
}

function Group17() {
  return (
    <div className="absolute contents left-1/2 top-[9px] translate-x-[-50%]">
      <Group9 />
      <div className="absolute h-[148px] left-[calc(50%-0.17px)] top-[10px] translate-x-[-50%] w-[299.654px]" data-name="image">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage5} />
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute border border-[rgba(0,0,0,0.5)] border-solid h-[244px] left-1/2 overflow-clip rounded-[15px] top-[2680px] translate-x-[-50%] w-[372px]">
      <Group17 />
    </div>
  );
}

function Group10() {
  return (
    <Text text="Соблюдайте знаки и разметку">
      Не выезжайте за сетки, смотрите на знаки.
      <br aria-hidden="true" />В том числе при посадке и высадке с канатных дорог
    </Text>
  );
}

function Group18() {
  return (
    <div className="absolute contents left-1/2 top-[9px] translate-x-[-50%]">
      <Group10 />
      <div className="absolute h-[148px] left-[calc(50%-0.17px)] top-[10px] translate-x-[-50%] w-[299.654px]" data-name="image">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage6} />
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="absolute border border-[rgba(0,0,0,0.5)] border-solid h-[263px] left-1/2 overflow-clip rounded-[15px] top-[2939px] translate-x-[-50%] w-[372px]">
      <Group18 />
    </div>
  );
}

function Group19() {
  return (
    <div className="absolute contents left-1/2 top-[9px] translate-x-[-50%]">
      <Helper2 text="Быстрое подтверждение личности свидетелей и пострадавших ускоряет процесс получения помощи" text1="Имейте при себе удостоверение" />
      <div className="absolute h-[148px] left-[calc(50%-0.17px)] top-[10px] translate-x-[-50%] w-[299.654px]" data-name="image">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage7} />
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="absolute border border-[rgba(0,0,0,0.5)] border-solid h-[263px] left-1/2 overflow-clip rounded-[15px] top-[3217px] translate-x-[-50%] w-[372px]">
      <Group19 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[60px] not-italic text-black text-nowrap top-[46px]">
      <p className="absolute left-[60px] text-[14px] top-[48px]">25 C</p>
      <p className="absolute left-[90px] text-[8px] top-[46px]">o</p>
    </div>
  );
}

function Weather() {
  return (
    <div className="absolute contents left-[20px] top-[40px]" data-name="weather">
      <div className="absolute bg-white border border-[#cecece] border-solid h-[30px] left-[20px] rounded-[60px] top-[40px] w-[90px]" />
      <Group3 />
      <div className="absolute left-[35px] size-[20px] top-[45px]" data-name="image 2">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage8} />
      </div>
    </div>
  );
}

function Live() {
  return (
    <div className="absolute contents left-[292px] top-[40px]" data-name="live">
      <div className="absolute bg-white border border-[#cecece] border-solid h-[30px] left-[292px] rounded-[60px] top-[40px] w-[90px]" />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[normal] left-[332px] not-italic text-[#ff0b0b] text-[14px] text-nowrap top-[47px]">LIVE</p>
      <div className="absolute flex items-center justify-center left-[307px] size-[20px] top-[45px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="relative size-[20px]" data-name="image 3">
            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage9} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="absolute h-[45px] left-[calc(50%+0.5px)] overflow-clip top-[calc(50%+12.5px)] translate-x-[-50%] translate-y-[-50%] w-[51px]" data-name="logo 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 51.0019 45.0011">
        <g id="Layer_x0020_1">
          <path d={svgPaths.p12f9e880} fill="var(--fill-0, #238ECE)" id="Vector" />
          <path d={svgPaths.p30a97d00} fill="var(--fill-0, #40AC4E)" id="Vector_2" />
          <path d={svgPaths.p1a48700} fill="var(--fill-0, #EA5C36)" id="Vector_3" />
          <path d={svgPaths.p281d7800} fill="var(--fill-0, #212122)" id="Vector_4" />
          <path d={svgPaths.pa8b8ac0} fill="var(--fill-0, #212122)" id="Vector_5" />
          <path d={svgPaths.p11d09c00} fill="var(--fill-0, #212122)" id="Vector_6" />
          <path d={svgPaths.p1c178000} fill="var(--fill-0, #202021)" id="Vector_7" />
          <path d={svgPaths.p1f053900} fill="var(--fill-0, #202021)" id="Vector_8" />
          <path d={svgPaths.p2dac8580} fill="var(--fill-0, #202021)" id="Vector_9" />
          <path d={svgPaths.pa05ec00} fill="var(--fill-0, #202021)" id="Vector_10" />
          <path d={svgPaths.p3c6ba900} fill="var(--fill-0, #202021)" id="Vector_11" />
          <path d={svgPaths.p33dadd80} fill="var(--fill-0, #212122)" id="Vector_12" />
          <path d={svgPaths.p26194d80} fill="var(--fill-0, #EA5C36)" id="Vector_13" />
          <path d={svgPaths.p33f31400} fill="var(--fill-0, #EA5C36)" id="Vector_14" />
          <path d={svgPaths.p1acc2900} fill="var(--fill-0, #EA5C36)" id="Vector_15" />
          <path d={svgPaths.pbec2b00} fill="var(--fill-0, #EA5C36)" id="Vector_16" />
          <path d={svgPaths.p2d849280} fill="var(--fill-0, #949697)" id="Vector_17" />
          <path d={svgPaths.p158b4900} fill="var(--fill-0, #949697)" id="Vector_18" />
          <path d={svgPaths.p30e2c180} fill="var(--fill-0, #949697)" id="Vector_19" />
          <path d={svgPaths.p1022aaf0} fill="var(--fill-0, #949697)" id="Vector_20" />
          <path d={svgPaths.p3361ca80} fill="var(--fill-0, #949494)" id="Vector_21" />
          <path d={svgPaths.p36b98000} fill="var(--fill-0, #949697)" id="Vector_22" />
          <path d={svgPaths.p3f08b830} fill="var(--fill-0, #949494)" id="Vector_23" />
          <path d={svgPaths.p28795080} fill="var(--fill-0, #949494)" id="Vector_24" />
          <path d={svgPaths.p2f92ef00} fill="var(--fill-0, #949697)" id="Vector_25" />
          <path d={svgPaths.p31b0f680} fill="var(--fill-0, #949697)" id="Vector_26" />
          <path d={svgPaths.p1e83f000} fill="var(--fill-0, #949697)" id="Vector_27" />
          <path d={svgPaths.p3c149600} fill="var(--fill-0, #EA5C36)" id="Vector_28" />
          <path d={svgPaths.p3329ff00} fill="var(--fill-0, #949697)" id="Vector_29" />
          <path d={svgPaths.p3e192100} fill="var(--fill-0, #949494)" id="Vector_30" />
          <path d={svgPaths.p18e60800} fill="var(--fill-0, #EA5C36)" id="Vector_31" />
          <path d={svgPaths.p3e25bf00} fill="var(--fill-0, #949697)" id="Vector_32" />
          <path d={svgPaths.p34c59c00} fill="var(--fill-0, #EB5F37)" id="Vector_33" />
          <path d={svgPaths.p135f0000} fill="var(--fill-0, #EB5F37)" id="Vector_34" />
          <path d={svgPaths.p1c0246f0} fill="var(--fill-0, #EE8360)" id="Vector_35" />
          <path d={svgPaths.p95b5ef0} fill="var(--fill-0, #FDF1EE)" id="Vector_36" />
          <path d={svgPaths.pd2e80c0} fill="var(--fill-0, #FCEAE3)" id="Vector_37" />
          <path d={svgPaths.p258b8a30} fill="var(--fill-0, #EE8360)" id="Vector_38" />
          <path d={svgPaths.p3fa96c0} fill="var(--fill-0, #EA5C36)" id="Vector_39" />
          <path d={svgPaths.p1cf26280} fill="var(--fill-0, #EA5C36)" id="Vector_40" />
          <path d={svgPaths.p12f9e880} fill="var(--fill-0, #238ECE)" id="Vector_41" />
          <path d={svgPaths.p30a97d00} fill="var(--fill-0, #40AC4E)" id="Vector_42" />
          <path d={svgPaths.p1a48700} fill="var(--fill-0, #EA5C36)" id="Vector_43" />
          <path d={svgPaths.p26194d80} fill="var(--fill-0, #EA5C36)" id="Vector_44" />
          <path d={svgPaths.p33f31400} fill="var(--fill-0, #EA5C36)" id="Vector_45" />
          <path d={svgPaths.p1acc2900} fill="var(--fill-0, #EA5C36)" id="Vector_46" />
          <path d={svgPaths.pbec2b00} fill="var(--fill-0, #EA5C36)" id="Vector_47" />
          <path d={svgPaths.p3c149600} fill="var(--fill-0, #EA5C36)" id="Vector_48" />
          <path d={svgPaths.p18e60800} fill="var(--fill-0, #EA5C36)" id="Vector_49" />
          <path d={svgPaths.p34c59c00} fill="var(--fill-0, #EB5F37)" id="Vector_50" />
          <path d={svgPaths.p135f0000} fill="var(--fill-0, #EB5F37)" id="Vector_51" />
          <path d={svgPaths.p1c0246f0} fill="var(--fill-0, #EE8360)" id="Vector_52" />
          <path d={svgPaths.p95b5ef0} fill="var(--fill-0, #FDF1EE)" id="Vector_53" />
          <path d={svgPaths.pd2e80c0} fill="var(--fill-0, #FCEAE3)" id="Vector_54" />
          <path d={svgPaths.p258b8a30} fill="var(--fill-0, #EE8360)" id="Vector_55" />
          <path d={svgPaths.p3fa96c0} fill="var(--fill-0, #EA5C36)" id="Vector_56" />
          <path d={svgPaths.p1cf26280} fill="var(--fill-0, #EA5C36)" id="Vector_57" />
        </g>
      </svg>
    </div>
  );
}

function Component1() {
  return (
    <div className="absolute h-[16px] left-[calc(50%-118.62px)] top-[calc(50%-26px)] translate-x-[-50%] translate-y-[-50%] w-[14.756px]" data-name="Component 3">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.7565 16">
        <g clipPath="url(#clip0_17_1011)" id="Component 3">
          <path d={svgPaths.p13e14f00} fill="var(--fill-0, #676766)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_17_1011">
            <rect fill="white" height="16" width="14.7565" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[75px] top-[15px]">
      <Component1 />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[118px] not-italic text-[14px] text-black text-nowrap top-[15px]">+992 00 000 00 00</p>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[290px] top-[15px]">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[290px] not-italic text-[14px] text-black text-nowrap top-[15px]">RU</p>
      <div className="absolute aspect-[4.69444/2.34722] left-[78.86%] right-[18.91%] top-[calc(50%-25.75px)] translate-y-[-50%]" data-name="Vector">
        <div className="absolute inset-[-11.11%_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 5.5">
            <path d="M9.5 0.5L5 5L0.5 0.5" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[75px] top-[15px]">
      <Group1 />
      <Group />
    </div>
  );
}

function Headermobile() {
  return (
    <div className="absolute bg-white h-[100px] left-1/2 overflow-clip top-0 translate-x-[-50%] w-[402px]" data-name="headermobile">
      <Weather />
      <Live />
      <Logo />
      <Group2 />
    </div>
  );
}

function Slider() {
  return (
    <div className="absolute h-[180px] left-1/2 overflow-clip rounded-[15px] top-[95px] translate-x-[-50%] w-[372px]" data-name="slider">
      <div className="absolute h-[180px] left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-[372px]" data-name="image">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <img alt="" className="absolute max-w-none object-50%-50% object-cover size-full" src={imgImage10} />
          <div className="absolute bg-[rgba(0,0,0,0.57)] inset-0" />
        </div>
      </div>
      <p className="absolute font-['Inter:Extra_Bold',sans-serif] font-extrabold leading-[normal] left-[calc(50%-72px)] not-italic text-[25px] text-nowrap text-white top-[calc(50%-15px)] uppercase">{`Правила `}</p>
    </div>
  );
}

function Home() {
  return (
    <div className="absolute contents left-[43px] top-[calc(50%+2.5px)] translate-y-[-50%]" data-name="home">
      <div className="absolute aspect-[35/32] left-[14.25%] right-[77.69%] top-[calc(50%-5px)] translate-y-[-50%]" data-name="Vector">
        <div className="absolute inset-[-1.85%_-1.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.0019 28">
            <path d={svgPaths.p3c6ed4a0} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, #71BCF0)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] left-[43px] text-[12px] text-nowrap text-white top-[39px]">Главная</p>
    </div>
  );
}

function SearchAlt() {
  return (
    <div className="absolute left-[128px] size-[30px] top-[9px]" data-name="Search_alt">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
        <g id="Search_alt"></g>
      </svg>
    </div>
  );
}

function Group22() {
  return (
    <div className="absolute h-[15px] left-[132px] top-[20px] w-[20px]">
      <div className="absolute inset-[-10%_0_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 16.5">
          <g id="Group 179">
            <line id="Line 19" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.5" x1="0.75" x2="19.25" y1="0.75" y2="0.75" />
            <line id="Line 20" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.5" x1="0.75" x2="19.25" y1="5.75" y2="5.75" />
            <line id="Line 21" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.5" x1="0.75" x2="19.25" y1="10.75" y2="10.75" />
            <line id="Line 22" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="1.5" x1="0.75" x2="19.25" y1="15.75" y2="15.75" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Search() {
  return (
    <div className="absolute contents left-[123px] top-[9px]" data-name="search">
      <p className="absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] left-[123px] text-[12px] text-nowrap text-white top-[39px]">Меню</p>
      <SearchAlt />
      <Group22 />
    </div>
  );
}

function DarhboardAlt() {
  return (
    <div className="absolute left-[201px] size-[30px] top-[9px]" data-name="darhboard_alt">
      <DarhboardAltHelper additionalClassNames="inset-[16.67%_58.33%_54.17%_16.67%]" />
      <DarhboardAltHelper additionalClassNames="inset-[62.5%_58.33%_16.67%_16.67%]" />
      <DarhboardAltHelper additionalClassNames="inset-[16.67%_16.67%_62.5%_58.33%]" />
      <DarhboardAltHelper additionalClassNames="inset-[54.17%_16.67%_16.67%_58.33%]" />
    </div>
  );
}

function Group20() {
  return (
    <div className="absolute contents left-[191px] top-[9px]">
      <DarhboardAlt />
      <p className="absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] left-[191px] text-[12px] text-nowrap text-white top-[39px]">Тарифы</p>
    </div>
  );
}

function User() {
  return (
    <div className="absolute left-[283px] size-[35px] top-[9px]" data-name="User">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35 35">
        <g id="User">
          <path d={svgPaths.p3a16a400} id="Ellipse 45" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2" />
          <ellipse cx="17.5" cy="11.6667" id="Ellipse 46" rx="5.83333" ry="5.83333" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Group21() {
  return (
    <div className="absolute contents left-[271px] top-[9px]">
      <p className="absolute font-['Montserrat:Medium',sans-serif] font-medium leading-[normal] left-[271px] text-[12px] text-nowrap text-white top-[41px]">Профиль</p>
      <User />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents left-[calc(50%+0.5px)] top-[6px] translate-x-[-50%]">
      <Home />
      <Search />
      <Group20 />
      <Group21 />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute bg-[#71bcf0] border-[#8ea3fe] border-[3px_0px_0px] border-solid h-[61px] left-1/2 overflow-clip rounded-[15px] top-[474px] translate-x-[-50%] w-[372px]">
      <Group4 />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents leading-[normal] left-[50px] not-italic text-white top-[25px]">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal left-[calc(50%-0.5px)] text-[16px] text-center top-[105px] translate-x-[-50%] w-[261px]">Кэшбек с каждой покупки в нашем мобильном приложении.</p>
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium left-[122px] text-[20px] text-nowrap top-[25px]">Приложение</p>
      <p className="absolute font-['Inter:Black',sans-serif] font-black left-[calc(50%-14.5px)] text-[40px] text-center text-nowrap top-[49px] translate-x-[-50%]">Сафеддара</p>
    </div>
  );
}

function App() {
  return (
    <div className="absolute bg-gradient-to-r from-[#8ea3fe] from-[29.809%] h-[450px] left-1/2 overflow-clip rounded-[20px] to-[#71bcf0] to-[70.191%] top-[calc(50%-31px)] translate-x-[-50%] translate-y-[-50%] w-[372px]" data-name="app">
      <Group5 />
      <div className="absolute h-[295px] left-[69px] top-[202px] w-[234px]" data-name="image 37">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage37} />
      </div>
    </div>
  );
}

function Footermobile() {
  return (
    <div className="absolute bg-white h-[542px] left-1/2 overflow-clip top-[3520px] translate-x-[-50%] w-[402px]" data-name="footermobile">
      <Frame />
      <App />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-white relative size-full" data-name="Правила 2">
      <Frame1 />
      <Frame2 />
      <Frame3 />
      <Frame4 />
      <Frame5 />
      <Frame6 />
      <Frame7 />
      <Frame8 />
      <Frame9 />
      <Frame10 />
      <Frame11 />
      <Headermobile />
      <Slider />
      <Footermobile />
    </div>
  );
}