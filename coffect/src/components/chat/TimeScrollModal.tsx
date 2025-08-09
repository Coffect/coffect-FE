/*
 * author : 앨리스/박은지
 * description : 시간 선택 모달 컴포넌트
 */

import React, { useRef, useState } from "react";

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
  function handleScroll<T>(
    ref: React.RefObject<HTMLUListElement>,
    setValue: (v: T) => void,
    options: T[],
    isAmpm?: boolean,
  ) {
    if (!ref.current) return;
    const itemHeight = 48;
    const scrollTop = ref.current.scrollTop;
    const idx = Math.round(scrollTop / itemHeight) - 2; // 더미 li 2개 보정
    if (isAmpm) {
      const safeIdx = Math.max(0, Math.min(1, idx));
      setValue(options[safeIdx]);
    } else {
      if (idx < 0 || idx >= options.length) return;
      setValue(options[idx]);
    }
  }

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
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex w-80 flex-col items-center rounded-2xl bg-white p-6">
        <div className="mb-2 flex w-full justify-center gap-4">
          {/* 시간 */}
          <div className="flex flex-1 flex-col items-center">
            <ul
              ref={hourRef}
              className="h-[144px] w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth"
              style={{ scrollbarWidth: "none" }}
              onScroll={() =>
                handleScroll<number>(
                  hourRef as React.RefObject<HTMLUListElement>,
                  setSelectedHour,
                  hours,
                )
              }
            >
              <li className="h-12" />
              <li className="h-12" />
              {hours.map((h) => (
                <li
                  key={h}
                  className={`flex h-12 w-full snap-center items-center justify-center text-center text-2xl font-bold transition-colors ${selectedHour === h ? "text-[var(--gray-90)]" : "text-[var(--gray-30)]"}`}
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
              className="h-[144px] w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth"
              style={{ scrollbarWidth: "none" }}
              onScroll={() =>
                handleScroll<string>(
                  minuteRef as React.RefObject<HTMLUListElement>,
                  setSelectedMinute,
                  minutes,
                )
              }
            >
              <li className="h-12" />
              <li className="h-12" />
              {minutes.map((m) => (
                <li
                  key={m}
                  className={`flex h-12 w-full snap-center items-center justify-center text-center text-2xl font-bold transition-colors ${selectedMinute === m ? "text-[var(--gray-90)]" : "text-[var(--gray-30)]"}`}
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
              className="h-[144px] w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth"
              style={{ scrollbarWidth: "none" }}
              onScroll={() =>
                handleScroll<string>(
                  ampmRef as React.RefObject<HTMLUListElement>,
                  setSelectedAMPM,
                  ampm,
                  true,
                )
              }
            >
              <li className="h-12" />
              <li className="h-12" />
              {ampm.map((a) => (
                <li
                  key={a}
                  className={`flex h-12 w-full snap-center items-center justify-center text-center text-2xl font-bold transition-colors ${selectedAMPM === a ? "text-[var(--gray-90)]" : "text-[var(--gray-30)]"}`}
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
          className="mt-4 w-full rounded-xl bg-[var(--gray-80)] py-3 text-lg font-semibold text-white"
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
