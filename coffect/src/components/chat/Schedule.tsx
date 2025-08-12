/*
 * author : 앨리스/박은지
 * description : [커피챗 일정 등록] 컴포넌트
<<<<<<< HEAD
 * 일정 등록 폼, 완료 모달 연결
=======
 * 완료 모달 연결
>>>>>>> 552b968a2bb03d7cc903cac53139a56fd74252fb
 */

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ScheduleForm from "./ScheduleForm";
import type { ScheduleFormValues } from "./ScheduleForm";
import ScheduleCompleteModal from "./ScheduleCompleteModal";
import DeleteScheduleModal from "./DeleteScheduleModal";
import { X } from "lucide-react";
import ExampleProfile from "../../assets/icon/chat/ExampleProfile.png";
import ExampleProfile2 from "../../assets/icon/chat/ExampleProfile2.png";

const MY_PROFILE_IMG = ExampleProfile2;
const OTHER_PROFILE_IMG = ExampleProfile;
const NICKNAME = "김라떼";

const Schedule: React.FC = () => {
  const location = useLocation();
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
  const [showComplete, setShowComplete] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const isEdit = Boolean(location.state?.schedule);

  // 폼 초기화 함수
  const resetForm = () => {
    setForm({
      date: undefined,
      time: "",
      place: "",
      alert: null,
    });
  };

  // 일정 삭제하기
  const handleDelete = () => {
    setShowDeleteModal(false);
    // chatRoom으로 이동하면서 일정 정보 없음 상태로 전달
    navigate("/chat/room", { state: { schedule: null } });
  };

  // 일정 수정하기
  const handleEdit = () => {
    setShowComplete(true);
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
          일정 등록
        </div>
        <div className="flex w-full items-center justify-start">
          <div className="z-10 -mr-2 h-9 w-9 overflow-hidden rounded-full border-2 border-[var(--white)]">
            <img
              src={OTHER_PROFILE_IMG}
              alt="상대 프로필"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="z-0 h-9 w-9 overflow-hidden rounded-full border-2 border-[var(--white)]">
            <img
              src={MY_PROFILE_IMG}
              alt="내 프로필"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="ml-2 text-[20px] font-bold tracking-tight text-[#FF8126]">
            {NICKNAME}
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
          onComplete={isEdit ? handleEdit : () => setShowComplete(true)}
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
              resetForm();
              navigate("/chat/room", {
                state: {
                  schedule: {
                    date: form.date,
                    time: form.time,
                    place: form.place,
                    alert: form.alert,
                  },
                },
              });
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
