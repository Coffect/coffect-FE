/*
author      : 이희선
description : 상단 네비게이션 바 컴포넌트입니다. 
              홈/캘린더/알림 페이지에 따라 서로 다른 레이아웃을 표시합니다.
*/

import { useNavigate } from "react-router-dom";
import { CalendarDays, Bell, ChevronLeft } from "lucide-react";

/*
  props.pageType : 'home' | 'calendar' | 'alarm' 형태로 받아 상황에 따라 상단바를 다르게 표시합니다.
*/
interface TopNavbarProps {
  pageType: "home" | "calendar" | "alarm";
}

const TopNavbar = ({ pageType }: TopNavbarProps) => {
  const navigate = useNavigate();

  // 아이콘 공통 크기 (vw 단위 사용)
  const iconClass = "1.5rem text-black";

  // 뒤로가기 버튼 처리 함수
  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  /*
    pageType에 따라 홈 / 캘린더 / 알림 화면별로 다른 UI 구성
    - home: 좌측 로고 + 우측 캘린더/알림 아이콘
    - calendar, alarm: 좌측 뒤로가기 + 중앙 타이틀 + 우측 공백 (정렬 맞춤용)
  */
  return (
    <div className="flex w-full items-center justify-between bg-white px-[4vw] py-[3vh]">
      {pageType === "home" ? (
        <>
          {/* 좌측 로고 텍스트 */}
          <h1 className="text-xl font-semibold">coffect</h1>

          {/* 우측 아이콘 버튼 영역 (캘린더, 알림) */}
          <div className="flex items-center gap-[3vw]">
            <CalendarDays
              className={iconClass}
              onClick={() => navigate("/calendar")}
            />
            <Bell className={iconClass} onClick={() => navigate("/alarm")} />
          </div>
        </>
      ) : (
        <>
          {/* 좌측: 뒤로가기 버튼 (아이콘 클릭 시 이전 페이지 이동) */}
          <button onClick={handleBack}>
            <ChevronLeft className={iconClass} />
          </button>

          {/* 중앙: 현재 페이지에 맞는 타이틀 표시 */}
          <h1 className="text-lg font-semibold">
            {pageType === "calendar" ? "캘린더" : "알림"}
          </h1>

          {/* 우측: 좌우 정렬 유지용 빈 공간 */}
          <div className="h-[6vw] w-[6vw]" />
        </>
      )}
    </div>
  );
};

export default TopNavbar;
