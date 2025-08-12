<<<<<<< HEAD
/*
 * author : 앨리스/박은지
=======
// author : 앨리스/박은지
/*
>>>>>>> 552b968a2bb03d7cc903cac53139a56fd74252fb
 * description : 터치 줌 방지
 */

import { useEffect } from "react";

export default function usePreventZoom() {
  useEffect(() => {
    function hasScale(
      event: TouchEvent,
    ): event is TouchEvent & { scale: number } {
      return (
        "scale" in event &&
        typeof (event as Record<string, unknown>).scale === "number"
      );
    }
    const handleTouchMove = (event: TouchEvent) => {
      if (hasScale(event) && event.scale !== 1) event.preventDefault();
    };
    let lastTouchEnd = 0;
    const handleTouchEnd = (event: TouchEvent) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) event.preventDefault();
      lastTouchEnd = now;
    };
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, false);
    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);
}
