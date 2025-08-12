<<<<<<< HEAD
/*
 * author : 앨리스/박은지
=======
// author : 앨리스/박은지
/*
>>>>>>> 552b968a2bb03d7cc903cac53139a56fd74252fb
 * description : 최신 메세지로 자동 스크롤
 */

import { useEffect } from "react";
import type { RefObject } from "react";

export default function useAutoScroll(
  ref: RefObject<HTMLDivElement | null>,
  messages: unknown[],
) {
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [ref, messages]);
}
