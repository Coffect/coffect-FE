import React, { useRef, useState, useCallback, useEffect } from "react";

const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
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

  // 초기값을 별도로 저장하여 useEffect에서 사용
  const initialHour = initial?.hour || 8;
  const initialMinute = initial?.minute || "00";
  const initialAMPM = initial?.ampm || "AM";

  const hourRef = useRef<HTMLUListElement>(null);
  const minuteRef = useRef<HTMLUListElement>(null);
  const ampmRef = useRef<HTMLUListElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 스크롤 핸들러
  const handleScroll = useCallback(
    <T,>(
      ref: React.RefObject<HTMLUListElement | null>,
      setValue: (v: T) => void,
      options: T[],
    ) => {
      if (!ref.current) return;

      const itemHeight = 48;
      const scrollTop = ref.current.scrollTop;
      const centerOffset = 48;
      const adjustedScrollTop = scrollTop + centerOffset;
      const idx = Math.round(adjustedScrollTop / itemHeight) - 2;

      if (idx >= 0 && idx < options.length) {
        setValue(options[idx]);
      }
    },
    [],
  );

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

      scrollTimeoutRef.current = setTimeout(() => {
        if (ref.current) {
          const itemHeight = 48;
          const scrollTop = ref.current.scrollTop;
          const centerOffset = 48;
          const adjustedScrollTop = scrollTop + centerOffset;
          const idx = Math.round(adjustedScrollTop / itemHeight) - 2;

          if (idx >= 0 && idx < options.length) {
            const targetScrollTop = (idx + 2) * itemHeight - centerOffset;
            ref.current.scrollTo({ top: targetScrollTop, behavior: "smooth" });
            setValue(options[idx]);
          }
        }
      }, 150);
    },
    [],
  );

  // 스크롤 리스트 렌더링
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
          WebkitOverflowScrolling: "touch",
        }}
        onScroll={() => handleScroll(ref, setValue, options)}
        onWheel={onWheel}
        onTouchEnd={() => handleScrollEnd(ref, setValue, options)}
      >
        <li className="h-12" />
        <li className="h-12" />
        {options.map((option) => (
          <li
            key={String(option)}
            className={`flex h-12 w-full items-center justify-center text-center font-bold transition-colors ${
              selectedValue === option
                ? "text-2xl text-[var(--gray-90)]"
                : "text-xl text-[var(--gray-30)]"
            }`}
            style={{
              touchAction: "pan-y",
              userSelect: "none",
              minHeight: "48px",
            }}
          >
            {String(option)}
          </li>
        ))}
        <li className="h-12" />
        <li className="h-12" />
      </ul>
    ),
    [handleScroll, handleScrollEnd],
  );

  // 초기 위치 설정
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
            const targetScrollTop = (index + 2) * 48 - 48;
            ref.current.scrollTop = targetScrollTop;
          }
        };

        setInitialPosition(hourRef, initialHour, hours);
        setInitialPosition(minuteRef, initialMinute, minutes);
        setInitialPosition(ampmRef, initialAMPM, ampm);
      }, 100);
    }
  }, [open, initialHour, initialMinute, initialAMPM]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

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
                setTimeout(() => {
                  handleScrollEnd(hourRef, setSelectedHour, hours);
                }, 200);
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
                setTimeout(() => {
                  handleScrollEnd(minuteRef, setSelectedMinute, minutes);
                }, 100);
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
                setTimeout(() => {
                  handleScrollEnd(ampmRef, setSelectedAMPM, ampm);
                }, 100);
              },
            )}
          </div>
        </div>

        <button
          className="mt-3 w-full rounded-xl bg-[var(--gray-80)] py-3 text-lg font-semibold text-white"
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
