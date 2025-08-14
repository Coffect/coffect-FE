/*
author : 재하
description : 커피챗 기록 상세 카드를 출력하는 컴포넌트입니다.
*/

import { useNavigate } from "react-router-dom";
import backIcon from "../../../../assets/icon/mypage/back.png";

const ChatCard = () => {
  const navigate = useNavigate();
  const profile1 =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5pm7ppGNzhWKozuGDYWpG4AO00X0X2G0eQg&s";
  // "data:image/png;base64,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";
  const profile2 =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHefUsxMBRmPSIeHzKBe8336hkVo68Hyul7Q&s";

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-gradient-to-br from-[var(--design-bg)] via-pink-100 to-[var(--design-bg)] px-4">
      {/* 상단 네비게이션 영역 */}
      <div className="flex min-h-14 items-center">
        <button onClick={() => navigate("/mypage/chatrecord")}>
          <img src={backIcon} className="h-6 w-6" alt="back" />
        </button>
      </div>

      {/* 카드 영역 */}
      <div className="mb-14 flex flex-1 items-center justify-center">
        <div className="flex w-[90%] max-w-xs flex-col items-center justify-center rounded-3xl border border-white bg-white/50 py-10 backdrop-blur-md">
          {/* 날짜/시간 */}
          <div className="mb-7 text-center text-sm text-[var(--gray-60)]">
            2025.07.03 오후 2시
          </div>

          {/* 프로필 이미지 2개 (겹침) */}
          <div className="mb-4 flex items-center justify-center">
            <div className="z-11 h-28 w-28 rounded-full border-4 border-white bg-white">
              <img
                src={profile1}
                className="h-full w-full rounded-full object-cover"
                alt="profile1"
              />
            </div>
            <img
              src={profile2}
              className="z-10 -ml-6 h-28 w-28 rounded-full border-4 border-white object-cover"
              alt="profile2"
            />
          </div>

          {/* 타이틀 */}
          <div className="mb-8 text-center text-2xl font-semibold text-[var(--gray-80)]">
            가나디님과의
            <br />
            첫번째 커피챗 기록
          </div>

          {/* 장소 */}
          <div className="rounded-full bg-white px-3 py-3 text-sm text-[var(--gray-70)]">
            @스타벅스 인하대사거리점
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
