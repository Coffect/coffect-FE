/*
 * author : 앨리스/박은지
 * description : [커피챗 일정 등록] 컴포넌트
 * 일정 등록 폼, 완료 모달 연결
 */

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ScheduleForm from "./ScheduleForm";
import type { ScheduleFormValues } from "./ScheduleForm";
import ScheduleCompleteModal from "./ScheduleCompleteModal";
import DeleteScheduleModal from "./DeleteScheduleModal";
import { X } from "lucide-react";
import { useChatUser } from "./hooks/useChatUser";
import { useChatRooms } from "../../hooks/chat/useChatRooms";
import { formatAmPmTo24Hour } from "../../utils/dateUtils";
import { useScheduleForm } from "./hooks/useScheduleForm";

const Schedule: React.FC = () => {
  const location = useLocation();
  const { user: currentUser } = useChatUser();
  const { chatRooms } = useChatRooms();

  // 현재 채팅방 ID 가져오기 (URL에서 추출하거나 location state에서)
  const currentChatRoomId = (() => {
    // /chat/{chatRoomId}/schedule 형태에서 chatRoomId 추출
    const pathParts = location.pathname.split("/");
    if (
      pathParts.length >= 4 &&
      pathParts[1] === "chat" &&
      pathParts[pathParts.length - 1] === "schedule"
    ) {
      // 전체 chatRoomId를 추출 (슬래시가 포함된 경우도 처리)
      return pathParts.slice(2, -1).join("/");
    }
    return location.state?.chatRoomId;
  })();
  const currentChatRoom =
    chatRooms.find((room) => room.chatroomId === currentChatRoomId) ||
    chatRooms[0]; // 임시로 첫 번째 채팅방 사용

  const [form, setForm] = useState<ScheduleFormValues>(() => {
    // 기존 일정이 있는지 확인 (수정하기)
    const sch = location.state?.schedule;
    if (sch) {
      // 날짜가 string이면 Date 객체로 변환
      let dateValue: Date | string | undefined = sch.date;
      if (typeof sch.date === "string") {
        const parsed = new Date(sch.date);
        dateValue = isNaN(parsed.getTime()) ? undefined : parsed;
      }
      return {
        date: dateValue,
        time: sch.time,
        place: sch.place || "",
        alert: sch.alert || "5분 전",
      };
    }
    return {
      date: undefined,
      time: "",
      place: "",
      alert: "5분 전",
    };
  });

  // 일정 폼 훅 사용
  const { fixCoffeeChatSchedule } = useScheduleForm(form);

  const [showComplete, setShowComplete] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const isEdit = Boolean(location.state?.schedule);

  // 일정 삭제하기
  const handleDelete = () => {
    setShowDeleteModal(false);
    // 현재 채팅방으로 이동하면서 일정 정보 없음 상태로 전달
    navigate(currentChatRoomId ? `/chat/${currentChatRoomId}` : "/chat", {
      state: { schedule: null },
    });
  };

  // 일정 등록/수정 API 호출
  const handleScheduleSubmit = async () => {
    try {
      // 날짜와 시간을 ISO 문자열로 변환
      const dateObj =
        typeof form.date === "string" ? new Date(form.date) : form.date!;

      // 날짜 유효성 검사
      if (isNaN(dateObj.getTime())) {
        console.error("유효하지 않은 날짜:", form.date);
        return;
      }

      // AM/PM 형식을 24시간 형식으로 변환
      const time24Hour = formatAmPmTo24Hour(form.time);
      const [hours, minutes] = time24Hour.split(":").map(Number);

      // 시간 유효성 검사
      if (isNaN(hours) || isNaN(minutes)) {
        console.error("유효하지 않은 시간 형식:", form.time);
        return;
      }

      // 채팅방 ID 검증
      if (!currentChatRoomId) {
        console.error("채팅방 ID를 찾을 수 없습니다.");
        return;
      }

      dateObj.setHours(hours, minutes, 0, 0);

      const scheduleData = {
        time: dateObj.toISOString(),
        location: form.place,
        coffeeDate: dateObj.toISOString(),
      };

      // getCoffectId API 호출
      const { getCoffectId } = await import("../../api/chat/chatRoomApi");
      const coffectIdResponse = await getCoffectId(currentChatRoomId);

      if (
        coffectIdResponse.resultType !== "SUCCESS" ||
        !coffectIdResponse.success
      ) {
        throw new Error(
          coffectIdResponse.error?.reason ||
            "커피챗 제안 아이디를 찾을 수 없습니다.",
        );
      }

      const coffectId = coffectIdResponse.success;
      console.log("coffectId:", coffectId);

      // fixCoffeeChatSchedule API 호출
      const response = await fixCoffeeChatSchedule({
        ...scheduleData,
        coffectId,
      });

      if (response.resultType === "SUCCESS") {
        console.log("일정 등록 성공:", response.success);
        setShowComplete(true);
      } else {
        console.error("일정 등록 실패:", response.error);
      }
    } catch (error) {
      console.error("일정 등록 API 호출 실패:", error);
    }
  };

  // 일정 수정하기
  const handleEdit = () => {
    handleScheduleSubmit();
  };

  return (
    <div className="flex h-full w-full flex-col bg-[var(--white)]">
      {/* 상단 헤더 */}
      <div className="relative flex w-full flex-col items-center justify-center bg-[var(--white)] px-4 pt-7 pb-3">
        <button
          className="absolute top-7 left-4 text-2xl text-[var(--gray-70)]"
          onClick={() => navigate(-1)}
          aria-label="닫기"
        >
          <X size={24} />
        </button>
        <div className="mb-7 text-[18px] font-semibold text-[var(--gray-90)]">
          {isEdit ? "일정 수정" : "일정 등록"}
        </div>
        <div className="flex w-full items-center justify-start">
          <div className="z-10 -mr-2 h-9 w-9 overflow-hidden rounded-full border-2 border-[var(--white)] bg-[var(--gray-10)]">
            {currentChatRoom?.userInfo?.profileImage && (
              <img
                src={currentChatRoom.userInfo.profileImage}
                alt="상대 프로필"
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="z-0 h-9 w-9 overflow-hidden rounded-full border-2 border-[var(--white)] bg-[var(--gray-10)]">
            {currentUser.profileImage && (
              <img
                src={currentUser.profileImage}
                alt="내 프로필"
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <span className="ml-2 text-[20px] font-bold tracking-tight text-[#FF8126]">
            {currentChatRoom?.userInfo?.name || "상대방"}
          </span>
          <span className="text-[20px] font-bold tracking-tight text-[var(--gray-90)]">
            님과의 커피챗
          </span>
        </div>
      </div>
      {/* 폼 영역 */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6">
        <ScheduleForm
          values={form}
          onChange={setForm}
          onComplete={isEdit ? handleEdit : handleScheduleSubmit}
          completeLabel={isEdit ? "수정하기" : undefined}
          onCancel={isEdit ? () => setShowDeleteModal(true) : undefined}
          cancelLabel={isEdit ? "일정 삭제하기" : undefined}
        />
        {showComplete && (
          <ScheduleCompleteModal
            date={
              form.date
                ? typeof form.date === "string"
                  ? form.date
                  : form.date.toLocaleDateString("ko-KR", {
                      month: "long",
                      day: "numeric",
                    })
                : ""
            }
            time={form.time}
            onClose={() => {
              setShowComplete(false);
              // 일정 등록 완료 후 해당 일정 정보를 유지하면서 채팅방으로 이동
              navigate(
                currentChatRoomId ? `/chat/${currentChatRoomId}` : "/chat",
                {
                  state: {
                    schedule: {
                      date: form.date,
                      time: form.time,
                      place: form.place,
                      alert: form.alert,
                    },
                  },
                },
              );
            }}
          />
        )}
        {isEdit && showDeleteModal && (
          <DeleteScheduleModal
            scheduleText={
              form.date
                ? `${
                    typeof form.date === "string"
                      ? form.date
                      : form.date.toLocaleDateString("ko-KR", {
                          month: "long",
                          day: "numeric",
                          weekday: "long",
                        })
                  } ${form.time}`
                : ""
            }
            onDelete={handleDelete}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Schedule;
