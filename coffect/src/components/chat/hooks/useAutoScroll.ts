// author : 앨리스/박은지
// description : 최신 메세지로 자동 스크롤

import { useEffect } from "react";
import type { RefObject } from "react";

export default function useAutoScroll(
  ref: RefObject<HTMLDivElement | null>,
  messages: unknown[],
  shouldScroll: boolean = true,
) {
  useEffect(() => {
    if (shouldScroll && messages.length > 0) {
      // 약간의 지연을 두어 DOM 업데이트 완료 후 스크롤
      const timer = setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [ref, messages, shouldScroll]);
}
