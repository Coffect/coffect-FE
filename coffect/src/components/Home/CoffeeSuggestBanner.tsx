/*
  author      : 이희선
  description : 커피챗 제안 배너 슬라이드 컴포넌트
                - Swiper를 이용한 슬라이드형 알림 UI
                - 각 제안에 대해 메시지 확인/삭제/대화 시작 가능
*/

import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useRef } from "react";
import "swiper/css";
import { Swiper as SwiperClass } from "swiper";
import MessageModal from "./MessageModal";
import DeleteSuggestModal from "./DeleteSuggestModal";
import { useNavigate } from "react-router-dom";

// 커피챗 제안 베너 데이터 타입 정의
interface Suggestion {
  id: number;
  name: string;
  message: string;
  image: string;
}

const CoffeeSuggestBanner = () => {
  const swiperRef = useRef<SwiperClass | null>(null); // Swiper 인스턴스 접근용 ref
  const navigate = useNavigate(); // 페이지 이동용

  // 제안 목록 상태 (더미 데이터)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: 1,
      name: "하은",
      message: "커피챗 제안이 도착했어요!",
      image: "https://picsum.photos/200?random=1",
    },
    {
      id: 2,
      name: "김라떼",
      message: "커피챗 제안이 도착했어요!",
      image: "https://picsum.photos/200?random=2",
    },
  ]);

  const [checkedMessage, setCheckedMessage] = useState<Suggestion | null>(null); // 메시지 모달에 표시할 항목
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null); // 삭제 확인 모달을 위한 ID
  const [isMessageHidden, setIsMessageHidden] = useState(false); // 삭제 확인 모달 확인 시 메시지 모달 숨김

  // 모달 닫기 (모두 초기화)
  const handleClose = () => {
    setCheckedMessage(null);
    setPendingDeleteId(null);
  };

  // 삭제 요청 시 → 메시지 모달 숨김 및 삭제 확인 모달 띄우기
  const handleDeleteRequest = (id: number) => {
    setIsMessageHidden(true);
    setPendingDeleteId(id);
  };
  //삭제 취소 시 → 다시 메시지 모달 보여줌
  const handleCancelDelete = () => {
    setIsMessageHidden(false);
    setPendingDeleteId(null);
  };

  // 삭제 확정 처리
  const handleConfirmDelete = () => {
    if (pendingDeleteId != null) {
      setSuggestions((prev) => prev.filter((s) => s.id !== pendingDeleteId));
      setCheckedMessage(null);
      setPendingDeleteId(null);
    }
  };

  // 채팅 페이지 이동
  const handleChat = () => {
    navigate("/chat");
    handleClose();
  };

  return (
    <div className="mt-[3%] flex w-full items-center justify-center overflow-hidden">
      {/* 커피쳇 제안 베너 슬라이드 */}
      <div className="flex h-auto w-[95%]">
        <Swiper
          className="h-auto w-full"
          spaceBetween={16}
          slidesPerView={1}
          onSwiper={(sw) => (swiperRef.current = sw)} // Swiper 인스턴스 저장
        >
          {/* 제안 하나씩 렌더링 */}
          {suggestions.map((user) => (
            <SwiperSlide
              key={user.id}
              className="flex items-center justify-center"
            >
              {/* 제안 카드 */}
              <div className="flex w-full items-center gap-[3vw] rounded-[20px] bg-white px-[6%] py-[4%] shadow-[0_0_20px_rgba(189,179,170,0.2)]">
                {/* 프로필 이미지 */}
                <img
                  src={user.image}
                  alt="프로필 사진"
                  className="aspect-[1/1] w-[20%] rounded-full object-cover p-0.5"
                />

                {/* 메시지 내용 + 버튼 */}
                <div className="flex w-0 flex-1 flex-col justify-center">
                  <p className="mb-[3%] overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                    <span className="font-bold">{user.name}</span>님의{" "}
                    {user.message}
                  </p>

                  <div className="flex justify-start">
                    <button className="rounded-lg bg-[#2D2D2D] px-4 py-1.5 text-xs text-white">
                      프로필 보기
                    </button>
                    <button
                      onClick={() => setCheckedMessage(user)}
                      className="ml-[3%] rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100"
                    >
                      메시지 확인하기
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 메시지 확인 모달 (커피챗 제안 확인) */}
      {checkedMessage && !isMessageHidden && (
        <MessageModal
          // UI 작동 실험용 더미 데이터
          message={{
            id: checkedMessage.id,
            name: checkedMessage.name.split("님")[0],
            time: `2025.1.17. 15:00`,
            intro: `안녕하세요! 사람과 이야기를 나누는 것을 좋아하고, 새로운 것을 배우는 데 늘 열려있는 ${checkedMessage.name}입니다. 즐겁고 의미있는 경험을 함께 만들고 싶어요! 특히 디자인, 마케팅에 관심이 많습니다! 아무나 환영이니 커피쳇 제안주세요!!`,
          }}
          onClose={handleClose}
          onDelete={() => handleDeleteRequest(checkedMessage.id)}
          onChat={handleChat}
        />
      )}

      {/* 제안 삭제 확인 모달 */}
      {pendingDeleteId != null && checkedMessage && (
        <DeleteSuggestModal
          messageName={checkedMessage.name}
          onDelete={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default CoffeeSuggestBanner;
