/*
  author      : 썬더
  description : 회원가입 관련 화면에 공통으로 사용되는 레이아웃 컴포넌트
                - 상단 스크롤 가능한 본문 영역
                - 하단 버튼 고정이 아닌 자연스러운 위치 배치
*/

import type { ReactNode } from "react";

interface Props {
  children: ReactNode; // 본문 콘텐츠 영역
  bottomButton?: ReactNode; // 하단 버튼 영역 (선택)
}

const SignupPageLayout = ({ children, bottomButton }: Props) => {
  return (
    <div className="relative flex h-[90vh] w-full flex-col items-center justify-between overflow-auto bg-white text-left">
      {/* 상단: 본문 영역 (스크롤 가능) */}
      <div className="w-full flex-1 overflow-y-auto px-5 pt-[5%] pb-6">
        {children}
      </div>

      {/* 하단: 버튼 영역 (선택적으로 표시) */}
      {bottomButton && (
        <div className="flex w-full px-[4%] py-[10px]">{bottomButton}</div>
      )}
    </div>
  );
};

export default SignupPageLayout;
