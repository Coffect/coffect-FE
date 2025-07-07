/*
author : 재하
description : 내 공강 시간표를 보여주고, 시간대 선택/수정이 가능한 컴포넌트입니다.
*/

import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/*
내 공강 시간표를 렌더링하고, 시간대 선택/수정 기능을 제공하는 함수형 컴포넌트입니다.
*/
const TimeTable = () => {
  const navigate = useNavigate();
  // 요일 배열
  const days = ["월", "화", "수", "목", "금", "토", "일"];

  // 시간 배열 (9시부터 19시까지, 30분 단위)
  const timeSlots = [];
  for (let hour = 9; hour < 19; hour++) {
    timeSlots.push(`${hour}:00`);
    if (hour < 19) {
      timeSlots.push(`${hour}:30`);
    }
  }

  // 선택된 시간대 상태 (day-timeIndex 형태로 저장)
  const [selectedSlots, setSelectedSlots] = useState(new Set());
  // 편집 전 원본 상태를 저장
  const [originalSlots, setOriginalSlots] = useState(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<"select" | "deselect" | null>(null);

  const tableRef = useRef(null);
  const containerRef = useRef(null);

  // 슬롯 ID 생성 함수
  const getSlotId = (dayIndex: number, timeIndex: number) =>
    `${dayIndex}-${timeIndex}`;

  // 드래그 시작
  const handleMouseDown = useCallback(
    (
      e: { preventDefault: () => void; stopPropagation: () => void },
      dayIndex: number,
      timeIndex: number,
    ) => {
      if (!isEditing) return;

      // 모든 기본 동작 방지
      e.preventDefault();
      e.stopPropagation();

      const slotId = getSlotId(dayIndex, timeIndex);
      const isSelected = selectedSlots.has(slotId);

      setIsDragging(true);
      setDragMode(
        isSelected ? "deselect" : ("select" as "select" | "deselect" | null),
      );

      setSelectedSlots((prev) => {
        const newSet = new Set(prev);
        if (isSelected) {
          newSet.delete(slotId);
        } else {
          newSet.add(slotId);
        }
        return newSet;
      });
    },
    [isEditing, selectedSlots],
  );

  // 드래그 중
  const handleMouseEnter = useCallback(
    (dayIndex: number, timeIndex: number) => {
      if (!isDragging || !isEditing) return;

      const slotId = getSlotId(dayIndex, timeIndex);

      setSelectedSlots((prev) => {
        const newSet = new Set(prev);
        if (dragMode === "select") {
          newSet.add(slotId);
        } else {
          newSet.delete(slotId);
        }
        return newSet;
      });
    },
    [isDragging, dragMode, isEditing],
  );

  // 드래그 종료
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragMode(null);
  }, []);

  // 전역 이벤트 처리 (드래그 중 스크롤 방지 및 마우스/터치 이벤트 관리)
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setDragMode(null);
    };

    const handleGlobalMouseMove = (e: {
      preventDefault: () => void;
      stopPropagation: () => void;
    }) => {
      if (isDragging && isEditing) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleTouchMove = (e: {
      preventDefault: () => void;
      stopPropagation: () => void;
    }) => {
      if (isDragging && isEditing) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    if (isDragging && isEditing) {
      document.addEventListener("mouseup", handleGlobalMouseUp);
      document.addEventListener("mousemove", handleGlobalMouseMove, {
        passive: false,
      });
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });

      // 전체 페이지 스크롤 방지
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    }

    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);

      // 스크롤 복원
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isDragging, isEditing]);

  // 시간 라벨 표시 (1시간 단위)
  const getTimeLabel = (timeIndex: number) => {
    const hour = Math.floor(timeIndex / 2) + 9;
    return timeIndex % 2 === 0 ? `${hour}시` : "";
  };

  // 수정하기 버튼 클릭 시 편집 모드 시작
  const handleEditStart = () => {
    // 현재 상태를 원본으로 저장
    setOriginalSlots(new Set(selectedSlots));
    setIsEditing(true);
  };

  // 취소하기 버튼 클릭 시 편집 모드 종료 및 원본 상태로 복원
  const handleCancel = () => {
    setIsEditing(false);
    // 원본 상태로 복원
    setSelectedSlots(new Set(originalSlots));

    if (isDragging) {
      setIsDragging(false);
      setDragMode(null);
    }

    // 편집 모드 종료 시 스크롤 복원
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  };

  // 저장하기 버튼 클릭 시 편집 모드 종료 및 변경사항 저장
  const handleSave = () => {
    setIsEditing(false);
    // 현재 상태를 새로운 원본으로 저장
    setOriginalSlots(new Set(selectedSlots));

    if (isDragging) {
      setIsDragging(false);
      setDragMode(null);
    }

    // 편집 모드 종료 시 스크롤 복원
    document.body.style.overflow = "";
    document.body.style.touchAction = "";

    // TODO: 여기에 서버에 저장하는 로직을 추가할 수 있습니다
    console.log("저장된 시간대:", Array.from(selectedSlots));
  };

  const tableHeight = 400;
  const cellHeight = tableHeight / timeSlots.length;

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <button className="text-2xl" onClick={() => navigate("/mypage")}>
          &#x25C0;
        </button>
        <div className="pointer-events-none absolute right-0 left-0 flex flex-1 items-center justify-center">
          <span className="pointer-events-auto text-lg font-bold">
            내 공강 시간표
          </span>
        </div>
        <div style={{ width: 32 }} />
      </div>

      {/* 안내 텍스트 */}
      <div className="mt-2 mb-4 flex flex-col items-center px-4">
        <span className="text-sm font-medium text-gray-800">
          {isEditing
            ? "드래그하여 시간대를 선택하세요!"
            : "수정하기 버튼을 누른 후,"}
        </span>
        <span className="text-sm font-medium text-gray-800">
          {isEditing
            ? "마우스를 떼면 선택이 완료됩니다."
            : "커피챗이 가능한 시간대를 표시해주세요!"}
        </span>
      </div>

      {/* 타임테이블 렌더링 */}
      <div
        ref={containerRef}
        className="flex-1 overflow-x-hidden overflow-y-auto px-4 pb-4"
        style={{
          touchAction: isEditing && isDragging ? "none" : "auto",
          overscrollBehavior: "contain",
        }}
      >
        <div
          ref={tableRef}
          className="w-full"
          style={{
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
            height: `${tableHeight}px`,
          }}
        >
          {/* 헤더 (요일) */}
          <div className="flex">
            <div className="w-12 flex-shrink-0"></div>
            {days.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className="flex-1 border-l border-gray-300 py-2 text-center text-sm font-medium text-gray-700"
                style={{ minWidth: 0 }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 시간대 행들 */}
          {timeSlots.map((time, timeIndex) => (
            <div key={timeIndex} className="flex border-t border-gray-200">
              {/* 시간 라벨 */}
              <div
                className="w-12 flex-shrink-0 py-1 pr-2 text-right text-xs text-gray-600"
                style={{
                  height: `${cellHeight}px`,
                  lineHeight: `${cellHeight}px`,
                }}
              >
                {getTimeLabel(timeIndex)}
              </div>

              {/* 각 요일별 셀 */}
              {days.map((_, dayIndex) => {
                const slotId = getSlotId(dayIndex, timeIndex);
                const isSelected = selectedSlots.has(slotId);

                return (
                  <div
                    key={dayIndex}
                    className={`flex-1 border-l border-gray-300 transition-colors ${
                      isSelected
                        ? "bg-green-400 hover:bg-green-500"
                        : "bg-gray-50 hover:bg-gray-100"
                    } ${isEditing ? "cursor-pointer" : "cursor-default"} ${
                      isDragging ? "cursor-grabbing" : ""
                    }`}
                    style={{
                      minWidth: 0,
                      height: `${cellHeight}px`,
                      touchAction: "none",
                    }}
                    onMouseDown={(e) => handleMouseDown(e, dayIndex, timeIndex)}
                    onMouseEnter={() => handleMouseEnter(dayIndex, timeIndex)}
                    onMouseUp={handleMouseUp}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleMouseDown(e, dayIndex, timeIndex);
                    }}
                    onTouchMove={(e) => {
                      if (!isDragging || !isEditing) return;
                      e.preventDefault();
                      e.stopPropagation();

                      const touch = e.touches[0];
                      const element = document.elementFromPoint(
                        touch.clientX,
                        touch.clientY,
                      );
                      if (
                        element instanceof HTMLElement &&
                        element.dataset.dayIndex &&
                        element.dataset.timeIndex
                      ) {
                        handleMouseEnter(
                          parseInt(element.dataset.dayIndex),
                          parseInt(element.dataset.timeIndex),
                        );
                      }
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleMouseUp();
                    }}
                    data-day-index={dayIndex}
                    data-time-index={timeIndex}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="px-4 py-4">
        {isEditing ? (
          // 편집 모드일 때: 취소하기와 저장하기 버튼
          <div className="flex gap-3">
            <button
              className="flex-1 rounded bg-gray-500 py-3 text-lg font-semibold text-white transition-colors hover:bg-gray-600"
              onClick={handleCancel}
            >
              취소하기
            </button>
            <button
              className="flex-1 rounded bg-blue-500 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-600"
              onClick={handleSave}
            >
              저장하기
            </button>
          </div>
        ) : (
          // 일반 모드일 때: 수정하기 버튼
          <button
            className="w-full rounded bg-gray-200 py-3 text-lg font-semibold text-gray-600 transition-colors hover:bg-gray-300"
            onClick={handleEditStart}
          >
            수정하기
          </button>
        )}
      </div>

      {/* 선택된 시간대 개수 표시 (디버그용) */}
      {/* {selectedSlots.size > 0 && (
        <div className="px-4 pb-2 text-center text-sm text-gray-500">
          선택된 시간대: {selectedSlots.size}개
        </div>
      )} */}
    </div>
  );
};

export default TimeTable;
