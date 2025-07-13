/*
author : 재하
description : 하단 네비게이션 바 컴포넌트입니다. 주요 탭 이동을 제공합니다.
*/

import homeOn from "../../assets/icon/shareComponents/homeOn.png";
import homeOff from "../../assets/icon/shareComponents/homeOff.png";
import communityOn from "../../assets/icon/shareComponents/communityOn.png";
import communityOff from "../../assets/icon/shareComponents/communityOff.png";
import chatOn from "../../assets/icon/shareComponents/chatOn.png";
import chatOff from "../../assets/icon/shareComponents/chatOff.png";
import mypageOn from "../../assets/icon/shareComponents/mypageOn.png";
import mypageOff from "../../assets/icon/shareComponents/mypageOff.png";
import { useNavigate } from "react-router-dom";

/*
각 탭의 상태를 관리하고, activeLabel에 따라 활성화된 탭의 색상을 변경합니다.
*/
interface BottomNavbarProps {
  activeLabel?: string;
}

/*
각 탭의 상태를 관리하고, activeLabel에 따라 활성화된 탭의 색상을 변경합니다.
인자로 "홈" , "커뮤니티", "채팅", "마이" 를 줘야 합니다.
*/
export default function BottomNavbar({ activeLabel }: BottomNavbarProps) {
  const navigate = useNavigate();
  // 네비게이션에 표시할 탭 정보 배열
  const tabs = [
    { id: 0, label: "홈", onIcon: homeOn, offIcon: homeOff, path: "/home" },
    {
      id: 1,
      label: "커뮤니티",
      onIcon: communityOn,
      offIcon: communityOff,
      path: "/community",
    },
    { id: 2, label: "채팅", onIcon: chatOn, offIcon: chatOff, path: "/chat" },
    {
      id: 3,
      label: "마이",
      onIcon: mypageOn,
      offIcon: mypageOff,
      path: "/mypage",
    },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex h-[64px] w-[276px] -translate-x-1/2 items-center justify-around rounded-full bg-[var(--gray-70)] px-6">
      {tabs.map((tab) => {
        const isActive = activeLabel === tab.label;
        return (
          <button
            key={tab.id}
            className="flex h-full flex-1 flex-col items-center justify-center focus:outline-none"
            onClick={() => navigate(tab.path)}
          >
            <img
              src={isActive ? tab.onIcon : tab.offIcon}
              alt={tab.label}
              // className="mb-2 h-7 w-7"
              className={isActive ? "h-8 w-6" : "h-6 w-6"}
            />
          </button>
        );
      })}
    </div>
  );
}
