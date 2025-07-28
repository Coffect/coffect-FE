/*
  author      : 썬더
  description : 온보딩 전체 페이지 컴포넌트 (슬라이드 전환(모션포함) 및 완료 시 회원가입 진입)
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "./OnboardingLayout";
import OnboardingSlide from "./OnboardingSlide";

// 온보딩 슬라이드에 들어갈 이미지 리소스
import Slide1Image from "../../assets/icon/Signup/slide1.png";
import Slide2Image from "../../assets/icon/Signup/slide2.png";
import Slide3Image from "../../assets/icon/Signup/slide3.png";
import Slide4Image from "../../assets/icon/Signup/slide4.png";

// 슬라이드 데이터 배열 (타이틀, 설명, 이미지 포함)
const slides = [
  {
    title: "같은 캠퍼스 안에서,\n커피챗 연결을 시작해봐요",
    description:
      "학교 안에서 만나는 가볍고 믿을 수 있는 커피챗,\n지금 바로 시작해보세요",
    image: Slide1Image,
  },
  {
    title: "원하는 커피챗을 탐색하고\n약속을 잡아보세요",
    description:
      "나와 잘 맞는 커피챗을 찾아보고\n대화를 통해 약속을 잡을 수 있어요",
    image: Slide2Image,
  },
  {
    title: "서로의 생각을 엿보고\n대화를 시작해볼 수 있어요",
    description:
      "커뮤니티를 통해 다양한 생각들을 읽어본 후\n마음이 닿는 글에 대화로 이어보세요",
    image: Slide3Image,
  },
  {
    title: "커피챗은 지나가도,\n기억은 남아요",
    description:
      "오늘의 대화가 내일의 성장으로 이어질 수 있게\n누구와 어떤 이야기를 나눴는지 기록에 남아요",
    image: Slide4Image,
  },
];

// 온보딩 전체 페이지 컴포넌트
const OnboardingPage = () => {
  const navigate = useNavigate(); // 페이지 이동 훅
  const [index, setIndex] = useState(0); // 현재 슬라이드 인덱스
  const isLast = index === slides.length - 1; // 마지막 슬라이드 여부

  // 다음 버튼 클릭 시 동작
  const handleNext = () => {
    if (isLast) {
      // 마지막 슬라이드면 온보딩 본 기록 저장 후 회원가입 이동
      localStorage.setItem("seenOnboarding", "true");
      navigate("/signup", { state: { step: 2 } });
    } else {
      // 다음 슬라이드로 이동
      setIndex((prev) => prev + 1);
    }
  };

  return (
    <OnboardingLayout
      currentIndex={index}
      total={slides.length}
      bottomButton={
        <button
          onClick={handleNext}
          className="w-full rounded-xl bg-[var(--gray-80)] py-[4%] text-center text-lg font-semibold text-white"
        >
          {isLast ? "로그인 하러가기" : "다음"}
        </button>
      }
    >
      <div className="relative w-full overflow-hidden">
        {/* 슬라이드 전체 래퍼 - index 기준으로 좌우 슬라이드 효과 */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            width: `${slides.length * 100}%`,
            transform: `translateX(-${index * (100 / slides.length)}%)`,
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="w-full flex-shrink-0"
              style={{ width: `${100 / slides.length}%` }}
            >
              <OnboardingSlide {...slide} />
            </div>
          ))}
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingPage;
