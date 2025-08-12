/*
  author      : 이희선
  description : 입력 값의 변경을 지연시켜 debounce된 값을 반환하는 커스텀 훅입니다.
                - value: 입력 값
                - delay: 지연 시간 (ms)
                - 변경 시점부터 delay 시간 동안 입력이 없으면 해당 값을 반환(api 요청 횟수 줄이기)
*/
import { useEffect, useState } from "react";

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
};
