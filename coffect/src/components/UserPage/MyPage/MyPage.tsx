/*
author : 재하
description : 마이페이지 메인 화면. 프로필, 커피챗 기록, 저장 콘텐츠, 로그아웃, 회원탈퇴 등 마이페이지 주요 기능을 제공하는 컴포넌트입니다.
*/

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BottomNavbar from "../../shareComponents/BottomNavbar";
import LeaveModal from "./LeaveModal";

/*
마이페이지 메인 화면을 렌더링하는 함수형 컴포넌트입니다.
*/
const MyPage = () => {
  const navigate = useNavigate();
  // 회원탈퇴 모달 오픈 상태
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <div className="flex h-full w-full flex-col">
        <div className="flex h-full w-full flex-1 flex-col overflow-y-auto bg-white">
          {/* 상단 닉네임 */}
          <div className="mt-4 ml-4 text-2xl font-bold">jeha_0714</div>

          {/* 프로필 카드 */}
          <div className="mx-4 mt-4 flex flex-col items-center rounded-none border border-black p-4">
            <div className="flex w-full flex-row items-center justify-around">
              {/* 프로필 이미지 */}
              <div className="mb-2 ml-2 h-20 w-20 rounded-full bg-gray-200 sm:h-28 sm:w-28" />
              {/* 프로필 정보 */}
              <div className="flex flex-1 flex-col justify-center gap-2">
                <div className="flex items-end justify-center gap-1">
                  <span className="text-xl font-bold">재하</span>
                  <span className="text-xs text-gray-500">
                    컴퓨터과학전공 19학번
                  </span>
                </div>
                <div className="flex justify-evenly">
                  <div className="flex flex-col items-center">
                    <span className="font-bold">3</span>
                    <span className="text-xs text-gray-500">포스트</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold">3</span>
                    <span className="text-xs text-gray-500">팔로워</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold">3</span>
                    <span className="text-xs text-gray-500">팔로잉</span>
                  </div>
                </div>
              </div>
            </div>
            {/* 프로필/시간표 버튼 */}
            <div className="mt-2 flex w-full gap-2">
              <button
                className="flex-1 rounded bg-black py-2 font-semibold text-white transition hover:bg-gray-800"
                onClick={() => navigate(`/mypage/myprofile`)}
              >
                내 프로필
              </button>
              <button
                className="flex-1 rounded bg-black py-2 font-semibold text-white transition hover:bg-gray-800"
                onClick={() => navigate(`/mypage/timetable`)}
              >
                내 시간표
              </button>
            </div>
          </div>

          {/* 커피챗 기록 섹션 */}
          <div
            className="mx-4 mt-6"
            onClick={() => navigate(`/mypage/chatrecord`)}
          >
            <div className="mb-2 flex items-center justify-between">
              <button className="font-bold transition hover:text-blue-600">
                커피챗 기록
              </button>
              <span className="text-2xl text-gray-500">&gt;</span>
            </div>
            {/* 최근 커피챗 기록 카드 3개 미리보기 (더미) */}
            <div className="flex gap-3">
              <div className="aspect-[11/12] min-w-0 flex-1 rounded-lg bg-gray-200" />
              <div className="aspect-[11/12] min-w-0 flex-1 rounded-lg bg-gray-200" />
              <div className="aspect-[11/12] min-w-0 flex-1 rounded-lg bg-gray-200" />
            </div>
          </div>

          {/* 저장한 콘텐츠, 로그아웃, 회원탈퇴 섹션 */}
          <div className="mx-4 mt-8 flex flex-col gap-2 border-t border-gray-200 pt-4">
            <button className="flex cursor-pointer items-center justify-between rounded px-2 py-2 transition hover:bg-gray-100">
              <span>저장한 콘텐츠 조회</span>
              <span className="text-xl text-gray-500">&gt;</span>
            </button>
            <button className="rounded px-2 py-2 text-left text-gray-400 transition hover:text-red-500">
              로그아웃
            </button>
            <button
              className="rounded px-2 py-2 text-left text-gray-400 transition hover:text-red-500"
              onClick={() => setShowModal(true)}
            >
              회원탈퇴
            </button>
          </div>
        </div>
        {/* 하단 네비게이션 바 */}
        <BottomNavbar activeLabel="마이" />
      </div>
      {/* 회원탈퇴 모달 */}
      <LeaveModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => navigate("/mypage/leave")}
      />
    </>
  );
};

export default MyPage;
