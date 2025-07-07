// author : 앨리스/박은지
// description : [커피챗 일정 등록] 컴포넌트
// 일정 등록 폼, 완료 모달 연결

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ScheduleForm from "./ScheduleForm";
import type { ScheduleFormValues } from "./ScheduleForm";
import ScheduleCompleteModal from "./ScheduleCompleteModal";
import { X } from "lucide-react";
import { formatKoreanDate, formatKoreanDateShort } from "../../utils/dateUtils";

const MY_PROFILE_IMG = "https://i.pravatar.cc/40?u=me";
const OTHER_PROFILE_IMG = "https://i.pravatar.cc/40?u=other";
const NICKNAME = "김라떼";

const Schedule: React.FC = () => {
  const [form, setForm] = useState<ScheduleFormValues>({
    date: undefined,
    time: "",
    place: "",
    alert: null,
  });
  const [showComplete, setShowComplete] = useState(false);
  const navigate = useNavigate();

  // 폼 초기화 함수
  const resetForm = () => {
    setForm({
      date: undefined,
      time: "",
      place: "",
      alert: null,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 상단 헤더 */}
      <div className="relative mx-auto mt-5 flex w-full max-w-md flex-col items-center justify-center border-b-3 border-[rgba(245,245,245,1)] bg-white px-4 pt-6 pb-4">
        <button
          className="absolute top-6 left-4 text-2xl text-gray-700"
          onClick={() => navigate(-1)}
          aria-label="닫기"
        >
          <X size={28} />
        </button>
        <div className="mb-8 text-xl font-extrabold text-gray-900">
          일정 등록
        </div>
        <div className="flex w-full items-center justify-start">
          <div className="z-10 -mr-2 h-9 w-9 overflow-hidden rounded-full border-2 border-white">
            <img
              src={OTHER_PROFILE_IMG}
              alt="상대 프로필"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="z-0 h-9 w-9 overflow-hidden rounded-full border-2 border-white">
            <img
              src={MY_PROFILE_IMG}
              alt="내 프로필"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="ml-2 text-lg font-extrabold tracking-tight text-[#FF9100]">
            {NICKNAME}
          </span>
          <span className="text-lg font-extrabold tracking-tight text-gray-900">
            님과의 커피챗
          </span>
        </div>
      </div>
      {/* 폼 영역 */}
      <div className="mx-auto w-full max-w-md px-4 pt-4 pb-6">
        <ScheduleForm
          values={form}
          onChange={setForm}
          showTimeDropdown={true}
          onComplete={() => setShowComplete(true)}
        />
        {showComplete && (
          <ScheduleCompleteModal
            date={formatKoreanDate(form.date?.toString() || "")}
            time={form.time}
            onClose={() => {
              setShowComplete(false);
              // 폼 초기화
              resetForm();
              // chatRoom으로 이동하면서 일정 정보 전달
              navigate("/chat/room", {
                state: {
                  schedule: {
                    date: formatKoreanDateShort(form.date?.toString() || ""),
                    time: form.time,
                  },
                },
              });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Schedule;
