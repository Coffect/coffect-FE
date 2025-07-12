/*
author : 재하
description : 내 공강 시간표를 보여주고, 시간대 선택/수정이 가능한 컴포넌트입니다.
*/

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import backIcon from "../../../assets/icon/mypage/back.png";

const TimeTable = () => {
  const navigate = useNavigate();
  const days = ["월", "화", "수", "목", "금", "토", "일"];
  // 9:00 ~ 24:00 (30분 단위)
  const timeSlots = [];
  for (let hour = 9; hour < 24; hour++) {
    timeSlots.push(`${hour}:00`);
    timeSlots.push(`${hour}:30`);
  }

  type CellPos = { dayIndex: number; timeIndex: number } | null;
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [firstSelected, setFirstSelected] = useState<CellPos>(null);
  const [secondSelected, setSecondSelected] = useState<CellPos>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

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
  const handleSave = () => {
    setIsEditing(false);
    setFirstSelected(null);
    setSecondSelected(null);
    console.log("저장된 시간대:", Array.from(selectedSlots));
  };

  return (
    <div className="flex h-full w-full flex-col bg-white px-4">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between py-3">
        <button
          className="pr-9 text-left text-3xl"
          onClick={() => navigate("/mypage")}
        >
          {" "}
          <img src={backIcon} className="h-6 w-6" />{" "}
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
          공강 시간대를 표시해주세요!
        </span>
        <span className="text-md my-2 text-[var(--gray-50)]">
          상대방과 겹치는 시간대를 확인할 수 있어요.
        </span>
      </div>

      {/* 타임테이블 */}
      <div ref={scrollRef} className="relative w-full flex-1 overflow-auto">
        <div className="min-w-fit">
          {/* 요일 헤더 */}
          <div className="sticky top-0 z-10 flex gap-x-4">
            {/* 첫 div는 행과 열 사이 중첩되는 칸 */}
            <div className="sticky left-0 z-20 h-5 w-10" />
            {days.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className="mb-3 flex h-7 w-20 items-center justify-center text-lg font-semibold text-[var(--gray-50)]"
                // gap, margin, padding 등 없음!
              >
                {day}
              </div>
            ))}
          </div>

          {/* 시간대 라벨 + 셀 */}
          {timeSlots.map((_, timeIndex) => (
            <div key={timeIndex} className="flex gap-x-4">
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
                const isFirst =
                  firstSelected &&
                  firstSelected.dayIndex === dayIndex &&
                  firstSelected.timeIndex === timeIndex;
                const isSecond =
                  secondSelected &&
                  secondSelected.dayIndex === dayIndex &&
                  secondSelected.timeIndex === timeIndex;
                // 9시(첫 row)와 24시(마지막 row) 체크
                const isFirstRow = timeIndex === 0;
                const isLastRow = timeIndex === timeSlots.length - 1;
                // 30분 단위(홀수 index) 체크
                const isHalfHour = timeIndex % 2 === 1;
                return (
                  <div
                    key={dayIndex}
                    className={`relative m-0 h-9 w-20 p-0 ${isSelected ? "bg-[var(--timetable-cell)]" : "bg-[var(--gray-5)]"} ${isEditing ? "cursor-pointer" : "cursor-default"} ${
                      isLastRow
                        ? "" // 마지막 row는 border-b 없음
                        : isHalfHour
                          ? "border-b border-[var(--gray-30)]"
                          : "border-b border-dashed border-[var(--gray-30)]"
                    } ${isFirstRow ? "rounded-t-xl" : ""} ${isLastRow ? "rounded-b-xl" : ""} `}
                    onClick={() => handleCellClick(dayIndex, timeIndex)}
                  >
                    {isFirst && (
                      <div className="absolute top-1 left-1 text-xs text-green-600">
                        시작
                      </div>
                    )}
                    {isSecond && (
                      <div className="absolute right-1 bottom-1 text-xs text-blue-600">
                        끝
                      </div>
                    )}
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
          {isEditing ? "완료" : "수정하기"}
        </button>
      </div>
    </div>
  );
};

export default TimeTable;
