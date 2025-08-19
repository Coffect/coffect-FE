/*
author : 재하
description : 내 공강 시간표를 보여주고, 시간대 선택/수정이 가능한 컴포넌트입니다.
*/

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTimeLine, patchTimeLine } from "@/api/profile";
import LoadingScreen from "@/components/shareComponents/LoadingScreen";
import backIcon from "@/assets/icon/mypage/back.png";

const TimeTable = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: timeLineData, isLoading } = useQuery({
    queryKey: ["timeLine"],
    queryFn: getTimeLine,
  });

  const days = ["월", "화", "수", "목", "금", "토", "일"];
  // 9:00 ~ 24:00 (30분 단위)
  const timeSlots = [];
  for (let hour = 9; hour < 20; hour++) {
    timeSlots.push(`${hour}:00`);
    timeSlots.push(`${hour}:30`);
  }

  type CellPos = { dayIndex: number; timeIndex: number } | null;
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [firstSelected, setFirstSelected] = useState<CellPos>(null);
  const [secondSelected, setSecondSelected] = useState<CellPos>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // 서버에서 내려온 154자(7일 × 22슬롯) 문자열을 요일 우선(day-major)으로 매핑하여 초기 선택 상태로 반영
  useEffect(() => {
    const timelineString = timeLineData?.success;
    const expectedLength = 154; // 7일 × 22슬롯
    if (!timelineString || timelineString.length !== expectedLength) return;

    const dayCount = 7;
    const timeCount = 22;
    const newSet = new Set<string>();
    for (let dayIndex = 0; dayIndex < dayCount; dayIndex++) {
      for (let timeIndex = 0; timeIndex < timeCount; timeIndex++) {
        const linearIndex = dayIndex * timeCount + timeIndex; // day-major
        if (timelineString[linearIndex] === "1") {
          newSet.add(`${dayIndex}-${timeIndex}`);
        }
      }
    }
    setSelectedSlots(newSet);
  }, [timeLineData?.success]);

  const getSlotId = (dayIndex: number, timeIndex: number) =>
    `${dayIndex}-${timeIndex}`;

  const handleCellClick = (dayIndex: number, timeIndex: number) => {
    if (!isEditing) return;
    if (firstSelected === null) {
      setFirstSelected({ dayIndex, timeIndex });
      setSecondSelected(null);
    } else if (secondSelected === null && firstSelected !== null) {
      setSecondSelected({ dayIndex, timeIndex });
      const minDay = Math.min(firstSelected.dayIndex, dayIndex);
      const maxDay = Math.max(firstSelected.dayIndex, dayIndex);
      const minTime = Math.min(firstSelected.timeIndex, timeIndex);
      const maxTime = Math.max(firstSelected.timeIndex, timeIndex);
      setSelectedSlots((prev) => {
        const newSet = new Set(prev);
        let allSelected = true;
        for (let d = minDay; d <= maxDay; d++) {
          for (let t = minTime; t <= maxTime; t++) {
            if (!newSet.has(getSlotId(d, t))) allSelected = false;
          }
        }
        for (let d = minDay; d <= maxDay; d++) {
          for (let t = minTime; t <= maxTime; t++) {
            const id = getSlotId(d, t);
            if (allSelected) newSet.delete(id);
            else newSet.add(id);
          }
        }
        return newSet;
      });
      setTimeout(() => {
        setFirstSelected(null);
        setSecondSelected(null);
      }, 200);
    }
  };

  const getTimeLabel = (timeIndex: number) => {
    if (timeIndex % 2 === 0) {
      const hour = Math.floor(timeIndex / 2) + 9;
      return `${hour}:00`;
    }
    return "";
  };

  const handleEditStart = () => {
    setIsEditing(true);
  };

  const { mutate: patchTimeline, isPending } = useMutation({
    mutationFn: patchTimeLine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeLine"] });
      setIsEditing(false);
      setFirstSelected(null);
      setSecondSelected(null);
    },
    onError: (error) => {
      console.error("타임라인 수정 실패:", error);
    },
  });

  const handleSave = () => {
    const dayCount = 7;
    const timeCount = 22;
    const total = dayCount * timeCount; // 154
    const timelineArray = Array<string>(total).fill("0");
    selectedSlots.forEach((slotId) => {
      const [dayStr, timeStr] = slotId.split("-");
      const dayIndex = Number(dayStr);
      const timeIndex = Number(timeStr);
      if (
        Number.isInteger(dayIndex) &&
        Number.isInteger(timeIndex) &&
        dayIndex >= 0 &&
        dayIndex < dayCount &&
        timeIndex >= 0 &&
        timeIndex < timeCount
      ) {
        const linearIndex = dayIndex * timeCount + timeIndex; // day-major
        timelineArray[linearIndex] = "1";
      }
    });
    const timelineString = timelineArray.join("");
    patchTimeline(timelineString);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-full w-full flex-col bg-white px-4">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between py-3">
        <button
          className="pr-9 text-left text-3xl"
          onClick={() => navigate(-1)}
        >
          <img src={backIcon} className="h-6 w-6" />
        </button>
        <div className="flex-1 items-center justify-center pr-15 text-center">
          <span className="text-lg font-semibold">내 공강 시간표</span>
        </div>
      </div>

      {/* 안내 텍스트 */}
      <div className="mt-3 mb-4 flex flex-col justify-center text-left">
        <span className="text-xl font-semibold text-[var(--gray-90)]">
          커피챗이 가능한
          <br />
          <span className="text-[var(--orange-500)]">공강 시간대</span>를
          표시해주세요!
        </span>
        <span className="text-md my-2 text-[var(--gray-50)]">
          상대방과 겹치는 시간대를 확인할 수 있어요.
        </span>
      </div>

      {/* 타임테이블 */}
      <div ref={scrollRef} className="relative w-full flex-1 overflow-auto">
        <div className="min-w-fit">
          {/* 요일 헤더 */}
          <div className="sticky top-0 z-10 flex gap-x-3">
            {/* 첫 div는 행과 열 사이 중첩되는 칸 */}
            <div className="sticky left-0 z-20 h-5 w-10" />
            {days.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className="mb-3 flex h-7 w-17.5 items-center justify-center text-lg font-semibold text-[var(--gray-50)]"
                // gap, margin, padding 등 없음!
              >
                {day}
              </div>
            ))}
          </div>

          {/* 시간대 라벨 + 셀 */}
          {timeSlots.map((_, timeIndex) => (
            <div key={timeIndex} className="flex gap-x-3">
              {/* 시간 라벨 */}
              <div
                className={`sticky left-0 z-10 flex h-5 w-10 items-center justify-start text-sm text-[var(--gray-40)] ${timeIndex % 2 === 0 ? "" : "opacity-0"}`}
              >
                {getTimeLabel(timeIndex)}
              </div>
              {/* 셀들 */}
              {days.map((_, dayIndex) => {
                const slotId = getSlotId(dayIndex, timeIndex);
                const isSelected = selectedSlots.has(slotId);
                // firstSelected 셀을 임시로 강조
                const isFirstSelected =
                  isEditing &&
                  firstSelected &&
                  firstSelected.dayIndex === dayIndex &&
                  firstSelected.timeIndex === timeIndex &&
                  secondSelected === null;
                // 9시(첫 row)와 24시(마지막 row) 체크
                const isFirstRow = timeIndex === 0;
                const isLastRow = timeIndex === timeSlots.length - 1;
                // 30분 단위(홀수 index) 체크
                const isHalfHour = timeIndex % 2 === 1;
                return (
                  <div
                    key={dayIndex}
                    className={`relative m-0 h-9 w-17.5 p-0 ${
                      isSelected || isFirstSelected
                        ? "bg-[var(--timetable-cell)]"
                        : "bg-[var(--gray-5)]"
                    } ${isEditing ? "cursor-pointer" : "cursor-default"} ${
                      isLastRow
                        ? "" // 마지막 row는 border-b 없음
                        : isHalfHour
                          ? "border-b border-[var(--gray-30)]"
                          : "border-b border-dashed border-[var(--gray-30)]"
                    } ${isFirstRow ? "rounded-t-xl" : ""} ${isLastRow ? "rounded-b-xl" : ""} `}
                    onClick={() => handleCellClick(dayIndex, timeIndex)}
                  >
                    {/* "시작"·"끝" 텍스트 제거 */}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="py-4">
        <button
          className="w-full rounded-xl bg-[var(--gray-80)] py-3 text-lg font-semibold text-white"
          onClick={isEditing ? handleSave : handleEditStart}
        >
          {isEditing ? (isPending ? "저장 중..." : "완료") : "수정하기"}
        </button>
      </div>
    </div>
  );
};

export default TimeTable;
