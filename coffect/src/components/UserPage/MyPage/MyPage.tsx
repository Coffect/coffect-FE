/*
author : 재하
description : 마이페이지 메인 화면. 프로필, 커피챗 기록, 저장 콘텐츠, 로그아웃, 회원탈퇴 등 마이페이지 주요 기능을 제공하는 컴포넌트입니다.
*/

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BottomNavbar from "../../shareComponents/BottomNavbar";
import LeaveModal from "./LeaveModal";
import nextIcon from "../../../assets/icon/mypage/next.png";
import coffeeRecordIcon from "../../../assets/icon/mypage/coffeeRecord.png";
import bookmarkIcon from "../../../assets/icon/mypage/bookmark.png";
import alarmIcon from "../../../assets/icon/mypage/alarm.png";
import profileImg from "../../../assets/icon/mypage/profile.png";

/*
마이페이지 메인 화면을 렌더링하는 함수형 컴포넌트입니다.
*/
const MyPage = () => {
  const navigate = useNavigate();
  // 회원탈퇴 모달 오픈 상태
  const [showModal, setShowModal] = useState<boolean>(false);

  function formatCount(num: number): string {
    if (num >= 1_000_000_000_000)
      return Math.floor(num / 1_000_000_000_000) + "T+";
    if (num >= 1_000_000_000) return Math.floor(num / 1_000_000_000) + "B+";
    if (num >= 1_000_000) return Math.floor(num / 1_000_000) + "M+";
    if (num >= 1_000) return Math.floor(num / 1_000) + "K+";
    return num.toString();
  }

  return (
    <>
      <div className="flex h-full w-full flex-col">
        <div className="flex h-full w-full flex-1 flex-col overflow-y-auto bg-[var(--gray-5)] pb-20">
          {/* 상단 닉네임 + 알람 */}
          <div className="mx-4 mt-4 flex items-center justify-between">
            <div className="ml-2 text-2xl font-bold text-[var(--gray-90)]">
              jeha_0714
            </div>
            <img src={alarmIcon} className="h-7 w-7" />
          </div>

          {/* 프로필 카드 */}
          <div className="mx-4 mt-4 flex flex-col items-center rounded-2xl bg-white p-4 pt-2">
            <div className="my-4 flex w-full flex-row items-center justify-around gap-2">
              {/* 프로필 이미지 */}
              <img
                src={profileImg}
                // className="h-25 min-h-[100px] w-25 min-w-[100px] rounded-full"
                className="max-h-[100px] min-h-[80px] max-w-[100px] min-w-[80px] rounded-full"
              />
              {/* 프로필 정보 */}
              <div className="flex flex-1 flex-col justify-center gap-2 px-2">
                <div className="flex flex-col items-start justify-center gap-1">
                  <span className="text-xl font-bold text-[var(--gray-90)]">
                    재하
                  </span>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs text-[var(--gray-50)]">
                      디자인테크놀로지학과
                    </span>
                    <span className="text-xs text-[var(--gray-50)]">
                      19학번
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-semibold text-[var(--gray-70)]">
                      {formatCount(999456)}
                    </span>
                    <span className="text-sm text-[var(--gray-50)]">
                      포스트
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-semibold text-[var(--gray-70)]">
                      {formatCount(999456)}
                    </span>
                    <span className="text-sm text-[var(--gray-50)]">
                      팔로워
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-semibold text-[var(--gray-70)]">
                      {formatCount(999456)}
                    </span>
                    <span className="text-sm text-[var(--gray-50)]">
                      팔로잉
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* 프로필/시간표 버튼 */}
            <div className="mt-2 flex w-full gap-2">
              <button
                className="text-md flex-1 rounded-xl bg-[var(--gray-80)] py-3 text-white transition hover:bg-gray-800"
                onClick={() => navigate(`/mypage/myprofile`)}
              >
                내 프로필
              </button>
              <button
                className="text-md flex-1 rounded-xl border border-[var(--gray-30)] bg-white py-3 text-[var(--gray-50)] transition hover:bg-gray-100"
                onClick={() => navigate(`/mypage/timetable`)}
              >
                내 시간표
              </button>
            </div>
          </div>

          {/* 버튼 리스트: 나의 커피챗 기록, 내가 저장한 콘텐츠 */}
          <div className="mx-4 mt-4 flex flex-col gap-3 text-lg text-[var(--gray-90)]">
            <button
              className="flex items-center justify-between rounded-2xl bg-white px-4 py-6 text-lg font-medium transition hover:bg-gray-50"
              onClick={() => navigate(`/mypage/chatrecord`)}
            >
              <div className="flex items-center gap-2">
                <img
                  src={coffeeRecordIcon}
                  alt="커피챗 기록"
                  className="h-6 w-6"
                />
                <span>나의 커피챗 기록</span>
              </div>
              <img src={nextIcon} className="h-6 w-6" />
            </button>
            <button className="flex items-center justify-between rounded-2xl bg-white px-4 py-6 text-lg font-medium transition hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <img
                  src={bookmarkIcon}
                  alt="저장한 콘텐츠"
                  className="h-6 w-6"
                />
                <span>내가 저장한 콘텐츠</span>
              </div>
              <img src={nextIcon} className="h-6 w-6" />
            </button>
          </div>

          {/* 회원탈퇴, 로그아웃 버튼 */}
          <div className="mx-4 mt-4 flex flex-col gap-2 text-lg text-[var(--gray-40)]">
            <button
              className="flex items-center gap-2 rounded-lg px-4 py-4 text-left transition hover:bg-gray-200 hover:text-red-500"
              onClick={() => setShowModal(true)}
            >
              <span>회원탈퇴</span>
            </button>
            <button className="flex items-center gap-2 rounded-lg px-4 py-4 text-left transition hover:bg-gray-200 hover:text-red-500">
              <span>로그아웃</span>
            </button>
          </div>
        </div>
        {/* 하단 네비게이션 바 */}
        <BottomNavbar activeLabel="마이" />
      </div>
      {/* 회원탈퇴 모달 */}
      <LeaveModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default MyPage;
