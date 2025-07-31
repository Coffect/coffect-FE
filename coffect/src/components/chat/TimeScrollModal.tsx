import React, { useRef, useState, useCallback, useEffect } from "react";

const hours = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0"),
);
const ampm = ["AM", "PM"];

interface TimeScrollModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
  initial?: { hour?: number; minute?: string; ampm?: string };
}

export default function TimeScrollModal({
  open,
  onClose,
  onSelect,
  initial,
}: TimeScrollModalProps) {
  const [selectedHour, setSelectedHour] = useState<number>(initial?.hour || 8);
  const [selectedMinute, setSelectedMinute] = useState<string>(
    initial?.minute || "00",
  );
  const [selectedAMPM, setSelectedAMPM] = useState<string>(
    initial?.ampm || "AM",
  );

  const hourRef = useRef<HTMLUListElement>(null);
  const minuteRef = useRef<HTMLUListElement>(null);
  const ampmRef = useRef<HTMLUListElement>(null);

  // 스크롤 중인지 추적
  const isScrollingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollThrottleRef = useRef<NodeJS.Timeout | null>(null);

  // throttled 스크롤 핸들러
  const handleScroll = useCallback(
    <T,>(
      ref: React.RefObject<HTMLUListElement | null>,
      setValue: (v: T) => void,
      options: T[],
    ) => {
      if (!ref.current) return;

      // 스크롤 중일 때는 throttling 적용
      if (isScrollingRef.current) {
        if (scrollThrottleRef.current) {
          clearTimeout(scrollThrottleRef.current);
        }

        scrollThrottleRef.current = setTimeout(() => {
          const itemHeight = 48;
          const scrollTop = ref.current!.scrollTop;
          const centerOffset = 60;
          const adjustedScrollTop = scrollTop + centerOffset;
          const idx = Math.round(adjustedScrollTop / itemHeight) - 2;

          if (idx >= 0 && idx < options.length) {
            setValue(options[idx]);
          }
        }, 50); // 50ms throttling
        return;
      }

      // 스크롤이 끝났을 때는 즉시 업데이트
      const itemHeight = 48;
      const scrollTop = ref.current.scrollTop;
      const centerOffset = 60;
      const adjustedScrollTop = scrollTop + centerOffset;
      const idx = Math.round(adjustedScrollTop / itemHeight) - 2;

      if (idx >= 0 && idx < options.length) {
        setValue(options[idx]);
      }
    },
    [],
  );

  // 스크롤 시작 핸들러
  const handleScrollStart = useCallback(() => {
    isScrollingRef.current = true;
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
  }, []);

  // 스크롤 종료 핸들러
  const handleScrollEnd = useCallback(
    <T,>(
      ref: React.RefObject<HTMLUListElement | null>,
      setValue: (v: T) => void,
      options: T[],
    ) => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      if (scrollThrottleRef.current) {
        clearTimeout(scrollThrottleRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
        // 스크롤이 끝난 후 현재 위치에서 가장 가까운 값으로 스냅
        if (ref.current) {
          const itemHeight = 48;
          const scrollTop = ref.current.scrollTop;
          const centerOffset = 60;
          const adjustedScrollTop = scrollTop + centerOffset;
          const idx = Math.round(adjustedScrollTop / itemHeight) - 2;

          if (idx >= 0 && idx < options.length) {
            const targetScrollTop = (idx + 2) * itemHeight - centerOffset;
            ref.current.scrollTo({ top: targetScrollTop, behavior: "smooth" });
            setValue(options[idx]);
          }
        }
      }, 100); // 스크롤 종료 감지 시간을 줄임
    },
    [],
  );

  // 공통 이동 함수
  const moveToValue = useCallback(
    <T,>(
      ref: React.RefObject<HTMLUListElement | null>,
      setValue: (v: T) => void,
      options: T[],
      targetValue: T,
    ) => {
      if (!ref.current) return;
      const itemHeight = 48;
      const centerOffset = 60;
      const targetIndex = options.indexOf(targetValue);

      if (targetIndex !== -1) {
        const targetScrollTop = (targetIndex + 2) * itemHeight - centerOffset;
        ref.current.scrollTo({ top: targetScrollTop, behavior: "smooth" });
        setValue(targetValue);
      }
    },
    [],
  );

  // 공통 터치 핸들러
  const handleTouch = useCallback(
    <T,>(
      e: React.TouchEvent,
      ref: React.RefObject<HTMLUListElement | null>,
      setValue: (v: T) => void,
      options: T[],
      targetValue: T,
    ) => {
      e.preventDefault();
      e.stopPropagation();

      setValue(targetValue);
      moveToValue(ref, setValue, options, targetValue);
    },
    [moveToValue],
  );

  // 공통 스크롤 리스트 렌더링 함수
  const renderScrollList = useCallback(
    <T,>(
      ref: React.RefObject<HTMLUListElement | null>,
      options: T[],
      selectedValue: T,
      setValue: (v: T) => void,
      onWheel: (e: React.WheelEvent) => void,
    ) => (
      <ul
        ref={ref}
        className="h-[144px] w-full overflow-y-auto scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          touchAction: "pan-y",
        }}
        onScroll={() => handleScroll(ref, setValue, options)}
        onScrollCapture={handleScrollStart}
        onWheel={onWheel}
        onTouchStart={handleScrollStart}
        onTouchEnd={() => handleScrollEnd(ref, setValue, options)}
      >
        <li className="h-12" />
        <li className="h-12" />
        {options.map((option) => (
          <li
            key={String(option)}
            className={`flex h-12 w-full cursor-pointer items-center justify-center text-center font-bold transition-colors ${
              selectedValue === option
                ? "text-2xl text-[var(--gray-90)]"
                : "text-xl text-[var(--gray-30)]"
            }`}
            style={{ touchAction: "manipulation" }}
            onClick={() => moveToValue(ref, setValue, options, option)}
            onTouchStart={(e) => handleTouch(e, ref, setValue, options, option)}
          >
            {String(option)}
          </li>
        ))}
        <li className="h-12" />
        <li className="h-12" />
      </ul>
    ),
    [
      handleScroll,
      handleScrollStart,
      handleScrollEnd,
      moveToValue,
      handleTouch,
    ],
  );

  // 모달이 열릴 때 초기 위치 설정
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        const setInitialPosition = (
          ref: React.RefObject<HTMLUListElement | null>,
          selectedValue: number | string,
          options: (number | string)[],
        ) => {
          if (ref.current) {
            const index = options.indexOf(selectedValue);
            const targetScrollTop = (index + 2) * 48 - 60;
            ref.current.scrollTop = targetScrollTop;
          }
        };

        setInitialPosition(hourRef, selectedHour, hours);
        setInitialPosition(minuteRef, selectedMinute, minutes);
        setInitialPosition(ampmRef, selectedAMPM, ampm);
      }, 100);
    }
  }, [open, selectedHour, selectedMinute, selectedAMPM]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex w-80 flex-col items-center rounded-2xl bg-white p-6">
        <div className="mb-2 flex w-full justify-center gap-4">
          {/* 시간 */}
          <div className="relative flex flex-1 flex-col items-center">
            {renderScrollList(
              hourRef,
              hours,
              selectedHour,
              setSelectedHour,
              (e) => {
                e.preventDefault();
                handleScrollStart();
                setTimeout(() => {
                  handleScrollEnd(hourRef, setSelectedHour, hours);
                }, 50);
              },
            )}
          </div>

          {/* 분 */}
          <div className="relative flex flex-1 flex-col items-center">
            {renderScrollList(
              minuteRef,
              minutes,
              selectedMinute,
              setSelectedMinute,
              (e) => {
                e.preventDefault();
                handleScrollStart();
                setTimeout(() => {
                  handleScrollEnd(minuteRef, setSelectedMinute, minutes);
                }, 50);
              },
            )}
          </div>

          {/* AM/PM */}
          <div className="relative flex flex-1 flex-col items-center">
            {renderScrollList(
              ampmRef,
              ampm,
              selectedAMPM,
              setSelectedAMPM,
              (e) => {
                e.preventDefault();
                handleScrollStart();
                setTimeout(() => {
                  handleScrollEnd(ampmRef, setSelectedAMPM, ampm);
                }, 50);
              },
            )}
          </div>
        </div>

        <button
          className="mt-8 w-full rounded-xl bg-[var(--gray-80)] py-3 text-lg font-semibold text-white"
          onClick={() => {
            onSelect(`${selectedHour}:${selectedMinute} ${selectedAMPM}`);
            onClose();
          }}
        >
          완료
        </button>
      </div>
    </div>
  );
}
