/*
  author      : 이희선
  description : 커피챗 제안 배너 슬라이드 컴포넌트
                - Swiper를 이용한 슬라이드형 알림 UI
                - 각 제안에 대해 메시지 확인/삭제/대화 시작 가능
*/

import { ChevronLeft, ChevronRight } from "lucide-react";
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
      message: "하은님의 커피챗 제안이 도착했어요!",
      image: "https://picsum.photos/200?random=1",
    },
    {
      id: 2,
      message: "희선님의 커피챗 제안이 도착했어요!",
      image: "https://picsum.photos/200?random=2",
    },
  ]);

  const [checkedMessage, setCheckedMessage] = useState<Suggestion | null>(null); // 메시지 모달에 표시할 항목
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null); // 삭제 확인 모달을 위한 ID

  // 모달 닫기 (모두 초기화)
  const handleClose = () => {
    setCheckedMessage(null);
    setPendingDeleteId(null);
  };

  // 삭제 요청 시 → 삭제 확인 모달 띄우기
  const handleDeleteRequest = (id: number) => {
    setPendingDeleteId(id);
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
    <div className="relative h-[15vh] w-full overflow-hidden">
      {/* 왼쪽 슬라이드 버튼 */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute top-1/2 -left-[3vw] z-10 -translate-y-1/2"
        aria-label="이전"
      >
        <ChevronLeft className="h-[10vw] w-[10vw] text-gray-400" />
      </button>

      {/* 오른쪽 슬라이드 버튼 */}
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute top-1/2 -right-[3vw] z-10 -translate-y-1/2"
        aria-label="다음"
      >
        <ChevronRight className="h-[10vw] w-[10vw] text-gray-400" />
      </button>

      {/* 커피쳇 제안 베너 슬라이드 */}
      <div className="absolute inset-0 top-3/24 flex items-center justify-center">
        <div className="h-full w-[90%]">
          <Swiper
            className="h-full w-full"
            spaceBetween={16}
            slidesPerView={1}
            onSwiper={(sw) => (swiperRef.current = sw)} // Swiper 인스턴스 저장
          >
            {/* 제안 하나씩 렌더링 */}
            {suggestions.map((user) => (
              <SwiperSlide
                key={user.id}
                className="flex h-full items-center justify-center"
              >
                {/* 제안 카드 */}
                <div className="flex w-full items-center gap-[1vw] rounded-[3vw] bg-gray-200 px-[3vw] py-[2vh]">
                  {/* 프로필 이미지 */}
                  <img
                    src={user.image}
                    alt="프로필 사진"
                    className="h-[15vw] w-[15vw] rounded-full object-cover"
                  />

                  {/* 메시지 내용 + 버튼 */}
                  <div className="flex flex-col justify-center gap-[1.3vh]">
                    <span className="text-[3.6vw] font-bold">
                      {user.message}
                    </span>
                    <div className="flex w-full justify-center gap-[7%] text-[3vw]">
                      {/* 프로필 보기 -> 라우팅예정 */}
                      <button className="rounded-[0.5vw] bg-gray-300 px-[4vw] py-[1.2vh]">
                        프로필 보기
                      </button>

                      {/* 메시지 확인 버튼 */}
                      <button
                        onClick={() => setCheckedMessage(user)}
                        className="rounded-[0.5vw] bg-gray-300 px-[2vw] py-[1.2vh]"
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
      </div>

      {/* 메시지 확인 모달 (커피챗 제안 확인) */}
      {checkedMessage && (
        <MessageModal
          // UI 작동 실험용 더미 데이터
          message={{
            id: checkedMessage.id,
            name: checkedMessage.message.split("님")[0],
            time: `요청시간 2025. 7. 7. 오전 2:00`,
            intro: `안녕하세요! 사람과 이야기를 나누는 것을 좋아하고,\n새로운 것을 배우는 데 늘 열려 있는 뉴비입니다.\n즐겁고 의미 있는 경험을 함께 만들고 싶어요!`,
          }}
          onClose={handleClose}
          onDelete={() => handleDeleteRequest(checkedMessage.id)}
          onChat={handleChat}
        />
      )}

      {/* 제안 삭제 확인 모달 */}
      {pendingDeleteId != null && checkedMessage && (
        <DeleteSuggestModal
          messageName={checkedMessage.message.split("님")[0]}
          onDelete={handleConfirmDelete}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </div>
  );
};

export default CoffeeSuggestBanner;
