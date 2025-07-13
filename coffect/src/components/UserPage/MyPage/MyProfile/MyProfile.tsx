/*
author : 재하
description : 마이페이지 내 프로필 및 피드/상세소개 탭을 출력하는 컴포넌트입니다.
*/
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DetailIntro from "./DetailIntro";
import backIcon from "../../../../assets/icon/mypage/back.png";
import profileImg from "../../../../assets/icon/mypage/profile.png";

export default function MyProfileUI() {
  /*
  사용자의 마이페이지 프로필 화면을 렌더링하며, 탭에 따라 피드 또는 상세 소개를 보여줍니다.
  */
  const navigate = useNavigate();
  // 현재 활성화된 탭 상태 ("내 피드" 또는 "상세 소개")
  const [activeTab, setActiveTab] = useState("내 피드");
  // 텍스트 확장 상태
  const [isExpanded, setIsExpanded] = useState(false);
  // 텍스트가 2줄 이상인지 확인하는 상태
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  // 텍스트가 2줄 이상인지 확인하는 함수
  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const element = textRef.current;

        // 텍스트의 실제 높이
        const textHeight = element.scrollHeight;

        // 2줄 높이 추정 (line-height * 2)
        const lineHeight = 1.2; // em 단위 기준
        const fontSize = 14; // text-sm = 14px
        const twoLineHeight = fontSize * lineHeight * 2;

        // 텍스트 높이가 2줄 높이보다 크면 오버플로우
        setIsOverflowing(textHeight > twoLineHeight);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  function formatCount(num: number): string {
    if (num >= 1_000_000_000_000)
      return Math.floor(num / 1_000_000_000_000) + "T+";
    if (num >= 1_000_000_000) return Math.floor(num / 1_000_000_000) + "B+";
    if (num >= 1_000_000) return Math.floor(num / 1_000_000) + "M+";
    if (num >= 1_000) return Math.floor(num / 1_000) + "K+";
    return num.toString();
  }

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-white px-4">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between py-3">
        <button
          className="pr-9 text-left text-3xl"
          onClick={() => navigate("/mypage/myprofile")}
        >
          <img src={backIcon} className="h-6 w-6" />
        </button>
        <div className="flex-1 items-center justify-center pr-15 text-center">
          <span className="text-lg font-semibold">jeha0714</span>
        </div>
      </div>

      {/* Profile Section: 프로필 이미지와 통계 정보 */}
      <div className="py-2">
        <div className="mb-4 flex flex-row items-center justify-center">
          {/* Profile Image: 사용자 프로필 이미지 자리 */}
          <img
            src={profileImg}
            className="flex h-25 w-25 overflow-hidden rounded-full border border-black"
          />

          {/* Stats: 포스트/팔로워/팔로잉 수 */}
          <div className="flex flex-1 items-center justify-evenly">
            <div className="text-center">
              <div className="text-lg font-semibold text-[var(--gray-70)]">
                {formatCount(42)}
              </div>
              <div className="text-sm text-[var(--gray-50)]">포스트</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-[var(--gray-70)]">
                {formatCount(999456)}
              </div>
              <div className="text-sm text-[var(--gray-50)]">팔로워</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-[var(--gray-70)]">
                {formatCount(999456)}
              </div>
              <div className="text-sm text-[var(--gray-50)]">팔로잉</div>
            </div>
          </div>
        </div>

        {/* Profile Info: 사용자 이름, 전공, 학번, 자기소개 */}
        <div className="mb-4 ml-2">
          <p className="text-xl font-bold text-[var(--gray-90)]">재하</p>
          <div className="mb-1">
            <span className="text-sm text-[var(--gray-40)]">
              컴퓨터컴퓨터과학전공{" "}
            </span>
            <span className="text-sm text-[var(--gray-40)]">19학번</span>
          </div>
          <div className="relative">
            <p
              ref={textRef}
              className={`text-sm text-[var(--gray-70)] ${
                !isExpanded && isOverflowing ? "line-clamp-2" : ""
              }`}
            >
              계절이 지나가는 하늘에는 가을로 가득 차 있습니다. 나는 아무 걱정도
              없이 가을 속의 별들을 다 헤일 듯합니다. 가슴속에 하나둘 새겨지는
              별을 이제 다 못 헤는 것은 쉬이 아침이 오는 까닭이요, 내일 밤이
              남은 까닭이요, 아직 나의 청춘이 다하지 않은 까닭입니다. 별 하나에
              추억과 별 하나에 사랑과 별 하나에 쓸쓸함과 별 하나에 동경과 별
              하나에 시와 별 하나에 어머니, 어머니,
            </p>
            {isOverflowing && (
              <button
                className="mt-1 text-sm text-[var(--gray-40)] hover:text-[var(--gray-70)]"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "접기" : "더보기"}
              </button>
            )}
          </div>
        </div>

        {/* Profile Edit Button: 프로필 수정 페이지로 이동 */}
        <button
          className="text-md mb-3.5 w-full rounded-lg bg-[var(--gray-60)] py-3 text-white"
          onClick={() => navigate("/mypage/myprofile/modify")}
        >
          프로필 수정
        </button>
      </div>

      <div className="-mx-4 h-2 w-full bg-[var(--gray-5)]"></div>

      {/* Tab Navigation: 내 피드/상세 소개 탭 전환 */}
      <div className="flex border-b">
        <button
          className={`flex-1 border-b-2 py-3 text-center font-medium ${
            activeTab === "내 피드"
              ? "border-black text-black"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => setActiveTab("내 피드")}
        >
          내 피드
        </button>
        <button
          className={`flex-1 border-b-2 py-3 text-center font-medium ${
            activeTab === "상세 소개"
              ? "border-black text-black"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => setActiveTab("상세 소개")}
        >
          상세 소개
        </button>
      </div>

      {/* Content Area: 탭에 따라 내용 분기 */}
      <div className="py-5">
        {/* 내 피드 탭이 활성화된 경우 피드 내용 출력 */}
        {activeTab === "내 피드" && (
          <div className="py-8 text-center">
            {/* 실제 피드 데이터가 들어갈 자리 (현재는 더미 텍스트) */}
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
            <p className="text-gray-500">내 피드 내용이 여기에 표시됩니다.</p>
          </div>
        )}

        {/* 상세 소개 탭이 활성화된 경우 상세 소개 컴포넌트 출력 */}
        {activeTab === "상세 소개" && <DetailIntro />}
      </div>
    </div>
  );
}
