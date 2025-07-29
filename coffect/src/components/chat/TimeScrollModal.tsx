// author : 앨리스/박은지
// description : 시간 선택 모달 컴포넌트

import React, { useRef, useState, useCallback } from "react";

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

  // 스크롤 시 중앙값 자동 선택
  const handleScroll = useCallback(
    <T,>(
      ref: React.RefObject<HTMLUListElement | null>,
      setValue: (v: T) => void,
      options: T[],
      isAmpm?: boolean,
    ) => {
      if (!ref.current) return;
      const itemHeight = 48;
      const scrollTop = ref.current.scrollTop;
      const idx = Math.round(scrollTop / itemHeight) - 2;

      console.log("Scroll event:", { scrollTop, idx, options: options.length }); // 디버깅용

      if (isAmpm) {
        const safeIdx = Math.max(0, Math.min(1, idx));
        setValue(options[safeIdx]);
      } else {
        if (idx >= 0 && idx < options.length) {
          setValue(options[idx]);
        }
      }
    },
    [],
  );

  // 스크롤이 멈춘 후 정확한 위치로 스냅하는 함수
  const handleScrollEnd = useCallback(
    <T,>(
      ref: React.RefObject<HTMLUListElement | null>,
      setValue: (v: T) => void,
      options: T[],
      isAmpm?: boolean,
    ) => {
      if (!ref.current) return;
      const itemHeight = 48;
      const scrollTop = ref.current.scrollTop;
      const idx = Math.round(scrollTop / itemHeight) - 2;

      if (isAmpm) {
        const safeIdx = Math.max(0, Math.min(1, idx));
        const targetScrollTop = (safeIdx + 2) * itemHeight;
        ref.current.scrollTo({ top: targetScrollTop, behavior: "smooth" });
        setValue(options[safeIdx]);
      } else {
        if (idx >= 0 && idx < options.length) {
          const targetScrollTop = (idx + 2) * itemHeight;
          ref.current.scrollTo({ top: targetScrollTop, behavior: "smooth" });
          setValue(options[idx]);
        }
      }
    },
    [],
  );

  // 모달이 열릴 때 중앙에 맞춰 스크롤
  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (hourRef.current)
          hourRef.current.scrollTop = hours.indexOf(selectedHour) * 48;
        if (minuteRef.current)
          minuteRef.current.scrollTop = minutes.indexOf(selectedMinute) * 48;
        if (ampmRef.current)
          ampmRef.current.scrollTop = ampm.indexOf(selectedAMPM) * 48;
      }, 0);
    }
  }, [open, selectedHour, selectedMinute, selectedAMPM]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex w-80 flex-col items-center rounded-2xl bg-white p-6">
        <div className="mb-2 flex w-full justify-center gap-4">
          {/* 시간 */}
          <div className="flex flex-1 flex-col items-center">
            <ul
              ref={hourRef}
              className="h-[144px] w-full snap-y snap-mandatory overflow-y-auto scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              onScroll={() => {
                handleScroll(hourRef, setSelectedHour, hours);
              }}
              onTouchEnd={() => {
                setTimeout(() => {
                  handleScrollEnd(hourRef, setSelectedHour, hours);
                }, 100);
              }}
              onWheel={(e) => {
                e.preventDefault();
                setTimeout(
                  () => handleScrollEnd(hourRef, setSelectedHour, hours),
                  100,
                );
              }}
            >
              <li className="h-12" />
              <li className="h-12" />
              {hours.map((h) => (
                <li
                  key={h}
                  className={`flex h-12 w-full cursor-pointer snap-center items-center justify-center text-center font-bold transition-colors ${
                    selectedHour === h
                      ? "text-2xl text-[var(--gray-90)]"
                      : "text-xl text-[var(--gray-30)]"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedHour(h);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    setSelectedHour(h);
                  }}
                >
                  {h}
                </li>
              ))}
              <li className="h-12" />
              <li className="h-12" />
            </ul>
          </div>
          {/* 분 */}
          <div className="flex flex-1 flex-col items-center">
            <ul
              ref={minuteRef}
              className="h-[144px] w-full snap-y snap-mandatory overflow-y-auto scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              onScroll={() =>
                handleScroll(minuteRef, setSelectedMinute, minutes)
              }
              onTouchEnd={() => {
                setTimeout(() => {
                  handleScrollEnd(minuteRef, setSelectedMinute, minutes);
                }, 100);
              }}
              onWheel={(e) => {
                e.preventDefault();
                setTimeout(
                  () => handleScrollEnd(minuteRef, setSelectedMinute, minutes),
                  100,
                );
              }}
            >
              <li className="h-12" />
              <li className="h-12" />
              {minutes.map((m) => (
                <li
                  key={m}
                  className={`flex h-12 w-full cursor-pointer snap-center items-center justify-center text-center font-bold transition-colors ${
                    selectedMinute === m
                      ? "text-2xl text-[var(--gray-90)]"
                      : "text-xl text-[var(--gray-30)]"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedMinute(m);
                  }}
                >
                  {m}
                </li>
              ))}
              <li className="h-12" />
              <li className="h-12" />
            </ul>
          </div>
          {/* AM/PM */}
          <div className="flex flex-1 flex-col items-center">
            <ul
              ref={ampmRef}
              className="h-[144px] w-full snap-y snap-mandatory overflow-y-auto scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              onScroll={() =>
                handleScroll(ampmRef, setSelectedAMPM, ampm, true)
              }
              onTouchEnd={() => {
                setTimeout(() => {
                  handleScrollEnd(ampmRef, setSelectedAMPM, ampm, true);
                }, 100);
              }}
              onWheel={(e) => {
                e.preventDefault();
                setTimeout(
                  () => handleScrollEnd(ampmRef, setSelectedAMPM, ampm, true),
                  100,
                );
              }}
            >
              <li className="h-12" />
              <li className="h-12" />
              {ampm.map((a) => (
                <li
                  key={a}
                  className={`flex h-12 w-full cursor-pointer snap-center items-center justify-center text-center font-bold transition-colors ${
                    selectedAMPM === a
                      ? "text-2xl text-[var(--gray-90)]"
                      : "text-xl text-[var(--gray-30)]"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedAMPM(a);
                  }}
                >
                  {a}
                </li>
              ))}
              <li className="h-12" />
              <li className="h-12" />
            </ul>
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
