/*
author : 박재하
description : 하단 네비게이션 바 컴포넌트입니다. 모바일 환경에서 주요 탭 이동을 제공합니다.
*/

import { Home, VectorSquare, MessageCircle, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

/*
각 탭의 상태를 관리하고, activeLabel에 따라 활성화된 탭의 색상을 변경합니다.
*/
interface BottomNavbarProps {
  activeLabel?: string;
}

/*
각 탭의 상태를 관리하고, activeLabel에 따라 활성화된 탭의 색상을 변경합니다.
*/
export default function BottomNavbar({ activeLabel }: BottomNavbarProps) {
  const navigate = useNavigate();
  // 네비게이션에 표시할 탭 정보 배열
  const tabs = [
    { id: 0, label: "홈", icon: Home, path: "/home" },
    { id: 1, label: "커뮤니티", icon: VectorSquare, path: "/community" },
    { id: 2, label: "채팅", icon: MessageCircle, path: "/chat" },
    { id: 3, label: "마이", icon: User, path: "/userpage/jeha" },
  ];

  return (
    <>
      {/* BottomNavbar가 fixed이기 때문에, 컨텐츠가 가려지지 않도록 spacer를 추가 */}
      <div className="h-[81px] w-full" />
      <div className="fixed right-0 bottom-0 left-0 bg-white">
        <div className="flex h-[81px] items-center justify-around px-4">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            // activeLabel이 없으면 모두 회색, 있으면 해당 label만 검정색
            const isActive = activeLabel === tab.label;
            return (
              <button
                key={tab.id}
                className="flex flex-col flex-1 justify-center items-center h-full"
                onClick={() => navigate(tab.path)}
              >
                <IconComponent
                  size={24}
                  className={`mb-1 ${isActive ? "text-black" : "text-gray-400"}`}
                />
                <span
                  className={`text-md ${
                    isActive ? "font-medium text-black" : "text-gray-400"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
